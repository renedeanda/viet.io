// Writes public/llms.txt and public/llms-full.txt from the company and investor
// JSON and the English copy in util/strings.ts. Runs before `next build`, like the
// sitemap generator, and exits non-zero if an entry has nothing to describe it.
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ts from 'typescript';

const SITE_URL = 'https://viet.io';
const root = process.cwd();

// util/strings.ts has no imports, so a plain transpile is enough to load it here.
const stringsSource = readFileSync(path.join(root, 'util/strings.ts'), 'utf8');
const { outputText } = ts.transpileModule(stringsSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { strings } = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);
const s = strings.en;

const load = (dir) => readdirSync(path.join(root, 'public/data', dir))
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(path.join(root, 'public/data', dir, file), 'utf8')))
  .sort((a, b) => a.name.localeCompare(b.name, 'en'));

const companies = load('companies');
const investors = load('investors');
const industries = [...new Set(companies.map((c) => c.industry).filter(Boolean))].sort();

const clean = (text = '') => text.replace(/\s+/g, ' ').trim();
const firstSentence = (text = '') => {
  const line = clean(text.split('\n')[0]);
  const match = line.match(/^.{20,240}?[.!?](?=\s|$)/);
  return match ? match[0] : line.slice(0, 240);
};
const url = (p) => `${SITE_URL}${p}`;
const href = (value) => (!value ? '' : /^https?:\/\//.test(value) ? value : `https://${value}`);

const failures = [];
function companySummary(c) {
  if (clean(c.tagline)) return clean(c.tagline);
  if (clean(c.description)) return firstSentence(c.description);
  if (c.industry) return `${/^[AEIOU]/i.test(c.industry) ? 'An' : 'A'} ${c.industry} company in Vietnam.`;
  failures.push(`company ${c.slug}: no tagline, description or industry`);
  return '';
}
function investorSummary(i) {
  const lead = firstSentence(i.description);
  if (!lead && !i.type) failures.push(`investor ${i.slug}: no description or type`);
  return [i.type, i.location].filter(Boolean).join(', ') + (lead ? `. ${lead}` : '.');
}

const header = [
  '# Viet.io',
  '',
  `> ${s.home.metaDesc(companies.length, investors.length, industries.length)}`,
  '',
  `${s.home.heroSub} ${s.about.p1}`,
  '',
];

const pages = [
  '## Pages',
  '',
  `- [Home](${url('/')}): ${s.home.metaTitle}`,
  `- [Companies](${url('/companies')}): ${s.companies.metaDesc(companies.length)}`,
  `- [Investors](${url('/investors')}): ${s.investors.metaDesc(investors.length)}`,
  `- [Market overview](${url('/market')}): ${s.market.metaDesc(companies.length, investors.length, industries.length)}`,
  `- [About](${url('/about')}): ${s.about.metaDesc(companies.length, investors.length)}`,
  '',
];

const index = [
  ...header,
  ...pages,
  '## Companies by industry',
  '',
  ...industries.flatMap((industry) => [
    `### ${industry}`,
    '',
    ...companies.filter((c) => c.industry === industry).map((c) => `- [${c.name}](${url(`/company/${c.slug}`)}): ${companySummary(c)}`),
    '',
  ]),
  ...(companies.some((c) => !c.industry)
    ? ['### Other', '', ...companies.filter((c) => !c.industry).map((c) => `- [${c.name}](${url(`/company/${c.slug}`)}): ${companySummary(c)}`), '']
    : []),
  '## Optional',
  '',
  `- [Full detail](${url('/llms-full.txt')}): every company and investor profile with websites, apps and full descriptions.`,
  '- [Source on GitHub](https://github.com/renedeanda/tech.viet): the open-source data and site.',
  '',
  'Investors:',
  '',
  ...investors.map((i) => `- [${i.name}](${url(`/investors/${i.slug}`)}): ${investorSummary(i)}`),
  '',
];

const field = (label, value) => (clean(value) ? [`${label}: ${clean(value)}`] : []);
const full = [
  ...header,
  'This is a community-maintained directory. Follow each URL for the current profile, and the company or investor site for current details.',
  '',
  ...pages,
  '## Companies',
  '',
  ...companies.flatMap((c) => [
    `### ${c.name}`,
    '',
    `URL: ${url(`/company/${c.slug}`)}`,
    ...field('Industry', c.industry),
    ...field('Website', href(c.website)),
    ...field('Tagline', c.tagline),
    ...field('iOS app', c.iosUrl),
    ...field('Android app', c.androidUrl),
    ...(c.hiring ? ['Hiring: yes'] : []),
    '',
    ...(clean(c.description) ? [clean(c.description), ''] : []),
  ]),
  '## Investors',
  '',
  ...investors.flatMap((i) => [
    `### ${i.name}`,
    '',
    `URL: ${url(`/investors/${i.slug}`)}`,
    ...field('Type', i.type),
    ...field('Location', i.location),
    ...field('Founded', i.founded),
    ...field('Website', href(i.website)),
    ...field('Portfolio', i.portfolio),
    '',
    ...(clean(i.description) ? [clean(i.description), ''] : []),
  ]),
];

if (failures.length) {
  console.error(`llms.txt: ${failures.length} entries need a description:\n${failures.join('\n')}`);
  process.exit(1);
}
writeFileSync(path.join(root, 'public/llms.txt'), index.join('\n'));
writeFileSync(path.join(root, 'public/llms-full.txt'), full.join('\n'));
console.log(`✓ llms.txt generated with ${companies.length} companies and ${investors.length} investors`);
