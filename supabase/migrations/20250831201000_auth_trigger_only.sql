-- Fonction pour créer automatiquement une organisation et un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  org_slug TEXT;
BEGIN
  -- Créer le slug de l'organisation
  org_slug := LOWER(REPLACE(NEW.raw_user_meta_data->>'company_name', ' ', '-'));
  org_slug := REGEXP_REPLACE(org_slug, '[^a-z0-9-]', '', 'g');
  org_slug := REGEXP_REPLACE(org_slug, '-+', '-', 'g');
  org_slug := TRIM(BOTH '-' FROM org_slug);
  
  -- S'assurer que le slug est unique
  IF EXISTS (SELECT 1 FROM organizations WHERE slug = org_slug) THEN
    org_slug := org_slug || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
  END IF;
  
  -- Créer l'organisation
  INSERT INTO public.organizations (name, slug, plan, max_devis)
  VALUES (
    NEW.raw_user_meta_data->>'company_name',
    org_slug,
    'free',
    3
  )
  RETURNING id INTO new_org_id;
  
  -- Créer le profil utilisateur
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    organization_id, 
    role
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    new_org_id,
    'owner'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();