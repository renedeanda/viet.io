// Which kind of build this is. Cloudflare Workers Builds names the branch (WORKERS_CI_BRANCH), so any branch but
// the production one is a preview. Set PRODUCTION_BRANCH as a Cloudflare build variable if it is not `main`.
export function isPreviewBuild(env = process.env) {
  const branch = env.WORKERS_CI_BRANCH?.trim();
  return Boolean(branch) && branch !== (env.PRODUCTION_BRANCH?.trim() || "main");
}
