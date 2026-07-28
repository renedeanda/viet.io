# Viet.io — Vietnam's Startup Ecosystem, Open-Sourced

[Viet.io](https://viet.io) is an open-source directory of technology companies and active investors in Vietnam, built as a fast static website with Next.js.

Every company and investor is a plain JSON file in this repository — anyone can add, correct, or enrich the data with a pull request.

## Features

- 🏢 **Company directory** — Vietnam tech companies, filterable by industry with instant search
- 💰 **Investor directory** — VCs, angels, accelerators, corporate VCs, and PE firms
- 📊 **[Market overview](https://viet.io/market)** — live ecosystem stats computed from the dataset plus curated macro indicators
- 🏮 **Delightful design** — Vietnam-inspired red & gold design system with an animated lantern hero (Framer Motion)
- 🌐 **Bilingual** — English and Vietnamese (`/vi`) with hreflang alternates
- 🔍 **SEO-optimized** — JSON-LD structured data (Organization, ItemList, Dataset, Breadcrumbs), Open Graph images, sitemap, robots.txt
- ⚡ **Fully static** — `next export`, no servers, deployable anywhere

## Tech stack

Next.js (pages router, static export) · React · TypeScript · Tailwind CSS · Framer Motion · next-themes

## Getting started

Requires Node.js ≥ 20.9.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build     # optimize images + production build (static export)
npm run lint      # eslint
node scripts/generate-brand-assets.js   # regenerate favicons + OG image from public/favicon.svg
```

## Contributing

All company and investor pages are generated from JSON files in `public/data/`:

1. **Fork** this repository
2. **Add a JSON file** to `public/data/companies/` or `public/data/investors/` using the templates:
   - [Company template](https://github.com/renedeanda/viet.io/blob/master/public/data/__company_template.json)
   - [Investor template](https://github.com/renedeanda/viet.io/blob/master/public/data/__investor_template.json)
3. **Open a pull request** — once merged, the profile goes live on the next deploy

Updates that add new structured data are welcome if you also update the app to accommodate the new fields (e.g. adding a products array for a company).

## Credits

Created and maintained by [René DeAnda](https://www.renedeanda.com).

Special thanks to [Franck](https://github.com/pfranck) for automating company submissions via Google Form with [gform-to-github](https://github.com/pfranck/gform-to-github). The Google Apps Script used for this is in the `scripts` folder.

## Connect

Feel free to connect with me on [LinkedIn](https://linkedin.com/in/renedeanda).

## License

Viet.io is distributed under the MIT license. See [LICENSE](https://github.com/renedeanda/viet.io/blob/master/LICENSE.md) for details.
