export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  stack?: string;
  image?: string;
  image_url?: string;
  github?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
}
