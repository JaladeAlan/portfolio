export type { Project, Skill, Experience, Message, Quote } from '@/lib/supabase'

export interface Admin {
  id: string
  email: string
  // user_metadata from Supabase auth
  user_metadata?: {
    name?: string
  }
}