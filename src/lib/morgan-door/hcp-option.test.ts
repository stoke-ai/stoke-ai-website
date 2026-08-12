import test from 'node:test';import assert from 'node:assert/strict';import{selectHcpEstimateOptionUrl}from './hcp-option.ts';
const options=[
 {id:'est_8484f7e9054f47428633a047bcde7588',status:'deleted',total_amount:1372500},
 {id:'est_f222a3ae31ef48c28cdaf62988056f88',status:'submitted for signoff',total_amount:1540500},
 {id:'est_7ae5ded091454a068023eae6d3ba99d9',status:'scheduled',total_amount:1372500},
];
test('selects Larry displayed amount and excludes deleted option',()=>assert.equal(selectHcpEstimateOptionUrl(options,15405),'https://pro.housecallpro.com/app/estimates/est_f222a3ae31ef48c28cdaf62988056f88'));
test('fails closed when amount is ambiguous',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'est_11111111111111111111111111111111',total_amount:100},{id:'est_22222222222222222222222222222222',total_amount:100}],1),undefined));
test('rejects non-HCP option identifiers',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'https://evil.example',total_amount:100}],1),undefined));
test('fails closed without a displayed amount',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'est_11111111111111111111111111111111',total_amount:100}],undefined),undefined));
test('rejects uppercase option identifiers',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'est_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',total_amount:100}],1),undefined));
test('rejects malformed option amounts including null',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'est_11111111111111111111111111111111',total_amount:null}],0),undefined));
