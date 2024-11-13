import Page from '../../components/page';
import Meta from '../../components/Meta';
import { Container, Grid, Header, Loader } from 'semantic-ui-react';
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
  }, [router.isReady]);

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
  }, [invType, investors]);

  const currentInvs = currentData();

  // Intersection Observer setup for infinite scroll
  const observer = useRef<IntersectionObserver>();
  const prevY = useRef(0);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry) return;

        const y = firstEntry.boundingClientRect.y;
        if (prevY.current > y) {
          next();
        }
        prevY.current = y;
      },
      { threshold: 0.5 }
    );
  }, [next]);

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
        <Container style={{ width: '100vw', margin: '3em 0' }}>
          <Grid
            container
            stackable
            textAlign='center'
            verticalAlign='middle'
          >
            <Grid.Row style={{ marginTop: '60px', padding: '0.5em' }}>
              <Grid.Column>
                <Header style={{ 
                  color: '#1A202C', 
                  fontSize: '3em', 
                  wordWrap: 'break-word' 
                }}>
                  Find <text style={{ color: '#5131F7' }}>Vietnam Investors</text>
                </Header>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ padding: 0, margin: 0 }}>
              <MySearch 
                items={investors} 
                openItem={openInvestor} 
                type='investors' 
              />
            </Grid.Row>

            <Grid.Row style={{ padding: 0, margin: 0 }}>
              <InvTypeButtons 
                setInvType={setInvType} 
                invType={invType} 
                filteredLength={filteredInvs.length} 
              />
            </Grid.Row>

            <Grid.Row style={{ padding: 0, margin: 0 }}>
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
                <p style={{ 
                  margin: '3em', 
                  color: '#5131F7', 
                  fontSize: '2em', 
                  textAlign: 'center' 
                }}>
                  {`No ${invType} investors`}
                </p>
              )}
            </Grid.Row>

            {filteredInvs.length > 0 && currentPage !== maxPage ? (
              <div ref={setElement}>
                <Loader 
                  style={{ margin: '3em', color: '#5131F7' }} 
                  active 
                  inline='centered' 
                />
              </div>
            ) : null}
          </Grid>
        </Container>
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