import {
  Card,
  Label
} from 'semantic-ui-react';
import Image from 'next/image';
import { Company } from '../types/company.types';

export default function CompanyCard({ company, setIndustry, openCompany }: {
  company: Company,
  setIndustry: any,
  openCompany: any
}) {

  // Load local image file if exists
  const avatarSrc = company.logoUrl ? company.logoUrl : '/company.png'

  return (
    <Card
      as='div'
      onClick={(e) => {
        openCompany(company);
      }}
      key={company.slug}
      fluid
      link
      color='yellow'
      style={{ maxWidth: '360px', margin: '0.5em' }}>
      <Card.Content textAlign='left'>
        <div>
          {avatarSrc ?
            <Image
              quality={60}
              alt={company.name}
              height={56}
              width={56}
              src={avatarSrc}
              className='card-avatar' />
            : null
          }
        </div>
        <h2 className='card-title' style={{ marginTop: 0, marginBottom: '8px' }}>{company.name}</h2>
        <p style={{ fontSize: '1.1em', marginTop: '8px' }} className='tagline'>
          {company.tagline
            ? company.tagline
            : company.description
              ? company.description : null}
        </p>
      </Card.Content>
      <Card.Content extra textAlign='right' style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        <Label
          style={{
            color: 'var(--accent-primary)',
            borderColor: 'var(--accent-primary)',
            fontFamily: 'Nunito',
            backgroundColor: 'transparent'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIndustry(company.industry)
          }} circular basic>{company.industry}</Label>
      </Card.Content>
    </Card >
  )
}