import type { AnalyzerResponse } from '../interfaces/analyzer'

const API_BASE = 'http://localhost:8000/api/analyzer'

export async function analyzePseudocode(text: string): Promise<AnalyzerResponse> {
  const res = await fetch(`${API_BASE}/ast`, {
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
  return res.json() as Promise<AnalyzerResponse>
}

type NaturalEndpointResponse = {
  pseudocode: string
  validated: boolean
  attempts: number
  confidence: number
  analysis: AnalyzerResponse['analysis']
  resolution: AnalyzerResponse['resolution']
  mermaid?: string | null
}

export async function analyzeNaturalLanguage(
  description: string,
): Promise<AnalyzerResponse> {
  const res = await fetch(`${API_BASE}/natural-to-pseudocode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  })

  if (!res.ok) {
    const msg = await safeText(res)
    throw new Error(`HTTP ${res.status}: ${msg}`)
  }

  const data = (await res.json()) as NaturalEndpointResponse

  return {
    analysis: data.analysis,
    resolution: data.resolution,
    mermaid: data.mermaid,
    translation: {
      pseudocode: data.pseudocode,
      validated: data.validated,
      attempts: data.attempts,
      confidence: data.confidence,
    },
    pretty: 'Natural a pseudocodigo',
  }
}

export interface CachedAlgorithmRaw {
  id: string
  algorithm_name: string
  algorithm_type: string | null
  has_different_cases: boolean
  natural_description: string | null
  pseudocode: string | null
  unified_function?: string | null
  unified_explanation?: string | null
  best_case_function?: string | null
  best_case_explanation?: string | null
  best_case_resolved?: string | null
  worst_case_function?: string | null
  worst_case_explanation?: string | null
  worst_case_resolved?: string | null
  average_case_function?: string | null
  average_case_explanation?: string | null
  average_case_resolved?: string | null
  resolution_method?: string | null
  best_case_O?: string | null
  best_case_Omega?: string | null
  best_case_Theta?: string | null
  best_case_method?: string | null
  worst_case_O?: string | null
  worst_case_Omega?: string | null
  worst_case_Theta?: string | null
  worst_case_method?: string | null
  average_case_O?: string | null
  average_case_Omega?: string | null
  average_case_Theta?: string | null
  average_case_method?: string | null
  unified_case_O?: string | null
  unified_case_Omega?: string | null
  unified_case_Theta?: string | null
  unified_case_method?: string | null
  mermaid_diagram?: string | null
}

type AlgorithmsResponse = {
  total: number
  algorithms: CachedAlgorithmRaw[]
}

export async function fetchCachedAlgorithms(): Promise<CachedAlgorithmRaw[]> {
  const res = await fetch(`${API_BASE}/algorithms`)
  if (!res.ok) {
    const msg = await safeText(res)
    throw new Error(`HTTP ${res.status}: ${msg}`)
  }
  const payload = (await res.json()) as AlgorithmsResponse
  return payload.algorithms ?? []
}

async function safeText(res: Response) {
  try { return await res.text() } catch { return '<no-body>' }
}

