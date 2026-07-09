const WORKFLOW_STAGES = [
  { id:'Application received', group:'Intake', next:'Review candidate / choose path', owner:'Quinton', due:'Today', template:'Candidate Under Review' },
  { id:'Review candidate / choose path', group:'Intake', next:'Phone screen or weld test', owner:'Quinton', due:'1 day', template:'Candidate Under Review' },
  // Quinton preference: keep the common "not moving forward" outcomes near the
  // top of the stage picker so he can quickly disposition early applicants.
  { id:'Keep on file', group:'Disposition', next:null, owner:'Quinton', due:'Later', template:'Position Filled / Keep on File' },
  { id:'Not selected', group:'Disposition', next:null, owner:'Quinton', due:'Done', template:'General Rejection Letter' },
  { id:'Needs more experience', group:'Disposition', next:null, owner:'Quinton', due:'Later', template:'Good Potential, But Needs More Experience' },
  { id:'Entry-level unavailable', group:'Disposition', next:null, owner:'Quinton', due:'Later', template:'Entry-Level Position Not Currently Available' },
  { id:'Relocation mismatch', group:'Disposition', next:null, owner:'Quinton', due:'Done', template:'Relocation for the Wrong Reasons' },
  { id:'Needs more experience info', group:'Clarify', next:'Review candidate / choose path', owner:'Candidate', due:'2 days', template:'Request for More Relevant Experience Information' },
  { id:'Location / relocation check', group:'Clarify', next:'Phone screen or weld test', owner:'Candidate', due:'2 days', template:'Location Inquiry' },
  { id:'Phone screen invitation', group:'Screen', next:'Review phone screen', owner:'Candidate', due:'2 days', template:'AI Phone Screening Invitation' },
  { id:'Review phone screen', group:'Screen', next:'Schedule interview', owner:'Quinton', due:'Today', template:'Candidate Under Review' },
  { id:'Weld test invitation', group:'Welder path', next:'Weld test confirmation', owner:'Candidate', due:'2 days', template:'Weld Test Invitation' },
  { id:'Distance weld test invitation', group:'Welder path', next:'Weld test confirmation', owner:'Candidate', due:'2 days', template:'Distance Weld Test Invitation' },
  { id:'Weld test confirmation', group:'Welder path', next:'Review weld test', owner:'Candidate', due:'Today', template:'Weld Test Confirmation' },
  { id:'Review weld test', group:'Welder path', next:'Schedule interview', owner:'Quinton', due:'Today', template:'Candidate Under Review' },
  { id:'Schedule interview', group:'Interview', next:'Interview confirmation', owner:'Candidate', due:'2 days', template:'Interview Schedule Template' },
  { id:'Interview confirmation', group:'Interview', next:'Interview completed', owner:'Candidate', due:'Today', template:'Interview Confirmation Template' },
  { id:'Interview completed', group:'Interview', next:'Reference check authorization', owner:'Quinton', due:'Today', template:'Candidate Under Review' },
  { id:'Reference check authorization', group:'References', next:'Crystal Knows invite', owner:'Candidate', due:'2 days', template:'Reference Check Authorization Form' },
  { id:'Crystal Knows invite', group:'References', next:'Call references', owner:'Candidate', due:'2 days', template:'Crystal Knows Email Invitation' },
  { id:'Call references', group:'References', next:'Review references + Crystal', owner:'Quinton', due:'Today', template:'Reference Check Hiring Criteria' },
  { id:'Review references + Crystal', group:'References', next:'Manager review packet', owner:'Quinton', due:'Today', template:'Manager Review Packet' },
  { id:'Second interview request', group:'Manager review', next:'Second interview scheduled', owner:'Candidate', due:'2 days', template:'Second Interview Schedule Request Template' },
  { id:'Second interview scheduled', group:'Manager review', next:'Manager review packet', owner:'Candidate', due:'Today', template:'Second Interview Schedule Template' },
  { id:'Manager review packet', group:'Decision', next:'Offer letter info request', owner:'Hiring Manager', due:'Today', template:'Manager Review Packet' },
  { id:'Background check invite', group:'Pre-offer', next:'Review background check results', owner:'Candidate', due:'2 days', template:'Background Check Email Template' },
  { id:'Review background check results', group:'Pre-offer', next:'Offer letter info request', owner:'Quinton', due:'Today', template:'Candidate Under Review' },
  { id:'Offer letter info request', group:'Offer', next:'Offer letter draft', owner:'Hiring Manager', due:'Today', template:'Offer Letter Email Request Template' },
  { id:'Offer letter draft', group:'Offer', next:'Offer sent / follow-up', owner:'Admin', due:'Today', template:'Offer Letter SOP Packet' },
  { id:'Offer sent / follow-up', group:'Offer', next:'Offer accepted - clearance hold', owner:'Candidate', due:'24 hours', template:'Offer Letter 24 Hour Follow Up' },
  { id:'Offer accepted - clearance hold', group:'Guardrail', next:'BBSI documents invite', owner:'Admin', due:'Today', template:'Pre-Employment Clearance Checklist' },
  { id:'BBSI documents invite', group:'BBSI', next:'Schedule first day', owner:'Candidate / BBSI', due:'Today', template:'BBSI Check In' },
  { id:'Schedule first day', group:'Onboarding', next:'Transition to onboarding workflow', owner:'Admin', due:'Today', template:'Welcome / First Day Coordination' },
  { id:'Transition to onboarding workflow', group:'Onboarding', next:null, owner:'Admin', due:'Done', template:'Onboarding Handoff Summary' },
  { id:'Rejected after interview / weld test', group:'Disposition', next:null, owner:'Quinton', due:'Done', template:'Rejection After Interview or Weld Test' },
];

const STAGES = WORKFLOW_STAGES.map(s => s.id);
const STAGE = Object.fromEntries(WORKFLOW_STAGES.map(s => [s.id, s]));
const NEXT = Object.fromEntries(WORKFLOW_STAGES.filter(s => s.next).map(s => [s.id, s.next]));

// (Greeting is role-neutral by default; swap to a name later if Goff prefers.)

// Funnel buckets condense the 35-stage workflow into the 6 visual stages a
// hiring manager actually thinks in. Used on the dashboard pipeline.
const FUNNEL_BUCKETS = [
  { id: 'applied', label: 'Applied', stages: ['Application received', 'Review candidate / choose path', 'Needs more experience info', 'Location / relocation check'] },
  { id: 'screen', label: 'Screen', stages: ['Phone screen invitation', 'Review phone screen'] },
  { id: 'test', label: 'Test / Interview', stages: ['Weld test invitation', 'Distance weld test invitation', 'Weld test confirmation', 'Review weld test', 'Schedule interview', 'Interview confirmation', 'Interview completed'] },
  { id: 'decision', label: 'Decision', stages: ['Reference check authorization', 'Crystal Knows invite', 'Call references', 'Review references + Crystal', 'Manager review packet', 'Second interview request', 'Second interview scheduled'] },
  { id: 'offer', label: 'Offer', stages: ['Background check invite', 'Review background check results', 'Offer letter info request', 'Offer letter draft', 'Offer sent / follow-up'] },
  { id: 'hired', label: 'Hired', stages: ['Offer accepted - clearance hold', 'BBSI documents invite', 'Schedule first day', 'Transition to onboarding workflow'] },
];

function bucketForStage(stage){ for(const b of FUNNEL_BUCKETS){ if(b.stages.includes(stage)) return b; } return null; }
function isWelderPath(c){ return c.path === 'Welder path'; }
function nowISO(){ return new Date().toISOString(); }
function daysAgoISO(d){ return new Date(Date.now() - d*86400000).toISOString(); }
function stageAgeDays(c){ if(!c.stageUpdatedAt) return 0; const ms = Date.now() - new Date(c.stageUpdatedAt).getTime(); return Math.max(0, Math.floor(ms/86400000)); }
function stageAgeText(c){ const d = stageAgeDays(c); if(d===0) return 'Today'; if(d===1) return '1 day'; return `${d} days`; }
function agingLevel(c){ const d = stageAgeDays(c); if(d>=5) return 'stale'; if(d>=3) return 'aging'; return 'fresh'; }

// "Disposition" stages mean the candidate is parked or rejected — don't surface
// them on the active pipeline and don't compute aging for them.
function isActive(c){ const m = STAGE[c.stage]; return m && m.group !== 'Disposition'; }
function needsHiringManager(c){ return isActive(c) && (c.owner === 'Hiring Manager' || c.stage === 'Manager review packet' || c.stage === 'Offer letter info request'); }

// Decision routing — what buttons appear on a "Your decisions" card for each
// Hiring-Manager-owned stage. The primary button is the affirm/move-forward
// path; secondary buttons cover the other real decisions a hiring lead would make.
function decisionActionsForStage(stage){
  if(stage === 'Manager review packet') return [
    { label: 'Approve — start offer', action: "setStage('Offer letter info request')", primary: true },
    { label: 'Second interview', action: "setStage('Second interview request')" },
    { label: 'Pass', action: "setStage('Not selected')" },
  ];
  if(stage === 'Offer letter info request') return [
    { label: 'Build offer letter', action: "view='offer';render()", primary: true },
    { label: 'Pass', action: "setStage('Not selected')" },
  ];
  return [];
}

const DRIVE_TEMPLATES = [
  'Weld Test Invitation','AI Phone Screening Invitation','Background Check Email Template','BBSI Check In','Candidate Under Review','Crystal Knows Email Invitation','Distance Weld Test Invitation','Entry-Level Position Not Currently Available','General Rejection Letter','Good Potential, But Needs More Experience','Interview Confirmation Template','Interview Schedule Template','Location Inquiry','Offer Letter 24 Hour Follow Up','Offer Letter Email Request Template','Position Filled / Keep on File','Recruiting Workflow Checklist','Reference Check Authorization Form','Reference Check Hiring Criteria','Rejection After Interview or Weld Test','Relocation for the Wrong Reasons','Request for More Relevant Experience Information','Second Interview Schedule Request Template','Second Interview Schedule Template','Weld Test Confirmation'
];

const TEMPLATE_TEXT = {
 'Candidate Under Review':`Subject: Your Application is Under Review — Goff Welding\n\nHi {{first}},\n\nThank you for your interest in Goff Welding and for taking the time to apply for the {{role}} position. We are currently reviewing applications and will follow up if your experience lines up with the next step in our process.\n\nThank you,\nGoff Welding Hiring Team`,
 'AI Phone Screening Invitation':`Subject: Phone Screening Invitation — Goff Welding\n\nHi {{first}},\n\nThank you for your interest in the {{role}} role with Goff Welding. As the next step in our hiring process, we would like you to complete a brief phone screening so we can learn more about your experience, availability, and fit for the role.\n\nScreening link: [insert link]\n\nThank you,\nGoff Welding Hiring Team`,
 'Weld Test Invitation':`Subject: Weld Test Invitation — Goff Welding\n\nHi {{first}},\n\nThank you for your interest in Goff Welding. Based on your application and experience, we would like to invite you to complete a weld test at our facility.\n\nPlease reply with a day and time that works best for you.\n\nLocation: 531 W 100 S #24, Paul, ID 83347\n\nThank you,\nGoff Welding Hiring Team`,
 'Distance Weld Test Invitation':`Subject: Distance Weld Test Invitation — Goff Welding\n\nHi {{first}},\n\nThank you for your interest in Goff Welding. Based on your experience, we would like to coordinate a distance weld test as the next step. Please reply with your availability and current location so we can confirm the best approach.\n\nThank you,\nGoff Welding Hiring Team`,
 'Weld Test Confirmation':`Subject: Weld Test Confirmation — Goff Welding\n\nHi {{first}},\n\nThis confirms your weld test with Goff Welding.\n\nDate/time: [insert date and time]\nLocation: 531 W 100 S #24, Paul, ID 83347\n\nPlease bring any requested information and arrive a few minutes early.\n\nThank you,\nGoff Welding Hiring Team`,
 'Interview Schedule Template':`Subject: Interview Invitation — Goff Welding\n\nHi {{first}},\n\nWe would like to schedule an interview for the {{role}} position. Please reply with the option below that works best for you:\n\n[Option 1]\n[Option 2]\n[Option 3]\n\nThank you,\nGoff Welding Hiring Team`,
 'Interview Confirmation Template':`Subject: Interview Confirmation — Goff Welding\n\nHi {{first}},\n\nThis confirms your interview for the {{role}} position.\n\nDate/time: [insert date and time]\nLocation/format: [insert details]\n\nWe look forward to speaking with you.\n\nThank you,\nGoff Welding Hiring Team`,
 'Reference Check Authorization Form':`Subject: Reference Check Authorization — Goff Welding\n\nHi {{first}},\n\nAs the next step in the hiring process, please complete and return the reference check authorization form and provide professional references we may contact.\n\nThank you,\nGoff Welding Hiring Team`,
 'Reference Check Hiring Criteria':`INTERNAL REFERENCE CHECK CRITERIA\n\nCandidate: {{first}} {{last}}\nRole: {{role}}\n\nVerify:\n[ ] Quality of work\n[ ] Reliability / attendance\n[ ] Safety mindset\n[ ] Ability to take feedback\n[ ] Team fit / professionalism\n[ ] Would the reference rehire this person?\n\nNotes:\n{{summary}}`,
 'Crystal Knows Email Invitation':`Subject: Crystal Knows Invitation — Goff Welding\n\nHi {{first}},\n\nAs part of our hiring process, you will receive a link to complete a Crystal Knows assessment. Please complete it when you receive the invitation so we can continue the review process.\n\nThank you,\nGoff Welding Hiring Team`,
 'Background Check Email Template':`Subject: Background Check Next Step — Goff Welding\n\nHi {{first}},\n\nAs part of our hiring process, you will receive a link to complete and provide consent for the background check. Please complete it as soon as possible so we can continue moving forward.\n\nThank you,\nGoff Welding Hiring Team`,
 'Offer Letter Email Request Template':`INTERNAL OFFER LETTER REQUEST\n\nCandidate: {{first}} {{last}}\nRole: {{role}}\n\nPlease confirm the information needed to prepare the offer letter:\n[ ] Position/title\n[ ] Pay rate / salary\n[ ] Expected schedule and hours\n[ ] Start date target\n[ ] Manager / approving core member\n[ ] Any conditions or notes\n\nDo not send an offer until approved.`,
 'Offer Letter 24 Hour Follow Up':`Subject: Following Up on Your Offer — Goff Welding\n\nHi {{first}},\n\nI wanted to follow up on the offer letter sent for the {{role}} position with Goff Welding. Please let us know if you have questions or if you are ready to move forward with the next steps.\n\nThank you,\nGoff Welding Hiring Team`,
 'BBSI Check In':`Subject: BBSI Onboarding Check-In — Goff Welding\n\nHi {{first}},\n\nWelcome to Goff Welding. We are excited to have you moving forward with us. You should receive onboarding information through BBSI/myBBSI. Please complete the required items as soon as possible so we can confirm your start details.\n\nThank you,\nGoff Welding Hiring Team`,
 'Request for More Relevant Experience Information':`Subject: Quick Follow-Up on Your Goff Welding Application\n\nHi {{first}},\n\nThank you for applying with Goff Welding. Before we determine the next step, could you reply with more detail about your relevant experience, availability, and the type of work you are looking for?\n\nThank you,\nGoff Welding Hiring Team`,
 'Location Inquiry':`Subject: Quick Location Question — Goff Welding\n\nHi {{first}},\n\nThank you for your interest in Goff Welding. Before we move further, could you confirm your current location and whether you are able to commute or relocate for this role?\n\nThank you,\nGoff Welding Hiring Team`,
 'Second Interview Schedule Request Template':`Subject: Second Interview Request — Goff Welding\n\nHi {{first}},\n\nWe would like to schedule a second interview for the {{role}} position. Please reply with availability for the options below.\n\n[Option 1]\n[Option 2]\n[Option 3]\n\nThank you,\nGoff Welding Hiring Team`,
 'Second Interview Schedule Template':`Subject: Second Interview Confirmation — Goff Welding\n\nHi {{first}},\n\nThis confirms your second interview with Goff Welding.\n\nDate/time: [insert date and time]\nLocation/format: [insert details]\n\nThank you,\nGoff Welding Hiring Team`,
 'Position Filled / Keep on File':`Subject: Goff Welding Application Update\n\nHi {{first}},\n\nThank you for your interest in Goff Welding. The current position has been filled, but we would like to keep your information on file for future opportunities that may fit your experience.\n\nThank you,\nGoff Welding Hiring Team`,
 'Good Potential, But Needs More Experience':`Subject: Goff Welding Application Update\n\nHi {{first}},\n\nThank you for your interest in Goff Welding. We see good potential, but at this time we are looking for candidates with more directly relevant experience for this opening. We appreciate your interest and encourage you to continue building your skills.\n\nThank you,\nGoff Welding Hiring Team`,
 'Entry-Level Position Not Currently Available':`Subject: Goff Welding Application Update\n\nHi {{first}},\n\nThank you for your interest in Goff Welding. At the moment, we do not have an entry-level opening available. We appreciate you reaching out and may keep your information on file for future opportunities.\n\nThank you,\nGoff Welding Hiring Team`,
 'General Rejection Letter':`Subject: Goff Welding Application Update\n\nHi {{first}},\n\nThank you for your interest in Goff Welding and for the time you invested in our hiring process. At this time, we have decided to move forward with other candidates.\n\nWe appreciate your interest and wish you the best.\n\nGoff Welding Hiring Team`,
 'Rejection After Interview or Weld Test':`Subject: Goff Welding Application Update\n\nHi {{first}},\n\nThank you for taking the time to continue through the Goff Welding hiring process. After review, we have decided not to move forward at this time. We appreciate your effort and wish you the best.\n\nGoff Welding Hiring Team`,
 'Relocation for the Wrong Reasons':`Subject: Goff Welding Application Update\n\nHi {{first}},\n\nThank you for your interest in Goff Welding. After reviewing the location/relocation details, we do not believe this is the right fit at this time. We appreciate your time and interest.\n\nGoff Welding Hiring Team`,
 'Manager Review Packet':`INTERNAL MANAGER REVIEW PACKET\n\nCandidate: {{first}} {{last}}\nRole: {{role}}\nSource: {{source}}\nCurrent stage: {{stage}}\n\nRole fit:\n{{roleFit}}\n\nSummary:\n{{summary}}\n\nConcerns to resolve:\n{{concerns}}\n\nDecision needed:\n[ ] Move forward\n[ ] Schedule second interview\n[ ] Request more information\n[ ] Keep warm\n[ ] Not selected`,
 'Offer Letter SOP Packet':`OFFER LETTER SOP PACKET\n\nCandidate: {{first}} {{last}}\nRole: {{role}}\n\nBuilt from Goff's Create Offer Letter SOP.\n\nSteps:\n1. Locate offer letter template in Google Docs template gallery.\n2. Review offer letter request from core member.\n3. Fill in verified candidate, position, pay, schedule, and start-date information.\n4. Confirm hours fall between 6:00 AM and 6:00 PM where applicable.\n5. Assign to requesting core member and one additional core member.\n6. Save as PDF.\n7. Route through DocHub for signature fields and owners.\n8. Send approved offer letter.\n\nMissing before build/send:\n[ ] Pay / salary\n[ ] Start date\n[ ] Schedule/hours\n[ ] Approving core members\n[ ] Conditions/notes`,
 'Pre-Employment Clearance Checklist':`PRE-EMPLOYMENT CLEARANCE CHECKLIST\n\nCandidate: {{first}} {{last}}\nRole: {{role}}\n\nGoff BBSI ATS guardrail:\nOffer Accepted = NOT cleared.\nOnboarding = fully cleared.\n\nRequired before BBSI onboarding:\n[ ] Drug screen scheduled and passed\n[ ] Background check cleared or marked N/A\n[ ] Start date confirmed\n[ ] Notes added for any delay/issue\n\nDo not move to BBSI onboarding until complete.`,
 'Welcome / First Day Coordination':`INTERNAL FIRST DAY COORDINATION\n\nCandidate: {{first}} {{last}}\nRole: {{role}}\n\nConfirm:\n[ ] First day scheduled\n[ ] Onboarding documents complete\n[ ] Manager notified\n[ ] New hire checklist ready\n[ ] Safety orientation plan ready`,
 'Onboarding Handoff Summary':`ONBOARDING HANDOFF SUMMARY\n\nCandidate: {{first}} {{last}}\nRole: {{role}}\n\nRecruiting complete. Move to new-hire onboarding workflow and make sure employee-facing materials are ready.`
};

// Job copy fields. Keep public-facing details conservative until Goff confirms
// exact pay, benefits, schedules, and eligibility language. The careers page
// renders all fields verbatim.

const CAREERS_URL = window.location.hostname === 'portal.goffwelding.com' ? 'https://portal.goffwelding.com/careers' : `${window.location.origin}/goff-recruiting/?view=career`;
const INTAKE_SOURCES = [
  { id:'Website', label:'Website / direct careers page', chip:'green', rule:'Applicant submits the Goff careers form directly.' },
  { id:'Indeed', label:'Indeed applicant', chip:'blue', rule:'Send the Goff application link, then work them from Goff once they apply.' },
  { id:'Walk-in', label:'Walk-in / front desk', chip:'amber', rule:'Have them scan the QR or text themselves the Goff application link before they leave.' },
  { id:'Phone', label:'Phone call', chip:'violet', rule:'Text or email the application link while they are on the phone.' },
  { id:'Referral', label:'Referral', chip:'green', rule:'Send the same link so referral candidates enter the same queue.' },
  { id:'Social / email', label:'Social / email lead', chip:'blue', rule:'Reply with the application link instead of collecting scattered details in messages.' },
  { id:'Manual fallback', label:'Manual fallback', chip:'dark', rule:'Quick-add only when the candidate cannot complete the application path.' },
];
const APPLICATION_LINK_TEMPLATES = {
  'Indeed': {
    title:'Indeed applicant follow-up',
    text:`Hi {{name}}, thanks for your interest in Goff Welding. To keep everyone in the same hiring process, please complete our short Goff application here:\n\n{{link}}\n\nOnce that is submitted, our hiring team can review your information and follow up on the next step.`
  },
  'Walk-in': {
    title:'Walk-in / QR script',
    text:`Thanks for stopping by Goff Welding. Before you leave, please scan this QR code or open this link and complete the application so your information goes straight into our hiring queue:\n\n{{link}}\n\nIf you are applying for a welder or fitter role, include your experience and availability for a weld test.`
  },
  'Phone': {
    title:'Phone call text',
    text:`Thanks for calling Goff Welding. Here is the application link we use for all applicants so the hiring team has the right information in one place:\n\n{{link}}\n\nPlease fill it out today and we will review it from there.`
  },
  'Referral': {
    title:'Referral candidate message',
    text:`You were referred to Goff Welding. Please complete our short application here so we can get you into the same hiring process as everyone else:\n\n{{link}}\n\nAdd the person who referred you in the notes if helpful.`
  },
  'Social / email': {
    title:'Social/email reply',
    text:`Thanks for reaching out about Goff Welding. The fastest way to get in front of the hiring team is to complete the application here:\n\n{{link}}\n\nOnce it is in, we can review your background and follow up if there is a fit.`
  }
};

const jobs = [
 {id:'welder', title:'Sanitary Stainless Steel Welder / Fabricator', type:'Full-time', path:'Welder path',
  summary:'Build high-stakes food and dairy stainless work the way it should be done — clean welds, tight tolerances, safe shop. Sanitary experience preferred; we will test on day one.',
  payRange:'$25–$32/hr DOE', schedule:'Mon–Fri, 6:00 AM–2:30 PM (some Saturdays as needed)', location:'On-site • Paul, ID (no remote)',
  perks:['Steady shop work', 'Training and growth path', 'Benefits/details confirmed during hiring', 'Local Paul, Idaho team'],
  certifications:'Welding cert or strong sanitary stainless portfolio. AWS or equivalent a plus.',
  roleFit:'Craftsmanship, stainless experience, blueprint reading, safe work habits, ability to pass weld test, pride in quality.'},
 {id:'fitter', title:'Sanitary Stainless Steel Fitter', type:'Full-time', path:'Welder path',
  summary:'Fit-up, layout, and teamwork on sanitary stainless projects. We test fit-up early so you know fast whether this is your shop.',
  payRange:'$22–$28/hr DOE', schedule:'Mon–Fri, 6:00 AM–2:30 PM', location:'On-site • Paul, ID',
  perks:['Steady shop work', 'Training and growth path', 'Benefits/details confirmed during hiring'],
  certifications:'Layout/fit-up experience on stainless or structural. Blueprint reading required.',
  roleFit:'Layout, fit-up, accuracy, teamwork, field awareness, willingness to follow Goff standards.'},
 {id:'helper', title:'Shop Helper / Entry Level', type:'Full-time / Part-time', path:'Other path',
  summary:'Entry path for reliable, teachable people with a strong work ethic and safety mindset. We hire for attitude and build the skill on the floor.',
  payRange:'$17–$20/hr', schedule:'Mon–Fri, 6:00 AM–2:30 PM', location:'On-site • Paul, ID',
  perks:['Entry path with hands-on training', 'Steady schedule', 'Benefits/details confirmed during hiring'],
  certifications:'None required. Reliability and willingness to learn matter most.',
  roleFit:'Reliability, teachability, safety, willingness to start with fundamentals and build skill.'},
 {id:'foreman', title:'Foreman / Project Lead', type:'Full-time', path:'Other path',
  summary:'Run crews, own jobs end-to-end, and keep customers in the loop. Second interview and manager review required because this seat carries weight.',
  payRange:'$30–$40/hr DOE + project bonuses', schedule:'Mon–Fri, day shift; occasional travel for installs', location:'On-site • Paul, ID + project sites',
  perks:['Leadership seat with job ownership', 'Growth path', 'Compensation/details confirmed during hiring', 'Local Paul, Idaho team'],
  certifications:'Prior crew leadership in fabrication or industrial trades. Stainless background preferred.',
  roleFit:'Job ownership, crew productivity, communication, problem solving, quality control, safety leadership.'},
 {id:'inventory', title:'Inventory Control Specialist', type:'Full-time', path:'Other path',
  summary:'Be the person who keeps materials moving and the shop honest. Accuracy and clean handoffs save us money — and your work is visible every day.',
  payRange:'$20–$26/hr DOE', schedule:'Mon–Fri, day shift', location:'On-site • Paul, ID',
  perks:['Steady operational role', 'Organized shop environment', 'Benefits/details confirmed during hiring'],
  certifications:'Warehouse / inventory experience. Comfortable with spreadsheets and barcode systems.',
  roleFit:'Accuracy guardian, material gatekeeper, organized warehouse steward, strong follow-through.'},
 {id:'procurement', title:'Procurement Manager', type:'Full-time', path:'Other path',
  summary:'Own vendor relationships, material cost, and the flow of metal into the shop. The job pays its salary when you negotiate well and prevent shortages.',
  payRange:'$60K–$80K DOE', schedule:'Mon–Fri, day shift', location:'On-site • Paul, ID',
  perks:['High-impact purchasing role', 'Growth path', 'Compensation/details confirmed during hiring'],
  certifications:'Procurement or buyer experience in fabrication, manufacturing, or industrial trades.',
  roleFit:'Material strategist, cost controller, vendor communication, job-flow enabler.'}
];

// ── Admin-managed open positions ───────────────────────────────────────────
// `jobs` above is the immutable seed/fallback. `positions` is the editable
// runtime list (server = source of truth, localStorage = cache). Public reads
// (careers cards, dropdowns, apply) use openJobs()/jobById(); the admin
// Positions screen edits the full list.
function loadJobs(){
  try{
    const saved = JSON.parse(safeGet('goffOpenPositionsV1') || 'null');
    if(Array.isArray(saved) && saved.length) return saved.map(normalizeJob);
  }catch(_){}
  return jobs.map(j => normalizeJob(Object.assign({}, j)));
}
function normalizeJob(j){
  j.perks = Array.isArray(j.perks) ? j.perks : [];
  j.status = j.status === 'closed' ? 'closed' : 'open';
  return j;
}
let positions = loadJobs();
function saveJobs(list){
  positions = list.map(normalizeJob);
  safeSet('goffOpenPositionsV1', JSON.stringify(positions));
  pushPositions();
}
function openJobs(){ return positions.filter(p => p.status !== 'closed'); }
function jobById(id){ return positions.find(p => p.id === id) || null; }
function upsertJob(job){
  const i = positions.findIndex(p => p.id === job.id);
  const next = positions.slice();
  if(i >= 0) next[i] = job; else next.push(job);
  saveJobs(next);
}
function deleteJob(id){ saveJobs(positions.filter(p => p.id !== id)); }
function newJobId(title){
  const base = (title || 'role').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,32) || 'role';
  let id = base, n = 2;
  while(positions.some(p => p.id === id)){ id = base + '-' + n; n++; }
  return id;
}

let seed = [];

const DEMO_CANDIDATES = [
 {id:1, first:'Tyler', last:'Rasmussen', role:jobs[0].title, source:'Indeed', path:'Welder path', stage:'Weld test invitation', owner:'Candidate', due:'Today', priority:'Hot', email:'tyler@example.com', phone:'208-555-0198', location:'Twin Falls, ID', stageUpdatedAt:daysAgoISO(4), summary:'Demo candidate — use only for sample walkthroughs.', concerns:'Demo only.', evidence:{phone:'Not needed yet', weld:'Needs scheduling', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{}, timeline:['Demo record']},
 {id:2, first:'Caleb', last:'Miller', role:jobs[3].title, source:'Indeed', path:'Other path', stage:'Manager review packet', owner:'Hiring Manager', due:'1 day overdue', priority:'Hot', email:'caleb@example.com', phone:'208-555-0132', location:'Pocatello, ID', stageUpdatedAt:daysAgoISO(2), summary:'Demo candidate — use only for sample walkthroughs.', concerns:'Demo only.', evidence:{phone:'Complete', weld:'N/A', interview:'Complete', references:'Waiting', crystal:'Sent', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{}, timeline:['Demo record']}
];

function normalizeCandidate(x){
  x.evidence ||= {phone:'Not started', weld:x.path==='Welder path'?'Not started':'N/A', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'};
  x.clearance ||= {drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'};
  x.offer = Object.assign({date:new Date().toISOString().slice(0,10), pay:'', startDate:'', schedule:'', supervisor:'', employmentType:'Full-Time', minHours:'40', approvers:'', coreMember1:'', coreMember2:'', validityDays:'30', notes:''}, x.offer || {});
  if(!STAGE[x.stage]) x.stage='Application received';
  x.stageUpdatedAt ||= nowISO();
  x.notes = Array.isArray(x.notes) ? x.notes : [];
  x.pinned = x.pinned === true;
  x.emailedStages = Array.isArray(x.emailedStages) ? x.emailedStages : [];
  return x;
}
// "Waiting on: Candidate" is only true AFTER the stage's email actually went
// out. Until then the ball is in the recruiter's court — the hero shows
// "You — send the email" and makes the email button the primary action.
function stageEmailPending(x){
  const m = STAGE[x.stage];
  return !!(m && m.owner === 'Candidate' && !(x.emailedStages || []).includes(x.stage));
}

const memoryStore = {};
function safeGet(key){ try { return window.localStorage.getItem(key); } catch(_) { return memoryStore[key] || null; } }
function safeSet(key, value){ try { window.localStorage.setItem(key, value); } catch(_) { memoryStore[key] = String(value); } }
function safeJSON(key, fallback){ try { return JSON.parse(safeGet(key) || 'null') || fallback; } catch(_) { return fallback; } }
let candidates = (safeJSON('goffCandidatesV2', null) || safeJSON('goffCandidates', null) || seed).map(normalizeCandidate);
let selectedId = candidates[0]?.id || 1;
// Restore the open candidate from the URL on a refresh. pullCandidates() keeps
// this id if that candidate exists in the live queue, so the profile reopens.
(function(){ const idp = new URLSearchParams(window.location.search).get('id'); if(idp && !isNaN(Number(idp))) selectedId = Number(idp); })();

// --- Server sync (Neon via /api/goff-recruiting/candidates) ---------------
// The server is the source of truth so Quinton's pipeline is shared across
// devices and website applications appear automatically. localStorage stays
// as the offline cache. The public careers view never touches the API.
let syncTimer = null;
let syncPaused = false;
function pushCandidates(){
  if(syncPaused) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    try{
      const res = await fetch('/api/goff-recruiting/candidates', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ candidates })
      });
      if(!res.ok) throw new Error('status ' + res.status);
    }catch(err){
      console.warn('[sync] push failed — changes are saved on this device only:', err);
      showToast('Cloud sync failed — saved locally');
    }
  }, 800);
}
async function pullCandidates(announce){
  // Skip a pull while a local push is pending — never clobber unsent edits.
  if(syncTimer) return;
  const res = await fetch('/api/goff-recruiting/candidates');
  if(!res.ok) throw new Error('status ' + res.status);
  const data = await res.json();
  const remote = Array.isArray(data.candidates) ? data.candidates : [];
  if(!remote.length){
    // Server is source of truth. If the live queue is empty, keep it empty — do
    // not re-seed demo/localStorage candidates into Quinton's real pipeline.
    candidates = [];
    selectedId = null;
    safeSet('goffCandidatesV2', JSON.stringify(candidates));
    render();
    return;
  }
  const knownIds = new Set(candidates.map(x => x.id));
  const fresh = remote.filter(x => !knownIds.has(Number(x.id)));
  syncPaused = true;
  candidates = remote.map(normalizeCandidate);
  if(!candidates.find(x => x.id === selectedId)) selectedId = candidates[0]?.id || 1;
  safeSet('goffCandidatesV2', JSON.stringify(candidates));
  syncPaused = false;
  render();
  if(announce && fresh.length){
    const f = fresh[0];
    showToast(fresh.length === 1
      ? `🔔 New application: ${f.first} ${f.last} — ${f.role}`
      : `🔔 ${fresh.length} new candidates on the board`);
  }
}
let currentUser = null;
async function loadCurrentUser(){
  try{
    const res = await fetch('/api/goff-portal/me');
    if(!res.ok) return;
    const data = await res.json();
    currentUser = data.user || null;
    if(currentUser) render();
  }catch(_){ /* shared login or offline: stays null */ }
}
async function initCandidateSync(){
  if(view === 'career' || view === 'thanks' || view === 'apply') return;
  try{ await pullCandidates(false); }
  catch(err){ console.warn('[sync] load failed — using local data:', err); }
  // Live board: refresh every 45s while the tab is visible, so new website
  // applications appear without a reload.
  setInterval(() => {
    if(typeof document !== 'undefined' && document.hidden) return;
    if(view === 'career' || view === 'thanks' || view === 'apply') return;
    pullCandidates(true).catch(()=>{});
  }, 45000);
}
// Hosts that must only ever show the public careers experience — never the
// recruiting admin, regardless of URL tricks.
const PUBLIC_CAREERS_HOSTS = ['goff.stoke-ai.com', 'goff-stoke-ai.vercel.app', 'careers.goffwelding.com'];
function isPublicCareersHost(){ return PUBLIC_CAREERS_HOSTS.includes(window.location.hostname.toLowerCase()); }
function publicSafeView(v){ return ['career','apply','thanks'].includes(v) ? v : 'career'; }
function initialRecruitingView(){
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get('view');
  if(isPublicCareersHost()) return publicSafeView(explicit || 'career');
  if(explicit) return explicit;
  if(path.includes('/careers') || path.includes('/apply')) return 'career';
  return 'dashboard';
}
let view = initialRecruitingView();
let selectedStage = 'Interview completed';
// Which inline editor is open on the candidate page: 'stage' | 'role' | null.
// Corrections edit in place (a select swaps in where the value is shown)
// instead of a modal. Cleared automatically once a change is made.
let inlineEdit = null;
function save(){ safeSet('goffCandidatesV2', JSON.stringify(candidates)); pushCandidates(); }
function c(){ return candidates.find(x=>x.id===selectedId) || candidates[0]; }
function parseSharedQueue(){ try { return JSON.parse(safeGet('goffOnboardingQueueV1') || '[]'); } catch(_) { return []; } }
function saveSharedQueue(list){ safeSet('goffOnboardingQueueV1', JSON.stringify(list)); }
function formatStartDateForQueue(x){
  const raw = x.offer?.startDate || '';
  if(!raw) return 'Pending';
  const d = new Date(`${raw}T12:00:00`);
  if(Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, { month:'short', day:'numeric' });
}
function onboardingRecordForCandidate(x){
  return {
    id: `candidate-${x.id}`,
    candidateId: x.id,
    name: `${x.first} ${x.last}`.trim(),
    firstName: x.first,
    role: x.role,
    email: x.email || '',
    phone: x.phone || '',
    supervisor: x.offer?.supervisor || 'Supervisor to confirm',
    start: formatStartDateForQueue(x),
    startDate: x.offer?.startDate || '',
    stage: 'BBSI invite + training path',
    status: 'Ready for onboarding',
    progress: 28,
    blocked: 'BBSI/myBBSI invite and completion still need admin confirmation',
    next: 'Send welcome link, confirm myBBSI invite, then start training path',
    source: 'Recruiting handoff',
    movedAt: nowISO()
  };
}
function upsertOnboardingRecord(x){
  const record = onboardingRecordForCandidate(x);
  const queue = parseSharedQueue();
  const idx = queue.findIndex(item => item.id === record.id || item.candidateId === x.id);
  if(idx >= 0) queue[idx] = Object.assign({}, queue[idx], record);
  else queue.unshift(record);
  saveSharedQueue(queue);
  // Also create the real employee record so the onboarding ops board sees the
  // handoff on any device, not just this browser.
  fetch('/api/goff-portal/employees', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ first: x.first, last: x.last, email: x.email, phone: x.phone,
      role: x.role, supervisor: x.offer?.supervisor || '', startDate: x.offer?.startDate || '' })
  }).catch(err => console.warn('[handoff] employee record create failed:', err));
  return record;
}
function alreadyMovedToOnboarding(x){ return parseSharedQueue().some(item => item.id === `candidate-${x.id}` || item.candidateId === x.id); }
async function signOut(){
  try { await fetch('/api/goff-portal/logout', { method:'POST' }); } catch(_){}
  window.location.href = '/goff-recruiting/login';
}

// Short relative-time formatter for activity feeds and note timestamps.
function formatRelativeShort(iso){
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return `${Math.floor(day / 30)}mo ago`;
}

// Clipboard helper with a small toast confirmation. Browsers without
// navigator.clipboard fall back silently.
function copyToClipboard(text){
  try { navigator.clipboard.writeText(text); } catch(_){}
  showToast(`Copied: ${text}`);
}
function showToast(msg){
  const old = document.getElementById('app-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'app-toast';
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

// Recruiter note + star/pin actions, scoped to the currently-selected
// candidate.
function addNote(){
  const x = c();
  const input = document.getElementById('noteInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  // During phone-screen stages the notes panel IS the call-capture surface:
  // prefix the note, tick the evidence, and clear the screening concern.
  const phone = isPhoneScreenStage(x.stage);
  x.notes = x.notes || [];
  x.notes.push({ id: Date.now(), author: (currentUser && currentUser.name) || 'Recruiter', text: phone ? `Phone screen: ${text}` : text, createdAt: nowISO() });
  x.timeline.push(phone ? `Phone screen notes saved: ${text.slice(0, 70)}${text.length > 70 ? '…' : ''}` : `Note: ${text.slice(0, 80)}${text.length > 80 ? '…' : ''}`);
  if (phone) {
    x.evidence = x.evidence || {};
    x.evidence.phone = 'Complete';
    clearScreeningConcern(x);
  }
  save();
  render();
  if (phone) showToast('Phone screen notes saved — marked complete');
}
function togglePin(id){
  const x = candidates.find(item => item.id === id) || c();
  x.pinned = !x.pinned;
  x.timeline.push(x.pinned ? 'Pinned ★' : 'Unpinned');
  save();
  render();
}

// Activity feed — most-recently-changed active candidates.
function latestActivityTime(x){
  let max = x.stageUpdatedAt;
  if (x.notes && x.notes.length){
    for (const n of x.notes){
      if (!max || new Date(n.createdAt) > new Date(max)) max = n.createdAt;
    }
  }
  return max;
}
function latestAction(x){
  if (x.notes && x.notes.length){
    const lastNote = x.notes[x.notes.length - 1];
    if (!x.stageUpdatedAt || new Date(lastNote.createdAt) >= new Date(x.stageUpdatedAt)){
      return `Note: ${lastNote.text.slice(0, 72)}${lastNote.text.length > 72 ? '…' : ''}`;
    }
  }
  const last = x.timeline && x.timeline.length ? x.timeline[x.timeline.length - 1] : null;
  return last || `Moved to ${x.stage}`;
}
function recentActivityPanel(){
  const ranked = candidates
    .filter(isActive)
    .map(x => ({ x, ts: latestActivityTime(x), action: latestAction(x) }))
    .filter(r => r.ts)
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 6);
  if (!ranked.length) return '';
  return `<section class="panel"><div class="section-head"><div><div class="eyebrow">Recent activity</div><h3>What changed lately.</h3></div></div>
    <div class="activity-list">${ranked.map(r => `<button class="activity-row" onclick="selectedId=${r.x.id};view='candidate';render()">
      <div class="activity-row-id"><strong>${r.x.pinned ? '★ ' : ''}${esc(r.x.first)} ${esc(r.x.last)}</strong><small>${esc(r.x.stage)}</small></div>
      <div class="activity-row-action">${esc(r.action)}</div>
      <div class="activity-row-time">${esc(formatRelativeShort(r.ts))}</div>
    </button>`).join('')}</div>
  </section>`;
}

// Candidate list filters. Defaults to "active only" because the hiring lead
// almost always wants the live pipeline, not parked / rejected candidates.
let candidateFilters = { search:'', path:'all', group:'active', owner:'all', pinned:false, stageGroup:null, stageGroupLabel:'', source:null, sourceLabel:'' };
function setCandidateFilter(key, value){ candidateFilters[key] = value; candidateFilters.stageGroup = null; candidateFilters.stageGroupLabel = ''; candidateFilters.source = null; candidateFilters.sourceLabel = ''; render(); }
function filterCandidatesByBucket(bucketId){
  const b = FUNNEL_BUCKETS.find(x => x.id === bucketId);
  if(!b) return;
  candidateFilters.stageGroup = b.stages;
  candidateFilters.stageGroupLabel = b.label;
  candidateFilters.group = 'all';
  view = 'candidates';
  render();
}
function filterCandidatesBySource(source){
  candidateFilters.source = source;
  candidateFilters.sourceLabel = source;
  candidateFilters.group = 'all';
  view = 'candidates';
  render();
}
function clearSourceFilter(){ candidateFilters.source = null; candidateFilters.sourceLabel = ''; render(); }
function clearStageGroupFilter(){ candidateFilters.stageGroup = null; candidateFilters.stageGroupLabel = ''; render(); }
function toggleCandidateFilter(key){ candidateFilters[key] = !candidateFilters[key]; render(); }
function updateCandidateSearch(value){
  candidateFilters.search = value;
  const target = document.getElementById('candidates-results');
  if(target) target.innerHTML = renderCandidatesList(applyCandidateFilters(candidates));
}
function applyCandidateFilters(list){
  const f = candidateFilters;
  const filtered = list.filter(x => {
    if(f.group === 'active' && !isActive(x)) return false;
    if(f.group === 'disposition' && isActive(x)) return false;
    if(f.path === 'welder' && !isWelderPath(x)) return false;
    if(f.path === 'other' && isWelderPath(x)) return false;
    if(f.owner !== 'all' && x.owner !== f.owner) return false;
    if(f.pinned && !x.pinned) return false;
    if(f.stageGroup && !f.stageGroup.includes(x.stage)) return false;
    if(f.source && !sourceMatchesCandidate(f.source, x)) return false;
    if(f.search){
      const s = f.search.toLowerCase();
      const hay = `${x.first} ${x.last} ${x.role} ${x.location || ''} ${x.email || ''} ${x.source || ''} ${x.stage}`.toLowerCase();
      if(!hay.includes(s)) return false;
    }
    return true;
  });
  // Pinned candidates always float to the top of any list view.
  return filtered.slice().sort((a, b) => Number(b.pinned) - Number(a.pinned));
}
function chipBtn(filterKey, value, label){
  const active = candidateFilters[filterKey] === value;
  return `<button class="filter-chip ${active ? 'active' : ''}" onclick="setCandidateFilter('${filterKey}','${esc(value)}')">${esc(label)}</button>`;
}
function renderCandidatesList(list){
  if(!list.length) return `<p class="muted" style="padding:16px 0">No candidates match these filters. Try clearing the search box or switching the Status chip to <strong>All</strong>.</p>`;
  return `<div class="queue">${list.map(card).join('')}</div>`;
}
function candidateList(){
  const filtered = applyCandidateFilters(candidates);
  const totalActive = candidates.filter(isActive).length;
  const stageBanner = candidateFilters.stageGroup ? `<div class="notice" style="margin-bottom:12px"><strong>Filtered: ${esc(candidateFilters.stageGroupLabel)} stage</strong> — showing ${filtered.length} candidate${filtered.length===1?'':'s'} currently there. <button class="btn ghost" style="margin-left:8px" onclick="clearStageGroupFilter()">Clear filter</button></div>` : '';
  const sourceBanner = candidateFilters.source ? `<div class="notice" style="margin-bottom:12px"><strong>Filtered: ${esc(candidateFilters.sourceLabel)} source</strong> — showing ${filtered.length} candidate${filtered.length===1?'':'s'} from that intake source. <button class="btn ghost" style="margin-left:8px" onclick="clearSourceFilter()">Clear source</button></div>` : '';
  return `${head('Candidates', `${filtered.length} shown · ${totalActive} active in pipeline · ${candidates.length} all-time`, `<button class="btn primary" onclick="view='intake';render()">Add candidate</button>`)}
  ${stageBanner}${sourceBanner}
  <section class="panel">
    <div class="filters">
      <input type="search" placeholder="Search name, role, location, stage" value="${esc(candidateFilters.search)}" oninput="updateCandidateSearch(this.value)" class="filter-search" autocomplete="off">
      <div class="filter-group">
        <span class="filter-label">Path</span>
        ${chipBtn('path','all','All')}
        ${chipBtn('path','welder','Welder')}
        ${chipBtn('path','other','Other')}
      </div>
      <div class="filter-group">
        <span class="filter-label">Status</span>
        ${chipBtn('group','active','Active')}
        ${chipBtn('group','disposition','Parked / rejected')}
        ${chipBtn('group','all','All')}
      </div>
      <div class="filter-group">
        <span class="filter-label">Waiting on</span>
        ${chipBtn('owner','all','All')}
        ${chipBtn('owner','Quinton','Quinton')}
        ${chipBtn('owner','Candidate','Candidate')}
        ${chipBtn('owner','Hiring Manager','Hiring Manager')}
        ${chipBtn('owner','Admin','Admin')}
      </div>
      <div class="filter-group">
        <span class="filter-label">Spotlight</span>
        <button class="filter-chip ${candidateFilters.pinned ? 'active' : ''}" onclick="toggleCandidateFilter('pinned')">★ Pinned only</button>
      </div>
    </div>
  </section>
  <section class="panel">
    <div id="candidates-results">${renderCandidatesList(filtered)}</div>
  </section>`;
}
function stageMeta(stage){ return STAGE[stage] || WORKFLOW_STAGES[0]; }
function jobFor(role){ const list = positions.length ? positions : jobs; return list.find(j => role && role.toLowerCase().includes(j.title.toLowerCase().split(' ')[0])) || list.find(j => role && j.title===role) || list[0] || jobs[0]; }
function roleFit(x){ return jobFor(x.role).roleFit; }
function esc(s){ return String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
// Display-layer Title Case for stage names and headings. Stage strings are
// data (workflow keys, stored on candidates) so they stay lowercase in the
// model; this formats them for display only. Small connector words stay
// lowercase per standard title-case rules ("Transition to Onboarding", not
// "Transition To Onboarding").
const TC_SMALL = new Set(['a','an','and','as','at','but','by','for','in','of','on','or','the','to','via','vs','with']);
function titleCase(s){
  const words = String(s||'').split(' ');
  return words.map((w,i)=>{
    if(!w) return w;
    if(i>0 && i<words.length-1 && TC_SMALL.has(w.toLowerCase())) return w.toLowerCase();
    return w[0].toUpperCase() + w.slice(1);
  }).join(' ');
}
function tag(v){ if(v==='Hot'||String(v).includes('overdue')) return 'red'; if(String(v).includes('Today')||String(v).includes('Tomorrow')||String(v).includes('24')) return 'amber'; if(String(v).includes('Website')) return 'green'; if(String(v).includes('Indeed')) return 'blue'; return 'violet'; }

// --- Review feedback widget (same loop as the employee portal) ---
let feedbackOpen = false;
function feedbackContext(){
  if(view === 'candidate'){ const x = c(); return x ? `Candidate: ${x.first} ${x.last} (${x.stage})` : ''; }
  if(view === 'offer'){ const x = c(); return x ? `Offer workflow: ${x.first} ${x.last}` : ''; }
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
      body: JSON.stringify({ author, comment, section: 'recruiting:' + view, context: feedbackContext(), url: window.location.href })
    });
    if(!res.ok) throw new Error('bad status '+res.status);
    feedbackOpen = false; render();
    showToast('Comment sent to Jeff ✓');
  }catch(_){
    if(btn){ btn.disabled = false; btn.textContent = 'Send comment'; }
    showToast('Could not send — try again');
  }
}
function feedbackWidget(){
  const ctx = feedbackContext();
  if(!feedbackOpen) return `<button class="fb-fab" onclick="toggleFeedback()" title="Leave a review comment">📝 Feedback</button>`;
  return `<div class="fb-panel"><div class="fb-head"><b>Review comment</b><button class="fb-x" onclick="toggleFeedback()">✕</button></div>
  <p class="fb-where">On: <b>${esc(view)}</b>${ctx?` — ${esc(ctx)}`:''}</p>
  <input id="fb-name" placeholder="Your name" value="${esc(safeGet('goffFeedbackName') || '')}" />
  <textarea id="fb-text" placeholder="What should change here? Wording, order, missing info — anything."></textarea>
  <button id="fb-send" onclick="sendFeedback()">Send comment</button>
  <small>Goes straight to Jeff with this exact location attached.</small></div>`;
}

// Mirror the current view (and open candidate) into the URL so a browser
// refresh reopens the same screen instead of dumping back to the dashboard.
// replaceState (not pushState) keeps the back button clean — every render
// would otherwise stack a history entry.
function syncUrl(){
  try{
    if(isPublicCareersHost()) return; // public careers keeps its own clean URL
    const params = new URLSearchParams(window.location.search);
    params.set('view', view);
    if(view==='candidate'||view==='offer'){ const x=c(); if(x) params.set('id', x.id); else params.delete('id'); }
    else { params.delete('id'); }
    const qs = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?'+qs : ''));
  }catch(_){}
}
function render(){
  syncUrl();
  if(view==='career'||view==='thanks'||view==='apply'){
    document.getElementById('app').innerHTML = `${page()}<div id="modal" class="modal"></div>${feedbackWidget()}`;
    return;
  }
  document.getElementById('app').innerHTML = `<div class="shell"><aside class="sidebar"><div class="brand"><img src="/goff-welding-logo.png" alt="Goff Welding" class="brand-logo"><p class="brand-subtitle">Recruiting Platform</p></div><nav class="nav">${nav('dashboard','Dashboard')}${nav('candidates','Candidates')}${nav('positions','Open Positions')}${nav('intake','Add candidate')}${nav('manager','Manager review')}${nav('offers','Offer workflow')}${nav('workflow','Full workflow')}${nav('templates','Templates')}${nav('integrations','Setup &amp; status')}${nav('how-it-works','How it works')}</nav><div class="side-card portal-links"><strong>One portal — other areas</strong><a href="/goff-employee/?section=start">Employee onboarding portal</a><a href="/goff-employee/?section=ops">Onboarding admin control</a><a href="/goff-employee/?section=admin">Austin review mode</a></div><div class="side-card"><strong>Today’s focus</strong><p>Keep qualified candidates moving through Goff’s actual recruiting steps: screen, weld test, interview, references, offer, clearance hold, and BBSI handoff.</p></div>${currentUser ? `<div class="signed-as"><span>Signed in as</span><b>${esc(currentUser.name)}</b><em>${esc((currentUser.roles||[]).join(' · ') || 'recruiter')}</em></div>` : `<div class="signed-as shared"><span>Shared login</span><b>goffadmin</b><em>ask Jeff for a personal login</em></div>`}<button class="sidebar-signout" onclick="signOut()">Sign out</button></aside><main class="content">${page()}</main></div><div id="modal" class="modal"></div>${feedbackWidget()}`;
}
function nav(id,label){ return `<button class="${view===id?'active':''}" onclick="view='${id}';render()">${label}</button>`; }
function head(title,sub,button=''){ return `<div class="topbar"><div><div class="eyebrow">Recruiting operations</div><h2>${title}</h2><p>${sub}</p></div>${button}</div>`; }
function emptyPipeline(){ return `${head('No candidates yet','Your pipeline is empty — add your first candidate to get started.','<button class=\"btn primary\" onclick="view=\'intake\';render()">Add candidate</button>')}<section class="panel"><div class="notice"><strong>Nothing here yet.</strong><br>Applications from the careers page land here automatically, or add someone manually with the button above. Once you have a candidate, their profile, manager review, and offer workflow open from the Candidates list.</div></section>`; }
function page(){
  if(isPublicCareersHost()) view = publicSafeView(view);
  // Candidate-detail views need a selected candidate; on an empty pipeline show
  // a friendly empty state instead of crashing.
  if(['candidate','manager','offer'].includes(view) && !c()) return emptyPipeline();
  return ({dashboard,intake,career,apply:applyView,thanks,candidate,candidates:candidateList,positions:positionsView,manager,offer,offers:offersQueue,workflow,templates,integrations,'how-it-works':howItWorks}[view] || dashboard)();
}
function metric(label,value){ return `<div class="metric"><span>${label}</span><b>${value}</b></div>`; }
function dashboard(){
  const austinDecisions = candidates.filter(needsHiringManager);
  const stale = candidates.filter(x => isActive(x) && agingLevel(x)==='stale' && !needsHiringManager(x));
  const aging = candidates.filter(x => isActive(x) && agingLevel(x)==='aging' && !needsHiringManager(x));
  const quintonsQueue = candidates.filter(x => isActive(x) && !needsHiringManager(x) && !stale.includes(x) && !aging.includes(x));

  const welderCandidates = candidates.filter(x => isActive(x) && isWelderPath(x));
  const otherCandidates = candidates.filter(x => isActive(x) && !isWelderPath(x));

  const todaySummary = buildTodaySummary(austinDecisions, stale.length, aging.length);

  return `${head(`Today's hiring snapshot.`, todaySummary, `<button class="btn" onclick="view='intake';render()">Intake links</button><button class="btn primary" onclick="window.open(CAREERS_URL,'_blank','noopener')">Open careers page</button>`)}
  ${austinDecisions.length ? `<section class="panel decisions"><div class="section-head"><div><div class="eyebrow eyebrow-decisions">Decisions needed</div><h3>${austinDecisions.length === 1 ? 'One candidate is waiting on a hiring-lead call.' : `${austinDecisions.length} candidates are waiting on a hiring-lead call.`}</h3></div></div><div class="decision-list">${austinDecisions.map(decisionCard).join('')}</div></section>` : `<section class="panel decisions-empty"><div class="eyebrow eyebrow-decisions">Decisions needed</div><h3>No decisions waiting right now.</h3><p class="muted">The recruiting queue is moving. ${(stale.length+aging.length) ? `${stale.length+aging.length} candidate${(stale.length+aging.length)===1?'':'s'} aging — see below.` : 'Pipeline is clean.'}</p></section>`}

  ${(stale.length || aging.length) ? `<section class="panel aging"><div class="section-head"><div><div class="eyebrow eyebrow-aging">Check before they go cold</div><h3>${stale.length ? `${stale.length} stale${aging.length ? `, ${aging.length} aging` : ''}.` : `${aging.length} aging.`}</h3></div></div><div class="aging-list">${stale.map(c => agingRow(c,'stale')).join('')}${aging.map(c => agingRow(c,'aging')).join('')}</div></section>` : ''}

  <section class="panel funnels"><div class="section-head"><div><div class="eyebrow">Pipeline by path</div><h3>From applied to hired.</h3></div><button class="btn" onclick="view='workflow';render()">View full workflow</button></div>${funnelHTML('Welder path — fabricators &amp; fitters', welderCandidates)}${funnelHTML('Other roles — foreman, inventory, procurement, helper', otherCandidates)}</section>

  <section class="panel"><div class="section-head"><div><div class="eyebrow">In motion</div><h3>${quintonsQueue.length === 1 ? '1 candidate moving normally.' : `${quintonsQueue.length} candidates moving normally.`}</h3></div></div>${quintonsQueue.length ? `<div class="queue">${quintonsQueue.map(card).join('')}</div>` : `<p class="muted">Nothing else in motion. Add a candidate from the Intake screen.</p>`}</section>

  ${recentActivityPanel()}`;
}

function buildTodaySummary(pendingDecisions, staleCount, agingCount){
  const parts = [];
  if(pendingDecisions.length === 0) parts.push('No hiring-lead decisions pending today.');
  else if(pendingDecisions.length === 1) parts.push('1 candidate is waiting on a hiring-lead call.');
  else parts.push(`${pendingDecisions.length} candidates are waiting on a hiring-lead call.`);
  if(staleCount) parts.push(`${staleCount} candidate${staleCount===1?'':'s'} aging past 5 days — check before they go cold.`);
  else if(agingCount) parts.push(`${agingCount} candidate${agingCount===1?'':'s'} drifting — keep an eye on them.`);
  else parts.push('Pipeline is clean — moving normally.');
  return parts.join(' ');
}

function decisionCard(x){
  const actions = decisionActionsForStage(x.stage);
  const ageText = stageAgeText(x);
  return `<article class="decision-card">
    <div class="decision-card-head">
      <div class="decision-card-id"><strong>${esc(x.first)} ${esc(x.last)}</strong><small>${esc(x.role)} · from ${esc(x.source)} · Waiting ${esc(ageText)} on you</small></div>
      <span class="tag red">${esc(x.stage)}</span>
    </div>
    <p class="decision-card-summary">${esc(x.summary)}</p>
    ${realConcern(x) ? `<div class="decision-card-concern"><strong>Concern:</strong> ${esc(realConcern(x))}</div>` : ''}
    <div class="decision-card-actions">
      ${actions.map(a => `<button class="btn ${a.primary?'primary':''}" onclick="selectedId=${x.id};${a.action}">${esc(a.label)}</button>`).join('')}
      <button class="btn ghost" onclick="selectedId=${x.id};view='candidate';render()">Open candidate →</button>
    </div>
  </article>`;
}

let expandedFunnelBucket = null; // { groupLabel, bucketId } or null
let expandedIntakeSource = null;
function toggleIntakeSourceSnapshot(source){
  expandedIntakeSource = expandedIntakeSource === source ? null : source;
  render();
}
function sourceMatchesCandidate(source, c){
  const sourceNeedle = String(source||'').toLowerCase().split(' ')[0];
  return String(c.source||'').toLowerCase().includes(sourceNeedle);
}
function intakeSourceSnapshot(source){
  if(!source) return '';
  const rows = candidates.filter(c => sourceMatchesCandidate(source, c));
  return `<div class="source-snapshot">
    <div class="bucket-snapshot-head"><strong>${esc(source)} — ${rows.length} candidate${rows.length===1?'':'s'} in current queue</strong><button class="btn ghost" onclick="filterCandidatesBySource('${esc(source).replace(/'/g,"\\'")}')">See full list →</button></div>
    ${rows.length ? rows.slice(0,6).map(bucketSnapshotRow).join('') : `<p class="muted" style="padding:8px 0">No candidates are tagged from this source right now. Use the link template or quick-add/import when a lead comes in.</p>`}
    ${rows.length > 6 ? `<p class="muted" style="padding-top:8px">+ ${rows.length - 6} more. Use “See full list” to open the complete filtered queue.</p>` : ''}
  </div>`;
}
function toggleBucketSnapshot(groupLabel, bucketId){
  if(expandedFunnelBucket && expandedFunnelBucket.groupLabel === groupLabel && expandedFunnelBucket.bucketId === bucketId){
    expandedFunnelBucket = null;
  } else {
    expandedFunnelBucket = { groupLabel, bucketId };
  }
  render();
}
function bucketSnapshotRow(x){
  const meta = stageMeta(x.stage);
  return `<div class="bucket-snapshot-row" onclick="selectedId=${x.id};view='candidate';render()">
    <div><strong>${esc(x.first)} ${esc(x.last)}</strong><small>${esc(x.role)}</small></div>
    <div class="bucket-snapshot-stage"><span class="tag dark">${esc(x.stage)}</span><small>Next: ${esc(meta.next || 'human decision')}</small></div>
  </div>`;
}
function funnelHTML(label, list){
  const counts = FUNNEL_BUCKETS.map(b => list.filter(c => bucketForStage(c.stage)?.id === b.id));
  const total = counts.reduce((s, arr) => s + arr.length, 0);
  return `<div class="funnel-group">
    <div class="funnel-label"><span>${label}</span><em>${total} active</em></div>
    <div class="funnel">
      ${FUNNEL_BUCKETS.map((b,i) => `<div class="funnel-stage ${counts[i].length?'has-count':''} ${expandedFunnelBucket && expandedFunnelBucket.groupLabel===label && expandedFunnelBucket.bucketId===b.id?'expanded':''}" onclick="toggleBucketSnapshot('${esc(label)}','${esc(b.id)}')">
        <div class="funnel-stage-count">${counts[i].length}</div>
        <div class="funnel-stage-label">${esc(b.label)}</div>
        <div class="funnel-chips">${counts[i].slice(0,3).map(c => `<span class="funnel-chip" onclick="event.stopPropagation();selectedId=${c.id};view='candidate';render()" title="${esc(c.first+' '+c.last)}">${esc(c.first)}</span>`).join('')}${counts[i].length > 3 ? `<span class="funnel-chip more">+${counts[i].length - 3}</span>` : ''}</div>
      </div>${i < FUNNEL_BUCKETS.length-1 ? '<div class="funnel-arrow" aria-hidden="true">›</div>' : ''}`).join('')}
    </div>
    ${expandedFunnelBucket && expandedFunnelBucket.groupLabel===label ? (() => {
      const b = FUNNEL_BUCKETS.find(fb => fb.id === expandedFunnelBucket.bucketId);
      const rows = list.filter(c => bucketForStage(c.stage)?.id === expandedFunnelBucket.bucketId);
      return `<div class="bucket-snapshot">
        <div class="bucket-snapshot-head"><strong>${esc(b.label)} — ${rows.length} candidate${rows.length===1?'':'s'}</strong><button class="btn ghost" onclick="filterCandidatesByBucket('${esc(b.id)}')">See full list →</button></div>
        ${rows.length ? rows.map(bucketSnapshotRow).join('') : `<p class="muted" style="padding:8px 0">No one is in this stage right now.</p>`}
      </div>`;
    })() : ''}
  </div>`;
}

function agingRow(x, level){
  const meta = stageMeta(x.stage);
  return `<div class="aging-row ${level}" onclick="selectedId=${x.id};view='candidate';render()">
    <div class="aging-row-id"><strong>${esc(x.first)} ${esc(x.last)}</strong><small>${esc(x.role)} · ${esc(x.path)}</small></div>
    <div class="aging-row-stage">${esc(x.stage)}<small>Next: ${esc(meta.next || 'human decision')}</small></div>
    <div class="aging-row-meta"><span class="aging-pill ${level}">${esc(stageAgeText(x))} in stage</span><small>Waiting on ${esc(x.owner)}</small></div>
  </div>`;
}

function workflow(){
  return `${head('Hiring workflow','Reference: every stage in Goff’s hiring process from application to BBSI handoff. Useful when you need to see what a stage means, the template it triggers, and what must happen before the next step.',`<button class="btn" onclick="view='templates';render()">View templates</button>`)}
  <div class="notice"><strong>How to read this:</strong> The recruiter owns most stages; the candidate owns the ones where we are waiting on them; the hiring lead owns Manager review and Offer letter info. Click any stage to see who is currently in it.</div>
  <section class="panel workflow-map">
    <div class="pipeline">${WORKFLOW_STAGES.filter(s => !['Disposition'].includes(s.group)).map(stageTile).join('')}</div>
    ${stageDetailPanel()}
  </section>`;
}
function card(x){ return `<div class="candidate${x.pinned?' pinned':''}" onclick="selectedId=${x.id};view='candidate';render()"><div><strong>${x.pinned?'★ ':''}${esc(x.first)} ${esc(x.last)}</strong><small>${esc(x.role)} • ${esc(x.source)}</small><div class="tags"><span class="tag ${tag(x.priority)}">${esc(x.priority)}</span><span class="tag dark">${esc(x.stage)}</span><span class="tag ${tag(x.due)}">${esc(x.due)}</span><span class="tag">Waiting: ${esc(x.owner)}</span></div></div><span class="pill ${x.priority==='Hot'?'hot':String(x.due).includes('Today')?'today':'wait'}">Open</span></div>`; }
function stageTile(s){ const count=candidates.filter(x=>x.stage===s.id).length; return `<button class="pipe-step ${count?'has-candidate':''} ${selectedStage===s.id?'selected':''}" onclick="selectedStage='${esc(s.id)}';render()"><small>${s.group}</small><b>${s.id}</b><span>${s.template}</span><em>${count} candidate${count===1?'':'s'}</em></button>`; }
function stageDetailPanel(){ const stage=selectedStage || WORKFLOW_STAGES[0].id; const meta=stageMeta(stage); const list=candidates.filter(x=>x.stage===stage); return `<div class="stage-detail"><div class="section-head compact"><div><h3>${esc(stage)}</h3><p class="muted">${list.length ? `${list.length} candidate${list.length===1?'':'s'} currently in this status.` : 'No candidates are currently in this status.'} Next step: ${esc(meta.next || 'human decision / complete')}</p></div><span class="tag dark">${esc(meta.template)}</span></div>${list.length ? `<div class="queue compact">${list.map(card).join('')}</div>` : `<div class="notice"><strong>Empty stage.</strong><br>When someone reaches ${esc(stage)}, they will appear here.</div>`}</div>`; }

function intake(){
  const counts = Object.fromEntries(INTAKE_SOURCES.map(src => [src.id, candidates.filter(c => String(c.source||'').toLowerCase().includes(src.id.toLowerCase().split(' ')[0])).length]));
  return `${head('Recruiting intake flow','Austin’s rule: every applicant source should funnel into one Goff application path first. Quick-add/import remains as a fallback when someone cannot apply through the link.',`<button class="btn brand" onclick="showApplicationLinkDraft('Indeed')">Prepare message</button>`)}
  <section class="panel intake-front-door">
    <div class="section-head"><div><div class="eyebrow">Universal front door</div><h3>One application path for every source.</h3><p class="muted">This screen is not a separate applicant tracker. It is the front door: send every lead to the same Goff application link when possible, then everyone lands in the Candidates queue for review. Use quick-add/import only when you need to preserve a lead that cannot complete the application link yet.</p></div><div class="link-actions"><button class="btn primary" onclick="showApplicationLinkDraft('Indeed')">Prepare message</button><button class="btn" onclick="copyToClipboard(CAREERS_URL)">Copy raw link</button></div></div>
    <div class="intake-explainer"><strong>How to read this:</strong><span>Click a source card for a quick snapshot here. Use “See full list” only when you want the detailed Candidates view.</span><span>“Prepare message” creates a source-specific text/email reply that includes the application link.</span><span>“Copy raw link” only copies the URL. It does not send anything.</span></div>
    <div class="intake-source-grid">${INTAKE_SOURCES.map(src => `<article class="clickable-source-card ${expandedIntakeSource===src.id?'expanded':''}" onclick="toggleIntakeSourceSnapshot('${esc(src.id).replace(/'/g,"\\'")}')"><span class="tag ${src.chip}">${esc(src.id)}</span><strong>${esc(src.label)}</strong><p>${esc(src.rule)}</p><small>${counts[src.id]||0} in current queue · quick view</small></article>`).join('')}</div>
    ${intakeSourceSnapshot(expandedIntakeSource)}
  </section>
  <div class="grid two" style="margin-top:16px">
    <section class="panel"><h3>Send application link</h3><p class="muted">Choose the source and copy the ready-to-send message. This is the v1 replacement for chasing Indeed/API sync first.</p><div class="intake-template-list">${Object.keys(APPLICATION_LINK_TEMPLATES).map(k => `<button class="template-row clickable" onclick="showApplicationLinkDraft('${esc(k).replace(/'/g,"\\'")}')"><b>${esc(APPLICATION_LINK_TEMPLATES[k].title)}</b><span class="tag ${tag(k)}">${esc(k)}</span></button>`).join('')}</div><div class="notice success"><strong>Shop/front-desk version:</strong><br>Print or display the QR to the careers link. Walk-ins scan it before they leave so the application is complete and legible.</div></section>
    <section class="panel"><h3>Manual fallback quick add</h3><p>Use this only when the applicant cannot fill out the link or the recruiter needs to preserve a lead immediately.</p><div class="form"><input id="qaName" placeholder="Candidate name"><input id="qaEmail" placeholder="Email"><input id="qaPhone" placeholder="Phone"><select id="qaRole">${openJobs().map(j=>`<option>${esc(j.title)}</option>`).join('')}</select><select id="qaSource">${INTAKE_SOURCES.map(src=>`<option>${esc(src.id)}</option>`).join('')}</select><button class="btn primary" onclick="quickAdd()">Add fallback lead to Goff queue</button></div></section>
  </div>
  <div class="grid two" style="margin-top:16px">
    <section class="panel"><h3>Indeed CSV import</h3><p>Use CSV only for candidates Goff actually wants to work. Do not recreate Indeed inside Goff — shortlist first, then import.</p><div class="form"><input id="csvFile" type="file" accept=".csv,text/csv" onchange="handleCSVFile(event)"><textarea id="csvPasteBox" class="importbox" placeholder="Or paste Indeed CSV rows here..."></textarea><div class="actions tight"><button class="btn brand" onclick="parseIndeedCSV(document.getElementById('csvPasteBox').value)">Preview CSV import</button><button class="btn" onclick="downloadIndeedSampleCSV()">Download sample CSV</button></div></div></section>
    <section class="panel"><h3>Paste single applicant</h3><p>For copied Indeed candidate text, email notifications, or recruiter notes. Source is still tracked.</p><textarea id="pasteBox" class="importbox" placeholder="Name: Jason Harper\nEmail: jason@example.com\nPhone: 208-555-0188\nSource: Indeed\nRole: Sanitary Stainless Steel Welder / Fabricator\nNotes: 5 years stainless..."></textarea><button class="btn brand" onclick="parseImport()">Parse one candidate</button><div class="notice"><strong>BBSI boundary:</strong> Goff recruiting owns intake through offer/clearance. BBSI starts after offer acceptance and clearance guardrails.</div></section>
  </div>
  <section class="panel" style="margin-top:16px"><h3>Import preview / result</h3><div id="importResult" class="notice">Choose a link template, quick-add a fallback lead, paste one applicant, or preview a CSV import.</div></section>`;
}
function quickAdd(){ let [first,...rest]=(document.getElementById('qaName').value||'New Candidate').split(' '); let role=document.getElementById('qaRole').value; let source=document.getElementById('qaSource').value; let item=normalizeCandidate({id:Date.now(),first,last:rest.join(' ')||'Applicant',email:document.getElementById('qaEmail').value||'unknown@example.com',phone:document.getElementById('qaPhone')?.value||'',role,source,path:role.toLowerCase().includes('welder')||role.toLowerCase().includes('fitter')?'Welder path':'Other path',stage:'Application received',owner:'Quinton',due:'Today',priority:'Normal',location:'',summary:`Fallback intake lead from ${source}. Prefer sending the application link so the candidate can complete the full Goff application path.`,concerns:'',timeline:[`Added through ${source} fallback quick-add`,'Needs official application link or recruiter review']}); candidates.unshift(item); selectedId=item.id; save(); view='candidate'; render(); }
function showApplicationLinkDraft(source='Indeed'){
  const tpl = APPLICATION_LINK_TEMPLATES[source] || APPLICATION_LINK_TEMPLATES['Indeed'];
  const text = tpl.text.replaceAll('{{name}}','there').replaceAll('{{link}}',CAREERS_URL);
  document.getElementById('modal').className='modal open';
  document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>${esc(tpl.title)}</h3><p>This is the message to paste into Indeed, a text, email, or a front-desk script. It includes the application link so the candidate enters the same Goff queue as everyone else.</p><textarea>${esc(text)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn" onclick="copyToClipboard(CAREERS_URL)">Copy raw link</button><button class="btn brand" onclick="copyToClipboard(document.querySelector('.modal-card textarea').value)">Copy message</button></div></div>`;
}
function demoImport(){ view='intake'; render(); document.getElementById('pasteBox').value='Name: Jason Harper\nEmail: jason.harper@example.com\nPhone: 208-555-0188\nSource: Indeed\nRole: Sanitary Stainless Steel Welder/Fabricator\nNotes: 5 years stainless, currently in Idaho Falls, available for weld test next week.'; parseImport(); }
function parseImport(){ let t=document.getElementById('pasteBox').value||''; let email=(t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)||[''])[0]; let phone=(t.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)||[''])[0]; let name=(t.match(/Name:\s*([^\n,]+)/i)||t.match(/^([^,\n]+)/)||['','Imported Candidate'])[1].trim(); let source=(t.match(/Source:\s*([^\n,]+)/i)||['','Indeed'])[1].trim(); let role=(t.match(/Role:\s*([^\n]+)/i)||t.match(/Job(?: Title)?:\s*([^\n]+)/i)||['',jobs[0].title])[1].trim(); let notes=(t.match(/Notes?:\s*([^]+)/i)||['','Imported applicant. System recommends Quinton review and choose first action.'])[1].trim(); let [first,...rest]=name.split(' '); let item=normalizeCandidate({id:Date.now(),first:first||'Imported',last:rest.join(' ')||'Candidate',email:email||'unknown@example.com',phone,role,source,path:role.toLowerCase().includes('welder')?'Welder path':'Other path',stage:'Application received',owner:'Quinton',due:'Today',priority:'Normal',location:'',summary:notes.slice(0,260),concerns:'',timeline:['Parsed from paste/import center','Queued for Quinton review']}); candidates.unshift(item); selectedId=item.id; save(); document.getElementById('importResult').innerHTML=`<strong>Imported:</strong> ${item.first} ${item.last} • ${item.role} • ${item.source}<br><button class="btn primary" onclick="view='candidate';render()">Open candidate</button>`; }
function parseCSV(text){ const rows=[]; let row=[], cell='', inQuotes=false; for(let i=0;i<text.length;i++){ const ch=text[i], next=text[i+1]; if(ch==='"' && inQuotes && next==='"'){ cell+='"'; i++; } else if(ch==='"'){ inQuotes=!inQuotes; } else if(ch===',' && !inQuotes){ row.push(cell); cell=''; } else if((ch==='\n'||ch==='\r') && !inQuotes){ if(ch==='\r' && next==='\n') i++; row.push(cell); if(row.some(v=>String(v).trim())) rows.push(row); row=[]; cell=''; } else cell+=ch; } row.push(cell); if(row.some(v=>String(v).trim())) rows.push(row); return rows; }
function canonicalHeader(h){ return String(h||'').toLowerCase().replace(/[^a-z0-9]+/g,''); }
function pick(row, headers, aliases){ for(const a of aliases){ const i=headers.indexOf(canonicalHeader(a)); if(i>=0 && row[i]) return String(row[i]).trim(); } return ''; }
function candidateFromCSVRow(row, headers, idx){ let full=pick(row,headers,['name','candidate name','full name','applicant name']); let first=pick(row,headers,['first name','firstname','first']); let last=pick(row,headers,['last name','lastname','last']); if(!full && (first||last)) full=`${first} ${last}`.trim(); if(!first){ const parts=(full||`Indeed Candidate ${idx+1}`).trim().split(/\s+/); first=parts.shift()||'Indeed'; last=last||parts.join(' ')||'Candidate'; } let role=pick(row,headers,['job title','job','position','applied job','applied position','job applied','role']) || jobs[0].title; let email=pick(row,headers,['email','email address','candidate email']); let phone=pick(row,headers,['phone','phone number','mobile','mobile phone','candidate phone']); let location=pick(row,headers,['location','city','candidate location','address']); let status=pick(row,headers,['status','candidate status','indeed status']); let resume=pick(row,headers,['resume','resume text','cover letter','experience','qualifications']); let notes=pick(row,headers,['notes','note','comments','screening answers','questions','answers']); let source=pick(row,headers,['source']) || 'Indeed CSV'; const combined=[status && `Indeed status: ${status}`, resume, notes].filter(Boolean).join(' | '); return normalizeCandidate({id:Date.now()+idx,first,last:last||'Candidate',email:email||'unknown@example.com',phone,role,source,path:role.toLowerCase().includes('welder')?'Welder path':'Other path',stage:'Application received',owner:'Quinton',due:'Today',priority:'Normal',location,summary:(combined||'Imported from Indeed CSV. Needs Goff review and path selection.').slice(0,500),concerns:'',timeline:['Imported from Indeed CSV','Queued for Quinton review']}); }
function parseIndeedCSV(text){ if(!text || !text.trim()){ document.getElementById('importResult').innerHTML='<strong>No CSV found.</strong> Upload a file or paste CSV rows first.'; return; } const rows=parseCSV(text.trim()); if(rows.length<2){ document.getElementById('importResult').innerHTML='<strong>Need header row plus at least one candidate row.</strong>'; return; } const headers=rows[0].map(canonicalHeader); const imported=rows.slice(1).filter(r=>r.some(v=>String(v).trim())).map((r,i)=>candidateFromCSVRow(r,headers,i)); window.pendingIndeedImport=imported; document.getElementById('importResult').innerHTML=`<strong>Previewed ${imported.length} Indeed candidate${imported.length===1?'':'s'}.</strong><div class="import-preview">${imported.slice(0,8).map(x=>`<div class="template-row"><b>${esc(x.first)} ${esc(x.last)}</b><span>${esc(x.role)}</span><span class="tag blue">${esc(x.source)}</span></div>`).join('')}${imported.length>8?`<p class="muted">+ ${imported.length-8} more</p>`:''}</div><div class="modal-actions" style="justify-content:flex-start"><button class="btn primary" onclick="commitIndeedImport()">Import ${imported.length} to Goff queue</button><button class="btn" onclick="window.pendingIndeedImport=[];document.getElementById('importResult').innerHTML='Import cancelled.'">Cancel</button></div>`; }
function handleCSVFile(evt){ const file=evt.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ document.getElementById('csvPasteBox').value=reader.result; parseIndeedCSV(reader.result); }; reader.readAsText(file); }
function commitIndeedImport(){ const imported=window.pendingIndeedImport||[]; if(!imported.length){ document.getElementById('importResult').innerHTML='No pending CSV import.'; return; } candidates=[...imported,...candidates]; selectedId=imported[0].id; save(); document.getElementById('importResult').innerHTML=`<strong>Imported ${imported.length} Indeed candidate${imported.length===1?'':'s'} into the Goff queue.</strong><br><button class="btn primary" onclick="view='candidate';render()">Open first imported candidate</button>`; window.pendingIndeedImport=[]; }
function downloadIndeedSampleCSV(){ const sample='Name,Email,Phone,Job Title,Location,Indeed Status,Resume,Notes\n"Jason Harper",jason.harper@example.com,208-555-0188,"Sanitary Stainless Steel Welder / Fabricator","Idaho Falls, ID","Interested","5 years stainless and sanitary pipe","Available for weld test next week"\n"Megan Cole",megan.cole@example.com,208-555-0199,"Inventory Control Specialist","Burley, ID","New","Warehouse inventory and purchasing support","Strong attention to detail"\n'; downloadFile('goff-indeed-import-sample.csv', sample, 'text/csv'); }
function jobCardHTML(j){
  return `<article class="job-card" id="job-${j.id}">
    <header class="job-card-head">
      <div class="min-w-0"><strong>${esc(j.title)}</strong><div class="job-card-tags"><span class="tag blue">${esc(j.type)}</span><span class="tag">${esc(j.path)}</span></div></div>
      <button class="btn brand" onclick="openApply('${j.id}')">Apply for this role</button>
    </header>
    <p class="job-card-summary">${esc(j.summary)}</p>
    <div class="job-card-grid">
      <div class="job-card-field"><span>Pay</span><strong>${esc(j.payRange)}</strong></div>
      <div class="job-card-field"><span>Schedule</span><strong>${esc(j.schedule)}</strong></div>
      <div class="job-card-field"><span>Where</span><strong>${esc(j.location)}</strong></div>
      <div class="job-card-field"><span>Certifications</span><strong>${esc(j.certifications)}</strong></div>
    </div>
    <div class="job-card-perks"><span>What you get</span><ul>${(j.perks||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>
  </article>`;
}


// Role-specific application questions — each role asks what actually matters
// for that seat (welders get weld-test readiness, foremen get crew history).
// Austin's team can reword freely; the structure is the showcase.
const APP_CORE_FIELDS = [
  { k:'First name', type:'text', req:true, id:'first' },
  { k:'Last name', type:'text', req:true, id:'last' },
  { k:'Email', type:'email', req:true, id:'email' },
  { k:'Phone', type:'tel', req:true, id:'phone' },
  { k:'City / town you live in', type:'text', req:true, id:'city' },
  { k:'Soonest you could start', type:'select', req:true, options:['Within 2 weeks','Within 30 days','30–60 days','Just exploring for now'], id:'start' },
  { k:'How did you hear about us?', type:'select', req:true, options:['Indeed','Referral from a Goff employee','Drove by / local','Social media','Other'], id:'heard' },
];
const APP_QUESTIONS = {
  welder: [
    { k:'Years of welding experience', type:'select', options:['Less than 1','1–3','3–5','5–10','10+'], req:true },
    { k:'Processes you run', type:'checks', req:true, options:['TIG','MIG','Stick','Flux-core'], id:'processes' },
    { k:'Sanitary / food-grade stainless experience?', type:'yesno', req:true },
    { k:'Certifications (AWS or equivalent — write N/A if none)', type:'text', req:true },
    { k:'Can you read blueprints and drawings?', type:'yesno', req:true },
    { k:'Ready to take a weld test at our Paul shop?', type:'select', options:['This week','Within 2 weeks','I need more time'], req:true },
    { k:'Tell us about the best stainless work you have done', type:'textarea', req:true },
  ],
  fitter: [
    { k:'Years of fit-up / layout experience', type:'select', options:['Less than 1','1–3','3–5','5+'], req:true },
    { k:'Can you read blueprints and drawings?', type:'yesno', req:true },
    { k:'Materials you have fit', type:'checks', req:true, options:['Sanitary stainless','Structural','Pipe'] },
    { k:'Layout tools you use (2-hole pins, center finder, plumb/laser…)', type:'text', req:true },
    { k:'Ready for a fit-up / weld test at our Paul shop?', type:'select', options:['This week','Within 2 weeks','I need more time'], req:true },
    { k:'Tell us about a recent fit-up job you are proud of', type:'textarea', req:true },
  ],
  helper: [
    { k:'Any shop, trade, farm, or physical work so far?', type:'textarea', req:true },
    { k:'Reliable transportation to Paul?', type:'yesno', req:true },
    { k:'Full-time or part-time?', type:'select', req:true, options:['Full-time','Part-time','Either'] },
    { k:'Comfortable on your feet all day and lifting 50 lbs?', type:'yesno', req:true },
    { k:'What do you want to learn or become here?', type:'textarea', req:true },
  ],
  foreman: [
    { k:'Years leading crews', type:'select', options:['1–2','3–5','5–10','10+'], req:true },
    { k:'Largest crew you have run', type:'select', req:true, options:['2–3','4–6','7–10','10+'] },
    { k:'Trades background', type:'checks', req:true, options:['Welding','Millwright','Fabrication','General construction'] },
    { k:'Have you managed labor hours against an estimate?', type:'yesno', req:true },
    { k:'Walk us through a job you owned end to end', type:'textarea', req:true },
    { k:'Willing to travel for installs?', type:'yesno', req:true },
  ],
  inventory: [
    { k:'Years of warehouse / inventory experience', type:'select', options:['Less than 1','1–3','3–5','5+'], req:true },
    { k:'Systems you have used', type:'checks', req:true, options:['SAP','Other ERP','Spreadsheets','Barcode / scanners'] },
    { k:'Cycle count experience?', type:'yesno', req:true },
    { k:'Forklift certified?', type:'yesno', req:true },
    { k:'Familiar with sanitary stainless fittings and parts?', type:'yesno', req:true },
    { k:'Tell us about an inventory mess you cleaned up', type:'textarea', req:true },
  ],
  procurement: [
    { k:'Years in purchasing / procurement', type:'select', options:['1–3','3–5','5–10','10+'], req:true },
    { k:'Industry background', type:'text', req:true },
    { k:'Systems you have used', type:'checks', req:true, options:['SAP Business One','Other ERP','Spreadsheets'] },
    { k:'Approximate annual spend you have managed', type:'select', req:true, options:['Under $250K','$250K–$1M','$1M–$5M','$5M+'] },
    { k:'Tell us about a vendor negotiation win', type:'textarea', req:true },
  ],
};
let applyJobId = new URLSearchParams(window.location.search).get('job');
function openApply(jobId){ applyJobId = jobId; view='apply'; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function appFieldHtml(f, idx, prefix){
  const id = `${prefix}-${idx}`;
  const label = `<label class="field-label" for="${id}"><span class="fl-text">${esc(f.k)}${f.req?'<em class="req"> *</em>':''}</span>`;
  if(f.type==='textarea') return `${label}<textarea id="${id}" rows="4"></textarea></label>`;
  if(f.type==='yesno') return `${label}<select id="${id}"><option value=""></option><option>Yes</option><option>No</option></select></label>`;
  if(f.type==='select'){
    const change = f.id === 'heard' ? ` onchange="handleHeardChange('${id}')"` : '';
    const other = f.id === 'heard' ? `<input id="${id}-other" class="other-source" type="text" placeholder="Tell us where you heard about Goff" style="display:none">` : '';
    return `${label}<select id="${id}"${change}><option value=""></option>${f.options.map(o=>`<option>${esc(o)}</option>`).join('')}</select>${other}</label>`;
  }
  if(f.type==='checks') return `${label}<div class="app-checks" id="${id}" data-field="${esc(f.id||f.k)}" onchange="handleAppChecksChange('${id}')">${f.options.map(o=>`<label class="app-check"><input type="checkbox" value="${esc(o)}"> ${esc(o)}</label>`).join('')}</div>${f.id==='processes'?'<div id="tig-warning" class="notice warn" style="display:none;margin-top:10px"><strong>Heads up:</strong> Goff primarily uses TIG welding. Weld tests are usually on TIG equipment. If you do not run TIG or Stick yet, be ready to talk through whether you can transition.</div>':''}</label>`;
  return `${label}<input id="${id}" type="${f.type||'text'}"></label>`;
}
function handleAppChecksChange(id){
  const box = document.getElementById(id);
  if(!box || box.dataset.field !== 'processes') return;
  const selected = Array.from(box.querySelectorAll('input:checked')).map(x=>String(x.value).toLowerCase());
  const warn = document.getElementById('tig-warning');
  if(warn) warn.style.display = selected.length && !selected.includes('tig') && !selected.includes('stick') ? 'block' : 'none';
}
function handleHeardChange(id){
  const sel = document.getElementById(id);
  const other = document.getElementById(`${id}-other`);
  if(other) other.style.display = sel?.value === 'Other' ? 'block' : 'none';
}
function readAppField(f, idx, prefix){
  const el = document.getElementById(`${prefix}-${idx}`);
  if(!el) return '';
  if(f.type==='checks') return Array.from(el.querySelectorAll('input:checked')).map(x=>x.value).join(', ');
  if(f.id === 'heard' && el.value === 'Other'){
    const other = String(document.getElementById(`${prefix}-${idx}-other`)?.value || '').trim();
    return other ? `Other: ${other}` : '';
  }
  return String(el.value || '').trim();
}
function applyView(){
  const j = jobById(applyJobId);
  if(!j || j.status==='closed') return positionClosedView();
  const qs = APP_QUESTIONS[j.id] || [];
  return `<main class="public-careers"><section class="public-body apply-page">
    <div class="public-brand" style="margin-bottom:18px"><img src="/goff-welding-logo.png" alt="Goff Welding" class="public-brand-logo"><span class="public-brand-tag">Application</span></div>
    <button class="btn ghost" onclick="view='career';render()">← All open positions</button>
    <section class="panel" style="margin-top:14px">
      <div class="eyebrow">Applying for</div>
      <h2>${esc(j.title)}</h2>
      <p class="muted">${esc(j.payRange)} • ${esc(j.schedule)} • ${esc(j.location)}</p>
      <div class="form apply-grid"><h3 class="apply-h">About you</h3>
      ${APP_CORE_FIELDS.map((f,i)=>appFieldHtml(f,i,'rc')).join('')}
      <h3 class="apply-h">About the work</h3>
      ${qs.map((f,i)=>appFieldHtml(f,i,'rq')).join('')}
      <h3 class="apply-h">Anything else?</h3>
      <label class="field-label">Anything else Goff should know<textarea id="rq-extra" rows="3" placeholder="Schedule needs, references, links to your work…"></textarea></label>
      <button class="btn primary" id="ra-submit" onclick="submitRoleApplication()">Submit application</button>
      <p class="apply-fineprint">Your information goes straight to the Goff hiring team. We do not share it with third parties.</p>
      </div>
    </section>
  </section></main>`;
}
// Guard against double-clicks on Submit: the POST takes ~a second, and a
// second click in that window created a duplicate candidate (seen live 7/8
// with two records 1.3s apart). One flag covers both application forms.
let applicationSubmitting = false;
async function submitRoleApplication(){
  if(applicationSubmitting) return;
  const j = jobById(applyJobId); if(!j || j.status==='closed'){ showToast('That position is closed'); view='career'; render(); return; }
  const qs = APP_QUESTIONS[j.id] || [];
  const core = {}; const answers = {}; let missing = null;
  APP_CORE_FIELDS.forEach((f,i)=>{ const v = readAppField(f,i,'rc'); core[f.id] = v; if(f.req && !v && !missing) missing = f.k; });
  qs.forEach((f,i)=>{ const v = readAppField(f,i,'rq'); answers[f.k] = v; if(f.req && !v && !missing) missing = f.k; });
  const extra = String(document.getElementById('rq-extra')?.value || '').trim();
  if(missing){ showToast(`Required: ${missing}`); return; }
  if(core.city) answers['City / town'] = core.city;
  if(core.start) answers['Soonest start'] = core.start;
  if(core.heard) answers['Heard about us via'] = core.heard;
  if(j.id === 'welder'){ const processes = String(answers['Processes you run'] || ''); if(processes && !/TIG|Stick/i.test(processes)) answers['TIG / Stick weld-test notice'] = 'Applicant selected neither TIG nor Stick; portal displayed TIG weld-test warning.'; }
  if(extra) answers['Anything else'] = extra;
  applicationSubmitting = true;
  const btn = document.getElementById('ra-submit'); if(btn){ btn.disabled = true; btn.textContent = 'Submitting…'; }
  const notes = Object.entries(answers).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join('\n');
  let serverDelivered = false;
  try{
    const r = await fetch('/api/goff-recruiting/applications', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ first: core.first, last: core.last, email: core.email, phone: core.phone, role: j.title, notes, source:'Goff website', answers })
    });
    serverDelivered = r.ok;
  }catch(_){ serverDelivered = false; }
  // The server route already creates the pipeline candidate. Creating a local
  // copy too gave every applicant TWO records (different ids, same person —
  // that's where the duplicate Jeffrey Stoker came from). Only keep the local
  // copy as a fallback when the server couldn't be reached.
  if(!serverDelivered){
    const item = normalizeCandidate({
      id: Date.now(), first: core.first, last: core.last || 'Applicant', email: core.email, phone: core.phone, role: j.title,
      source:'Goff website', path: j.path, stage:'Application received', owner:'Quinton', due:'Today', priority:'Normal',
      location: core.city || '', summary:`Website application (role-specific).\n${notes.slice(0,400)}`, concerns:'',
      application: answers,
      timeline:['Submitted role-specific application from careers page', 'Local copy saved — server route unavailable.'],
    });
    candidates.unshift(item); selectedId = item.id; save();
  }
  applicationSubmitting = false;
  view='thanks'; render();
}

// ── Positions: server sync + admin screen ─────────────────────────────────
let posSyncTimer = null, posSyncPaused = false;
function pushPositions(){
  if(posSyncPaused) return;
  clearTimeout(posSyncTimer);
  posSyncTimer = setTimeout(async () => {
    try{
      const res = await fetch('/api/goff-recruiting/positions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ positions }) });
      if(!res.ok) throw new Error('status '+res.status);
    }catch(err){ console.warn('[positions] push failed:', err); showToast('Positions saved locally — cloud sync failed'); }
  }, 700);
}
async function initPositionsSync(){
  try{
    const res = await fetch('/api/goff-recruiting/positions');
    if(!res.ok) return;
    const data = await res.json();
    const remote = Array.isArray(data.positions) ? data.positions : [];
    if(remote.length){
      posSyncPaused = true;
      positions = remote.map(normalizeJob);
      safeSet('goffOpenPositionsV1', JSON.stringify(positions));
      posSyncPaused = false;
      render();
    } else if(!isPublicCareersHost() && positions.length){
      pushPositions(); // empty server + admin: seed it from the defaults/local
    }
  }catch(err){ console.warn('[positions] load failed:', err); }
}
function positionClosedView(){
  return `<main class="public-careers"><section class="public-body apply-page"><div class="public-brand" style="margin-bottom:18px"><img src="/goff-welding-logo.png" alt="Goff Welding" class="public-brand-logo"><span class="public-brand-tag">Careers</span></div><section class="panel"><h2>That position is closed</h2><p class="muted">This role isn\'t accepting applications right now. Take a look at what else Goff Welding is hiring for.</p><button class="btn brand" onclick="applyJobId=null;view=\'career\';render()">View open positions →</button></section></section></main>`;
}

// Admin Positions manager
let editingPosition = null;
const POSITION_FIELDS = [
  { k:'title', label:'Job title', type:'text', full:true },
  { k:'type', label:'Employment type', type:'text', ph:'Full-time' },
  { k:'path', label:'Hiring path', type:'select', options:['Welder path','Other path'] },
  { k:'payRange', label:'Pay range', type:'text', ph:'$25–$32/hr DOE' },
  { k:'schedule', label:'Schedule', type:'text', ph:'Mon–Fri, 6:00 AM–2:30 PM' },
  { k:'location', label:'Location', type:'text', ph:'On-site • Paul, ID' },
  { k:'certifications', label:'Certifications', type:'text', full:true },
  { k:'summary', label:'Summary (shown on the careers card)', type:'textarea', full:true },
  { k:'roleFit', label:'Role fit (internal — used in candidate review)', type:'textarea', full:true },
  { k:'perks', label:'Perks (one per line)', type:'perks', full:true },
];
function blankPosition(){ return { id:'', title:'', type:'Full-time', path:'Other path', summary:'', payRange:'', schedule:'', location:'On-site • Paul, ID', perks:[], certifications:'', roleFit:'', status:'open' }; }
function addPosition(){ editingPosition = blankPosition(); view='positions'; render(); }
function editPosition(id){ const j = jobById(id); if(j){ editingPosition = JSON.parse(JSON.stringify(j)); render(); } }
function cancelPositionEdit(){ editingPosition = null; render(); }
function duplicatePosition(id){ const j = jobById(id); if(!j) return; const copy = JSON.parse(JSON.stringify(j)); copy.title = j.title + ' (copy)'; copy.id = newJobId(copy.title); copy.status='open'; upsertJob(copy); showToast('Position duplicated'); render(); }
function togglePositionStatus(id){ const j = jobById(id); if(!j) return; j.status = j.status==='closed' ? 'open' : 'closed'; upsertJob(j); render(); }
function confirmDeletePosition(id){ const j = jobById(id); if(!j) return; if(confirm(`Delete "${j.title}"? This removes it from the careers page and cannot be undone.`)){ deleteJob(id); showToast('Position deleted'); render(); } }
function savePositionForm(){
  const p = editingPosition; if(!p) return;
  POSITION_FIELDS.forEach(f => {
    const el = document.getElementById('pf-'+f.k);
    if(!el) return;
    if(f.type==='perks') p.perks = el.value.split('\n').map(s=>s.trim()).filter(Boolean);
    else p[f.k] = el.value.trim();
  });
  const statusEl = document.getElementById('pf-status'); if(statusEl) p.status = statusEl.value;
  if(!p.title){ showToast('Job title is required'); return; }
  if(!p.id) p.id = newJobId(p.title);
  upsertJob(p);
  editingPosition = null;
  showToast('Position saved');
  render();
}
function positionEditor(p){
  const isNew = !positions.some(x => x.id === p.id);
  return `<section class="panel"><div class="section-head"><div><div class="eyebrow">${isNew?'New position':'Edit position'}</div><h3>${esc(p.title || 'Untitled role')}</h3></div></div>
  <div class="form pos-form">${POSITION_FIELDS.map(f => {
    const val = f.type==='perks' ? (p.perks||[]).join('\n') : (p[f.k]||'');
    const inner = f.type==='textarea' ? `<textarea id="pf-${f.k}" rows="3">${esc(val)}</textarea>`
      : f.type==='perks' ? `<textarea id="pf-${f.k}" rows="4">${esc(val)}</textarea>`
      : f.type==='select' ? `<select id="pf-${f.k}">${f.options.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')}</select>`
      : `<input id="pf-${f.k}" type="text" value="${esc(val)}"${f.ph?` placeholder="${esc(f.ph)}"`:''}>`;
    return `<label class="field-label ${f.full?'pos-full':''}">${esc(f.label)}${inner}</label>`;
  }).join('')}
  <label class="field-label">Status<select id="pf-status"><option value="open" ${p.status!=='closed'?'selected':''}>Open (shown on careers page)</option><option value="closed" ${p.status==='closed'?'selected':''}>Closed (hidden)</option></select></label>
  </div>
  <div class="modal-actions" style="justify-content:flex-start;padding:18px 0 0"><button class="btn brand" onclick="savePositionForm()">Save position</button><button class="btn" onclick="cancelPositionEdit()">Cancel</button></div></section>`;
}
function positionsView(){
  if(editingPosition) return `${head('Open Positions','Add, edit, or close the roles that show on your careers page.','')}${positionEditor(editingPosition)}`;
  const open = positions.filter(p=>p.status!=='closed').length;
  return `${head('Open Positions', `${positions.length} role${positions.length===1?'':'s'} · ${open} open · shown live on your careers page`, '<button class="btn primary" onclick="addPosition()">Add position</button>')}
  <section class="panel"><div class="pos-list">${positions.length ? positions.map(p => `
    <article class="pos-row ${p.status==='closed'?'closed':''}">
      <div class="pos-row-main"><div class="pos-row-title"><strong>${esc(p.title)}</strong><span class="pos-badge ${p.status==='closed'?'off':'on'}">${p.status==='closed'?'Closed':'Open'}</span></div>
      <div class="pos-row-meta">${esc(p.type||'')}${p.path?` · ${esc(p.path)}`:''}${p.payRange?` · ${esc(p.payRange)}`:''}${p.location?` · ${esc(p.location)}`:''}</div></div>
      <div class="pos-row-actions"><button class="btn" onclick="editPosition('${esc(p.id)}')">Edit</button><button class="btn" onclick="duplicatePosition('${esc(p.id)}')">Duplicate</button><button class="btn" onclick="togglePositionStatus('${esc(p.id)}')">${p.status==='closed'?'Reopen':'Close'}</button><button class="btn ghost" onclick="confirmDeletePosition('${esc(p.id)}')">Delete</button></div>
    </article>`).join('') : '<div class="notice">No positions yet. Click “Add position” to create your first open role.</div>'}</div></section>`;
}

function career(){
  return `<main class="public-careers">
    <section class="career-hero public-hero">
      <div class="public-brand"><img src="/goff-welding-logo.png" alt="Goff Welding" class="public-brand-logo"><span class="public-brand-tag">Careers</span></div>
      <div class="eyebrow" style="color:#fff">Now hiring</div>
      <h2>Built right. Paid right. On time.</h2>
      <p>Goff Welding is a sanitary stainless fabrication shop in Paul, Idaho. We build food, dairy, and industrial work where weld quality is non-negotiable. If you take pride in your trade, we want to test on day one.</p>
      <div class="hero-actions">
        <a class="btn brand" href="#apply">Apply now</a>
        <button class="btn ghost-light" onclick="document.getElementById('jobs-list')?.scrollIntoView({behavior:'smooth'})">See open positions</button>
      </div>
    </section>
    <section class="public-body">
      <div class="grid two careers-grid">
        <div id="jobs-list">
          <div class="careers-section-head"><h2>Open positions</h2><span class="muted">${openJobs().length} role${openJobs().length===1?'':'s'} hiring</span></div>
          ${openJobs().length ? openJobs().map(jobCardHTML).join('') : '<div class="notice">No open positions right now. Check back soon.</div>'}
        </div>
        <aside class="apply-panel panel" id="apply">
          <h3>Not sure which role?</h3>
          <p class="muted">Use the general application and the hiring team will point you at the right seat. Applying for a specific role? Use the “Apply for this role” button on the job — it asks the right questions.</p>
          <div class="form">
            <label class="field-label">Full name<input id="appName" placeholder="First and last" required></label>
            <label class="field-label">Email<input id="appEmail" type="email" placeholder="you@example.com" required></label>
            <label class="field-label">Phone<input id="appPhone" type="tel" placeholder="208-555-0100"></label>
            <label class="field-label">Role<select id="appRole">${openJobs().map(j=>`<option>${esc(j.title)}</option>`).join('')}</select></label>
            <label class="field-label">Soonest you could start<select id="appAvailability"><option>Within 2 weeks</option><option>Within 30 days</option><option>30–60 days</option><option>Just exploring for now</option></select></label>
            <label class="field-label">Experience, certifications, and anything Goff should know<textarea id="appNotes" rows="6" placeholder="Years of stainless experience, weld test you have passed, certifications, location, schedule needs."></textarea></label>
            <button class="btn primary" onclick="submitApplication()">Submit application</button>
            <p class="apply-fineprint">Your information goes straight to the Goff hiring team. We do not share it with third parties.</p>
          </div>
        </aside>
      </div>
    </section>
    <footer class="public-footer">
      <div class="public-footer-grid">
        <div><strong>Goff Welding, LLC</strong><br><span>531 W 100 S #22<br>Paul, Idaho 83347</span></div>
        <div><strong>Get in touch</strong><br><span>(208) 647-2488<br>info@goffwelding.com</span></div>
        <div><strong>Open positions</strong><br><span>${openJobs().length} role${openJobs().length===1?'':'s'} hiring</span></div>
      </div>
    </footer>
  </main>`;
}
function prefillApply(id){ const j=jobById(id); if(!j) return; const sel=document.getElementById('appRole'); if(sel) sel.value=j.title; document.getElementById('apply')?.scrollIntoView({behavior:'smooth'}); document.getElementById('appName')?.focus(); }
async function submitApplication(){
  const name=document.getElementById('appName').value||'New Applicant';
  const email=document.getElementById('appEmail').value||'unknown@example.com';
  const phone=document.getElementById('appPhone').value||'';
  const role=document.getElementById('appRole').value;
  const availability=document.getElementById('appAvailability')?.value||'';
  const notes=document.getElementById('appNotes').value||'';
  const [first,...rest]=name.split(' ');
  const last=rest.join(' ')||'Applicant';
  const combinedNotes = availability ? `Availability: ${availability}\n\n${notes}` : notes;

  // Best-effort server delivery. The server route creates the pipeline
  // candidate; the local record is ONLY a fallback for when the endpoint is
  // unreachable — creating both gave every applicant two records.
  if(applicationSubmitting) return;
  applicationSubmitting = true;
  let serverDelivered=false;
  try {
    const r=await fetch('/api/goff-recruiting/applications', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({first,last,email,phone,role,notes:combinedNotes,source:'Goff website'})
    });
    serverDelivered=r.ok;
  } catch(_) { serverDelivered=false; }

  if(!serverDelivered){
    const item=normalizeCandidate({
      id:Date.now(),
      first, last, email, phone, role,
      source:'Goff website',
      path:role.toLowerCase().includes('welder')||role.toLowerCase().includes('fitter')?'Welder path':'Other path',
      stage:'Application received',
      owner:'Quinton',
      due:'Today',
      priority:'Normal',
      location:'',
      summary:combinedNotes||'Website application submitted. Needs hiring-team review.',
      concerns:'',
      timeline:['Submitted from Goff careers page', 'Local copy saved — server route unavailable.', 'Queued for Quinton'],
    });
    candidates.unshift(item);
    selectedId=item.id;
    save();
  }
  applicationSubmitting = false;
  view='thanks';
  render();
}
function thanks(){
  return `<main class="public-careers">
    <section class="career-hero public-hero">
      <div class="public-brand"><img src="/goff-welding-logo.png" alt="Goff Welding" class="public-brand-logo"><span class="public-brand-tag">Careers</span></div>
      <h2>Thanks — your application is in.</h2>
      <p>Your application is in front of our hiring team. If your experience fits a current opening, expect a call or email within a few business days. Most welder and fitter roles start with a paid weld test.</p>
    </section>
    <section class="public-body">
      <div class="panel">
        <h3>What happens next</h3>
        <ol class="thanks-steps">
          <li><strong>The Goff hiring team reviews your application.</strong> If it is a fit, you will get a phone screen invite by email or text.</li>
          <li><strong>Welder / fitter roles:</strong> weld test on-site or distance test if you are out of area. Bring your standard rig setup.</li>
          <li><strong>Interview with the hiring team.</strong> Talk about the work, the schedule, and answer any questions.</li>
          <li><strong>References + offer.</strong> We make a decision quickly so you are not left hanging.</li>
        </ol>
        <p class="muted">Questions in the meantime? Email <a href="mailto:info@goffwelding.com">info@goffwelding.com</a> or call (208) 647-2488.</p>
        <button class="btn" onclick="window.open(CAREERS_URL,'_blank','noopener')">Back to open positions</button>
      </div>
    </section>
  </main>`;
}
function field(k,v){ return `<div class="field"><span>${k}</span><strong>${v || '—'}</strong></div>`; }
const EVIDENCE_ITEMS = [['phone','Phone screen'],['weld','Weld test'],['interview','Interview'],['references','References'],['crystal','Crystal Knows'],['background','Background']];
function evidenceDone(v){ return /complete|done|pass|cleared|scheduled|✓/i.test(String(v||'')); }
function evidenceTable(x){
  const e=x.evidence||{};
  return `<div class="evidence-list">${EVIDENCE_ITEMS.map(([k,label])=>{
    const val=e[k]||'Not started';
    const na=/^n\/a$/i.test(val);
    const done=evidenceDone(val);
    return `<div class="evidence-row${done?' done':''}${na?' na':''}">
      <span class="ev-check">${done?'✓':(na?'—':'○')}</span>
      <span class="ev-label">${label}</span>
      <span class="ev-status">${esc(val)}</span>
      ${na?'':`<button class="btn ev-toggle" onclick="setEvidence(${x.id},'${k}','${done?'Not started':'Complete'}')">${done?'Undo':'Mark done'}</button>`}
    </div>`;
  }).join('')}</div>`;
}
function setEvidence(id,k,v){ const x=candidates.find(c=>c.id===id); if(!x) return; x.evidence=x.evidence||{}; x.evidence[k]=v; if(k==='background'){ x.clearance=x.clearance||{}; x.clearance.background = evidenceDone(v) ? 'Cleared' : 'Not started'; } x.timeline.push(`Evidence updated: ${k} → ${v}`); save(); render(); }
function resolveConcern(id){ const x=candidates.find(c=>c.id===id); if(!x || !x.concerns) return; x.timeline.push(`Concern resolved: ${String(x.concerns).slice(0,80)}`); x.concerns=''; save(); render(); showToast('Concern marked resolved'); }
// A concern is only worth showing if it's specific to THIS candidate. The old
// intake code stamped the same boilerplate on everyone ('Needs screening.',
// 'CSV import: verify...') — identical text on every record carries no
// information, and the stage rail already shows screening status. New intakes
// no longer stamp these; this filter hides them on records already in the DB.
const BOILERPLATE_CONCERNS = /^(needs screening\.?|imported data needs verification\.?|csv import: verify|fallback entry: verify|demo only\.?)/i;
function realConcern(x){ const v=String(x.concerns||'').trim(); return (!v || BOILERPLATE_CONCERNS.test(v)) ? '' : v; }
function addConcern(id){
  const x=candidates.find(c=>c.id===id); if(!x) return;
  const text=window.prompt('Flag a concern about this candidate (pay expectations, commute, reference worry, ...):','');
  if(!text || !text.trim()) return;
  x.concerns=text.trim().slice(0,300);
  x.timeline.push(`Concern flagged: ${x.concerns.slice(0,80)}`);
  save(); render(); showToast('Concern flagged');
}
// Intake concerns are all variations of "verify this person before investing
// time." Recording the phone screen IS that verification — clear them so the
// warning doesn't nag forever after it's been handled.
function clearScreeningConcern(x){
  if(x.concerns && /screening|verify|verification/i.test(x.concerns)){
    x.timeline.push('Screening concern auto-resolved (phone screen recorded)');
    x.concerns='';
  }
}
function clearanceReady(x){ return x.clearance?.drug==='Passed' && ['Cleared','N/A'].includes(x.clearance?.background) && x.clearance?.startDate==='Confirmed'; }
// Each clearance item shows its state at a glance: green ✓ done, amber ●
// in progress (scheduled/ordered), grey ○ not started. Buttons under each
// item only offer that item's next states.
function clearanceItem(label, value, done, pending, buttons){
  const state = done ? 'done' : (pending ? 'pending' : '');
  const mark = done ? '✓' : (pending ? '●' : '○');
  return `<div class="clr-item ${state}"><div class="clr-head"><span class="clr-mark">${mark}</span><span class="clr-label">${label}</span></div><div class="clr-status">${esc(value)}</div><div class="clr-actions">${buttons}</div></div>`;
}
function clearancePanel(x){
  const ready=clearanceReady(x);
  const cl=x.clearance||{};
  return `<div class="notice ${ready?'success':'warning'}"><strong>${ready?'Clearance complete — this candidate can move to onboarding':'BBSI guardrail active'}</strong><br>Offer Accepted is a hold stage. Do not move to BBSI onboarding until drug screen, background, and start date are complete.</div>
  <div class="clr-grid">
    ${clearanceItem('Drug screen', cl.drug, cl.drug==='Passed', cl.drug==='Scheduled',
      `<button class="btn clr-btn" onclick="setClearance('drug','Scheduled')">Scheduled</button><button class="btn clr-btn" onclick="setClearance('drug','Passed')">Passed</button>`)}
    ${clearanceItem('Background', cl.background, ['Cleared','N/A'].includes(cl.background), cl.background==='Ordered',
      `<button class="btn clr-btn" onclick="setClearance('background','Ordered')">Ordered</button><button class="btn clr-btn" onclick="setClearance('background','Cleared')">Cleared</button><button class="btn clr-btn" onclick="setClearance('background','N/A')">N/A</button>`)}
    ${clearanceItem('Start date', cl.startDate, cl.startDate==='Confirmed', false,
      `<button class="btn clr-btn" onclick="setClearance('startDate','Confirmed')">Confirmed</button>`)}
  </div>`;
}
function employeePortalUrl(x){
  const p=new URLSearchParams();
  p.set('id', `candidate-${x.id}`);
  p.set('employee',`${x.first} ${x.last}`.trim());
  if(x.email) p.set('email', x.email);
  if(x.role) p.set('role',x.role);
  const sup=x.offer?.supervisor; if(sup) p.set('supervisor',sup);
  const start=x.offer?.startDate; if(start) p.set('start',start);
  return `/goff-employee/?${p.toString()}`;
}
function fullEmployeePortalUrl(x){ return employeePortalLink()+employeePortalUrl(x).replace(/^\/goff-employee\//,''); }
function employeeHandoffPanel(x){ const ready=clearanceReady(x); const moved=alreadyMovedToOnboarding(x); const url=employeePortalUrl(x); const fullUrl=fullEmployeePortalUrl(x); return `<section class="panel employee-handoff" style="margin-top:16px"><div class="section-head"><div><div class="eyebrow">Recruiting → employee portal</div><h3>${ready?(moved?'Already in onboarding queue':'Ready to move into onboarding'):'Employee portal stays locked until clearance'}</h3></div><span class="tag ${ready?'green':'amber'}">${ready?(moved?'Queued':'Cleared'):'Guardrail active'}</span></div><div class="handoff-grid"><div><span>Employee link</span><strong>${esc(`${x.first} ${x.last}`.trim() || 'New hire')}</strong><small class="link-break">${esc(fullUrl)}</small></div><div><span>Access method</span><strong>Private link</strong><small>Unique per candidate. Progress is kept separate by candidate ID.</small></div><div><span>Admin result</span><strong>${moved?'Visible in onboarding queue':'Not queued yet'}</strong><small>Once moved, Quinton can track this hire from Admin control.</small></div></div><div class="notice ${ready?'success':'warning'}"><strong>${ready?'Next action: move to onboarding':'Do not send full employee portal yet'}</strong><br>${ready?'This creates the employee onboarding record, advances recruiting to Transition to onboarding workflow, and keeps this employee’s progress tied to the unique link.':'Offer accepted is not hired. Complete drug screen, background, and start date first.'}</div><div class="actions tight"><button class="btn ${ready?'primary':''}" ${ready?'':'disabled'} onclick="moveToOnboarding()">${moved?'Refresh onboarding record':'Move to onboarding'}</button><button class="btn" onclick="window.open('${url}','_blank','noopener')">Preview employee portal</button><button class="btn" onclick="copyToClipboard('${esc(fullUrl)}')">Copy exact employee link</button><button class="btn" onclick="showEmployeeWelcomeDraft()">Preview welcome message</button></div></section>`; }
// One progress rail instead of "current stage" + a separate evidence checklist.
// Reuses the same 6 funnel buckets as the dashboard so both screens speak the
// same language. Steps left of the current bucket are done (the stage pointer
// already proves they happened), the current bucket is the active step, and
// everything right is still to come. Disposition stages (Keep on file, Not
// selected, ...) sit outside the funnel and show as a hold badge instead.
function stageRail(x){
  const idx = FUNNEL_BUCKETS.findIndex(b=>b.stages.includes(x.stage));
  const off = idx === -1;
  return `<div class="stage-rail">${FUNNEL_BUCKETS.map((b,i)=>{
    const state = off ? 'todo' : (i<idx ? 'done' : (i===idx ? 'now' : 'todo'));
    return `<div class="rail-step ${state}"><span class="rail-dot">${state==='done'?'✓':(state==='now'?'●':'○')}</span><span class="rail-label">${b.label}</span></div>`;
  }).join('')}${off ? `<span class="tag dark rail-off">${esc(x.stage)}</span>` : ''}</div>`;
}
// Checks that run alongside the main funnel rather than on it — the single
// stage pointer can't show these, which is the one job the old evidence
// checklist actually had. Click to toggle; logged to the timeline.
const SIDE_CHECKS = [['references','References'],['background','Background'],['crystal','Crystal Knows']];
function sideChecks(x){
  const e=x.evidence||{};
  return `<div class="side-checks"><span class="side-checks-label">Side checks</span>${SIDE_CHECKS.map(([k,label])=>{
    const done=evidenceDone(e[k]);
    return `<button class="side-check${done?' done':''}" title="${done?'Click to un-mark':'Click when this check is complete'}" onclick="setEvidence(${x.id},'${k}','${done?'Not started':'Complete'}')">${done?'✓':'○'} ${label}</button>`;
  }).join('')}</div>`;
}
function candidate(){
  const x=c();
  const meta=stageMeta(x.stage);
  const ageLevel=agingLevel(x);
  const ageText=stageAgeText(x);
  const showClearance = ['Offer letter info request','Offer letter draft','Offer sent / follow-up','Offer accepted - clearance hold','BBSI documents invite','Schedule first day','Transition to onboarding workflow'].includes(x.stage);
  const showOfferShortcut = ['Offer letter info request','Offer letter draft','Offer sent / follow-up'].includes(x.stage);
  const emailPending = stageEmailPending(x);
  // Role/path edits in place, right where the role is shown under the name.
  const roleSub = inlineEdit==='role'
    ? `<select class="stage-select inline-fix" onchange="changeCandidatePosition(this.value)"><option value="">Change position — ${esc(x.role)}…</option>${openJobs().map(job=>`<option value="${esc(job.id)}">${esc(job.title)}</option>`).join('')}</select> <select class="stage-select inline-fix" onchange="changeCandidatePath(this.value)"><option value="Welder path" ${x.path==='Welder path'?'selected':''}>Welder path</option><option value="Other path" ${x.path!=='Welder path'?'selected':''}>Other path</option></select> <button class="stage-fix" onclick="inlineEdit=null;render()">✕ cancel</button>`
    : `${esc(x.role)} · from ${esc(x.source)} · ${esc(x.path)} <button class="stage-fix" title="Change the position or career path" onclick="inlineEdit='role';render()">✎</button>`;
  return `${head(`${x.pinned ? '★ ' : ''}${esc(x.first)} ${esc(x.last)}`, roleSub,`<div class="head-actions"><button class="btn pin-toggle ${x.pinned ? 'pinned' : ''}" onclick="togglePin(${x.id})" title="${x.pinned ? 'Unpin' : 'Pin this candidate'}">${x.pinned ? '★ Pinned' : '☆ Pin'}</button><button class="btn ghost" onclick="view='dashboard';render()">← Back to dashboard</button></div>`)}
  <section class="panel candidate-hero">
    <div class="candidate-hero-contact" style="margin-top:0;padding-top:0;border-top:0">
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(x.email)}&su=${encodeURIComponent('Goff Welding — ' + x.role)}" target="_blank" rel="noopener">✉ ${esc(x.email)}</a>
      ${x.phone ? `<a href="tel:${esc(x.phone)}">☎ ${esc(x.phone)}</a>` : ''}
      ${x.location ? `<span>📍 ${esc(x.location)}</span>` : ''}
      <button class="hero-copy" title="Copy email address" onclick="copyToClipboard('${esc(x.email)}')">⧉ Copy email</button>
    </div>
    ${stageRail(x)}
    <div class="candidate-hero-row">
      <div class="candidate-hero-stage">
        <div class="eyebrow">Now</div>
        ${inlineEdit==='stage'
          ? `<div class="inline-stage-edit"><select class="stage-select" onchange="setStage(this.value)">${STAGES.map(s=>`<option ${s===x.stage?'selected':''}>${esc(s)}</option>`).join('')}</select> <button class="stage-fix" onclick="inlineEdit=null;render()">✕ cancel</button></div>`
          : `<h3>${esc(titleCase(x.stage))} <button class="stage-fix" title="Wrong stage? Change it right here." onclick="inlineEdit='stage';render()">✎</button></h3>`}
        <p class="muted">${meta.next ? `then: <strong>${esc(titleCase(meta.next))}</strong>` : 'final step in this track'}</p>
      </div>
      <div class="candidate-hero-meta">
        <div class="hero-stat"><span>In stage</span><strong class="age-${ageLevel}">${esc(ageText)}</strong></div>
        <div class="hero-stat"><span>Waiting on</span><strong>${emailPending ? 'You — send the email' : (x.owner==='Quinton' ? 'You — review &amp; decide' : esc(x.owner))}</strong></div>
      </div>
    </div>
    <div class="candidate-hero-actions">
      ${emailPending
        ? `<button class="btn primary" onclick="showDraft(c().stage)">✉ Send ${esc(meta.template)} email</button>${stageDecisionButtons(x).replaceAll('btn primary','btn')}`
        : `${stageDecisionButtons(x)}<button class="btn" onclick="showDraft(c().stage)">Generate email draft</button>`}
      ${showOfferShortcut ? `<button class="btn" onclick="view='offer';render()">Open offer workflow</button>` : ''}
    </div>
    ${sideChecks(x)}
  </section>
  ${x.application && Object.keys(x.application).length ? `<details class="panel collapse-panel" style="margin-top:16px"><summary><h3 style="display:inline">Application answers</h3></summary><div class="app-answers" style="margin-top:16px">${Object.entries(x.application).filter(([,v])=>v).map(([k,v])=>`<div class="app-answer"><span>${esc(k)}</span><p>${esc(String(v))}</p></div>`).join('')}</div></details>` : ''}
  ${notesPanel(x)}
  <section class="panel" style="margin-top:16px">
    ${realConcern(x) ? `<h3>Concern to resolve</h3><div class="notice warning">${esc(realConcern(x))}<div style="margin-top:10px"><button class="btn" style="padding:7px 14px;font-size:13px" onclick="resolveConcern(${x.id})">✓ Mark resolved</button></div></div><h3 style="margin-top:18px">Role expectations</h3>` : `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><h3>Role expectations</h3><button class="btn" style="padding:7px 14px;font-size:13px;flex:0 0 auto" onclick="addConcern(${x.id})">⚑ Flag a concern</button></div>`}
    <p class="muted">${esc(roleFit(x))}</p>
  </section>
  ${showClearance ? `<section class="panel" style="margin-top:16px"><h3>Clearance guardrails</h3>${clearancePanel(x)}</section>${employeeHandoffPanel(x)}` : ''}
  <section class="panel" style="margin-top:16px">
    <h3>Timeline</h3>
    <div class="timeline">${x.timeline.slice().reverse().map(t=>`<div class="timeline-row"><span class="timeline-dot"></span><div><b>${esc(t)}</b><small>Logged in candidate history</small></div></div>`).join('')}</div>
  </section>`;
}
function changeCandidatePosition(jobId){
  const job = jobById(jobId);
  if(!job) return;
  inlineEdit=null;
  const x = c();
  const oldRole = x.role;
  const oldPath = x.path || 'Other path';
  x.role = job.title;
  x.path = job.path || (job.title.toLowerCase().includes('welder') || job.title.toLowerCase().includes('fitter') ? 'Welder path' : 'Other path');
  x.evidence = x.evidence || {};
  x.evidence.weld = x.path === 'Welder path' ? (x.evidence.weld === 'N/A' ? 'Not started' : (x.evidence.weld || 'Not started')) : 'N/A';
  x.timeline.push(`Position changed: ${oldRole} / ${oldPath} → ${x.role} / ${x.path}`);
  save();
  render();
  showToast('Candidate position updated');
}
function changeCandidatePath(path){
  inlineEdit=null;
  const x = c();
  const nextPath = path === 'Welder path' ? 'Welder path' : 'Other path';
  const oldPath = x.path || 'Other path';
  if(oldPath === nextPath) return;
  x.path = nextPath;
  x.evidence = x.evidence || {};
  x.evidence.weld = x.path === 'Welder path' ? (x.evidence.weld === 'N/A' ? 'Not started' : (x.evidence.weld || 'Not started')) : 'N/A';
  x.timeline.push(`Career path changed: ${oldPath} → ${x.path}`);
  save();
  render();
  showToast('Candidate career path updated');
}
// ONE notes surface. There used to be a separate phone-screen notes box AND a
// recruiter-notes box on the same page — both wrote to the same list, so the
// split was pure visual duplication. Now a single panel adapts to the stage:
// during phone-screen stages it shows the what-to-capture prompt and saving a
// note ticks the phone-screen evidence + clears the screening concern.
function isPhoneScreenStage(stage){ return ['Phone screen invitation','Review phone screen'].includes(stage); }
function notesPanel(x){
  const phone = isPhoneScreenStage(x.stage);
  return `<section class="panel" style="margin-top:16px">
    <div class="section-head"><div><div class="eyebrow">Notes</div><h3>${(x.notes && x.notes.length) ? `${x.notes.length} Note${x.notes.length === 1 ? '' : 's'} on File` : 'No Notes Yet'}</h3></div>${phone ? '<span class="tag amber">Phone screen — capture the call here</span>' : ''}</div>
    ${phone ? `<div class="notice"><strong>What to capture:</strong><br>Availability, commute/location, relevant experience, pay/schedule fit, attitude/reliability notes, and any red flags.</div>` : ''}
    <div class="note-composer"${phone ? ' style="margin-top:14px"' : ''}>
      <textarea id="noteInput" rows="${phone ? 4 : 3}" placeholder="${phone ? 'Phone screen notes — what did they say, what concerns came up, and what should happen next?' : 'Add a note — what was discussed, next step, anything to remember.'}"></textarea>
      <div class="note-composer-actions">
        <button class="btn brand" onclick="addNote()">Save note</button>
        <span class="muted small">${phone ? 'Saving marks the phone screen complete. Pick the outcome from the buttons up top when you’re done.' : 'Notes show up in the timeline and on the dashboard activity feed.'}</span>
      </div>
    </div>
    ${(x.notes && x.notes.length) ? `<div class="notes-list">${x.notes.slice().reverse().map(n => `<div class="note-row"><div class="note-row-meta"><strong>${esc(n.author || 'Recruiter')}</strong> · ${esc(formatRelativeShort(n.createdAt))}</div><p>${esc(n.text)}</p></div>`).join('')}</div>` : ''}
  </section>`;
}
// Single source of truth for the "what happens next" buttons shown in the hero.
// Every stage funnels through here so the candidate page has ONE action zone
// instead of decisions scattered between the hero and the stage panels.
function stageDecisionButtons(x){
  const review = reviewNextStepChoices(x);
  if(review) return review;
  if(['Phone screen invitation','Review phone screen'].includes(x.stage)) return [
    `<button class="btn primary" onclick="phoneScreenOutcome('weld')">Move to weld test</button>`,
    `<button class="btn" onclick="phoneScreenOutcome('additional')">Needs additional review</button>`,
    `<button class="btn" onclick="phoneScreenOutcome('hold')">Hold / not fit</button>`,
  ].join('');
  const custom = decisionActionsForStage(x.stage);
  if(custom.length) return custom.map(a => `<button class="btn ${a.primary?'primary':''}" onclick="${a.action}">${esc(a.label)}</button>`).join('');
  return `<button class="btn primary" onclick="advance()">Move to next stage</button>`;
}
function phoneScreenOutcome(choice){
  const x = c();
  const fromStage = x.stage;
  const options = {
    weld: { label:'Move to weld test', stage:isWelderPath(x)?'Weld test invitation':'Schedule interview', note:isWelderPath(x)?'Phone screen complete; candidate should move to weld test.':'Phone screen complete; candidate should move to the next interview step.' },
    additional: { label:'Needs additional review', stage:'Manager review packet', note:'Phone screen complete; candidate needs additional review before moving forward.' },
    hold: { label:'Hold / not fit', stage:'Keep on file', note:'Phone screen complete; candidate is being held or is not a current fit.' },
  };
  const picked = options[choice];
  if(!picked) return;
  if(x.stage !== picked.stage) x.stageUpdatedAt = nowISO();
  x.stage = picked.stage;
  const meta = stageMeta(picked.stage);
  x.owner = meta.owner;
  x.due = meta.due;
  // Recording an outcome means the phone screen is done — tick the checklist.
  x.evidence = x.evidence || {};
  x.evidence.phone = 'Complete';
  clearScreeningConcern(x);
  x.timeline.push(`Phone screen outcome: ${picked.label} → ${picked.stage}`);
  save();
  render();
  sendInternalRecruitingUpdate(x, fromStage, picked);
}
function reviewNextStepChoices(x){
  if(x.stage !== 'Review candidate / choose path') return '';
  const weldLabel = isWelderPath(x) ? 'Weld test' : 'Work sample / test';
  return [
    `<button class="btn primary" onclick="chooseReviewNextStep('phone')">Phone screen</button>`,
    `<button class="btn" onclick="chooseReviewNextStep('weld')">${esc(weldLabel)}</button>`,
    `<button class="btn" onclick="chooseReviewNextStep('quinton')">Needs additional review</button>`,
    `<button class="btn" onclick="chooseReviewNextStep('hold')">Hold / not fit</button>`,
  ].join('');
}
function setStage(s){ inlineEdit=null; let x=c(); if((s==='BBSI documents invite' || s==='Transition to onboarding workflow') && !clearanceReady(x)){ x.timeline.push('Blocked onboarding handoff: pre-employment clearance incomplete'); save(); showGuardrail(); return; } if(s==='Transition to onboarding workflow'){ moveToOnboarding(); return; } if(x.stage !== s) x.stageUpdatedAt = nowISO(); x.stage=s; const meta=stageMeta(s); x.owner=meta.owner; x.due=meta.due; x.timeline.push('Stage changed to '+s); save(); render(); }
function advance(){ let x=c(); const next = NEXT[x.stage] || 'Manager review packet'; setStage(next); }
function chooseReviewNextStep(choice){
  const x=c();
  const fromStage = x.stage;
  const options = {
    phone: { label:'Phone screen', stage:'Phone screen invitation', note:'Candidate should be screened by phone before scheduling the next step.' },
    weld: { label:isWelderPath(x)?'Weld test':'Work sample / test', stage:isWelderPath(x)?'Weld test invitation':'Schedule interview', note:isWelderPath(x)?'Candidate looks ready for a weld test invitation.':'Candidate should move to the next practical evaluation step.' },
    quinton: { label:'Needs additional review', stage:'Manager review packet', note:'Candidate needs additional review before moving forward.' },
    hold: { label:'Hold / not fit', stage:'Keep on file', note:'Candidate is being held or is not a current fit.' },
  };
  const picked = options[choice];
  if(!picked) return;
  if(x.stage !== picked.stage) x.stageUpdatedAt = nowISO();
  x.stage = picked.stage;
  const meta = stageMeta(picked.stage);
  x.owner = meta.owner;
  x.due = meta.due;
  x.timeline.push(`Next step chosen: ${picked.label} → ${picked.stage}`);
  save();
  render();
  sendInternalRecruitingUpdate(x, fromStage, picked);
}
async function sendInternalRecruitingUpdate(x, fromStage, picked){
  try{
    const r = await fetch('/api/goff-recruiting/internal-update', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        candidate:{ id:x.id, first:x.first, last:x.last, name:`${x.first} ${x.last}`.trim(), role:x.role, email:x.email, phone:x.phone, fromStage },
        decision:picked,
      }),
    });
    if(!r.ok) throw new Error('internal update failed');
    const current = candidates.find(cand => cand.id === x.id);
    if(current){ current.timeline.push(`Internal update emailed to careers@goffwelding.com: ${picked.label}`); save(); render(); }
    showToast('Internal update emailed to careers@goffwelding.com');
  }catch(err){
    console.warn('[goff-recruiting] internal update failed:', err);
    const current = candidates.find(cand => cand.id === x.id);
    if(current){ current.timeline.push(`Internal update email failed: ${picked.label}`); save(); render(); }
    showToast('Next step saved — internal email failed');
  }
}
function setClearance(k,v){
  let x=c();
  x.clearance[k]=v;
  // Background is ONE fact shown in two places (hero side-check pill and the
  // clearance card) — marking it here ticks the side check too, so the
  // recruiter never has to record the same thing twice.
  if(k==='background'){ x.evidence=x.evidence||{}; x.evidence.background=v; }
  x.timeline.push(`Clearance updated: ${k} = ${v}`);
  save(); render();
}
// Turn a merged template into a one-click send. Gmail compose (Goff uses
// Google Workspace) opens pre-filled from the recruiter's careers@ account —
// real deliverability and replies, zero infrastructure. Mailto covers other
// clients. True in-portal Resend send is the fast-follow once goffwelding.com
// is domain-verified.
function parseTemplate(text){
  const m = String(text).match(/^Subject:\s*(.+?)\n\n?([\s\S]*)$/);
  return m ? { subject: m[1].trim(), body: m[2] } : { subject: 'Goff Welding', body: String(text) };
}
function openUrl(url, newTab){ const a=document.createElement('a'); a.href=url; if(newTab){ a.target='_blank'; a.rel='noopener'; } document.body.appendChild(a); a.click(); a.remove(); }
function sendCandidateEmail(via){
  const x=c();
  const ta=document.querySelector('.modal-card textarea');
  const { subject, body } = parseTemplate(ta ? ta.value : '');
  const to = x.email || '';
  if(!to){ showToast('No email on file for this candidate'); return; }
  // Gmail-only. A mailto: fallback existed but macOS handed it to the browser
  // itself (hijacking the current tab) and the click still logged 'emailed' —
  // worse than useless. Goff runs Google Workspace; Gmail compose is the path.
  const url = 'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(to)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  openUrl(url, true);
  x.timeline.push('Emailed candidate (Gmail): '+subject);
  // Record that this stage's email went out — flips "Waiting on" from the
  // recruiter back to the candidate and demotes the send button.
  x.emailedStages = x.emailedStages || [];
  if(!x.emailedStages.includes(x.stage)) x.emailedStages.push(x.stage);
  save();
  document.getElementById('modal').className='modal'; render();
  showToast('Opening Gmail — just hit Send');
}
function mergeKey(key,x){ const body=TEMPLATE_TEXT[key] || TEMPLATE_TEXT['Manager Review Packet']; return body.replaceAll('{{first}}',x.first).replaceAll('{{last}}',x.last).replaceAll('{{role}}',x.role).replaceAll('{{source}}',x.source).replaceAll('{{stage}}',x.stage).replaceAll('{{summary}}',x.summary).replaceAll('{{concerns}}',realConcern(x) || 'None noted').replaceAll('{{roleFit}}',roleFit(x)); }
function merge(stage,x){ return mergeKey(stageMeta(stage).template, x); }
function showDraft(stage){ let x=c(); const stageTpl=stageMeta(stage).template; document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Email the candidate</h3><p>Defaults to the template for their current stage — switch to any other Goff template below. Review or edit, then open it pre-filled in Gmail and hit Send. It sends from your own careers@ account — replies come back to you.</p><label class="muted small draft-tpl-label">Template</label><select class="stage-select draft-tpl" onchange="document.querySelector('.modal-card textarea').value=mergeKey(this.value,c())">${Object.keys(TEMPLATE_TEXT).map(k=>`<option ${k===stageTpl?'selected':''}>${esc(k)}</option>`).join('')}</select><textarea>${merge(stage,x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn" onclick="copyToClipboard(document.querySelector('.modal-card textarea').value)">Copy</button><button class="btn brand" onclick="sendCandidateEmail('gmail')">Open in Gmail →</button></div></div>`; }
function markDraft(){ c().timeline.push('Email draft generated for '+c().stage); save(); document.getElementById('modal').className='modal'; render(); }
function showGuardrail(){ document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>BBSI handoff blocked</h3><p>Goff’s BBSI ATS SOP says <strong>Offer Accepted = not cleared</strong> and <strong>Onboarding = fully cleared</strong>. Complete drug screen, background, and start date before BBSI onboarding.</p><div class="modal-actions"><button class="btn brand" onclick="document.getElementById('modal').className='modal';render()">Review clearance checklist</button></div></div>`; }
function employeePortalLink(){
  // Live employee portal. portal.goffwelding.com is NOT connected yet (DNS still
  // on LinkNow), so build the working link from the current origin. On
  // stoke-ai.com this yields https://stoke-ai.com/goff-employee/.
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.startsWith('file'))
    ? window.location.origin : 'https://stoke-ai.com';
  return `${origin}/goff-employee/`;
}
function employeeWelcomeDraft(x=c()){ const url=fullEmployeePortalUrl(x); return `Subject: Welcome to Goff Welding — Start Here\n\nHi ${x.first},\n\nWelcome to Goff Welding. We’re excited to have you moving forward with us.\n\nYour next step is to complete your BBSI/myBBSI onboarding invite and use the Goff employee portal below for your first-day details, required resources, ExakTime/timekeeping instructions, safety orientation, tool list, and company links.\n\nEmployee portal: ${url}\n\nFirst day: ${x.offer?.startDate || '[confirm start date]'}\nSchedule: ${x.offer?.schedule || '[confirm schedule]'}\nSupervisor: ${x.offer?.supervisor || '[confirm supervisor]'}\n\nIf your myBBSI invite expires or you have questions, reply here or email careers@goffwelding.com.\n\nThank you,\nGoff Welding Hiring Team`; }
function showEmployeeWelcomeDraft(){ const x=c(); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Employee portal welcome message</h3><p>Send after clearance is complete and the BBSI invite is ready. This is the handoff from recruiting into the employee site.</p><textarea>${employeeWelcomeDraft(x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn brand" onclick="sendCandidateEmail('gmail')">Open in Gmail →</button></div></div>`; }
function moveToOnboarding(){
  const x=c();
  if(!clearanceReady(x)){ showGuardrail(); return; }
  const record = upsertOnboardingRecord(x);
  if(x.stage !== 'Transition to onboarding workflow') x.stageUpdatedAt = nowISO();
  x.stage = 'Transition to onboarding workflow';
  const meta = stageMeta(x.stage);
  x.owner = meta.owner;
  x.due = meta.due;
  x.timeline.push(`Moved to onboarding queue: ${record.name}`);
  save();
  document.getElementById('modal').className='modal open';
  document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Moved to onboarding</h3><p>${esc(record.name)} is now visible in the employee portal Admin control queue.</p><div class="notice success"><strong>Next action:</strong><br>${esc(record.next)}</div><div class="handoff-grid"><div><span>Stage</span><strong>${esc(record.stage)}</strong></div><div><span>Supervisor</span><strong>${esc(record.supervisor)}</strong></div><div><span>Start</span><strong>${esc(record.start)}</strong></div></div><textarea>${employeeWelcomeDraft(x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal';render()">Done</button><button class="btn" onclick="window.open('/goff-employee/?admin=1','_blank','noopener')">Open admin queue</button><button class="btn brand" onclick="copyToClipboard(employeePortalLink())">Copy employee link</button></div></div>`;
}
function generateEmployeePortalAccess(){ moveToOnboarding(); }
function manager(){
  const queue = candidates.filter(a => a.stage === 'Manager review packet' || a.stage === 'Offer letter info request');
  if(!queue.length){
    return `${head('Manager review','No candidates need a hiring-manager decision right now. New review packets show up here as soon as the recruiter finishes the interview + reference loop.')}
    <section class="panel decisions-empty">
      <div class="eyebrow eyebrow-decisions">Manager review</div>
      <h3>Queue is empty.</h3>
      <p class="muted">When a candidate is flagged ready for a hiring-lead call, they will appear here with a decision-ready packet.</p>
      <button class="btn" onclick="view='dashboard';render()">Back to dashboard</button>
    </section>`;
  }
  // Default selection: whoever was clicked OR the first in queue.
  let active = queue.find(a => a.id === selectedId) || queue[0];
  selectedId = active.id;
  const ageText = stageAgeText(active);
  const customDecisions = decisionActionsForStage(active.stage);
  return `${head('Manager review',`${queue.length} candidate${queue.length===1?'':'s'} waiting for a hiring-manager decision.`,`<button class="btn ghost" onclick="view='dashboard';render()">← Back to dashboard</button>`)}
  <div class="grid manager-grid">
    <aside class="panel manager-queue">
      <div class="eyebrow eyebrow-decisions">Review queue</div>
      <h3>${queue.length} packet${queue.length===1?'':'s'} ready</h3>
      <div class="manager-queue-list">${queue.map(p => `<button class="manager-queue-item ${p.id===active.id?'selected':''}" onclick="selectedId=${p.id};render()">
        <strong>${esc(p.first)} ${esc(p.last)}</strong>
        <small>${esc(p.role)} · ${esc(p.path)}</small>
        <div class="manager-queue-meta"><span class="tag red">${esc(p.stage)}</span><span class="aging-pill ${agingLevel(p)}">${esc(stageAgeText(p))} waiting</span></div>
      </button>`).join('')}</div>
    </aside>
    <section class="panel manager-packet">
      <div class="manager-packet-head">
        <div>
          <div class="eyebrow">Review packet</div>
          <h3>${esc(active.first)} ${esc(active.last)} — ${esc(active.role)}</h3>
          <p class="muted">${esc(active.source)} · ${esc(active.path)} · Waiting ${esc(ageText)} on you</p>
        </div>
      </div>
      <h4>Role expectations</h4>
      <p>${esc(roleFit(active))}</p>
      <h4>Summary</h4>
      <p>${esc(active.summary)}</p>
      ${realConcern(active) ? `<div class="notice warning"><strong>Concern to resolve:</strong> ${esc(realConcern(active))}</div>` : ''}
      <h4>Evidence checklist</h4>
      ${evidenceTable(active)}
      <h4 style="margin-top:18px">Decision</h4>
      <div class="manager-decision-actions">
        ${(customDecisions.length ? customDecisions : [
          { label:'Approve — start offer', action:"setStage('Offer letter info request')", primary:true },
          { label:'Second interview', action:"setStage('Second interview request')" },
          { label:'Needs more experience', action:"setStage('Needs more experience')" },
          { label:'Pass', action:"setStage('Not selected')" },
        ]).map(a => `<button class="btn ${a.primary?'primary':''}" onclick="${a.action}">${esc(a.label)}</button>`).join('')}
        <button class="btn ghost" onclick="view='candidate';render()">Open full candidate →</button>
      </div>
    </section>
  </div>`;
}
// Sidebar "Offer workflow" is a QUEUE, not a page for one person. It lists
// everyone currently in offer/clearance stages; clicking a row opens THAT
// candidate's offer builder. (Previously the nav item silently opened the
// builder for whichever candidate happened to be selected last — with several
// offers in flight there was no way to see or switch between them.)
const OFFER_QUEUE_STAGES = ['Offer letter info request','Offer letter draft','Offer sent / follow-up','Offer accepted - clearance hold','BBSI documents invite','Schedule first day'];
function offerStatusSummary(x){
  const o=x.offer||{};
  const missing=offerMissing(x);
  if(missing.length) return {label:`${missing.length} field${missing.length===1?'':'s'} to fill`, cls:'amber'};
  if(!o.generatedAt) return {label:'Ready to generate letter', cls:'amber'};
  if(!o.signaturesRouted) return {label:'Letter generated — route signatures', cls:'amber'};
  if(!(x.emailedStages||[]).includes(x.stage) && ['Offer letter draft','Offer sent / follow-up'].includes(x.stage)) return {label:'Signatures routed — send it', cls:'amber'};
  if(x.stage==='Offer accepted - clearance hold') return clearanceReady(x) ? {label:'Cleared — move to onboarding', cls:'green'} : {label:'Accepted — clearance in progress', cls:'amber'};
  return {label:'In motion', cls:'green'};
}
function offersQueue(){
  const queue = candidates.filter(x=>OFFER_QUEUE_STAGES.includes(x.stage));
  if(!queue.length) return `${head('Offer workflow','No candidates are in the offer or clearance stages right now. When someone reaches Manager review → approve, they show up here.',`<button class="btn ghost" onclick="view='dashboard';render()">← Back to dashboard</button>`)}
    <section class="panel"><div class="notice"><strong>Nothing in the offer pipeline.</strong><br>Candidates land here from "Approve — start offer" in Manager review. Open a candidate and advance them to see this queue in action.</div></section>`;
  return `${head('Offer workflow',`${queue.length} candidate${queue.length===1?'':'s'} in the offer & clearance stages. Open one to build, send, and clear their offer.`,`<button class="btn ghost" onclick="view='dashboard';render()">← Back to dashboard</button>`)}
  <div class="offer-queue">${queue.map(x=>{
    const st=offerStatusSummary(x);
    return `<section class="panel offer-queue-row" onclick="selectedId=${x.id};view='offer';render()">
      <div class="oq-who"><strong>${esc(x.first)} ${esc(x.last)}</strong><small>${esc(x.role)}</small></div>
      <div class="oq-stage"><span class="tag dark">${esc(titleCase(x.stage))}</span><small class="muted">${esc(stageAgeText(x))} in stage</small></div>
      <div class="oq-status"><span class="tag ${st.cls}">${esc(st.label)}</span></div>
      <button class="btn primary" onclick="event.stopPropagation();selectedId=${x.id};view='offer';render()">Open offer builder →</button>
    </section>`;
  }).join('')}</div>`;
}
function offer(){
  const x=c();
  const missing=offerMissing(x);
  const o=x.offer||{};
  return `${head('Offer letter workflow',`Building the offer for ${esc(x.first)} ${esc(x.last)} (${esc(x.role)}). Save verified details, preview the letter, then download or print.`,`<div class="head-actions"><button class="btn ghost" onclick="view='offers';render()">← All offers</button><button class="btn ghost" onclick="view='candidate';render()">← Back to candidate</button></div>`)}
  <div id="offerBanner">${offerBannerHTML(missing)}</div>
  <div class="grid two" style="margin-top:16px">
    <section class="panel">
      <div class="section-head"><h3>Offer details</h3><span class="muted">Verified by Hiring Manager + Core Members</span></div>
      <div class="form offer-form" oninput="updateOfferLive()" onchange="updateOfferLive()">
        <fieldset class="offer-fieldset">
          <legend>Position</legend>
          <label class="field-label">Offer letter date <span class="req">required</span><input id="offerDate" type="date" value="${esc(o.date)}"></label>
          <label class="field-label">Expected start date <span class="req">required</span><input id="offerStart" type="date" value="${esc(o.startDate)}"></label>
          <label class="field-label">Supervisor / reports to <span class="req">required</span><input id="offerSupervisor" placeholder="Supervisor name" value="${esc(o.supervisor)}"></label>
          <label class="field-label">Employment type<select id="offerEmploymentType"><option ${o.employmentType==='Full-Time'?'selected':''}>Full-Time</option><option ${o.employmentType==='Part-Time'?'selected':''}>Part-Time</option><option ${o.employmentType==='Temporary'?'selected':''}>Temporary</option></select></label>
        </fieldset>
        <fieldset class="offer-fieldset">
          <legend>Compensation &amp; hours</legend>
          <label class="field-label">Starting pay <span class="req">required</span><input id="offerPay" placeholder="e.g. $28.00" value="${esc(o.pay)}"></label>
          <label class="field-label">Minimum hours per week <span class="req">required</span><input id="offerMinHours" placeholder="40" value="${esc(o.minHours)}"></label>
          <label class="field-label">Regular scheduled hours <span class="req">required</span><input id="offerSchedule" placeholder="e.g. 6:00 AM–2:30 PM" value="${esc(o.schedule)}"></label>
          <p class="muted small">SOP: regular hours should fall between 6:00 AM and 6:00 PM.</p>
        </fieldset>
        <fieldset class="offer-fieldset">
          <legend>Approvers</legend>
          <p class="muted small" style="margin:0 0 10px">Austin requires the signatures of those approving the hire — both names appear as signature lines on the letter.</p>
          <label class="field-label">Core Member 1 <span class="req">required</span><input id="offerCore1" placeholder="e.g. Austin Goff" value="${esc(o.coreMember1 || '')}"></label>
          <label class="field-label">Core Member 2 <span class="req">required</span><input id="offerCore2" placeholder="e.g. Quinton Evans" value="${esc(o.coreMember2 || '')}"></label>
          <label class="field-label">Offer valid for (days)<input id="offerValidity" placeholder="30" value="${esc(o.validityDays)}"></label>
          <label class="field-label">Conditions / internal notes<textarea id="offerNotes" rows="3" placeholder="Anything to record before sending">${esc(o.notes)}</textarea></label>
        </fieldset>
        <button class="btn brand" onclick="saveOffer()">Save offer details</button>
      </div>
    </section>
    <section class="panel">
      <h3>Generate &amp; send</h3>
      <div class="offer-actions">
        <button class="btn primary big" onclick="previewOfferLetter()">Preview actual letter →</button>
        <div class="offer-actions-row">
          <button class="btn" onclick="downloadOfferLetterDoc()">Download .doc</button>
          <button class="btn" onclick="printOfferLetter()">Print / Save PDF</button>
        </div>
        <button class="btn primary" onclick="emailOfferLetter()">✉ Email offer letter to candidate</button>
        <button class="btn brand" onclick="markOfferSent()">Mark offer sent → move to follow-up</button>
      </div>
      <h4 style="margin-top:22px">Offer SOP checklist</h4>
      <div class="steps" id="offerChecklist">${offerStepsHTML(o, x)}</div>
    </section>
  </div>
  <section class="panel" style="margin-top:16px"><h3>Pre-employment clearance guardrail</h3>${clearancePanel(x)}</section>`;
}
function saveOffer(){ syncOfferFromForm(); c().timeline.push('Offer details saved for generated offer letter'); save(); render(); showToast('Offer details saved'); }
const OFFER_REQUIRED = [['date','Offer date','offerDate'],['startDate','Expected start date','offerStart'],['supervisor','Supervisor','offerSupervisor'],['pay','Starting pay','offerPay'],['minHours','Minimum hours','offerMinHours'],['schedule','Scheduled work hours','offerSchedule'],['coreMember1','Core Member 1 (approver)','offerCore1'],['coreMember2','Core Member 2 (approver)','offerCore2']];
function offerMissingOf(o){ return OFFER_REQUIRED.filter(([k])=>!String((o||{})[k]||'').trim()).map(([,label])=>label); }
function offerMissing(x){ return offerMissingOf(x.offer||{}); }
// Read the offer form straight from the DOM (null when not on the offer view).
// Lets the banner/checklist update live and lets every action auto-save, so
// typed-but-unsaved fields can never produce a letter full of blanks.
function offerFormValues(){
  const el=id=>document.getElementById(id);
  if(!el('offerDate')) return null;
  return { date:el('offerDate').value, startDate:el('offerStart').value, supervisor:el('offerSupervisor').value, employmentType:el('offerEmploymentType').value, pay:el('offerPay').value, minHours:el('offerMinHours').value, schedule:el('offerSchedule').value, coreMember1:el('offerCore1').value, coreMember2:el('offerCore2').value, validityDays:el('offerValidity').value||'30', notes:el('offerNotes').value };
}
const OFFER_LETTER_FIELDS = ['date','startDate','supervisor','employmentType','pay','minHours','schedule','validityDays','coreMember1','coreMember2'];
function offerLetterFieldsChanged(o, vals){ return OFFER_LETTER_FIELDS.some(k=>String((o||{})[k]||'')!==String(vals[k]||'')); }
function syncOfferFromForm(){
  const vals=offerFormValues(); if(!vals) return;
  const x=c();
  // Changing anything that appears IN the letter invalidates a previously
  // generated file — step 3 un-checks and forces a re-download so the signed
  // copy can't silently drift from what's in the system. Internal notes
  // don't appear in the letter, so they don't invalidate it.
  if(x.offer.generatedAt && offerLetterFieldsChanged(x.offer, vals)){
    x.offer.generatedAt=null;
    x.offer.signaturesRouted=false;
    x.timeline.push('Offer details changed after letter was generated — regenerate before sending');
  }
  x.offer={...x.offer, ...vals, approvers:[vals.coreMember1,vals.coreMember2].filter(Boolean).join(', ')};
  save();
}
function offerBannerHTML(missing){
  return missing.length
    ? `<div class="notice warning"><strong>${missing.length} field${missing.length===1?'':'s'} missing before this offer can be sent:</strong> ${missing.map(esc).join(' · ')}</div>`
    : `<div class="notice success"><strong>All required fields are present.</strong> You can preview and send.</div>`;
}
function offerStepsHTML(o, x){
  const missing=offerMissingOf(o);
  const step=(done,title,body)=>`<div class="step ${done?'done':''}"><b>${done?'✓ ':''}${title}</b><br><small>${body}</small></div>`;
  return step(missing.length===0,'1. Verify request', missing.length===0?'All required offer fields are filled in.':`Still needed: ${missing.map(esc).join(', ')}.`)
    + step(!!String(o.schedule||'').trim(),'2. Confirm hours','SOP says regular hours should fall between 6:00 AM and 6:00 PM.')
    + step(!!o.generatedAt,'3. Generate letter', o.generatedAt?'Letter has been downloaded/printed.':'Download Word-compatible .doc or print/save PDF.')
    + `<div class="step ${o.signaturesRouted?'done':''}"><b>${o.signaturesRouted?'✓ ':''}4. Route signatures</b><br><small>Upload the generated PDF/DOC to Goff's e-signature service and assign candidate + approver fields. (SOP says DocHub — confirm with Cecilia which service she actually uses.)</small><br><button class="btn step-btn" onclick="toggleSignaturesRouted()">${o.signaturesRouted?'Undo':'Mark signatures routed'}</button></div>`;
}
function toggleSignaturesRouted(){ const x=c(); x.offer.signaturesRouted=!x.offer.signaturesRouted; x.timeline.push(x.offer.signaturesRouted?'Offer signatures routed via DocHub':'Offer signature routing un-marked'); save(); render(); }
function updateOfferLive(){
  const vals=offerFormValues(); if(!vals) return;
  const x=c(); const merged={...x.offer, ...vals};
  if(merged.generatedAt && offerLetterFieldsChanged(x.offer, vals)){ merged.generatedAt=null; merged.signaturesRouted=false; }
  const banner=document.getElementById('offerBanner'); if(banner) banner.innerHTML=offerBannerHTML(offerMissingOf(merged));
  const steps=document.getElementById('offerChecklist'); if(steps) steps.innerHTML=offerStepsHTML(merged, x);
}
// Real in-portal send: the portal emails the candidate with the generated
// letter attached (Gmail compose links can't carry attachments). Guarded the
// same way as marking sent — complete fields + a freshly generated letter.
async function emailOfferLetter(){
  syncOfferFromForm();
  const x=c();
  const missing=offerMissing(x);
  if(missing.length){ showToast(`Fill the ${missing.length} missing field${missing.length===1?'':'s'} first`); render(); return; }
  if(!x.offer.generatedAt){ showToast('Generate the letter first (Download .doc or Print/PDF) so the attached copy matches'); return; }
  if(!x.email){ showToast('No email on file for this candidate'); return; }
  if(!window.confirm(`Email the offer letter to ${x.first} ${x.last} <${x.email}> now?`)) return;
  const html=offerLetterHTML(x,true);
  const b64=btoa(unescape(encodeURIComponent(html)));
  try{
    const r=await fetch('/api/goff-recruiting/offer-email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({to:x.email,candidate:`${x.first} ${x.last}`,role:x.role,attachment:b64,filename:`goff-offer-letter-${safeFileName(x.first+'-'+x.last)}.doc`})});
    const data=await r.json().catch(()=>({}));
    if(!r.ok){ showToast(data.error||'Send failed — download and email it from Gmail instead'); return; }
    x.timeline.push(`Offer letter emailed to ${x.email} (letter attached)`);
    x.emailedStages=x.emailedStages||[];
    if(!x.emailedStages.includes(x.stage)) x.emailedStages.push(x.stage);
    save(); render();
    showToast('Offer letter sent ✉ — mark offer sent when you are ready');
  }catch(_){ showToast('Send failed — download and email it from Gmail instead'); }
}
function markOfferSent(){
  syncOfferFromForm();
  const missing=offerMissing(c());
  if(missing.length){ showToast(`Can't mark sent — ${missing.length} required field${missing.length===1?'':'s'} still missing`); render(); return; }
  setStage('Offer sent / follow-up');
}
// Goff logo embedded as base64 so the letter renders it everywhere —
// including the downloaded .doc opened offline in Word, where a linked
// image URL would break. Red-on-transparent sits correctly on white paper.
const GOFF_LOGO_DATA='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAAC+CAYAAADTLnGtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4RUQyMDlBMEVBNDQxMUVCQTFDREJERkY2RDk1NUE1QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4RUQyMDlBMUVBNDQxMUVCQTFDREJERkY2RDk1NUE1QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhFRDIwOTlFRUE0NDExRUJBMUNEQkRGRjZEOTU1QTVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhFRDIwOTlGRUE0NDExRUJBMUNEQkRGRjZEOTU1QTVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7lrZcQAAOtBJREFUeNrsXQeU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';
function offerLetterHTML(x, print=false){ const o=x.offer||{}; const candidate=`${x.first} ${x.last}`; const missing=offerMissing(x); return `<!doctype html><html><head><meta charset="utf-8"><title>Goff Offer Letter - ${esc(candidate)}</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.45;margin:0;background:${print?'#fff':'#eee'}}.page{max-width:820px;margin:${print?'0':'28px auto'};background:#fff;padding:56px 64px;box-shadow:${print?'none':'0 18px 44px rgba(0,0,0,.16)'}}.letterhead{display:flex;justify-content:space-between;border-bottom:4px solid #c40012;padding-bottom:16px;margin-bottom:28px}.brand{font-weight:900;font-size:24px}.addr{text-align:right;font-size:12px;line-height:1.35}.section-title{font-weight:900;margin-top:18px}.siggrid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:34px}.line{border-top:1px solid #111;padding-top:6px;min-height:28px}.missing{background:#fff7e8;border-left:5px solid #a15c00;padding:12px;margin:0 0 18px}.muted{color:#555;font-size:12px}.toolbar{max-width:820px;margin:20px auto 0;display:flex;gap:10px}.btn{border:0;background:#c40012;color:#fff;padding:10px 14px;font-weight:800;border-radius:4px}@media print{.toolbar,.missing{display:none}.page{box-shadow:none;margin:0;padding:36px}}</style></head><body>${print?'':`<div class="toolbar"><button class="btn" onclick="window.print()">Print / Save PDF</button></div>`}<main class="page">${missing.length?`<div class="missing"><strong>Missing before sending:</strong> ${missing.map(esc).join(', ')}</div>`:''}<div class="letterhead"><div><img src="${GOFF_LOGO_DATA}" alt="Goff Welding" style="height:84px;display:block;margin-bottom:8px"><div class="muted">OFFER LETTER</div></div><div class="addr">531 W 100 S #22<br>Paul, Idaho 83347<br>Phone (208) 647-2488<br>info@goffwelding.com</div></div><p><strong>Date:</strong> ${esc(o.date||'__________')}</p><p>Dear ${esc(candidate)},</p><p>Congratulations! Goff Welding LLC is pleased to extend this offer of employment for the position of <strong>${esc(x.role||'__________')}</strong> with an anticipated start date of <strong>${esc(o.startDate||'__________')}</strong>.</p><p>This offer is contingent upon the successful completion of a background check, drug screening, and verification of your eligibility to work in the United States. Please review this summary of terms and conditions for your anticipated employment with us.</p><p class="section-title">Position</p><p>You will report directly to <strong>${esc(o.supervisor||'__________')}</strong>. This is a <strong>${esc(o.employmentType||'__________')}</strong> position.</p><p class="section-title">Compensation & Hours</p><p>You will be compensated at a rate of <strong>${esc(o.pay||'__________')}</strong> per hour, with payroll issued on a weekly basis each Friday.</p><p>This is a <strong>${esc(o.employmentType||'__________')}</strong> job that will require you to work a minimum of <strong>${esc(o.minHours||'____')}</strong> hours per week. Your typical schedule will fall between the hours of <strong>${esc(o.schedule||'__________')}</strong>, subject to workload.</p><p class="section-title">Benefits</p><p>You will become eligible for company sponsored insurance benefits after 60 days of employment, in accordance with plan terms.</p><p class="section-title">Training Investment</p><p>As part of our commitment to employee development, Goff Welding LLC may sponsor training programs. If you voluntarily resign within one (1) year of completing any company sponsored training, you agree to reimburse the company for the actual cost of such training.</p><p class="section-title">Employment Relationship</p><p>Your employment with Goff Welding LLC is at will, meaning that either you or the company may terminate the employment relationship at any time, with or without cause or notice.</p><p class="section-title">Offer Validity</p><p>This offer is valid for <strong>${esc(o.validityDays||'30')}</strong> calendar days from the date of this letter. If we do not receive your signed acceptance within this timeframe, the offer may be withdrawn.</p><p>We look forward to having you join the Goff Welding LLC team and believe you will find this opportunity both challenging and rewarding!</p><p>Sincerely,</p><p class="section-title">Approved by</p><div class="siggrid"><div><div class="line">${esc(o.coreMember1||'Core Member 1')} — Signature</div></div><div><div class="line">Date</div></div><div><div class="line">${esc(o.coreMember2||'Core Member 2')} — Signature</div></div><div><div class="line">Date</div></div></div><p style="margin-top:36px">I, <strong>${esc(candidate)}</strong>, have read and understand the provisions of this offer of employment and accept the above conditional job offer.</p><div class="siggrid"><div><div class="line">Candidate Signature</div></div><div><div class="line">Date</div></div><div><div class="line">Candidate Printed Name</div></div></div></main></body></html>`; }
function previewOfferLetter(){ syncOfferFromForm(); const x=c(); const html=offerLetterHTML(x); const missing=offerMissing(x); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card wide"><h3>Actual offer letter preview</h3><p>${missing.length?`Missing before send: ${missing.join(', ')}`:'All required offer fields are present.'}</p><iframe class="doc-preview" srcdoc="${esc(html)}"></iframe><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn" onclick="printOfferLetter()">Print / Save PDF</button><button class="btn brand" onclick="downloadOfferLetterDoc()">Download .doc</button></div></div>`; }
function downloadFile(filename, content, type='text/plain'){ const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},0); }
function safeFileName(s){ return String(s||'candidate').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'candidate'; }
function downloadOfferLetterDoc(){ syncOfferFromForm(); const x=c(); const html=offerLetterHTML(x,true); downloadFile(`goff-offer-letter-${safeFileName(x.first+'-'+x.last)}.doc`, html, 'application/msword'); x.offer.generatedAt=nowISO(); x.timeline.push('Generated offer letter document download'); save(); render(); }
function printOfferLetter(){ syncOfferFromForm(); const x=c(); x.offer.generatedAt=nowISO(); x.timeline.push('Offer letter opened for print / PDF'); save(); render(); const w=window.open('', '_blank'); w.document.write(offerLetterHTML(x, true)); w.document.close(); w.focus(); setTimeout(()=>w.print(),250); }
function showOfferPacket(){ previewOfferLetter(); }
function previewTemplate(name){
  const body = TEMPLATE_TEXT[name];
  if(!body){
    document.getElementById('modal').className='modal open';
    document.getElementById('modal').innerHTML = `<div class="modal-card"><h3>${esc(name)}</h3><p>This template is in the Goff Drive library but is not wired into the platform yet. We can add it once you confirm the wording.</p><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button></div></div>`;
    return;
  }
  // Render with the currently-selected candidate so the merge fields are visible.
  const x = c();
  const stagesUsing = WORKFLOW_STAGES.filter(s => s.template === name).map(s => s.id);
  document.getElementById('modal').className='modal open';
  document.getElementById('modal').innerHTML = `<div class="modal-card"><h3>${esc(name)}</h3>${stagesUsing.length ? `<p>Sent automatically at stage${stagesUsing.length===1?'':'s'}: <strong>${stagesUsing.map(esc).join(', ')}</strong>.</p>` : '<p>This template is mapped but not yet tied to any workflow stage.</p>'}<textarea>${esc(merge(stagesUsing[0] || x.stage, x))}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button></div></div>`;
}

function templates(){
  const used = new Set(WORKFLOW_STAGES.map(s => s.template));
  const installed = DRIVE_TEMPLATES.filter(t => TEMPLATE_TEXT[t] || used.has(t));
  const notMapped = DRIVE_TEMPLATES.filter(t => !used.has(t) && !TEMPLATE_TEXT[t]);
  return `${head('Installed templates','Every Drive template that drives this platform, with a preview using the currently-selected candidate.')}
  <div class="grid metrics">
    ${metric('Drive templates', DRIVE_TEMPLATES.length)}
    ${metric('Wired up', installed.length)}
    ${metric('Stage-driven', new Set(WORKFLOW_STAGES.map(s => s.template)).size)}
    ${metric('Needs mapping', notMapped.length)}
  </div>
  <section class="panel">
    <h3>Click any template to preview the actual text</h3>
    <p class="muted">Preview merges in the currently-selected candidate so you can see what would go out.</p>
    <div class="template-list">${DRIVE_TEMPLATES.map(t => {
      const isInstalled = installed.includes(t);
      return `<button class="template-row clickable" onclick="previewTemplate('${esc(t).replace(/'/g,"\\'")}')"><b>${esc(t)}</b><span class="tag ${isInstalled ? 'green' : 'amber'}">${isInstalled ? 'Installed' : 'Needs review'}</span></button>`;
    }).join('')}</div>
  </section>
  <section class="panel" style="margin-top:16px">
    <h3>How templates feed the platform</h3>
    <div class="steps">
      <div class="step"><b>Generate email</b><br><small>Each stage knows which template to use. Click "Generate email draft" on any candidate.</small></div>
      <div class="step"><b>Manager packets</b><br><small>Internal packet built from role fit, evidence, concerns, and next action.</small></div>
      <div class="step"><b>Offer workflow</b><br><small>Offer Letter SOP is represented as a checklist and generated packet.</small></div>
      <div class="step"><b>Guardrails</b><br><small>BBSI/onboarding movement is blocked until clearance is complete.</small></div>
    </div>
  </section>`;
}

function integrations(){
  // Live posture comes from env at build time; for now show what is wired.
  const apiWired = true; // /api/goff-recruiting/applications is live
  const telegramWired = false; // requires env vars in production
  const integrationCard = (name, status, description, action) => `<div class="integration-card ${status}">
    <div class="integration-card-head"><strong>${esc(name)}</strong><span class="status-pill ${status}">${status === 'live' ? 'Live' : status === 'pending' ? 'Needs config' : 'Planned'}</span></div>
    <p>${esc(description)}</p>
    ${action ? `<div class="muted small">${esc(action)}</div>` : ''}
  </div>`;
  return `${head('Setup &amp; status','What is wired up, what needs config, and what is planned. Each card shows the current state plus what it would take to flip it on or build it.',`<button class="btn ghost" onclick="view='dashboard';render()">← Back to dashboard</button>`)}
  <section class="panel">
    <h3>Active integrations</h3>
    <div class="integration-grid">
      ${integrationCard('Goff Careers page', 'live', 'Public apply form at /goff-recruiting (apply view). Every submission flows into the recruiting queue.', 'No setup needed — this is built in.')}
      ${integrationCard('Application intake API', apiWired ? 'live' : 'pending', 'Career-page submissions POST to /api/goff-recruiting/applications and persist server-side.', apiWired ? 'Wired up. Vercel Blob persistence.' : 'Set BLOB_READ_WRITE_TOKEN to enable persistence.')}
      ${integrationCard('Telegram intake alerts', telegramWired ? 'live' : 'pending', 'The hiring team receives a Telegram ping the moment an application lands.', 'Set GOFF_RECRUITING_TELEGRAM_BOT_TOKEN, _CHAT_ID, and optional _THREAD_ID in Vercel env.')}
      ${integrationCard('Indeed CSV import', 'live', 'Bulk import Indeed exports through the Add candidate screen.', 'No setup needed.')}
      ${integrationCard('Email / single paste import', 'live', 'Paste an Indeed email or applicant text and we parse it.', 'No setup needed.')}
      ${integrationCard('Indeed Partner ATS sync', 'planned', 'Direct Candidate Sync / Disposition Sync API. After Goff commits, we apply for partnership and wire it.', 'Phase 2 — requires Indeed approval and OAuth setup.')}
      ${integrationCard('BBSI handoff', 'planned', 'Post-clearance: payroll, I-9, onboarding paperwork. We hand off after offer-accept + clearance complete.', 'Today this is a manual handoff inside BBSI portal.')}
    </div>
    <p class="muted small" style="margin-top:18px">For the strategic view of how these channels fit together, see <strong>How it works → Where applicants come in</strong>.</p>
  </section>`;
}

function howItWorks(){
  return `${head('How Goff Recruiting works', 'A quick tour of the platform plus later improvements to prioritize after the core workflow is in use. Use this as the one-pager to share or read on a phone.', `<button class="btn" onclick="window.print()">Print this guide</button>`)}

  <section class="panel">
    <h3>What this is</h3>
    <p>Goff Recruiting gives the hiring team one queue from first application through onboarding handoff. It can live under the same Goff portal subdomain as onboarding/admin once DNS is ready.</p>
    <ul class="howto-list">
      <li><strong>Applicant path</strong> — <code>portal.goffwelding.com/careers</code> or <code>/apply</code> once DNS is connected. This is where applicants apply.</li>
      <li><strong>Admin path</strong> — <code>portal.goffwelding.com/admin</code>. This is where the Goff hiring team runs the queue day to day.</li>
    </ul>
  </section>

  <section class="panel">
    <h3>Where applicants come in</h3>
    <p>Goff has multiple intake channels feeding one queue:</p>
    <ul class="howto-list">
      <li><strong>Careers/apply page</strong> — apply form under <code>portal.goffwelding.com</code>.</li>
      <li><strong>Indeed</strong> — bulk CSV import or paste a single applicant.</li>
      <li><strong>Walk-ins, phone calls, referrals</strong> — quick-add by anyone on the team.</li>
    </ul>
    <p class="muted">Goff Recruiting runs the whole queue from first hello through offer accepted. BBSI takes over for payroll and paperwork only after clearance is complete.</p>
  </section>

  <section class="panel">
    <h3>How a candidate moves through the system</h3>
    <ol class="howto-flow">
      <li><strong>Application comes in</strong> — the team reviews and picks the path (Welder or Other).</li>
      <li><strong>Skills check</strong> — Welder path: weld test. Other path: phone screen.</li>
      <li><strong>Interview + references</strong> — interview, references, Crystal Knows.</li>
      <li><strong>Hiring decision</strong> — the hiring lead approves, asks for a second interview, or passes.</li>
      <li><strong>Offer &amp; onboarding</strong> — offer sent, candidate accepts, clearance items checked, BBSI takes over for paperwork.</li>
    </ol>
  </section>

  <section class="panel">
    <h3>What you see day-to-day</h3>
    <div class="howto-zones">
      <div class="howto-zone">
        <h4>Decisions needed</h4>
        <p>Candidates waiting on a hiring-lead call. One-tap buttons to approve, second-interview, or pass.</p>
      </div>
      <div class="howto-zone">
        <h4>Recent activity</h4>
        <p>The last six candidates that changed — stage moves and notes — with a time-ago stamp. Click to open.</p>
      </div>
      <div class="howto-zone">
        <h4>Pipeline by path</h4>
        <p>Welder funnel and Other funnel side by side. Click anyone's first-name chip to jump straight to them.</p>
      </div>
      <div class="howto-zone">
        <h4>Check before they go cold</h4>
        <p>Candidates sitting in a stage too long. Amber after 3 days, red after 5. Surfaces drift automatically.</p>
      </div>
      <div class="howto-zone">
        <h4>In motion</h4>
        <p>Everything moving normally — de-emphasized so the important stuff stays loud.</p>
      </div>
    </div>
  </section>

  <section class="panel">
    <h3>Later improvements to prioritize</h3>
    <p>These are not required for launch. They are follow-on improvements to prioritize after Goff starts using the core queue and we can see which problems actually hurt.</p>

    <h4 class="howto-subhead">Intake and quality</h4>

    <div class="howto-idea">
      <h5>One simple intake form for everyone</h5>
      <p>Walk-in at the door. Phone caller. Goff employee at a computer. Indeed applicant. They all use the same apply form under <code>portal.goffwelding.com</code>. It works on a phone, a tablet at the front desk, or a laptop. For walk-ins with a paper resume, snap a photo — the AI reads it, pre-fills the form (name, contact, role, experience, certifications), and files the original resume to the candidate record. No more sticky notes at the front desk and nothing lost to memory.</p>
    </div>

    <div class="howto-idea">
      <h5>Resume file upload</h5>
      <p>Applicants can attach their actual resume to the apply form (PDF, JPG, HEIC for phone photos). The file lives on the candidate record so the team can review it without digging through email.</p>
    </div>

    <div class="howto-idea">
      <h5>Indeed direct sync (no CSV step)</h5>
      <p>Skip the CSV export-import dance. Approved Indeed applicants flow straight into Goff Recruiting through their partner API. Requires a one-time Indeed approval to wire up; after that, intake is hands-off.</p>
    </div>

    <div class="howto-idea">
      <h5>Duplicate detection</h5>
      <p>When the same person applies via Indeed, then walks in two weeks later, then a friend refers them — that should be one candidate, not three. The system will check email and phone on every new application. If there is a match, a banner appears: <em>"Possible duplicate of [name] who applied 12 days ago for [role]."</em> Click to merge or keep separate. Stops the queue from cluttering with the same person showing up multiple times.</p>
    </div>

    <div class="howto-idea">
      <h5>Talent pool — re-engage past applicants</h5>
      <p>Past good applicants who did not get hired — anyone marked <em>"Keep on file"</em> — are gold. When a new welder opening pops up six months from now, the first move should not be a fresh Indeed sponsored post. It should be the talent pool. A dedicated view will list everyone marked Keep on file, filterable by the role they originally applied for, with a one-click <em>"Re-engage for [new opening]"</em> action that sends each one the right template. The system tracks who has been recontacted so nobody gets pestered twice.</p>
    </div>

    <div class="howto-idea">
      <h5>By-source report</h5>
      <p>Once Goff has 50+ applications running through the system, a single page will show which sources produce hires — not just applications. Indeed produces volume. Walk-ins often produce quality. Referrals usually produce both. Knowing the ratio shows the hiring team where to spend the Indeed budget, when to ask employees for referrals, and whether Facebook posts are worth the effort. A <em>"How did you hear about Goff?"</em> question gets added to the apply form now so the data captures cleanly from day one.</p>
    </div>

    <div class="howto-idea">
      <h5>Tags on candidates</h5>
      <p>Free-form labels per candidate — <em>"local referral," "bilingual," "has CDL," "Brandon's cousin," "passed weld test cold."</em> Tags show up as colored badges on the candidate card and become a filter chip on the Candidates list. Lets the team quickly group people by anything that matters to Goff specifically without having to bend the formal stage system.</p>
    </div>

    <div class="howto-idea">
      <h5>Print candidate one-pager</h5>
      <p>One-click print button on the candidate detail page. Generates a clean PDF-ready layout (profile, role, evidence checklist, notes, timeline) without the sidebar or app chrome. Useful for taking to an interview, handing off to a supervisor, or storing in a paper file.</p>
    </div>

    <h4 class="howto-subhead">Keeping everyone in the loop</h4>

    <div class="howto-idea">
      <h5>Instant applicant communications</h5>
      <p>The moment a candidate submits an application, they get an automatic confirmation: <em>"Thanks, [name]. We have your application. Most candidates hear back within 2 business days."</em> Pre-event reminders fire automatically too — 24 hours before an interview, 24 hours before a weld test, the day before a first day. Candidates who sit in a stage for a long time (because we are busy) get a polite <em>"still reviewing, hang tight"</em> auto-touch so they do not assume Goff ghosted them and take another offer.</p>
    </div>

    <div class="howto-idea">
      <h5>Hiring-team alerts that only fire when you are needed</h5>
      <p>The system only notifies a human when a decision is required. New manager review packet ready, offer accepted, offer declined, candidate replied to an outbound message. Routine stuff stays silent. A short morning digest summarizes what is on the team's plate today: <em>"1 candidate needs a hiring-lead call. 2 candidates drifting past 3 days. Pipeline otherwise clean."</em> A weekly summary recaps hires, offers out, and pipeline health. Less noise, more signal.</p>
    </div>

    <div class="howto-idea">
      <h5>One-tap approvals from your phone</h5>
      <p>Approve a candidate or sign off an offer from a tap on a text message, no login required. The notification includes a secure link straight to the review packet. Approve, second-interview, or pass — done in 15 seconds from the truck.</p>
    </div>

    <div class="howto-idea">
      <h5>SMS to candidates</h5>
      <p>Most welders do not check email. Texts get answered within an hour. Goff Recruiting will support sending pre-built SMS templates ("weld test invite," "interview confirm," "follow-up") directly from candidate cards, with replies showing up in the candidate timeline. Three setup options depending on what works for Goff: send from a personal phone with a one-click "logged" button on the candidate card; a shared work number (OpenPhone, Dialpad, or similar) that everyone on the recruiting side can use; or a dedicated number integrated directly into the platform. Goff picks based on volume and preference.</p>
    </div>

    <div class="howto-idea">
      <h5>Email and SMS conversation threads</h5>
      <p>Every email or text exchanged with a candidate shows up as a threaded conversation on the candidate's profile — like an inbox tied to the candidate. No more scrolling through Quinton's personal email to remember what Tyler said three days ago. Replies auto-update the timeline and surface in the activity feed.</p>
    </div>

    <div class="howto-idea">
      <h5>Bulk actions on the Candidates list</h5>
      <p>Select multiple candidates at once and apply a single action: send the same template, advance them to the same stage, mark a batch <em>Not selected</em>, archive cold leads. Cuts the click-through cost when handling a wave of Indeed applications all at once.</p>
    </div>

    <h4 class="howto-subhead">Letting the system do more of the work</h4>

    <div class="howto-idea">
      <h5>Auto-drafted communications at every stage</h5>
      <p>When a candidate advances a stage, the matching email or SMS is already drafted with their info pre-filled. Review and send, or queue for later. No retyping the same template fifty times. AI-personalized versions reference the candidate's actual experience for higher response rates.</p>
    </div>

    <div class="howto-idea">
      <h5>AI-assisted screening at intake</h5>
      <p>At volume, AI ranks incoming applications by fit (stainless experience, location, role match, availability) so the hiring team can focus on the strongest candidates first. The bottom of the stack gets a polite auto-decline; the middle queues for human review with a one-line summary. Turns "drowning in Indeed apps" into "decide on the top five today."</p>
    </div>

    <div class="howto-idea">
      <h5>AI handles common candidate questions</h5>
      <p>Over SMS or email, the AI can answer routine candidate questions — <em>when is the weld test, where do I go, what should I bring, what is the pay</em> — automatically. It only escalates to a human when the question needs judgment. Frees up hours a week and gives candidates instant replies instead of waiting until the next business day.</p>
    </div>

    <div class="howto-idea">
      <h5>Voice-note debriefs that file themselves</h5>
      <p>After a phone screen or interview, record a 90-second voice note. The AI transcribes, fills in the candidate's summary, concerns, and suggested next stage. Cuts the "I will write up my notes later" backlog that always becomes "I forgot what we talked about."</p>
    </div>

    <div class="howto-idea">
      <h5>Calendar integration</h5>
      <p>Interviews, weld tests, and first days auto-add to the right calendar and send the candidate a meeting invite. No double-booking. No "wait, when was that?" Reminders fire from the calendar layer so the candidate AND the team get pinged the day before.</p>
    </div>

    <div class="howto-idea">
      <h5>Stage timers and auto-archive</h5>
      <p>Every stage has an expected timing. If a candidate sits past it, the system nudges the right person to act. If a candidate goes silent for 30+ days, they get a polite final message and auto-move to <em>Keep on file</em>. Active queue stays clean without anyone having to remember to prune it.</p>
    </div>

    <div class="howto-idea">
      <h5>Auto-trigger clearance and BBSI when an offer is accepted</h5>
      <p>The moment a candidate accepts, the drug screen scheduling email auto-drafts, the background check auto-drafts, and the first-day prep checklist generates. The clearance hold automatically unblocks once all three items are confirmed. Removes the "did anyone remember to schedule X?" gap between offer-accept and first day.</p>
    </div>

    <div class="howto-idea">
      <h5>Pipeline health alerts</h5>
      <p>Anomaly detection notices when hires slow down or applications dip below normal. Flags before it becomes a crisis: <em>"You usually hire one welder a month. Past two months: zero. Pipeline looks thin — boost Indeed budget or re-engage talent pool?"</em></p>
    </div>

    <div class="howto-idea">
      <h5>Compare candidates side by side</h5>
      <p>Pick two or three candidates and the system lays them out in columns — profile, evidence, concerns, pay expectations — so the hiring lead can make a head-to-head call without flipping between cards. Useful when two welders both pass weld test and the call is "which one?"</p>
    </div>

    <div class="howto-idea">
      <h5>Bilingual content (Spanish)</h5>
      <p>Apply form, candidate-facing emails, and the public careers page available in Spanish. A meaningful chunk of skilled welders in the region are bilingual or Spanish-first; bilingual outreach widens the funnel and signals that Goff is a welcoming shop. Internal admin stays English.</p>
    </div>
  </section>`;
}

render();
initCandidateSync();
loadCurrentUser();
initPositionsSync();
