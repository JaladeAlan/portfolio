'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Send, Loader2,
  Globe, Smartphone, Layers, Zap,
  Clock, User, Mail, Building2, MessageSquare,
  ChevronDown, Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const PROJECT_TYPES = [
  { id: 'web',    icon: Globe,       label: 'Web App',        desc: 'SaaS, dashboards, portals' },
  { id: 'mobile', icon: Smartphone,  label: 'Mobile App',     desc: 'iOS, Android, React Native' },
  { id: 'both',   icon: Layers,      label: 'Web + Mobile',   desc: 'Full cross-platform' },
  { id: 'other',  icon: Zap,         label: 'Other / Custom', desc: 'API, integrations, more' },
];

const email = process.env.NEXT_PUBLIC_EMAIL || 'lajadelabs@gmail.com';

const TIMELINES = [
  'ASAP (< 1 month)',
  '1 – 2 months',
  '3 – 6 months',
  '6+ months / ongoing',
  'Not sure yet',
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">{label}</label>
        {hint && <span className="text-xs text-stone-600">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/10 hover:border-amber-600/30 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition-all duration-200';

function TimelineSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200 outline-none bg-white/5 ${
          open ? 'border-amber-500/60 ring-2 ring-amber-500/10' : 'border-white/10 hover:border-amber-600/30'
        }`}
      >
        <Clock size={14} className="shrink-0 text-stone-600" />
        <span className={`flex-1 ${value ? 'text-white' : 'text-stone-600'}`}>
          {value || 'Select timeline'}
        </span>
        <ChevronDown size={14} className={`shrink-0 text-stone-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-[#1a1612] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-600">
            Select timeline
          </p>
          <div className="pb-1.5">
            {TIMELINES.map((t) => {
              const active = value === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => { onChange(t); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
                    active ? 'bg-amber-600/15 text-amber-300' : 'text-stone-300 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  {t}
                  {active && <Check size={13} className="text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuotePage() {
  const router = useRouter();
  const [projectType, setProjectType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: Record<string, string>) => {
    const e: Record<string, string> = {};
    if (!data.name?.trim())    e.name    = 'Required';
    if (!data.email?.trim())   e.email   = 'Required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Invalid email';
    if (!projectType)          e.type    = 'Pick a project type';
    if (!data.message?.trim()) e.message = 'Tell me a bit about the project';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      const { error } = await supabase.from('quotes').insert([{
        name: data.name,
        email: data.email,
        company: data.company || null,
        project_type: projectType,
        timeline: timeline || null,
        message: data.message,
      }]);

      if (error) throw error;
      router.push('/quote/confirmed');
    } catch (err: any) {
      setErrors({ submit: err?.message || 'Something went wrong. Please try again.' });
      setSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-[#0e0c09] pt-28 pb-20 px-6"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-600/5 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-300 transition-colors mb-10"
        >
          <ArrowLeft size={13} /> Back
        </Link>

        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-amber-600 mb-3">La Jade</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Get a Quote
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed max-w-md">
            Tell me about your project and I'll put together a tailored proposal — usually within 24 hours.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-6 sm:p-8 flex flex-col gap-7">

              {errors.submit && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-900/10">
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-600 mb-5">Contact</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Your name">
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                      <input
                        name="name"
                        type="text"
                        placeholder="Ada Okonkwo"
                        autoComplete="name"
                        className={`${inputCls} pl-9 ${errors.name ? 'border-red-500/60' : ''}`}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                  </Field>

                  <Field label="Email">
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                      <input
                        name="email"
                        type="email"
                        placeholder="ada@company.com"
                        autoComplete="email"
                        className={`${inputCls} pl-9 ${errors.email ? 'border-red-500/60' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </Field>

                  <Field label="Company" hint="optional">
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none" />
                      <input
                        name="company"
                        type="text"
                        placeholder="Acme Ltd"
                        autoComplete="organization"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </Field>
                </div>
              </section>

              <div className="h-px bg-white/5" />

              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-600 mb-5">Project type</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PROJECT_TYPES.map(({ id, icon: Icon, label, desc }) => {
                    const active = projectType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setProjectType(id)}
                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200 ${
                          active
                            ? 'border-amber-500/60 bg-amber-600/10 text-white'
                            : 'border-white/8 bg-white/[0.02] text-stone-400 hover:border-white/15 hover:text-stone-300'
                        }`}
                      >
                        <Icon size={17} className={active ? 'text-amber-400' : 'text-stone-600'} />
                        <span className="text-xs font-bold leading-tight">{label}</span>
                        <span className="text-[10px] leading-tight opacity-60">{desc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.type && <p className="text-xs text-red-400 mt-2">{errors.type}</p>}
              </section>

              <div className="h-px bg-white/5" />

              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-600 mb-5">Scope</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Timeline" hint="optional">
                    <TimelineSelect value={timeline} onChange={setTimeline} />
                  </Field>
                </div>
              </section>

              <div className="h-px bg-white/5" />

              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-600 mb-5">Project details</p>
                <Field label="Tell me about your project">
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-stone-600 pointer-events-none" />
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="What are you building? What problem does it solve? Any specific features or tech preferences?"
                      className={`${inputCls} pl-9 resize-none leading-relaxed ${errors.message ? 'border-red-500/60' : ''}`}
                    />
                  </div>
                  {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
                </Field>
              </section>
            </div>

            <div className="px-6 sm:px-8 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-stone-600 leading-relaxed">No commitment. Just a conversation.</p>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_24px_rgba(217,119,6,0.4)] active:scale-[0.98] whitespace-nowrap"
              >
                {submitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Sending…</>
                ) : (
                  <><Send size={15} /> Send Request</>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-stone-700 mt-6">
          Prefer email?{' '}
          <a href={`mailto:${email}`} className="text-stone-500 hover:text-amber-500 transition-colors">
            {email}
          </a>
        </p>
      </div>
    </main>
  );
}