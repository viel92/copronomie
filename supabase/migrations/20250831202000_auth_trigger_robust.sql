-- Supprimer l'ancien trigger et fonction
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Fonction robuste pour créer automatiquement une organisation et un profil
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  org_slug TEXT;
  company_name_value TEXT;
  first_name_value TEXT;
  last_name_value TEXT;
BEGIN
  -- Récupérer les valeurs des metadata
  company_name_value := COALESCE(NEW.raw_user_meta_data->>'company_name', 'Organisation');
  first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- Créer le slug de l'organisation de manière sécurisée
  org_slug := LOWER(TRIM(company_name_value));
  org_slug := REGEXP_REPLACE(org_slug, '[^a-z0-9\s]', '', 'g');
  org_slug := REGEXP_REPLACE(org_slug, '\s+', '-', 'g');
  org_slug := REGEXP_REPLACE(org_slug, '-+', '-', 'g');
  org_slug := TRIM(BOTH '-' FROM org_slug);
  
  -- Fallback si le slug est vide
  IF org_slug = '' OR org_slug IS NULL THEN
    org_slug := 'org-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
  END IF;
  
  -- S'assurer que le slug est unique
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = org_slug) LOOP
    org_slug := org_slug || '-' || (RANDOM() * 1000)::INTEGER;
  END LOOP;
  
  -- Créer l'organisation (bypass RLS avec SECURITY DEFINER)
  INSERT INTO public.organizations (name, slug, plan, max_devis)
  VALUES (
    company_name_value,
    org_slug,
    'free',
    3
  )
  RETURNING id INTO new_org_id;
  
  -- Créer le profil utilisateur (bypass RLS avec SECURITY DEFINER)
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    organization_id, 
    role
  )
  VALUES (
    NEW.id,
    NULLIF(first_name_value, ''),
    NULLIF(last_name_value, ''),
    new_org_id,
    'owner'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne pas empêcher la création de l'utilisateur
    RAISE LOG 'Erreur dans handle_new_user pour user %: %', NEW.id, SQLERRM;
    -- En cas d'erreur, on retourne quand même NEW pour permettre la création de l'utilisateur
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;