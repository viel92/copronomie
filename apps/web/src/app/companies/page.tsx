'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Users, Plus } from 'lucide-react'

export default function CompaniesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Entreprises</h1>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Nouvelle entreprise</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise</h3>
            <p className="text-gray-600 mb-4">Ajoutez les entreprises partenaires pour gérer vos relations.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Ajouter une entreprise
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
