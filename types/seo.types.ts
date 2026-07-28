export interface SEOProps {
    title?: string;
    desc?: string;
    canonical?: string;
    css?: string;
    image?: string;
    js?: string;
    icon?: string;
    keywords?: string;
    noindex?: boolean;
    locale?: 'en' | 'vi';
    alternates?: { hrefLang: string; href: string }[];
    jsonLd?: object[];
}
