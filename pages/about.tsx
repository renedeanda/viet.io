import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Github, FileJson, GitPullRequest, GitFork, Linkedin, Globe, Heart } from 'lucide-react';
import Page from '../components/page';
import Meta from '../components/Meta';
import Reveal from '../components/reveal';
import { aboutPageSchema, breadcrumbSchema } from '../util/seo';
import { useLocale, localePath, hreflangAlternates, strings } from '../util/i18n';

const REPO_URL = 'https://github.com/renedeanda/viet.io';

interface AboutStats {
  companyCount: number;
  investorCount: number;
  industryCount: number;
}

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

const stepIcons = [GitFork, FileJson, GitPullRequest];
const stack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Static export'];

export default function About({ stats }: { stats: AboutStats }) {
  const locale = useLocale();
  const s = strings[locale];

  return (
    <>
      <Meta
        title={s.about.metaTitle}
        desc={s.about.metaDesc(stats.companyCount, stats.investorCount)}
        keywords='about Viet.io, Vietnam startup directory, open source Vietnam tech, contribute Vietnam startups'
        canonical={localePath(locale, '/about')}
        locale={locale}
        alternates={hreflangAlternates('/about')}
        jsonLd={[
          aboutPageSchema(),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]),
        ]}
      />

      <Page>
        {/* Hero */}
        <div className="py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
              {s.about.heroPre}<span className="text-primary">Viet.io</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {s.about.heroSub}
            </p>
          </div>
        </div>

        <div className="px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            {/* Story */}
            <Reveal className="mb-14">
              <SectionHeader title={s.about.whyTitle} subtitle={s.about.whySub} />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{s.about.p1}</p>
                <p>{s.about.p2}</p>
                <p>
                  {s.about.p3a}
                  <span className="font-semibold text-foreground">{stats.companyCount} {s.home.companiesLabel}</span>
                  {s.about.p3b}
                  <span className="font-semibold text-foreground">{stats.investorCount} {s.home.investorsLabel}</span>
                  {s.about.p3c}
                  <span className="font-semibold text-foreground">{stats.industryCount} {s.home.industriesLabel}</span>
                  {s.about.p3d}
                </p>
              </div>
            </Reveal>

            {/* Contribute */}
            <Reveal className="mb-14">
              <SectionHeader title={s.about.contributeTitle} subtitle={s.about.contributeSub} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
                {s.about.steps.map((step, i) => {
                  const Icon = stepIcons[i];
                  return (
                    <div key={step.title} className="p-5 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gold-50 dark:bg-gold-400/10 text-gold-700 dark:text-gold-400 text-sm font-bold">
                          {i + 1}
                        </span>
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-1.5">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  {s.about.viewRepo}
                </a>
                <a
                  href={`${REPO_URL}/blob/master/public/data/__company_template.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  <FileJson className="h-4 w-4" />
                  {s.about.companyTemplate}
                </a>
                <a
                  href={`${REPO_URL}/blob/master/public/data/__investor_template.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  <FileJson className="h-4 w-4" />
                  {s.about.investorTemplate}
                </a>
              </div>
            </Reveal>

            {/* Tech stack */}
            <Reveal className="mb-14">
              <SectionHeader title={s.about.builtWithTitle} subtitle={s.about.builtWithSub} />
              <div className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Credits & connect */}
            <Reveal>
              <SectionHeader title={s.about.creditsTitle} subtitle={s.about.creditsSub} />
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                <p className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>
                    {s.about.creditsA}
                    <a href="https://www.renedeanda.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">René DeAnda</a>
                    {s.about.creditsB}
                    <a href="https://github.com/pfranck" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">Franck</a>
                    {s.about.creditsC}
                    <a href="https://github.com/pfranck/gform-to-github" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">gform-to-github</a>
                    {s.about.creditsD}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://linkedin.com/in/renedeanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href="https://www.renedeanda.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  <Globe className="h-4 w-4" />
                  renedeanda.com
                </a>
                <Link
                  href={localePath(locale, '/market')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  {s.about.exploreMarket}
                </Link>
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

  const companyFiles = fs.readdirSync(companiesDirectory)
  const investorFiles = fs.readdirSync(investorsDirectory)

  const industries = new Set<string>()
  companyFiles.forEach((filename) => {
    const { industry } = JSON.parse(fs.readFileSync(path.join(companiesDirectory, filename), 'utf8'))
    if (industry) industries.add(industry)
  })

  return {
    props: {
      stats: {
        companyCount: companyFiles.length,
        investorCount: investorFiles.length,
        industryCount: industries.size,
      }
    },
  }
}
