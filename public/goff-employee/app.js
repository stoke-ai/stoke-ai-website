const PROFILE = {
  employeeName: 'Ricky Lambert',
  firstName: 'Ricky',
  role: 'Sanitary Stainless Steel Welder / Fabricator',
  supervisor: 'Quinton Goff',
  startDate: 'Monday, July 8',
  startTime: '6:00 AM',
  location: 'Goff Welding • 531 W 100 S #24, Paul, ID',
  status: 'Cleared for onboarding',
  contact: 'Goff admin / supervisor',
};

const pages = [
  ['start','Start here','Employee'],
  ['course','Orientation course','Employee'],
  ['training','Training path','Employee'],
  ['values','Mission / values','Employee'],
  ['bbsi','BBSI / myBBSI','Employee'],
  ['exaktime','ExakTime','Employee'],
  ['safety','Safety + quiz','Employee'],
  ['policies','Policies','Employee'],
  ['tools','Tools / PPE','Employee'],
  ['forms','Company links','Employee'],
  ['role','Role expectations','Employee'],
  ['resources','Resources','Employee'],
  ['help','Help / questions','Employee'],
  ['milestones','Milestones','Employee'],
  ['ops','Admin control','Admin'],
  ['clearance','Clearance hold','Admin'],
  ['handoff','Manager handoff','Admin'],
  ['admin','Austin review','Review'],
];

let courseIndex = 0;

// 30,000-foot orientation per Austin's 2026-07-01 direction: wide-lens company
// view only. Specific safety content moved to the Safety Training section;
// policy detail moved to the policy walkthrough. Content rebuilt natively from
// the designed onboarding deck (slides preserved in course-slides/) + Austin's
// welcome packet language.
const ORIENTATION_STEPS = [
  { austin:true, theme:'dark', eyebrow:'First day employee orientation', title:'Welcome to Goff Welding',
    lede:'Quality workmanship. Dependable service. Everyone home safe — every single day.',
    body:'On behalf of your colleagues, welcome to Goff Welding. Every employee plays a direct role in our success, and we hope you feel proud of the work you do here.',
    prompt:'You are not just starting a job. You are joining the group of people who build, solve problems, and stand behind the work together.' },
  { austin:true, theme:'dark', eyebrow:'Why your work matters', title:'You are part of what we build together',
    body:'At Goff, the quality of the work depends on each person taking responsibility for their part. The work you do affects your team, our customers, and the reputation of the company.',
    prompt:'Take pride in your work. Finish what you start. Represent Goff Welding with pride.' },
  { eyebrow:'Who we are', title:'Our mission and vision',
    cards:[
      ['Our mission','To deliver superior craftsmanship and dependable service on every project — solving our customers’ toughest challenges through skilled fabrication, sound engineering, and an unwavering commitment to getting everyone home safe.','flag'],
      ['Our vision','To be the most trusted name in metal fabrication and pipe welding in the Mountain West — known for work that lasts, people who care, and a shop where safety and quality never take a back seat.','eye'],
    ] },
  { eyebrow:'Our purpose', title:'Why we come to work',
    cards:[
      ['Quality workmanship','Deliver superior craftsmanship and high-quality results on every single project, ensuring durability and precision.','star'],
      ['Customer problems','Solve complex client challenges through active collaboration, innovative engineering, and reliable service.','bulb'],
      ['Operate safely','Safety is our absolute priority. Maintain a secure work environment where everyone goes home safely.','shield'],
    ] },
  { eyebrow:'Our values', title:'How we carry ourselves',
    cards:[
      ['Integrity','Doing what is right, even when no one is watching.','shield'],
      ['Humility','Always willing to learn, listen, and grow from others.','cap'],
      ['Respect','Valuing diverse perspectives and treating everyone with dignity.','users'],
      ['Accountability','Taking ownership of our work, decisions, and overall safety.','clipboard'],
    ],
    prompt:'These values should show up in small daily choices — how you communicate, how you handle mistakes, and how you respond to feedback.' },
  { eyebrow:'Your first 90 days', title:'What good looks like, early', numbered:true,
    cards:[
      ['Learn processes','Master foundational workflows, understand safety protocols, and build a solid technical base.'],
      ['Demonstrate reliability','Deliver consistent quality, prove dependability in teamwork, and commit to incident-free operations.'],
      ['Develop proficiency','Refine advanced technical skills, increase project efficiency, and execute high-quality craft welds.'],
    ] },
  { austin:true, theme:'dark', eyebrow:'The standard we hold', title:'Show up ready, ask questions, and keep your word',
    body:'Goff looks for quality work, productivity, professionalism, and accountability. Talk less, do more. Be specific. Keep your word. Know where to draw the line on integrity.',
    prompt:'Nobody expects you to know everything on day one. We do expect you to pay attention, ask before guessing, and care about doing good work.' },
  { eyebrow:'Team communication', title:'Clear signals, fewer mistakes',
    body:'Clear communication prevents mistakes and improves safety on a busy shop floor.',
    cards:[
      ['Active listening','Confirm understanding before starting any task — repeat it back if you’re unsure.','ear'],
      ['Hazard alerts','Immediately report any shop safety concerns or issues to those around you.','megaphone'],
      ['Clear signals','Use standardized hand signals on the welding floor where noise limits voice.','chat'],
    ] },
  { eyebrow:'First week checklist', title:'Your first five days',
    cards:[
      ['Paperwork','Complete all HR documents, tax forms, and employment agreements.','doc'],
      ['Safety training','Review mandatory shop safety rules and protective gear protocols.','helmet'],
      ['Meet your team','Get introduced to your crew, shop leads, and department supervisor.','users'],
      ['Learn procedures','Familiarize yourself with welding workflows and quality standards.','wrench'],
    ] },
  { eyebrow:'Recognition', title:'Honoring our unsung heroes',
    body:'The Spark Award honors Goff Welding’s unsung heroes — individuals who ignite positive change through their craftsmanship, kindness, and dedication.',
    cards:[
      ['How to nominate','Nominate a coworker on the company links page — it only takes a minute.','trophy'],
      ['Rewards & recognition','Nominees receive a sticker each month. Top quarterly nominees enter the yearly big drawing.','sparkle'],
    ] },
  { austin:true, theme:'dark', eyebrow:'What happens next', title:'Your first day has a clear path',
    body:'After this orientation you will acknowledge the company policies, complete the safety training sections, learn work basics like timekeeping, and finish with a supervisor handoff. Your paperwork is already done through myBBSI — that’s what cleared you to start. Ask questions early and often — we’re here to help you succeed.',
    prompt:'Next step: continue through the onboarding path in order.' },
  { quiz:['kc10','kc11','kc12','kc13'], eyebrow:'Quick check — four questions', title:'Show us you caught the important parts',
    body:'Answer these before finishing orientation. Get one wrong? No problem — re-read and try again. Your answers and retries are part of your training record.' },
  { theme:'red', eyebrow:'Welcome to the team', title:'We’re glad you’re here',
    body:'Welcome to Goff Welding. We’re thrilled to have you join our team of dedicated professionals committed to quality, precision, and craftsmanship.',
    prompt:'Finish orientation to unlock the rest of your onboarding path.' },
];

// Inline brand icons for orientation cards (stroke uses currentColor).
const ORIENT_ICONS = {
  flag:'<path d="M6 21V4h11l-2 3.5L17 11H6"/>',
  eye:'<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/>',
  star:'<path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.8 6.6 19.7l1.2-5.9L3.4 9.7l6-.7z"/>',
  bulb:'<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.1 1.4 1.2 2.4h5.2c.1-1 .5-1.8 1.2-2.4A6 6 0 0 0 12 3z"/>',
  shield:'<path d="M12 3l7 2.6v5.1c0 4.4-3 7.4-7 8.8-4-1.4-7-4.4-7-8.8V5.6L12 3z"/><path d="M9 12l2 2 4-4.2"/>',
  cap:'<path d="M12 4L2 8.5l10 4.5 10-4.5L12 4z"/><path d="M6 10.5v4c0 1.2 3 2.6 6 2.6s6-1.4 6-2.6v-4"/>',
  users:'<circle cx="9" cy="9" r="3.1"/><path d="M3.5 19c.4-3 2.8-4.8 5.5-4.8s5.1 1.8 5.5 4.8"/><path d="M16 6.4a3 3 0 0 1 0 5.9"/><path d="M17.5 19c-.2-1.9-1-3.3-2.3-4.2"/>',
  clipboard:'<rect x="6" y="4.5" width="12" height="15.5" rx="2"/><path d="M9.2 4.5h5.6v2.4H9.2z"/><path d="M9 13.2l2 2 3.8-4"/>',
  ear:'<path d="M8 9a4 4 0 1 1 7.5 2c-.8 1.4-2.3 2-2.8 3.4a2.4 2.4 0 0 1-4.6-.4"/><path d="M10 9.2a2 2 0 0 1 3.4 1.3"/>',
  megaphone:'<path d="M4 10v4l11 4.5V5.5L4 10z"/><path d="M15 8.5v7"/><path d="M18.5 9.5v5"/>',
  chat:'<path d="M4.5 5.5h15v9h-9l-4 3.2v-3.2h-2z"/><path d="M8 9.5h8M8 12h5"/>',
  doc:'<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4"/><path d="M9.5 13h5M9.5 16.5h5"/>',
  helmet:'<path d="M4 15.5a8 8 0 0 1 16 0"/><rect x="3" y="15.5" width="18" height="2.6" rx="1.2"/><path d="M10 7.5v4M14 7.5v4"/>',
  wrench:'<path d="M15.5 6.5a3.8 3.8 0 0 1-4.9 4.9l-5.2 5.2 2 2 5.2-5.2a3.8 3.8 0 0 0 4.9-4.9l-2.2 2.2-2-.5-.5-2 2.7-1.7z"/>',
  trophy:'<path d="M8 4.5h8V9a4 4 0 0 1-8 0V4.5z"/><path d="M8 6.5H5V8a3 3 0 0 0 3 3M16 6.5h3V8a3 3 0 0 1-3 3"/><path d="M12 13v3.5M9 20h6M10.2 20l.4-3.5h2.8l.4 3.5"/>',
  sparkle:'<path d="M12 3.5l1.6 5.2 5.2 1.6-5.2 1.6L12 17l-1.6-5.1L5.2 10.3l5.2-1.6z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
};
function orientIcon(name){ return `<svg class="orient-ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ORIENT_ICONS[name] || ORIENT_ICONS.star}</svg>`; }

// Knowledge checks rebuilt from the deck — natively tappable with attempt
// tracking (Austin: the PPT version just advanced on any click; he wants to
// see who breezed through vs who had to second-guess).
// Correct answers are deliberately spread across A/B/C/D — the original deck
// had every correct answer at B, which teaches "always tap B" and defeats the
// attempt tracking.
const KNOWLEDGE_CHECKS = {
  kc1:{ q:'You notice a frayed cable creating an unsafe condition mid-job. What should you do?', options:['Finish your current task first, then mention it','Wait for a supervisor to notice it','Use your Stop Work Authority and halt the job immediately','Only stop if someone could get hurt today'], correct:2 },
  kc2:{ q:'Which PPE is required at all times while you are on the shop floor?', options:['Safety glasses and steel-toe footwear','Only gloves, and only while welding','A hard hat only during overhead work','PPE is optional for experienced welders'], correct:0 },
  kc3:{ q:'Before operating any machine, what must you confirm first?', options:['That you are the only person in the shop','That your phone is fully charged','That it is after your lunch break','That machine guards are in place and aisles are clear'], correct:3 },
  kc4:{ q:'You have just finished using a grinder. What is the correct way to handle it?', options:['Leave it out so it is easy to grab next time','Return it to its designated storage rack immediately','Set it on the nearest workstation','Wait until the end of shift to put everything away'], correct:1 },
  kc5:{ q:'Who is permitted to operate a company vehicle?', options:['Any employee who is in a hurry','Anyone who holds a driver license','Only designated employees with a valid license and company approval','Whoever happens to have the keys'], correct:2 },
  kc6:{ q:'What is Goff Welding’s policy on impairment while on duty?', options:['Zero tolerance — impairment of any kind is strictly prohibited','Allowed during breaks only','Acceptable if it does not affect your work','Only tested after an incident occurs'], correct:0 },
  kc7:{ q:'Which of the following must be kept confidential?', options:['Only customer credit-card numbers','Nothing — our work is public','Only documents marked “secret”','Customer info, drawings, pricing, and company processes'], correct:3 },
  kc8:{ q:'You realize you will be late for your shift. What should you do?', options:['Wait and explain once you arrive','Communicate the delay as early as possible','Have a coworker quietly cover for you','Nothing, as long as it rarely happens'], correct:1 },
  kc9:{ q:'When may you operate shop machinery or welding equipment?', options:['As soon as you start your shift','Whenever the equipment is available','Only after proper training AND supervisor authorization','After watching someone else do it once'], correct:2 },
  // Orientation wrap-up check — per Austin: "they've passed two or three
  // questions" is the satisfactory-consumption signal. Light, not pass/fail.
  kc10:{ q:'What are Goff Welding’s four core values?', options:['Speed, strength, silence, and sales','Profit, punctuality, pride, and power','Talent, toughness, tradition, and trust','Integrity, humility, respect, and accountability'], correct:3 },
  kc11:{ q:'Which of these is Goff’s absolute priority on every single job?', options:['Operating safely so everyone goes home — every single day','Finishing as fast as possible','Using the least amount of material','Beating the estimate no matter what'], correct:0 },
  kc12:{ q:'What does “good” look like in your first 90 days?', options:['Keep your head down and stay quiet','Memorize every policy word-for-word','Learn processes, demonstrate reliability, develop proficiency','Work overtime every week'], correct:2 },
  kc13:{ q:'You’re not sure how to start a task. What does Goff expect you to do?', options:['Guess and keep moving so you look busy','Ask instead of guessing — repeat the task back if you’re unsure','Wait until someone notices you’re stuck','Skip it and start something else'], correct:1 },
};
const ORIENTATION_QUIZ = ['kc10','kc11','kc12','kc13'];
function orientationQuizDone(){ return ORIENTATION_QUIZ.every(id => kcState[id]?.correct); }
let kcState = (() => { try { return JSON.parse(safeGetEarly('goffKCv1') || '{}'); } catch(_) { return {}; } })();
function answerKC(id, idx){
  const kc = KNOWLEDGE_CHECKS[id]; if(!kc) return;
  const s = kcState[id] || { attempts:0, correct:false, picked:null };
  if(s.correct) return;
  s.attempts++; s.picked = idx; s.correct = idx === kc.correct;
  kcState[id] = s;
  safeSet('goffKCv1', JSON.stringify(kcState));
  render();
}
function kcCard(id, label){
  const kc = KNOWLEDGE_CHECKS[id]; if(!kc) return '';
  const s = kcState[id] || { attempts:0, correct:false, picked:null };
  const letters = ['A','B','C','D'];
  return `<div class="kc-card ${s.correct?'kc-done':''}"><p class="eyebrow">${esc(label || 'Knowledge check')}</p><h4>${esc(kc.q)}</h4>
  <div class="kc-options">${kc.options.map((opt,i)=>{
    const cls = s.correct && i===kc.correct ? 'kc-right' : (!s.correct && s.picked===i ? 'kc-wrong' : '');
    return `<button class="kc-opt ${cls}" onclick="answerKC('${id}',${i})" ${s.correct?'disabled':''}><span>${letters[i]}</span>${esc(opt)}</button>`;
  }).join('')}</div>
  ${s.correct ? `<p class="kc-feedback ok">✓ Correct${s.attempts===1?' — first try':` — after ${s.attempts} attempts (tracked for your record)`}</p>` : s.attempts>0 ? `<p class="kc-feedback no">✗ Not quite — re-read the section above and try again. Attempts are tracked.</p>` : `<p class="kc-feedback">Select an answer to continue.</p>`}</div>`;
}
function kcStats(){
  const all = Object.keys(KNOWLEDGE_CHECKS);
  const done = all.filter(id => kcState[id]?.correct);
  const firstTry = done.filter(id => kcState[id].attempts === 1);
  return { total: all.length, done: done.length, firstTry: firstTry.length, retried: done.length - firstTry.length };
}

const workflow = [
  { label:'Offer accepted', detail:'Candidate said yes. Do not treat as hired yet.', status:'Recruiting' },
  { label:'Clearance hold', detail:'Drug screen, background, and start date are confirmed.', status:'Guardrail' },
  { label:'BBSI invite + portal', detail:'myBBSI invite goes out and the employee receives one Goff start-here link.', status:'Onboarding' },
  { label:'Training path', detail:'Employee learns timekeeping, safety, company links, tools, and expectations in one sequence.', status:'Training' },
  { label:'Manager handoff', detail:'Supervisor confirms first work assignment, role expectations, and open questions.', status:'Employee' },
  { label:'30-day check-in', detail:'Goff revisits links/forms, time off, expectations, tools, and questions after real work experience.', status:'Follow-up' },
];

const trainingSteps = [
  { id:'welcome', title:'Welcome / start here', owner:'Employee', timing:'Start here', why:'Understand the onboarding path, what must be completed, and where to get help.', page:'before' },
  { id:'values', title:'Mission, vision, values', owner:'Employee', timing:'Start here', why:'Align the new hire with Goff expectations: ownership, integrity, respect, communication, reliability, and pride.', page:'values' },
  { id:'clearance', title:'Clearance hold', owner:'Admin', timing:'Before portal access', why:'Keep Offer Accepted separate from Hired until drug screen, background, and start date are confirmed.', page:'clearance' },
  { id:'bbsi', title:'BBSI / myBBSI paperwork', owner:'Admin + BBSI', timing:'Before day one (prerequisite)', why:'Handled before training even starts: BBSI (Goff’s payroll/HR partner) collects payroll, tax, and employment documents and signals when the hire is ready to work. The portal tracks the status; the employee page becomes a reference.', page:'bbsi' },
  { id:'policies', title:'Required forms / policies', owner:'Employee + Admin', timing:'Before day one', why:'Track what is required, what is only read/acknowledge, and what is handled by BBSI.', page:'policies' },
  { id:'exaktime', title:'ExakTime / timekeeping', owner:'Employee', timing:'Before day one / day one', why:'Know how to clock in/out, review time, report missed punches, and approve time cards.', page:'exaktime' },
  { id:'safety', title:'Safety orientation + quiz', owner:'Employee + Dale/Supervisor', timing:'Day one', why:'Make safety expectations consistent and connect quiz results to the employee onboarding record.', page:'safety' },
  { id:'tools', title:'Tools, apparel, and PPE', owner:'Employee + Supervisor', timing:'Week one', why:'Clarify what is required now, what can wait, and what needs supervisor acknowledgement.', page:'tools' },
  { id:'forms', title:'Company links and forms', owner:'Employee', timing:'Day one / week one', why:'Know when to use damage reports, time off, truck check-in, purchase requests, and Spark Award.', page:'forms' },
  { id:'role', title:'Role expectations / KRA', owner:'Employee + Supervisor', timing:'Manager handoff', why:'Give every new hire a clear “what success looks like in this role” page.', page:'role' },
  { id:'handoff', title:'Manager handoff', owner:'Supervisor', timing:'After safety/training', why:'Move from onboarding into actual job expectations and first assignment.', page:'handoff' },
  { id:'milestones', title:'30/90/180/365-day milestones', owner:'Supervisor / Admin', timing:'After start', why:'Schedule the second-pass check-ins and reviews that keep onboarding from fading after day one.', page:'milestones' },
];

const pageContent = {
  values: {
    kicker:'Goff-specific expectations',
    title:'Mission, vision, values',
    summary:'This replaces generic onboarding language with the Goff-specific foundation from the updated new-hire packet: add value, take ownership, stand behind the work, and improve continuously.',
    blocks:[
      ['Vision','Be known for adding value — always — by taking ownership and standing behind everything Goff does.'],
      ['Mission','Add value every day through integrity, respect, and continuous improvement.'],
      ['Core values','Integrity, humility, respect, and accountability. These should show up in how employees communicate, finish work, handle feedback, and represent the company.'],
      ['What Goff expects','Reliability, ownership, work ethic, communication, and pride in the quality of what is produced.'],
      ['Living the values','Take pride in your work, finish what you start, do what needs done without being asked, keep your word, ride for the brand, say less/do more, communicate clearly, and know where integrity is not negotiable.'],
      ['En Español — confirmed for v1','“¡Bienvenido a Goff Welding LLC!” — Visión: ser conocidos por agregar valor, siempre. Misión: agregamos valor todos los días a través de la integridad, el respeto y la mejora continua. Valores: integridad, humildad, respeto, responsabilidad. The full Spanish welcome (from “Welcome to Goff Value - Spanish”) ships as a language toggle in production.'],
    ],
    questions:['Does Austin want this exact wording from the updated packet?','Should values include short scenario questions?','Does Goff want employee acknowledgement stored for values/expectations?','Spanish welcome is confirmed in — should ExakTime and payroll-deduction Spanish docs join it in v1?']
  },
  clearance: {
    kicker:'Pre-employment guardrail',
    title:'Offer accepted is not hired yet',
    summary:'The Drive SOP is clear: Offer Accepted is a control point, not a hired stage. The employee portal opens after drug screen, background/N/A, and start date are confirmed.',
    blocks:[
      ['Drug screen','Schedule and complete the pre-employment drug screen. The uploaded packet notes that delays may push the first day of employment.'],
      ['Background check','Track background check status as pending, cleared, failed, or N/A. Do not move to onboarding until cleared or marked N/A.'],
      ['Start date confirmed','Confirm exact start date, start time, location, and who the employee reports to before sending the full onboarding path.'],
      ['Admin status','Admin should see offer accepted, drug screen, background, start date, clearance complete, and next action.'],
    ],
    questions:['Who updates drug screen status?','Who updates background status?','Who confirms final start date/time/location?','What message should go to candidates while they are on clearance hold?']
  },
  policies: {
    kicker:'Required documents',
    title:'Forms and policy acknowledgements',
    summary:'This is where the portal stops being a file dump. Each document becomes either BBSI-managed, read/acknowledge, signature required, role-specific, or admin-only.',
    blocks:[
      ['Build as trackable statuses','Each item should show not required, pending, complete, waived, or needs admin review.'],
      ['Employee-facing policies','Handbook, drug and alcohol, vacation, hard hat, apparel, unexcused absences, workplace communication, and vehicle policy after Goff approves current versions.'],
      ['NEW: Per diem & travel policy','Added to Drive 2026-07-01. Now drafted as its own portal module with rates, eligibility rules, and the required employee acknowledgement. Open it from Resources or the training path.'],
      ['Secure / employee-specific','Direct deposit, I-9/W-4 status, NDA, video release, offer letter, and signed acknowledgements should be secure and role/applicability-based.'],
      ['Do not replace BBSI yet','Do not rebuild legal/HR signature workflows until Goff confirms ownership. The portal should organize and track v1.'],
    ],
    questions:['Which policy versions are official/current?','Which require signature vs read acknowledgement?','Does direct deposit happen in BBSI or Goff?','Which forms apply to every employee vs role-specific?']
  },
  role: {
    kicker:'Role-specific onboarding',
    title:'Role expectations / KRA',
    summary:'The KRA folder should become role-specific onboarding pages: what this role exists to do, what success looks like, what to watch for, and what the supervisor will review.',
    blocks:[
      ['Role identity','Use the approved KRA/job description to explain why the role exists and how it contributes to Goff.'],
      ['Key result areas','Turn the KRA into practical expectations: work quality, safety, communication, productivity, reliability, and ownership.'],
      ['Supervisor handoff','The supervisor reviews the employee’s actual first assignment, quality standards, pace, and who to ask for help.'],
      ['Role-based resources','Attach role-specific tool lists, PPE, company forms, and training requirements once approved.'],
    ],
    questions:['Are KRAs employee-visible by role?','Which KRA/job description is current for each role?','Who assigns the role-specific onboarding packet?','What should be manager-only vs employee-facing?']
  },
  milestones: {
    kicker:'Post-start follow-up',
    title:'30 / 90 / 180 / 365-day milestones',
    summary:'Goff has milestone material in Drive. The portal should turn it into reminders and check-ins, not leave it as a forgotten document.',
    blocks:[
      ['Day one','Paperwork, start details, safety basics, ExakTime, tools/apparel/PPE, and supervisor handoff.'],
      ['30 days','Tool check, ExakTime confidence, safety questions, role expectations, company links/forms, and employee questions.'],
      ['3 months','Evaluation reminder and early performance/fit review.'],
      ['6 months','Evaluation, referral payout if applicable, urgent care item if applicable, and role progression check.'],
      ['1 year','Evaluation, PTO benefits, referral payout if applicable, and longer-term development.'],
    ],
    questions:['Who owns each milestone?','Should reminders go to supervisor, admin, or both?','What exact form/template is used at each review?','What counts as milestone complete?']
  },
  before: {
    kicker:'Start-here training',
    title:'Before your first day',
    summary:'This is the employee-facing version of the new-hire checklist. The goal is one clear path before the employee arrives, not scattered PDFs and texts.',
    blocks:[
      ['Complete myBBSI onboarding','Watch for the BBSI/myBBSI invite and complete required payroll/HR steps before your first day. If the link expires or does not work, contact Goff Welding.'],
      ['Confirm where and when to arrive',`First day: ${PROFILE.startDate}. Start time: ${PROFILE.startTime}. Location: ${PROFILE.location}. Supervisor: ${PROFILE.supervisor}.`],
      ['When you get here','Park along the east side of the east shop buildings, then follow your supervisor’s direction or report to the shop. The breakroom (fridge and microwave) is in the west shops, immediately as you walk in. PPE is available in the parts room, at each shop entrance, and in work trailers.'],
      ['Your first paycheck','Payday is weekly on Fridays. Your first paycheck will be a paper check while direct deposit is being processed, which can take up to two weeks.'],
      ['Review the training path','Before day one, review timekeeping, safety basics, tools/apparel, and company forms so the first day is not a fire hose.'],
      ['Bring what BBSI/Goff requested','Bring identification or documents requested through the approved BBSI process. Do not text/email sensitive payroll or identity documents unless instructed through an approved process.'],
    ],
    questions:['Who sends the final first-day text/email?','Who verifies myBBSI completion before start?','Does BBSI require anything physically brought on day one?','What exact wording should new hires receive the day before start?']
  },
  bbsi: {
    kicker:'Completed before your first day — reference page',
    title:'BBSI / myBBSI — payroll & employment paperwork',
    summary:'BBSI (Barrett Business Services) is Goff’s payroll and HR partner — a nationwide PEO that handles employment paperwork, payroll, taxes, and workers’ comp. You completed your myBBSI onboarding before your first day; that’s what cleared you to start. This page is your reference for what lives there.',
    blocks:[
      ['What you already did','Before day one you received a myBBSI invite and completed payroll setup, tax forms (W-4), employment eligibility (I-9), and BBSI-required documents. BBSI notifies Goff when you are fully compliant and ready to work.'],
      ['What lives in myBBSI going forward','Your paystubs, tax information and filing-status changes, and employment records. Payday is weekly on Fridays; your first check is paper while direct deposit processes (up to two weeks).'],
      ['If something is wrong','Login trouble or a document issue in myBBSI? Contact HR or the Office Manager — they coordinate with BBSI for you.'],
      ['Sensitive information','Never send payroll, tax, banking, or identity documents by ordinary text/email. Everything sensitive goes through myBBSI or an approved Goff process.'],
    ],
    questions:['Confirming with Quinton: is myBBSI completion always required before new-hire training begins (assumed yes — awaiting reply)?','Who at Goff resends expired myBBSI invites?','What exact signal does Goff receive when BBSI marks someone ready to work?']
  },
  exaktime: {
    kicker:'Timekeeping training',
    title:'ExakTime / clocking in',
    summary:'This turns the ExakTime PDF into a phone-friendly training page employees can revisit after day one.',
    blocks:[
      ['Download and activate','Install ExakTime Mobile if instructed. Goff will provide the activation code or setup help. Do not share login/activation info.'],
      ['Clock in and out','Only clock in when you are on-site and ready to begin work. Clock out for lunch, back in after lunch, and out at the end of the shift. If you didn’t take a lunch break, add a note in the app.'],
      ['Missed punch or correction','If you forget to clock in/out, clock in as soon as possible and add a note explaining the missed punch. Tell your supervisor.'],
      ['Job changes','If you switch jobs during the day, log each job change in the ExakTime app so time is tied to the right work.'],
      ['Timecard approval','Timecards are approved every Monday in the ExakTime app.'],
      ['Six questions, every entry','Don’t just write “welding” or “working.” Every entry answers: WHAT exactly (“Welding Stainless 3″ Pipe”), WHERE (Burley, Paul, Field, Town, The Shop), WHO we’re billing (exact client), HOW long (nearest quarter hour), WHEN done (status), and DID you break (log lunches).'],
      ['Time off requests','Request time off in the ExakTime app at least two weeks in advance.'],
    ],
    questions:['Who issues activation codes?','What are the exact lunch punch rules?','Do shop and field roles use ExakTime differently?','Who approves time-off requests submitted in ExakTime?']
  },
  safety: {
    kicker:'Safety training',
    title:'Safety orientation',
    summary:'Safety should be taught consistently before hands-on work. The shell is ready now; Dale supplies the final topic list, question count, and timing. Quiz answers/results should connect back to the employee onboarding record.',
    blocks:[
      ['Stop and ask','Stop and ask if a task feels unsafe, unclear, or outside your training. Report hazards, near misses, and injuries right away — even minor ones.'],
      ['PPE expectations','Safety glasses and hearing protection are worn any time you are on the shop floor or a jobsite. Certain jobs add welding helmets, face shields, respirators, or cut/heat-resistant gloves — with training provided. Goff provides OSHA-required PPE free of charge.'],
      ['If you are injured','Report to your supervisor immediately. For serious injuries dial 9-1-1 and/or have a supervisor transport to the hospital / WorkMed facility. Report all accidents and near misses even when no treatment is needed.'],
      ['Emergency evacuation','When the alarm sounds or a supervisor tells you, leave promptly — do not wait to see if it is “real.” The Evacuation Assembly Point is the northeast side of the Main Office building parking lot. Evacuation plans are posted at every exit.'],
      ['Equipment / lockout-tagout','Do not operate equipment you have not been trained on. Make sure guards are in place, know the emergency stops, never leave running equipment unattended. You are not authorized to climb ladders over 8 feet, drive motor vehicles, or operate heavy equipment without specific authorization.'],
      ['Before every job','A Pre-Job Hazard Assessment is required before starting any job (form in Company Links). Safety training continues with monthly safety meetings after you start.'],
    ],
    questions:['Which safety quiz is current?','Who reviews quiz results?','Which items differ by shop vs field role?','What hands-on safety steps happen after the portal training?']
  },
  tools: {
    kicker:'Draft from the Employee Tool List Requirement Form (Drive) — confirm current version',
    title:'Tools, apparel, and PPE',
    summary:'Every employee is required to have specific tools at the start of employment. A tool inspection happens about 30 days after your start date — missing tools are supplied from the parts room and the cost is deducted from your paycheck, so it pays to show up ready.',
    blocks:[
      ['Required for everyone','Metric + standard Allen wrench sets, ball peen hammer (1 lb), center punch, chain wrench with extension, channel lock pliers (8"–12", 2), combination squares (6" & 12"), combination wrench set (3/8"–1¼"), adjustable wrenches (8"/10"/12"), dead blow hammer, framing squares (1 ft & 2 ft), levels (2 ft & 4 ft), rolling tool box, pipe wrap, pipe wrenches (12"–24", 2), speed square.'],
      ['Fitter-specific','2-hole pins (set), center finder, plumb bob or laser.'],
      ['Welder-specific','Lineman pliers, slag hammer, welding helmet.'],
      ['30-day inspection','Your supervisor verifies all required tools are present and in good working condition at roughly 30 days. Missing tools are company-supplied and paycheck-deducted. Maintaining them is a condition of work assignment.'],
      ['PPE provided by Goff','OSHA-required PPE is provided free and replaced when broken or worn out. Safety glasses and hearing protection are always worn on the shop floor or jobsite. Find PPE in the parts room, shop entrances, and work trailers.'],
      ['Signature required','The Tool List Requirement Form is signed by you and your supervisor. In production the portal captures this acknowledgement on your record.'],
    ],
    questions:['Is the Tool List Requirement Form (Drive) the current version — docx or PDF master?','Do helper/entry roles have a reduced list?','Who approves exceptions or payment plans for missing tools?','Which apparel items does Goff issue vs employee-provided?']
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
  },
  perdiem: {
    kicker:'New policy — added to Drive 2026-07-01 (draft, confirm before publishing)',
    title:'Per diem & travel reimbursement',
    summary:'This explains how per diem, lodging, travel stipends, and mileage are handled at Goff Welding. Per diem is a daily allowance for approved overnight travel — it is not extra pay, not guaranteed, and not paid for local travel where you can reasonably return home the same day.',
    blocks:[
      ['When per diem applies','Only when all three are true: an overnight stay is required for the job, the travel is approved by management, and the job is outside the reasonable daily commute range (roughly 1 hour or 60 miles one way).'],
      ['Meals & incidentals (M&IE)','$60 per day flat for standard overnight travel — no receipts required. Up to $75 per day in high-cost areas (based on GSA allowances, management approval required). Covers meals, tips, and small incidentals. Paid only for approved overnight travel days.'],
      ['Lodging','Handled separately from per diem. Target rate $90 per night; up to $110 in high-cost areas with manager approval. Booked and paid by Goff directly, or reimbursed with a valid receipt. Unused lodging amounts are not paid out.'],
      ['Day travel stipend','For extended-distance day trips with no overnight stay: up to $30 per day, at company discretion. Not GSA per diem and not guaranteed.'],
      ['What per diem does NOT cover','Fuel or mileage, tools or supplies, personal entertainment, or lodging costs/taxes. Vehicle use and mileage follow the Goff Welding Truck Policy.'],
      ['Partial days & missed work','If an overnight stay is required, the full daily M&IE rate applies — per diem is based on travel status, not hours worked. If you call in sick or do not work, M&IE may be withheld at management discretion.'],
      ['Acknowledgement required','Employees sign an acknowledgement that per diem applies only to approved overnight travel, day stipends are separate, and lodging/mileage are handled separately. The portal will capture this signature once the production database is live.'],
    ],
    questions:['Is this the final approved version (added to Drive today) — effective when?','Does this replace the Travel & Business Expense Reimbursement Policy v9.21.24?','Who approves high-cost-area rates and lodging over target?','Is the $10–$25 booking handling fee being implemented?','Signature required at hire, per policy change, or both?']
  }
};

// FAQ content sourced from "Goff Welding FAQs.pdf" (Drive > Goff Forms, added 2026-07-01).
const FAQ_DATA = [
  { category:'General', items:[
    ['Where can I see who to report to or how the company is structured?','In the Work Schedule under the organizational chart tab.'],
    ['Where can I find the Work Schedule?','The Work Schedule is in Google Sheets. Log in with your company email and use the Google Sheets app on your phone. Look for the document labeled “Work Schedule.” If you don’t have a company email, a link will be provided.'],
    ['What does the Work Schedule include?','Your weekly schedule (by date tab), organizational chart, job duties, employee contact list, group email directory, and the Company Links page with documents and tools you use daily.'],
    ['Where can I find company documents and forms?','In the Work Schedule under the “Company Links” page.'],
    ['Where can I find the Employee Handbook?','Work Schedule → Company Links → Employee Handbook → Employee Copy.pdf.'],
    ['Where can I find the Safety Manual?','Work Schedule → Company Links → Safety Manual.docx.'],
    ['Who do I contact if I lose access to the Work Schedule?','Contact the Scheduler.'],
  ]},
  { category:'First day & facility', items:[
    ['Where do I park?','Park along the east side of the east shop buildings.'],
    ['Where do I go when I arrive?','Follow your supervisor’s direction or report to the shop.'],
    ['Where are the restrooms?','On the north-east bays of each set of shops.'],
    ['Where is the breakroom?','In the west shops, immediately as you walk in. It includes a fridge and microwave.'],
    ['Where can I find PPE?','In the parts room, at the entrance of each shop, and in work trailers.'],
  ]},
  { category:'Time, pay & scheduling', items:[
    ['Where do I clock in and out?','In the ExakTime app.'],
    ['When should I clock in?','Only clock in when you are on-site and ready to begin work.'],
    ['What if I forget to clock in or out?','Clock in as soon as possible and add a note explaining the missed punch.'],
    ['What if I switch jobs during the day?','Log each job change in the ExakTime app.'],
    ['What if I didn’t take a lunch break?','Add a note in the ExakTime app.'],
    ['When do timecards need to be approved?','Every Monday in the ExakTime app.'],
    ['Where do I request time off?','In the ExakTime app, at least two weeks in advance.'],
    ['Where can I see my paystub?','In your MyBBSI login.'],
    ['How do I update my tax information?','Through your MyBBSI login.'],
  ]},
  { category:'Materials & purchasing', items:[
    ['What if I need materials for a job?','Notify your supervisor first. If directed, submit a Purchase Request.'],
    ['Where is the Purchase Request Form?','Work Schedule → Company Links → Purchase Request Form.'],
    ['Who orders materials?','The inventory/procurement team. Only order or pick up materials yourself if directed by your supervisor.'],
    ['What if materials are missing or run out during a job?','Communicate it immediately to your supervisor.'],
    ['What if I notice inventory is low on common items?','Report it to your supervisor or inventory.'],
  ]},
  { category:'Safety & incident reporting', items:[
    ['Do I need a hazard assessment before starting work?','Yes. A Pre-Job Hazard Assessment is required before starting any job (form in Company Links).'],
    ['Is PPE required?','Yes — required PPE must be worn at all times based on the task. If you don’t have proper PPE, do not start work and report it immediately.'],
    ['What if I see an unsafe condition?','Stop work and report it immediately.'],
    ['What is a near miss and how do I report it?','A situation that could have caused injury or damage. Submit the Near Miss Incident Report in Company Links.'],
    ['What if I get injured at work?','Report it immediately through your direct supervisor and up the chain of command; if no one is available, contact the office. Complete an Injury Report (Company Links).'],
    ['What if equipment or property is damaged?','Report it and complete a Company Damage Report (Company Links).'],
    ['Where are safety violations documented?','Through the PPE Correction / Safety Infraction Form in Company Links.'],
    ['Where can I share safety concerns or suggestions?','Use the Safety and Suggestion Box at the north entrance of the east set of shops.'],
  ]},
  { category:'Vehicles & equipment', items:[
    ['How do I check out a company truck?','Complete the Truck Check Out form in Company Links, and confirm with your supervisor that you are an authorized driver.'],
    ['What do I do when returning a company truck?','Complete the Truck Check In form in Company Links.'],
    ['What if a truck or equipment is damaged?','Report it immediately and complete a Company Damage Report in Company Links.'],
    ['Am I responsible for keeping my truck clean?','Yes — maintain cleanliness and organization at all times.'],
  ]},
  { category:'Payroll & financial', items:[
    ['When is payday?','Weekly, on Fridays.'],
    ['How will I receive my first paycheck?','Your first paycheck will be a paper check while direct deposit is being processed, which can take up to two weeks.'],
    ['Can I set up direct deposit?','Yes — contact HR or the Office Manager.'],
    ['Can I request a payroll advance?','Yes, you are allowed one advance per year by contacting the Office Manager.'],
    ['Who do I contact for payroll questions?','HR or the Office Manager.'],
  ]},
  { category:'Company cards & expenses', items:[
    ['How do I manage a company card?','Through the Travel Bank app. Receipts must be submitted every Friday.'],
    ['Where can I learn to submit receipts?','Watch the Travel Bank How To in Company Links.'],
    ['Who can help with company cards?','Accounts Payable or the Office Manager.'],
  ]},
  { category:'Travel & jobsites', items:[
    ['Will I get a ride to jobsites?','Yes — you ride with the crew. Coordinate with your foreman or supervisor for departure times.'],
    ['Can I drive my personal vehicle to jobsites?','Only with supervisor approval, and valid proof of vehicle insurance must be provided to the office prior to use.'],
    ['What should I do before leaving a jobsite?','Ensure work is complete, the area is clean, and any issues are communicated.'],
  ]},
  { category:'Breaks, phones & conduct', items:[
    ['Can I leave for lunch?','Yes, with foreman approval.'],
    ['When can I use my phone?','During breaks, lunch, or for work-related purposes only. Use the QUO app and your assigned company number for business calls.'],
    ['What if I can’t reach my supervisor?','Call the main office line.'],
    ['What is expected during downtime?','Stay productive, take initiative, and ask for additional tasks if needed.'],
    ['What if I make a mistake?','Notify your supervisor. Ask instead of guessing.'],
    ['How can I recognize a coworker?','Submit a Spark Award Nomination in Company Links.'],
    ['What if I feel I am being treated unfairly?','Notify your supervisor, move up the chain of command, or contact HR.'],
  ]},
];
let faqSearch = '';
let faqOpenCategory = FAQ_DATA[0].category;

// Safety quiz sourced from Goff's "NEW EMPLOYEE Safety Training & Quiz V3.docx".
// Question wording and answers are verbatim from the V3 handbook. Pending Dale's
// confirmation on pass/fail rules, retakes, and hands-on signoff.
const SAFETY_QUIZ = [
  { q:'It is my responsibility to perform my job in the safest manner possible.', a:true },
  { q:'I do not need to know the potential hazards and appropriate safety precautions prior to starting a new operation.', a:false },
  { q:'I need to know how to use the emergency equipment in my area, who my emergency contacts are, and be familiar with emergency procedures.', a:true },
  { q:'If I see an unsafe condition, I should keep it to myself and not report it.', a:false },
  { q:'When transferring a chemical to another container, a label identifying the contents of the transferred chemical is required on the new container.', a:true },
  { q:'When my supervisor informs me or when the evacuation alarm sounds, I should wait to see if it is “real” before leaving the building.', a:false },
  { q:'A Safety Data Sheet (SDS) contains important information about chemical properties, hazards associated, and how to respond in an emergency involving the chemical.', a:true },
  { q:'If I have a minor injury, I should continue working and not report it to my supervisor.', a:false },
  { q:'There is a definite relationship between safety and orderliness in the work area.', a:true },
  { q:'As an operator, I should make sure all the guards are in place before operating any of the equipment in my work area.', a:true },
];
const SAFETY_ACK = 'I certify that I have read and know how to obtain a copy of the Injury and Illness Prevention Program and fully understand my responsibilities with respect to the policy and procedures as outlined. I further agree to comply with safe work practices.';

// Safety Training — separate from orientation per Austin (2026-07-01): "10 or 15
// sections... 15 minutes a piece... and a more important pass-or-fail quiz."
// Sections 1-8 built from the onboarding deck's safety content + the V3 Safety
// Training handbook. Remaining sections reserved for Dale/BBSI material.
const SAFETY_SECTIONS = [
  { id:'culture', title:'Safety culture & Stop Work Authority', kc:'kc1', cards:[
    ['Shared responsibility','Safety is everyone’s responsibility. Look out for your crew, keep your area hazard-free, and speak up early — a culture of safety only works when all of us own it.'],
    ['Stop Work Authority','Stop work the moment conditions become unsafe. Every employee has this authority — no permission needed and no blame for using it. When in doubt, stop and ask.'],
  ]},
  { id:'ppe', title:'PPE requirements', kc:'kc2', cards:[
    ['Always required','Safety glasses at all times, steel-toe footwear on the floor, and hearing protection in the shop (per the safety handbook). The rest is task-dependent — but always on hand.'],
    ['Task-dependent','Hard hats for overhead and field work, hi-vis vests in field and yard areas, fall protection when applicable, gloves matched to the task, welding helmets and respirators with training.'],
    ['Provided by Goff','OSHA-required PPE is provided free of charge and replaced when broken or worn out. Find it in the parts room, shop entrances, and work trailers. No proper PPE? Do not start work — report it.'],
  ]},
  { id:'shop', title:'Shop safety: guards, aisles, hazards', kc:'kc3', cards:[
    ['Machine guards','Ensure all protective guards are securely in place and fully functional before operating any machinery. Know where the emergency stops are.'],
    ['Keep aisles clear','Maintain clear, unobstructed walkways, aisles, and emergency exits at all times. Never block fire extinguishers or control panels.'],
    ['Report hazards','Immediately report any identified hazards, malfunctioning equipment, or unsafe practices to supervisors. Corrective deadlines are assigned by severity.'],
  ]},
  { id:'housekeeping', title:'Housekeeping', kc:'kc4', cards:[
    ['Clean workstations','Keep your immediate work area tidy, free of debris, and fully prepared for safe operations. When housekeeping standards fall, safety inevitably deteriorates.'],
    ['Organize tools','Return all equipment and tools to their designated storage racks immediately after use.'],
    ['Prevent falls','Address spills and clear walk paths immediately to eliminate slips, trips, and falls. Stairs and hallways are not storage areas.'],
  ]},
  { id:'equipment', title:'Tools & equipment: trained and authorized', kc:'kc9', cards:[
    ['Gate 1 · Proper training','Never operate shop machinery or welding equipment without completing the designated safety and training courses.'],
    ['Gate 2 · Authorization','Ensure you have explicit approval and sign-off from your supervisor before power-up or beginning any task. You are not authorized to climb ladders over 8 feet, drive motor vehicles, or operate heavy equipment without specific authorization.'],
    ['While operating','Make sure the area is clear before turning equipment on, never leave running equipment unattended, and never perform maintenance on a machine in motion.'],
  ]},
  { id:'incident', title:'Injury, incident & near-miss reporting', cards:[
    ['If you are injured','Report to your supervisor immediately — even minor injuries. For serious injuries dial 9-1-1 and/or have a supervisor transport to the hospital / WorkMed facility.'],
    ['Near misses count','A situation that could have caused injury or damage is a near miss. Submit the Near Miss Incident Report in Company Links — reporting near misses prevents the real thing.'],
    ['Suggestion box','Share safety concerns or improvement ideas in the Safety and Suggestion Box at the north entrance of the east shops.'],
  ]},
  { id:'hazcom', title:'Hazard communication (Right-to-Know)', cards:[
    ['Labels on everything','All containers with chemicals must be labeled — including transfer containers, spray bottles, and squeeze bottles. Plain water looks identical to acetone.'],
    ['Safety Data Sheets','The SDS for every chemical product is in the Receiving / Parts Department office, accessible during all work hours. Do not work with a hazardous material until you have reviewed its SDS.'],
    ['Exposure routes','Inhalation, ingestion, skin contact, and injection. Protect yourself: follow label directions, work with air circulation, keep containers covered.'],
  ]},
  { id:'emergency', title:'Emergency response & evacuation', cards:[
    ['When the alarm sounds','Leave promptly — do not wait to see if it is “real.” Make sure others around you are leaving too.'],
    ['Assembly point','The Evacuation Assembly Point is the northeast side of the Main Office building parking lot. Report anyone still inside to the Evacuation Management Team at the exits.'],
    ['Know before you need it','Learn the exits, fire extinguishers, and first aid locations in your area. Evacuation plans are posted at every exit. To report emergencies, dial 9-1-1 and inform a supervisor.'],
  ]},
];
function safetySectionDone(s){
  const read = completed[`safesec-${s.id}`];
  const kcOk = !s.kc || (kcState[s.kc] && kcState[s.kc].correct);
  return read && kcOk;
}
function toggleSafetySection(id){ completed[`safesec-${id}`] = !completed[`safesec-${id}`]; save(); render(); }
let quizAnswers = (() => { try { return JSON.parse(safeGetEarly('goffSafetyQuizV3') || '{}'); } catch(_) { return {}; } })();
function safeGetEarly(key){ try { return window.localStorage.getItem(key); } catch(_) { return null; } }

// Role expectations sourced from Goff's KRA docs in Drive (Goff Forms > KRA's).
// DRAFT — confirm each KRA is the current version and which parts are employee-visible.
const KRA_DATA = [
  { id:'tradesman1', role:'Tradesman Class 1', identity:'Execution Leader. Standard Carrier. Problem Solver.',
    why:'Executes high-level work and leads small crews or scopes while maintaining Goff Welding’s standards for quality, productivity, and professionalism. Bridges the gap between foreman leadership and crew execution.',
    areas:[
      ['Work execution & technical quality','35%','Perform welds to code/spec, proper fit-up and fabrication accuracy, read blueprints independently. Minimal defects or rework.'],
      ['Crew productivity & workflow','25%','Keep the assigned crew actively working, maintain efficient workflow, identify and eliminate downtime.'],
      ['Task leadership & scope control','20%','Lead execution of the assigned scope. Ensure the crew understands the task, sequence, and expected outcome.'],
      ['Problem solving & field awareness','10%','Identify issues early, solve problems within scope, communicate when escalation is required.'],
      ['Safety, professionalism & work habits','10%','Maintain safe work practices, keep the work area clean, represent Goff Welding professionally.'],
    ],
    success:'Produces high-quality work independently, leads small crews effectively, requires minimal supervision.',
    failure:'Frequent rework, crew inefficiency, needs constant direction, lack of ownership.' },
  { id:'tradesman4', role:'Tradesman Class 4 (Entry level)', identity:'Entry-Level Support. Foundation Builder.',
    why:'Supports the crew while learning the fundamentals of the trade and work environment. Shows up ready, works hard, learns fast.',
    areas:[
      ['Support tasks','40%','Material prep, grinding, tool handling, equipment prep, assisting installs.'],
      ['Work ethic','30%','Stays productive and shows initiative.'],
      ['Learning & development','20%','Builds foundational knowledge of the trade.'],
      ['Reliability','10%','Shows up on time and follows direction.'],
    ],
    success:'Eager to learn, supports the team effectively, progressing in skill.',
    failure:'Poor effort, lack of improvement, needs constant supervision.' },
  { id:'foreman', role:'Foreman / Project Lead', identity:'Job Owner. Production Leader. Standard Setter.',
    why:'Owns the execution and outcome of every job: safe, on schedule, within labor targets, built to quality standards. Directly impacts job profitability, crew performance, customer satisfaction, and company reputation.',
    areas:[
      ['Job planning & execution','30%','Daily and weekly work plans, correct sequencing, crew always knows what/why/what’s next. Coordinates with CRM, shop, and procurement.'],
      ['Labor productivity & cost control','25%','Manage labor hours against estimate. Eliminate idle time, rework, and inefficient sequencing.'],
      ['Quality control & rework prevention','20%','All work meets drawings, specs, and Goff standards. Inspect continuously, correct issues immediately.'],
      ['Crew leadership & accountability','15%','Assign work clearly, hold the crew accountable, address performance issues immediately, develop crew skill.'],
      ['Safety & jobsite control','10%','Maintain safe conditions and enforce safety standards at all times.'],
    ],
    success:'Jobs consistently meet or beat schedule and labor targets, crew is organized and aligned, minimal rework.',
    failure:'Missed schedules, labor overruns, disorganized or idle crews, frequent rework.' },
  { id:'inventory', role:'Inventory Control Specialist', identity:'Accuracy Guardian. Material Gatekeeper. Warehouse Steward.',
    why:'Ensures all materials are accurately received, stored, tracked, and staged so CRMs, procurement, and field crews can execute jobs without delay or confusion.',
    areas:[
      ['Inventory accuracy & material control','30%','95%+ inventory accuracy, weekly cycle counts, zero stock-outs on critical consumables, same-day recording of material movements.'],
      ['Receiving, verification & put-away','25%','Verify against PO and packing slip, process goods receipts in SAP, label and put away same day, report discrepancies within 24 hours.'],
      ['Job material pick, pull & staging','20%','Staging complete ahead of job start, zero missing materials at kickoff, readiness confirmed with CRMs and shop leads.'],
      ['Warehouse cleanliness & organization','10%','Weekly walk-throughs, labeled bins and racks, clear aisles, zero safety hazards.'],
      ['Product knowledge & team support','13%','Know sanitary steel parts, support the Supply Chain Specialist and Procurement, communicate staging status daily.'],
    ],
    success:'Jobs start with all materials ready, no stock-outs, clean organized warehouse, CRMs trust the numbers.',
    failure:'Missing materials at job start, inaccurate inventory, receiving discrepancies, disorganized warehouse.' },
  { id:'procurement', role:'Procurement Manager', identity:'Material Strategist. Cost Controller. Job-Flow Enabler.',
    why:'Ensures Goff Welding has the right materials, at the right time, at the right cost, so production and field operations never stall.',
    areas:[
      ['Job-ready purchasing & availability','30%','On-time PO placement for every job, under 2% order errors, zero job delays caused by purchasing.'],
      ['Vendor management & cost control','25%','Maintain vendor relationships, negotiate pricing, quarterly vendor scorecards, documented savings.'],
      ['Purchasing communication & coordination','20%','Daily PO status updates, same-day communication of issues, trackable order logs.'],
      ['PO accuracy & documentation','15%','Clean, complete POs with job number, specs, quantities, pricing. All quotes saved.'],
      ['Estimating support & supply-chain alignment','10%','Current pricing and lead times for estimators, weekly alignment with the Supply Chain Specialist.'],
    ],
    success:'Jobs start on time, no material-related delays, strong vendor reliability, accurate pricing for estimating.',
    failure:'Late POs, surprise delays, poor vendor communication, repeated PO corrections.' },
  { id:'tradesman2', role:'Tradesman Class 2', identity:'Skilled Producer. Reliable Contributor.',
    why:'Executes skilled work consistently while supporting crew productivity and developing toward leadership. Takes ownership of assigned work and adds value through consistency and reliability.',
    areas:[
      ['Work execution & accuracy','40%','Perform welds and fabrication tasks correctly, follow drawings and specifications; install and assemble equipment correctly, assist with alignment and setup.'],
      ['Productivity & work pace','30%','Maintain a steady production pace, stay engaged and working, contribute consistently to crew output.'],
      ['Skill development & growth','20%','Improve trade skills and expand capabilities — progress toward Class 1 level.'],
      ['Safety & reliability','10%','Show up prepared, work safely and consistently.'],
    ],
    success:'Dependable and consistent, improving technical ability, contributes to team productivity.',
    failure:'Repeated mistakes, slow production, lack of improvement.' },
  { id:'tradesman3', role:'Tradesman Class 3', identity:'Developing Tradesman. Emerging Contributor.',
    why:'Supports crew execution while building foundational skills in the trade. Works hard, learns quickly, takes direction well.',
    areas:[
      ['Basic task execution','40%','Perform basic welds and prep; assist with assembly, bolting, and setup.'],
      ['Work ethic & productivity','30%','Stay active and engaged, support crew operations.'],
      ['Learning & skill development','20%','Build trade knowledge and improve daily.'],
      ['Safety & attitude','10%','Follow direction and maintain a positive attitude.'],
    ],
    success:'Improving consistently, reliable and engaged, supports the team.',
    failure:'Lack of effort, poor attitude, no improvement.' },
  { id:'estimator', role:'Estimator', identity:'Scope Interpreter. Cost Architect. Proposal Builder.',
    why:'Accurately interprets drawings, specifications, and customer intent and converts them into clear, competitive, profitable proposals. The first line of defense against unclear or risky work.',
    areas:[
      ['Scope interpretation & drawing analysis','30%','Read and interpret drawings, specs, and customer documents; identify missing, vague, or conflicting information early; provide technical clarity to CRMs.'],
      ['Estimate development & cost accuracy','25%','Build accurate labor, material, and fabrication cost models using historical data, shop input, and technical judgment. Identify cost risks and opportunities.'],
      ['Proposal creation & documentation','20%','Develop clear professional proposals with scope, materials, timeline, assumptions, and exclusions — CRM-ready on first pass.'],
      ['SAP bill of materials & job setup support','15%','Accurate BOMs that support production and procurement. Detailed targets live in the role-scoped KRA document.'],
    ],
    success:'CRMs understand exactly what Goff is proposing, fewer surprises after award, competitive profitable bids.',
    failure:'Scope confusion, estimate-vs-actual surprises, late or unclear proposals.' },
  { id:'crm', role:'Customer Relations Manager (CRM)', identity:'Pipeline Builder. Revenue Driver. Capacity Creator.',
    why:'Creates, secures, and manages work that keeps Goff Welding’s crews productive and profitable. Not a “sales role” — a production-driving leadership role that feeds the entire operation.',
    areas:[
      ['Pipeline development & visibility','30%','Maintain an active, visible pipeline with a consistent weekly prospecting and quoting rhythm. Leadership can understand the workload outlook instantly. Specific volume targets live in the role-scoped KRA document.'],
      ['Work conversion & job creation','25%','Convert quotes into executable work — clearly defined, approved, and ready for production, with strong quote-to-close follow-up.'],
      ['Production alignment & support','20%','Align the pipeline with shop and field capacity; coordinate with the Shop Manager, foremen, and procurement so crews stay productive without being overwhelmed.'],
      ['Revenue flow & job value','15%','Drive consistent revenue and prioritize profitable work. Targets live in the role-scoped KRA document.'],
      ['Customer stewardship & reputation','10%','Build long-term relationships, communicate clearly, represent Goff Welding professionally.'],
    ],
    success:'Consistent opportunity flow, no surprise gaps in workload, crews consistently fed, repeat business.',
    failure:'Pipeline gaps, poor follow-up, jobs entering production unclear, starved or overwhelmed crews.' },
  { id:'officemanager', role:'Office Manager', identity:'Administrative & Financial Control Lead.',
    why:'Ensures the company’s financial, HR, and administrative functions operate with accuracy, discipline, and reliability — the control tower for AP, AR, payroll, HR, insurance, finance, and procurement support.',
    areas:[
      ['Financial accuracy & administrative control','30%','AP, AR, payroll, and finance executed accurately and on time; clean, reconciled, audit-ready data; procurement discipline enforced.'],
      ['Department performance monitoring','25%','Weekly visibility to leadership on performance, risks, and bottlenecks; hold each function accountable to standards and deadlines.'],
      ['HR, payroll & compliance administration','20%','Accurate employee records, onboarding documentation, certifications; payroll processed accurately and confidentially; insurance compliance maintained.'],
      ['Office operations & process improvement','15%','Organized, efficient office systems; improve processes to reduce errors; support new systems and reporting tools.'],
    ],
    success:'Leadership trusts the data, functions hit deadlines, recurring errors decline.',
    failure:'Reconciliation delays, payroll errors, compliance lapses, leadership in the dark.' },
  { id:'supplychain', role:'Supply Chain Specialist', identity:'Material Controller. Flow Enabler. Warehouse Guardian.',
    why:'Ensures materials flow cleanly, accurately, and predictably through Goff Welding — from receiving, to storage, to staging, to outbound delivery — keeping crews supplied and moving.',
    areas:[
      ['Inventory accuracy & material control','30%','95%+ inventory accuracy, weekly cycle counts, zero stock-outs on critical consumables, same-day recording of material movements.'],
      ['Receiving & verification','25%','100% verification against PO and packing slip, materials labeled and logged same day, discrepancies reported within 24 hours.'],
      ['Staging, warehouse & team support','—','Staging readiness ahead of jobs, warehouse orderliness, and support for Procurement, CRMs, and production. Weights in the role-scoped KRA document.'],
    ],
    success:'Production never stops for missing materials, CRMs and Procurement trust the numbers, clean predictable warehouse.',
    failure:'Missing materials, receiving discrepancies, disorganized warehouse, unclear material status.' },
  { id:'facilities', role:'Facilities / Equipment Lead', identity:'Capacity Protector & Cost Controller.',
    why:'Protects production capacity and controls maintenance costs — keeping vehicles, welders, equipment, tools, and facility systems safe, reliable, and operational. Asset stewardship, not a “repair role.”',
    areas:[
      ['Vehicle reliability & uptime','30%','PM schedules for trucks and trailers, mileage and service tracking, DOT compliance, driver inspection checklists, repair-vs-replace recommendations.'],
      ['Welding machines & field equipment','20%','Maintain all welding machines; inspect leads, torches, grounds, cables; calibration schedules; track recurring operator damage.'],
      ['PM system, budget & asset tracking','—','Master preventive-maintenance system, budget control, vendor coordination, asset tagging, and scorecard reporting. Weights in the role-scoped KRA document.'],
    ],
    success:'Reduced roadside failures, fewer emergency repairs, longer asset life, uninterrupted crews.',
    failure:'Field delays from vehicle failures, unplanned downtime, runaway maintenance costs.' },
  { id:'timekeeping', role:'Timekeeping & Administrative Coordinator', identity:'Timekeeping Accuracy & Operational Support Coordinator.',
    why:'Maintains accurate timekeeping, operational tracking, compliance coordination, and administrative support — protecting company resources and payroll accuracy.',
    areas:[
      ['Timekeeping & payroll support','45%','Monitor ExakTime accuracy and completeness, coordinate corrections, support payroll preparation, follow up on missing approvals.'],
      ['Compliance & operational tracking','30%','Safety training tracking and reminders, licensing/certification/COI tracking, OSHA administrative documentation, recurring deadline monitoring.'],
      ['Reporting & administrative operations','15%','Operational reports, organized tracking systems, office communication and social media coordination.'],
      ['Cross-training & office support','10%','Working knowledge of onboarding and billing processes; office coverage and administrative projects.'],
    ],
    success:'Reliable timekeeping data, compliance deadlines never missed, proactive communication of discrepancies.',
    failure:'Payroll discrepancies, missed compliance deadlines, disorganized tracking.' },
  { id:'aphr', role:'Billing & Administrative Support (AP/HR Support)', identity:'Billing Accuracy & Administrative Support Specialist.',
    why:'Supports accurate billing, purchasing coordination, vendor communication, and administrative organization — protecting the company through organized financial support and reliable follow-through.',
    areas:[
      ['Billing & financial support','40%','Support AP/AR processes, accurate invoice coding and documentation, collections follow-up, vendor communication.'],
      ['Purchasing & administrative coordination','30%','Office purchasing and supply management; apparel, merchandise, and promotional ordering; employee appreciation items and company events.'],
      ['Administrative organization & follow-through','20%','Organized digital and physical records, established procedures followed, proactive communication of discrepancies.'],
      ['Cross-training & office support','10%','Working knowledge of onboarding and timekeeping processes; office coverage and special projects.'],
    ],
    success:'Accurate billing records, organized purchasing, tasks completed accurately and on time.',
    failure:'Invoice errors, missed follow-ups, disorganized documentation.' },
  { id:'prefab', role:'Prefabrication Manager', identity:'Production Flow Leader & Material Readiness Manager.',
    why:'Ensures materials, components, tooling, and fabrication resources flow efficiently through the prefabrication area — transforming it from a reactive work center into a proactive production system.',
    areas:[
      ['Material readiness & production flow','30%','Raw materials processed and ready ahead of demand; workflow through waterjet, bandsaw, ironworker, press brake, and staging; bottlenecks identified before they impact production.'],
      ['Inventory, organization & tooling','—','SAP Business One inventory accuracy, shop organization and cleanliness, tooling and equipment development. Weights in the role-scoped KRA document.'],
      ['Leadership & delegation','—','Workforce coordination, production scheduling support, continuous improvement, area accountability reporting.'],
    ],
    success:'Crews never wait on prefab, staging predictable, prefab area organized and proactive.',
    failure:'Material emergencies, reactive scrambles, bottlenecks discovered on job day.' },
];
let kraSelected = KRA_DATA[0].id;

const formModules = [
  { id:'hazard', title:'Pre-Job Hazard Assessment', audience:'All employees', status:'Required daily', when:'Required before starting ANY job (per the Goff FAQ). Identify the hazards of the task and the safety precautions before work begins.', how:'Complete the Pre-Job Hazard Assessment form in Company Links before starting the job. Before leaving a jobsite, the Pre-Job Departure Checklist applies.', next:'The assessment is kept with the job record; unresolved hazards stop work until addressed with your supervisor.', route:'Reviewed by the supervisor/foreman on the job → escalates to Safety (Dale) if a hazard cannot be controlled.', confirm:'Confirm whether assessments are filed per job or per crew, and who audits them.' },
  { id:'nearmiss', title:'Near-Miss Report', audience:'All employees', status:'Safety-critical', when:'Use when a situation could have caused injury or damage but didn’t. Reporting near misses prevents the real thing.', how:'Submit the Near Miss Incident Report in Company Links. You can also use the Safety and Suggestion Box at the north entrance of the east shops.', next:'Safety reviews the report, corrective action is assigned a deadline based on severity, and trends feed the monthly safety meeting.', route:'Direct supervisor + Safety Manager (Dale). Anonymous suggestions go through the Suggestion Box.', confirm:'Confirm whether near-miss reports can be anonymous and who tracks corrective-action deadlines.' },
  { id:'damage', title:'Damage / incident report', audience:'All employees', status:'High priority', when:'Use when equipment, vehicle, property, or jobsite damage occurs, or when an incident needs supervisor/safety review.', how:'Open the company damage report, complete what happened, where, who was involved, photos if needed, and immediate safety steps taken.', next:'Supervisor/admin gets notified, safety response is reviewed, drug-test/tow/equipment decisions are made if required, and follow-up is assigned.', route:'Direct supervisor first (per FAQ: report immediately, up the chain of command) → Safety Manager (Dale) → office/admin for the record. Near-miss reports follow the same path.', confirm:'Confirm recipients, and what triggers drug test / tow / safety escalation?' },
  { id:'timeoff', title:'Request days off', audience:'All employees', status:'Employee-facing', when:'Use before taking time off, vacation, planned appointments, or schedule exceptions.', how:'Per the FAQ: submit in the ExakTime app at least two weeks in advance.', next:'Supervisor reviews, approval/denial is communicated, and the Work Schedule is updated.', route:'ExakTime is the system of record → supervisor approves → Scheduler updates the Work Schedule. Portal links to ExakTime rather than duplicating the request.', confirm:'Confirm supervisor-level approval and whether any roles need admin/HR signoff too.' },
  { id:'truck', title:'Truck check-out / check-in', audience:'Drivers / assigned vehicle users', status:'Role-based', when:'Check out a truck before use (authorized drivers only) and check it in on return with condition, mileage, fuel, and maintenance notes.', how:'Complete the Truck Check Out / Truck Check In forms in Company Links. Confirm you are an authorized driver with your supervisor first.', next:'Vehicle status is reviewed, maintenance/follow-up assigned, damage escalated to a Company Damage Report if needed.', route:'Supervisor confirms authorized driver → Maintenance owns vehicle follow-up (per FAQ: facility/equipment issues go to Maintenance) → damage escalates to supervisor + safety.', confirm:'Confirm which roles need this, how often, and who owns maintenance follow-up.' },
  { id:'purchase', title:'Purchase request', audience:'Role-specific', status:'Confirm approval path', when:'Use when materials, supplies, tools, or job-related purchases need approval.', how:'Per the FAQ: notify your supervisor first. If directed, submit the Purchase Request Form (Company Links) with item, vendor, job, cost, urgency.', next:'The inventory/procurement team orders. Only order or pick up materials yourself if directed by your supervisor.', route:'Supervisor screens the need → Purchase Request routes to Procurement/Inventory team → requester notified of approval and pickup/delivery.', confirm:'Confirm approval limits and whether urgent purchases have a different process.' },
  { id:'spark', title:'Spark Award', audience:'All employees', status:'Confirmed employee-facing', when:'The Spark Award honors the unsung heroes of Goff Welding — people whose everyday actions ignite something greater. Nominate a coworker whose craftsmanship, kindness, or pride made a lasting impact.', how:'Submit a Spark Award Nomination in Company Links: employee name, what they did, and why it matters.', next:'Nomination routes to the right person/team and may be included in recognition or awards process.', route:'Nominations route to office/leadership for review on a recurring cadence (monthly proposed).', confirm:'Confirm who reviews nominations and how often awards are selected.' },
  { id:'contacts', title:'Company contacts / schedule links', audience:'Approved employees', status:'Needs visibility approval', when:'Use when employees need approved internal contacts, group emails, schedules, or company resources.', how:'Open the relevant contact/schedule resource and use only approved channels. The Work Schedule (Google Sheets) is the main hub.', next:'Employee gets the correct contact/resource without asking around or using stale lists.', route:'Scheduler owns Work Schedule access (per FAQ: contact the Scheduler if you lose access). Portal links out to approved tabs only.', confirm:'Confirm which contact sheets are safe to publish, and which stay admin-only.' },
];

// Named policy checklist built from the actual policy documents in Drive
// (Goff Forms > Policies + Hiring Documents). Type is PROPOSED — Goff confirms
// signature vs read-acknowledge, and which version is current.
const POLICY_LIST = [
  { name:'Employee Handbook (Employee Copy)', type:'Sign acknowledgement', who:'All employees', note:'Handbook Acknowledgement form exists in Drive as a separate signable.' },
  { name:'Drug & Alcohol Policy — Revised Random Testing', type:'Sign', who:'All employees', note:'Confirm the “Revised Random Testing” version is current.' },
  { name:'NDA / Confidentiality Agreement', type:'Sign', who:'All employees', note:'Secure, employee-specific record.' },
  { name:'Video Release Form', type:'Sign', who:'All employees', note:'' },
  { name:'Apparel Responsibility Form', type:'Sign', who:'All employees', note:'Connects to Tools/PPE module.' },
  { name:'Employee Tool List Requirement Form', type:'Sign', who:'Shop/field roles', note:'Required tools + 30-day inspection. Now drafted in the Tools/PPE module.' },
  { name:'Per Diem & Travel Allowance Policy', type:'Sign', who:'Traveling roles', note:'NEW — added to Drive 2026-07-01. Drafted as its own portal module.' },
  { name:'Goff Welding Vehicle Policy', type:'Sign', who:'Drivers / vehicle users', note:'Per the doc manifest: the published PDF is authoritative; the two docx copies are pending confirmation as source files.' },
  { name:'Goff Welding Complaint Procedure', type:'Read', who:'All employees', note:'External complaint process (customers/vendors) — employees should know it exists. Internal concerns go up the chain of command per the FAQ.' },
  { name:'Rehire — Employee Expectations Agreement', type:'Sign (rehires)', who:'Rehired employees', note:'' },
  { name:'Authorization for Medical Treatment', type:'Sign', who:'All employees', note:'Part of the hire packet.' },
  { name:'Authorization for Personal Purchase (EN/ES)', type:'Sign when applicable', who:'As needed', note:'Client confirming overlap with the Payroll Deduction Authorization form.' },
  { name:'Update Your Federal Tax Filing Status SOP', type:'Reference / how-to', who:'All employees', note:'Employee how-to; tax changes happen in MyBBSI.' },
  { name:'Vacation Policy (Master)', type:'Read & acknowledge', who:'All employees', note:'' },
  { name:'Unexcused Absences Policy', type:'Read & acknowledge', who:'All employees', note:'' },
  { name:'Workplace Communication & Anti-Gossip Policy', type:'Read & acknowledge', who:'All employees', note:'' },
  { name:'Hard Hat SOP', type:'Read & acknowledge', who:'Shop/field roles', note:'' },
  { name:'Safety Training & Quiz V3 acknowledgement', type:'Sign after quiz', who:'All employees', note:'Live in the Safety module — kept in personnel file by HR/Safety.' },
  { name:'Direct Deposit Agreement', type:'Secure / BBSI boundary', who:'All employees', note:'Confirm whether this lives in BBSI or Goff. Do not collect over text/email.' },
  { name:'Payroll Deduction Authorization', type:'Sign when applicable', who:'As needed', note:'Spanish version exists in Drive.' },
  { name:'Training Investment Agreement', type:'Sign when applicable', who:'Role-specific', note:'Confirm which roles/training this applies to.' },
  { name:'Emergency Call-Back Policy', type:'HOLD — draft', who:'TBD', note:'Filed as “draft” in Drive. Do not publish until approved.' },
  { name:'Travel & Business Expense Reimbursement Policy v9.21.24', type:'Read & acknowledge', who:'Traveling roles', note:'Confirmed in the doc manifest alongside the new Per Diem policy — confirm how the two divide (business expenses vs per diem/lodging).' },
];
// Policy walkthrough per Austin: a guided explain-each-policy experience with a
// short check after each one — later connected to the AI agent that answers
// policy questions and surfaces recurring ones to admins. First five built from
// the deck; the rest follow once Austin approves the pattern.
const POLICY_WALKTHROUGH = [
  { id:'vehicle', title:'Vehicle policy — behind the wheel', kc:'kc5', cards:[
    ['Authorized drivers','Only designated employees with valid licenses and company approval may operate company vehicles.'],
    ['Seat belts required','Seat belts must be worn by all occupants whenever the vehicle is in motion. No exceptions.'],
    ['No distractions','Strict prohibition of mobile phone use, texting, or other distractions while operating a vehicle.'],
  ]},
  { id:'drugalcohol', title:'Drug & alcohol — zero tolerance, every shift', kc:'kc6', cards:[
    ['Zero tolerance','Impairment of any kind while on duty is strictly prohibited to ensure a safe workplace for everyone. This policy applies on the clock, on every site, with no exceptions.'],
    ['Operating safety','Absolute sobriety and focus are required at all times while working or operating equipment.'],
  ]},
  { id:'confidentiality', title:'Confidentiality — what stays in the shop', kc:'kc7', cards:[
    ['Customer info','Protect all personal and contact details of our customers.'],
    ['Drawings & pricing','Keep proprietary blueprints and technical drawings secure. Safeguard internal pricing strategies and rate quotes.'],
    ['Company processes','Maintain confidentiality of workflows and operational steps.'],
  ]},
  { id:'attendance', title:'Attendance — your crew is counting on you', kc:'kc8', cards:[
    ['Punctuality','Show up on time and be ready to work when your shift begins.'],
    ['Communication','Communicate any issues or delays as early as possible so the team can adjust.'],
    ['Dependability','Be a reliable team player others can count on, shift after shift.'],
  ]},
  { id:'timecards', title:'Timecards — six questions, every entry', cards:[
    ['WHAT are you doing?','Be specific: “Welding Stainless 3″ Pipe,” not just “welding.” Your timecard is how we bill correctly and get you paid.'],
    ['WHERE and WHO?','Exact location (Burley, Paul, Field, Town, or The Shop) and the exact client being billed.'],
    ['HOW long, WHEN done, DID you break?','Round to the nearest quarter hour (“1.5 hours,” “2.75 hours”), give a clear status (“1 day left” / “complete”), and log lunches accurately (“Skipped lunch” / “Took lunch”).'],
  ]},
];
function policiesSection(){
  const p = pageContent.policies;
  const walkDone = POLICY_WALKTHROUGH.filter(w => !w.kc || kcState[w.kc]?.correct).length;
  return `<section class="panel doc-page"><p class="eyebrow">${esc(p.kicker)}</p><h2>${esc(p.title)}</h2><p class="summary">${esc(p.summary)}</p><div class="doc-blocks">${p.blocks.map(([h,b])=>`<article><h3>${esc(h)}</h3><p>${esc(b)}</p></article>`).join('')}</div></section>
  <section class="panel"><p class="eyebrow">Policy walkthrough — read each policy, then answer its check</p><h2>Policies &amp; safe practices</h2><p class="summary">Each policy is explained in plain language with a short knowledge check — you’ll need to answer it before it counts. ${walkDone} of ${POLICY_WALKTHROUGH.length} complete. Once approved, every company policy gets this treatment, and Goff’s AI assistant will answer policy questions here and flag recurring ones for the office.</p>
  <div class="safety-sections">${POLICY_WALKTHROUGH.map((w,i)=>{
    const isDone = !w.kc || kcState[w.kc]?.correct;
    return `<details class="safety-sec ${isDone?'done':''}" ${i===0 && !isDone?'open':''}><summary><span class="sec-num">${isDone?'✓':i+1}</span>${esc(w.title)}<em>${isDone?'Complete':w.kc?'Reading + knowledge check':'Reading'}</em></summary>
    <div class="doc-blocks">${w.cards.map(([h,b])=>`<article><h3>${esc(h)}</h3><p>${esc(b)}</p></article>`).join('')}
    </div>${w.kc ? kcCard(w.kc, `Policy check`) : ''}</details>`;
  }).join('')}</div></section>
  <section class="panel"><p class="eyebrow">Draft checklist from the actual Drive documents — classifications proposed, not final</p><h2>Every named policy, one list</h2><p class="summary">These are the real policy documents in Goff’s Drive today. Each becomes a trackable item on the employee’s record: sign, read-and-acknowledge, secure/BBSI, or held back. In production, completion status saves per employee.</p>
  <div class="table-list">${POLICY_LIST.map(x=>`<article><div><b>${esc(x.name)}</b>${x.note?`<small>${esc(x.note)}</small>`:''}</div><span>${esc(x.who)}</span><em>${esc(x.type)}</em></article>`).join('')}</div>
  <div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section>`;
}

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
  { id:'next-helper', name:'Next helper hire', role:'Shop / field helper', supervisor:'Supervisor to confirm', stage:'Clearance hold', status:'Waiting', start:'Pending', progress:18, blocked:'Drug screen/background/start date not confirmed', next:'Do not send employee portal until clearance is confirmed' },
  { id:'vehicle-checkin', name:'Vehicle-user check-in', role:'Driver / assigned vehicle user', supervisor:'Supervisor to confirm', stage:'30-day check-in', status:'Due soon', start:'Started', progress:84, blocked:'Truck check-in routing needs owner', next:'Run 30-day check-in and confirm vehicle/form training' },
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
  { owner:'Portal setup', count:5, items:['Final route for each company form','Add approved PDFs/links only','Define notification recipients','Store progress per employee','Keep BBSI boundary clear'] },
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
const phaseOneStatus = [
  { area:'Employee home', status:'Cleaned up', detail:'Employee sees a direct first-day path, not a build explanation.' },
  { area:'Orientation (restructured per July 1 call)', status:'Rebuilt — review wording', detail:'Now the 30,000-foot view Austin asked for: native, phone-friendly company/culture content ending in a 4-question check. Specific safety and policy detail pulled out into their own sections. The designed deck’s content carried over; the slide images are preserved.' },
  { area:'Onboarding path', status:'5 steps — confirming BBSI sequencing with Quinton', detail:'Orientation → Policies & acknowledgements → Safety Training → Work basics (ExakTime) → Supervisor handoff. Policy acknowledgement was content without a step — now it is step 2 and completes only when every policy check is answered. BBSI stays out of the path: its paperwork finishes before day one (that is what clears a hire to start); the BBSI page remains as a paystubs/taxes reference.' },
  { area:'Safety Training (separate section)', status:'8 of 10–15 sections built', detail:'Sections with real tappable knowledge checks + the V3 pass/fail quiz and acknowledgement. Remaining sections slot in as Dale/BBSI deliver material.' },
  { area:'Policy walkthrough', status:'First 5 policies built', detail:'Vehicle, drug & alcohol, confidentiality, attendance, timecards — each explained with a tracked check. Pattern extends to all 24 policies after approval; AI agent hookup is Phase 2.' },
  { area:'Knowledge-check tracking', status:'Working now', detail:'Every check records attempts — first-try vs second-guessing — exactly the click-click-click problem Austin flagged in the PPT version. Manager assign-retraining and yearly 5-section refresher are designed in, activate with the database.' },
  { area:'CONTENT CONFLICTS FOUND', status:'Needs Austin ruling', detail:'(1) Mission/vision wording differs: welcome packet says “add value always / integrity, respect, continuous improvement” while the onboarding deck says “superior craftsmanship / most trusted name in the Mountain West.” The deck version is currently shown. (2) Always-on PPE differs: deck says safety glasses + steel-toe; V3 safety handbook says safety glasses + hearing protection. Portal currently shows the union of both.' },
  { area:'Document standardization', status:'Planned', detail:'Austin asked for tidied, consistently-branded documents and AI flagging of conflicting policy facts (e.g., observed holidays). The two conflicts above are the first output of that process.' },
  { area:'Training structure', status:'Ready for review', detail:'General onboarding, safety, policies, tools, links, role expectations, and milestones are separated.' },
  { area:'Safety', status:'Drafted — confirm with Dale', detail:'The real 10-question quiz from Safety Training & Quiz V3 is now live in the portal with instant feedback and the acknowledgement text. Dale confirms pass/fail, retakes, timing, and hands-on signoff.' },
  { area:'FAQs', status:'New — drafted', detail:'The Goff Welding FAQs PDF is now a searchable FAQ hub (50+ answers) and its facts are woven into ExakTime, first-day, and forms modules.' },
  { area:'Per diem / travel', status:'New — drafted', detail:'The Per Diem & Travel policy added to Drive today is a full portal module with rates, eligibility, and the signature acknowledgement. Confirm effective date and relation to the older travel reimbursement policy.' },
  { area:'Role expectations', status:'All 15 roles drafted', detail:'Every KRA doc in Drive is now a role page — trades, leadership, and office roles. Role-scoped visibility (each employee sees only their KRA) activates with auth; sensitive business targets held back to the docs.' },
  { area:'Document manifest', status:'Aligned', detail:'The portal now matches the Cowork document manifest: all 46 confirmed employee-facing files represented, pending items flagged not built, admin/finance/hiring docs excluded.' },
  { area:'Policies/forms', status:'Needs Austin decision', detail:'Documents are categorized and proposed routing is drafted on each form, but currentness, signatures, visibility, and final recipients must be approved.' },
  { area:'Backend tracking', status:'Not live yet', detail:'UI shows completion locally; production employee records, quiz results, signatures, and reminders need database work after structure approval.' },
  { area:'Domain', status:'Later', detail:'Use Stoke AI URL for review now. Move to portal.goffwelding.com after LinkNow/DNS access is clear.' },
];

const reconciliationRows = [
  { source:'Welcome New Hire packet / course deck', use:'Employee orientation course + mission/values', audience:'Employee', status:'Ready for Austin wording review', decision:'Approve tone, mission/vision wording, and whether this is the main first-day course.' },
  { source:'BBSI check-in + onboarding SOPs', use:'Pre-day-one prerequisite (admin-tracked) + employee reference page for myBBSI/paystubs/taxes', audience:'Employee + Admin', status:'Restructured — confirming with Quinton', decision:'Confirm BBSI paperwork always completes before training starts, who resends invites, and what “ready to work” signal Goff receives.' },
  { source:'Safety Training & Quiz V3 + PPE/incident docs', use:'Safety module with the real 10-question quiz + acknowledgement (live now)', audience:'Employee + Dale/Supervisor', status:'Drafted — confirm with Dale', decision:'Pass/fail rule, retake policy, timing, and hands-on signoff owner.' },
  { source:'Goff Welding FAQs.pdf (new in Drive)', use:'Searchable FAQ hub + facts woven into ExakTime, first-day, payroll, and forms modules', audience:'Employee', status:'Drafted', decision:'Confirm every answer is current, and whether Work Schedule / Company Links become live links.' },
  { source:'Per Diem & Travel Allowance Policy (added to Drive 2026-07-01)', use:'Per diem module with rates, eligibility, and signature acknowledgement', audience:'Employee + signed acknowledgement', status:'Drafted', decision:'Effective date, relation to Travel & Business Expense Reimbursement Policy v9.21.24, and who approves high-cost rates.' },
  { source:'Handbook, drug/alcohol, vacation, vehicle, communication policies', use:'Named policy checklist — all 18 Drive policy docs listed with proposed sign/read/BBSI classification (live now)', audience:'Employee / role-based / secure', status:'Drafted — approve classifications', decision:'Which versions are current (vehicle policy has 3 copies), which require signature vs read acknowledgement, and does the new per diem policy supersede the 9.21.24 travel policy?' },
  { source:'ExakTime English/Spanish SOPs', use:'Phone-first timekeeping lesson', audience:'Employee', status:'Drafted', decision:'Exact punch/lunch/missed-punch rules and whether Spanish ships in v1.' },
  { source:'Tool list, apparel, hard hat/PPE forms', use:'Tools/PPE page with the real required-tool list, fitter/welder extras, 30-day inspection + deduction rule (live now)', audience:'Role-based', status:'Drafted — confirm version', decision:'Docx vs PDF master, reduced list for helpers, and who approves exceptions?' },
  { source:'Damage, incident, near-miss, time off, truck, purchase, Spark Award', use:'Company links/action hub', audience:'Employee / role-based', status:'Needs routing', decision:'Who receives each submission and what happens next?' },
  { source:'KRAs and job descriptions', use:'Role expectations pages — all 15 KRA roles drafted (live now); job descriptions stay recruiting-side', audience:'Role-based (each employee sees only their role in production)', status:'Drafted — confirm versions', decision:'Confirm each KRA is current, which parts are manager-only, and the weights for partially-extracted docs (Supply Chain, Facilities, Prefab).' },
  { source:'Reviews, warnings, PIP, termination forms', use:'Admin/supervisor only', audience:'Admin-only', status:'Hold out of employee portal', decision:'Which review template ties to 30/90/180/365 milestones?' },
  { source:'Emergency Action Plan–ICE SOP (immigration enforcement response), external complaint procedure, SAP/vendor/payment SOPs', use:'None — deliberately excluded from the employee portal', audience:'Admin-only / sensitive', status:'Excluded', decision:'Confirm these stay admin-only. The ICE SOP contains personal contact numbers and must never be on an open URL.' },
  { source:'Candidate email templates / recruiting docs', use:'Recruiting workflow only', audience:'Admin/recruiting', status:'Separate from employee portal', decision:'Connect recruiting handoff later, but do not show to new hires.' },
];

const humanNeeds = [
  ['Austin approval','Review the flow and tell us what belongs in onboarding vs safety vs policies.'],
  ['Dale safety input','Final safety topic list, questions, timing, pass/fail, and hands-on signoff owner.'],
  ['Document currentness','Mark old/draft/duplicate policy docs vs official current versions.'],
  ['Visibility rules','Decide employee-facing, role-based, secure, admin-only, or recruiting-only.'],
  ['Routing owners','Name recipients/owners for time off, incident, damage, near-miss, truck, purchase, and Spark Award.'],
  ['BBSI boundary','Confirm what BBSI owns and what Goff wants the portal to track.'],
];

function initialEmployeeSection(){
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get('section');
  if(explicit) return explicit;
  if(path.includes('/admin')) return 'ops';
  if(path.includes('/training')) return 'training';
  if(path.includes('/course') || path.includes('/orientation')) return 'course';
  if(path.includes('/bbsi')) return 'bbsi';
  if(path.includes('/safety')) return 'safety';
  if(path.includes('/forms')) return 'forms';
  return 'start';
}
let section = initialEmployeeSection();
const memoryStore = {};
function safeGet(key){ try { return window.localStorage.getItem(key); } catch(_) { return memoryStore[key] || null; } }
function safeSet(key, value){ try { window.localStorage.setItem(key, value); } catch(_) { memoryStore[key] = String(value); } }
let completed = (() => { try { return JSON.parse(safeGet('goffEmployeeChecklist') || '{}'); } catch(_) { return {}; } })();
courseIndex = (() => { const v = parseInt(safeGet('goffCourseIndex') || '0', 10); return Number.isFinite(v) ? Math.max(0, Math.min(ORIENTATION_STEPS.length - 1, v)) : 0; })();
function save(){ safeSet('goffEmployeeChecklist', JSON.stringify(completed)); }
function pct(){ return Math.round((trainingSteps.filter((_,i)=>completed[`training-${i}`]).length / trainingSteps.length) * 100); }
function coursePct(){ if(completed.orientation) return 100; return Math.round((ORIENTATION_STEPS.filter((_,i)=>completed[`course-${i}`]).length / ORIENTATION_STEPS.length) * 100); }
function toggle(key){ completed[key] = !completed[key]; save(); render(); }
function nav(id, updateUrl=true){
  section=id;
  if(updateUrl){
    const url = new URL(window.location.href);
    url.searchParams.set('section', id);
    window.history.pushState({section:id}, '', url.toString());
  }
  render();
  window.scrollTo({top:0, behavior:'smooth'});
}
window.addEventListener('popstate', () => {
  section = initialEmployeeSection();
  render();
  window.scrollTo({top:0, behavior:'smooth'});
});
function copyLink(){
  navigator.clipboard?.writeText('https://portal.goffwelding.com/onboarding');
  const old=document.querySelector('.toast'); if(old) old.remove();
  const t=document.createElement('div'); t.className='toast'; t.textContent='Employee portal link copied'; document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}
function esc(s){ return String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

function header(){
  return `<header class="hero">
    <div class="brandbar"><img src="/goff-welding-logo.png" alt="Goff Welding" /><span>Employee portal</span></div>
    <div class="hero-grid">
      <div>
        <p class="eyebrow">${esc(PROFILE.status)} • Goff onboarding path</p>
        <h1>Welcome to Goff Welding, ${esc(PROFILE.firstName)}.</h1>
        <p class="lead">Everything you need for your first day — where to go, what to review, and who will help you get started.</p>
        <div class="hero-actions"><button onclick="nav('course')">Start orientation course</button><button class="secondary" onclick="nav('training')">Open training path</button><button class="secondary" onclick="copyLink()">Copy re-access link</button></div>
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

function tabs(){
  const internalSections = new Set(['ops','clearance','handoff','admin']);
  if(!internalSections.has(section)){
    const simple = [['start','My onboarding path'],['resources','Resources'],['help','Help / questions']];
    return `<nav class="tabs simple-tabs">${simple.map(([id,label])=>`<button class="${section===id?'active':''}" onclick="nav('${id}')">${esc(label)}</button>`).join('')}</nav>`;
  }
  const groups = ['Admin','Review'];
  return `<nav class="tabs grouped-tabs">${groups.map(group=>`<div class="tab-group"><span>${esc(group)}</span>${pages.filter(p=>p[2]===group).map(([id,label])=>`<button class="${section===id?'active':''}" onclick="nav('${id}')">${esc(label)}</button>`).join('')}</div>`).join('')}<div class="tab-group portal-switch"><span>One portal — switch area</span><a href="?section=start">Employee view</a><a href="/goff-recruiting/">Recruiting platform</a><a href="/goff-recruiting/?view=career">Public careers page</a></div></nav>`;
}
function startSection(){
  const steps = [
    ['course','First-day orientation','Start here. The 30,000-foot view of Goff — who we are, our values, and what to expect.','Begin',
      () => completed.orientation || coursePct()===100],
    ['policies','Policies & acknowledgements','Read each company policy and answer its check. Signatures are captured with your record.','Continue',
      () => POLICY_WALKTHROUGH.every(w => !w.kc || kcState[w.kc]?.correct)],
    ['safety','Safety training','Work through the safety sections and pass the quiz before hands-on work.','Continue',
      () => SAFETY_SECTIONS.every(safetySectionDone) && quizScore()===SAFETY_QUIZ.length],
    ['exaktime','Learn work basics','Set up ExakTime, learn to clock in, and handle timecards the Goff way.','Continue',
      () => completed['path-exaktime'] === true],
    ['handoff','Meet with your supervisor','Review role expectations, tools/PPE, first assignment, and open questions.','Finish',
      () => completed['path-handoff'] === true]
  ];
  const stepDone = (i) => steps[i][4]();
  return `<section class="panel employee-path"><p class="eyebrow">My onboarding path</p><h2>Start with first-day orientation. Then keep going in order.</h2><p class="summary">Before you begin: confirm your arrival time, location, and supervisor in the card above. Then work through the steps below with your supervisor or on your own.</p><div class="path-steps">${(()=>{ const firstOpen = steps.findIndex((_,i)=>!stepDone(i)); return steps.map((step,i)=>{ const done=stepDone(i); return `<article class="path-step ${done?'complete':i===firstOpen?'current':''}"><span>${done?'Complete':`Step ${i+1}`}</span><h3>${esc(step[1])}</h3><p>${esc(step[2])}</p><button class="${done?'secondary':''}" onclick="nav('${step[0]}')">${done?'Completed ✓':esc(step[3])}</button></article>`; }).join(''); })()}</div></section><section class="grid two"><article class="panel"><p class="eyebrow">Progress</p><h2>${coursePct()}% orientation • ${pct()}% checklist</h2><div class="bar"><i style="width:${Math.max(coursePct(), pct())}%"></i></div><p>Production will save this to the employee record. For this review version, progress is saved on this device.</p></article><article class="panel"><p class="eyebrow">After onboarding</p><h2>This becomes your employee home.</h2><p>Once onboarding is complete, the portal should open to resources, policies, forms, and training refreshers — not this first-day path.</p><button class="secondary" onclick="nav('resources')">Preview resources</button></article></section>`;
}

function setCourseSlide(i){ courseIndex = Math.max(0, Math.min(ORIENTATION_STEPS.length-1, i)); safeSet('goffCourseIndex', courseIndex); render(); window.scrollTo({top:0, behavior:'smooth'}); }
function toggleCourseSlide(i){ completed[`course-${i}`] = !completed[`course-${i}`]; save(); render(); }
function completeAndNextCourseSlide(i){
  completed[`course-${i}`] = true;
  save();
  setCourseSlide(i+1);
}
function finishOrientation(){
  if(!orientationQuizDone()){
    const quizIdx = ORIENTATION_STEPS.findIndex(s => s.quiz);
    setCourseSlide(quizIdx >= 0 ? quizIdx : 0);
    return;
  }
  completed[`course-${courseIndex}`] = true;
  completed.orientation = true;
  save();
  nav('policies');
}
function courseSlideCanvas(item){
  const theme = item.theme || 'light';
  const heroTitle = theme === 'dark'
    ? `${esc(item.title)}<span class="rp">.</span>`
    : esc(item.title);
  const cards = item.cards ? `<div class="slide-cards cols-${Math.min(item.cards.length,4)}">${item.cards.map((c,i)=>{
    const [h,b,ic] = c;
    const badge = item.numbered
      ? `<span class="slide-ic num">${String(i+1).padStart(2,'0')}</span>`
      : `<span class="slide-ic">${orientIcon(ic)}</span>`;
    return `<article class="slide-card">${badge}<h4>${esc(h)}</h4><p>${esc(b)}</p></article>`;
  }).join('')}</div>` : '';
  const quiz = item.quiz ? `<div class="slide-quiz">${item.quiz.map((id,i)=>kcCard(id, `Question ${i+1} of ${item.quiz.length}`)).join('')}</div>` : '';
  return `<article class="slide-canvas theme-${theme}">
    <span class="g-mark" aria-hidden="true">G</span>
    <div class="slide-inner">
      ${item.austin?`<div class="austin-badge">Austin Goff • CEO</div>`:''}
      <p class="slide-eyebrow">${esc(item.eyebrow)}</p>
      <h3 class="slide-headline">${heroTitle}</h3>
      ${item.lede?`<p class="slide-lede">${esc(item.lede)}</p>`:''}
      ${item.body?`<p class="slide-body">${esc(item.body)}</p>`:''}
      ${cards}
      ${quiz}
      ${item.prompt?`<blockquote class="slide-quote">${esc(item.prompt)}</blockquote>`:''}
    </div>
  </article>`;
}
function courseSection(){
  const item = ORIENTATION_STEPS[courseIndex] || ORIENTATION_STEPS[0];
  const done = completed[`course-${courseIndex}`];
  const completeCount = ORIENTATION_STEPS.filter((_,i)=>completed[`course-${i}`]).length;
  const quizGate = item.quiz && !item.quiz.every(id => kcState[id]?.correct);
  return `<section class="austin-course"><div class="course-top"><div><p class="eyebrow">Goff orientation — the 30,000-foot view</p><h2>Step ${courseIndex+1} of ${ORIENTATION_STEPS.length}</h2><p>${completeCount} of ${ORIENTATION_STEPS.length} sections complete • Safety training and policy details come next, in their own sections</p></div><div class="course-meter"><strong>${coursePct()}%</strong><span>complete</span></div></div><div class="bar course-bar"><i style="width:${coursePct()}%"></i></div>${courseSlideCanvas(item)}<div class="course-actions"><button class="secondary" onclick="setCourseSlide(${courseIndex-1})" ${courseIndex===0?'disabled':''}>← Previous</button>${courseIndex===ORIENTATION_STEPS.length-1
  ? `<button class="complete-btn done" onclick="finishOrientation()">Finish orientation → Next step</button>`
  : quizGate
    ? `<button class="complete-btn" disabled title="Answer all four questions to continue">Answer all questions to continue</button><button disabled title="Answer all four questions to continue">Next →</button>`
    : `<button class="complete-btn ${done?'done':''}" onclick="toggleCourseSlide(${courseIndex})">${done?'Complete ✓':'Mark complete'}</button><button onclick="completeAndNextCourseSlide(${courseIndex})">Next →</button>`}</div><div class="orientation-outline" aria-label="Goff orientation sections">${ORIENTATION_STEPS.map((s,i)=>`<button class="orientation-dot ${i===courseIndex?'active':''} ${completed[`course-${i}`]?'done':''}" onclick="setCourseSlide(${i})"><span>${completed[`course-${i}`]?'✓':i+1}</span><b>${esc(s.title)}</b></button>`).join('')}</div></section>`;
}

function trainingSection(){ return `<section class="panel training-panel"><p class="eyebrow">Guided new-hire path</p><h2>From cleared candidate to active employee</h2><p class="summary">This is the consistent training sequence Austin was describing. It reduces the day-one fire hose and gives Goff a second pass at the 30-day check-in.</p><div class="training-steps">${trainingSteps.map((s,i)=>`<article class="training-step ${completed[`training-${i}`]?'complete':''}"><button class="step-check" onclick="toggle('training-${i}')">${completed[`training-${i}`]?'✓':i+1}</button><div><span>${esc(s.timing)} • ${esc(s.owner)}</span><h3>${esc(s.title)}</h3><p>${esc(s.why)}</p><button class="inline" onclick="nav('${s.page}')">Open module</button></div></article>`).join('')}</div></section>`; }
function markPathStep(id){ completed[`path-${id}`] = !completed[`path-${id}`]; save(); render(); }
function pathStepBar(id, label){
  const done = completed[`path-${id}`] === true;
  return `<div class="path-mark ${done?'done':''}"><p>${esc(label)}</p><button class="${done?'secondary':''}" onclick="markPathStep('${id}')">${done?'Step complete ✓ (tap to undo)':'Mark this step complete'}</button></div>`;
}
function contentPage(id){ const p=pageContent[id]; if(!p) return startSection(); const bar = id==='exaktime' ? pathStepBar('exaktime','Done reading and set up? Mark the work-basics step complete.') : id==='handoff' ? pathStepBar('handoff','Handoff finished with your supervisor? Mark the final step complete.') : ''; return `<section class="panel doc-page"><p class="eyebrow">${esc(p.kicker)}</p><h2>${esc(p.title)}</h2><p class="summary">${esc(p.summary)}</p><div class="doc-blocks">${p.blocks.map(([h,b])=>`<article><h3>${esc(h)}</h3><p>${esc(b)}</p></article>`).join('')}</div>${bar}<div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section>`; }
function formsSection(){ return `<section class="panel"><p class="eyebrow">Company links training</p><h2>Forms employees need to understand</h2><p class="summary">Each form should teach when to use it, how to submit it, who sees it, and what happens after. Final routing and visibility will be locked after Austin confirms who owns each form and which links are employee-visible.</p><div class="form-modules">${formModules.map(m=>`<article class="form-module"><div class="module-head"><span>${esc(m.status)}</span><h3>${esc(m.title)}</h3><small>${esc(m.audience)}</small></div><dl><div><dt>When to use it</dt><dd>${esc(m.when)}</dd></div><div><dt>How to submit</dt><dd>${esc(m.how)}</dd></div><div><dt>What happens next</dt><dd>${esc(m.next)}</dd></div><div class="proposed-route"><dt>Proposed routing — DRAFT</dt><dd>${esc(m.route)}</dd></div><div class="confirm"><dt>Confirm</dt><dd>${esc(m.confirm)}</dd></div></dl></article>`).join('')}</div></section>`; }
function checkinSection(){ return `<section class="panel checkin-panel"><p class="eyebrow">Follow-up after the fire hose</p><h2>30-day check-in</h2><p class="summary">Austin said the first day can be a fire hose. This check-in gives Goff a structured second pass after the employee has real context.</p><div class="checkin-grid">${checkinItems.map((item,i)=>`<label class="check ${completed[`checkin-${i}`]?'checked':''}"><input type="checkbox" ${completed[`checkin-${i}`]?'checked':''} onchange="toggle('checkin-${i}')" /><span><b>${esc(item.title)}</b><small>${esc(item.detail)}</small></span></label>`).join('')}</div><div class="manager-note"><h3>Admin/supervisor record</h3><textarea placeholder="Questions asked, expectations clarified, follow-up assigned, manager notes..."></textarea><p class="note"><strong>Production database needed:</strong> notes, assignments, and completion status will activate once employee records are server-side.</p><div class="admin-actions"><button disabled title="Requires production database">Save check-in note</button><button disabled title="Requires production database">Assign follow-up</button><button disabled title="Requires production database">Mark 30-day complete</button></div></div></section>`; }
function opsSection(){
  return `<section class="panel ops-panel"><p class="eyebrow">Admin-side onboarding control</p><h2>Who needs what next</h2><p class="summary">This is the internal operating view: not another document list. It shows each new hire’s stage, blockers, owner actions, and follow-up timing.</p><div class="metric-grid">${adminMetrics().map(m=>`<article><span>${esc(m.label)}</span><strong>${esc(m.value)}</strong><p>${esc(m.detail)}</p></article>`).join('')}</div></section><section class="panel"><p class="eyebrow">Onboarding queue</p><h2>Employee status board</h2><div class="employee-board">${currentOnboardingQueue().map(e=>`<article class="employee-row ${e.fromRecruiting?'from-recruiting':''}"><div><span class="status-pill">${esc(e.status)}</span><h3>${esc(e.name)}</h3><p>${esc(e.role)}</p></div><dl><div><dt>Stage</dt><dd>${esc(e.stage)}</dd></div><div><dt>Supervisor</dt><dd>${esc(e.supervisor)}</dd></div><div><dt>Start</dt><dd>${esc(e.start)}</dd></div></dl><div class="mini-progress"><span>${esc(e.progress)}%</span><i style="width:${esc(e.progress)}%"></i></div><div class="row-next"><b>Blocked / watch</b><p>${esc(e.blocked)}</p><b>Next action</b><p>${esc(e.next)}</p></div></article>`).join('')}</div></section><section class="grid two"><article class="panel"><p class="eyebrow">Owner lanes</p><h2>Next actions by owner</h2><div class="owner-lanes">${ownerActions.map(l=>`<div class="owner-lane"><h3>${esc(l.owner)} <span>${esc(l.count)}</span></h3><ul>${l.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`).join('')}</div></article><article class="panel"><p class="eyebrow">Current blockers</p><h2>Decisions holding automation</h2><div class="blocker-list">${blockers.map(b=>`<article><span>${esc(b.owner)}</span><b>${esc(b.title)}</b><p>${esc(b.impact)}</p></article>`).join('')}</div></article></section><section class="panel"><p class="eyebrow">Operating timeline</p><h2>Admin checklist from clearance to 30 days</h2><div class="admin-timeline">${adminTimeline.map(([title,detail],i)=>`<article><span>${i+1}</span><div><b>${esc(title)}</b><p>${esc(detail)}</p></div></article>`).join('')}</div><p class="note"><strong>Production database needed:</strong> these actions become one-click workflow actions once onboarding records are server-side.</p><div class="admin-actions"><button disabled title="Requires production database">Generate welcome message</button><button disabled title="Requires production database">Verify BBSI complete</button><button disabled title="Requires production database">Assign supervisor handoff</button><button disabled title="Requires production database">Schedule 30-day check-in</button></div></section>
  <section class="panel"><p class="eyebrow">Training oversight — what Austin asked for on the July 1 call</p><h2>Who actually read it, and who click-click-clicked</h2><p class="summary">Every knowledge check tracks attempts, not just completion. Quinton and managers see per-employee results: first-try answers versus second-guessing, section completion, quiz scores, and acknowledgements. Demo data below is from this device.</p>
  <div class="metric-grid">${(()=>{const s=kcStats();return [
    { label:'Knowledge checks', value:`${s.done}/${s.total}`, detail:'Answered correctly so far on this device' },
    { label:'First-try correct', value:String(s.firstTry), detail:'Read it and got it — the signal Austin wants' },
    { label:'Needed retries', value:String(s.retried), detail:'Second-guessed — flag for a manager conversation' },
    { label:'Safety quiz', value:`${quizScore()}/${SAFETY_QUIZ.length}`, detail:'Pass/fail rule pending Dale' },
  ].map(m=>`<article><span>${esc(m.label)}</span><strong>${esc(m.value)}</strong><p>${esc(m.detail)}</p></article>`).join('')})()}</div>
  <div class="doc-blocks" style="margin-top:16px"><article><h3>Assign retraining</h3><p>Manager assigns any section or policy to an employee with a deadline (“Did you even read the vehicle policy? You’re doing it tomorrow.”) — trackable instead of take-my-word-for-it.</p></article><article><h3>Yearly refresher</h3><p>Each year every employee gets 5 randomly-pulled sections as a refresher, per Austin. With all resources in one spot, this becomes a button, not a project.</p></article></div>
  <div class="admin-actions"><button disabled title="Requires production database">Assign section to employee</button><button disabled title="Requires production database">Set completion deadline</button><button disabled title="Requires production database">Trigger yearly refresher</button></div></section>`;
}
function resourcesSection(){ return `<section class="panel"><p class="eyebrow">Employee resources</p><h2>After onboarding, this becomes the main employee home.</h2><p class="summary">A new employee does not need to choose from all resources on day one. They learn them through onboarding first. Once complete, this page becomes the place to come back for forms, policies, training refreshers, and company links.</p><div class="cards">${[['faq','FAQs — search anything'],['forms','Company forms'],['policies','Policies'],['perdiem','Per diem / travel'],['exaktime','Timekeeping'],['bbsi','Paystubs / myBBSI'],['safety','Safety refresher'],['tools','Tools / PPE'],['role','Role expectations'],['milestones','Check-ins']].map(([id,label])=>`<button class="page-card" onclick="nav('${id}')"><b>${esc(label)}</b><small>Open resource</small></button>`).join('')}</div></section>`; }

function helpSection(){ return `<section class="panel"><p class="eyebrow">Help / questions</p><h2>If you are not sure what to do, ask here first.</h2><div class="doc-blocks"><article><h3>Check the FAQs</h3><p>Most day-one questions (parking, paychecks, time off, PPE, trucks) are already answered. <button class="inline-link" onclick="nav('faq')">Search the FAQs</button></p></article><article><h3>Your supervisor</h3><p>${esc(PROFILE.supervisor)} is the first person to ask about your first assignment, tools, PPE, and work expectations. If you can’t reach your supervisor, call the main office line.</p></article><article><h3>Goff admin / office</h3><p>Ask Goff admin if you are stuck on employment setup, login links, forms, or schedule/start details. Payroll questions go to HR or the Office Manager. Lost Work Schedule access goes to the Scheduler.</p></article><article><h3>Safety question</h3><p>Stop and ask before doing work that feels unsafe, unclear, or outside your training. Report hazards, near misses, and injuries immediately.</p></article><article><h3>Portal issue</h3><p>If something in the portal looks wrong or does not match what your supervisor told you, ask before guessing.</p></article></div></section>`; }

function adminSection(){ return `<section class="panel"><p class="eyebrow">Austin review mode</p><h2>Drive → portal reconciliation</h2><p class="summary">This is the architect view for Austin/Goff, not the employee start page. It shows what source material is being used, where it belongs, and what decision is needed before we make it employee-ready.</p><div class="phase-grid">${phaseOneStatus.map(x=>`<article><span>${esc(x.status)}</span><b>${esc(x.area)}</b><p>${esc(x.detail)}</p></article>`).join('')}</div></section><section class="panel"><p class="eyebrow">Source material crosswalk</p><h2>What goes where</h2><div class="recon-table">${reconciliationRows.map(r=>`<article><div><span>Source</span><b>${esc(r.source)}</b></div><div><span>Use in portal</span><p>${esc(r.use)}</p></div><div><span>Audience</span><p>${esc(r.audience)}</p></div><div><span>Status</span><em>${esc(r.status)}</em></div><div><span>Decision needed</span><p>${esc(r.decision)}</p></div></article>`).join('')}</div></section><section class="grid two"><article class="panel"><p class="eyebrow">Human input needed</p><h2>What Jeff/Austin/Dale need to answer</h2><div class="question-list">${humanNeeds.map(([topic,q])=>`<article><span>${esc(topic)}</span><b>${esc(q)}</b></article>`).join('')}</div></article><article class="panel"><p class="eyebrow">Walkthrough questions</p><h2>Questions for Goff/BBSI</h2><div class="question-list single">${adminQuestions.map(([topic,q])=>`<article><span>${esc(topic)}</span><b>${esc(q)}</b></article>`).join('')}</div><p class="note"><strong>Phase 1 rule:</strong> build the reviewable structure now; save real employee records, quiz results, acknowledgements, reminders, and signatures for backend work after Goff approves the flow.</p></article></section>`; }

function setFaqSearch(value){ faqSearch = String(value || '').toLowerCase(); const target = document.getElementById('faq-results'); if(target) target.innerHTML = faqResults(); }
function faqResults(){
  const s = faqSearch.trim();
  const groups = FAQ_DATA.map(g => ({ category:g.category, items: s ? g.items.filter(([q,a]) => (q+' '+a).toLowerCase().includes(s)) : g.items })).filter(g => g.items.length);
  if(!groups.length) return `<p class="summary" style="padding-top:14px">No answers match “${esc(faqSearch)}”. Try a different word, or ask your supervisor or the office.</p>`;
  return groups.map(g => `<div class="faq-group"><h3>${esc(g.category)}</h3>${g.items.map(([q,a]) => `<details class="faq-item"${s?' open':''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`).join('');
}
function faqSection(){
  const total = FAQ_DATA.reduce((n,g)=>n+g.items.length,0);
  return `<section class="panel doc-page"><p class="eyebrow">From Goff Welding FAQs (Drive, 2026)</p><h2>Frequently asked questions</h2><p class="summary">${total} real questions and answers from Goff’s FAQ document — where things are, how time and pay work, who to call, and what to do when something goes wrong. Search or browse by topic.</p>
  <input type="search" class="faq-search" placeholder="Search: parking, paycheck, time off, PPE, truck..." oninput="setFaqSearch(this.value)" autocomplete="off" />
  <div id="faq-results">${faqResults()}</div>
  <div class="confirm-box"><h3>Questions to confirm with Goff</h3><ul><li>Is the FAQ PDF (April 2026) still current on every answer — especially payroll, advances, and Travel Bank?</li><li>Should the Work Schedule / Company Links references become live links in the portal once visibility is approved?</li><li>Should a Spanish version of the FAQ ship in v1?</li></ul></div></section>`;
}

function answerQuiz(i, val){ quizAnswers[i] = val; safeSet('goffSafetyQuizV3', JSON.stringify(quizAnswers)); render(); }
function resetQuiz(){ quizAnswers = {}; safeSet('goffSafetyQuizV3', '{}'); render(); }
function quizScore(){ return SAFETY_QUIZ.reduce((n,item,i)=> n + (quizAnswers[i] === item.a ? 1 : 0), 0); }
function quizAnsweredCount(){ return SAFETY_QUIZ.reduce((n,_,i)=> n + (typeof quizAnswers[i] === 'boolean' ? 1 : 0), 0); }
function safetySection(){
  const p = pageContent.safety;
  const answered = quizAnsweredCount();
  const score = quizScore();
  const done = answered === SAFETY_QUIZ.length;
  const passed = done && score === SAFETY_QUIZ.length;
  const sectionsDone = SAFETY_SECTIONS.filter(safetySectionDone).length;
  return `<section class="panel doc-page"><p class="eyebrow">Safety Training — separate from orientation, per Austin</p><h2>Safety training sections</h2><p class="summary">Work through each section, then answer its knowledge check. ${sectionsDone} of ${SAFETY_SECTIONS.length} sections complete. Goff plans 10–15 sections total (~15 minutes each) — the remaining sections arrive as Dale and BBSI’s safety team deliver material. The pass/fail quiz at the bottom completes your safety record.</p>
  <div class="safety-sections">${SAFETY_SECTIONS.map((s,i)=>{
    const isDone = safetySectionDone(s);
    const read = completed[`safesec-${s.id}`];
    return `<details class="safety-sec ${isDone?'done':''}" ${!isDone && (i===0 || safetySectionDone(SAFETY_SECTIONS[i-1]||{}))?'open':''}><summary><span class="sec-num">${isDone?'✓':i+1}</span>${esc(s.title)}<em>${isDone?'Complete':s.kc?'Reading + knowledge check':'Reading'}</em></summary>
    <div class="doc-blocks">${s.cards.map(([h,b])=>`<article><h3>${esc(h)}</h3><p>${esc(b)}</p></article>`).join('')}</div>
    <div class="admin-actions" style="margin-top:12px"><button class="${read?'secondary':''}" onclick="toggleSafetySection('${s.id}')">${read?'Marked as read ✓':'Mark section as read'}</button></div>
    ${s.kc ? kcCard(s.kc, `Knowledge check · Section ${i+1}`) : ''}</details>`;
  }).join('')}
  <article class="safety-sec placeholder"><span class="sec-num">…</span><div><b>Sections ${SAFETY_SECTIONS.length+1}–15 reserved</b><p>Dale and BBSI’s safety team are gathering additional topics and teaching material. As it arrives, each topic becomes a section here — same format, same tracking.</p></div></article></div></section>
  <section class="panel quiz-panel"><p class="eyebrow">Pass/fail quiz — from Goff’s Safety Training &amp; Quiz V3, pending Dale’s pass rule</p><h2>Safety training quiz</h2><p class="summary">These 10 true/false questions are taken directly from Goff’s current New Employee Safety Training handbook. Answer all 10. In production, results save to your employee record and route to HR/Safety; in this review version they save to this device.</p>
  <div class="quiz-meter"><strong>${score}/${SAFETY_QUIZ.length}</strong><span>${done ? (passed ? 'All correct — acknowledgement unlocked' : 'Review the highlighted answers') : `${answered} of ${SAFETY_QUIZ.length} answered`}</span></div>
  <div class="quiz-list">${SAFETY_QUIZ.map((item,i)=>{
    const ans = quizAnswers[i];
    const answeredThis = typeof ans === 'boolean';
    const correct = answeredThis && ans === item.a;
    return `<article class="quiz-q ${answeredThis ? (correct ? 'correct' : 'wrong') : ''}"><div class="quiz-q-text"><span>Q${i+1}</span><p>${esc(item.q)}</p></div><div class="quiz-btns"><button class="${answeredThis && ans===true ? 'picked' : ''}" onclick="answerQuiz(${i},true)">TRUE</button><button class="${answeredThis && ans===false ? 'picked' : ''}" onclick="answerQuiz(${i},false)">FALSE</button></div>${answeredThis ? `<p class="quiz-feedback">${correct ? '✓ Correct' : `✗ Check the handbook — the correct answer is ${item.a ? 'TRUE' : 'FALSE'}`}</p>` : ''}</article>`;
  }).join('')}</div>
  ${passed ? `<div class="ack-box"><h3>Employee acknowledgement</h3><p>${esc(SAFETY_ACK)}</p><div class="admin-actions"><button disabled title="Requires production database">Sign &amp; submit to HR / Safety Manager</button><button class="secondary" onclick="resetQuiz()">Retake quiz</button></div><p class="note" style="margin-top:12px"><strong>Production note:</strong> the signed acknowledgement is kept in the employee personnel file (HR or Safety Manager). Signature capture activates with the production database.</p></div>` : done ? `<div class="confirm-box"><h3>Not quite</h3><ul><li>Review the highlighted questions above, then correct your answers. In production, Dale/Goff decide the pass rule and retake policy.</li></ul><div class="admin-actions" style="margin-top:10px"><button class="secondary" onclick="resetQuiz()">Start over</button></div></div>` : ''}
  <div class="confirm-box"><h3>Pending Dale / Goff</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section>`;
}

function selectKra(id){ kraSelected = id; render(); }
function roleSection(){
  const p = pageContent.role;
  const k = KRA_DATA.find(x=>x.id===kraSelected) || KRA_DATA[0];
  return `<section class="panel doc-page"><p class="eyebrow">Draft from Goff’s KRA documents — confirm current versions &amp; visibility</p><h2>Role expectations / KRA</h2><p class="summary">Each role at Goff has a Key Results Area document: why the role exists, what success looks like, and how performance is scored. All 15 roles are drafted below from the actual KRA docs in Drive. In production each employee sees only the KRA for their own role — this picker is for review. Business-sensitive targets (revenue, quoting volumes) are held back to the role-scoped documents.</p>
  <div class="kra-tabs">${KRA_DATA.map(x=>`<button class="${x.id===kraSelected?'active':''}" onclick="selectKra('${x.id}')">${esc(x.role)}</button>`).join('')}</div>
  <article class="kra-card"><p class="eyebrow">Role identity</p><h3>${esc(k.role)}</h3><blockquote>${esc(k.identity)}</blockquote><p class="summary">${esc(k.why)}</p>
  <div class="kra-areas">${k.areas.map(([title,weight,detail])=>`<article><div class="kra-weight">${esc(weight)}</div><b>${esc(title)}</b><p>${esc(detail)}</p></article>`).join('')}</div>
  <div class="doc-blocks" style="margin-top:16px"><article><h3>What success looks like</h3><p>${esc(k.success)}</p></article><article><h3>Failure signals</h3><p>${esc(k.failure)}</p></article></div></article>
  <div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}<li>A few KRA docs were partially extracted (Supply Chain, Facilities, Prefab) — some area weights show “—” until confirmed against the source doc.</li></ul></div></section>`;
}

function main(){
  if(section==='start') return startSection();
  if(section==='ops') return opsSection();
  if(section==='training') return trainingSection();
  if(section==='course') return courseSection();
  if(section==='values') return contentPage('values');
  if(section==='clearance') return contentPage('clearance');
  if(section==='before') return contentPage('before');
  if(section==='bbsi') return contentPage('bbsi');
  if(section==='policies') return policiesSection();
  if(section==='exaktime') return contentPage('exaktime');
  if(section==='safety') return safetySection();
  if(section==='forms') return formsSection();
  if(section==='tools') return contentPage('tools');
  if(section==='role') return roleSection();
  if(section==='faq') return faqSection();
  if(section==='perdiem') return contentPage('perdiem');
  if(section==='handoff') return contentPage('handoff');
  if(section==='milestones') return contentPage('milestones');
  if(section==='resources') return resourcesSection();
  if(section==='help') return helpSection();
  if(section==='checkin') return checkinSection();
  if(section==='admin') return adminSection();
  return startSection();
}
function courseHeader(){ return `<header class="course-appbar"><img src="/goff-welding-logo.png" alt="Goff Welding" /><button class="secondary" onclick="nav('start')">Portal home</button></header>`; }
function render(){
  const app = document.getElementById('app');
  if(section==='course'){
    app.innerHTML = `${courseHeader()}<main class="course-wrap">${main()}</main>`;
  } else {
    app.innerHTML = `${header()}<main class="wrap">${tabs()}${main()}</main><footer>Private Goff Welding employee portal</footer>`;
  }
}
render();
