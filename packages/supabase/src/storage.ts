import type { SupabaseClient } from './client'

export class StorageService {
  constructor(private supabase: SupabaseClient) {}

  // Bucket pour les devis PDF
  private readonly DEVIS_BUCKET = 'devis'
  // Bucket pour les rapports générés
  private readonly REPORTS_BUCKET = 'reports'

  /**
   * Upload un fichier devis PDF
   */
  async uploadDevis(file: File, userId: string, comparisonId?: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = comparisonId 
      ? `${userId}/${comparisonId}/${Date.now()}.${fileExt}`
      : `${userId}/${Date.now()}.${fileExt}`

    const { data, error } = await this.supabase.storage
      .from(this.DEVIS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    return data.path
  }

  /**
   * Upload un rapport PDF généré
   */
  async uploadReport(reportBuffer: Buffer, userId: string, comparisonId: string): Promise<string> {
    const fileName = `${userId}/${comparisonId}/report_${Date.now()}.pdf`

    const { data, error } = await this.supabase.storage
      .from(this.REPORTS_BUCKET)
      .upload(fileName, reportBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf'
      })

    if (error) throw error

    return data.path
  }

  /**
   * Obtenir l'URL publique d'un fichier
   */
  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Obtenir une URL signée (accès temporaire)
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) throw error

    return data.signedUrl
  }

  /**
   * Supprimer un fichier
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  /**
   * Supprimer tous les fichiers d'une comparaison
   */
  async deleteComparisonFiles(userId: string, comparisonId: string): Promise<void> {
    // Supprimer les devis
    const { data: devisFiles } = await this.supabase.storage
      .from(this.DEVIS_BUCKET)
      .list(`${userId}/${comparisonId}`)

    if (devisFiles && devisFiles.length > 0) {
      const devisPaths = devisFiles.map(file => `${userId}/${comparisonId}/${file.name}`)
      await this.supabase.storage
        .from(this.DEVIS_BUCKET)
        .remove(devisPaths)
    }

    // Supprimer les rapports
    const { data: reportFiles } = await this.supabase.storage
      .from(this.REPORTS_BUCKET)
      .list(`${userId}/${comparisonId}`)

    if (reportFiles && reportFiles.length > 0) {
      const reportPaths = reportFiles.map(file => `${userId}/${comparisonId}/${file.name}`)
      await this.supabase.storage
        .from(this.REPORTS_BUCKET)
        .remove(reportPaths)
    }
  }

  /**
   * Lister les fichiers d'une comparaison
   */
  async listComparisonFiles(userId: string, comparisonId: string): Promise<{ devis: any[], reports: any[] }> {
    const { data: devisFiles, error: devisError } = await this.supabase.storage
      .from(this.DEVIS_BUCKET)
      .list(`${userId}/${comparisonId}`)

    if (devisError) throw devisError

    const { data: reportFiles, error: reportError } = await this.supabase.storage
      .from(this.REPORTS_BUCKET)
      .list(`${userId}/${comparisonId}`)

    if (reportError) throw reportError

    return {
      devis: devisFiles || [],
      reports: reportFiles || []
    }
  }

  /**
   * Obtenir les informations d'un fichier
   */
  async getFileInfo(bucket: string, path: string): Promise<any> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/'), {
        search: path.split('/').pop()
      })

    if (error) throw error

    return data?.[0] || null
  }

  /**
   * Vérifier si un fichier existe
   */
  async fileExists(bucket: string, path: string): Promise<boolean> {
    try {
      const fileInfo = await this.getFileInfo(bucket, path)
      return !!fileInfo
    } catch {
      return false
    }
  }
}