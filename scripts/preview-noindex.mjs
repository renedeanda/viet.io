// Worker Previews only (`npm run preview:cloudflare`): mark every page noindex so a preview URL never competes with
// the real site in search. Runs after `npm run build`; the production deploy never calls it.
import { appendFile, stat } from "node:fs/promises";

const file = "out/_headers";
if (!(await stat("out").catch(() => null))?.isDirectory()) {
  console.error("out/ is missing; run `npm run build` first");
  process.exit(1);
}
await appendFile(file, "\n/*\n  X-Robots-Tag: noindex\n");
console.log(`Marked ${file} noindex for this preview`);
