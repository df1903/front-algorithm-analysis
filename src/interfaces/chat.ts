export type Role = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: Role
  content: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
}

