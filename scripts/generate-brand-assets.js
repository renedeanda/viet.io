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
const faviconSvg = fs.readFileSync(path.join(publicDir, 'favicon.svg'));

// Lantern dots for the OG image background
const lanternDots = [
  { cx: 950, cy: 140, r: 10, o: 0.75 },
  { cx: 1050, cy: 320, r: 16, o: 0.55 },
  { cx: 880, cy: 470, r: 8, o: 0.6 },
  { cx: 1120, cy: 520, r: 12, o: 0.7 },
  { cx: 1000, cy: 560, r: 6, o: 0.5 },
  { cx: 820, cy: 250, r: 6, o: 0.45 },
  { cx: 1140, cy: 90, r: 7, o: 0.5 },
]
  .map(
    (d) =>
      `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="#E3B32E" opacity="${d.o}"/>
       <circle cx="${d.cx}" cy="${d.cy}" r="${d.r * 2.4}" fill="#E3B32E" opacity="${d.o * 0.18}"/>`
  )
  .join('\n');

const ogSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8F0B22"/>
      <stop offset="0.55" stop-color="#C8102E"/>
      <stop offset="1" stop-color="#A80D26"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${lanternDots}
  <rect x="80" y="196" width="72" height="10" rx="5" fill="#E3B32E"/>
  <text x="80" y="330" font-family="Helvetica, Arial, sans-serif" font-size="132" font-weight="bold" fill="#FFFFFF">Viet.io</text>
  <text x="80" y="406" font-family="Helvetica, Arial, sans-serif" font-size="42" fill="#FFE9A8">Vietnam&#8217;s Startup Ecosystem, Open-Sourced</text>
  <text x="80" y="480" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#FFFFFF" opacity="0.85">250+ tech companies &#183; 80+ investors &#183; viet.io</text>
</svg>
`);

async function generate() {
  await sharp(faviconSvg, { density: 300 })
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

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

  await sharp(ogSvg, { density: 150 })
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('✓ Brand assets generated: favicon-32x32, apple-touch-icon, icon-192, icon-512, og-image');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
