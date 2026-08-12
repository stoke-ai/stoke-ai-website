'use client';
import {useEffect,useRef,useState} from 'react';
import type{ReviewAnswer,ReviewCase,ReviewDecision}from '@/lib/morgan-door/store';

type Choice={answer:ReviewAnswer;label:string;help:string;tone:'yes'|'no'|'skip'|'other'};
const money=(v?:number)=>v==null?'Amount unavailable':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
const date=(v?:string)=>v?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(v)):'Unknown';
function daysOld(v?:string){if(!v)return '';const days=Math.max(0,Math.floor((Date.now()-new Date(v).getTime())/86400000));return `${days} days old`;}
function question(item:ReviewCase){
 if(item.customer.toLowerCase().includes('larry bowlin'))return 'Did Larry approve any work that still needs to be done?';
 if(item.queue==='cleanup')return 'Does this estimate still need to stay open?';
 if(item.likelyAnswer==='existing_job')return 'Does the existing Job cover this estimate?';
 if(item.likelyAnswer==='create_job')return 'Was this approved and does it still need a Job?';
 return item.question;
}
function choices(item:ReviewCase):Choice[]{
 if(item.customer.toLowerCase().includes('larry bowlin'))return[
  {answer:'create_job',label:'Yes — approved work needs a Job',help:'Add it to the reviewed follow-up list.',tone:'yes'},
  {answer:'canceled',label:'No — close this estimate',help:'Nothing remains to be done.',tone:'no'},
  {answer:'not_sure',label:'Not sure — skip it',help:'Save it for later review.',tone:'skip'},
 ];
 if(item.queue==='cleanup')return[
  {answer:'keep_active',label:'Keep it open',help:'This estimate is still active.',tone:'yes'},
  {answer:'canceled',label:'Close it',help:'Canceled, declined, stale, or no longer needed.',tone:'no'},
  {answer:'existing_job',label:'Already has a Job',help:'Do not create another Job.',tone:'other'},
  {answer:'not_sure',label:'Not sure — skip it',help:'Save it for later review.',tone:'skip'},
 ];
 return[
  {answer:'existing_job',label:'Existing Job covers it',help:'Do not create another Job.',tone:'yes'},
  {answer:'create_job',label:'Approved — needs a Job',help:'Add it to the reviewed action list.',tone:'other'},
  {answer:'canceled',label:'No work — close it',help:'Canceled, declined, or no longer needed.',tone:'no'},
  {answer:'different_work',label:'Different work',help:'Keep both records.',tone:'other'},
  {answer:'not_sure',label:'Not sure — skip it',help:'Save it for later review.',tone:'skip'},
 ];
}
const answerName:Record<ReviewAnswer,string>={existing_job:'Existing Job',create_job:'Needs a Job',canceled:'Close',different_work:'Different work',not_sure:'Not sure',keep_active:'Keep open'};
const HCP_ESTIMATE_BOARD='https://pro.housecallpro.com/app/pipeline/estimates';

export default function ReviewDeck({initial}:{initial:ReviewCase[]}){
 const[cases,setCases]=useState(initial.filter(x=>!x.id.startsWith('qa-')));
 const[index,setIndex]=useState(()=>Math.max(0,initial.filter(x=>!x.id.startsWith('qa-')).findIndex(x=>!x.decision)));
 const[note,setNote]=useState('');const[busy,setBusy]=useState(false);const[error,setError]=useState('');const headingRef=useRef<HTMLHeadingElement>(null);const[announcement,setAnnouncement]=useState('');
 const item=cases[index];const itemId=item?.id;const done=cases.filter(x=>x.decision).length;const existing=item?.decision;
 useEffect(()=>{if(!itemId)return;let active=true;fetch(`/api/morgan-door-review/cases/${encodeURIComponent(itemId)}`).then(r=>r.ok?r.json():Promise.reject()).then(body=>{if(active&&body.case)setCases(prev=>prev.map((x,i)=>i===index?{...body.case,decision:x.decision}:x));}).catch(()=>{if(active)setCases(prev=>prev.map((x,i)=>i===index?{...x,sourceRefreshStatus:'failed'}:x));});return()=>{active=false};},[index,itemId]);
 if(!item)return <div className="complete"><h1>All done.</h1><p>There are no estimates left to review.</p></div>;
 async function save(answer:ReviewAnswer){setBusy(true);setError('');const r=await fetch('/api/morgan-door-review/decision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({caseId:item.id,answer,note,version:existing?.version||0})});const b=await r.json().catch(()=>({}));if(!r.ok){setError(b.error||'Answer did not save. Try again.');setBusy(false);return;}const updated=cases.map((x,i)=>i===index?{...x,decision:b.decision as ReviewDecision}:x);setCases(updated);setNote('');setBusy(false);const next=updated.findIndex((x,i)=>i>index&&!x.decision);const wrap=updated.findIndex(x=>!x.decision);if(next>=0){setIndex(next);setAnnouncement(`Saved. Next estimate: ${updated[next].customer}`);}else if(wrap>=0){setIndex(wrap);setAnnouncement(`Saved. Next estimate: ${updated[wrap].customer}`);}requestAnimationFrame(()=>headingRef.current?.focus());}
 function move(delta:number){const next=Math.min(cases.length-1,Math.max(0,index+delta));setIndex(next);setNote('');setError('');}
 const remaining=cases.length-done;
 return <div className="deck fastDeck">
  <header className="fastTop"><div><span className="brand">MORGAN DOOR</span><h1>Quick estimate check</h1></div><div className="progress"><strong>{remaining}</strong><span>left</span></div></header>
  <div className="progressBar"><i style={{width:`${cases.length?done/cases.length*100:0}%`}}/></div>
  <main className="fastMain">
   <section className="identity"><div><span>Estimate {item.estimateNumber} · {daysOld(item.updatedAt||item.createdAt)}</span><h2>{item.customer}</h2><p>{item.address||'Address not recorded'}</p></div><strong>{money(item.amount)}</strong></section>
   <section className="fastQuestion"><small>{item.queue==='cleanup'?'QUICK CLEANUP':'JOB CHECK'}</small><h3 ref={headingRef} tabIndex={-1}>{question(item)}</h3>{item.customer.toLowerCase().includes('larry bowlin')&&<p>Pipeline says Approved, but HCP says canceled and the approved option was deleted.</p>}</section>
   <p className="srOnly" aria-live="polite">{announcement}</p>
   <div className="quickChoices">{choices(item).map(choice=>{const suggested=choice.answer===item.likelyAnswer;return <button key={choice.answer} className={`quickChoice ${choice.tone} ${suggested?'suggested':''}`} disabled={busy} onClick={()=>save(choice.answer)}>{suggested&&<em>LIKELY</em>}<b>{choice.label}</b><span>{choice.help}</span></button>})}</div>
   {error&&<p className="error" role="alert">{error}</p>}
   <details className="evidence"><summary>Need more information?</summary><div className="evidenceBody">
    <a className="hcpEstimateLink" href={HCP_ESTIMATE_BOARD} target="_blank" rel="noopener noreferrer">Open HCP for Estimate {item.estimateNumber} ↗</a>
    <p className="hcpEstimateHint">In HCP, paste <b>{item.estimateNumber}</b> into “Estimate # (exact match).”</p>
    <p><b>Status:</b> {item.status||'Unknown'} · <b>Created:</b> {date(item.createdAt)} · <b>Updated:</b> {date(item.updatedAt)}</p>
    {item.scope&&<div><b>Quoted work</b><p>{item.scope}</p></div>}
    {item.likelyReason&&<div><b>Why Blaze flagged it</b><p>{item.likelyReason}</p></div>}
    {item.candidates.length>0&&<div><b>Possible Jobs</b>{item.candidates.map(c=><p key={c.jobId||c.jobNumber}>Job {c.jobNumber}: {c.status||'status unknown'} · {money(c.amount)}{c.scope?` · ${c.scope}`:''}</p>)}</div>}
    <label className="note">Optional note<textarea value={note} maxLength={1000} onChange={e=>setNote(e.target.value)} placeholder="Only add a note if it will help later."/></label>
   </div></details>
   <footer className="fastNav"><button onClick={()=>move(-1)} disabled={index===0}>← Back</button><span>{done} answered</span><button onClick={()=>move(1)} disabled={index===cases.length-1}>Next →</button></footer>
   {existing&&<p className="savedState">Previously answered: <b>{answerName[existing.answer]}</b>. Clicking a choice changes it.</p>}
  </main>
 </div>;
}
