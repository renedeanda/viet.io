# Viet.io Product Roadmap 2026

> A comprehensive roadmap for enhancing Viet.io as the leading open-source platform for the Vietnam startup ecosystem

**Last Updated:** January 2026
**Current State:** 249 companies, 80 investors/VCs, Next.js static site with search & filtering

---

## Executive Summary

Based on extensive research of the Vietnam startup ecosystem as of January 2026, this roadmap outlines strategic initiatives to transform Viet.io from a company directory into a comprehensive platform for Vietnam's tech ecosystem. The recommendations focus on leveraging your hand-curated data asset through AI-powered features, actionable tools for founders, and real-time market intelligence.

### Key Ecosystem Insights (2026)

- **Ecosystem Size:** 4,000+ startups, 7 unicorns (MoMo, VNG, Sky Mavis, VNPAY, VNLIFE, Tiki, +1)
- **Digital Economy:** $39B in 2025, projected to reach $90-200B by 2030
- **Funding Landscape:** Down 50% in 2024, but expected to grow 83% between 2025-2030
- **AI Adoption:** 81% of Vietnamese users interact with AI tools daily (highest in SEA)
- **Hot Sectors:** AI, Climate Tech (22.3% of VC activity), FinTech, Semiconductors
- **Infrastructure:** 208 VC funds, 79 incubators, 35 accelerators, 1,400+ support organizations
- **Government Initiative:** National Venture Capital Fund launched with $20M initial funding

---

## Roadmap Structure

Initiatives are organized into **Phases** with estimated complexity, impact, and implementation priorities:

- 🟢 **Phase 1 (Q1 2026):** High impact, low-to-medium effort - Quick wins
- 🟡 **Phase 2 (Q2-Q3 2026):** Medium-to-high impact, medium effort - Core features
- 🔵 **Phase 3 (Q4 2026+):** High impact, high effort - Platform evolution

---

## 🟢 Phase 1: Foundation & Quick Wins (Q1 2026)

### 1.1 AI-Powered Chatbot 🤖
**Priority:** HIGH | **Effort:** LOW | **Cost:** $0-50/month

Transform your curated data into conversational intelligence, similar to your renedeanda.com implementation.

**Features:**
- Natural language search across companies and investors
- "Find me FinTech VCs that invest in Series A" queries
- Company comparisons and recommendations
- Investment trend insights from your data
- Multilingual support (English/Vietnamese)

**Implementation:**
- Use Vercel AI SDK or similar
- Embed on all pages (floating widget)
- Vector database of your JSON files (Pinecone free tier or Supabase pgvector)
- OpenAI API (~$10-30/month for moderate usage) or Claude API

**Why Now:** Your 249 companies + 80 VCs = rich, curated dataset perfect for RAG (Retrieval-Augmented Generation). This unlocks conversational access to data you already have.

**Example Queries:**
- "Which gaming companies have raised Series B funding?"
- "Show me all VCs in Hanoi that invest in climate tech"
- "What's the average funding round size for EdTech startups?"

---

### 1.2 Market Overview Dashboard 📊
**Priority:** HIGH | **Effort:** MEDIUM | **Cost:** Free (using free APIs)

Create a dedicated `/market` page with real-time ecosystem statistics and trends.

**Sections:**

#### A. Ecosystem Statistics (From Your Data)
- Total companies by industry (visual breakdown)
- Investor types distribution
- Geographic heatmap (Hanoi, HCMC, Da Nang)
- Growth trends (companies added over time)
- Most active industries

#### B. Latest Market Insights (Curated Monthly)
- Funding trends (based on recent deals)
- Top funding rounds this quarter
- New unicorns/near-unicorns updates
- Government policy updates
- Key ecosystem milestones

#### C. External Data Integration (Optional)
- Live updates from Tracxn API (if available)
- CrunchBase integration for funding news
- Government statistics from GSO Vietnam
- Currency exchange rates (USD/VND)

**Data Sources:**
- Your existing JSON files for company/investor stats
- Manual curation of quarterly reports
- e-Conomy SEA reports (annual)
- VPCA Vietnam Innovation & Private Capital Report
- Tracxn Vietnam startup data
- StartupBlink rankings

**Visualization Tools:**
- Chart.js or Recharts (free, React-friendly)
- D3.js for advanced visualizations
- Tailwind CSS for responsive design

**Why Now:** You already have the data. This adds immediate value for researchers, investors, and journalists studying the market.

---

### 1.3 Enhanced Search & Discovery 🔍
**Priority:** MEDIUM | **Effort:** LOW | **Cost:** Free

Improve existing search with advanced filters and saved searches.

**New Filters:**
- Funding stage (bootstrapped, seed, Series A/B/C, etc.)
- Company size (team count)
- Founded year range
- Multiple industry tags (not just one)
- Investor focus areas
- Geographic location

**New Features:**
- Save search preferences (localStorage)
- Share filtered views via URL params
- "Similar companies" recommendations
- Trending searches
- Recently added/updated companies badge

**Technical Implementation:**
- Extend existing `filterCompanies` function in `/util/helpers`
- Add URL query params for shareable filters
- Add metadata to company JSON schema (funding_stage, team_size, etc.)

---

### 1.4 Company & Investor Data Enrichment 📝
**Priority:** MEDIUM | **Effort:** MEDIUM | **Cost:** Free

Expand your JSON schema to capture more valuable data points.

**New Company Fields:**
```json
{
  "funding_stage": "Series A",
  "total_funding": "$5.2M",
  "team_size": "25-50",
  "founded_year": 2019,
  "hq_location": "Ho Chi Minh City",
  "notable_investors": ["East Ventures", "500 Startups"],
  "last_funding_date": "2024-11-15",
  "tech_stack": ["React", "Node.js", "AWS"],
  "hiring": true,
  "careers_url": "https://company.com/careers",
  "media_coverage": [
    {"title": "Company raises $5M", "url": "...", "date": "2024-11"}
  ]
}
```

**New Investor Fields:**
```json
{
  "investment_range": "$100K - $2M",
  "stage_focus": ["Seed", "Series A"],
  "industry_focus": ["FinTech", "EdTech"],
  "portfolio_companies": ["Company1", "Company2"],
  "investments_per_year": 12,
  "accepting_pitches": true,
  "pitch_email": "pitch@vc.com"
}
```

**Crowdsourcing Strategy:**
- Create Google Form for community submissions
- Monthly "Data Quality Sprint" GitHub issues
- Gamification: Leaderboard for contributors

---

### 1.5 Newsletter Setup 📧
**Priority:** LOW | **Effort:** LOW | **Cost:** Free (up to 2,500 subscribers)

Build an audience with monthly ecosystem updates.

**Content:**
- New companies/investors added
- Funding announcements
- Market statistics
- Featured startup of the month
- Upcoming events

**Tools:**
- ConvertKit (free up to 1,000 subscribers)
- Mailchimp (free up to 2,000 subscribers)
- Resend (3,000 emails/month free)

**Implementation:**
- Email capture widget on homepage and /market page
- Automated monthly digest from your data
- RSS feed for updates

---

## 🟡 Phase 2: Core Platform Features (Q2-Q3 2026)

### 2.1 Startup Resource Hub 🛠️
**Priority:** HIGH | **Effort:** MEDIUM | **Cost:** Free

Create a `/resources` page with actionable tools and guides.

**Sections:**

#### A. Funding Finder Tool
- Interactive questionnaire: stage, industry, location, amount needed
- Matches startups with relevant VCs from your 80 investors
- Generates personalized list with contact info
- Email template generator for warm intros

#### B. Startup Toolkit Directory
- Legal: Incorporation guides, templates (partnership with law firms?)
- Finance: Accounting software, cap table management
- Marketing: Growth tools, PR agencies
- Hiring: Job boards, recruitment agencies
- Infrastructure: AWS credits, hosting deals
- Design: UI/UX resources

#### C. Playbooks & Guides
- "How to Raise Seed Funding in Vietnam"
- "Government Grant Applications Guide"
- "Market Entry Guide for Foreign Startups"
- "Vietnam Tech Talent Hiring Guide"
- "VC Pitch Deck Templates"

**Monetization Potential:**
- Sponsored listings for service providers
- Affiliate links for tools (AWS, Stripe, etc.)
- Premium guides ($5-10)

---

### 2.2 Funding Tracker & News Feed 📰
**Priority:** HIGH | **Effort:** HIGH | **Cost:** Free (manual curation)

Create a `/funding` page tracking deal flow and ecosystem news.

**Features:**
- Chronological feed of funding announcements
- Filter by amount, sector, investor, date
- Company acquisition news
- Unicorn milestone tracking
- Monthly/quarterly funding reports

**Data Sources:**
- Manual curation from news sources
- Community submissions
- RSS feeds from TechInAsia, e27, DealStreetAsia
- Scrapers (use responsibly)
- API integrations (Crunchbase if budget allows)

**Schema:**
```json
{
  "company": "Company Name",
  "amount": "$5M",
  "round": "Series A",
  "lead_investor": "East Ventures",
  "co_investors": ["500 Startups", "Jungle Ventures"],
  "date": "2024-11-15",
  "source_url": "https://...",
  "description": "..."
}
```

**Why Valuable:**
- No centralized Vietnam deal tracker exists
- Helps founders benchmark
- Keeps investors informed
- Attracts traffic from news searches

---

### 2.3 Events Calendar 📅
**Priority:** MEDIUM | **Effort:** MEDIUM | **Cost:** Free

Centralized calendar for Vietnam startup events.

**Event Types:**
- Pitch competitions
- Demo days
- Networking events
- Conferences (Techfest, Echelon, etc.)
- Workshops & training
- Hackathons
- Investor office hours

**Features:**
- Filter by city, type, date
- Add to Google Calendar integration
- Event organizer submissions
- Past event recordings/recaps

**Data Sources:**
- Manual curation
- Integration with Eventbrite/Luma
- Partnerships with accelerators/incubators
- Community submissions

---

### 2.4 Success Stories & Case Studies 🏆
**Priority:** MEDIUM | **Effort:** MEDIUM | **Cost:** Free

Create `/stories` page highlighting founder journeys.

**Content Types:**
- Founder interviews
- Exit stories (acquisitions, IPOs)
- Pivots and lessons learned
- Fundraising journeys
- International expansion stories
- First employee/early team stories

**Format:**
- Written Q&A interviews
- Video interviews (YouTube embeds)
- Podcast episodes (if you start one)

**Benefits:**
- Humanizes your directory
- SEO content (long-form articles)
- Builds community
- Inspires next generation

**Production:**
- Start with 1-2 stories per month
- Partner with existing media (TechInAsia, etc.) for content sharing
- User-generated content submissions

---

### 2.5 Interactive Data Visualizations 📈
**Priority:** MEDIUM | **Effort:** HIGH | **Cost:** Free

Upgrade the market overview with interactive charts and graphs.

**Visualizations:**

1. **Funding Heatmap**
   - Bubbles sized by funding amount
   - Color by industry
   - Timeline slider

2. **Network Graph**
   - Investor-Company relationships
   - Co-investment patterns
   - Click to explore connections

3. **Industry Evolution**
   - Timeline of company foundings by sector
   - Animated growth over years

4. **Geographic Map**
   - Vietnam map with startup clusters
   - Zoom into cities

5. **Comparison Tool**
   - Side-by-side company comparisons
   - Benchmark against industry averages

**Tech Stack:**
- D3.js for complex visualizations
- Recharts for standard charts
- Mapbox for geographic visualizations
- Observable notebooks for prototyping

---

### 2.6 Developer API (Beta) 🔌
**Priority:** LOW | **Effort:** HIGH | **Cost:** Free

Make your data accessible to developers and researchers.

**Endpoints:**
```
GET /api/companies?industry=fintech&limit=50
GET /api/companies/:slug
GET /api/investors?type=vc
GET /api/investors/:slug
GET /api/stats/overview
GET /api/stats/funding-trends
```

**Features:**
- RESTful API
- JSON responses
- Rate limiting (100 requests/hour for free tier)
- API key authentication
- GraphQL (optional, future)

**Use Cases:**
- Academic research
- News organizations
- Startup tools building on your data
- Mobile app developers
- Chrome extensions

**Monetization (Future):**
- Free tier: 1,000 requests/month
- Pro tier: $29/month for 50K requests
- Enterprise: Custom pricing

---

## 🔵 Phase 3: Advanced Platform & Community (Q4 2026+)

### 3.1 Job Board 💼
**Priority:** HIGH | **Effort:** HIGH | **Cost:** Free (with premium listings)

Create `/jobs` page for Vietnam startup jobs.

**Features:**
- Job postings from your 249 companies
- Filter by role, experience, location, equity
- "Working at X" company spotlights
- Salary transparency (optional)
- Remote-friendly filter

**Monetization:**
- Free for companies in your directory (encourages data updates)
- $99-199 for 30-day premium placement
- $299 for featured homepage placement

**Why Now Later:**
- Requires moderation and spam prevention
- Competes with established players
- But fills gap for Vietnam-focused startup jobs

---

### 3.2 Expert Directory & Mentorship 🎓
**Priority:** MEDIUM | **Effort:** MEDIUM | **Cost:** Free

Connect founders with experienced operators.

**Expert Categories:**
- Former founders (exits)
- Investors (office hours)
- Domain experts (legal, finance, marketing)
- Engineers (CTO mentorship)
- International expansion advisors

**Features:**
- Expert profiles with bio and expertise
- Booking system for office hours
- AMA sessions (Reddit-style)
- Mentor matching algorithm

**Incentives:**
- Free for first 50 mentors
- Visibility in ecosystem
- Speaking opportunities

---

### 3.3 Founder Community Features 👥
**Priority:** MEDIUM | **Effort:** HIGH | **Cost:** Free (hosting) + moderation time

Add social/community features to increase engagement.

**Options:**

#### Option A: Discussion Forum
- Topics: fundraising, hiring, marketing, tech
- Moderation required
- Integration with Discourse or custom build

#### Option B: Slack/Discord Community
- Easier to moderate
- Real-time chat
- Channels by topic/industry
- Lower dev effort (off-platform)

#### Option C: Hybrid
- Public forum on site
- Private Slack for verified founders

**Considerations:**
- Moderation bandwidth
- Spam prevention
- Value vs. existing communities (VietnamStartup WhatsApp groups, etc.)

**Alternative:**
- Partner with existing communities rather than build new one
- Focus on content aggregation

---

### 3.4 Premium Features & Sustainability 💰
**Priority:** MEDIUM | **Effort:** MEDIUM | **Cost:** Development time

Explore monetization to sustain the platform (while keeping core free).

**Potential Revenue Streams:**

1. **Company Verified Badges** ($49/year)
   - Blue checkmark
   - Enhanced profile (videos, team photos)
   - Analytics on profile views
   - Highlighted in search

2. **Investor Premium Profiles** ($99/year)
   - Portfolio company showcase
   - Investment thesis document
   - "Now Investing" status badge
   - Priority in chatbot recommendations

3. **Data Reports** ($99-299)
   - Quarterly Vietnam Startup Report
   - Industry deep-dives
   - Custom datasets for researchers

4. **Sponsored Content**
   - "Powered by" partnerships
   - Event sponsorships
   - Newsletter sponsorships

5. **Affiliate Revenue**
   - Startup tools (AWS, Stripe, etc.)
   - Legal services
   - Co-working spaces

**Keep Free:**
- Core directory
- Basic search
- Market overview
- AI chatbot (with rate limits)

---

### 3.5 Mobile App 📱
**Priority:** LOW | **Effort:** VERY HIGH | **Cost:** $0 (React Native)

Native mobile experience for on-the-go ecosystem discovery.

**Features:**
- Company/investor browsing
- Saved favorites
- Push notifications for funding news
- Event check-ins
- Network graph visualization

**Why Later:**
- High development cost
- Mobile web is sufficient for now
- PWA (Progressive Web App) is better interim solution

**Interim Solution: PWA**
- Add to home screen capability
- Offline access
- Push notifications
- Much lower effort than native app

---

### 3.6 Advanced AI Features 🧠
**Priority:** MEDIUM | **Effort:** HIGH | **Cost:** $50-200/month

Leverage AI beyond the chatbot for intelligent insights.

**Features:**

1. **Smart VC Matching**
   - Analyzes company profile
   - Recommends best-fit investors
   - Predicts likelihood of investment interest
   - Generates personalized intro emails

2. **Market Trend Prediction**
   - ML model trained on funding history
   - Predicts hot sectors for next quarter
   - Identifies emerging industry trends

3. **Company Similarity Engine**
   - "Companies like X" recommendations
   - Based on industry, stage, location, tech stack
   - Helps founders find peers

4. **Auto-tagging & Categorization**
   - AI reads company descriptions
   - Auto-suggests industry tags
   - Extracts key facts

5. **News Summarization**
   - Daily digest of Vietnam startup news
   - AI-generated summaries
   - Sentiment analysis

**Tech Stack:**
- OpenAI/Claude for LLM features
- TensorFlow/PyTorch for custom models
- Pinecone/Weaviate for vector search
- Fine-tuned models on Vietnam ecosystem data

---

## Website Enhancements & UX Improvements

### 4.1 Design & Performance 🎨
**Priority:** HIGH | **Effort:** MEDIUM | **Cost:** Free

Modernize the visual design and improve performance.

**Design Updates:**
- Refresh color scheme (keep Vietnamese cultural elements)
- Better mobile responsiveness
- Dark mode toggle
- Improved typography (Vietnamese diacritics support)
- Animated transitions and micro-interactions
- Loading skeletons instead of spinners

**Performance:**
- Migrate to Next.js 15+ (App Router)
- Image optimization (next/image)
- Code splitting and lazy loading
- Static generation where possible
- Edge functions for API routes
- CDN for assets (Vercel Edge Network)

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Alt text for all images
- Semantic HTML

---

### 4.2 SEO & Content Strategy 🔍
**Priority:** HIGH | **Effort:** MEDIUM | **Cost:** Free

Improve discoverability and organic traffic.

**Technical SEO:**
- Structured data (JSON-LD) for companies/investors
- Dynamic sitemaps
- Meta tags optimization
- Open Graph tags for social sharing
- Canonical URLs
- Page speed optimization (Core Web Vitals)

**Content Strategy:**
- Blog posts on ecosystem topics
- Industry reports (quarterly)
- Founder interviews (monthly)
- Press releases for milestones
- Guest posts on TechInAsia, e27

**Keyword Targets:**
- "Vietnam startups"
- "Vietnam venture capital"
- "Vietnam tech companies"
- "Vietnam unicorns"
- Industry-specific: "Vietnam fintech startups"

---

### 4.3 Analytics & Tracking 📊
**Priority:** MEDIUM | **Effort:** LOW | **Cost:** Free

Better understand user behavior to guide future development.

**Implement:**
- Google Analytics 4 (already using gtag.js)
- Hotjar or Microsoft Clarity for heatmaps
- Search query analytics
- Filter usage tracking
- Chatbot conversation analytics
- Conversion funnels (email signups, profile views)

**Key Metrics:**
- Most searched companies/investors
- Most filtered industries
- Geographic distribution of users
- Time spent on site
- Bounce rate by page
- Newsletter conversion rate

---

## Implementation Priorities

### High Impact, Quick Wins (Start Here)
1. ✅ AI Chatbot (2-3 weeks)
2. ✅ Market Overview Dashboard (3-4 weeks)
3. ✅ Enhanced Search Filters (1 week)
4. ✅ Design Refresh (2 weeks)
5. ✅ Newsletter Setup (1 week)

### High Impact, Medium Effort (Next 3 months)
1. ✅ Startup Resource Hub (4-6 weeks)
2. ✅ Funding Tracker (6-8 weeks with automation)
3. ✅ Data Enrichment (ongoing, crowdsourced)
4. ✅ SEO Optimization (2-3 weeks)

### High Impact, Higher Effort (6-12 months)
1. ✅ Success Stories (ongoing content)
2. ✅ Events Calendar (4 weeks + ongoing curation)
3. ✅ Interactive Visualizations (6-8 weeks)
4. ✅ Developer API (8-10 weeks)

### Lower Priority (Future)
1. Job Board (requires monetization strategy)
2. Expert Directory (requires network building)
3. Mobile App (PWA first)
4. Community Features (evaluate existing alternatives)

---

## Technical Architecture Recommendations

### Data Management
- **Current:** Static JSON files in `/public/data`
- **Short-term:** Keep static files, add build-time validation
- **Medium-term:** Migrate to headless CMS (Sanity, Contentful) for easier community contributions
- **Long-term:** PostgreSQL + Prisma for relational data, user accounts, jobs, events

### Hosting & Infrastructure
- **Current:** Vercel (excellent choice)
- **Additions:**
  - Supabase (free tier) for user features, auth, database
  - Cloudflare R2 for image/asset storage
  - Resend for transactional emails
  - Redis (Upstash free tier) for caching API responses

### AI/ML Stack
- **LLM:** OpenAI GPT-4 or Anthropic Claude
- **Vector DB:** Pinecone (free tier) or Supabase pgvector
- **Framework:** Vercel AI SDK or LangChain
- **Cost:** ~$20-50/month for moderate usage

---

## Success Metrics & Goals

### 2026 Targets
- **Traffic:** 50K monthly visitors (up from current ~10K)
- **Data:** 350+ companies, 120+ investors
- **Engagement:** 3 min average session duration
- **Newsletter:** 2,000+ subscribers
- **API:** 50+ developer accounts
- **Contributors:** 100+ community data submissions

### Qualitative Goals
- Recognized as the authoritative source for Vietnam startup data
- Cited in ecosystem reports (e-Conomy SEA, VPCA, etc.)
- Partnerships with accelerators and VCs
- Media coverage in TechInAsia, e27, VnExpress
- Used by government agencies for policy research

---

## Resource Requirements

### Development Time (Assuming 1 developer)
- **Phase 1 (Q1):** 8-10 weeks full-time
- **Phase 2 (Q2-Q3):** 16-20 weeks full-time
- **Phase 3 (Q4+):** Ongoing feature development

### Operational Costs (Monthly)
| Service | Cost |
|---------|------|
| Hosting (Vercel Pro) | $20 |
| OpenAI API (chatbot) | $30-50 |
| Supabase Pro | $25 |
| Email (Resend) | Free-$20 |
| Domain & DNS | $2 |
| **Total** | **$77-117/month** |

### Potential Revenue (Year 1)
| Source | Conservative Estimate |
|--------|----------------------|
| Verified badges (50 @ $49) | $2,450 |
| Job board (20 @ $150) | $3,000 |
| Newsletter sponsors (12 @ $200) | $2,400 |
| Data reports (10 @ $99) | $990 |
| **Total** | **$8,840** |

**Net:** $7,900 profit in Year 1 (assuming 50% of development time is volunteer)

---

## Risks & Mitigation

### Data Quality
**Risk:** Outdated or inaccurate company data
**Mitigation:**
- Quarterly data validation campaigns
- Incentivize companies to update profiles (verification badges)
- Community reporting system for incorrect data

### Competition
**Risk:** Established players (Tracxn, Crunchbase) have more resources
**Mitigation:**
- Focus on Vietnam-specific depth, not global breadth
- Community-driven approach (they can't compete with local crowdsourcing)
- Free and open-source model

### Spam & Moderation
**Risk:** Low-quality submissions, spam companies
**Mitigation:**
- Manual review of new company submissions
- Basic captcha on forms
- Reputation system for contributors
- Start with invite-only for certain features

### Monetization Pressure
**Risk:** Pressure to monetize may hurt user trust
**Mitigation:**
- Keep core features free always
- Transparent pricing
- No pay-to-rank
- Community governance for major decisions

---

## Open Questions for Discussion

1. **Target Audience Priority:** Should we optimize for:
   - Founders seeking investors/resources?
   - Investors seeking deal flow?
   - Researchers/journalists seeking data?
   - Talent seeking startup jobs?

2. **Content vs. Tools:** Should we focus more on:
   - Original content (stories, reports)?
   - Practical tools (VC matching, etc.)?
   - Data aggregation (funding tracker)?

3. **Community Building:** Should we build in-platform community features or partner with existing communities?

4. **Monetization Timeline:** When should we introduce paid features?
   - Q2 2026 (early, sustainable)
   - Q4 2026 (after critical mass)
   - 2027 (focus on growth first)

5. **Data Sourcing:** How aggressive should we be with automation vs. manual curation?
   - Heavy automation (scrapers, APIs)
   - Balanced (automation + manual review)
   - Mostly manual (highest quality)

6. **Geographic Expansion:** Should we eventually expand to other SEA countries or stay Vietnam-focused?

---

## Next Steps

### Immediate Actions (This Month)
1. ✅ Review and align on roadmap priorities
2. ✅ Set up development environment for Phase 1 features
3. ✅ Design mockups for Market Overview Dashboard
4. ✅ Research AI chatbot implementation options
5. ✅ Create new JSON schema for expanded company/investor data
6. ✅ Set up analytics tracking
7. ✅ Create GitHub issues for Phase 1 tasks

### Month 2-3
1. ✅ Launch AI Chatbot (beta)
2. ✅ Launch Market Overview Dashboard
3. ✅ Implement enhanced search filters
4. ✅ Begin data enrichment campaign
5. ✅ Set up newsletter infrastructure
6. ✅ Soft launch to community for feedback

---

## Research Sources

This roadmap was informed by extensive research on the Vietnam startup ecosystem as of January 2026:

### Market Reports & Statistics
- [e-Conomy SEA 2025 Report - Vietnam's Digital Economy](https://vietnamnet.vn/en/vietnam-s-digital-economy-hits-usd-39-billion-ai-and-e-commerce-drive-growth-2466540.html)
- [Vietnam Innovation & Private Capital Report 2025 - BCG & VPCA](https://doventures.vc/en/insights/reports/vietnam-innovation-and-private-capital-report-2025)
- [Statista - Vietnam Venture Capital Market Forecast](https://www.statista.com/outlook/fmo/capital-raising/traditional-capital-raising/venture-capital/vietnam)
- [Mordor Intelligence - Vietnam IT Services Market 2025-2030](https://www.mordorintelligence.com/industry-reports/vietnam-it-services-market)

### Ecosystem Insights
- [StartupBlink - Vietnam Startup Ecosystem Rankings](https://www.startupblink.com/startup-ecosystem/vietnam)
- [Current State of Startup Investment in Vietnam 2025 - NSSC](https://nssc.gov.vn/startup-stories/insights/current-state-of-startup-investment-in-vietnam-2025/)
- [2025 in Review: Vietnam's Startup Ecosystem Transformation - Insignia](https://review.insignia.vc/2025/12/17/vietnam-2/)
- [Tracxn - Vietnam Startups Database](https://tracxn.com/d/geographies/vietnam/__mXTFqXTV3nmiVAN40YK-fxLyh5iHTfRmkFLJ9qmnPbA)

### Funding & Investment Trends
- [Climate-tech Sector Sees Surge in VC Investment - VietnamPlus](https://en.vietnamplus.vn/climate-tech-sector-sees-surge-in-venture-capital-investment-post333871.vnp)
- [2026 Foreign Investment Outlook - Dragon Capital](https://theinvestor.vn/2026-highly-likely-to-mark-a-turning-point-for-foreign-indirect-investment-inflows-to-vietnam-dragon-capital-exec-d18006.html)
- [Top Venture Capital Firms in Vietnam 2026 - Failory](https://www.failory.com/blog/venture-capital-firms-vietnam)

### Unicorns & Success Stories
- [Vietnam Unicorns December 2025 - Tracxn](https://tracxn.com/d/unicorns/unicorns-in-vietnam/__mXTFqXTV3nmiVAN40YK-fxLyh5iHTfRmkFLJ9qmnPbA)
- [Vietnam Sets Sights on 3-4 Strategic Tech Unicorns by 2030 - VietnamNet](https://vietnamnet.vn/en/vietnam-sets-sights-on-34-strategic-tech-unicorns-by-2030-2472041.html)
- [Vietnamese Unicorns and Leading Startups - TechNews180](https://technews180.com/unicorns-soonicorns/vietnam-unicorns-and-startups/)

### Tools & Resources
- [OpenVC - Vietnam Investors Database](https://www.openvc.app/country/Vietnam)
- [Founder Institute Vietnam Accelerator](https://fi.co/insight/build-a-great-startup-in-2025-with-the-fi-vietnam-startup-accelerator-hanoi)
- [Top 100 Vietnam Startups to Watch in 2026 - Failory](https://www.failory.com/startups/vietnam)

---

## Conclusion

Viet.io has a unique position as an open-source, community-driven platform for Vietnam's thriving startup ecosystem. By transforming your hand-curated data into an AI-powered intelligence platform with actionable tools for founders and investors, you can become the definitive resource for anyone engaged with Vietnamese tech startups.

The roadmap balances quick wins (AI chatbot, market dashboard) with long-term platform evolution (API, community features, monetization). Start with Phase 1 to validate the approach, gather user feedback, and build momentum.

**The key insight:** Your data is the moat. 249 hand-cleaned companies + 80 VCs + industry knowledge = an asset that generic platforms can't replicate. Focus on making this data more accessible, actionable, and intelligent.

---

**Ready to build?** Let's start with the AI chatbot and market overview dashboard. These two features alone will transform the site from a directory into a dynamic platform. 🚀

---

*Roadmap prepared by Claude Code based on comprehensive research of the Vietnam startup ecosystem as of January 2026. This is a living document and should be updated quarterly based on ecosystem developments and user feedback.*
