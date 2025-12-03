import type { ReactNode } from 'react'
import type {
  AnalyzerResponse,
  ComplexityCase,
  ResolutionCase,
  ResolutionSection,
  NaturalTranslation,
} from '../../../interfaces/analyzer'
import { MermaidDiagram } from './MermaidDiagram'

type Props = {
  data: AnalyzerResponse
  isDark: boolean
}

export function AnalysisCard({ data, isDark }: Props) {
  const analysis = data.analysis
  const resolution = data.resolution
  const mermaid = (data.mermaid || '').trim()

  const accentText = isDark ? 'text-indigo-200' : 'text-indigo-700'
  const softText = isDark ? 'text-zinc-400' : 'text-[#4B5563]'
  const heading = isDark ? 'text-zinc-100' : 'text-[#111827]'
  const borderColor = isDark ? 'border-zinc-800' : 'border-[#E5E7EB]'
  const surface = isDark ? 'bg-zinc-900/70' : 'bg-white'

  const algorithmLabel = (
    analysis?.algorithm_name ||
    data.ast?.algorithm_name ||
    'Algoritmo analizado'
  ).toUpperCase()

  if (data.error) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-semibold">Error en el analisis</p>
        <p className="mt-1 whitespace-pre-wrap leading-relaxed">{data.error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border ${borderColor} ${surface} p-4 shadow-sm`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-semibold uppercase ${accentText}`}>
            {algorithmLabel}
          </span>
          {analysis?.algorithm_type ? (
            <Badge isDark={isDark}>{analysis.algorithm_type}</Badge>
          ) : null}
          {data.ast?.from_cache ? (
            <Badge isDark={isDark} variant="muted">
              AST desde cache
            </Badge>
          ) : null}
          {data.classification?.from_cache ? (
            <Badge isDark={isDark} variant="muted">
              Clasificacion desde cache
            </Badge>
          ) : null}
          {data.pretty ? (
            <Badge isDark={isDark} variant="outline">
              {data.pretty}
            </Badge>
          ) : null}
        </div>
        <p className={`mt-2 text-sm leading-relaxed ${softText}`}>
          Analisis estructurado del algoritmo con desglose por casos, ecuaciones
          de eficiencia y metodo de resolucion.
        </p>
      </div>

      {data.translation ? (
        <TranslationPanel translation={data.translation} isDark={isDark} />
      ) : null}

      {analysis ? <SummaryTiles analysis={analysis} isDark={isDark} /> : null}

      {resolution ? <ComplexitySummary resolution={resolution} isDark={isDark} /> : null}

      {analysis ? (
        <CasesSection analysis={analysis} isDark={isDark} heading={heading} />
      ) : null}

      {resolution ? (
        <ResolutionSectionView
          resolution={resolution}
          isDark={isDark}
          heading={heading}
        />
      ) : null}

      {mermaid ? (
        <MermaidSection
          code={mermaid}
          isDark={isDark}
          heading={heading}
          borderColor={borderColor}
          surface={surface}
        />
      ) : null}
    </div>
  )
}

function SummaryTiles({
  analysis,
  isDark,
}: {
  analysis: AnalyzerResponse['analysis']
  isDark: boolean
}) {
  const items: { label: string; value: string; hint?: string }[] = []
  items.push({
    label: 'Tipo',
    value: analysis?.algorithm_type ?? '-',
  })

  if (analysis?.algorithm_type === 'RECURSIVE') {
    items.push({
      label: 'Llamadas recursivas',
      value:
        analysis.recursive_calls_count !== null &&
        analysis.recursive_calls_count !== undefined
          ? String(analysis.recursive_calls_count)
          : '-',
    })
  } else if (analysis?.algorithm_type === 'ITERATIVE' && analysis?.max_nesting) {
    items.push({
      label: 'Profundidad de anidamiento',
      value: String(analysis.max_nesting),
    })
  }

  if (analysis?.base_case_condition) {
    items.push({
      label: 'Caso base',
      value: analysis.base_case_condition,
    })
  }

  if (typeof analysis?.has_different_cases === 'boolean') {
    items.push({
      label: 'Casos diferentes',
      value: analysis.has_different_cases ? 'Si' : 'No',
    })
  }

  if (!items.length) return null
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item, idx) => (
        <InfoTile key={idx} isDark={isDark} {...item} />
      ))}
    </div>
  )
}

function TranslationPanel({
  translation,
  isDark,
}: {
  translation: NaturalTranslation
  isDark: boolean
}) {
  const softText = isDark ? 'text-zinc-400' : 'text-[#4B5563]'
  const borderColor = isDark ? 'border-zinc-800' : 'border-[#E5E7EB]'
  const surface = isDark ? 'bg-zinc-900/60' : 'bg-white'
  const confidence = formatConfidence(translation.confidence)

  return (
    <div className={`rounded-xl border ${borderColor} ${surface} p-4 space-y-3`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-semibold text-indigo-500">
          Traduccion a pseudocodigo
        </span>
        <Badge isDark={isDark} variant={translation.validated ? 'solid' : 'outline'}>
          {translation.validated ? 'Validado' : 'No validado'}
        </Badge>
        <Badge isDark={isDark} variant="muted">
          Intentos: {translation.attempts}
        </Badge>
        <Badge isDark={isDark} variant="outline">
          Confianza: {confidence}
        </Badge>
      </div>
      <div>
        <p className={`text-sm ${softText}`}>Pseudocodigo generado:</p>
        <pre
          className={`mt-2 max-h-80 overflow-auto rounded-lg border ${borderColor} bg-black/5 p-3 text-xs leading-relaxed ${
            isDark ? 'bg-zinc-950/80 text-zinc-100' : 'bg-[#F3F4F6] text-[#111827]'
          }`}
        >
          {translation.pseudocode}
        </pre>
      </div>
    </div>
  )
}

function formatConfidence(value: number) {
  if (!Number.isFinite(value)) return 'N/A'
  if (value <= 1) {
    return `${(value * 100).toFixed(1)}%`
  }
  return `${value.toFixed(1)}%`
}

function CasesSection({
  analysis,
  isDark,
  heading,
}: {
  analysis: NonNullable<AnalyzerResponse['analysis']>
  isDark: boolean
  heading: string
}) {
  if (!analysis) return null
  const hasDifferent = analysis.has_different_cases

  if (!hasDifferent) {
    if (!analysis.unified_case) return null
    return (
      <Section title="Casos de complejidad" headingClass={heading}>
        <UnifiedCaseCard
          isDark={isDark}
          data={analysis.unified_case}
          title="Caso unificado"
        />
      </Section>
    )
  }

  const cards = [
    { label: 'Mejor caso', data: analysis.best_case },
    { label: 'Peor caso', data: analysis.worst_case },
    { label: 'Caso promedio', data: analysis.average_case },
  ].filter((c) => c.data && c.data.exists) as { label: string; data: ComplexityCase }[]

  if (!cards.length) return null

  return (
    <Section title="Casos de complejidad" headingClass={heading}>
      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((item) => (
          <CaseCard key={item.label} isDark={isDark} label={item.label} data={item.data} />
        ))}
      </div>
    </Section>
  )
}

function ResolutionSectionView({
  resolution,
  isDark,
  heading,
}: {
  resolution: ResolutionSection
  isDark: boolean
  heading: string
}) {
  if (!resolution) return null
  const hasDifferent = resolution.has_different_cases

  if (!hasDifferent) {
    const unified =
      resolution.unified_case ||
      resolution.best_case ||
      resolution.worst_case ||
      resolution.average_case

    if (!unified) return null

    return (
      <Section title="Resolucion y cotas" headingClass={heading}>
        <ResolutionUnifiedCard isDark={isDark} label="Caso unificado" data={unified} />
      </Section>
    )
  }

  const cards = [
    { label: 'Mejor caso', data: resolution.best_case },
    { label: 'Peor caso', data: resolution.worst_case },
    { label: 'Caso promedio', data: resolution.average_case },
  ].filter((c) => c.data) as { label: string; data: ResolutionCase }[]

  if (!cards.length) return null

  return (
    <Section title="Resolucion y cotas" headingClass={heading}>
      <div className="grid gap-3">
        {cards.map((item) => (
          <ResolutionCaseCard
            key={item.label}
            isDark={isDark}
            label={item.label}
            data={item.data}
          />
        ))}
      </div>
    </Section>
  )
}

function ComplexitySummary({
  resolution,
  isDark,
}: {
  resolution: ResolutionSection
  isDark: boolean
}) {
  const text = buildSummary(resolution)
  if (!text) return null
  return (
    <div
      className={`rounded-xl border ${
        isDark ? 'border-indigo-500/30 bg-indigo-900/20' : 'border-indigo-100 bg-indigo-50'
      } px-4 py-3 text-sm leading-relaxed ${
        isDark ? 'text-indigo-100' : 'text-indigo-800'
      }`}
    >
      {text}
    </div>
  )
}

function buildSummary(resolution?: ResolutionSection) {
  if (!resolution) return ''
  if (!resolution.has_different_cases) {
    const unified =
      resolution.unified_case ||
      resolution.best_case ||
      resolution.worst_case ||
      resolution.average_case
    const o = unified?.resolution?.O
    const theta = unified?.resolution?.Theta
    const omega = unified?.resolution?.Omega
    const pieces = [theta || o || omega].filter(Boolean)
    if (!pieces.length) return ''
    return `Complejidad temporal: ${pieces[0]} (misma en mejor, peor y promedio).`
  }

  const parts: string[] = []
  if (resolution.best_case?.resolution?.O) {
    parts.push(`Mejor caso: ${resolution.best_case.resolution.O}`)
  }
  if (resolution.average_case?.resolution?.O) {
    parts.push(`Promedio: ${resolution.average_case.resolution.O}`)
  }
  if (resolution.worst_case?.resolution?.O) {
    parts.push(`Peor caso: ${resolution.worst_case.resolution.O}`)
  }
  return parts.join(', ')
}

function Section({
  title,
  headingClass,
  children,
}: {
  title: string
  headingClass: string
  children: ReactNode
}) {
  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-semibold ${headingClass}`}>{title}</h3>
      {children}
    </div>
  )
}

function Badge({
  children,
  isDark,
  variant = 'solid',
}: {
  children: ReactNode
  isDark: boolean
  variant?: 'solid' | 'muted' | 'outline'
}) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium'
  const variants: Record<typeof variant, string> = {
    solid: isDark
      ? 'bg-indigo-600 text-indigo-50'
      : 'bg-indigo-100 text-indigo-800',
    muted: isDark
      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
      : 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]',
    outline: isDark
      ? 'border border-indigo-400/60 text-indigo-100'
      : 'border border-indigo-200 text-indigo-700',
  }
  return <span className={`${base} ${variants[variant]}`}>{children}</span>
}

function InfoTile({
  label,
  value,
  hint,
  isDark,
}: {
  label: string
  value: string
  hint?: string
  isDark: boolean
}) {
  const softText = isDark ? 'text-zinc-400' : 'text-[#6B7280]'
  const strongText = isDark ? 'text-zinc-100' : 'text-[#111827]'
  return (
    <div
      className={`rounded-lg border ${
        isDark ? 'border-zinc-800 bg-zinc-950/70' : 'border-[#E5E7EB] bg-white'
      } p-3`}
    >
      <p className={`text-[11px] uppercase tracking-wide ${softText}`}>
        {label}
      </p>
      <p className={`text-sm font-semibold ${strongText}`}>{value}</p>
      {hint ? (
        <p className={`mt-1 text-[12px] leading-snug ${softText}`}>{hint}</p>
      ) : null}
    </div>
  )
}

function CaseCard({
  label,
  data,
  isDark,
}: {
  label: string
  data: ComplexityCase
  isDark: boolean
}) {
  const softText = isDark ? 'text-zinc-400' : 'text-[#4B5563]'
  const borderColor = isDark ? 'border-zinc-800' : 'border-[#E5E7EB]'
  const surface = isDark ? 'bg-zinc-900/60' : 'bg-white'

  return (
    <div className={`rounded-xl border ${borderColor} ${surface} p-4 space-y-2`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-indigo-500">
            {label}
          </span>
          {data.condition ? (
            <span
              className={`rounded-md border ${borderColor} px-2 py-1 text-[11px] ${softText}`}
            >
              Condicion: {data.condition}
            </span>
          ) : null}
        </div>
        <span className={`text-[11px] ${softText}`}>
          {data.exists ? 'Presente' : 'No definido'}
        </span>
      </div>
      {data.function ? (
        <p className="font-mono text-sm text-indigo-500">{data.function}</p>
      ) : null}
      {data.explanation ? (
        <p className={`text-sm leading-relaxed ${softText}`}>{data.explanation}</p>
      ) : null}
    </div>
  )
}

function UnifiedCaseCard({
  data,
  isDark,
  title,
}: {
  data: ComplexityCase
  isDark: boolean
  title: string
}) {
  const softText = isDark ? 'text-zinc-400' : 'text-[#4B5563]'
  const borderColor = isDark ? 'border-zinc-800' : 'border-[#E5E7EB]'
  const surface = isDark ? 'bg-zinc-900/60' : 'bg-white'
  const applies =
    data.applies_to && data.applies_to.length
      ? data.applies_to.join(', ')
      : 'best, worst, average'

  return (
    <div className={`rounded-xl border ${borderColor} ${surface} p-4 space-y-2`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-indigo-500">{title}</span>
          <span
            className={`rounded-md border ${borderColor} px-2 py-1 text-[11px] ${softText}`}
          >
            Aplica a: {applies}
          </span>
        </div>
        <span className={`text-[11px] ${softText}`}>
          {data.exists ? 'Presente' : 'No definido'}
        </span>
      </div>
      {data.function ? (
        <p className="font-mono text-sm text-indigo-500">{data.function}</p>
      ) : null}
      {data.explanation ? (
        <p className={`text-sm leading-relaxed ${softText}`}>{data.explanation}</p>
      ) : null}
    </div>
  )
}

function ResolutionUnifiedCard({
  data,
  isDark,
  label,
}: {
  data: ResolutionCase
  isDark: boolean
  label: string
}) {
  const softText = isDark ? 'text-zinc-400' : 'text-[#4B5563]'
  const borderColor = isDark ? 'border-zinc-800' : 'border-[#E5E7EB]'
  const surface = isDark ? 'bg-zinc-900/60' : 'bg-white'
  const res = data.resolution

  return (
    <div className={`rounded-xl border ${borderColor} ${surface} p-4 space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-indigo-500">
            {label}
          </span>
          {data.original_equation ? (
            <span
              className={`rounded-md border ${borderColor} px-2 py-1 text-[11px] font-mono text-indigo-500`}
            >
              {data.original_equation}
            </span>
          ) : null}
          {res.method ? (
            <span
              className={`rounded-md border ${borderColor} px-2 py-1 text-[11px] ${softText}`}
            >
              Metodo: {res.method}
            </span>
          ) : null}
        </div>
        {res.is_tight_bound ? (
          <span className={`text-[11px] ${softText}`}>Cota ajustada</span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {res.O ? <Tag label="O" value={res.O} isDark={isDark} /> : null}
        {res.Omega ? <Tag label="Omega" value={res.Omega} isDark={isDark} /> : null}
        {res.Theta ? <Tag label="Theta" value={res.Theta} isDark={isDark} /> : null}
      </div>
      {res.explanation ? (
        <p className={`text-sm leading-relaxed ${softText}`}>{res.explanation}</p>
      ) : null}
      {res.steps?.length ? (
        <details className="space-y-1">
          <summary
            className={`cursor-pointer text-[11px] uppercase tracking-wide ${softText}`}
          >
            Ver pasos
          </summary>
          <ol className="space-y-1 pl-4 text-sm">
            {res.steps.map((step, idx) => (
              <li key={idx} className={softText}>
                {step}
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </div>
  )
}

function ResolutionCaseCard({
  label,
  data,
  isDark,
}: {
  label: string
  data: ResolutionCase
  isDark: boolean
}) {
  const softText = isDark ? 'text-zinc-400' : 'text-[#4B5563]'
  const borderColor = isDark ? 'border-zinc-800' : 'border-[#E5E7EB]'
  const surface = isDark ? 'bg-zinc-900/60' : 'bg-white'
  const res = data.resolution

  return (
    <div className={`rounded-xl border ${borderColor} ${surface} p-4 space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-indigo-500">
            {label}
          </span>
          {data.original_equation ? (
            <span
              className={`rounded-md border ${borderColor} px-2 py-1 text-[11px] font-mono text-indigo-500`}
            >
              {data.original_equation}
            </span>
          ) : null}
          {res.method ? (
            <span
              className={`rounded-md border ${borderColor} px-2 py-1 text-[11px] ${softText}`}
            >
              Metodo: {res.method}
            </span>
          ) : null}
        </div>
        <span className={`text-[11px] ${softText}`}>
          {res.is_tight_bound ? 'Cota ajustada' : 'Cota no ajustada'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {res.O ? <Tag label="O" value={res.O} isDark={isDark} /> : null}
        {res.Omega ? <Tag label="Omega" value={res.Omega} isDark={isDark} /> : null}
        {res.Theta ? <Tag label="Theta" value={res.Theta} isDark={isDark} /> : null}
      </div>
      {res.explanation ? (
        <p className={`text-sm leading-relaxed ${softText}`}>{res.explanation}</p>
      ) : null}
      {res.steps?.length ? (
        <details className="space-y-1">
          <summary
            className={`cursor-pointer text-[11px] uppercase tracking-wide ${softText}`}
          >
            Ver pasos
          </summary>
          <ol className="space-y-1 pl-4 text-sm">
            {res.steps.map((step, idx) => (
              <li key={idx} className={softText}>
                {step}
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </div>
  )
}

function Tag({
  label,
  value,
  isDark,
}: {
  label: string
  value: string
  isDark: boolean
}) {
  const borderColor = isDark ? 'border-indigo-500/40' : 'border-indigo-200'
  const textColor = isDark ? 'text-indigo-100' : 'text-indigo-700'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border ${borderColor} px-2 py-1 text-[12px] font-semibold ${textColor}`}
    >
      <span className="opacity-70">{label}</span>
      <span className="font-mono">{value}</span>
    </span>
  )
}

function MermaidSection({
  code,
  isDark,
  heading,
  borderColor,
  surface,
}: {
  code: string
  isDark: boolean
  heading: string
  borderColor: string
  surface: string
}) {
  const softText = isDark ? 'text-zinc-400' : 'text-[#4B5563]'
  return (
    <Section title="Diagrama de flujo (Mermaid)" headingClass={heading}>
      <div className={`rounded-xl border ${borderColor} ${surface} p-4 space-y-2`}>
        <p className={`text-sm ${softText}`}>
          El diagrama se genera a partir del mermaid devuelto por el analizador.
        </p>
        <div
          className={`rounded-lg border ${borderColor} ${
            isDark ? 'bg-zinc-950/80' : 'bg-[#F9FAFB]'
          } p-3`}
        >
          <MermaidDiagram code={code} isDark={isDark} />
        </div>
      </div>
    </Section>
  )
}
