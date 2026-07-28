import Image from 'next/image';
import { Company } from '../types/company.types';

export default function CompanyCard({ company, setIndustry, openCompany }: {
  company: Company,
  setIndustry: any,
  openCompany: any
}) {

  // Load local image file if exists
  const avatarSrc = company.logoUrl ? company.logoUrl : '/company.png'

  return (
    <div
      onClick={() => openCompany(company)}
      className="group flex flex-col w-full h-full cursor-pointer rounded-xl border border-border bg-card transition-all duration-200 hover:border-gold-400/60 hover:shadow-sm hover:-translate-y-0.5"
    >
      <div className="flex-1 p-5">
        <div className="flex items-start gap-3">
          {avatarSrc && (
            <div className="flex-shrink-0">
              <Image
                quality={60}
                alt={company.name}
                height={48}
                width={48}
                src={avatarSrc}
                className="rounded-lg object-contain bg-white p-1 border border-border"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {company.name}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {company.tagline || company.description || 'No description'}
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <button
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200 dark:bg-gold-400/10 dark:text-gold-400 dark:border-gold-400/20 hover:border-gold-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIndustry(company.industry)
          }}
        >
          {company.industry}
        </button>
      </div>
    </div>
  )
}
