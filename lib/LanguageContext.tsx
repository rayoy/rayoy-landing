'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Locale, type Translations, translations } from './i18n';
import { type AppTranslations, appTranslations } from './app-i18n';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
    ta: AppTranslations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLocale(): Locale {
    if (typeof window === 'undefined') return 'en';
    const cookie = document.cookie.split('; ').find(c => c.startsWith('locale='));
    return (cookie?.split('=')[1] as Locale) || 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

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

