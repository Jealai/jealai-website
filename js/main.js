/* ============================================================
   JEAL.AI — Business Systems Audit Engine
   main.js v2.0
   ============================================================ */

// ── CONFIG ───────────────────────────────────────────────────
// Replace with your actual GHL webhook URL before deploying
const GHL_WEBHOOK_URL = 'YOUR_GHL_WEBHOOK_URL';

// ── AUDIT DATA ────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'q1',
    category: 'LEAD RESPONSE',
    text: 'How quickly are new leads contacted after they come in?',
    options: [
      { label: 'Within minutes — handled automatically', score: 3 },
      { label: 'Within an hour — someone checks regularly', score: 2 },
      { label: 'A few hours or same day', score: 1 },
      { label: 'Days later, or it\'s inconsistent', score: 0 }
    ],
    leakName: 'Slow Lead Response',
    leakDesc: 'New leads are not being reached fast enough. Speed to contact is one of the biggest factors in conversion.',
    quickWin: 'Set up an instant lead notification with an automated first-touch message. Most lost leads are gone within the first 5 minutes.'
  },
  {
    id: 'q2',
    category: 'FOLLOW-UP',
    text: 'How often do leads go cold with no follow-up?',
    options: [
      { label: 'Rarely — our system handles follow-up', score: 3 },
      { label: 'Sometimes — we follow up manually when we remember', score: 2 },
      { label: 'Often — it falls through the cracks', score: 1 },
      { label: 'Frequently — no real follow-up system', score: 0 }
    ],
    leakName: 'Follow-Up Gaps',
    leakDesc: 'Leads are slipping through without consistent follow-up. Most deals close on contact 4 or 5 — without a system, those never happen.',
    quickWin: 'Build a 5-step follow-up sequence that runs on its own. Consistency closes deals — not just a single call or message.'
  },
  {
    id: 'q3',
    category: 'PIPELINE VISIBILITY',
    text: 'Do you know where leads drop off in your process?',
    options: [
      { label: 'Yes — full visibility into every stage', score: 3 },
      { label: 'Partial — we track some stages but not all', score: 2 },
      { label: 'Not really — we have a rough idea', score: 1 },
      { label: 'No — no tracking in place', score: 0 }
    ],
    leakName: 'No Pipeline Visibility',
    leakDesc: 'Without visibility into where leads drop off, you can\'t improve your process. Every blind spot is a revenue leak.',
    quickWin: 'Set up a simple pipeline view so you can see every lead\'s stage. You can\'t fix what you can\'t see.'
  },
  {
    id: 'q4',
    category: 'SCHEDULING',
    text: 'How are appointments or consultations scheduled?',
    options: [
      { label: 'Fully handled — booking links, confirmations, reminders', score: 3 },
      { label: 'Online booking, but manually managed', score: 2 },
      { label: 'We call or email back to schedule', score: 1 },
      { label: 'Back-and-forth texting or phone tag', score: 0 }
    ],
    leakName: 'Scheduling Friction',
    leakDesc: 'Manual scheduling creates delays and drop-off. Every extra step between interest and appointment costs you deals.',
    quickWin: 'Replace phone tag with a booking link that sends automatic confirmations and reminders. Fewer no-shows, faster commitments.'
  },
  {
    id: 'q5',
    category: 'SALES PROCESS',
    text: 'How consistent is your sales process across your team?',
    options: [
      { label: 'Very consistent — everyone follows the same steps', score: 3 },
      { label: 'Mostly consistent — small variations', score: 2 },
      { label: 'It varies by rep', score: 1 },
      { label: 'We don\'t have a defined process', score: 0 }
    ],
    leakName: 'Inconsistent Sales Process',
    leakDesc: 'When each rep does it differently, results are unpredictable. Your best rep\'s process should be everyone\'s process.',
    quickWin: 'Document what your best rep does and build it into a standard workflow. Consistent process creates predictable revenue.'
  },
  {
    id: 'q6',
    category: 'MISSED INQUIRIES',
    text: 'What happens when a call or inquiry is missed?',
    options: [
      { label: 'An instant message goes out automatically', score: 3 },
      { label: 'Someone follows up the same day', score: 2 },
      { label: 'Usually caught, but delayed', score: 1 },
      { label: 'It often goes unaddressed', score: 0 }
    ],
    leakName: 'Missed Inquiry Drain',
    leakDesc: 'Every missed call or inquiry that goes unanswered is a potential customer walking to a competitor.',
    quickWin: 'Set up an automatic missed-call text-back. Every unanswered inquiry is a competitor\'s opportunity.'
  },
  {
    id: 'q7',
    category: 'CONVERSION TRACKING',
    text: 'Do you track conversion rates from lead to customer?',
    options: [
      { label: 'Yes — clearly and regularly', score: 3 },
      { label: 'Loosely — rough estimates', score: 2 },
      { label: 'Not actively', score: 1 },
      { label: 'Not at all', score: 0 }
    ],
    leakName: 'Invisible Conversion Funnel',
    leakDesc: 'Not measuring conversions means you\'re guessing what works. Small improvements in conversion have outsized revenue impact.',
    quickWin: 'Start tracking lead-to-customer conversion weekly. You\'ll immediately see where to focus to move the number.'
  },
  {
    id: 'q8',
    category: 'LEAD HANDLING',
    text: 'What happens after a new lead comes in?',
    options: [
      { label: 'They enter a structured pipeline with clear next steps', score: 3 },
      { label: 'Someone manually reviews and follows up', score: 2 },
      { label: 'It varies depending on who sees it first', score: 1 },
      { label: 'It\'s unclear — no consistent process', score: 0 }
    ],
    leakName: 'Unstructured Lead Handling',
    leakDesc: 'Without a defined process for every new lead, results depend entirely on who happens to see it. That\'s not a system — it\'s luck.',
    quickWin: 'Map out a clear pipeline with defined stages and owners. Structure turns inconsistent effort into predictable output.'
  },
  {
    id: 'q9',
    category: 'LEAD SOURCES',
    text: 'Where do most of your leads come from?',
    options: [
      { label: 'Paid ads (Facebook, Google, etc.)', score: null },
      { label: 'Referrals and word of mouth', score: null },
      { label: 'Organic / website / SEO', score: null },
      { label: 'Mixed or unclear', score: null }
    ]
  },
  {
    id: 'q10',
    category: 'BIGGEST CHALLENGE',
    text: 'What\'s your biggest challenge right now?',
    options: [
      { label: 'Slow response to new leads', score: null },
      { label: 'Low conversion rate', score: null },
      { label: 'Leads going cold without follow-up', score: null },
      { label: 'No clear tracking or reporting', score: null }
    ]
  }
];

// Tier definitions
const TIERS = [
  { min: 20, max: 24, label: 'Strong Foundation', color: '#0B94D3',
    title: 'Your systems are working.',
    body: 'You have solid fundamentals in place. The focus now is on optimization — small improvements at each stage compound into significant revenue gains.',
    opps: [
      'Fine-tune follow-up timing and message quality to improve conversion rates',
      'Add lead scoring to prioritize the highest-intent prospects',
      'Build reporting dashboards to spot bottlenecks before they become problems'
    ]
  },
  { min: 14, max: 19, label: 'Needs Attention', color: '#F5A623',
    title: 'You have gaps that are costing you.',
    body: 'Some of your systems are working — but the gaps in between are where deals get lost. The good news: targeted fixes in 2–3 areas will move the needle fast.',
    opps: [
      'Standardize your sales process so your best approach is everyone\'s approach',
      'Add pipeline visibility so you can see and fix where leads drop off',
      'Automate scheduling to cut friction and speed up the sales cycle'
    ]
  },
  { min: 7, max: 13, label: 'Revenue Leaks Present', color: '#E8692A',
    title: 'There are significant gaps in your pipeline.',
    body: 'Your business is actively losing revenue through slow response, missing follow-up, and inconsistent processes. These are fixable — but every week without a fix costs you.',
    opps: [
      'Implement a speed-to-lead response under 5 minutes for every new inquiry',
      'Build a structured follow-up sequence that runs without manual effort',
      'Create a CRM pipeline to track every lead from first contact to close'
    ]
  },
  { min: 0, max: 6, label: 'Critical Gaps', color: '#D63030',
    title: 'Your pipeline is losing most of what comes in.',
    body: 'The gaps identified in your audit are significant. Most of your leads are being lost before they ever have a chance to become customers. The fixes exist — and they\'re not as complex as you might think.',
    opps: [
      'Start with a simple CRM to replace spreadsheets and sticky notes',
      'Set up instant lead response so no inquiry goes more than 5 minutes without a reply',
      'Build a basic 3-step follow-up sequence for every new lead — consistency is everything'
    ]
  }
];

// ── STATE ─────────────────────────────────────────────────────
const state = {
  step: -1,         // -1 = gate, 0-9 = questions, 10 = results
  contact: {},
  answers: {},      // { q1: { label, score }, q2: ... }
  selectedIndex: null
};

// ── DOM REFS ──────────────────────────────────────────────────
const panelGate      = document.getElementById('panel-gate');
const panelQuestions = document.getElementById('panel-questions');
const panelResults   = document.getElementById('panel-results');
const gateForm       = document.getElementById('gate-form');

const qCurrentEl  = document.getElementById('q-current');
const qPctEl      = document.getElementById('q-pct');
const progressFill = document.getElementById('progress-fill');
const questionCard = document.getElementById('question-card');
const qCategory   = document.getElementById('q-category');
const qText       = document.getElementById('q-text');
const answerGrid  = document.getElementById('answer-grid');
const btnBack     = document.getElementById('btn-back');
const btnNext     = document.getElementById('btn-next');

// ── ROTATING WORD ─────────────────────────────────────────────
(function() {
  const words = ['Revenue', 'Efficiency', 'Sales', 'Time'];
  let idx = 0;
  const el = document.getElementById('rotating-word');
  if (!el) return;
  setInterval(() => {
    el.classList.add('word-exit');
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      el.classList.remove('word-exit');
      el.classList.add('word-enter');
      el.offsetHeight; // force reflow
      el.classList.remove('word-enter');
    }, 260);
  }, 2600);
})();

// ── NAVBAR SCROLL ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── REVEAL ON SCROLL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── FOOTER YEAR ───────────────────────────────────────────────
const fyEl = document.getElementById('footer-year');
if (fyEl) fyEl.textContent = new Date().getFullYear();

// ── GATE FORM SUBMIT ──────────────────────────────────────────
gateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate
  const fields = ['fullName', 'phone', 'title', 'businessName', 'email'];
  let valid = true;
  fields.forEach(f => {
    const input = document.getElementById(f);
    input.classList.remove('input-error');
    if (!input.value.trim()) {
      input.classList.add('input-error');
      valid = false;
    }
  });

  const emailInput = document.getElementById('email');
  if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailInput.classList.add('input-error');
    valid = false;
  }

  if (!valid) return;

  state.contact = {
    fullName:     document.getElementById('fullName').value.trim(),
    phone:        document.getElementById('phone').value.trim(),
    title:        document.getElementById('title').value.trim(),
    businessName: document.getElementById('businessName').value.trim(),
    email:        document.getElementById('email').value.trim()
  };

  showPanel('questions');
  state.step = 0;
  renderQuestion(0);
});

// ── PANEL SWITCHING ───────────────────────────────────────────
function showPanel(name) {
  panelGate.classList.add('hidden');
  panelQuestions.classList.add('hidden');
  panelResults.classList.add('hidden');

  if (name === 'gate')      panelGate.classList.remove('hidden');
  if (name === 'questions') panelQuestions.classList.remove('hidden');
  if (name === 'results')   panelResults.classList.remove('hidden');

  // Scroll to audit section
  document.getElementById('audit').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── RENDER QUESTION ───────────────────────────────────────────
function renderQuestion(idx) {
  const q = QUESTIONS[idx];
  state.step = idx;
  state.selectedIndex = null;

  // Progress
  const pct = Math.round(((idx) / QUESTIONS.length) * 100);
  qCurrentEl.textContent = idx + 1;
  qPctEl.textContent = (pct) + '%';
  progressFill.style.width = Math.max(pct, 4) + '%';

  // Update content (after brief exit transition)
  questionCard.classList.add('exiting');
  setTimeout(() => {
    qCategory.textContent = q.category;
    qText.textContent = q.text;

    answerGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-btn';
      btn.dataset.index = i;
      btn.innerHTML = `
        <span class="answer-letter">${letters[i]}</span>
        <span class="answer-text">${opt.label}</span>
      `;
      btn.addEventListener('click', () => selectAnswer(idx, i));
      answerGrid.appendChild(btn);
    });

    // Restore previously selected answer if navigating back
    const prev = state.answers[q.id];
    if (prev !== undefined) {
      const prevBtn = answerGrid.querySelector(`[data-index="${prev.index}"]`);
      if (prevBtn) prevBtn.classList.add('selected');
      state.selectedIndex = prev.index;
      btnNext.disabled = false;
    } else {
      btnNext.disabled = true;
    }

    // Back button visibility
    btnBack.style.visibility = idx === 0 ? 'hidden' : 'visible';

    // Last question: change next button label
    btnNext.textContent = idx === QUESTIONS.length - 1 ? 'See My Results →' : 'Next →';

    questionCard.classList.remove('exiting');
  }, 180);
}

function selectAnswer(qIdx, answerIdx) {
  const q = QUESTIONS[qIdx];
  const opt = q.options[answerIdx];

  // Update visual
  document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector(`[data-index="${answerIdx}"]`).classList.add('selected');

  state.selectedIndex = answerIdx;
  state.answers[q.id] = { label: opt.label, score: opt.score, index: answerIdx };
  btnNext.disabled = false;
}

btnNext.addEventListener('click', () => {
  if (state.selectedIndex === null) return;
  const nextIdx = state.step + 1;
  if (nextIdx < QUESTIONS.length) {
    renderQuestion(nextIdx);
  } else {
    buildResults();
  }
});

btnBack.addEventListener('click', () => {
  if (state.step > 0) {
    renderQuestion(state.step - 1);
  }
});

// ── SCORING ───────────────────────────────────────────────────
function computeScores() {
  const a = state.answers;

  const get = (id) => (a[id] && a[id].score !== null) ? (a[id].score || 0) : 0;

  const salesScore  = get('q1') + get('q2') + get('q5');
  const opsScore    = get('q4') + get('q6') + get('q8');
  const mktScore    = get('q3') + get('q7');
  const total       = salesScore + opsScore + mktScore;

  // Tier
  const tier = TIERS.find(t => total >= t.min && total <= t.max) || TIERS[TIERS.length - 1];

  // Top leaks: scored questions sorted by score ascending, take top 3
  const scoredQs = QUESTIONS.filter(q => q.leakName).map(q => ({
    q,
    score: (a[q.id] && a[q.id].score !== null) ? (a[q.id].score || 0) : 0
  }));
  scoredQs.sort((a, b) => a.score - b.score);
  const topLeaks = scoredQs.slice(0, 3);

  // Quick wins from top leaks
  const quickWins = topLeaks.map(l => l.q.quickWin).filter(Boolean);

  return {
    total, salesScore, opsScore, mktScore, tier, topLeaks, quickWins,
    leadSource:      a.q9  ? a.q9.label  : '',
    biggestChallenge: a.q10 ? a.q10.label : ''
  };
}

// ── BUILD RESULTS ─────────────────────────────────────────────
function buildResults() {
  const scores = computeScores();
  showPanel('results');

  // Header
  const firstName = state.contact.fullName.split(' ')[0];
  document.getElementById('results-headline').textContent = `${state.contact.businessName} — Systems Audit`;
  document.getElementById('results-sub').textContent = `Completed by ${state.contact.fullName} · ${state.contact.title}`;

  // Score ring animation
  const circumference = 2 * Math.PI * 50; // r=50 used in SVG
  const ringFill = document.getElementById('ring-fill');
  const tierColor = scores.tier.color;
  ringFill.style.stroke = tierColor;

  // Animate ring
  setTimeout(() => {
    const offset = circumference * (1 - scores.total / 24);
    ringFill.style.strokeDashoffset = offset;
  }, 200);

  // Animate score number
  animateNumber(document.getElementById('ring-score'), 0, scores.total, 1000);

  // Tier badge
  const tierEl = document.getElementById('ring-tier');
  tierEl.textContent = scores.tier.label;
  tierEl.style.background = hexToRgba(tierColor, 0.15);
  tierEl.style.color = tierColor;

  // Score detail
  document.getElementById('score-title').textContent = scores.tier.title;
  document.getElementById('score-body').textContent  = scores.tier.body;

  // Category bars
  const catBarsEl = document.getElementById('category-bars');
  catBarsEl.innerHTML = '';
  const categories = [
    { label: 'Sales',      value: scores.salesScore, max: 9 },
    { label: 'Operations', value: scores.opsScore,    max: 9 },
    { label: 'Marketing',  value: scores.mktScore,    max: 6 }
  ];
  categories.forEach(cat => {
    const pct = Math.round((cat.value / cat.max) * 100);
    const barColor = pct >= 75 ? '#0B94D3' : pct >= 45 ? '#F5A623' : '#E8692A';
    catBarsEl.innerHTML += `
      <div class="cat-bar">
        <div class="cat-bar-header">
          <span class="cat-bar-label">${cat.label}</span>
          <span class="cat-bar-pct">${cat.value}/${cat.max}</span>
        </div>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="background:${barColor}; width:${pct}%"></div>
        </div>
      </div>
    `;
  });
  // Trigger bar animations after render
  setTimeout(() => {
    document.querySelectorAll('.cat-bar-fill').forEach(b => {
      const w = b.style.width;
      b.style.width = '0%';
      setTimeout(() => { b.style.width = w; }, 50);
    });
  }, 300);

  // Leaks
  const leaksGrid = document.getElementById('leaks-grid');
  leaksGrid.innerHTML = '';
  scores.topLeaks.forEach((item, i) => {
    leaksGrid.innerHTML += `
      <div class="leak-card">
        <div class="leak-number">${i + 1}</div>
        <div class="leak-info">
          <div class="leak-name">${item.q.leakName}</div>
          <div class="leak-desc">${item.q.leakDesc}</div>
        </div>
      </div>
    `;
  });

  // Quick wins
  const winsList = document.getElementById('wins-list');
  winsList.innerHTML = '';
  scores.quickWins.forEach(w => {
    winsList.innerHTML += `<li>${w}</li>`;
  });

  // Opportunities
  const oppsList = document.getElementById('opps-list');
  oppsList.innerHTML = '';
  scores.tier.opps.forEach(o => {
    oppsList.innerHTML += `<li>${o}</li>`;
  });

  // Fire GHL webhook
  sendToGHL(scores);

  // PDF button
  document.getElementById('btn-download-pdf').addEventListener('click', () => {
    generatePDF(scores);
  });
}

// ── NUMBER ANIMATION ──────────────────────────────────────────
function animateNumber(el, from, to, duration) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── HEX TO RGBA ───────────────────────────────────────────────
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── GHL WEBHOOK ───────────────────────────────────────────────
function sendToGHL(scores) {
  if (GHL_WEBHOOK_URL === 'YOUR_GHL_WEBHOOK_URL') return; // skip if not configured

  const payload = {
    // Contact
    fullName:         state.contact.fullName,
    phone:            state.contact.phone,
    title:            state.contact.title,
    businessName:     state.contact.businessName,
    email:            state.contact.email,
    // Scores
    healthScore:      scores.total,
    healthTier:       scores.tier.label,
    salesScore:       scores.salesScore,
    operationsScore:  scores.opsScore,
    marketingScore:   scores.mktScore,
    // Leaks
    revenueLeak1:     scores.topLeaks[0] ? scores.topLeaks[0].q.leakName : '',
    revenueLeak2:     scores.topLeaks[1] ? scores.topLeaks[1].q.leakName : '',
    revenueLeak3:     scores.topLeaks[2] ? scores.topLeaks[2].q.leakName : '',
    // Segmentation
    leadSource:       scores.leadSource,
    biggestChallenge: scores.biggestChallenge,
    // Tags
    tags:             ['free-audit-complete', `tier-${scores.tier.label.toLowerCase().replace(/\s+/g,'-')}`],
    // Raw answers
    q1: state.answers.q1 ? state.answers.q1.label : '',
    q2: state.answers.q2 ? state.answers.q2.label : '',
    q3: state.answers.q3 ? state.answers.q3.label : '',
    q4: state.answers.q4 ? state.answers.q4.label : '',
    q5: state.answers.q5 ? state.answers.q5.label : '',
    q6: state.answers.q6 ? state.answers.q6.label : '',
    q7: state.answers.q7 ? state.answers.q7.label : '',
    q8: state.answers.q8 ? state.answers.q8.label : '',
    q9: state.answers.q9 ? state.answers.q9.label : '',
    q10: state.answers.q10 ? state.answers.q10.label : ''
  };

  fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {}); // Fail silently — don't break UX
}

// ── PDF GENERATION ────────────────────────────────────────────
function generatePDF(scores) {
  if (typeof window.jspdf === 'undefined') {
    alert('PDF generator is loading. Please try again in a moment.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, MARGIN = 20;
  let y = 20;

  const LINE = (n = 1) => { y += n * 6; };

  // Header bar
  doc.setFillColor(12, 62, 154);
  doc.rect(0, 0, W, 28, 'F');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255,255,255);
  doc.text('Jeal.AI', MARGIN, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 214, 243);
  doc.text('Business Systems Audit Report', MARGIN, 20);

  // Date
  doc.setFontSize(8);
  doc.setTextColor(200,220,255);
  const dateStr = new Date().toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  doc.text(dateStr, W - MARGIN, 20, { align: 'right' });

  y = 40;

  // Contact info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 20, 40);
  doc.text(state.contact.fullName, MARGIN, y);
  LINE(0.5);
  y += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 100, 130);
  doc.text(`${state.contact.title} · ${state.contact.businessName}`, MARGIN, y);
  y += 4;
  doc.text(state.contact.email, MARGIN, y);
  y += 14;

  // Health Score box
  doc.setFillColor(240, 246, 255);
  doc.roundedRect(MARGIN, y, W - MARGIN * 2, 28, 3, 3, 'F');
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(12, 62, 154);
  doc.text(`${scores.total}/24`, MARGIN + 10, y + 18);

  doc.setFontSize(11);
  doc.setTextColor(scores.tier.color.substring ? 60 : 60, 80, 120);
  doc.setTextColor(60, 80, 120);
  doc.text(scores.tier.label.toUpperCase(), MARGIN + 44, y + 12);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 100, 130);
  const splitTitle = doc.splitTextToSize(scores.tier.title, W - MARGIN * 2 - 50);
  doc.text(splitTitle, MARGIN + 44, y + 19);
  y += 36;

  // Category scores
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10,20,40);
  doc.text('CATEGORY BREAKDOWN', MARGIN, y); y += 7;
  const cats = [
    { label: 'Sales',      val: scores.salesScore,  max: 9 },
    { label: 'Operations', val: scores.opsScore,     max: 9 },
    { label: 'Marketing',  val: scores.mktScore,     max: 6 }
  ];
  cats.forEach(c => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60,80,120);
    doc.text(`${c.label}: ${c.val}/${c.max}`, MARGIN, y);
    // Bar
    const barW = (W - MARGIN * 2 - 50) * (c.val / c.max);
    doc.setFillColor(220,232,248);
    doc.rect(MARGIN + 44, y - 4, W - MARGIN * 2 - 50, 5, 'F');
    doc.setFillColor(11,148,211);
    if (barW > 0) doc.rect(MARGIN + 44, y - 4, barW, 5, 'F');
    y += 8;
  });
  y += 8;

  // Top Revenue Leaks
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10,20,40);
  doc.text('TOP REVENUE LEAKS IDENTIFIED', MARGIN, y); y += 7;

  scores.topLeaks.forEach((item, i) => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFillColor(255, 242, 242);
    doc.roundedRect(MARGIN, y - 4, W - MARGIN * 2, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 30, 30);
    doc.text(`${i+1}. ${item.q.leakName}`, MARGIN + 4, y + 3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80,80,80);
    const descLines = doc.splitTextToSize(item.q.leakDesc, W - MARGIN * 2 - 10);
    doc.text(descLines[0] || '', MARGIN + 4, y + 9);
    y += 20;
  });
  y += 4;

  // Quick Wins
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10,20,40);
  doc.text('QUICK WINS', MARGIN, y); y += 7;
  scores.quickWins.forEach(w => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60,80,120);
    const lines = doc.splitTextToSize(`- ${w}`, W - MARGIN * 2);
    doc.text(lines, MARGIN, y);
    y += lines.length * 5 + 4;
  });
  y += 4;

  // Game Plan CTA
  if (y > 210) { doc.addPage(); y = 20; }

  const deliverables = [
    'Priority fix list based on your biggest leaks',
    'Recommended approach for each gap',
    'Estimated time and revenue impact',
    'A clear starting point, no overwhelm'
  ];
  const ctaBody = `We'll reach out to walk through a detailed business audit and custom implementation plan showing exactly what to fix, in what order, and what it's worth to your business.`;
  const ctaLines = doc.splitTextToSize(ctaBody, W - MARGIN * 2 - 12);
  const boxH = 14 + ctaLines.length * 5 + 10 + 7 + deliverables.length * 7 + 6;

  doc.setFillColor(240, 246, 255);
  doc.roundedRect(MARGIN, y, W - MARGIN * 2, boxH, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(12, 62, 154);
  doc.text('YOUR SYSTEMS IMPROVEMENT GAME PLAN IS ON ITS WAY', MARGIN + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60,80,120);
  doc.text(ctaLines, MARGIN + 6, y + 18);

  let cy = y + 18 + ctaLines.length * 5 + 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(12, 62, 154);
  doc.text("WHAT'S INCLUDED IN YOUR GAME PLAN:", MARGIN + 6, cy);
  cy += 7;

  deliverables.forEach(d => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60,80,120);
    doc.text(`- ${d}`, MARGIN + 10, cy);
    cy += 7;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160,180,200);
    doc.text('jeal.ai  ·  Confidential', MARGIN, 290);
    doc.text(`Page ${i} of ${pageCount}`, W - MARGIN, 290, { align: 'right' });
  }

  doc.save(`Jeal-AI-Audit-${state.contact.businessName.replace(/\s+/g,'-')}.pdf`);
}
