import type { Metadata, Viewport } from "next"
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#C56C86',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://prepscore.ai'),
  title: {
    default: "PrepScore - AI-Powered Interview Practice Platform",
    template: "%s | PrepScore"
  },
  description: "Master your interview skills with AI-powered feedback. Practice with realistic scenarios, get instant analysis on hiring signals, and track your improvement across multiple sessions.",
  keywords: [
    "interview practice",
    "AI interview feedback",
    "interview preparation",
    "mock interviews",
    "job interview",
    "technical interview",
    "behavioral interview",
    "interview coaching",
    "career preparation",
    "interview skills"
  ],
  authors: [{ name: "PrepScore Team" }],
  creator: "PrepScore",
  publisher: "PrepScore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prepscore.ai",
    title: "PrepScore - AI-Powered Interview Practice",
    description: "Master your interview skills with AI-powered feedback. Practice with realistic scenarios and get instant analysis.",
    siteName: "PrepScore",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrepScore - AI Interview Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepScore - AI-Powered Interview Practice",
    description: "Master your interview skills with AI-powered feedback.",
    images: ["/twitter-image.png"],
    creator: "@prepscore",
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
  icons: {
    icon: [
      { url: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PrepScore',
  },
  category: 'education',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
