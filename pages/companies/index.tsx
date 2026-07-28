import { useState, useEffect, useMemo } from 'react';
import fs from 'fs';
import path from 'path';
import Page from '../../components/page';
import Meta from '../../components/Meta';
import CompanyCard from '../../components/companyCard';
import IndustryButtons from '../../components/industryButtons';
import { filterCompanies } from '../../util/helpers';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import usePagination from "../../util/hooks/usePagination";
import MySearch from '../../components/mySearch';
import { itemListSchema, breadcrumbSchema } from '../../util/seo';
import { useLocale, localePath, hreflangAlternates, strings } from '../../util/i18n';

export default function Home({ companies }: { companies: any[] }) {
  const router = useRouter();
  const locale = useLocale();
  const s = strings[locale];
  const [industry, setIndustry] = useState<string | string[]>("all");
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const queryIndustry = router.query['industry'];
    setIndustry(typeof queryIndustry === 'string' ? queryIndustry : 'all');
    const querySearch = router.query['search'];
    setSearch(typeof querySearch === 'string' ? querySearch : '');
  }, [router.isReady, router.query]);

  const filteredCos = useMemo(() => {
    const industryResults = filterCompanies(companies, industry);
    const query = search.trim().toLocaleLowerCase();
    if (!query) return industryResults;
    return industryResults.filter((item) => item.data.name.toLocaleLowerCase().includes(query));
  }, [companies, industry, search]);

  const { next, currentPage, currentData, maxPage, resetCurrentPage } = usePagination(filteredCos, 12);

  useEffect(() => {
    resetCurrentPage();
  }, [industry, search, resetCurrentPage])

  const currentCos = currentData();

  const updateQuery = (
    key: 'industry' | 'search',
    value: string,
    method: 'push' | 'replace'
  ) => {
    const query = { ...router.query };
    if (!value || (key === 'industry' && value.toLocaleLowerCase() === 'all')) {
      delete query[key];
    } else {
      query[key] = value;
    }
    void router[method]({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    updateQuery('industry', value, 'push');
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateQuery('search', value, 'replace');
  };

  return (
    <div>
      <Meta
        title={s.companies.metaTitle(companies.length)}
        desc={s.companies.metaDesc(companies.length)}
        keywords='Vietnam tech companies, Vietnam startups list, Vietnam fintech, Vietnam ecommerce companies, Vietnam software companies, startups in Ho Chi Minh City, startups in Hanoi'
        canonical={localePath(locale, '/companies')}
        image='/og-companies.png'
        locale={locale}
        alternates={hreflangAlternates('/companies')}
        jsonLd={[
          itemListSchema({
            name: 'Vietnam Tech Companies & Startups',
            description: `Directory of ${companies.length} technology companies in Vietnam.`,
            path: '/companies',
            items: companies.map((c: any) => ({ name: c.data.name, path: `/company/${c.data.slug}` })),
          }),
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Companies', path: '/companies' }]),
        ]} />

      <Page>
        <div className="w-full my-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mt-16 mb-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {s.companies.headerPre}<span className="text-primary">{s.companies.headerAccent}</span>
              </h1>
            </div>

            {/* Search */}
            <div className="mb-8">
              <MySearch
                items={companies}
                value={search}
                onValueChange={handleSearchChange}
                hrefForItem={(company) => `/company/${company.slug}`}
                placeholder={s.companies.searchPlaceholder}
                noResultsText={s.companies.searchNoResults}
              />
            </div>

            {/* Industry Filter Buttons */}
            <div className="mb-8">
              <IndustryButtons
                setIndustry={handleIndustryChange}
                industry={industry}
                label={s.companies.filterLabel}
              />
            </div>

            <p aria-live="polite" className="text-center text-sm text-muted-foreground mb-6">
              {s.companies.resultCount(filteredCos.length)}
            </p>

            {/* Company Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCos && currentCos.length > 0 ?
                currentCos.map((item: any) =>
                  <CompanyCard key={item.data.slug} company={item.data} setIndustry={handleIndustryChange} />)
                : <p className="my-12 text-muted-foreground text-xl text-center col-span-full">
                    {search ? s.companies.searchNoResults(search) : s.companies.noResults(industry.toString())}
                  </p>}
            </div>

            {filteredCos.length > 0 && currentPage !== maxPage ? (
              <div className="flex justify-center my-12">
                <button
                  type="button"
                  onClick={next}
                  className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-semibold text-foreground hover:text-primary hover:border-gold-400/60 transition-colors"
                >
                  {s.companies.loadMore}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Page>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const companiesDirectory = path.join(process.cwd(), '/public/data/companies')
  const filenames = fs.readdirSync(companiesDirectory).filter((filename) => filename.endsWith('.json'))

  // Slim payload: only fields used by cards, search, and filters
  const companies = filenames.map((filename) => {
    const filePath = path.join(companiesDirectory, filename)
    const company = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    return {
      data: {
        name: company.name || '',
        slug: company.slug || '',
        tagline: company.tagline || '',
        description: company.description ? `${company.description.slice(0, 160)}` : '',
        industry: company.industry || '',
        logoUrl: company.logoUrl || '',
      },
    }
  })

  return {
    props: {
      companies
    },
  }
}
