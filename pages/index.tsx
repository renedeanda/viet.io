import Link from 'next/link';
import { Building, TrendingUp } from 'lucide-react';
import Page from '../components/page';
import Meta from '../components/Meta';
import Footer from '../components/footer';
import { Button } from '@/components/ui/button';

export default function Home() {

  return (
    <div>
      <Meta
        title='Viet.io - Vietnam Startup Ecosystem'
        desc='List of 200+ Vietnam startups and big tech companies. Viet.io is an open-source website built with React and Next.js listing 200+ technology companies in Vietnam.'
        canonical='https://viet.io' />

      <Page inverted footerHidden>
        <div className='hero-image' />
        <div className="w-full py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center justify-center text-center mt-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Vietnam Startup Ecosystem
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 mb-8 drop-shadow-md">
                Open-sourced
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/companies">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 text-base font-semibold shadow-lg"
                  >
                    <Building className="mr-2 h-5 w-5" />
                    Find Companies
                  </Button>
                </Link>
                <Link href="/investors">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 text-base font-semibold shadow-lg"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Find Investors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer inverted />
      </Page>

    </div>
  )
}
