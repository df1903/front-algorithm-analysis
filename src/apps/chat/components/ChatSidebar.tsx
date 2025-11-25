import { useChat } from '../../../hooks/useChat'
import { useState } from 'react'

export function ChatSidebar() {
  const { sessions, currentSessionId, createSession, setCurrentSession, renameSession, theme } =
    useChat()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [value, setValue] = useState('')
  const isDark = theme === 'dark'

  return (
    <div
      className={
        isDark
          ? 'flex flex-col h-full bg-gradient-to-b from-zinc-950/80 via-zinc-900/80 to-zinc-950/80'
          : 'flex flex-col h-full bg-[#FFFFFF]'
      }
    >
      <div
        className={
          'px-4 py-3 border-b ' + (isDark ? 'border-zinc-800/80' : 'border-[#E5E7EB]')
        }
      >
        <div className="flex items-center gap-3">
          <div
            className={
              'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm ' +
              (isDark ? 'bg-indigo-600/90' : 'bg-[#5A31F4]')
            }
          >
            AA
          </div>
          <div>
            <div
              className={
                'text-sm font-semibold ' +
                (isDark ? 'text-zinc-100' : 'text-[#1F2937]')
              }
            >
              Algorithms Analysis
            </div>
            <div className={'text-xs ' + (isDark ? 'text-zinc-500' : 'text-[#6B7280]')}>
              Chat de AST
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={createSession}
          className={
            'w-full rounded-lg px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 transition-colors ' +
            (isDark
              ? 'border border-dashed border-zinc-700/70 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800/70 hover:text-zinc-100 hover:border-zinc-600/80 focus:ring-indigo-500/50'
              : 'border border-transparent bg-[#5A31F4] text-white hover:bg-[#4A24D9] focus:ring-[#5A31F4]/60')
          }
        >
          + Nuevo chat
        </button>
      </div>
      <div className="flex-1 px-3 pb-3 overflow-auto">
        <ul
          className={
            'space-y-1 list-none ' +
            (isDark
              ? 'rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-1.5 py-1.5'
              : 'rounded-xl border border-[#E5E7EB] bg-[#F9FAFF] shadow-sm px-1.5 py-1.5')
          }
        >
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
                  className={
                    'w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ' +
                    (isDark
                      ? 'bg-zinc-900 text-zinc-100 border border-zinc-700 focus:ring-indigo-600'
                      : 'bg-white text-[#1F2937] border border-[#D1D5DB] focus:ring-[#5A31F4]/70')
                  }
                />
              ) : (
                <button
                  onClick={() => setCurrentSession(s.id)}
                  onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingId(s.id); setValue(s.title) }}
                  title={s.title}
                  className={
                    'w-full text-left px-3 py-2 rounded-md truncate border transition-colors ' +
                    (s.id === currentSessionId
                      ? isDark
                        ? 'bg-zinc-900 border-indigo-500 text-zinc-100'
                        : 'bg-[#E0E7FF] border-[#5A31F4] text-[#1F2937]'
                      : isDark
                        ? 'bg-zinc-900 border-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-700'
                        : 'bg-white border-transparent text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937] hover:border-[#E5E7EB]')
                  }
                >
                  {s.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={
          'px-3 pb-3 pt-1 border-t text-[11px] ' +
          (isDark
            ? 'border-zinc-900/70 text-zinc-500 bg-zinc-950'
            : 'border-[#E5E7EB] text-[#6B7280] bg-[#F9FAFB]')
        }
      >
        Doble clic en un chat para renombrarlo.
      </div>
    </div>
  )
}
