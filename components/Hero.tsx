'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative flex min-h-screen items-center justify-center px-6 pt-16 noise-bg overflow-hidden">
            {/* Subtle grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-brand-text sm:text-5xl md:text-6xl lg:text-7xl opacity-0 animate-fade-in-up">
                    {t.hero.headline}
                </h1>
                <p
                    className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-brand-muted sm:text-xl opacity-0 animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]"
                >
                    {t.hero.subheadline}
                </p>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center opacity-0 animate-[fade-in-up_0.8s_ease-out_0.4s_forwards]">
                    <a
                        href="#pricing"
                        className="group relative overflow-hidden rounded-md bg-brand-accent px-8 py-4 text-base font-medium text-brand-dark transition-all hover:bg-brand-accent-hover hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:scale-105"
                    >
                        <span className="relative z-10">{t.hero.ctaPrimary}</span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                    </a>
                    <a
                        href="#method"
                        className="rounded-md border border-brand-border px-8 py-4 text-base font-medium text-brand-muted transition-all hover:border-brand-muted hover:text-brand-text hover:bg-white/5"
                    >
                        {t.hero.ctaSecondary}
                    </a>
                </div>
            </div>
        </section>
    );
}
