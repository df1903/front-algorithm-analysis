import { useState } from 'react'
import { useChat } from '../../../hooks/useChat'

export function ChatInput() {
  const [value, setValue] = useState('')
  const { sendMessage } = useChat()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = value.trim()
    if (!text) return
    sendMessage(text)
    setValue('')
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const text = value.trim()
      if (!text) return
      sendMessage(text)
      setValue('')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
      <div className="flex gap-2 items-end">
        <textarea
          className="flex-1 min-h-[56px] max-h-52 resize-y rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Escribe tu mensaje... (Shift+Enter: salto de linea)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!value.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M6.672 3.853a.75.75 0 0 1 .788-.056l13.5 7.5a.75.75 0 0 1 0 1.306l-13.5 7.5A.75.75 0 0 1 6 19.5v-5.318a.75.75 0 0 1 .53-.717l8.46-2.82-8.46-2.82A.75.75 0 0 1 6 7.108V3.75a.75.75 0 0 1 .672-.897Z" />
          </svg>
          Enviar
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-400 text-center">
        Se enviara al endpoint /api/analyzer/ast como <code>{'{ text: "..." }'}</code>
      </p>
    </form>
  )
}
