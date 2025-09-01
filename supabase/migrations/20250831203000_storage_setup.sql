-- Configuration du Storage pour les devis PDF

-- Créer le bucket pour les devis (si pas déjà existant)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'devis-documents',
  'devis-documents',
  false,
  10485760, -- 10MB limite
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Politiques de sécurité pour le bucket
-- Permettre aux utilisateurs authentifiés de voir leurs propres fichiers d'organisation
DROP POLICY IF EXISTS "Users can view org documents" ON storage.objects;
CREATE POLICY "Users can view org documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'devis-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Permettre aux utilisateurs d'uploader dans leur dossier d'organisation
DROP POLICY IF EXISTS "Users can upload to org folder" ON storage.objects;
CREATE POLICY "Users can upload to org folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'devis-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Permettre aux utilisateurs de supprimer leurs propres fichiers
DROP POLICY IF EXISTS "Users can delete own org documents" ON storage.objects;
CREATE POLICY "Users can delete own org documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'devis-documents' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Fonction helper pour générer le chemin de stockage
CREATE OR REPLACE FUNCTION public.generate_storage_path(
  org_id UUID,
  file_name TEXT,
  entity_type TEXT DEFAULT 'devis'
)
RETURNS TEXT AS $$
BEGIN
  RETURN org_id::text || '/' || entity_type || '/' || 
         EXTRACT(YEAR FROM NOW()) || '/' ||
         EXTRACT(MONTH FROM NOW()) || '/' ||
         gen_random_uuid() || '-' || file_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Donner les permissions
GRANT EXECUTE ON FUNCTION public.generate_storage_path TO authenticated;