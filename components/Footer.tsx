'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="border-t border-brand-border px-6 py-12">
            <div className="mx-auto max-w-6xl text-center">
                <p className="text-sm text-brand-muted">{t.footer.copyright}</p>
                <p className="mt-1 text-xs text-brand-muted/60">{t.footer.tagline}</p>
            </div>
        </footer>
    );
}
