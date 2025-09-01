import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface DevisComparison {
  synthese_executive: {
    entreprise_recommandee: string
    justification: string
    economies_possibles: string
  }
  comparaison_detaillee: {
    entreprise: string
    montant_total: number
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

export async function POST(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const body = await request.json()
      const { documents } = body
      
      if (!documents || !Array.isArray(documents)) {
        return NextResponse.json(
          { error: 'Format invalide - documents requis' },
          { status: 400 }
        )
      }

      if (documents.length === 0) {
        return NextResponse.json(
          { error: 'Aucun document fourni' },
          { status: 400 }
        )
      }

      if (documents.length > 5) {
        return NextResponse.json(
          { error: 'Maximum 5 devis peuvent être comparés' },
          { status: 400 }
        )
      }

      // Les documents contiennent déjà le texte extrait côté client
      const documentsTextes = documents.map((doc: any) => ({
        filename: doc.filename,
        content: doc.content
      }))

      // Prompt simplifié et robuste
      const systemPrompt = `Tu es un expert en analyse de devis. Compare ${documents.length} devis et analyse-les objectivement.

      RÈGLES ABSOLUES :
      - Si une info est absente du devis, mets null ou "Non précisé"
      - Ne jamais inventer d'informations
      - Être factuel et précis
      - Calculer prix unitaire si possible (€/caméra, €/m², etc.)
      - Noter les différences importantes de quantité ou qualité

      BARÈME NOTES (sur 10) :
      - Prix compétitif : 0-4 points
      - Qualité matériel : 0-3 points  
      - Services/garanties : 0-2 points
      - Délais : 0-1 point

      Réponds UNIQUEMENT en JSON valide, sans texte avant/après :

      {
        "synthese_executive": {
          "entreprise_recommandee": "nom entreprise",
          "justification": "Raison courte du choix (ex: Meilleur rapport qualité/prix)",
          "economies_possibles": "Économies ou surcoûts identifiés"
        },
        "comparaison_detaillee": [
          {
            "entreprise": "nom entreprise",
            "montant_total": montant_euros,
            "quantite_materiel": "ex: 10 caméras, 50m², etc.",
            "prix_unitaire": "ex: 1200€/caméra" ou null,
            "delai_realisation": "délai ou Non précisé",
            "materiel_propose": "description matériel principal",
            "qualite_materiel": "Standard/Premium/Professionnel",
            "prestations_incluses": ["installation", "formation"],
            "garanties": ["1 an pièces"],
            "points_forts": ["prix bas", "bon matériel"],
            "points_faibles": ["délai long", "garantie courte"],
            "note_sur_10": note_chiffree
          }
        ],
        "cahier_des_charges": {
          "titre": "Cahier des charges - [Type de travaux]",
          "description_generale": "Description des travaux à réaliser",
          "postes_travaux": [
            {
              "intitule": "Poste de travail 1",
              "description": "Description détaillée",
              "specifications_techniques": ["spec 1", "spec 2"],
              "quantite_estimee": "quantité avec unité"
            }
          ],
          "criteres_evaluation": ["critère 1", "critère 2"],
          "delai_souhaite": "délai optimal basé sur l'analyse",
          "budget_previsionnel": {
            "minimum": montant_minimum,
            "maximum": montant_maximum
          }
        },
        "analyse_ecarts": {
          "ecart_prix_max_min": {
            "montant": difference_en_euros,
            "pourcentage": pourcentage_ecart
          },
          "ecart_delai_max_min": "différence de délais",
          "postes_variables": ["poste avec écarts importants"]
        },
        "recommandations_negociation": [
          "recommandation négociation 1",
          "recommandation négociation 2"
        ]
      }

      Sois précis, factuel et professionnel. Base-toi uniquement sur les informations des devis fournis.`

      // Construire le prompt avec tous les devis
      let userPrompt = `Voici ${documents.length} devis à comparer :\n\n`
      
      documentsTextes.forEach((doc, index) => {
        userPrompt += `=== DEVIS ${index + 1} - ${doc.filename} ===\n`
        userPrompt += `${doc.content}\n\n`
      })

      userPrompt += `

ANALYSE DEMANDÉE : 
1. Extraire pour chaque devis : quantités, prix, matériel, délais, garanties
2. Calculer prix unitaire quand possible
3. Identifier différences importantes (+ ou - de matériel, qualité différente)
4. Recommander selon rapport qualité/prix (pas forcément le moins cher)
5. Signaler si devis incomparables (périmètres très différents)

Sois factuel et précis.`

      // Appel OpenAI avec GPT-4 (plus puissant pour l'analyse comparative)
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1,
      })

      const analysisContent = completion.choices[0]?.message?.content

      if (!analysisContent) {
        return NextResponse.json(
          { error: 'Erreur lors de l\'analyse comparative IA' },
          { status: 500 }
        )
      }

      // Nettoyage robuste du JSON
      let cleanedContent = analysisContent
        .trim()
        // Supprimer blocs markdown
        .replace(/```json\s*/, '')
        .replace(/```\s*$/, '')
        // Supprimer texte avant/après JSON
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '')
        // Nettoyer espaces et caractères problématiques
        .replace(/,(\s*[}\]])/g, '$1') // Virgules finales
        .trim()
      
      let comparison: DevisComparison
      try {
        comparison = JSON.parse(cleanedContent)
      } catch (parseError) {
        console.error('Erreur parsing JSON OpenAI:', parseError)
        console.error('Contenu reçu:', analysisContent)
        console.error('Contenu nettoyé:', cleanedContent)
        return NextResponse.json(
          { error: 'Erreur format réponse IA' },
          { status: 500 }
        )
      }

      // Sauvegarder la comparaison en base de données
      const { data: savedComparison, error: saveError } = await supabase
        .from('devis_comparisons')
        .insert({
          user_id: user.id,
          nombre_devis: documents.length,
          noms_fichiers: documents.map((d: any) => d.filename),
          synthese_executive: comparison.synthese_executive,
          comparaison_detaillee: comparison.comparaison_detaillee,
          cahier_des_charges: comparison.cahier_des_charges,
          analyse_ecarts: comparison.analyse_ecarts,
          recommandations_negociation: comparison.recommandations_negociation,
          raw_analysis: analysisContent,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (saveError) {
        console.error('Erreur sauvegarde comparaison:', saveError)
        // Continue même si la sauvegarde échoue
      }

      return NextResponse.json({
        message: `Comparaison de ${documents.length} devis terminée avec succès`,
        comparison: comparison,
        saved_comparison: savedComparison,
        tokens_used: completion.usage?.total_tokens,
        files_analyzed: documents.map((d: any) => d.filename)
      })

    } catch (error) {
      console.error('Erreur API compare-devis:', error)
      
      if (error instanceof OpenAI.APIError) {
        return NextResponse.json(
          { error: `Erreur OpenAI: ${error.message}` },
          { status: error.status || 500 }
        )
      }

      return NextResponse.json(
        { error: 'Erreur serveur lors de la comparaison' },
        { status: 500 }
      )
    }
  })
}