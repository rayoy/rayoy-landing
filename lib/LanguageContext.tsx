'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type Locale, type Translations, translations } from './i18n';
import { type AppTranslations, appTranslations } from './app-i18n';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
    ta: AppTranslations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Always start with 'zh-CN' to match SSR, then sync from cookie on mount
    const [locale, setLocaleState] = useState<Locale>('zh-CN');

    useEffect(() => {
        const cookie = document.cookie.split('; ').find(c => c.startsWith('locale='));
        const saved = cookie?.split('=')[1] as Locale | undefined;
        if (saved && saved !== 'zh-CN') {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    }, []);

    const t = translations[locale];
    const ta = appTranslations[locale];

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, ta }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

