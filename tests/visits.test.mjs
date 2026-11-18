import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../services/visits/worker.mjs';
const a='11111111-1111-4111-8111-111111111111', b='22222222-2222-4222-8222-222222222222';
const e1='33333333-3333-4333-8333-333333333333',e2='44444444-4444-4444-8444-444444444444',e3='55555555-5555-4555-8555-555555555555';
function fixture() {
 const db=new DatabaseSync(':memory:'); db.exec(readFileSync(new URL('../services/visits/schema.sql',import.meta.url),'utf8'));
 const env={ALLOWED_ORIGIN:'https://mrromof.github.io',VISITOR_SALT:'a'.repeat(64),RATE_LIMITER:{async limit(){return {success:true};}},DB:{prepare(sql){return {args:[],bind(...args){this.args=args;return this;},async first(){return db.prepare(sql).get(...this.args);},async run(){return db.prepare(sql).run(...this.args);},sql};},async batch(items){db.exec('BEGIN');try{const r=items.map(x=>({results:db.prepare(x.sql).all(...x.args)}));db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}}}};
 const req=(path='/visits',body={visitor:a,event:e1},headers={},method='POST')=>worker.fetch(new Request('https://counter.test'+path,{method,headers:{Origin:env.ALLOWED_ORIGIN,'Content-Type':'application/json','User-Agent':'Mozilla/5.0','CF-Connecting-IP':'192.0.2.1',...headers},...(method==='POST'?{body:JSON.stringify(body)}:{})}),env);
 return {db,env,req};
}
test('persistent totals, unique browsers, burst suppression, retry IDs and cleanup',async()=>{
 const {db,env,req}=fixture();
 assert.deepEqual(await (await req()).json(),{views:1,visitors:1});
 assert.deepEqual(await (await req('/visits',{visitor:a,event:e2})).json(),{views:1,visitors:1});
 db.exec('UPDATE counter_visitors SET last_seen = 0');
 assert.deepEqual(await (await req()).json(),{views:1,visitors:1});
 assert.deepEqual(await (await req('/visits',{visitor:a,event:e2})).json(),{views:2,visitors:1});
 assert.deepEqual(await (await req('/visits',{visitor:b,event:e3})).json(),{views:3,visitors:2});
 // Replaying an existing event with a different browser cannot create a new user.
 assert.deepEqual(await (await req('/visits',{visitor:'66666666-6666-4666-8666-666666666666',event:e3})).json(),{views:3,visitors:2});
 const rows=db.prepare('SELECT * FROM counter_visitors').all();assert.equal(rows[0].id.length,64);assert.ok(!JSON.stringify(rows).includes(a));
 db.exec('UPDATE counter_events SET created_at=0');await worker.scheduled(null,env);
 assert.equal(db.prepare('SELECT count(*) AS n FROM counter_events').get().n,0);
 assert.deepEqual(await (await req('/stats',null,{},'GET')).json(),{views:3,visitors:2});db.close();
});
test('origins, methods, validation, bots, preflight, rate limits and fail closed',async()=>{
 const {db,env,req}=fixture();
 assert.equal((await req('/stats',null,{},'GET')).status,200);
 assert.equal((await req('/visits',null,{},'OPTIONS')).status,204);
 assert.equal((await req('/visits',undefined,{Origin:'https://evil.example'})).status,403);
 assert.equal((await req('/other')).status,404);
 assert.equal((await req('/stats')).status,405);
 for(const headers of [{'User-Agent':'Googlebot'},{'User-Agent':'Mozilla HeadlessChrome'},{'Sec-Purpose':'prefetch'},{'User-Agent':''}]) assert.equal((await req('/visits',undefined,headers)).status,204);
 for(const body of [null,{}, {visitor:a,event:'bad'},{visitor:a,event:e1,resume:'personal data'},{visitor:null,event:e1}]) assert.equal((await req('/visits',body)).status,400);
 assert.equal((await req('/visits',{visitor:a,event:e1},{'Content-Type':'text/plain'})).status,400);
 assert.equal((await req('/visits',{visitor:a,event:e1,padding:'x'.repeat(600)})).status,400);
 assert.deepEqual(await (await req('/stats',null,{},'GET')).json(),{views:0,visitors:0});
 env.RATE_LIMITER.limit=async()=>({success:false});const limited=await req();assert.equal(limited.status,429);assert.equal(limited.headers.get('Retry-After'),'60');
 delete env.RATE_LIMITER;assert.equal((await req()).status,503);db.close();
});
test('transaction failure rolls back totals and browser insertion',async()=>{
 const {db,env,req}=fixture();db.exec(`CREATE TRIGGER fail_counter BEFORE UPDATE ON counter_totals BEGIN SELECT RAISE(ABORT, 'fail'); END;`);
 assert.equal((await req()).status,503);assert.equal(db.prepare('SELECT count(*) AS n FROM counter_events').get().n,0);assert.equal(db.prepare('SELECT count(*) AS n FROM counter_visitors').get().n,0);db.close();
});
