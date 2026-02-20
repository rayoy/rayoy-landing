'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { legalTranslations } from '@/lib/legal-i18n';
import LegalHeader from '@/components/LegalHeader';
import Footer from '@/components/Footer';

export default function DisclaimerPage() {
    const { locale } = useLanguage();
    const t = legalTranslations[locale].disclaimer;

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col">
            <LegalHeader />

            <main className="flex-grow pt-16 pb-24 px-6 relative overflow-hidden">
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
                        className="prose prose-invert prose-brand max-w-none text-brand-muted prose-headings:text-brand-text prose-a:text-brand-accent prose-strong:text-brand-text"
                        dangerouslySetInnerHTML={{
                            __html: t.content.replace(/\n\n/g, '<br/><br/>')
                        }}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
