'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '../../components/Toast'
import { consultationsService } from '@/services/consultations'
import { contractsService } from '@/services/contracts'
import { companiesService } from '@/services/companies'
import { coproprietesService } from '@/services/coproprietes'
import type { Copropriete } from '@/services/coproprietes'
import { 
  FileText, 
  Building, 
  Users, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  BarChart3,
  Zap,
  Upload,
  Filter,
  ArrowRight,
  Vote,
  Brain,
  Target,
  Camera,
  Megaphone,
  BarChart3 as Analytics,
  Presentation
} from 'lucide-react'

export default function DashboardPage() {
  const { profile, loading } = useAuth()
  const { showToast, ToastComponent } = useToast()
  const [quickFilter, setQuickFilter] = useState('all')
  const [consultations, setConsultations] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
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
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [stats, setStats] = useState([
    { name: 'Consultations actives', value: '0', icon: FileText, change: '', color: 'blue' },
    { name: 'Contrats à renouveler', value: '0', icon: Building, change: '', color: 'orange' },
    { name: 'Entreprises partenaires', value: '0', icon: Users, change: '', color: 'green' },
    { name: 'Économies générées (€)', value: '0', icon: TrendingUp, change: '', color: 'green' },
  ])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (loading || !profile) return
      
      try {
        setDashboardLoading(true)
        
        // Fetch toutes les données en parallèle
        const [consultationsData, contractsData, companiesData, coproprietesData] = await Promise.all([
          consultationsService.getConsultations().catch(() => []),
          contractsService.getContracts().catch(() => []),
          companiesService.getCompanies({}).catch(() => []),
          coproprietesService.getCoproprietes().catch(() => [])
        ])
        
        setConsultations(consultationsData)
        setContracts(contractsData)
        setCompanies(companiesData)
        setCoproprietes(coproprietesData)
        
        // Calculer les statistiques dynamiques (seront recalculées selon la copropriété sélectionnée)
        const activeConsultations = consultationsData.filter((c: any) => c.status === 'En cours' || c.status === 'pending').length
        const contractsToRenew = contractsData.filter((contract: any) => {
          const endDate = new Date(contract.end_date)
          const threeMonthsFromNow = new Date()
          threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
          return endDate <= threeMonthsFromNow
        }).length
        
        // Calculer les économies (estimation basée sur les consultations terminées)
        const completedConsultations = consultationsData.filter((c: any) => c.status === 'Terminé' || c.status === 'completed')
        const estimatedSavings = completedConsultations.length * 2500 // Estimation moyenne d'économie par consultation
        
        setStats([
          { 
            name: 'Consultations actives', 
            value: activeConsultations.toString(), 
            icon: FileText, 
            change: activeConsultations > 0 ? `+${activeConsultations}` : '', 
            color: 'blue' 
          },
          { 
            name: 'Contrats à renouveler', 
            value: contractsToRenew.toString(), 
            icon: Building, 
            change: contractsToRenew > 0 ? `+${contractsToRenew}` : '', 
            color: 'orange' 
          },
          { 
            name: 'Entreprises partenaires', 
            value: companiesData.length.toString(), 
            icon: Users, 
            change: companiesData.length > 0 ? `+${Math.floor(companiesData.length * 0.1)}` : '', 
            color: 'green' 
          },
          { 
            name: 'Économies générées (€)', 
            value: estimatedSavings.toLocaleString('fr-FR'), 
            icon: TrendingUp, 
            change: estimatedSavings > 0 ? '+15%' : '', 
            color: 'green' 
          },
        ])
        
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
        showToast('Erreur lors du chargement des données', 'error')
      } finally {
        setDashboardLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [loading, profile])

  if (loading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'en cours':
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'attente devis':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800'
      case 'terminé':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'annulé':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getAlertLevel = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return 'critical'
    if (diffDays < 90) return 'warning'
    return 'normal'
  }

  // Fonction pour filtrer les données par copropriété
  const filterByCopropriete = (data: any[], coproprietId: string) => {
    if (coproprietId === 'all' || !coproprietId) return data
    return data.filter(item => item.copropriete_id === coproprietId)
  }

  // Données filtrées par copropriété
  const filteredConsultationsData = filterByCopropriete(consultations, selectedCopropriete)
  const filteredContractsData = filterByCopropriete(contracts, selectedCopropriete)
  const filteredCompaniesData = selectedCopropriete === 'all' ? companies : companies // Les entreprises ne sont pas liées aux copropriétés

  // Statistiques recalculées selon la copropriété sélectionnée
  const filteredStats = {
    activeConsultations: filteredConsultationsData.filter((c: any) => c.status === 'En cours' || c.status === 'pending').length,
    contractsToRenew: filteredContractsData.filter((contract: any) => {
      const endDate = new Date(contract.end_date)
      const threeMonthsFromNow = new Date()
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
      return endDate <= threeMonthsFromNow
    }).length,
    totalCompanies: filteredCompaniesData.length,
    estimatedSavings: filteredConsultationsData.filter((c: any) => c.status === 'Terminé' || c.status === 'completed').length * 2500
  }

  // Stats dynamiques basées sur la copropriété sélectionnée
  const dynamicStats = [
    { 
      name: 'Consultations actives', 
      value: filteredStats.activeConsultations.toString(), 
      icon: FileText, 
      change: filteredStats.activeConsultations > 0 ? `+${filteredStats.activeConsultations}` : '', 
      color: 'blue' 
    },
    { 
      name: 'Contrats à renouveler', 
      value: filteredStats.contractsToRenew.toString(), 
      icon: Building, 
      change: filteredStats.contractsToRenew > 0 ? `+${filteredStats.contractsToRenew}` : '', 
      color: 'orange' 
    },
    { 
      name: 'Entreprises partenaires', 
      value: filteredStats.totalCompanies.toString(), 
      icon: Users, 
      change: filteredStats.totalCompanies > 0 ? `+${Math.floor(filteredStats.totalCompanies * 0.1)}` : '', 
      color: 'green' 
    },
    { 
      name: 'Économies générées (€)', 
      value: filteredStats.estimatedSavings.toLocaleString('fr-FR'), 
      icon: TrendingUp, 
      change: filteredStats.estimatedSavings > 0 ? '+15%' : '', 
      color: 'green' 
    },
  ]

  const filteredConsultations = filteredConsultationsData.filter((consultation: any) => {
    if (quickFilter === 'all') return true
    if (quickFilter === 'urgent') {
      const deadline = new Date(consultation.deadline || consultation.end_date)
      return deadline <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
    if (quickFilter === 'active') return consultation.status === 'En cours' || consultation.status === 'pending'
    return true
  }).slice(0, 5) // Limite à 5 consultations pour le dashboard

  // Actions rapides avec les fonctionnalités IA
  const quickActions = [
    {
      title: 'Comparateur IA',
      description: 'Analyser des devis PDF',
      href: '/comparator-v2',
      icon: Zap,
      color: 'blue',
      enabled: true
    },
    {
      title: 'Nouvelle consultation',
      description: 'Lancer une mise en concurrence',
      href: '/consultations/new',
      icon: FileText,
      color: 'blue',
      enabled: true
    },
    {
      title: 'Ajouter un contrat',
      description: 'Importer un nouveau contrat',
      href: '/contracts',
      icon: Building,
      color: 'green',
      enabled: true
    },
    {
      title: 'Générer un rapport',
      description: 'Rapport pour l\'assemblée générale',
      href: '/reports',
      icon: BarChart3,
      color: 'purple',
      enabled: true
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'hover:border-blue-500 hover:bg-blue-50 group-hover:text-blue-600',
      green: 'hover:border-green-500 hover:bg-green-50 group-hover:text-green-600',
      purple: 'hover:border-purple-500 hover:bg-purple-50 group-hover:text-purple-600',
      indigo: 'hover:border-indigo-500 hover:bg-indigo-50 group-hover:text-indigo-600',
      emerald: 'hover:border-emerald-500 hover:bg-emerald-50 group-hover:text-emerald-600',
      pink: 'hover:border-pink-500 hover:bg-pink-50 group-hover:text-pink-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Vue d'ensemble de {profile?.organization?.name} et activités en cours
          </p>
        </div>
        
        {/* Sélecteur de copropriété */}
        {coproprietes.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-600" />
              <label className="text-sm font-medium text-slate-700">Copropriété :</label>
            </div>
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
        <div className="flex gap-3">
          <Link
            href="/consultations/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvelle consultation
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dynamicStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
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
              </div>
              <div className="mt-4">
                <div className="flex items-baseline text-2xl font-semibold text-slate-900">
                  {stat.value}
                  <span className={`ml-2 text-sm font-medium ${
                    stat.color === 'orange' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{stat.name}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comparateur rapide */}
        <div className="lg:col-span-3 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">COMPARATEUR RAPIDE</h2>
                  <p className="text-blue-100 mt-1">Glissez vos devis PDF ici pour une analyse instantanée</p>
                </div>
              </div>
              <Link
                href="/comparator-v2"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                ACCÉDER AU COMPARATEUR →
              </Link>
            </div>
            
            <div className="mt-6 border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-white/70 mb-3" />
              <p className="text-white/90">Zone de dépôt rapide - Glissez vos PDF ici</p>
              <p className="text-white/70 text-sm mt-1">ou utilisez le comparateur complet</p>
            </div>
          </div>
        </div>

        {/* Consultations en cours */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Consultations en cours</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={quickFilter}
                    onChange={(e) => setQuickFilter(e.target.value)}
                    className="text-xs px-2 py-1 border border-slate-300 rounded"
                  >
                    <option value="all">Toutes</option>
                    <option value="urgent">Urgentes</option>
                    <option value="active">Actives</option>
                  </select>
                  <Link 
                    href="/consultations"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Voir tout
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredConsultations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>Aucune consultation trouvée</p>
                    <Link 
                      href="/consultations/new" 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                    >
                      Créer une consultation
                    </Link>
                  </div>
                ) : (
                  filteredConsultations.map((consultation) => {
                    const devisReceived = consultation.proposals_count || 0
                    const devisTotal = Math.max(devisReceived + 2, 3) // Estimation
                    const amount = consultation.estimated_amount ? `${consultation.estimated_amount.toLocaleString('fr-FR')}€` : 'Non défini'
                    const deadline = consultation.deadline || consultation.end_date
                    
                    return (
                      <div key={consultation.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900">{consultation.title || 'Consultation sans titre'}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                                {consultation.status || 'En cours'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{consultation.description || 'Description non disponible'}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Devis: {devisReceived}/{devisTotal}</span>
                              <span>Montant: {amount}</span>
                              {deadline && <span>Échéance: {new Date(deadline).toLocaleDateString('fr-FR')}</span>}
                            </div>
                          </div>
                          <Link 
                            href={`/consultations/${consultation.id}`}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((devisReceived / devisTotal) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contrats à surveiller */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Contrats à surveiller</h2>
                <Link 
                  href="/contracts"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Voir tout
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredContractsData.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    <Building className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">Aucun contrat trouvé</p>
                    <Link 
                      href="/contracts" 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 inline-block"
                    >
                      Ajouter des contrats
                    </Link>
                  </div>
                ) : (
                  filteredContractsData.slice(0, 5).map((contract) => {
                    const alertLevel = getAlertLevel(contract.end_date || contract.endDate)
                    const amount = contract.annual_amount 
                      ? `${contract.annual_amount.toLocaleString('fr-FR')}€/an` 
                      : (contract.amount || 'Non défini')
                    
                    return (
                      <div key={contract.id} className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-900 text-sm">{contract.name || contract.title || 'Contrat sans nom'}</h4>
                              {alertLevel === 'critical' && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              {alertLevel === 'warning' && (
                                <Clock className="h-4 w-4 text-orange-500" />
                              )}
                              {alertLevel === 'normal' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-1">{contract.supplier || contract.company_name || 'Fournisseur non défini'}</p>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>{amount}</span>
                              {(contract.end_date || contract.endDate) && (
                                <span>Fin: {new Date(contract.end_date || contract.endDate).toLocaleDateString('fr-FR')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`p-4 border-2 border-dashed border-slate-300 rounded-lg transition-all group text-center ${getColorClasses(action.color)}`}
              >
                <Icon className="h-8 w-8 text-slate-400 mx-auto mb-2 transition-colors" />
                <h3 className="font-medium text-slate-900 transition-colors">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
      
      {ToastComponent}
    </div>
  )
}