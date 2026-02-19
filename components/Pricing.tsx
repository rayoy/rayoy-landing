'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function Pricing() {
    const { t } = useLanguage();

    return (
        <section id="pricing" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-md text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-brand-text sm:text-3xl">
                    {t.pricing.title}
                </h2>

                <div className="mt-12 rounded-xl border border-brand-border bg-brand-card/40 p-10">
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold tracking-tight text-brand-text">
                            {t.pricing.price}
                        </span>
                        <span className="text-sm text-brand-muted">/ {t.pricing.period}</span>
                    </div>

                    <p className="mt-4 text-sm text-brand-muted">{t.pricing.note}</p>

                    <ul className="mt-8 space-y-3 text-left">
                        {t.pricing.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-brand-muted">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="#2DD4BF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3,8 6.5,11.5 13,4.5" />
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <a
                        href="#"
                        className="mt-8 block w-full rounded-md bg-brand-accent py-3 text-center text-base font-medium text-brand-dark transition-all hover:bg-brand-accent-hover hover:shadow-lg hover:shadow-brand-accent/20"
                    >
                        {t.pricing.cta}
                    </a>
                </div>
            </div>
        </section>
    );
}
