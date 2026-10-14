/* The "soft" family behaviour, shared by presets 7–10:
   time-of-day light, her letter animation, station / play / timer / light controls,
   stillness, and the sections below the scene. Needs radio.js first. */
(function () {
  'use strict';
  const R = window.RadyoHarmoni;
  const qs = new URLSearchParams(location.search);
  const $ = s => document.querySelector(s);

  // Her three Canva colourings plus night. a = sky, b = horizon, c = water.
  const MOODS = {
    day:    { a: '#cfe3f2', b: '#b4d0e6', c: '#3f78a0', wash: '#9cc3df', glow: '#fff6e0', dark: 0 },
    golden: { a: '#f6a46a', b: '#f5c294', c: '#2f6f8c', wash: '#f2b878', glow: '#ffd9a0', dark: 0 },
    rose:   { a: '#f79abf', b: '#f4a9bf', c: '#5059c4', wash: '#ee9fb8', glow: '#ffd6e2', dark: 0 },
    night:  { a: '#26336e', b: '#3a4682', c: '#0b1534', wash: '#2c3768', glow: '#c9d2f0', dark: 1 }
  };
  // Around the full moon the night turns silver.
  if (qs.get('moon') === 'full' || R.moon().illumination > .9) {
    MOODS.night = { a: '#5a6894', b: '#8590b4', c: '#16234a', wash: '#6b77a0', glow: '#e9ecf6', dark: .85 };
  }
  const DAY = [[0, 'night'], [4.5, 'night'], [5.5, 'rose'], [6.6, 'golden'], [8.2, 'day'], [15.8, 'day'], [17.6, 'golden'], [19, 'rose'], [20.3, 'night'], [24, 'night']];
  const LIST = ['day', 'golden', 'rose', 'night'];

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  const css = (c, al = 1) => `rgba(${c.map(v => Math.round(v * 255)).join(',')},${al})`;

  function hour() {
    if (qs.has('h')) return +qs.get('h') % 24;
    if (qs.has('daylapse')) return (performance.now() / 1000 * .8 + 4) % 24;
    return R.period().hourFloat;
  }
  function blend(a, b, k) {
    const A = MOODS[a], B = MOODS[b], o = { name: k < .5 ? a : b, k };
    for (const key of ['a', 'b', 'c', 'wash', 'glow']) o[key] = mix(hex(A[key]), hex(B[key]), k);
    o.dark = A.dark + (B.dark - A.dark) * k;
    return o;
  }
  let choice = qs.get('mood') || localStorage.getItem('rh-light') || 'auto';
  function light() {
    if (choice !== 'auto' && MOODS[choice]) return blend(choice, choice, 0);
    const h = hour();
    let i = 0; while (DAY[i + 1][0] <= h) i++;
    const A = DAY[i], B = DAY[i + 1], t = (h - A[0]) / (B[0] - A[0]);
    return blend(A[1], B[1], t * t * (3 - 2 * t));
  }
  // Smoothly eased copy of light(), for scenes that animate every frame.
  let eased = null;
  function easedLight(speed) {
    const tgt = light();
    if (!eased) { eased = tgt; return eased; }
    const s = qs.has('daylapse') ? .2 : (speed || .02);
    for (const key of ['a', 'b', 'c', 'wash', 'glow']) eased[key] = mix(eased[key], tgt[key], s);
    eased.dark += (tgt.dark - eased.dark) * s;
    eased.name = tgt.name;
    return eased;
  }

  function letters(el, text, delay, step) {
    if (!el) return;
    el.innerHTML = [...text].map((ch, i) => ch === ' ' ? ' ' : `<span aria-hidden="true" style="animation-delay:${delay + i * step}ms">${ch}</span>`).join('');
    el.setAttribute('aria-label', text);
  }

  let lastRoot = '';
  function paintRoot(L) {
    const key = L.a.map(v => v.toFixed(2)).join() + L.dark.toFixed(2);
    if (key === lastRoot) return;
    lastRoot = key;
    const r = document.documentElement.style;
    r.setProperty('--mood-a', css(L.a)); r.setProperty('--mood-b', css(L.b)); r.setProperty('--mood-c', css(L.c));
    r.setProperty('--wash', css(L.wash)); r.setProperty('--glow', css(L.glow));
    document.body.classList.toggle('is-dark', L.dark > .5);
  }

  const CONTROLS = `
    <div class="group" role="group" aria-label="Station">
      <button data-station="peace" aria-pressed="true">Music for Peace</button>
      <button data-station="rain" aria-pressed="false">Rain Radio</button>
    </div>
    <div class="more">
      <button class="more-btn" id="moreBtn" aria-expanded="false" aria-controls="panel">Light and timer</button>
      <div class="panel" id="panel" hidden>
        <p>Light</p>
        <div class="group col" role="group" aria-label="Light">
          <button data-mood="auto"><i class="swatch" style="background:conic-gradient(#8fb9d8,#f2b878,#ee9fb8,#2c3768,#8fb9d8)"></i>Follows your hour</button>
          <button data-mood="day"><i class="swatch" style="background:#8fb9d8"></i>Day</button>
          <button data-mood="golden"><i class="swatch" style="background:#f2b878"></i>Golden</button>
          <button data-mood="rose"><i class="swatch" style="background:#ee9fb8"></i>Rose</button>
          <button data-mood="night"><i class="swatch" style="background:#2c3768"></i>Night</button>
        </div>
        <p>Stop the music after</p>
        <div class="group" role="group" aria-label="Stop after">
          <button data-min="0" aria-pressed="true">Never</button>
          <button data-min="20" aria-pressed="false">20 min</button>
          <button data-min="40" aria-pressed="false">40 min</button>
          <button data-min="60" aria-pressed="false">1 hr</button>
        </div>
      </div>
    </div>`;

  const PLAYROW = `
    <button class="disc" id="play" aria-label="Play Music for Peace">
      <svg class="pl" viewBox="0 0 43 47" fill="currentColor" aria-hidden="true"><path d="M5.907 47a5.981 5.981 0 0 1-3.043-.829C1.022 45.086 0 43.032 0 40.921V6.019c0-1.68.635-3.34 1.894-4.475A5.991 5.991 0 0 1 8.86.777l31.187 17.695A5.791 5.791 0 0 1 43 23.5c0 2.073-1.127 3.989-2.953 5.027L8.86 46.222A5.984 5.984 0 0 1 5.907 47"/></svg>
      <svg class="pz" viewBox="0 0 43 47" fill="currentColor" aria-hidden="true"><path d="M14 0C10.686 0 8 2.686 8 6v35c0 3.314 2.686 6 6 6s6-2.686 6-6V6c0-3.314-2.686-6-6-6zm21 0c-3.314 0-6 2.686-6 6v35c0 3.314 2.686 6 6 6s6-2.686 6-6V6c0-3.314-2.686-6-6-6z"/></svg>
    </button>
    <span class="word" aria-hidden="true">PLAY</span>
    <span class="always" id="always" aria-label="24/7"></span>
    <p class="cap" id="cap">for a continuous<br>harmonizing effect</p>
    <p class="now" id="now" aria-live="polite"></p>`;

  // Fills [data-soft="playrow"] and [data-soft="controls"], then wires everything.
  function wire(radio, opts = {}) {
    document.querySelectorAll('[data-soft="playrow"]').forEach(el => { el.classList.add('playrow'); el.innerHTML = PLAYROW; });
    document.querySelectorAll('[data-soft="controls"]').forEach(el => { el.classList.add('tools'); el.innerHTML = CONTROLS; });
    letters($('#always'), '24/7', 1500, 160);

    let shown = null;
    function showStation(id) {
      const st = R.STATIONS[id];
      letters($('#title'), st.name, 250, 70);
      if ($('#stno')) $('#stno').textContent = id === 'peace' ? 'STATION NO 01' : 'STATION NO 02';
      if ($('#cap')) $('#cap').innerHTML = id === 'peace' ? 'for a continuous<br>harmonizing effect' : 'for rain fall,<br>and a continuous<br>harmonizing effect';
      if ($('#credit')) $('#credit').textContent = id === 'peace' ? 'Image: Ayvalık, Türkiye' : 'Image: Monteverde, Costa Rica';
      document.querySelectorAll('[data-station]').forEach(b => b.setAttribute('aria-pressed', b.dataset.station === id));
      opts.onStation && opts.onStation(id);
    }
    function render() {
      const s = radio.state(), t = radio.track;
      if (shown !== s.station) { shown = s.station; showStation(s.station); }
      document.body.classList.toggle('on', s.wantPlay);
      document.body.classList.toggle('loading', s.buffering);
      $('#play').setAttribute('aria-label', (s.wantPlay ? 'Pause ' : 'Play ') + R.STATIONS[s.station].name);
      $('#now').textContent = s.station === 'peace'
        ? (t && t.raga ? `Raga ${t.raga}, ${t.artist || ''}${t.instrument ? ', ' + t.instrument.toLowerCase() : ''}` : 'Finding the raga for your hour…')
        : 'Rain melodies, Amar Nath and Reshma Shrivastava';
      opts.onState && opts.onState(s);
    }
    radio.on('state', render);
    radio.on('track', render);
    radio.on('timer', t => {
      if (!t) document.querySelectorAll('[data-min]').forEach(b => b.setAttribute('aria-pressed', b.dataset.min === '0'));
      opts.onTimer && opts.onTimer(t);
    });
    $('#play').addEventListener('click', () => radio.toggle());
    document.querySelectorAll('[data-station]').forEach(b => b.addEventListener('click', () => radio.select(b.dataset.station)));
    document.querySelectorAll('[data-min]').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('[data-min]').forEach(x => x.setAttribute('aria-pressed', x === b));
      radio.setTimer(+b.dataset.min);
      if (+b.dataset.min && !radio.wantPlay && opts.timerStartsPlay) radio.play();
    }));
    const setMood = m => {
      choice = m; localStorage.setItem('rh-light', m);
      document.querySelectorAll('[data-mood]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mood === m));
    };
    document.querySelectorAll('[data-mood]').forEach(b => b.addEventListener('click', () => setMood(b.dataset.mood)));
    setMood(choice);

    const moreBtn = $('#moreBtn'), panel = $('#panel');
    const close = () => { panel.hidden = true; moreBtn.setAttribute('aria-expanded', false); };
    moreBtn.addEventListener('click', () => { panel.hidden = !panel.hidden; moreBtn.setAttribute('aria-expanded', !panel.hidden); });
    document.addEventListener('click', e => { if (!panel.hidden && !e.target.closest('.more')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { close(); moreBtn.focus(); } });
    if (!qs.has('clean')) document.documentElement.style.setProperty('--sw-pad', innerWidth > 700 ? '150px' : '0px');

    // Stillness: while music plays, the words fade so only the scene remains.
    const scene = opts.scene || document.body;
    let idle;
    const wake = () => {
      scene.classList.remove('still');
      clearTimeout(idle);
      if (radio.wantPlay && scrollY < innerHeight * .5 && panel.hidden) idle = setTimeout(() => {
        scene.classList.add('still');
        if (!localStorage.getItem('rh-still-hint')) {
          localStorage.setItem('rh-still-hint', '1');
          const h = document.createElement('p');
          h.className = 'hint'; h.textContent = 'The words will fade so your eyes can rest. Move or tap to bring them back.';
          document.body.appendChild(h);
          requestAnimationFrame(() => h.classList.add('show'));
          setTimeout(() => h.classList.remove('show'), 6000);
        }
      }, 12000);
    };
    ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(ev => addEventListener(ev, wake, { passive: true }));
    radio.on('state', wake);

    // Keep the page colours in step with the light when the scene does not paint them itself.
    if (!opts.paintsRoot) { const tick = () => { paintRoot(light()); setTimeout(tick, qs.has('daylapse') ? 100 : 5000); }; tick(); }
    render();
  }

  // The sections under the scene, the same content in every soft preset.
  function below(el) {
    const p = R.period().hourFloat;
    const rows = [['rose', '05:00–06:30', 'Before sunrise'], ['golden', '06:30–08:00', 'Sunrise'], ['day', '08:00–16:00', 'Day'],
      ['golden', '16:00–18:00', 'Late afternoon'], ['rose', '18:00–20:00', 'Dusk'], ['night', '20:00–05:00', 'Night']];
    const cur = p >= 5 && p < 6.5 ? 0 : p >= 6.5 && p < 8 ? 1 : p >= 8 && p < 16 ? 2 : p >= 16 && p < 18 ? 3 : p >= 18 && p < 20 ? 4 : 5;
    const strip = rows.map(([m, time, name], i) => {
      const M = MOODS[m];
      return `<li class="${i === cur ? 'cur' : ''}"><i style="background:linear-gradient(180deg,${M.a},${M.c})"></i><b>${name}</b><small>${time}</small></li>`;
    }).join('');
    const moon = R.moon().nextFull.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    el.classList.add('soft-after');
    el.innerHTML = `
      <section class="s-quote"><div class="wrap">
        <blockquote>“Gandharva music is that melody from which all the melodies have sprung. All languages and melodies spring from the infinite order that is maintained in nature in its different rhythms, harmonies, and frequencies.”</blockquote>
        <cite>Maharishi Mahesh Yogi</cite></div></section>
      <section style="padding-top:0"><div class="wrap">
        <p class="kick">Listen</p><h2>Three ways to listen</h2>
        <div class="s-ways">
          <article><img src="../media/img/listen-yourself.webp" alt="" loading="lazy"><h3>For yourself</h3><p>Sit comfortably and close your eyes. Stay with one raga from its opening to its final note.</p></article>
          <article><img src="../media/img/listen-surroundings.webp" alt="" loading="lazy"><h3>For the people around you</h3><p>Leave it playing softly all day, at home, at work, in classrooms and in waiting rooms.</p></article>
          <article><img src="../media/img/listen-nature.webp" alt="" loading="lazy"><h3>For nature</h3><p>Connect a speaker and place it outdoors, in a garden, a field, an orchard or on a balcony.</p></article>
        </div></div></section>
      <section><div class="wrap s-light">
        <div><p class="kick">The hours</p><h2>Music that keeps your time</h2>
        <p class="lede">Gandharva Veda gives each part of the day its own ragas, and the radio plays the one for your hour. The colours on this page follow the same clock: rose before sunrise, gold in the early and late hours, clear blue by day, indigo at night, and silver around the full moon.</p></div>
        <ol class="s-strip">${strip}</ol></div></section>
      <section><div class="wrap">
        <p class="kick">Research</p><h2>What listeners notice</h2>
        <p class="lede">At live concerts with more than 1,800 listeners, mood questionnaires showed significant drops in tension and other negative feelings after the ragas, and a rise in positive ones.</p>
        <p style="font-size:14px;color:#6f6553;margin-top:14px">Travis, Morehead &amp; Parim (2023), <i>International Journal of Psychological Studies</i> 15(1), 8. <a href="https://doi.org/10.5539/ijps.v15n1p8">Read the paper</a></p>
      </div></section>
      <section class="s-moon"><div class="wrap">
        <p class="kick">Live</p><h2>Full moon concerts</h2>
        <p class="lede" style="margin:0 auto">Each month, on the evening of the full moon, Gandharva Veda musicians play live for a global audience.</p>
        <p class="date">Next full moon: ${moon}</p>
        <a class="s-btn" href="https://artsforenlightenment.org/">Register for the concert</a></div></section>
      <footer class="soft-foot"><div class="wrap">
        <div><h2>Keep the music playing</h2><p>RadyoHarmoni is free and has no advertising. It is presented by the <a href="https://artsforenlightenment.org/">Academy of Arts for Enlightenment</a>, bringing the benefits of Gandharva Veda music to individuals and society.</p></div>
        <div style="align-self:end"><a class="s-btn" href="https://www.paypal.com/donate/?hosted_button_id=8PV97C4VSV5R8">Donate with PayPal</a></div>
        <div class="legal">
          <p>Music Copyright © 2024, Maharishi Vedic University Ltd. and Maharishi Foundation Ltd. All rights reserved worldwide.</p>
          <p>Transcendental Meditation, TM-Sidhi, Maharishi, Maharishi Vedic, Vedic Science, Maharishi International University, Maharishi Vāstu, Maharishi Gandharva Veda, Fortune-Creating, Maharishi Sthāpatya Veda, Maharishi AyurVeda, and other terms used on this website are subject to trademark protection in many countries worldwide, including the United States, and are used with permission.</p>
          <p>Copyright 2024 © Academy of Arts for Enlightenment. <a href="https://radyoharmoni.org/privacy-policy/">Privacy policy</a></p>
        </div></div></footer>`;
  }

  window.Soft = { MOODS, LIST, light, easedLight, hour, letters, wire, below, css, paintRoot, qs };
})();
