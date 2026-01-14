import Image from 'next/image';
import { Investor } from '../types/investor.types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InvestorCard({ investor, setInvType, openInvestor }: {
  investor: Investor,
  setInvType: any,
  openInvestor: any
}) {

  // Load local image file if exists
  const avatarSrc = investor.logoUrl ? investor.logoUrl : '/company.png'

  return (
    <Card
      onClick={(e) => {
        openInvestor(investor);
      }}
      className="w-full max-w-[360px] m-2 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700"
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-start">
          {avatarSrc && (
            <div className="mb-4">
              <Image
                quality={60}
                alt={investor.name}
                height={56}
                width={56}
                src={avatarSrc}
                className="rounded-lg object-contain bg-white p-1"
              />
            </div>
          )}
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 w-full">
            {investor.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-3 min-h-[60px]">
            {investor.description || 'No description available'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-700">
        <Badge
          variant="outline"
          className="cursor-pointer border-purple-500 dark:border-purple-400 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setInvType(investor.type)
          }}
        >
          {investor.type}
        </Badge>
      </CardFooter>
    </Card>
  )
}