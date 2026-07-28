import { useState, useEffect } from 'react';
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
import { Company } from '../../types/company.types';
import MySearch from '../../components/mySearch';

export default function Home({ companies }: { companies: any[] }) {
  const router = useRouter();
  const [industry, setIndustry] = useState<string | string[]>("all");
  const [filteredCos, setFilteredCos] = useState(companies);

  useEffect(() => {
    if (!router.isReady) return;
    const queryIndustry = router.query['industry'];
    if (queryIndustry) {
      setIndustry(queryIndustry);
    }
  }, [router.isReady, router.query]);

  const openCompany = (company: Company) => {
    window.open(`/company/${company.slug}`, '_blank')
  }

  const { next, currentPage, currentData, maxPage, resetCurrentPage } = usePagination(filteredCos, 12);

  useEffect(() => {
    setFilteredCos(filterCompanies(companies, industry));
    resetCurrentPage();
  }, [industry, companies, resetCurrentPage])

  const currentCos = currentData();

  // Intersection observer for infinite scroll pagination
  const [element, setElement] = useState<HTMLDivElement | null>(null);

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
    <div>
      <Meta
        title='Viet.io - Vietnam Companies'
        desc='List of 200+ Vietnam startups and big tech companies. Viet.io is an open-source website built with React and Next.js listing 200+ technology companies in Vietnam.'
        canonical='https://viet.io/companies' />

      <Page>
        <div className="w-full my-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mt-16 mb-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Find <span className="text-primary">Vietnam Companies</span>
              </h1>
            </div>

            {/* Search */}
            <div className="mb-8">
              <MySearch items={companies} openItem={openCompany} type='companies' />
            </div>

            {/* Industry Filter Buttons */}
            <div className="mb-8">
              <IndustryButtons setIndustry={setIndustry} industry={industry} filteredLength={filteredCos.length} />
            </div>

            {/* Company Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCos && currentCos.length > 0 ?
                currentCos.map((item: any) =>
                  <CompanyCard key={item.data.slug} company={item.data} setIndustry={setIndustry} openCompany={openCompany} />)
                : <p className="my-12 text-muted-foreground text-xl text-center col-span-full">{`No ${industry} companies`}</p>}
            </div>

            {/* Loading Indicator */}
            {filteredCos.length > 0 && currentPage !== maxPage ? (
              <div ref={setElement} className="flex flex-col items-center gap-3 my-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                <p className="text-sm text-muted-foreground">Loading more...</p>
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
  const filenames = fs.readdirSync(companiesDirectory)

  const companies = filenames.map((filename) => {
    const filePath = path.join(companiesDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')

    return {
      filename,
      data: JSON.parse(fileContents),
    }
  })

  return {
    props: {
      companies
    },
  }
}
