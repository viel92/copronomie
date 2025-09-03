interface Contract {
  id: string
  name: string
  type: string
  company_id?: string
  copropriete_id?: string
  amount: number
  period: string
  start_date: string
  end_date: string
  status: string
  auto_renewal: boolean
  last_increase_date?: string
  last_increase_percent?: number
  alert_days: number
  notes?: string
  created_at: string
  updated_at: string
  company?: {
    name: string
    email?: string
    phone?: string
  }
  // Champs calculés côté client
  daysLeft?: number
  alertLevel?: string
}

interface ContractsFilters {
  search?: string
  filter?: string
  copropriete_id?: string
}

interface CreateContractData {
  name: string
  type: string
  company_id?: string
  copropriete_id?: string
  amount: number
  period: string
  start_date: string
  end_date: string
  auto_renewal?: boolean
  alert_days?: number
  notes?: string
}

class ContractsService {
  private baseUrl = '/api/contracts'

  async getContracts(filters: ContractsFilters = {}): Promise<Contract[]> {
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
      return data.contracts || []
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats:', error)
      throw error
    }
  }

  async createContract(contractData: CreateContractData): Promise<Contract> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.contract
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error)
      throw error
    }
  }

  async updateContract(id: string, contractData: Partial<CreateContractData>): Promise<Contract> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.contract
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contrat:', error)
      throw error
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du contrat:', error)
      throw error
    }
  }

  // Méthodes utilitaires
  getContractTypes(): string[] {
    return [
      'assurance',
      'maintenance',
      'nettoyage',
      'securite',
      'jardinage',
      'chauffage',
      'electricite',
      'plomberie',
      'ascenseur',
      'juridique',
      'comptabilite',
      'autre'
    ]
  }

  getPeriods(): string[] {
    return [
      'mensuel',
      'trimestriel',
      'semestriel',
      'annuel',
      'pluriannuel'
    ]
  }

  formatAmount(amount: number, period: string): string {
    const formattedAmount = amount.toLocaleString('fr-FR')
    switch (period) {
      case 'mensuel':
        return `${formattedAmount}€/mois`
      case 'trimestriel':
        return `${formattedAmount}€/trimestre`
      case 'semestriel':
        return `${formattedAmount}€/semestre`
      case 'annuel':
        return `${formattedAmount}€/an`
      case 'pluriannuel':
        return `${formattedAmount}€`
      default:
        return `${formattedAmount}€`
    }
  }

  calculateDaysLeft(endDate: string): number {
    const end = new Date(endDate)
    const today = new Date()
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  getAlertLevel(daysLeft: number): string {
    if (daysLeft < 0) return 'expired'
    if (daysLeft <= 30) return 'critical'
    if (daysLeft <= 60) return 'warning'
    return 'normal'
  }
}

export const contractsService = new ContractsService()
export type { Contract, ContractsFilters, CreateContractData }