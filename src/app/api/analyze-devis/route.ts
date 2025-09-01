import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import OpenAI from 'openai'
// Dynamic import to avoid build-time initialization issues

// Initialiser OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface DevisAnalysis {
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

export async function POST(request: NextRequest) {
  console.log('=== DEBUT API analyze-devis ===')
  return withAuth(request, async (request, supabase, user) => {
    try {
      console.log('Auth réussie, user:', user.id)
      
      // Validation et parsing sécurisé du JSON
      let body: any
      try {
        const rawBody = await request.text()
        console.log('Raw body reçu:', rawBody.substring(0, 200) + (rawBody.length > 200 ? '...' : ''))
        body = JSON.parse(rawBody)
        console.log('Body parsé avec succès:', { documentId: body.documentId, hasText: !!body.text })
      } catch (jsonError) {
        console.error('Erreur parsing JSON:', {
          error: jsonError instanceof Error ? jsonError.message : 'Erreur inconnue',
          position: jsonError instanceof SyntaxError ? (jsonError as any).position : undefined
        })
        return NextResponse.json(
          { 
            error: 'Format JSON invalide dans la requête',
            details: jsonError instanceof Error ? jsonError.message : 'Erreur parsing JSON'
          },
          { status: 400 }
        )
      }
      
      const { documentId, documentUrl, text } = body

      if (!documentId && !documentUrl && !text) {
        console.log('Erreur: Paramètres manquants')
        return NextResponse.json(
          { error: 'Document ID, URL ou texte requis pour l\'analyse' },
          { status: 400 }
        )
      }

      let analysisText = text
      
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

            // Tenter l'extraction avec pdfjs-dist
            console.log('Import pdfjs-dist...')
            const pdfjsLib = await import('pdfjs-dist')
            console.log('pdfjs-dist importé')
            
            // Désactiver le worker pour Vercel
            if (pdfjsLib.GlobalWorkerOptions) {
              pdfjsLib.GlobalWorkerOptions.workerSrc = ''
            }
            
            console.log('Chargement du document PDF...')
            const pdf = await pdfjsLib.getDocument({ 
              data: buffer,
              useWorkerFetch: false,
              isEvalSupported: false
            }).promise
            console.log('PDF chargé, pages:', pdf.numPages)
            
            let fullText = ''
            for (let i = 1; i <= pdf.numPages; i++) {
              console.log(`Extraction page ${i}/${pdf.numPages}`)
              const page = await pdf.getPage(i)
              const textContent = await page.getTextContent()
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ')
              fullText += pageText + '\n'
            }
            
            console.log('Texte extrait, longueur:', fullText.length)
            analysisText = fullText

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
          analysisText = text || `Analyse du document: ${document.name}`
        }
      }

      if (!analysisText) {
        return NextResponse.json(
          { error: 'Impossible d\'extraire le texte du document' },
          { status: 400 }
        )
      }

      // Prompt optimisé pour l'analyse de devis
      const systemPrompt = `Tu es un expert en analyse de devis de travaux pour copropriétés. 
      Analyse le devis fourni et extrais les informations suivantes au format JSON strict :

      {
        "entreprise": "nom de l'entreprise",
        "montant_total": nombre_en_euros,
        "montant_ht": nombre_ht_si_disponible,
        "montant_tva": nombre_tva_si_disponible,
        "taux_tva": pourcentage_tva_si_disponible,
        "delai_realisation": "délai indiqué",
        "garantie": "période de garantie",
        "items": [
          {
            "description": "description du poste",
            "quantite": nombre_si_disponible,
            "prix_unitaire": prix_unitaire_si_disponible,
            "montant_total": montant_du_poste
          }
        ],
        "points_positifs": ["point fort 1", "point fort 2"],
        "points_negatifs": ["point faible 1", "point faible 2"],
        "note_globale": note_sur_10,
        "recommandations": ["recommandation 1", "recommandation 2"]
      }

      Sois précis dans l'extraction des montants et quantités. Si une information n'est pas disponible, utilise null.`

      console.log('Début appel OpenAI, texte longueur:', analysisText.length)
      
      // Appel à OpenAI GPT-4
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Plus économique pour l'analyse de texte
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Analyse ce devis :\n\n${analysisText}`
          }
        ],
        max_tokens: 2000,
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
        analysis = JSON.parse(analysisContent)
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

      // Sauvegarder l'analyse en base de données
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('devis_analyses')
        .insert({
          document_id: documentId,
          user_id: user.id,
          entreprise: analysis.entreprise,
          montant_total: analysis.montant_total,
          montant_ht: analysis.montant_ht,
          montant_tva: analysis.montant_tva,
          taux_tva: analysis.taux_tva,
          delai_realisation: analysis.delai_realisation,
          garantie: analysis.garantie,
          items: analysis.items,
          points_positifs: analysis.points_positifs,
          points_negatifs: analysis.points_negatifs,
          note_globale: analysis.note_globale,
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

      return NextResponse.json({
        message: 'Analyse terminée avec succès',
        analysis: analysis,
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