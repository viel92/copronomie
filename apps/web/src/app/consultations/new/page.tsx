'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Upload, 
  X, 
  FileText, 
  Building,
  Calendar,
  Euro,
  Users,
  CheckCircle,
  Save,
  Send
} from 'lucide-react'

export default function CreateConsultationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    copropriete: '',
    type: '',
    description: '',
    budget: '',
    deadline: '',
    documents: [] as any[]
  })

  const coproprietes = [
    { id: 1, name: 'Résidence Montparnasse', lots: 156 },
    { id: 2, name: 'Villa des Roses', lots: 32 },
    { id: 3, name: 'Résidence du Parc', lots: 89 },
    { id: 4, name: 'Les Jardins de Sophie', lots: 78 }
  ]

  const consultationTypes = [
    { id: 'travaux', name: 'Travaux', description: 'Rénovation, réparation, amélioration' },
    { id: 'maintenance', name: 'Maintenance', description: 'Entretien préventif et curatif' },
    { id: 'service', name: 'Service', description: 'Nettoyage, gardiennage, sécurité' },
    { id: 'assurance', name: 'Assurance', description: 'Couverture multirisques' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }))
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }))
  }

  const removeDocument = (id: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }))
  }

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true)
    
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirection vers la liste des consultations
      router.push('/consultations')
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isFormValid = formData.title && formData.copropriete && formData.type && formData.description

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
          <h1 className="text-3xl font-bold text-slate-900">Nouvelle consultation</h1>
          <p className="mt-1 text-sm text-slate-600">
            Créez une nouvelle mise en concurrence pour vos travaux
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations générales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Titre de la consultation *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Réfection façade - Résidence Montparnasse"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Copropriété *
                </label>
                <select
                  value={formData.copropriete}
                  onChange={(e) => handleInputChange('copropriete', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une copropriété</option>
                  {coproprietes.map((copro) => (
                    <option key={copro.id} value={copro.name}>
                      {copro.name} ({copro.lots} lots)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type de consultation *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  {consultationTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Budget estimé
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="85 000"
                    className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Euro className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date limite de réponse
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Description des travaux</h2>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez précisément les travaux à réaliser, les contraintes techniques, les normes à respecter..."
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Documents joints</h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">
                      Cliquez pour télécharger des fichiers
                    </span>
                    <span className="text-slate-500"> ou glissez-déposez</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleDocumentUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  PDF, DOC, JPG, PNG jusqu'à 10MB chacun
                </p>
              </div>
            </div>

            {formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Fichiers sélectionnés :</h4>
                {formData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900">{doc.name}</p>
                        <p className="text-sm text-slate-600">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/consultations"
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Annuler
            </Link>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || !formData.title}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                Enregistrer brouillon
              </button>
              
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !isFormValid}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? 'Création...' : 'Publier consultation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}