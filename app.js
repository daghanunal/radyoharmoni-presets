/*
 * Ayvalık Light, revision v2: the player section.
 * Peace Radio over the Ayvalık video, Rain Radio over the Monte Verde photo, one WebGL picture that
 * dissolves between them. Exposes window.RH for info.js (the section below changes with the station).
 */
(function () {
  'use strict';
  const R = RadyoHarmoni, S = R.STATIONS, L = R.Light, $ = s => document.querySelector(s);
  S.peace.name = 'Peace Radio';
  const qs = new URLSearchParams(location.search);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const radio = new R({
    fadeIn: 4500,
    artwork: [192, 512].map(n => ({ src: new URL(`icons/icon-${n}.png`, location.href).href, sizes: `${n}x${n}`, type: 'image/png' }))
  });
  const light = new L();
  const moonNow = R.moon();
  const scene = $('#scene'), ui = $('#ui');
  if (!radio.canSetVolume) document.body.classList.add('no-volume');

  // ── Rain Radio's sky: chosen in "Sky and timer" ───────────────
  const SKIES = [
    ['day', 'Day', 'linear-gradient(180deg,#bcd6ea,#6e9a6a)', '#3f5c55'],
    ['sun', 'Sun', 'radial-gradient(circle at 68% 32%,#fffbe8 0 13%,#ffe7a6 22%,rgba(255,231,166,0) 44%),radial-gradient(ellipse at 28% 78%,#fff 0 22%,rgba(255,255,255,0) 46%),linear-gradient(180deg,#8fc1ea,#d6e8f5)', '#3f6787'],
    ['rain', 'Rain', 'linear-gradient(180deg,#e8eef6,#8ba2bd)', '#4b6078'],
    ['rainbow', 'Rainbow', 'conic-gradient(#f2a0a0,#f6d28a,#a8d8a0,#8fb9e8,#c3a2e8,#f2a0a0)', '#574f78'],
    ['night', 'Night', 'linear-gradient(180deg,#141c6e,#0b135b)', '#0b135b']
  ];
  let sky = 'day';
  try { sky = localStorage.getItem('rh-sky') || 'day'; } catch (e) {}
  if (qs.get('sky')) sky = qs.get('sky');
  if (sky === 'clouds') sky = 'sun';   // the sky that was called Clouds
  if (!SKIES.some(s => s[0] === sky)) sky = 'day';
  const fx = { clouds: 0, rain: 0, bow: 0, sun: 0, sunC: 0 };

  // The light to show: the hour's light on the sea; the chosen sky over Monte Verde.
  const currentTarget = () => radio.station === 'rain'
    ? light.blend(sky === 'night' ? 'night' : 'day', sky === 'night' ? 'night' : 'day', 0)
    : light.target();
  let grade = currentTarget();
  let hzNow = radio.station === 'rain' ? .5 : .34;
  let dv = radio.station === 'rain' ? 1 : 0;
  let calm = 0, moonK = grade.dark > .5 ? 1 : 0;

  // ── Pictures ─────────────────────────────────────────────────
  const vid = $('#v-peace'), photo = $('#i-rain'), cycle = $('#v-cycle');
  const playVid = () => { if (reduce) return; const p = vid.play(); if (p) p.catch(() => {}); };
  playVid();

  // Where the horizon sits on screen (0 at the bottom), from where it sits in the frame and how the frame is cropped.
  function horizonUv(hzFrame, drift) {
    const ra = innerWidth / innerHeight, va = 16 / 9;
    return .5 - (hzFrame - .5) * (ra > va ? ra / va : 1) * (1 + drift);
  }

  // ── WebGL ───────────────────────────────────────────────────
  const cv = $('#gl');
  const gl = cv.getContext('webgl', { premultipliedAlpha: false, powerPreference: 'low-power' });
  let U = {}, useGL = true, lastChrome = '', vidReady = false, photoReady = false, stillReady = false, cycleReady = false, cyc = 0;

  // Golden and Rose play over the original Ayvalık film, which turns from blue to gold to rose and back by itself, so the
  // chosen light keeps moving within its colour: a cool yellow deepening to gold, pink turning to lilac (the owner's
  // note: one flat colour was not enough). Day and Night keep the blue film, so the day stays blue and the moon path calm.
  function warmShare() {
    if (radio.station === 'rain') return 0;
    const warm = m => (m === 'golden' || m === 'rose' ? 1 : 0);
    if (light.choice !== 'auto') return warm(light.choice);
    const m = L.moodAtHour(light.hour());
    return warm(m.a) * (1 - m.k) + warm(m.b) * m.k;
  }
  if (!gl) fallback();
  else {
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 a;varying vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, $('#fs').textContent));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); fallback(); }
    else start(prog);
  }

  function start(prog) {
    gl.useProgram(prog);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['tex', 'tex2', 'tex3', 'cyc', 'wl', 'res', 'vres', 'vres2', 'mpos', 't', 'amt', 'expo', 'sat', 'lift', 'grain', 'hz', 'drift', 'dv', 'cz',
      'calm', 'moonK', 'ph', 'mr', 'hzS', 'clouds', 'rainK', 'bow', 'sunny', 'sunC', 'top', 'mid', 'bot'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
    const texs = [0, 1, 2].map(i => {
      gl.activeTexture(gl.TEXTURE0 + i);
      const tx = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tx;
    });
    gl.uniform1i(U.tex, 0); gl.uniform1i(U.tex2, 1); gl.uniform1i(U.tex3, 2);
    const loadPhoto = () => { gl.activeTexture(gl.TEXTURE1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, photo); photoReady = true; };
    if (photo.complete && photo.naturalWidth) loadPhoto(); else photo.addEventListener('load', loadPhoto, { once: true });
    // Until the video gives a frame (or if it never plays, as in iPhone Low Power Mode), Peace Radio shows the still of the same bay.
    const still = new Image();
    still.onload = () => { if (vidReady) return; gl.activeTexture(gl.TEXTURE0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, still); stillReady = true; };
    still.src = 'media/ayvalik.jpg';
    const size = () => { const s = Math.min(1.5, devicePixelRatio || 1) * (innerWidth < 700 ? .8 : 1); cv.width = cv.clientWidth * s; cv.height = cv.clientHeight * s; gl.viewport(0, 0, cv.width, cv.height); };
    addEventListener('resize', size); size();
    let visible = true, last = performance.now();
    new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(scene);

    function loop(now) {
      if (!visible || !useGL) return;
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      const rain = radio.station === 'rain';
      grade = L.ease(grade, currentTarget(), reduce ? 1 : (light.demo ? .2 : .02));
      hzNow += ((rain ? .5 : .34) - hzNow) * (reduce ? 1 : .03);
      dv += ((rain ? 1 : 0) - dv) * (reduce ? 1 : Math.min(1, dt * 2.2));
      const stillAll = scene.classList.contains('still-2');
      calm += ((stillAll && !rain ? 1 : 0) - calm) * Math.min(1, dt * .6);
      moonK += ((grade.dark > .5 ? 1 : 0) - moonK) * Math.min(1, dt * .8);
      fx.clouds += ((rain && sky === 'rain' ? .7 : 0) - fx.clouds) * Math.min(1, dt * .7);   // rain comes with a grey sky
      fx.sunC += ((rain && sky === 'sun' ? 1 : 0) - fx.sunC) * Math.min(1, dt * .5);
      fx.rain += ((rain && sky === 'rain' ? 1 : 0) - fx.rain) * Math.min(1, dt * .9);
      fx.bow += ((rain && sky === 'rainbow' ? 1 : 0) - fx.bow) * Math.min(1, dt * .5);
      fx.sun += ((rain && sky === 'day' ? 1 : 0) - fx.sun) * Math.min(1, dt * .6);
      // The videos only need to play while Peace Radio can be seen, each only while its share of the picture shows.
      const warm = warmShare();
      if (dv < .999 && cyc < .999) { if (vid.paused && !reduce) playVid(); if (vid.readyState >= 2) { gl.activeTexture(gl.TEXTURE0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, vid); vidReady = true; } }
      else if (!vid.paused) vid.pause();
      if (dv < .999 && (warm > 0 || cyc > .001) && !reduce) {
        if (cycle.paused) {
          if (cyc < .05) cycle.currentTime = 0;   // each time from its blue start: cool first, then the colour deepens
          const p = cycle.play(); if (p) p.catch(() => {});
        }
        if (cycle.readyState >= 2) { gl.activeTexture(gl.TEXTURE2); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cycle); cycleReady = true; }
      } else if (!cycle.paused) cycle.pause();
      cyc += ((cycleReady ? warm : 0) - cyc) * Math.min(1, dt * .6);
      const peaceReady = vidReady || stillReady;
      if (peaceReady || photoReady) {
        const drift = reduce ? 0 : .03 + .015 * Math.sin(now / 1000 / 24);
        const portrait = innerWidth < innerHeight;
        gl.uniform2f(U.res, cv.width, cv.height);
        gl.uniform2f(U.vres, vidReady ? vid.videoWidth : 1600, vidReady ? vid.videoHeight : 900);
        gl.uniform2f(U.vres2, photo.naturalWidth || 1920, photo.naturalHeight || 1080);
        gl.uniform1f(U.dv, peaceReady ? (photoReady ? dv : 0) : 1);
        gl.uniform1f(U.t, now / 1000);
        gl.uniform1f(U.amt, grade.amt); gl.uniform1f(U.expo, grade.expo); gl.uniform1f(U.sat, grade.sat);
        gl.uniform1f(U.lift, grade.lift); gl.uniform1f(U.cz, grade.cz); gl.uniform1f(U.grain, .028); gl.uniform1f(U.hz, hzNow);
        gl.uniform1f(U.drift, drift * (1 - dv));
        gl.uniform3fv(U.top, grade.top); gl.uniform3fv(U.mid, grade.mid); gl.uniform3fv(U.bot, grade.bot);
        gl.uniform1f(U.calm, reduce ? 0 : calm);
        gl.uniform1f(U.moonK, moonK); gl.uniform1f(U.ph, qs.get('moon') === 'full' ? .5 : moonNow.phase);
        gl.uniform2f(U.mpos, .8, portrait ? .86 : .87); gl.uniform1f(U.mr, portrait ? .024 : .033);
        gl.uniform1f(U.hzS, horizonUv(hzNow, drift * (1 - dv)));
        gl.uniform1f(U.cyc, cycleReady ? cyc : 0);
        gl.uniform1f(U.wl, reduce ? 0 : 1);
        gl.uniform1f(U.clouds, fx.clouds); gl.uniform1f(U.rainK, fx.rain); gl.uniform1f(U.bow, fx.bow); gl.uniform1f(U.sunny, fx.sun); gl.uniform1f(U.sunC, fx.sunC);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      paintChrome();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // Without WebGL: the video or the photo, with a colour wash.
  function fallback() {
    if (!useGL) return;
    useGL = false;
    cv.remove();
    [vid, photo].forEach(el => { el.classList.remove('src'); el.classList.add('fallback'); });
    const tick = () => {
      grade = currentTarget();
      vid.classList.toggle('on', radio.station === 'peace');
      photo.classList.toggle('on', radio.station === 'rain');
      $('#tint').style.opacity = grade.amt * .75;
      $('#tint').style.background = `linear-gradient(180deg,${L.css(grade.top)} 0%,${L.css(grade.mid)} 34%,${L.css(grade.bot)} 100%)`;
      paintChrome();
      setTimeout(tick, 1500);
    };
    tick();
  }

  // The colours around the picture: the name, the section below, and the menu, which takes on the chosen light.
  function paintChrome() {
    const rain = radio.station === 'rain';
    const panel = rain ? SKIES.find(s => s[0] === sky)[3]
      : L.css(grade.top.map((v, i) => (v * (1 - grade.dark) + grade.bot[i] * grade.dark) * (.5 + .22 * grade.dark)));
    const key = grade.mgv + L.css(grade.top) + panel + rain + sky;
    if (key === lastChrome) return;
    lastChrome = key;
    const root = document.documentElement.style;
    root.setProperty('--mgv', rain ? '#fffdf8' : grade.mgv);
    root.setProperty('--mgv-shadow', rain ? '0 1px 16px rgba(30,45,60,.45)' : 'none');
    // White words on a pale sky (golden, rose, day) get a soft shadow behind them so they stay readable.
    const pale = rain ? (sky === 'day' || sky === 'sun' || sky === 'rainbow') : (grade.top[0] * .299 + grade.top[1] * .587 + grade.top[2] * .114) > .62;
    root.setProperty('--title-shadow', pale ? '0 1px 2px rgba(70,50,40,.16),0 2px 26px rgba(70,45,35,.34)' : '0 2px 40px rgba(0,0,0,.12)');
    root.setProperty('--st-shadow', pale ? '0 1px 2px rgba(70,50,40,.25),0 1px 14px rgba(70,45,35,.4)' : '0 1px 18px rgba(50,40,60,.28)');
    root.setProperty('--mood-a', L.css(grade.top));
    root.setProperty('--mood-b', L.css(grade.bot));
    root.setProperty('--panel', panel.startsWith('#') ? panel + 'b8' : panel.replace('rgb(', 'rgba(').replace(')', ',.74)'));
  }

  // ── Words ───────────────────────────────────────────────────
  function letters(el, text, delay, step) {
    el.innerHTML = [...text].map((ch, i) => ch === ' ' ? ' ' : `<span aria-hidden="true" style="animation-delay:${delay + i * step}ms">${ch}</span>`).join('');
    el.setAttribute('aria-label', text);
    el.classList.add('ready');
  }
  function setWords(id, delay = 250) {
    letters($('#title'), S[id].name, delay, 70);
    $('#stno').textContent = id === 'peace' ? 'STATION 01' : 'STATION 02';
    $('#cap').innerHTML = id === 'peace' ? 'for a continuous<br>harmonizing effect' : 'for balance in nature,<br>and a continuous<br>harmonizing effect';
    $('#credit').textContent = id === 'peace' ? 'Image: Ayvalık, Türkiye' : 'Image: Monte Verde, Costa Rica';
  }
  letters($('#always'), '24/7', reduce ? 0 : 1500, 160);

  // ── The opening: the name, then Peace Radio, then the player ──
  let introDone = false;
  const introTimers = [];
  // Tells the rest of the page (the consent card) that the opening is over.
  function announceReady() { if (window.RH) window.RH.ready = true; document.dispatchEvent(new Event('rh:ready')); }
  function finishIntro() {
    if (introDone) return;
    introDone = true;
    introTimers.forEach(clearTimeout);
    $('#titleBox').classList.remove('out');
    if ($('#title').getAttribute('aria-label') !== S[radio.station].name) setWords(radio.station, 0);
    scene.classList.remove('intro', 'i-mgv', 'i-st');
    announceReady();
    wake();
  }
  function runIntro() {
    if (reduce || qs.has('nointro') || qs.has('clean')) { setWords(radio.station, 0); introDone = true; setTimeout(announceReady, 0); return; }
    scene.classList.add('intro');
    const at = (ms, fn) => introTimers.push(setTimeout(fn, ms));
    const first = radio.station === 'peace';
    at(250, () => scene.classList.add('i-mgv'));
    if (first) {
      letters($('#title'), 'Music for Peace', 700, 70);
      at(3900, () => $('#titleBox').classList.add('out'));
      at(4800, () => { setWords('peace', 0); $('#titleBox').classList.remove('out'); });
      at(5900, () => scene.classList.add('i-st'));
      at(7900, finishIntro);
    } else {
      setWords('rain', 700);
      at(2200, () => scene.classList.add('i-st'));
      at(4200, finishIntro);
    }
    // Anyone in a hurry can skip it with a tap or a key.
    const skip = () => { finishIntro(); removeEventListener('pointerdown', skip); removeEventListener('keydown', skip); };
    addEventListener('pointerdown', skip); addEventListener('keydown', skip);
  }

  // ── Stations ────────────────────────────────────────────────
  let swapTimer, shown = null;
  function showStation(id, first) {
    $('#play').setAttribute('aria-label', (radio.wantPlay ? 'Pause ' : 'Play ') + S[id].name);
    document.querySelectorAll('[data-station]').forEach(b => b.setAttribute('aria-pressed', b.dataset.station === id));
    lastChrome = '';
    buildModes();
    document.dispatchEvent(new CustomEvent('rh:station', { detail: id }));
    if (first) return;
    if (reduce || !introDone) { setWords(id, 0); return; }
    ui.classList.add('swapping');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => { setWords(id); ui.classList.remove('swapping'); }, 600);
  }

  // ── Light and timer / Sky and timer ─────────────────────────
  const moreBtn = $('#moreBtn'), panel = $('#panel');
  function buildModes() {
    const rain = radio.station === 'rain';
    moreBtn.textContent = rain ? 'Sky and timer' : 'Light and timer';
    $('#modeLabel').textContent = rain ? 'Sky over Monte Verde' : 'Light on the sea';
    const group = $('#modeGroup');
    group.setAttribute('aria-label', rain ? 'Sky' : 'Light');
    if (rain) {
      group.innerHTML = SKIES.map(([m, name, sw]) => `<button data-sky="${m}" aria-pressed="${m === sky}"><i class="swatch" style="background:${sw}"></i>${name}</button>`).join('');
      group.querySelectorAll('[data-sky]').forEach(b => b.addEventListener('click', () => setSky(b.dataset.sky)));
    } else {
      group.innerHTML = L.CHOICES.map(([m, name]) => `<button data-mood="${m}" aria-pressed="false"><i class="swatch" style="background:${light.swatch(m)}"></i>${name}</button>`).join('');
      light.bind(group.querySelectorAll('[data-mood]'));
    }
  }
  function setSky(m) {
    sky = m;
    try { localStorage.setItem('rh-sky', m); } catch (e) {}
    document.querySelectorAll('[data-sky]').forEach(b => b.setAttribute('aria-pressed', b.dataset.sky === m));
    lastChrome = '';
    rainSound.update();
    document.dispatchEvent(new CustomEvent('rh:sky', { detail: m }));
  }
  moreBtn.addEventListener('click', () => { panel.hidden = !panel.hidden; moreBtn.setAttribute('aria-expanded', !panel.hidden); wake(); });
  document.addEventListener('click', e => { if (!panel.hidden && !e.target.closest('.more')) { panel.hidden = true; moreBtn.setAttribute('aria-expanded', false); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; moreBtn.setAttribute('aria-expanded', false); moreBtn.focus(); } });

  // ── Rain under the music: a recording of light rain on a window pane (CC0, see media/rain/SOURCE.txt), looped ──
  const rainSound = {
    ctx: null, gain: null,
    // wanted: the listener has Rain Radio on under a rainy sky. audible: and the music itself sounds, so the rain never
    // outlives a pause, a call or the lock screen's Pause.
    wanted() { return radio.station === 'rain' && sky === 'rain' && radio.wantPlay && !radio.audio.muted; },
    audible() { return this.wanted() && !radio.audio.paused; },
    build() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      const ctx = this.ctx = new AC();
      this.gain = ctx.createGain(); this.gain.gain.value = 0; this.gain.connect(ctx.destination);
      const LOOP = 2875392 / 44100;   // the loop's exact length; some decoders keep the MP3's lead-in silence
      const load = url => fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(data => new Promise((ok, no) => ctx.decodeAudioData(data, ok, no)));
      load('media/rain/rain-loop.mp3?v=2').catch(() => load('media/rain/rain-loop.m4a?v=2')).then(buf => {
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const extra = buf.duration - LOOP;
        if (extra > .002) { src.loopStart = Math.min(extra, 1105 / 44100); src.loopEnd = src.loopStart + LOOP; }
        src.connect(this.gain); src.start(0, src.loopStart);
      }).catch(() => {});
      return true;
    },
    update() {
      const want = this.wanted(), on = this.audible();
      if (want && !this.ctx && !this.build()) return;   // built within the listener's tap, which phones require
      if (!this.ctx) return;
      if (want && this.ctx.state === 'suspended') this.ctx.resume();
      // About 17 dB under the music (the stream runs near -18 LUFS, the loop at -27)
      const level = on ? .4 * (radio.canSetVolume ? radio.volume : 1) : 0;
      const hidden = document.visibilityState !== 'visible';
      clearTimeout(this.sleep);
      this.gain.gain.cancelScheduledValues(this.ctx.currentTime);
      // in at a slow breath; out quickly, at once when the phone is locked
      this.gain.gain.setTargetAtTime(level, this.ctx.currentTime, on ? 1.2 : (hidden ? .02 : .3));
      // Paused for good: the rain's audio engine rests until it is wanted again
      if (!want) this.sleep = setTimeout(() => { if (!this.wanted() && this.ctx.state === 'running') this.ctx.suspend(); }, 1500);
    }
  };

  // ── Player ──────────────────────────────────────────────────
  function render() {
    const s = radio.state(), t = radio.track;
    if (shown !== s.station) { showStation(s.station, shown === null); shown = s.station; }
    document.body.classList.toggle('on', s.wantPlay);
    document.body.classList.toggle('loading', s.buffering);
    document.body.classList.toggle('muted', s.muted);
    $('#mute').setAttribute('aria-pressed', s.muted);
    $('#mute').setAttribute('aria-label', s.muted ? 'Unmute' : 'Mute');
    $('#play').setAttribute('aria-label', (s.wantPlay ? 'Pause ' : 'Play ') + S[s.station].name);
    $('#now').textContent = s.station === 'peace'
      ? (t && t.raga ? `Raga ${t.raga}, ${t.artist || ''}${t.instrument ? ', ' + t.instrument.toLowerCase() : ''}` : 'Finding the raga for your hour…')
      : 'Rain melodies, Amar Nath and Reshma Shrivastava';
    paintWhen();
    rainSound.update();
  }
  // Under the raga, as on Harmoni: which hour the stream is timed to
  function paintWhen() {
    const p = R.period();
    $('#when').textContent = radio.station === 'peace' ? `Timed to ${R.timezone()}: ${p.name.toLowerCase()}, ${p.label}` : '';
  }
  setInterval(paintWhen, 60000);
  radio.on('state', render);
  radio.on('track', render);
  radio.on('timer', t => { if (!t) document.querySelectorAll('[data-min]').forEach(b => b.setAttribute('aria-pressed', b.dataset.min === '0')); });
  $('#play').addEventListener('click', () => radio.toggle());
  document.querySelectorAll('[data-station]').forEach(b => b.addEventListener('click', () => radio.select(b.dataset.station)));
  document.querySelectorAll('[data-min]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-min]').forEach(x => x.setAttribute('aria-pressed', x === b));
    radio.setTimer(+b.dataset.min);
  }));
  const vol = $('#vol');
  const fill = () => vol.style.setProperty('--fill', (vol.value * 100).toFixed(0) + '%');
  vol.value = radio.volume; fill();
  vol.addEventListener('input', () => { radio.setVolume(+vol.value); fill(); if (radio.audio.muted && +vol.value > 0) radio.setMuted(false); rainSound.update(); });
  $('#mute').addEventListener('click', () => radio.setMuted(!radio.audio.muted));

  // ── The arrow at the foot of the picture leads to the sections below ──
  $('#down').addEventListener('click', () => $('#info').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
  const scrolled = () => document.body.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', scrolled, { passive: true }); scrolled();

  // ── Stillness: while music plays, the player and controls fade, then every word ──
  let idle = [];
  function wake() {
    idle.forEach(clearTimeout); idle = [];
    scene.classList.remove('still-1', 'still-2', 'still');
    if (!introDone || !radio.wantPlay || scrollY > innerHeight * .5 || !panel.hidden) return;
    const fast = qs.has('fast') ? .25 : 1;
    idle.push(setTimeout(() => scene.classList.add('still-1'), 9000 * fast));
    idle.push(setTimeout(() => {
      scene.classList.add('still-2', 'still');
      let seen = true;
      try { seen = !!localStorage.getItem('rh-still-hint'); localStorage.setItem('rh-still-hint', '1'); } catch (e) {}
      if (!seen) { $('#hint').classList.add('show'); setTimeout(() => $('#hint').classList.remove('show'), 6000); }
    }, 15000 * fast));
  }
  ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(ev => addEventListener(ev, () => { if (introDone) wake(); }, { passive: true }));
  radio.on('state', () => { if (introDone) wake(); });

  // ── Installable as an app ───────────────────────────────────
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

  // ── Full screen: the radio alone on the screen. Hidden where the browser cannot do it (iPhone Safari). ──
  const fsBtn = $('#fsBtn');
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  function toggleFS() {
    if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (scene.requestFullscreen || scene.webkitRequestFullscreen).call(scene);
  }
  function syncFS() {
    const on = !!fsElement();
    document.body.classList.toggle('is-fs', on);
    fsBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    wake();
  }
  if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
    fsBtn.hidden = false;
    fsBtn.addEventListener('click', toggleFS);
    document.addEventListener('fullscreenchange', syncFS);
    document.addEventListener('webkitfullscreenchange', syncFS);
    addEventListener('keydown', e => {
      if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey && !e.altKey && !e.target.closest('input, textarea')) toggleFS();
    });
  }

  window.RH = { radio, light, SKIES, get sky() { return sky; }, setSky };
  runIntro();
  render();
})();
