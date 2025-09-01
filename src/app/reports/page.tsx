'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { reportsService, type Report } from '@/services/reports.service'
import { coproprietesService } from '@/services/coproprietes'
import type { Copropriete } from '@/services/coproprietes'
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
  Clock,
  Plus,
  Eye,
  AlertTriangle,
  RefreshCw,
  Filter
} from 'lucide-react'

export default function ReportsPage() {
  const { profile, loading: authLoading } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState('ag')
  const [dateRange, setDateRange] = useState('last-quarter')
  const [showGenerateForm, setShowGenerateForm] = useState(false)
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
      loadReports()
      loadCoproprietes()
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      loadReports()
    }
  }, [authLoading, selectedCopropriete])

  const loadCoproprietes = async () => {
    try {
      const data = await coproprietesService.getCoproprietes()
      setCoproprietes(data)
    } catch (err) {
      console.error('Erreur chargement copropriétés:', err)
    }
  }

  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const reportsData = await reportsService.getReports({ 
        limit: 10,
        copropriete_id: selectedCopropriete !== 'all' ? selectedCopropriete : undefined
      })
      setReports(reportsData)
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error)
      setError('Erreur lors du chargement des rapports')
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      setLoading(true)
      
      const reportTypes = reportsService.getReportTypes()
      const selectedType = reportTypes.find(t => t.id === reportType)
      
      await reportsService.createReport({
        name: selectedType?.name || 'Rapport',
        type: reportType,
        copropriete_id: selectedCopropriete !== 'all' ? selectedCopropriete : undefined,
        parameters: { dateRange }
      })
      
      await loadReports()
      setShowGenerateForm(false)
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error)
      setError('Erreur lors de la génération du rapport')
    } finally {
      setLoading(false)
    }
  }

  const reportTypes = reportsService.getReportTypes()
  const dateRanges = reportsService.getDateRanges()

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      generating: { color: 'bg-yellow-100 text-yellow-800', text: 'En cours' },
      generated: { color: 'bg-green-100 text-green-800', text: 'Disponible' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Échec' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.generated
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getReportIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      ag: <FileText className="h-5 w-5" />,
      financier: <BarChart3 className="h-5 w-5" />,
      technique: <Building className="h-5 w-5" />,
      consultations: <FileText className="h-5 w-5" />,
      contrats: <Calendar className="h-5 w-5" />,
      charges: <TrendingUp className="h-5 w-5" />
    }
    return icons[type] || <FileText className="h-5 w-5" />
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
          <h1 className="text-3xl font-bold text-slate-900">Rapports</h1>
          <p className="mt-1 text-sm text-slate-600">
            Génération et consultation des rapports
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
          
          <button 
            onClick={() => setShowGenerateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Générer rapport
          </button>
        </div>
      </div>

      {/* Generate Form */}
      {showGenerateForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Générer un nouveau rapport</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Type de rapport
              </label>
              <div className="grid grid-cols-1 gap-2">
                {reportTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      reportType === type.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={type.id}
                      checked={reportType === type.id}
                      onChange={(e) => setReportType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center flex-1">
                      <div className={`mr-3 ${reportType === type.id ? 'text-blue-600' : 'text-slate-400'}`}>
                        {getReportIcon(type.id)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{type.name}</div>
                        <div className="text-xs text-slate-500">{type.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Période
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Génération...' : 'Générer le rapport'}
                </button>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Rapports générés</p>
              <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Dernier rapport</p>
              <p className="text-sm font-medium text-slate-900">
                {reports[0] ? new Date(reports[0].generated_at).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Téléchargements</p>
              <p className="text-2xl font-bold text-slate-900">
                {reports.reduce((sum, r) => sum + (r.downloads_count || 0), 0)}
              </p>
            </div>
            <Download className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Rapports récents</h2>
            <button 
              onClick={loadReports}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-600">Aucun rapport généré</p>
            <p className="text-sm text-slate-500 mt-1">
              Cliquez sur "Générer rapport" pour créer votre premier rapport
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rapport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Généré par
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Taille
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
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-slate-400 mr-3">
                          {getReportIcon(report.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {report.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {reportTypes.find(t => t.id === report.type)?.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(report.generated_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {reportsService.getGeneratorName(report.generated_by_profile)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {reportsService.formatFileSize(report.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {report.status === 'generated' && (
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}