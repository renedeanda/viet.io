import Page from '../../components/page';
import Meta from '../../components/Meta';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import InvestorCard from '../../components/investorCard';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Investor } from '../../types/investor.types';
import { filterInvestors } from '../../util/helpers';
import usePagination from '../../util/hooks/usePagination';
import MySearch from '../../components/mySearch';
import InvTypeButtons from '../../components/invTypeButtons';

export default function Investors({ investors }: { investors: Investor[] }) {
  const router = useRouter();
  const [invType, setInvType] = useState<string>("all");
  const [filteredInvs, setFilteredInvs] = useState(investors);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  
  // Initialize router and query parameters
  useEffect(() => {
    if (!router.isReady) return;

    const queryInvType = router.query['type'];
    if (queryInvType && typeof queryInvType === 'string') {
      setInvType(queryInvType);
    }
  }, [router.isReady, router.query]);

  const openInvestor = (investor: Investor) => {
    try {
      const url = new URL(`/investors/${investor.slug}`, window.location.origin);
      // Preserve UTM parameters
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      utmParams.forEach(param => {
        const value = router.query[param];
        if (value) {
          url.searchParams.set(param, String(value));
        }
      });
      window.open(url.toString(), '_blank');
    } catch (error) {
      console.error('Error opening investor page:', error);
      // Fallback to simple URL if URL construction fails
      window.open(`/investors/${investor.slug}`, '_blank');
    }
  };

  const { 
    next, 
    currentPage, 
    currentData, 
    maxPage, 
    resetCurrentPage 
  } = usePagination(filteredInvs, 12);

  // Update filtered investors when invType changes
  useEffect(() => {
    if (!investors) return;

    const filtered = filterInvestors(investors, invType);
    setFilteredInvs(filtered);
    resetCurrentPage();
  }, [invType, investors, resetCurrentPage]);

  const currentInvs = currentData();

  // Intersection Observer setup for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry) return;

        // If the loading element is visible and we're not on the last page, load more
        if (firstEntry.isIntersecting && currentPage < maxPage) {
          next();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [currentPage, maxPage, next]);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement && currentObserver) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement && currentObserver) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <>
      <Meta
        title='Viet.io - Vietnam Investors'
        desc='List of 200+ Vietnam startups and big tech companies. Viet.io is an open-source website built with React and Next.js listing 200+ technology companies in Vietnam.'
        canonical='https://viet.io/investors'
      />
      <Page>
        <div className="w-full my-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mt-16 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Find <span className="text-purple-600 dark:text-purple-400">Vietnam Investors</span>
              </h1>
            </div>

            {/* Search */}
            <div className="mb-8">
              <MySearch
                items={investors}
                openItem={openInvestor}
                type='investors'
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="mb-8">
              <InvTypeButtons
                setInvType={setInvType}
                invType={invType}
                filteredLength={filteredInvs.length}
              />
            </div>

            {/* Investor Cards Grid */}
            <div className="flex flex-wrap justify-center gap-4">
              {currentInvs && currentInvs.length > 0 ? (
                currentInvs.map((item: { data: Investor }) => (
                  <InvestorCard
                    key={item.data.slug}
                    investor={item.data}
                    setInvType={setInvType}
                    openInvestor={openInvestor}
                  />
                ))
              ) : (
                <p className="my-12 text-purple-600 dark:text-purple-400 text-2xl text-center w-full">
                  {`No ${invType} investors`}
                </p>
              )}
            </div>

            {/* Loading Indicator */}
            {filteredInvs.length > 0 && currentPage !== maxPage ? (
              <div ref={setElement} className="flex flex-col items-center gap-3 my-12">
                <div className="relative">
                  <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                  <div className="absolute inset-0 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 blur-sm"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading more...</p>
              </div>
            ) : null}
          </div>
        </div>
      </Page>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const investorsDirectory = path.join(process.cwd(), '/public/data/investors');
    const filenames = fs.readdirSync(investorsDirectory);

    const investors = filenames.map((filename) => {
      const filePath = path.join(investorsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');

      return {
        filename,
        data: JSON.parse(fileContents),
      };
    });

    return {
      props: {
        investors,
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        investors: [],
      },
    };
  }
};