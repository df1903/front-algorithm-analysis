import { ChatSidebar } from '../components/ChatSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { MessageList } from '../components/MessageList'
import { ChatInput } from '../components/ChatInput'
import { ChatProvider } from '../../../store/chat'

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="h-screen grid grid-cols-[280px_1fr] bg-zinc-950 text-zinc-100 overflow-hidden">
        <aside className="sticky top-0 h-screen border-r border-zinc-800 bg-zinc-900/80 backdrop-blur overflow-y-auto">
          <ChatSidebar />
        </aside>
        <main className="grid grid-rows-[auto_1fr_auto] min-h-0">
          <ChatHeader />
          <section className="overflow-y-auto min-h-0">
            <MessageList />
          </section>
          <footer className="border-t border-zinc-800 bg-zinc-900/70 p-3">
            <ChatInput />
          </footer>
        </main>
      </div>
    </ChatProvider>
  )
}
