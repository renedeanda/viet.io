import { withHttp } from '../util/helpers';
import { Company } from '../types/company.types';
import { Investor } from '../types/investor.types';
import { Facebook, Linkedin, Globe, Rss, Briefcase, Smartphone, Store } from 'lucide-react';

interface LinkItem {
  label: string;
  url: string;
  Icon: typeof Globe;
}

function LinkChips({ links }: { links: LinkItem[] }) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ label, url, Icon }) => (
        <a
          key={label}
          href={withHttp(url)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-card border border-border text-muted-foreground hover:text-primary hover:border-gold-400/60 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
        >
          <Icon className="h-4 w-4" />
          {label}
        </a>
      ))}
    </div>
  );
}

export default function LinkButtons(
  { company, investor }: {
    company?: Company,
    investor?: Investor,
    size?: string,
    isTextList?: boolean
  }) {

  if (company) {
    const links: LinkItem[] = [
      company.blogUrl && { label: 'Blog', url: company.blogUrl, Icon: Rss },
      company.facebook && { label: 'Facebook', url: company.facebook, Icon: Facebook },
      company.linkedin && { label: 'LinkedIn', url: company.linkedin, Icon: Linkedin },
      company.demoUrl && { label: 'Product Demo', url: company.demoUrl, Icon: Globe },
      company.androidUrl && { label: 'Google Play', url: company.androidUrl, Icon: Smartphone },
      company.iosUrl && { label: 'App Store', url: company.iosUrl, Icon: Store },
    ].filter(Boolean) as LinkItem[];

    return <LinkChips links={links} />;
  }

  if (investor) {
    const links: LinkItem[] = [
      investor.facebook && { label: 'Facebook', url: investor.facebook, Icon: Facebook },
      investor.linkedin && { label: 'LinkedIn', url: investor.linkedin, Icon: Linkedin },
      investor.crunchbase && { label: 'Crunchbase', url: investor.crunchbase, Icon: Globe },
      investor.portfolio && { label: 'Portfolio', url: investor.portfolio, Icon: Briefcase },
    ].filter(Boolean) as LinkItem[];

    return <LinkChips links={links} />;
  }

  return null;
}
