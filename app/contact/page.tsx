'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { legalTranslations } from '@/lib/legal-i18n';
import LegalHeader from '@/components/LegalHeader';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const { locale } = useLanguage();
    const t = legalTranslations[locale].contact;

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col">
            <LegalHeader />

            <main className="flex-grow pt-16 pb-24 px-6 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
                        {t.title}
                    </h1>
                    <p className="text-lg text-brand-muted mb-12">
                        {t.description}
                    </p>

                    <a
                        href="mailto:support@rayoy.com"
                        className="inline-flex items-center justify-center rounded-md bg-brand-card border border-brand-border/50 px-8 py-4 text-brand-text transition-all hover:bg-brand-card/80 hover:border-brand-accent/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.1)] group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-brand-accent group-hover:scale-110 transition-transform">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span className="font-medium text-lg tracking-wide">support@rayoy.com</span>
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
