import { withHttp } from '../util/helpers';
import { Company } from '../types/company.types';
import { Investor } from '../types/investor.types';
import { Facebook, Linkedin, Globe, Rss, Briefcase, Smartphone, Store } from 'lucide-react';

export default function LinkButtons(
  { company, investor, size, isTextList }: {
    company?: Company,
    investor?: Investor,
    size?: string,
    isTextList?: boolean
  }) {

  const textList = (
    company ?
      (<ul className="space-y-3">
        {company.blogUrl ?
          <li>
            <a
              className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
              href={withHttp(company.blogUrl)}
              target='_blank'
              rel="noreferrer">
              <Rss className="h-5 w-5" />
              Blog
            </a>
          </li>
          : null}
        {company.facebook ?
          <li>
            <a
              className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
              href={withHttp(company.facebook)}
              target='_blank'
              rel="noreferrer">
              <Facebook className="h-5 w-5" />
              Facebook
            </a>
          </li>
          : null}
        {company.linkedin ?
          <li>
            <a
              className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
              href={withHttp(company.linkedin)}
              target='_blank'
              rel="noreferrer">
              <Linkedin className="h-5 w-5" />
              LinkedIn
            </a>
          </li>
          : null}
        {company.demoUrl ?
          <li>
            <a
              className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
              href={withHttp(company.demoUrl)}
              target='_blank'
              rel="noreferrer">
              <Globe className="h-5 w-5" />
              Product Demo
            </a>
          </li>
          : null}
        {company.androidUrl ?
          <li>
            <a
              className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
              href={withHttp(company.androidUrl)}
              target='_blank'
              rel="noreferrer">
              <Smartphone className="h-5 w-5" />
              Google Play
            </a>
          </li>
          : null}
        {company.iosUrl ?
          <li>
            <a
              className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
              href={withHttp(company.iosUrl)}
              target='_blank'
              rel="noreferrer">
              <Store className="h-5 w-5" />
              App Store
            </a>
          </li>
          : null}
      </ul>) : (investor ?
        (<ul className="space-y-3">
          {investor.facebook ?
            <li>
              <a
                className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
                href={withHttp(investor.facebook)}
                target='_blank'
                rel="noreferrer">
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
            </li>
            : null}
          {investor.linkedin ?
            <li>
              <a
                className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
                href={withHttp(investor.linkedin)}
                target='_blank'
                rel="noreferrer">
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            </li>
            : null}
          {investor.crunchbase ?
            <li>
              <a
                className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
                href={withHttp(investor.crunchbase)}
                target='_blank'
                rel="noreferrer">
                <Globe className="h-5 w-5" />
                Crunchbase
              </a>
            </li>
            : null}
          {investor.portfolio ?
            <li>
              <a
                className='flex items-center gap-2 text-lg text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'
                href={withHttp(investor.portfolio)}
                target='_blank'
                rel="noreferrer">
                <Briefcase className="h-5 w-5" />
                Portfolio
              </a>
            </li>
            : null}
        </ul>) : null
      )
  )

  return textList
}