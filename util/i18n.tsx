import { createContext, useContext } from 'react';

export type Locale = 'en' | 'vi';

const LocaleContext = createContext<Locale>('en');

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Routes that have a /vi variant */
export const LOCALIZED_ROUTES = ['/', '/companies', '/investors', '/market', '/about'];

/** Prefix a path with /vi when the target locale is Vietnamese */
export function localePath(locale: Locale, path: string): string {
  if (locale !== 'vi') return path;
  return path === '/' ? '/vi' : `/vi${path}`;
}

/** Compute the counterpart URL for the language switcher */
export function alternatePath(asPath: string, target: Locale): string {
  const withoutQuery = asPath.split('?')[0].split('#')[0] || '/';
  const base = withoutQuery.replace(/^\/vi(?=\/|$)/, '') || '/';
  const isLocalizable = LOCALIZED_ROUTES.includes(base);
  if (target === 'vi') return isLocalizable ? localePath('vi', base) : '/vi';
  return isLocalizable ? base : '/';
}

/** hreflang alternates for a localized route (pass the EN path) */
export function hreflangAlternates(enPath: string) {
  return [
    { hrefLang: 'en', href: enPath },
    { hrefLang: 'vi', href: localePath('vi', enPath) },
    { hrefLang: 'x-default', href: enPath },
  ];
}

export const strings = {
  en: {
    nav: {
      companies: 'Companies',
      investors: 'Investors',
      market: 'Market',
      about: 'About',
      marketOverview: 'Market Overview',
      menu: 'Menu',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      projectBy: 'Project by René',
      language: 'Tiếng Việt',
    },
    footer: {
      copyright: 'Open-source Project by',
    },
    home: {
      metaTitle: 'Viet.io — Vietnam Startup Ecosystem & Tech Company Directory',
      metaDesc: (c: number, i: number, n: number) =>
        `Explore ${c}+ Vietnam startups and tech companies plus ${i}+ active investors across ${n} industries. Viet.io is the open-source directory of Vietnam's fast-growing digital economy.`,
      heroPre: "Vietnam's ",
      heroAccent: 'startup ecosystem',
      heroPost: ', open-sourced',
      heroSub: "An open directory of the technology companies and investors building Vietnam's digital economy.",
      companiesLabel: 'companies',
      investorsLabel: 'investors',
      industriesLabel: 'industries',
      findCompanies: 'Find Companies',
      findInvestors: 'Find Investors',
      marketCallout: 'Vietnam Market Overview',
      marketCalloutSub: 'Ecosystem stats and macro indicators',
      exploreByIndustry: 'Explore by industry',
      exploreSub: 'The largest sectors in the directory',
      viewAll: 'View all →',
    },
    companies: {
      metaTitle: (c: number) => `Vietnam Tech Companies & Startups — Browse ${c}+ | Viet.io`,
      metaDesc: (c: number) =>
        `Browse ${c}+ Vietnam technology companies and startups by industry: fintech, ecommerce, gaming, healthcare, education and more. Free, open-source directory.`,
      headerPre: 'Find ',
      headerAccent: 'Vietnam Companies',
      noResults: (industry: string) => `No ${industry} companies`,
      loadingMore: 'Loading more...',
      searchPlaceholder: 'Search companies',
    },
    investors: {
      metaTitle: (i: number) => `Vietnam Startup Investors & VCs — Browse ${i}+ | Viet.io`,
      metaDesc: (i: number) =>
        `Discover ${i}+ active investors in Vietnam startups: venture capital firms, angels, accelerators, corporate VCs and private equity. Free, open-source directory.`,
      headerPre: 'Find ',
      headerAccent: 'Vietnam Investors',
      noResults: (type: string) => `No ${type} investors`,
      loadingMore: 'Loading more...',
      searchPlaceholder: 'Search investors',
    },
    market: {
      metaTitle: 'Vietnam Market Overview — Tech Economy Stats & Startup Data | Viet.io',
      metaDesc: (c: number, i: number, n: number) =>
        `Vietnam tech market snapshot: ${c} companies and ${i} investors tracked across ${n} industries, plus macro indicators — GDP growth, digital economy size, internet adoption and demographics.`,
      heroPre: 'Vietnam ',
      heroAccent: 'Market Overview',
      heroSub: "A snapshot of one of Southeast Asia's fastest-growing tech economies — live data from the Viet.io directory alongside key macro indicators.",
      snapshotTitle: 'Ecosystem snapshot',
      snapshotSub: 'Live from the open-source Viet.io directory',
      statCompanies: 'Tech companies tracked',
      statInvestors: 'Active investors listed',
      statIndustries: 'Industries represented',
      byIndustry: 'Companies by industry',
      byType: 'Investors by type',
      browseAllCompanies: 'Browse all companies →',
      browseAllInvestors: 'Browse all investors →',
      macroTitle: 'Macro indicators',
      macroSub: "Why Vietnam is one of Asia's most watched tech markets",
      macroDisclaimer: 'Macro figures are approximate and provided for context only. Refer to the cited sources for the latest official data.',
      sourceLabel: 'Source',
      diveTitle: 'Dive deeper',
      diveSub: 'Explore the ecosystem or contribute to the project',
      browseCompanies: 'Browse Companies',
      browseInvestors: 'Browse Investors',
      contribute: 'Contribute on GitHub',
      indicators: [
        {
          label: 'Population',
          value: '≈100 million',
          detail: 'Crossed the 100M mark in 2023, the 15th most populous country in the world.',
          source: 'General Statistics Office of Vietnam',
        },
        {
          label: 'GDP growth',
          value: '≈7% per year',
          detail: 'One of the fastest-growing economies in Asia over the past decade.',
          source: 'General Statistics Office / World Bank',
        },
        {
          label: 'Digital economy',
          value: '≈$36B GMV',
          detail: 'Projected to reach $90–200B by 2030, among the fastest-growing in Southeast Asia.',
          source: 'e-Conomy SEA (Google, Temasek, Bain)',
        },
        {
          label: 'Internet users',
          value: '≈79 million',
          detail: 'Roughly 4 in 5 people are online, with heavy mobile-first usage.',
          source: 'DataReportal Digital Vietnam',
        },
        {
          label: 'Smartphone adoption',
          value: '≈85% of adults',
          detail: 'Mobile is the primary gateway to the internet, commerce, and payments.',
          source: 'GSMA / DataReportal',
        },
        {
          label: 'Median age',
          value: '≈33 years',
          detail: 'A young, tech-literate workforce powering startups and global outsourcing.',
          source: 'UN World Population Prospects',
        },
      ],
    },
    about: {
      metaTitle: 'About Viet.io — The Open-Source Vietnam Startup Directory',
      metaDesc: (c: number, i: number) =>
        `Why Viet.io exists and how to contribute. An open-source directory tracking ${c}+ Vietnam tech companies and ${i}+ investors, built with Next.js and maintained by the community.`,
      heroPre: 'About ',
      heroSub: "An open-source map of Vietnam's technology ecosystem — free to use, free to contribute to, and built in public.",
      whyTitle: 'Why this exists',
      whySub: 'The story behind the project',
      p1: 'Vietnam is one of the fastest-growing tech economies in Southeast Asia, yet information about its startups and investors has long been scattered, outdated, or locked behind paywalls.',
      p2: 'Viet.io fixes that with a simple idea: every company and investor is a plain JSON file in a public GitHub repository. Anyone can add, correct, or enrich the data — and the whole site rebuilds as a fast static website.',
      p3a: 'Today the directory tracks ',
      p3b: ' and ',
      p3c: ' across ',
      p3d: '.',
      contributeTitle: 'How to contribute',
      contributeSub: 'Three steps to add a company or investor',
      steps: [
        { title: 'Fork the repo', text: 'Viet.io is fully open source on GitHub. Fork it and clone it locally to get started.' },
        { title: 'Add a JSON file', text: 'Each company and investor is a single JSON file in public/data. Copy the template and fill it in.' },
        { title: 'Open a pull request', text: 'Submit your PR and once merged, the new profile goes live on the next deploy.' },
      ],
      viewRepo: 'View the repo',
      companyTemplate: 'Company template',
      investorTemplate: 'Investor template',
      builtWithTitle: 'Built with',
      builtWithSub: 'A deliberately simple, fast stack',
      creditsTitle: 'Credits & connect',
      creditsSub: 'The people behind the project',
      creditsA: 'Created and maintained by ',
      creditsB: '. Special thanks to ',
      creditsC: ' for automating company submissions via Google Forms with ',
      creditsD: '.',
      exploreMarket: 'Explore the market →',
    },
  },
  vi: {
    nav: {
      companies: 'Công ty',
      investors: 'Nhà đầu tư',
      market: 'Thị trường',
      about: 'Giới thiệu',
      marketOverview: 'Tổng quan thị trường',
      menu: 'Menu',
      lightMode: 'Chế độ sáng',
      darkMode: 'Chế độ tối',
      projectBy: 'Dự án của René',
      language: 'English',
    },
    footer: {
      copyright: 'Dự án mã nguồn mở của',
    },
    home: {
      metaTitle: 'Viet.io — Hệ sinh thái khởi nghiệp Việt Nam',
      metaDesc: (c: number, i: number, n: number) =>
        `Khám phá ${c}+ công ty công nghệ và startup Việt Nam cùng ${i}+ nhà đầu tư trong ${n} lĩnh vực. Viet.io là danh bạ mã nguồn mở về nền kinh tế số Việt Nam.`,
      heroPre: 'Hệ sinh thái ',
      heroAccent: 'khởi nghiệp Việt Nam',
      heroPost: ', mã nguồn mở',
      heroSub: 'Danh bạ mở về các công ty công nghệ và nhà đầu tư đang xây dựng nền kinh tế số Việt Nam.',
      companiesLabel: 'công ty',
      investorsLabel: 'nhà đầu tư',
      industriesLabel: 'lĩnh vực',
      findCompanies: 'Tìm công ty',
      findInvestors: 'Tìm nhà đầu tư',
      marketCallout: 'Tổng quan thị trường Việt Nam',
      marketCalloutSub: 'Thống kê hệ sinh thái và chỉ số vĩ mô',
      exploreByIndustry: 'Khám phá theo lĩnh vực',
      exploreSub: 'Những lĩnh vực lớn nhất trong danh bạ',
      viewAll: 'Xem tất cả →',
    },
    companies: {
      metaTitle: (c: number) => `Công ty công nghệ & startup Việt Nam — ${c}+ hồ sơ | Viet.io`,
      metaDesc: (c: number) =>
        `Khám phá ${c}+ công ty công nghệ và startup Việt Nam theo lĩnh vực: fintech, thương mại điện tử, game, y tế, giáo dục và hơn thế nữa. Danh bạ mã nguồn mở, miễn phí.`,
      headerPre: 'Tìm ',
      headerAccent: 'công ty Việt Nam',
      noResults: (industry: string) => `Không có công ty ${industry}`,
      loadingMore: 'Đang tải thêm...',
      searchPlaceholder: 'Tìm kiếm công ty',
    },
    investors: {
      metaTitle: (i: number) => `Nhà đầu tư & quỹ VC tại Việt Nam — ${i}+ hồ sơ | Viet.io`,
      metaDesc: (i: number) =>
        `Khám phá ${i}+ nhà đầu tư đang hoạt động tại Việt Nam: quỹ đầu tư mạo hiểm, nhà đầu tư thiên thần, vườn ươm, quỹ doanh nghiệp và quỹ đầu tư tư nhân.`,
      headerPre: 'Tìm ',
      headerAccent: 'nhà đầu tư Việt Nam',
      noResults: (type: string) => `Không có nhà đầu tư ${type}`,
      loadingMore: 'Đang tải thêm...',
      searchPlaceholder: 'Tìm kiếm nhà đầu tư',
    },
    market: {
      metaTitle: 'Tổng quan thị trường Việt Nam — Số liệu kinh tế công nghệ | Viet.io',
      metaDesc: (c: number, i: number, n: number) =>
        `Toàn cảnh thị trường công nghệ Việt Nam: ${c} công ty và ${i} nhà đầu tư trong ${n} lĩnh vực, cùng các chỉ số vĩ mô — tăng trưởng GDP, quy mô kinh tế số, mức độ phổ cập internet và nhân khẩu học.`,
      heroPre: 'Tổng quan ',
      heroAccent: 'thị trường Việt Nam',
      heroSub: 'Bức tranh về một trong những nền kinh tế công nghệ tăng trưởng nhanh nhất Đông Nam Á — dữ liệu trực tiếp từ danh bạ Viet.io cùng các chỉ số vĩ mô quan trọng.',
      snapshotTitle: 'Toàn cảnh hệ sinh thái',
      snapshotSub: 'Dữ liệu trực tiếp từ danh bạ mã nguồn mở Viet.io',
      statCompanies: 'Công ty công nghệ được theo dõi',
      statInvestors: 'Nhà đầu tư đang hoạt động',
      statIndustries: 'Lĩnh vực được đại diện',
      byIndustry: 'Công ty theo lĩnh vực',
      byType: 'Nhà đầu tư theo loại hình',
      browseAllCompanies: 'Xem tất cả công ty →',
      browseAllInvestors: 'Xem tất cả nhà đầu tư →',
      macroTitle: 'Chỉ số vĩ mô',
      macroSub: 'Vì sao Việt Nam là một trong những thị trường công nghệ đáng chú ý nhất châu Á',
      macroDisclaimer: 'Các số liệu vĩ mô chỉ mang tính tham khảo. Vui lòng xem nguồn trích dẫn để có dữ liệu chính thức mới nhất.',
      sourceLabel: 'Nguồn',
      diveTitle: 'Tìm hiểu thêm',
      diveSub: 'Khám phá hệ sinh thái hoặc đóng góp cho dự án',
      browseCompanies: 'Xem công ty',
      browseInvestors: 'Xem nhà đầu tư',
      contribute: 'Đóng góp trên GitHub',
      indicators: [
        {
          label: 'Dân số',
          value: '≈100 triệu',
          detail: 'Vượt mốc 100 triệu dân năm 2023, đứng thứ 15 thế giới về dân số.',
          source: 'Tổng cục Thống kê Việt Nam',
        },
        {
          label: 'Tăng trưởng GDP',
          value: '≈7%/năm',
          detail: 'Một trong những nền kinh tế tăng trưởng nhanh nhất châu Á trong thập kỷ qua.',
          source: 'Tổng cục Thống kê / World Bank',
        },
        {
          label: 'Kinh tế số',
          value: '≈36 tỷ USD GMV',
          detail: 'Dự báo đạt 90–200 tỷ USD vào năm 2030, thuộc nhóm tăng trưởng nhanh nhất Đông Nam Á.',
          source: 'e-Conomy SEA (Google, Temasek, Bain)',
        },
        {
          label: 'Người dùng internet',
          value: '≈79 triệu',
          detail: 'Khoảng 4/5 dân số trực tuyến, chủ yếu qua thiết bị di động.',
          source: 'DataReportal Digital Vietnam',
        },
        {
          label: 'Tỷ lệ dùng smartphone',
          value: '≈85% người trưởng thành',
          detail: 'Di động là cửa ngõ chính đến internet, thương mại và thanh toán.',
          source: 'GSMA / DataReportal',
        },
        {
          label: 'Độ tuổi trung vị',
          value: '≈33 tuổi',
          detail: 'Lực lượng lao động trẻ, am hiểu công nghệ, thúc đẩy startup và gia công toàn cầu.',
          source: 'UN World Population Prospects',
        },
      ],
    },
    about: {
      metaTitle: 'Giới thiệu Viet.io — Danh bạ startup Việt Nam mã nguồn mở',
      metaDesc: (c: number, i: number) =>
        `Vì sao Viet.io tồn tại và cách đóng góp. Danh bạ mã nguồn mở theo dõi ${c}+ công ty công nghệ và ${i}+ nhà đầu tư Việt Nam, xây dựng bằng Next.js và được cộng đồng duy trì.`,
      heroPre: 'Giới thiệu ',
      heroSub: 'Bản đồ mã nguồn mở về hệ sinh thái công nghệ Việt Nam — miễn phí sử dụng, tự do đóng góp và phát triển công khai.',
      whyTitle: 'Vì sao dự án tồn tại',
      whySub: 'Câu chuyện đằng sau dự án',
      p1: 'Việt Nam là một trong những nền kinh tế công nghệ tăng trưởng nhanh nhất Đông Nam Á, nhưng thông tin về startup và nhà đầu tư từ lâu vẫn rời rạc, lỗi thời hoặc bị khóa sau tường phí.',
      p2: 'Viet.io giải quyết điều đó bằng một ý tưởng đơn giản: mỗi công ty và nhà đầu tư là một tệp JSON trong kho GitHub công khai. Ai cũng có thể thêm, sửa hoặc bổ sung dữ liệu — và toàn bộ trang web được dựng lại thành một website tĩnh siêu nhanh.',
      p3a: 'Hiện danh bạ đang theo dõi ',
      p3b: ' và ',
      p3c: ' trong ',
      p3d: '.',
      contributeTitle: 'Cách đóng góp',
      contributeSub: 'Ba bước để thêm công ty hoặc nhà đầu tư',
      steps: [
        { title: 'Fork kho mã nguồn', text: 'Viet.io hoàn toàn mã nguồn mở trên GitHub. Fork và clone về máy để bắt đầu.' },
        { title: 'Thêm tệp JSON', text: 'Mỗi công ty và nhà đầu tư là một tệp JSON trong public/data. Sao chép mẫu và điền thông tin.' },
        { title: 'Mở pull request', text: 'Gửi PR của bạn — sau khi được merge, hồ sơ mới sẽ xuất hiện ở lần deploy tiếp theo.' },
      ],
      viewRepo: 'Xem kho mã nguồn',
      companyTemplate: 'Mẫu công ty',
      investorTemplate: 'Mẫu nhà đầu tư',
      builtWithTitle: 'Công nghệ sử dụng',
      builtWithSub: 'Một stack đơn giản và nhanh có chủ đích',
      creditsTitle: 'Ghi nhận & kết nối',
      creditsSub: 'Những người đứng sau dự án',
      creditsA: 'Được tạo và duy trì bởi ',
      creditsB: '. Cảm ơn đặc biệt tới ',
      creditsC: ' vì đã tự động hóa việc thêm công ty qua Google Forms với ',
      creditsD: '.',
      exploreMarket: 'Khám phá thị trường →',
    },
  },
} as const;
