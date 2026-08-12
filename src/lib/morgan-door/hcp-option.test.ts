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
test('opens a converted estimate through its verified job record route',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'job_46c37bdcdfbc45fa8634658bdbbc0a02',status:'submitted for signoff',total_amount:221500}],2215),'https://pro.housecallpro.com/app/estimates/job_46c37bdcdfbc45fa8634658bdbbc0a02'));
test('selects the only provider-approved same-price option',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'est_0cf6607ab6d1487c9a183330dc95238c',status:'submitted for signoff',total_amount:608500,approval_status:'pro declined'},{id:'est_ee538975381042208a84dcb91193ac7a',status:'submitted for signoff',total_amount:608500,approval_status:'pro approved'}],6085),'https://pro.housecallpro.com/app/estimates/est_ee538975381042208a84dcb91193ac7a'));
test('still fails closed for same-price options without one approved choice',()=>assert.equal(selectHcpEstimateOptionUrl([{id:'est_11111111111111111111111111111111',status:'submitted',total_amount:100,approval_status:'expired'},{id:'est_22222222222222222222222222222222',status:'submitted',total_amount:100,approval_status:'expired'}],1),undefined));
test('fails closed for malformed status metadata',()=>{for(const status of [undefined,null,7,[],{}])assert.equal(selectHcpEstimateOptionUrl([{id:'est_11111111111111111111111111111111',status,total_amount:100}],1),undefined);});
test('fails closed for malformed approval metadata',()=>{for(const approval_status of [7,[],{}])assert.equal(selectHcpEstimateOptionUrl([{id:'est_11111111111111111111111111111111',status:'submitted',approval_status,total_amount:100}],1),undefined);});
test('requires IDs to be primitive strings',()=>{const valid='est_11111111111111111111111111111111';for(const id of [[valid],new String(valid),{toString:()=>valid}])assert.equal(selectHcpEstimateOptionUrl([{id,status:'submitted',total_amount:100}],1),undefined);});
test('ignores null and non-object option entries without throwing',()=>assert.equal(selectHcpEstimateOptionUrl([null,undefined,7,'bad'],1),undefined));
