'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { legalTranslations } from '@/lib/legal-i18n';
import LegalHeader from '@/components/LegalHeader';
import Footer from '@/components/Footer';

export default function TermsPage() {
    const { locale } = useLanguage();
    const t = legalTranslations[locale].terms;

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col">
            <LegalHeader />

            <main className="flex-grow pt-16 pb-24 px-6 relative overflow-hidden">
                {/* Background glow for legal pages */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-3xl">
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">
                            {t.title}
                        </h1>
                        <p className="text-sm text-brand-muted font-mono">
                            Last Updated: {t.lastUpdated}
                        </p>
                    </div>

                    <div
                        className="prose prose-invert prose-brand max-w-none text-brand-muted prose-headings:text-brand-text prose-a:text-brand-accent hover:prose-a:text-brand-accent-hover prose-strong:text-brand-text"
                        // Since we are writing the content as markdown-like strings in the dictionary,
                        // we can either render it dangerously or build a simple parser.
                        // Given we control the exact string in the i18n file without user input, we can safely use dangerouslySetInnerHTML
                        // after a quick replace to convert markdown newlines/headers to HTML.
                        // For simplicity in this static React structure, we'll map the plain text if it's strictly formatted, 
                        // but the best way when using a dictionary of strings with markdown is to just render the string.
                        // We will replace basic markdown bold and newlines to keep it dependency-free.
                        dangerouslySetInnerHTML={{
                            __html: t.content
                                .replace(/###\s(.*?)\n/g, '<h3>$1</h3>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n\n/g, '<br/><br/>')
                                .replace(/\n/g, ' ')
                        }}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
