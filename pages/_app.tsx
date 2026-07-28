import '../css/styles.css';
import { AppProps } from 'next/app';
import { Be_Vietnam_Pro } from 'next/font/google'
import { ThemeProvider } from 'next-themes';

export const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={beVietnamPro.className}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}
