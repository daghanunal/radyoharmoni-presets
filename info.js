/*
 * The info section under the player: one set for Peace Radio, one for Rain Radio (Info Section sheet, v2).
 * Both sets are built once; switching station shows the other. Needs app.js (window.RH) first.
 */
(function () {
  'use strict';
  const R = RadyoHarmoni, L = R.Light, RH = window.RH, $ = s => document.querySelector(s);
  const VID = 'media/films/';
  const dateLong = d => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const moonNow = R.moon();

  // ── Peace Radio ─────────────────────────────────────────────
  const PEACE = `
    <section class="row"><div class="cols">
      <h2>The sea keeps your time</h2>
      <div class="body">
        <p>Gandharva Veda gives each part of the day its own ragas, and Peace Radio plays the one for your hour. The light on the sea at Ayvalık changes with it.</p>
        <div class="dayband" data-w="dayband">
          <div class="ribbon" aria-hidden="true"><i class="mark"></i></div>
          <ol class="cells" aria-label="The eight watches of the day"></ol>
        </div>
        <p class="band-cap" data-w="band-cap" aria-live="polite"></p>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>How to listen</h2>
      <div class="body ways">
        <article><h3>For yourself</h3><p>Sit comfortably and close your eyes. Stay with one raga from its opening to its final note.</p></article>
        <article><h3>For your surroundings</h3><p>Leave it playing softly through the day, at home, at work, in classrooms and in waiting rooms.</p></article>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Music in tune with the hours</h2>
      <div class="body">
        <p>Gandharva Veda divides the day into eight watches of three hours, each with its own ragas. The radio reads your time zone, so the raga you hear belongs to the hour you are living in.</p>
        <p class="nowline" data-w="nowline" data-word="light"></p>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Why it is played</h2>
      <div class="body">
        <blockquote class="q">“Gandharva Veda music makes a precious contribution to the creation of world peace: the use of sound, melody, and rhythm to restore balance and harmony in the mind, body, behavior, and environment.”<cite>Maharishi Mahesh Yogi, 1991</cite></blockquote>
        <div class="sub">
          <h3>Research</h3>
          <p class="ref">Travis, Morehead &amp; Parim (2023), Effects of Gandharva Veda Music on Mood States, Health, and Brain Functioning. <i>International Journal of Psychological Studies</i> 15(1), 8. <a href="https://doi.org/10.5539/ijps.v15n1p8">Read the paper</a></p>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>What listeners notice</h2>
      <div class="body">
        <div class="voices">
          <blockquote>I felt deep pulses of blissful energy throughout my body, and behind it all was pure, unmovable silence, eternity.<cite>S.W., Thailand</cite></blockquote>
          <blockquote>A tree blooms for the first time in ten years; workers on site are calmer, clients are happy.<cite>B.C., landscape architect, Türkiye</cite></blockquote>
        </div>
        <div class="sub">
          <h3>Research</h3>
          <p>At live concerts with more than 1,800 listeners, mood questionnaires showed significant drops in tension and other negative feelings after the ragas, and a rise in positive ones.</p>
          <p class="ref">Travis, Morehead &amp; Parim (2023), <i>International Journal of Psychological Studies</i> 15(1), 8. <a href="https://doi.org/10.5539/ijps.v15n1p8">Read the paper</a></p>
        </div>
      </div>
    </div></section>

    <section class="row moonsec" id="concerts"><div class="cols">
      <h2>Full moon concerts</h2>
      <div class="body">
        <p>Each month, on the evening of the full moon, Gandharva Veda musicians play live for a global audience.</p>
        <div class="circle-row">
          <div class="porthole" data-w="moon">
            <canvas aria-hidden="true"></canvas>
            <img class="flat" src="media/yumurta.jpg" alt="">
          </div>
          <div>
            <p class="date" data-w="nextfull"></p>
            <p class="days" data-w="moondays"></p>
            <div class="moonsel" role="group" aria-label="Moon shown">
              <button data-m="full" aria-pressed="true">Concert night</button>
              <button data-m="now" aria-pressed="false">Tonight</button>
            </div>
            <a class="btn" href="https://artsforenlightenment.org/">Register for the concert</a>
          </div>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Keep it playing</h2>
      <div class="body">
        <p>RadyoHarmoni is free and carries no advertising. It is presented by the Academy of Arts for Enlightenment.</p>
        <p class="actions"><a class="btn" href="https://www.paypal.com/donate/?hosted_button_id=8PV97C4VSV5R8">Donate</a><a class="btn ghost" href="https://artsforenlightenment.org/">About the Academy</a></p>
      </div>
    </div></section>`;

  // ── Rain Radio ──────────────────────────────────────────────
  const FILMS = ['farmer-1', 'farmer-2', 'farmer-3', 'farmer-5'];
  const RAIN = `
    <section class="row"><div class="cols">
      <h2>The sky keeps nature’s time</h2>
      <div class="body">
        <p>Gandharva Veda brings harmony, and Rain Radio plays ragas for balance in nature. The sky over Monte Verde changes with it.</p>
        <div class="skies" data-w="skies" role="group" aria-label="Sky over Monte Verde"></div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>How it is played</h2>
      <div class="body ways">
        <article><h3>For nature</h3><p>Connect a speaker and place it outdoors, and let it play softly, continuously.</p></article>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Ancient as time</h2>
      <div class="body">
        <blockquote class="q">“Gandharva music is that melody from which all the melodies have sprung … the eternal music of nature.”<cite>Maharishi Mahesh Yogi</cite></blockquote>
        <span class="nowline" data-w="nowline" data-word="sky" style="margin-top:22px"></span>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Why it is played</h2>
      <div class="body">
        <blockquote class="q">“Those who listen to it, they’ll have the direct effect of it. But even those who do not listen, the quality of the environment, the quality of the ecology rises in the character of harmony. Harmony. Integration, and that neutralizes negative trends and tendencies in the world.”<cite>Maharishi Mahesh Yogi</cite></blockquote>
        <div class="sub">
          <h3>Research</h3>
          <p>Mustard and fenugreek plants that heard Raga Bhairav in the morning and Raga Yaman Kalyan in the evening germinated and grew better than plants without music, with more chlorophyll, less of the stress marker hydrogen peroxide, and stronger protective enzymes.</p>
          <p class="ref">Vir, Chauhan, Kumar, Saini &amp; Saini (2026), Impact of Indian classical raga on plant growth and biochemical parameters in Rai and Methi. <i>International Journal of Applied Research</i> 12(5), 281–288. <a href="https://doi.org/10.22271/allresearch.2026.v12.i5c.13644">Read the paper</a></p>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>What farmers notice</h2>
      <div class="body carousel">
        <div class="reel" data-w="reel" tabindex="0" aria-label="Farmer testimony videos">
          ${FILMS.map((f, i) => `<figure><div class="film"><video src="${VID}${f}.mp4" poster="${VID}${f}.jpg" controls playsinline preload="none" aria-label="Farmer testimony ${i + 1}"></video></div></figure>`).join('')}
        </div>
        <div class="reel-nav">
          <button data-dir="-1" aria-label="Previous video"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3 5 8l5 5"/></svg></button>
          <button data-dir="1" aria-label="Next video"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 3 5 5-5 5"/></svg></button>
        </div>
        <div class="sub">
          <h3>Research</h3>
          <p>In a 60-day study with sixty dairy cows, the cows that heard music gave significantly more milk each day than cows without it, and those that heard raga music showed lower levels of the stress hormone cortisol.</p>
          <p class="ref">Cao, Zhao, Feng et al. (2025), Effects of Raga music and Chinese five-element music on milk production, antioxidant, neuroendocrine, immune, and welfare indicators in dairy cows. <i>Frontiers in Veterinary Science</i> 12, 1623026. <a href="https://doi.org/10.3389/fvets.2025.1623026">Read the paper</a></p>
        </div>
      </div>
    </div></section>


    <section class="row moonsec"><div class="cols">
      <h2>Blooming gardens</h2>
      <div class="body">
        <p>In a study of thirty rose plants, the roses that heard Indian classical music grew the longest stems between their leaves, longer than roses in silence or with rock and pop. Play Rain Radio and the rose here opens with the music.</p>
        <div class="circle-row">
          <div class="porthole rose" data-w="rose"><svg viewBox="-120 -120 240 240" aria-hidden="true"></svg></div>
          <p class="ref" style="margin:0">Chivukula &amp; Ramaswamy (2014), Effect of Different Types of Music on Rosa Chinensis Plants. <i>International Journal of Environmental Science and Development</i> 5(5), 431–434. <a href="https://doi.org/10.7763/IJESD.2014.V5.522">Read the paper</a></p>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Share your sky</h2>
      <div class="body">
        <p>Share your seascape or landscape photos to be featured as the background of the player.</p>
        <p class="weather" data-w="weather"></p>
        <p class="actions">
          <button class="btn" data-w="share-open" aria-expanded="false" aria-controls="shareForm">Share your photo</button>
          <button class="btn ghost" data-w="contact-open" aria-expanded="false" aria-controls="contactForm">Contact us</button>
        </p>
        <form class="form" id="shareForm" data-w="share" hidden>
          <label>Your name<input name="name" autocomplete="name" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label>Where was it taken?<input name="place"></label>
          <label>Link to your photos (Google Drive, Dropbox…)<input name="link" type="url" placeholder="https://"></label>
          <label>Message<textarea name="message"></textarea></label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p><button class="btn" type="submit">Send</button></p>
          <p class="note" data-status aria-live="polite"></p>
          <p class="recaptcha-note">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
        </form>
        <form class="form" id="contactForm" data-w="contact" hidden>
          <div class="form-two">
            <label>First name<input name="first_name" autocomplete="given-name" required></label>
            <label>Last name<input name="last_name" autocomplete="family-name"></label>
          </div>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label>Write a message<textarea name="message" required></textarea></label>
          <label class="check"><input type="checkbox" name="optin" value="1"> Join us for the latest updates</label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p><button class="btn" type="submit">Send message</button></p>
          <p class="note" data-status aria-live="polite"></p>
          <p class="recaptcha-note">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
        </form>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Stay in tune</h2>
      <div class="body">
        <p>New ragas, the live full moon concerts and photographs from listeners, a few times a year.</p>
        <form class="inline-form" data-w="subscribe"><input name="email" type="email" placeholder="Your email" aria-label="Your email" autocomplete="email" required><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">Subscribe</button><p class="note" data-status aria-live="polite"></p><p class="recaptcha-note">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p></form>
      </div>
    </div></section>`;

  // ── Footer: friends, About, and the legal lines; the same for both stations ──
  const ABOUT = `
    <details class="about">
      <summary>About Maharishi Gandharva Veda</summary>
      <div class="cols">
        <div><h4>What is Maharishi Gandharva Veda?</h4>
          <p>Gandharva Veda is the classical music of the ancient Vedic civilization of India, which enjoyed Heaven on Earth.</p>
          <p>Gandharva Veda music is the eternal music of nature, the rhythms and melodies of nature expressed as music. Gandharva ragas reflect the pure, coherent flow of sound to neutralize stress and disharmony, and gently restore life in tune with the laws of nature.</p>
          <p>Maharishi Mahesh Yogi, founder of the Transcendental Meditation programme, has revived Gandharva Veda in its purity by reconnecting it to its source in Veda (Vedic Science, the science of total knowledge).</p></div>
        <div><h4>Music in Tune with the Rhythms of Nature</h4>
          <p>Gandharva Veda melodies express the rhythms and frequencies of Nature as they change throughout the day and night.</p>
          <p>Different Gandharva ragas capture and magnify these frequencies to maximize their benefit to human life. RadyoHarmoni presents Gandharva ragas in their pure form, in tune with these changing values of Nature.</p>
          <p>Play Maharishi Gandharva Veda music 24/7, continuously, and contribute to creating world peace. You will enjoy its individual benefits when you listen, but even when no one listens to the melodies, the benefits will spread in the environment, creating balance, peace and harmony in the whole world.</p></div>
        <div><h4>Benefits to Life: Bliss. Peace. Harmony</h4>
          <p>Those who listen to Gandharva Veda melodies report more bliss, calmness, peace and wellbeing in life.</p>
          <p>Research indicates that Gandharva Veda music leads to significant decreases in negative emotions and increases in positive emotions. According to Maharishi’s Festival of Music for World Peace (1986), when Gandharva music was played extensively around the world, negative tendencies in society were notably reduced and replaced by trends of positivity and peace.</p></div>
      </div>
    </details>`;
  const FOOT = `
    <div class="wrap">
      <div class="foot-row">
        <div class="foot-col">
          <h3 class="foot-h">About Radyo Harmoni</h3>
          <p>RadyoHarmoni is a free online radio station, streaming Gandharva Veda melodies non-stop, 24/7. We recommend playing the music continuously, to create an aura of peace and harmony in your surroundings.</p>
        </div>
        <div class="foot-col friends">
          <h3 class="foot-h">Friends of Radyo Harmoni</h3>
          <p><a href="https://tm-women.org/">TM-women.org</a><a href="https://apps.apple.com/app/id977489377">Veda App</a></p>
        </div>
      </div>
      ${ABOUT}
      <div class="legal">
        <p>Music Copyright © 2026, Maharishi Vedic University Ltd. and Maharishi Foundation Ltd. All rights reserved worldwide.</p>
        <p>Transcendental Meditation, TM-Sidhi, Maharishi, Maharishi Vedic, Vedic Science, Maharishi International University, Maharishi Vāstu, Maharishi Gandharva Veda, Fortune-Creating, Maharishi Sthāpatya Veda, Maharishi AyurVeda, and other terms used on this website are subject to trademark protection in many countries worldwide, including the United States, and are used with permission.</p>
        <p>Copyright 2026 © Academy of Arts for Enlightenment. <a href="privacy-policy/">Privacy policy</a> <button class="linkish" data-consent-open>Privacy choices</button></p>
      </div>
    </div>`;

  // The release build bakes these sections into the HTML (for search engines and AI agents that do not run scripts);
  // here they are only built when they are not already there.
  if (!$('#info').querySelector('.info-set')) $('#info').innerHTML = `<div class="info-set" data-set="peace">${PEACE}</div><div class="info-set" data-set="rain">${RAIN}</div>`;
  if (!$('#foot').children.length) $('#foot').innerHTML = FOOT;
  $('[data-w="nextfull"]').textContent = dateLong(moonNow.nextFull);
  $('[data-w="weather"]').textContent = dateLong(new Date());
  const w = (name, root = document) => root.querySelector(`[data-w="${name}"]`);
  const ws = name => document.querySelectorAll(`[data-w="${name}"]`);

  function showSet(id) {
    document.querySelectorAll('.info-set').forEach(el => el.classList.toggle('on', el.dataset.set === id));
  }
  showSet(RH.radio.station);
  document.addEventListener('rh:station', e => showSet(e.detail));

  // ── The day as a ribbon of light: colours across 24 hours from 01:00, the eight watches, a mark for now ──
  // Softened toward the paper, so the ribbon reads as light rather than as a chart.
  const RIBBON = { night: '#4a5290', rose: '#eeb3c7', golden: '#efbe8f', day: '#b4cfe3' };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const band = w('dayband'), cells = band.querySelector('.cells'), cap = w('band-cap');
  (function paintRibbon() {
    const stops = [];
    for (let i = 0; i <= 48; i++) {
      const h = (1 + i / 2) % 24, m = L.moodAtHour(h);
      const A = hex(RIBBON[m.a]), B = hex(RIBBON[m.b]);
      const c = A.map((v, j) => Math.round(v + (B[j] - v) * m.k));
      stops.push(`rgb(${c.join(',')}) ${(i / 48 * 100).toFixed(2)}%`);
    }
    band.style.setProperty('--grad-h', `linear-gradient(90deg,${stops.join(',')})`);
    band.style.setProperty('--grad-v', `linear-gradient(180deg,${stops.join(',')})`);
  })();
  cells.innerHTML = R.PERIODS.map((x, i) => `<li><button data-i="${i}" aria-pressed="false"><b>${x.name}</b><small>${R.pad(x.start)}–${R.pad((x.start + 3) % 24)}</small></button></li>`).join('');
  // The character of each watch's ragas, after the time theory of ragas in the Indian classical tradition.
  const CHARACTER = [
    'tender and searching, in the last hours before dawn',
    'serene and devotional, waking with the first light',
    'gentle and tender, as the day opens',
    'bright and joyful, full of the noon light',
    'warm and yearning, settled in the long afternoon',
    'contemplative and longing, holding the turn from day to night',
    'peaceful and joyful, as the lamps are lit',
    'deep and meditative, majestic in the dark'
  ];
  let picked = null;
  function showWatch(i) {
    const p = R.period(), x = R.PERIODS[i], isNow = i === p.index;
    cells.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i));
    cap.innerHTML = `<em>${isNow ? 'Now: ' : ''}${x.name}, ${R.pad(x.start)}:00 to ${R.pad((x.start + 3) % 24)}:00.</em> Ragas of this watch: <i>${CHARACTER[i]}</i>.`;
  }
  cells.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { picked = +b.dataset.i === R.period().index ? null : +b.dataset.i; showWatch(+b.dataset.i); }));
  function paintHours() {
    const p = R.period();
    band.style.setProperty('--at', (((p.hourFloat - 1 + 24) % 24) / 24 * 100).toFixed(2) + '%');
    if (picked === null) showWatch(p.index);
    ws('nowline').forEach(el => {
      if (!el.dataset.word) return;
      el.textContent = `In ${R.timezone()} it is now ${p.name.toLowerCase()}: ${p.mood.toLowerCase().replace(/\blight\b/, el.dataset.word)}.`;
    });
  }
  paintHours();
  setInterval(paintHours, 60000);

  // ── Rain Radio's skies, as round swatches that change the picture above ──
  const skies = w('skies');
  skies.innerHTML = RH.SKIES.map(([m, name, sw]) => `<button data-sky-pick="${m}" aria-pressed="${m === RH.sky}"><i style="background:${sw}"></i><b>${name}</b><small>${{ day: 'clear light', clouds: 'drifting', rain: 'with its sound', rainbow: 'after the rain', night: 'night blue' }[m]}</small></button>`).join('');
  skies.querySelectorAll('[data-sky-pick]').forEach(b => b.addEventListener('click', () => {
    RH.setSky(b.dataset.skyPick);
    if (scrollY > innerHeight * .4) scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  document.addEventListener('rh:sky', e => skies.querySelectorAll('[data-sky-pick]').forEach(b => b.setAttribute('aria-pressed', b.dataset.skyPick === e.detail)));

  // ── Farmers' films: one plays at a time ──
  const reel = w('reel');
  reel.querySelectorAll('video').forEach(v => {
    v.addEventListener('play', () => { reel.querySelectorAll('video').forEach(o => { if (o !== v) o.pause(); }); v.parentElement.classList.add('playing'); });
    v.addEventListener('pause', () => v.parentElement.classList.remove('playing'));
  });
  document.querySelectorAll('.reel-nav button').forEach(b => b.addEventListener('click', () => {
    const card = reel.querySelector('figure');
    const gap = parseFloat(getComputedStyle(reel).columnGap) || 0;
    reel.scrollBy({ left: (+b.dataset.dir) * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  }));
  document.addEventListener('rh:station', () => reel.querySelectorAll('video').forEach(v => v.pause()));

  // ── Full moon over Yumurta island, with the little boat in front ──
  const moonBox = w('moon');
  w('moondays').textContent = (() => {
    const d = Math.max(0, Math.round(moonNow.daysToFull));
    return d === 0 ? 'The full moon is tonight.' : `The next full moon is ${d} day${d > 1 ? 's' : ''} away. Tonight the moon is ${Math.round(moonNow.illumination * 100)}% lit.`;
  })();
  const yumurta = islandMoon(moonBox);
  document.querySelectorAll('.moonsel button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.moonsel button').forEach(x => x.setAttribute('aria-pressed', x === b));
    if (yumurta) yumurta.to(b.dataset.m === 'full' ? .5 : moonNow.phase);
  }));

  function islandMoon(box) {
    const cv = box.querySelector('canvas');
    const gl = cv.getContext('webgl', { powerPreference: 'low-power' });
    if (!gl) { box.classList.add('no-gl'); return null; }
    const FS = `
      precision mediump float;
      uniform sampler2D img; uniform float t, ph;
      varying vec2 uv;
      float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
      void main() {
        vec2 st = vec2(uv.x, 1. - uv.y);
        float hz = .535, d = st.y - hz;
        if (d > 0.) { float p = .55 / (d + .02) + t * 1.1 + st.x * 3.; st.y += sin(p) * .0016 * (d * 3. + .2); st.x += cos(p * .8) * .0008; }
        vec3 c = texture2D(img, st).rgb;
        float l = dot(c, vec3(.299, .587, .114));
        vec3 o = mix(vec3(.012, .02, .11), vec3(.15, .19, .52), smoothstep(.22, .95, l));
        vec2 mp = vec2(.6, .25);
        float illum = (1. - cos(ph * 6.2831853)) * .5;
        vec2 q = (st - mp) / .075;
        float md = length(q);
        o += vec3(.7, .76, .95) * (.05 + illum * .22) * exp(-md * .9);
        if (md < 1.05) {
          float z = sqrt(max(0., 1. - dot(q, q))), th = ph * 6.2831853;
          float lit = smoothstep(-.06, .08, dot(vec3(q.x, -q.y, z), vec3(sin(th), 0., -cos(th))));
          float mt = .94 + .06 * noise(q * 2.4 + 7.);
          o = mix(o, mix(o * .8 + vec3(.04, .05, .12), vec3(.97, .96, .9) * mt, lit), smoothstep(1.02, .96, md));
        }
        if (d > 0.) {
          float wdt = .012 + d * .2, path = exp(-pow((st.x - mp.x) / wdt, 2.));
          // glints are wider than tall, and grow toward the viewer, like a real moon path
          float g = smoothstep(.5, .82, noise(vec2(st.x * 26. / (d * 2.4 + .3), 7. / (d + .03) - t * 1.4)));
          // Only open water shines: the island and the boat (the dark pixels of the photo) stay dark,
          // and the path begins just below the island's waterline.
          float water = smoothstep(.36, .52, l) * smoothstep(.0, .022, d);
          o += vec3(.86, .89, .97) * path * (.05 + g * 1.1) * illum * .55 * water;
        }
        o *= 1. - .25 * pow(length(uv - .5) * 1.3, 2.);
        gl_FragColor = vec4(o, 1.);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 a;varying vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { box.classList.add('no-gl'); return null; }
    gl.useProgram(prog);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = { t: gl.getUniformLocation(prog, 't'), ph: gl.getUniformLocation(prog, 'ph') };
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let ready = false, visible = false, phase = moonNow.phase, target = .5, from = phase, t0 = 0, dur = 2600;
    const img = new Image();
    img.onload = () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); ready = true; if (visible) requestAnimationFrame(loop); };
    img.src = 'media/yumurta.jpg';
    const size = () => { const s = Math.min(2, devicePixelRatio || 1); cv.width = cv.clientWidth * s; cv.height = cv.clientHeight * s; gl.viewport(0, 0, cv.width, cv.height); };
    addEventListener('resize', size); size();
    // Seen for the first time, tonight's moon grows to the concert's full moon.
    let shown = false;
    new IntersectionObserver(e => {
      visible = e[0].isIntersecting;
      if (visible && !shown) { shown = true; api.to(.5); }
      if (visible) { size(); requestAnimationFrame(loop); }
    }).observe(box);
    function loop(now) {
      if (!visible || !ready) return;
      if (t0) { const k = Math.min(1, (now - t0) / dur); phase = from + (target - from) * (k * k * (3 - 2 * k)); if (k >= 1) t0 = 0; }
      gl.uniform1f(U.t, now / 1000); gl.uniform1f(U.ph, phase);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(loop);
    }
    const api = { to(p) { from = phase; target = p; t0 = performance.now(); } };
    return api;
  }

  // ── The rose that opens with Rain Radio's music ──
  (function rose() {
    const svg = w('rose').querySelector('svg');
    const RINGS = [{ n: 8, r: 92, wd: 34 }, { n: 7, r: 74, wd: 30 }, { n: 6, r: 56, wd: 26 }, { n: 5, r: 40, wd: 21 }, { n: 4, r: 26, wd: 16 }];
    const petal = (l, wd) => `M0,0 C${-wd},${-l * .28} ${-wd * .92},${-l * .96} 0,${-l} C${wd * .92},${-l * .96} ${wd},${-l * .28} 0,0Z`;
    let s = `<defs>
      <radialGradient id="rp" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(100)"><stop offset="0" stop-color="#d9708c"/><stop offset=".45" stop-color="#eaa2b4"/><stop offset="1" stop-color="#fbe4ea"/></radialGradient>
      <linearGradient id="rl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7f9b78"/><stop offset="1" stop-color="#b2c7a6"/></linearGradient></defs>`;
    // five pointed leaves tucked behind the flower, each with a midrib
    for (let i = 0; i < 5; i++) {
      const a = i * 72 + 36;
      s += `<g transform="rotate(${a})" opacity=".85"><path d="M0,-30 C20,-50 22,-88 0,-112 C-22,-88 -20,-50 0,-30Z" fill="url(#rl)"/><path d="M0,-34 L0,-104" stroke="#5e7a59" stroke-width=".8" opacity=".6"/></g>`;
    }
    RINGS.forEach((g, i) => {
      for (let j = 0; j < g.n; j++) s += `<path class="petal" data-ring="${i}" data-j="${j}" d="${petal(g.r, g.wd)}" fill="url(#rp)" stroke="#c79f63" stroke-width=".7" stroke-opacity=".8"/>`;
    });
    s += `<circle r="9" fill="#cf6683" stroke="#c79f63" stroke-width=".7"/><path d="M-5,0 A5,5 0 1 1 5,0 A3,3 0 1 1 -1,0" fill="none" stroke="#a84e68" stroke-width="1"/>`;
    svg.innerHTML = s;
    const petals = [...svg.querySelectorAll('.petal')];
    let open = .2;
    const bloom = o => {
      open = o;
      petals.forEach(p => {
        const i = +p.dataset.ring, j = +p.dataset.j, g = RINGS[i];
        const twist = (1 - o) * (40 + i * 14);
        const rot = j * 360 / g.n + i * 23 + twist;
        const sc = (.45 + .55 * o) * (1 - i * .02 * (1 - o)) + (i === 4 ? .15 * (1 - o) : 0);
        p.setAttribute('transform', `rotate(${rot.toFixed(1)}) scale(${sc.toFixed(3)})`);
      });
    };
    bloom(.2);
    let seen = false, since = null;
    new IntersectionObserver(e => { if (e[0].isIntersecting) seen = true; }).observe(w('rose'));
    setInterval(() => {
      const playing = RH.radio.wantPlay && RH.radio.station === 'rain';
      if (playing && !since) since = Date.now();
      if (!playing) since = null;
      const target = playing ? Math.min(1, .45 + (Date.now() - since) / 60000 * .6) : (seen ? .42 : .25);
      if (Math.abs(target - open) > .003) bloom(open + (target - open) * .3);
    }, 1200);
  })();

  // ── Today in Monte Verde, from Open-Meteo ──
  (async function weather() {
    const el = w('weather');
    const WORDS = { 0: 'clear sky', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast', 45: 'fog', 48: 'fog', 51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle',
      61: 'light rain', 63: 'rain', 65: 'heavy rain', 80: 'rain showers', 81: 'rain showers', 82: 'heavy showers', 95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm' };
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.30&longitude=-84.82&current=temperature_2m,weather_code,cloud_cover&daily=precipitation_sum&forecast_days=1&timezone=auto');
      if (!r.ok) return;
      const j = await r.json(), c = j.current;
      const rain = j.daily && j.daily.precipitation_sum ? j.daily.precipitation_sum[0] : null;
      el.textContent = `${dateLong(new Date())}. In Monte Verde now: ${WORDS[c.weather_code] || 'changing skies'}, ${Math.round(c.temperature_2m)} °C, clouds ${c.cloud_cover}%${rain != null ? `, ${rain} mm of rain expected today` : ''}.`;
    } catch (e) { /* the date alone is enough */ }
  })();

  // ── Forms: contact, photos and subscribe go to the site's own form service (api/form.php, which mails through
  //    AhaSend). Protected by reCAPTCHA v3, loaded only once someone starts a form. Where there is no form service
  //    (the preview), or the network fails, they hand over to the visitor's email app instead. ──
  const MAIL = 'info@radyoharmoni.org';
  const ENDPOINT = 'api/form.php';
  const SITE_KEY = '6LeQlGYsAAAAAB53X7mvV4EXw0qC6DFCSr-fuZ9S';
  const PROD = /(^|\.)radyoharmoni\.org$/.test(location.hostname);
  const THANKS = {
    contact: 'Thank you. Your message is on its way to us.',
    photo: 'Thank you. We will look at your photos with care.',
    subscribe: 'Thank you. You are on the list.'
  };
  let captcha = null;
  const loadCaptcha = () => {
    if (!PROD) return Promise.resolve(null);
    if (!captcha) captcha = new Promise(res => {
      const sc = document.createElement('script');
      sc.src = 'https://www.google.com/recaptcha/api.js?render=' + SITE_KEY;
      sc.onload = () => window.grecaptcha.ready(() => res(window.grecaptcha));
      sc.onerror = () => res(null);
      document.head.appendChild(sc);
    });
    return captcha;
  };
  const asMail = (type, d) => {
    const subject = { contact: 'Contact from radyoharmoni.org', photo: 'Photo for Radyo Harmoni', subscribe: 'Subscribe to Radyo Harmoni' }[type];
    const body = type === 'subscribe' ? `Please add ${d.email} to the Radyo Harmoni mailing list.`
      : [`Name: ${[d.first_name || d.name, d.last_name].filter(Boolean).join(' ')}`, `Email: ${d.email}`, d.place && `Place: ${d.place}`, d.link && `Photos: ${d.link}`,
         type === 'contact' && `Wants updates: ${d.optin ? 'yes' : 'no'}`, '', d.message || ''].filter(x => x !== false && x !== undefined && x !== null).join('\n');
    return `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  function wireForm(form, type) {
    const started = Date.now();
    form.addEventListener('focusin', () => loadCaptcha(), { once: true });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('[data-status]'), btn = form.querySelector('[type="submit"]');
      const d = Object.fromEntries(new FormData(form));
      d.optin = !!(form.elements.optin && form.elements.optin.checked);
      d.type = type; d.started = started;
      btn.disabled = true; status.textContent = 'Sending…';
      try {
        const g = await loadCaptcha();
        if (g) d.token = await g.execute(SITE_KEY, { action: type });
        const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        if (!(r.headers.get('content-type') || '').includes('json')) throw new Error('no form service');
        const j = await r.json();
        if (j.ok) {
          form.innerHTML = `<p class="thanks">${THANKS[type]}</p>`;
          document.dispatchEvent(new CustomEvent('rh:form', { detail: type }));
        } else {
          status.textContent = j.error || 'Something went wrong. Please try again.';
          btn.disabled = false;
        }
      } catch (err) {
        status.textContent = 'Opening your email app…';
        btn.disabled = false;
        location.href = asMail(type, d);
      }
    });
  }
  wireForm(w('share'), 'photo');
  wireForm(w('contact'), 'contact');
  wireForm(w('subscribe'), 'subscribe');
  // The two buttons open one form at a time
  const pairs = [[w('share-open'), w('share')], [w('contact-open'), w('contact')]];
  pairs.forEach(([btn, form]) => btn.addEventListener('click', () => {
    const open = form.hidden;
    pairs.forEach(([b2, f2]) => { f2.hidden = true; b2.setAttribute('aria-expanded', 'false'); });
    form.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    if (open) { form.querySelector('input').focus(); loadCaptcha(); }
  }));
})();
