/**
 * Module d'extraction PDF production-ready
 * Compatible avec environnement serverless et VPS Node.js
 * 
 * @version 1.0.0
 * @date 2025-09-03
 * @author Claude Code
 */

import { spawn } from 'child_process'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

interface PdfExtractionResult {
  text: string
  pages: number
  fileSize: number
  method: 'pdf-parse' | 'pdftotext' | 'fallback'
}

/**
 * Extraction PDF robuste avec fallbacks multiples
 * Méthode 1: pdf-parse (idéal pour la plupart des PDFs)
 * Méthode 2: pdftotext système (pour PDFs complexes)
 * Méthode 3: Fallback gracieux avec métadonnées
 */
export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const startTime = Date.now()
  const bufferSize = buffer.byteLength
  
  console.log(`[PDF-EXTRACT] Début extraction - Taille: ${Math.round(bufferSize/1024)}KB`)
  
  // Méthode 1: pdf-parse (méthode principale)
  try {
    const result = await extractWithPdfParse(buffer)
    const duration = Date.now() - startTime
    console.log(`[PDF-EXTRACT] Succès pdf-parse - ${result.pages} pages, ${result.text.length} chars en ${duration}ms`)
    return result.text
  } catch (error) {
    console.warn('[PDF-EXTRACT] pdf-parse échoué:', error instanceof Error ? error.message : error)
  }
  
  // Méthode 2: pdftotext système (fallback pour PDFs complexes)
  if (process.env.NODE_ENV === 'production' || process.platform !== 'win32') {
    try {
      const result = await extractWithPdfToText(buffer)
      const duration = Date.now() - startTime
      console.log(`[PDF-EXTRACT] Succès pdftotext - ${result.text.length} chars en ${duration}ms`)
      return result.text
    } catch (error) {
      console.warn('[PDF-EXTRACT] pdftotext échoué:', error instanceof Error ? error.message : error)
    }
  }
  
  // Méthode 3: Fallback gracieux avec métadonnées
  const fallbackText = generateFallbackText(bufferSize)
  console.warn(`[PDF-EXTRACT] Fallback utilisé - ${fallbackText.length} chars`)
  return fallbackText
}

/**
 * Extraction avec pdf-parse (méthode principale)
 */
async function extractWithPdfParse(buffer: ArrayBuffer): Promise<PdfExtractionResult> {
  try {
    // Import dynamique avec gestion d'erreur robuste
    const pdfParse = await import('pdf-parse').then(m => m.default || m)
    
    const nodeBuffer = Buffer.from(buffer)
    
    // Configuration minimale pour éviter les références aux fichiers de test
    const pdfData = await pdfParse(nodeBuffer)
    
    if (!pdfData || !pdfData.text) {
      throw new Error('pdf-parse: Aucun texte extrait')
    }
    
    if (pdfData.text.trim().length < 10) {
      throw new Error('Contenu PDF insuffisant ou vide')
    }
  
    // Nettoyage du texte extrait
    const cleanedText = pdfData.text
      .replace(/\r\n/g, '\n')           // Normaliser les fins de ligne
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')       // Limiter les sauts de ligne multiples
      .replace(/\s{2,}/g, ' ')          // Normaliser les espaces multiples
      .replace(/^\s+|\s+$/gm, '')       // Trim chaque ligne
      .trim()
    
    return {
      text: cleanedText,
      pages: pdfData.numpages || 1,
      fileSize: buffer.byteLength,
      method: 'pdf-parse'
    }
  } catch (error) {
    // Re-lancer l'erreur pour que le fallback soit utilisé
    throw error
  }
}

/**
 * Extraction avec pdftotext système (fallback robuste)
 */
async function extractWithPdfToText(buffer: ArrayBuffer): Promise<PdfExtractionResult> {
  return new Promise((resolve, reject) => {
    // Créer fichier temporaire
    const tempId = `pdf_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    const tempPdfPath = join(tmpdir(), `${tempId}.pdf`)
    const tempTxtPath = join(tmpdir(), `${tempId}.txt`)
    
    try {
      // Écrire le buffer en fichier temporaire
      writeFileSync(tempPdfPath, Buffer.from(buffer))
      
      // Exécuter pdftotext
      const pdftotext = spawn('pdftotext', [tempPdfPath, tempTxtPath], {
        timeout: 30000 // Timeout 30s
      })
      
      pdftotext.on('close', (code) => {
        try {
          if (code === 0 && existsSync(tempTxtPath)) {
            const fs = require('fs')
            const text = fs.readFileSync(tempTxtPath, 'utf-8')
            
            // Nettoyage
            unlinkSync(tempPdfPath)
            unlinkSync(tempTxtPath)
            
            if (text.trim().length < 10) {
              reject(new Error('Texte extrait insuffisant'))
              return
            }
            
            resolve({
              text: text.trim(),
              pages: 1, // pdftotext ne retourne pas le nombre de pages facilement
              fileSize: buffer.byteLength,
              method: 'pdftotext'
            })
          } else {
            reject(new Error(`pdftotext failed with code ${code}`))
          }
        } catch (cleanupError) {
          reject(cleanupError)
        }
      })
      
      pdftotext.on('error', (error) => {
        // Nettoyage en cas d'erreur
        try {
          if (existsSync(tempPdfPath)) unlinkSync(tempPdfPath)
          if (existsSync(tempTxtPath)) unlinkSync(tempTxtPath)
        } catch {}
        reject(error)
      })
      
    } catch (error) {
      // Nettoyage en cas d'erreur
      try {
        if (existsSync(tempPdfPath)) unlinkSync(tempPdfPath)
        if (existsSync(tempTxtPath)) unlinkSync(tempTxtPath)
      } catch {}
      reject(error)
    }
  })
}

/**
 * Génération de texte fallback avec métadonnées utiles
 */
function generateFallbackText(bufferSize: number): string {
  const sizeKB = Math.round(bufferSize / 1024)
  const timestamp = new Date().toISOString()
  
  return `DOCUMENT PDF DETECTE
Taille: ${sizeKB} KB
Date d'analyse: ${timestamp}
Statut: Extraction automatique impossible

Ce document PDF n'a pas pu être analysé automatiquement.
Raisons possibles:
- PDF protégé ou chiffré
- Format de PDF non standard
- Contenu principalement images/graphiques
- PDF corrompu ou endommagé

Pour une analyse manuelle, veuillez:
1. Vérifier que le PDF s'ouvre correctement
2. Convertir le PDF en format texte si nécessaire
3. Contacter le support technique

Métadonnées du fichier:
- Taille originale: ${bufferSize} bytes
- Format: application/pdf
- Traitement: Fallback automatique`
}

/**
 * Validation du PDF avant traitement
 */
export function validatePdfBuffer(buffer: ArrayBuffer): { valid: boolean; error?: string } {
  if (!buffer || buffer.byteLength === 0) {
    return { valid: false, error: 'Buffer vide' }
  }
  
  if (buffer.byteLength > 25 * 1024 * 1024) { // 25MB max
    return { valid: false, error: 'Fichier trop volumineux (max 25MB)' }
  }
  
  // Vérifier signature PDF
  const headerBytes = new Uint8Array(buffer.slice(0, 8))
  const header = String.fromCharCode(...headerBytes)
  
  if (!header.startsWith('%PDF-')) {
    return { valid: false, error: 'Format PDF invalide' }
  }
  
  return { valid: true }
}