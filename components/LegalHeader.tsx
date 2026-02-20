'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useLanguage } from '@/lib/LanguageContext';
import type { Locale } from '@/lib/i18n';
import { legalTranslations } from '@/lib/legal-i18n';

const localeLabels: { locale: Locale; label: string }[] = [
    { locale: 'en', label: 'English' },
    { locale: 'zh-CN', label: '简体中文' },
    { locale: 'zh-TW', label: '繁體中文' },
];

export default function LegalHeader() {
    const { locale, setLocale } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    const t = legalTranslations[locale].nav;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="border-b border-brand-border/50 bg-brand-dark">
            <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 group text-brand-muted hover:text-brand-text transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="text-sm font-medium">{t.back}</span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Globe Dropdown */}
                    <div className="relative flex items-center" ref={langRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center justify-center rounded-full p-2 text-brand-muted transition-colors hover:bg-brand-card/50 hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                            aria-label="Change language"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isLangOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 origin-top-right rounded-md border border-brand-border bg-brand-card py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50">
                                {localeLabels.map(({ locale: loc, label }) => (
                                    <button
                                        key={loc}
                                        onClick={() => {
                                            setLocale(loc);
                                            setIsLangOpen(false);
                                        }}
                                        className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${locale === loc
                                                ? 'bg-brand-accent/10 text-brand-accent'
                                                : 'text-brand-text hover:bg-brand-border/50'
                                            }`}
                                    >
                                        {label}
                                        {locale === loc && (
                                            <svg className="ml-auto h-4 w-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
