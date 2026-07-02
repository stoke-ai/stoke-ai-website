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
  ['training','Full path map','Admin'],
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
  kc7:{ q:'Which of the following must be kept confidential?', options:['Only customer credit-card numbers','Nothing — our work is public','Only documents marked “secret”','Customer info, drawings, pricing, and company processes'], correct:3 },
  kc8:{ q:'You realize you will be late for your shift. What should you do?', options:['Wait and explain once you arrive','Communicate the delay as early as possible','Have a coworker quietly cover for you','Nothing, as long as it rarely happens'], correct:1 },
  // Orientation wrap-up check — per Austin: "they've passed two or three
  // questions" is the satisfactory-consumption signal. Light, not pass/fail.
  kc10:{ q:'What are Goff Welding’s four core values?', options:['Speed, strength, silence, and sales','Profit, punctuality, pride, and power','Talent, toughness, tradition, and trust','Integrity, humility, respect, and accountability'], correct:3 },
  kc11:{ q:'Which of these is Goff’s absolute priority on every single job?', options:['Operating safely so everyone goes home — every single day','Finishing as fast as possible','Using the least amount of material','Beating the estimate no matter what'], correct:0 },
  kc12:{ q:'What does “good” look like in your first 90 days?', options:['Keep your head down and stay quiet','Memorize every policy word-for-word','Learn processes, demonstrate reliability, develop proficiency','Work overtime every week'], correct:2 },
  kc13:{ q:'You’re not sure how to start a task. What does Goff expect you to do?', options:['Guess and keep moving so you look busy','Ask instead of guessing — repeat the task back if you’re unsure','Wait until someone notices you’re stuck','Skip it and start something else'], correct:1 },
  // Policy-course checks, authored from the actual policy documents.
  kc14:{ q:'What happens if you refuse a drug test or tamper with a sample?', options:['Nothing, if it’s your first time','You are retested the following week','Your manager decides later','It is treated as a policy violation and may result in immediate termination'], correct:3 },
  kc15:{ q:'You’re taking a prescription that makes you drowsy. What does the policy require?', options:['Notify your supervisor that it may impair your ability to work safely','Nothing — prescriptions are legal','Stop taking the medication','Use vacation days until it’s done'], correct:0 },
  kc16:{ q:'You scrape a company truck against a post and nobody saw it. What does the policy require?', options:['Fix it quietly and move on','Only report damage over $500','Report it to your supervisor and HR within 48 hours, regardless of severity','Wait for the next vehicle inspection'], correct:2 },
  kc17:{ q:'Your kid needs a ride while you’re driving the company truck. What does the policy say?', options:['Fine for short trips','Non-employees — including family — may not ride in company trucks','Fine if they’re in a car seat','Fine on weekends only'], correct:1 },
  kc18:{ q:'When can you start USING your accrued vacation time?', options:['Immediately — day one','After six months','After one year','After the 90-day introductory period (accrual itself starts day one)'], correct:3 },
  kc19:{ q:'What happens when your banked vacation reaches 1.5× your annual accrual rate?', options:['Accrual stops until you use some time','You lose it all on January 1','It automatically pays out','Nothing — it keeps growing'], correct:0 },
  kc20:{ q:'How many unexcused occurrences are you allowed per calendar year before discipline starts?', options:['1','3','5','10'], correct:2 },
  kc21:{ q:'You wake up sick. When must you notify your supervisor?', options:['By the end of the day','At least 1 hour before your shift starts','Within 24 hours','Only if you’ll miss two or more days'], correct:1 },
  kc22:{ q:'You’re a Tradesman 4 (helper). What color hard hat do you wear?', options:['Orange','Brown','White','Black'], correct:0 },
  kc23:{ q:'Your hard hat’s suspension is frayed. What does the SOP require?', options:['Tape it up','Wear it carefully until payday','Turn the hat backward','Replace it immediately'], correct:3 },
  kc24:{ q:'How long does the video release last once you sign it?', options:['One year','Until you leave Goff','Forever — it is granted in perpetuity, worldwide','Five years'], correct:2 },
  kc25:{ q:'You resign three weeks after starting. What happens to the apparel you were issued?', options:['Nothing — it was a gift','Its total value is deducted from your final paycheck (leaving within the first 30 days)','You mail the shirts back','Goff bills you later'], correct:1 },
  kc26:{ q:'Where do you find the Employee Handbook?', options:['Ask HR to print a copy','It’s posted in the breakroom','Emailed to you monthly','Work Schedule → Company Links → Employee Handbook (Employee Copy)'], correct:3 },
  kc27:{ q:'When does per diem apply?', options:['Any drive over 30 minutes','Whenever you buy lunch on a job','Only approved overnight travel outside the daily commute range (~1 hour / 60 miles)','Every scheduled Friday'], correct:2 },
  kc28:{ q:'What is the standard overnight meals & incidentals (M&IE) per diem?', options:['$60 per day, no receipts required','$100 per day with receipts','$25 per day','Whatever you actually spend'], correct:0 },
  kc29:{ q:'What makes a correct timecard entry?', options:['“Welding” is enough','“Working, 8 hours”','Whatever the foreman writes','WHAT you did, WHERE, WHO we bill, HOW long (quarter-hour), WHEN done, and DID you break'], correct:3 },
  // Handbook course checks (from the full 67-page handbook, rev 3/7/2025).
  kc30:{ q:'You miss three consecutive scheduled days without notifying anyone. Per the handbook, what happens?', options:['You are considered to have voluntarily quit and are removed from payroll','You get a verbal warning','HR calls you within 48 hours','Nothing, if you had a good reason'], correct:0 },
  kc31:{ q:'Which is true about paid holidays at Goff?', options:['Every employee gets them from day one','There are four — New Year’s, July 4th, Thanksgiving, Christmas — with eligibility after one year','All ten federal holidays are paid','Holiday pay counts as hours worked for overtime'], correct:1 },
  kc32:{ q:'How many forgotten weekly timecard approvals are you allowed before consequences (like a delayed paycheck)?', options:['One','Five','Three','Unlimited'], correct:2 },
  kc33:{ q:'The person harassing you IS your supervisor. What does the handbook say to do?', options:['Wait and document it for three incidents first','Tell your coworkers so they can back you up','Nothing can be done','Go directly to HR or any member of management — reports are investigated without reprisal'], correct:3 },
  // Work-basics course checks (from the ExakTime SOPs + FAQ).
  kc34:{ q:'Your Tuesday time entry is wrong. What is the deadline to fix it?', options:['Fix it whenever you notice','Get the correction to Andrea no later than Monday at noon','By the end of the pay year','Corrections are not allowed'], correct:1 },
  kc35:{ q:'Your supervisor approved your timecard Monday afternoon — then you spot an error. What now?', options:['Tap Unapprove and fix it yourself','Edit the entry directly','Let it go — it is locked forever','You cannot un-approve it yourself — speak with your supervisor or an administrator'], correct:3 },
  kc36:{ q:'What do you use for work-related phone calls?', options:['The QUO app with your assigned company number','Your personal cell number','Any messaging app you like','Calls are not allowed during work'], correct:0 },
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
  { id:'safety', title:'Safety orientation + quiz', owner:'Employee + Safety/Supervisor', timing:'Day one', why:'Make safety expectations consistent and connect quiz results to the employee onboarding record.', page:'safety' },
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
      ['60 days','Insurance eligibility (per the New Hire Checklist — the handbook says 3 months for Sterling membership; conflict flagged for Austin). Admin reminder to start enrollment.'],
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
    questions:['NEW ASK: Can someone with an ExakTime login capture screenshots (or a quick screen recording) of clock-in, job change, approval, and time-off request? We’ll embed them as visual walkthroughs in this course.','Who issues activation codes?','What are the exact lunch punch rules?','Do shop and field roles use ExakTime differently?','Who approves time-off requests submitted in ExakTime?']
  },
  safety: {
    kicker:'Safety training',
    title:'Safety orientation',
    summary:'Safety should be taught consistently before hands-on work. The shell is ready now; BBSI safety supplies the final topic list, question count, and timing. Quiz answers/results should connect back to the employee onboarding record.',
    blocks:[
      ['Stop and ask','Stop and ask if a task feels unsafe, unclear, or outside your training. Report hazards, near misses, and injuries right away — even minor ones.'],
      ['PPE expectations','Safety glasses and hearing protection are worn any time you are on the shop floor or a jobsite. Certain jobs add welding helmets, face shields, respirators, or cut/heat-resistant gloves — with training provided. Goff provides OSHA-required PPE free of charge.'],
      ['If you are injured','Report to your supervisor immediately. For serious injuries dial 9-1-1 and/or have a supervisor transport to the hospital / WorkMed facility. Report all accidents and near misses even when no treatment is needed.'],
      ['Emergency evacuation','When the alarm sounds or a supervisor tells you, leave promptly — do not wait to see if it is “real.” The Evacuation Assembly Point is the northeast side of the Main Office building parking lot. Evacuation plans are posted at every exit.'],
      ['Equipment / lockout-tagout','Do not operate equipment you have not been trained on. Make sure guards are in place, know the emergency stops, never leave running equipment unattended. You are not authorized to climb ladders over 8 feet, drive motor vehicles, or operate heavy equipment without specific authorization.'],
      ['Before every job','A Pre-Job Hazard Assessment is required before starting any job (form in Company Links). Safety training continues with monthly safety meetings after you start.'],
    ],
    questions:['DECISION LOGGED 7/2: the V3 true/false final quiz was removed from the flow — each module now has its own knowledge checks. BBSI safety to confirm, or reinstate it as a certification gate (5-minute change).','What is the pass/fail rule and retake policy for module knowledge checks?','Which items differ by shop vs field role?','What hands-on safety steps (forklift, scissor lift, LOTO demo) happen after the portal training?']
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
// Question wording and answers are verbatim from the V3 handbook. Pending BBSI safety's
// confirmation on pass/fail rules, retakes, and hands-on signoff.
// RETIRED FROM THE FLOW 2026-07-02 (Jeff's call): with knowledge checks at the
// end of every safety module, the final T/F quiz was redundant. KEPT HERE so it
// can be reinstated in minutes if BBSI safety wants a certification-gate quiz — wire it
// back into safetySection() and add `&& quizScore()===SAFETY_QUIZ.length` to the
// safety step's completion. The IIPP acknowledgement now unlocks when all
// safety modules are complete.
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
  { id:'hazard', title:'Pre-Job Hazard Assessment', audience:'All employees', status:'Required daily', when:'Required before starting ANY job (per the Goff FAQ). Identify the hazards of the task and the safety precautions before work begins.', how:'Complete the Pre-Job Hazard Assessment form in Company Links before starting the job. Before leaving a jobsite, the Pre-Job Departure Checklist applies.', next:'The assessment is kept with the job record; unresolved hazards stop work until addressed with your supervisor.', route:'Reviewed by the supervisor/foreman on the job → escalates to Safety if a hazard cannot be controlled.', confirm:'Confirm whether assessments are filed per job or per crew, and who audits them.' },
  { id:'nearmiss', title:'Near-Miss Report', audience:'All employees', status:'Safety-critical', when:'Use when a situation could have caused injury or damage but didn’t. Reporting near misses prevents the real thing.', how:'Submit the Near Miss Incident Report in Company Links. You can also use the Safety and Suggestion Box at the north entrance of the east shops.', next:'Safety reviews the report, corrective action is assigned a deadline based on severity, and trends feed the monthly safety meeting.', route:'Direct supervisor + Safety Manager. Anonymous suggestions go through the Suggestion Box.', confirm:'Confirm whether near-miss reports can be anonymous and who tracks corrective-action deadlines.' },
  { id:'damage', title:'Damage / incident report', audience:'All employees', status:'High priority', when:'Use when equipment, vehicle, property, or jobsite damage occurs, or when an incident needs supervisor/safety review.', how:'Open the company damage report, complete what happened, where, who was involved, photos if needed, and immediate safety steps taken.', next:'Supervisor/admin gets notified, safety response is reviewed, drug-test/tow/equipment decisions are made if required, and follow-up is assigned.', route:'Direct supervisor first (per FAQ: report immediately, up the chain of command) → Safety Manager → office/admin for the record. Near-miss reports follow the same path.', confirm:'Confirm recipients, and what triggers drug test / tow / safety escalation?' },
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
// Policy courses — each policy is its own slide presentation (per Austin: "a
// specific policy-type PowerPoint... explain each one of the policies in
// detail"). Slides authored from the ACTUAL policy documents in Drive; each
// course ends behind its knowledge checks and records the acknowledgement.
const POLICY_COURSES = [
  { id:'handbook', title:'Employee Handbook', short:'Handbook', required:'Sign receipt', tagline:'The full rulebook — 8 slides covering what 67 pages actually say.', slides:[
    { theme:'dark', eyebrow:'Policy course · Employee Handbook', title:'The rulebook, in one place',
      body:'The handbook (revised March 2025) is how employment at Goff actually works. Employment is at-will. Every new hire starts with a 90-day introductory period — significant absences extend it — and satisfactory completion makes you a regular employee.',
      prompt:'You sign a receipt saying you got it and read it. These slides cover the rules people most often get wrong.' },
    { eyebrow:'Pay & time', title:'Getting paid correctly', quiz:['kc32'],
      cards:[
        ['Payday & meals','Paid weekly on Fridays. One 30-minute unpaid meal period per day, scheduled by your supervisor.','doc'],
        ['Overtime needs approval','Overtime requires your supervisor’s PRIOR authorization — unauthorized overtime is a disciplinable offense, and so is refusing scheduled overtime.','clipboard'],
        ['Approve your time','ExakTime reminder Sundays at 5 PM; approve by noon Monday. You get three forgotten approvals — after that, consequences (including a delayed paycheck). Falsifying time records can mean termination.','wrench'],
      ] },
    { eyebrow:'Holidays & benefits', title:'What comes with the job', quiz:['kc31'],
      cards:[
        ['Four paid holidays','New Year’s Day, July 4th, Thanksgiving, Christmas — paid at straight time, with eligibility after one year of employment.','star'],
        ['Care & coverage','Workers’ comp is provided at no cost for on-the-job injuries. Sterling Urgent Care membership covers you and up to 4 dependents after eligibility.','shield'],
        ['Sick time','No paid sick leave for temporary illness. Notify your supervisor before your shift, each day you’re out; three or more consecutive days may require a doctor’s note.','doc'],
      ] },
    { eyebrow:'Life happens', title:'Leave when you need it',
      cards:[
        ['Bereavement','Spouse or child: 5 working days. Parent or sibling: 3 days. Extended family (grandparents, in-laws, aunts/uncles, nieces/nephews): 1 day. Paid at base rate, for employees past 90 days.','users'],
        ['Military service','Unpaid leave for uniformed service — give your supervisor as much advance notice as reasonable.','flag'],
        ['Religious observance','Use vacation or personal days — request through your manager two weeks ahead.','cap'],
      ] },
    { eyebrow:'Conduct', title:'The lines you don’t cross', quiz:['kc30'],
      cards:[
        ['The big ones','Theft, falsifying records, insubordination, fighting or threats, harassment, safety violations, working under the influence, unauthorized disclosure of company information — discipline up to termination, and serious offenses skip the ladder.','shield'],
        ['Show up','Three or more consecutive no-call absences = you have voluntarily quit and are removed from payroll. Loafing, excessive tardiness, and leaving your station without permission are all conduct violations.','clipboard'],
        ['Everywhere, always','No smoking anywhere on company property including vehicles. Desks and lockers are company property and can be inspected at any time. No favoritism — same rules for everyone.','eye'],
      ] },
    { eyebrow:'Harassment', title:'Zero tolerance, clear path', quiz:['kc33'],
      cards:[
        ['What it is','Unwanted sexual advances, verbal or physical conduct of a sexual nature, slurs, degrading jokes, or any harassment tied to a protected characteristic — from anyone, of anyone.','shield'],
        ['How to report','Tell your supervisor immediately. If they’re unavailable — or they ARE the problem — go straight to HR or any member of management.','megaphone'],
        ['What happens','Prompt, discreet investigation. Confidentiality protected as much as possible. No reprisal for reporting. Violators face discipline up to termination.','users'],
      ] },
    { eyebrow:'When something goes wrong', title:'Discipline and problem resolution', numbered:true,
      cards:[
        ['The discipline ladder','Verbal warning → written warning → suspension → termination. Steps can be skipped for serious offenses.'],
        ['Your voice is protected','No employee is penalized for raising a problem in a business-like manner.'],
        ['The resolution path','Supervisor → HR → written to the President, who has full authority to resolve it. You can stop the process at any step.'],
      ] },
    { eyebrow:'Your copy', title:'Where to find it, any time', quiz:['kc26'],
      body:'The full Employee Copy lives in the Work Schedule under Company Links. These slides are the highlights — the handbook itself is the authority. Your signed acknowledgement of receipt goes in your employee file.' },
  ]},
  { id:'drugalcohol', title:'Drug & Alcohol Policy', short:'Drug & Alcohol', required:'Sign', tagline:'Zero tolerance, five kinds of testing — read this one carefully.', slides:[
    { theme:'dark', eyebrow:'Policy course · Drug & Alcohol', title:'Zero tolerance, every shift',
      body:'Use, possession, sale, distribution, or being under the influence of illegal drugs or alcohol is strictly prohibited on company property, in company vehicles, at job sites, or while conducting company business. You must report to work fit for duty.',
      prompt:'Violations mean discipline up to termination — and possibly legal consequences.' },
    { eyebrow:'Testing', title:'Five ways a test can happen', numbered:true,
      cards:[
        ['Pre-employment','Passing a drug test may be a condition of getting hired.'],
        ['Random — any time','Everyone may be in the random pool. Selection is neutral, objective, and non-discriminatory.'],
        ['Reasonable suspicion','Observable behavior, appearance, speech, odors, performance issues, or accidents can trigger a test.'],
        ['Post-accident','Any workplace accident or incident with injury, property damage, safety violations — or a near miss.'],
        ['Return-to-duty','After a violation: rehabilitation, a passed test before returning, and follow-up testing.'],
      ] },
    { eyebrow:'The fine print that matters', title:'Refusals, prescriptions, convictions', quiz:['kc14','kc15'],
      cards:[
        ['Refusing = violating','Refusing a test, failing to cooperate, or tampering with a sample may mean immediate termination.','shield'],
        ['Prescriptions','Lawful medication is allowed — but you must notify your supervisor if it could impair safe work. You may be moved off duty if it creates risk.','doc'],
        ['Get help early','Voluntarily seeking help for a drug or alcohol problem before a violation will not, by itself, result in discipline. Criminal drug convictions must be reported within 7 days.','users'],
      ] },
  ]},
  { id:'vehicle', title:'Vehicle Policy', short:'Vehicle', required:'Sign (drivers)', tagline:'Authorization, on-call duty, and the 48-hour reporting rule.', slides:[
    { theme:'dark', eyebrow:'Policy course · Vehicle Policy', title:'Behind the wheel',
      body:'Driving a company truck is a privilege with conditions: supervisor approval, an HR driving-record check, and a valid license you keep valid. Tell your supervisor about anything that changes your ability to drive legally or safely.',
      prompt:'All exceptions go through Austin — approved and documented, never verbal.' },
    { eyebrow:'Using the truck', title:'What the truck is — and isn’t — for',
      cards:[
        ['Work use only','Company trucks are for work tasks. Non-employees — including family — may not ride. Personal use needs Austin’s prior approval, case by case.','wrench'],
        ['On-call comes with it','If you’re assigned a truck, the on-call rotation is mandatory. Can’t cover your slot? Arrange coverage in the time app — failing to may cost you truck privileges.','clipboard'],
        ['Care & costs','Report maintenance needs immediately. Driving fines are yours. Authorized fuel goes on the company card.','star'],
      ] },
    { eyebrow:'Safety & consequences', title:'Non-negotiables', quiz:['kc16','kc17'],
      cards:[
        ['Distraction-free','No phone use or texting while driving on company business — hands-free only for calls, no headphones. Seat belts always; obey posted limits.','shield'],
        ['Alcohol = career risk','Transporting alcohol or illegal substances in a company vehicle can mean immediate termination.','flag'],
        ['48-hour rule','Any accident, theft, or damage — however small — must be reported to your supervisor and HR within 48 hours.','megaphone'],
      ] },
  ]},
  { id:'vacation', title:'Vacation Policy', short:'Vacation', required:'Read & acknowledge', tagline:'How time accrues, the 90-day wait, and the 1.5× cap.', slides:[
    { theme:'dark', eyebrow:'Policy course · Vacation', title:'Your time off, by the numbers',
      body:'All full-time employees accrue paid vacation weekly from day one, based on years of service. You can start using it after your 90-day introductory period.' },
    { eyebrow:'Accrual schedule', title:'It grows with your service', numbered:true,
      cards:[
        ['Years 0–3','0.77 hours per week — about 40 hours (one week) per year.'],
        ['Years 3–5','1.54 hours per week — about 80 hours (two weeks) per year.'],
        ['Years 5+','2.31 hours per week — about 120 hours (three weeks) per year.'],
      ] },
    { eyebrow:'The rules', title:'Requesting, banking, leaving', quiz:['kc18','kc19'],
      cards:[
        ['Two weeks ahead','Vacation requests go in writing, approved by management, at least two weeks in advance. Approval considers business needs.','doc'],
        ['The 1.5× cap','Unused time carries over, but your bank stops growing at 1.5× your annual accrual until you use some.','clipboard'],
        ['If you leave','Unused accrued vacation is paid out on termination.','star'],
      ] },
  ]},
  { id:'absences', title:'Attendance & Unexcused Absences', short:'Attendance', required:'Sign', tagline:'The 1-hour rule, 5 occurrences, and what no-call/no-show means.', slides:[
    { theme:'dark', eyebrow:'Policy course · Attendance', title:'Your crew is counting on you',
      body:'Show up on time, ready to work. When life happens, the difference between excused and unexcused is communication and documentation.',
      prompt:'A no-call/no-show can mean immediate disciplinary action — up to termination.' },
    { eyebrow:'Getting an absence excused', title:'The two paths',
      cards:[
        ['Planned time off','Submit a Request Days Off form two weeks in advance and get supervisor approval before the date.','doc'],
        ['Same-day (sick, emergency)','Notify your supervisor at least 1 hour before your shift — phone, email, or text. Can’t reach them? Contact HR. A doctor’s note or documentation makes it excused.','megaphone'],
      ] },
    { eyebrow:'The math & the ladder', title:'Occurrences and consequences', quiz:['kc20','kc21'],
      cards:[
        ['5 per year','You’re allowed 5 unexcused occurrences per calendar year. 1–2 consecutive days = one occurrence; 3+ consecutive days count as additional.','clipboard'],
        ['The discipline ladder','Exceeding the limit: written warning → final warning or suspension → termination.','flag'],
      ] },
  ]},
  { id:'hardhat', title:'Hard Hat & Head Protection SOP', short:'Hard Hat', required:'Read & acknowledge', tagline:'When it’s required, hat condition, and Goff’s color system.', slides:[
    { theme:'dark', eyebrow:'Policy course · Hard Hat SOP', title:'Protect the head that does the thinking',
      body:'Hard hats are required on active jobsites, whenever work is happening above you, and in any area with overhead hazards — lifts, elevated work, suspended loads. No exceptions without site-supervision approval.',
      prompt:'Worn forward-facing, chin strap when conditions call for it, and it stays ON — comfort is not an exception.' },
    { eyebrow:'Condition', title:'A damaged hat is no hat',
      cards:[
        ['No damage','Free from cracks, dents, or structural damage. Never drilled, altered, or modified.','shield'],
        ['Suspension intact','The suspension system must be whole and adjusted — frayed or broken means replace immediately.','wrench'],
        ['Accessories secured','Face shields, welding hoods, and lights must be properly attached and maintained.','helmet'],
      ] },
    { eyebrow:'Who wears what', title:'The color tells the story', quiz:['kc22','kc23'],
      cards:[
        ['Brown / Orange','Brown: welders (Tradesman 1–3). Orange: Tradesman 4 — entry-level and helpers.'],
        ['Blue / Black','Blue: mechanics and millwrights. Black: supervisors — foremen and PMs.'],
        ['Green / White','Green: safety personnel. White: visitors, engineers, office personnel.'],
      ] },
  ]},
  { id:'conf', title:'NDA & Confidentiality', short:'Confidentiality', required:'Sign', tagline:'What stays in the shop — and for how long.', slides:[
    { theme:'dark', eyebrow:'Policy course · Confidentiality', title:'What stays in the shop',
      body:'Customer information, blueprints and drawings, pricing, and company processes are confidential. So is the fact that confidential discussions are even happening.',
      prompt:'If it isn’t public, treat it like it’s protected.' },
    { eyebrow:'The agreement', title:'What you’re actually signing', quiz:['kc7'],
      cards:[
        ['Use it only for work','Confidential information is for doing your job — not for sharing outside, and it stays Goff’s property. Return or destroy it on request.','shield'],
        ['You answer for your leaks','Share it with someone helping you work, and they leak it? You remain liable for the breach.','users'],
        ['Three years, Idaho law','The agreement runs 3 years from signing and survives even after discussions or employment end.','doc'],
      ] },
  ]},
  { id:'gossip', title:'Workplace Communication & Anti-Gossip', short:'Anti-Gossip', required:'Sign', tagline:'Praise down. Send problems up.', slides:[
    { theme:'dark', eyebrow:'Policy course · Communication', title:'Praise down. Send problems up.',
      body:'Gossip kills trust and divides crews. The rule is simple: recognition flows freely to teammates and leadership; concerns about people go UP to a supervisor — not sideways to the crew.',
      prompt:'Complaining about someone to coworkers instead of leadership is the definition of gossip here.' },
    { eyebrow:'How it works', title:'The one-of-two rule', quiz:['kc8'],
      cards:[
        ['What counts as gossip','Talking negatively about someone who isn’t present, discussing others’ mistakes or discipline, speculating about company decisions.','chat'],
        ['The rule','A concern about another employee belongs in a conversation that includes either that person or a supervisor who can fix it. One of the two — always.','users'],
        ['What’s protected','Reporting legitimate workplace concerns, safety issues, or policy violations to management is never gossip.','shield'],
      ] },
  ]},
  { id:'apparel', title:'Apparel Responsibility', short:'Apparel', required:'Sign', tagline:'Your Goff gear, its value, and the 30-day rule.', slides:[
    { theme:'dark', eyebrow:'Policy course · Apparel', title:'You’re issued the brand — wear it well',
      body:'New hires are issued Goff apparel (typically 5 shirts) at the start. You sign for the total value of what you receive — t-shirts $20–25, button-ups $35–40, hats $25, beanies $30.' },
    { eyebrow:'The deal', title:'One rule to remember', quiz:['kc25'],
      cards:[
        ['The 30-day rule','Resign or be terminated within your first 30 days, and the total value of the apparel you were issued is deducted from your final paycheck.','clipboard'],
        ['Take care of it','Keep issued apparel in good condition and available for work.','star'],
      ] },
  ]},
  { id:'videorelease', title:'Video Release', short:'Video Release', required:'Sign', tagline:'What you grant when Goff films the shop.', slides:[
    { theme:'dark', eyebrow:'Policy course · Video Release', title:'When the camera comes out',
      body:'Goff uses photos and video of real work for its website, social media, promotional materials, and ads. Signing grants the company the right to record and use your image, likeness, and voice for those purposes.' },
    { eyebrow:'Know what you’re signing', title:'The three things people miss', quiz:['kc24'],
      cards:[
        ['It’s permanent','The release is irrevocable, worldwide, and lasts in perpetuity — forever.','eye'],
        ['No approval rights','Content may be edited or modified; you waive the right to inspect or approve the finished product.','doc'],
        ['No compensation','You will not be paid for the use of this media.','clipboard'],
      ] },
  ]},
  { id:'perdiem', title:'Per Diem & Travel', short:'Per Diem', required:'Sign (traveling roles)', tagline:'$60/day rules, lodging caps, and when none of it applies.', slides:[
    { theme:'dark', eyebrow:'Policy course · Per Diem & Travel', title:'Overnight travel, by the book',
      body:'Per diem is a daily allowance for approved overnight travel — not extra pay, not guaranteed, and never for local jobs where you can reasonably drive home (about 1 hour or 60 miles one way).' },
    { eyebrow:'The rates', title:'What you get', numbered:true,
      cards:[
        ['Meals & incidentals','$60 per day flat, no receipts ($75 in high-cost areas with management approval). Covers meals, tips, small incidentals.'],
        ['Lodging — separate','Target $90 per night, up to $110 in high-cost areas with manager approval. Booked by Goff or reimbursed with a receipt.'],
        ['Day-travel stipend','Up to $30 for long day trips with no overnight — discretionary, not GSA per diem.'],
      ] },
    { eyebrow:'The boundaries', title:'What it never covers', quiz:['kc27','kc28'],
      cards:[
        ['Not covered','Fuel, mileage, tools, entertainment, lodging taxes. Vehicle costs follow the Truck Policy.','flag'],
        ['Travel status, not hours','Full daily rate applies when an overnight is required — but M&IE can be withheld if you call in sick and don’t work.','clipboard'],
      ] },
  ]},
  { id:'timecards', title:'Timecards & Time Entry', short:'Timecards', required:'Read & acknowledge', tagline:'Six questions, every entry — it’s how you get paid.', slides:[
    { theme:'dark', eyebrow:'Policy course · Timecards', title:'Six questions, every entry',
      body:'Don’t write “welding” or “working.” Your timecard is how Goff bills correctly and how you get paid — every entry answers six questions.',
      prompt:'Timecards are approved every Monday in ExakTime. Missed punch? Clock in ASAP and add a note.' },
    { eyebrow:'The six questions', title:'What a real entry looks like', numbered:true, quiz:['kc29'],
      cards:[
        ['WHAT & WHERE','Be specific: “Welding Stainless 3″ Pipe” — at Burley, Paul, Field, Town, or The Shop.'],
        ['WHO & HOW LONG','Name the exact client being billed, and round to the nearest quarter hour: “2.75 hours.”'],
        ['WHEN DONE & BREAKS','Give a status (“1 day left” / “complete”) and log lunches honestly: “Took lunch” / “Skipped lunch.”'],
      ] },
  ]},
];

// BBSI / Goff Welding — New Hire Safety Orientation 2026 (BBSI safety Edits) — structured course draft
// SKIPPED (meta/draft/empty/placeholder slides):
//   Slide 1  — welcome title only
//   Slide 2  — draft note: "Could add a welcome video of Austin here or note"
//   Slide 3  — draft note: "What are Goff Welding Core Values??????"
//   Slides 12–22 — title-only topic placeholders with NO body content (Emergency Response, PPE,
//     Hot Work, Compressed Gas, Fall Protection, Walking/Working Surfaces, Rigging, Respirator,
//     Bloodborne Pathogens, Noise Exposure, Fire and Fire Extinguishers). Only the Fire and
//     Respirator topics have real content elsewhere in the deck (slides 24–39 and 141).
//   Slide 23 — "EMERGENCY ESCAPE PLAN" title only (folded into Fire course range)
//   Slides 80–81 — "TEST TIME" / "QUESTIONS?" meta
//   Slide 84 — layout placeholder ("Title and content layout with chart")
//   Slides 122, 148, 155, 184 — "QUESTIONS?" / release-to-supervisor meta

const SAFETY_COURSES_DRAFT = [

  // ── 1. Stop Work Authority ──────────────────────────────────────────────
  { id:'swa', title:'Stop Work Authority', tagline:'Every employee has the right — and the obligation — to stop unsafe work.', srcSlides:'4-11', slides:[
    { theme:'dark', eyebrow:'Safety training · Stop Work Authority', title:'You are empowered to stop the job', body:'Goff Welding’s policy is that people are our most important asset. Stop Work Authority (SWA) gives every employee the responsibility and obligation to stop work when a perceived unsafe condition or behavior may result in an unwanted event.', prompt:'If it looks wrong, stop it — no retribution.' },
    { eyebrow:'Roles and responsibilities', title:'Who does what under SWA', cards:[
      ['Senior management','Creates a culture that promotes SWA, sets clear expectations, supports its use without retribution, resolves SWA conflicts, and holds everyone accountable for full compliance.'],
      ['Supervisors and managers','Promote a culture where SWA is freely exercised. SWA requests are honored and resolved before operations resume, and required follow-up is completed.'],
      ['Safety department','Provides training and support, facilitates stop-work inspections, and documents and monitors SWA compliance.'],
      ['Employees and contractors','Initiate stop work, participate in the investigation, support peers and the SWA process, and ensure follow-up is done.'],
    ] },
    { eyebrow:'When to use it', title:'Situations that warrant a stop work', cards:[
      ['Conditions change','A change in work conditions, working outside the job scope or plan, or an emergency situation all justify stopping the job.'],
      ['Something is off','Equipment used improperly, unsafe conditions, or a near-miss incident — stop before it becomes an injury.'],
      ['You don’t know enough','Lack of knowledge, understanding, or information is itself a valid reason to stop work and ask.'],
    ] },
    { eyebrow:'Your legal protection', title:'Federally protected refusal — all four conditions', cards:[
      ['1. You asked first','Where possible, you asked the employer to eliminate the danger and the employer failed to do so.'],
      ['2. Good faith','You genuinely believe an imminent danger exists — the refusal is made in good faith.'],
      ['3. Reasonable person test','A reasonable person would agree there is a real danger of death or serious injury.'],
      ['4. No time','The hazard is so urgent there isn’t time to get it corrected through regular enforcement channels.'],
    ] },
  ], quiz:[
    { q:'Which of the following is NOT one of the four conditions required for your refusal to work to be federally protected?', options:['Where possible, you asked the employer to eliminate the danger and they failed to','A reasonable person would agree there is a real danger of death or serious injury','You filed a written complaint with OSHA before stopping work','There isn’t enough time to correct the hazard through regular enforcement channels'], correct:2 },
    { q:'Under the SWA program, who is responsible for resolving SWA conflicts when they arise?', options:['Senior management','The employee who initiated the stop','The OSHA area office','The newest crew member on site'], correct:0 },
  ] },

  // ── 2. Fire & Fire Extinguishers ────────────────────────────────────────
  { id:'fire', title:'Fire & Fire Extinguishers', tagline:'Know your fire classes, your extinguisher, and PASS.', srcSlides:'23-39', slides:[
    { theme:'dark', eyebrow:'Safety training · Fire & Extinguishers', title:'Take one element away and the fire dies', body:'Fire needs fuel, heat, air, and a chemical chain reaction — the fire tetrahedron. To extinguish a fire, one of those elements must be taken away. Ignition sources in our work include sparks and arcs, hot surfaces, electrical energy, friction, compression of gases, and open flame.', prompt:'Which element will your extinguisher remove?' },
    { eyebrow:'Fire classes', title:'Class A, B, and C', cards:[
      ['Class A — leaves an ash','Ordinary solids: paper, trash, tires, coal, plastic, wood. Any fire that can leave an ash is usually Class A.'],
      ['Class B — Boil','Flammable liquids (gasoline, diesel, kerosene, paint, alcohol, some solvents) and gases (propane, carbon monoxide, hydrogen, acetylene, methane, butane). These burn extremely hot, spread rapidly, and heavy smoke can make them hard to control.'],
      ['Class C — electrical','Caused by electrical sources. The electrical source must be de-energized before fire fighting.'],
    ] },
    { eyebrow:'Fire classes', title:'Class D and Class K', cards:[
      ['Class D — metal fires','Magnesium, sodium, potassium, titanium, zirconium and other combustible metals. Extreme heat and the ability to generate their own oxygen make them hard to fight — the best method is to bury the affected area for 72 hours.'],
      ['Class D extinguisher','30 lb pressurized dry powder optimized for the specific metal (also available in bulk for hand-scooping onto the fire). 6–8 ft maximum effective range; extinguishes by smothering.'],
      ['Class K — kitchen fats','Vegetable fats that burn at extremely high temperatures, mostly in commercial kitchens. Wet chemicals are used in extinguishing systems.'],
    ] },
    { eyebrow:'Your extinguisher', title:'Multipurpose dry chemical (ABC)', cards:[
      ['The numbers','2.5–20 lb of dry chemical (ammonium phosphate), pressurized to 50–200 psi by nitrogen gas, with an 8–25 second discharge time and a 5–20 ft maximum effective range.'],
      ['How it works','Extinguishes by smothering burning materials. A pressure gauge allows a visual capacity check (CO2 extinguishers have no gauge).'],
      ['Monthly inspection','Confirm proper location and access; check locking pin and tamper seal; verify it’s full and pressurized; check hose, fittings, nozzle, and legible instructions. The inspection sticker date must not exceed 1 year — remove deficient units from service.'],
    ] },
    { eyebrow:'Fighting the fire', title:'Remember PASS', cards:[
      ['P — Pull','Pull the pin.'],
      ['A — Aim','Aim low, at the base of the flames.'],
      ['S — Squeeze','Squeeze the handle.'],
      ['S — Sweep','Sweep side to side until the fire is out.'],
    ] },
  ], quiz:[
    { q:'What is the recommended method for fighting a Class D combustible-metal fire?', options:['Flood the burning metal with water','Bury the affected area for 72 hours','Use a multipurpose ABC dry-chemical extinguisher','Let it burn out on its own, usually within an hour'], correct:1 },
    { q:'A multipurpose dry-chemical (ABC) extinguisher has a maximum effective range of…', options:['30–40 feet','1–2 feet','50–75 feet','5–20 feet'], correct:3 },
  ] },

  // ── 3. Electrical Safety ────────────────────────────────────────────────
  { id:'electrical', title:'Electrical Safety', tagline:'Low voltage does not mean low hazard.', srcSlides:'40-48', slides:[
    { theme:'dark', eyebrow:'Safety training · Electrical Safety', title:'One worker is electrocuted on the job every day', body:'That’s the national average. The four main types of electrical injuries are electrocution (death due to electrical shock), electrical shock, burns, and falls caused by contact.', prompt:'LOW VOLTAGE DOES NOT MEAN LOW HAZARD.' },
    { eyebrow:'How shock happens', title:'Completing the circuit', cards:[
      ['The path is you','You get a shock when part of your body completes a circuit — touching a live wire and an electrical ground, or a live wire and another wire at a different voltage.'],
      ['Severity depends on three things','The path of the current through the body, the amount of current flowing, and the length of time the body is in the circuit.'],
      ['75 mA can kill','Currents greater than 75 milliamperes can cause ventricular fibrillation — death in a few minutes unless a defibrillator is used. A small power drill uses 30 times that much current.'],
    ] },
    { eyebrow:'Common hazards', title:'Overloads, burns, and overhead lines', cards:[
      ['Overloaded circuits','Too many devices on one circuit heat the wires to very high temperature and can start a fire. If insulation melts, arcing can ignite a fire even inside a wall.'],
      ['Electrical burns','The most common shock-related nonfatal injury, typically on the hands, from improperly used or maintained wiring or equipment. A very serious injury needing immediate attention.'],
      ['Overhead powerlines','Usually NOT insulated. Never use metal ladders or carry anything overhead near live overhead power, and watch for lines when working with ladders and scaffolding.'],
    ] },
    { eyebrow:'Protective measures', title:'How we control electrical hazards', cards:[
      ['Engineering controls','Proper grounding, GFCIs, fuses and circuit breakers, and guarding of live parts.'],
      ['Work practices','Lockout/tagout, proper use of flexible cords, and electrical safety training.'],
      ['Wet conditions','All electrical hazards are made worse in wet conditions — inadequate wiring, bad insulation, damaged tools, and wrong PPE become far more dangerous.'],
    ] },
  ], quiz:[
    { q:'Currents greater than what level can cause ventricular fibrillation (a rapid, ineffective heartbeat)?', options:['75 milliamperes','75 amperes','30 amperes','750 milliamperes'], correct:0 },
    { q:'Which statement about overhead powerlines is true?', options:['They are insulated, so brief contact is harmless','Metal ladders are safe near them if you only touch the rungs','They are usually not insulated','Only utility powerline workers face any risk from them'], correct:2 },
  ] },

  // ── 4. Hazard Communication & GHS ───────────────────────────────────────
  { id:'hazcom', title:'Hazard Communication & GHS', tagline:'One global system for classifying and labeling chemical hazards.', srcSlides:'49-63', slides:[
    { theme:'dark', eyebrow:'Safety training · Hazard Communication', title:'Every chemical hazard, classified and communicated', body:'OSHA 1910.1200 requires that the hazards of all chemicals produced or imported are classified, and that hazard information reaches employers and employees — consistent with the UN Globally Harmonized System (GHS), Revision 3, through container labeling and comprehensive hazcom programs.', prompt:'If you can’t identify it, you can’t protect yourself from it.' },
    { eyebrow:'The GHS system', title:'What GHS is and why it exists', cards:[
      ['Globally Harmonized System','A standardized system for classifying and labeling chemicals. It defines health, physical, and environmental hazards and communicates them — plus protective measures — on labels and Safety Data Sheets (SDS).'],
      ['Not itself a regulation','GHS is not a regulation or standard, but it is the widely accepted global method for hazard identification, ensuring manufacturers use agreed classification and communication methods.'],
      ['Rollout dates','Dec 1, 2013: all employers trained on the new standard. June 1, 2015: all SDSs updated to GHS layout. Dec 1, 2015: manufacturers/distributors ship SDS with chemicals. June 1, 2016: employer hazcom programs compliant.'],
    ] },
    { eyebrow:'Classification', title:'Three hazard classes', cards:[
      ['Physical hazards','Explosives, flammable gases/aerosols/liquids/solids, oxidizing gases/liquids/solids, gases under pressure, self-reactive substances, pyrophorics, self-heating substances, water-reactives, organic peroxides, corrosive to metals.'],
      ['Health hazards','Acute toxicity, skin corrosion/irritation, serious eye damage, respiratory or skin sensitization, germ cell mutagenicity, carcinogenicity, reproductive toxicology, target organ toxicity (single and repeated exposure), aspiration toxicity.'],
      ['Environmental hazards','Hazardous to the aquatic environment — acute and chronic aquatic toxicity, bioaccumulation potential, rapid degradability.'],
    ] },
    { eyebrow:'Labels', title:'The six GHS label elements', cards:[
      ['Identify and signal','Product identifier, plus a signal word: “Danger” for the more severe hazards, “Warning” for the less severe.'],
      ['Describe the hazard','Standardized hazard statements for each hazard class and category — e.g. “Causes eye irritation,” “Toxic if inhaled,” “May cause cancer,” “Contains gas under pressure; may explode if heated.”'],
      ['Show and prevent','Pictograms — a black symbol on a white background with a red diamond frame — plus precautionary statements for each hazard class and category.'],
      ['Who made it','Name, address, and telephone number of the chemical manufacturer.'],
    ] },
  ], quiz:[
    { q:'By what date did all Safety Data Sheets have to be updated to reflect the GHS layout?', options:['December 1, 2013','December 1, 2015','June 1, 2016','June 1, 2015'], correct:3 },
    { q:'Which signal word does GHS assign to the MORE severe hazards?', options:['Warning','Danger','Caution','Alert'], correct:1 },
  ] },

  // ── 5. GHS Pictograms & Safety Data Sheets ─────────────────────────────
  { id:'pictograms', title:'GHS Pictograms & SDS', tagline:'Read the diamond, then read the sheet.', srcSlides:'64-79', slides:[
    { theme:'dark', eyebrow:'Safety training · Pictograms & SDS', title:'The red diamond tells you what can hurt you', body:'GHS pictograms — black symbols on white with a red diamond frame — convey health, physical, and environmental hazard information at a glance. Behind every label is a 16-section Safety Data Sheet with the full story.', prompt:'Know the symbols before you open the container.' },
    { eyebrow:'Health pictograms', title:'Health hazard, exclamation mark, skull & crossbones', cards:[
      ['Health hazard (silhouette)','Carcinogens (asbestos, silica, diesel exhaust), mutagens (ionizing radiation, chemotherapy medicines), reproductive toxins (lead, organic solvents, PCBs, carbon monoxide), respiratory sensitizers (wood dust, latex, formaldehyde), target organ and aspiration toxicity.'],
      ['Exclamation mark','Skin and eye irritants, skin sensitizers, respiratory tract irritants, narcotic effects, and acute toxicity. Toxicity is measured in LD 50 — the amount of a substance that kills 50% of those exposed to it.'],
      ['Skull & crossbones','Acute toxicity — highly toxic substances that are life-threatening in small amounts, such as bleach, formaldehyde, and ammonia.'],
      ['Corrosion','Skin corrosion/burns, eye damage, corrosive to metals. Acids have pH 7 or lower (vinegar, hydrochloric, sulfuric); bases have pH 9 or higher (bleach, lye). Corrosion falls into both health and physical hazard classes.'],
    ] },
    { eyebrow:'Physical & environmental pictograms', title:'Bomb, flame, and fish', cards:[
      ['Exploding bomb','Explosives, self-reactives, organic peroxides — and gases under pressure such as oxygen, acetylene, and propane tanks.'],
      ['Flame over circle & flame','Flame-over-circle marks oxidizers — substances that increase burning by adding available oxygen (bleach, pure oxygen, concentrated hydrogen peroxide). The plain flame marks flammables, pyrophorics, self-heating substances, and emitters of flammable gas.'],
      ['Environment','Aquatic toxicity — substantial damage to living organisms through aquatic exposure: pesticide and fertilizer runoff, PCBs, lead, chromium.'],
    ] },
    { eyebrow:'Precautions & containers', title:'Precautionary statements and secondary containers', cards:[
      ['Four kinds of precaution','Prevention (“Wear protective gloves”), Response (“If inhaled remove person to fresh air”), Storage (“Store in well ventilated place”), and Disposal (per federal, state, and local regulations).'],
      ['Secondary containers','Any time a chemical leaves its original container — like diluting Simple Green into a spray bottle — the new container must be labeled with the product identifier, signal word, hazard statement(s), pictogram(s), and precautionary statement(s).'],
    ] },
    { eyebrow:'Safety Data Sheets', title:'16 sections, two places to find them', cards:[
      ['Where SDSs live','In a binder in the shop/warehouse or office specific to each site, and on the Share Drive under the Safety Document folder for those with computer access.'],
      ['What’s inside','16 standardized sections: identification, hazards, ingredients, first aid, firefighting, accidental release, handling and storage, exposure controls/PPE, physical and chemical properties, stability, toxicology, ecology, disposal, transport, regulatory, and other information.'],
    ] },
  ], quiz:[
    { q:'What does an LD 50 value tell you about a substance?', options:['The amount that will kill 50% of those exposed to it','That it loses half its potency after 50 days','That it must be diluted to 50% before use','The legal exposure limit for a crew of 50 workers'], correct:0 },
    { q:'How many standardized sections does a Safety Data Sheet contain?', options:['8','12','16','20'], correct:2 },
  ] },

  // ── 6. Job Hazard Analysis ──────────────────────────────────────────────
  { id:'jha', title:'Job Hazard Analysis', tagline:'Break the job into steps, find the hazards, control them first.', srcSlides:'82-94', slides:[
    { theme:'dark', eyebrow:'Safety training · Job Hazard Analysis', title:'Find the hazard before it finds you', body:'A JHA is a process for identifying hazards or potential harm, eliminating or controlling them, and preventing injuries or illnesses. It’s one component of a larger Safety and Health Management Plan (SHMP).', prompt:'Every uncontrolled hazard is a future incident.' },
    { eyebrow:'What a JHA covers', title:'Task-focused or job-focused', cards:[
      ['Task focused (steps)','Cast-in-place concrete, excavation, installation of electrical circuits — the JHA walks through the steps of a specific task.'],
      ['Job focused (process)','Maintenance or janitorial work — the JHA covers the process of an entire job.'],
      ['Four required elements','Description of the task/steps containing the hazard; description of the hazard and its type; consequence of the hazard; and the controls that mitigate or prevent it.'],
    ] },
    { eyebrow:'Best practices', title:'How to build a good JHA', cards:[
      ['Start with the people and the history','Involve the employees at the worksite, review the worksite’s incident history, and conduct a preliminary job review — correcting the easy fixes immediately.'],
      ['Rank and break down','List, rank, and set priorities for the hazardous jobs, then break each job into steps or tasks — photographing or recording the worker performing the job helps.'],
      ['Train on it','Train the affected workers on the JHA and make sure they understand the process. Apply the hierarchy of controls when choosing mitigations.'],
    ] },
    { eyebrow:'When danger is immediate', title:'Act now, analyze after', cards:[
      ['Immediate danger = immediate action','If you discover any hazard that poses an immediate danger to an employee’s life or health, take immediate action to protect the worker — don’t wait for the paperwork.'],
      ['The goal','Remediation of uncontrolled hazards — ideally by eliminating them, or reducing them to an acceptable level.'],
    ] },
  ], quiz:[
    { q:'During a JHA you discover a hazard posing an immediate danger to an employee’s life or health. What should you do?', options:['Note it for the next safety meeting','Take immediate action to protect the worker','Finish documenting the JHA before acting','Wait for an OSHA determination'], correct:1 },
    { q:'Which of these is a required element of a JHA?', options:['A cost estimate for repairs','The names of local OSHA inspectors','Serial numbers of all equipment used','The consequence of the hazard'], correct:3 },
  ] },

  // ── 7. Lockout/Tagout ───────────────────────────────────────────────────
  { id:'loto', title:'Lockout/Tagout', tagline:'Control hazardous energy before you put your body in the machine.', srcSlides:'95-115', slides:[
    { theme:'dark', eyebrow:'Safety training · Lockout/Tagout', title:'Blocked energy can’t hurt you — stored energy can', body:'LOTO (29 CFR 1910.147, Control of Hazardous Energy) blocks the flow of energy from the power source to the equipment and provides a means of warning — the tag. It covers operators and service personnel and requires employee training.', prompt:'If it can start up unexpectedly, lock it out.' },
    { eyebrow:'Energy and equipment', title:'What gets locked out', cards:[
      ['Seven energy sources','Electricity, hydraulic, pneumatic, steam, thermal, chemical, and gravity.'],
      ['Typical equipment','Presses, saws, conveyors, pumps, production equipment, trash compactors, and ovens.'],
      ['Device requirements','Lockout devices — locks, blocks, chains, multilock hasps, wheel and ball valve covers — must be durable, standardized, substantial, and identifiable.'],
    ] },
    { eyebrow:'When it applies', title:'Required uses and exceptions', cards:[
      ['LOTO is required when','Servicing or maintaining equipment where hazardous energy exists and unexpected start-up could occur; when employees remove or bypass a safety device; place any part of their body in harm’s way; or are exposed to hazardous energy.'],
      ['LOTO exceptions','Work where hazardous energy does not exist, activities performed during routine production processes, work on cord-controlled devices, and hot tap operations where shutdown is not feasible.'],
      ['The four-step procedure','Perform a shutdown, isolate the equipment, apply (and later remove) lockout devices, and safely release stored energy.'],
    ] },
    { eyebrow:'People', title:'Affected vs. authorized employees', cards:[
      ['Affected employees','Operate, work around, or occasionally adjust equipment subject to LOTO. They notify maintenance when equipment needs repair, leave all LOTO devices in place, and verify equipment is safe to operate after LOTO.'],
      ['Authorized employees','Maintain and service equipment and are trained to use LOTO. They lock out all energy sources, test to verify residual energy is dissipated, place a “Danger—Do Not Operate” tag, coordinate multi-shift repairs, and remove locks/tags when done.'],
      ['Training frequency','Authorized employees: initially and at least annually. Affected employees: at least initially. Both: whenever jobs or procedures change, or when program deficiencies are noted.'],
    ] },
  ], quiz:[
    { q:'How often must AUTHORIZED employees receive LOTO training?', options:['Initially and at least annually','Initially only','Once every five years','Only after an incident occurs'], correct:0 },
    { q:'Which of these is an EXCEPTION where LOTO is not required?', options:['An employee must remove or bypass a safety device','Work on cord-controlled devices','An employee places part of their body in harm’s way','An employee is exposed to hazardous energy'], correct:1 },
  ] },

  // ── 8. OSHA Inspections & Incident Reporting ───────────────────────────
  { id:'osha', title:'OSHA Inspections & Incident Reporting', tagline:'What to do when an inspector arrives — and when someone gets hurt.', srcSlides:'116-122', slides:[
    { theme:'dark', eyebrow:'Safety training · OSHA & Reporting', title:'OSHA exists to protect workers — know the procedure', body:'OSHA is a regulatory federal agency put in place to protect workers. If a Compliance Officer arrives on your site, there is a defined sequence to follow — and if a coworker is injured, there is a defined way to report it.', prompt:'Calm, courteous, by the book.' },
    { eyebrow:'When the officer arrives', title:'First steps of an inspection', cards:[
      ['Verify and ask','Ask to see the Officer’s credentials and ask the reason for the inspection. If it’s the result of a written complaint, ask for a copy of it.'],
      ['Call for backup','Contact your supervisor and Safety immediately and request one or both meet you at the site. You can ask the Officer to wait for Safety or management to arrive before starting.'],
      ['Protect confidential information','Identify any trade secret, proprietary, or confidential information the Officer may be exposed to, and inform the Officer that OSHA must treat it confidentially.'],
    ] },
    { eyebrow:'During the inspection', title:'Manage and document', cards:[
      ['Consider pausing work','If the work area is very active and violations could be spotted, consider shutting down operations during the inspection.'],
      ['Document everything','The manager should document the Officer’s activities — who is interviewed, what equipment and areas are inspected, and what measurements or samples are taken.'],
      ['Protect distraught employees','Management must intercede for employees who are distraught or physically unable to speak with OSHA — particularly after a fatality or catastrophic accident. No interviews until they are physically and emotionally able.'],
    ] },
    { eyebrow:'If you get hurt', title:'Reporting incidents and accidents', cards:[
      ['Report up the chain','Report the injury through the proper chain of command and call the 1-800 number.'],
      ['The 24/7 nurse','The 24/7 nurse line will guide the employee to where they can be seen for treatment.'],
      ['ER for emergencies only','Go to the ER if — and only if — it is an emergency.'],
    ] },
  ], quiz:[
    { q:'An OSHA Compliance Officer arrives at your site. What should you do first?', options:['Refuse entry until a company lawyer arrives','Begin correcting visible issues in front of the Officer','Ask to see the Officer’s credentials and the reason for the inspection','Send all employees home immediately'], correct:2 },
    { q:'After a work injury, when should an employee be seen at the ER?', options:['Whenever it’s more convenient than the clinic','After the supervisor finishes the incident paperwork','Any time within 24 hours of the injury','Only during emergencies — otherwise the 24/7 nurse line directs care'], correct:3 },
  ] },

  // ── 9. Confined Spaces ──────────────────────────────────────────────────
  { id:'confined', title:'Confined Spaces', tagline:'Trained entrants only — no exceptions, no partial roles.', srcSlides:'123-125', slides:[
    { theme:'dark', eyebrow:'Safety training · Confined Spaces', title:'Confined spaces are only entered by trained employees', body:'All confined space entry at Goff Welding is performed by employees who have completed confined space training and are competent to recognize the specific hazards involved. We work in both permit-required and non-permit spaces.', prompt:'No training, no refresher — no role in the entry.' },
    { eyebrow:'Hazard mitigation', title:'Controls that apply to every entry', cards:[
      ['Permit or not, control it','Whether the space is permit-required or non-permit, hazard mitigation must be applied when making entry.'],
      ['The five methods','Traffic control, air monitoring, ventilation, fall protection, and water removal are all mitigation methods that need to be applied to confined space entry.'],
    ] },
    { eyebrow:'Training rules', title:'What “no active role” means', cards:[
      ['Annual refresher required','If you haven’t completed confined space training or the annual refresher, you cannot have an active role in the entry.'],
      ['Specifically, you cannot','Use the sniffers (air monitors), serve as the attendant, serve as the entry supervisor, or place any part of your body into the space.'],
    ] },
  ], quiz:[
    { q:'You haven’t completed the annual confined-space refresher. Which role may you fill during an entry?', options:['None — you cannot have an active role in the entry','Attendant only','Air-monitor (sniffer) operator only','Entry supervisor only'], correct:0 },
    { q:'Goff Welding performs confined-space work in…', options:['Non-permit spaces only','Both permit-required and non-permit spaces','Permit-required spaces only','No confined spaces — that work is subcontracted'], correct:1 },
  ] },

  // ── 10. Respirable Silica & Respirators ────────────────────────────────
  { id:'silica', title:'Respirable Silica & Respirators', tagline:'Silicosis is preventable — and incurable. Keep the dust wet.', srcSlides:'126-141', slides:[
    { theme:'dark', eyebrow:'Safety training · Respirable Silica', title:'Once silica is in your lungs, it never comes out', body:'Cutting construction materials creates respirable crystalline silica — particles that travel deep into the lungs and cause silicosis, plus lung cancer, respiratory and pulmonary disease, and kidney disease (OSHA 29 CFR 1926.1153). Silicosis is preventable, but it is cumulative, incurable, and always deadly.', prompt:'There is a test on this section.' },
    { eyebrow:'The disease', title:'Three stages of silicosis', cards:[
      ['Chronic','Appears after LOW concentration levels within 10 years of exposure. Most cases result from years of exposure.'],
      ['Accelerated','Develops after 5 to 10 years of HIGH concentration levels.'],
      ['Acute','Develops within the first weeks to 5 years of VERY HIGH concentration.'],
      ['Enforcement history','OSHA set standards in 1971; the 2013 final rule declared silicosis a disease; enforcement began June 23, 2018.'],
    ] },
    { eyebrow:'Exposure limits & Table 1', title:'How small is too much', cards:[
      ['The exposure standard','25 micrograms per 4 hours of exposure; 50 micrograms per 8 hours. A microgram is one millionth of a gram — silica dust is smaller than fine beach sand, a human hair, or a dust particle.'],
      ['Control Method Table 1','Table 1 matches 18 common construction tasks with effective dust controls: using water to keep dust out of the air, OR a vacuum dust collection system to capture it. The alternative is measuring exposure against the PEL and choosing controls independently.'],
    ] },
    { eyebrow:'The wet method', title:'Water on the blade, slurry swept wet', cards:[
      ['Integral water delivery','Water must be delivered integrally — a continuous spray directly onto the blade via a built-in fitting. That is what makes it OSHA compliant. Handheld and walk-behind concrete saws use integral delivery; drills use a wand or hose; cinder-block core drilling uses HEPA vacuum with tool attachment.'],
      ['Slurry cleanup','The remaining slurry is still potentially hazardous and must be swept up while wet, then either bagged in garbage bags for disposal at the shop OR mixed with the soil when excavating so it can’t become airborne.'],
      ['Paperwork every time','Foreman and crew perform a JHA identifying silica, barricade the area with stanchions and yellow-and-black caution tape, and a Silica Control Form is filled out every time silica-bearing dust will be generated.'],
    ] },
    { eyebrow:'Respirators', title:'APF ratings — what the numbers mean', cards:[
      ['APF 10 disposable masks','Air-purifying disposable particulate masks provide APF 10 protection, as required by the OSHA silica standard. APF 10 means no more than one-tenth of the contaminants leak into the mask.'],
      ['Higher protection','Supplied-air respirators deliver clean air from an uncontaminated source; APF 25 masks and full-face respirators (APF 50) exceed the OSHA minimum but require fit testing.'],
    ] },
  ], quiz:[
    { q:'OSHA’s silica exposure standard for an 8-hour exposure is…', options:['50 micrograms per 4 hours','25 micrograms per 8 hours','100 micrograms per 8 hours','50 micrograms per 8 hours'], correct:3 },
    { q:'Accelerated silicosis develops after…', options:['A single day of exposure','More than 10 years of low concentration exposure','5 to 10 years of high concentration levels','Only genetic predisposition, not exposure time'], correct:2 },
  ] },

  // ── 11. Lead Exposure ───────────────────────────────────────────────────
  { id:'lead', title:'Lead Exposure', tagline:'Crimpers, not power tools — keep lead off your hands and out of the air.', srcSlides:'142-148', slides:[
    { theme:'dark', eyebrow:'Safety training · Lead Exposure', title:'Lead damage is slow, silent, and irreversible', body:'Lead enters the body by inhalation and ingestion. Stored in tissue, it slowly and irreversibly damages cells, bone marrow, red blood cells, kidneys, and the neurological system — it causes birth defects, affects male and female fertility, and causes permanent developmental damage to children.', prompt:'You won’t feel the exposure. You’ll live with the damage.' },
    { eyebrow:'Where you meet it', title:'Exposure activities and covered work', cards:[
      ['Activities that expose you','Abrasive blasting, sanding, scraping, cutting wire, burning, welding, and painting.'],
      ['OSHA’s construction lead standard','Applies to demolition or salvage where lead is present, removal or encapsulation of lead materials, new construction/alteration/repair/renovation with lead, installation of lead products, emergency cleanup, and transport, disposal, storage, or containment of lead.'],
    ] },
    { eyebrow:'Goff best practices', title:'Lead abatement rules in the field', cards:[
      ['Gloves and hygiene','Wear nitrile disposable gloves. Remove them and wash hands thoroughly before eating, drinking, using tobacco products, or touching your face.'],
      ['Never power tools','Never cut lead products with power tools — always use crimpers. This prevents the lead from becoming airborne.'],
      ['What abatement means','Abatement is simply the safe removal of lead-containing products, following OSHA guidelines to prevent overexposure or cross-contamination.'],
    ] },
  ], quiz:[
    { q:'How should lead products be cut during abatement?', options:['With crimpers — never with power tools','With a power saw while wearing a dust mask','With a cutting torch, outdoors only','With any tool, as long as nitrile gloves are worn'], correct:0 },
    { q:'Lead enters the body by…', options:['Absorption through unbroken skin only','Radiation from the metal','Eye contact only','Inhalation and ingestion'], correct:3 },
  ] },

  // ── 12. Heat Illness Prevention ─────────────────────────────────────────
  { id:'heat', title:'Heat Illness Prevention', tagline:'Water, shade, rest — with hard numbers behind each one.', srcSlides:'149-155', slides:[
    { theme:'dark', eyebrow:'Safety training · Heat Illness Prevention', title:'Heat illness is prevented by the quart, the degree, and the minute', body:'Heat illness prevention isn’t a suggestion — it comes with specific numbers for water, shade, rest breaks, and supervision. If an employee shows signs or reports symptoms of heat illness, emergency response procedures kick in immediately.', prompt:'Hydrate before you feel thirsty.' },
    { eyebrow:'Water', title:'One quart, per employee, per hour', cards:[
      ['The provision','At least one quart per employee per hour — fresh, pure, and suitably cool (cooler than the outside temperature, but not so cool it causes discomfort), as close as practicable to the work area.'],
      ['What doesn’t count','Handing each employee a mug to fill daily is NOT compliant.'],
    ] },
    { eyebrow:'Shade & rest', title:'Shade at 80 degrees', cards:[
      ['When and how much','Shade must be present when the temperature exceeds 80°F — enough to accommodate all employees on rest, recovery, and meal breaks, as close as practicable to the work areas.'],
      ['Cool-down breaks','Employees are encouraged to take preventative cool-down rest breaks in the shade whenever they feel the need, staying until symptoms abate — no less than 5 minutes — while the employer closely monitors them.'],
      ['Alternatives frowned upon','Measures like misting machines may substitute for shade (never in agriculture), but OSHA inspectors frown on them — the recommendation is: don’t use them.'],
    ] },
    { eyebrow:'High heat', title:'High-heat procedures at 95 degrees', cards:[
      ['Observation','Direct supervision of 20 or fewer employees (a ratio over 1:20 is non-compliance), a mandatory daily buddy system, regular communication with sole employees, or other effective means — plus communication by voice, observation, or mobile phone.'],
      ['Preparation','Designate authorized employees at each site to contact emergency medical services, and hold pre-shift meetings to review high-heat procedures, remind everyone to drink plenty of water, and take cool-down breaks whenever necessary.'],
      ['Agriculture extra','Agricultural employees get additional requirements, such as a 10-minute break every two hours.'],
    ] },
  ], quiz:[
    { q:'How much drinking water must be provided to employees?', options:['One gallon per employee per day','At least one quart per employee per hour','A personal mug each employee fills daily','One liter per crew per hour'], correct:1 },
    { q:'High-heat procedures apply at what temperature, and what is the maximum direct-supervision ratio?', options:['80°F and 1 supervisor per 10 employees','90°F and 1 per 25','95°F and 1 per 20','100°F and 1 per 50'], correct:2 },
  ] },

  // ── 13. Ladder Safety ───────────────────────────────────────────────────
  { id:'ladders', title:'Ladder Safety', tagline:'69% of fatal ladder falls happen at 10 feet or less.', srcSlides:'156-172', slides:[
    { theme:'dark', eyebrow:'Safety training · Ladder Safety', title:'Over 300 ladder deaths a year — most from 10 feet or less', body:'Annual ladder fatalities top 300, and 69% of fatal falls happen at 10 feet or less. More than 164,000 people are treated in emergency rooms for ladder-related fall injuries. The three most common causes: wrong ladder used, ladder in poor condition, ladder used improperly.', prompt:'The right ladder, inspected, set up right.' },
    { eyebrow:'Choosing & inspecting', title:'Duty ratings and inspection points', cards:[
      ['Know the duty rating','Type I-A: heavy duty, up to 300 lbs. Type I: up to 250 lbs. Type II: 225 lbs. Type III: light duty only, up to 200 lbs.'],
      ['Inspect before use','Steps/rungs, side rails, metal parts, rope, locking devices, splinters and sharp edges, safety feet, and dents.'],
      ['Tag defective ladders','Defective ladders must be properly tagged “Do Not Use.” Read, understand, and follow ALL warning stickers.'],
    ] },
    { eyebrow:'Step ladders', title:'Set level, latches down, stay low', cards:[
      ['Setup','Always set the ladder level and make sure the latches are down.'],
      ['Where not to stand','Never stand on the step below the top step — stay off the top two steps. Never climb the back side of a folding ladder unless it’s designed for that.'],
      ['Don’t lean','Avoid excessive stretching or leaning. Never work with one leg on the ladder and one off — a slip could mean a serious fall.'],
    ] },
    { eyebrow:'Extension ladders', title:'Face it, hold it, extend it 3 feet', cards:[
      ['Working position','Always face the ladder, keep one hand on it for hold, work within easy reach, and do not work on the top four steps.'],
      ['Above the landing','Access ladders must extend at least 3 feet above the landing platform.'],
      ['Near electrical','Use non-conductive ladders, never carry or move an extension ladder while extended, and get help moving ladders to maintain control.'],
    ] },
  ], quiz:[
    { q:'What percentage of fatal ladder falls happen at 10 feet or less?', options:['9%','25%','45%','69%'], correct:3 },
    { q:'An access ladder must extend how far above the landing platform?', options:['It doesn’t need to extend above the platform','1 foot','At least 3 feet','At least 6 feet'], correct:2 },
  ] },

  // ── 14. Hand & Power Tool Safety ───────────────────────────────────────
  { id:'tools', title:'Hand & Power Tool Safety', tagline:'Unsafe tools are prohibited — by regulation and by common sense.', srcSlides:'173-184', slides:[
    { theme:'dark', eyebrow:'Safety training · Hand & Power Tools', title:'Employers shall not issue or permit unsafe tools', body:'That’s OSHA 1926.301(a) verbatim. Wrenches with sprung jaws that slip, impact tools with mushroomed heads, and wooden handles with splinters or cracks are all prohibited from use.', prompt:'If a tool is damaged, it comes out of service — today.' },
    { eyebrow:'Hand tools', title:'Condition and handling rules', cards:[
      ['The 1926.301 checklist','No sprung wrench jaws (adjustable, pipe, end, or socket). Drift pins, wedges, and chisels kept free of mushroomed heads. Wooden handles free of splinters and cracks, and tight in the tool.'],
      ['Buy and maintain quality','Cutters and hammers should be steel and heat-treated. Inspect regularly, maintain per the manufacturer’s instructions, and use the right tool for the job.'],
      ['Carry them right','Never carry tools up a ladder by hand — hoist them in a bucket or bag. Never carry pointed tools in your pocket; use a toolbox or cart. At heights, never leave tools where they could fall on workers below.'],
    ] },
    { eyebrow:'Electric power tools', title:'Grounded, insulated, dry', cards:[
      ['1926.302 basics','Electric tools must be double-insulated or grounded per Subpart K. Electric cords may never be used for hoisting or lowering tools — and never carry a power tool by its cord.'],
      ['Damaged = out of service','Remove tools with damaged cords (exposed wires, missing ground, or other defects) from service. Don’t use electric tools in wet conditions unless approved for it, and use a ground fault circuit interrupter.'],
      ['Grinders','Grinding machines need enough power to keep spindle speed at safe levels and safety guards per ANSI B7.1-1970. Select a wheel approved for the grinder’s RPMs and check it for cracks or defects before each use.'],
    ] },
    { eyebrow:'Pneumatic tools', title:'Compressed air rules', cards:[
      ['Never point it','Never point a compressed air gun at yourself or another person, and verify all parts are fastened securely before use.'],
      ['30 psi for cleaning','When cleaning with high-pressure compressed air, use a chip guard and limit nozzle pressure to 30 pounds per square inch. Use screens to protect nearby workers from flying fragments — and always wear eye protection.'],
      ['Depressurize first','When finished, make sure the pressure is released before breaking hose connections, and use a safety clip or retainer to keep attachments from being ejected during operation.'],
    ] },
  ], quiz:[
    { q:'When using high-pressure compressed air for cleaning, nozzle pressure must be limited to…', options:['90 psi','30 psi','60 psi','120 psi'], correct:1 },
    { q:'What is the correct way to get tools up a ladder?', options:['Carry them by hand, one at a time','Carry them in your pockets','Hoist them from the ground in a bucket or bag','Lower them from above by their power cords'], correct:2 },
  ] },

];

// SECTIONS: 14 courses, 28 quiz questions
// UNPLACEABLE: slides 12-22 announce topics (Emergency Response, PPE, Hot Work, Compressed Gas, Fall Protection, Walking/Working Surfaces, Rigging, Bloodborne Pathogens, Noise Exposure) with zero body content anywhere in the deck — no courses could be built for them; slide 23 (Emergency Escape Plan) likewise title-only; slides 1-4 welcome/policy content was folded into the SWA opener.

// Goff-specific site content the BBSI deck doesn't cover — assembly point,
// WorkMed, near-miss path, SDS location. Sourced from Goff's V3 handbook + FAQ.
const GOFF_SITE_COURSE = { id:'goffsite', title:'Goff Site Basics: Emergencies & Reporting', tagline:'Assembly point, WorkMed, near-miss reporting — the Goff-specific essentials.', srcSlides:'Goff V3 handbook + FAQ', slides:[
  { theme:'dark', eyebrow:'Safety training · Goff site basics', title:'Know YOUR shop', body:'The BBSI training covers the science; this section covers Goff\u2019s ground truth \u2014 where to go, who to call, and how to report at the Paul, Idaho shop.', prompt:'When the alarm sounds, leave promptly \u2014 do not wait to see if it is \u201creal.\u201d' },
  { eyebrow:'Emergencies', title:'Where to go, who to call', cards:[
    ['Assembly point','The Evacuation Assembly Point is the northeast side of the Main Office building parking lot. Report anyone still inside to the Evacuation Management Team at the exits.'],
    ['If you are injured','Report to your supervisor immediately \u2014 even minor injuries. Serious injury: dial 9-1-1 and/or have a supervisor transport to the hospital / WorkMed facility.'],
    ['Emergency plans','Evacuation plans are posted at every exit. Learn the exits, fire extinguishers, and first aid locations in your area.'],
  ] },
  { eyebrow:'Reporting', title:'Paper trails that prevent injuries', cards:[
    ['Near miss','A situation that could have caused injury or damage. Submit the Near Miss Incident Report in Company Links \u2014 or use the Safety and Suggestion Box at the north entrance of the east shops.'],
    ['Hazards & damage','Unsafe condition: stop and report immediately. Equipment or property damage: Company Damage Report in Company Links.'],
    ['SDS binder','Safety Data Sheets for every chemical live in the Receiving / Parts Department office, available during all work hours.'],
  ] },
], quiz:[
  { q:'Where is the Evacuation Assembly Point?', options:['Northeast side of the Main Office building parking lot','The breakroom in the west shops','The parts room','Wherever your truck is parked'], correct:0 },
  { q:'You have a near miss \u2014 nobody hurt, nothing damaged. What do you do?', options:['Shake it off and keep working','Only report it if equipment was damaged','Submit the Near Miss Incident Report in Company Links (or use the Suggestion Box)','Mention it at the next monthly meeting'], correct:2 },
] };

// Final safety course list: Goff site basics first, then BBSI topics.
// Each course's quiz questions register as knowledge checks and become a
// gated final slide, so the shared player enforces answer-before-complete.
const SAFETY_COURSES = [GOFF_SITE_COURSE, ...SAFETY_COURSES_DRAFT].map(c => {
  const ids = (c.quiz || []).map((q, i) => { const id = `skc-${c.id}-${i}`; KNOWLEDGE_CHECKS[id] = q; return id; });
  const slides = ids.length ? [...c.slides, { eyebrow:`Knowledge check \u00b7 ${c.title}`, title:'Show us you caught it', body:'Answer to complete this section. Wrong answers allow retries \u2014 retries are tracked on your training record.', quiz: ids }] : c.slides;
  return Object.assign({}, c, { slides, required:'Training section' });
});


// Step 4 as a slide course — built from the two real ExakTime SOPs in Drive
// (install SOP + time card approval SOP) and the Goff FAQ. Replaces the old
// static page + self-attested mark-complete.
const WORKBASICS_COURSES = [
  { id:'workbasics', title:'Work Basics: ExakTime & Daily Tools', short:'Work Basics', required:'Training', tagline:'Clock in right, get paid right, and know the tools you touch every day.', slides:[
    { theme:'dark', eyebrow:'Work basics · Step 4', title:'Your timecard is how you get paid',
      body:'ExakTime is Goff’s timekeeping system — clocking in and out, job changes, and time-off requests all live there. The pay period runs Monday to Sunday, and payday is every Friday.',
      prompt:'Only clock in when you are on-site and ready to work.' },
    { eyebrow:'Setup', title:'Get the app running',
      body:'Tap your phone’s button below — it opens ExakTime Mobile in the store. Goff provides your activation code or setup help on day one.',
      cards:[
        ['iPhone','App Store → “ExakTime Mobile – Time Clock App” (by Arcoro) → Get → Open.','doc'],
        ['Android','Google Play → “ExakTime Mobile” → Install → Open. Same activation process.','doc'],
        ['Keep it yours','Never share your login or activation info. Problems? Ask your supervisor or the office.','shield'],
      ],
      links:[
        { label:' Download for iPhone', href:'https://apps.apple.com/us/app/exaktime-mobile-time-clock-app/id372863459' },
        { label:'▶ Download for Android', href:'https://play.google.com/store/apps/details?id=com.exaktime.mobile' },
      ] },
    { eyebrow:'The daily rhythm', title:'Four habits, every shift',
      cards:[
        ['Clock in ready','On-site and ready to begin — that’s when you clock in. Not from the truck, not from home.','clipboard'],
        ['Lunch punches','Clock out for lunch, back in after. Skipped lunch? Add a note in the app.','star'],
        ['Job changes','Switch jobs mid-day? Log each change so time lands on the right job number.','wrench'],
        ['Missed punch','Forgot? Clock in as soon as possible, add a note explaining it, and tell your supervisor.','megaphone'],
      ] },
    { eyebrow:'Approval week', title:'How a timecard becomes a paycheck', numbered:true,
      cards:[
        ['Review daily','Three-lines menu → Approvals. Check your time every day — entries follow the six questions from the Timecards policy.'],
        ['Corrections by Monday noon','Any fix goes to Andrea no later than Monday at noon for the prior Monday–Sunday period. Then tap APPROVE.'],
        ['Locked after sign-off','Supervisors approve crews Monday afternoon. Once approved by your supervisor or an administrator you cannot un-approve it yourself — and three forgotten approvals brings consequences, including a delayed paycheck.'],
      ] },
    { eyebrow:'Beyond the clock', title:'The other tools you’ll touch',
      cards:[
        ['QUO app','All business calls use QUO and your assigned company number — personal phones are for breaks and lunch.','chat'],
        ['Travel Bank','Carry a company card? Receipts are submitted every Friday in the Travel Bank app. The how-to video is in Company Links.','doc'],
        ['Purchases','Need materials? Notify your supervisor first; if directed, submit the Purchase Request form. Procurement orders — you don’t.','clipboard'],
        ['Work Schedule hub','Your schedule, the org chart, contacts, and Company Links all live in the Work Schedule (Google Sheets). Lost access? Contact the Scheduler.','users'],
      ] },
    { eyebrow:'Knowledge check · Work basics', title:'Show us you caught it',
      body:'Answer to complete this step. Wrong answers allow retries — retries are tracked on your training record.',
      quiz:['kc34','kc35','kc36'] },
  ] },
];
function allWorkBasicsDone(){ return WORKBASICS_COURSES.every(c => courseComplete('basics', c)); }

// --- Shared course player (policies + safety training) ---
let courseOpenSet = null;   // 'policy' | 'safety'
let courseOpenId = null;
let courseSlidePos = (() => { try { return JSON.parse(safeGetEarly('goffCourseSlidesV2') || '{}'); } catch(_) { return {}; } })();
function courseListFor(set){ return set === 'safety' ? SAFETY_COURSES : set === 'basics' ? WORKBASICS_COURSES : POLICY_COURSES; }
function coursePrefix(set){ return set === 'safety' ? 'safecourse' : set === 'basics' ? 'basicscourse' : 'polcourse'; }
function courseMenuSel(set){ return set === 'safety' ? '.safety-courses' : set === 'basics' ? '.basics-courses' : '.policy-courses'; }
function openCourse(set, id){ courseOpenSet = set; courseOpenId = id; render(); scrollToEl('.slide-canvas'); }
function closeCourse(){ const sel = courseMenuSel(courseOpenSet); courseOpenSet = null; courseOpenId = null; render(); scrollToEl(sel); }
function setCoursePos(set, id, i){ const c = courseListFor(set).find(x=>x.id===id); if(!c) return; courseSlidePos[`${set}:${id}`] = Math.max(0, Math.min(c.slides.length-1, i)); safeSet('goffCourseSlidesV2', JSON.stringify(courseSlidePos)); render(); scrollToSlide(); }
function finishCourse(set, id){ completed[`${coursePrefix(set)}-${id}`] = true; save(); const sel = courseMenuSel(set); courseOpenSet = null; courseOpenId = null; render(); scrollToEl(sel); }
function openPolicyCourse(id){ openCourse('policy', id); }
function slideQuizGated(item){ return !!(item && item.quiz && !item.quiz.every(id => kcState[id]?.correct)); }
function courseComplete(set, c){ return completed[`${coursePrefix(set)}-${c.id}`] === true; }
function policyCourseComplete(c){ return courseComplete('policy', c); }
function courseStatus(set, c){ if(courseComplete(set, c)) return 'Complete'; if((courseSlidePos[`${set}:${c.id}`]||0) > 0) return 'In progress'; return 'Not started'; }
function policyCourseStatus(c){ return courseStatus('policy', c); }
function allPolicyCoursesDone(){ return POLICY_COURSES.every(c => courseComplete('policy', c)); }
function allSafetyCoursesDone(){ return SAFETY_COURSES.every(c => courseComplete('safety', c)); }
function coursePlayer(set, c){
  const idx = courseSlidePos[`${set}:${c.id}`] || 0;
  const item = c.slides[idx];
  const gated = slideQuizGated(item);
  const last = idx === c.slides.length - 1;
  const isPolicy = set === 'policy';
  const signs = isPolicy && /Sign/.test(c.required);
  const isDone = courseComplete(set, c);
  // Completion lives at the END of the presentation, unlocked only after every
  // slide's questions are answered — never a page-bottom shortcut.
  const allQuizzesDone = c.slides.every(s => !slideQuizGated(s));
  const finishCall = `finishCourse('${set}','${c.id}')`;
  const ackPanel = last && allQuizzesDone && !isDone
    ? (isPolicy
      ? `<div class="ack-box course-ack"><h3>${signs?'Sign to complete this policy':'Acknowledge to complete this policy'}</h3><p>I acknowledge that I have received, read, and understand the ${esc(c.title)} and agree to comply with its terms.</p><div class="admin-actions"><button class="complete-btn done" onclick="${finishCall}">${signs?'Sign & complete ✓':'Acknowledge & complete ✓'}</button></div><p class="note" style="margin-top:10px"><strong>Production note:</strong> this captures your signature and completion date on your employee record.</p></div>`
      : `<div class="ack-box course-ack"><h3>Section complete</h3><p>You’ve covered ${esc(c.title)} and answered its knowledge checks. This completion is tracked on your safety training record.</p><div class="admin-actions"><button class="complete-btn done" onclick="${finishCall}">Complete section ✓</button></div></div>`)
    : '';
  const backLabel = isPolicy ? '← All policies' : set === 'basics' ? '← Work basics' : '← All safety sections';
  return `<section class="austin-course"><div class="course-top"><div><p class="eyebrow">${isPolicy?'Policy course':set==='basics'?'Work basics':'Safety training'} • ${esc(c.required || 'Training section')}</p><h2>${esc(c.title)}</h2><p>Slide ${idx+1} of ${c.slides.length} • ${esc(c.tagline)}</p></div><button class="secondary" onclick="closeCourse()">${backLabel}</button></div>
  ${courseSlideCanvas(item)}
  <div class="course-actions"><button class="secondary" onclick="setCoursePos('${set}','${c.id}',${idx-1})" ${idx===0?'disabled':''}>← Previous</button>${last
    ? (isDone ? `<button class="complete-btn done" disabled>Completed ✓</button>` : !allQuizzesDone ? `<button class="complete-btn" disabled title="Answer every question in this course first">Answer the questions in this course</button>` : `<button class="complete-btn" disabled title="Complete below">${signs?'Sign below to complete ↓':'Complete below ↓'}</button>`)
    : `<button ${gated?'disabled title="Answer the questions above to continue"':''} onclick="setCoursePos('${set}','${c.id}',${idx+1})">${gated?'Answer to continue':'Next →'}</button>`}</div>
  ${ackPanel}
  <div class="course-rail">${c.slides.map((s,i)=>`<button class="rail-dot ${i===idx?'active':''}" onclick="setCoursePos('${set}','${c.id}',${i})" title="Slide ${i+1}">${i+1}</button>`).join('')}</div></section>`;
}
function courseMenuCards(set){
  const list = courseListFor(set);
  return list.map((c,i)=>{
    const status = courseStatus(set, c);
    const isDone = status==='Complete';
    return `<button class="policy-course-card ${isDone?'done':''}" onclick="openCourse('${set}','${c.id}')"><div class="pcc-top"><span class="pcc-num">${isDone?'✓':i+1}</span><em>${esc(c.required || 'Training')}</em></div><b>${esc(c.title)}</b><p>${esc(c.tagline)}</p><small class="pcc-status ${status==='In progress'?'prog':''} ${isDone?'ok':''}">${esc(status)} • ${c.slides.length} slides</small></button>`;
  }).join('');
}
function policiesSection(){
  if(courseOpenSet === 'policy' && courseOpenId){
    const c = POLICY_COURSES.find(x=>x.id===courseOpenId);
    if(c) return coursePlayer('policy', c);
  }
  const doneCount = POLICY_COURSES.filter(policyCourseComplete).length;
  return `<section class="panel doc-page"><p class="eyebrow">Step 2 • Policies &amp; acknowledgements</p><h2>The rules of working at Goff</h2><p class="summary">Each policy below is a short course — a few slides that explain the actual rules, a couple of questions to prove you caught them, and your acknowledgement at the end. ${doneCount} of ${POLICY_COURSES.length} complete. Take them in any order; the ones marked “Sign” become part of your signed employee record.</p>
  <div class="policy-courses">${courseMenuCards('policy')}</div>
  ${allPolicyCoursesDone()?`<div class="ack-box"><h3>All policies acknowledged ✓</h3><p>Every policy course is complete. In production, your signatures and completion dates are stored on your employee record and visible to HR.</p></div>`:''}</section>`;
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
  { area:'Safety Training (separate section)', status:'15 slide courses from BBSI’s 2026 deck', detail:'BBSI’s 184-slide New Hire Safety Orientation (received July 2) is now 14 slide courses — SWA, Fire & Extinguishers, Electrical, HazCom/GHS, SDS, JHA, LOTO, OSHA & incident reporting, Confined Spaces, Silica/Respirators, Lead, Heat Illness, Ladders, Hand & Power Tools — plus a Goff Site Basics course, each with knowledge checks. The V3 true/false final quiz was RETIRED from the flow 7/2 (redundant with per-module checks) — kept in code and one question for BBSI safety away from reinstatement; the IIPP acknowledgement now unlocks on completing all modules. NOTE for BBSI safety: the deck’s Emergency Response, PPE, Hot Work, Compressed Gas, Fall Protection, Rigging, Bloodborne, and Noise slides are title-only with no teaching content yet; shown as placeholders. His draft notes (“add Austin welcome video,” “core values??????”) were caught and excluded.' },
  { area:'Policy courses', status:'12 full courses built', detail:'Every policy is now its own slide presentation authored from the actual document: handbook, drug & alcohol (all 5 testing types), vehicle (48-hour rule, on-call), vacation (accrual rates, 1.5× cap), attendance (5 occurrences, 1-hour rule), hard hat (color system), NDA, anti-gossip, apparel (30-day deduction), video release, per diem, timecards. Checks gate each course; finishing records the acknowledgement. AI agent hookup is Phase 2.' },
  { area:'Knowledge-check tracking', status:'Working now', detail:'Every check records attempts — first-try vs second-guessing — exactly the click-click-click problem Austin flagged in the PPT version. Manager assign-retraining and yearly 5-section refresher are designed in, activate with the database.' },
  { area:'CONTENT CONFLICTS FOUND', status:'Needs Austin ruling — now 7', detail:'(1) Mission/vision wording exists in THREE versions: welcome packet, onboarding deck (“Mountain West”), and New Hire Checklist welcome (“our region”). Deck version currently shown. (2) Always-on PPE: deck says glasses + steel-toe; V3 safety handbook says glasses + hearing protection — portal shows the union. (3) Vehicle Policy docx says on-call runs through “ADP”; the PDF says Exak — portal says “the time app.” (4) Time-off requests: FAQ says the ExakTime app; Unexcused Absences policy says a “Request Days Off” form. (5) VACATION ACCRUAL: the standalone Vacation Policy says hourly weekly accrual (0.77/1.54/2.31 hrs) with a 1.5× carryover cap; the handbook (rev 3/2025) says 5/10/15 days per year with different carryover language. Portal teaches the standalone policy. (6) INSURANCE ELIGIBILITY: New Hire Checklist says after 60 days; handbook says Sterling membership after 3 months. (7) DRESS CODE: the handbook prohibits T-shirts and jeans as inappropriate attire — while the apparel program issues every new hire five Goff T-shirts. Handbook dress code likely template language needing a Goff rewrite.' },
  { area:'Document standardization', status:'Planned', detail:'Austin asked for tidied, consistently-branded documents and AI flagging of conflicting policy facts (e.g., observed holidays). The two conflicts above are the first output of that process.' },
  { area:'Work basics (step 4)', status:'Now a slide course', detail:'Rebuilt from the two real ExakTime SOPs: install steps, review-daily habit, corrections to Andrea by Monday noon, locked-after-supervisor-sign-off rule, plus QUO/Travel Bank/purchasing/Work Schedule basics from the FAQ. Replaces the old static page and self-attested completion; step 4 now completes via 3 tracked questions.' },
  { area:'Supervisor handoff (step 5)', status:'Now the in-person checklist', detail:'Built from the New Hire Checklist’s physical items: apparel issue + form, tool/material sign-out, PPE walk, hands-on LOTO demo, Hyster & scissor-lift tests, emergency walk with FROI, personal info/emergency contact, receipts, first assignment, open questions. In production this becomes the supervisor’s signed checklist.' },
  { area:'Training structure', status:'Ready for review', detail:'General onboarding, safety, policies, tools, links, role expectations, and milestones are separated.' },
  { area:'Safety', status:'Drafted — confirm with BBSI safety', detail:'The real 10-question quiz from Safety Training & Quiz V3 is now live in the portal with instant feedback and the acknowledgement text. BBSI safety confirms pass/fail, retakes, timing, and hands-on signoff.' },
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
  { source:'Safety Training & Quiz V3 + PPE/incident docs', use:'Safety module with the real 10-question quiz + acknowledgement (live now)', audience:'Employee + Safety/Supervisor', status:'Drafted — confirm with BBSI safety', decision:'Pass/fail rule, retake policy, timing, and hands-on signoff owner.' },
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
  ['BBSI safety input','Final safety topic list, questions, timing, pass/fail, and hands-on signoff owner.'],
  ['Document currentness','Mark old/draft/duplicate policy docs vs official current versions.'],
  ['Visibility rules','Decide employee-facing, role-based, secure, admin-only, or recruiting-only.'],
  ['Routing owners','Name recipients/owners for time off, incident, damage, near-miss, truck, purchase, and Spark Award.'],
  ['ExakTime screenshots','Have someone with an ExakTime login capture screenshots or a screen recording of clock-in, job change, approval, and time-off — we’ll embed them as visual walkthroughs in the Work Basics course.'],
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
function onboardingParts(){
  return [
    { label:'Orientation', pct: coursePct() },
    { label:'Policies', pct: Math.round(POLICY_COURSES.filter(c=>courseComplete('policy',c)).length / POLICY_COURSES.length * 100) },
    { label:'Safety', pct: Math.round(SAFETY_COURSES.filter(c=>courseComplete('safety',c)).length / SAFETY_COURSES.length * 100) },
    { label:'Work basics', pct: allWorkBasicsDone() ? 100 : (courseSlidePos['basics:workbasics'] > 0 ? 50 : 0) },
    { label:'Handoff', pct: Math.round(HANDOFF_CHECKLIST.filter((_,i)=>completed[`handoffitem-${i}`]).length / HANDOFF_CHECKLIST.length * 100) },
  ];
}
function onboardingPct(){ const parts = onboardingParts(); return Math.round(parts.reduce((n,p)=>n+p.pct,0) / parts.length); }
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

function homeHeader(){
  return `<header class="hero home-hero">
    <div class="brandbar"><img src="/goff-welding-logo.png" alt="Goff Welding" /><span>Employee portal</span></div>
    <div class="home-hero-in">
      <p class="eyebrow">Welcome back, ${esc(PROFILE.firstName)}</p>
      <h1>What do you need?</h1>
      <div class="home-search"><input type="search" placeholder="Search: time off, paycheck, per diem, truck, PPE…" onkeydown="if(event.key==='Enter')homeSearchGo(this)" /><button onclick="homeSearchGo(this.previousElementSibling)">Search</button></div>
      <p class="lead home-lead">Payday is Friday • Timecards approve by Monday noon • ${esc(PROFILE.role)}</p>
    </div>
  </header>`;
}
function header(){
  return `<header class="hero">
    <div class="brandbar"><img src="/goff-welding-logo.png" alt="Goff Welding" /><span>Employee portal</span></div>
    <div class="hero-grid">
      <div>
        <p class="eyebrow">${esc(PROFILE.status)} • Goff onboarding path</p>
        <h1>Welcome to Goff Welding, ${esc(PROFILE.firstName)}.</h1>
        <p class="lead">Everything you need for your first day — where to go, what to review, and who will help you get started.</p>
        <div class="hero-actions"><button onclick="nav('course')">Start orientation course</button><button class="secondary" onclick="nav('resources')">Browse resources</button><button class="secondary" onclick="copyLink()">Copy re-access link</button></div>
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
    const simple = [['start','Home'],['path','My onboarding'],['resources','Resources'],['help','Help / questions']];
    return `<nav class="tabs simple-tabs">${simple.map(([id,label])=>`<button class="${section===id?'active':''}" onclick="nav('${id}')">${esc(label)}</button>`).join('')}</nav>`;
  }
  const groups = ['Admin','Review'];
  return `<nav class="tabs grouped-tabs">${groups.map(group=>`<div class="tab-group"><span>${esc(group)}</span>${pages.filter(p=>p[2]===group).map(([id,label])=>`<button class="${section===id?'active':''}" onclick="nav('${id}')">${esc(label)}</button>`).join('')}</div>`).join('')}<div class="tab-group portal-switch"><span>One portal — switch area</span><a href="?section=start">Employee view</a><a href="/goff-recruiting/">Recruiting platform</a><a href="/goff-recruiting/?view=career">Public careers page</a></div></nav>`;
}
function onboardingComplete(){ return onboardingParts().every(p => p.pct === 100); }
function startSection(){ return onboardingComplete() ? employeeHome() : pathSection(); }
function homeSearchGo(el){
  const v = String(el?.value || '').trim();
  faqSearch = v.toLowerCase();
  nav('faq');
}
function employeeHome(){
  const quick = [
    ["openFormFill('incident')",'Report an injury / incident','Fill it out right here - the office is notified'],
    ["openFormFill('damage')",'Report damage','Equipment, vehicle, or property - fill out now'],
    ["openFormFill('nearmiss')",'Report a near miss','Two minutes, anonymous allowed'],
    ["nav('faq')",'Request time off','ExakTime app, two weeks ahead - the FAQ walks you through it'],
    ["nav('forms')",'Truck / purchase / Spark Award','Company Links forms - how and when to use them'],
    ["nav('bbsi')",'Paystubs & taxes','Everything myBBSI, one tap'],
  ];
  const find = [['faq','FAQs - search anything'],['policies','Policies & handbook'],['role','My role & expectations'],['safety','Safety refresher'],['perdiem','Per diem / travel'],['bbsi','Paystubs / myBBSI'],['tools','Tools / PPE'],['exaktime','Timekeeping'],['milestones','My check-ins']];
  return `<section class="panel employee-path"><p class="eyebrow">Quick actions</p><h2>Do something</h2><div class="home-actions">${quick.map(([id,label,hint])=>`<button class="home-action" onclick="${id}"><b>${esc(label)}</b><small>${esc(hint)}</small></button>`).join('')}</div></section>
  <section class="panel"><p class="eyebrow">Find something</p><h2>Everything you learned, one tap away</h2><div class="cards">${find.map(([id,label])=>`<button class="page-card" onclick="nav('${id}')"><b>${esc(label)}</b><small>Open</small></button>`).join('')}</div></section>
  <section class="grid two"><article class="panel"><p class="eyebrow">My training record</p><h2>Complete ✓</h2><div class="progress-parts">${onboardingParts().map((p,i)=>`<span class="${p.pct===100?'done':''}"><b>${i+1}</b> ${esc(p.label)} · ${p.pct}%</span>`).join('')}</div><p>Your acknowledgements and signatures are stored on your employee record in production. A yearly refresher pulls 5 random sections; your manager can also assign retraining.</p><button class="secondary" onclick="nav('path')">Revisit my onboarding path</button></article><article class="panel"><p class="eyebrow">Stuck on something?</p><h2>Ask before guessing.</h2><p>Search the FAQs first - most answers are there. Then your supervisor, then the office. If you cannot reach your supervisor, call the main office line.</p><button class="secondary" onclick="nav('help')">Who to contact</button></article></section>`;
}
function pathSection(){
  const steps = [
    ['course','First-day orientation','Start here. The 30,000-foot view of Goff — who we are, our values, and what to expect.','Begin',
      () => completed.orientation || coursePct()===100],
    ['policies','Policies & acknowledgements','Complete each policy course — real rules, real questions, acknowledgement at the end.','Continue',
      () => allPolicyCoursesDone()],
    ['safety','Safety training','Work through the safety sections and pass the quiz before hands-on work.','Continue',
      () => allSafetyCoursesDone()],
    ['exaktime','Learn work basics','A short course: ExakTime setup, the clock-in rhythm, timecard approval, and daily tools.','Continue',
      () => allWorkBasicsDone()],
    ['handoff','Meet with your supervisor','The in-person checklist: apparel, tools, equipment tests, emergency walk, first assignment.','Finish',
      () => handoffDone()]
  ];
  const stepDone = (i) => steps[i][4]();
  return `<section class="panel employee-path"><p class="eyebrow">My onboarding path</p><h2>Start with first-day orientation. Then keep going in order.</h2><p class="summary">Before you begin: confirm your arrival time, location, and supervisor in the card above. Then work through the steps below with your supervisor or on your own.</p><div class="path-steps">${(()=>{ const firstOpen = steps.findIndex((_,i)=>!stepDone(i)); return steps.map((step,i)=>{ const done=stepDone(i); return `<article class="path-step ${done?'complete':i===firstOpen?'current':''}"><span>${done?'Complete':`Step ${i+1}`}</span><h3>${esc(step[1])}</h3><p>${esc(step[2])}</p><button class="${done?'secondary':''}" onclick="nav('${step[0]}')">${done?'Completed ✓':esc(step[3])}</button></article>`; }).join(''); })()}</div></section><section class="grid two"><article class="panel"><p class="eyebrow">Progress</p><h2>${onboardingPct()}% of onboarding complete</h2><div class="bar"><i style="width:${onboardingPct()}%"></i></div><div class="progress-parts">${onboardingParts().map((p,i)=>`<span class="${p.pct===100?'done':''}"><b>${i+1}</b> ${esc(p.label)} · ${p.pct}%</span>`).join('')}</div><p>Production will save this to the employee record. For this review version, progress is saved on this device.</p></article><article class="panel"><p class="eyebrow">After onboarding</p><h2>This becomes your employee home.</h2><p>Once onboarding is complete, the portal should open to resources, policies, forms, and training refreshers — not this first-day path.</p><button class="secondary" onclick="nav('home')">Preview the employee home</button></article></section>`;
}

function scrollToEl(sel){
  const el = document.querySelector(sel);
  if(!el) return;
  const r = el.getBoundingClientRect();
  // Only move if the target isn't already near the top of the viewport — never jump to page top.
  if(r.top < 0 || r.top > 160) window.scrollTo({ top: r.top + (window.pageYOffset || 0) - 84, behavior:'smooth' });
}
function scrollToSlide(){ scrollToEl('.slide-canvas'); }
function setCourseSlide(i){ courseIndex = Math.max(0, Math.min(ORIENTATION_STEPS.length-1, i)); safeSet('goffCourseIndex', courseIndex); render(); scrollToSlide(); }
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
    <img class="slide-logo" src="/goff-welding-logo.png" alt="" aria-hidden="true" />
    <span class="g-mark" aria-hidden="true">G</span>
    <div class="slide-inner">
      ${item.austin?`<div class="austin-badge">Austin Goff • CEO</div>`:''}
      <p class="slide-eyebrow">${esc(item.eyebrow)}</p>
      <h3 class="slide-headline">${heroTitle}</h3>
      ${item.lede?`<p class="slide-lede">${esc(item.lede)}</p>`:''}
      ${item.body?`<p class="slide-body">${esc(item.body)}</p>`:''}
      ${cards}
      ${item.links?`<div class="slide-links">${item.links.map(l=>`<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>`:''}
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

function trainingSection(){ return `<section class="panel training-panel"><p class="eyebrow">Reference — the full onboarding map</p><h2>Every piece, who owns it, and when</h2><p class="summary">A read-only map of the whole journey from cleared candidate to active employee — including the admin-owned pieces you never see as an employee. Your actual progress lives on the home page’s five steps.</p><div class="training-steps">${trainingSteps.map((s,i)=>`<article class="training-step"><span class="step-check" style="cursor:default">${i+1}</span><div><span>${esc(s.timing)} • ${esc(s.owner)}</span><h3>${esc(s.title)}</h3><p>${esc(s.why)}</p><button class="inline" onclick="nav('${s.page}')">Open module</button></div></article>`).join('')}</div></section>`; }
function markPathStep(id){ completed[`path-${id}`] = !completed[`path-${id}`]; save(); render(); }
function pathStepBar(id, label){
  const done = completed[`path-${id}`] === true;
  return `<div class="path-mark ${done?'done':''}"><p>${esc(label)}</p><button class="${done?'secondary':''}" onclick="markPathStep('${id}')">${done?'Step complete ✓ (tap to undo)':'Mark this step complete'}</button></div>`;
}
function exaktimeSection(){
  if(courseOpenSet === 'basics' && courseOpenId){
    const c = WORKBASICS_COURSES.find(x=>x.id===courseOpenId);
    if(c) return coursePlayer('basics', c);
  }
  const p = pageContent.exaktime;
  return `<section class="panel doc-page"><p class="eyebrow">Step 4 • Learn work basics</p><h2>ExakTime &amp; the tools of the day</h2><p class="summary">One short course covers it: setting up ExakTime, the daily clock-in rhythm, how a timecard becomes a paycheck, and the other tools you’ll touch — QUO, Travel Bank, purchase requests, and the Work Schedule. Finish the course to complete this step.</p>
  <div class="policy-courses basics-courses">${courseMenuCards('basics')}</div>
  ${allWorkBasicsDone()?`<div class="ack-box"><h3>Work basics complete ✓</h3><p>This step is done. The FAQ keeps every one of these answers searchable whenever you need a refresher.</p></div>`:''}
  <div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section>`;
}

// Step 5 — the physical day-one handoff, from Goff's own Welcome New Hire
// Checklist (Protocol/Procedure + Apparel Distribution + Emergency items).
// These are the things that happen with a person in the shop, not on a phone.
// In production this becomes the SUPERVISOR's signoff checklist per Austin's
// manager-handoff tracking ask; for review it is check-off-able here.
const HANDOFF_CHECKLIST = [
  ['Meet your supervisor','Confirm who you report to, your first assignment, work area, expected pace, and who to ask for help.'],
  ['Role expectations reviewed','Walk through your role’s KRA — what success looks like and how your work is scored.'],
  ['Apparel issued','Receive your Goff apparel (typically 5 shirts) and sign the Apparel Responsibility form for its value.'],
  ['Tool list & sign-out','Review the required tool list for your role, note anything missing before the 30-day check, and complete the tool sign-out sheet.'],
  ['Material sign-out','Learn the material sign-out sheet and when to use it.'],
  ['PPE walk','See where PPE lives (parts room, shop entrances, trailers) and confirm proper use for your tasks.'],
  ['Lockout/tagout demo','Hands-on LOTO demonstration on real equipment — the training course covered the theory; this is the practice.'],
  ['Equipment tests (as applicable)','Hyster (forklift) and scissor-lift safety tests for roles that operate them.'],
  ['Emergency walk','Physically walk the exits, first aid kits, fire extinguishers, and the assembly point (northeast of the Main Office parking lot). Review FROI and the emergency contact list.'],
  ['Personal info & emergency contact','Confirm your Personal Information Sheet and emergency contact details are on file and current.'],
  ['Receipts & purchases','Where receipts go (Travel Bank, Fridays) and how purchases are requested through your supervisor.'],
  ['Open questions captured','Anything unclear gets written down and assigned a follow-up before the 30-day check-in.'],
];
function handoffDone(){ return HANDOFF_CHECKLIST.every((_,i)=>completed[`handoffitem-${i}`]); }
function handoffSection(){
  const p = pageContent.handoff;
  const doneCount = HANDOFF_CHECKLIST.filter((_,i)=>completed[`handoffitem-${i}`]).length;
  return `<section class="panel doc-page"><p class="eyebrow">Step 5 • Supervisor handoff — the in-person checklist</p><h2>Meet with your supervisor</h2><p class="summary">Everything before this step happened on a screen. This step happens in the shop, with ${esc(PROFILE.supervisor)} — the physical items from Goff’s New Hire Checklist. ${doneCount} of ${HANDOFF_CHECKLIST.length} complete. In production, your supervisor checks these off and signs; for this review version, check them here.</p>
  <div class="checkin-grid">${HANDOFF_CHECKLIST.map(([title,detail],i)=>`<label class="check ${completed[`handoffitem-${i}`]?'checked':''}"><input type="checkbox" ${completed[`handoffitem-${i}`]?'checked':''} onchange="toggle('handoffitem-${i}')" /><span><b>${esc(title)}</b><small>${esc(detail)}</small></span></label>`).join('')}</div>
  ${handoffDone()?`<div class="ack-box"><h3>Handoff complete — welcome to the crew ✓</h3><p>Onboarding is done. From here the portal is your everyday home: FAQs, forms, policies, and training refreshers. Your 30-day check-in is already on the calendar.</p><div class="admin-actions"><button disabled title="Requires production database">Supervisor sign-off</button></div></div>`:''}
  <div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}<li>Which roles require the Hyster / scissor-lift tests, and who administers them?</li><li>Does the Personal Information Sheet live in myBBSI or on paper?</li></ul></div></section>`;
}
function contentPage(id){ const p=pageContent[id]; if(!p) return startSection(); const bar = ''; return `<section class="panel doc-page"><p class="eyebrow">${esc(p.kicker)}</p><h2>${esc(p.title)}</h2><p class="summary">${esc(p.summary)}</p><div class="doc-blocks">${p.blocks.map(([h,b])=>`<article><h3>${esc(h)}</h3><p>${esc(b)}</p></article>`).join('')}</div>${bar}<div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section>`; }
function formsSection(){ return `<section class="panel"><p class="eyebrow">Company links training</p><h2>Forms employees need to understand</h2><p class="summary">Each form should teach when to use it, how to submit it, who sees it, and what happens after. Final routing and visibility will be locked after Austin confirms who owns each form and which links are employee-visible.</p><div class="form-modules">${formModules.map(m=>`<article class="form-module"><div class="module-head"><span>${esc(m.status)}</span><h3>${esc(m.title)}</h3><small>${esc(m.audience)}</small></div><dl><div><dt>When to use it</dt><dd>${esc(m.when)}</dd></div><div><dt>How to submit</dt><dd>${esc(m.how)}</dd></div><div><dt>What happens next</dt><dd>${esc(m.next)}</dd></div><div class="proposed-route"><dt>Proposed routing — DRAFT</dt><dd>${esc(m.route)}</dd></div><div class="confirm"><dt>Confirm</dt><dd>${esc(m.confirm)}</dd></div></dl>${m.id==='damage'?`<div class="admin-actions" style="padding:0 16px 16px"><button onclick="openFormFill('damage')">Fill out: damage report</button><button onclick="openFormFill('incident')">Fill out: incident report</button></div>`:m.id==='nearmiss'?`<div class="admin-actions" style="padding:0 16px 16px"><button onclick="openFormFill('nearmiss')">Fill out a near-miss report</button></div>`:''}</article>`).join('')}</div></section>`; }
function checkinSection(){ return `<section class="panel checkin-panel"><p class="eyebrow">Follow-up after the fire hose</p><h2>30-day check-in</h2><p class="summary">Austin said the first day can be a fire hose. This check-in gives Goff a structured second pass after the employee has real context.</p><div class="checkin-grid">${checkinItems.map((item,i)=>`<label class="check ${completed[`checkin-${i}`]?'checked':''}"><input type="checkbox" ${completed[`checkin-${i}`]?'checked':''} onchange="toggle('checkin-${i}')" /><span><b>${esc(item.title)}</b><small>${esc(item.detail)}</small></span></label>`).join('')}</div><div class="manager-note"><h3>Admin/supervisor record</h3><textarea placeholder="Questions asked, expectations clarified, follow-up assigned, manager notes..."></textarea><p class="note"><strong>Production database needed:</strong> notes, assignments, and completion status will activate once employee records are server-side.</p><div class="admin-actions"><button disabled title="Requires production database">Save check-in note</button><button disabled title="Requires production database">Assign follow-up</button><button disabled title="Requires production database">Mark 30-day complete</button></div></div></section>`; }
function opsSection(){
  return `<section class="panel ops-panel"><p class="eyebrow">Admin-side onboarding control</p><h2>Who needs what next</h2><p class="summary">This is the internal operating view: not another document list. It shows each new hire’s stage, blockers, owner actions, and follow-up timing.</p><div class="metric-grid">${adminMetrics().map(m=>`<article><span>${esc(m.label)}</span><strong>${esc(m.value)}</strong><p>${esc(m.detail)}</p></article>`).join('')}</div></section><section class="panel"><p class="eyebrow">Onboarding queue</p><h2>Employee status board</h2><div class="employee-board">${currentOnboardingQueue().map(e=>`<article class="employee-row ${e.fromRecruiting?'from-recruiting':''}"><div><span class="status-pill">${esc(e.status)}</span><h3>${esc(e.name)}</h3><p>${esc(e.role)}</p></div><dl><div><dt>Stage</dt><dd>${esc(e.stage)}</dd></div><div><dt>Supervisor</dt><dd>${esc(e.supervisor)}</dd></div><div><dt>Start</dt><dd>${esc(e.start)}</dd></div></dl><div class="mini-progress"><span>${esc(e.progress)}%</span><i style="width:${esc(e.progress)}%"></i></div><div class="row-next"><b>Blocked / watch</b><p>${esc(e.blocked)}</p><b>Next action</b><p>${esc(e.next)}</p></div></article>`).join('')}</div></section><section class="grid two"><article class="panel"><p class="eyebrow">Owner lanes</p><h2>Next actions by owner</h2><div class="owner-lanes">${ownerActions.map(l=>`<div class="owner-lane"><h3>${esc(l.owner)} <span>${esc(l.count)}</span></h3><ul>${l.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`).join('')}</div></article><article class="panel"><p class="eyebrow">Current blockers</p><h2>Decisions holding automation</h2><div class="blocker-list">${blockers.map(b=>`<article><span>${esc(b.owner)}</span><b>${esc(b.title)}</b><p>${esc(b.impact)}</p></article>`).join('')}</div></article></section><section class="panel"><p class="eyebrow">Operating timeline</p><h2>Admin checklist from clearance to 30 days</h2><div class="admin-timeline">${adminTimeline.map(([title,detail],i)=>`<article><span>${i+1}</span><div><b>${esc(title)}</b><p>${esc(detail)}</p></div></article>`).join('')}</div><p class="note"><strong>Production database needed:</strong> these actions become one-click workflow actions once onboarding records are server-side.</p><div class="admin-actions"><button disabled title="Requires production database">Generate welcome message</button><button disabled title="Requires production database">Verify BBSI complete</button><button disabled title="Requires production database">Assign supervisor handoff</button><button disabled title="Requires production database">Schedule 30-day check-in</button></div></section>
  <section class="panel"><p class="eyebrow">Training oversight — what Austin asked for on the July 1 call</p><h2>Who actually read it, and who click-click-clicked</h2><p class="summary">Every knowledge check tracks attempts, not just completion. Quinton and managers see per-employee results: first-try answers versus second-guessing, section completion, quiz scores, and acknowledgements. Demo data below is from this device.</p>
  <div class="metric-grid">${(()=>{const s=kcStats();return [
    { label:'Knowledge checks', value:`${s.done}/${s.total}`, detail:'Answered correctly so far on this device' },
    { label:'First-try correct', value:String(s.firstTry), detail:'Read it and got it — the signal Austin wants' },
    { label:'Needed retries', value:String(s.retried), detail:'Second-guessed — flag for a manager conversation' },
    { label:'Safety sections', value:`${SAFETY_COURSES.filter(c=>courseComplete('safety',c)).length}/${SAFETY_COURSES.length}`, detail:'Final V3 quiz retired 7/2 — BBSI safety may reinstate' },
  ].map(m=>`<article><span>${esc(m.label)}</span><strong>${esc(m.value)}</strong><p>${esc(m.detail)}</p></article>`).join('')})()}</div>
  <div class="doc-blocks" style="margin-top:16px"><article><h3>Assign retraining</h3><p>Manager assigns any section or policy to an employee with a deadline (“Did you even read the vehicle policy? You’re doing it tomorrow.”) — trackable instead of take-my-word-for-it.</p></article><article><h3>Yearly refresher</h3><p>Each year every employee gets 5 randomly-pulled sections as a refresher, per Austin. With all resources in one spot, this becomes a button, not a project.</p></article></div>
  <div class="admin-actions"><button disabled title="Requires production database">Assign section to employee</button><button disabled title="Requires production database">Set completion deadline</button><button disabled title="Requires production database">Trigger yearly refresher</button></div></section>`;
}
function resourcesSection(){ return `<section class="panel"><p class="eyebrow">Employee resources</p><h2>After onboarding, this becomes the main employee home.</h2><p class="summary">A new employee does not need to choose from all resources on day one. They learn them through onboarding first. Once complete, this page becomes the place to come back for forms, policies, training refreshers, and company links.</p><div class="cards">${[['faq','FAQs — search anything'],['forms','Company forms'],['policies','Policies'],['perdiem','Per diem / travel'],['exaktime','Timekeeping'],['bbsi','Paystubs / myBBSI'],['safety','Safety refresher'],['tools','Tools / PPE'],['role','Role expectations'],['milestones','Check-ins']].map(([id,label])=>`<button class="page-card" onclick="nav('${id}')"><b>${esc(label)}</b><small>Open resource</small></button>`).join('')}</div></section>`; }

function helpSection(){ return `<section class="panel"><p class="eyebrow">Help / questions</p><h2>If you are not sure what to do, ask here first.</h2><div class="doc-blocks"><article><h3>Check the FAQs</h3><p>Most day-one questions (parking, paychecks, time off, PPE, trucks) are already answered. <button class="inline-link" onclick="nav('faq')">Search the FAQs</button></p></article><article><h3>Your supervisor</h3><p>${esc(PROFILE.supervisor)} is the first person to ask about your first assignment, tools, PPE, and work expectations. If you can’t reach your supervisor, call the main office line.</p></article><article><h3>Goff admin / office</h3><p>Ask Goff admin if you are stuck on employment setup, login links, forms, or schedule/start details. Payroll questions go to HR or the Office Manager. Lost Work Schedule access goes to the Scheduler.</p></article><article><h3>Safety question</h3><p>Stop and ask before doing work that feels unsafe, unclear, or outside your training. Report hazards, near misses, and injuries immediately.</p></article><article><h3>Portal issue</h3><p>If something in the portal looks wrong or does not match what your supervisor told you, ask before guessing.</p></article></div></section>`; }

function adminSection(){ return `<section class="panel"><p class="eyebrow">Austin review mode</p><h2>Drive → portal reconciliation</h2><p class="summary">This is the architect view for Austin/Goff, not the employee start page. It shows what source material is being used, where it belongs, and what decision is needed before we make it employee-ready.</p><div class="phase-grid">${phaseOneStatus.map(x=>`<article><span>${esc(x.status)}</span><b>${esc(x.area)}</b><p>${esc(x.detail)}</p></article>`).join('')}</div></section>
  <section class="panel"><p class="eyebrow">Policy document index — classifications proposed, not final</p><h2>Every named policy, one list</h2><p class="summary">All policy documents in Goff’s Drive with the proposed handling for each: sign, read-and-acknowledge, secure/BBSI, or held back. Employees see the 12 policy courses; this index is the master list behind them.</p>
  <div class="table-list">${POLICY_LIST.map(x=>`<article><div><b>${esc(x.name)}</b>${x.note?`<small>${esc(x.note)}</small>`:''}</div><span>${esc(x.who)}</span><em>${esc(x.type)}</em></article>`).join('')}</div>
  <div class="confirm-box"><h3>Questions to confirm with Goff/BBSI</h3><ul>${pageContent.policies.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section><section class="panel"><p class="eyebrow">Source material crosswalk</p><h2>What goes where</h2><div class="recon-table">${reconciliationRows.map(r=>`<article><div><span>Source</span><b>${esc(r.source)}</b></div><div><span>Use in portal</span><p>${esc(r.use)}</p></div><div><span>Audience</span><p>${esc(r.audience)}</p></div><div><span>Status</span><em>${esc(r.status)}</em></div><div><span>Decision needed</span><p>${esc(r.decision)}</p></div></article>`).join('')}</div></section><section class="grid two"><article class="panel"><p class="eyebrow">Human input needed</p><h2>What Jeff/Austin/BBSI need to answer</h2><div class="question-list">${humanNeeds.map(([topic,q])=>`<article><span>${esc(topic)}</span><b>${esc(q)}</b></article>`).join('')}</div></article><article class="panel"><p class="eyebrow">Walkthrough questions</p><h2>Questions for Goff/BBSI</h2><div class="question-list single">${adminQuestions.map(([topic,q])=>`<article><span>${esc(topic)}</span><b>${esc(q)}</b></article>`).join('')}</div><p class="note"><strong>Phase 1 rule:</strong> build the reviewable structure now; save real employee records, quiz results, acknowledgements, reminders, and signatures for backend work after Goff approves the flow.</p></article></section>`; }

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
  <input type="search" class="faq-search" value="${esc(faqSearch)}" placeholder="Search: parking, paycheck, time off, PPE, truck..." oninput="setFaqSearch(this.value)" autocomplete="off" />
  <div id="faq-results">${faqResults()}</div>
  <div class="confirm-box"><h3>Questions to confirm with Goff</h3><ul><li>Is the FAQ PDF (April 2026) still current on every answer — especially payroll, advances, and Travel Bank?</li><li>Should the Work Schedule / Company Links references become live links in the portal once visibility is approved?</li><li>Should a Spanish version of the FAQ ship in v1?</li></ul></div></section>`;
}

function answerQuiz(i, val){ quizAnswers[i] = val; safeSet('goffSafetyQuizV3', JSON.stringify(quizAnswers)); render(); }
function resetQuiz(){ quizAnswers = {}; safeSet('goffSafetyQuizV3', '{}'); render(); }
function quizScore(){ return SAFETY_QUIZ.reduce((n,item,i)=> n + (quizAnswers[i] === item.a ? 1 : 0), 0); }
function quizAnsweredCount(){ return SAFETY_QUIZ.reduce((n,_,i)=> n + (typeof quizAnswers[i] === 'boolean' ? 1 : 0), 0); }
function safetySection(){
  if(courseOpenSet === 'safety' && courseOpenId){
    const c = SAFETY_COURSES.find(x=>x.id===courseOpenId);
    if(c) return coursePlayer('safety', c);
  }
  const p = pageContent.safety;
  const answered = quizAnsweredCount();
  const score = quizScore();
  const done = answered === SAFETY_QUIZ.length;
  const passed = done && score === SAFETY_QUIZ.length;
  const coursesDone = SAFETY_COURSES.filter(c=>courseComplete('safety',c)).length;
  return `<section class="panel doc-page"><p class="eyebrow">Step 3 • Safety training — built from BBSI’s 2026 New Hire Safety Orientation</p><h2>Safety training sections</h2><p class="summary">${coursesDone} of ${SAFETY_COURSES.length} sections complete. Each section is a short slide course with knowledge checks — this is the “10–15 sections” structure Austin described, filled with BBSI’s actual 2026 material. Work through them all, then pass the final quiz below to complete your safety record.</p>
  <div class="policy-courses safety-courses">${courseMenuCards('safety')}</div>
  <article class="safety-sec placeholder" style="margin-top:16px"><span class="sec-num">…</span><div><b>More coming from BBSI</b><p>The 2026 deck reserves placeholders for Emergency Response, PPE, Hot Work, Compressed Gas, Fall Protection, Walking/Working Surfaces, Rigging, Bloodborne Pathogens, and Noise Exposure — titled but no teaching material yet. As BBSI’s content arrives, each becomes a section here in the same format.</p></div></article></section>
  ${allSafetyCoursesDone() ? `<section class="panel"><div class="ack-box"><h3>Employee acknowledgement — safety training complete</h3><p>${esc(SAFETY_ACK)}</p><div class="admin-actions"><button disabled title="Requires production database">Sign &amp; submit to HR / Safety Manager</button></div><p class="note" style="margin-top:12px"><strong>Production note:</strong> the signed acknowledgement is kept in the employee personnel file (HR or Safety Manager). Signature capture activates with the production database.</p></div></section>` : ''}
  <section class="panel"><div class="confirm-box"><h3>Pending BBSI / Goff</h3><ul>${p.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div></section>`;
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


// --- In-portal fillable forms (fields from the actual Drive form documents) ---
const SHARED_INCIDENT_FIELDS = [
  { k:'Name of person(s) involved', type:'text', req:true },
  { k:'Your name (person completing this form)', type:'text', req:true, name:true },
  { k:'Date of incident', type:'date', req:true },
  { k:'Time of incident', type:'time' },
  { k:'Where did it happen? (Customer / jobsite / location)', type:'text', req:true },
  { k:'What time did the shift start?', type:'time' },
  { k:'Was there medical treatment?', type:'yesno' },
  { k:'If yes: what was done? (cleaned and bandaged, ice/heat, OTC medicine…)', type:'text' },
  { k:'Witnesses', type:'textarea' },
  { k:'In detail: what was happening leading up to it, the incident itself, and what you did immediately after', type:'textarea', req:true },
];
const FORM_DEFS = {
  damage: { title:'Company Damage Report', eyebrow:'Equipment, vehicle, or property damage', intro:'Report it immediately and complete this form. Your supervisor and the office are notified.', fields: SHARED_INCIDENT_FIELDS },
  incident: { title:'Incident Report', eyebrow:'Injury or incident', intro:'All injuries are reported immediately through your supervisor — this form is the written record. Serious injury? 9-1-1 and WorkMed first, form second.', fields: SHARED_INCIDENT_FIELDS },
  nearmiss: { title:'Near-Miss Report', eyebrow:'It almost happened — that counts', intro:'A near-miss is a potential hazard or incident that has not resulted in injury or damage. Reporting it is everyone’s responsibility — and per Goff’s own form, you may report anonymously.', fields:[
    { k:'Name of person(s) involved (optional)', type:'text' },
    { k:'Your name (optional — anonymous is allowed)', type:'text', name:true },
    { k:'Date of incident', type:'date', req:true },
    { k:'Time of incident', type:'time' },
    { k:'Where did it happen? (Customer / jobsite / location)', type:'text', req:true },
    { k:'This is a…', type:'checks', options:['Near miss','Safety concern','Safety suggestion','Other'] },
    { k:'Type of concern', type:'checks', options:['Unsafe act','Unsafe conditions of area','Unsafe conditions of equipment','Unsafe use of equipment','Other'] },
    { k:'Describe the near miss or concern', type:'textarea', req:true },
    { k:'Your suggestion to prevent it (optional)', type:'textarea' },
  ] },
};
let formFillId = null;
let formFillDone = null;
function openFormFill(id){ if(!FORM_DEFS[id]) return; formFillId = id; formFillDone = null; nav('formfill'); }
function ffInputId(i){ return `ff-field-${i}`; }
function formFieldHtml(f, i){
  const id = ffInputId(i);
  const label = `<label class="ff-label" for="${id}">${esc(f.k)}${f.req?' <em>*</em>':''}</label>`;
  if(f.type==='textarea') return `${label}<textarea id="${id}" rows="4"></textarea>`;
  if(f.type==='yesno') return `${label}<select id="${id}"><option value=""></option><option>Yes</option><option>No</option></select>`;
  if(f.type==='checks') return `${label}<div class="ff-checks" id="${id}">${f.options.map((o,j)=>`<label><input type="checkbox" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</div>`;
  return `${label}<input id="${id}" type="${f.type==='date'?'date':f.type==='time'?'time':'text'}" />`;
}
async function submitGoffForm(){
  const def = FORM_DEFS[formFillId]; if(!def) return;
  const fields = {}; let submittedName = ''; let missing = null;
  def.fields.forEach((f,i) => {
    const el = document.getElementById(ffInputId(i)); if(!el) return;
    let v = '';
    if(f.type==='checks') v = Array.from(el.querySelectorAll('input:checked')).map(x=>x.value).join(', ');
    else v = String(el.value || '').trim();
    fields[f.k] = v;
    if(f.name && v) submittedName = v;
    if(f.req && !v && !missing) missing = f.k;
  });
  if(missing){ const t=document.createElement('div'); t.className='toast'; t.textContent=`Required: ${missing}`; document.body.appendChild(t); setTimeout(()=>t.remove(),2200); return; }
  const btn = document.getElementById('ff-submit'); if(btn){ btn.disabled=true; btn.textContent='Submitting…'; }
  try{
    const res = await fetch('/api/goff-portal/forms', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ formId: formFillId, submittedName, fields }) });
    const data = await res.json().catch(()=>({}));
    if(!res.ok || !data.ok) throw new Error(data.error || 'submit failed');
    formFillDone = { id: data.id }; render(); window.scrollTo({top:0, behavior:'smooth'});
  }catch(_){
    if(btn){ btn.disabled=false; btn.textContent='Submit report'; }
    const t=document.createElement('div'); t.className='toast'; t.textContent='Could not submit — tell your supervisor directly'; document.body.appendChild(t); setTimeout(()=>t.remove(),2600);
  }
}
function formFillSection(){
  const def = FORM_DEFS[formFillId];
  if(!def) return formsSection();
  if(formFillDone) return `<section class="panel doc-page"><div class="ack-box"><h3>${esc(def.title)} submitted ✓ — reference #${esc(String(formFillDone.id))}</h3><p>It’s recorded and the office has been notified. For anything urgent, also tell your supervisor in person — the form is the record, not the alarm.</p><div class="admin-actions"><button onclick="nav('start')">Back to home</button><button class="secondary" onclick="openFormFill('${formFillId}')">Submit another</button></div></div></section>`;
  return `<section class="panel doc-page ff-panel"><p class="eyebrow">${esc(def.eyebrow)} — fields from Goff’s official form</p><h2>${esc(def.title)}</h2><p class="summary">${esc(def.intro)}</p>
  <div class="ff-form">${def.fields.map((f,i)=>`<div class="ff-row ${f.type==='textarea'||f.type==='checks'?'wide':''}">${formFieldHtml(f,i)}</div>`).join('')}</div>
  <div class="admin-actions" style="margin-top:18px"><button id="ff-submit" onclick="submitGoffForm()">Submit report</button><button class="secondary" onclick="nav('forms')">Cancel</button></div>
  <p class="note" style="margin-top:14px"><strong>Routing pending Goff:</strong> submissions are stored and currently notify the portal team; final recipients (supervisor, BBSI safety, office) activate once Austin confirms routing.</p></section>`;
}

function main(){
  if(section==='start') return startSection();
  if(section==='home') return employeeHome();
  if(section==='path') return pathSection();
  if(section==='ops') return opsSection();
  if(section==='training') return trainingSection();
  if(section==='course') return courseSection();
  if(section==='values') return contentPage('values');
  if(section==='clearance') return contentPage('clearance');
  if(section==='before') return contentPage('before');
  if(section==='bbsi') return contentPage('bbsi');
  if(section==='policies') return policiesSection();
  if(section==='exaktime') return exaktimeSection();
  if(section==='safety') return safetySection();
  if(section==='forms') return formsSection();
  if(section==='formfill') return formFillSection();
  if(section==='tools') return contentPage('tools');
  if(section==='role') return roleSection();
  if(section==='faq') return faqSection();
  if(section==='perdiem') return contentPage('perdiem');
  if(section==='handoff') return handoffSection();
  if(section==='milestones') return contentPage('milestones');
  if(section==='resources') return resourcesSection();
  if(section==='help') return helpSection();
  if(section==='checkin') return checkinSection();
  if(section==='admin') return adminSection();
  return startSection();
}
function courseHeader(){ return `<header class="course-appbar"><img src="/goff-welding-logo.png" alt="Goff Welding" /><button class="secondary" onclick="nav('start')">Portal home</button></header>`; }

// --- Review feedback widget (Austin's red pen) ---
let feedbackOpen = false;
function feedbackContext(){
  if(section === 'course') return `Orientation slide ${courseIndex+1}`;
  if(courseOpenSet && courseOpenId){
    const c = courseListFor(courseOpenSet).find(x=>x.id===courseOpenId);
    const pos = (courseSlidePos[`${courseOpenSet}:${courseOpenId}`]||0)+1;
    return c ? `${c.title} — slide ${pos}` : '';
  }
  return '';
}
function toggleFeedback(){ feedbackOpen = !feedbackOpen; render(); if(feedbackOpen){ const t=document.getElementById('fb-text'); if(t) t.focus(); } }
async function sendFeedback(){
  const textEl = document.getElementById('fb-text');
  const nameEl = document.getElementById('fb-name');
  const btn = document.getElementById('fb-send');
  const comment = (textEl?.value || '').trim();
  const author = (nameEl?.value || '').trim() || 'Goff reviewer';
  if(!comment){ if(textEl) textEl.focus(); return; }
  if(btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
  try{
    safeSet('goffFeedbackName', author);
    const res = await fetch('/api/goff-portal/feedback', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ author, comment, section, context: feedbackContext(), url: window.location.href })
    });
    if(!res.ok) throw new Error('bad status '+res.status);
    feedbackOpen = false; render();
    const t=document.createElement('div'); t.className='toast'; t.textContent='Comment sent to Jeff ✓'; document.body.appendChild(t); setTimeout(()=>t.remove(),2200);
  }catch(_){
    if(btn){ btn.disabled = false; btn.textContent = 'Send comment'; }
    const t=document.createElement('div'); t.className='toast'; t.textContent='Could not send — try again'; document.body.appendChild(t); setTimeout(()=>t.remove(),2200);
  }
}
function feedbackWidget(){
  const ctx = feedbackContext();
  if(!feedbackOpen) return `<button class="fb-fab" onclick="toggleFeedback()" title="Leave a review comment">📝 Feedback</button>`;
  return `<div class="fb-panel"><div class="fb-head"><b>Review comment</b><button class="fb-x" onclick="toggleFeedback()">✕</button></div>
  <p class="fb-where">On: <b>${esc(section)}</b>${ctx?` — ${esc(ctx)}`:''}</p>
  <input id="fb-name" placeholder="Your name" value="${esc(safeGet('goffFeedbackName') || '')}" />
  <textarea id="fb-text" placeholder="What should change here? Wording, order, missing info — anything."></textarea>
  <button id="fb-send" onclick="sendFeedback()">Send comment</button>
  <small>Goes straight to Jeff with this exact location attached.</small></div>`;
}

function compactHeader(){
  return `<header class="mini-hero"><img src="/goff-welding-logo.png" alt="Goff Welding" /><span class="mini-sep">Employee portal</span><div class="mini-meta"><span>${esc(PROFILE.firstName)} • starts ${esc(PROFILE.startDate)}</span><button class="secondary" onclick="nav('start')">Portal home</button></div></header>`;
}
function render(){
  const app = document.getElementById('app');
  if(section==='course'){
    app.innerHTML = `${courseHeader()}<main class="course-wrap">${main()}</main>${feedbackWidget()}`;
  } else {
    // Full welcome hero only on the home screen; inner pages get a slim bar.
    // Once onboarding is done (or when previewing 'home'), the hero becomes the
    // everyday welcome-back with search instead of first-day logistics.
    const isHome = section==='home' || (section==='start' && onboardingComplete());
    const hdr = isHome ? homeHeader() : section==='start' ? header() : compactHeader();
    app.innerHTML = `${hdr}<main class="wrap">${tabs()}${main()}</main><footer>Private Goff Welding employee portal</footer>${feedbackWidget()}`;
  }
}
render();
