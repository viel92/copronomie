-- Table pour les comparaisons de devis (nouveau système)
CREATE TABLE IF NOT EXISTS public.devis_comparisons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    nombre_devis INTEGER NOT NULL,
    noms_fichiers TEXT[] NOT NULL,
    synthese_executive JSONB NOT NULL,
    comparaison_detaillee JSONB NOT NULL,
    cahier_des_charges JSONB NOT NULL,
    analyse_ecarts JSONB NOT NULL,
    recommandations_negociation TEXT[] NOT NULL,
    raw_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_devis_comparisons_user_id ON public.devis_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_devis_comparisons_created_at ON public.devis_comparisons(created_at);

-- RLS
ALTER TABLE public.devis_comparisons ENABLE ROW LEVEL SECURITY;

-- Politique RLS : utilisateurs peuvent voir leurs propres comparaisons
DROP POLICY IF EXISTS "Users can view their own comparisons" ON public.devis_comparisons;
CREATE POLICY "Users can view their own comparisons" ON public.devis_comparisons
    FOR SELECT USING (auth.uid() = user_id);

-- Politique RLS : utilisateurs peuvent créer leurs comparaisons
DROP POLICY IF EXISTS "Users can create comparisons" ON public.devis_comparisons;
CREATE POLICY "Users can create comparisons" ON public.devis_comparisons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique RLS : utilisateurs peuvent supprimer leurs comparaisons
DROP POLICY IF EXISTS "Users can delete their own comparisons" ON public.devis_comparisons;
CREATE POLICY "Users can delete their own comparisons" ON public.devis_comparisons
    FOR DELETE USING (auth.uid() = user_id);