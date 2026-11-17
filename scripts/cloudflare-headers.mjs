// Cloudflare deploy step: translate vercel.json headers and redirects into out/_headers and out/_redirects, so
// vercel.json stays the one source of truth and the site serves the same responses on either host. Runs only in
// `npm run deploy:cloudflare` / `preview:cloudflare` (after `npm run build`); on Vercel the files would be served as
// plain downloads. Anything it cannot translate exactly fails the deploy rather than shipping a site that behaves
// differently. With --preview it also marks every page noindex, so a preview URL never competes with the real site.
import { readFile, rm, stat, writeFile } from "node:fs/promises";

const OUT = "out";
const preview = process.argv.includes("--preview");
const fail = (message) => {
  console.error(`Cloudflare config translation failed: ${message}`);
  process.exit(1);
};

if (!(await stat(OUT).catch(() => null))?.isDirectory()) fail(`${OUT}/ is missing; run \`npm run build\` first`);

let config = {};
try {
  config = JSON.parse(await readFile("vercel.json", "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") fail(`vercel.json is not valid JSON (${error.message})`);
}

const untranslatable = ["rewrites", "routes", "cleanUrls", "trailingSlash"].filter((key) => key in config);
if (untranslatable.length) fail(`vercel.json uses ${untranslatable.join(", ")}, which this script does not translate`);

// One path segment is a literal, a `:name` placeholder or a `:name(a|b)` choice (expanded into one rule per
// alternative); the last may be a catch-all (`:name*` or `(.*)`).
const LITERAL = /^[A-Za-z0-9._~%@!$&'+,;=-]*$/;
function translate(source, rule) {
  if (!source.startsWith("/")) fail(`${rule}: source ${source} must start with /`);
  const segments = source.slice(1).split("/");
  let variants = [{ path: [], values: {} }];
  let catchAll = null;
  segments.forEach((segment, index) => {
    const last = index === segments.length - 1;
    const tail = segment.match(/^:([A-Za-z_]\w*)\*$/);
    const choice = segment.match(/^:([A-Za-z_]\w*)\(([A-Za-z0-9._~-]+(?:\|[A-Za-z0-9._~-]+)*)\)$/);
    if (last && (segment === "(.*)" || tail)) {
      catchAll = tail ? tail[1] : "";
      variants = variants.map((v) => ({ ...v, path: [...v.path, "*"] }));
    } else if (choice) {
      variants = variants.flatMap((v) =>
        choice[2].split("|").map((value) => ({ path: [...v.path, value], values: { ...v.values, [choice[1]]: value } })),
      );
    } else if (/^:[A-Za-z_]\w*$/.test(segment) || LITERAL.test(segment)) {
      variants = variants.map((v) => ({ ...v, path: [...v.path, segment] }));
    } else {
      fail(`${rule}: cannot translate source ${source} exactly`);
    }
  });
  return variants.map((v) => ({ path: `/${v.path.join("/")}`, values: v.values, catchAll }));
}

const headerBlocks = (config.headers ?? []).flatMap((rule, index) => {
  const name = `headers[${index}]`;
  if (rule.has || rule.missing) fail(`${name}: has/missing conditions are not translatable`);
  const lines = rule.headers.map(({ key, value }) => {
    if (/[\r\n]/.test(value)) fail(`${name}: header ${key} contains a line break`);
    return `  ${key}: ${value}`;
  });
  return translate(rule.source, name).map(({ path }) => [path, ...lines].join("\n"));
});

// Host- and query-conditioned redirects have no _redirects equivalent: they become Cloudflare Redirect Rules in the
// dashboard (the apex → www rule is one), so they are listed rather than dropped silently.
const dashboardRules = [];
const redirectLines = (config.redirects ?? []).flatMap((rule, index) => {
  const name = `redirects[${index}]`;
  if (rule.has || rule.missing) {
    dashboardRules.push(`${name}: ${JSON.stringify(rule)}`);
    return [];
  }
  // Same status codes Vercel sends: 308 for permanent, 307 otherwise.
  const status = rule.statusCode ?? (rule.permanent === false ? 307 : 308);
  return translate(rule.source, name).map(({ path, values, catchAll }) => {
    let destination = rule.destination;
    for (const [key, value] of Object.entries(values)) destination = destination.replaceAll(`:${key}`, value);
    if (catchAll) destination = destination.replaceAll(`:${catchAll}*`, ":splat").replaceAll(`:${catchAll}`, ":splat");
    else if (catchAll === "" && destination.includes("$1")) destination = destination.replaceAll("$1", ":splat");
    return `${path} ${destination} ${status}`;
  });
});
// Cloudflare requires static rules before dynamic ones (`*` or `:placeholder`); order within each group is kept.
const isDynamic = (line) => /[*:]/.test(line.split(" ")[0]);
redirectLines.sort((a, b) => isDynamic(a) - isDynamic(b));

if (preview) headerBlocks.push("/*\n  X-Robots-Tag: noindex");

for (const [file, body] of [["_headers", headerBlocks.join("\n\n")], ["_redirects", redirectLines.join("\n")]]) {
  const target = `${OUT}/${file}`;
  if (body) {
    await writeFile(target, `${body}\n`);
    console.log(`Wrote ${target}${preview && file === "_headers" ? " (preview: noindex)" : " from vercel.json"}`);
  } else {
    await rm(target, { force: true });
  }
}
if (!headerBlocks.length && !redirectLines.length) console.log("vercel.json has no headers or redirects to carry over");
if (dashboardRules.length) {
  console.log("Set these as Cloudflare Redirect Rules (Rules → Redirect Rules); _redirects cannot match host or query:");
  for (const rule of dashboardRules) console.log(`  ${rule}`);
}
