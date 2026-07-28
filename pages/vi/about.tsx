import About, { getStaticProps } from '../about';
import { LocaleProvider } from '../../util/i18n';

export { getStaticProps };

export default function ViAbout(props: any) {
  return (
    <LocaleProvider locale="vi">
      <About {...props} />
    </LocaleProvider>
  );
}
