'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function CancelPage() {
    const { ta } = useLanguage();
    const t = ta.analysis;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center">
            <div className="mx-auto max-w-md rounded-2xl border border-brand-border bg-brand-card/30 p-10 backdrop-blur-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-border/50">
                    <svg
                        className="h-8 w-8 text-brand-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-brand-text mb-4">
                    {t.title}
                </h1>
                <p className="text-brand-muted mb-8 text-sm leading-relaxed">
                    {t.description}
                </p>
                <Link
                    href="/pricing"
                    className="inline-flex w-full items-center justify-center rounded-md border border-brand-border bg-transparent px-6 py-3 text-sm font-medium text-brand-text transition-all hover:bg-brand-border/30"
                >
                    {t.ctaPricing}
                </Link>
                <Link
                    href="/"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md px-6 py-3 text-sm font-medium text-brand-muted transition-all hover:text-brand-text"
                >
                    {t.ctaHome}
                </Link>
            </div>
        </div>
    );
}
