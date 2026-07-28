import { writeFileSync } from 'fs';
import { globby } from 'globby';

const SITE_URL = 'https://viet.io';

async function generateSiteMap() {
  const pages = (await globby([
    'pages/**/*.tsx',
    '!pages/_*.tsx',
    '!pages/404.tsx',
    '!pages/500.tsx',
    '!pages/**/[company].tsx',
    '!pages/api',
    '!pages/**/[investor].tsx',
    'public/data/companies/*.json',
    'public/data/investors/*.json'
  ])).sort()

  const routes = pages.map((page) => page
    .replace(/^pages/, '')
    .replace(/\.(json|tsx|jsx|js)$/, '')
    .replace(/^public\/data\/companies/, '/company')
    .replace(/^public\/data\/investors/, '/investors')
    .replace(/\/index$/, ''))

  const urls = routes
    .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`)
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;

  writeFileSync('public/sitemap.xml', sitemap);
  console.log(`✓ Sitemap generated with ${routes.length} routes`);
}

generateSiteMap();
