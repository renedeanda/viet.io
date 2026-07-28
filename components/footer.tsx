import { useLocale, strings } from '../util/i18n';

export default function Footer(
  { inverted, hidden }: {
    inverted?: boolean,
    hidden?: boolean
  }
) {
  const locale = useLocale();
  const s = strings[locale];

  return (
    !hidden ?
      <footer className="w-full py-10 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href='https://www.renedeanda.com'
            target='_blank'
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {`© ${new Date().getFullYear()} ${s.footer.copyright} `}
            <span className="font-semibold">René DeAnda</span>
          </a>
        </div>
      </footer>
      : null
  )
}
