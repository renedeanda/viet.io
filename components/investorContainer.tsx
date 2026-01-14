import Image from 'next/image';
import { withHttp } from '../util/helpers';
import { Investor } from '../types/investor.types';
import LinkButtons from './linkButtons';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export default function InvestorContainer({ investor, modal }: {
  investor: Investor,
  modal?: boolean
}) {

  // Load local image file if exists
  const avatarSrc = investor.logoUrl ? investor.logoUrl : '/company.png'

  const contPadding = modal ? 'pt-12 pb-2' : 'pt-20 pb-2'

  return (
    <div className={`flex justify-center min-h-screen px-4 ${contPadding}`}>
      <Card className="w-full max-w-3xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 pb-24">
          <div className="mb-6">
            {avatarSrc && (
              <Image
                quality={60}
                alt={investor.name}
                height={100}
                width={100}
                src={avatarSrc}
                className="rounded-xl shadow-lg bg-white p-2"
              />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 break-words">
            {investor.name}
          </h1>
          <a
            className="flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mb-3"
            href={withHttp(investor.website)}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-5 w-5" />
            {investor.website}
          </a>
          <div className="mb-6">
            <LinkButtons investor={investor} isTextList />
          </div>
          {(investor.description || investor.type || investor.location || investor.founded) && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                About
              </h2>
              {investor.description && (
                <div className="space-y-4 mb-6">
                  {investor.description.split('\n').map((item, i) => (
                    <p key={i} className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed break-words">
                      {item}
                    </p>
                  ))}
                </div>
              )}
              {investor.type && (
                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                    Type of Investor
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {investor.type}
                  </p>
                </div>
              )}
              {investor.location && (
                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                    Headquarters
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {investor.location}
                  </p>
                </div>
              )}
              {investor.founded && (
                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                    Founded
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {investor.founded}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}