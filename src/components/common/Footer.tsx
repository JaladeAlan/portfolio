import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const githubUrl   = process.env.NEXT_PUBLIC_GITHUB_URL   || 'https://github.com/JaladeAlan';
const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/ayodejialalade';
const email       = process.env.NEXT_PUBLIC_EMAIL        || 'lajadelabs@gmail.com';
const ownerName   = process.env.NEXT_PUBLIC_OWNER_NAME   || 'Ayodeji Alalade';

/* ── Same mark as Navbar — keep in sync ─────────────────────────── */
function LaJadeMark() {
  return (
    <svg
      viewBox="284 50 114 124"
      xmlns="http://www.w3.org/2000/svg"
      className="h-9 w-auto flex-shrink-0"
      aria-hidden="true"
    >
      <polygon
        points="340,68 378,90 378,134 340,156 302,134 302,90"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
      />
      <polygon
        points="340,80 366,95 366,129 340,144 314,129 314,95"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="0.75"
        opacity="0.45"
      />
      <polyline
        points="322,100 322,132 336,132"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="350,100 358,100 358,128 350,134 344,131"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="378" y1="112" x2="394" y2="112" stroke="#d97706" strokeWidth="1" opacity="0.45" />
      <circle cx="396" cy="112" r="2.5" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.45" />
      <line x1="302" y1="112" x2="286" y2="112" stroke="#d97706" strokeWidth="1" opacity="0.45" />
      <circle cx="284" cy="112" r="2.5" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.45" />
      <polyline points="304,71 296,71 296,81"    fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <polyline points="376,71 384,71 384,81"    fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <polyline points="304,153 296,153 296,143" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <polyline points="376,153 384,153 384,143" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0a0804]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* ── Brand ── */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4" aria-label="La Jade home">
              <LaJadeMark />
              <span className="font-mono text-[15px] font-bold tracking-widest leading-none select-none">
                <span className="text-white">La</span>
                <span className="text-amber-500">Jade</span>
              </span>
            </Link>
            <p className="text-stone-500 text-sm leading-relaxed">
              Building scalable, beautiful web experiences with Laravel &amp; React.
            </p>
          </div>

          {/* ── Navigation ── */}
          <div>
            <h3 className="text-stone-300 font-semibold text-sm uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/',         label: 'Home' },
                { href: '/projects', label: 'Projects' },
                { href: '/contact',  label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-500 hover:text-amber-400 text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect ── */}
          <div>
            <h3 className="text-stone-300 font-semibold text-sm uppercase tracking-widest mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-stone-500 hover:text-white text-sm transition-colors group"
                >
                  <Github size={15} className="group-hover:text-amber-400 transition-colors" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-stone-500 hover:text-white text-sm transition-colors group"
                >
                  <Linkedin size={15} className="group-hover:text-amber-400 transition-colors" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-stone-500 hover:text-white text-sm transition-colors group"
                >
                  <Mail size={15} className="group-hover:text-amber-400 transition-colors" />
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="hr-gold mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-600 text-xs">
          <p>© {year} {ownerName}. All rights reserved.</p>
          <p className="font-mono">Built with Next.js &amp; Laravel</p>
        </div>
      </div>
    </footer>
  );
}