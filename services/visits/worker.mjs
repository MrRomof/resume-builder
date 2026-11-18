const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin !== env.ALLOWED_ORIGIN) return new Response('Forbidden', { status: 403 });
    const headers = { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-store', 'Vary': 'Origin' };
    const reply = (data, status = 200) => Response.json(data, { status, headers });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
    try {
      if (Number(request.headers.get('Content-Length')) > 1024) return reply({ error: 'Too large' }, 413);
      const text = await request.text();
      if (text.length > 1024) return reply({ error: 'Too large' }, 413);
      const { visitor, event } = JSON.parse(text);
      if (!uuid.test(event || '') || (visitor !== null && !uuid.test(visitor || ''))) return reply({ error: 'Invalid request' }, 400);
      const statements = [env.DB.prepare('INSERT OR IGNORE INTO events(id, created_at) VALUES (?, ?)').bind(event, Date.now())];
      if (visitor) statements.push(env.DB.prepare('INSERT OR IGNORE INTO visitors(id) VALUES (?)').bind(visitor));
      statements.push(env.DB.prepare('DELETE FROM events WHERE created_at < ?').bind(Date.now() - 86400000));
      statements.push(env.DB.prepare('SELECT views, (SELECT COUNT(*) FROM visitors) AS visitors FROM totals WHERE id=1'));
      const results = await env.DB.batch(statements);
      return reply(results.at(-1).results[0]);
    } catch { return reply({ error: 'Counter unavailable' }, 503); }
  }
};
