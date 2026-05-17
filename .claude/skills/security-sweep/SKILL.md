---
name: security-sweep
description: Sweep dependencies for critical/high (and optionally moderate) CVEs and patch them with direct version bumps + npm `overrides`, verified against a fresh lockfile and a passing build. Use when responding to Dependabot alerts, before a security-sensitive release, or after a long gap since the last `npm audit`.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: [high|all]
model: opus
---

# Security Sweep

Take a Node.js project's `npm audit` down to zero critical/high (default) or zero of every severity (`all`), using a deterministic, lockfile-verified workflow that doesn't break the build.

## Step 0 — Scope

If the argument is `all`, target moderate too. Otherwise target critical + high. Leave `low`/`info` alone unless explicitly asked.

## Step 1 — Baseline

Run both full and production-only audits — production-only matters most for runtime risk:

```bash
npm audit --json | jq '.metadata.vulnerabilities'
npm audit --omit=dev --json | jq '.metadata.vulnerabilities'
```

For each finding at or above the threshold, capture name, severity, range, `isDirect`, `via`, `nodes`:

```bash
npm audit --json | jq '.vulnerabilities | to_entries[]
  | select(.value.severity == "critical" or .value.severity == "high")
  | {name: .key, severity: .value.severity, isDirect: .value.isDirect,
     range: .value.range, fixAvailable: .value.fixAvailable}'
```

For each, also pull `.via` to see the actual advisory titles and ranges — multiple CVEs often pile up on one package.

## Step 2 — Fix by source

### Direct deps (`isDirect: true`)
Bump the version range in `package.json` to the lowest safe range. Use `npm view <pkg> versions --json` to confirm latest patched. Keep the project's existing pinning convention (caret vs. exact).

### Transitive deps (`isDirect: false`)
1. Trace the chain: `npm ls <pkg>`.
2. If the immediate parent has a newer version that ships a safer transitive, bump the parent — cleanest fix.
3. Otherwise add a flat override:
   ```json
   "overrides": { "pkg": "^safeVersion" }
   ```
4. When multiple major lines are vulnerable (e.g. `<3.1.4 || 9.0.0-9.0.6`) AND consumers genuinely need different majors, use parent-scoped overrides instead of forcing one major:
   ```json
   "overrides": {
     "parent-pkg": { "vulnerable-dep": "^safeVersion" }
   }
   ```
5. **EOVERRIDE gotcha**: if the same package is BOTH a direct dep and a transitive (very common with `postcss`, `ajv`), an override on the package fails install unless you also bump the direct dep to a range overlapping the override target.

### Bundled deps that ignore flat overrides
Some packages — most notably `next` — pin transitive deps to exact versions inside their own `node_modules`. A flat `"overrides": { "postcss": "^8.5.14" }` may show "overridden" in `npm ls` but the bundled copy stays pinned, so audit keeps flagging it. Force it with a parent-scoped override:
```json
"overrides": { "next": { "postcss": "^8.5.14" } }
```
This is the only override form that reaches inside `node_modules/next/node_modules/`.

## Step 3 — Reinstall cleanly

Overrides only take effect on a fresh resolution:

```bash
rm -f package-lock.json
npm install --no-audit --no-fund
```

If the install fails (especially `EOVERRIDE`), no lockfile is written. Fix the conflict and try again. Don't trust a "clean" audit run against a missing lockfile — `npm audit` silently returns `{}` for vulnerabilities when there is no lockfile.

If the project keeps both `package-lock.json` and `yarn.lock` (e.g. legacy mixed setup), regenerate both:
```bash
yarn install --ignore-scripts
```

## Step 4 — Re-audit and iterate

```bash
npm audit --json | jq '.metadata.vulnerabilities'
```

If anything is still above threshold:
- Run `npm ls <pkg>` and look for the version still flagged "deduped" or without "overridden" beside it.
- That's where the next override needs to go (most often a parent-scoped one).
- Avoid `npm audit fix --force` — it can downgrade or major-bump silently.

## Step 5 — Build

```bash
npm run build
```

A green audit with a broken build is worse than the original CVE. Build must pass. If a test script exists, run it too.

## Step 6 — Commit, scope-limited

Stage ONLY the security-relevant files:
- `package.json`
- `package-lock.json` (and `yarn.lock` if present)
- `next-env.d.ts` only if the Next bump auto-regenerated it

Do NOT stage build artifacts, optimized images, generated sitemaps, or anything else the build script mutates. If `git status` shows hundreds of unrelated changes, run the matching `git checkout -- <path>` to revert them before staging.

Commit message format:
- For specific CVE: `fix(deps): bump <pkg> to <version> to patch <CVE-id>`
- For cleanup pass: `chore(deps): clear remaining critical/high CVEs`

Push to the dev branch — never directly to `main`/`master`.

## Step 7 — Report to the user

Summarize:
- Counts before/after, both full and production-only.
- Each direct bump with the advisory it patches.
- Each override with the advisory it patches.
- Residual issues that can't be cleared (e.g. unpatched advisory, parent dep needs a breaking bump). Surface these — don't silently accept them.

## Common gotchas

- **`npm audit fix` is unpredictable** — prefer manual bumps + overrides.
- **`npm audit fix --force` can break majors** — never run without a rollback plan.
- **`package@<X.Y.Z` conditional override syntax is unreliable** in npm 10 — prefer flat or parent-scoped overrides.
- **`isDirect: false` does not mean "low risk"** — a transitive in production code is just as exploitable.
- **`next` bundles its own copy of `postcss` (and others)** pinned to exact versions. Always use the `"next": { ... }` parent-scoped form for those.
- **The advisory may have NO fix** (e.g. monaco-editor's open-ended range). Document and stop — don't force-bump a major to "fix" it.
- **Production-only matters more** — `--omit=dev` filters out devDeps that don't ship to users.
- **`package-lock.json` missing → audit returns empty** → false sense of safety. Always verify lockfile is present after install.
- **The Vercel preview build is not enough** — `npm run build` locally catches the actual install + build chain before push.
