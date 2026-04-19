import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaladedev.com'
const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || 'Ayodeji Alalade'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'La Jade Labs'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${ownerName} — Full-Stack Developer`,
    template: `%s | ${siteName}`,
  },
  description:
    'Full-Stack Developer specializing in Laravel & React. Building scalable APIs and modern web applications.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0c09',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}