import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ChatMessage, ChatSession, InputMode } from '../interfaces/chat'
import { newId } from '../apps/chat/utils'
import { analyzeText } from '../services/chatApi'

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
      const data = await analyzeText(content)
      const responseText = codeBlock(JSON.stringify(data, null, 2))
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === pendingId ? { ...m, content: responseText } : m,
                ),
              }
            : s,
        ),
      )
    } catch (err: any) {
      const msg = toFriendlyError(err?.message)
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

  function codeBlock(s: string) {
    return '```json\n' + s + '\n```'
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
