'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { 
  FileText, 
  Download, 
  Calendar, 
  Building,
  Euro,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Clock
} from 'lucide-react'

interface Copropriete {
  id: number
  name: string
  lots: number
}

interface ReportType {
  id: string
  name: string
  description: string
  icon: React.ElementType
}

interface RecentReport {
  id: number
  name: string
  copropriete: string
  type: string
  generated: string
  downloads: number
  size: string
}

export default function ReportsPage() {
  const { profile, loading } = useAuth()
  const [reportType, setReportType] = useState('ag')
  const [selectedCopro, setSelectedCopro] = useState('')
  const [dateRange, setDateRange] = useState('last-quarter')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const coproprietes: Copropriete[] = [
    { id: 1, name: 'Résidence Montparnasse', lots: 156 },
    { id: 2, name: 'Villa des Roses', lots: 32 },
    { id: 3, name: 'Résidence du Parc', lots: 89 },
    { id: 4, name: 'Les Jardins de Sophie', lots: 78 }
  ]

  const reportTypes: ReportType[] = [
    { 
      id: 'ag', 
      name: 'Rapport d\'assemblée générale', 
      description: 'Résumé des consultations et décisions pour l\'AG',
      icon: Users
    },
    { 
      id: 'economics', 
      name: 'Analyse économique', 
      description: 'Évolution des coûts et économies réalisées',
      icon: TrendingUp
    },
    { 
      id: 'contracts', 
      name: 'État des contrats', 
      description: 'Suivi des échéances et renouvellements',
      icon: FileText
    },
    { 
      id: 'activity', 
      name: 'Rapport d\'activité', 
      description: 'Synthèse complète de la période',
      icon: BarChart3
    }
  ]

  const recentReports: RecentReport[] = [
    {
      id: 1,
      name: 'Rapport AG - T4 2024',
      copropriete: 'Résidence Montparnasse',
      type: 'Assemblée générale',
      generated: '2024-11-20',
      downloads: 12,
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Analyse économique - Q3 2024',
      copropriete: 'Villa des Roses',
      type: 'Économique',
      generated: '2024-10-15',
      downloads: 8,
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'État contrats - Novembre 2024',
      copropriete: 'Résidence du Parc',
      type: 'Contrats',
      generated: '2024-11-01',
      downloads: 15,
      size: '950 KB'
    }
  ]

  const handleGenerateReport = () => {
    // Logique de génération du rapport
    console.log('Génération rapport:', { reportType, selectedCopro, dateRange })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Rapports et analyses</h1>
        <p className="mt-1 text-sm text-slate-600">
          Générez des rapports détaillés pour vos assemblées générales et suivis - {profile?.organization?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Générateur de rapport */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Nouveau rapport</h2>
            
            <div className="space-y-6">
              {/* Type de rapport */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Type de rapport
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          reportType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setReportType(type.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-slate-900">{type.name}</h3>
                            <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sélection copropriété */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Copropriété
                </label>
                <select
                  value={selectedCopro}
                  onChange={(e) => setSelectedCopro(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Toutes les copropriétés</option>
                  {coproprietes.map(copro => (
                    <option key={copro.id} value={copro.id}>
                      {copro.name} ({copro.lots} lots)
                    </option>
                  ))}
                </select>
              </div>

              {/* Période */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Période
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="last-month">Dernier mois</option>
                  <option value="last-quarter">Dernier trimestre</option>
                  <option value="last-year">Dernière année</option>
                  <option value="custom">Période personnalisée</option>
                </select>
              </div>

              <button
                onClick={handleGenerateReport}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Générer le rapport
              </button>
            </div>
          </div>
        </div>

        {/* Rapports récents */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Rapports récents</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 mb-1">{report.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{report.copropriete}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>📅 {report.generated}</span>
                          <span>📁 {report.size}</span>
                          <span>📊 {report.downloads} téléchargements</span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques rapides */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Métriques de performance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">-75%</p>
            <p className="text-sm text-slate-600">Temps consultation</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">24,150€</p>
            <p className="text-sm text-slate-600">Économies générées</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">89%</p>
            <p className="text-sm text-slate-600">Taux de réponse</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-3">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">4.2</p>
            <p className="text-sm text-slate-600">Note satisfaction CS</p>
          </div>
        </div>
      </div>
    </div>
  )
}