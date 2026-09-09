import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import handler from '../api/chat.ts';

const call = async (question, options = {}) => {
  const res = { code: 200, headers: {}, setHeader(name,value){this.headers[name]=value;}, status(code){this.code=code;return this;}, json(body){this.body=body;return this;} };
  await handler({method: options.method ?? 'POST', body:{question}, headers:{}, socket:{remoteAddress:options.ip ?? 'test'}},res);
  return res;
};

test('chat validates requests, handles provider failures, and limits repeated calls', async () => {
  const originalKey=process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  assert.equal((await call('hello',{method:'GET'})).code,405);
  assert.equal((await call('')).code,400);
  assert.equal((await call('a'.repeat(801))).code,400);
  assert.equal((await call('hello')).code,503);
  process.env.OPENAI_API_KEY='test-placeholder';
  let calls=0;let fail=false;let empty=false;
  const mocked=mock.method(globalThis,'fetch',async (url,init)=>{
    calls++;
    if(fail)return new Response(JSON.stringify({error:{message:'private-provider-detail',type:'server_error',code:'test_failure'}}),{status:500,headers:{'content-type':'application/json'}});
    if(String(url).endsWith('/embeddings')) return new Response(JSON.stringify({data:[{embedding:Array(3072).fill(0.01),index:0}],model:'text-embedding-3-large'}),{headers:{'content-type':'application/json'}});
    const payload=JSON.parse(init.body);
    assert.equal(payload.store,false);
    assert.ok(payload.input.includes('Silent Terror'));
    assert.ok(payload.input.includes('Team Lead'));
    return new Response(JSON.stringify({id:'test',object:'response',status:'completed',output:empty?[]:[{type:'message',role:'assistant',content:[{type:'output_text',text:'Test answer [current-portfolio]',annotations:[]}]}]}),{headers:{'content-type':'application/json'}});
  });
  try {
    const ok=await call('What are Andy skills?');assert.equal(ok.code,200);assert.match(ok.body.answer,/Test answer/);assert.equal(ok.headers['Cache-Control'],'no-store');assert.equal(calls,2);
    empty=true;assert.equal((await call('empty',{ip:'empty'})).code,502);empty=false;
    fail=true;const failure=await call('error',{ip:'failure'});assert.equal(failure.code,500);assert.ok(!JSON.stringify(failure.body).includes('private-provider-detail'));fail=false;
    for(let i=0;i<11;i++)await call('repeat');
    const before=calls;const limited=await call('repeat');assert.equal(limited.code,429);assert.equal(limited.headers['Retry-After'],'60');assert.equal(calls,before);
  } finally { mocked.mock.restore();if(originalKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=originalKey; }
});
