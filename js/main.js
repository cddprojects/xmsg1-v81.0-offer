
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

  /* ── Embedded form height follows the form content ── */
  function fitFormFrame(iframe, height) {
    iframe.style.height = `${Math.ceil(height) + 5}px`;
  }
  window.addEventListener('message', (event) => {
    const fromForm = event.origin === 'https://chatfromforms.com';
    const fromLocalRelay = event.origin === window.location.origin;
    if (!fromForm && !fromLocalRelay) return;
    const message = event.data;
    if (!message || typeof message !== 'object' || message.type !== 'setIFrameHeight' || !message.data) return;
    const height = Number(message.data.height);
    if (!Number.isFinite(height) || height <= 0) return;
    document.querySelectorAll('[data-cddform] iframe').forEach((iframe) => {
      if (iframe.contentWindow === event.source || (iframe._heightMirror && iframe._heightMirror.contentWindow === event.source)) {
        fitFormFrame(iframe, height);
      }
    });
  });
  const mirroredFrames = new WeakSet();
  let formRelayPromise = null;
  function formRelayAvailable() {
    const host = window.location.hostname;
    if (host !== '127.0.0.1' && host !== 'localhost') return Promise.resolve(false);
    if (!formRelayPromise) {
      formRelayPromise = fetch('/__formproxy', { cache: 'no-store' })
        .then((res) => res.text())
        .then((text) => text.trim() === 'cdd-form-proxy')
        .catch(() => false);
    }
    return formRelayPromise;
  }
  function mirrorFormFrame(iframe) {
    if (mirroredFrames.has(iframe) || iframe.dataset.heightMirror) return;
    let url;
    try { url = new URL(iframe.src, window.location.href); } catch (err) { return; }
    if (url.hostname !== 'chatfromforms.com' && url.hostname !== 'www.chatfromforms.com') return;
    mirroredFrames.add(iframe);
    formRelayAvailable().then((ready) => {
      if (!ready || !iframe.isConnected || iframe._heightMirror) return;
      const mirror = document.createElement('iframe');
      mirror.dataset.heightMirror = '1';
      mirror.setAttribute('aria-hidden', 'true');
      mirror.tabIndex = -1;
      mirror.style.cssText = 'position:absolute;left:-10000px;top:0;width:0;height:2000px;border:0;opacity:0;pointer-events:none;';
      const syncWidth = () => {
        const width = iframe.getBoundingClientRect().width;
        if (width > 0) mirror.style.width = `${width}px`;
      };
      syncWidth();
      if (window.ResizeObserver) new ResizeObserver(syncWidth).observe(iframe);
      mirror.src = `/__formproxy${url.pathname}${url.search}`;
      document.body.appendChild(mirror);
      iframe._heightMirror = mirror;
    });
  }
  const frameObserver = new MutationObserver(() => {
    document.querySelectorAll('[data-cddform] iframe').forEach(mirrorFormFrame);
  });
  if (document.body) frameObserver.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('[data-cddform] iframe').forEach(mirrorFormFrame);

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
