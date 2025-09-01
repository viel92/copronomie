// Polyfills pour Node.js serverless
if (typeof globalThis.DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = class {}
}
if (typeof globalThis.ImageData === 'undefined') {
  (globalThis as any).ImageData = class {}
}
if (typeof globalThis.Path2D === 'undefined') {
  (globalThis as any).Path2D = class {}
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  
  // Configuration serverless
  // @ts-expect-error - GlobalWorkerOptions type incorrect for serverless
  pdfjs.GlobalWorkerOptions.workerSrc = null
  
  const doc = await pdfjs.getDocument({
    data: buffer,
    disableWorker: true,
    isEvalSupported: false,
    disableFontFace: true
  }).promise
  
  const pages: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const { items } = await page.getTextContent({ normalizeWhitespace: true })
    pages.push(items.map((item: any) => item.str).join(' '))
  }
  
  return pages.join('\n\n')
}