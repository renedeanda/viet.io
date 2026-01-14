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
        <Container style={{ width: '100vw', margin: '3em 0' }}>
          <Grid
            container
            stackable
            textAlign='center'
            verticalAlign='middle'>
            <Grid.Row style={{ marginTop: '80px', padding: '0.5em' }}>
              <Grid.Column>
                <Header
                  as='h1'
                  style={{
                    color: '#fafafa',
                    fontSize: '3em',
                    wordWrap: 'break-word',
                    marginBottom: '0.25em',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                  }}>
                  Vietnam Startup Ecosystem
                </Header>
                <div style={{
                  color: '#BEBEFF',
                  fontSize: '1.5em',
                  marginBottom: '1.5em',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  Open-sourced
                </div>
                <Button
                  as='a'
                  size='large'
                  color='violet'
                  icon='building outline'
                  content='Find Companies'
                  href='/companies'
                  rel="noopener"
                  style={{ margin: '0.5em' }} />
                <Button
                  as='a'
                  size='large'
                  color='violet'
                  icon='chart line'
                  content='Find Investors'
                  href='/investors'
                  rel="noopener"
                  style={{ margin: '0.5em' }} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Footer inverted />
      </Page>

    </div>
  )
}
