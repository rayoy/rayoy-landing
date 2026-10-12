import type { Locale } from './i18n';

const localeEvent = 'timing-locale-change';
export function localeFromCookie(cookie: string): Locale {
    const saved = cookie.split('; ').find(part => part.startsWith('locale='))?.split('=')[1];
    return saved === 'en' || saved === 'zh-TW' ? saved : 'zh-CN';
}
export function getLocaleSnapshot(): Locale {
    return localeFromCookie(document.cookie);
}
export function getServerLocaleSnapshot(): Locale {
    return 'zh-CN';
}
export function subscribeLocale(onChange: () => void) {
    window.addEventListener(localeEvent, onChange);
    return () => window.removeEventListener(localeEvent, onChange);
}
export function setLocaleCookie(locale: Locale) {
    document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365}`;
    window.dispatchEvent(new Event(localeEvent));
}
