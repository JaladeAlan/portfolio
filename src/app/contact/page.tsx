'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { Send, Mail, Github, Linkedin, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: '',
  });

  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/JaladeAlan';
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/ayodejialalade';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'lajadelabs@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', message: 'Your message was sent! I\'ll be in touch soon.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err?.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-4">Contact</p>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white mb-5 leading-tight">
            Let's Talk
          </h1>
          <p className="text-stone-400 text-lg max-w-lg leading-relaxed">
            Got a project idea, a job opportunity, or just want to say hello? I'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <div className="md:col-span-3">
            {status.type === 'success' ? (
              <div className="p-8 rounded-2xl border border-green-600/20 bg-green-900/10 text-center">
                <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-white mb-2">Message sent!</h3>
                <p className="text-stone-400">{status.message}</p>
                <button
                  onClick={() => setStatus({ type: '', message: '' })}
                  className="mt-6 text-amber-400 hover:text-amber-300 text-sm transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {status.type === 'error' && (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-900/10">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{status.message}</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-stone-400 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white placeholder-stone-600 focus:outline-none focus:border-amber-600/50 focus:bg-white/5 transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-stone-400 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white placeholder-stone-600 focus:outline-none focus:border-amber-600/50 focus:bg-white/5 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-stone-400 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell me about your project or idea..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white placeholder-stone-600 focus:outline-none focus:border-amber-600/50 focus:bg-white/5 transition-all resize-none text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(217,119,6,0.4)]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-2">
                Other ways to reach me
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Prefer a different channel? Find me on any of these platforms.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2 hover:border-amber-600/20 hover:bg-white/4 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg border border-amber-600/20 bg-amber-600/10 flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                  <Mail size={16} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-stone-300 text-sm font-medium">Email</p>
                  <p className="text-stone-600 text-xs font-mono">{email}</p>
                </div>
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2 hover:border-amber-600/20 hover:bg-white/4 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center group-hover:bg-white/5 transition-colors">
                  <Github size={16} className="text-stone-300" />
                </div>
                <div>
                  <p className="text-stone-300 text-sm font-medium">GitHub</p>
                  <p className="text-stone-600 text-xs">View my open source work</p>
                </div>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2 hover:border-amber-600/20 hover:bg-white/4 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center group-hover:bg-white/5 transition-colors">
                  <Linkedin size={16} className="text-stone-300" />
                </div>
                <div>
                  <p className="text-stone-300 text-sm font-medium">LinkedIn</p>
                  <p className="text-stone-600 text-xs">Connect professionally</p>
                </div>
              </a>
            </div>

            <div className="p-5 rounded-xl border border-amber-600/15 bg-amber-600/5">
              <p className="text-amber-400 text-sm font-medium mb-1">Response time</p>
              <p className="text-stone-500 text-xs leading-relaxed">
                I typically respond to messages within 24-48 hours.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
