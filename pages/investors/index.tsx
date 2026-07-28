import Page from '../../components/page';
import Meta from '../../components/Meta';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import InvestorCard from '../../components/investorCard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Investor } from '../../types/investor.types';
import { filterInvestors } from '../../util/helpers';
import usePagination from '../../util/hooks/usePagination';
import MySearch from '../../components/mySearch';
import InvTypeButtons from '../../components/invTypeButtons';
import { itemListSchema, breadcrumbSchema } from '../../util/seo';
import { useLocale, localePath, hreflangAlternates, strings } from '../../util/i18n';

export default function Investors({ investors }: { investors: Investor[] }) {
  const router = useRouter();
  const locale = useLocale();
  const s = strings[locale];
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

  // Intersection observer for infinite scroll pagination
  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && currentPage < maxPage) {
          next();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, currentPage, maxPage, next]);

  return (
    <>
      <Meta
        title={s.investors.metaTitle(investors.length)}
        desc={s.investors.metaDesc(investors.length)}
        keywords='Vietnam venture capital, Vietnam investors, Vietnam VC firms, Vietnam angel investors, Vietnam startup accelerators, Southeast Asia venture capital'
        canonical={localePath(locale, '/investors')}
        locale={locale}
        alternates={hreflangAlternates('/investors')}
        jsonLd={[
          itemListSchema({
            name: 'Vietnam Startup Investors & VCs',
            description: `Directory of ${investors.length} active investors in Vietnam's startup ecosystem.`,
            path: '/investors',
            items: investors.map((inv: any) => ({ name: inv.data.name, path: `/investors/${inv.data.slug}` })),
          }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Investors', path: '/investors' }]),
        ]}
      />
      <Page>
        <div className="w-full my-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mt-16 mb-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {s.investors.headerPre}<span className="text-primary">{s.investors.headerAccent}</span>
              </h1>
            </div>

            {/* Search */}
            <div className="mb-8">
              <MySearch
                items={investors}
                openItem={openInvestor}
                type='investors'
                placeholder={s.investors.searchPlaceholder}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <p className="my-12 text-muted-foreground text-xl text-center col-span-full">
                  {s.investors.noResults(invType)}
                </p>
              )}
            </div>

            {/* Loading Indicator */}
            {filteredInvs.length > 0 && currentPage !== maxPage ? (
              <div ref={setElement} className="flex flex-col items-center gap-3 my-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                <p className="text-sm text-muted-foreground">{s.investors.loadingMore}</p>
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

    // Slim payload: only fields used by cards, search, and filters
    const investors = filenames.map((filename) => {
      const filePath = path.join(investorsDirectory, filename);
      const investor = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      return {
        data: {
          name: investor.name || '',
          slug: investor.slug || '',
          type: investor.type || '',
          description: investor.description ? `${investor.description.slice(0, 160)}` : '',
          logoUrl: investor.logoUrl || '',
          tagline: '',
        },
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