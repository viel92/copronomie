import { Database } from '@/types/supabase'

type Consultation = Database['public']['Tables']['consultations']['Row']
type NewConsultation = Database['public']['Tables']['consultations']['Insert']
type UpdateConsultation = Database['public']['Tables']['consultations']['Update']

interface ConsultationWithRelations extends Consultation {
  coproprietes?: any
  devis?: any[]
  documents?: any[]
}

interface ConsultationsResponse {
  consultations: ConsultationWithRelations[]
  total: number
}

interface ConsultationFilters {
  status?: string
  copropriete_id?: string
  limit?: number
  offset?: number
}

class ConsultationsService {
  private baseUrl = '/api/consultations'

  async getAll(filters?: ConsultationFilters): Promise<ConsultationsResponse> {
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.copropriete_id) params.append('copropriete_id', filters.copropriete_id)
      if (filters?.limit) params.append('limit', filters.limit.toString())
      if (filters?.offset) params.append('offset', filters.offset.toString())

      const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la récupération des consultations')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur service consultations getAll:', error)
      throw error
    }
  }

  async getById(id: string): Promise<{ consultation: ConsultationWithRelations }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la récupération de la consultation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur service consultation getById:', error)
      throw error
    }
  }

  async create(data: NewConsultation): Promise<{ consultation: Consultation }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la création de la consultation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur service consultation create:', error)
      throw error
    }
  }

  async update(id: string, data: UpdateConsultation): Promise<{ consultation: Consultation }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour de la consultation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur service consultation update:', error)
      throw error
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la suppression de la consultation')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur service consultation delete:', error)
      throw error
    }
  }

  async updateStatus(id: string, status: string): Promise<{ consultation: Consultation }> {
    return this.update(id, { status })
  }

  // Alias pour compatibilité avec le dashboard
  async getConsultations(filters?: ConsultationFilters): Promise<ConsultationWithRelations[]> {
    const result = await this.getAll(filters)
    return result.consultations
  }
}

export const consultationsService = new ConsultationsService()