import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaladedev.com';
const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || 'Ayodeji Alalade';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'La Jade Labs';
const mail = process.env.NEXT_PUBLIC_EMAIL || 'lajadelabs@gmail.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${ownerName} — Full-Stack Developer`,
    template: `%s | ${siteName}`,
  },
  description:
    'Full-Stack Developer specializing in Laravel & React. Building scalable APIs and modern web applications.',
  keywords: [
    'Full Stack Developer',
    'Laravel Developer',
    'React Developer',
    'PHP Developer',
    'Next.js Developer',
    'Web Developer Nigeria',
    'API Development',
    ownerName,
  ],
  authors: [{ name: ownerName, url: siteUrl }],
  creator: ownerName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${ownerName} — Full-Stack Developer`,
    description:
      'Full-Stack Developer specializing in Laravel & React. Building scalable APIs and modern web applications.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${ownerName} Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${ownerName} — Full-Stack Developer`,
    description:
      'Full-Stack Developer specializing in Laravel & React.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0c09',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: ownerName,
              url: siteUrl,
              jobTitle: 'Full-Stack Developer',
              knowsAbout: ['Laravel', 'React', 'Next.js', 'PHP', 'MySQL', 'REST API'],
              sameAs: [
                process.env.NEXT_PUBLIC_GITHUB_URL,
                process.env.NEXT_PUBLIC_LINKEDIN_URL,
              ].filter(Boolean),
            }),
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
