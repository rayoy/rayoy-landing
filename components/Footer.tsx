'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
    return (
        <footer className="border-t border-brand-border px-6 py-12">
            <div className="mx-auto max-w-6xl text-center flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
                    <a href="/terms" className="text-brand-muted transition-colors hover:text-brand-accent">Terms</a>
                    <a href="/privacy" className="text-brand-muted transition-colors hover:text-brand-accent">Privacy</a>
                    <a href="/disclaimer" className="text-brand-muted transition-colors hover:text-brand-accent">Disclaimer</a>
                    <a href="/refund" className="text-brand-muted transition-colors hover:text-brand-accent">Refund</a>
                    <a href="/contact" className="text-brand-muted transition-colors hover:text-brand-accent">Contact</a>
                </div>
                <a href="mailto:support@rayoy.com" className="text-sm text-brand-muted hover:text-brand-accent transition-colors mb-4">
                    support@rayoy.com
                </a>
                <p className="text-sm text-brand-muted">© 2026 Rayoy. All rights reserved.</p>
            </div>
        </footer>
    );
}
