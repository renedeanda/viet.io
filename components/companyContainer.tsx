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
      <Card className="w-full max-w-3xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700">
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
                className="rounded-xl shadow-lg bg-white dark:bg-white p-2 border-4 border-white dark:border-[#1e293b]"
              />
            </div>
          )}
        </div>
        <CardContent className="p-6 pb-24 pt-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 break-words">
            {company.name}
          </h1>
          <a
            className="flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mb-3"
            href={withHttp(company.website)}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-5 w-5" />
            {company.website}
          </a>
          {company.tagline && (
            <p className="text-gray-600 dark:text-gray-400 italic text-lg mb-3 break-words">
              {company.tagline}
            </p>
          )}
          <div className="mb-3">
            <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-500 dark:border-purple-400">
              {company.industry}
            </Badge>
          </div>
          <div className="mb-6">
            <LinkButtons company={company} isTextList />
          </div>
          {company.description && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                About
              </h2>
              <div className="space-y-4">
                {company.description.split('\n').map((item, i) => (
                  <p key={i} className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed break-words">
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