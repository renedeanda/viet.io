import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Building, TrendingUp, Github, Users, Globe, Smartphone, Landmark, Wallet, CalendarClock, ExternalLink } from 'lucide-react';
import Page from '../../components/page';
import Meta from '../../components/Meta';
import Reveal from '../../components/reveal';
import { marketDatasetSchema, breadcrumbSchema } from '../../util/seo';
import { useLocale, localePath, hreflangAlternates, strings } from '../../util/i18n';

interface Breakdown {
  name: string;
  count: number;
}

interface MarketStats {
  companyCount: number;
  investorCount: number;
  industryCount: number;
  industries: Breakdown[];
  investorTypes: Breakdown[];
}

const indicatorIcons = [TrendingUp, CalendarClock, Wallet, Globe, Smartphone, Landmark, Building, TrendingUp, Users];

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm mt-0.5 text-muted-foreground">{subtitle}</p>
      </div>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function BarRow({ name, count, max, href }: { name: string; count: number; max: number; href: string }) {
  const width = Math.max(4, Math.round((count / max) * 100));
  return (
    <Link href={href} className="group block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{name}</span>
        <span className="text-xs font-semibold text-gold-700 dark:text-gold-400">{count}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-gold-500 dark:bg-gold-400 transition-all duration-300 group-hover:bg-primary dark:group-hover:bg-primary"
          style={{ width: `${width}%` }}
        />
      </div>
    </Link>
  );
}

export default function Market({ stats }: { stats: MarketStats }) {
  const locale = useLocale();
  const s = strings[locale];

  const maxIndustry = stats.industries.length > 0 ? stats.industries[0].count : 1;
  const maxInvType = stats.investorTypes.length > 0 ? stats.investorTypes[0].count : 1;

  const companiesPath = localePath(locale, '/companies');
  const investorsPath = localePath(locale, '/investors');

  return (
    <>
      <Meta
        title={s.market.metaTitle}
        desc={s.market.metaDesc(stats.companyCount, stats.investorCount, stats.industryCount)}
        keywords='Vietnam market overview, Vietnam digital economy, Vietnam GDP growth, Vietnam tech market, Vietnam startup statistics, Vietnam internet economy, e-Conomy SEA Vietnam'
        canonical={localePath(locale, '/market')}
        image='/og-market.png'
        locale={locale}
        alternates={hreflangAlternates('/market')}
        jsonLd={[
          marketDatasetSchema({ companyCount: stats.companyCount, investorCount: stats.investorCount }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Market Overview', path: '/market' }]),
        ]}
      />

      <Page>
        {/* Hero */}
        <div className="py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center px-3 py-1.5 mb-5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {s.market.updatedLabel}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
              {s.market.heroPre}<span className="text-primary">{s.market.heroAccent}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {s.market.heroSub}
            </p>
          </div>
        </div>

        <div className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            {/* Ecosystem snapshot */}
            <Reveal className="mb-14">
              <SectionHeader
                title={s.market.snapshotTitle}
                subtitle={s.market.snapshotSub}
              />

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 stagger-grid">
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-3xl font-bold text-gold-700 dark:text-gold-400 mb-1">{stats.companyCount}</div>
                  <div className="text-sm text-muted-foreground">{s.market.statCompanies}</div>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-3xl font-bold text-gold-700 dark:text-gold-400 mb-1">{stats.investorCount}</div>
                  <div className="text-sm text-muted-foreground">{s.market.statInvestors}</div>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-3xl font-bold text-gold-700 dark:text-gold-400 mb-1">{stats.industryCount}</div>
                  <div className="text-sm text-muted-foreground">{s.market.statIndustries}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {/* Companies by industry */}
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="text-base font-semibold text-foreground mb-4">{s.market.byIndustry}</h3>
                  <div className="space-y-3">
                    {stats.industries.slice(0, 12).map((industry) => (
                      <BarRow
                        key={industry.name}
                        name={industry.name}
                        count={industry.count}
                        max={maxIndustry}
                        href={`${companiesPath}?industry=${encodeURIComponent(industry.name)}`}
                      />
                    ))}
                  </div>
                  <Link href={companiesPath} className="inline-block mt-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {s.market.browseAllCompanies}
                  </Link>
                </div>

                {/* Investors by type */}
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="text-base font-semibold text-foreground mb-4">{s.market.byType}</h3>
                  <div className="space-y-3">
                    {stats.investorTypes.map((invType) => (
                      <BarRow
                        key={invType.name}
                        name={invType.name}
                        count={invType.count}
                        max={maxInvType}
                        href={`${investorsPath}?type=${encodeURIComponent(invType.name)}`}
                      />
                    ))}
                  </div>
                  <Link href={investorsPath} className="inline-block mt-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {s.market.browseAllInvestors}
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Macro indicators */}
            <Reveal className="mb-14">
              <SectionHeader
                title={s.market.macroTitle}
                subtitle={s.market.macroSub}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 stagger-grid">
                {s.market.indicators.map((indicator, i) => {
                  const Icon = indicatorIcons[i];
                  return (
                    <div key={indicator.label} className="p-5 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">{indicator.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1.5">{indicator.value}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{indicator.detail}</p>
                      <a
                        href={indicator.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1 text-xs text-muted-foreground/70 hover:text-primary transition-colors"
                      >
                        <span>{s.market.sourceLabel}: {indicator.source}</span>
                        <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      </a>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground/70">
                {s.market.macroDisclaimer}
              </p>
            </Reveal>

            {/* Market interpretation */}
            <Reveal className="mb-14">
              <SectionHeader
                title={s.market.signalsTitle}
                subtitle={s.market.signalsSub}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                {s.market.signals.map((signal, index) => (
                  <div key={signal.title} className="relative p-5 rounded-xl border border-border bg-card overflow-hidden">
                    <div className="absolute -right-1 -top-5 text-7xl font-bold text-primary/[0.06]" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="relative">
                      <div className="text-xs font-semibold tracking-[0.16em] uppercase text-primary mb-3">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2">{signal.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{signal.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Risks and watchlist */}
            <Reveal className="mb-14">
              <SectionHeader
                title={s.market.watchTitle}
                subtitle={s.market.watchSub}
              />
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {s.market.watchItems.map((item, index) => (
                  <div key={item.title} className="grid grid-cols-[auto_1fr] gap-4 p-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* CTA row */}
            <Reveal>
              <SectionHeader
                title={s.market.diveTitle}
                subtitle={s.market.diveSub}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={companiesPath}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Building className="h-5 w-5" />
                  {s.market.browseCompanies}
                </Link>
                <Link
                  href={investorsPath}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-gold-400/60 hover:shadow-sm transition-all"
                >
                  <TrendingUp className="h-5 w-5" />
                  {s.market.browseInvestors}
                </Link>
                <a
                  href="https://github.com/renedeanda/viet.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-gold-400/60 hover:shadow-sm transition-all"
                >
                  <Github className="h-5 w-5" />
                  {s.market.contribute}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Page>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const companiesDirectory = path.join(process.cwd(), '/public/data/companies')
  const investorsDirectory = path.join(process.cwd(), '/public/data/investors')

  const companyFiles = fs.readdirSync(companiesDirectory).filter((filename) => filename.endsWith('.json'))
  const investorFiles = fs.readdirSync(investorsDirectory).filter((filename) => filename.endsWith('.json'))

  const industryCounts: Record<string, number> = {}
  companyFiles.forEach((filename) => {
    const fileContents = fs.readFileSync(path.join(companiesDirectory, filename), 'utf8')
    const { industry } = JSON.parse(fileContents)
    if (industry) {
      industryCounts[industry] = (industryCounts[industry] || 0) + 1
    }
  })

  const investorTypeCounts: Record<string, number> = {}
  investorFiles.forEach((filename) => {
    const fileContents = fs.readFileSync(path.join(investorsDirectory, filename), 'utf8')
    const { type } = JSON.parse(fileContents)
    if (type) {
      investorTypeCounts[type] = (investorTypeCounts[type] || 0) + 1
    }
  })

  const toSortedBreakdown = (counts: Record<string, number>): Breakdown[] =>
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))

  const stats: MarketStats = {
    companyCount: companyFiles.length,
    investorCount: investorFiles.length,
    industryCount: Object.keys(industryCounts).length,
    industries: toSortedBreakdown(industryCounts),
    investorTypes: toSortedBreakdown(investorTypeCounts),
  }

  return {
    props: {
      stats
    },
  }
}
