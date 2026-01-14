import {
  Header,
  Container,
  Card,
  Icon,
  Button
} from 'semantic-ui-react';
import Image from 'next/image';
import { withHttp } from '../util/helpers';
import ShareMenu from './shareMenu';
import { Investor } from '../types/investor.types';
import LinkButtons from './linkButtons';

export default function InvestorContainer({ investor, modal }: {
  investor: Investor,
  modal?: boolean
}) {

  // Load local image file if exists
  const avatarSrc = investor.logoUrl ? investor.logoUrl : '/company.png'

  const gFormLink = `https://docs.google.com/forms/d/e/1FAIpQLSdosIZ09MqBJhvoQPQx3isiTCS1C1PiXmIynVVmpHBwISlg-w/viewform?usp=pp_url&entry.2005620554=${investor.name}&entry.650199451=${investor.type}&entry.1692157935=${investor.website}&entry.171074559=${investor.description}&entry.885563122=${investor.location}&entry.2113193133=${investor.founded}&entry.1166974658=${investor.facebook}&entry.361763259=${investor.linkedin}`;

  const contPadding = modal ? '3em 0 0.5em 0' : '5em 0 0.5em 0'

  return (
    <>
      <Container style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', padding: contPadding }}>
        <Card
          fluid
          style={{ maxWidth: 720 }}>
          <Card.Content
            textAlign='left'
            style={{ padding: '0px 22px 100px 22px' }}>
            <Container fluid style={{ paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <ShareMenu url={`${process.env.PUBLIC_URL}/investors/${investor.slug}`} />
            </Container>
            <div>
              {avatarSrc ?
                <Image
                  quality={60}
                  alt={investor.name}
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
            }}>{investor.name}</Header>
            <a
              style={{ fontSize: '1.5em' }}
              className='card-link'
              href={withHttp(investor.website)}
              target='_blank'
              rel="noreferrer">
              <Icon name='external' />{investor.website}</a>
            <div style={{ marginTop: '8px' }}>
              <LinkButtons investor={investor} isTextList />
            </div>
            {investor.description || investor.type || investor.location || investor.founded ?
              <>
                <Header dividing style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.4em',
                  borderColor: 'var(--border-color)'
                }}>About</Header>
                {investor.description ? investor.description.split('\n').map((item, i) => {
                  return <p style={{
                    marginBottom: '1em',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.1em',
                    fontSize: '1.33em',
                    wordWrap: 'break-word',
                    fontFamily: 'Nunito'
                  }}
                    key={i}>{item}</p>;
                }) : null}
                {investor.type ?
                  <div>
                    <p style={{
                      marginTop: '16px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1em',
                      fontSize: '1.2em',
                      fontFamily: 'Nunito',
                      fontWeight: 'bold'
                    }}>Type of Investor</p>
                    <p style={{
                      color: 'var(--text-secondary)',
                      lineHeight: '1em',
                      fontSize: '1.2em',
                      fontFamily: 'Nunito'
                    }}>{investor.type}</p>
                  </div> : null}
                {investor.location ?
                  <div>
                    <p style={{
                      marginTop: '16px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1em',
                      fontSize: '1.2em',
                      fontFamily: 'Nunito',
                      fontWeight: 'bold'
                    }}>Headquarters</p>
                    <p style={{
                      color: 'var(--text-secondary)',
                      lineHeight: '1em',
                      fontSize: '1.2em',
                      fontFamily: 'Nunito'
                    }}>{investor.location}</p>
                  </div> : null}
                {investor.founded ?
                  <div>
                    <p style={{
                      marginTop: '16px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1em',
                      fontSize: '1.2em',
                      fontFamily: 'Nunito',
                      fontWeight: 'bold'
                    }}>Founded</p>
                    <p style={{
                      color: 'var(--text-secondary)',
                      lineHeight: '1em',
                      fontSize: '1.2em',
                      fontFamily: 'Nunito'
                    }}>{investor.founded}</p>
                  </div> : null}
              </>
              : null}
          </Card.Content>
        </Card>
      </Container>
    </>
  )
}