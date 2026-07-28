import React from 'react';
import Page from '../../components/page';
import Meta from '../../components/Meta';
import fs from 'fs';
import path from 'path';
import InvestorContainer from '../../components/investorContainer';
import { Investor, RelatedInvestor } from '../../types/investor.types';
import { GetStaticProps, GetStaticPaths } from 'next';

export default function InvestorPage({ investor, related }: { investor: Investor, related: RelatedInvestor[] }) {

  const description = investor.name ?
    `${investor.name} on Viet.io. Vietnam Startup Ecosystem open-sourced.`
    : 'Vietnam Startup Ecosystem.'

  const screenSrc = `/img/investor/${investor.slug}-screenshot.png`

  return (
    <>
      <Meta
        title={investor.name ? `${investor.name} | Viet.io - Vietnam Startup Ecosystem` : 'Investor Not Found'}
        desc={investor.description ? `${investor.description} ${description}` : description}
        canonical={`https://viet.io/investors/${investor.slug}`}
        image={screenSrc} />

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
