'use client';

import { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { useLanguage } from '@/lib/LanguageContext';
import type { Locale } from '@/lib/i18n';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const localeLabels: { locale: Locale; label: string; short: string }[] = [
    { locale: 'en', label: 'English', short: 'EN' },
    { locale: 'zh-CN', label: '简体中文', short: '简' },
    { locale: 'zh-TW', label: '繁體中文', short: '繁' },
];

export default function Navbar() {
    const { locale, setLocale, t } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    const currentLabel = localeLabels.find(l => l.locale === locale)?.short || 'EN';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { label: t.nav.howItWorks, href: '/#how-it-works' },
        { label: t.nav.pricing, href: '/pricing' },
        { label: t.nav.tryFree, href: '/try' },
        { label: t.nav.faq, href: '/#faq' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border/50 bg-brand-dark/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <Logo />
                    <span className="text-lg font-semibold tracking-tight text-brand-text transition-colors group-hover:text-brand-accent">
                        Rayoy
                    </span>
                </Link>

                {/* Center: Nav links (desktop) */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-brand-muted transition-colors hover:text-brand-text"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right: Lang + Auth + Mobile toggle */}
                <div className="flex items-center gap-3">
                    {/* Language Dropdown */}
                    <div className="relative flex items-center" ref={langRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-brand-muted transition-colors hover:bg-brand-card/50 hover:text-brand-text focus:outline-none"
                            aria-label="Change language"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span className="text-xs font-medium">{currentLabel}</span>
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 origin-top-right rounded-md border border-brand-border bg-brand-card py-1 shadow-lg">
                                {localeLabels.map(({ locale: loc, label }) => (
                                    <button
                                        key={loc}
                                        onClick={() => { setLocale(loc); setIsLangOpen(false); }}
                                        className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${locale === loc ? 'bg-brand-accent/10 text-brand-accent' : 'text-brand-text hover:bg-brand-border/50'}`}
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

                    {/* Auth buttons (desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">
                                    {locale.startsWith('zh') ? '登录' : 'Sign In'}
                                </button>
                            </SignInButton>
                            <Link
                                href="/try"
                                className="rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-accent-hover shadow-lg shadow-brand-accent/20"
                            >
                                {t.nav.tryFree}
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">
                                {locale.startsWith('zh') ? '控制台' : 'Dashboard'}
                            </Link>
                            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 rounded-lg border border-brand-border" } }} />
                        </SignedIn>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 text-brand-muted hover:text-brand-text"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileOpen && (
                <div className="md:hidden border-t border-brand-border/50 bg-brand-dark/95 backdrop-blur-md px-6 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block text-sm text-brand-muted hover:text-brand-text py-2"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-brand-border/30 flex items-center gap-3">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium text-brand-muted">{locale.startsWith('zh') ? '登录' : 'Sign In'}</button>
                            </SignInButton>
                            <Link href="/try" onClick={() => setIsMobileOpen(false)} className="rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-brand-dark">
                                {t.nav.tryFree}
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="text-sm font-medium text-brand-muted">
                                {locale.startsWith('zh') ? '控制台' : 'Dashboard'}
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            )}
        </nav>
    );
}
