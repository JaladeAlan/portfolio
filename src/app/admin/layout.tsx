import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

// Admin pages use their own full-screen layout (no public Navbar/Footer).
// The root layout renders Navbar and Footer outside <main>, so we wrap
// admin content with a portal-style div that overrides body background.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
