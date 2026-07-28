import Home, { getStaticProps } from '../index';
import { LocaleProvider } from '../../util/i18n';

export { getStaticProps };

export default function ViHome(props: any) {
  return (
    <LocaleProvider locale="vi">
      <Home {...props} />
    </LocaleProvider>
  );
}
