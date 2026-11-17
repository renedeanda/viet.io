// Which kind of build this is, on either host. Vercel names previews in VERCEL_ENV; Cloudflare Workers Builds
// only names the branch (WORKERS_CI_BRANCH), so any branch but the production one counts as a preview there.
// Set PRODUCTION_BRANCH as a Cloudflare build variable if the site's production branch is not `main`.
export function isPreviewBuild(env = process.env) {
  if (env.VERCEL_ENV?.trim() === "preview") return true;
  const branch = env.WORKERS_CI_BRANCH?.trim();
  return Boolean(branch) && branch !== (env.PRODUCTION_BRANCH?.trim() || "main");
}
