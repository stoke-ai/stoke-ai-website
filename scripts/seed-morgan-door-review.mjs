#!/usr/bin/env node
import fs from 'node:fs';import postgres from 'postgres';
const file=process.argv[2];if(!file||!process.env.DATABASE_URL)throw new Error('Usage: DATABASE_URL=... node scripts/seed-morgan-door-review.mjs cases.json');
const cases=JSON.parse(fs.readFileSync(file,'utf8'));const sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1});
await sql`create table if not exists morgan_door_review_cases(id text primary key,queue text not null,sort_order integer not null,payload jsonb not null,source_checked_at timestamptz not null,updated_at timestamptz not null)`;
await sql`create table if not exists morgan_door_review_decisions(case_id text primary key references morgan_door_review_cases(id),answer text not null,note text,actor text not null,version integer not null default 1,answered_at timestamptz not null)`;
await sql`create index if not exists morgan_door_review_queue_idx on morgan_door_review_cases(queue,sort_order)`;
for(const item of cases){const{sourceCheckedAt,...payload}=item;await sql`insert into morgan_door_review_cases(id,queue,sort_order,payload,source_checked_at,updated_at) values(${item.id},${item.queue},${item.sortOrder},${sql.json(payload)},${sourceCheckedAt},now()) on conflict(id) do update set queue=excluded.queue,sort_order=excluded.sort_order,payload=excluded.payload,source_checked_at=excluded.source_checked_at,updated_at=now()`;}
console.log(JSON.stringify({seeded:cases.length,reconciliation:cases.filter(x=>x.queue==='reconciliation').length,cleanup:cases.filter(x=>x.queue==='cleanup').length}));await sql.end();
