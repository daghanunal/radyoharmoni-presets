/*
 * RadyoHarmoni player engine — shared by every preset.
 *
 * Streams
 *   peace : Maharishi Gandharva Veda, HLS (AAC) from a time-shift server that
 *           keeps one playlist per offset, so a listener anywhere hears the
 *           raga meant for their own clock. Station clock is UTC+3.
 *   rain  : Rain Radio, MP3 192 kbps from AzuraCast (Icecast mount).
 *
 * Events: 'state', 'track', 'timer'.  Usage: const r = new RadyoHarmoni(); r.on('state', fn)
 */
(function () {
  'use strict';

  // hls.js 1.5.20 (Apache-2.0), served from our own server, next to this file.
  const HERE = (document.currentScript && document.currentScript.src) || location.href;
  const HLS_SRC = new URL('vendor/hls.min.js', HERE).href;
  const STATION_OFFSET_MIN = 180;

  const STATIONS = {
    peace: {
      id: 'peace',
      name: 'Music for Peace',
      blurb: 'Gandharva Veda ragas that follow the hours of your day',
      hls: true,
      musicians: ['Devabrata Chaudhuri, sitar', 'Anant Lal, shehnai', 'Hari Prasad Chaurasia, flute',
        'Amar Nath, flute', 'Shiv Kumar Sharma, santoor', 'Tanima Thakur, vocal', 'Reshma Shrivastava, sitar'],
      video: 'https://radyoharmoni.org/wp-content/uploads/2026/03/Carousel_1_small.m4v',
      place: 'Ayvalık, Türkiye'
    },
    rain: {
      id: 'rain',
      name: 'Rain Radio',
      blurb: 'Ragas for rainfall, played without pause',
      hls: false,
      url: 'https://stream.radyoharmoni.org/listen/rain_radio/radio.mp3',
      musicians: ['Amar Nath, flute', 'Reshma Shrivastava, sitar'],
      video: 'https://radyoharmoni.org/wp-content/uploads/2026/03/Carousel_2_small.m4v',
      place: 'Monteverde, Costa Rica'
    }
  };

  // Gandharva Veda divides the day into eight three-hour watches.
  // Boundaries follow the stream's own track labels (01h-04h, 04h-07h …).
  // `ragas` are examples heard on the stream itself (from its track metadata).
  const PERIODS = [
    { start: 1,  name: 'Deep night', mood: 'The stillest hours, before the birds', ragas: ['Sohinī'] },
    { start: 4,  name: 'Dawn',       mood: 'First light gathering at the horizon', ragas: ['Bhairava'] },
    { start: 7,  name: 'Morning',    mood: 'The day opening, clear and fresh', ragas: ['Todī', 'Jaita'] },
    { start: 10, name: 'Midday',     mood: 'Full light, the sun near its height', ragas: ['Vrindāvanī Sāranga'] },
    { start: 13, name: 'Afternoon',  mood: 'Warm, settled, unhurried light', ragas: ['Multānī', 'Bhīmapalāsī'] },
    { start: 16, name: 'Sunset',     mood: 'Light lengthening toward evening', ragas: ['Mārwā', 'Puriyā Dhanāshrī'] },
    { start: 19, name: 'Evening',    mood: 'Lamps lit, the day drawing in', ragas: ['Durgā', 'Rāgeshrī', 'Māru Bihāga'] },
    { start: 22, name: 'Night',      mood: 'Quiet dark around midnight', ragas: ['Mālkaunsa', 'Kaunsī Kānhrā', 'Gunjī Kānadā'] }
  ];

  function period(date = new Date()) {
    const h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    const shifted = (h - 1 + 24) % 24;
    const index = Math.floor(shifted / 3);
    const p = PERIODS[index];
    return {
      index, ...p,
      end: (p.start + 3) % 24,
      progress: (shifted % 3) / 3,
      label: `${pad(p.start)}:00–${pad((p.start + 3) % 24)}:00`,
      hourFloat: h
    };
  }

  // Moon phase from a reference new moon (2000-01-06 18:14 UTC).
  const SYNODIC = 29.530588853;
  const NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14);
  function moon(date = new Date()) {
    const days = (date.getTime() - NEW_MOON_REF) / 86400000;
    const phase = ((days % SYNODIC) + SYNODIC) % SYNODIC / SYNODIC;
    const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
    let toFull = (0.5 - phase) * SYNODIC;
    if (toFull < -0.5) toFull += SYNODIC;
    const nextFull = new Date(date.getTime() + toFull * 86400000);
    return { phase, illumination, nextFull, daysToFull: toFull };
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function timezone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' '); }
    catch { return 'your time zone'; }
  }

  function timeshiftUrl() {
    const userOffset = -new Date().getTimezoneOffset();
    let diff = (STATION_OFFSET_MIN - userOffset) * 60;
    if (diff < 0) diff += 86400;
    return `https://ts.radyoharmoni.org/timeshift/${diff === 0 ? 30 : diff}.m3u8`;
  }

  // "MGV V06 01h-04h (a) Sitar - Devabrata Chaudhuri - R Sohinii"
  function parseTrack(title, artist) {
    if (!title) return null;
    const win = title.match(/(\d{2})h-(\d{2})h/);
    const parts = title.replace(/^MGV\s+\S+\s+/, '').split(/\s+[-–]\s+/);
    const ragaPart = parts.find(p => /^R\s/.test(p));
    const raga = ragaPart ? prettify(ragaPart.replace(/^R\s+/, '').replace(/\s*[-–]\s*R$/, '')) : null;
    const known = ['sitar', 'flute', 'santoor', 'shehnai', 'vocal', 'sarod', 'veena', 'violin', 'sarangi'];
    let instrument = null;
    for (const p of parts) {
      const k = known.find(w => p.toLowerCase().includes(w));
      if (k) { instrument = k[0].toUpperCase() + k.slice(1); break; }
    }
    // "Hari Prasad Chaurasia (Bansuri) & Faiyaz Khan (Tabla)" already names the instruments.
    if (artist && /\(/.test(artist)) {
      artist = artist.replace(/\s*\(([^)]+)\)/g, (_, i) => ', ' + i.toLowerCase()).replace(/\s*&\s*/g, ', with ');
      instrument = null;
    }
    return {
      raw: title,
      raga,
      artist: artist || null,
      instrument,
      window: win ? [parseInt(win[1], 10), parseInt(win[2], 10)] : null,
      anytime: /anytime/i.test(title)
    };
  }

  // Doubled vowels in the catalogue transliteration become long-vowel marks.
  function prettify(s) {
    return s.replace(/aa/g, 'ā').replace(/ii/g, 'ī').replace(/uu/g, 'ū')
            .replace(/Aa/g, 'Ā').replace(/Ii/g, 'Ī').replace(/Uu/g, 'Ū').trim();
  }

  // Minimal ID3v2 reader for TIT2 / TPE1 frames.
  function readId3(bytes) {
    const out = {};
    if (!bytes || bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return out;
    const size = (bytes[6] << 21) | (bytes[7] << 14) | (bytes[8] << 7) | bytes[9];
    let i = 10;
    const end = Math.min(bytes.length, 10 + size);
    while (i + 10 <= end) {
      const id = String.fromCharCode(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);
      const len = (bytes[i + 4] << 24) | (bytes[i + 5] << 16) | (bytes[i + 6] << 8) | bytes[i + 7];
      if (!/^[A-Z0-9]{4}$/.test(id) || len <= 0) break;
      const body = bytes.subarray(i + 10, i + 10 + len);
      if (id === 'TIT2' || id === 'TPE1') out[id] = decodeText(body);
      i += 10 + len;
    }
    return out;
  }
  function decodeText(body) {
    const enc = body[0];
    const data = body.subarray(1);
    const label = enc === 1 ? 'utf-16' : enc === 2 ? 'utf-16be' : enc === 3 ? 'utf-8' : 'latin1';
    try { return new TextDecoder(label).decode(data).replace(/\u0000/g, '').trim(); }
    catch { return ''; }
  }

  let hlsLoader = null;
  function loadHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (!hlsLoader) {
      hlsLoader = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = HLS_SRC;
        s.onload = () => resolve(window.Hls);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return hlsLoader;
  }

  class RadyoHarmoni {
    constructor(opts = {}) {
      this.opts = opts;
      this.listeners = {};
      this.audio = new Audio();
      this.audio.preload = 'none';
      this.nativeHls = !!this.audio.canPlayType('application/vnd.apple.mpegurl') &&
        !/Chrome|Android|Firefox/i.test(navigator.userAgent);
      // Audio-reactive visuals only where it cannot disturb playback:
      // desktop pointer, non-Safari engine.
      this.reactive = !!opts.reactive && !this.nativeHls && matchMedia('(pointer: fine)').matches;
      if (this.reactive) this.audio.crossOrigin = 'anonymous';

      const hash = location.hash.replace('#', '');
      this.station = STATIONS[hash] ? hash : (opts.station || 'peace');
      this.playing = false;
      this.buffering = false;
      this.wantPlay = false;
      this.volume = parseFloat(localStorage.getItem('rh-volume') || '0.85');
      this.track = null;
      this.hls = null;
      this.timer = null;
      this.fade = null;
      this.canSetVolume = this.probeVolume();

      const a = this.audio;
      ['playing', 'pause', 'waiting', 'canplay', 'stalled'].forEach(ev => a.addEventListener(ev, () => {
        this.playing = !a.paused;
        this.buffering = !a.paused && a.readyState < 3;
        this.emit('state', this.state());
      }));
      a.addEventListener('error', () => this.reconnectSoon());
      this.health = setInterval(() => this.checkHealth(), 20000);
      this.initMediaSession();
      this.watchInterruptions();
    }

    // A phone call (or another app taking the sound) pauses the stream without the listener asking. Pick it up
    // again once the interruption is over: Safari's Audio Session API says when, and coming back to the page does
    // anywhere. Headphones pulled out or Bluetooth gone count as a pause the listener wanted, never resumed loudly.
    watchInterruptions() {
      const a = this.audio;
      this.interrupted = false; this.deviceChanged = 0;
      if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) navigator.mediaDevices.addEventListener('devicechange', () => { this.deviceChanged = Date.now(); });
      a.addEventListener('pause', () => {
        if (!this.wantPlay || this.detaching) return;
        if (Date.now() - this.deviceChanged < 2500) { this.wantPlay = false; this.emit('state', this.state()); return; }
        if (!this.interrupted) { this.interrupted = true; this.pausedAt = Date.now(); }
      });
      a.addEventListener('playing', () => { this.interrupted = false; });
      const back = () => { if (this.interrupted && this.wantPlay && document.visibilityState === 'visible') this.resumeAfterInterruption(); };
      document.addEventListener('visibilitychange', back);
      addEventListener('focus', back);
      addEventListener('pageshow', back);
      const session = navigator.audioSession;
      if (session) {
        try { session.type = 'playback'; } catch (e) {}
        session.addEventListener('statechange', () => {
          if (session.state !== 'interrupted' && this.interrupted && this.wantPlay) this.resumeAfterInterruption();
        });
      }
    }

    resumeAfterInterruption() {
      this.interrupted = false;
      // After more than a moment away, start again at the live edge (and, on Peace Radio, at this hour's raga)
      if (Date.now() - this.pausedAt > 20000) this.detach();
      this.play();
    }

    probeVolume() {
      const t = new Audio();
      t.volume = 0.5;
      return t.volume === 0.5;
    }

    on(ev, fn) { (this.listeners[ev] ||= []).push(fn); if (ev === 'state') fn(this.state()); return this; }
    emit(ev, data) { (this.listeners[ev] || []).forEach(fn => fn(data)); }

    state() {
      return { station: this.station, playing: this.playing, buffering: this.buffering, muted: this.audio.muted,
               volume: this.volume, track: this.track, wantPlay: this.wantPlay };
    }

    async play(stationId) {
      if (stationId && stationId !== this.station) return this.select(stationId, true);
      this.wantPlay = true;
      this.buffering = true;
      this.emit('state', this.state());
      if (!this.audio.src && !this.hls) await this.attach();
      this.ensureGraph();
      this.audio.volume = this.canSetVolume ? 0 : 1;
      try {
        await this.audio.play();
        this.rampTo(this.volume, this.opts.fadeIn || 1200);
      } catch (e) {
        this.wantPlay = false;
        this.buffering = false;
        this.emit('state', this.state());
      }
    }

    pause() {
      this.wantPlay = false;
      this.emit('state', this.state());
      this.rampTo(0, 400, () => { this.audio.pause(); });
    }

    toggle() { return this.wantPlay ? this.pause() : this.play(); }

    async select(id, autoplay) {
      if (!STATIONS[id]) return;
      const resume = autoplay ?? this.wantPlay;
      const swap = async () => {
        this.detach();
        this.station = id;
        this.track = null;
        history.replaceState(null, '', '#' + id);
        this.emit('track', null);
        this.emit('state', this.state());
        this.updateMediaSession();
        if (resume) await this.play();
      };
      if (this.wantPlay && !this.audio.paused) this.rampTo(0, 500, swap);
      else await swap();
    }

    // Mute works everywhere, including iPhone, where the page cannot set the volume itself.
    setMuted(m) {
      this.audio.muted = !!m;
      this.emit('state', this.state());
    }

    setVolume(v) {
      this.volume = Math.max(0, Math.min(1, v));
      localStorage.setItem('rh-volume', String(this.volume));
      if (this.fade) { cancelAnimationFrame(this.fade); this.fade = null; }
      if (this.canSetVolume) this.audio.volume = this.volume;
      this.emit('state', this.state());
    }

    // Meditation timer: the music fades over the final 30 seconds, then rests.
    setTimer(minutes) {
      clearInterval(this.timerTick);
      if (!minutes) { this.timer = null; this.emit('timer', null); return; }
      const total = minutes * 60000;
      const endAt = Date.now() + total;
      this.timer = { endAt, total };
      const tick = () => {
        const remaining = Math.max(0, endAt - Date.now());
        this.emit('timer', { remaining, total, minutes });
        if (remaining <= 30000 && remaining > 0 && this.canSetVolume && !this.audio.paused) {
          this.audio.volume = this.volume * (remaining / 30000);
        }
        if (remaining === 0) {
          clearInterval(this.timerTick);
          this.timer = null;
          this.wantPlay = false;
          this.audio.pause();
          if (this.canSetVolume) this.audio.volume = this.volume;
          this.emit('timer', null);
          this.emit('state', this.state());
        }
      };
      tick();
      this.timerTick = setInterval(tick, 1000);
    }

    // Smoothed loudness 0..1 for visuals. Without an analyser it breathes slowly.
    level() {
      const t = performance.now() / 1000;
      if (this.analyser && this.playing) {
        this.analyser.getByteTimeDomainData(this.buf);
        let sum = 0;
        for (let i = 0; i < this.buf.length; i++) { const v = (this.buf[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / this.buf.length);
        this.smooth = (this.smooth || 0) * 0.9 + Math.min(1, rms * 5) * 0.1;
        return this.smooth;
      }
      const base = this.playing ? 0.35 : 0.12;
      return base + Math.sin(t * 0.55) * 0.08 + Math.sin(t * 1.7) * 0.03;
    }

    spectrum() {
      if (!this.analyser || !this.playing) return null;
      this.analyser.getByteFrequencyData(this.freq);
      return this.freq;
    }

    // ── internals ────────────────────────────────────────────────────
    ensureGraph() {
      if (!this.reactive || this.ctx) { if (this.ctx?.state === 'suspended') this.ctx.resume(); return; }
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        const src = this.ctx.createMediaElementSource(this.audio);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 1024;
        this.analyser.smoothingTimeConstant = 0.85;
        this.buf = new Uint8Array(this.analyser.fftSize);
        this.freq = new Uint8Array(this.analyser.frequencyBinCount);
        src.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      } catch (e) { this.analyser = null; }
    }

    async attach() {
      const st = STATIONS[this.station];
      if (!st.hls) { this.audio.src = st.url; return; }
      const url = timeshiftUrl();
      if (this.nativeHls) {
        this.audio.src = url;
        this.audio.addEventListener('loadedmetadata', () => {
          if (this.audio.seekable.length) this.audio.currentTime = this.audio.seekable.start(0);
        }, { once: true });
        this.watchTextTracks();
        return;
      }
      const Hls = await loadHls();
      if (!Hls.isSupported()) { this.audio.src = url; return; }
      this.hls = new Hls({ lowLatencyMode: false, maxBufferLength: 60 });
      this.hls.on(Hls.Events.FRAG_PARSING_METADATA, (_, data) => {
        for (const s of data.samples || []) {
          const tags = readId3(s.data);
          if (tags.TIT2) this.setTrack(tags.TIT2, tags.TPE1);
        }
      });
      this.hls.on(Hls.Events.ERROR, (_, d) => {
        if (d.fatal) this.reconnectSoon();
        else if (d.type === Hls.ErrorTypes.NETWORK_ERROR) this.hls.startLoad();
      });
      this.hls.loadSource(url);
      this.hls.attachMedia(this.audio);
      await new Promise(res => this.hls.once(Hls.Events.MANIFEST_PARSED, res));
    }

    watchTextTracks() {
      const tt = this.audio.textTracks;
      if (!tt) return;
      tt.onaddtrack = e => {
        const track = e.track;
        if (track.kind !== 'metadata') return;
        track.mode = 'hidden';
        track.oncuechange = () => {
          let title, artist;
          for (const c of Array.from(track.activeCues || [])) {
            const v = c.value;
            if (!v) continue;
            if (v.key === 'TIT2') title = v.data;
            if (v.key === 'TPE1') artist = v.data;
          }
          if (title) this.setTrack(title, artist);
        };
      };
    }

    setTrack(title, artist) {
      if (this.track && this.track.raw === title) return;
      this.track = parseTrack(title, artist);
      this.emit('track', this.track);
      this.updateMediaSession();
    }

    detach() {
      // our own pause, not an interruption (the pause event arrives a moment later)
      this.detaching = true; clearTimeout(this.detachDone);
      this.detachDone = setTimeout(() => { this.detaching = false; }, 300);
      if (this.hls) { this.hls.destroy(); this.hls = null; }
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }

    rampTo(target, ms, done) {
      if (this.fade) cancelAnimationFrame(this.fade);
      if (!this.canSetVolume) { done && done(); return; }
      const from = this.audio.volume;
      const t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / ms);
        this.audio.volume = from + (target - from) * (k * k * (3 - 2 * k));
        if (k < 1) this.fade = requestAnimationFrame(step);
        else { this.fade = null; done && done(); }
      };
      this.fade = requestAnimationFrame(step);
    }

    checkHealth() {
      if (!this.wantPlay || this.audio.paused) { this.stalls = 0; return; }
      if (this.audio.currentTime === this.lastTime) {
        if (++this.stalls >= 2) this.reconnectSoon();
      } else this.stalls = 0;
      this.lastTime = this.audio.currentTime;
    }

    reconnectSoon() {
      if (this.reconnecting || !this.wantPlay) return;
      this.reconnecting = true;
      setTimeout(async () => {
        this.reconnecting = false;
        this.detach();
        await this.play();
      }, 3000);
    }

    initMediaSession() {
      if (!('mediaSession' in navigator)) return;
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      this.updateMediaSession();
    }

    updateMediaSession() {
      if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
      const st = STATIONS[this.station];
      const t = this.track;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t && t.raga ? `Raga ${t.raga}` : st.name,
        artist: t && t.artist ? `${t.artist}${t.instrument ? ', ' + t.instrument.toLowerCase() : ''}` : 'Radyo Harmoni',
        album: st.name,
        artwork: this.opts.artwork || [{ src: 'https://radyoharmoni.org/wp-content/uploads/2026/02/cropped-RadyoHArmoni-Logo-1_192.jpg', sizes: '192x192', type: 'image/jpeg' }]
      });
    }
  }

  RadyoHarmoni.STATIONS = STATIONS;
  RadyoHarmoni.PERIODS = PERIODS;
  RadyoHarmoni.period = period;
  RadyoHarmoni.moon = moon;
  RadyoHarmoni.timezone = timezone;
  RadyoHarmoni.parseTrack = parseTrack;
  RadyoHarmoni.pad = pad;
  window.RadyoHarmoni = RadyoHarmoni;
})();
