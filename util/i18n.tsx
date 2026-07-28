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
        `Explore ${c} Vietnam startups and tech companies plus ${i} active investors across ${n} industries. Viet.io is the open-source directory of Vietnam's fast-growing digital economy.`,
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
      metaTitle: (c: number) => `Vietnam Tech Companies & Startups — Browse ${c} | Viet.io`,
      metaDesc: (c: number) =>
        `Browse ${c} Vietnam technology companies and startups by industry: fintech, ecommerce, gaming, healthcare, education and more. Free, open-source directory.`,
      headerPre: 'Find ',
      headerAccent: 'Vietnam Companies',
      noResults: (industry: string) => `No ${industry} companies`,
      searchNoResults: (query: string) => `No companies found for “${query}”`,
      searchPlaceholder: 'Search companies',
      filterLabel: 'Filter companies by industry',
      resultCount: (count: number) => `${count} ${count === 1 ? 'company' : 'companies'}`,
      loadMore: 'Load more companies',
    },
    investors: {
      metaTitle: (i: number) => `Vietnam Startup Investors & VCs — Browse ${i} | Viet.io`,
      metaDesc: (i: number) =>
        `Discover ${i} active investors in Vietnam startups: venture capital firms, angels, accelerators, corporate VCs and private equity. Free, open-source directory.`,
      headerPre: 'Find ',
      headerAccent: 'Vietnam Investors',
      noResults: (type: string) => `No ${type} investors`,
      searchNoResults: (query: string) => `No investors found for “${query}”`,
      searchPlaceholder: 'Search investors',
      filterLabel: 'Filter investors by type',
      resultCount: (count: number) => `${count} ${count === 1 ? 'investor' : 'investors'}`,
      loadMore: 'Load more investors',
    },
    market: {
      metaTitle: 'Vietnam Market Overview — Tech Economy Stats & Startup Data | Viet.io',
      metaDesc: (c: number, i: number, n: number) =>
        `Vietnam tech market snapshot: ${c} companies and ${i} investors tracked across ${n} industries, plus macro indicators — GDP growth, digital economy size, internet adoption and demographics.`,
      heroPre: 'Vietnam ',
      heroAccent: 'Market Overview',
      heroSub: "A research-backed view of one of Southeast Asia's fastest-growing economies — live Viet.io directory data, official indicators and private-capital signals.",
      updatedLabel: 'Updated July 2026',
      snapshotTitle: 'Ecosystem snapshot',
      snapshotSub: 'Live from the open-source Viet.io directory',
      statCompanies: 'Tech companies tracked',
      statInvestors: 'Active investors listed',
      statIndustries: 'Industries represented',
      byIndustry: 'Companies by industry',
      byType: 'Investors by type',
      browseAllCompanies: 'Browse all companies →',
      browseAllInvestors: 'Browse all investors →',
      macroTitle: 'Market pulse',
      macroSub: 'The latest available figures as of July 2026',
      macroDisclaimer: 'Reporting periods differ by indicator. Values marked H1 cover January–June 2026; 2025 figures are the latest full-year data available.',
      sourceLabel: 'Source',
      signalsTitle: 'How to read the market',
      signalsSub: 'Three signals that matter for builders and investors',
      signals: [
        {
          title: 'Digital demand keeps compounding',
          text: 'Vietnam’s digital economy reached $39B GMV in 2025, while digital-payment GTV rose to $178B. Ecommerce alone represented $25B, giving consumer and fintech businesses a large, increasingly cashless base.',
        },
        {
          title: 'Capital returned — selectively',
          text: 'Private capital rebounded to $4.5B across 149 deals in 2025. Private equity contributed a record $4B; venture capital recovered to $509M, with AI investment running 13× above 2023 levels.',
        },
        {
          title: 'The industrial engine is accelerating',
          text: 'H1 2026 manufacturing output rose 11.4% and realized FDI reached $13.03B. The opportunity is broader than consumer apps: industrial software, logistics, energy, climate and supply-chain technology all benefit.',
        },
      ],
      watchTitle: 'What to watch',
      watchSub: 'Momentum is strong, but the composition matters',
      watchItems: [
        {
          title: 'Growth may normalize',
          text: 'H1 GDP grew 8.18%, while the World Bank’s full-year 2026 forecast is 6.8%. The gap reflects a tougher external outlook rather than weak domestic momentum.',
        },
        {
          title: 'Imports are rising faster than exports',
          text: 'H1 imports grew 33.4% versus 21.0% for exports, producing a $16.65B goods trade deficit. Much of the increase reflects imported production inputs, but the external balance deserves attention.',
        },
        {
          title: 'The funding recovery is uneven',
          text: 'Private equity supplied almost nine-tenths of 2025 private capital. VC improved, but founders should still expect disciplined pricing, stronger proof points and investor preference for AI, climate tech and globally oriented teams.',
        },
      ],
      diveTitle: 'Dive deeper',
      diveSub: 'Explore the ecosystem or contribute to the project',
      browseCompanies: 'Browse Companies',
      browseInvestors: 'Browse Investors',
      contribute: 'Contribute on GitHub',
      indicators: [
        {
          label: 'H1 2026 GDP growth',
          value: '+8.18%',
          detail: 'Q2 expanded 8.39% year-on-year, with industry and construction contributing half of quarterly growth.',
          source: 'National Statistics Office · 3 Jul 2026',
          href: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/07/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-ii-va-sau-thang-dau-nam-2026/',
        },
        {
          label: '2026 growth forecast',
          value: '6.8%',
          detail: 'The World Bank expects growth to moderate from 8.0% in 2025 while remaining robust.',
          source: 'World Bank · 15 May 2026',
          href: 'https://www.worldbank.org/en/news/press-release/2026/05/15/viet-nam-s-economy-remains-resilient-but-sustained-reforms-are-key-to-navigating-heightened-uncertainty-wb',
        },
        {
          label: '2025 economy',
          value: '$514B GDP',
          detail: 'GDP per capita reached $5,026 after real output expanded 8.02% in 2025.',
          source: 'National Statistics Office · Jan 2026',
          href: 'https://www.nso.gov.vn/en/data-and-statistics/2026/01/socio-economic-situation-in-the-fourth-quarter-and-2025/',
        },
        {
          label: 'Digital economy',
          value: '$39B GMV',
          detail: 'Up from $34B in 2024; the 2030 outlook spans roughly $85B–$190B.',
          source: 'Google, Temasek & Bain · 2025',
          href: 'https://services.google.com/fh/files/misc/vietnam_e_conomy_sea_2025_report.pdf',
        },
        {
          label: 'Digital payments',
          value: '$178B GTV',
          detail: 'Payment value grew from $150B in 2024 and is projected near $300B–$400B by 2030.',
          source: 'Google, Temasek & Bain · 2025',
          href: 'https://services.google.com/fh/files/misc/vietnam_e_conomy_sea_2025_report.pdf',
        },
        {
          label: 'Private capital',
          value: '$4.5B',
          detail: '149 deals in 2025: a record $4B in PE and a VC recovery to $509M.',
          source: 'NIC, VPCA & BCG · 29 May 2026',
          href: 'https://www.bcg.com/publications/2026/vietnam-innovation-and-private-capital-report',
        },
        {
          label: 'H1 realized FDI',
          value: '$13.03B',
          detail: 'Up 11.2% year-on-year and the strongest first-half result since at least 2022.',
          source: 'National Statistics Office · 3 Jul 2026',
          href: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/07/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-ii-va-sau-thang-dau-nam-2026/',
        },
        {
          label: 'H1 manufacturing',
          value: '+11.4%',
          detail: 'Manufacturing led industrial growth as the overall IIP increased 10.8%.',
          source: 'National Statistics Office · 3 Jul 2026',
          href: 'https://www.nso.gov.vn/en/data-and-statistics/2026/07/index-of-industrial-production-in-june-of-2026/',
        },
        {
          label: '2025 population',
          value: '102.3M',
          detail: 'A labor force of 53.5M supports a large domestic market and manufacturing base.',
          source: 'National Statistics Office · Jan 2026',
          href: 'https://www.nso.gov.vn/en/data-and-statistics/2026/01/press-release-social-economic-situation-in-the-fourth-quarter-and-2025/',
        },
      ],
    },
    about: {
      metaTitle: 'About Viet.io — The Open-Source Vietnam Startup Directory',
      metaDesc: (c: number, i: number) =>
        `Why Viet.io exists and how to contribute. An open-source directory tracking ${c} Vietnam tech companies and ${i} investors, built with Next.js and maintained by the community.`,
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
        `Khám phá ${c} công ty công nghệ và startup Việt Nam cùng ${i} nhà đầu tư trong ${n} lĩnh vực. Viet.io là danh bạ mã nguồn mở về nền kinh tế số Việt Nam.`,
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
      metaTitle: (c: number) => `Công ty công nghệ & startup Việt Nam — ${c} hồ sơ | Viet.io`,
      metaDesc: (c: number) =>
        `Khám phá ${c} công ty công nghệ và startup Việt Nam theo lĩnh vực: fintech, thương mại điện tử, game, y tế, giáo dục và hơn thế nữa. Danh bạ mã nguồn mở, miễn phí.`,
      headerPre: 'Tìm ',
      headerAccent: 'công ty Việt Nam',
      noResults: (industry: string) => `Không có công ty ${industry}`,
      searchNoResults: (query: string) => `Không tìm thấy công ty cho “${query}”`,
      searchPlaceholder: 'Tìm kiếm công ty',
      filterLabel: 'Lọc công ty theo lĩnh vực',
      resultCount: (count: number) => `${count} công ty`,
      loadMore: 'Xem thêm công ty',
    },
    investors: {
      metaTitle: (i: number) => `Nhà đầu tư & quỹ VC tại Việt Nam — ${i} hồ sơ | Viet.io`,
      metaDesc: (i: number) =>
        `Khám phá ${i} nhà đầu tư đang hoạt động tại Việt Nam: quỹ đầu tư mạo hiểm, nhà đầu tư thiên thần, vườn ươm, quỹ doanh nghiệp và quỹ đầu tư tư nhân.`,
      headerPre: 'Tìm ',
      headerAccent: 'nhà đầu tư Việt Nam',
      noResults: (type: string) => `Không có nhà đầu tư ${type}`,
      searchNoResults: (query: string) => `Không tìm thấy nhà đầu tư cho “${query}”`,
      searchPlaceholder: 'Tìm kiếm nhà đầu tư',
      filterLabel: 'Lọc nhà đầu tư theo loại hình',
      resultCount: (count: number) => `${count} nhà đầu tư`,
      loadMore: 'Xem thêm nhà đầu tư',
    },
    market: {
      metaTitle: 'Tổng quan thị trường Việt Nam — Số liệu kinh tế công nghệ | Viet.io',
      metaDesc: (c: number, i: number, n: number) =>
        `Toàn cảnh thị trường công nghệ Việt Nam: ${c} công ty và ${i} nhà đầu tư trong ${n} lĩnh vực, cùng các chỉ số vĩ mô — tăng trưởng GDP, quy mô kinh tế số, mức độ phổ cập internet và nhân khẩu học.`,
      heroPre: 'Tổng quan ',
      heroAccent: 'thị trường Việt Nam',
      heroSub: 'Góc nhìn có nguồn dẫn về một trong những nền kinh tế tăng trưởng nhanh nhất Đông Nam Á — kết hợp dữ liệu Viet.io, chỉ số chính thức và tín hiệu vốn tư nhân.',
      updatedLabel: 'Cập nhật tháng 7/2026',
      snapshotTitle: 'Toàn cảnh hệ sinh thái',
      snapshotSub: 'Dữ liệu trực tiếp từ danh bạ mã nguồn mở Viet.io',
      statCompanies: 'Công ty công nghệ được theo dõi',
      statInvestors: 'Nhà đầu tư đang hoạt động',
      statIndustries: 'Lĩnh vực được đại diện',
      byIndustry: 'Công ty theo lĩnh vực',
      byType: 'Nhà đầu tư theo loại hình',
      browseAllCompanies: 'Xem tất cả công ty →',
      browseAllInvestors: 'Xem tất cả nhà đầu tư →',
      macroTitle: 'Nhịp đập thị trường',
      macroSub: 'Số liệu mới nhất có sẵn đến tháng 7/2026',
      macroDisclaimer: 'Kỳ báo cáo khác nhau theo từng chỉ số. Số liệu H1 bao gồm tháng 1–6/2026; số liệu 2025 là dữ liệu cả năm mới nhất.',
      sourceLabel: 'Nguồn',
      signalsTitle: 'Cách đọc thị trường',
      signalsSub: 'Ba tín hiệu quan trọng cho nhà sáng lập và nhà đầu tư',
      signals: [
        {
          title: 'Nhu cầu số tiếp tục tích lũy',
          text: 'Kinh tế số Việt Nam đạt 39 tỷ USD GMV năm 2025, trong khi GTV thanh toán số tăng lên 178 tỷ USD. Riêng thương mại điện tử đạt 25 tỷ USD, tạo nền tảng lớn và ngày càng ít dùng tiền mặt.',
        },
        {
          title: 'Dòng vốn quay lại — nhưng có chọn lọc',
          text: 'Vốn tư nhân phục hồi lên 4,5 tỷ USD qua 149 thương vụ năm 2025. PE lập kỷ lục 4 tỷ USD; VC phục hồi lên 509 triệu USD, còn đầu tư AI cao gấp 13 lần năm 2023.',
        },
        {
          title: 'Động cơ công nghiệp đang tăng tốc',
          text: 'Sản xuất chế biến, chế tạo tăng 11,4% trong H1/2026 và FDI thực hiện đạt 13,03 tỷ USD. Cơ hội mở rộng sang phần mềm công nghiệp, logistics, năng lượng, khí hậu và chuỗi cung ứng.',
        },
      ],
      watchTitle: 'Điều cần theo dõi',
      watchSub: 'Động lực mạnh, nhưng cơ cấu tăng trưởng rất quan trọng',
      watchItems: [
        {
          title: 'Tăng trưởng có thể bình thường hóa',
          text: 'GDP H1 tăng 8,18%, trong khi World Bank dự báo cả năm 2026 đạt 6,8%. Khoảng cách phản ánh môi trường bên ngoài khó khăn hơn, không phải nhu cầu trong nước suy yếu.',
        },
        {
          title: 'Nhập khẩu tăng nhanh hơn xuất khẩu',
          text: 'Nhập khẩu H1 tăng 33,4% so với mức 21,0% của xuất khẩu, tạo thâm hụt hàng hóa 16,65 tỷ USD. Phần lớn là đầu vào sản xuất, nhưng cán cân đối ngoại cần được theo dõi.',
        },
        {
          title: 'Phục hồi vốn chưa đồng đều',
          text: 'PE chiếm gần chín phần mười vốn tư nhân năm 2025. VC cải thiện nhưng nhà sáng lập vẫn cần định giá kỷ luật, bằng chứng tăng trưởng rõ ràng và lợi thế trong AI, khí hậu hoặc thị trường toàn cầu.',
        },
      ],
      diveTitle: 'Tìm hiểu thêm',
      diveSub: 'Khám phá hệ sinh thái hoặc đóng góp cho dự án',
      browseCompanies: 'Xem công ty',
      browseInvestors: 'Xem nhà đầu tư',
      contribute: 'Đóng góp trên GitHub',
      indicators: [
        {
          label: 'Tăng trưởng GDP H1/2026',
          value: '+8,18%',
          detail: 'Quý II tăng 8,39% so với cùng kỳ; công nghiệp và xây dựng đóng góp một nửa mức tăng quý.',
          source: 'Cục Thống kê · 03/07/2026',
          href: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/07/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-ii-va-sau-thang-dau-nam-2026/',
        },
        {
          label: 'Dự báo tăng trưởng 2026',
          value: '6,8%',
          detail: 'World Bank dự báo tăng trưởng điều chỉnh từ 8,0% năm 2025 nhưng vẫn ở mức tích cực.',
          source: 'World Bank · 15/05/2026',
          href: 'https://www.worldbank.org/vi/news/press-release/2026/05/15/viet-nam-s-economy-remains-resilient-but-sustained-reforms-are-key-to-navigating-heightened-uncertainty-wb',
        },
        {
          label: 'Quy mô kinh tế 2025',
          value: 'GDP 514 tỷ USD',
          detail: 'GDP bình quân đầu người đạt 5.026 USD sau khi GDP thực tăng 8,02% năm 2025.',
          source: 'Cục Thống kê · 01/2026',
          href: 'https://www.nso.gov.vn/en/data-and-statistics/2026/01/socio-economic-situation-in-the-fourth-quarter-and-2025/',
        },
        {
          label: 'Kinh tế số',
          value: '39 tỷ USD GMV',
          detail: 'Tăng từ 34 tỷ USD năm 2024; triển vọng 2030 khoảng 85–190 tỷ USD.',
          source: 'Google, Temasek & Bain · 2025',
          href: 'https://services.google.com/fh/files/misc/vietnam_e_conomy_sea_2025_report.pdf',
        },
        {
          label: 'Thanh toán số',
          value: '178 tỷ USD GTV',
          detail: 'Tăng từ 150 tỷ USD năm 2024 và dự báo đạt khoảng 300–400 tỷ USD vào 2030.',
          source: 'Google, Temasek & Bain · 2025',
          href: 'https://services.google.com/fh/files/misc/vietnam_e_conomy_sea_2025_report.pdf',
        },
        {
          label: 'Vốn tư nhân',
          value: '4,5 tỷ USD',
          detail: '149 thương vụ năm 2025: PE kỷ lục 4 tỷ USD và VC phục hồi lên 509 triệu USD.',
          source: 'NIC, VPCA & BCG · 29/05/2026',
          href: 'https://www.bcg.com/publications/2026/vietnam-innovation-and-private-capital-report',
        },
        {
          label: 'FDI thực hiện H1',
          value: '13,03 tỷ USD',
          detail: 'Tăng 11,2% so với cùng kỳ và là kết quả sáu tháng cao nhất kể từ ít nhất năm 2022.',
          source: 'Cục Thống kê · 03/07/2026',
          href: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/07/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-ii-va-sau-thang-dau-nam-2026/',
        },
        {
          label: 'Chế biến, chế tạo H1',
          value: '+11,4%',
          detail: 'Chế biến, chế tạo dẫn dắt tăng trưởng khi toàn ngành công nghiệp tăng 10,8%.',
          source: 'Cục Thống kê · 03/07/2026',
          href: 'https://www.nso.gov.vn/en/data-and-statistics/2026/07/index-of-industrial-production-in-june-of-2026/',
        },
        {
          label: 'Dân số 2025',
          value: '102,3 triệu',
          detail: 'Lực lượng lao động 53,5 triệu người hỗ trợ thị trường nội địa và nền sản xuất lớn.',
          source: 'Cục Thống kê · 01/2026',
          href: 'https://www.nso.gov.vn/en/data-and-statistics/2026/01/press-release-social-economic-situation-in-the-fourth-quarter-and-2025/',
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
