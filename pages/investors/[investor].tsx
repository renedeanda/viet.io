import React from 'react';
import Page from '../../components/page';
import Meta from '../../components/Meta';
import fs from 'fs';
import path from 'path';
import InvestorContainer from '../../components/investorContainer';
import { Investor, RelatedInvestor } from '../../types/investor.types';
import { GetStaticProps, GetStaticPaths } from 'next';
import { investorSchema, breadcrumbSchema } from '../../util/seo';

export default function InvestorPage({ investor, related }: { investor: Investor, related: RelatedInvestor[] }) {

  const shortDesc = investor.description ? investor.description.split('\n')[0].slice(0, 120) : ''
  const description = shortDesc
    ? `${investor.name} — ${shortDesc}… ${investor.type || 'Investor'} active in Vietnam startups. Profile, portfolio and links on Viet.io.`
    : `${investor.name}, ${investor.type ? `a ${investor.type} investor` : 'an investor'} active in Vietnam's startup ecosystem. Profile, portfolio and links on Viet.io.`

  const screenSrc = `/img/investor/${investor.slug}-screenshot.png`

  return (
    <>
      <Meta
        title={investor.name ? `${investor.name} — ${investor.type || 'Investor'} in Vietnam | Viet.io` : 'Investor Not Found'}
        desc={description}
        keywords={`${investor.name}, ${investor.type} Vietnam, Vietnam venture capital, Vietnam startup investors`}
        canonical={`https://viet.io/investors/${investor.slug}`}
        image={screenSrc}
        jsonLd={[
          investorSchema(investor),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Investors', path: '/investors' },
            { name: investor.name, path: `/investors/${investor.slug}` },
          ]),
        ]} />

      <Page>
        <InvestorContainer investor={investor} related={related} />
      </Page>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const investorsDirectory = path.join(process.cwd(), '/public/data/investors')
  const filenames = fs.readdirSync(investorsDirectory)

  const paths = filenames.map((filename) => {
    const filePath = path.join(investorsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const slug = JSON.parse(fileContents).slug

    return {
      params: {
        investor: slug
      }
    }
  })
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async context => {
  const investorsDirectory = path.join(process.cwd(), '/public/data/investors')
  const investorFile = path.join(investorsDirectory, `${context.params.investor}.json`)
  const investor: Investor = JSON.parse(fs.readFileSync(investorFile, 'utf8'))

  // Related investors of the same type (slim fields only)
  const related: RelatedInvestor[] = fs.readdirSync(investorsDirectory)
    .map((filename) => JSON.parse(fs.readFileSync(path.join(investorsDirectory, filename), 'utf8')))
    .filter((item: Investor) => item.slug !== investor.slug && item.type === investor.type)
    .slice(0, 6)
    .map((item: Investor) => ({
      name: item.name,
      slug: item.slug,
      type: item.type || '',
      logoUrl: item.logoUrl || '',
    }))

  return {
    props: {
      investor,
      related
    },
  }
}
