'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  Building,
  Calendar,
  Euro,
  FileText,
  TrendingUp,
  Eye
} from 'lucide-react'

interface Contract {
  id: number
  name: string
  supplier: string
  copropriete: string
  type: string
  amount: string
  period: string
  startDate: string
  endDate: string
  alertLevel: string
  daysLeft: number
  lastIncrease: string
  status: string
}

export default function ContractsPage() {
  const { profile, loading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const contracts: Contract[] = [
    {
      id: 1,
      name: 'Assurance multirisques immeuble',
      supplier: 'AXA Assurances',
      copropriete: 'Résidence Montparnasse',
      type: 'Assurance',
      amount: '15,400€',
      period: '/an',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      alertLevel: 'critical',
      daysLeft: 25,
      lastIncrease: '+8%',
      status: 'Actif'
    },
    {
      id: 2,
      name: 'Maintenance chauffage collectif',
      supplier: 'Thermic Services',
      copropriete: 'Villa des Roses',
      type: 'Maintenance',
      amount: '8,900€',
      period: '/an',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      alertLevel: 'warning',
      daysLeft: 95,
      lastIncrease: '+5%',
      status: 'Actif'
    },
    {
      id: 3,
      name: 'Nettoyage parties communes',
      supplier: 'Net & Clean Pro',
      copropriete: 'Résidence du Parc',
      type: 'Service',
      amount: '2,400€',
      period: '/mois',
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      alertLevel: 'normal',
      daysLeft: 185,
      lastIncrease: '+3%',
      status: 'Actif'
    },
    {
      id: 4,
      name: 'Maintenance ascenseurs',
      supplier: 'Ascenseurs Plus',
      copropriete: 'Les Jardins de Sophie',
      type: 'Maintenance',
      amount: '3,200€',
      period: '/trimestre',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      alertLevel: 'critical',
      daysLeft: 15,
      lastIncrease: '+12%',
      status: 'À renouveler'
    }
  ]

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.copropriete.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
                          (filter === 'critical' && contract.alertLevel === 'critical') ||
                          (filter === 'expiring' && contract.daysLeft < 90)
    return matchesSearch && matchesFilter
  })

  const stats = [
    { name: 'Contrats actifs', value: '24', icon: FileText, color: 'blue' },
    { name: 'À renouveler (< 90j)', value: '6', icon: Clock, color: 'orange' },
    { name: 'Économies potentielles', value: '12,400€', icon: TrendingUp, color: 'green' },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des contrats</h1>
          <p className="mt-1 text-sm text-slate-600">
            Suivez et optimisez tous vos contrats de copropriété - {profile?.organization?.name}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Ajouter un contrat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'orange' ? 'bg-orange-100' :
                  'bg-green-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.name}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, fournisseur ou copropriété..."
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
              <option value="all">Tous les contrats</option>
              <option value="critical">Échéance critique</option>
              <option value="expiring">Expire bientôt</option>
            </select>
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Contracts table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {filteredContracts.length} contrat(s)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contrat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{contract.name}</p>
                        {getAlertIcon(contract.alertLevel)}
                      </div>
                      <p className="text-sm text-slate-600">{contract.copropriete}</p>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full mt-1">
                        {contract.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{contract.supplier}</p>
                    <p className="text-sm text-slate-600">Évolution: {contract.lastIncrease}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{contract.amount}</p>
                    <p className="text-sm text-slate-600">{contract.period}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{contract.endDate}</p>
                    <p className={`text-sm ${
                      contract.daysLeft < 30 ? 'text-red-600' :
                      contract.daysLeft < 90 ? 'text-orange-600' :
                      'text-slate-600'
                    }`}>
                      {contract.daysLeft} jours restants
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getAlertColor(contract.alertLevel)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        Consulter
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}