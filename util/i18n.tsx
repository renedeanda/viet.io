import { createContext, useContext } from 'react';
import { strings } from './strings';

export type Locale = 'en' | 'vi';

const LocaleContext = createContext<Locale>('en');

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Routes that have a /vi variant */
export const LOCALIZED_ROUTES = ['/', '/companies', '/investors', '/market', '/about'];

/** Prefix a path with /vi when the target locale is Vietnamese */
export function localePath(locale: Locale, path: string): string {
  if (locale !== 'vi') return path;
  return path === '/' ? '/vi' : `/vi${path}`;
}

/** Compute the counterpart URL for the language switcher */
export function alternatePath(asPath: string, target: Locale): string {
  const withoutQuery = asPath.split('?')[0].split('#')[0] || '/';
  const base = withoutQuery.replace(/^\/vi(?=\/|$)/, '') || '/';
  const isLocalizable = LOCALIZED_ROUTES.includes(base);
  if (target === 'vi') return isLocalizable ? localePath('vi', base) : '/vi';
  return isLocalizable ? base : '/';
}

/** hreflang alternates for a localized route (pass the EN path) */
export function hreflangAlternates(enPath: string) {
  return [
    { hrefLang: 'en', href: enPath },
    { hrefLang: 'vi', href: localePath('vi', enPath) },
    { hrefLang: 'x-default', href: enPath },
  ];
}

export { strings };
