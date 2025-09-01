interface Company {
  id: string
  name: string
  siret?: string
  email?: string
  phone?: string
  address?: string
  specialty: string
  zone?: string
  rating: number
  reviews_count: number
  certifications: string[]
  insurance_company?: string
  insurance_expiry?: string
  verified: boolean
  projects_count: number
  average_amount?: number
  notes?: string
  created_at: string
  updated_at: string
}

interface CompaniesFilters {
  search?: string
  specialty?: string
  zone?: string
  verified?: boolean
  minRating?: number
  sortBy?: string
}

interface CreateCompanyData {
  name: string
  siret?: string
  email?: string
  phone?: string
  address?: string
  specialty: string
  zone?: string
  certifications?: string[]
  insurance_company?: string
  insurance_expiry?: string
  notes?: string
}

class CompaniesService {
  private baseUrl = '/api/companies'

  async getCompanies(filters: CompaniesFilters = {}): Promise<Company[]> {
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
      return data.companies || []
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error)
      throw error
    }
  }

  async createCompany(companyData: CreateCompanyData): Promise<Company> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.company
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error)
      throw error
    }
  }

  async updateCompany(id: string, companyData: Partial<CreateCompanyData>): Promise<Company> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.company
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error)
      throw error
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entreprise:', error)
      throw error
    }
  }

  // Méthodes utilitaires
  getSpecialties(): string[] {
    return [
      'plomberie',
      'electricite',
      'chauffage',
      'nettoyage',
      'securite',
      'jardinage',
      'peinture',
      'renovation',
      'assurance',
      'comptabilite',
      'juridique',
      'autre'
    ]
  }

  getZones(): string[] {
    return [
      'Île-de-France',
      'Auvergne-Rhône-Alpes',
      'Nouvelle-Aquitaine',
      'Occitanie',
      'Hauts-de-France',
      'Grand Est',
      'Provence-Alpes-Côte d\'Azur',
      'Pays de la Loire',
      'Bretagne',
      'Normandie',
      'Bourgogne-Franche-Comté',
      'Centre-Val de Loire',
      'Corse'
    ]
  }
}

export const companiesService = new CompaniesService()
export type { Company, CompaniesFilters, CreateCompanyData }