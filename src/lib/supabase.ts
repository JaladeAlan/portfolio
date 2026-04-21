import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching your schema
export type Project = {
  id: string
  title: string
  summary: string | null
  description: string | null
  stack: string | null
  stack_tags: string[]
  image_url: string | null
  github: string | null
  website: string | null
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type Skill = {
  id: string
  name: string
  category: string | null
  icon_name: string | null
  sort_order: number
}

export type Experience = {
  id: string
  company: string
  role: string
  description: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  location: string | null
}

export type Message = {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export type Quote = {
  id: string
  name: string
  email: string
  company: string | null
  project_type: string
  timeline: string | null
  message: string
  status: string
  created_at: string
}