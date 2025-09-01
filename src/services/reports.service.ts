interface Report {
  id: string
  name: string
  type: string
  date_range_start?: string
  date_range_end?: string
  generated_at: string
  generated_by: string
  file_url?: string
  file_size?: number
  downloads_count: number
  parameters?: any
  status: string
  created_at: string
  generated_by_profile?: {
    first_name: string
    last_name: string
  }
}

interface ReportsFilters {
  type?: string
  limit?: number
  copropriete_id?: string
}

interface CreateReportData {
  name: string
  type: string
  date_range_start?: string
  date_range_end?: string
  parameters?: any
  copropriete_id?: string
}

class ReportsService {
  private baseUrl = '/api/reports'

  async getReports(filters: ReportsFilters = {}): Promise<Report[]> {
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.reports || []
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error)
      throw error
    }
  }

  async createReport(reportData: CreateReportData): Promise<Report> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.report
    } catch (error) {
      console.error('Erreur lors de la création du rapport:', error)
      throw error
    }
  }

  async downloadReport(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/download`)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      // TODO: Implémenter le téléchargement du fichier
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rapport-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erreur lors du téléchargement du rapport:', error)
      throw error
    }
  }

  // Méthodes utilitaires
  getReportTypes(): Array<{ id: string; name: string; description: string; icon: string }> {
    return [
      {
        id: 'ag',
        name: 'Rapport AG',
        description: 'Rapport pour assemblée générale',
        icon: 'FileText'
      },
      {
        id: 'financier',
        name: 'Rapport Financier',
        description: 'Bilan financier et comptes',
        icon: 'BarChart3'
      },
      {
        id: 'technique',
        name: 'Rapport Technique',
        description: 'État technique et travaux',
        icon: 'Building'
      },
      {
        id: 'consultations',
        name: 'Synthèse Consultations',
        description: 'Résumé des consultations',
        icon: 'FileText'
      },
      {
        id: 'contrats',
        name: 'Suivi Contrats',
        description: 'État des contrats en cours',
        icon: 'Calendar'
      },
      {
        id: 'charges',
        name: 'Analyse Charges',
        description: 'Évolution et répartition des charges',
        icon: 'TrendingUp'
      }
    ]
  }

  getDateRanges(): Array<{ value: string; label: string }> {
    return [
      { value: 'last-month', label: 'Dernier mois' },
      { value: 'last-quarter', label: 'Dernier trimestre' },
      { value: 'last-semester', label: 'Dernier semestre' },
      { value: 'last-year', label: 'Dernière année' },
      { value: 'current-year', label: 'Année en cours' },
      { value: 'custom', label: 'Personnalisé' }
    ]
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'N/A'
    
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  getGeneratorName(profile?: { first_name: string; last_name: string }): string {
    if (!profile) return 'Système'
    return `${profile.first_name} ${profile.last_name}`
  }
}

export const reportsService = new ReportsService()
export type { Report, ReportsFilters, CreateReportData }