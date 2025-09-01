-- Ajouter la colonne copropriete_id à la table reports
-- Date: 2025-09-01 18:00:00

ALTER TABLE reports 
ADD COLUMN copropriete_id uuid REFERENCES coproprietes(id) ON DELETE SET NULL;

-- Créer un index pour optimiser les requêtes filtrées par copropriété
CREATE INDEX IF NOT EXISTS idx_reports_copropriete_id ON reports(copropriete_id);