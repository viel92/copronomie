'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Settings as SettingsIcon, User, Building, Bell } from 'lucide-react'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
            </div>
            <p className="text-gray-600 mb-4">Gérez vos informations personnelles.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Modifier le profil
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Organisation</h2>
            </div>
            <p className="text-gray-600 mb-4">Paramètres de votre organisation.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Gérer l'organisation
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <p className="text-gray-600 mb-4">Configurez vos préférences de notification.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Gérer les notifications
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
