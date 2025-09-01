-- Migration pour créer les tables companies, contracts et reports
-- Date: 2025-09-01 16:00:00
-- Version: Production-ready tables pour remplacer les données mockées

-- Table des entreprises/prestataires
CREATE TABLE IF NOT EXISTS companies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  siret text,
  email text,
  phone text,
  address text,
  specialty text NOT NULL, -- 'plomberie', 'electricite', 'nettoyage', etc.
  zone text, -- Zone géographique d'intervention
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count integer DEFAULT 0,
  certifications text[], -- Tableau des certifications
  insurance_company text,
  insurance_expiry date,
  verified boolean DEFAULT false,
  projects_count integer DEFAULT 0,
  average_amount numeric(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des contrats
CREATE TABLE IF NOT EXISTS contracts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  name text NOT NULL,
  type text NOT NULL, -- 'assurance', 'maintenance', 'nettoyage', etc.
  amount numeric(10,2) NOT NULL,
  period text NOT NULL, -- 'mensuel', 'annuel', etc.
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
  auto_renewal boolean DEFAULT false,
  last_increase_date date,
  last_increase_percent numeric(5,2),
  alert_days integer DEFAULT 60, -- Nombre de jours avant expiration pour l'alerte
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des rapports générés
CREATE TABLE IF NOT EXISTS reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL, -- 'ag', 'financier', 'technique', etc.
  date_range_start date,
  date_range_end date,
  generated_at timestamptz DEFAULT now(),
  generated_by uuid REFERENCES profiles(id),
  file_url text, -- URL du fichier généré (Supabase Storage)
  file_size bigint,
  downloads_count integer DEFAULT 0,
  parameters jsonb, -- Paramètres utilisés pour générer le rapport
  status text DEFAULT 'generated' CHECK (status IN ('generating', 'generated', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Indexes pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_companies_organization_id ON companies(organization_id);
CREATE INDEX IF NOT EXISTS idx_companies_specialty ON companies(specialty);
CREATE INDEX IF NOT EXISTS idx_companies_zone ON companies(zone);
CREATE INDEX IF NOT EXISTS idx_companies_verified ON companies(verified);

CREATE INDEX IF NOT EXISTS idx_contracts_organization_id ON contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contracts_company_id ON contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_contracts_end_date ON contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

CREATE INDEX IF NOT EXISTS idx_reports_organization_id ON reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);

-- RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies pour companies
CREATE POLICY "Users can view org companies" ON companies
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert org companies" ON companies
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update org companies" ON companies
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete org companies" ON companies
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies pour contracts  
CREATE POLICY "Users can view org contracts" ON contracts
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert org contracts" ON contracts
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update org contracts" ON contracts
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete org contracts" ON contracts
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies pour reports
CREATE POLICY "Users can view org reports" ON reports
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert org reports" ON reports
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update org reports" ON reports
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete org reports" ON reports
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données de test pour développement
INSERT INTO companies (organization_id, name, siret, email, phone, specialty, zone, rating, reviews_count, certifications, verified, projects_count, average_amount) 
SELECT 
  org.id,
  'TechnoClean Pro',
  '12345678901234',
  'contact@technoclean.fr',
  '01.23.45.67.89',
  'nettoyage',
  'Île-de-France',
  4.2,
  45,
  ARRAY['ISO 9001', 'Qualibat'],
  true,
  127,
  8500.00
FROM organizations org LIMIT 1;

INSERT INTO companies (organization_id, name, siret, email, phone, specialty, zone, rating, reviews_count, certifications, verified, projects_count, average_amount)
SELECT 
  org.id,
  'SecuCam Systems',
  '98765432109876',
  'devis@secucam.com',
  '01.98.76.54.32',
  'securite',
  'Île-de-France',
  4.7,
  89,
  ARRAY['APSAD', 'Qualibat'],
  true,
  234,
  15000.00
FROM organizations org LIMIT 1;

INSERT INTO contracts (organization_id, name, type, amount, period, start_date, end_date, company_id)
SELECT 
  org.id,
  'Assurance multirisques habitation',
  'assurance',
  15400.00,
  'annuel',
  '2024-01-01',
  '2024-12-31',
  (SELECT id FROM companies LIMIT 1)
FROM organizations org LIMIT 1;

INSERT INTO contracts (organization_id, name, type, amount, period, start_date, end_date)
SELECT 
  org.id,
  'Maintenance chauffage collectif',
  'maintenance',
  8900.00,
  'annuel',
  '2024-03-01',
  '2025-02-28'
FROM organizations org LIMIT 1;