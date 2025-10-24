import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ChatMessage, ChatSession } from '../interfaces/chat'
import { newId } from '../apps/chat/utils'
import { analyzeText } from '../services/chatApi'

type ChatContextValue = {
  sessions: ChatSession[]
  currentSessionId: string | null
  currentSession: ChatSession | null
  createSession: () => void
  setCurrentSession: (id: string) => void
  sendMessage: (content: string) => void
  renameSession: (id: string, title: string) => void
}

export const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: newId(),
      title: 'Chat inicial',
      messages: [],
    },
  ])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    sessions[0]?.id ?? null,
  )

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === currentSessionId) ?? null,
    [sessions, currentSessionId],
  )

  const createSession = () => {
    const id = newId()
    const next: ChatSession = { id, title: 'Nuevo chat', messages: [] }
    setSessions((prev) => [next, ...prev])
    setCurrentSessionId(id)
  }

  const setCurrentSession = (id: string) => setCurrentSessionId(id)

  const renameSession = (id: string, title: string) => {
    const nextTitle = title.trim()
    if (!nextTitle) return
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: nextTitle } : s)))
  }

  const sendMessage = async (content: string) => {
    if (!currentSessionId) return
    const userMessage: ChatMessage = { id: newId(), role: 'user', content }
    const pendingId = newId()
    const pendingAssistant: ChatMessage = {
      id: pendingId,
      role: 'assistant',
      content: 'Analizando…',
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
      const msg = err?.message ?? 'Error desconocido'
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
    }
  }

  function codeBlock(s: string) {
    return '```json\n' + s + '\n```'
  }

  const value: ChatContextValue = {
    sessions,
    currentSessionId,
    currentSession,
    createSession,
    setCurrentSession,
    sendMessage,
    renameSession,
  }

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  )
}
