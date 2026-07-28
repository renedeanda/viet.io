import Image from 'next/image';
import Link from 'next/link';
import { Investor } from '../types/investor.types';

export default function InvestorCard({ investor, setInvType }: {
  investor: Investor,
  setInvType: (type: string) => void,
}) {

  // Load local image file if exists
  const avatarSrc = investor.logoUrl ? investor.logoUrl : '/company.png'

  return (
    <article className="group relative flex flex-col w-full h-full rounded-xl border border-border bg-card transition-all duration-200 hover:border-gold-400/60 hover:shadow-sm hover:-translate-y-0.5">
      <div className="flex-1 p-5">
        <div className="flex items-start gap-3">
          {avatarSrc && (
            <div className="flex-shrink-0">
              <Image
                quality={60}
                alt={investor.name}
                height={48}
                width={48}
                src={avatarSrc}
                className="rounded-lg object-contain bg-white p-1 border border-border"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              <Link
                href={`/investors/${investor.slug}`}
                className="rounded-sm after:absolute after:inset-0 after:rounded-xl"
              >
                {investor.name}
              </Link>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {investor.description || 'No description'}
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <button
          type="button"
          className="relative z-10 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200 dark:bg-gold-400/10 dark:text-gold-400 dark:border-gold-400/20 hover:border-gold-400 transition-colors"
          onClick={() => setInvType(investor.type)}
          aria-label={`Filter by ${investor.type}`}
        >
          {investor.type}
        </button>
      </div>
    </article>
  )
}
