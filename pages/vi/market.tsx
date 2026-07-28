import Market, { getStaticProps } from '../market/index';
import { LocaleProvider } from '../../util/i18n';

export { getStaticProps };

export default function ViMarket(props: any) {
  return (
    <LocaleProvider locale="vi">
      <Market {...props} />
    </LocaleProvider>
  );
}
