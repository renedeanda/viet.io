import Companies, { getStaticProps } from '../companies/index';
import { LocaleProvider } from '../../util/i18n';

export { getStaticProps };

export default function ViCompanies(props: any) {
  return (
    <LocaleProvider locale="vi">
      <Companies {...props} />
    </LocaleProvider>
  );
}
