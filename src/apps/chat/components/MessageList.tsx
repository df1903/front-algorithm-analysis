import { useEffect, useRef } from 'react'
import { useChat } from '../../../hooks/useChat'
import { MessageItem } from './MessageItem'

export function MessageList() {
  const { currentSession } = useChat()
  const messages = currentSession?.messages ?? []
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-zinc-500 mt-8">No hay mensajes todavía</div>
      ) : (
        messages.map((m) => <MessageItem key={m.id} message={m} />)
      )}
      <div ref={endRef} />
    </div>
  )
}
