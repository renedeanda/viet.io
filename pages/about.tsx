import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Github, FileJson, GitPullRequest, GitFork, Linkedin, Globe, Heart } from 'lucide-react';
import Page from '../components/page';
import Meta from '../components/Meta';
import Reveal from '../components/reveal';
import { aboutPageSchema, breadcrumbSchema } from '../util/seo';

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

export default function About({ stats }: { stats: AboutStats }) {

  const contributeSteps = [
    {
      Icon: GitFork,
      title: 'Fork the repo',
      text: 'Viet.io is fully open source on GitHub. Fork it and clone it locally to get started.',
    },
    {
      Icon: FileJson,
      title: 'Add a JSON file',
      text: 'Each company and investor is a single JSON file in public/data. Copy the template and fill it in.',
    },
    {
      Icon: GitPullRequest,
      title: 'Open a pull request',
      text: 'Submit your PR and once merged, the new profile goes live on the next deploy.',
    },
  ];

  const stack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Static export'];

  return (
    <>
      <Meta
        title='About Viet.io — The Open-Source Vietnam Startup Directory'
        desc={`Why Viet.io exists and how to contribute. An open-source directory tracking ${stats.companyCount}+ Vietnam tech companies and ${stats.investorCount}+ investors, built with Next.js and maintained by the community.`}
        keywords='about Viet.io, Vietnam startup directory, open source Vietnam tech, contribute Vietnam startups'
        canonical='https://viet.io/about'
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
              About <span className="text-primary">Viet.io</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              An open-source map of Vietnam&apos;s technology ecosystem — free to use,
              free to contribute to, and built in public.
            </p>
          </div>
        </div>

        <div className="px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            {/* Story */}
            <Reveal className="mb-14">
              <SectionHeader title="Why this exists" subtitle="The story behind the project" />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Vietnam is one of the fastest-growing tech economies in Southeast Asia, yet information
                  about its startups and investors has long been scattered, outdated, or locked behind paywalls.
                </p>
                <p>
                  Viet.io fixes that with a simple idea: every company and investor is a plain JSON file in a
                  public GitHub repository. Anyone can add, correct, or enrich the data — and the whole site
                  rebuilds as a fast static website.
                </p>
                <p>
                  Today the directory tracks <span className="font-semibold text-foreground">{stats.companyCount} companies</span> and{' '}
                  <span className="font-semibold text-foreground">{stats.investorCount} investors</span> across{' '}
                  <span className="font-semibold text-foreground">{stats.industryCount} industries</span>.
                </p>
              </div>
            </Reveal>

            {/* Contribute */}
            <Reveal className="mb-14">
              <SectionHeader title="How to contribute" subtitle="Three steps to add a company or investor" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
                {contributeSteps.map(({ Icon, title, text }, i) => (
                  <div key={title} className="p-5 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gold-50 dark:bg-gold-400/10 text-gold-700 dark:text-gold-400 text-sm font-bold">
                        {i + 1}
                      </span>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  View the repo
                </a>
                <a
                  href={`${REPO_URL}/blob/master/public/data/__company_template.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  <FileJson className="h-4 w-4" />
                  Company template
                </a>
                <a
                  href={`${REPO_URL}/blob/master/public/data/__investor_template.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  <FileJson className="h-4 w-4" />
                  Investor template
                </a>
              </div>
            </Reveal>

            {/* Tech stack */}
            <Reveal className="mb-14">
              <SectionHeader title="Built with" subtitle="A deliberately simple, fast stack" />
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
              <SectionHeader title="Credits & connect" subtitle="The people behind the project" />
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-6">
                <p className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>
                    Created and maintained by{' '}
                    <a href="https://www.renedeanda.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">René DeAnda</a>.
                    Special thanks to{' '}
                    <a href="https://github.com/pfranck" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">Franck</a>{' '}
                    for automating company submissions via Google Forms with{' '}
                    <a href="https://github.com/pfranck/gform-to-github" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">gform-to-github</a>.
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
                  href="/market"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 transition-all"
                >
                  Explore the market →
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
