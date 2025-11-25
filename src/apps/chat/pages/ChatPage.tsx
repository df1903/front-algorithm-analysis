import { ChatSidebar } from '../components/ChatSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { MessageList } from '../components/MessageList'
import { ChatInput } from '../components/ChatInput'
import { ChatProvider } from '../../../store/chat'
import { useChat } from '../../../hooks/useChat'

function ChatLayout() {
  const { theme } = useChat()
  const isDark = theme === 'dark'

  const rootClasses = isDark
    ? 'h-screen grid grid-cols-[280px_1fr] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 overflow-hidden'
    : 'h-screen grid grid-cols-[280px_1fr] bg-[#F9FAFB] text-[#1F2937] overflow-hidden'

  const asideClasses = isDark
    ? 'sticky top-0 h-screen border-r border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-y-auto'
    : 'sticky top-0 h-screen border-r border-[#E5E7EB] bg-[#FFFFFF] overflow-y-auto'

  const mainClasses = isDark
    ? 'grid grid-rows-[auto_1fr_auto] min-h-0 bg-zinc-950/40'
    : 'grid grid-rows-[auto_1fr_auto] min-h-0 bg-[#F9FAFB]'

  const footerClasses = isDark
    ? 'border-t border-zinc-800/80 bg-zinc-900/70 p-3'
    : 'border-t border-[#E5E7EB] bg-[#F9FAFB] p-3'

  return (
    <div className={rootClasses}>
      <aside className={asideClasses}>
        <ChatSidebar />
      </aside>
      <main className={mainClasses}>
        <ChatHeader />
        <section className="overflow-y-auto min-h-0">
          <MessageList />
        </section>
        <footer className={footerClasses}>
          <ChatInput />
        </footer>
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  )
}
