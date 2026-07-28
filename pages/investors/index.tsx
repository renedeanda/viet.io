import Page from '../../components/page';
import Meta from '../../components/Meta';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import InvestorCard from '../../components/investorCard';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Investor } from '../../types/investor.types';
import { filterInvestors } from '../../util/helpers';
import usePagination from '../../util/hooks/usePagination';
import MySearch from '../../components/mySearch';
import InvTypeButtons from '../../components/invTypeButtons';
import { itemListSchema, breadcrumbSchema } from '../../util/seo';
import { useLocale, localePath, hreflangAlternates, strings } from '../../util/i18n';

export default function Investors({ investors }: { investors: any[] }) {
  const router = useRouter();
  const locale = useLocale();
  const s = strings[locale];
  const [invType, setInvType] = useState<string>("all");
  const [search, setSearch] = useState('');
  
  // Initialize router and query parameters
  useEffect(() => {
    if (!router.isReady) return;

    const queryInvType = router.query['type'];
    setInvType(typeof queryInvType === 'string' ? queryInvType : 'all');
    const querySearch = router.query['search'];
    setSearch(typeof querySearch === 'string' ? querySearch : '');
  }, [router.isReady, router.query]);

  const filteredInvs = useMemo(() => {
    const typeResults = filterInvestors(investors, invType);
    const query = search.trim().toLocaleLowerCase();
    if (!query) return typeResults;
    return typeResults.filter((item: any) => item.data.name.toLocaleLowerCase().includes(query));
  }, [investors, invType, search]);

  const { 
    next, 
    currentPage, 
    currentData, 
    maxPage, 
    resetCurrentPage 
  } = usePagination(filteredInvs, 12);

  useEffect(() => {
    resetCurrentPage();
  }, [invType, search, resetCurrentPage]);

  const currentInvs = currentData();

  const updateQuery = (
    key: 'type' | 'search',
    value: string,
    method: 'push' | 'replace'
  ) => {
    const query = { ...router.query };
    if (!value || (key === 'type' && value.toLocaleLowerCase() === 'all')) {
      delete query[key];
    } else {
      query[key] = value;
    }
    void router[method]({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const handleTypeChange = (value: string) => {
    setInvType(value);
    updateQuery('type', value, 'push');
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateQuery('search', value, 'replace');
  };

  return (
    <>
      <Meta
        title={s.investors.metaTitle(investors.length)}
        desc={s.investors.metaDesc(investors.length)}
        keywords='Vietnam venture capital, Vietnam investors, Vietnam VC firms, Vietnam angel investors, Vietnam startup accelerators, Southeast Asia venture capital'
        canonical={localePath(locale, '/investors')}
        image='/og-investors.png'
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
                value={search}
                onValueChange={handleSearchChange}
                hrefForItem={(investor) => `/investors/${investor.slug}`}
                placeholder={s.investors.searchPlaceholder}
                noResultsText={s.investors.searchNoResults}
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="mb-8">
              <InvTypeButtons
                setInvType={handleTypeChange}
                invType={invType}
                label={s.investors.filterLabel}
              />
            </div>

            <p aria-live="polite" className="text-center text-sm text-muted-foreground mb-6">
              {s.investors.resultCount(filteredInvs.length)}
            </p>

            {/* Investor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentInvs && currentInvs.length > 0 ? (
                currentInvs.map((item: { data: Investor }) => (
                  <InvestorCard
                    key={item.data.slug}
                    investor={item.data}
                    setInvType={handleTypeChange}
                  />
                ))
              ) : (
                <p className="my-12 text-muted-foreground text-xl text-center col-span-full">
                  {search ? s.investors.searchNoResults(search) : s.investors.noResults(invType)}
                </p>
              )}
            </div>

            {filteredInvs.length > 0 && currentPage !== maxPage ? (
              <div className="flex justify-center my-12">
                <button
                  type="button"
                  onClick={next}
                  className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-semibold text-foreground hover:text-primary hover:border-gold-400/60 transition-colors"
                >
                  {s.investors.loadMore}
                </button>
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
    const filenames = fs.readdirSync(investorsDirectory).filter((filename) => filename.endsWith('.json'));

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
