'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  MessageSquare,
  FileText,
  Download,
  Send,
  Building,
  Calendar,
  Euro,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react'

export default function ConsultationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [newMessage, setNewMessage] = useState('')

  // Mock data
  const consultation = {
    id: parseInt(params.id as string),
    title: 'Réfection façade - Résidence Montparnasse',
    copropriete: 'Résidence Montparnasse',
    lots: 156,
    type: 'Travaux',
    status: 'En cours',
    description: 'Réfection complète de la façade Sud avec nettoyage, réparation des fissures et application d\'une nouvelle peinture. Travaux à réaliser en respectant les normes thermiques en vigueur.',
    budget: '85,000€',
    deadline: '2024-12-15',
    created: '2024-11-20',
    documents: [
      { name: 'Plans façade.pdf', size: '2.3 MB', type: 'pdf' },
      { name: 'Photos existant.jpg', size: '1.8 MB', type: 'image' },
      { name: 'Diagnostic.pdf', size: '890 KB', type: 'pdf' }
    ]
  }

  const devis = [
    {
      id: 1,
      entreprise: 'BTP Solutions',
      amount: '78,500€',
      received: '2024-11-22',
      deadline: '45 jours',
      guarantee: '10 ans',
      status: 'Analysé',
      score: 85,
      highlights: ['Prix compétitif', 'Garantie étendue', 'Références solides'],
      alerts: ['Délai serré']
    },
    {
      id: 2,
      entreprise: 'Réno Expert',
      amount: '82,200€',
      received: '2024-11-23',
      deadline: '60 jours',
      guarantee: '5 ans',
      status: 'En attente',
      score: 72,
      highlights: ['Délai confortable'],
      alerts: ['Prix élevé', 'Garantie courte']
    }
  ]

  const messages = [
    {
      id: 1,
      sender: 'Marc Dupont',
      role: 'Gestionnaire',
      content: 'Bonjour, pouvez-vous préciser le type de peinture utilisée ?',
      timestamp: '2024-11-23 14:30',
      isOwn: true
    },
    {
      id: 2,
      sender: 'BTP Solutions',
      role: 'Entreprise',
      content: 'Nous utilisons une peinture acrylique haute qualité avec protection anti-UV, garantie 10 ans.',
      timestamp: '2024-11-23 15:45',
      isOwn: false
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Eye },
    { id: 'devis', name: 'Devis reçus', icon: FileText, badge: devis.length },
    { id: 'messages', name: 'Messages', icon: MessageSquare, badge: messages.length },
  ]

  const sendMessage = () => {
    if (!newMessage.trim()) return
    // Logique d'envoi du message
    setNewMessage('')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Infos générales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Copropriété</span>
                </div>
                <p className="font-semibold text-slate-900">{consultation.copropriete}</p>
                <p className="text-sm text-slate-600">{consultation.lots} lots</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Budget estimé</span>
                </div>
                <p className="font-semibold text-slate-900">{consultation.budget}</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Échéance</span>
                </div>
                <p className="font-semibold text-slate-900">{consultation.deadline}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700">{consultation.description}</p>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Documents joints</h3>
              <div className="grid gap-3">
                {consultation.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900">{doc.name}</p>
                        <p className="text-sm text-slate-600">{doc.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'devis':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Devis reçus</h3>
              <span className="text-sm text-slate-600">{devis.length} sur 5 entreprises consultées</span>
            </div>

            <div className="grid gap-6">
              {devis.map((devisItem) => (
                <div key={devisItem.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{devisItem.entreprise}</h4>
                        <p className="text-sm text-slate-600">Reçu le {devisItem.received}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">{devisItem.amount}</p>
                        <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          devisItem.score >= 80 ? 'bg-green-100 text-green-800' :
                          devisItem.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Score: {devisItem.score}/100
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-slate-500">Délai</span>
                        <p className="font-medium">{devisItem.deadline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500">Garantie</span>
                        <p className="font-medium">{devisItem.guarantee}</p>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500">Statut</span>
                        <p className="font-medium">{devisItem.status}</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-green-700 mb-2">Points forts</h5>
                        <ul className="space-y-1">
                          {devisItem.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-orange-700 mb-2">Points d'attention</h5>
                        <ul className="space-y-1">
                          {devisItem.alerts.map((alert, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {alert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'messages':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Communication</h3>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{message.sender}</span>
                        <span className="text-xs opacity-75">({message.role})</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/consultations"
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{consultation.title}</h1>
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {consultation.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {consultation.copropriete} • Créé le {consultation.created}
          </p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
          Générer rapport AG
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                  {tab.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}