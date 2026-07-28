import { Company } from '../types/company.types';
import { Investor } from '../types/investor.types';

export const SITE_URL = 'https://viet.io';
export const SITE_NAME = 'Viet.io';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function externalUrl(url: string): string {
  return !/^https?:\/\//i.test(url) ? `https://${url}` : url;
}

/** WebSite schema with SearchAction (sitelinks search box eligibility) */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Vietnam Startup Ecosystem',
    url: SITE_URL,
    description: 'Open-source directory of Vietnam technology companies, startups, and investors.',
    inLanguage: ['en', 'vi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/companies?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Organization schema for Viet.io itself */
export function siteOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    sameAs: ['https://github.com/renedeanda/viet.io'],
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** CollectionPage + ItemList schema for list pages */
export function itemListSchema(
  { name, description, path, items }: {
    name: string;
    description: string;
    path: string;
    items: { name: string; path: string }[];
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 50).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

/** Organization schema for a company detail page */
export function companySchema(company: Company) {
  const sameAs = [company.facebook, company.linkedin]
    .filter(Boolean)
    .map(externalUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.website ? externalUrl(company.website) : absoluteUrl(`/company/${company.slug}`),
    ...(company.logoUrl ? { logo: absoluteUrl(company.logoUrl) } : {}),
    ...(company.tagline || company.description
      ? { description: company.tagline || company.description }
      : {}),
    ...(company.industry ? { knowsAbout: company.industry } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    location: {
      '@type': 'Country',
      name: 'Vietnam',
    },
  };
}

/** Organization schema for an investor detail page */
export function investorSchema(investor: Investor) {
  const sameAs = [investor.facebook, investor.linkedin, investor.crunchbase]
    .filter(Boolean)
    .map(externalUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: investor.name,
    url: investor.website ? externalUrl(investor.website) : absoluteUrl(`/investors/${investor.slug}`),
    ...(investor.logoUrl ? { logo: absoluteUrl(investor.logoUrl) } : {}),
    ...(investor.description ? { description: investor.description } : {}),
    ...(investor.founded ? { foundingDate: `${investor.founded}` } : {}),
    ...(investor.location ? { location: { '@type': 'Place', name: investor.location } } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Dataset schema for the market overview page */
export function marketDatasetSchema(
  { companyCount, investorCount }: { companyCount: number; investorCount: number }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Vietnam Startup Ecosystem Directory',
    description: `Open-source dataset of ${companyCount} Vietnam technology companies and ${investorCount} active investors, categorized by industry and investor type.`,
    url: `${SITE_URL}/market`,
    license: 'https://opensource.org/licenses/MIT',
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://github.com/renedeanda/viet.io/tree/master/public/data',
    },
    spatialCoverage: {
      '@type': 'Country',
      name: 'Vietnam',
    },
  };
}

/** AboutPage schema */
export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Viet.io',
    url: `${SITE_URL}/about`,
    description: 'The story behind Viet.io, the open-source directory of Vietnam technology companies and investors.',
    mainEntity: siteOrganizationSchema(),
  };
}
