# Optional global visit counters (not deployed)

The static site displays a statistics card with dashes until analytics-config.json has an HTTPS endpoint. Successful responses show Views on the left and Users (distinct browsers) on the right in both languages.
This optional Cloudflare Worker + D1 implementation is ready for owner setup.
No resume content, name, email, or IP is written to the database. A random browser
ID is stored locally and sent to the endpoint. The hosting provider may keep its
own request logs. These are approximate unique browsers, not verified people;
storage clearing, devices, bots, and blocking affect accuracy. Visits count page
loads, including reloads, after deployment. There is no historical backfill.

From this directory, with Wrangler installed and your Cloudflare login:

1. `wrangler d1 create resume-visits`
2. Put the returned database_id in wrangler.jsonc.
3. `wrangler d1 execute resume-visits --remote --file=schema.sql`
4. `wrangler deploy`
5. Set the deployed HTTPS Worker URL as endpoint in ../../analytics-config.json.
6. Publish that config with the site; check two browsers and a reload.

Event IDs deduplicate retries for 24 hours. A database trigger increments the
counter transactionally only for new events. Browser IDs are retained for the
lifetime count. Set an appropriate rate limit at the provider before exposing
this endpoint; CORS is not bot protection. No API secret belongs in the static
config. The schema/worker have local tests; cloud deployment is not verified.

Reference: https://developers.cloudflare.com/d1/get-started/
