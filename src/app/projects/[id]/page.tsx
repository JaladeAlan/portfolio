import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, ExternalLink, Code2, Calendar, Layers } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import type { Project } from '@/lib/supabase';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const project = await getProject(params.id);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.summary ?? undefined,
    openGraph: {
      title: `${project.title} | JaladeDev`,
      description: project.summary ?? undefined,
      images: project.image_url ? [{ url: project.image_url }] : [],
    },
    twitter: {
      title: `${project.title} | JaladeDev`,
      description: project.summary ?? undefined,
      images: project.image_url ? [project.image_url] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const formattedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : null;

  // Prefer stack_tags array; fall back to comma-split of stack string
  const stackTags: string[] =
    project.stack_tags?.length
      ? project.stack_tags
      : project.stack?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <>
      <div className="pt-24 pb-4 px-6 max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-400 text-sm transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Projects
        </Link>
      </div>

      {project.image_url && (
        <div className="relative h-64 sm:h-80 md:h-96 max-w-4xl mx-auto px-6 mb-10">
          <div className="relative h-full rounded-2xl overflow-hidden border border-white/8">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c09] to-transparent" />
          </div>
        </div>
      )}

      <article className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
              {project.title}
            </h1>

            {project.summary && (
              <p className="text-stone-300 text-lg leading-relaxed mb-8 font-medium">
                {project.summary}
              </p>
            )}

            {project.description && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-white">About this project</h2>
                <div className="text-stone-400 leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {stackTags.length > 0 && (
              <div className="p-5 rounded-xl border border-white/5 bg-white/2">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-amber-500" />
                  <p className="text-stone-400 text-xs uppercase tracking-widest font-mono">Stack</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stackTags.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-full text-xs font-mono border border-amber-600/20 text-amber-500 bg-amber-600/5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formattedDate && (
              <div className="p-5 rounded-xl border border-white/5 bg-white/2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-amber-500" />
                  <p className="text-stone-400 text-xs uppercase tracking-widest font-mono">Built</p>
                </div>
                <p className="text-stone-200 text-sm">{formattedDate}</p>
              </div>
            )}

            <div className="space-y-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-white/8 text-stone-300 hover:text-white hover:border-white/15 transition-all group"
                >
                  <Github size={16} className="group-hover:text-amber-400 transition-colors" />
                  <span className="text-sm font-medium">View on GitHub</span>
                  <ExternalLink size={12} className="ml-auto text-stone-600" />
                </a>
              )}
              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all group"
                >
                  <Code2 size={16} />
                  <span className="text-sm font-semibold">Live Demo</span>
                  <ExternalLink size={12} className="ml-auto" />
                </a>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-stone-500 hover:text-amber-400 text-sm transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            All Projects
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all"
          >
            Hire Me
          </Link>
        </div>
      </article>
    </>
  );
}