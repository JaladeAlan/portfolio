import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, Code2, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import type { Project } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of full-stack web applications, APIs, and systems built with Laravel and React.',
  openGraph: {
    title: 'Projects | JaladeDev',
    description: 'Full-stack projects built with Laravel & React.',
  },
};

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="pt-32 pb-16 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-4">Portfolio</p>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
            My Projects
          </h1>
          <p className="text-stone-400 text-lg max-w-xl leading-relaxed">
            A curated collection of web apps, APIs, and full-stack systems I've designed and built.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {projects.length === 0 ? (
            <div className="text-center py-24">
              <Code2 size={40} className="text-stone-700 mx-auto mb-4" />
              <p className="text-stone-500 font-mono text-sm">No projects yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-stone-500 mb-4">Interested in working together?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all"
          >
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col rounded-xl border border-white/5 bg-white/2 overflow-hidden hover:border-amber-600/25 transition-all duration-300 card-hover">
      <Link href={`/projects/${project.id}`} className="block relative h-48 bg-stone-900 overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/15 to-stone-900 flex items-center justify-center">
            <Code2 size={36} className="text-stone-700" />
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {project.stack && (
          <p className="text-amber-600 font-mono text-xs mb-2 truncate">{project.stack}</p>
        )}

        <Link href={`/projects/${project.id}`}>
          <h2 className="text-white font-semibold text-lg mb-2 group-hover:text-amber-300 transition-colors leading-snug">
            {project.title}
          </h2>
        </Link>

        <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {project.summary}
        </p>

        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-stone-400 hover:text-white hover:border-white/15 text-xs font-medium transition-colors"
            >
              <Github size={12} /> Code
            </a>
          )}
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-stone-400 hover:text-white hover:border-white/15 text-xs font-medium transition-colors"
            >
              <ExternalLink size={12} /> Live
            </a>
          )}
          <Link
            href={`/projects/${project.id}`}
            className="ml-auto flex items-center gap-1 text-amber-600 hover:text-amber-400 text-xs font-medium transition-colors group/link"
          >
            Details
            <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}