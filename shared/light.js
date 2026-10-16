/*
 * Light and Time — the colour of the hour, shared by the presets that follow it.
 * Moods and the day schedule come from Ayvalık Light (Golden and Rose match the owner's Canva pages).
 *
 * Usage: const L = new RadyoHarmoni.Light(); L.target() → { top, mid, bot, dark, … } for now.
 * Query params: ?mood=golden pins a light, ?moon=full shows the full moon night, ?daylapse runs a day in ~30 s.
 */
(function () {
  'use strict';
  const R = window.RadyoHarmoni;

  // top/mid/bot are the sky-to-water gradient. amt…lift drive the video grade (cz: how much of the colour comes
  // from the grade rather than the picture, .6 unless set); `dark` says the light is night.
  const MOODS = {
    day:    { top: '#cfe3f2', mid: '#b4d0e6', bot: '#2f6890', amt: 0,   expo: 1.0,  sat: 1.0,  lift: 0,    mgv: '#7f7562', dark: 0 },
    golden: { top: '#f6a46a', mid: '#f5c294', bot: '#2c6f8c', amt: .76, expo: 1.02, sat: .97,  lift: .02,  mgv: '#7e6548', dark: 0 },
    rose:   { top: '#f79abf', mid: '#f4a9bf', bot: '#5059c4', amt: .8,  expo: 1.02, sat: 1.0,  lift: .02,  mgv: '#7a5864', dark: 0 },
    // Night is the client's dark blue, #0b135b (revision list v1), not navy.
    night:  { top: '#141c6e', mid: '#121a66', bot: '#0b135b', amt: 1,   expo: .9,   sat: 1.1,  lift: .02,  mgv: '#d9d2c0', dark: 1, cz: .9 }
  };
  // Around the full moon the night turns silver, the nights of the full moon concerts.
  const MOONLIT = { top: '#5a6894', mid: '#8590b4', bot: '#121c63', amt: .86, expo: .78, sat: .78, lift: .03, mgv: '#e8e3d6', dark: 1 };

  // The light through a day. Each key is [hour, mood]; between keys the light blends.
  const DAY = [[0, 'night'], [4.5, 'night'], [5.5, 'rose'], [6.6, 'golden'], [8.2, 'day'], [15.8, 'day'], [17.6, 'golden'], [19, 'rose'], [20.3, 'night'], [24, 'night']];

  // The same day as a list people can read.
  const SCHEDULE = [
    { mood: 'rose',   from: 5,  to: 6.5, name: 'Before sunrise' },
    { mood: 'golden', from: 6.5, to: 8,  name: 'Sunrise' },
    { mood: 'day',    from: 8,  to: 16,  name: 'Day' },
    { mood: 'golden', from: 16, to: 18,  name: 'Late afternoon' },
    { mood: 'rose',   from: 18, to: 20,  name: 'Dusk' },
    { mood: 'night',  from: 20, to: 5,   name: 'Night' }
  ];

  const CHOICES = [['auto', 'Follows your hour'], ['day', 'Day'], ['golden', 'Golden'], ['rose', 'Rose'], ['night', 'Night']];

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const lerp = (a, b, k) => a + (b - a) * k;
  const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
  const css = c => `rgb(${c.map(v => Math.round(v * 255)).join(',')})`;

  function moodAtHour(h) {
    let i = 0; while (DAY[i + 1][0] <= h) i++;
    const a = DAY[i], b = DAY[i + 1];
    const k = (h - a[0]) / (b[0] - a[0]);
    return { a: a[1], b: b[1], k: k * k * (3 - 2 * k) };
  }

  function scheduleIndex(h) {
    return SCHEDULE.findIndex(s => s.from < s.to ? h >= s.from && h < s.to : h >= s.from || h < s.to);
  }

  class Light {
    constructor(opts = {}) {
      const qs = new URLSearchParams(location.search);
      this.moods = { ...MOODS };
      this.fullMoon = qs.get('moon') === 'full' || R.moon().illumination > .9;
      if (this.fullMoon) this.moods.night = MOONLIT;
      this.demo = qs.has('daylapse');
      this.demoStart = performance.now();
      this.demoFrom = opts.demoFrom ?? 4;
      let saved = null;
      try { saved = localStorage.getItem('rh-light'); } catch (e) {}
      this.choice = qs.get('mood') || saved || 'auto';
      if (!this.moods[this.choice]) this.choice = 'auto';
      this.listeners = [];
    }

    // The hour the light follows: the clock, or a fast day during a demo (24 h in 30 s).
    hour() {
      if (!this.demo) return R.period().hourFloat;
      return (this.demoFrom + (performance.now() - this.demoStart) / 1000 * 0.8) % 24;
    }

    // Runs a day in 30 seconds from just before dawn, then hands back to the clock.
    lapse(on = true) {
      this.demo = on;
      this.demoStart = performance.now();
      clearTimeout(this.lapseEnd);
      if (on) this.lapseEnd = setTimeout(() => this.lapse(false), 30000);
      this.emit();
    }

    blend(a, b, k) {
      const A = this.moods[a], B = this.moods[b];
      return {
        top: lerp3(hex(A.top), hex(B.top), k), mid: lerp3(hex(A.mid), hex(B.mid), k), bot: lerp3(hex(A.bot), hex(B.bot), k),
        amt: lerp(A.amt, B.amt, k), expo: lerp(A.expo, B.expo, k), sat: lerp(A.sat, B.sat, k), lift: lerp(A.lift, B.lift, k),
        cz: lerp(A.cz ?? .6, B.cz ?? .6, k), dark: lerp(A.dark, B.dark, k), mgv: k < .5 ? A.mgv : B.mgv
      };
    }

    // The light to show now: the chosen mood, or the blend for the hour.
    target() {
      if (this.choice !== 'auto') return this.blend(this.choice, this.choice, 0);
      const m = moodAtHour(this.hour());
      return this.blend(m.a, m.b, m.k);
    }

    set(choice) {
      this.choice = this.moods[choice] ? choice : 'auto';
      try { localStorage.setItem('rh-light', this.choice); } catch (e) {}
      this.emit();
    }

    on(fn) { this.listeners.push(fn); }
    emit() { this.listeners.forEach(fn => fn(this)); }

    // Wires a set of [data-mood] buttons: pressed state follows the choice.
    // The buttons that choose the light; binding a new set (the menu is rebuilt) replaces the old one
    bind(buttons) {
      this.bound = buttons;
      buttons.forEach(b => b.addEventListener('click', () => this.set(b.dataset.mood)));
      if (!this.syncBound) { this.syncBound = () => this.bound.forEach(b => b.setAttribute('aria-pressed', b.dataset.mood === this.choice)); this.on(this.syncBound); }
      this.syncBound();
    }

    swatch(mood) {
      if (mood === 'auto') return 'conic-gradient(#8fb9d8,#f2b878,#ee9fb8,#0b135b,#8fb9d8)';
      const M = this.moods[mood];
      return mood === 'day' ? 'linear-gradient(180deg,#cfe3f2,#5f8fb4)' : `linear-gradient(180deg,${M.top},${M.bot})`;
    }
  }

  Light.MOODS = MOODS;
  Light.MOONLIT = MOONLIT;
  Light.SCHEDULE = SCHEDULE;
  Light.CHOICES = CHOICES;
  Light.moodAtHour = moodAtHour;
  Light.scheduleIndex = scheduleIndex;
  Light.css = css;
  Light.ease = (cur, tgt, s) => {
    for (const k of ['top', 'mid', 'bot']) cur[k] = cur[k].map((v, i) => v + (tgt[k][i] - v) * s);
    for (const k of ['amt', 'expo', 'sat', 'lift', 'cz', 'dark']) cur[k] += (tgt[k] - cur[k]) * s;
    cur.mgv = tgt.mgv;
    return cur;
  };
  R.Light = Light;
})();
