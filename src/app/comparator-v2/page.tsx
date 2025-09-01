'use client'

import React, { useState, useEffect } from 'react'
import { 
  Upload,
  FileText,
  Trash2,
  Loader2,
  Zap,
  TrendingUp,
  Clock,
  Euro,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Download,
  Save
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useToast } from '../../components/Toast'

interface DevisComparison {
  synthese_executive: {
    entreprise_recommandee: string
    justification: string
    economies_possibles: string
  }
  comparaison_detaillee: {
    entreprise: string
    montant_total: number
    montant_ht?: number
    quantite_materiel: string
    prix_unitaire: string | null
    delai_realisation: string
    materiel_propose: string
    qualite_materiel: string
    prestations_incluses: string[]
    garanties: string[]
    points_forts: string[]
    points_faibles: string[]
    note_sur_10: number
  }[]
  cahier_des_charges: {
    titre: string
    description_generale: string
    postes_travaux: {
      intitule: string
      description: string
      specifications_techniques: string[]
      quantite_estimee: string
    }[]
    criteres_evaluation: string[]
    delai_souhaite: string
    budget_previsionnel: {
      minimum: number
      maximum: number
    }
  }
  analyse_ecarts: {
    ecart_prix_max_min: {
      montant: number
      pourcentage: number
    }
    ecart_delai_max_min: string
    postes_variables: string[]
  }
  recommandations_negociation: string[]
}

export default function ComparatorV2Page() {
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState('')
  const [comparison, setComparison] = useState<DevisComparison | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const { showToast, ToastComponent } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfFiles].slice(0, 5)) // Max 5 files
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfFiles].slice(0, 5))
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Fonction pour extraire le texte d'un PDF via l'API serveur (plus robuste)
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/analyze-devis', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse du PDF')
      }
      
      const result = await response.json()
      return result.extractedText || ''
    } catch (error) {
      console.error('Erreur extraction PDF:', error)
      return `Contenu de ${file.name} (extraction impossible)`
    }
  }

  const compareDevis = async () => {
    if (files.length < 2) {
      setError('Minimum 2 devis requis pour la comparaison')
      return
    }
    
    setIsAnalyzing(true)
    setError(null)
    setAnalysisProgress(0)
    
    try {
      // Étape 1: Extraction des PDFs
      setAnalysisStep('Extraction du texte des PDFs...')
      setAnalysisProgress(20)
      
      const documents = await Promise.all(
        files.map(async (file, index) => {
          setAnalysisStep(`Traitement de ${file.name}...`)
          setAnalysisProgress(20 + (index * 20))
          const content = await extractTextFromPDF(file)
          return {
            filename: file.name,
            content: content
          }
        })
      )

      // Étape 2: Analyse IA
      setAnalysisStep('Analyse comparative par l\'intelligence artificielle...')
      setAnalysisProgress(70)

      const response = await fetch('/api/compare-devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la comparaison')
      }

      // Étape 3: Finalisation
      setAnalysisStep('Génération du rapport de comparaison...')
      setAnalysisProgress(90)

      const result = await response.json()
      setComparison(result.comparison)
      
      setAnalysisProgress(100)
      setAnalysisStep('Analyse terminée !')
      
      showToast('Comparaison réalisée avec succès !', 'success')
      
    } catch (err) {
      console.error('Erreur comparaison:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      showToast('Erreur lors de la comparaison', 'error')
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisProgress(0)
        setAnalysisStep('')
      }, 1000)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const exportToPDF = async () => {
    if (!comparison) return
    
    setIsExporting(true)
    try {
      const resultsElement = document.getElementById('comparison-results')
      if (!resultsElement) throw new Error('Élément résultats introuvable')
      
      // Configuration pour une meilleure qualité
      const canvas = await html2canvas(resultsElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      // Nom du fichier avec date
      const date = new Date().toLocaleDateString('fr-FR')
      const filename = `Comparaison_Devis_${date.replace(/\//g, '-')}.pdf`
      
      pdf.save(filename)
      showToast('Rapport PDF exporté avec succès !', 'success')
      
    } catch (error) {
      console.error('Erreur export PDF:', error)
      showToast('Erreur lors de l\'export PDF', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const saveComparison = async () => {
    if (!comparison) return
    
    try {
      const response = await fetch('/api/comparisons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: comparison,
          files_count: files.length,
          created_at: new Date().toISOString()
        }),
      })
      
      if (response.ok) {
        showToast('Comparaison sauvegardée !', 'success')
      } else {
        throw new Error('Erreur de sauvegarde')
      }
    } catch (error) {
      showToast('Erreur lors de la sauvegarde', 'error')
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Comparateur IA Intelligent</h1>
          <p className="text-slate-600 text-lg">
            Analysez et comparez plusieurs devis simultanément avec notre IA avancée
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Téléchargez vos devis (2-5 documents)
        </h2>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50 scale-105' 
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <div className="space-y-4">
            <p className="text-xl font-semibold text-slate-900">
              Glissez-déposez vos PDFs de devis ici
            </p>
            <p className="text-slate-600">
              ou{' '}
              <label className="text-blue-600 hover:text-blue-500 cursor-pointer font-semibold">
                cliquez pour parcourir
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-sm text-slate-500">
              Fichiers PDF uniquement • Maximum 10MB par fichier • 2-5 devis
            </p>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Devis sélectionnés ({files.length}/5)
            </h3>
            <div className="grid gap-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={compareDevis}
              disabled={isAnalyzing || files.length < 2}
              className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  {analysisStep || 'Analyse comparative en cours...'}
                </>
              ) : (
                <>
                  <BarChart3 className="h-6 w-6" />
                  Comparer les {files.length} devis avec l'IA
                </>
              )}
            </button>

            {/* Barre de progression */}
            {isAnalyzing && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{analysisStep}</span>
                  <span>{analysisProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 animate-pulse-soft"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {comparison && (
        <div id="comparison-results" className="space-y-8">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-green-600" />
              Synthèse Exécutive
            </h2>
            
            <div className="grid grid-cols-1 gap-8 mb-6">
              <div className="bg-white rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-slate-900">Recommandation Experte</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {comparison.synthese_executive.entreprise_recommandee}
                </p>
                <p className="text-lg text-slate-700 mb-3">
                  {comparison.synthese_executive.justification}
                </p>
                <p className="text-sm text-green-700 font-medium">
                  💡 {comparison.synthese_executive.economies_possibles}
                </p>
              </div>

            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Recommandation Globale</h3>
              <p className="text-lg text-slate-700 mb-4">
                {comparison.synthese_executive.justification}
              </p>
              
            </div>
          </div>

          {/* Detailed Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Comparaison Détaillée</h2>
            
            <div className="grid gap-6">
              {comparison.comparaison_detaillee?.map((devis, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">{devis.entreprise}</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            {formatPrice(devis.montant_total)}
                          </p>
                          {devis.montant_ht && (
                            <p className="text-sm text-slate-600">
                              HT: {formatPrice(devis.montant_ht)}
                            </p>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(devis.note_sur_10)}`}>
                          {devis.note_sur_10}/10
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Délai</h4>
                        <p className="text-slate-700">{devis.delai_realisation}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Points Forts</h4>
                        <ul className="space-y-1">
                          {devis.points_forts?.map((point, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">Points Faibles</h4>
                        <ul className="space-y-1">
                          {devis.points_faibles?.map((point, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                              <AlertTriangle className="h-3 w-3 text-orange-500 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {devis.garanties?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-slate-900 mb-2">Garanties</h4>
                        <div className="flex flex-wrap gap-2">
                          {devis.garanties?.map((garantie, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {garantie}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cahier des Charges */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileCheck className="h-7 w-7 text-blue-600" />
              Cahier des Charges Généré
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {comparison.cahier_des_charges.titre}
                </h3>
                <p className="text-slate-700">
                  {comparison.cahier_des_charges.description_generale}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Postes de Travaux</h4>
                <div className="space-y-4">
                  {comparison.cahier_des_charges?.postes_travaux?.map((poste, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <h5 className="font-semibold text-slate-900">{poste.intitule}</h5>
                      <p className="text-slate-700 text-sm mb-2">{poste.description}</p>
                      <p className="text-sm text-blue-600 mb-2">
                        Quantité estimée: {poste.quantite_estimee}
                      </p>
                      <div className="text-sm">
                        <span className="font-medium text-slate-900">Spécifications:</span>
                        <ul className="list-disc list-inside text-slate-600">
                          {poste.specifications_techniques?.map((spec, i) => (
                            <li key={i}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Budget Prévisionnel</h4>
                  <p className="text-lg">
                    <span className="text-green-600 font-bold">
                      {formatPrice(comparison.cahier_des_charges.budget_previsionnel.minimum)}
                    </span>
                    {' - '}
                    <span className="text-orange-600 font-bold">
                      {formatPrice(comparison.cahier_des_charges.budget_previsionnel.maximum)}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Délai Souhaité</h4>
                  <p className="text-lg font-medium text-blue-600">
                    {comparison.cahier_des_charges.delai_souhaite}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Analyse des Écarts */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Analyse des Écarts</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900">Écart de Prix</h4>
                  <p className="text-lg">
                    {formatPrice(comparison.analyse_ecarts.ecart_prix_max_min.montant)}
                    <span className="text-sm text-slate-600 ml-2">
                      ({(Number(comparison.analyse_ecarts.ecart_prix_max_min.pourcentage) || 0).toFixed(1)}%)
                    </span>
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900">Écart de Délai</h4>
                  <p>{comparison.analyse_ecarts.ecart_delai_max_min}</p>
                </div>

                {comparison.analyse_ecarts?.postes_variables?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900">Postes Variables</h4>
                    <ul className="list-disc list-inside text-slate-700">
                      {comparison.analyse_ecarts?.postes_variables?.map((poste, i) => (
                        <li key={i}>{poste}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Recommandations de Négociation */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Recommandations de Négociation</h3>
              
              <ul className="space-y-3">
                {comparison.recommandations_negociation?.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Export Actions */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Rapport de Comparaison</h3>
                <p className="text-slate-600">Exportez cette analyse pour vos réunions</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={saveComparison}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>
                <button 
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isExporting ? 'Export...' : 'Exporter PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {ToastComponent}
    </div>
  )
}