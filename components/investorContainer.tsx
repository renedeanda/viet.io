import Image from 'next/image';
import Link from 'next/link';
import { withHttp } from '../util/helpers';
import { Investor, RelatedInvestor } from '../types/investor.types';
import LinkButtons from './linkButtons';
import Reveal from './reveal';
import { ExternalLink, ChevronRight, Landmark, MapPin, CalendarClock } from 'lucide-react';

export default function InvestorContainer({ investor, related, modal }: {
  investor: Investor,
  related?: RelatedInvestor[],
  modal?: boolean
}) {

  // Load local image file if exists
  const avatarSrc = investor.logoUrl ? investor.logoUrl : '/company.png'

  const contPadding = modal ? 'pt-12 pb-2' : 'pt-12 pb-20'

  const facts = [
    investor.type && { Icon: Landmark, label: 'Type', value: investor.type },
    investor.location && { Icon: MapPin, label: 'Headquarters', value: investor.location },
    investor.founded && { Icon: CalendarClock, label: 'Founded', value: investor.founded },
  ].filter(Boolean) as { Icon: typeof Landmark; label: string; value: string }[];

  return (
    <div className={`px-4 ${contPadding}`}>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link href="/investors" className="hover:text-primary transition-colors">Investors</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium line-clamp-1">{investor.name}</span>
        </nav>

        <Reveal>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Gradient accent band */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-gold-500 to-gold-400" />

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-5 mb-5">
                {avatarSrc && (
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gold-100 dark:bg-gold-400/10 rounded-xl blur-xl" />
                    <Image
                      quality={60}
                      alt={`${investor.name} logo`}
                      height={96}
                      width={96}
                      src={avatarSrc}
                      className="relative rounded-xl shadow-md bg-white p-2 border border-border"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground break-words">
                      {investor.name}
                    </h1>
                    {investor.type && (
                      <Link
                        href={`/investors?type=${encodeURIComponent(investor.type)}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200 dark:bg-gold-400/10 dark:text-gold-400 dark:border-gold-400/20 hover:border-gold-400 transition-colors"
                      >
                        {investor.type}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Fact chips */}
              {facts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {facts.map(({ Icon, label, value }) => (
                    <div key={label} className="p-3.5 rounded-xl border border-border bg-background">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                        <Icon className="h-3.5 w-3.5 text-gold-600 dark:text-gold-400" />
                        {label}
                      </div>
                      <div className="text-sm font-semibold text-foreground break-words">{value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {investor.website && (
                  <a
                    href={withHttp(investor.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit website
                  </a>
                )}
                <LinkButtons investor={investor} />
              </div>

              {investor.description && (
                <>
                  <div className="mb-4 flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-foreground">About</h2>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-4">
                    {investor.description.split('\n').map((item, i) => (
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

        {/* Related investors */}
        {related && related.length > 0 && (
          <Reveal className="mt-10">
            <div className="mb-5 flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">More {investor.type} investors</h2>
                <p className="text-sm mt-0.5 text-muted-foreground">Other investors of the same type</p>
              </div>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/investors/${item.slug}`}
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
                    <div className="text-xs text-muted-foreground line-clamp-1">{item.type}</div>
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
