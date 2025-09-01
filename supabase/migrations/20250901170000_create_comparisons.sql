-- Créer la table des comparaisons de devis
CREATE TABLE IF NOT EXISTS comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  files_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_organization_id ON comparisons(organization_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_created_at ON comparisons(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- Politique pour voir ses propres comparaisons et celles de son organisation
CREATE POLICY "Users can view org comparisons" ON comparisons
  FOR SELECT USING (
    auth.uid() = user_id OR 
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Politique pour créer des comparaisons
CREATE POLICY "Users can create comparisons" ON comparisons
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Politique pour mettre à jour ses propres comparaisons
CREATE POLICY "Users can update own comparisons" ON comparisons
  FOR UPDATE USING (auth.uid() = user_id);

-- Politique pour supprimer ses propres comparaisons
CREATE POLICY "Users can delete own comparisons" ON comparisons
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comparisons_updated_at BEFORE UPDATE ON comparisons
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();