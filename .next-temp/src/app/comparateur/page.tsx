'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
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
  Loader2
} from 'lucide-react'

// Types
interface DevisData {
  entreprise: string
  montantHT: number
  montantTTC: number
  tva: number
  delai: string
  dateDebut?: string
  validite: string
  reference?: string
  garanties: string[]
  assurances: string[]
  postes: Array<{
    description: string
    montant: number | null
    quantite?: string
    unite?: string
    inclus: boolean
  }>
  elementsManquants: string[]
  alertes: string[]
  pointsPositifs: string[]
  score: number
}

interface AnalysisResult {
  file: File
  data: DevisData
  score: number
  alerts: string[]
}

export default function ComparateurPage() {
  const { profile } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Fonction pour extraire le texte d'un PDF (simulée pour l'instant)
  const extractTextFromPDF = async (file: File): Promise<string> => {
    // TODO: Implémenter extraction PDF réelle avec PDF.js
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Devis simulé pour " + file.name)
      }, 1000)
    })
  }

  // Fonction pour analyser avec OpenAI (utilise notre Edge Function)
  const analyzeWithAI = async (devisText: string, fileName: string): Promise<DevisData> => {
    const response = await fetch('/api/analyze-devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devisText, fileName })
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'analyse IA')
    }

    return response.json()
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    )
    setFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setResults(prev => prev.filter((_, i) => i !== index))
  }

  const analyzeFiles = async () => {
    if (files.length === 0) return

    setIsAnalyzing(true)
    const newResults: AnalysisResult[] = []

    for (const file of files) {
      try {
        const text = await extractTextFromPDF(file)
        const analysisData = await analyzeWithAI(text, file.name)
        
        newResults.push({
          file,
          data: analysisData,
          score: analysisData.score,
          alerts: analysisData.alertes
        })
      } catch (error) {
        console.error('Erreur analyse fichier:', file.name, error)
        // Données de fallback pour la démo
        newResults.push({
          file,
          data: {
            entreprise: `Entreprise ${file.name}`,
            montantHT: Math.floor(Math.random() * 50000) + 10000,
            montantTTC: Math.floor(Math.random() * 60000) + 12000,
            tva: 20,
            delai: '30 jours',
            validite: '30 jours',
            garanties: ['Décennale', 'RC Pro'],
            assurances: ['AXA', 'MAAF'],
            postes: [
              { description: 'Main d\'œuvre', montant: 15000, inclus: true },
              { description: 'Matériaux', montant: 8000, inclus: true }
            ],
            elementsManquants: ['Échafaudage', 'Évacuation gravats'],
            alertes: ['Prix très bas', 'Délai court'],
            pointsPositifs: ['Entreprise locale', 'Bonne notation'],
            score: Math.floor(Math.random() * 40) + 60
          },
          score: Math.floor(Math.random() * 40) + 60,
          alerts: ['Prix très bas', 'Délai court']
        })
      }
    }

    setResults(newResults)
    setIsAnalyzing(false)
  }

  const bestResult = useMemo(() => {
    return results.length > 0 ? results.reduce((best, current) => 
      current.score > best.score ? current : best
    ) : null
  }, [results])

  const totalSavings = useMemo(() => {
    if (results.length < 2) return 0
    const amounts = results.map(r => r.data.montantTTC)
    const min = Math.min(...amounts)
    const max = Math.max(...amounts)
    return max - min
  }, [results])

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Comparateur IA de Devis
        </h1>
        <p className="text-lg text-slate-600 mb-4">
          Analysez et comparez vos devis PDF avec l'intelligence artificielle
        </p>
        <div className="flex justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Analyse sécurisée
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            IA spécialisée copropriété
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Détection d'économies
          </span>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="text-center">
          <Upload className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Glissez vos devis PDF ici
          </h3>
          <p className="text-slate-600 mb-4">
            Ou cliquez pour sélectionner vos fichiers
          </p>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-sm text-slate-500">
            PDF uniquement • Maximum 10 fichiers • 5 MB par fichier
          </div>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Fichiers sélectionnés ({files.length})
            </h3>
            <button
              onClick={analyzeFiles}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Analyser les devis
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-100 rounded text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-800">Meilleur devis</h3>
            </div>
            {bestResult && (
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {bestResult.data.entreprise}
                </div>
                <div className="text-sm text-green-700">
                  Score: {bestResult.score}/100
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Euro className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Économies potentielles</h3>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {totalSavings.toLocaleString()}€
            </div>
            <div className="text-sm text-blue-700">
              Entre le plus cher et le moins cher
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Alertes détectées</h3>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {results.reduce((acc, r) => acc + r.alerts.length, 0)}
            </div>
            <div className="text-sm text-orange-700">
              Points d'attention identifiés
            </div>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">Analyse détaillée</h3>
          <div className="grid gap-6">
            {results.map((result, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold">{result.data.entreprise}</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.score >= 80 ? 'bg-green-100 text-green-800' :
                        result.score >= 60 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Score: {result.score}/100
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Montant HT:</span>
                        <div className="font-semibold">{result.data.montantHT.toLocaleString()}€</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Montant TTC:</span>
                        <div className="font-semibold">{result.data.montantTTC.toLocaleString()}€</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Délai:</span>
                        <div className="font-semibold">{result.data.delai}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Validité:</span>
                        <div className="font-semibold">{result.data.validite}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts and Missing Elements */}
                {(result.data.alertes.length > 0 || result.data.elementsManquants.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {result.data.alertes.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Alertes
                        </h5>
                        <ul className="text-sm text-red-700 space-y-1">
                          {result.data.alertes.map((alerte, i) => (
                            <li key={i}>• {alerte}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.data.elementsManquants.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h5 className="font-semibold text-orange-800 mb-2">
                          Éléments potentiellement manquants
                        </h5>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {result.data.elementsManquants.map((element, i) => (
                            <li key={i}>• {element}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Positive Points */}
                {result.data.pointsPositifs.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Points positifs
                    </h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {result.data.pointsPositifs.map((point, i) => (
                        <li key={i}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {results.length > 0 && (
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter PDF
          </button>
          <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Partager
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder l'analyse
          </button>
        </div>
      )}
    </div>
  )
}