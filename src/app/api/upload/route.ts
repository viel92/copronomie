import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        return NextResponse.json(
          { error: 'Aucun fichier fourni' },
          { status: 400 }
        )
      }

      // Validation du type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Type de fichier non supporté. Utilisez PDF, JPG, PNG ou WebP.' },
          { status: 400 }
        )
      }

      // Validation de la taille (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'Fichier trop volumineux. Taille maximale: 10MB.' },
          { status: 400 }
        )
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 8)
      const extension = file.name.split('.').pop()
      const fileName = `${timestamp}_${randomId}.${extension}`
      
      // Chemin de stockage organisé par utilisateur
      const filePath = `documents/${user.id}/${fileName}`

      // Convertir le fichier en ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const fileBuffer = new Uint8Array(arrayBuffer)

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('devis-documents')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Erreur upload Supabase Storage:', uploadError)
        return NextResponse.json(
          { error: `Erreur upload: ${uploadError.message}` },
          { status: 500 }
        )
      }

      // Obtenir l'URL publique du fichier
      const { data: urlData } = supabase.storage
        .from('devis-documents')
        .getPublicUrl(filePath)

      // Sauvegarder les métadonnées en base de données
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          original_name: file.name,
          file_path: filePath,
          url: urlData.publicUrl,
          type: file.type,
          size: file.size,
          uploaded_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (dbError) {
        console.error('Erreur sauvegarde métadonnées:', dbError)
        // Nettoyer le fichier uploadé si échec DB
        await supabase.storage.from('devis-documents').remove([filePath])
        return NextResponse.json(
          { error: `Erreur base de données: ${dbError.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Fichier uploadé avec succès',
        document: documentData,
        url: urlData.publicUrl
      }, { status: 201 })

    } catch (error) {
      console.error('Erreur API upload:', error)
      return NextResponse.json(
        { error: 'Erreur serveur lors de l\'upload' },
        { status: 500 }
      )
    }
  })
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const { searchParams } = new URL(request.url)
      const limit = searchParams.get('limit') || '50'
      
      // Récupérer les documents de l'utilisateur
      const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('uploaded_by', user.id)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit))

      if (error) {
        console.error('Erreur récupération documents:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        documents: documents || [],
        total: documents?.length || 0
      })

    } catch (error) {
      console.error('Erreur API documents GET:', error)
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      )
    }
  })
}