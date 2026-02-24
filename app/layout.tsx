import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

export const metadata: Metadata = {
  title: 'Rayoy — AI Cycle Intelligence System',
  description: 'Analyze your personal and business cycle with AI. Combining Western strategy and Eastern astrology (Bazi) to know exactly when to expand, pause, or pivot.',
  keywords: ['AI', 'cycle intelligence', 'bazi', 'strategic timing', 'astrology', 'business strategy', '八字', '周期分析'],
  authors: [{ name: 'Rayoy Intelligence Systems' }],
  openGraph: {
    title: 'Rayoy — AI Cycle Intelligence System',
    description: 'Know exactly when to expand, pause, or pivot. AI-powered strategic timing based on your personal cycle.',
    url: 'https://www.rayoy.com',
    siteName: 'Rayoy',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://www.rayoy.com/og-image.png', width: 1200, height: 630, alt: 'Rayoy AI Cycle Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rayoy — AI Cycle Intelligence',
    description: 'AI-powered strategic timing. Know when to expand, pause, or pivot.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.rayoy.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmstYnVpbGQtdGltZS1kdW1teS1rZXktMTIz'}
      appearance={{ baseTheme: dark, variables: { colorPrimary: '#6366f1' } }}
    >
      <html lang="en" className="dark">
        <body className="bg-black text-white antialiased min-h-screen">
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
