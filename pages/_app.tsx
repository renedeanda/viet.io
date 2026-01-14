import '../css/styles.css';
import '../semantic/dist/semantic.min.css';
import { AppProps } from 'next/app';
import { Nunito } from 'next/font/google'
import { ThemeProvider } from 'next-themes';

export const nunito = Nunito({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className={nunito.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  )
}