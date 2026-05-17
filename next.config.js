module.exports = {
    output: 'export',
    images: { unoptimized: true },
    webpack: function (config, { isServer }) {
        if (isServer) {
            import('./util/generateSiteMap.mjs')
        }
        return config
    }
}