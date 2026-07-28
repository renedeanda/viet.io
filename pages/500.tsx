import Link from 'next/link';
import Page from '../components/page';
import Meta from '../components/Meta';

export default function Custom500() {
  return (
    <>
      <Meta title='500 | Server-side error occurred' desc='A server-side error occurred.' noindex />
      <Page>
        <div className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '70vh' }}>
          <p className="text-6xl font-bold text-primary mb-4">500</p>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-8">A server-side error occurred. Please try again later.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </Page>
    </>
  )
}
