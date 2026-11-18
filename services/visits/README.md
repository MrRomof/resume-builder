# GitHub Pages visitor counter — Cloudflare Workers + D1

Deployment-ready; **not yet deployed to a Cloudflare account**. The website stays
on GitHub Pages. Only this dependency-free ES module and SQLite-compatible D1
schema run on Cloudflare. No custom domain, website migration, KV, paid service,
frontend API key, or GitHub Actions secret is required.

## What is counted

- Views: accepted visible page loads. Browser reloads within five seconds are
  intentionally treated as one view. Later reloads add views, not unique users.
- Users: distinct browser IDs since the service was activated. A random UUID v4
  is stored in localStorage (`resume-visitor-v1`) on the GitHub Pages origin.
  No fingerprinting, cookies, IP-based identification, resume content or profile
  information is used. Different devices/profiles or cleared storage count again.
- If storage is blocked, the client only reads statistics; it does not invent a
  new visitor on each load. Background loads only read statistics as well.
- D1 stores an HMAC-SHA256 of each browser UUID, keyed by the Worker-only secret
  `VISITOR_SALT`. Keep that secret stable: rotating it starts new browser identities.
  Anonymous visitor hashes persist for lifetime uniqueness. Event UUIDs expire
  after 24 hours via a daily cron; lifetime totals are retained.
- Repeated calls caused by tab/language/render changes share a single client
  promise per document. Retrying the same event ID cannot increment views twice
  within its 24-hour retention period, even across Worker instances.

These are approximate browser counts, not verified people or an audit-grade
analytics system. There is no historical backfill. Visible labels remain Views /
Users (بازدید / کاربر), with the browser estimate explained in the tooltip.

## Deploy from your computer

Prerequisites: a free Cloudflare account, Node.js 22+, npm, and your checked-out
`release/pages` branch. Commands work in a terminal from the repository root.
Wrangler is a development/deployment tool only; no runtime npm dependencies are
added to the website. The rate-limiter binding requires Wrangler >= 4.36.0.

```sh
cd services/visits
npx wrangler@4 login
npx wrangler@4 d1 create resume-visits
```

The login command opens Cloudflare in your browser. Choose the intended account.
Copy the returned `database_id` into the DB binding in `wrangler.jsonc`. Keep
`database_name` equal to `resume-visits`. The ID is configuration, not a password.
Use an unused positive integer namespace_id for RATE_LIMITER on this account;
the supplied `10011` should not be shared with unrelated Workers.

```sh
npx wrangler@4 d1 execute resume-visits --remote --file=schema.sql
npx wrangler@4 deploy
npx wrangler@4 secret put VISITOR_SALT
```

For the last command, generate a fresh random value of at least 32 characters
(preferably 32 random bytes as 64 hex characters) with a password manager and
paste it into Wrangler's secret prompt. Do not commit the value or paste it into
chat. The Worker returns 503 until the secret, database, and rate-limiter binding
are configured. Secrets are deployed immediately by `secret put`.

Wrangler prints a URL such as:
`https://fourka-resume-visits.YOUR-SUBDOMAIN.workers.dev`.

In the repository root, set `analytics-config.json` to:

```json
{ "endpoint": "https://fourka-resume-visits.YOUR-SUBDOMAIN.workers.dev" }
```

Use the base HTTPS URL, without `/visits`, query parameters, credentials or tokens.
Commit and push the config to `release/pages`, the branch published by GitHub
Pages. The existing card then displays the real totals automatically. Until this
step, dashes and the inactive message are expected. Failed API requests also show
an unavailable message instead of fabricated totals; resume editing remains usable.

## Required Cloudflare configuration

`wrangler.jsonc` already supplies:

- DB: D1 binding, with the ID you created.
- ALLOWED_ORIGIN: `https://mrromof.github.io` (origins have no path/trailing slash).
  Keep the GitHub Pages site at `/resume-builder/`; GitHub Pages does not need to
  move. Change this variable only if the website's origin changes.
- RATE_LIMITER: 60 requests/minute per edge IP; approximate per Cloudflare location.
  The trusted edge IP is SHA256-hashed for this short-lived throttle only, not
  stored in D1 or used for uniqueness. Shared networks may share this allowance.
- Cron: daily at 03:17 UTC, deletes event IDs older than 24 hours.
- Worker observability disabled to avoid application request logging. Cloudflare
  still processes connection metadata according to its own policies.
- VISITOR_SALT: **Worker secret**, set separately as above. Not a browser API key.

The new `counter_*` tables do not overwrite any older prototype tables. Use a
fresh database for first deployment. If an earlier prototype had real traffic,
its totals need an explicit migration before claiming a continuous history.
Back up D1 before schema changes (`npx wrangler@4 d1 export resume-visits --remote
--output=backup.sql`); keep that export private. Never expose a reset/admin endpoint.

## API and security model

| Endpoint | Method | Behavior |
| --- | --- | --- |
| `/visits` | POST | JSON `{ "visitor": "UUID-v4", "event": "UUID-v4" }`; returns totals |
| `/stats` | GET | Returns `{ "views": 123, "visitors": 45 }`; never records a visit |
| both | OPTIONS | Exact-origin CORS preflight |

Browser calls use HTTPS, no cookies/credentials, no referrer, and exact-origin
CORS. Invalid paths/methods/payloads, extra fields, non-JSON bodies and bodies
larger than 512 bytes are rejected. Missing configuration fails closed. Known
bot/headless/preview user agents, prefetches and Cloudflare verified bots (when
that signal is available) are not recorded. Origin checks and these heuristics
are **not authentication**: a public write endpoint can still be spoofed by a
determined client. Per-IP throttling and burst/event deduplication reduce abuse;
this lightweight implementation does not claim to defeat distributed bots.
No administrative credentials or secrets exist in the frontend. Public totals
are intentionally readable by site visitors; all administration stays in
Cloudflare's authenticated dashboard/CLI. No account token is needed by visitors.

## Verify after deployment

1. Read the totals without incrementing them (replace the URL):

   ```sh
   curl -H "Origin: https://mrromof.github.io" https://YOUR-WORKER.workers.dev/stats
   ```

2. Open the GitHub Pages site in a normal browser. Both totals increase on its
   first accepted visit. Reload after at least five seconds: views increases,
   users stays fixed. Another browser profile increases users. A rapid reload
   within five seconds should leave both fixed.
3. Changing UI language or sidebar tabs does not record another visit. Confirm
   that no resume fields appear in the network payload; only two random IDs do.
4. Wrong Origin returns 403; excessive requests return 429; `/stats` never changes
   totals. `curl` or headless clients are deliberately excluded from POST counts.
5. To disable tracking, publish `{ "endpoint": "" }`; keep D1 if you want history.

Validated locally with Wrangler 4.165.0 `deploy --dry-run` (about 2 KB gzipped),
real SQLite tests, and browser tests using mocked API responses. No runtime
dependencies or frontend secrets are added. No Cloudflare account was provisioned.

Local tests (Node 22; no test dependencies):

```sh
node --experimental-sqlite --test tests/visits.test.mjs
```

Run that last command from the repository root. It tests real SQLite triggers and
transaction rollback, browser uniqueness, reload bursts, event replay, cleanup,
CORS, input limits, bots and failure states. Cloudflare edge/D1 deployment still
needs the live smoke checks above; local tests do not prove account provisioning.

## Free-plan capacity

Cloudflare currently lists Workers Free at 100,000 requests/day, 10 ms CPU per
invocation; D1 Free at 5 million rows read/day, 100,000 rows written/day and 5 GB
total storage (500 MB per database). Several rows/index entries are written per
accepted visit, so 100,000 written rows is **not** 100,000 visits. Preflights and
read-only stats also use Worker requests. Stay on Workers Free and monitor
Workers/D1 metrics; quota exhaustion can temporarily make counters unavailable.
This design uses indexed lookups and precomputed totals instead of scanning all
visitor rows on every request. No upgrade is required for normal small-site use.

Official references (reviewed 2026-11-18):
- https://developers.cloudflare.com/d1/get-started/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
