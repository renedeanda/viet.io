import Head from 'next/head';
import { SEOProps } from '../types/seo.types';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '../util/seo';

export default function Meta(props: SEOProps) {
  const canonical = props.canonical ? absoluteUrl(props.canonical) : undefined;
  const image = props.image ? absoluteUrl(props.image) : DEFAULT_OG_IMAGE;
  const locale = props.locale === 'vi' ? 'vi_VN' : 'en_US';

  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.desc} />
      {props.keywords && <meta name="keywords" content={props.keywords} />}
      <meta name="robots" content={props.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.desc} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.desc} />
      <meta name="twitter:image" content={image} />

      {/* Base */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="theme-color" content="#C8102E" />
      <link rel="manifest" href="/manifest.json" />

      {/* Icons */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" href={props.icon ? props.icon : '/favicon.ico'} sizes="any" />

      {/* Canonical + language alternates */}
      {canonical && <link rel="canonical" href={canonical} />}
      {props.alternates && props.alternates.map((alt) => (
        <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={absoluteUrl(alt.href)} />
      ))}

      {props.css && <link rel="stylesheet" href={`${props.css}`} />}

      {/* Structured data */}
      {props.jsonLd && props.jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  )
}
