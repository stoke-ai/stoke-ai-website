// Goff Welding — Public Careers page.
// Self-contained SPA. NO admin/recruiting code lives here so that anyone who
// hits this URL or views source only sees applicant-facing content. The form
// POSTs to /api/goff-recruiting/applications (server-side persistence +
// the hiring team's Telegram alert).

const jobs = [
  {id:'welder', title:'Sanitary Stainless Steel Welder / Fabricator', type:'Full-time', path:'Welder path',
   summary:'Build high-stakes food and dairy stainless work the way it should be done — clean welds, tight tolerances, safe shop. Sanitary experience preferred; we will test on day one.',
   payRange:'$25–$32/hr DOE', schedule:'Mon–Fri, 6:00 AM–2:30 PM (some Saturdays as needed)', location:'On-site • Paul, ID (no remote)',
   perks:['Weekly pay', 'Health benefits after 60 days', 'Sponsored training', 'Stable year-round shop work'],
   certifications:'Welding cert or strong sanitary stainless portfolio. AWS or equivalent a plus.'},
  {id:'fitter', title:'Sanitary Stainless Steel Fitter', type:'Full-time', path:'Welder path',
   summary:'Fit-up, layout, and teamwork on sanitary stainless projects. We test fit-up early so you know fast whether this is your shop.',
   payRange:'$22–$28/hr DOE', schedule:'Mon–Fri, 6:00 AM–2:30 PM', location:'On-site • Paul, ID',
   perks:['Weekly pay', 'Health benefits after 60 days', 'Sponsored training'],
   certifications:'Layout/fit-up experience on stainless or structural. Blueprint reading required.'},
  {id:'helper', title:'Shop Helper / Entry Level', type:'Full-time / Part-time', path:'Other path',
   summary:'Entry path for reliable, teachable people with a strong work ethic and safety mindset. We hire for attitude and build the skill on the floor.',
   payRange:'$17–$20/hr', schedule:'Mon–Fri, 6:00 AM–2:30 PM', location:'On-site • Paul, ID',
   perks:['Weekly pay', 'Health benefits after 60 days', 'On-the-job training paid by us'],
   certifications:'None required. Reliability and willingness to learn matter most.'},
  {id:'foreman', title:'Foreman / Project Lead', type:'Full-time', path:'Other path',
   summary:'Run crews, own jobs end-to-end, and keep customers in the loop. Second interview and manager review required because this seat carries weight.',
   payRange:'$30–$40/hr DOE + project bonuses', schedule:'Mon–Fri, day shift; occasional travel for installs', location:'On-site • Paul, ID + project sites',
   perks:['Weekly pay', 'Health benefits after 60 days', 'Project bonus potential', 'Sponsored leadership training'],
   certifications:'Prior crew leadership in fabrication or industrial trades. Stainless background preferred.'},
  {id:'inventory', title:'Inventory Control Specialist', type:'Full-time', path:'Other path',
   summary:'Be the person who keeps materials moving and the shop honest. Accuracy and clean handoffs save us money — and your work is visible every day.',
   payRange:'$20–$26/hr DOE', schedule:'Mon–Fri, day shift', location:'On-site • Paul, ID',
   perks:['Weekly pay', 'Health benefits after 60 days', 'Stable role, no weekends'],
   certifications:'Warehouse / inventory experience. Comfortable with spreadsheets and barcode systems.'},
  {id:'procurement', title:'Procurement Manager', type:'Full-time', path:'Other path',
   summary:'Own vendor relationships, material cost, and the flow of metal into the shop. The job pays its salary when you negotiate well and prevent shortages.',
   payRange:'$60K–$80K DOE', schedule:'Mon–Fri, day shift', location:'On-site • Paul, ID',
   perks:['Health benefits after 60 days', 'Sponsored training', 'Performance bonus potential'],
   certifications:'Procurement or buyer experience in fabrication, manufacturing, or industrial trades.'},
];

let view = 'career';

function esc(s){ return String(s ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

function render(){ document.getElementById('app').innerHTML = ({career, thanks}[view] || career)(); }

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
            <button class="btn primary" id="submitBtn" onclick="submitApplication()">Submit application</button>
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

function prefillApply(id){
  const j = jobs.find(x => x.id === id);
  if(!j) return;
  const sel = document.getElementById('appRole');
  if(sel) sel.value = j.title;
  document.getElementById('apply')?.scrollIntoView({behavior:'smooth'});
  document.getElementById('appName')?.focus();
}

async function submitApplication(){
  const name = document.getElementById('appName').value || '';
  const email = document.getElementById('appEmail').value || '';
  const phone = document.getElementById('appPhone').value || '';
  const role = document.getElementById('appRole').value;
  const availability = document.getElementById('appAvailability')?.value || '';
  const notes = document.getElementById('appNotes').value || '';

  if(!name.trim() || !email.trim()){
    alert('Please add your name and email before submitting.');
    return;
  }
  const [first, ...rest] = name.split(' ');
  const last = rest.join(' ') || '';
  const combined = availability ? `Availability: ${availability}\n\n${notes}` : notes;

  const btn = document.getElementById('submitBtn');
  if(btn){ btn.disabled = true; btn.textContent = 'Submitting…'; }

  try {
    const r = await fetch('/api/goff-recruiting/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first, last, email, phone, role, source: 'Goff careers page', notes: combined }),
    });
    if(!r.ok){
      const body = await r.json().catch(() => null);
      if(btn){ btn.disabled = false; btn.textContent = 'Submit application'; }
      alert(body?.error || 'Could not submit. Please try again or call (208) 647-2488.');
      return;
    }
  } catch(_) {
    if(btn){ btn.disabled = false; btn.textContent = 'Submit application'; }
    alert('Could not reach our servers. Please try again or call (208) 647-2488.');
    return;
  }
  view = 'thanks';
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
        <button class="btn" onclick="view='career';render()">Back to open positions</button>
      </div>
    </section>
  </main>`;
}

render();
