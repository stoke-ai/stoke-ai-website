const WORKFLOW_STAGES = [
  { id:'Application received', group:'Intake', next:'Review candidate / choose path', owner:'Quinton', due:'Today', template:'Candidate Under Review' },
  { id:'Review candidate / choose path', group:'Intake', next:'Phone screen or weld test', owner:'Quinton', due:'1 day', template:'Candidate Under Review' },
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
  { id:'Keep on file', group:'Disposition', next:null, owner:'Quinton', due:'Later', template:'Position Filled / Keep on File' },
  { id:'Not selected', group:'Disposition', next:null, owner:'Quinton', due:'Done', template:'General Rejection Letter' },
  { id:'Needs more experience', group:'Disposition', next:null, owner:'Quinton', due:'Later', template:'Good Potential, But Needs More Experience' },
  { id:'Entry-level unavailable', group:'Disposition', next:null, owner:'Quinton', due:'Later', template:'Entry-Level Position Not Currently Available' },
  { id:'Rejected after interview / weld test', group:'Disposition', next:null, owner:'Quinton', due:'Done', template:'Rejection After Interview or Weld Test' },
  { id:'Relocation mismatch', group:'Disposition', next:null, owner:'Quinton', due:'Done', template:'Relocation for the Wrong Reasons' },
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

// Job copy fields. Pay ranges, schedules, and perks are placeholders — Goff
// can edit these in code (or eventually in a settings UI) once he gives Stoke
// the real numbers. The careers page renders all of these fields verbatim, so
// keep them short and applicant-facing.
const jobs = [
 {id:'welder', title:'Sanitary Stainless Steel Welder / Fabricator', type:'Full-time', path:'Welder path',
  summary:'Build high-stakes food and dairy stainless work the way it should be done — clean welds, tight tolerances, safe shop. Sanitary experience preferred; we will test on day one.',
  payRange:'$25–$32/hr DOE', schedule:'Mon–Fri, 6:00 AM–2:30 PM (some Saturdays as needed)', location:'On-site • Paul, ID (no remote)',
  perks:['Weekly pay', 'Health benefits after 60 days', 'Sponsored training', 'Stable year-round shop work'],
  certifications:'Welding cert or strong sanitary stainless portfolio. AWS or equivalent a plus.',
  roleFit:'Craftsmanship, stainless experience, blueprint reading, safe work habits, ability to pass weld test, pride in quality.'},
 {id:'fitter', title:'Sanitary Stainless Steel Fitter', type:'Full-time', path:'Welder path',
  summary:'Fit-up, layout, and teamwork on sanitary stainless projects. We test fit-up early so you know fast whether this is your shop.',
  payRange:'$22–$28/hr DOE', schedule:'Mon–Fri, 6:00 AM–2:30 PM', location:'On-site • Paul, ID',
  perks:['Weekly pay', 'Health benefits after 60 days', 'Sponsored training'],
  certifications:'Layout/fit-up experience on stainless or structural. Blueprint reading required.',
  roleFit:'Layout, fit-up, accuracy, teamwork, field awareness, willingness to follow Goff standards.'},
 {id:'helper', title:'Shop Helper / Entry Level', type:'Full-time / Part-time', path:'Other path',
  summary:'Entry path for reliable, teachable people with a strong work ethic and safety mindset. We hire for attitude and build the skill on the floor.',
  payRange:'$17–$20/hr', schedule:'Mon–Fri, 6:00 AM–2:30 PM', location:'On-site • Paul, ID',
  perks:['Weekly pay', 'Health benefits after 60 days', 'On-the-job training paid by us'],
  certifications:'None required. Reliability and willingness to learn matter most.',
  roleFit:'Reliability, teachability, safety, willingness to start with fundamentals and build skill.'},
 {id:'foreman', title:'Foreman / Project Lead', type:'Full-time', path:'Other path',
  summary:'Run crews, own jobs end-to-end, and keep customers in the loop. Second interview and manager review required because this seat carries weight.',
  payRange:'$30–$40/hr DOE + project bonuses', schedule:'Mon–Fri, day shift; occasional travel for installs', location:'On-site • Paul, ID + project sites',
  perks:['Weekly pay', 'Health benefits after 60 days', 'Project bonus potential', 'Sponsored leadership training'],
  certifications:'Prior crew leadership in fabrication or industrial trades. Stainless background preferred.',
  roleFit:'Job ownership, crew productivity, communication, problem solving, quality control, safety leadership.'},
 {id:'inventory', title:'Inventory Control Specialist', type:'Full-time', path:'Other path',
  summary:'Be the person who keeps materials moving and the shop honest. Accuracy and clean handoffs save us money — and your work is visible every day.',
  payRange:'$20–$26/hr DOE', schedule:'Mon–Fri, day shift', location:'On-site • Paul, ID',
  perks:['Weekly pay', 'Health benefits after 60 days', 'Stable role, no weekends'],
  certifications:'Warehouse / inventory experience. Comfortable with spreadsheets and barcode systems.',
  roleFit:'Accuracy guardian, material gatekeeper, organized warehouse steward, strong follow-through.'},
 {id:'procurement', title:'Procurement Manager', type:'Full-time', path:'Other path',
  summary:'Own vendor relationships, material cost, and the flow of metal into the shop. The job pays its salary when you negotiate well and prevent shortages.',
  payRange:'$60K–$80K DOE', schedule:'Mon–Fri, day shift', location:'On-site • Paul, ID',
  perks:['Health benefits after 60 days', 'Sponsored training', 'Performance bonus potential'],
  certifications:'Procurement or buyer experience in fabrication, manufacturing, or industrial trades.',
  roleFit:'Material strategist, cost controller, vendor communication, job-flow enabler.'}
];

let seed = [
 {id:1, first:'Tyler', last:'Rasmussen', role:jobs[0].title, source:'Indeed', path:'Welder path', stage:'Weld test invitation', owner:'Candidate', due:'Today', priority:'Hot', email:'tyler@example.com', phone:'208-555-0198', location:'Twin Falls, ID', stageUpdatedAt:daysAgoISO(4), summary:'Good tenure, relevant stainless fabrication experience, local and responsive. Needs weld test scheduled and confirmed.', concerns:'Validate craftsmanship, fit-up quality, pace, and safety habits in weld test.', evidence:{phone:'Not needed yet', weld:'Needs scheduling', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{pay:'', startDate:'', schedule:'', approvers:'', notes:''}, timeline:['Imported from Indeed shortlist','Quinton marked strong potential','System recommends weld test invite']},
 {id:2, first:'Maria', last:'Lopez', role:jobs[4].title, source:'Website', path:'Other path', stage:'Schedule interview', owner:'Candidate', due:'Tomorrow', priority:'Normal', email:'maria@example.com', phone:'208-555-0151', location:'Burley, ID', stageUpdatedAt:daysAgoISO(1), summary:'Applied for shop role but appears better aligned with inventory control. Stable work history and strong organization notes.', concerns:'Confirm role fit with hiring manager and whether she understands inventory/warehouse expectations.', evidence:{phone:'Complete', weld:'N/A', interview:'Needs scheduling', references:'Not started', crystal:'Not started', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{pay:'', startDate:'', schedule:'', approvers:'', notes:''}, timeline:['Website application received','Role-mismatch flagged as positive','Needs interview slots']},
 {id:3, first:'Caleb', last:'Miller', role:jobs[3].title, source:'Indeed', path:'Other path', stage:'Manager review packet', owner:'Hiring Manager', due:'1 day overdue', priority:'Hot', email:'caleb@example.com', phone:'208-555-0132', location:'Pocatello, ID', stageUpdatedAt:daysAgoISO(2), summary:'Foreman candidate with leadership background. First interview complete; decision needed on second interview or offer path.', concerns:'Commute/relocation motivation needs clarity before offer.', evidence:{phone:'Complete', weld:'N/A', interview:'Complete', references:'Waiting', crystal:'Sent', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{pay:'', startDate:'', schedule:'', approvers:'', notes:''}, timeline:['Indeed applicant moved into Goff recruiting','Phone screen and interview complete','Manager packet generated']},
 {id:4, first:'Evan', last:'Brooks', role:'Entry-level Welder', source:'Walk-in', path:'Other path', stage:'Needs more experience', owner:'Quinton', due:'Next week', priority:'Low', email:'evan@example.com', phone:'208-555-0119', location:'Jerome, ID', stageUpdatedAt:daysAgoISO(8), summary:'Strong attitude, not enough experience for immediate opening. Good future callback.', concerns:'Needs more welding experience before an active opening.', evidence:{phone:'Complete', weld:'Not started', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{pay:'', startDate:'', schedule:'', approvers:'', notes:''}, timeline:['Walk-in candidate','Reviewed as future potential','Keep-warm / more-experience draft recommended']},
 {id:5, first:'Jordan', last:'Kim', role:'Designer', source:'Website', path:'Other path', stage:'Location / relocation check', owner:'Candidate', due:'2 days', priority:'Normal', email:'jordan@example.com', phone:'208-555-0144', location:'Boise, ID', stageUpdatedAt:daysAgoISO(2), summary:'Designer candidate from website. Needs location clarity before spending manager time.', concerns:'Boise location; confirm relocation/commute intent.', evidence:{phone:'Not started', weld:'N/A', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{pay:'', startDate:'', schedule:'', approvers:'', notes:''}, timeline:['Website application','Location inquiry recommended']},
 {id:6, first:'Hannah', last:'Reyes', role:jobs[1].title, source:'Website', path:'Welder path', stage:'Application received', owner:'Quinton', due:'Today', priority:'Normal', email:'hannah@example.com', phone:'208-555-0163', location:'Burley, ID', stageUpdatedAt:daysAgoISO(0), summary:'New website application — fitter background, says she has stainless experience and a weld test ready portfolio.', concerns:'Verify stainless and fit-up experience before scheduling weld test.', evidence:{phone:'Not started', weld:'Not started', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{pay:'', startDate:'', schedule:'', approvers:'', notes:''}, timeline:['Submitted from Goff careers page','Queued for Quinton review']},
 {id:7, first:'James', last:'Whitley', role:jobs[0].title, source:'Indeed', path:'Welder path', stage:'Phone screen invitation', owner:'Candidate', due:'2 days', priority:'Normal', email:'james@example.com', phone:'208-555-0177', location:'Idaho Falls, ID', stageUpdatedAt:daysAgoISO(1), summary:'5 years stainless and sanitary pipe — invited to phone screen, waiting on time confirmation.', concerns:'Sanitary pipe background good signal; verify pace and food/dairy familiarity in screen.', evidence:{phone:'Invited', weld:'Not started', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{pay:'', startDate:'', schedule:'', approvers:'', notes:''}, timeline:['Indeed applicant added','Phone screen invitation sent']},
 {id:8, first:'Brandon', last:'Park', role:jobs[0].title, source:'Indeed', path:'Welder path', stage:'Offer sent / follow-up', owner:'Candidate', due:'24 hours', priority:'Hot', email:'brandon@example.com', phone:'208-555-0182', location:'Twin Falls, ID', stageUpdatedAt:daysAgoISO(1), summary:'Strong weld test, smooth interview, references clean. Offer sent yesterday at $28/hr, awaiting candidate response.', concerns:'Follow up before 48-hour mark so the offer does not go cold.', evidence:{phone:'Complete', weld:'Complete', interview:'Complete', references:'Complete', crystal:'Complete', background:'Not started'}, clearance:{drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'}, offer:{date:daysAgoISO(1).slice(0,10), pay:'$28.00/hr', startDate:daysAgoISO(-14).slice(0,10), schedule:'6:00 AM–2:30 PM', supervisor:'Quinton Goff', employmentType:'Full-Time', minHours:'40', approvers:'', coreMember1:'Austin Goff', coreMember2:'Quinton Goff', validityDays:'30', notes:'Standard offer per SOP.'}, timeline:['Indeed applicant moved into Goff recruiting','Weld test passed','Interview complete','Offer sent']},
 {id:9, first:'Ricky', last:'Lambert', role:jobs[0].title, source:'Referral', path:'Welder path', stage:'Schedule first day', owner:'Admin', due:'Today', priority:'Normal', email:'ricky@example.com', phone:'208-555-0145', location:'Paul, ID', stageUpdatedAt:daysAgoISO(0), summary:'Accepted offer, drug screen + background cleared. Scheduling first day with BBSI onboarding handoff to follow.', concerns:'None — ready for first day coordination and onboarding handoff.', evidence:{phone:'Complete', weld:'Complete', interview:'Complete', references:'Complete', crystal:'Complete', background:'Complete'}, clearance:{drug:'Passed', background:'Cleared', startDate:'Confirmed'}, offer:{date:daysAgoISO(7).slice(0,10), pay:'$26.50/hr', startDate:daysAgoISO(-7).slice(0,10), schedule:'6:00 AM–2:30 PM', supervisor:'Quinton Goff', employmentType:'Full-Time', minHours:'40', approvers:'', coreMember1:'Austin Goff', coreMember2:'Quinton Goff', validityDays:'30', notes:''}, timeline:['Referral candidate','Offer accepted','Clearance complete','Scheduling first day']}
];

function normalizeCandidate(x){
  x.evidence ||= {phone:'Not started', weld:x.path==='Welder path'?'Not started':'N/A', interview:'Not started', references:'Not started', crystal:'Not started', background:'Not started'};
  x.clearance ||= {drug:'Not scheduled', background:'Not started', startDate:'Not confirmed'};
  x.offer = Object.assign({date:new Date().toISOString().slice(0,10), pay:'', startDate:'', schedule:'', supervisor:'', employmentType:'Full-Time', minHours:'40', approvers:'', coreMember1:'', coreMember2:'', validityDays:'30', notes:''}, x.offer || {});
  if(!STAGE[x.stage]) x.stage='Application received';
  x.stageUpdatedAt ||= nowISO();
  x.notes = Array.isArray(x.notes) ? x.notes : [];
  x.pinned = x.pinned === true;
  return x;
}

let candidates = (JSON.parse(localStorage.getItem('goffCandidatesV2') || 'null') || JSON.parse(localStorage.getItem('goffCandidates') || 'null') || seed).map(normalizeCandidate);
let selectedId = candidates[0]?.id || 1;
let view = 'dashboard';
let selectedStage = 'Interview completed';
function save(){ localStorage.setItem('goffCandidatesV2', JSON.stringify(candidates)); }
function c(){ return candidates.find(x=>x.id===selectedId) || candidates[0]; }
async function signOut(){
  try { await fetch('/api/portal/logout', { method:'POST' }); } catch(_){}
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
  x.notes = x.notes || [];
  x.notes.push({ id: Date.now(), author: 'Recruiter', text, createdAt: nowISO() });
  x.timeline.push(`Note: ${text.slice(0, 80)}${text.length > 80 ? '…' : ''}`);
  save();
  render();
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
let candidateFilters = { search:'', path:'all', group:'active', owner:'all', pinned:false };
function setCandidateFilter(key, value){ candidateFilters[key] = value; render(); }
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
    if(f.search){
      const s = f.search.toLowerCase();
      const hay = `${x.first} ${x.last} ${x.role} ${x.location || ''} ${x.email || ''} ${x.stage}`.toLowerCase();
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
  return `${head('Candidates', `${filtered.length} shown · ${totalActive} active in pipeline · ${candidates.length} all-time`, `<button class="btn primary" onclick="view='intake';render()">Add candidate</button>`)}
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
function jobFor(role){ return jobs.find(j => role && role.toLowerCase().includes(j.title.toLowerCase().split(' ')[0])) || jobs.find(j => role && j.title===role) || jobs[0]; }
function roleFit(x){ return jobFor(x.role).roleFit; }
function esc(s){ return String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
function tag(v){ if(v==='Hot'||String(v).includes('overdue')) return 'red'; if(String(v).includes('Today')||String(v).includes('Tomorrow')||String(v).includes('24')) return 'amber'; if(String(v).includes('Website')) return 'green'; if(String(v).includes('Indeed')) return 'blue'; return 'violet'; }
function render(){
  if(view==='career'||view==='thanks'){
    document.getElementById('app').innerHTML = `${page()}<div id="modal" class="modal"></div>`;
    return;
  }
  document.getElementById('app').innerHTML = `<div class="shell"><aside class="sidebar"><div class="brand"><img src="/goff-welding-logo.png" alt="Goff Welding" class="brand-logo"><p class="brand-subtitle">Recruiting Platform</p></div><nav class="nav">${nav('dashboard','Dashboard')}${nav('candidates','Candidates')}${nav('intake','Add candidate')}${nav('manager','Manager review')}${nav('offer','Offer workflow')}${nav('workflow','Full workflow')}${nav('templates','Templates')}${nav('integrations','Setup &amp; status')}${nav('how-it-works','How it works')}</nav><div class="side-card"><strong>Today’s focus</strong><p>Keep qualified candidates moving through Goff’s actual recruiting steps: screen, weld test, interview, references, offer, clearance hold, and BBSI handoff.</p></div><button class="sidebar-signout" onclick="signOut()">Sign out</button></aside><main class="content">${page()}</main></div><div id="modal" class="modal"></div>`;
}
function nav(id,label){ return `<button class="${view===id?'active':''}" onclick="view='${id}';render()">${label}</button>`; }
function head(title,sub,button=''){ return `<div class="topbar"><div><div class="eyebrow">Recruiting operations</div><h2>${title}</h2><p>${sub}</p></div>${button}</div>`; }
function page(){ return ({dashboard,intake,career,thanks,candidate,candidates:candidateList,manager,offer,workflow,templates,integrations,'how-it-works':howItWorks}[view] || dashboard)(); }
function metric(label,value){ return `<div class="metric"><span>${label}</span><b>${value}</b></div>`; }
function dashboard(){
  const austinDecisions = candidates.filter(needsHiringManager);
  const stale = candidates.filter(x => isActive(x) && agingLevel(x)==='stale' && !needsHiringManager(x));
  const aging = candidates.filter(x => isActive(x) && agingLevel(x)==='aging' && !needsHiringManager(x));
  const quintonsQueue = candidates.filter(x => isActive(x) && !needsHiringManager(x) && !stale.includes(x) && !aging.includes(x));

  const welderCandidates = candidates.filter(x => isActive(x) && isWelderPath(x));
  const otherCandidates = candidates.filter(x => isActive(x) && !isWelderPath(x));

  const todaySummary = buildTodaySummary(austinDecisions, stale.length, aging.length);

  return `${head(`Today's hiring snapshot.`, todaySummary, `<button class="btn primary" onclick="window.open('/goff-careers/','_blank','noopener')">Open careers page</button>`)}
  ${austinDecisions.length ? `<section class="panel decisions"><div class="section-head"><div><div class="eyebrow eyebrow-decisions">Decisions needed</div><h3>${austinDecisions.length === 1 ? 'One candidate is waiting on a hiring-lead call.' : `${austinDecisions.length} candidates are waiting on a hiring-lead call.`}</h3></div></div><div class="decision-list">${austinDecisions.map(decisionCard).join('')}</div></section>` : `<section class="panel decisions-empty"><div class="eyebrow eyebrow-decisions">Decisions needed</div><h3>No decisions waiting right now.</h3><p class="muted">The recruiting queue is moving. ${(stale.length+aging.length) ? `${stale.length+aging.length} candidate${(stale.length+aging.length)===1?'':'s'} aging — see below.` : 'Pipeline is clean.'}</p></section>`}

  ${recentActivityPanel()}

  <section class="panel funnels"><div class="section-head"><div><div class="eyebrow">Pipeline by path</div><h3>From applied to hired.</h3></div><button class="btn" onclick="view='workflow';render()">View full workflow</button></div>${funnelHTML('Welder path — fabricators &amp; fitters', welderCandidates)}${funnelHTML('Other roles — foreman, inventory, procurement, helper', otherCandidates)}</section>

  ${(stale.length || aging.length) ? `<section class="panel aging"><div class="section-head"><div><div class="eyebrow eyebrow-aging">Check before they go cold</div><h3>${stale.length ? `${stale.length} stale${aging.length ? `, ${aging.length} aging` : ''}.` : `${aging.length} aging.`}</h3></div></div><div class="aging-list">${stale.map(c => agingRow(c,'stale')).join('')}${aging.map(c => agingRow(c,'aging')).join('')}</div></section>` : ''}

  <section class="panel"><div class="section-head"><div><div class="eyebrow">In motion</div><h3>${quintonsQueue.length === 1 ? '1 candidate moving normally.' : `${quintonsQueue.length} candidates moving normally.`}</h3></div></div>${quintonsQueue.length ? `<div class="queue">${quintonsQueue.map(card).join('')}</div>` : `<p class="muted">Nothing else in motion. Add a candidate from the Intake screen.</p>`}</section>`;
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
    ${x.concerns ? `<div class="decision-card-concern"><strong>Concern:</strong> ${esc(x.concerns)}</div>` : ''}
    <div class="decision-card-actions">
      ${actions.map(a => `<button class="btn ${a.primary?'primary':''}" onclick="selectedId=${x.id};${a.action}">${esc(a.label)}</button>`).join('')}
      <button class="btn ghost" onclick="selectedId=${x.id};view='candidate';render()">Open candidate →</button>
    </div>
  </article>`;
}

function funnelHTML(label, list){
  const counts = FUNNEL_BUCKETS.map(b => list.filter(c => bucketForStage(c.stage)?.id === b.id));
  const total = counts.reduce((s, arr) => s + arr.length, 0);
  return `<div class="funnel-group">
    <div class="funnel-label"><span>${label}</span><em>${total} active</em></div>
    <div class="funnel">
      ${FUNNEL_BUCKETS.map((b,i) => `<div class="funnel-stage ${counts[i].length?'has-count':''}" onclick="selectedStage='${esc(b.stages[0])}';view='workflow';render()">
        <div class="funnel-stage-count">${counts[i].length}</div>
        <div class="funnel-stage-label">${esc(b.label)}</div>
        <div class="funnel-chips">${counts[i].slice(0,3).map(c => `<span class="funnel-chip" onclick="event.stopPropagation();selectedId=${c.id};view='candidate';render()" title="${esc(c.first+' '+c.last)}">${esc(c.first)}</span>`).join('')}${counts[i].length > 3 ? `<span class="funnel-chip more">+${counts[i].length - 3}</span>` : ''}</div>
      </div>${i < FUNNEL_BUCKETS.length-1 ? '<div class="funnel-arrow" aria-hidden="true">›</div>' : ''}`).join('')}
    </div>
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

function intake(){ return `${head('Add candidate','Add applicants from the website, Indeed, referrals, walk-ins, email, CSV, or copied text.',`<button class="btn brand" onclick="downloadIndeedSampleCSV()">Download sample Indeed CSV</button>`)}<div class="grid three"><section class="panel"><h3>1. Quick add</h3><p>For walk-ins, referrals, phone calls, and one-off Indeed candidates the recruiter wants to work.</p><div class="form"><input id="qaName" placeholder="Candidate name"><input id="qaEmail" placeholder="Email"><select id="qaRole">${jobs.map(j=>`<option>${j.title}</option>`).join('')}</select><select id="qaSource"><option>Website</option><option>Indeed</option><option>Referral</option><option>Walk-in</option><option>BBSI export</option></select><button class="btn primary" onclick="quickAdd()">Add to Goff queue</button></div></section><section class="panel"><h3>2. Indeed CSV import</h3><p>Upload an Indeed candidate CSV/export. The importer accepts flexible headers like name, first name, last name, email, phone, job title, location, status, resume, and notes.</p><div class="form"><input id="csvFile" type="file" accept=".csv,text/csv" onchange="handleCSVFile(event)"><textarea id="csvPasteBox" class="importbox" placeholder="Or paste Indeed CSV rows here..."></textarea><button class="btn brand" onclick="parseIndeedCSV(document.getElementById('csvPasteBox').value)">Preview CSV import</button></div></section><section class="panel"><h3>3. Paste single applicant</h3><p>For copied Indeed candidate text or email notifications.</p><textarea id="pasteBox" class="importbox" placeholder="Paste one applicant text here..."></textarea><button class="btn brand" onclick="parseImport()">Parse one candidate</button><div class="notice success"><strong>Routing:</strong> Goff recruiting owns the queue. BBSI starts after offer acceptance and clearance.</div></section></div><section class="panel" style="margin-top:16px"><h3>Import preview / result</h3><div id="importResult" class="notice">No import run yet.</div></section>`; }
function quickAdd(){ let [first,...rest]=(document.getElementById('qaName').value||'New Candidate').split(' '); let role=document.getElementById('qaRole').value; let item=normalizeCandidate({id:Date.now(),first,last:rest.join(' ')||'Applicant',email:document.getElementById('qaEmail').value||'unknown@example.com',phone:'',role,source:document.getElementById('qaSource').value,path:role.toLowerCase().includes('welder')?'Welder path':'Other path',stage:'Application received',owner:'Quinton',due:'Today',priority:'Normal',location:'',summary:'New candidate added through quick-add intake. Needs first review and path selection.',concerns:'Unknown until screened.',timeline:['Added through Goff recruiting quick-add']}); candidates.unshift(item); selectedId=item.id; save(); view='candidate'; render(); }
function demoImport(){ view='intake'; render(); document.getElementById('pasteBox').value='Name: Jason Harper\nEmail: jason.harper@example.com\nPhone: 208-555-0188\nSource: Indeed\nRole: Sanitary Stainless Steel Welder/Fabricator\nNotes: 5 years stainless, currently in Idaho Falls, available for weld test next week.'; parseImport(); }
function parseImport(){ let t=document.getElementById('pasteBox').value||''; let email=(t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)||[''])[0]; let phone=(t.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)||[''])[0]; let name=(t.match(/Name:\s*([^\n,]+)/i)||t.match(/^([^,\n]+)/)||['','Imported Candidate'])[1].trim(); let source=(t.match(/Source:\s*([^\n,]+)/i)||['','Indeed'])[1].trim(); let role=(t.match(/Role:\s*([^\n]+)/i)||t.match(/Job(?: Title)?:\s*([^\n]+)/i)||['',jobs[0].title])[1].trim(); let notes=(t.match(/Notes?:\s*([^]+)/i)||['','Imported applicant. System recommends Quinton review and choose first action.'])[1].trim(); let [first,...rest]=name.split(' '); let item=normalizeCandidate({id:Date.now(),first:first||'Imported',last:rest.join(' ')||'Candidate',email:email||'unknown@example.com',phone,role,source,path:role.toLowerCase().includes('welder')?'Welder path':'Other path',stage:'Application received',owner:'Quinton',due:'Today',priority:'Normal',location:'',summary:notes.slice(0,260),concerns:'Imported data needs verification.',timeline:['Parsed from paste/import center','Queued for Quinton review']}); candidates.unshift(item); selectedId=item.id; save(); document.getElementById('importResult').innerHTML=`<strong>Imported:</strong> ${item.first} ${item.last} • ${item.role} • ${item.source}<br><button class="btn primary" onclick="view='candidate';render()">Open candidate</button>`; }
function parseCSV(text){ const rows=[]; let row=[], cell='', inQuotes=false; for(let i=0;i<text.length;i++){ const ch=text[i], next=text[i+1]; if(ch==='"' && inQuotes && next==='"'){ cell+='"'; i++; } else if(ch==='"'){ inQuotes=!inQuotes; } else if(ch===',' && !inQuotes){ row.push(cell); cell=''; } else if((ch==='\n'||ch==='\r') && !inQuotes){ if(ch==='\r' && next==='\n') i++; row.push(cell); if(row.some(v=>String(v).trim())) rows.push(row); row=[]; cell=''; } else cell+=ch; } row.push(cell); if(row.some(v=>String(v).trim())) rows.push(row); return rows; }
function canonicalHeader(h){ return String(h||'').toLowerCase().replace(/[^a-z0-9]+/g,''); }
function pick(row, headers, aliases){ for(const a of aliases){ const i=headers.indexOf(canonicalHeader(a)); if(i>=0 && row[i]) return String(row[i]).trim(); } return ''; }
function candidateFromCSVRow(row, headers, idx){ let full=pick(row,headers,['name','candidate name','full name','applicant name']); let first=pick(row,headers,['first name','firstname','first']); let last=pick(row,headers,['last name','lastname','last']); if(!full && (first||last)) full=`${first} ${last}`.trim(); if(!first){ const parts=(full||`Indeed Candidate ${idx+1}`).trim().split(/\s+/); first=parts.shift()||'Indeed'; last=last||parts.join(' ')||'Candidate'; } let role=pick(row,headers,['job title','job','position','applied job','applied position','job applied','role']) || jobs[0].title; let email=pick(row,headers,['email','email address','candidate email']); let phone=pick(row,headers,['phone','phone number','mobile','mobile phone','candidate phone']); let location=pick(row,headers,['location','city','candidate location','address']); let status=pick(row,headers,['status','candidate status','indeed status']); let resume=pick(row,headers,['resume','resume text','cover letter','experience','qualifications']); let notes=pick(row,headers,['notes','note','comments','screening answers','questions','answers']); let source=pick(row,headers,['source']) || 'Indeed CSV'; const combined=[status && `Indeed status: ${status}`, resume, notes].filter(Boolean).join(' | '); return normalizeCandidate({id:Date.now()+idx,first,last:last||'Candidate',email:email||'unknown@example.com',phone,role,source,path:role.toLowerCase().includes('welder')?'Welder path':'Other path',stage:'Application received',owner:'Quinton',due:'Today',priority:'Normal',location,summary:(combined||'Imported from Indeed CSV. Needs Goff review and path selection.').slice(0,500),concerns:'CSV import: verify candidate details, fit, availability, and source status before outreach.',timeline:['Imported from Indeed CSV','Queued for Quinton review']}); }
function parseIndeedCSV(text){ if(!text || !text.trim()){ document.getElementById('importResult').innerHTML='<strong>No CSV found.</strong> Upload a file or paste CSV rows first.'; return; } const rows=parseCSV(text.trim()); if(rows.length<2){ document.getElementById('importResult').innerHTML='<strong>Need header row plus at least one candidate row.</strong>'; return; } const headers=rows[0].map(canonicalHeader); const imported=rows.slice(1).filter(r=>r.some(v=>String(v).trim())).map((r,i)=>candidateFromCSVRow(r,headers,i)); window.pendingIndeedImport=imported; document.getElementById('importResult').innerHTML=`<strong>Previewed ${imported.length} Indeed candidate${imported.length===1?'':'s'}.</strong><div class="import-preview">${imported.slice(0,8).map(x=>`<div class="template-row"><b>${esc(x.first)} ${esc(x.last)}</b><span>${esc(x.role)}</span><span class="tag blue">${esc(x.source)}</span></div>`).join('')}${imported.length>8?`<p class="muted">+ ${imported.length-8} more</p>`:''}</div><div class="modal-actions" style="justify-content:flex-start"><button class="btn primary" onclick="commitIndeedImport()">Import ${imported.length} to Goff queue</button><button class="btn" onclick="window.pendingIndeedImport=[];document.getElementById('importResult').innerHTML='Import cancelled.'">Cancel</button></div>`; }
function handleCSVFile(evt){ const file=evt.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ document.getElementById('csvPasteBox').value=reader.result; parseIndeedCSV(reader.result); }; reader.readAsText(file); }
function commitIndeedImport(){ const imported=window.pendingIndeedImport||[]; if(!imported.length){ document.getElementById('importResult').innerHTML='No pending CSV import.'; return; } candidates=[...imported,...candidates]; selectedId=imported[0].id; save(); document.getElementById('importResult').innerHTML=`<strong>Imported ${imported.length} Indeed candidate${imported.length===1?'':'s'} into the Goff queue.</strong><br><button class="btn primary" onclick="view='candidate';render()">Open first imported candidate</button>`; window.pendingIndeedImport=[]; }
function downloadIndeedSampleCSV(){ const sample='Name,Email,Phone,Job Title,Location,Indeed Status,Resume,Notes\n"Jason Harper",jason.harper@example.com,208-555-0188,"Sanitary Stainless Steel Welder / Fabricator","Idaho Falls, ID","Interested","5 years stainless and sanitary pipe","Available for weld test next week"\n"Megan Cole",megan.cole@example.com,208-555-0199,"Inventory Control Specialist","Burley, ID","New","Warehouse inventory and purchasing support","Strong attention to detail"\n'; downloadFile('goff-indeed-import-sample.csv', sample, 'text/csv'); }
function jobCardHTML(j){
  return `<article class="job-card" id="job-${j.id}">
    <header class="job-card-head">
      <div class="min-w-0"><strong>${esc(j.title)}</strong><div class="job-card-tags"><span class="tag blue">${esc(j.type)}</span><span class="tag">${esc(j.path)}</span></div></div>
      <button class="btn brand" onclick="prefillApply('${j.id}')">Apply for this role</button>
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
          <div class="careers-section-head"><h2>Open positions</h2><span class="muted">${jobs.length} role${jobs.length===1?'':'s'} hiring</span></div>
          ${jobs.map(jobCardHTML).join('')}
        </div>
        <aside class="apply-panel panel" id="apply">
          <h3>Apply now</h3>
          <p class="muted">Submit your information and the Goff hiring team will review your application. We follow up by email or phone.</p>
          <div class="form">
            <label class="field-label">Full name<input id="appName" placeholder="First and last" required></label>
            <label class="field-label">Email<input id="appEmail" type="email" placeholder="you@example.com" required></label>
            <label class="field-label">Phone<input id="appPhone" type="tel" placeholder="208-555-0100"></label>
            <label class="field-label">Role<select id="appRole">${jobs.map(j=>`<option>${esc(j.title)}</option>`).join('')}</select></label>
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
        <div><strong>Open positions</strong><br><span>${jobs.length} role${jobs.length===1?'':'s'} hiring</span></div>
      </div>
    </footer>
  </main>`;
}
function prefillApply(id){ const j=jobs.find(x=>x.id===id); if(!j) return; const sel=document.getElementById('appRole'); if(sel) sel.value=j.title; document.getElementById('apply')?.scrollIntoView({behavior:'smooth'}); document.getElementById('appName')?.focus(); }
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

  // Best-effort server delivery. The localStorage record is always created so
  // the prototype keeps working if the endpoint is unreachable (offline demo,
  // misconfigured env). The timeline entry tells the recruiter whether the
  // server saw it or not.
  let serverDelivered=false;
  try {
    const r=await fetch('/api/goff-recruiting/applications', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({first,last,email,phone,role,notes:combinedNotes,source:'Goff website'})
    });
    serverDelivered=r.ok;
  } catch(_) { serverDelivered=false; }

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
    concerns:'Needs screening.',
    timeline:['Submitted from Goff careers page', serverDelivered ? 'Routed to Goff intake — Quinton notified.' : 'Local copy saved — server route unavailable.', 'Queued for Quinton'],
  });
  candidates.unshift(item);
  selectedId=item.id;
  save();
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
        <button class="btn" onclick="window.open('/goff-careers/','_blank','noopener')">Back to open positions</button>
      </div>
    </section>
  </main>`;
}
function field(k,v){ return `<div class="field"><span>${k}</span><strong>${v || '—'}</strong></div>`; }
function evidenceTable(x){ const e=x.evidence||{}; return `<div class="mini-grid">${field('Phone screen', e.phone)}${field('Weld test', e.weld)}${field('Interview', e.interview)}${field('References', e.references)}${field('Crystal Knows', e.crystal)}${field('Background', e.background)}</div>`; }
function clearanceReady(x){ return x.clearance?.drug==='Passed' && ['Cleared','N/A'].includes(x.clearance?.background) && x.clearance?.startDate==='Confirmed'; }
function clearancePanel(x){ const ready=clearanceReady(x); return `<div class="notice ${ready?'success':'warning'}"><strong>${ready?'Clearance complete':'BBSI guardrail active'}</strong><br>Offer Accepted is a hold stage. Do not move to BBSI onboarding until drug screen, background, and start date are complete.</div><div class="mini-grid">${field('Drug screen',x.clearance.drug)}${field('Background',x.clearance.background)}${field('Start date',x.clearance.startDate)}</div><div class="actions tight"><button class="btn" onclick="setClearance('drug','Scheduled')">Drug scheduled</button><button class="btn" onclick="setClearance('drug','Passed')">Drug passed</button><button class="btn" onclick="setClearance('background','Cleared')">Background cleared</button><button class="btn" onclick="setClearance('background','N/A')">Background N/A</button><button class="btn" onclick="setClearance('startDate','Confirmed')">Start confirmed</button></div>`; }
function employeePortalUrl(x){ return `/goff-employee/?employee=${encodeURIComponent(`${x.first} ${x.last}`)}&role=${encodeURIComponent(x.role)}`; }
function employeeHandoffPanel(x){ const ready=clearanceReady(x); const url=employeePortalUrl(x); return `<section class="panel employee-handoff" style="margin-top:16px"><div class="section-head"><div><div class="eyebrow">Recruiting → employee portal</div><h3>${ready?'Ready to generate employee access':'Employee portal stays locked until clearance'}</h3></div><span class="tag ${ready?'green':'amber'}">${ready?'Cleared':'Guardrail active'}</span></div><div class="handoff-grid"><div><span>Employee site</span><strong>employees.goffwelding.com</strong><small>Prototype path: <code>/goff-employee/</code></small></div><div><span>Access method</span><strong>Private link / magic code</strong><small>No employee password in v1.</small></div><div><span>Re-access</span><strong>Original text/email, QR code, or employee domain</strong><small>Employee enters phone/email to receive a fresh code.</small></div></div><div class="notice ${ready?'success':'warning'}"><strong>${ready?'Next action: send onboarding link':'Do not send full employee portal yet'}</strong><br>${ready?'Send the BBSI invite plus the Goff employee portal link. The employee sees first-day details, required resources, ExakTime, safety, tool list, and company links.':'Offer accepted is not hired. Complete drug screen, background, and start date first.'}</div><div class="actions tight"><button class="btn ${ready?'primary':''}" ${ready?'':'disabled'} onclick="generateEmployeePortalAccess()">Generate employee portal access</button><button class="btn" onclick="window.open('${url}','_blank','noopener')">Preview employee portal</button><button class="btn" onclick="showEmployeeWelcomeDraft()">Preview welcome message</button></div></section>`; }
function candidate(){
  const x=c();
  const meta=stageMeta(x.stage);
  const ageLevel=agingLevel(x);
  const ageText=stageAgeText(x);
  const showClearance = ['Offer accepted - clearance hold','BBSI documents invite','Offer sent / follow-up','Schedule first day','Transition to onboarding workflow'].includes(x.stage);
  const showOfferShortcut = ['Offer letter info request','Offer letter draft','Offer sent / follow-up'].includes(x.stage);
  const customDecisions = decisionActionsForStage(x.stage);
  return `${head(`${x.pinned ? '★ ' : ''}${esc(x.first)} ${esc(x.last)}`, `${esc(x.role)} · from ${esc(x.source)} · ${esc(x.path)}`,`<div class="head-actions"><button class="btn pin-toggle ${x.pinned ? 'pinned' : ''}" onclick="togglePin(${x.id})" title="${x.pinned ? 'Unpin' : 'Pin this candidate'}">${x.pinned ? '★ Pinned' : '☆ Pin'}</button><button class="btn ghost" onclick="view='dashboard';render()">← Back to dashboard</button></div>`)}
  <section class="panel candidate-hero">
    <div class="candidate-hero-row">
      <div class="candidate-hero-stage">
        <div class="eyebrow">Current stage</div>
        <h3>${esc(x.stage)}</h3>
        <p class="muted">${meta.group} group · ${meta.next ? `next: <strong>${esc(meta.next)}</strong>` : 'no automatic next stage'}</p>
      </div>
      <div class="candidate-hero-meta">
        <div class="hero-stat"><span>In stage</span><strong class="age-${ageLevel}">${esc(ageText)}</strong></div>
        <div class="hero-stat"><span>Waiting on</span><strong>${esc(x.owner)}</strong></div>
        <div class="hero-stat"><span>Priority</span><strong>${esc(x.priority)}</strong></div>
      </div>
    </div>
    <div class="candidate-hero-actions">
      ${customDecisions.length ? customDecisions.map(a => `<button class="btn ${a.primary?'primary':''}" onclick="${a.action}">${esc(a.label)}</button>`).join('') : `<button class="btn primary" onclick="advance()">Move to next stage</button>`}
      <button class="btn" onclick="showDraft(c().stage)">Generate email draft</button>
      ${showOfferShortcut ? `<button class="btn" onclick="view='offer';render()">Open offer workflow</button>` : ''}
    </div>
  </section>
  <div class="grid two" style="margin-top:16px">
    <section class="panel">
      <h3>What needs to happen</h3>
      <div class="notice success"><strong>${meta.next ? 'Recommended next stage' : 'No automatic next stage'}</strong>${meta.next ? `<br>${esc(meta.next)}` : ''}<br><span class="muted">Template: ${esc(meta.template)}</span></div>
      <h3 style="margin-top:18px">Change stage</h3>
      <select onchange="setStage(this.value)" class="stage-select">${STAGES.map(s=>`<option ${s===x.stage?'selected':''}>${esc(s)}</option>`).join('')}</select>
      <h3 style="margin-top:18px">Evidence checklist</h3>
      ${evidenceTable(x)}
    </section>
    <section class="panel">
      <h3>Candidate profile</h3>
      <div class="profile-grid">
        ${field('Email', `<a href="mailto:${esc(x.email)}?subject=${encodeURIComponent('Goff Welding — ' + x.role)}">${esc(x.email)}</a> <button class="copy-icon" title="Copy email" onclick="event.stopPropagation();copyToClipboard('${esc(x.email)}')">⧉</button>`)}
        ${field('Phone', x.phone ? `<a href="tel:${esc(x.phone)}">${esc(x.phone)}</a> <button class="copy-icon" title="Copy phone" onclick="event.stopPropagation();copyToClipboard('${esc(x.phone)}')">⧉</button>` : '—')}
        ${field('Location', x.location || '—')}
        ${field('Source', x.source)}
      </div>
      <div class="notice"><strong>Summary:</strong><br>${esc(x.summary)}</div>
      ${x.concerns ? `<div class="notice warning"><strong>Concern to resolve:</strong><br>${esc(x.concerns)}</div>` : ''}
      <h3 style="margin-top:18px">Role expectations</h3>
      <p class="muted">${esc(roleFit(x))}</p>
    </section>
  </div>
  <section class="panel" style="margin-top:16px">
    <div class="section-head"><div><div class="eyebrow">Recruiter notes</div><h3>${(x.notes && x.notes.length) ? `${x.notes.length} note${x.notes.length === 1 ? '' : 's'} on file.` : 'No notes yet.'}</h3></div></div>
    <div class="note-composer">
      <textarea id="noteInput" rows="3" placeholder="Add a note — what was discussed, next step, anything to remember. Press &quot;Save note&quot; when done."></textarea>
      <div class="note-composer-actions">
        <button class="btn brand" onclick="addNote()">Save note</button>
        <span class="muted small">Notes show up in the timeline below and on the dashboard activity feed.</span>
      </div>
    </div>
    ${(x.notes && x.notes.length) ? `<div class="notes-list">${x.notes.slice().reverse().map(n => `<div class="note-row"><div class="note-row-meta"><strong>${esc(n.author || 'Recruiter')}</strong> · ${esc(formatRelativeShort(n.createdAt))}</div><p>${esc(n.text)}</p></div>`).join('')}</div>` : ''}
  </section>
  ${showClearance ? `<section class="panel" style="margin-top:16px"><h3>Clearance guardrails</h3>${clearancePanel(x)}</section>${employeeHandoffPanel(x)}` : ''}
  <section class="panel" style="margin-top:16px">
    <details class="email-draft-details">
      <summary><h3 style="display:inline">Preview email draft for this stage</h3></summary>
      <p class="muted" style="margin-top:8px">Template for "${esc(x.stage)}". In production this creates a Gmail draft for review before sending.</p>
      <div class="draft">${esc(merge(x.stage,x))}</div>
    </details>
  </section>
  <section class="panel" style="margin-top:16px">
    <h3>Timeline</h3>
    <div class="timeline">${x.timeline.slice().reverse().map(t=>`<div class="timeline-row"><span class="timeline-dot"></span><div><b>${esc(t)}</b><small>Logged in candidate history</small></div></div>`).join('')}</div>
  </section>`;
}
function setStage(s){ let x=c(); if(s==='BBSI documents invite' && !clearanceReady(x)){ x.timeline.push('Blocked BBSI handoff: pre-employment clearance incomplete'); save(); showGuardrail(); return; } if(x.stage !== s) x.stageUpdatedAt = nowISO(); x.stage=s; const meta=stageMeta(s); x.owner=meta.owner; x.due=meta.due; x.timeline.push('Stage changed to '+s); save(); render(); }
function advance(){ let x=c(); const next = NEXT[x.stage] || 'Manager review packet'; setStage(next); }
function setClearance(k,v){ let x=c(); x.clearance[k]=v; x.timeline.push(`Clearance updated: ${k} = ${v}`); save(); render(); }
function merge(stage,x){ const meta=stageMeta(stage); const key=meta.template; const body=TEMPLATE_TEXT[key] || TEMPLATE_TEXT['Manager Review Packet']; return body.replaceAll('{{first}}',x.first).replaceAll('{{last}}',x.last).replaceAll('{{role}}',x.role).replaceAll('{{source}}',x.source).replaceAll('{{stage}}',x.stage).replaceAll('{{summary}}',x.summary).replaceAll('{{concerns}}',x.concerns).replaceAll('{{roleFit}}',roleFit(x)); }
function showDraft(stage){ let x=c(); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Generated email draft</h3><p>This uses the installed Goff template for the candidate’s current stage. For now, this creates a human-reviewed draft in the platform for copy/paste or manual sending.</p><textarea>${merge(stage,x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn brand" onclick="markDraft()">Mark email draft created</button></div></div>`; }
function markDraft(){ c().timeline.push('Email draft generated for '+c().stage); save(); document.getElementById('modal').className='modal'; render(); }
function showGuardrail(){ document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>BBSI handoff blocked</h3><p>Goff’s BBSI ATS SOP says <strong>Offer Accepted = not cleared</strong> and <strong>Onboarding = fully cleared</strong>. Complete drug screen, background, and start date before BBSI onboarding.</p><div class="modal-actions"><button class="btn brand" onclick="document.getElementById('modal').className='modal';render()">Review clearance checklist</button></div></div>`; }
function employeeWelcomeDraft(x=c()){ const url='https://employees.goffwelding.com/start'; return `Subject: Welcome to Goff Welding — Start Here\n\nHi ${x.first},\n\nWelcome to Goff Welding. We’re excited to have you moving forward with us.\n\nYour next step is to complete your BBSI/myBBSI onboarding invite and use the Goff employee portal below for your first-day details, required resources, ExakTime/timekeeping instructions, safety orientation, tool list, and company links.\n\nEmployee portal: ${url}\n\nFirst day: ${x.offer?.startDate || '[confirm start date]'}\nSchedule: ${x.offer?.schedule || '[confirm schedule]'}\nSupervisor: ${x.offer?.supervisor || '[confirm supervisor]'}\n\nIf your myBBSI invite expires or you have questions, reply here or email careers@goffwelding.com.\n\nThank you,\nGoff Welding Hiring Team`; }
function showEmployeeWelcomeDraft(){ const x=c(); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Employee portal welcome message</h3><p>Send after clearance is complete and the BBSI invite is ready. This is the handoff from recruiting into the employee site.</p><textarea>${employeeWelcomeDraft(x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal'">Close</button><button class="btn brand" onclick="generateEmployeePortalAccess()">Mark portal access generated</button></div></div>`; }
function generateEmployeePortalAccess(){ const x=c(); if(!clearanceReady(x)){ showGuardrail(); return; } x.timeline.push('Employee portal access generated: employees.goffwelding.com/start'); if(x.stage==='Schedule first day') x.stage='Transition to onboarding workflow'; save(); document.getElementById('modal').className='modal open'; document.getElementById('modal').innerHTML=`<div class="modal-card"><h3>Employee portal access ready</h3><p>The candidate is cleared and can now receive the BBSI invite plus the employee portal link.</p><div class="notice success"><strong>Access link:</strong><br><code>https://employees.goffwelding.com/start</code></div><textarea>${employeeWelcomeDraft(x)}</textarea><div class="modal-actions"><button class="btn" onclick="document.getElementById('modal').className='modal';render()">Done</button><button class="btn brand" onclick="copyToClipboard('https://employees.goffwelding.com/start')">Copy link</button></div></div>`; }
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
      ${active.concerns ? `<div class="notice warning"><strong>Concern to resolve:</strong> ${esc(active.concerns)}</div>` : ''}
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
  return `${head('How Goff Recruiting works', 'A quick tour of the platform plus the features being brainstormed for the next phase. Use this as the one-pager to share or read on a phone.', `<button class="btn" onclick="window.print()">Print this guide</button>`)}

  <section class="panel">
    <h3>What this is</h3>
    <p>Goff Recruiting replaces the Google Workspace + Indeed + BBSI shuffle. Every applicant lives in one queue, from first application through onboarding handoff. There are two front doors:</p>
    <ul class="howto-list">
      <li><strong>Public careers page</strong> — currently at <code>goff.stoke-ai.com</code>, will move to <code>careers.goffwelding.com</code> when DNS is in hand. This is where applicants apply.</li>
      <li><strong>Admin dashboard</strong> — what you are looking at now. This is where the Goff hiring team runs the queue day to day.</li>
    </ul>
  </section>

  <section class="panel">
    <h3>Where applicants come in</h3>
    <p>Goff has multiple intake channels feeding one queue:</p>
    <ul class="howto-list">
      <li><strong>Careers page</strong> — apply form on <code>careers.goffwelding.com</code>.</li>
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
    <h3>Features we can potentially add</h3>
    <p>These are features we are brainstorming with Goff. None of them are built yet. Order will get nailed down once Goff starts running real candidates through the system and figures out which problems hurt the most. Some are huge wins; others are nice-to-have polish. The list is meant to be scanned and reacted to — yes, no, maybe later.</p>

    <h4 class="howto-subhead">Intake and quality</h4>

    <div class="howto-idea">
      <h5>One simple intake form for everyone</h5>
      <p>Walk-in at the door. Phone caller. Goff employee at a computer. Indeed applicant. They all use the same apply form on <code>careers.goffwelding.com</code>. It works on a phone, a tablet at the front desk, or a laptop. For walk-ins with a paper resume, snap a photo — the AI reads it, pre-fills the form (name, contact, role, experience, certifications), and files the original resume to the candidate record. No more sticky notes at the front desk and nothing lost to memory.</p>
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
