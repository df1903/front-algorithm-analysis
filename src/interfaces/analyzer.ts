export type CaseType = 'best' | 'worst' | 'average'

export interface AstInfo {
  from_cache: boolean
  algorithm_name: string | null
}

export interface ClassificationInfo {
  from_cache: boolean
}

export interface ComplexityCase {
  case_type: CaseType
  condition: string | null
  exists: boolean
  function: string | null
  explanation: string | null
  applies_to?: CaseType[]
}

export interface ResolutionDetails {
  O: string | null
  Omega: string | null
  Theta: string | null
  is_tight_bound: boolean
  method: string | null
  steps?: string[]
  explanation: string | null
}

export interface ResolutionCase {
  case_type: CaseType
  original_equation: string | null
  resolution: ResolutionDetails
}

export interface NaturalTranslation {
  pseudocode: string
  validated: boolean
  attempts: number
  confidence: number
}

export interface AnalysisSection {
  algorithm_name: string | null
  algorithm_type: string | null
  recursive_calls_count: number | null
  max_nesting?: number | null
  base_case_condition: string | null
  has_different_cases: boolean
  unified_case: ComplexityCase | null
  best_case?: ComplexityCase
  worst_case?: ComplexityCase
  average_case?: ComplexityCase
}

export interface ResolutionSection {
  has_different_cases: boolean
  algorithm_name: string | null
  algorithm_type: string | null
  unified_case?: ResolutionCase
  best_case?: ResolutionCase
  worst_case?: ResolutionCase
  average_case?: ResolutionCase
}

export interface AnalyzerResponse {
  ast?: AstInfo
  pretty?: string | null
  classification?: ClassificationInfo
  analysis?: AnalysisSection
  resolution?: ResolutionSection
  mermaid?: string | null
  translation?: NaturalTranslation
  error?: string | null
}
