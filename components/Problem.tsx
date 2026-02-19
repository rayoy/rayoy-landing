'use client';

import { useLanguage } from '@/lib/LanguageContext';

const icons = [
    // Expansion icon — arrows outward
    <svg key="expand" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M16 6v20M6 16h20M10 10L6 6M22 10l4-4M10 22l-4 4M22 22l4 4" />
    </svg>,
    // Partnership icon — two circles
    <svg key="partner" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2DD4BF" strokeWidth="1.5">
        <circle cx="12" cy="16" r="7" />
        <circle cx="20" cy="16" r="7" />
    </svg>,
    // Cycle icon — circular arrow
    <svg key="cycle" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M26 16a10 10 0 1 1-3-7" />
        <path d="M26 6v6h-6" />
    </svg>,
];

export default function Problem() {
    const { t } = useLanguage();

    return (
        <section id="method" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-2xl font-semibold tracking-tight text-brand-text sm:text-3xl md:text-4xl">
                    {t.problem.title}
                </h2>
                <div className="mt-16 grid gap-8 sm:grid-cols-3">
                    {t.problem.items.map((item, i) => (
                        <div
                            key={i}
                            className="group rounded-lg border border-brand-border bg-brand-card/50 p-8 transition-all hover:border-brand-accent/30 hover:bg-brand-card"
                        >
                            <div className="mb-5 opacity-60 transition-opacity group-hover:opacity-100">
                                {icons[i]}
                            </div>
                            <p className="text-base leading-relaxed text-brand-muted group-hover:text-brand-text transition-colors">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
