/* ═══════════════════════════════════════════
   module1.js  –  Aroha AI Maturity Assessment
   Module 1: Strategy & Business Alignment
   ═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   REGISTRATION MODAL
   ───────────────────────────────────────── */
async function submitRegistration() {
  const name    = document.getElementById('reg-name').value.trim();
  const company = document.getElementById('reg-company').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const phone   = document.getElementById('reg-phone').value.trim();

  let valid = true;

  // Validation
  if (!name) {
    document.getElementById('reg-name').classList.add('error');
    document.getElementById('err-name').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-name').classList.remove('error');
    document.getElementById('err-name').classList.remove('show');
  }

  if (!company) {
    document.getElementById('reg-company').classList.add('error');
    document.getElementById('err-company').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-company').classList.remove('error');
    document.getElementById('err-company').classList.remove('show');
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    document.getElementById('reg-email').classList.add('error');
    document.getElementById('err-email').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-email').classList.remove('error');
    document.getElementById('err-email').classList.remove('show');
  }

  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    document.getElementById('reg-phone').classList.add('error');
    document.getElementById('err-phone').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-phone').classList.remove('error');
    document.getElementById('err-phone').classList.remove('show');
  }

  if (!valid) return;

  try {
    // ✅ CALL BACKEND API (Google Sheets)
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, name, phone, email })
    });

    const result = await response.text();

    if (result.includes("already")) {
      alert("User already exists with this email!");
      return;
    }

    console.log("✅ Saved to Google Sheets:", result);

    // ✅ Store in session
    // ✅ Store in BOTH session + local (IMPORTANT)
sessionStorage.setItem('userName', name);
sessionStorage.setItem('userCompany', company);
sessionStorage.setItem('userEmail', email);
sessionStorage.setItem('userPhone', phone);

localStorage.setItem('userName', name);
localStorage.setItem('userCompany', company);
localStorage.setItem('userEmail', email);
localStorage.setItem('userPhone', phone);   // ✅ FIX
    // Close modal
    document.getElementById('reg-modal').classList.add('hidden');

  } catch (error) {
    console.error("❌ Error saving user:", error);
    alert("Server error. Make sure backend is running.");
  }
}


/* ─────────────────────────────────────────
   NAVIGATION
   ───────────────────────────────────────── */

function goNext() {
  // Save this module's score before leaving
  sessionStorage.setItem('module1Score', computeScore());
  window.location.href = '../module2/module2.html';
}


/* ─────────────────────────────────────────
   EVENT LISTENERS
   ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Scale buttons
  document.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', () => selectScale(btn));
  });

  // Radio options
  document.querySelectorAll('.radio-option').forEach(label => {
    label.addEventListener('click', () => {
      const q = label.closest('.radio-group').id.replace('-radio', '');
      selectRadio(label, q);
    });
  });

  // Checkboxes
  document.querySelectorAll('#q4-check .check-option input').forEach(cb => {
    cb.addEventListener('change', () => toggleCheck(cb));
  });

  // Textarea
  document.getElementById('q6-text').addEventListener('input', onTextChange);

  // Next button
  document.getElementById('btn-next').addEventListener('click', goNext);

  // Registration start button
  document.getElementById('btn-start-assessment').addEventListener('click', submitRegistration);

  // Allow Enter key in registration fields
  document.querySelectorAll('.reg-input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitRegistration();
    });
  });

  // Init UI
  updateUI();
});