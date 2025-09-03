'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { contractsService, type Contract } from '@/services/contracts.service'
import { coproprietesService } from '@/services/coproprietes'
import type { Copropriete } from '@/services/coproprietes'
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
  Eye,
  RefreshCw,
  X
} from 'lucide-react'

export default function ContractsPage() {
  const { profile, loading: authLoading } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [coproprietes, setCoproprietes] = useState<Copropriete[]>([])
  const [selectedCopropriete, setSelectedCopropriete] = useState<string>('all')

  // Charger la copropriété sélectionnée depuis le localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedCopropriete')
    if (saved && saved !== 'null' && saved !== 'undefined') {
      setSelectedCopropriete(saved)
    }
  }, [])

  // Sauvegarder la copropriété sélectionnée dans le localStorage
  const handleCoproprietChange = (value: string) => {
    setSelectedCopropriete(value)
    localStorage.setItem('selectedCopropriete', value)
  }

  useEffect(() => {
    if (!authLoading) {
      loadContracts()
      loadCoproprietes()
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      loadContracts()
    }
  }, [authLoading, searchTerm, filter, selectedCopropriete])

  const loadCoproprietes = async () => {
    try {
      const data = await coproprietesService.getCoproprietes()
      setCoproprietes(data)
    } catch (err) {
      console.error('Erreur chargement copropriétés:', err)
    }
  }

  const loadContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const contractsData = await contractsService.getContracts({
        search: searchTerm || undefined,
        filter: filter !== 'all' ? filter : undefined,
        copropriete_id: selectedCopropriete !== 'all' ? selectedCopropriete : undefined
      })
      
      setContracts(contractsData)
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error)
      setError('Erreur lors du chargement des contrats')
      setContracts([])
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (alertLevel: string) => {
    switch (alertLevel) {
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getAlertBadge = (alertLevel: string, daysLeft?: number) => {
    const text = alertLevel === 'expired' 
      ? 'Expiré' 
      : daysLeft !== undefined 
        ? `${daysLeft} jours`
        : ''

    const colorClass = {
      expired: 'bg-red-100 text-red-800',
      critical: 'bg-orange-100 text-orange-800',
      warning: 'bg-yellow-100 text-yellow-800',
      normal: 'bg-green-100 text-green-800'
    }[alertLevel] || 'bg-slate-100 text-slate-800'

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {text}
      </span>
    )
  }

  const stats = {
    total: contracts.length,
    expiring: contracts.filter(c => c.alertLevel === 'critical' || c.alertLevel === 'warning').length,
    expired: contracts.filter(c => c.alertLevel === 'expired').length,
    totalAmount: contracts.reduce((sum, c) => sum + (c.amount || 0), 0)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contrats</h1>
          <p className="mt-1 text-sm text-slate-600">
            Gestion et suivi des contrats fournisseurs
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sélecteur de copropriété */}
          {coproprietes.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-600" />
              <label className="text-sm font-medium text-slate-700">Copropriété :</label>
              <select
                value={selectedCopropriete}
                onChange={(e) => handleCoproprietChange(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              >
                <option value="all">Toutes les copropriétés</option>
                {coproprietes.map((copro) => (
                  <option key={copro.id} value={copro.id}>
                    {copro.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Nouveau contrat
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total contrats</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">À renouveler</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expiring}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Expirés</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Montant total</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalAmount.toLocaleString('fr-FR')}€
              </p>
            </div>
            <Euro className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un contrat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les contrats</option>
            <option value="active">Actifs</option>
            <option value="expiring">À renouveler (60j)</option>
            <option value="expired">Expirés</option>
          </select>

          <button 
            onClick={loadContracts}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Erreur</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Contracts Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Building className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                      <p className="text-slate-600">Aucun contrat trouvé</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Ajoutez votre premier contrat pour commencer le suivi
                      </p>
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {contract.name}
                          </div>
                          <div className="text-sm text-slate-500 capitalize">
                            {contract.type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {contract.company?.name || 'Non spécifié'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {contractsService.formatAmount(contract.amount, contract.period)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getAlertIcon(contract.alertLevel || 'normal')}
                          <div>
                            <div className="text-sm text-slate-900">
                              {new Date(contract.end_date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-xs text-slate-500">
                              Début: {new Date(contract.start_date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getAlertBadge(contract.alertLevel || 'normal', contract.daysLeft)}
                          {contract.auto_renewal && (
                            <span title="Renouvellement auto">
                              <RefreshCw className="h-3 w-3 text-blue-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}