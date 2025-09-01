-- Migration pour ajouter copropriete_id à la table contracts
-- Date: 2025-09-01 17:00:00

-- Ajouter la colonne copropriete_id à la table contracts
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS copropriete_id UUID REFERENCES coproprietes(id) ON DELETE SET NULL;

-- Ajouter un index pour optimiser les requêtes par copropriété
CREATE INDEX IF NOT EXISTS idx_contracts_copropriete_id ON contracts(copropriete_id);

-- Mettre à jour les politiques RLS si nécessaire
-- (Les politiques existantes devraient déjà couvrir ce cas via organization_id)