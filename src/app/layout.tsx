import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PDF-GPT | Your Personal PDF Library with AI Superpowers',
  description:
    'Manage your PDFs with AI powers: upload, search, summarize, and ask questions. Experience the future of document management.',
  keywords: ['PDF', 'AI', 'document management', 'search', 'summarize', 'GPT'],
  authors: [{ name: 'PDF-GPT' }],
  openGraph: {
    title: 'PDF-GPT | Your Personal PDF Library with AI Superpowers',
    description: 'Manage your PDFs with AI powers: upload, search, summarize, and ask questions.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
