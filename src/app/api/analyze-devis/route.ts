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
  return withAuth(request, async (request, supabase, user) => {
    try {
      const body = await request.json()
      const { documentId, documentUrl, text } = body

      if (!documentId && !documentUrl && !text) {
        return NextResponse.json(
          { error: 'Document ID, URL ou texte requis pour l\'analyse' },
          { status: 400 }
        )
      }

      let analysisText = text
      
      // Si on a un documentId, récupérer le document depuis la DB
      if (documentId) {
        const { data: document, error: docError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .eq('uploaded_by', user.id)
          .single()

        if (docError || !document) {
          return NextResponse.json(
            { error: 'Document non trouvé ou accès refusé' },
            { status: 404 }
          )
        }

        // Extraire le texte du PDF si c'est un PDF
        if (document.type === 'application/pdf' && document.file_path) {
          try {
            // Télécharger le fichier depuis Supabase Storage
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('devis-documents')
              .download(document.file_path)

            if (downloadError) {
              throw new Error(`Erreur téléchargement: ${downloadError.message}`)
            }

            // Convertir le blob en buffer
            const arrayBuffer = await fileData.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Extraire le texte avec pdf-parse (dynamic import)
            const pdf = (await import('pdf-parse')).default
            const pdfData = await pdf(buffer)
            analysisText = pdfData.text

            if (!analysisText || analysisText.trim().length === 0) {
              throw new Error('Impossible d\'extraire le texte du PDF')
            }

          } catch (pdfError) {
            console.error('Erreur extraction PDF:', pdfError)
            return NextResponse.json(
              { error: `Erreur extraction PDF: ${pdfError instanceof Error ? pdfError.message : 'Erreur inconnue'}` },
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

      const analysisContent = completion.choices[0]?.message?.content

      if (!analysisContent) {
        return NextResponse.json(
          { error: 'Erreur lors de l\'analyse IA' },
          { status: 500 }
        )
      }

      // Parser la réponse JSON
      let analysis: DevisAnalysis
      try {
        analysis = JSON.parse(analysisContent)
      } catch (parseError) {
        console.error('Erreur parsing JSON OpenAI:', parseError)
        return NextResponse.json(
          { error: 'Erreur format réponse IA' },
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
        { error: 'Erreur serveur lors de l\'analyse' },
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