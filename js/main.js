
  /* ── Calculator ── */
  const rates = {
    1: { label: 'New starter — $22/hr', value: 22 },
    2: { label: 'Standard — $28/hr',    value: 28 },
    3: { label: 'Experienced — $36/hr', value: 36 }
  };
  const notes = {
    1: "Covers tuition fees, or clears a credit card balance every month.",
    2: "Enough to fund a holiday, clear debt, and still have something left.",
    3: "A genuine secondary income that changes your financial picture."
  };
  function updateCalc() {
    const hrs = parseInt(document.getElementById('hoursSlider').value);
    const tr  = parseInt(document.getElementById('rateSlider').value);
    document.getElementById('hoursVal').textContent = `${hrs} hrs`;
    document.getElementById('rateVal').textContent  = rates[tr].label;
    const mo = Math.round(hrs * 4.33 * rates[tr].value);
    document.getElementById('calcResult').innerHTML = `$<span id="monthly">${mo.toLocaleString('en-SG')}</span><span class="pm">/mo</span>`;
    document.getElementById('calcYr').textContent   = `≈ $${(mo * 12).toLocaleString('en-SG')} extra per year`;
    document.getElementById('calcNote').textContent = notes[tr];
  }
  document.getElementById('hoursSlider').addEventListener('input', updateCalc);
  document.getElementById('rateSlider').addEventListener('input', updateCalc);
  updateCalc();

  /* ── Reviews show more ── */
  const revGrid = document.getElementById('revGrid');
  const revMoreBtn = document.getElementById('revMoreBtn');
  const revLessBtn = document.getElementById('revLessBtn');
  if (revMoreBtn && revGrid) {
    revMoreBtn.addEventListener('click', () => revGrid.classList.add('is-open'));
    revLessBtn.addEventListener('click', () => {
      revGrid.classList.remove('is-open');
      revGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ── Tier picker ── */
  document.querySelectorAll('#tierPicker .tier-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#tierPicker .tier-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input[type="radio"]').checked = true;
    });
  });

  /* ── Forms ── */
  function buildMsg(n, e, p) {
    return encodeURIComponent(`Hi WorkNest SG! I'm interested in the part-time work from home opportunity.\n\nName: ${n}\nEmail: ${e}\nWhatsApp: ${p}`);
  }
  function handleMini(ev) {
    ev.preventDefault();
    const n = document.getElementById('miniName').value.trim();
    const e = document.getElementById('miniEmail').value.trim();
    const p = document.getElementById('miniPhone').value.trim();
    if (!n || !e || !p) { alert('Please fill in all fields.'); return; }
    window.open(`https://wa.me/6591234567?text=${buildMsg(n, e, p)}`, '_blank');
    window.location.href = 'thank-you/';
  }
  function handleFinal(ev) {
    ev.preventDefault();
    const n = document.getElementById('finalName').value.trim();
    const e = document.getElementById('finalEmail').value.trim();
    const p = document.getElementById('finalPhone').value.trim();
    if (!n || !e || !p) { alert('Please fill in all fields.'); return; }
    window.open(`https://wa.me/6591234567?text=${buildMsg(n, e, p)}`, '_blank');
    window.location.href = 'thank-you/';
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Scroll reveal ── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.rev').forEach(el => revObs.observe(el));

  /* ── Counter animation ── */
  function animCount(el, target, decimals = 0, suffix = '') {
    const start = performance.now(), dur = 1800;
    const update = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const v = (1 - Math.pow(1 - p, 4)) * target;
      el.textContent = decimals > 0 ? v.toFixed(decimals) + suffix : Math.floor(v).toLocaleString('en-SG') + suffix;
      if (p < 1) requestAnimationFrame(update);
      else el.textContent = decimals > 0 ? target.toFixed(decimals) + suffix : target.toLocaleString('en-SG') + suffix;
    };
    requestAnimationFrame(update);
  }
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        animCount(el, parseFloat(el.dataset.target), parseInt(el.dataset.decimals || '0'), el.dataset.suffix || '');
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => countObs.observe(el));

  /* ── Hero parallax (desktop only) ── */
  const heroLeft = document.querySelector('.hero-inner');
  const titleEl  = document.querySelector('.h1');
  if (heroLeft && titleEl && window.innerWidth >= 900) {
    heroLeft.addEventListener('mousemove', e => {
      const r = heroLeft.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top  - r.height / 2) / r.height;
      titleEl.style.transform = `translate(${x * 10}px, ${y * 5}px)`;
    });
    heroLeft.addEventListener('mouseleave', () => { titleEl.style.transform = ''; });
  }
