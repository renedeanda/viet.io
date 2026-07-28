import Image from 'next/image';
import { withHttp } from '../util/helpers';
import LinkButtons from './linkButtons';
import { Company } from '../types/company.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export default function CompanyContainer({ company, modal }: {
  company: Company,
  modal?: boolean
}) {

  // Load local image file if exists
  const avatarSrc = company.logoUrl ? company.logoUrl : '/company.png'

  const screenSrc = `/img/company/${company.slug}-screenshot.png`

  const contPadding = modal ? 'pt-12 pb-2' : 'pt-20 pb-2'

  return (
    <div className={`flex justify-center min-h-screen px-4 ${contPadding}`}>
      <Card className="w-full max-w-3xl bg-card border-border">
        <div className="relative">
          <Image
            quality={60}
            alt={company.name}
            height={300}
            width={720}
            src={screenSrc}
            className="w-full h-auto rounded-t-lg object-cover"
          />
          {/* Avatar overlapping the screenshot */}
          {avatarSrc && (
            <div className="absolute -bottom-12 left-6">
              <Image
                quality={60}
                alt={company.name}
                height={100}
                width={100}
                src={avatarSrc}
                className="rounded-xl shadow-lg bg-white dark:bg-white p-2 border-4 border-white dark:border-[#1F1F1F]"
              />
            </div>
          )}
        </div>
        <CardContent className="p-6 pb-24 pt-16">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 break-words">
            {company.name}
          </h1>
          <a
            className="flex items-center gap-2 text-lg text-primary hover:text-primary/80 transition-colors mb-3"
            href={withHttp(company.website)}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-5 w-5" />
            {company.website}
          </a>
          {company.tagline && (
            <p className="text-muted-foreground italic text-lg mb-3 break-words">
              {company.tagline}
            </p>
          )}
          <div className="mb-3">
            <Badge variant="outline" className="rounded-full bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-400/10 dark:text-gold-400 dark:border-gold-400/20">
              {company.industry}
            </Badge>
          </div>
          <div className="mb-6">
            <LinkButtons company={company} isTextList />
          </div>
          {company.description && (
            <>
              <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-4">
                About
              </h2>
              <div className="space-y-4">
                {company.description.split('\n').map((item, i) => (
                  <p key={i} className="text-muted-foreground text-lg leading-relaxed break-words">
                    {item}
                  </p>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}