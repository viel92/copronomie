'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { consultationsService } from '@/services/consultations.service'
import { coproprietesService } from '@/services/coproprietes'
import type { Copropriete } from '@/services/coproprietes'
import { 
  Plus, 
  Filter, 
  Search, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react'
import { Database } from '@/types/supabase'

type ConsultationDB = Database['public']['Tables']['consultations']['Row']

interface ConsultationWithRelations extends ConsultationDB {
  coproprietes?: {
    id: string
    nom: string
    adresse: string
  }
  devis?: Array<{
    id: string
    montant_total: number
    statut: string
  }>
}

export default function ConsultationsPage() {
  const { profile, loading: authLoading } = useAuth()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [consultations, setConsultations] = useState<ConsultationWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coproprietes, setCoproprietes] = useState<Copropriete[]>([])
  const [selectedCopropriete, setSelectedCopropriete] = useState<string>('all')

  useEffect(() => {
    loadConsultations()
    loadCoproprietes()
  }, [])

  useEffect(() => {
    loadConsultations()
  }, [filter, selectedCopropriete])

  const loadCoproprietes = async () => {
    try {
      const data = await coproprietesService.getCoproprietes()
      setCoproprietes(data)
    } catch (err) {
      console.error('Erreur chargement copropriétés:', err)
    }
  }

  const loadConsultations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters: any = {}
      if (filter !== 'all') filters.status = filter
      if (selectedCopropriete !== 'all') filters.copropriete_id = selectedCopropriete
      
      const response = await consultationsService.getAll(Object.keys(filters).length > 0 ? filters : undefined)
      
      setConsultations(response.consultations)
    } catch (err) {
      console.error('Erreur chargement consultations:', err)
      setError('Erreur lors du chargement des consultations')
      // Fallback sur des données mockées si erreur
      setConsultations(getMockConsultations())
    } finally {
      setLoading(false)
    }
  }

  const getMockConsultations = (): any[] => [
    {
      id: '1',
      title: 'Réfection façade',
      status: 'en_cours',
      type: 'travaux',
      deadline: '2024-12-15',
      budget_min: 75000,
      budget_max: 85000,
      created_at: '2024-11-20',
      coproprietes: {
        nom: 'Résidence Montparnasse',
        nb_lots: 156
      },
      devis: [
        { id: '1', montant_total: 82000, statut: 'accepte' },
        { id: '2', montant_total: 78500, statut: 'en_attente' }
      ]
    },
    {
      id: '2',
      title: 'Maintenance ascenseur',
      status: 'attente_devis',
      type: 'maintenance',
      deadline: '2024-12-10',
      budget_min: 10000,
      budget_max: 12500,
      created_at: '2024-11-22',
      coproprietes: {
        nom: 'Villa des Roses',
        nb_lots: 32
      },
      devis: [
        { id: '3', montant_total: 11500, statut: 'en_attente' }
      ]
    },
    {
      id: '3',
      title: 'Contrat nettoyage',
      status: 'termine',
      type: 'service',
      deadline: '2024-11-30',
      budget_min: 6000,
      budget_max: 7000,
      created_at: '2024-11-10',
      coproprietes: {
        nom: 'Résidence du Parc',
        nb_lots: 89
      },
      devis: [
        { id: '4', montant_total: 6800, statut: 'accepte' },
        { id: '5', montant_total: 6500, statut: 'refuse' },
        { id: '6', montant_total: 7200, statut: 'refuse' },
        { id: '7', montant_total: 6400, statut: 'refuse' }
      ]
    },
    {
      id: '4',
      title: 'Ravalement partie Est',
      status: 'draft',
      type: 'travaux',
      deadline: '2024-12-20',
      budget_min: 100000,
      budget_max: 120000,
      created_at: '2024-11-25',
      coproprietes: {
        nom: 'Les Jardins de Sophie',
        nb_lots: 78
      },
      devis: []
    }
  ]

  const filteredConsultations = consultations.filter(consultation => {
    const matchesFilter = filter === 'all' || (consultation.status?.toLowerCase() || '').includes(filter)
    const matchesSearch = (consultation.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (consultation.coproprietes?.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusIcon = (status?: string | null) => {
    switch (status) {
      case 'en_cours':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'termine':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'attente_devis':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'draft':
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusLabel = (status?: string | null) => {
    switch (status) {
      case 'en_cours': return 'En cours'
      case 'termine': return 'Terminé'
      case 'attente_devis': return 'Attente devis'
      case 'draft': return 'Brouillon'
      default: return status || 'Non défini'
    }
  }

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case 'en_cours': return 'bg-blue-100 text-blue-800'
      case 'termine': return 'bg-green-100 text-green-800'
      case 'attente_devis': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-slate-100 text-slate-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatAmount = (min?: number | null, max?: number | null) => {
    if (!min && !max) return 'Non défini'
    if (min && max) {
      return `${min.toLocaleString('fr-FR')}€ - ${max.toLocaleString('fr-FR')}€`
    }
    return `${(min || max || 0).toLocaleString('fr-FR')}€`
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Consultations</h1>
          <p className="mt-1 text-sm text-slate-600">
            Gérez toutes vos mises en concurrence pour {profile?.organization?.name}
          </p>
        </div>
        <Link
          href="/consultations/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle consultation
        </Link>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par titre ou copropriété..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {/* Sélecteur de copropriété */}
            {coproprietes.length > 0 && (
              <select
                value={selectedCopropriete}
                onChange={(e) => setSelectedCopropriete(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
              >
                <option value="all">Toutes les copropriétés</option>
                {coproprietes.map((copro) => (
                  <option key={copro.id} value={copro.id}>
                    {copro.name}
                  </option>
                ))}
              </select>
            )}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_cours">En cours</option>
              <option value="attente_devis">Attente devis</option>
              <option value="termine">Terminé</option>
              <option value="draft">Brouillon</option>
            </select>
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Consultations list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {filteredConsultations.length} consultation(s)
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredConsultations.map((consultation) => (
            <div key={consultation.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(consultation.status)}
                    <h3 className="font-semibold text-slate-900">{consultation.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                      {getStatusLabel(consultation.status)}
                    </span>
                    {consultation.type && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                        {consultation.type}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-slate-500">Copropriété:</span>
                      <p className="font-medium text-slate-900">{consultation.coproprietes?.nom || 'Non définie'}</p>
                      {consultation.coproprietes?.nb_lots && (
                        <p className="text-xs text-slate-600">{consultation.coproprietes.nb_lots} lots</p>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500">Devis:</span>
                      <p className="font-medium text-slate-900">
                        {consultation.devis?.length || 0} reçu(s)
                      </p>
                      {consultation.devis && consultation.devis.length > 0 && (
                        <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500">Budget estimé:</span>
                      <p className="font-medium text-slate-900">
                        {formatAmount(consultation.budget_min, consultation.budget_max)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Échéance:</span>
                      <p className="font-medium text-slate-900">
                        {consultation.deadline ? new Date(consultation.deadline).toLocaleDateString('fr-FR') : 'Non définie'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/consultations/${consultation.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    Voir
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}