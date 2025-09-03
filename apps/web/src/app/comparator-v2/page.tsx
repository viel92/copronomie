'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
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
import { useToast } from '@copronomie/ui'

interface DevisAnalysis {
  entreprise: string
  siret?: string
  adresse?: string
  contact?: string
  montant_total: number
  montant_ht?: number
  montant_tva?: number
  taux_tva?: number
  delai_realisation?: string
  garantie?: string
  validite_devis?: string
  modalites_paiement?: string
  items: Array<{
    description: string
    quantite?: number
    unite?: string
    prix_unitaire?: number
    montant_total: number
    categorie?: string
  }>
  analyse_technique?: {
    conformite_reglementaire?: string
    qualite_materiel?: string
    competence_entreprise?: string
    risques_identifies?: string[]
  }
  analyse_financiere?: {
    rapport_qualite_prix?: string
    prix_marche?: string
    optimisations_possibles?: string[]
    cout_par_m2?: number
    cout_par_lot?: number
  }
  analyse_juridique?: {
    assurances?: string
    certifications?: string
    clauses_importantes?: string[]
    points_attention?: string[]
  }
  points_forts: string[]
  points_faibles: string[]
  note_globale: number
  recommandations: string[]
  questions_a_poser?: string[]
  negociation?: {
    marges_negociation?: string
    elements_negociables?: string[]
    arguments?: string[]
  }
}

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
  const [analyses, setAnalyses] = useState<DevisAnalysis[]>([])
  const [comparison, setComparison] = useState<DevisComparison | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  // Cache pour éviter de re-analyser les mêmes fichiers
  const [analysisCache, setAnalysisCache] = useState<Map<string, {analysis: DevisAnalysis, extractedText: string}>>(new Map())
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
    
    if (pdfFiles.length === 0) {
      showToast('Aucun fichier PDF valide détecté', 'warning')
      return
    }
    
    // Validation de taille (10MB max par fichier)
    const validFiles = pdfFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`${file.name} dépasse la limite de 10MB`, 'error')
        return false
      }
      return true
    })
    
    if (validFiles.length !== pdfFiles.length) {
      showToast(`${pdfFiles.length - validFiles.length} fichier(s) ignoré(s) (trop volumineux)`, 'warning')
    }
    
    const newFiles = [...files, ...validFiles].slice(0, 5)
    setFiles(newFiles)
    
    if (validFiles.length > 0) {
      showToast(`${validFiles.length} fichier(s) ajouté(s)`, 'success')
    }
    
    if (newFiles.length >= 5) {
      showToast('Maximum 5 fichiers atteint', 'info')
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf')
    
    // Validation de taille (10MB max par fichier)
    const validFiles = pdfFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`${file.name} dépasse la limite de 10MB`, 'error')
        return false
      }
      return true
    })
    
    if (validFiles.length !== pdfFiles.length) {
      showToast(`${pdfFiles.length - validFiles.length} fichier(s) ignoré(s) (trop volumineux)`, 'warning')
    }
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 5))
    
    if (validFiles.length > 0) {
      showToast(`${validFiles.length} fichier(s) ajouté(s)`, 'success')
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Fonction pour générer une clé de cache simple basée sur le fichier
  const getFileKey = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`
  }

  // Fonction pour analyser un PDF et récupérer l'analyse complète
  const analyzeDevisPDF = async (file: File): Promise<{analysis: DevisAnalysis, extractedText: string}> => {
    // Vérifier le cache d'abord
    const fileKey = getFileKey(file)
    const cached = analysisCache.get(fileKey)
    if (cached) {
      console.log(`📋 Utilisation cache pour ${file.name}`)
      return cached
    }

    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/analyze-devis', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // En développement, on a juste l'extractedText pour debug
      if (process.env.NODE_ENV === 'development' && result.extractedText && !result.analysis) {
        // On fait un deuxième appel pour forcer l'analyse IA
        const analysisResponse = await fetch('/api/analyze-devis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: result.extractedText })
        })
        
        if (!analysisResponse.ok) {
          throw new Error('Erreur lors de l\'analyse IA')
        }
        
        const analysisResult = await analysisResponse.json()
        const finalResult = {
          analysis: analysisResult.analysis,
          extractedText: result.extractedText
        }
        
        // Mettre en cache
        setAnalysisCache(prev => new Map(prev.set(fileKey, finalResult)))
        return finalResult
      }
      
      const finalResult = {
        analysis: result.analysis,
        extractedText: result.extractedText || ''
      }
      
      // Mettre en cache
      setAnalysisCache(prev => new Map(prev.set(fileKey, finalResult)))
      return finalResult
      
    } catch (error) {
      console.error('Erreur analyse PDF:', error)
      throw new Error(`Impossible d'analyser ${file.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
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
      // Étape 1: Analyse des PDFs individuels
      setAnalysisStep('Analyse IA des devis individuels...')
      setAnalysisProgress(10)
      
      const documents: { filename: string; content: string }[] = []
      const individualAnalyses: DevisAnalysis[] = []
      let failedFiles: string[] = []
      
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        try {
          setAnalysisStep(`Analyse IA de ${file.name}...`)
          setAnalysisProgress(10 + (index * 40))
          
          const result = await analyzeDevisPDF(file)
          
          if (result.analysis && result.extractedText?.trim().length > 50) {
            documents.push({
              filename: file.name,
              content: result.extractedText
            })
            individualAnalyses.push(result.analysis)
          } else {
            throw new Error('Analyse insuffisante')
          }
        } catch (error) {
          console.error(`Erreur traitement ${file.name}:`, error)
          failedFiles.push(file.name)
        }
      }
      
      // Stocker les analyses individuelles
      setAnalyses(individualAnalyses)
      
      if (documents.length === 0) {
        throw new Error('Aucun PDF n\'a pu être traité correctement')
      }
      
      if (failedFiles.length > 0) {
        showToast(`${failedFiles.length} fichier(s) ignoré(s): ${failedFiles.join(', ')}`, 'warning')
      }
      
      if (documents.length < 2) {
        throw new Error('Au moins 2 devis valides sont requis pour la comparaison')
      }

      // Étape 2: Analyse IA
      setAnalysisStep(`Analyse comparative de ${documents.length} devis par l'intelligence artificielle...`)
      setAnalysisProgress(60)

      const response = await fetch('/api/compare-devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erreur ${response.status}: Analyse IA impossible`)
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
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la comparaison'
      setError(errorMessage)
      showToast(errorMessage, 'error')
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
    <DashboardLayout>
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
            <div className="space-y-2">
              <p className="text-sm text-slate-500">
                Fichiers PDF uniquement • Maximum 10MB par fichier • 2-5 devis
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <FileCheck className="h-3 w-3" />
                  PDF supportés
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~2min d'analyse
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  IA GPT-4
                </span>
              </div>
            </div>
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
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-200 group hover:shadow-md transform hover:-translate-y-0.5">
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
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
                    title="Supprimer ce fichier"
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
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-size-200 bg-pos-0 rounded-full transition-all duration-500 animate-gradient-x"
                    style={{ width: `${analysisProgress}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Erreur de traitement</h4>
                    <p className="text-red-800 text-sm">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Masquer cette erreur
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Individual Analysis Section */}
      {analyses.length > 0 && (
        <div className="space-y-8 animate-slide-up">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <BarChart3 className="h-7 w-7 text-blue-600" />
              Analyses Détaillées des Devis ({analyses.length})
            </h2>
            
            <div className="grid gap-8">
              {analyses.map((analysis, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{analysis.entreprise}</h3>
                        {analysis.contact && (
                          <p className="text-sm text-slate-600">{analysis.contact}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          {formatPrice(analysis.montant_total)}
                        </p>
                        {analysis.montant_ht && (
                          <p className="text-sm text-slate-600">
                            HT: {formatPrice(analysis.montant_ht)}
                          </p>
                        )}
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getScoreColor(analysis.note_globale)}`}>
                          {analysis.note_globale}/10
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Informations Générales */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Informations Générales</h4>
                          <div className="space-y-2 text-sm">
                            {analysis.delai_realisation && (
                              <p><span className="font-medium">Délai:</span> {analysis.delai_realisation}</p>
                            )}
                            {analysis.garantie && (
                              <p><span className="font-medium">Garantie:</span> {analysis.garantie}</p>
                            )}
                            {analysis.validite_devis && (
                              <p><span className="font-medium">Validité:</span> {analysis.validite_devis}</p>
                            )}
                            {analysis.modalites_paiement && (
                              <p><span className="font-medium">Paiement:</span> {analysis.modalites_paiement}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Analyse Technique */}
                        {analysis.analyse_technique && (
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3">Analyse Technique</h4>
                            <div className="space-y-2 text-sm">
                              {analysis.analyse_technique.conformite_reglementaire && (
                                <p><span className="font-medium">Conformité:</span> {analysis.analyse_technique.conformite_reglementaire}</p>
                              )}
                              {analysis.analyse_technique.qualite_materiel && (
                                <p><span className="font-medium">Matériel:</span> {analysis.analyse_technique.qualite_materiel}</p>
                              )}
                              {analysis.analyse_technique.competence_entreprise && (
                                <p><span className="font-medium">Compétences:</span> {analysis.analyse_technique.competence_entreprise}</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Analyse Financière */}
                        {analysis.analyse_financiere && (
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3">Analyse Financière</h4>
                            <div className="space-y-2 text-sm">
                              {analysis.analyse_financiere.rapport_qualite_prix && (
                                <p><span className="font-medium">Qualité/Prix:</span> {analysis.analyse_financiere.rapport_qualite_prix}</p>
                              )}
                              {analysis.analyse_financiere.prix_marche && (
                                <p><span className="font-medium">Prix marché:</span> {analysis.analyse_financiere.prix_marche}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Points Forts/Faibles */}
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-3">Points Forts</h4>
                            <ul className="space-y-2">
                              {analysis.points_forts?.map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-3">Points Faibles</h4>
                            <ul className="space-y-2">
                              {analysis.points_faibles?.map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {/* Recommandations */}
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-3">Recommandations</h4>
                          <ul className="space-y-2">
                            {analysis.recommandations?.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Négociation */}
                        {analysis.negociation && (
                          <div>
                            <h4 className="font-semibold text-purple-700 mb-3">Aide à la Négociation</h4>
                            <div className="space-y-3 text-sm">
                              {analysis.negociation.marges_negociation && (
                                <div>
                                  <span className="font-medium">Marges:</span> {analysis.negociation.marges_negociation}
                                </div>
                              )}
                              {analysis.negociation.elements_negociables && analysis.negociation.elements_negociables.length > 0 && (
                                <div>
                                  <span className="font-medium">Éléments négociables:</span>
                                  <ul className="list-disc list-inside text-slate-600 ml-4 mt-1">
                                    {analysis.negociation.elements_negociables!.map((elem, i) => (
                                      <li key={i}>{elem}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Questions à Poser */}
                    {analysis.questions_a_poser && analysis.questions_a_poser.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <h4 className="font-semibold text-slate-900 mb-3">Questions à Poser à l'Entreprise</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {analysis.questions_a_poser!.map((question, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="font-medium text-blue-600">{i + 1}.</span>
                              {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {comparison && (
        <div id="comparison-results" className="space-y-8 animate-slide-up">
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
    </DashboardLayout>
  )
}