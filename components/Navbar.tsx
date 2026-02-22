'use client';

import { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { useLanguage } from '@/lib/LanguageContext';
import type { Locale } from '@/lib/i18n';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const localeLabels: { locale: Locale; label: string }[] = [
    { locale: 'en', label: 'English' },
    { locale: 'zh-CN', label: '简体中文' },
    { locale: 'zh-TW', label: '繁體中文' },
];

export default function Navbar() {
    const { locale, setLocale, t } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

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
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border/50 bg-brand-dark/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                {/* Left: Logo + Brand */}
                <a href="#" className="flex items-center gap-2.5 group">
                    <Logo />
                    <span className="text-lg font-semibold tracking-tight text-brand-text transition-colors group-hover:text-brand-accent">
                        Rayoy
                    </span>
                </a>

                {/* Center: Nav links (hidden on mobile) */}
                <div className="hidden items-center gap-8 md:flex">
                    <a
                        href="#method"
                        className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                    >
                        {t.nav.method}
                    </a>
                    <a
                        href="#report"
                        className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                    >
                        {t.nav.report}
                    </a>
                    <a
                        href="#faq"
                        className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                    >
                        {t.nav.faq}
                    </a>
                </div>

                {/* Right: Language switcher + CTA */}
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
                            <div className="absolute right-0 top-full mt-2 w-40 origin-top-right rounded-md border border-brand-border bg-brand-card py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
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

                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                            <a
                                href="#pricing"
                                className="rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-accent-hover hidden sm:block shadow-lg shadow-brand-accent/20"
                            >
                                {t.nav.getReport}
                            </a>
                        </SignedOut>
                        <SignedIn>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors"
                            >
                                Dashboard
                            </Link>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8 rounded-lg border border-brand-border"
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
}
