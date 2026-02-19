'use client';

import Logo from './Logo';
import { useLanguage } from '@/lib/LanguageContext';
import type { Locale } from '@/lib/i18n';

const localeLabels: { locale: Locale; label: string }[] = [
    { locale: 'en', label: 'EN' },
    { locale: 'zh-CN', label: '简体' },
    { locale: 'zh-TW', label: '繁體' },
];

export default function Navbar() {
    const { locale, setLocale, t } = useLanguage();

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
                    <div className="hidden items-center gap-1 text-xs sm:flex">
                        {localeLabels.map(({ locale: loc, label }, i) => (
                            <span key={loc} className="flex items-center">
                                {i > 0 && <span className="mx-1 text-brand-border">|</span>}
                                <button
                                    onClick={() => setLocale(loc)}
                                    className={`transition-colors ${locale === loc
                                            ? 'text-brand-accent font-medium'
                                            : 'text-brand-muted hover:text-brand-text'
                                        }`}
                                >
                                    {label}
                                </button>
                            </span>
                        ))}
                    </div>
                    <a
                        href="#pricing"
                        className="rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-accent-hover"
                    >
                        {t.nav.getReport}
                    </a>
                </div>
            </div>
        </nav>
    );
}
