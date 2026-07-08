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
  document.getElementById('app').innerHTML = `<div class="shell"><aside class="sidebar"><div class="brand"><img src="/goff-welding-logo.png" alt="Goff Welding" class="brand-logo"><p class="brand-subtitle">Recruiting Platform</p></div><nav class="nav">${nav('dashboard','Dashboard')}${nav('candidates','Candidates')}${nav('positions','Open Positions')}${nav('intake','Add candidate')}${nav('manager','Manager review')}${nav('offer','Offer workflow')}${nav('workflow','Full workflow')}${nav('templates','Templates')}${nav('integrations','Setup &amp; status')}${nav('how-it-works','How it works')}</nav><div class="side-card portal-links"><strong>One portal — other areas</strong><a href="/goff-employee/?section=start">Employee onboarding portal</a><a href="/goff-employee/?section=ops">Onboarding admin control</a><a href="/goff-employee/?section=admin">Austin review mode</a></div><div class="side-card"><strong>Today’s focus</strong><p>Keep qualified candidates moving through Goff’s actual recruiting steps: screen, weld test, interview, references, offer, clearance hold, and BBSI handoff.</p></div>${currentUser ? `<div class="signed-as"><span>Signed in as</span><b>${esc(currentUser.name)}</b><em>${esc((currentUser.roles||[]).join(' · ') || 'recruiter')}</em></div>` : `<div class="signed-as shared"><span>Shared login</span><b>goffadmin</b><em>ask Jeff for a personal login</em></div>`}<button class="sidebar-signout" onclick="signOut()">Sign out</button></aside><main class="content">${page()}</main></div><div id="modal" class="modal"></div>${feedbackWidget()}`;
}
function nav(id,label){ return `<button class="${view===id?'active':''}" onclick="view='${id}';render()">${label}</button>`; }
function head(title,sub,button=''){ return `<div class="topbar"><div><div class="eyebrow">Recruiting operations</div><h2>${title}</h2><p>${sub}</p></div>${button}</div>`; }
function emptyPipeline(){ return `${head('No candidates yet','Your pipeline is empty — add your first candidate to get started.','<button class=\"btn primary\" onclick="view=\'intake\';render()">Add candidate</button>')}<section class="panel"><div class="notice"><strong>Nothing here yet.</strong><br>Applications from the careers page land here automatically, or add someone manually with the button above. Once you have a candidate, their profile, manager review, and offer workflow open from the Candidates list.</div></section>`; }
function page(){
  if(isPublicCareersHost()) view = publicSafeView(view);
  // Candidate-detail views need a selected candidate; on an empty pipeline show
  // a friendly empty state instead of crashing.
  if(['candidate','manager','offer'].includes(view) && !c()) return emptyPipeline();
  return ({dashboard,intake,career,apply:applyView,thanks,candidate,candidates:candidateList,positions:positionsView,manager,offer,workflow,templates,integrations,'how-it-works':howItWorks}[view] || dashboard)();
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
function setEvidence(id,k,v){ const x=candidates.find(c=>c.id===id); if(!x) return; x.evidence=x.evidence||{}; x.evidence[k]=v; x.timeline.push(`Evidence updated: ${k} → ${v}`); save(); render(); }
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
function clearancePanel(x){ const ready=clearanceReady(x); return `<div class="notice ${ready?'success':'warning'}"><strong>${ready?'Clearance complete':'BBSI guardrail active'}</strong><br>Offer Accepted is a hold stage. Do not move to BBSI onboarding until drug screen, background, and start date are complete.</div><div class="mini-grid">${field('Drug screen',x.clearance.drug)}${field('Background',x.clearance.background)}${field('Start date',x.clearance.startDate)}</div><div class="actions tight"><button class="btn" onclick="setClearance('drug','Scheduled')">Drug scheduled</button><button class="btn" onclick="setClearance('drug','Passed')">Drug passed</button><button class="btn" onclick="setClearance('background','Cleared')">Background cleared</button><button class="btn" onclick="setClearance('background','N/A')">Background N/A</button><button class="btn" onclick="setClearance('startDate','Confirmed')">Start confirmed</button></div>`; }
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
  const showClearance = ['Offer accepted - clearance hold','BBSI documents invite','Offer sent / follow-up','Schedule first day','Transition to onboarding workflow'].includes(x.stage);
  const showOfferShortcut = ['Offer letter info request','Offer letter draft','Offer sent / follow-up'].includes(x.stage);
  const emailPending = stageEmailPending(x);
  // Role/path edits in place, right where the role is shown under the name.
  const roleSub = inlineEdit==='role'
    ? `<select class="stage-select inline-fix" onchange="changeCandidatePosition(this.value)"><option value="">Change position — ${esc(x.role)}…</option>${openJobs().map(job=>`<option value="${esc(job.id)}">${esc(job.title)}</option>`).join('')}</select> <select class="stage-select inline-fix" onchange="changeCandidatePath(this.value)"><option value="Welder path" ${x.path==='Welder path'?'selected':''}>Welder path</option><option value="Other path" ${x.path!=='Welder path'?'selected':''}>Other path</option></select> <button class="stage-fix" onclick="inlineEdit=null;render()">✕ cancel</button>`
    : `${esc(x.role)} · from ${esc(x.source)} · ${esc(x.path)} <button class="stage-fix" title="Change the position or career path" onclick="inlineEdit='role';render()">✎</button>`;
  return `${head(`${x.pinned ? '★ ' : ''}${esc(x.first)} ${esc(x.last)}`, roleSub,`<div class="head-actions"><button class="btn pin-toggle ${x.pinned ? 'pinned' : ''}" onclick="togglePin(${x.id})" title="${x.pinned ? 'Unpin' : 'Pin this candidate'}">${x.pinned ? '★ Pinned' : '☆ Pin'}</button><button class="btn ghost" onclick="view='dashboard';render()">← Back to dashboard</button></div>`)}
  <section class="panel candidate-hero">
    <div class="candidate-hero-contact" style="margin-top:0;padding-top:0;border-top:0">
      <a href="mailto:${esc(x.email)}?subject=${encodeURIComponent('Goff Welding — ' + x.role)}">✉ ${esc(x.email)}</a>
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
          : `<h3>${esc(x.stage)} <button class="stage-fix" title="Wrong stage? Change it right here." onclick="inlineEdit='stage';render()">✎</button></h3>`}
        <p class="muted">${meta.next ? `then: <strong>${esc(meta.next)}</strong>` : 'final step in this track'}</p>
      </div>
      <div class="candidate-hero-meta">
        <div class="hero-stat"><span>In stage</span><strong class="age-${ageLevel}">${esc(ageText)}</strong></div>
        <div class="hero-stat"><span>Waiting on</span><strong>${emailPending ? 'You — send the email' : esc(x.owner)}</strong></div>
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
    <div class="section-head"><div><div class="eyebrow">Notes</div><h3>${(x.notes && x.notes.length) ? `${x.notes.length} note${x.notes.length === 1 ? '' : 's'} on file.` : 'No notes yet.'}</h3></div>${phone ? '<span class="tag amber">Phone screen — capture the call here</span>' : ''}</div>
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
function setClearance(k,v){ let x=c(); x.clearance[k]=v; x.timeline.push(`Clearance updated: ${k} = ${v}`); save(); render(); }
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
  const url = via==='gmail'
    ? 'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(to)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)
    : 'mailto:'+encodeURIComponent(to)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  openUrl(url, via==='gmail');
  x.timeline.push('Emailed candidate ('+(via==='gmail'?'Gmail':'mail app')+'): '+subject);
  // Record that this stage's email went out — flips "Waiting on" from the
  // recruiter back to the candidate and demotes the send button.
  x.emailedStages = x.emailedStages || [];
  if(!x.emailedStages.includes(x.stage)) x.emailedStages.push(x.stage);
  save();
  document.getElementById('modal').className='modal'; render();
  showToast(via==='gmail' ? 'Opening Gmail — just hit Send' : 'Opening your mail app');
}
function merge(stage,x){ const meta=stageMeta(stage); const key=meta.template; const body=TEMPLATE_TEXT[key] || TEMPLATE_TEXT['Manager Review Packet']; return body.replaceAll('{{first}}',x.first).replaceAll('{{last}}',x.last).replaceAll('{{role}}',x.role).replaceAll('{{source}}',x.source).replaceAll('{{stage}}',x.stage).replaceAll('{{summary}}',x.summary).replaceAll('{{concerns}}',realConcern(x) || 'None noted').replaceAll('{{roleFit}}',roleFit(x)); }
function showDraft(stage){ let x=c(); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Generated email draft</h3><p>This uses the installed Goff template for the candidate’s current stage. Review or edit it, then open it pre-filled in Gmail (or your mail app) and hit Send. It sends from your own careers@ account — replies come back to you.</p><textarea>${merge(stage,x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn" onclick="copyToClipboard(document.querySelector('.modal-card textarea').value)">Copy</button><button class="btn" onclick="sendCandidateEmail('mailto')">Open in email app</button><button class="btn brand" onclick="sendCandidateEmail('gmail')">Open in Gmail →</button></div></div>`; }
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
function showEmployeeWelcomeDraft(){ const x=c(); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Employee portal welcome message</h3><p>Send after clearance is complete and the BBSI invite is ready. This is the handoff from recruiting into the employee site.</p><textarea>${employeeWelcomeDraft(x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn" onclick="sendCandidateEmail('mailto')">Open in email app</button><button class="btn brand" onclick="sendCandidateEmail('gmail')">Open in Gmail →</button></div></div>`; }
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
function offer(){
  const x=c();
  const missing=offerMissing(x);
  const o=x.offer||{};
  return `${head('Offer letter workflow',`Building the offer for ${esc(x.first)} ${esc(x.last)} (${esc(x.role)}). Save verified details, preview the letter, then download or print.`,`<button class="btn ghost" onclick="view='candidate';render()">← Back to candidate</button>`)}
  ${missing.length ? `<div class="notice warning"><strong>${missing.length} field${missing.length===1?'':'s'} missing before this offer can be sent:</strong> ${missing.map(esc).join(' · ')}</div>` : `<div class="notice success"><strong>All required fields are present.</strong> You can preview and send.</div>`}
  <div class="grid two" style="margin-top:16px">
    <section class="panel">
      <div class="section-head"><h3>Offer details</h3><span class="muted">Verified by Hiring Manager + Core Members</span></div>
      <div class="form offer-form">
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
          <label class="field-label">Core Member 1 <span class="req">required</span><input id="offerCore1" placeholder="e.g. Austin Goff" value="${esc(o.coreMember1 || o.approvers)}"></label>
          <label class="field-label">Core Member 2 <span class="req">required</span><input id="offerCore2" placeholder="e.g. Quinton Goff" value="${esc(o.coreMember2)}"></label>
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
        <button class="btn brand" onclick="setStage('Offer sent / follow-up')">Mark offer sent → move to follow-up</button>
      </div>
      <h4 style="margin-top:22px">Offer SOP checklist</h4>
      <div class="steps">
        <div class="step"><b>1. Verify request</b><br><small>Candidate, position, pay, schedule, start date, supervisor, and core members.</small></div>
        <div class="step"><b>2. Confirm hours</b><br><small>SOP says regular hours should fall between 6:00 AM and 6:00 PM.</small></div>
        <div class="step"><b>3. Generate letter</b><br><small>Download Word-compatible .doc or print/save PDF.</small></div>
        <div class="step"><b>4. Route signatures</b><br><small>Upload generated PDF/DOC to DocHub and assign candidate/core-member fields.</small></div>
      </div>
    </section>
  </div>
  <section class="panel" style="margin-top:16px"><h3>Pre-employment clearance guardrail</h3>${clearancePanel(x)}</section>`;
}
function saveOffer(){ let x=c(); x.offer={date:document.getElementById('offerDate').value,pay:document.getElementById('offerPay').value,startDate:document.getElementById('offerStart').value,schedule:document.getElementById('offerSchedule').value,supervisor:document.getElementById('offerSupervisor').value,employmentType:document.getElementById('offerEmploymentType').value,minHours:document.getElementById('offerMinHours').value,coreMember1:document.getElementById('offerCore1').value,coreMember2:document.getElementById('offerCore2').value,approvers:[document.getElementById('offerCore1').value,document.getElementById('offerCore2').value].filter(Boolean).join(', '),validityDays:document.getElementById('offerValidity').value||'30',notes:document.getElementById('offerNotes').value}; x.timeline.push('Offer details saved for generated offer letter'); save(); render(); }
function offerMissing(x){ const o=x.offer||{}; return [['date','Offer date'],['startDate','Expected start date'],['supervisor','Supervisor'],['pay','Starting pay'],['minHours','Minimum hours'],['schedule','Scheduled work hours'],['coreMember1','Core Member 1'],['coreMember2','Core Member 2']].filter(([k])=>!String(o[k]||'').trim()).map(([,label])=>label); }
function offerLetterHTML(x, print=false){ const o=x.offer||{}; const candidate=`${x.first} ${x.last}`; const missing=offerMissing(x); return `<!doctype html><html><head><meta charset="utf-8"><title>Goff Offer Letter - ${esc(candidate)}</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.45;margin:0;background:${print?'#fff':'#eee'}}.page{max-width:820px;margin:${print?'0':'28px auto'};background:#fff;padding:56px 64px;box-shadow:${print?'none':'0 18px 44px rgba(0,0,0,.16)'}}.letterhead{display:flex;justify-content:space-between;border-bottom:4px solid #c40012;padding-bottom:16px;margin-bottom:28px}.brand{font-weight:900;font-size:24px}.addr{text-align:right;font-size:12px;line-height:1.35}.section-title{font-weight:900;margin-top:18px}.siggrid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:34px}.line{border-top:1px solid #111;padding-top:6px;min-height:28px}.missing{background:#fff7e8;border-left:5px solid #a15c00;padding:12px;margin:0 0 18px}.muted{color:#555;font-size:12px}.toolbar{max-width:820px;margin:20px auto 0;display:flex;gap:10px}.btn{border:0;background:#c40012;color:#fff;padding:10px 14px;font-weight:800;border-radius:4px}@media print{.toolbar,.missing{display:none}.page{box-shadow:none;margin:0;padding:36px}}</style></head><body>${print?'':`<div class="toolbar"><button class="btn" onclick="window.print()">Print / Save PDF</button></div>`}<main class="page">${missing.length?`<div class="missing"><strong>Missing before sending:</strong> ${missing.map(esc).join(', ')}</div>`:''}<div class="letterhead"><div><div class="brand">Goff Welding, LLC</div><div class="muted">OFFER LETTER</div></div><div class="addr">531 W 100 S #22<br>Paul, Idaho 83347<br>Phone (208) 647-2488<br>info@goffwelding.com</div></div><p><strong>Date:</strong> ${esc(o.date||'__________')}</p><p>Dear ${esc(candidate)},</p><p>Congratulations! Goff Welding LLC is pleased to extend this offer of employment for the position of <strong>${esc(x.role||'__________')}</strong> with an anticipated start date of <strong>${esc(o.startDate||'__________')}</strong>.</p><p>This offer is contingent upon the successful completion of a background check, drug screening, and verification of your eligibility to work in the United States. Please review this summary of terms and conditions for your anticipated employment with us.</p><p class="section-title">Position</p><p>You will report directly to <strong>${esc(o.supervisor||'__________')}</strong>. This is a <strong>${esc(o.employmentType||'__________')}</strong> position.</p><p class="section-title">Compensation & Hours</p><p>You will be compensated at a rate of <strong>${esc(o.pay||'__________')}</strong> per hour, with payroll issued on a weekly basis each Friday.</p><p>This is a <strong>${esc(o.employmentType||'__________')}</strong> job that will require you to work a minimum of <strong>${esc(o.minHours||'____')}</strong> hours per week. Your typical schedule will fall between the hours of <strong>${esc(o.schedule||'__________')}</strong>, subject to workload.</p><p class="section-title">Benefits</p><p>You will become eligible for company sponsored insurance benefits after 60 days of employment, in accordance with plan terms.</p><p class="section-title">Training Investment</p><p>As part of our commitment to employee development, Goff Welding LLC may sponsor training programs. If you voluntarily resign within one (1) year of completing any company sponsored training, you agree to reimburse the company for the actual cost of such training.</p><p class="section-title">Employment Relationship</p><p>Your employment with Goff Welding LLC is at will, meaning that either you or the company may terminate the employment relationship at any time, with or without cause or notice.</p><p class="section-title">Offer Validity</p><p>This offer is valid for <strong>${esc(o.validityDays||'30')}</strong> calendar days from the date of this letter. If we do not receive your signed acceptance within this timeframe, the offer may be withdrawn.</p><p>We look forward to having you join the Goff Welding LLC team and believe you will find this opportunity both challenging and rewarding!</p><p>Sincerely,</p><div class="siggrid"><div><div class="line">${esc(o.coreMember1||'Core Member 1')}</div></div><div><div class="line">${esc(o.coreMember2||'Core Member 2')}</div></div></div><p style="margin-top:36px">I, <strong>${esc(candidate)}</strong>, have read and understand the provisions of this offer of employment and accept the above conditional job offer.</p><div class="siggrid"><div><div class="line">Candidate Signature</div></div><div><div class="line">Date</div></div><div><div class="line">Candidate Printed Name</div></div></div></main></body></html>`; }
function previewOfferLetter(){ const x=c(); const html=offerLetterHTML(x); const missing=offerMissing(x); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card wide"><h3>Actual offer letter preview</h3><p>${missing.length?`Missing before send: ${missing.join(', ')}`:'All required offer fields are present.'}</p><iframe class="doc-preview" srcdoc="${esc(html)}"></iframe><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn" onclick="printOfferLetter()">Print / Save PDF</button><button class="btn brand" onclick="downloadOfferLetterDoc()">Download .doc</button></div></div>`; }
function downloadFile(filename, content, type='text/plain'){ const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},0); }
function safeFileName(s){ return String(s||'candidate').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'candidate'; }
function downloadOfferLetterDoc(){ const x=c(); const html=offerLetterHTML(x,true); downloadFile(`goff-offer-letter-${safeFileName(x.first+'-'+x.last)}.doc`, html, 'application/msword'); x.timeline.push('Generated offer letter document download'); save(); }
function printOfferLetter(){ const w=window.open('', '_blank'); w.document.write(offerLetterHTML(c(), true)); w.document.close(); w.focus(); setTimeout(()=>w.print(),250); }
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
