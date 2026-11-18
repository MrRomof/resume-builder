import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../services/visits/worker.mjs';
test('counts loads, deduplicates retries, and counts unique browsers across requests', async () => {
 const db = new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('../services/visits/schema.sql', import.meta.url),'utf8'));
 const env={ALLOWED_ORIGIN:'https://mrromof.github.io',DB:{prepare(sql){return {sql,args:[],bind(...args){this.args=args;return this;}}},async batch(items){db.exec('BEGIN');try{const result=items.map(x=>({results:db.prepare(x.sql).all(...x.args)}));db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}}};
 const visitor='11111111-1111-4111-8111-111111111111';
 async function post(event,who=visitor,origin=env.ALLOWED_ORIGIN){return worker.fetch(new Request('https://counter.example',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({visitor:who,event})}),env);}
 const one='22222222-2222-4222-8222-222222222222',two='33333333-3333-4333-8333-333333333333';
 assert.deepEqual(await (await post(one)).json(),{views:1,visitors:1});
 assert.deepEqual(await (await post(one)).json(),{views:1,visitors:1});
 assert.deepEqual(await (await post(two)).json(),{views:2,visitors:1});
 assert.deepEqual(await (await post('44444444-4444-4444-8444-444444444444','55555555-5555-4555-8555-555555555555')).json(),{views:3,visitors:2});
 assert.equal((await post('invalid')).status,400);
 assert.equal((await post(one,visitor,'https://other.example')).status,403);
 db.close();
});
