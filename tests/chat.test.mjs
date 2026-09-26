import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import handler from '../api/chat.ts';

const call = async (question, options = {}) => {
  const res = { code: 200, headers: {}, setHeader(name,value){this.headers[name]=value;}, status(code){this.code=code;return this;}, json(body){this.body=body;return this;} };
  await handler({method: options.method ?? 'POST', body:{question}, headers:{}, socket:{remoteAddress:options.ip ?? 'test'}},res);
  return res;
};

test('chat validates requests, handles provider failures, and limits repeated calls', async () => {
  const originalKey=process.env.AMAZON_API_KEY;
  const originalModel=process.env.AMAZON_MODEL;
  const originalRegion=process.env.AMAZON_REGION;
  delete process.env.AMAZON_API_KEY;
  delete process.env.AMAZON_MODEL;
  delete process.env.AMAZON_REGION;
  assert.equal((await call('hello',{method:'GET'})).code,405);
  assert.equal((await call('')).code,400);
  assert.equal((await call('a'.repeat(801))).code,400);
  assert.equal((await call('hello')).code,503);
  process.env.AMAZON_API_KEY='test-placeholder';
  let calls=0;let fail=false;let empty=false;let quota=false;
  const mocked=mock.method(globalThis,'fetch',async (url,init)=>{
    calls++;
    if(quota)return new Response(JSON.stringify({error:{message:'private-quota-detail',code:429}}),{status:429,headers:{'content-type':'application/json'}});
    if(fail)return new Response(JSON.stringify({error:{message:'private-provider-detail',type:'server_error',code:'test_failure'}}),{status:500,headers:{'content-type':'application/json'}});
    assert.equal(String(url),`https://bedrock-mantle.${process.env.AMAZON_REGION || 'us-east-1'}.api.aws/v1/chat/completions`);
    assert.equal(new Headers(init.headers).get('authorization'),'Bearer test-placeholder');
    const payload=JSON.parse(init.body);
    assert.equal(payload.model,process.env.AMAZON_MODEL || 'qwen.qwen3-235b-a22b-2507');
    assert.equal(payload.max_tokens,700);
    assert.equal(payload.messages[0].role,'system');
    assert.match(payload.messages[0].content,/Strictly Adhere to Context/);
    assert.equal(payload.messages[1].role,'user');
    const input=payload.messages[1].content;
    assert.ok(!input.includes('data:image/'));
    assert.ok(input.includes('Silent Terror'));
    assert.ok(input.includes('Team Lead'));
    return new Response(JSON.stringify({id:'test',object:'chat.completion',choices:empty?[]:[{index:0,message:{role:'assistant',content:'Test answer [current-portfolio]'},finish_reason:'stop'}]}),{headers:{'content-type':'application/json'}});
  });
  try {
    const ok=await call('What are Andy skills?');assert.equal(ok.code,200);assert.match(ok.body.answer,/Test answer/);assert.equal(ok.headers['Cache-Control'],'no-store');assert.equal(calls,1);
    process.env.AMAZON_MODEL='test.model';assert.equal((await call('custom',{ip:'custom'})).code,200);delete process.env.AMAZON_MODEL;
    process.env.AMAZON_REGION='us-west-2';assert.equal((await call('region',{ip:'region'})).code,200);delete process.env.AMAZON_REGION;
    empty=true;assert.equal((await call('empty',{ip:'empty'})).code,502);empty=false;
    fail=true;const failure=await call('error',{ip:'failure'});assert.equal(failure.code,500);assert.ok(!JSON.stringify(failure.body).includes('private-provider-detail'));fail=false;
    quota=true;const exhausted=await call('quota',{ip:'quota'});assert.equal(exhausted.code,429);assert.equal(exhausted.headers['Retry-After'],'60');assert.ok(!JSON.stringify(exhausted.body).includes('private-quota-detail'));quota=false;
    for(let i=0;i<11;i++)await call('repeat');
    const before=calls;const limited=await call('repeat');assert.equal(limited.code,429);assert.equal(limited.headers['Retry-After'],'60');assert.equal(calls,before);
  } finally {
    mocked.mock.restore();
    if(originalKey===undefined)delete process.env.AMAZON_API_KEY;else process.env.AMAZON_API_KEY=originalKey;
    if(originalModel===undefined)delete process.env.AMAZON_MODEL;else process.env.AMAZON_MODEL=originalModel;
    if(originalRegion===undefined)delete process.env.AMAZON_REGION;else process.env.AMAZON_REGION=originalRegion;
  }
});
