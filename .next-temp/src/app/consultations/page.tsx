'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
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

interface Consultation {
  id: number
  title: string
  copropriete: string
  lots: number
  type: string
  status: string
  devisReceived: number
  devisTotal: number
  deadline: string
  amount: string
  created: string
  statusColor: string
  priority: string
}

export default function ConsultationsPage() {
  const { profile, loading } = useAuth()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const consultations: Consultation[] = [
    {
      id: 1,
      title: 'Réfection façade',
      copropriete: 'Résidence Montparnasse',
      lots: 156,
      type: 'Travaux',
      status: 'En cours',
      devisReceived: 2,
      devisTotal: 5,
      deadline: '2024-12-15',
      amount: '85,000€',
      created: '2024-11-20',
      statusColor: 'bg-blue-100 text-blue-800',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Maintenance ascenseur',
      copropriete: 'Villa des Roses',
      lots: 32,
      type: 'Maintenance',
      status: 'Attente devis',
      devisReceived: 1,
      devisTotal: 3,
      deadline: '2024-12-10',
      amount: '12,500€',
      created: '2024-11-22',
      statusColor: 'bg-yellow-100 text-yellow-800',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Contrat nettoyage',
      copropriete: 'Résidence du Parc',
      lots: 89,
      type: 'Service',
      status: 'Terminé',
      devisReceived: 4,
      devisTotal: 4,
      deadline: '2024-11-30',
      amount: '6,800€',
      created: '2024-11-10',
      statusColor: 'bg-green-100 text-green-800',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Ravalement partie Est',
      copropriete: 'Les Jardins de Sophie',
      lots: 78,
      type: 'Travaux',
      status: 'Brouillon',
      devisReceived: 0,
      devisTotal: 0,
      deadline: '2024-12-20',
      amount: '120,000€',
      created: '2024-11-25',
      statusColor: 'bg-slate-100 text-slate-800',
      priority: 'high'
    }
  ]

  const filteredConsultations = consultations.filter(consultation => {
    const matchesFilter = filter === 'all' || consultation.status.toLowerCase().includes(filter)
    const matchesSearch = consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultation.copropriete.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En cours':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'Terminé':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Attente devis':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
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
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="cours">En cours</option>
              <option value="attente">Attente devis</option>
              <option value="terminé">Terminé</option>
              <option value="brouillon">Brouillon</option>
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${consultation.statusColor}`}>
                      {consultation.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                      {consultation.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-slate-500">Copropriété:</span>
                      <p className="font-medium text-slate-900">{consultation.copropriete}</p>
                      <p className="text-xs text-slate-600">{consultation.lots} lots</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Devis:</span>
                      <p className="font-medium text-slate-900">{consultation.devisReceived}/{consultation.devisTotal}</p>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `${consultation.devisTotal > 0 ? (consultation.devisReceived / consultation.devisTotal) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Montant estimé:</span>
                      <p className="font-medium text-slate-900">{consultation.amount}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Échéance:</span>
                      <p className="font-medium text-slate-900">{consultation.deadline}</p>
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