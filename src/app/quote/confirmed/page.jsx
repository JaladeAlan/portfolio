import Link from 'next/link';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Quote Request Sent — La Jade',
};

export default function QuoteConfirmedPage() {
  return (
    <main
      className="min-h-screen bg-[#0e0c09] flex items-center justify-center px-6 py-20"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-600/5 blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full text-center flex flex-col items-center gap-8">

        {/* Icon */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-24 h-24 rounded-full border border-amber-600/20 flex items-center justify-center">
            {/* Inner filled circle */}
            <div className="w-16 h-16 rounded-full bg-amber-600/15 border border-amber-600/30 flex items-center justify-center">
              <CheckCircle size={30} className="text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border border-amber-600/10 animate-ping" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-amber-600">
            Request received
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            You're all set.
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed max-w-sm mx-auto">
            Thanks for reaching out. I'll review your project details and come
            back to you with a tailored proposal within{' '}
            <span className="text-amber-400 font-medium">24 hours</span>.
          </p>
        </div>

        {/* What happens next */}
        <div className="w-full rounded-2xl border border-white/7 bg-white/[0.025] p-6 text-left flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-600">
            What happens next
          </p>
          {[
            { step: '01', text: 'I review your project details and scope.' },
            { step: '02', text: 'I put together a tailored proposal with timeline and pricing.' },
            { step: '03', text: 'We jump on a quick call to align on everything.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-4">
              <span className="text-xs font-black text-amber-600/60 font-mono mt-0.5 shrink-0">
                {step}
              </span>
              <p className="text-sm text-stone-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-200"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <Link
            href="/projects"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_24px_rgba(217,119,6,0.35)]"
          >
            View my work
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </main>
  );
}