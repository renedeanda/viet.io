import { isPreviewBuild } from './scripts/lib/build-env.mjs'

// The site's long-standing Google Analytics ID, used when NEXT_PUBLIC_GA_MEASUREMENT_ID is not set.
const DEFAULT_GA_MEASUREMENT_ID = 'UA-109309630-7'

/** @type {import('next').NextConfig} */
export default {
    output: 'export',
    images: {
        unoptimized: true,
        qualities: [60]
    },
    // NEXT_PUBLIC_GA_MEASUREMENT_ID is the variable name every portfolio site uses. Preview builds (Vercel or
    // Cloudflare) ship without Google Analytics, so they never count as visits.
    env: {
        // This repository's production branch is `master` (isPreviewBuild assumes `main` otherwise).
        NEXT_PUBLIC_GA_MEASUREMENT_ID: isPreviewBuild({ ...process.env, PRODUCTION_BRANCH: process.env.PRODUCTION_BRANCH || 'master' })
            ? ''
            : (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || DEFAULT_GA_MEASUREMENT_ID),
    },
}
