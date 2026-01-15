import { useState, useEffect, useRef } from 'react';
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

  // Intersection observer setup (using working pattern from before Tailwind migration)
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver>();
  const prevY = useRef(0);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (prevY.current > y) {
          next();
        }
        prevY.current = y;
      },
      { threshold: 0.5 }
    );
  });

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver?.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver?.unobserve(currentElement);
      }
    };
  }, [element]);

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
            <div className="text-center mt-16 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Find <span className="text-purple-600 dark:text-purple-400">Vietnam Companies</span>
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
            <div className="flex flex-wrap justify-center gap-4">
              {currentCos && currentCos.length > 0 ?
                currentCos.map((item: any) =>
                  <CompanyCard key={item.data.slug} company={item.data} setIndustry={setIndustry} openCompany={openCompany} />)
                : <p className="my-12 text-purple-600 dark:text-purple-400 text-2xl text-center w-full">{`No ${industry} companies`}</p>}
            </div>

            {/* Loading Indicator */}
            {filteredCos.length > 0 && currentPage !== maxPage ? (
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
