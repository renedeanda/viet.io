import Image from 'next/image';
import Link from 'next/link';
import { withHttp } from '../util/helpers';
import LinkButtons from './linkButtons';
import Reveal from './reveal';
import { Company, RelatedCompany } from '../types/company.types';
import { ExternalLink, ChevronRight } from 'lucide-react';

export default function CompanyContainer({ company, related, modal }: {
  company: Company,
  related?: RelatedCompany[],
  modal?: boolean
}) {

  // Load local image file if exists
  const avatarSrc = company.logoUrl ? company.logoUrl : '/company.png'

  const screenSrc = `/img/company/${company.slug}-screenshot.png`

  const contPadding = modal ? 'pt-12 pb-2' : 'pt-12 pb-20'

  return (
    <div className={`px-4 ${contPadding}`}>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link href="/companies" className="hover:text-primary transition-colors">Companies</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium line-clamp-1">{company.name}</span>
        </nav>

        <Reveal>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Gradient accent band */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-gold-500 to-gold-400" />

            <div className="relative">
              <Image
                quality={60}
                alt={`${company.name} screenshot`}
                height={300}
                width={720}
                src={screenSrc}
                className="w-full h-auto object-cover"
              />
              {/* Avatar overlapping the screenshot */}
              {avatarSrc && (
                <div className="absolute -bottom-12 left-6">
                  <Image
                    quality={60}
                    alt={`${company.name} logo`}
                    height={100}
                    width={100}
                    src={avatarSrc}
                    className="rounded-xl shadow-lg bg-white p-2 border-4 border-card"
                  />
                </div>
              )}
            </div>

            <div className="p-6 pt-16">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground break-words">
                  {company.name}
                </h1>
                {company.industry && (
                  <Link
                    href={`/companies?industry=${encodeURIComponent(company.industry)}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200 dark:bg-gold-400/10 dark:text-gold-400 dark:border-gold-400/20 hover:border-gold-400 transition-colors"
                  >
                    {company.industry}
                  </Link>
                )}
              </div>

              {company.tagline && (
                <p className="text-muted-foreground italic text-lg mb-5 break-words">
                  {company.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {company.website && (
                  <a
                    href={withHttp(company.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit website
                  </a>
                )}
                <LinkButtons company={company} />
              </div>

              {company.description && (
                <>
                  <div className="mb-4 flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-foreground">About</h2>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-4">
                    {company.description.split('\n').map((item, i) => (
                      <p key={i} className="text-muted-foreground text-base leading-relaxed break-words">
                        {item}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>

        {/* Related companies */}
        {related && related.length > 0 && (
          <Reveal className="mt-10">
            <div className="mb-5 flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">More in {company.industry}</h2>
                <p className="text-sm mt-0.5 text-muted-foreground">Other companies in this industry</p>
              </div>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/company/${item.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-gold-400/60 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Image
                    quality={60}
                    alt={item.name}
                    height={40}
                    width={40}
                    src={item.logoUrl || '/company.png'}
                    className="rounded-lg object-contain bg-white p-1 border border-border flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </div>
                    {item.tagline && (
                      <div className="text-xs text-muted-foreground line-clamp-1">{item.tagline}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}
