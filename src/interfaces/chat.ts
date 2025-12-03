export type Role = 'user' | 'assistant'

export type InputMode = 'pseudocode' | 'natural'

import type { AnalyzerResponse } from './analyzer'

export interface ChatMessage {
  id: string
  role: Role
  content: string
  analysis?: AnalyzerResponse
}

export interface ChatSession {
  id: string
  title: string
  inputMode: InputMode | null
  messages: ChatMessage[]
}
