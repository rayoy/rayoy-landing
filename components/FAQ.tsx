'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function FAQ() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <section id="faq" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl">
                <h2 className="text-center text-2xl font-semibold tracking-tight text-brand-text sm:text-3xl">
                    {t.faq.title}
                </h2>

                <div className="mt-12 space-y-3">
                    {t.faq.items.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-brand-border bg-brand-card/30 transition-colors hover:border-brand-accent/20"
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="flex w-full items-center justify-between px-6 py-5 text-left"
                            >
                                <span className="text-sm font-medium text-brand-text pr-4">
                                    {item.q}
                                </span>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="#94A3B8"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    className={`shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-45' : ''
                                        }`}
                                >
                                    <line x1="10" y1="4" x2="10" y2="16" />
                                    <line x1="4" y1="10" x2="16" y2="10" />
                                </svg>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-200 ${openIndex === i ? 'max-h-60 pb-5' : 'max-h-0'
                                    }`}
                            >
                                <p className="px-6 text-sm leading-relaxed text-brand-muted">
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
