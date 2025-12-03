import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ChatMessage, ChatSession, InputMode } from '../interfaces/chat'
import { newId } from '../apps/chat/utils'
import { analyzeNaturalLanguage, analyzePseudocode, fetchCachedAlgorithms } from '../services/chatApi'
import type { CachedAlgorithmRaw } from '../services/chatApi'
import type { AnalyzerResponse, CaseType } from '../interfaces/analyzer'

type ThemeMode = 'light' | 'dark'

type ChatContextValue = {
  sessions: ChatSession[]
  currentSessionId: string | null
  currentSession: ChatSession | null
  isLoading: boolean
  theme: ThemeMode
  createSession: () => void
  setCurrentSession: (id: string) => void
  setInputMode: (mode: InputMode) => void
  toggleTheme: () => void
  sendMessage: (content: string) => void
  retryLast: () => void
  renameSession: (id: string, title: string) => void
}

export const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: newId(),
      title: 'Chat inicial',
      inputMode: null,
      messages: [],
    },
  ])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessions[0]?.id ?? null,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('light')

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === currentSessionId) ?? null,
    [sessions, currentSessionId],
  )

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const cached = await fetchCachedAlgorithms()
        if (!isMounted || cached.length === 0) return
        const restored = buildSessionsFromCache(cached)
        if (!restored.length) return
        setSessions(restored)
        setCurrentSessionId(restored[0]?.id ?? null)
      } catch (err) {
        console.error('No se pudieron cargar los chats desde cache', err)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const createSession = () => {
    const id = newId()
    const next: ChatSession = { id, title: 'Nuevo chat', inputMode: null, messages: [] }
    setSessions((prev) => [next, ...prev])
    setCurrentSessionId(id)
  }

  const setCurrentSession = (id: string) => setCurrentSessionId(id)

  const setInputMode = (mode: InputMode) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              inputMode: mode,
            }
          : s,
      ),
    )
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const retryLast = () => {
    if (isLoading) return
    const session = currentSession
    if (!session) return
    const lastUser = [...session.messages].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    void sendMessage(lastUser.content)
  }

  const renameSession = (id: string, title: string) => {
    const nextTitle = title.trim()
    if (!nextTitle) return
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: nextTitle } : s)))
  }

  const sendMessage = async (content: string) => {
    if (!currentSessionId || isLoading) return
    const session = sessions.find((s) => s.id === currentSessionId)
    if (!session?.inputMode) return
    const mode = session.inputMode
    setIsLoading(true)
    const userMessage: ChatMessage = { id: newId(), role: 'user', content }
    const pendingId = newId()
    const pendingAssistant: ChatMessage = {
      id: pendingId,
      role: 'assistant',
      content: 'Analizando...',
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              title: s.messages.length === 0 ? content.slice(0, 30) : s.title,
              messages: [...s.messages, userMessage, pendingAssistant],
            }
          : s,
      ),
    )

    try {
      const data =
        mode === 'natural'
          ? await analyzeNaturalLanguage(content)
          : await analyzePseudocode(content)
      const responseText =
        data.pretty ||
        (mode === 'natural' ? 'Traduccion y analisis listos' : 'Analisis listo')
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === pendingId ? { ...m, content: responseText, analysis: data } : m,
                ),
              }
            : s,
        ),
      )
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : String(err)
      const msg = toFriendlyError(rawMsg)
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === pendingId ? { ...m, content: `Error: ${msg}` } : m,
                ),
              }
            : s,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  function toFriendlyError(msg: string) {
    const lower = (msg || '').toLowerCase()
    if (lower.includes('failed to fetch') || lower.includes('network')) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esta activo (http://localhost:8000), que no haya bloqueos de red/CORS y vuelve a intentarlo.'
    }
    if (lower.includes('timeout')) {
      return 'La solicitud tardo demasiado. Revisa conectividad o intenta de nuevo.'
    }
    return msg || 'Error desconocido'
  }

  const value: ChatContextValue = {
    sessions,
    currentSessionId,
    currentSession,
    isLoading,
    theme,
    createSession,
    setCurrentSession,
    setInputMode,
    toggleTheme,
    sendMessage,
    retryLast,
    renameSession,
  }

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  )
}

function buildSessionsFromCache(records: CachedAlgorithmRaw[]): ChatSession[] {
  const items: ChatSession[] = []
  for (const record of records) {
    const session = createSessionFromRecord(record)
    if (session) items.push(session)
  }
  return items
}

function createSessionFromRecord(record: CachedAlgorithmRaw): ChatSession | null {
  if (!record.id || (!record.natural_description && !record.pseudocode)) return null
  const mode: InputMode = record.natural_description ? 'natural' : 'pseudocode'
  const userContent =
    mode === 'natural'
      ? record.natural_description ?? ''
      : codeBlock(record.pseudocode ?? 'Sin contenido')

  const analysis = buildAnalyzerResponseFromCache(record)
  const title = record.algorithm_name
    ? record.algorithm_name.replaceAll('_', ' ')
    : 'Algoritmo analizado'

  return {
    id: record.id,
    title,
    inputMode: mode,
    messages: [
      { id: `${record.id}-user`, role: 'user', content: userContent },
      {
        id: `${record.id}-assistant`,
        role: 'assistant',
        content: analysis.pretty ?? 'Analisis listo',
        analysis,
      },
    ],
  }
}

function buildAnalyzerResponseFromCache(record: CachedAlgorithmRaw): AnalyzerResponse {
  const hasDifferentCases = Boolean(record.has_different_cases)
  const analysis: AnalyzerResponse['analysis'] = {
    algorithm_name: record.algorithm_name ?? null,
    algorithm_type: record.algorithm_type ?? null,
    recursive_calls_count: null,
    base_case_condition: null,
    has_different_cases: hasDifferentCases,
    unified_case: hasDifferentCases
      ? null
      : buildCase('best', record.unified_function, record.unified_explanation, true),
    best_case: hasDifferentCases
      ? buildCase('best', record.best_case_function, record.best_case_explanation)
      : undefined,
    worst_case: hasDifferentCases
      ? buildCase('worst', record.worst_case_function, record.worst_case_explanation)
      : undefined,
    average_case: hasDifferentCases
      ? buildCase('average', record.average_case_function, record.average_case_explanation)
      : undefined,
  }

  const resolution = buildResolutionSection(record, hasDifferentCases)

  const translation = record.natural_description
    ? {
        pseudocode: record.pseudocode ?? '',
        validated: true,
        attempts: 1,
        confidence: 1,
      }
    : undefined

  return {
    analysis,
    resolution,
    mermaid: record.mermaid_diagram ?? null,
    translation,
    pretty: '[Desde cache]',
  }
}

function buildCase(
  type: CaseType,
  func?: string | null,
  explanation?: string | null,
  isUnified = false,
) {
  if (!func && !explanation) return undefined
  return {
    case_type: type,
    condition: null,
    exists: true,
    function: func ?? null,
    explanation: explanation ?? null,
    applies_to: isUnified ? (['best', 'worst', 'average'] as CaseType[]) : undefined,
  }
}

function buildResolutionSection(
  record: CachedAlgorithmRaw,
  hasDifferentCases: boolean,
): AnalyzerResponse['resolution'] {
  if (!hasDifferentCases) {
    const unified =
      parseResolutionCase(
        record.resolution_method,
        record.unified_function,
        record.unified_case_O,
        record.unified_case_Omega,
        record.unified_case_Theta,
        record.unified_case_method,
        'best',
      ) ??
      parseResolutionCase(
        record.best_case_resolved,
        record.best_case_function,
        record.best_case_O,
        record.best_case_Omega,
        record.best_case_Theta,
        record.best_case_method,
        'best',
      )
    return {
      has_different_cases: false,
      algorithm_name: record.algorithm_name ?? null,
      algorithm_type: record.algorithm_type ?? null,
      unified_case: unified ?? null,
    }
  }

  return {
    has_different_cases: true,
    algorithm_name: record.algorithm_name ?? null,
    algorithm_type: record.algorithm_type ?? null,
    best_case: parseResolutionCase(
      record.best_case_resolved,
      record.best_case_function,
      record.best_case_O,
      record.best_case_Omega,
      record.best_case_Theta,
      record.best_case_method,
      'best',
    ),
    worst_case: parseResolutionCase(
      record.worst_case_resolved,
      record.worst_case_function,
      record.worst_case_O,
      record.worst_case_Omega,
      record.worst_case_Theta,
      record.worst_case_method,
      'worst',
    ),
    average_case: parseResolutionCase(
      record.average_case_resolved,
      record.average_case_function,
      record.average_case_O,
      record.average_case_Omega,
      record.average_case_Theta,
      record.average_case_method,
      'average',
    ),
  }
}

function parseResolutionCase(
  raw?: string | null,
  fallbackEquation?: string | null,
  fallbackO?: string | null,
  fallbackOmega?: string | null,
  fallbackTheta?: string | null,
  fallbackMethod?: string | null,
  type: CaseType = 'best',
) {
  const parsed = safeParseJSON(raw)
  if (!parsed && !fallbackEquation && !fallbackO && !fallbackOmega && !fallbackTheta) {
    return undefined
  }

  const resolution = parsed ?? {
    O: fallbackO ?? null,
    Omega: fallbackOmega ?? null,
    Theta: fallbackTheta ?? null,
    is_tight_bound: Boolean(fallbackTheta),
    method: fallbackMethod ?? null,
    steps: [],
    explanation: null,
  }

  return {
    case_type: type,
    original_equation: fallbackEquation ?? null,
    resolution: {
      O: resolution.O ?? null,
      Omega: resolution.Omega ?? null,
      Theta: resolution.Theta ?? null,
      is_tight_bound: Boolean(resolution.is_tight_bound ?? resolution.Theta),
      method: resolution.method ?? null,
      steps: Array.isArray(resolution.steps) ? resolution.steps : [],
      explanation: resolution.explanation ?? null,
    },
  }
}

function safeParseJSON(raw?: string | null) {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function codeBlock(content: string) {
  const trimmed = content.trim()
  return '```pseudo\n' + trimmed + '\n```'
}
