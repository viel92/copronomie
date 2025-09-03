/**
 * API d'analyse de devis PDF - Production Ready
 * 
 * @version 2.0.0
 * @date 2025-09-03
 * @author Claude Code
 * 
 * Fonctionnalités:
 * - Extraction PDF robuste avec fallbacks multiples
 * - Validation sécurisée des fichiers
 * - Gestion d'erreurs gracieuse
 * - Logging structuré pour production
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import OpenAI from 'openai'
import { extractPdfText, validatePdfBuffer } from '@/lib/pdf-extract'

// Forcer le runtime Node.js pour cette route (pas Edge)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // Pour les uploads de fichiers

// Initialiser OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

export async function POST(request: NextRequest) {
  console.log('=== DEBUT API analyze-devis ===')
  return withAuth(request, async (request, supabase, user) => {
    try {
      console.log('Auth réussie, user:', user.id)
      
      // Détection du type de contenu
      const contentType = request.headers.get('content-type') || ''
      console.log('Content-Type reçu:', contentType)
      
      let body: any = {}
      let analysisText = ''
      
      // Si c'est du multipart/form-data (upload de fichier)
      if (contentType.includes('multipart/form-data')) {
        console.log('[ANALYZE-DEVIS] Traitement multipart/form-data')
        
        try {
          const formData = await request.formData()
          const file = formData.get('file') as File
          
          // Validation du fichier
          if (!file) {
            throw new Error('Aucun fichier fourni')
          }
          
          if (file.type !== 'application/pdf') {
            throw new Error(`Type de fichier non supporté: ${file.type}. PDF uniquement.`)
          }
          
          console.log(`[ANALYZE-DEVIS] Fichier reçu: ${file.name} (${Math.round(file.size/1024)}KB)`)
          
          // Convertir en ArrayBuffer pour validation
          const arrayBuffer = await file.arrayBuffer()
          
          // Validation robuste du PDF
          const validation = validatePdfBuffer(arrayBuffer)
          if (!validation.valid) {
            throw new Error(validation.error)
          }
          
          // Extraction du texte avec gestion d'erreur robuste
          console.log('[ANALYZE-DEVIS] Début extraction PDF...')
          analysisText = await extractPdfText(arrayBuffer)
          
          if (!analysisText || analysisText.trim().length < 20) {
            throw new Error('Contenu PDF insuffisant pour l\'analyse')
          }
          
          console.log(`[ANALYZE-DEVIS] Extraction réussie: ${analysisText.length} caractères`)
          
          // Mode développement désactivé - forcer analyse IA complète
          // if (process.env.NODE_ENV === 'development') {
          //   return NextResponse.json({
          //     success: true,
          //     message: 'Extraction PDF réussie',
          //     extractedText: analysisText,
          //     fileInfo: {
          //       name: file.name,
          //       size: file.size,
          //       textLength: analysisText.length,
          //       preview: analysisText.substring(0, 300) + '...'
          //     }
          //   })
          // }
          
        } catch (formError) {
          console.error('[ANALYZE-DEVIS] Erreur extraction:', formError)
          return NextResponse.json({
            success: false,
            error: formError instanceof Error ? formError.message : 'Erreur lors du traitement du fichier',
            details: process.env.NODE_ENV === 'development' ? {
              stack: formError instanceof Error ? formError.stack : undefined
            } : undefined
          }, { status: 400 })
        }
      } 
      // Si c'est du JSON
      else {
        console.log('Traitement JSON')
        try {
          body = await request.json()
          console.log('Body JSON parsé:', { documentId: body.documentId, hasText: !!body.text })
          analysisText = body.text || ''
        } catch (jsonError) {
          console.error('Erreur parsing JSON:', jsonError)
          return NextResponse.json(
            { error: 'Format JSON invalide' },
            { status: 400 }
          )
        }
      }
      
      const { documentId, documentUrl } = body

      // Si on n'a pas de texte directement et pas de documentId/URL non plus
      if (!analysisText && !documentId && !documentUrl) {
        console.log('Erreur: Aucune donnée à analyser')
        return NextResponse.json(
          { error: 'Document ID, URL ou texte requis pour l\'analyse' },
          { status: 400 }
        )
      }
      
      // Si on a un documentId, récupérer le document depuis la DB
      if (documentId) {
        console.log('Recherche document ID:', documentId, 'pour user:', user.id)
        const { data: document, error: docError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .eq('uploaded_by', user.id)
          .single()

        if (docError || !document) {
          console.log('Document non trouvé:', { docError, document })
          return NextResponse.json(
            { error: 'Document non trouvé ou accès refusé' },
            { status: 404 }
          )
        }
        console.log('Document trouvé:', { id: document.id, type: document.type, hasFilePath: !!document.file_path })

        // Extraire le texte du PDF si c'est un PDF
        if (document.type === 'application/pdf' && document.file_path) {
          try {
            console.log('Début extraction PDF pour document:', document.id)
            
            // Télécharger le fichier depuis Supabase Storage
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('devis-documents')
              .download(document.file_path)

            if (downloadError) {
              console.error('Erreur téléchargement Supabase:', downloadError)
              throw new Error(`Erreur téléchargement: ${downloadError.message}`)
            }
            console.log('Fichier téléchargé, taille:', fileData.size)

            // Convertir le blob en buffer
            const arrayBuffer = await fileData.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            console.log('Buffer créé, taille:', buffer.length)

            // Tenter l'extraction avec module dédié (évite hoisting Turbopack)
            console.log('Extraction PDF avec module isolé...')
            
            analysisText = await extractPdfText(arrayBuffer)
            console.log('Texte extrait du PDF, longueur:', analysisText.length)

            if (!analysisText || analysisText.trim().length === 0) {
              throw new Error('Texte PDF vide après extraction')
            }

          } catch (pdfError) {
            console.error('Erreur détaillée extraction PDF:', {
              error: pdfError,
              message: pdfError instanceof Error ? pdfError.message : 'Erreur inconnue',
              stack: pdfError instanceof Error ? pdfError.stack : undefined,
              documentId: document.id,
              filePath: document.file_path
            })
            return NextResponse.json(
              { 
                error: `Erreur extraction PDF: ${pdfError instanceof Error ? pdfError.message : 'Erreur inconnue'}`,
                details: pdfError instanceof Error ? pdfError.stack : JSON.stringify(pdfError),
                documentId: document.id
              },
              { status: 500 }
            )
          }
        } else {
          // Pour les autres types de fichiers ou si pas de file_path
          analysisText = analysisText || `Analyse du document: ${document.name}`
        }
      }

      if (!analysisText || analysisText.trim().length === 0) {
        return NextResponse.json(
          { error: 'Impossible d\'extraire le texte du document' },
          { status: 400 }
        )
      }

      // Prompt expert pour analyse approfondie de devis copropriété
      const systemPrompt = `Tu es un consultant expert en gestion de copropriétés avec 15 ans d'expérience. Tu analyses les devis de travaux pour aider les syndics à prendre les meilleures décisions.

      RÈGLES STRICTES - NE PAS HALLUCINER :
      - Base-toi UNIQUEMENT sur les informations présentes dans le devis
      - Si une information n'est PAS dans le devis, indique "non mentionné" ou "non spécifié"  
      - N'invente JAMAIS d'informations sur la réputation, l'expérience ou les certifications d'une entreprise
      - Ne fais PAS de comparaisons de prix avec "le marché" sans données concrètes
      - Reste factuel et évite les généralités

      Analyse le devis fourni de manière exhaustive et fournis un rapport détaillé au format JSON strict :

      {
        "entreprise": "nom de l'entreprise",
        "siret": "numéro SIRET si disponible",
        "adresse": "adresse complète si disponible",
        "contact": "nom du contact et téléphone/email",
        "montant_total": nombre_en_euros,
        "montant_ht": nombre_ht_si_disponible,
        "montant_tva": nombre_tva_si_disponible,
        "taux_tva": pourcentage_tva_si_disponible,
        "delai_realisation": "délai précis avec unité ou 'non spécifié'",
        "garantie": "période et type de garantie ou 'non spécifiée'",
        "validite_devis": "durée de validité du devis ou 'non spécifiée'",
        "modalites_paiement": "conditions de paiement détaillées ou 'non spécifiées'",
        "items": [
          {
            "description": "description détaillée du poste",
            "quantite": nombre_si_disponible,
            "unite": "unité de mesure",
            "prix_unitaire": prix_unitaire_si_disponible,
            "montant_total": montant_du_poste,
            "categorie": "main d'œuvre|matériaux|équipement|autre"
          }
        ],
        "analyse_technique": {
          "conformite_reglementaire": "évaluation basée sur les spécifications du devis uniquement",
          "qualite_materiel": "évaluation basée sur les références/marques mentionnées",
          "competence_entreprise": "évaluation basée sur les informations du devis uniquement",
          "risques_identifies": ["risques identifiables depuis le devis"]
        },
        "analyse_financiere": {
          "rapport_qualite_prix": "évaluation basée sur les éléments fournis",
          "prix_marche": "analyse basée sur les informations disponibles",
          "optimisations_possibles": ["optimisations concrètes basées sur le devis"],
          "cout_par_m2": nombre_si_applicable,
          "cout_par_lot": nombre_si_applicable
        },
        "analyse_juridique": {
          "assurances": "mention exacte des assurances dans le devis ou 'non mentionnées'",
          "certifications": "certifications mentionnées dans le devis ou 'non mentionnées'",
          "clauses_importantes": ["clauses réellement présentes dans le devis"],
          "points_attention": ["points d'attention basés sur l'analyse du devis"]
        },
        "points_forts": [
          "points forts basés sur les éléments concrets du devis"
        ],
        "points_faibles": [
          "points faibles identifiés dans le devis (manques, imprécisions)"
        ],
        "note_globale": note_entière_sur_10,
        "recommandations": [
          "recommandations basées sur l'analyse factuelle du devis"
        ],
        "questions_a_poser": [
          "questions sur les points non précisés dans le devis"
        ],
        "negociation": {
          "marges_negociation": "estimation basée sur l'analyse des postes",
          "elements_negociables": ["éléments identifiés comme négociables"],
          "arguments": ["arguments basés sur l'analyse factuelle du devis"]
        }
      }

      Sois très précis, factuel et orienté aide à la décision. N'invente aucune information.`

      console.log('Début appel OpenAI, texte longueur:', analysisText.length)
      
      // Appel à OpenAI GPT-4o-mini optimisé coût/performance
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Bon compromis performance/coût (20x moins cher)
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Here is the devis to analyze comprehensively:\n\n${analysisText}`
          }
        ],
        max_tokens: 3000, // Optimisé pour analyse complète mais maîtrisée
        temperature: 0.1, // Faible température pour plus de consistance
      })

      console.log('Réponse OpenAI reçue, tokens:', completion.usage?.total_tokens)
      const analysisContent = completion.choices[0]?.message?.content
      console.log('Contenu analyse IA:', analysisContent?.substring(0, 200) + '...')

      if (!analysisContent) {
        console.log('Pas de contenu dans la réponse OpenAI')
        return NextResponse.json(
          { error: 'Erreur lors de l\'analyse IA' },
          { status: 500 }
        )
      }

      // Parser la réponse JSON
      let analysis: DevisAnalysis
      try {
        console.log('Tentative parsing JSON...')
        
        // Nettoyer le contenu JSON (enlever les backticks markdown et texte d'intro)
        let cleanedContent = analysisContent.trim()
        
        // Enlever "Voici l'analyse exhaustive..." au début si présent
        if (cleanedContent.startsWith('Voici')) {
          const jsonStart = cleanedContent.indexOf('```json')
          if (jsonStart !== -1) {
            cleanedContent = cleanedContent.substring(jsonStart)
          }
        }
        
        // Enlever les backticks markdown
        if (cleanedContent.startsWith('```json')) {
          cleanedContent = cleanedContent.replace('```json', '').replace(/```$/, '').trim()
        } else if (cleanedContent.startsWith('```')) {
          cleanedContent = cleanedContent.replace(/^```[a-z]*/, '').replace(/```$/, '').trim()
        }
        
        // Extraire seulement le JSON valide (enlever le texte après le JSON)
        try {
          // Trouver la fin du JSON en comptant les accolades
          let braceCount = 0
          let jsonEnd = -1
          let inString = false
          let escapeNext = false
          
          for (let i = 0; i < cleanedContent.length; i++) {
            const char = cleanedContent[i]
            
            if (escapeNext) {
              escapeNext = false
              continue
            }
            
            if (char === '\\') {
              escapeNext = true
              continue
            }
            
            if (char === '"' && !escapeNext) {
              inString = !inString
              continue
            }
            
            if (!inString) {
              if (char === '{') {
                braceCount++
              } else if (char === '}') {
                braceCount--
                if (braceCount === 0) {
                  jsonEnd = i + 1
                  break
                }
              }
            }
          }
          
          if (jsonEnd > 0) {
            cleanedContent = cleanedContent.substring(0, jsonEnd).trim()
          }
        } catch (extractError) {
          console.log('Erreur extraction JSON, utilisation du contenu complet')
        }
        
        console.log('Contenu nettoyé pour parsing:', cleanedContent.substring(0, 200) + '...')
        analysis = JSON.parse(cleanedContent)
        console.log('JSON parsé avec succès, entreprise:', analysis.entreprise, 'montant:', analysis.montant_total)
      } catch (parseError) {
        console.error('Erreur parsing JSON OpenAI:', parseError)
        console.error('Contenu brut reçu:', analysisContent)
        return NextResponse.json(
          { 
            error: 'Erreur format réponse IA',
            rawContent: analysisContent.substring(0, 500)
          },
          { status: 500 }
        )
      }

      // Normaliser le contact en string si c'est un objet
      let contactString = analysis.contact
      if (typeof analysis.contact === 'object' && analysis.contact !== null) {
        const contactObj = analysis.contact as {
          nom?: string;
          telephone?: string; 
          email?: string;
        };
        if (contactObj.nom || contactObj.telephone || contactObj.email) {
          const contactParts = []
          if (contactObj.nom) contactParts.push(contactObj.nom)
          if (contactObj.telephone) contactParts.push(contactObj.telephone)
          if (contactObj.email) contactParts.push(contactObj.email)
          contactString = contactParts.join(' - ')
        } else {
          contactString = JSON.stringify(analysis.contact)
        }
      }

      // Sauvegarder l'analyse en base de données avec contact normalisé
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('devis_analyses')
        .insert({
          document_id: documentId,
          user_id: user.id,
          entreprise: analysis.entreprise,
          contact: contactString,
          montant_total: analysis.montant_total,
          montant_ht: analysis.montant_ht,
          montant_tva: analysis.montant_tva,
          taux_tva: analysis.taux_tva,
          delai_realisation: analysis.delai_realisation,
          garantie: analysis.garantie,
          items: analysis.items,
          points_positifs: analysis.points_forts,
          points_negatifs: analysis.points_faibles,
          note_globale: Math.round(Number(analysis.note_globale)) || 5, // Force entier
          recommandations: analysis.recommandations,
          raw_analysis: analysisContent,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (saveError) {
        console.error('Erreur sauvegarde analyse:', saveError)
        // On continue même si la sauvegarde échoue, on retourne juste l'analyse
      }

      // Normaliser l'analyse retournée également (pour éviter erreurs React)
      const normalizedAnalysis = {
        ...analysis,
        contact: contactString
      }

      return NextResponse.json({
        message: 'Analyse terminée avec succès',
        analysis: normalizedAnalysis,
        extractedText: analysisText.substring(0, 500) + '...', // Preview du texte extrait
        saved_analysis: savedAnalysis,
        tokens_used: completion.usage?.total_tokens
      })

    } catch (error) {
      console.error('Erreur API analyze-devis:', error)
      
      // Gestion spécifique des erreurs OpenAI
      if (error instanceof OpenAI.APIError) {
        return NextResponse.json(
          { error: `Erreur OpenAI: ${error.message}` },
          { status: error.status || 500 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Erreur serveur lors de l\'analyse',
          details: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      )
    }
  })
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const { searchParams } = new URL(request.url)
      const documentId = searchParams.get('documentId')
      const limit = searchParams.get('limit') || '50'

      let query = supabase
        .from('devis_analyses')
        .select(`
          *,
          documents (
            name,
            original_name,
            url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit))

      if (documentId) {
        query = query.eq('document_id', documentId)
      }

      const { data: analyses, error } = await query

      if (error) {
        console.error('Erreur récupération analyses:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        analyses: analyses || [],
        total: analyses?.length || 0
      })

    } catch (error) {
      console.error('Erreur API analyses GET:', error)
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      )
    }
  })
}