/**
 * Generates brand raster assets from SVG sources using sharp.
 * Run: node scripts/generate-brand-assets.js
 * Outputs (committed to the repo):
 *   public/favicon-32x32.png, public/apple-touch-icon.png,
 *   public/icon-192.png, public/icon-512.png, public/og-image.png
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const companiesDir = path.join(publicDir, 'data', 'companies');
const investorsDir = path.join(publicDir, 'data', 'investors');
const companyOgDir = path.join(publicDir, 'og', 'company');
const investorOgDir = path.join(publicDir, 'og', 'investor');
const faviconSvg = fs.readFileSync(path.join(publicDir, 'favicon.svg'));

const readJsonDirectory = (directory) =>
  fs.readdirSync(directory)
    .filter((filename) => filename.endsWith('.json'))
    .sort()
    .map((filename) => JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8')));

const companies = readJsonDirectory(companiesDir);
const investors = readJsonDirectory(investorsDir);
const companyCount = companies.length;
const investorCount = investors.length;

const escapeXml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

function wrapText(value, maxCharacters = 22) {
  const words = String(value).trim().split(/\s+/);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxCharacters || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  });

  if (line) lines.push(line);
  if (lines.length <= 2) return lines;
  return [lines[0], `${lines.slice(1).join(' ').slice(0, maxCharacters - 1).trim()}…`];
}

function createEditorialPanel() {
  return `
  <rect x="852" y="40" width="308" height="550" rx="38" fill="#B74350"/>
  <circle cx="1006" cy="195" r="108" fill="none" stroke="#FAF7EF" stroke-width="1.5" opacity="0.18"/>
  <circle cx="1006" cy="195" r="78" fill="none" stroke="#FAF7EF" stroke-width="1.5" opacity="0.18"/>
  <circle cx="1006" cy="195" r="5" fill="#FAF7EF" opacity="0.5"/>
  <path d="M926 128 L1006 286 L1086 128" fill="none" stroke="#FAF7EF" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M896 445 H1116" stroke="#FAF7EF" stroke-width="1.5" opacity="0.3"/>
  <text x="896" y="487" font-family="Avenir Next, Avenir, sans-serif" font-size="16" font-weight="600" letter-spacing="2.2" fill="#FAF7EF">OPEN DATA</text>
  <text x="896" y="521" font-family="Avenir Next, Avenir, sans-serif" font-size="16" font-weight="600" letter-spacing="2.2" fill="#FAF7EF">BUILT IN PUBLIC</text>
  <text x="896" y="558" font-family="Avenir Next, Avenir, sans-serif" font-size="14" font-weight="500" letter-spacing="1.5" fill="#FAF7EF" opacity="0.72">VIET.IO / 2026</text>`;
}

const createOgSvg = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FAF7EF"/>

  <!-- Editorial grid and brand line -->
  <path d="M80 111 H802 M80 535 H802" stroke="#B74350" stroke-width="1.5" opacity="0.22"/>
  <text x="80" y="88" font-family="Avenir Next, Avenir, sans-serif" font-size="22" font-weight="600" letter-spacing="3.5" fill="#B74350">VIET.IO</text>
  <text x="802" y="88" text-anchor="end" font-family="Avenir Next, Avenir, sans-serif" font-size="15" font-weight="500" letter-spacing="2" fill="#B74350" opacity="0.62">VIETNAM TECH DIRECTORY</text>

  <!-- Campaign headline -->
  <text x="78" y="231" font-family="Avenir Next, Avenir, sans-serif" font-size="72" font-weight="700" letter-spacing="-2.2" fill="#B74350">Vietnam&#8217;s</text>
  <text x="78" y="315" font-family="Avenir Next, Avenir, sans-serif" font-size="72" font-weight="700" letter-spacing="-2.2" fill="#B74350">startup ecosystem,</text>
  <text x="78" y="407" font-family="New York, Georgia, serif" font-size="68" font-style="italic" letter-spacing="-1.5" fill="#B74350">open-sourced.</text>

  <!-- Live directory counts -->
  <rect x="80" y="465" width="226" height="46" rx="23" fill="none" stroke="#B74350" stroke-width="1.5" opacity="0.72"/>
  <text x="193" y="496" text-anchor="middle" font-family="Avenir Next, Avenir, sans-serif" font-size="19" font-weight="600" letter-spacing="0.4" fill="#B74350">${companyCount} COMPANIES</text>
  <rect x="320" y="465" width="190" height="46" rx="23" fill="none" stroke="#B74350" stroke-width="1.5" opacity="0.72"/>
  <text x="415" y="496" text-anchor="middle" font-family="Avenir Next, Avenir, sans-serif" font-size="19" font-weight="600" letter-spacing="0.4" fill="#B74350">${investorCount} INVESTORS</text>

  <!-- Detached brand-mark panel -->
  ${createEditorialPanel()}
</svg>
`);

function createSectionOgSvg({ eyebrow, title, accent, detail }) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FAF7EF"/>
  <path d="M80 111 H802 M80 535 H802" stroke="#B74350" stroke-width="1.5" opacity="0.22"/>
  <text x="80" y="88" font-family="Avenir Next, Avenir, sans-serif" font-size="20" font-weight="600" letter-spacing="3.2" fill="#B74350">${escapeXml(eyebrow)}</text>
  <text x="78" y="254" font-family="Avenir Next, Avenir, sans-serif" font-size="70" font-weight="700" letter-spacing="-2" fill="#B74350">${escapeXml(title)}</text>
  <text x="78" y="348" font-family="New York, Georgia, serif" font-size="66" font-style="italic" letter-spacing="-1.4" fill="#B74350">${escapeXml(accent)}</text>
  <text x="80" y="463" font-family="Avenir Next, Avenir, sans-serif" font-size="21" font-weight="500" fill="#B74350" opacity="0.78">${escapeXml(detail)}</text>
  ${createEditorialPanel()}
</svg>
`);
}

function createProfileOgSvg({ name, kind, category }) {
  const titleLines = wrapText(name);
  const titleStart = titleLines.length === 1 ? 285 : 242;
  const detailY = titleLines.length === 1 ? 376 : 414;
  const label = kind === 'company' ? 'COMPANY PROFILE' : 'INVESTOR PROFILE';
  const descriptor = kind === 'company' ? 'Vietnam technology company' : 'Investor active in Vietnam';

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FAF7EF"/>
  <path d="M80 111 H802 M80 535 H802" stroke="#B74350" stroke-width="1.5" opacity="0.22"/>
  <text x="80" y="88" font-family="Avenir Next, Avenir, sans-serif" font-size="20" font-weight="600" letter-spacing="3.2" fill="#B74350">${label} / VIET.IO</text>
  ${titleLines.map((line, index) => `<text x="78" y="${titleStart + index * 78}" font-family="Avenir Next, Avenir, sans-serif" font-size="68" font-weight="700" letter-spacing="-1.8" fill="#B74350">${escapeXml(line)}</text>`).join('\n  ')}
  <rect x="80" y="${detailY}" width="${Math.max(180, Math.min(410, 110 + escapeXml(category).length * 11))}" height="46" rx="23" fill="none" stroke="#B74350" stroke-width="1.5" opacity="0.72"/>
  <text x="102" y="${detailY + 30}" font-family="Avenir Next, Avenir, sans-serif" font-size="18" font-weight="600" letter-spacing="0.3" fill="#B74350">${escapeXml(category || descriptor)}</text>
  <text x="80" y="493" font-family="Avenir Next, Avenir, sans-serif" font-size="20" font-weight="500" fill="#B74350" opacity="0.68">${escapeXml(descriptor)}</text>
  ${createEditorialPanel()}
</svg>
`);
}

async function renderOgImage(svg, outputPath) {
  await sharp(svg, { density: 150 })
    .resize(1200, 630)
    .png()
    .toFile(outputPath);
}

async function renderProfiles(items, kind, outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (let index = 0; index < items.length; index += 8) {
    const batch = items.slice(index, index + 8);
    await Promise.all(batch.map((item) => renderOgImage(
      createProfileOgSvg({
        name: item.name,
        kind,
        category: kind === 'company' ? item.industry : item.type,
      }),
      path.join(outputDirectory, `${item.slug}.png`)
    )));
  }
}

function createPngBackedIco(png) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);
  return Buffer.concat([header, png]);
}

async function generate() {
  const favicon32 = await sharp(faviconSvg, { density: 300 })
    .resize(32, 32)
    .png()
    .toBuffer();

  await Promise.all([
    fs.promises.writeFile(path.join(publicDir, 'favicon-32x32.png'), favicon32),
    fs.promises.writeFile(path.join(publicDir, 'favicon.ico'), createPngBackedIco(favicon32)),
  ]);

  await sharp(faviconSvg, { density: 300 })
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(faviconSvg, { density: 300 })
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(faviconSvg, { density: 300 })
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  await Promise.all([
    renderOgImage(createOgSvg(), path.join(publicDir, 'og-image.png')),
    renderOgImage(createSectionOgSvg({
      eyebrow: 'VIET.IO / OPEN DIRECTORY',
      title: `${companyCount} technology companies`,
      accent: 'ready to explore.',
      detail: 'Browse Vietnam’s startup ecosystem by industry.',
    }), path.join(publicDir, 'og-companies.png')),
    renderOgImage(createSectionOgSvg({
      eyebrow: 'VIET.IO / CAPITAL DIRECTORY',
      title: `${investorCount} active investors`,
      accent: 'mapped in public.',
      detail: 'Venture capital, private equity, accelerators and angels.',
    }), path.join(publicDir, 'og-investors.png')),
    renderOgImage(createSectionOgSvg({
      eyebrow: 'VIETNAM MARKET / JULY 2026',
      title: 'Growth, capital',
      accent: 'and digital momentum.',
      detail: '8.18% H1 GDP growth · $39B digital economy · $509M VC',
    }), path.join(publicDir, 'og-market.png')),
    renderOgImage(createSectionOgSvg({
      eyebrow: 'ABOUT VIET.IO',
      title: 'The ecosystem,',
      accent: 'built in public.',
      detail: 'Open data for Vietnam’s technology community.',
    }), path.join(publicDir, 'og-about.png')),
  ]);

  await Promise.all([
    renderProfiles(companies, 'company', companyOgDir),
    renderProfiles(investors, 'investor', investorOgDir),
  ]);

  console.log(
    `✓ Brand assets generated for ${companyCount} companies and ${investorCount} investors`
  );
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
