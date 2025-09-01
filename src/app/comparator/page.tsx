'use client'

import React, { useState, useCallback } from 'react'
import { 
  Upload,
  FileText,
  Trash2,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Shield,
  Euro,
  Download,
  Share2,
  Save,
  Loader2,
  Zap
} from 'lucide-react'

interface DevisData {
  entreprise: string
  montant_total: number
  montant_ht?: number
  montant_tva?: number
  taux_tva?: number
  delai_realisation?: string
  garantie?: string
  items: Array<{
    description: string
    quantite?: number
    prix_unitaire?: number
    montant_total: number
  }>
  points_positifs: string[]
  points_negatifs: string[]
  note_globale: number
  recommandations: string[]
}

interface AnalysisResult {
  file: File
  data: DevisData
  documentId?: string
  analysisId?: string
  uploadError?: string
  analysisError?: string
}

export default function ComparatorPage() {
  // Suppression de la vérification d'auth côté client - le middleware s'en charge
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [dragActive, setDragActive] = useState(false)

  // Real analysis function using our APIs
  const analyzeDevis = useCallback(async (file: File): Promise<{ data: DevisData; documentId?: string; analysisId?: string; error?: string }> => {
    try {
      // Step 1: Upload the file
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json()
        throw new Error(uploadError.error || 'Erreur lors de l\'upload')
      }
      
      const uploadResult = await uploadResponse.json()
      const documentId = uploadResult.document.id
      
      // Step 2: Analyze the document with OpenAI
      const analysisResponse = await fetch('/api/analyze-devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId
          // Le texte sera extrait automatiquement par l'API depuis le PDF
        }),
      })
      
      if (!analysisResponse.ok) {
        const analysisError = await analysisResponse.json()
        throw new Error(analysisError.error || 'Erreur lors de l\'analyse IA')
      }
      
      const analysisResult = await analysisResponse.json()
      
      return {
        data: analysisResult.analysis,
        documentId,
        analysisId: analysisResult.saved_analysis?.id
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error)
      throw error
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfFiles])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf')
    setFiles(prev => [...prev, ...pdfFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const analyzeAllFiles = async () => {
    if (files.length === 0) return
    
    setIsAnalyzing(true)
    try {
      const results: AnalysisResult[] = []
      
      for (const file of files) {
        try {
          const analysisResult = await analyzeDevis(file)
          results.push({
            file,
            data: analysisResult.data,
            documentId: analysisResult.documentId,
            analysisId: analysisResult.analysisId
          })
        } catch (error) {
          console.error(`Erreur analyse pour ${file.name}:`, error)
          // Ajouter le résultat avec erreur pour afficher le problème
          results.push({
            file,
            data: {
              entreprise: 'Erreur',
              montant_total: 0,
              items: [],
              points_positifs: [],
              points_negatifs: [],
              note_globale: 0,
              recommandations: []
            },
            analysisError: error instanceof Error ? error.message : 'Erreur inconnue'
          })
        }
      }
      
      // Sort by score descending (note_globale)
      results.sort((a, b) => (b.data.note_globale || 0) - (a.data.note_globale || 0))
      setAnalysisResults(results)
    } catch (error) {
      console.error('Erreur analyse globale:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Zap className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Comparateur IA</h1>
          <p className="text-slate-600">
            Analysez et comparez vos devis automatiquement grâce à l'IA
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Télécharger les devis à comparer
        </h2>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-slate-300 hover:border-slate-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-slate-900">
              Glissez-déposez vos fichiers PDF ici
            </p>
            <p className="text-slate-600">
              ou 
              <label className="ml-1 text-blue-600 hover:text-blue-500 cursor-pointer">
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
              Seuls les fichiers PDF sont acceptés (jusqu'à 10MB chacun)
            </p>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">
              Fichiers sélectionnés ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={analyzeAllFiles}
              disabled={isAnalyzing}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  Analyser avec l'IA ({files.length} devis)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Résultats de l'analyse
            </h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Exporter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Share2 className="h-4 w-4" />
                Partager
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {analysisResults.map((result, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className={`px-6 py-4 ${index === 0 ? 'bg-green-50 border-b border-green-200' : 'bg-slate-50 border-b border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {index === 0 && <TrendingUp className="h-5 w-5 text-green-600" />}
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {result.data.entreprise}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {result.file.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        {formatPrice(result.data.montant_total)}
                      </p>
                      <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(result.data.note_globale * 10)}`}>
                        Score: {result.data.note_globale}/10
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-slate-500">Montant HT</span>
                      <p className="font-medium">{result.data.montant_ht ? formatPrice(result.data.montant_ht) : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">Délai</span>
                      <p className="font-medium">{result.data.delai_realisation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">Garantie</span>
                      <p className="font-medium">{result.data.garantie || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">TVA</span>
                      <p className="font-medium">{result.data.taux_tva ? `${result.data.taux_tva}%` : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    {/* Afficher les erreurs d'analyse si elles existent */}
                    {result.analysisError ? (
                      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <p className="text-sm font-medium text-red-700">Erreur d'analyse</p>
                        </div>
                        <p className="text-sm text-red-600 mt-1">{result.analysisError}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-green-700 mb-2">Points forts</h4>
                          <ul className="space-y-1">
                            {result.data.points_positifs.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-center gap-2 text-sm text-slate-700">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {result.data.points_negatifs.length > 0 && (
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-orange-700 mb-2">Points d'attention</h4>
                            <ul className="space-y-1">
                              {result.data.points_negatifs.map((point, pointIndex) => (
                                <li key={pointIndex} className="flex items-center gap-2 text-sm text-slate-700">
                                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.data.recommandations.length > 0 && (
                          <div className="w-full mt-4">
                            <h4 className="text-sm font-medium text-blue-700 mb-2">Recommandations</h4>
                            <ul className="space-y-1">
                              {result.data.recommandations.map((rec, recIndex) => (
                                <li key={recIndex} className="flex items-start gap-2 text-sm text-slate-700">
                                  <Shield className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Affichage des items/postes du devis */}
                        {result.data.items && result.data.items.length > 0 && (
                          <div className="w-full mt-4">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Détail des postes</h4>
                            <div className="bg-slate-50 rounded-lg p-3">
                              {result.data.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex justify-between items-start py-2 border-b border-slate-200 last:border-b-0">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{item.description}</p>
                                    {item.quantite && item.prix_unitaire && (
                                      <p className="text-xs text-slate-600">
                                        Qté: {item.quantite} × {formatPrice(item.prix_unitaire)}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-slate-900">
                                      {formatPrice(item.montant_total)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}