import type { Metadata } from 'next';
import './globals.css';
import { SkipToContent } from '@/components/common';

export const metadata: Metadata = {
  title: {
    default: 'Student Offers - Verified Student Discounts & Deals',
    template: '%s | Student Offers',
  },
  description: 'Discover verified student discounts across Tech, AI, Fashion & Travel. Save on GitHub, Notion, Spotify, Nike + many others — all with your .edu email.',
  keywords: ['student discounts', 'student offers', 'student deals', '.edu email', 'GitHub Student Pack', 'verified discounts'],
  authors: [{ name: 'Student Offers' }],
  creator: 'Student Offers',
  publisher: 'Student Offers',
  metadataBase: new URL('https://studentoffers.co'),
  alternates: {
    canonical: 'https://studentoffers.co',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://studentoffers.co',
    title: 'Student Offers - Verified Student Discounts & Deals',
    description: 'Discover verified student discounts across Tech, AI, Fashion & Travel. Save on GitHub, Notion, Spotify, Nike + many others.',
    siteName: 'Student Offers',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Student Offers - Verified Student Discounts & Deals',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@studentoffers',
    creator: '@studentoffers',
    title: 'Student Offers - Verified Student Discounts & Deals',
    description: 'Discover verified student discounts across Tech, AI, Fashion & Travel. Save on GitHub, Notion, Spotify, Nike + many others.',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
  },
};

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

import { GlobalProviders } from '@/components/GlobalProviders';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning className="font-sans">
        <SkipToContent />
        <GlobalProviders>
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
