import React from 'react';
import Page from '../../components/page';
import Meta from '../../components/Meta';
import fs from 'fs';
import path from 'path';
import CompanyContainer from '../../components/companyContainer';
import { Company, RelatedCompany } from '../../types/company.types';
import { GetStaticProps, GetStaticPaths } from 'next';

export default function CompanyPage({ company, related }: { company: Company, related: RelatedCompany[] }) {

  const description = company.name ?
    `${company.name} on Viet.io. Vietnam Startup Ecosystem open-sourced.`
    : 'Vietnam Startup Ecosystem.'

  const screenSrc = `/img/company/${company.slug}-screenshot.png`

  return (
    <>
      <Meta
        title={company.name ? `${company.name} | Viet.io - Vietnam Startup Ecosystem` : 'Company Not Found'}
        desc={company.tagline ? `${company.tagline} ${description}` : description}
        canonical={`https://viet.io/company/${company.slug}`}
        image={screenSrc} />

      <Page>
        <CompanyContainer company={company} related={related} />
      </Page>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const companiesDirectory = path.join(process.cwd(), '/public/data/companies')
  const filenames = fs.readdirSync(companiesDirectory)

  const paths = filenames.map((filename) => {
    const filePath = path.join(companiesDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const slug = JSON.parse(fileContents).slug

    return {
      params: {
        company: slug
      }
    }
  })
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async context => {
  const companiesDirectory = path.join(process.cwd(), '/public/data/companies')
  const companyFile = path.join(companiesDirectory, `${context.params.company}.json`)
  const company: Company = JSON.parse(fs.readFileSync(companyFile, 'utf8'))

  // Related companies in the same industry (slim fields only)
  const related: RelatedCompany[] = fs.readdirSync(companiesDirectory)
    .map((filename) => JSON.parse(fs.readFileSync(path.join(companiesDirectory, filename), 'utf8')))
    .filter((item: Company) => item.slug !== company.slug && item.industry === company.industry)
    .slice(0, 6)
    .map((item: Company) => ({
      name: item.name,
      slug: item.slug,
      tagline: item.tagline || '',
      logoUrl: item.logoUrl || '',
      industry: item.industry || '',
    }))

  return {
    props: {
      company,
      related
    },
  }
}
