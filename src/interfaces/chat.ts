export type Role = 'user' | 'assistant'

export type InputMode = 'pseudocode' | 'natural'

export interface ChatMessage {
  id: string
  role: Role
  content: string
}

export interface ChatSession {
  id: string
  title: string
  inputMode: InputMode | null
  messages: ChatMessage[]
}
