const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const BOT = /bot\b|crawler|spider|headless|lighthouse|pagespeed|preview|facebookexternalhit|curl\b|wget\b|python-requests/i;
const encoder = new TextEncoder();
async function digest(text) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)))].map(x => x.toString(16).padStart(2, '0')).join('');
}
async function visitorHash(id, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(salt), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(id.toLowerCase())))].map(x => x.toString(16).padStart(2, '0')).join('');
}
async function readSmallJson(request) {
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) throw new Error('type');
  if (Number(request.headers.get('Content-Length')) > 512) throw new Error('size');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('body');
  let size = 0, parts = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 512) { await reader.cancel(); throw new Error('size'); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = { 'Cache-Control': 'no-store', 'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff' };
    const reply = (body, status = 200, extra = {}) => Response.json(body, { status, headers: { ...headers, ...extra } });
    if (!env.ALLOWED_ORIGIN || origin !== env.ALLOWED_ORIGIN) return reply({ error: 'Forbidden origin' }, 403);
    Object.assign(headers, { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    const path = new URL(request.url).pathname;
    if (!['/visits', '/stats'].includes(path)) return reply({ error: 'Not found' }, 404);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (!(path === '/stats' && request.method === 'GET') && !(path === '/visits' && request.method === 'POST')) return reply({ error: 'Method not allowed' }, 405);
    try {
      // Trusted edge IP is used only for short-lived throttling; never in D1 or a visitor ID.
      if (!env.RATE_LIMITER || !env.DB || !env.VISITOR_SALT || env.VISITOR_SALT.length < 32) return reply({ error: 'Service not configured' }, 503);
      const ipKey = await digest(request.headers.get('CF-Connecting-IP') || 'unknown');
      if (!(await env.RATE_LIMITER.limit({ key: ipKey })).success) return reply({ error: 'Too many requests' }, 429, { 'Retry-After': '60' });
      const stats = async () => reply(await env.DB.prepare('SELECT views, visitors FROM counter_totals WHERE id=1').first());
      if (path === '/stats') return await stats();
      const ua = request.headers.get('User-Agent') || '';
      if (!ua || BOT.test(ua) || request.cf?.botManagement?.verifiedBot || /prefetch|prerender/i.test(request.headers.get('Sec-Purpose') || request.headers.get('Purpose') || '')) {
        return new Response(null, { status: 204, headers });
      }
      let body;
      try { body = await readSmallJson(request); } catch { return reply({ error: 'Expected a small JSON request' }, 400); }
      if (!body || typeof body !== 'object' || !UUID.test(body.visitor || '') || !UUID.test(body.event || '') || Object.keys(body).some(k => !['visitor', 'event'].includes(k))) return reply({ error: 'Invalid visit' }, 400);
      const visitor = await visitorHash(body.visitor, env.VISITOR_SALT);
      const now = Date.now();
      // One transaction; triggers run only if a new, non-burst event was inserted.
      const result = await env.DB.batch([
        env.DB.prepare(`INSERT OR IGNORE INTO counter_events(id, visitor, created_at)
          SELECT ?, ?, ? WHERE NOT EXISTS
          (SELECT 1 FROM counter_visitors WHERE id = ? AND last_seen > ?)`)
          .bind(body.event.toLowerCase(), visitor, now, visitor, now - 5000),
        env.DB.prepare('SELECT views, visitors FROM counter_totals WHERE id=1')
      ]);
      return reply(result[1].results[0]);
    } catch { return reply({ error: 'Counter unavailable' }, 503); }
  },
  async scheduled(_controller, env) {
    // Keep deduplication IDs for 24 hours; lifetime totals and visitor hashes remain.
    await env.DB.prepare('DELETE FROM counter_events WHERE created_at < ?').bind(Date.now() - 86400000).run();
  }
};
