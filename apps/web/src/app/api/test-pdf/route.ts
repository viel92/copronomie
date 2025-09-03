import { NextRequest, NextResponse } from 'next/server'
import { extractPdfText } from '@/lib/pdf-extract'

// Forcer le runtime Node.js
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('=== DEBUT TEST PDF ===')
  
  try {
    const contentType = request.headers.get('content-type') || ''
    console.log('Content-Type:', contentType)
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type multipart/form-data requis' }, { status: 400 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Type de fichier non supporté, PDF uniquement' }, { status: 400 })
    }
    
    console.log('Fichier reçu:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    // Limite de taille
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10MB)' }, { status: 400 })
    }
    
    // Extraction
    const arrayBuffer = await file.arrayBuffer()
    console.log('ArrayBuffer créé, taille:', arrayBuffer.byteLength)
    
    const extractedText = await extractPdfText(arrayBuffer)
    console.log('Extraction réussie, longueur texte:', extractedText.length)
    
    return NextResponse.json({
      success: true,
      message: 'Extraction PDF réussie',
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      extraction: {
        textLength: extractedText.length,
        preview: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
        fullText: extractedText // Pour debug, à enlever en prod
      }
    })
    
  } catch (error) {
    console.error('Erreur test PDF:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}