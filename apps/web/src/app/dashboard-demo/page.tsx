'use client'

import React from 'react'
import Link from 'next/link'
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
  Upload
} from 'lucide-react'

export default function DashboardDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Copronomie</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultations actives</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contrats en cours</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entreprises</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Économies réalisées</p>
                <p className="text-2xl font-bold text-gray-900">15.2k€</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/comparator-v2" className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Zap className="h-5 w-5" />
              <span>Comparer des devis</span>
            </Link>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <Plus className="h-5 w-5" />
              <span>Nouvelle consultation</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              <Upload className="h-5 w-5" />
              <span>Importer un contrat</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultations récentes</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Ravalement facade</p>
                    <p className="text-sm text-gray-500">En cours d'analyse</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-yellow-600">En cours</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Réfection toiture</p>
                    <p className="text-sm text-gray-500">Terminé le 15/08</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Terminé</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900">Ascenseur</p>
                    <p className="text-sm text-gray-500">En attente de devis</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-orange-600">En attente</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Taux de réponse</span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Économies moyennes</span>
                  <span className="text-sm font-medium text-gray-900">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '23%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}