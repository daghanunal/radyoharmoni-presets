/* Preset switcher: a small floating control on every preset page. Hidden with ?clean */
(function () {
  if (new URLSearchParams(location.search).has('clean')) return;
  // Same order as the pool on the index page; names only.
  const PRESETS = [
    ['p6-ayvalik-light', 'Ayvalık Light'],
    ['p11-raga-clock-light', 'Raga Clock · Light'], ['p12-raga-clock-moon', 'Raga Clock · Moon'], ['p13-raga-clock-flowers', 'Raga Clock · Flowers'], ['p14-raga-clock-harmonics', 'Raga Clock · Harmonics'],
    ['p3-raga-clock', 'Raga Clock'], ['p7-suluboya', 'Suluboya'], ['p8-pencere', 'Pencere'], ['p9-nilufer', 'Nilüfer'], ['p10-ipek', 'İpek'],
    ['p1-harmoni', 'Harmoni'], ['p2-horizon', 'Horizon'], ['p4-lamp', 'Lamp'], ['p5-moonwater', 'Moonwater']
  ];
  const idx = PRESETS.findIndex(p => location.pathname.includes(p[0]));

  const css = `
  .rh-sw{position:fixed;z-index:9999;right:14px;bottom:14px;font:500 13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
  .rh-sw button,.rh-sw a{font:inherit;color:inherit}
  .rh-sw-toggle{display:flex;align-items:center;gap:8px;padding:8px 12px 8px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.22);
    background:rgba(20,20,24,.55);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);cursor:pointer}
  .rh-sw-toggle b{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#fff;color:#111;font-size:12px}
  .rh-sw-panel{position:absolute;right:0;bottom:calc(100% + 8px);width:min(300px,calc(100vw - 28px));max-height:calc(100svh - 90px);overflow:auto;padding:6px;border-radius:16px;
    background:rgba(20,20,24,.86);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.14);
    display:none;box-shadow:0 20px 50px rgba(0,0,0,.35)}
  .rh-sw.open .rh-sw-panel{display:block}
  .rh-sw-panel a{display:block;padding:10px 12px;border-radius:11px;text-decoration:none}
  .rh-sw-panel a:hover,.rh-sw-panel a:focus-visible{background:rgba(255,255,255,.1);outline:none}
  .rh-sw-panel a[aria-current]{background:rgba(255,255,255,.16)}
  .rh-sw-panel a span{grid-row:span 2;align-self:center;opacity:.6;font-variant-numeric:tabular-nums}
  .rh-sw-panel a small{opacity:.62;font-size:12px}
  .rh-sw-panel .rh-sw-all{display:block;text-align:center;border-top:1px solid rgba(255,255,255,.12);margin-top:4px;border-radius:0 0 11px 11px}
  .rh-sw-toggle:focus-visible{outline:2px solid #fff;outline-offset:2px}
  @media print{.rh-sw{display:none}}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const root = document.createElement('nav');
  root.className = 'rh-sw';
  root.setAttribute('aria-label', 'Design presets');
  root.innerHTML = `
    <div class="rh-sw-panel" id="rh-sw-panel">
      ${PRESETS.map((p, i) => `<a href="../${p[0]}/"${i === idx ? ' aria-current="page"' : ''}><strong>${p[1]}</strong></a>`).join('')}
      <a class="rh-sw-all" href="../presets/">All presets</a>
    </div>
    <button class="rh-sw-toggle" aria-expanded="false" aria-controls="rh-sw-panel">
      <b aria-hidden="true">◦</b> ${idx >= 0 ? PRESETS[idx][1] : 'Presets'}
    </button>`;
  document.body.appendChild(root);
  const btn = root.querySelector('.rh-sw-toggle');
  btn.addEventListener('click', () => {
    const open = root.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => { if (!root.contains(e.target)) { root.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { root.classList.remove('open'); btn.setAttribute('aria-expanded', false); }
  });
})();
