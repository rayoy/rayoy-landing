import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

export const metadata: Metadata = {
  title: 'Rayoy — AI Cycle Intelligence System',
  description: 'Analyze your personal and business cycle. Know when to expand, pause, or pivot.',
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
