const PROFILE = {
  employeeName: 'Ricky Lambert',
  firstName: 'Ricky',
  role: 'Sanitary Stainless Steel Welder / Fabricator',
  supervisor: 'Quinton Goff',
  startDate: 'Monday, July 8',
  startTime: '6:00 AM',
  location: 'Goff Welding • 531 W 100 S #24, Paul, ID',
  status: 'Cleared for onboarding',
  contact: 'careers@goffwelding.com',
};

const pages = [
  ['start','Start here'],
  ['before','Before day one'],
  ['bbsi','myBBSI / payroll'],
  ['first-day','First day'],
  ['exaktime','ExakTime'],
  ['safety','Safety'],
  ['tools','Tools & apparel'],
  ['policies','Policies'],
  ['links','Company links'],
  ['admin','Admin questions'],
];

const workflow = [
  { label:'Offer accepted', detail:'Candidate said yes. Do not treat as hired yet.', status:'Recruiting' },
  { label:'Clearance hold', detail:'Drug screen, background, and start date are confirmed.', status:'Guardrail' },
  { label:'BBSI invite + portal', detail:'myBBSI invite goes out and the employee receives one Goff start-here link.', status:'Onboarding' },
  { label:'Day-one ready', detail:'Employee has reviewed required items and manager has first-day packet ready.', status:'Employee' },
];

const checklistGroups = [
  { title:'Before day one', items:[
    { text:'Open and complete the myBBSI onboarding invite', tag:'Required', confirm:'Who sends invite and who verifies completion?' },
    { text:'Confirm start date, start time, location, and supervisor', tag:'Required', done:true },
    { text:'Review the first-day instructions', tag:'Required' },
    { text:'Review ExakTime clock-in instructions', tag:'Required' },
    { text:'Review safety orientation basics', tag:'Required' },
    { text:'Review tool/apparel expectations for your role', tag:'Role-based' },
  ]},
  { title:'First day', items:[
    { text:'Meet supervisor / first-day contact', tag:'Day one' },
    { text:'Confirm PPE and apparel expectations', tag:'Day one' },
    { text:'Receive ExakTime activation help if needed', tag:'Day one' },
    { text:'Complete safety orientation and quiz if required', tag:'Day one' },
    { text:'Review emergency exits, first aid, and fire extinguisher locations', tag:'Day one' },
  ]},
  { title:'Role setup', items:[
    { text:'Review required tool list', tag:'Welder/fabricator' },
    { text:'Review job description / KRA expectations', tag:'Role-specific' },
    { text:'Schedule 30-day tool check', tag:'Reminder' },
    { text:'Schedule 3-month, 6-month, and 1-year milestones', tag:'Manager' },
  ]},
];

const pageContent = {
  before: {
    kicker:'Draft page from onboarding docs',
    title:'Before your first day',
    summary:'This is the employee-facing version of the new-hire checklist. It gives the employee one plain list instead of several documents and email threads.',
    blocks:[
      ['Complete myBBSI onboarding','Watch for an email or text invite for myBBSI/BBSI onboarding. Complete the required payroll and HR steps before your first day. If the link expires or does not work, contact Goff Welding at careers@goffwelding.com.'],
      ['Confirm where and when to arrive',`First day: ${PROFILE.startDate}. Start time: ${PROFILE.startTime}. Location: ${PROFILE.location}. Supervisor: ${PROFILE.supervisor}.`],
      ['Bring required identification','Bring the identification or employment documents requested by BBSI/myBBSI. Goff should confirm the exact list during the onboarding process review.'],
      ['Read the role basics','Review your role, first-day expectations, tool requirements, apparel/PPE expectations, and timekeeping instructions before arriving.'],
    ],
    questions:['Who currently sends the final “first day” email/text?','Does BBSI require anything physically brought on day one?','Who verifies the employee completed myBBSI before they start?']
  },
  bbsi: {
    kicker:'BBSI handoff',
    title:'myBBSI / payroll setup',
    summary:'BBSI remains the formal HR/payroll onboarding system. The Goff portal should organize the handoff and help employees avoid getting stuck, not replace BBSI.',
    blocks:[
      ['What myBBSI is for','Use myBBSI for formal onboarding items like payroll/tax setup, employee information, and any BBSI-required employment forms.'],
      ['What Goff tracks','Goff tracks whether the invite was sent, whether the employee completed it, whether a resend is needed, and whether the employee is ready for day one.'],
      ['If the invite expires','Some BBSI invites may expire quickly. If yours expires, contact careers@goffwelding.com so the team can resend or help you.'],
      ['Sensitive information','Do not email sensitive payroll, tax, banking, or identity documents unless Goff/BBSI explicitly instructs you through the approved process.'],
    ],
    questions:['Exactly which forms live inside BBSI vs Goff?','Does direct deposit happen through BBSI or a separate Goff form?','Who at Goff can resend BBSI invites?','What does “BBSI complete” look like to Goff?']
  },
  'first-day': {
    kicker:'First-day packet',
    title:'Your first day at Goff Welding',
    summary:'This page recreates the welcome/new-hire packet as a calm mobile checklist.',
    blocks:[
      ['Arrive on time',`Arrive by ${PROFILE.startTime}. Ask for ${PROFILE.supervisor} or the assigned first-day contact.`],
      ['What to expect','Your first day may include introductions, safety orientation, ExakTime setup, PPE/apparel review, shop/jobsite expectations, and role-specific next steps.'],
      ['What to bring','Bring BBSI-requested documents, any required tools you already own, and clothing appropriate for shop/jobsite work. Goff will confirm PPE/apparel requirements.'],
      ['Who to contact','If anything changes before your first day, contact careers@goffwelding.com or the hiring contact who has been communicating with you.'],
    ],
    questions:['Who is the default first-day contact?','Does day-one start in office, shop, or jobsite?','Are shirts/PPE issued day one or later?','What should a new hire bring if they do not yet own required tools?']
  },
  exaktime: {
    kicker:'Timekeeping',
    title:'ExakTime / clocking in',
    summary:'This turns the ExakTime PDF into a simple employee-facing page that works well on a phone.',
    blocks:[
      ['Download the app','Install ExakTime Mobile on your iPhone or Android phone if instructed by Goff.'],
      ['Use your activation code','Goff will provide the activation code or setup help. Do not share your login or activation information with someone else.'],
      ['Clock in and out','Clock in when you start work. Clock out for lunch. Clock back in after lunch. Clock out at the end of the shift.'],
      ['Missed punch or correction','If you forget to clock in/out, add a note and tell your supervisor as soon as possible.'],
      ['Location/job notes','Use the job/location notes required by your supervisor so time is tied to the right work.'],
    ],
    questions:['Who issues the activation code?','What are the exact lunch punch rules?','Do shop and field employees use ExakTime the same way?','What notes are required for missed punches?']
  },
  safety: {
    kicker:'Safety orientation',
    title:'Safety basics',
    summary:'This page recreates the safety orientation and quiz material into a guided safety overview, with the original quiz/form attached later if Goff wants signatures.',
    blocks:[
      ['Safety comes first','Stop and ask if a task feels unsafe or unclear. Report hazards, near misses, and injuries right away.'],
      ['PPE expectations','Use the required PPE for your work area and task. Goff should confirm role-specific PPE before this page becomes final.'],
      ['Emergency basics','Learn emergency exits, first aid location, fire extinguisher locations, and who to contact in an emergency.'],
      ['Equipment and lockout/tagout','Do not operate equipment you have not been trained on. Follow lockout/tagout requirements when applicable.'],
      ['Safety quiz / acknowledgement','If a safety quiz or acknowledgement is required, the portal should track completion and store the signed/acknowledged record.'],
    ],
    questions:['Which safety quiz/version is current?','Who reviews quiz results?','Are signatures/acknowledgements required?','Which items differ by shop vs field role?']
  },
  tools: {
    kicker:'Role setup',
    title:'Tools, apparel, and PPE',
    summary:'This turns the tool list and apparel responsibility forms into a practical role-based page.',
    blocks:[
      ['Required tools','Review the tool list for your role. If you do not already have everything, ask your supervisor what is required immediately vs later.'],
      ['30-day tool check','Goff’s milestone material points toward follow-up after start. The portal should create a reminder for the 30-day tool check.'],
      ['Apparel responsibility','If Goff issues shirts, PPE, or other apparel/equipment, the portal can show the policy and capture acknowledgement.'],
      ['Role-specific expectations','Welder/fabricator expectations may differ from drivers, supervisors, procurement, office, or helper roles.'],
    ],
    questions:['Which tool list is current?','What is required before day one vs by 30 days?','Who approves exceptions?','Which apparel/PPE items require employee acknowledgement?']
  }
};

const policies = [
  { title:'Employee Handbook', treatment:'Portal summary + original PDF + acknowledgement', audience:'All employees', status:'Needs current version check' },
  { title:'Handbook Acknowledgement', treatment:'Acknowledgement tracking', audience:'All employees', status:'Required if current' },
  { title:'Drug & Alcohol Policy', treatment:'Plain-English summary + PDF', audience:'All employees', status:'Needs approval' },
  { title:'Vacation Policy', treatment:'Employee resource page', audience:'Active employees', status:'Likely visible' },
  { title:'Vehicle Policy', treatment:'Role-based policy page', audience:'Drivers / vehicle users', status:'Role-based' },
  { title:'Hard Hat SOP', treatment:'Safety resource page', audience:'Shop/field as applicable', status:'Needs role rule' },
  { title:'Unexcused Absence Policy', treatment:'Policy summary + PDF', audience:'All employees', status:'Needs approval' },
  { title:'Workplace Communication / Anti-Gossip', treatment:'Policy summary', audience:'All employees', status:'Needs approval' },
  { title:'Apparel Responsibility', treatment:'Acknowledgement page', audience:'Employees issued apparel/PPE', status:'Role-based' },
  { title:'NDA / Confidentiality', treatment:'Secure document flow', audience:'As applicable', status:'Sensitive' },
  { title:'Video Release', treatment:'Optional acknowledgement', audience:'As applicable', status:'Confirm use' },
];

const links = [
  { title:'Request Days Off', note:'Employee-facing form for time-off requests.', audience:'All employees', status:'Likely visible' },
  { title:'Truck Check-In', note:'Vehicle/truck status form.', audience:'Drivers / assigned vehicle users', status:'Role-based' },
  { title:'Spark Award', note:'Coworker recognition / nomination.', audience:'All employees', status:'Likely visible' },
  { title:'Purchase Request', note:'Request materials/supplies if role requires it.', audience:'Role-specific', status:'Confirm approval process' },
  { title:'Group Email Directory', note:'Approved group emails and internal contacts.', audience:'Employees after approval', status:'Needs approval' },
  { title:'Employee Contact Sheet', note:'Could be sensitive. Do not publish until Austin approves visibility.', audience:'Admin approval needed', status:'Hold' },
];

let section = 'start';
let completed = JSON.parse(localStorage.getItem('goffEmployeeChecklist') || '{}');
function save(){ localStorage.setItem('goffEmployeeChecklist', JSON.stringify(completed)); }
function allChecklistItems(){ return checklistGroups.flatMap(g => g.items); }
function pct(){ const all=allChecklistItems(); return Math.round((all.filter((_,i)=>completed[i]).length / all.length) * 100); }
function toggle(i){ completed[i] = !completed[i]; save(); render(); }
function nav(id){ section=id; render(); window.scrollTo({top:0, behavior:'smooth'}); }
function copyLink(){
  navigator.clipboard?.writeText('https://employees.goffwelding.com/start');
  const old=document.querySelector('.toast'); if(old) old.remove();
  const t=document.createElement('div'); t.className='toast'; t.textContent='Employee portal link copied'; document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}

function header(){
  return `<header class="hero">
    <div class="brandbar"><img src="/goff-welding-logo.png" alt="Goff Welding" /><span>Employee onboarding portal</span></div>
    <div class="hero-grid">
      <div>
        <p class="eyebrow">${PROFILE.status} • draft content pending Goff/BBSI review</p>
        <h1>Welcome to Goff Welding, ${PROFILE.firstName}.</h1>
        <p class="lead">One private start-here page for onboarding, first-day details, BBSI handoff, safety, tools, policies, and company links.</p>
        <div class="hero-actions"><button onclick="nav('before')">Start before-day-one steps</button><button class="secondary" onclick="copyLink()">Copy re-access link</button></div>
      </div>
      <aside class="start-card">
        <small>Your first day</small>
        <strong>${PROFILE.startDate}</strong>
        <dl>
          <div><dt>Time</dt><dd>${PROFILE.startTime}</dd></div>
          <div><dt>Location</dt><dd>${PROFILE.location}</dd></div>
          <div><dt>Supervisor</dt><dd>${PROFILE.supervisor}</dd></div>
          <div><dt>Role</dt><dd>${PROFILE.role}</dd></div>
        </dl>
      </aside>
    </div>
  </header>`;
}

function tabs(){ return `<nav class="tabs">${pages.map(([id,label])=>`<button class="${section===id?'active':''}" onclick="nav('${id}')">${label}</button>`).join('')}</nav>`; }
function flow(){ return `<section class="panel"><p class="eyebrow">Recruiting → employee transition</p><h2>How someone gets here</h2><div class="flow">${workflow.map((s,i)=>`<div class="flow-step ${i<3?'done':''}"><span>${i+1}</span><em>${s.status}</em><b>${s.label}</b><small>${s.detail}</small></div>`).join('')}</div><p class="note"><strong>Rule:</strong> Offer Accepted is not hired. The employee portal opens only after drug screen/background/start date are cleared or confirmed.</p></section>`; }
function startSection(){ return `${flow()}<section class="grid two"><article class="panel"><p class="eyebrow">What changed</p><h2>Docs are becoming pages</h2><p>Instead of dumping the Google folder into the portal, this converts the useful employee docs into simple pages. Originals can still be attached below each page after Austin approves current versions.</p><ul><li>Employee sees clear steps.</li><li>Admin sees what still needs confirmation.</li><li>BBSI remains the formal HR/payroll system.</li><li>Portal becomes the calm resource hub after start.</li></ul></article><article class="panel"><p class="eyebrow">Progress</p><h2>${pct()}% complete</h2><div class="bar"><i style="width:${pct()}%"></i></div><p>V1 demo stores progress locally. Production should store progress per employee and show it to admin.</p><button onclick="nav('before')">Open first page</button></article></section><section class="panel"><p class="eyebrow">Page map</p><h2>Draft pages built now</h2><div class="cards">${pages.slice(1,9).map(([id,label])=>`<button class="page-card" onclick="nav('${id}')"><b>${label}</b><small>Draft portal page</small></button>`).join('')}</div></section>`; }

function contentPage(id){ const p=pageContent[id]; return `<section class="panel doc-page"><p class="eyebrow">${p.kicker}</p><h2>${p.title}</h2><p class="summary">${p.summary}</p><div class="doc-blocks">${p.blocks.map(([h,b])=>`<article><h3>${h}</h3><p>${b}</p></article>`).join('')}</div><div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${q}</li>`).join('')}</ul></div></section>`; }
function checklistSection(){ let index=0; return `<section class="panel"><p class="eyebrow">Employee view</p><h2>My onboarding checklist</h2><p>Short, staged, and mobile friendly. Required items are separated from first-day and role-specific items.</p>${checklistGroups.map(group=>`<div class="check-group"><h3>${group.title}</h3>${group.items.map(item=>{ const i=index++; return `<label class="check ${completed[i]?'checked':''}"><input type="checkbox" ${completed[i] || item.done?'checked':''} onchange="toggle(${i})" /><span><b>${item.text}</b><small>${item.tag}${item.confirm?` • confirm: ${item.confirm}`:''}</small></span></label>`}).join('')}</div>`).join('')}</section>`; }
function policiesSection(){ return `<section class="panel"><p class="eyebrow">Approved documents only</p><h2>Policies and acknowledgements</h2><p>This should not publish the whole Drive folder. Only current, approved employee-facing policies should show here, with original PDFs attached when useful.</p><div class="table-list">${policies.map(p=>`<article><div><b>${p.title}</b><small>${p.treatment}</small></div><span>${p.audience}</span><em>${p.status}</em></article>`).join('')}</div></section>`; }
function linksSection(){ return `<section class="panel"><p class="eyebrow">Employee resource hub</p><h2>Company links</h2><p>These are the links from the Company Links / Work Schedule material. V1 shows the structure; Austin decides which links become employee-visible.</p><div class="resource-list">${links.map(r=>`<div class="resource"><span>${r.status}</span><b>${r.title}</b><p>${r.note}</p><em>${r.audience}</em></div>`).join('')}</div></section>`; }
function adminSection(){ const questions = Object.values(pageContent).flatMap(p=>p.questions.map(q=>[p.title,q])); return `<section class="panel"><p class="eyebrow">Internal review guide</p><h2>Questions for the onboarding walkthrough</h2><p>Use this page when Jeff sits down with the person who knows the post-BBSI process. It turns the portal into a conversation guide.</p><div class="handoff"><div><span>Employee</span><b>${PROFILE.employeeName}</b></div><div><span>Portal status</span><b>Draft pages built</b></div><div><span>BBSI</span><b>Workflow needs confirmation</b></div><div><span>Next admin action</span><b>Review actual onboarding process</b></div></div><div class="question-list">${questions.map(([page,q])=>`<article><span>${page}</span><b>${q}</b></article>`).join('')}</div><div class="admin-actions"><button>Generate welcome email</button><button>Send day-before reminder</button><button>Mark BBSI complete</button><button>Schedule 30-day tool check</button></div></section>`; }

function main(){
  if(section==='start') return startSection();
  if(section==='before') return contentPage('before') + checklistSection();
  if(section==='bbsi') return contentPage('bbsi');
  if(section==='first-day') return contentPage('first-day');
  if(section==='exaktime') return contentPage('exaktime');
  if(section==='safety') return contentPage('safety');
  if(section==='tools') return contentPage('tools');
  if(section==='policies') return policiesSection();
  if(section==='links') return linksSection();
  if(section==='admin') return adminSection();
  return startSection();
}
function render(){ document.getElementById('app').innerHTML = `${header()}<main class="wrap">${tabs()}${main()}</main><footer>Private Goff Welding employee portal prototype • Draft content pending Goff/BBSI review • Formal payroll/onboarding remains with BBSI/myBBSI.</footer>`; }
render();
