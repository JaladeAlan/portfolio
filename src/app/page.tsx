import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Github, ExternalLink, Code2, Server, Database, Layers } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import type { Project } from '@/lib/supabase';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaladedev.com';
const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || 'Joseph Alalade';

export const metadata: Metadata = {
  title: `${ownerName} — Full-Stack Developer`,
  description:
    'Full-Stack Developer specializing in Laravel & React. I build scalable APIs and modern frontend applications.',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: `${ownerName} — Full-Stack Developer`,
    description: 'Full-Stack Developer specializing in Laravel & React.',
    url: siteUrl,
  },
};

// Server-side Supabase client (uses anon key — RLS handles access)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

const skills = [
  { name: 'Laravel', category: 'Backend', icon: Server },
  { name: 'React / Next.js', category: 'Frontend', icon: Code2 },
  { name: 'PHP', category: 'Backend', icon: Server },
  { name: 'MySQL', category: 'Database', icon: Database },
  { name: 'PostgreSQL', category: 'Database', icon: Database },
  { name: 'REST API', category: 'Backend', icon: Layers },
  { name: 'Tailwind CSS', category: 'Frontend', icon: Code2 },
  { name: 'JWT Auth', category: 'Security', icon: Layers },
  { name: 'Git & GitHub', category: 'DevOps', icon: Github },
];

export default async function HomePage() {
  const projects = await getFeaturedProjects();

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(217,119,6,0.12),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.15) 39px, rgba(255,255,255,0.15) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.15) 39px, rgba(255,255,255,0.15) 40px)`,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-600/30 bg-amber-600/10 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-slow" />
            <span className="text-amber-400 text-xs font-mono tracking-wide uppercase">
              Available for Freelance
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 animate-fade-up">
            <span className="block text-white">Hi, I'm</span>
            <span className="block text-shimmer mt-1">{ownerName}</span>
          </h1>

          <p className="text-stone-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4 animate-fade-up animate-delay-200 leading-relaxed">
            Full-Stack Developer crafting powerful{' '}
            <span className="text-stone-200 font-medium">APIs</span> and{' '}
            <span className="text-stone-200 font-medium">modern web apps</span> with Laravel & React.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-up animate-delay-300">
            {['Laravel', 'React', 'Next.js', 'PHP', 'MySQL'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-stone-500 bg-white/3"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animate-delay-400">
            <Link
              href="/projects"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all duration-200 hover:shadow-[0_0_30px_rgba(217,119,6,0.5)]"
            >
              View My Work
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/10 text-stone-300 hover:text-white hover:border-white/20 font-semibold transition-all"
            >
              Get In Touch
            </Link>
          </div>

          <div className="mt-20 flex justify-center animate-fade-in animate-delay-600">
            <div className="flex flex-col items-center gap-2 text-stone-600">
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-stone-600" />
              <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─────────────────────────────────────── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-3">About</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Building the web,<br />
                <em className="italic font-normal text-stone-400">one layer at a time</em>
              </h2>
              <p className="text-stone-400 leading-relaxed mb-4">
                I'm a full-stack developer passionate about building powerful API-driven applications.
                My expertise spans across Laravel, React, PostgreSQL, and modern DevOps practices.
              </p>
              <p className="text-stone-400 leading-relaxed mb-8">
                I focus on clean architecture, code maintainability, and creating great user experiences —
                from the database layer all the way to the pixel.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors group"
              >
                Let's work together
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Stack', value: 'Laravel + React', sub: 'Primary expertise' },
                { label: 'Focus', value: 'Full-Stack', sub: 'Frontend & Backend' },
                { label: 'Approach', value: 'API-first', sub: 'Scalable architecture' },
                { label: 'Style', value: 'Clean Code', sub: 'Maintainable & tested' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-xl border border-white/5 bg-white/3 hover:border-amber-600/20 transition-colors"
                >
                  <p className="text-amber-500 font-mono text-xs uppercase tracking-wide mb-2">
                    {stat.label}
                  </p>
                  <p className="text-white font-semibold text-sm">{stat.value}</p>
                  <p className="text-stone-600 text-xs mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SKILLS ─────────────────────────────────────── */}
      <section id="skills" className="py-24 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-3">Skills</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Tech Stack</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="group p-4 rounded-xl border border-white/5 bg-white/2 hover:border-amber-600/25 hover:bg-amber-600/5 transition-all duration-200 cursor-default"
              >
                <div className="flex items-start gap-3">
                  <skill.icon
                    size={16}
                    className="text-stone-600 group-hover:text-amber-500 transition-colors mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-stone-200 font-medium text-sm">{skill.name}</p>
                    <p className="text-stone-600 text-xs mt-0.5">{skill.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ──────────────────────────── */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-3">Work</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden sm:flex items-center gap-1.5 text-stone-500 hover:text-amber-400 text-sm transition-colors group"
            >
              View all
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 text-stone-600">
              <p className="font-mono text-sm">Projects loading soon...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          <div className="mt-10 sm:hidden text-center">
            <Link href="/projects" className="text-stone-500 hover:text-amber-400 text-sm transition-colors">
              View all projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-10 sm:p-16 rounded-2xl border border-white/5 bg-gradient-to-b from-white/3 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.07),transparent_70%)]" />
            <div className="relative">
              <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-4">Let's Build</p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
                Have a project in mind?
              </h2>
              <p className="text-stone-400 mb-8 max-w-lg mx-auto leading-relaxed">
                I'm available for freelance work — websites, APIs, or full-stack systems.
                Let's bring your idea to life.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all duration-200 hover:shadow-[0_0_40px_rgba(217,119,6,0.5)]"
              >
                Start a Conversation
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-xl border border-white/5 bg-white/2 overflow-hidden hover:border-amber-600/25 transition-all duration-300 card-hover"
    >
      <div className="relative h-44 bg-stone-900 overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-stone-900 flex items-center justify-center">
            <Code2 size={32} className="text-stone-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {project.stack && (
          <p className="text-amber-600 font-mono text-xs mb-2 truncate">{project.stack}</p>
        )}
        <h3 className="text-white font-semibold mb-2 group-hover:text-amber-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {project.summary}
        </p>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-stone-500 hover:text-white text-xs transition-colors"
            >
              <Github size={13} /> Code
            </a>
          )}
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-stone-500 hover:text-white text-xs transition-colors"
            >
              <ExternalLink size={13} /> Live
            </a>
          )}
          <span className="ml-auto text-xs text-amber-600 group-hover:text-amber-400 transition-colors font-medium">
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}