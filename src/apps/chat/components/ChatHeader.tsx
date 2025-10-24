import { useChat } from '../../../hooks/useChat'
import { useEffect, useRef, useState } from 'react'

export function ChatHeader() {
  const { currentSession, renameSession } = useChat()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    setValue(currentSession?.title ?? '')
  }, [currentSession?.id, currentSession?.title])

  const commit = () => {
    if (!currentSession) return setEditing(false)
    const v = value.trim()
    if (v && v !== currentSession.title) renameSession(currentSession.id, v)
    setEditing(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') setEditing(false)
            }}
            className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-md px-2 py-1 text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        ) : (
          <h1
            className="text-base font-semibold text-zinc-100 cursor-text hover:text-zinc-50"
            title="Haz clic para renombrar"
            onClick={() => setEditing(true)}
          >
            {currentSession?.title ?? 'Nuevo chat'}
          </h1>
        )}
      </div>
    </header>
  )
}
