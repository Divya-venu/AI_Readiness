/* ═══════════════════════════════════════════
   module6.js – Aroha AI Maturity Assessment
   Module 6: Executive Summary Report
   ═══════════════════════════════════════════ */

const MODULE_LABELS = [
  'AI Strategy & Business Alignment',
  'Data Foundations & Literacy',
  'Technical Architecture & Infrastructure',
  'Governance, Risk & Ethics',
  'Culture & Talent Readiness'
];

const MODULE_SHORT = ['Strategy', 'Data', 'Technical', 'Governance', 'Culture'];

const DIM_LABELS = [
  'Strategy & Alignment',
  'Data Foundations',
  'Tech Architecture',
  'Risk & Ethics',
  'Talent & Culture'
];

/* ─────────────────────────────────────────
   LOAD SCORES
   ───────────────────────────────────────── */
function loadScores() {
  const keys = ['module1Score', 'module2Score', 'module3Score', 'module4Score', 'module5Score'];
  const saved = keys.map(k => {
    const v = parseFloat(sessionStorage.getItem(k) || localStorage.getItem(k));
    return isNaN(v) ? null : v;
  });
  if (saved.some(v => v !== null)) return saved.map(v => v !== null ? v : 2.5);
  return [2.2, 3.1, 2.6, 1.8, 3.4];
}

function loadUser() {
  return {
    name:    sessionStorage.getItem('userName')    || localStorage.getItem('userName')    || 'Your Name',
    company: sessionStorage.getItem('userCompany') || localStorage.getItem('userCompany') || 'Your Organisation'
  };
}

const scores  = loadScores();
const user    = loadUser();
const overall = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

/* ─────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────── */
function maturityLabel(s) {
  if (s < 1.5) return 'Initial';
  if (s < 2.5) return 'Developing';
  if (s < 3.5) return 'Defined';
  if (s < 4.5) return 'Managed';
  return 'Optimised';
}

function scoreToLevel(s) {
  if (s < 1)   return { level: 'L0', state: 'Ad Hoc' };
  if (s < 2)   return { level: 'L1', state: 'Descriptive' };
  if (s < 3)   return { level: 'L2', state: 'Governed' };
  if (s < 4)   return { level: 'L3', state: 'ML-Ready' };
  if (s < 4.5) return { level: 'L4', state: 'AI-Native' };
  return             { level: 'L5', state: 'Autonomous' };
}

function barColorClass(s)   { return s >= 4 ? 'bar-green'      : s >= 2.5 ? 'bar-amber'      : 'bar-red'; }
function badgeColorClass(s) { return s >= 4 ? 'badge-bg-green' : s >= 2.5 ? 'badge-bg-amber' : 'badge-bg-red'; }

/* ─────────────────────────────────────────
   COVER BANNER
   ───────────────────────────────────────── */
function renderCover() {
  const clientLabel = user.name;
  const companyLabel = user.company;
  document.getElementById('clientName').textContent        = clientLabel;
  document.getElementById('companyName').textContent       = companyLabel;
  document.getElementById('reportDate').textContent        = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('overallLabelCover').textContent = maturityLabel(overall) + ' (' + overall.toFixed(1) + ' / 5.0)';

  const footerCompanyEl = document.getElementById('footerCompanyName');
  if (footerCompanyEl) {
    footerCompanyEl.innerHTML = `<strong>${companyLabel}</strong> &nbsp;|&nbsp; © 2026 Aroha Technologies`;
  }

  return clientLabel;
}

/* ─────────────────────────────────────────
   SECTION 1: EXECUTIVE OVERVIEW
   ───────────────────────────────────────── */
function renderSection1(companyLabel) {
  const lvl    = scoreToLevel(overall);
  const minIdx = scores.indexOf(Math.min(...scores));
  const maxIdx = scores.indexOf(Math.max(...scores));

  document.getElementById('overallScore').textContent = overall.toFixed(1);
  document.getElementById('overallLabel').textContent = maturityLabel(overall);
  document.getElementById('summaryAvg').textContent   = overall.toFixed(1) + ' / 5.0';
  document.getElementById('focusArea').textContent    = MODULE_SHORT[minIdx];
  document.getElementById('strongArea').textContent   = MODULE_SHORT[maxIdx];

  setTimeout(() => {
    const bar = document.getElementById('overallBar');
    if (bar) bar.style.width = (overall / 5 * 100) + '%';
  }, 300);

  const overviewMap = {
    'Initial':    `${companyLabel} is in the early stages of AI adoption. Currently at <strong>${lvl.level} – ${lvl.state}</strong>, the organisation faces foundational challenges including siloed data systems, limited governance, and nascent AI awareness. The priority is establishing a reliable data and governance foundation before investing in advanced AI capabilities.`,
    'Developing': `${companyLabel} has begun its AI journey and is operating at <strong>${lvl.level} – ${lvl.state}</strong>. Several areas show promising maturity, but key gaps remain in data governance, infrastructure scalability, and talent readiness. A structured, phased approach will accelerate progress toward production-grade AI capabilities.`,
    'Defined':    `${companyLabel} is making solid progress on its AI transformation, currently at <strong>${lvl.level} – ${lvl.state}</strong>. Core foundations are in place with clear opportunities to scale into ML-Ready status. Strengthening the weakest dimensions will create a balanced, enterprise-wide AI capability.`,
    'Managed':    `${companyLabel} demonstrates strong AI maturity at <strong>${lvl.level} – ${lvl.state}</strong>. The organisation is well-positioned for advanced AI deployment. Strategic investment in remaining gaps will unlock AI-Native capabilities and differentiated competitive advantage.`,
    'Optimised':  `${companyLabel} is an AI leader, operating at <strong>${lvl.level} – ${lvl.state}</strong>. The organisation has the foundations for autonomous, self-optimising AI systems. Focus shifts to innovation, ecosystem partnerships, and governance as AI capabilities expand further.`
  };

  document.getElementById('overviewText').innerHTML =
    overviewMap[maturityLabel(overall)] || overviewMap['Developing'];

  return { lvl, minIdx, maxIdx };
}

/* ─────────────────────────────────────────
   RADAR CHART
   ───────────────────────────────────────── */
function renderRadar() {
  new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: MODULE_SHORT,
      datasets: [{
        label: 'Score',
        data: scores,
        backgroundColor: 'rgba(224,101,51,0.15)',
        borderColor: '#E06533',
        borderWidth: 2,
        pointBackgroundColor: '#E06533',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      scales: {
        r: {
          min: 0, max: 5,
          ticks: { stepSize: 1, font: { size: 9 }, color: '#9ca3af' },
          grid: { color: '#e5e7eb' },
          pointLabels: { font: { size: 10, weight: '600' }, color: '#374151' }
        }
      },
      plugins: { legend: { display: false } },
      animation: { duration: 1200 }
    }
  });
}

/* ─────────────────────────────────────────
   SECTION 2: MATURITY FRAMEWORK — HIGHLIGHT
   ───────────────────────────────────────── */
function renderSection2(lvl) {
  document.getElementById('currentLevelText').textContent =
    `${lvl.level} – ${lvl.state}  (Overall Score: ${overall.toFixed(1)} / 5.0)`;

  const levelRowMap = { L0: 0, L1: 1, L2: 2, L3: 3, L4: 4, L5: 5 };
  const rows = document.querySelectorAll('.maturity-table tbody tr');
  const ri = levelRowMap[lvl.level];
  if (rows[ri]) rows[ri].classList.add('highlight');
}

/* ─────────────────────────────────────────
   SECTION 3: CURRENT STATE — BARS + SCORE DISTRIBUTION
   ───────────────────────────────────────── */
function renderSection3() {

  /* ── Score bars ── */
  const barsEl = document.getElementById('moduleBars');
  scores.forEach((s, i) => {
    const pct  = (s / 5 * 100).toFixed(1);
    const lv   = scoreToLevel(s);
    const wrap = document.createElement('div');
    wrap.className = 'module-bar-wrap';
    wrap.innerHTML = `
      <div class="module-bar-header">
        <span class="module-bar-label">${MODULE_LABELS[i]}</span>
        <span class="module-bar-score">${s.toFixed(1)}</span>
      </div>
      <div class="module-bar-sub">
        <span class="bar-level-badge ${badgeColorClass(s)}">${lv.level} · ${lv.state}</span>
        <span style="font-size:11px;color:#9ca3af;">${maturityLabel(s)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${barColorClass(s)}" data-pct="${pct}" style="width:0%"></div>
      </div>`;
    barsEl.appendChild(wrap);
  });

  /* Animate bars */
  setTimeout(() => {
    document.querySelectorAll('.bar-fill[data-pct]').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 400);

  /* ── Score distribution card ── */
  const hc = scores.filter(s => s >= 4).length;
  const mc = scores.filter(s => s >= 2.5 && s < 4).length;
  const lc = scores.filter(s => s < 2.5).length;

  document.getElementById('scoreDistribution').innerHTML = `
    <div class="meta-card" style="height:100%;display:flex;flex-direction:column;justify-content:space-between;">
      <p class="meta-label">Score Distribution</p>
      <div style="display:flex;justify-content:center;align-items:center;flex:1;padding:8px 0;">
        <canvas id="distDonutChart" width="140" height="140" style="max-width:140px;max-height:140px;"></canvas>
      </div>
      <div>
        <div class="meta-row">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:2px;background:#10b981;display:inline-block;flex-shrink:0;"></span>
            <span class="meta-key">Strong (≥4.0)</span>
          </div>
          <span style="font-size:18px;font-weight:900;color:#059669;">${hc}</span>
        </div>
        <div class="meta-row">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:2px;background:#f59e0b;display:inline-block;flex-shrink:0;"></span>
            <span class="meta-key">Developing (2.5–4.0)</span>
          </div>
          <span style="font-size:18px;font-weight:900;color:#d97706;">${mc}</span>
        </div>
        <div class="meta-row" style="border-bottom:none;padding-bottom:0;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:2px;background:#ef4444;display:inline-block;flex-shrink:0;"></span>
            <span class="meta-key">Needs Focus (&lt;2.5)</span>
          </div>
          <span style="font-size:18px;font-weight:900;color:#dc2626;">${lc}</span>
        </div>
      </div>
      <p style="font-size:11px;color:#9ca3af;margin:10px 0 0;border-top:1px solid #f3f4f6;padding-top:10px;">
        Across 5 assessment modules
      </p>
    </div>`;

  new Chart(document.getElementById('distDonutChart'), {
    type: 'doughnut',
    data: {
      labels: ['Strong', 'Developing', 'Focus'],
      datasets: [{
        data: [hc || 0.001, mc || 0.001, lc || 0.001],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      animation: { animateScale: true, duration: 1200 }
    }
  });
}

/* ─────────────────────────────────────────
   SECTION 4: CRITICAL GAP ANALYSIS
   ───────────────────────────────────────── */
function renderSection4() {
  const BLOCKERS = [
    { thr: 2.5, idx: 0, txt: 'AI strategy is not fully aligned with business objectives — KPIs and executive sponsorship need strengthening.' },
    { thr: 2.5, idx: 1, txt: 'Data foundations are fragile — siloed systems, inconsistent hygiene, and low data literacy are blocking ML readiness.' },
    { thr: 2.5, idx: 2, txt: 'Technical infrastructure lacks scalability — legacy systems and limited API readiness constrain AI workload deployment.' },
    { thr: 2.5, idx: 3, txt: 'Governance gaps create risk — absence of bias policies, compliance audits, and model transparency frameworks.' },
    { thr: 2.5, idx: 4, txt: 'Talent and culture readiness is low — limited AI skills in-house and insufficient change management processes.' }
  ];

  const RISKS = [
    { thr: 3.0, idx: 1, txt: 'Data freshness and trust issues across teams may undermine model reliability in production environments.' },
    { thr: 3.0, idx: 3, txt: 'Regulatory and compliance exposure — AI outputs may not meet EU AI Act or local data privacy requirements.' },
    { thr: 3.0, idx: 2, txt: 'Infrastructure lock-in risk — current architecture may not support future AI-Native event-driven workloads.' },
    { thr: 3.5, idx: 0, txt: 'Without a unified AI investment horizon, projects risk stalling after pilots without a clear scaling path.' },
    { thr: 3.5, idx: 4, txt: 'Employee resistance to AI adoption could slow implementation timelines and reduce ROI on AI investments.' }
  ];

  const blEl = document.getElementById('blockersList');
  let bn = 0;
  BLOCKERS.forEach(b => {
    if (scores[b.idx] < b.thr) {
      bn++;
      const d = document.createElement('div');
      d.className = 'gap-item gap-item-red';
      d.innerHTML = `<div class="gap-dot dot-red"></div><p style="font-size:13px;color:#374151;margin:0;">${b.txt}</p>`;
      blEl.appendChild(d);
    }
  });
  if (!bn) {
    blEl.innerHTML = '<div class="gap-item gap-item-green"><div class="gap-dot dot-green"></div><p style="font-size:13px;color:#374151;margin:0;">No critical blockers identified — your organisation is performing well across all dimensions.</p></div>';
  }

  const riEl = document.getElementById('riskList');
  let rn = 0;
  RISKS.forEach(r => {
    if (scores[r.idx] < r.thr) {
      rn++;
      const d = document.createElement('div');
      d.className = 'gap-item gap-item-amber';
      d.innerHTML = `<div class="gap-dot dot-amber"></div><p style="font-size:13px;color:#374151;margin:0;">${r.txt}</p>`;
      riEl.appendChild(d);
    }
  });
  if (!rn) {
    riEl.innerHTML = '<div class="gap-item gap-item-green"><div class="gap-dot dot-green"></div><p style="font-size:13px;color:#374151;margin:0;">Risk profile is low — strong governance and infrastructure scores reduce operational risk.</p></div>';
  }

  const hc = scores.filter(s => s >= 4).length;
  const mc = scores.filter(s => s >= 2.5 && s < 4).length;
  const lc = scores.filter(s => s < 2.5).length;

  const highEl  = document.getElementById('highCount');
  const medEl   = document.getElementById('medCount');
  const lowEl   = document.getElementById('lowCount');
  const donutEl = document.getElementById('donutChart');

  if (highEl) highEl.textContent = hc;
  if (medEl)  medEl.textContent  = mc;
  if (lowEl)  lowEl.textContent  = lc;

  if (donutEl) {
    new Chart(donutEl, {
      type: 'doughnut',
      data: {
        labels: ['Strong', 'Developing', 'Focus'],
        datasets: [{
          data: [hc || 0.001, mc || 0.001, lc || 0.001],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '65%',
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        animation: { animateScale: true }
      }
    });
  }
}

/* ─────────────────────────────────────────
   SECTION 6: CONCLUSION & NEXT STEPS
   ───────────────────────────────────────── */
function renderSection6(lvl, minIdx, maxIdx) {
  const ALL_STEPS = [
    { pri: scores[1], title: 'Data Foundation Audit',            detail: `Deep-dive into your data infrastructure — identify silos, assess hygiene practices, and map lineage gaps. Target: move from ${scoreToLevel(scores[1]).level} to L2 Governed status.` },
    { pri: scores[3], title: 'AI Governance Workshop',           detail: 'Establish an AI governance committee. Define bias policies, transparency guidelines, and schedule your first EU AI Act compliance review.' },
    { pri: scores[2], title: 'Technical Architecture Review',    detail: 'Audit your current Snowflake/BigQuery/Fabric or equivalent architecture. Identify API gaps and cloud migration opportunities to enable scalable AI workloads.' },
    { pri: scores[0], title: 'Executive Alignment Session',      detail: 'Align C-Suite on AI investment horizon, success KPIs, and ownership. Define a 12-month AI roadmap with measurable milestones and clear accountability.' },
    { pri: scores[4], title: 'AI Talent & Upskilling Programme', detail: 'Launch an internal AI literacy programme. Identify high-potential employees for AI champion roles and assess external hire requirements for data science.' },
    { pri: 99,        title: 'Pilot Use Case Selection',         detail: 'Select one high-impact, low-risk use case for a RAG-based AI agent pilot — e.g., internal knowledge assistant, automated reporting, or customer query automation.' }
  ];

  ALL_STEPS.sort((a, b) => a.pri - b.pri);

  const nsEl = document.getElementById('nextStepsList');
  ALL_STEPS.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'next-step';
    d.innerHTML = `
      <div class="step-num">${i + 1}</div>
      <div>
        <p style="font-size:14px;font-weight:600;color:#881337;margin:0 0 2px;">${s.title}</p>
        <p style="font-size:13px;color:#6b7270;margin:0;">${s.detail}</p>
      </div>`;
    nsEl.appendChild(d);
  });

  document.getElementById('conclusionText').textContent =
    `Your organisation scored ${overall.toFixed(1)}/5.0, placing you at ${lvl.level} – ${lvl.state} on the AI Maturity Framework. ` +
    `The ${MODULE_SHORT[maxIdx]} dimension is your strongest asset (${scores[maxIdx].toFixed(1)}), ` +
    `while ${MODULE_SHORT[minIdx]} (${scores[minIdx].toFixed(1)}) requires the most immediate attention. ` +
    `The prioritised next steps below reflect your specific assessment results.`;
}

/* ─────────────────────────────────────────
   BUILD REPORT HTML — shared by sendEmail & autoSendReport
   ───────────────────────────────────────── */
function buildReportHTML() {
  /* Freeze bar animations so Puppeteer captures full widths */
  document.querySelectorAll('.bar-fill[data-pct]').forEach(el => {
    el.style.transition = 'none';
    el.style.width = el.dataset.pct + '%';
  });
  const overallBar = document.getElementById('overallBar');
  if (overallBar) {
    overallBar.style.transition = 'none';
    overallBar.style.width = (overall / 5 * 100) + '%';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Aroha – AI Readiness Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
  <style>
/* SERVER_INJECT_CSS */

/* Override @page for Puppeteer — footerTemplate handles page numbers */
@page { margin: 8mm 10mm 20mm 10mm !important; }

/* ── Extra: ensure Puppeteer renders colors ── */
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
body { background: #f8fafc !important; margin: 0; padding: 0; }
#top-header { background: #ffffff !important; }
.header-phone { display: flex !important; align-items: center !important; }
.website-link { color: #E06533 !important; text-decoration: none !important; font-weight: 600 !important; font-size: 14px !important; }
.main-content { padding-top: 16px !important; max-width: 960px; margin: 0 auto; }
#top-header {
  position: relative !important;
  top: auto !important; left: auto !important; right: auto !important;
  width: 100% !important; height: auto !important;
  padding: 12px 32px !important; background: #ffffff !important;
  border-bottom: 1px solid #e9eaec !important; box-shadow: none !important;
  backdrop-filter: none !important; display: flex !important;
  align-items: center !important; justify-content: space-between !important;
  margin-bottom: 0 !important;
}
footer {
  background: #111827 !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
footer .footer-inner {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  max-width: 960px !important;
  margin: 0 auto !important;
}
</style>
</head>
<body class="puppeteer-render">

  <!-- HEADER -->
  <header id="top-header">
    <div class="header-inner">
      <img src="https://aroha.co.in/wp-content/uploads/2024/08/aroha_logo.png"
           alt="Aroha" class="header-logo" style="height:42px;object-fit:contain;"
           onerror="this.outerHTML='<div style=&quot;display:flex;align-items:center;gap:8px&quot;><span style=&quot;font-size:22px;font-weight:900;color:#111;&quot;>AROHA</span></div>'"/>
      <span class="header-phone">
        <a href="https://aroha.co.in/" target="_blank" rel="noopener" class="website-link">aroha.co.in</a>
      </span>
    </div>
  </header>

  <!-- MAIN REPORT CONTENT -->
  ${(() => {
    const clone = document.getElementById('reportContent').cloneNode(true);
    const footer = clone.querySelector('footer');
    if (footer) footer.remove();
    clone.querySelectorAll('.print-footer, .print-tfoot, tfoot').forEach(el => el.remove());
    return clone.outerHTML;
  })()}

  <!-- FOOTER -->
  <footer>
    <div class="footer-inner">
      <div>
        <img src="https://aroha.co.in/wp-content/uploads/2026/03/Aroha-White-1.png"
             class="footer-logo" alt="Aroha" style="height:34px;object-fit:contain;margin-bottom:14px;display:block;"
             onerror="this.style.display='none'"/>
        <p class="footer-tagline">Empowering organizations to measure, understand, and accelerate their AI transformation journey with data-driven insights.</p>
      </div>
      <div>
        <p class="footer-contact-title">Contact</p>
        <p class="footer-contact-text">Jayanagar, Bengaluru, Karnataka 560041</p>
        <p class="footer-contact-text">hr@aroha.co.in</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Aroha Technologies. All rights reserved.</p>
    </div>
  </footer>

  <script>
  const scores      = ${JSON.stringify(scores)};
  const overall     = ${overall};
  const MODULE_SHORT = ${JSON.stringify(MODULE_SHORT)};

  window.addEventListener('load', function() {
    /* Radar */
    const radarEl = document.getElementById('radarChart');
    if (radarEl) {
      new Chart(radarEl, {
        type: 'radar',
        data: {
          labels: MODULE_SHORT,
          datasets: [{
            data: scores,
            backgroundColor: 'rgba(224,101,51,0.15)',
            borderColor: '#E06533',
            borderWidth: 2,
            pointBackgroundColor: '#E06533',
            pointRadius: 4
          }]
        },
        options: {
          animation: false,
          scales: {
            r: {
              min: 0, max: 5,
              ticks: { stepSize: 1, font: { size: 9 }, color: '#9ca3af' },
              grid: { color: '#e5e7eb' },
              pointLabels: { font: { size: 10, weight: '600' }, color: '#374151' }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    /* Score distribution donut */
    const distEl = document.getElementById('distDonutChart');
    if (distEl) {
      const hc = scores.filter(s => s >= 4).length;
      const mc = scores.filter(s => s >= 2.5 && s < 4).length;
      const lc = scores.filter(s => s < 2.5).length;
      new Chart(distEl, {
        type: 'doughnut',
        data: {
          labels: ['Strong', 'Developing', 'Focus'],
          datasets: [{
            data: [hc || 0.001, mc || 0.001, lc || 0.001],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          animation: false,
          cutout: '68%',
          plugins: { legend: { display: false } }
        }
      });
    }

    /* Freeze all bar widths */
    document.querySelectorAll('.bar-fill[data-pct]').forEach(el => {
      el.style.transition = 'none';
      el.style.width = el.dataset.pct + '%';
    });
    const ob = document.getElementById('overallBar');
    if (ob) { ob.style.transition = 'none'; ob.style.width = (overall / 5 * 100) + '%'; }
  });
  <\/script>
</body>
</html>`;
}

/* ─────────────────────────────────────────
   EMAIL MODAL
   ───────────────────────────────────────── */
function openEmailModal() {
  const modal = document.getElementById('emailModal');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.add('show'), 10);
  document.getElementById('emailInput').focus();
}

function closeEmailModal() {
  const modal = document.getElementById('emailModal');
  modal.classList.remove('show');
  setTimeout(() => modal.classList.add('hidden'), 250);
  document.getElementById('emailError').classList.remove('show');
  document.getElementById('emailInput').value = '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─────────────────────────────────────────
   SEND EMAIL (manual modal flow)
   ───────────────────────────────────────── */
function sendEmail() {
  const emailInput = document.getElementById('emailInput');
  const errorEl    = document.getElementById('emailError');
  const btnText    = document.getElementById('sendBtnText');
  const spinner    = document.getElementById('sendSpinner');
  const email      = emailInput.value.trim();

  if (!isValidEmail(email)) {
    errorEl.classList.add('show');
    emailInput.classList.add('error');
    return;
  }

  errorEl.classList.remove('show');
  emailInput.classList.remove('error');
  btnText.textContent = 'Sending…';
  spinner.style.display = 'block';
  document.getElementById('sendBtn').disabled = true;

  const reportHTML = buildReportHTML();

  fetch('http://localhost:3000/send-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userEmail:   sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail') || email,
      reportHTML,
      userCompany: document.getElementById('companyName')?.textContent,
      userName:    document.getElementById('clientName')?.textContent,
      userPhone:   sessionStorage.getItem('userPhone') || localStorage.getItem('userPhone'),
      overall:     overall
    })
  })
  .then(res => res.json())
  .then(data => {
    btnText.textContent = 'Send Report';
    spinner.style.display = 'none';
    document.getElementById('sendBtn').disabled = false;
    closeEmailModal();
    showToast(data.message ? 'Report sent to ' + email : 'Failed to send — check server.');
  })
  .catch(err => {
    console.error('Email error:', err);
    btnText.textContent = 'Send Report';
    spinner.style.display = 'none';
    document.getElementById('sendBtn').disabled = false;
    closeEmailModal();
    showToast('Server error — is Node running on port 3000?');
  });
}

/* ─────────────────────────────────────────
   AUTO SEND REPORT (triggered on page load from Submit & Get Report)
   ───────────────────────────────────────── */
async function autoSendReport() {
  const userEmail   = sessionStorage.getItem('userEmail')   || localStorage.getItem('userEmail')   || '';
  const userCompany = document.getElementById('companyName')?.textContent;
  const userName    = document.getElementById('clientName')?.textContent;
  const userPhone   = sessionStorage.getItem('userPhone')   || localStorage.getItem('userPhone')   || '';

  if (!userEmail) {
    console.warn('No userEmail found in session — skipping auto send');
    return;
  }

  showToast('Preparing your report…');

  const reportHTML = buildReportHTML();

  try {
    const res  = await fetch('http://localhost:3000/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, reportHTML, userCompany, userName, userPhone, overall })
    });
    const data = await res.json();
    showToast(data.message ? 'Report sent to ' + userEmail : 'Failed to send report.');
  } catch (err) {
    console.error('Auto send error:', err);
    showToast('Server error — is Node running on port 3000?');
  }
}

/* ─────────────────────────────────────────
   TOAST
   ───────────────────────────────────────── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 400);
  }, 3500);
}

/* ─────────────────────────────────────────
   PDF DOWNLOAD
   ───────────────────────────────────────── */
function downloadPDF() {
  document.querySelectorAll('.bar-fill[data-pct]').forEach(el => {
    el.style.transition = 'none';
    el.style.width = el.dataset.pct + '%';
  });
  const overallBar = document.getElementById('overallBar');
  if (overallBar) {
    overallBar.style.transition = 'none';
    overallBar.style.width = (overall / 5 * 100) + '%';
  }
  showToast('Preparing your PDF report…');
  setTimeout(() => window.print(), 500);
}

/* ─────────────────────────────────────────
   INIT
   ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const clientLabel             = renderCover();
  const { lvl, minIdx, maxIdx } = renderSection1(user.company);
  renderRadar();
  renderSection2(lvl);
  renderSection3();
  renderSection4();
  renderSection6(lvl, minIdx, maxIdx);

  document.getElementById('emailModal').addEventListener('click', function(e) {
    if (e.target === this) closeEmailModal();
  });
  document.getElementById('emailInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendEmail();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeEmailModal();
  });

  /* Auto-send ONCE on arrival if triggered from Submit & Get Report button */
  if (new URLSearchParams(window.location.search).get('autoSend') === 'true') {
    /* Always clear the flag when coming fresh from Submit button */
    sessionStorage.removeItem('reportAutoSent');
    sessionStorage.setItem('reportAutoSent', 'true');
    setTimeout(() => autoSendReport(), 1500);
    /* Clean URL so refresh doesn't re-trigger */
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});