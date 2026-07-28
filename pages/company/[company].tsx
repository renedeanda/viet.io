import React from 'react';
import Page from '../../components/page';
import Meta from '../../components/Meta';
import fs from 'fs';
import path from 'path';
import CompanyContainer from '../../components/companyContainer';
import { Company, RelatedCompany } from '../../types/company.types';
import { GetStaticProps, GetStaticPaths } from 'next';
import { companySchema, breadcrumbSchema } from '../../util/seo';

export default function CompanyPage({ company, related }: { company: Company, related: RelatedCompany[] }) {

  const description = company.tagline
    ? `${company.name} — ${company.tagline} Learn about this ${company.industry || 'Vietnam tech'} company: website, social links and profile on Viet.io, the open Vietnam startup directory.`
    : `${company.name} profile on Viet.io: ${company.industry ? `a ${company.industry} company in Vietnam` : 'a technology company in Vietnam'}. Website, social links and company details.`

  const screenSrc = `/img/company/${company.slug}-screenshot.png`

  return (
    <>
      <Meta
        title={company.name ? `${company.name} — ${company.industry || 'Tech'} Company in Vietnam | Viet.io` : 'Company Not Found'}
        desc={description}
        keywords={`${company.name}, ${company.industry} Vietnam, Vietnam startups, Vietnam tech companies`}
        canonical={`https://viet.io/company/${company.slug}`}
        image={screenSrc}
        jsonLd={[
          companySchema(company),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Companies', path: '/companies' },
            { name: company.name, path: `/company/${company.slug}` },
          ]),
        ]} />

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
