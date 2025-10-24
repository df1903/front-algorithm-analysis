import type { ChatMessage } from '../../../interfaces/chat'

function renderContent(content: string) {
  if (content.startsWith('```')) {
    // Render simple fenced code block
    const stripped = content.replace(/^```[a-z]*\n?/i, '').replace(/```\s*$/i, '')
    return (
      <pre className="whitespace-pre-wrap text-[12px] md:text-sm bg-zinc-950 text-zinc-100 border border-zinc-800 p-4 rounded-xl overflow-auto font-mono">
        <code>{stripped}</code>
      </pre>
    )
  }
  return <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{content}</p>
}

export function MessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
        }`}
      >
        {renderContent(message.content)}
      </div>
    </div>
  )
}
