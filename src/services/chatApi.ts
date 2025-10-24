export interface AnalyzeResponse {
  // Desconocemos la forma exacta; usamos any y renderizamos como JSON
  [key: string]: any
}

const BASE_URL = 'http://127.0.0.1:8000'

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${BASE_URL}/api/analyzer/ast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const msg = await safeText(res)
    throw new Error(`HTTP ${res.status}: ${msg}`)
  }
  return res.json()
}

async function safeText(res: Response) {
  try { return await res.text() } catch { return '<no-body>' }
}

