'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">
            {/* Subtle grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            <div className="relative z-10 mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-brand-text sm:text-5xl md:text-6xl lg:text-7xl">
                    {t.hero.headline}
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-brand-muted sm:text-xl">
                    {t.hero.subheadline}
                </p>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <a
                        href="#pricing"
                        className="rounded-md bg-brand-accent px-6 py-3 text-base font-medium text-brand-dark transition-all hover:bg-brand-accent-hover hover:shadow-lg hover:shadow-brand-accent/20"
                    >
                        {t.hero.ctaPrimary}
                    </a>
                    <a
                        href="#method"
                        className="rounded-md border border-brand-border px-6 py-3 text-base font-medium text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text"
                    >
                        {t.hero.ctaSecondary}
                    </a>
                </div>
            </div>
        </section>
    );
}
