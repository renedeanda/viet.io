import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Building, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import Page from '../components/page';
import Meta from '../components/Meta';
import LanternBackground from '../components/lanternBackground';
import Reveal from '../components/reveal';
import { websiteSchema, siteOrganizationSchema } from '../util/seo';
import { useLocale, localePath, hreflangAlternates, strings } from '../util/i18n';

interface HomeStats {
  companyCount: number;
  investorCount: number;
  industryCount: number;
  topIndustries: { name: string; count: number }[];
}

export default function Home({ stats }: { stats: HomeStats }) {
  const locale = useLocale();
  const s = strings[locale];

  return (
    <div>
      <Meta
        title={s.home.metaTitle}
        desc={s.home.metaDesc(stats.companyCount, stats.investorCount, stats.industryCount)}
        keywords='Vietnam startups, Vietnam tech companies, Vietnam startup ecosystem, Vietnam investors, Vietnam venture capital, Southeast Asia startups, Vietnam digital economy'
        canonical={localePath(locale, '/')}
        image='/og-image.png'
        locale={locale}
        alternates={hreflangAlternates('/')}
        jsonLd={[websiteSchema(), siteOrganizationSchema()]} />

      <Page>
        {/* Hero */}
        <div className="relative py-20 md:py-28 px-6">
          <LanternBackground />
          <div className="relative max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-5">
              {s.home.heroPre}<span className="text-primary">{s.home.heroAccent}</span>{s.home.heroPost}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {s.home.heroSub}
            </p>

            {/* Live stat chips */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground">
                <span className="font-semibold text-gold-700 dark:text-gold-400">{stats.companyCount}</span> {s.home.companiesLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground">
                <span className="font-semibold text-gold-700 dark:text-gold-400">{stats.investorCount}</span> {s.home.investorsLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground">
                <span className="font-semibold text-gold-700 dark:text-gold-400">{stats.industryCount}</span> {s.home.industriesLabel}
              </span>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                href={localePath(locale, '/companies')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Building className="h-5 w-5" />
                {s.home.findCompanies}
              </Link>
              <Link
                href={localePath(locale, '/investors')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-gold-400/60 hover:shadow-sm transition-all"
              >
                <TrendingUp className="h-5 w-5" />
                {s.home.findInvestors}
              </Link>
            </div>

            {/* Market overview callout */}
            <div className="flex justify-center">
              <Link href={localePath(locale, '/market')} className="group">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border hover:border-gold-400/60 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <BarChart3 className="h-6 w-6 text-gold-700 dark:text-gold-400" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{s.home.marketCallout}</div>
                    <div className="text-sm text-muted-foreground">{s.home.marketCalloutSub}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Top industries */}
        <div className="px-6 pb-20">
          <Reveal className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{s.home.exploreByIndustry}</h2>
                <p className="text-sm mt-0.5 text-muted-foreground">{s.home.exploreSub}</p>
              </div>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {stats.topIndustries.map((industry) => (
                <Link key={industry.name} href={`${localePath(locale, '/companies')}?industry=${encodeURIComponent(industry.name)}`}>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium cursor-pointer bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold-400/60 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    {industry.name}
                    <span className="text-xs text-gold-700 dark:text-gold-400 font-semibold">{industry.count}</span>
                  </span>
                </Link>
              ))}
              <Link href={localePath(locale, '/companies')}>
                <span className="inline-flex items-center px-3.5 py-2 rounded-full text-sm font-medium cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                  {s.home.viewAll}
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </Page>

    </div>
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

  const topIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  const stats: HomeStats = {
    companyCount: companyFiles.length,
    investorCount: investorFiles.length,
    industryCount: Object.keys(industryCounts).length,
    topIndustries,
  }

  return {
    props: {
      stats
    },
  }
}
