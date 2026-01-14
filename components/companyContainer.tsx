import {
  Header,
  Container,
  Label,
  Card,
  Icon
} from 'semantic-ui-react';
import Image from 'next/image';
import { withHttp } from '../util/helpers';
import ShareMenu from './shareMenu';
import LinkButtons from './linkButtons';
import { Company } from '../types/company.types';

export default function CompanyContainer({ company, modal }: {
  company: Company,
  modal?: boolean
}) {

  // Load local image file if exists
  const avatarSrc = company.logoUrl ? company.logoUrl : '/company.png'

  const screenSrc = `/img/company/${company.slug}-screenshot.png`

  const contPadding = modal ? '3em 0 0.5em 0' : '5em 0 0.5em 0'

  return (
    <>
      <Container style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', padding: contPadding }}>
        <Card
          fluid
          style={{ maxWidth: 720 }}>
          <div className="image">
            <Image
              quality={60}
              alt={company.name}
              height={300}
              width={720}
              src={screenSrc}
              className='card-image-header'
            />
          </div>
          <Card.Content
            textAlign='left'
            style={{ padding: '0px 22px 100px 22px' }}>
            <Container fluid style={{ paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <ShareMenu url={`${process.env.PUBLIC_URL}/company/${company.slug}`} />
            </Container>
            <div style={{ marginTop: '-100px' }}>
              {avatarSrc ?
                <Image
                  quality={60}
                  alt={company.name}
                  height={100}
                  width={100}
                  src={avatarSrc}
                  className='card-avatar-big' />
                : null
              }
            </div>
            <Header style={{
              color: 'var(--text-primary)',
              marginTop: 0,
              marginBottom: '8px',
              fontSize: '2.5em',
              wordWrap: 'break-word'
            }}>{company.name}</Header>
            <a
              style={{ fontSize: '1.5em' }}
              className='card-link'
              href={withHttp(company.website)}
              target='_blank'
              rel="noreferrer">
              <Icon name='external' />{company.website}</a>
            {company.tagline ? <p
              style={{ color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic', fontSize: '1.1em', wordWrap: 'break-word', fontFamily: 'Nunito' }}
            >{company.tagline}</p>
              : null}
            <div>
              <Label style={{
                marginTop: '8px',
                color: 'var(--accent-primary)',
                borderColor: 'var(--accent-primary)',
                fontFamily: 'Nunito',
                backgroundColor: 'transparent'
              }} circular basic >{company.industry}</Label>
            </div>
            <div style={{ marginTop: '8px' }}>
              <LinkButtons company={company} isTextList />
            </div>
            {company.description ?
              <>
                <Header dividing style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.4em',
                  borderColor: 'var(--border-color)'
                }}>About</Header>
                {company.description.split('\n').map((item, i) => {
                  return <p style={{
                    marginBottom: '1em',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.1em',
                    fontSize: '1.33em',
                    wordWrap: 'break-word',
                    fontFamily: 'Nunito'
                  }}
                    key={i}>{item}</p>;
                })}
              </>
              : null}
          </Card.Content>
        </Card>
      </Container>
    </>
  )
}