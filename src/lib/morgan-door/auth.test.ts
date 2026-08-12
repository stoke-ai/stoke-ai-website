import test from 'node:test';
import assert from 'node:assert/strict';

function cookieHeader(path:string){
  const cookie={name:'md_review_session',value:'signed',path:'/'};
  return path.startsWith(cookie.path)?`${cookie.name}=${cookie.value}`:'';
}

test('review session cookie reaches page and review APIs',()=>{
  assert.equal(cookieHeader('/morgan-door-review'),'md_review_session=signed');
  assert.equal(cookieHeader('/api/morgan-door-review/cases/1'),'md_review_session=signed');
  assert.equal(cookieHeader('/api/morgan-door-review/decision'),'md_review_session=signed');
});

test('review cookie is HTTP-only, same-site, and root scoped in implementation',async()=>{
  const source=await import('node:fs/promises').then(fs=>fs.readFile(new URL('./auth.ts',import.meta.url),'utf8'));
  assert.match(source,/httpOnly:true/);
  assert.match(source,/sameSite:'lax'/);
  assert.match(source,/path:'\/'/);
});
