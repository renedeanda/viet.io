import {
  Button,
  Grid,
  Header,
  Container
} from 'semantic-ui-react';
import Page from '../components/page';
import Meta from '../components/Meta';
import Footer from '../components/footer';

export default function Home() {

  return (
    <div>
      <Meta
        title='Viet.io - Vietnam Startup Ecosystem'
        desc='List of 200+ Vietnam startups and big tech companies. Viet.io is an open-source website built with React and Next.js listing 200+ technology companies in Vietnam.'
        canonical='https://viet.io' />

      <Page inverted footerHidden>
        <div className='hero-image' />
        <Container style={{ width: '100vw', margin: '0', padding: '0' }}>
          <Grid
            container
            stackable
            textAlign='center'
            verticalAlign='middle'
            style={{ minHeight: 'calc(100vh - 56px)' }}>
            <Grid.Row style={{ padding: '2em 1em' }}>
              <Grid.Column>
                <Header
                  as='h1'
                  style={{
                    color: '#fafafa',
                    fontSize: 'clamp(2em, 5vw, 3.5em)',
                    wordWrap: 'break-word',
                    marginBottom: '0.5em',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                  }}>
                  <div>Vietnam Startup Ecosystem</div>
                  <div style={{
                    color: '#BEBEFF',
                    fontSize: '0.6em',
                    marginTop: '0.3em',
                    fontWeight: 'normal'
                  }}>Open-sourced</div>
                </Header>
                <div style={{
                  marginTop: '2em',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1em',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Button
                    as='a'
                    size='large'
                    color='violet'
                    icon='building outline'
                    content='Find Companies'
                    href='/companies'
                    rel="noopener"
                    style={{
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                    }} />
                  <Button
                    as='a'
                    size='large'
                    color='violet'
                    icon='chart line'
                    content='Find Investors'
                    href='/investors'
                    rel="noopener"
                    style={{
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                    }} />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Footer inverted />
      </Page>

    </div>
  )
}
