import { useChat } from '../../../hooks/useChat'
import { useState } from 'react'

export function ChatSidebar() {
  const { sessions, currentSessionId, createSession, setCurrentSession, renameSession } = useChat()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-800">
        <div className="text-sm tracking-wide text-zinc-300">Algorithms Analysis</div>
        <div className="text-xs text-zinc-500">Chat de AST</div>
      </div>
      <div className="p-3">
        <button
          onClick={createSession}
          className="w-full rounded-lg border border-dashed border-zinc-700/70 bg-zinc-900/60 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800/70 hover:text-zinc-100 hover:border-zinc-600/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
        >
          + Nuevo chat
        </button>
      </div>
      <div className="px-2 pb-3 overflow-auto">
        <ul className="space-y-1">
          {sessions.map((s) => (
            <li key={s.id}>
              {editingId === s.id ? (
                <input
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={() => {
                    const v = value.trim()
                    if (v) renameSession(s.id, v)
                    setEditingId(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = value.trim()
                      if (v) renameSession(s.id, v)
                      setEditingId(null)
                    }
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              ) : (
                <button
                  onClick={() => setCurrentSession(s.id)}
                  onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingId(s.id); setValue(s.title) }}
                  title={s.title}
                  className={
                    'w-full text-left px-3 py-2 rounded-md truncate border transition-colors ' +
                    (s.id === currentSessionId
                      ? 'bg-zinc-900 border-indigo-500 text-zinc-100'
                      : 'bg-zinc-900 border-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-700')
                  }
                >
                  {s.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
