interface Copropriete {
  id: string
  name: string
  address?: string
  postal_code?: string
  city?: string
  lots_count?: number
  budget_annual?: number
  syndic_name?: string
  syndic_email?: string
  syndic_phone?: string
  metadata?: any
  organization_id?: string
  created_at: string
  updated_at?: string
}

class CoproprietesService {
  private baseUrl = '/api/coproprietes'

  async getCoproprietes(): Promise<Copropriete[]> {
    try {
      const response = await fetch(this.baseUrl)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.coproprietes || []
    } catch (error) {
      console.error('Erreur lors de la récupération des copropriétés:', error)
      throw error
    }
  }

  async createCopropriete(data: Partial<Copropriete>): Promise<Copropriete> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.copropriete
    } catch (error) {
      console.error('Erreur lors de la création de la copropriété:', error)
      throw error
    }
  }
}

export const coproprietesService = new CoproprietesService()
export type { Copropriete }