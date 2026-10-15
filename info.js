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
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <div class="side"><p class="kick">Research</p><h2>What listeners notice</h2></div>
      <div class="body">
        <div class="voices">
          <blockquote>I felt deep pulses of blissful energy throughout my body, and behind it all was pure, unmovable silence, eternity.<cite>S.W., Thailand</cite></blockquote>
          <blockquote>A tree blooms for the first time in ten years; workers on site are calmer, clients are happy.<cite>B.C., landscape architect, Türkiye</cite></blockquote>
        </div>
        <div class="sub">
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
            <svg class="flat-moon" viewBox="0 0 100 100" aria-hidden="true"><circle class="mglow" cx="60" cy="25" r="16" fill="url(#mGlow)"/><circle cx="60" cy="25" r="7.5" fill="#33428a" fill-opacity=".55"/><path class="mlit" fill="#f4f1e6"/><defs><radialGradient id="mGlow"><stop offset="0" stop-color="#c8d2f2" stop-opacity=".5"/><stop offset="1" stop-color="#c8d2f2" stop-opacity="0"/></radialGradient></defs></svg>
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
      <h2>The sky keeps Nature’s time</h2>
      <div class="body">
        <p>Gandharva Veda brings harmony, and Rain Radio plays ragas for balance in nature. The sky over Monte Verde changes with it.</p>
        <div class="skies" data-w="skies" role="group" aria-label="Sky over Monte Verde"></div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>How it is played</h2>
      <div class="body">
        <div class="circle-row">
          <div class="porthole speaker" data-w="speaker"><svg viewBox="-150 -150 300 300" aria-hidden="true"></svg></div>
          <article class="how"><h3>For nature</h3><p>Connect a speaker and place it outdoors, and let it play softly, continuously.</p></article>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Ancient as time</h2>
      <div class="body">
        <blockquote class="q"><span class="q-short">“Gandharva music is that melody from which all the melodies have sprung … the eternal music of nature.”</span><span class="q-full" hidden>“Gandharva music is that melody from which all the melodies have sprung. When we say Indian classical music or Western modern music, these are different aspects of Gandharva music, the eternal music of nature. All languages and melodies spring from the infinite order that is maintained in nature in its different rhythms, harmonies, and frequencies.”</span><cite>Maharishi Mahesh Yogi</cite></blockquote>
        <button class="more-q" type="button" aria-expanded="false">Read the full quote</button>
        <span class="nowline" data-w="nowline" data-word="sky" style="margin-top:22px"></span>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <div class="side"><p class="kick">Research</p><h2>Why it is played</h2></div>
      <div class="body">
        <blockquote class="q">“Those who listen to it, they’ll have the direct effect of it. But even those who do not listen, the quality of the environment, the quality of the ecology rises in the character of harmony. Harmony. Integration, and that neutralizes negative trends and tendencies in the world.”<cite>Maharishi Mahesh Yogi</cite></blockquote>
        <div class="sub">
          <p>Mustard and fenugreek plants that heard Raga Bhairav in the morning and Raga Yaman Kalyan in the evening germinated and grew better than plants without music, with more chlorophyll, less of the stress marker hydrogen peroxide, and stronger protective enzymes.</p>
          <p class="ref">Vir, Chauhan, Kumar, Saini &amp; Saini (2026), Impact of Indian classical raga on plant growth and biochemical parameters in Rai and Methi. <i>International Journal of Applied Research</i> 12(5), 281–288. <a href="https://doi.org/10.22271/allresearch.2026.v12.i5c.13644">Read the paper</a></p>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <div class="side"><p class="kick">Research</p><h2>What farmers notice</h2></div>
      <div class="body carousel">
        <div class="reel-wrap at-start">
          <div class="reel" data-w="reel" tabindex="0" aria-label="Farmer testimony videos">
            ${FILMS.map((f, i) => `<figure><div class="film"><video src="${VID}${f}.mp4" poster="${VID}${f}.jpg" controls playsinline preload="none" aria-label="Farmer testimony ${i + 1}"><track kind="captions" srclang="en" label="English" src="${VID}${f}.vtt" default></video><p class="cue" aria-hidden="true"></p></div></figure>`).join('')}
          </div>
          <button class="reel-edge prev" data-dir="-1" tabindex="-1" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3 5 8l5 5"/></svg></button>
          <button class="reel-edge next" data-dir="1" tabindex="-1" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 3 5 5-5 5"/></svg></button>
        </div>
        <div class="reel-nav">
          <button data-dir="-1" aria-label="Previous video"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3 5 8l5 5"/></svg></button>
          <button data-dir="1" aria-label="Next video"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 3 5 5-5 5"/></svg></button>
        </div>
        <div class="invite">
          <p>Do you play Rain Radio for your fields, your garden or your animals? Share your story on video, and it may be shown here.</p>
          <button class="btn" data-w="video-open" aria-expanded="false" aria-controls="videoForm">Share your video</button>
        </div>
        <form class="form" id="videoForm" data-w="video" hidden>
          <label>Your name<input name="name" autocomplete="name" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label>Where do you play it? (farm, garden, orchard, town)<input name="place"></label>
          <label>Link to your video (Google Drive, Dropbox, YouTube…)<input name="link" type="url" placeholder="https://"></label>
          <label>What did you notice?<textarea name="message"></textarea></label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p><button class="btn" type="submit">Send</button></p>
          <p class="note" data-status aria-live="polite"></p>
        </form>
        <div class="sub">
          <p>In a 60-day study with sixty dairy cows, the cows that heard music gave significantly more milk each day than cows without it, and those that heard raga music showed lower levels of the stress hormone cortisol.</p>
          <p class="ref">Cao, Zhao, Feng et al. (2025), Effects of Raga music and Chinese five-element music on milk production, antioxidant, neuroendocrine, immune, and welfare indicators in dairy cows. <i>Frontiers in Veterinary Science</i> 12, 1623026. <a href="https://doi.org/10.3389/fvets.2025.1623026">Read the paper</a></p>
        </div>
      </div>
    </div></section>


    <section class="row moonsec"><div class="cols">
      <h2>Blooming gardens</h2>
      <div class="body">
        <p>In a study of thirty rose plants, the roses that heard a raga each morning bore more flowers, and larger ones, than roses kept in silence or played rock music. The roses that heard Vedic chanting flowered most of all. Play Rain Radio and the rose here opens with the music.</p>
        <div class="circle-row wide">
          <div class="porthole rose" data-w="rose"><svg viewBox="-150 -150 300 300" aria-hidden="true"></svg></div>
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
        </form>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>Stay in tune</h2>
      <div class="body">
        <p>New ragas, the live full moon concerts and photographs from listeners, a few times a year.</p>
        <form class="inline-form" data-w="subscribe"><input name="email" type="email" placeholder="Your email" aria-label="Your email" autocomplete="email" required><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">Subscribe</button><p class="note" data-status aria-live="polite"></p></form>
      </div>
    </div></section>`;

  // ── Footer: About Radyo Harmoni and About Maharishi Gandharva Veda (both fold open), affiliates, the legal lines ──
  const ABOUT = `
    <details class="about about-mgv">
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
        <details class="about about-rh">
          <summary>About Radyo Harmoni</summary>
          <div class="about-body"><p>RadyoHarmoni is a free online radio station, streaming Gandharva Veda melodies non-stop, 24/7. We recommend playing the music continuously, to create an aura of peace and harmony in your surroundings.</p></div>
        </details>
        <div class="foot-col friends">
          <h3 class="foot-h">Affiliates of Radyo Harmoni</h3>
          <p><a href="https://tm-women.org/">TM-women.org</a><a href="https://apps.apple.com/app/id977489377">Veda App</a></p>
        </div>
        ${ABOUT}
      </div>
      <div class="legal">
        <p>Music Copyright © 2026, Maharishi Vedic University Ltd. and Maharishi Foundation Ltd. All rights reserved worldwide.</p>
        <p>Transcendental Meditation, TM-Sidhi, Maharishi, Maharishi Vedic, Vedic Science, Maharishi International University, Maharishi Vāstu, Maharishi Gandharva Veda, Fortune-Creating, Maharishi Sthāpatya Veda, Maharishi AyurVeda, and other terms used on this website are subject to trademark protection in many countries worldwide, including the United States, and are used with permission.</p>
        <p>This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
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

  // A long quote shown short, with a button for the whole of it
  document.querySelectorAll('.more-q').forEach(b => b.addEventListener('click', () => {
    const q = b.previousElementSibling, open = b.getAttribute('aria-expanded') !== 'true';
    q.querySelector('.q-short').hidden = open;
    q.querySelector('.q-full').hidden = !open;
    b.setAttribute('aria-expanded', open);
    b.textContent = open ? 'Show less' : 'Read the full quote';
  }));

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
  skies.innerHTML = RH.SKIES.map(([m, name, sw]) => `<button data-sky-pick="${m}" aria-pressed="${m === RH.sky}"><i style="background:${sw}"></i><b>${name}</b><small>${{ day: 'clear light', sun: 'through the clouds', rain: 'with its sound', rainbow: 'after the rain', night: 'night blue' }[m]}</small></button>`).join('');
  skies.querySelectorAll('[data-sky-pick]').forEach(b => b.addEventListener('click', () => {
    RH.setSky(b.dataset.skyPick);
    if (scrollY > innerHeight * .4) scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  document.addEventListener('rh:sky', e => skies.querySelectorAll('[data-sky-pick]').forEach(b => b.setAttribute('aria-pressed', b.dataset.skyPick === e.detail)));

  // ── Farmers' films: one plays at a time ──
  const reel = w('reel');
  // Captions in the site's own type over the film; the browser's own captions only in full screen
  reel.querySelectorAll('video').forEach(v => {
    const cue = v.parentElement.querySelector('.cue');
    const track = v.textTracks && v.textTracks[0];
    if (!track) return;
    const inFull = () => document.fullscreenElement === v || document.webkitFullscreenElement === v || v.webkitDisplayingFullscreen;
    const setMode = () => { track.mode = inFull() ? 'showing' : 'hidden'; };
    setMode();
    track.addEventListener('cuechange', () => {
      const c = track.activeCues && track.activeCues[0];
      if (c) cue.textContent = c.text;
      cue.classList.toggle('on', !!c && !inFull());
    });
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, setMode));
    v.addEventListener('webkitbeginfullscreen', () => { track.mode = 'showing'; });
    v.addEventListener('webkitendfullscreen', () => { track.mode = 'hidden'; });
  });
  reel.querySelectorAll('video').forEach(v => {
    v.addEventListener('play', () => { reel.querySelectorAll('video').forEach(o => { if (o !== v) o.pause(); }); v.parentElement.classList.add('playing'); });
    v.addEventListener('pause', () => v.parentElement.classList.remove('playing'));
  });
  // Arrows over the films' edges, shown on hover with a mouse, each hidden at its end of the row
  const reelWrap = reel.parentElement;
  const ends = () => {
    reelWrap.classList.toggle('at-start', reel.scrollLeft < 8);
    reelWrap.classList.toggle('at-end', reel.scrollLeft + reel.clientWidth > reel.scrollWidth - 8);
  };
  reel.addEventListener('scroll', ends, { passive: true }); addEventListener('resize', ends); ends();
  document.querySelectorAll('.reel-nav button, .reel-edge').forEach(b => b.addEventListener('click', () => {
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
  // The moon is painted by WebGL; a drawn moon over the photo stands in where WebGL is missing or lost, so the
  // buttons always change something.
  const flat = flatMoon(moonBox);
  const yumurta = islandMoon(moonBox);
  const moonTo = p => { flat.to(p); if (yumurta) yumurta.to(p); };
  // Seen for the first time, tonight's moon grows to the concert's full moon.
  new IntersectionObserver((e, ob) => { if (e[0].isIntersecting) { ob.disconnect(); if (document.querySelector('.moonsel [data-m="full"]').getAttribute('aria-pressed') === 'true') moonTo(.5); } }).observe(moonBox);
  document.querySelectorAll('.moonsel button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.moonsel button').forEach(x => x.setAttribute('aria-pressed', x === b));
    moonTo(b.dataset.m === 'full' ? .5 : moonNow.phase);
  }));

  function flatMoon(box) {
    const lit = box.querySelector('.mlit'), glow = box.querySelector('.mglow'), R = 7.5;
    let phase = moonNow.phase, from = phase, target = phase, t0 = 0;
    // The lit part: the limb on the sunward side, closed by the terminator, an ellipse as wide as |cos| of the phase
    const draw = () => {
      const c = Math.cos(phase * 2 * Math.PI), waxing = phase % 1 < .5, rx = Math.abs(c) * R;
      lit.setAttribute('d', `M60,${25 - R} A${R},${R} 0 0 ${waxing ? 1 : 0} 60,${25 + R} A${rx.toFixed(2)},${R} 0 0 ${waxing === c > 0 ? 0 : 1} 60,${25 - R}Z`);
      glow.style.opacity = (.25 + .75 * (1 - c) / 2).toFixed(2);
    };
    const step = now => {
      const k = Math.min(1, (now - t0) / 2600);
      phase = from + (target - from) * (k * k * (3 - 2 * k)); draw();
      if (k < 1) requestAnimationFrame(step);
    };
    draw();
    return { to(p) { from = phase; target = p; t0 = performance.now(); requestAnimationFrame(step); } };
  }

  function islandMoon(box) {
    const cv = box.querySelector('canvas');
    const gl = cv.getContext('webgl', { powerPreference: 'low-power' });
    if (!gl) { box.classList.add('no-gl'); return null; }
    const FS = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
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
    // Phones drop WebGL contexts under memory pressure: then the drawn moon takes over
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); ready = false; box.classList.add('no-gl'); });
    new IntersectionObserver(e => {
      visible = e[0].isIntersecting;
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

  // ── Blooming gardens: a rose branch drawn like an old botanical plate. The branch draws itself in when first seen,
  //    the rose opens while Rain Radio plays, and a hummingbird comes to it once it is open. ──
  (function garden() {
    const box = w('rose'), svg = box.querySelector('svg');
    const R = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(11);
    const f = n => n.toFixed(1);
    const INK = 'stroke="#3b2f22" stroke-opacity=".5" stroke-width=".6" stroke-linejoin="round"';

    // A serrated, pointed leaflet with its midrib and veins, base at (0,0), pointing up.
    function leaflet(len, wid) {
      const pts = [], teeth = 9;
      for (const side of [1, -1]) {
        const row = [];
        for (let i = 0; i <= 36; i++) {
          const t = i / 36, fr = (t * teeth) % 1;
          const saw = (fr < .7 ? fr / .7 : (1 - fr) / .3) * .09 * Math.sin(Math.PI * t);
          const half = wid * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.02)), .75) * (1 - .18 * t);
          row.push([side * half * (1 + saw), -len * t]);
        }
        pts.push(side > 0 ? row : row.reverse());
      }
      const all = pts[0].concat(pts[1]);
      let d = 'M0,0 ' + all.map(p => 'L' + f(p[0]) + ',' + f(p[1])).join(' ') + 'Z';
      let veins = `M0,0 L0,${f(-len * .97)}`;
      for (let i = 1; i <= 5; i++) {
        const y = -len * i / 6.5, x = wid * .78 * Math.sin(Math.PI * i / 6.5);
        veins += ` M0,${f(y)} Q${f(x * .5)},${f(y - len * .03)} ${f(x)},${f(y - len * .1)} M0,${f(y)} Q${f(-x * .5)},${f(y - len * .03)} ${f(-x)},${f(y - len * .1)}`;
      }
      return `<path d="${d}" fill="url(#gLeaf)" ${INK}/><path d="${veins}" fill="none" stroke="#2f4a2a" stroke-opacity=".35" stroke-width=".5"/>`
        + `<path d="M0,0 ${all.slice(0, 18).map(p => 'L' + f(p[0] * .55) + ',' + f(p[1])).join(' ')}" fill="none" stroke="#e7f0c8" stroke-opacity=".35" stroke-width=".6"/>`;
    }
    // A rose leaf: a stalk with a terminal leaflet and two pairs.
    function leaf(x, y, ang, size, i) {
      const L = 46 * size;
      let g = `<g class="leaf" style="--d:${(.9 + i * .18).toFixed(2)}s" transform="translate(${f(x)},${f(y)}) rotate(${f(ang)})">`;
      g += `<path d="M0,0 L0,${f(-L)}" stroke="#5b6b2e" stroke-width="1.1" ${'stroke-linecap="round"'}/>`;
      g += `<g transform="translate(0,${f(-L)})">${leaflet(24 * size, 10 * size)}</g>`;
      for (const [t, s] of [[.38, .82], [.72, .92]]) for (const side of [-1, 1])
        g += `<g transform="translate(0,${f(-L * t)}) rotate(${side * 58})">${leaflet(20 * size * s, 8.5 * size * s)}</g>`;
      return g + '</g>';
    }
    // A petal, broad with a soft notch at the rim, base at (0,0).
    const petal = (l, wd) => `M0,0 C${f(wd * .95)},${f(-l * .12)} ${f(wd * 1.12)},${f(-l * .74)} ${f(wd * .42)},${f(-l * .97)} Q${f(wd * .16)},${f(-l * 1.04)} 0,${f(-l * .95)} Q${f(-wd * .16)},${f(-l * 1.04)} ${f(-wd * .42)},${f(-l * .97)} C${f(-wd * 1.12)},${f(-l * .74)} ${f(-wd * .95)},${f(-l * .12)} 0,0Z`;
    const RINGS = [{ n: 6, l: 46, w: 30, a: 0 }, { n: 6, l: 39, w: 26, a: 30 }, { n: 5, l: 31, w: 21, a: 12 }, { n: 5, l: 23, w: 16, a: 48 }, { n: 4, l: 15, w: 11, a: 20 }];

    let s = `<defs>
      <radialGradient id="gPaper" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#fbf6ea"/><stop offset=".75" stop-color="#f3ead8"/><stop offset="1" stop-color="#e9dcc3"/></radialGradient>
      <linearGradient id="gLeaf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#4f6f37"/><stop offset=".55" stop-color="#6f8f45"/><stop offset="1" stop-color="#9db265"/></linearGradient>
      <linearGradient id="gStem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5d4a2c"/><stop offset=".5" stop-color="#8a6c3e"/><stop offset="1" stop-color="#5d4a2c"/></linearGradient>
      <radialGradient id="gPetal" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(52)"><stop offset="0" stop-color="#9c3355"/><stop offset=".38" stop-color="#cf6487"/><stop offset=".8" stop-color="#eba9bd"/><stop offset="1" stop-color="#f8dbe3"/></radialGradient>
      <radialGradient id="gBud" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#e58aa6"/><stop offset="1" stop-color="#a83a5e"/></radialGradient>
      <linearGradient id="gBird" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6e5aa8"/><stop offset=".45" stop-color="#3d7a62"/><stop offset="1" stop-color="#2c4a3c"/></linearGradient>
      <filter id="fGrain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .3  0 0 0 .07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <radialGradient id="gVeil" cx=".55" cy=".4" r=".62"><stop offset="0" stop-color="#fbf6ea" stop-opacity=".34"/><stop offset=".7" stop-color="#f3ead8" stop-opacity=".12"/><stop offset="1" stop-color="#5f7d4a" stop-opacity=".22"/></radialGradient>
      <clipPath id="cRound"><circle r="150"/></clipPath>
    </defs>
    <g clip-path="url(#cRound)">
    <circle r="150" fill="url(#gPaper)"/><image href="media/garden-rose.jpg" x="-150" y="-150" width="300" height="300" preserveAspectRatio="xMidYMid slice"/>
    <circle r="150" fill="url(#gVeil)"/><circle r="150" fill="#000" filter="url(#fGrain)"/>
    <g class="branch">`;
    // Stem and side shoots, drawn in on first sight
    const stem = 'M-118,138 C-92,92 -70,58 -46,30 C-22,2 -6,-14 14,-34 C26,-46 34,-56 40,-66';
    const shoot1 = 'M-64,52 C-84,30 -98,8 -104,-22';
    const shoot2 = 'M-14,-6 C10,-2 38,8 66,6';
    s += [stem, shoot1, shoot2].map((d, i) => `<path class="stem" pathLength="1" d="${d}" fill="none" stroke="url(#gStem)" stroke-width="${[4.2, 2.6, 2.4][i]}" stroke-linecap="round" style="--d:${(i * .35).toFixed(2)}s"/>`).join('');
    // Thorns along the stem
    for (const [x, y, a] of [[-96, 98, -30], [-78, 70, 140], [-56, 42, -40], [-30, 14, 150], [-2, -20, -35], [24, -44, 150]])
      s += `<path class="thorn" d="M0,0 L2.4,-1.4 L0,-6.5 L-2.4,-1.4Z" transform="translate(${x},${y}) rotate(${a})" fill="#7a4e30" ${INK}/>`;
    // Leaves
    [[-82, 80, -58, 1.05], [-58, 46, 62, .95], [-96, -6, -40, .8], [-30, 12, -64, .9], [8, -26, 70, .82], [44, 7, 98, .78]].forEach((l, i) => { s += leaf(l[0], l[1], l[2], l[3], i); });
    // Two buds on the side shoots
    const bud = (x, y, ang, sc, d) => `<g class="bud" style="--d:${d}s" transform="translate(${x},${y}) rotate(${ang}) scale(${sc})">
        <path d="M0,0 C5,-4 7,-12 0,-22 C-7,-12 -5,-4 0,0Z" fill="url(#gBud)" ${INK}/>
        <path d="M0,-1 C6,-6 9,-12 6,-19 M0,-1 C-6,-6 -9,-12 -6,-19 M0,-1 C3,-8 2,-14 0,-17" fill="none" stroke="#5c7a3a" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M0,0 C-3,3 -3,6 0,8 C3,6 3,3 0,0Z" fill="#6f8f45" ${INK}/></g>`;
    s += bud(-104, -24, -12, 1.15, 2.4) + bud(66, 5, 78, 1.0, 2.7);
    // The rose: sepals, then rings of petals from the outside in, then the tight heart
    s += `<g class="rose-head" transform="translate(40,-68)"><g class="bloom">`;
    for (let i = 0; i < 5; i++) s += `<path class="sepal" d="M0,0 C6,-8 6,-22 1,-31 C0,-33 -1,-33 -1,-31 C-6,-22 -6,-8 0,0Z" transform="rotate(${i * 72 + 18})" fill="#5f7d3b" ${INK}/>`;
    RINGS.forEach((g, ri) => {
      for (let j = 0; j < g.n; j++) {
        s += `<path class="petal" data-r="${ri}" data-j="${j}" d="${petal(g.l, g.w)}" fill="url(#gPetal)" stroke="#8a2f4f" stroke-opacity=".45" stroke-width=".6"/>`;
      }
    });
    s += `<g class="heart"><path d="M-6,2 C-8,-6 -2,-11 4,-8 C9,-5 7,2 2,4 C-2,5 -4,1 -1,-2" fill="none" stroke="#7d2444" stroke-width="1.3" stroke-linecap="round"/><circle r="4.6" fill="#a43a5f" fill-opacity=".55"/></g>`;
    s += `</g></g></g>`;
    // A hummingbird, after the reel: iridescent green and violet, long bill, violet tail tips
    s += `<g class="bird"><g class="bird-hover"><g transform="scale(-1 1) rotate(-16)">
        <g class="wing w2"><path d="M8,-4 C4,-20 -6,-34 -20,-42 C-12,-28 -2,-14 4,-1Z" fill="#9aa7a0" fill-opacity=".55" ${INK}/></g>
        <path d="M0,3 C-8,6 -15,11 -21,17 C-17,10 -10,4 -1,0Z" fill="#4c3f7a" ${INK}/>
        <path d="M0,1 C-9,2 -17,4 -25,7 C-17,0 -9,-2 0,-1Z" fill="#6a52a8" ${INK}/>
        <path d="M-2,0 C4,-8 16,-8 22,-2 C26,2 22,10 12,12 C4,13 -4,8 -2,0Z" fill="url(#gBird)" ${INK}/>
        <path d="M18,-4 C22,-8 28,-7 29,-2 C29,2 25,4 21,3Z" fill="#3d7a62" ${INK}/>
        <path d="M28,-3 L52,-6" stroke="#2a221a" stroke-width="1.3" stroke-linecap="round"/>
        <circle cx="25" cy="-3" r=".9" fill="#1a1410"/>
        <path d="M18,-1 C21,1 24,1 27,0" stroke="#d84a8a" stroke-width="1.6" fill="none"/>
        <g class="wing w1"><path d="M10,-4 C8,-24 -2,-40 -16,-48 C-8,-32 2,-16 6,-1Z" fill="#c5d0c8" fill-opacity=".6" ${INK}/></g>
      </g></g></g>`;
    s += `</g>`;
    svg.setAttribute('viewBox', '-150 -150 300 300');
    svg.innerHTML = s;

    const petals = [...svg.querySelectorAll('.petal')];
    let open = .18;
    const bloom = o => {
      open = o;
      petals.forEach(p => {
        const ri = +p.dataset.r, j = +p.dataset.j, g = RINGS[ri];
        const twist = (1 - o) * (55 + ri * 18);
        const rot = j * 360 / g.n + g.a + twist;
        const sc = (.32 + .68 * o) * (1 - ri * .03 * (1 - o)) + (ri >= 3 ? .18 * (1 - o) : 0);
        p.setAttribute('transform', `rotate(${rot.toFixed(1)}) scale(${sc.toFixed(3)} ${(sc * (.82 + .18 * o)).toFixed(3)})`);
      });
      box.style.setProperty('--sepal', (1 - o * .7).toFixed(2));
      box.classList.toggle('bird-on', o > .62);
    };
    bloom(.18);
    // First sight: the branch draws itself in
    new IntersectionObserver((e, ob) => { if (e[0].isIntersecting) { box.classList.add('grown'); ob.disconnect(); } }, { threshold: .35 }).observe(box);
    let since = null;
    const pinned = new URLSearchParams(location.search).get('bloom');   // ?bloom=1 holds it open, for review
    if (pinned !== null) { box.classList.add('grown'); bloom(+pinned); }
    if (pinned === null) setInterval(() => {
      const playing = RH.radio.wantPlay && RH.radio.station === 'rain';
      if (playing && !since) since = Date.now();
      if (!playing) since = null;
      const target = playing ? Math.min(1, .5 + (Date.now() - since) / 60000 * .55) : (box.classList.contains('grown') ? .3 : .18);
      if (Math.abs(target - open) > .003) bloom(open + (target - open) * .3);
    }, 1000);
  })();

  // ── How it is played: a small wooden speaker in the grass of the Monte Verde hills, its sound going out over the
  //    valley. The waves and notes drift on their own; while Rain Radio plays the cone moves and the waves quicken. ──
  (function speaker() {
    const box = w('speaker'), svg = box.querySelector('svg');
    const INK = 'stroke="#3b2f22" stroke-opacity=".5" stroke-width=".7" stroke-linejoin="round"';
    let s = `<defs>
      <linearGradient id="sWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d6a062"/><stop offset=".6" stop-color="#c38a4e"/><stop offset="1" stop-color="#b07940"/></linearGradient>
      <linearGradient id="sSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a26b37"/><stop offset="1" stop-color="#8a582c"/></linearGradient>
      <radialGradient id="sCone" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#f6ecd6"/><stop offset=".7" stop-color="#e6d2a8"/><stop offset="1" stop-color="#cdb07c"/></radialGradient>
      <radialGradient id="sCap" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#e2b979"/><stop offset="1" stop-color="#a8733a"/></radialGradient>
      <radialGradient id="sVeil" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#fbf6ea" stop-opacity=".18"/><stop offset=".75" stop-color="#f3ead8" stop-opacity=".06"/><stop offset="1" stop-color="#4f6f3a" stop-opacity=".24"/></radialGradient>
      <filter id="sGrain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .3  0 0 0 .07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <clipPath id="sRound"><circle r="150"/></clipPath>
    </defs>
    <g clip-path="url(#sRound)">
    <circle r="150" fill="#cfdcb8"/><image href="media/garden-speaker.jpg" x="-150" y="-150" width="300" height="300" preserveAspectRatio="xMidYMid slice"/>
    <circle r="150" fill="url(#sVeil)"/><circle r="150" fill="#000" filter="url(#sGrain)"/>`;
    // The sound going out over the valley: arcs from the speaker's side, and a few notes rising
    const cx = -10, cy = 34;
    s += '<g class="waves">';
    [30, 52, 74, 96, 118].forEach((r, i) => {
      const a = 46 * Math.PI / 180, x1 = cx + r * Math.cos(-a), y1 = cy + r * Math.sin(-a), y2 = cy + r * Math.sin(a);
      s += `<path class="wave" style="--i:${i}" d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="#fffaf0" stroke-width="${(2.6 - i * .3).toFixed(1)}" stroke-linecap="round"/>`;
    });
    s += '</g>';
    const note = `<ellipse cx="0" cy="0" rx="4.4" ry="3.1" transform="rotate(-22)" fill="#b0702a" ${INK}/><path d="M3.7,-1.2 L3.7,-21 C6,-17 11,-15.5 10.5,-9.5 C10,-12.5 7.5,-14.5 3.7,-15" fill="#b0702a" ${INK}/>`;
    const pair = `<ellipse cx="0" cy="0" rx="4.2" ry="3" transform="rotate(-22)" fill="#9c3355" ${INK}/><ellipse cx="13" cy="-3" rx="4.2" ry="3" transform="translate(13,-3) rotate(-22) translate(-13,3)" fill="#9c3355" ${INK}/>
      <path d="M3.5,-1.2 L3.5,-20 L16.5,-23.5 L16.5,-4.2" fill="none" stroke="#9c3355" stroke-width="1.6"/><path d="M3.5,-20 L16.5,-23.5 L16.5,-20.5 L3.5,-17Z" fill="#9c3355" ${INK}/>`;
    [[30, -26, note, 0], [66, -62, pair, 1], [96, -8, note, 2]].forEach(([x, y, n, i]) => {
      s += `<g transform="translate(${x},${y})"><g class="note" style="--i:${i}">${n}</g></g>`;
    });
    // The speaker: a wooden box seen a little from the side, with a brass-rimmed tweeter and woofer
    s += `<ellipse cx="-40" cy="118" rx="120" ry="22" fill="#6f9a52" fill-opacity=".35"/><ellipse cx="-50" cy="102" rx="54" ry="8" fill="#2f4a26" fill-opacity=".26"/>
      <g class="box">
      <path d="M-92,-2 L-22,-2 L-8,-13 L-78,-13Z" fill="#dcae74" ${INK}/>
      <path d="M-22,-2 L-8,-13 L-8,87 L-22,98Z" fill="url(#sSide)" ${INK}/>
      <rect x="-92" y="-2" width="70" height="100" rx="2" fill="url(#sWood)" ${INK}/>
      <path d="M-88,8 C-80,30 -86,54 -82,92 M-30,4 C-26,34 -33,60 -28,94 M-72,4 C-70,14 -73,18 -71,24" fill="none" stroke="#8a582c" stroke-opacity=".28" stroke-width=".8"/>
      ${[[-86, 4], [-28, 4], [-86, 92], [-28, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#c9a25a" ${INK}/>`).join('')}
      <circle cx="-57" cy="22" r="10" fill="#c9a25a" ${INK}/><circle cx="-57" cy="22" r="6.5" fill="url(#sCone)" ${INK}/>
      <circle cx="-57" cy="64" r="26.5" fill="#c9a25a" ${INK}/><circle cx="-57" cy="64" r="23.5" fill="#e9dcc0" ${INK}/>
      <g class="cone"><circle cx="-57" cy="64" r="20" fill="url(#sCone)" ${INK}/>
        <circle cx="-57" cy="64" r="14.5" fill="none" stroke="#bfa06c" stroke-opacity=".5" stroke-width=".6"/>
        <circle cx="-57" cy="64" r="8" fill="url(#sCap)" ${INK}/></g>
      </g>`;
    // Grass and a few small flowers in front of the box
    const R = (seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647)(5);
    const greens = ['#5f8f45', '#77a253', '#8fb35f', '#4f7a3a'];
    s += '<g class="grass">';
    // a tuft, tallest at the box and thinning out at both ends, its foot lost in the photo's own grass
    for (let i = 0; i < 40; i++) {
      const t = i / 39, x = -132 + t * 196 + (R() - .5) * 5, fade = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), .7);
      const h = (8 + R() * 20) * (.25 + .75 * fade), lean = (R() - .4) * 12, wd = 1.8 + R() * 1.6, y0 = 114 + R() * 10;
      s += `<path d="M${(x - wd).toFixed(1)},${y0.toFixed(1)} Q${(x + lean * .4).toFixed(1)},${(y0 - 8 - h * .5).toFixed(1)} ${(x + lean).toFixed(1)},${(y0 - 4 - h).toFixed(1)} Q${(x + lean * .3 + wd * .4).toFixed(1)},${(y0 - 8 - h * .45).toFixed(1)} ${(x + wd).toFixed(1)},${y0.toFixed(1)}Z" fill="${greens[i % 4]}" fill-opacity="${(.55 + .45 * fade).toFixed(2)}" stroke="#2f4a2a" stroke-opacity="${(.12 + .23 * fade).toFixed(2)}" stroke-width=".5"/>`;
    }
    [[-104, 92, '#f6ecd6'], [-36, 96, '#f3d27a'], [8, 94, '#f6ecd6']].forEach(([x, y, c]) => {
      s += `<g transform="translate(${x},${y})"><path d="M0,0 L0,14" stroke="#5f8f45" stroke-width="1"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-3.2" rx="1.9" ry="3.2" transform="rotate(${a})" fill="${c}" ${INK}/>`).join('')}<circle r="1.6" fill="#c98b2a"/></g>`;
    });
    s += '</g></g>';
    svg.innerHTML = s;
    const sync = () => box.classList.toggle('playing', !!(RH.radio.wantPlay && RH.radio.station === 'rain'));
    RH.radio.on('state', sync); sync();
    new IntersectionObserver(e => box.classList.toggle('live', e[0].isIntersecting)).observe(box);
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
    video: 'Thank you. We look forward to watching your story.',
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
    const subject = { contact: 'Contact from radyoharmoni.org', photo: 'Photo for Radyo Harmoni', video: 'Video testimony for Radyo Harmoni', subscribe: 'Subscribe to Radyo Harmoni' }[type];
    const body = type === 'subscribe' ? `Please add ${d.email} to the Radyo Harmoni mailing list.`
      : [`Name: ${[d.first_name || d.name, d.last_name].filter(Boolean).join(' ')}`, `Email: ${d.email}`, d.place && `Place: ${d.place}`, d.link && `${type === 'video' ? 'Video' : 'Photos'}: ${d.link}`,
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
  wireForm(w('video'), 'video');
  // The two buttons open one form at a time
  const pairs = [[w('share-open'), w('share')], [w('contact-open'), w('contact')]];
  pairs.forEach(([btn, form]) => btn.addEventListener('click', () => {
    const open = form.hidden;
    pairs.forEach(([b2, f2]) => { f2.hidden = true; b2.setAttribute('aria-expanded', 'false'); });
    form.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    if (open) { form.querySelector('input').focus(); loadCaptcha(); }
  }));
  const videoBtn = w('video-open'), videoForm = w('video');
  videoBtn.addEventListener('click', () => {
    const open = videoForm.hidden;
    videoForm.hidden = !open; videoBtn.setAttribute('aria-expanded', String(open));
    if (open) { videoForm.querySelector('input').focus(); loadCaptcha(); }
  });
})();
