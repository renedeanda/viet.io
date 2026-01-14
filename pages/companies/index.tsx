import { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Header,
  Container,
  Loader
} from 'semantic-ui-react';
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
  let queryIndustry: string | string[];
  useEffect(() => {
    if (!router.isReady) return;
    queryIndustry = router.query['industry'];
    setIndustry(queryIndustry);
  }, [router.isReady]);

  const [industry, setIndustry] = useState(queryIndustry ? queryIndustry : "all");
  const [filteredCos, setFilteredCos] = useState(companies);

  const openCompany = (company: Company) => {
    window.open(`/company/${company.slug}`, '_blank')
  }

  const { next, currentPage, currentData, maxPage, resetCurrentPage } = usePagination(filteredCos, 12);

  useEffect(() => {
    setIndustry(industry);
    setFilteredCos(filterCompanies(companies, industry));
    resetCurrentPage();
  }, [industry])

  const currentCos = currentData();
  const [element, setElement] = useState(null);

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
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
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
        <Container style={{ width: '100vw', margin: '3em 0' }}>
          <Grid
            container
            stackable
            textAlign='center'
            verticalAlign='middle'>
            <Grid.Row style={{ marginTop: '60px', padding: '0.5em' }}>
              <Grid.Column>
                <Header
                  style={{ color: 'var(--text-primary)', fontSize: '3em', wordWrap: 'break-word' }}>
                  Find <text style={{ color: 'var(--accent-primary)' }}>Vietnam Companies</text>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: 0, margin: 0 }}>
              <MySearch items={companies} openItem={openCompany} type='companies' />
            </Grid.Row>
            <Grid.Row style={{ padding: 0, margin: 0 }}>
              <IndustryButtons setIndustry={setIndustry} industry={industry} filteredLength={filteredCos.length} />
            </Grid.Row>
            <Grid.Row style={{ padding: 0, margin: 0 }}>
              {currentCos && currentCos.length > 0 ?
                currentCos.map((item: any) =>
                  <CompanyCard key={item.data.slug} company={item.data} setIndustry={setIndustry} openCompany={openCompany} />)
                : <p style={{ margin: '3em', color: 'var(--accent-primary)', fontSize: '2em', textAlign: 'center' }}>{`No ${industry} companies`}</p>}
            </Grid.Row>
            {filteredCos.length > 0 && currentPage !== maxPage ? (
              <div ref={setElement}>
                <Loader style={{ margin: '3em' }} active inline='centered' />
              </div>
            ) : null}
          </Grid>
        </Container>
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
