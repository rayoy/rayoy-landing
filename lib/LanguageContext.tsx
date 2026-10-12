'use client';

import React, { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import { type Locale, type Translations, translations } from './i18n';
import { getLocaleSnapshot, getServerLocaleSnapshot, subscribeLocale, setLocaleCookie } from './locale-store';
import { type AppTranslations, appTranslations } from './app-i18n';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
    ta: AppTranslations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const locale = useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getServerLocaleSnapshot);
    const setLocale = setLocaleCookie;

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

