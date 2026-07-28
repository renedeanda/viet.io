import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Building, TrendingUp, Github, Users, Globe, Smartphone, Landmark, Wallet, CalendarClock } from 'lucide-react';
import Page from '../../components/page';
import Meta from '../../components/Meta';
import { marketDatasetSchema, breadcrumbSchema } from '../../util/seo';

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

// Curated macro indicators — approximate figures for context.
const macroIndicators = [
  {
    icon: Users,
    label: 'Population',
    value: '≈100 million',
    detail: 'Crossed the 100M mark in 2023, the 15th most populous country in the world.',
    source: 'General Statistics Office of Vietnam',
  },
  {
    icon: Landmark,
    label: 'GDP growth',
    value: '≈7% per year',
    detail: 'One of the fastest-growing economies in Asia over the past decade.',
    source: 'General Statistics Office / World Bank',
  },
  {
    icon: Wallet,
    label: 'Digital economy',
    value: '≈$36B GMV',
    detail: 'Projected to reach $90–200B by 2030, among the fastest-growing in Southeast Asia.',
    source: 'e-Conomy SEA (Google, Temasek, Bain)',
  },
  {
    icon: Globe,
    label: 'Internet users',
    value: '≈79 million',
    detail: 'Roughly 4 in 5 people are online, with heavy mobile-first usage.',
    source: 'DataReportal Digital Vietnam',
  },
  {
    icon: Smartphone,
    label: 'Smartphone adoption',
    value: '≈85% of adults',
    detail: 'Mobile is the primary gateway to the internet, commerce, and payments.',
    source: 'GSMA / DataReportal',
  },
  {
    icon: CalendarClock,
    label: 'Median age',
    value: '≈33 years',
    detail: 'A young, tech-literate workforce powering startups and global outsourcing.',
    source: 'UN World Population Prospects',
  },
];

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
        <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">{count}</span>
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

  const maxIndustry = stats.industries.length > 0 ? stats.industries[0].count : 1;
  const maxInvType = stats.investorTypes.length > 0 ? stats.investorTypes[0].count : 1;

  return (
    <>
      <Meta
        title='Vietnam Market Overview — Tech Economy Stats & Startup Data | Viet.io'
        desc={`Vietnam tech market snapshot: ${stats.companyCount} companies and ${stats.investorCount} investors tracked across ${stats.industryCount} industries, plus macro indicators — GDP growth, digital economy size, internet adoption and demographics.`}
        keywords='Vietnam market overview, Vietnam digital economy, Vietnam GDP growth, Vietnam tech market, Vietnam startup statistics, Vietnam internet economy, e-Conomy SEA Vietnam'
        canonical='https://viet.io/market'
        jsonLd={[
          marketDatasetSchema({ companyCount: stats.companyCount, investorCount: stats.investorCount }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Market Overview', path: '/market' }]),
        ]}
      />

      <Page>
        {/* Hero */}
        <div className="py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
              Vietnam <span className="text-primary">Market Overview</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A snapshot of one of Southeast Asia&apos;s fastest-growing tech economies — live data from the
              Viet.io directory alongside key macro indicators.
            </p>
          </div>
        </div>

        <div className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            {/* Ecosystem snapshot */}
            <div className="mb-14">
              <SectionHeader
                title="Ecosystem snapshot"
                subtitle="Live from the open-source Viet.io directory"
              />

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 stagger-grid">
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-3xl font-bold text-gold-600 dark:text-gold-400 mb-1">{stats.companyCount}</div>
                  <div className="text-sm text-muted-foreground">Tech companies tracked</div>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-3xl font-bold text-gold-600 dark:text-gold-400 mb-1">{stats.investorCount}</div>
                  <div className="text-sm text-muted-foreground">Active investors listed</div>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="text-3xl font-bold text-gold-600 dark:text-gold-400 mb-1">{stats.industryCount}</div>
                  <div className="text-sm text-muted-foreground">Industries represented</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {/* Companies by industry */}
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="text-base font-semibold text-foreground mb-4">Companies by industry</h3>
                  <div className="space-y-3">
                    {stats.industries.slice(0, 12).map((industry) => (
                      <BarRow
                        key={industry.name}
                        name={industry.name}
                        count={industry.count}
                        max={maxIndustry}
                        href={`/companies?industry=${encodeURIComponent(industry.name)}`}
                      />
                    ))}
                  </div>
                  <Link href="/companies" className="inline-block mt-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Browse all companies →
                  </Link>
                </div>

                {/* Investors by type */}
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="text-base font-semibold text-foreground mb-4">Investors by type</h3>
                  <div className="space-y-3">
                    {stats.investorTypes.map((invType) => (
                      <BarRow
                        key={invType.name}
                        name={invType.name}
                        count={invType.count}
                        max={maxInvType}
                        href={`/investors?type=${encodeURIComponent(invType.name)}`}
                      />
                    ))}
                  </div>
                  <Link href="/investors" className="inline-block mt-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Browse all investors →
                  </Link>
                </div>
              </div>
            </div>

            {/* Macro indicators */}
            <div className="mb-14">
              <SectionHeader
                title="Macro indicators"
                subtitle="Why Vietnam is one of Asia's most watched tech markets"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 stagger-grid">
                {macroIndicators.map((indicator) => (
                  <div key={indicator.label} className="p-5 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2.5 mb-2">
                      <indicator.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">{indicator.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1.5">{indicator.value}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{indicator.detail}</p>
                    <p className="text-xs text-muted-foreground/70">Source: {indicator.source}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground/70">
                Macro figures are approximate and provided for context only. Refer to the cited sources for the latest official data.
              </p>
            </div>

            {/* CTA row */}
            <div>
              <SectionHeader
                title="Dive deeper"
                subtitle="Explore the ecosystem or contribute to the project"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/companies"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Building className="h-5 w-5" />
                  Browse Companies
                </Link>
                <Link
                  href="/investors"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-gold-400/60 hover:shadow-sm transition-all"
                >
                  <TrendingUp className="h-5 w-5" />
                  Browse Investors
                </Link>
                <a
                  href="https://github.com/renedeanda/Tech.Viet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-gold-400/60 hover:shadow-sm transition-all"
                >
                  <Github className="h-5 w-5" />
                  Contribute on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const companiesDirectory = path.join(process.cwd(), '/public/data/companies')
  const investorsDirectory = path.join(process.cwd(), '/public/data/investors')

  const companyFiles = fs.readdirSync(companiesDirectory)
  const investorFiles = fs.readdirSync(investorsDirectory)

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
