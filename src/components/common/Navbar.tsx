'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

function LaJadeMark() {
  return (
    <svg
      viewBox="284 50 114 124"
      xmlns="http://www.w3.org/2000/svg"
      className="h-9 w-auto flex-shrink-0"
      aria-hidden="true"
    >
      {/* Outer hexagon — amber */}
      <polygon
        points="340,68 378,90 378,134 340,156 302,134 302,90"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
      />

      {/* Inner hex accent — soft amber */}
      <polygon
        points="340,80 366,95 366,129 340,144 314,129 314,95"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="0.75"
        opacity="0.45"
      />

      {/* "L" monogram — white for contrast */}
      <polyline
        points="322,100 322,132 336,132"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* "J" monogram — amber */}
      <polyline
        points="350,100 358,100 358,128 350,134 344,131"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Short circuit nubs — cropped to fit the viewBox */}
      <line x1="378" y1="112" x2="394" y2="112" stroke="#d97706" strokeWidth="1" opacity="0.45" />
      <circle cx="396" cy="112" r="2.5" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.45" />
      <line x1="302" y1="112" x2="286" y2="112" stroke="#d97706" strokeWidth="1" opacity="0.45" />
      <circle cx="284" cy="112" r="2.5" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.45" />

      {/* Corner bracket accents */}
      <polyline points="304,71 296,71 296,81"   fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <polyline points="376,71 384,71 384,81"   fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <polyline points="304,153 296,153 296,143" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <polyline points="376,153 384,153 384,143" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Hide navbar on admin routes
  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0e0c09]/95 backdrop-blur-md border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="La Jade home">
          {/* Hex icon mark — amber/white */}
          <LaJadeMark />

          {/* Wordmark as HTML — always crisp, never blurry like SVG text */}
          <span className="font-mono text-[15px] font-bold tracking-widest leading-none select-none">
            <span className="text-white">La</span>
            <span className="text-amber-500">Jade</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </Link>
            );
          })}
          <Link
            href="/quote"
            className="ml-4 px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-stone-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav
          className="px-6 pt-4 pb-6 flex flex-col gap-2 bg-[#0e0c09] border-t border-amber-600/20"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-amber-600/10 text-amber-400 border border-amber-600/20'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-3 rounded-lg bg-amber-600 text-white text-sm font-semibold text-center"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}