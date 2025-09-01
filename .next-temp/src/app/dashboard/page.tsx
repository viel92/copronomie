'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
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
  const [quickFilter, setQuickFilter] = React.useState('all')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = [
    { name: 'Consultations actives', value: '12', icon: FileText, change: '+2', color: 'blue' },
    { name: 'Contrats à renouveler', value: '8', icon: Building, change: '+3', color: 'orange' },
    { name: 'Entreprises partenaires', value: '147', icon: Users, change: '+12', color: 'green' },
    { name: 'Économies générées (€)', value: '24,150', icon: TrendingUp, change: '+15%', color: 'green' },
  ]

  const consultations = [
    {
      id: 1,
      title: 'Réfection façade - Résidence Montparnasse',
      copropriete: 'Résidence Montparnasse (156 lots)',
      status: 'En cours',
      devisReceived: 2,
      devisTotal: 5,
      deadline: '2024-12-15',
      amount: '85,000€',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      title: 'Maintenance ascenseur - Villa des Roses',
      copropriete: 'Villa des Roses (32 lots)',
      status: 'Attente devis',
      devisReceived: 1,
      devisTotal: 3,
      deadline: '2024-12-10',
      amount: '12,500€',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 3,
      title: 'Nettoyage - Résidence du Parc',
      copropriete: 'Résidence du Parc (89 lots)',
      status: 'Terminé',
      devisReceived: 4,
      devisTotal: 4,
      deadline: '2024-11-30',
      amount: '6,800€',
      statusColor: 'bg-green-100 text-green-800'
    }
  ]

  const contracts = [
    {
      id: 1,
      name: 'Assurance multirisques',
      supplier: 'AXA Assurances',
      amount: '15,400€/an',
      endDate: '2024-12-31',
      alertLevel: 'critical'
    },
    {
      id: 2,
      name: 'Maintenance chauffage',
      supplier: 'Thermic Services',
      amount: '8,900€/an',
      endDate: '2025-02-15',
      alertLevel: 'warning'
    },
    {
      id: 3,
      name: 'Nettoyage parties communes',
      supplier: 'Net & Clean',
      amount: '24,000€/an',
      endDate: '2025-06-30',
      alertLevel: 'normal'
    }
  ]

  const filteredConsultations = consultations.filter(consultation => {
    if (quickFilter === 'all') return true
    if (quickFilter === 'urgent') return new Date(consultation.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    if (quickFilter === 'active') return consultation.status === 'En cours'
    return true
  })

  // Actions rapides avec les fonctionnalités IA
  const quickActions = [
    {
      title: 'Comparateur IA',
      description: 'Analyser des devis PDF',
      href: '/comparateur',
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
        {stats.map((stat) => {
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
                href="/comparateur"
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
                {filteredConsultations.map((consultation) => (
                  <div key={consultation.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{consultation.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${consultation.statusColor}`}>
                            {consultation.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{consultation.copropriete}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Devis: {consultation.devisReceived}/{consultation.devisTotal}</span>
                          <span>Montant: {consultation.amount}</span>
                          <span>Échéance: {consultation.deadline}</span>
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
                        style={{ width: `${(consultation.devisReceived / consultation.devisTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
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
                {contracts.map((contract) => (
                  <div key={contract.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900 text-sm">{contract.name}</h4>
                          {contract.alertLevel === 'critical' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {contract.alertLevel === 'warning' && (
                            <Clock className="h-4 w-4 text-orange-500" />
                          )}
                          {contract.alertLevel === 'normal' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mb-1">{contract.supplier}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{contract.amount}</span>
                          <span>Fin: {contract.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  )
}