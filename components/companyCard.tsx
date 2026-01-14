import Image from 'next/image';
import { Company } from '../types/company.types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CompanyCard({ company, setIndustry, openCompany }: {
  company: Company,
  setIndustry: any,
  openCompany: any
}) {

  // Load local image file if exists
  const avatarSrc = company.logoUrl ? company.logoUrl : '/company.png'

  return (
    <Card
      onClick={(e) => {
        openCompany(company);
      }}
      className="max-w-[360px] m-2 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
    >
      <CardContent className="pt-6 text-left">
        <div className="mb-3">
          {avatarSrc ?
            <Image
              quality={60}
              alt={company.name}
              height={56}
              width={56}
              src={avatarSrc}
              className="rounded-lg"
            />
            : null
          }
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 truncate">
          {company.name}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2 mt-2">
          {company.tagline
            ? company.tagline
            : company.description
              ? company.description : null}
        </p>
      </CardContent>
      <CardFooter className="justify-end border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <Badge
          variant="outline"
          className="cursor-pointer border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
          onClick={(e) => {
            e.stopPropagation();
            setIndustry(company.industry)
          }}
        >
          {company.industry}
        </Badge>
      </CardFooter>
    </Card>
  )
}