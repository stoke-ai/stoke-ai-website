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
  ['ops','Admin control'],
  ['training','Training path'],
  ['before','Before day one'],
  ['bbsi','BBSI / myBBSI'],
  ['exaktime','ExakTime'],
  ['safety','Safety'],
  ['forms','Company forms'],
  ['tools','Tools & apparel'],
  ['handoff','Manager handoff'],
  ['checkin','30-day check-in'],
  ['admin','Admin review'],
];

const workflow = [
  { label:'Offer accepted', detail:'Candidate said yes. Do not treat as hired yet.', status:'Recruiting' },
  { label:'Clearance hold', detail:'Drug screen, background, and start date are confirmed.', status:'Guardrail' },
  { label:'BBSI invite + portal', detail:'myBBSI invite goes out and the employee receives one Goff start-here link.', status:'Onboarding' },
  { label:'Training path', detail:'Employee learns timekeeping, safety, company links, tools, and expectations in one sequence.', status:'Training' },
  { label:'Manager handoff', detail:'Supervisor confirms first work assignment, role expectations, and open questions.', status:'Employee' },
  { label:'30-day check-in', detail:'Goff revisits links/forms, time off, expectations, tools, and questions after real work experience.', status:'Follow-up' },
];

const trainingSteps = [
  { id:'welcome', title:'Welcome to Goff', owner:'Employee', timing:'Start here', why:'Understand what this portal is for and where formal BBSI paperwork still lives.', page:'before' },
  { id:'bbsi', title:'BBSI / myBBSI setup', owner:'Employee + Admin', timing:'Before day one', why:'Complete payroll/compliance items without mixing sensitive documents into Goff messages.', page:'bbsi' },
  { id:'exaktime', title:'ExakTime / timekeeping', owner:'Employee', timing:'Before day one / day one', why:'Know how to clock in/out, report missed punches, and attach work to the right job.', page:'exaktime' },
  { id:'safety', title:'Safety orientation', owner:'Employee + Supervisor', timing:'Day one', why:'Make safety expectations consistent before hands-on work begins.', page:'safety' },
  { id:'forms', title:'Company links and forms', owner:'Employee', timing:'Day one / week one', why:'Know when to use damage reports, time off, truck check-in, purchase requests, and Spark Award.', page:'forms' },
  { id:'tools', title:'Tools, apparel, and PPE', owner:'Employee + Supervisor', timing:'Week one', why:'Clarify what is required now, what can wait, and what needs acknowledgement.', page:'tools' },
  { id:'handoff', title:'Manager handoff', owner:'Supervisor', timing:'After safety/training', why:'Move from onboarding into actual job expectations and first assignment.', page:'handoff' },
  { id:'checkin', title:'30-day check-in', owner:'Supervisor / Admin', timing:'Day 30', why:'Revisit the things employees forget during the first-day fire hose.', page:'checkin' },
];

const pageContent = {
  before: {
    kicker:'Start-here training',
    title:'Before your first day',
    summary:'This is the employee-facing version of the new-hire checklist. The goal is one clear path before the employee arrives, not scattered PDFs and texts.',
    blocks:[
      ['Complete myBBSI onboarding','Watch for the BBSI/myBBSI invite and complete required payroll/HR steps before your first day. If the link expires or does not work, contact Goff Welding.'],
      ['Confirm where and when to arrive',`First day: ${PROFILE.startDate}. Start time: ${PROFILE.startTime}. Location: ${PROFILE.location}. Supervisor: ${PROFILE.supervisor}.`],
      ['Review the training path','Before day one, review timekeeping, safety basics, tools/apparel, and company forms so the first day is not a fire hose.'],
      ['Bring what BBSI/Goff requested','Bring identification or documents requested through the approved BBSI process. Do not text/email sensitive payroll or identity documents unless instructed through an approved process.'],
    ],
    questions:['Who sends the final first-day text/email?','Who verifies myBBSI completion before start?','Does BBSI require anything physically brought on day one?','What exact wording should new hires receive the day before start?']
  },
  bbsi: {
    kicker:'Boundary: BBSI owns formal HR/payroll',
    title:'BBSI / myBBSI setup',
    summary:'BBSI remains the formal payroll/compliance backend. This portal helps the employee understand the handoff, deadlines, and who to contact if stuck.',
    blocks:[
      ['What BBSI is for','Use BBSI/myBBSI for formal onboarding items such as payroll, tax setup, employee information, and BBSI-required employment forms.'],
      ['What Goff tracks','Goff tracks whether the invite was sent, whether it was completed, whether a resend is needed, and whether the employee is ready for the first day.'],
      ['If the invite expires','Contact Goff quickly so the team can help with a resend or next step. Do not wait until the first morning.'],
      ['Sensitive information','Do not send payroll, tax, banking, or identity documents by ordinary text/email unless Goff/BBSI explicitly provides an approved process.'],
    ],
    questions:['Exactly which items are inside BBSI vs Goff?','Who can resend BBSI invites?','What does “BBSI complete” look like to Goff?','Does direct deposit happen in BBSI or a separate Goff-controlled form?']
  },
  exaktime: {
    kicker:'Timekeeping training',
    title:'ExakTime / clocking in',
    summary:'This turns the ExakTime PDF into a phone-friendly training page employees can revisit after day one.',
    blocks:[
      ['Download and activate','Install ExakTime Mobile if instructed. Goff will provide the activation code or setup help. Do not share login/activation info.'],
      ['Clock in and out','Clock in when you start work, clock out for lunch, clock back in after lunch, and clock out at the end of the shift.'],
      ['Missed punch or correction','If you forget to clock in/out, add a note and tell your supervisor as soon as possible.'],
      ['Job/location notes','Use job/location notes required by the supervisor so time is tied to the right work.'],
    ],
    questions:['Who issues activation codes?','What are the exact lunch punch rules?','Do shop and field roles use ExakTime differently?','What notes are required for missed punches?']
  },
  safety: {
    kicker:'Safety training',
    title:'Safety orientation',
    summary:'Safety should be taught consistently before hands-on work. The portal can host the overview, then route required quiz/acknowledgement items.',
    blocks:[
      ['Stop and ask','Stop and ask if a task feels unsafe, unclear, or outside your training. Report hazards, near misses, and injuries right away.'],
      ['PPE expectations','Use required PPE for the work area and task. Role-specific PPE should be confirmed by Goff before this page becomes final.'],
      ['Emergency basics','Learn exits, first aid location, fire extinguishers, emergency contact steps, and who to notify.'],
      ['Equipment / lockout-tagout','Do not operate equipment you have not been trained on. Follow lockout/tagout requirements when applicable.'],
      ['Quiz / acknowledgement','If Goff requires a safety quiz or acknowledgement, the portal should track completion and store the record.'],
    ],
    questions:['Which safety quiz is current?','Who reviews quiz results?','Which items differ by shop vs field role?','What hands-on safety steps happen after the portal training?']
  },
  tools: {
    kicker:'Role setup',
    title:'Tools, apparel, and PPE',
    summary:'This turns tool lists and apparel responsibility forms into practical role-based expectations.',
    blocks:[
      ['Required tools','Review the tool list for your role. Ask your supervisor what is required immediately versus by the 30-day tool check.'],
      ['Apparel responsibility','If Goff issues shirts, PPE, or other apparel/equipment, the portal can show the policy and capture acknowledgement.'],
      ['Role expectations','Welder/fabricator expectations differ from driver, foreman, procurement, inventory, and helper roles.'],
      ['30-day tool follow-up','The 30-day check-in should revisit tools/apparel so missing items are caught early.'],
    ],
    questions:['Which tool list is current?','What is required before day one vs by 30 days?','Who approves exceptions?','Which apparel/PPE items require acknowledgement?']
  },
  handoff: {
    kicker:'After portal + safety',
    title:'Manager handoff',
    summary:'Once the employee has completed the basics, the supervisor turns onboarding into the first real work assignment and expectations.',
    blocks:[
      ['Meet your supervisor',`Default supervisor shown here: ${PROFILE.supervisor}. Confirm the real first-day contact and who owns the handoff.`],
      ['Review first assignment','Supervisor explains the first assignment, work area/jobsite, expected pace, quality standard, and who to ask for help.'],
      ['Confirm training complete','Supervisor confirms ExakTime, safety basics, tools/apparel, company forms, and any role-specific requirements.'],
      ['Capture open questions','Any confusion from day one should be written down so it can be answered before the 30-day check-in.'],
    ],
    questions:['Who owns manager handoff for each role?','Does handoff happen before or after hands-on safety?','What should be signed/acknowledged before work begins?','What does supervisor need to see in the admin view?']
  }
};

const formModules = [
  { id:'damage', title:'Damage / incident report', audience:'All employees', status:'High priority', when:'Use when equipment, vehicle, property, or jobsite damage occurs, or when an incident needs supervisor/safety review.', how:'Open the company damage report, complete what happened, where, who was involved, photos if needed, and immediate safety steps taken.', next:'Supervisor/admin gets notified, safety response is reviewed, drug-test/tow/equipment decisions are made if required, and follow-up is assigned.', confirm:'Who receives alerts, and what triggers drug test / tow / safety escalation?' },
  { id:'timeoff', title:'Request days off', audience:'All employees', status:'Employee-facing', when:'Use before taking time off, vacation, planned appointments, or schedule exceptions.', how:'Submit date(s), reason/category if required, supervisor, and coverage notes.', next:'Supervisor/admin reviews, approval/denial is communicated, and schedule is updated.', confirm:'Who approves by role/team, how much notice is required, and where approved time off is recorded?' },
  { id:'truck', title:'Truck check-in', audience:'Drivers / assigned vehicle users', status:'Role-based', when:'Use for assigned truck/vehicle check-in, vehicle condition, mileage, fuel, maintenance, or damage notes.', how:'Submit truck ID, mileage/status, any maintenance concerns, damage photos/notes, and whether it is safe to drive.', next:'Admin/supervisor reviews vehicle status, assigns maintenance/follow-up, and escalates damage if needed.', confirm:'Which roles need this, how often, and who owns maintenance follow-up?' },
  { id:'purchase', title:'Purchase request', audience:'Role-specific', status:'Confirm approval path', when:'Use when materials, supplies, tools, or job-related purchases need approval.', how:'Submit item, vendor if known, job/customer, estimated cost, urgency, and why it is needed.', next:'Approver reviews, purchase is approved/denied/assigned, and requester gets next step.', confirm:'Approval limits, approvers, and whether urgent purchases have a different process.' },
  { id:'spark', title:'Spark Award', audience:'All employees', status:'Likely visible', when:'Use to recognize a coworker for helpfulness, safety, quality, attitude, or going above expectations.', how:'Submit employee name, what they did, and why it matters.', next:'Nomination routes to the right person/team and may be included in recognition or awards process.', confirm:'Who reviews nominations and how often awards are selected.' },
  { id:'contacts', title:'Company contacts / schedule links', audience:'Approved employees', status:'Needs visibility approval', when:'Use when employees need approved internal contacts, group emails, schedules, or company resources.', how:'Open the relevant contact/schedule resource and use only approved channels.', next:'Employee gets the correct contact/resource without asking around or using stale lists.', confirm:'Which contact sheets are safe to publish, and which should stay admin-only.' },
];

const checkinItems = [
  { title:'Company links/forms reviewed', detail:'Damage report, time off, truck check-in, purchase request, Spark Award, and contact/schedule links.' },
  { title:'ExakTime confidence', detail:'Employee knows clock-in/out, lunch punches, missed punch notes, and job/location requirements.' },
  { title:'Safety questions', detail:'Employee has had enough time to know what felt unclear after day one.' },
  { title:'Role expectations', detail:'Supervisor revisits quality, pace, attendance, communication, and who to ask for help.' },
  { title:'Tools/apparel/PPE', detail:'Confirm required items are in place or exceptions are approved.' },
  { title:'Employee questions captured', detail:'Write down unanswered questions and assign follow-up.' },
];

const demoOnboardingQueue = [
  { id:'demo-ricky', name:'Ricky Lambert', role:'Sanitary Stainless Steel Welder / Fabricator', supervisor:'Quinton Goff', stage:'Training path', status:'In progress', start:'Jul 8', progress:62, blocked:'BBSI completion needs confirmation', next:'Confirm myBBSI complete, then schedule manager handoff' },
  { id:'demo-helper', name:'TBD helper hire', role:'Shop / field helper', supervisor:'TBD', stage:'Clearance hold', status:'Waiting', start:'Pending', progress:18, blocked:'Drug screen/background/start date not confirmed', next:'Do not send employee portal until clearance is confirmed' },
  { id:'demo-driver', name:'Recent hire placeholder', role:'Driver / vehicle user', supervisor:'TBD', stage:'30-day check-in', status:'Due soon', start:'Started', progress:84, blocked:'Truck check-in routing needs owner', next:'Run 30-day check-in and confirm vehicle/form training' },
];
function parseRecruitingHandoffs(){ try { return JSON.parse(localStorage.getItem('goffOnboardingQueueV1') || '[]'); } catch(_) { return []; } }
function currentOnboardingQueue(){
  const handoffs = parseRecruitingHandoffs().map(x => Object.assign({ progress:28, status:'Ready for onboarding', stage:'BBSI invite + training path', blocked:'BBSI/myBBSI invite and completion still need admin confirmation', next:'Send welcome link, confirm myBBSI invite, then start training path' }, x, { fromRecruiting:true }));
  const handoffNames = new Set(handoffs.map(x => String(x.name || '').toLowerCase()));
  const demos = demoOnboardingQueue.filter(x => !handoffNames.has(String(x.name || '').toLowerCase()));
  return [...handoffs, ...demos];
}
function computedAdminMetrics(){
  const q = currentOnboardingQueue();
  const blocked = q.filter(x => String(x.blocked || '').trim() && !/^none/i.test(String(x.blocked))).length + 3;
  const decisions = 6 + q.filter(x => x.fromRecruiting).length;
  return [
    { label:'In onboarding', value:String(q.length), detail:`${q.filter(x=>/progress|ready/i.test(x.status)).length} active/ready, ${q.filter(x=>/hold|waiting/i.test(x.stage+x.status)).length} hold/waiting, ${q.filter(x=>/30-day|due/i.test(x.stage+x.status)).length} check-in due` },
    { label:'Blocked items', value:String(blocked), detail:'BBSI completion, form routing, safety signoff, truck owner, handoffs' },
    { label:'Next 7 days', value:String(Math.max(5, q.length + 2)), detail:'Welcome text, BBSI verify, safety, manager handoff, check-in' },
    { label:'Needs Goff decision', value:String(decisions), detail:'Approvers, visibility, signoffs, recipients, timing' },
  ];
}

const adminMetrics = computedAdminMetrics;

const ownerActions = [
  { owner:'Admin / HR', count:4, items:['Confirm BBSI invite sent/completed','Resend expired myBBSI invite if needed','Generate day-before welcome reminder','Record 30-day check-in result'] },
  { owner:'Supervisor', count:4, items:['Confirm first-day contact','Complete safety / hands-on signoff','Review first assignment and expectations','Answer open employee questions'] },
  { owner:'Employee', count:5, items:['Complete BBSI/myBBSI','Review ExakTime page','Review safety basics','Learn company forms','Complete 30-day check-in questions'] },
  { owner:'Stoke AI / portal setup', count:5, items:['Final route for each company form','Add approved PDFs/links only','Define notification recipients','Store progress per employee','Keep BBSI boundary clear'] },
];

const blockers = [
  { title:'BBSI completion signal', owner:'Admin / BBSI', impact:'Cannot reliably mark day-one ready until Goff knows what complete looks like.' },
  { title:'Company form routing', owner:'Austin / Goff', impact:'Damage, time off, truck, purchase, and Spark forms need recipients and next actions.' },
  { title:'Safety signoff rule', owner:'Supervisor', impact:'Need to know what is portal acknowledgement vs hands-on signoff.' },
  { title:'Employee-visible links', owner:'Austin / Goff', impact:'Contact sheets and schedule links need visibility approval before publishing broadly.' },
];

const adminTimeline = [
  ['Clearance confirmed','Drug/background/start date verified before portal access opens.'],
  ['Welcome link sent','Employee gets one start-here link and day-before reminder.'],
  ['BBSI verified','Admin confirms BBSI/myBBSI is complete or resend/help is needed.'],
  ['Training path reviewed','Employee reviews ExakTime, safety, forms, tools, and expectations.'],
  ['Supervisor handoff','Supervisor confirms first assignment, role expectations, and open questions.'],
  ['30-day check-in','Goff revisits forms, timekeeping, safety questions, tools, and expectations.'],
];

const adminQuestions = [
  ['BBSI boundary','Which exact steps are BBSI-owned vs Goff-owned?'],
  ['Invite ownership','Who sends/resends BBSI invites and who confirms completion?'],
  ['Safety timing','How long is safety training, which parts are portal/video vs hands-on, and who signs off?'],
  ['Manager handoff','Who owns the handoff after paperwork/safety and what checklist should they see?'],
  ['Form routing','For each company form, who receives the submission and what action happens next?'],
  ['30-day check-in','Who schedules it, who attends, and what gets recorded?'],
  ['Visibility','Which docs/links are employee-visible, role-based, sensitive, or admin-only?'],
];

let section = 'start';
let completed = JSON.parse(localStorage.getItem('goffEmployeeChecklist') || '{}');
function save(){ localStorage.setItem('goffEmployeeChecklist', JSON.stringify(completed)); }
function pct(){ return Math.round((trainingSteps.filter((_,i)=>completed[`training-${i}`]).length / trainingSteps.length) * 100); }
function toggle(key){ completed[key] = !completed[key]; save(); render(); }
function nav(id){ section=id; render(); window.scrollTo({top:0, behavior:'smooth'}); }
function copyLink(){
  navigator.clipboard?.writeText('https://employees.goffwelding.com/start');
  const old=document.querySelector('.toast'); if(old) old.remove();
  const t=document.createElement('div'); t.className='toast'; t.textContent='Employee portal link copied'; document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}
function esc(s){ return String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

function header(){
  return `<header class="hero">
    <div class="brandbar"><img src="/goff-welding-logo.png" alt="Goff Welding" /><span>Employee training portal</span></div>
    <div class="hero-grid">
      <div>
        <p class="eyebrow">${esc(PROFILE.status)} • draft pending Goff/BBSI review</p>
        <h1>Welcome to Goff Welding, ${esc(PROFILE.firstName)}.</h1>
        <p class="lead">A private start-here path for BBSI handoff, timekeeping, safety, company forms, tools, manager handoff, and the 30-day check-in.</p>
        <div class="hero-actions"><button onclick="nav('training')">Open training path</button><button class="secondary" onclick="copyLink()">Copy re-access link</button></div>
      </div>
      <aside class="start-card">
        <small>Your first day</small>
        <strong>${esc(PROFILE.startDate)}</strong>
        <dl>
          <div><dt>Time</dt><dd>${esc(PROFILE.startTime)}</dd></div>
          <div><dt>Location</dt><dd>${esc(PROFILE.location)}</dd></div>
          <div><dt>Supervisor</dt><dd>${esc(PROFILE.supervisor)}</dd></div>
          <div><dt>Role</dt><dd>${esc(PROFILE.role)}</dd></div>
        </dl>
      </aside>
    </div>
  </header>`;
}

function tabs(){ return `<nav class="tabs">${pages.map(([id,label])=>`<button class="${section===id?'active':''}" onclick="nav('${id}')">${esc(label)}</button>`).join('')}</nav>`; }
function flow(){ return `<section class="panel"><p class="eyebrow">Recruiting → employee transition</p><h2>How someone gets here</h2><div class="flow expanded-flow">${workflow.map((s,i)=>`<div class="flow-step ${i<3?'done':''}"><span>${i+1}</span><em>${esc(s.status)}</em><b>${esc(s.label)}</b><small>${esc(s.detail)}</small></div>`).join('')}</div><p class="note"><strong>Rule:</strong> Offer Accepted is not hired. The full employee portal opens after clearance/start date are confirmed. BBSI remains formal payroll/compliance; Goff owns the training, forms, visibility, and employee experience around it.</p></section>`; }
function startSection(){ return `${flow()}<section class="grid two"><article class="panel"><p class="eyebrow">What this is now</p><h2>Training path, not a file library</h2><p>The portal now teaches the repeatable parts of onboarding: BBSI boundary, ExakTime, safety, forms, tools, manager handoff, and 30-day follow-up.</p><ul><li>Employee sees a sequenced path.</li><li>Company forms explain when/how/what next.</li><li>Admin has review questions for the Goff/BBSI walkthrough.</li><li>Original PDFs can attach later only after approval.</li></ul></article><article class="panel"><p class="eyebrow">Training progress</p><h2>${pct()}% complete</h2><div class="bar"><i style="width:${pct()}%"></i></div><p>V1 demo stores progress locally. Production should store progress per employee and expose it to admin/supervisor.</p><button onclick="nav('training')">Open training path</button></article></section><section class="panel"><p class="eyebrow">Fast access</p><h2>Key modules</h2><div class="cards">${[['ops','Admin control'],['bbsi','BBSI / myBBSI'],['exaktime','ExakTime'],['safety','Safety'],['forms','Company forms'],['handoff','Manager handoff'],['checkin','30-day check-in']].map(([id,label])=>`<button class="page-card" onclick="nav('${id}')"><b>${esc(label)}</b><small>Open module</small></button>`).join('')}</div></section>`; }
function trainingSection(){ return `<section class="panel training-panel"><p class="eyebrow">Guided new-hire path</p><h2>From cleared candidate to active employee</h2><p class="summary">This is the consistent training sequence Austin was describing. It reduces the day-one fire hose and gives Goff a second pass at the 30-day check-in.</p><div class="training-steps">${trainingSteps.map((s,i)=>`<article class="training-step ${completed[`training-${i}`]?'complete':''}"><button class="step-check" onclick="toggle('training-${i}')">${completed[`training-${i}`]?'✓':i+1}</button><div><span>${esc(s.timing)} • ${esc(s.owner)}</span><h3>${esc(s.title)}</h3><p>${esc(s.why)}</p><button class="inline" onclick="nav('${s.page}')">Open module</button></div></article>`).join('')}</div></section>`; }
function contentPage(id){ const p=pageContent[id]; return `<section class="panel doc-page"><p class="eyebrow">${esc(p.kicker)}</p><h2>${esc(p.title)}</h2><p class="summary">${esc(p.summary)}</p><div class="doc-blocks">${p.blocks.map(([h,b])=>`<article><h3>${esc(h)}</h3><p>${esc(b)}</p></article>`).join('')}</div><div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section>`; }
function formsSection(){ return `<section class="panel"><p class="eyebrow">Company links training</p><h2>Forms employees need to understand</h2><p class="summary">Each form should teach when to use it, how to submit it, who sees it, and what happens after. These are placeholders until Austin confirms routing and visibility.</p><div class="form-modules">${formModules.map(m=>`<article class="form-module"><div class="module-head"><span>${esc(m.status)}</span><h3>${esc(m.title)}</h3><small>${esc(m.audience)}</small></div><dl><div><dt>When to use it</dt><dd>${esc(m.when)}</dd></div><div><dt>How to submit</dt><dd>${esc(m.how)}</dd></div><div><dt>What happens next</dt><dd>${esc(m.next)}</dd></div><div class="confirm"><dt>Confirm</dt><dd>${esc(m.confirm)}</dd></div></dl></article>`).join('')}</div></section>`; }
function checkinSection(){ return `<section class="panel checkin-panel"><p class="eyebrow">Follow-up after the fire hose</p><h2>30-day check-in</h2><p class="summary">Austin said the first day can be a fire hose. This check-in gives Goff a structured second pass after the employee has real context.</p><div class="checkin-grid">${checkinItems.map((item,i)=>`<label class="check ${completed[`checkin-${i}`]?'checked':''}"><input type="checkbox" ${completed[`checkin-${i}`]?'checked':''} onchange="toggle('checkin-${i}')" /><span><b>${esc(item.title)}</b><small>${esc(item.detail)}</small></span></label>`).join('')}</div><div class="manager-note"><h3>Admin/supervisor record</h3><textarea placeholder="Questions asked, expectations clarified, follow-up assigned, manager notes..."></textarea><div class="admin-actions"><button>Save check-in note</button><button>Assign follow-up</button><button>Mark 30-day complete</button></div></div></section>`; }
function opsSection(){
  return `<section class="panel ops-panel"><p class="eyebrow">Admin-side onboarding control</p><h2>Who needs what next</h2><p class="summary">This is the internal operating view: not another document list. It shows each new hire’s stage, blockers, owner actions, and follow-up timing.</p><div class="metric-grid">${adminMetrics().map(m=>`<article><span>${esc(m.label)}</span><strong>${esc(m.value)}</strong><p>${esc(m.detail)}</p></article>`).join('')}</div></section><section class="panel"><p class="eyebrow">Onboarding queue</p><h2>Employee status board</h2><div class="employee-board">${currentOnboardingQueue().map(e=>`<article class="employee-row ${e.fromRecruiting?'from-recruiting':''}"><div><span class="status-pill">${esc(e.status)}</span><h3>${esc(e.name)}</h3><p>${esc(e.role)}</p></div><dl><div><dt>Stage</dt><dd>${esc(e.stage)}</dd></div><div><dt>Supervisor</dt><dd>${esc(e.supervisor)}</dd></div><div><dt>Start</dt><dd>${esc(e.start)}</dd></div></dl><div class="mini-progress"><span>${esc(e.progress)}%</span><i style="width:${esc(e.progress)}%"></i></div><div class="row-next"><b>Blocked / watch</b><p>${esc(e.blocked)}</p><b>Next action</b><p>${esc(e.next)}</p></div></article>`).join('')}</div></section><section class="grid two"><article class="panel"><p class="eyebrow">Owner lanes</p><h2>Next actions by owner</h2><div class="owner-lanes">${ownerActions.map(l=>`<div class="owner-lane"><h3>${esc(l.owner)} <span>${esc(l.count)}</span></h3><ul>${l.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`).join('')}</div></article><article class="panel"><p class="eyebrow">Current blockers</p><h2>Decisions holding automation</h2><div class="blocker-list">${blockers.map(b=>`<article><span>${esc(b.owner)}</span><b>${esc(b.title)}</b><p>${esc(b.impact)}</p></article>`).join('')}</div></article></section><section class="panel"><p class="eyebrow">Operating timeline</p><h2>Admin checklist from clearance to 30 days</h2><div class="admin-timeline">${adminTimeline.map(([title,detail],i)=>`<article><span>${i+1}</span><div><b>${esc(title)}</b><p>${esc(detail)}</p></div></article>`).join('')}</div><div class="admin-actions"><button>Generate welcome message</button><button>Verify BBSI complete</button><button>Assign supervisor handoff</button><button>Schedule 30-day check-in</button></div></section>`;
}
function adminSection(){ return `<section class="panel"><p class="eyebrow">Internal review guide</p><h2>Questions for Goff/BBSI walkthrough</h2><p>Use this as the conversation guide before finalizing automation. Build the draft pages now; finalize routing/signatures/reminders after Goff confirms the actual process.</p><div class="handoff"><div><span>Employee</span><b>${esc(PROFILE.employeeName)}</b></div><div><span>Portal status</span><b>Training path drafted</b></div><div><span>BBSI</span><b>Boundary marked</b></div><div><span>Next admin action</span><b>Confirm routing + signoffs</b></div></div><div class="question-list">${adminQuestions.map(([topic,q])=>`<article><span>${esc(topic)}</span><b>${esc(q)}</b></article>`).join('')}</div><div class="admin-actions"><button>Generate welcome email</button><button>Send day-before reminder</button><button>Mark BBSI complete</button><button>Schedule 30-day check-in</button></div></section>`; }

function main(){
  if(section==='start') return startSection();
  if(section==='ops') return opsSection();
  if(section==='training') return trainingSection();
  if(section==='before') return contentPage('before');
  if(section==='bbsi') return contentPage('bbsi');
  if(section==='exaktime') return contentPage('exaktime');
  if(section==='safety') return contentPage('safety');
  if(section==='forms') return formsSection();
  if(section==='tools') return contentPage('tools');
  if(section==='handoff') return contentPage('handoff');
  if(section==='checkin') return checkinSection();
  if(section==='admin') return adminSection();
  return startSection();
}
function render(){ document.getElementById('app').innerHTML = `${header()}<main class="wrap">${tabs()}${main()}</main><footer>Private Goff Welding employee portal prototype • Draft content pending Goff/BBSI review • Formal payroll/compliance remains with BBSI/myBBSI.</footer>`; }
render();
