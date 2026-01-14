export default function Footer(
  { inverted, hidden }: {
    inverted?: boolean,
    hidden?: boolean
  }
) {

  return (
    !hidden ?
      <footer className={`w-full py-20 border-t-0 ${inverted ? 'bg-transparent' : 'bg-gray-50 dark:bg-[#0D1117]'}`}>
        <div className="container mx-auto px-4 text-center">
          <a
            href='https://www.renedeanda.com'
            target='_blank'
            rel="noopener noreferrer"
            className={`text-lg hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
              inverted
                ? 'text-purple-200'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {`© ${new Date().getFullYear()} Open-source Project by `}
            <span className="font-bold">René DeAnda</span>
          </a>
        </div>
      </footer>
      : null
  )
}