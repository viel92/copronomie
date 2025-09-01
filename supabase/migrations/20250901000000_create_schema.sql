-- Migration complète du schéma Copronomie SaaS
-- Créer toutes les tables nécessaires pour l'authentification et la gestion des copropriétés

-- Table des organisations
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free',
    max_devis INTEGER DEFAULT 3,
    settings JSONB DEFAULT '{}'::jsonb,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des copropriétés
CREATE TABLE IF NOT EXISTS public.coproprietes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    nb_lots INTEGER,
    budget_annual NUMERIC,
    syndic_name TEXT,
    syndic_contact TEXT,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des consultations
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    copropriete_id UUID REFERENCES public.coproprietes(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    deadline DATE,
    budget_max NUMERIC,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    original_name TEXT,
    file_path TEXT,
    url TEXT,
    type TEXT,
    size INTEGER,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des analyses de devis
CREATE TABLE IF NOT EXISTS public.devis_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    entreprise TEXT,
    montant_total NUMERIC,
    montant_ht NUMERIC,
    montant_tva NUMERIC,
    taux_tva NUMERIC,
    delai_realisation TEXT,
    garantie TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    points_positifs TEXT[] DEFAULT ARRAY[]::text[],
    points_negatifs TEXT[] DEFAULT ARRAY[]::text[],
    note_globale INTEGER,
    recommandations TEXT[] DEFAULT ARRAY[]::text[],
    raw_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des logs d'utilisation
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    cost_tokens INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_consultations_organization_id ON public.consultations(organization_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_by ON public.consultations(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_devis_analyses_user_id ON public.devis_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_organization_id ON public.usage_logs(organization_id);

-- Activer RLS (Row Level Security) sur toutes les tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coproprietes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devis_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS basiques (utilisateurs peuvent voir leurs propres données)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their organization data" ON public.organizations;
CREATE POLICY "Users can view their organization data" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organization_id = organizations.id
        )
    );

-- Fonction de mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour les timestamps
DROP TRIGGER IF EXISTS handle_updated_at ON public.organizations;
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON public.organizations 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.coproprietes;
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON public.coproprietes 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.consultations;
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON public.consultations 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();