'use client';
import{useMemo,useState}from'react';
import type{ReviewAnswer,ReviewCase}from'@/lib/morgan-door/store';

type Bucket={key:ReviewAnswer;title:string;instruction:string};
const buckets:Bucket[]=[
 {key:'create_job',title:'Approved — needs a Job',instruction:'Confirm no duplicate Job exists, then prepare the Job creation step.'},
 {key:'canceled',title:'Close stale Estimate',instruction:'Review once, then close/archive the Estimate in HCP.'},
 {key:'existing_job',title:'Existing Job — no duplicate',instruction:'Verify the Job covers the quoted work; do not create another Job.'},
 {key:'keep_active',title:'Keep Estimate active',instruction:'Leave it open and confirm its current owner and next action.'},
 {key:'different_work',title:'Different work',instruction:'Keep both records; the candidate Job does not satisfy this Estimate.'},
 {key:'not_sure',title:'Not sure — follow up',instruction:'Research or ask Braxton before making any HCP correction.'},
];
const money=(v?:number)=>v==null?'Amount unavailable':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
export default function ActionQueue({cases,onBack}:{cases:ReviewCase[];onBack:()=>void}){
 const answered=useMemo(()=>cases.filter(x=>x.decision),[cases]);
 const[open,setOpen]=useState<ReviewAnswer|'all'>('all');
 return <div className="actionQueue">
  <header className="queueTop"><div><span className="brand">MORGAN DOOR</span><h1>Reviewed action queue</h1><p>Braxton’s answers are organized for one-at-a-time HCP cleanup. Nothing here changes HCP.</p></div><button onClick={onBack}>← Back to review</button></header>
  <section className="queueStats"><div><strong>{answered.length}</strong><span>answered</span></div><div><strong>{cases.length-answered.length}</strong><span>waiting</span></div><div><strong>{answered.filter(x=>x.decision?.answer==='not_sure').length}</strong><span>need follow-up</span></div></section>
  <nav className="queueFilters" aria-label="Action queue filters"><button className={open==='all'?'active':''} onClick={()=>setOpen('all')}>All actions</button>{buckets.map(b=><button key={b.key} className={open===b.key?'active':''} onClick={()=>setOpen(b.key)}>{b.title} ({answered.filter(x=>x.decision?.answer===b.key).length})</button>)}</nav>
  {buckets.filter(b=>open==='all'||open===b.key).map(bucket=>{const items=answered.filter(x=>x.decision?.answer===bucket.key);return <section className="queueGroup" key={bucket.key}><div className="queueGroupHead"><div><h2>{bucket.title}</h2><p>{bucket.instruction}</p></div><strong>{items.length}</strong></div>{items.length===0?<p className="emptyQueue">No answered Estimates in this group yet.</p>:<div className="queueRows">{items.map(item=><article key={item.id}><div><small>ESTIMATE {item.estimateNumber}</small><h3>{item.customer}</h3><p>{item.address||'Address not recorded'} · {money(item.amount)}</p>{item.decision?.note&&<blockquote>{item.decision.note}</blockquote>}</div><div className="queueActions">{item.hcpEstimateUrl?<a href={item.hcpEstimateUrl} target="_blank" rel="noopener noreferrer">Open in HCP ↗</a>:<span>Direct link unavailable</span>}<small>Answered {item.decision?new Date(item.decision.answeredAt).toLocaleDateString('en-US'):''}</small></div></article>)}</div>}</section>})}
 </div>;
}
