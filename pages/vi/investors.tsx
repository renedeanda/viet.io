import Investors, { getStaticProps } from '../investors/index';
import { LocaleProvider } from '../../util/i18n';

export { getStaticProps };

export default function ViInvestors(props: any) {
  return (
    <LocaleProvider locale="vi">
      <Investors {...props} />
    </LocaleProvider>
  );
}
