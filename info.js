/*
 * The info section under the player: one set for Peace Radio, one for Rain Radio (Info Section sheet, v2).
 * Both sets are built once; switching station shows the other. Needs app.js (window.RH) first.
 */
(function () {
  'use strict';
  const R = RadyoHarmoni, L = R.Light, RH = window.RH, T = window.RH_T, $ = s => document.querySelector(s);
  const VID = 'media/films/';
  const dateLong = d => T.date(d, { weekday: 'long', day: 'numeric', month: 'long' });
  const moonNow = R.moon();

  // ── Peace Radio ─────────────────────────────────────────────
  const PEACE = `
    <section class="row"><div class="cols">
      <h2>${T('peace.time.h2')}</h2>
      <div class="body">
        <p>${T('peace.time.p')}</p>
        <div class="dayband" data-w="dayband">
          <div class="ribbon" aria-hidden="true"><i class="mark"></i></div>
          <ol class="cells" aria-label="${T('peace.time.cells')}"></ol>
        </div>
        <p class="band-cap" data-w="band-cap" aria-live="polite"></p>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('peace.listen.h2')}</h2>
      <div class="body ways">
        <article><h3>${T('peace.listen.selfH')}</h3><p>${T('peace.listen.selfP')}</p></article>
        <article><h3>${T('peace.listen.aroundH')}</h3><p>${T('peace.listen.aroundP')}</p></article>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('peace.hours.h2')}</h2>
      <div class="body">
        <p>${T('peace.hours.p')}</p>
        <p class="nowline" data-w="nowline"></p>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('why.h2')}</h2>
      <div class="body">
        <blockquote class="q">${T('peace.why.quote')}<cite${T.langAttr('peace.why.cite')}>${T('peace.why.cite')}</cite></blockquote>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <div class="side"><p class="kick">${T('research')}</p><h2>${T('peace.voices.h2')}</h2></div>
      <div class="body">
        <div class="voices">
          <blockquote>${T('peace.voices.1')}<cite>${T('peace.voices.1.cite')}</cite></blockquote>
          <blockquote>${T('peace.voices.2')}<cite>${T('peace.voices.2.cite')}</cite></blockquote>
        </div>
        <div class="sub">
          <p>${T('peace.voices.research')}</p>
          <p class="ref">Travis, Morehead &amp; Parim (2023), <i>International Journal of Psychological Studies</i> 15(1), 8. <a href="https://doi.org/10.5539/ijps.v15n1p8">${T('readPaper')}</a></p>
        </div>
      </div>
    </div></section>

    <section class="row moonsec" id="concerts"><div class="cols">
      <h2>${T('peace.moon.h2')}</h2>
      <div class="body">
        <p>${T('peace.moon.p')}</p>
        <div class="circle-row">
          <div class="porthole" data-w="moon">
            <canvas aria-hidden="true"></canvas>
            <img class="flat" src="media/yumurta.jpg" alt="">
            <svg class="flat-moon" viewBox="0 0 100 100" aria-hidden="true"><circle class="mglow" cx="60" cy="25" r="16" fill="url(#mGlow)"/><circle cx="60" cy="25" r="7.5" fill="#33428a" fill-opacity=".55"/><path class="mlit" fill="#f4f1e6"/><defs><radialGradient id="mGlow"><stop offset="0" stop-color="#c8d2f2" stop-opacity=".5"/><stop offset="1" stop-color="#c8d2f2" stop-opacity="0"/></radialGradient></defs></svg>
          </div>
          <div>
            <p class="date" data-w="nextfull"></p>
            <p class="days" data-w="moondays"></p>
            <div class="moonsel" role="group" aria-label="${T('moon.shown')}">
              <button data-m="full" aria-pressed="true">${T('moon.concert')}</button>
              <button data-m="now" aria-pressed="false">${T('moon.tonight')}</button>
            </div>
            <a class="btn" href="https://artsforenlightenment.org/">${T('moon.register')}</a>
          </div>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('keep.h2')}</h2>
      <div class="body">
        <p>${T('keep.p')}</p>
        <p class="actions"><a class="btn" href="https://www.paypal.com/donate/?hosted_button_id=8PV97C4VSV5R8">${T('keep.donate')}</a><a class="btn ghost" href="https://artsforenlightenment.org/">${T('keep.academy')}</a></p>
      </div>
    </div></section>`;

  // ── Rain Radio ──────────────────────────────────────────────
  const FILMS = ['farmer-1', 'farmer-2', 'farmer-3', 'farmer-5'];
  const RAIN = `
    <section class="row"><div class="cols">
      <h2>${T('rain.sky.h2')}</h2>
      <div class="body">
        <p>${T('rain.sky.p')}</p>
        <div class="skies" data-w="skies" role="group" aria-label="${T('ctl.skyOverMV')}"></div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('rain.how.h2')}</h2>
      <div class="body">
        <div class="circle-row">
          <div class="porthole speaker" data-w="speaker"><img src="media/speaker-meadow.jpg" alt="" loading="lazy" decoding="async"></div>
          <article class="how"><h3>${T('rain.how.h3')}</h3><p>${T('rain.how.p')}</p></article>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('rain.ancient.h2')}</h2>
      <div class="body">
        <blockquote class="q"><span class="q-short">${T('rain.ancient.short')}</span><span class="q-full" hidden>${T('rain.ancient.full')}</span><cite${T.langAttr('cite.mmy')}>${T('cite.mmy')}</cite></blockquote>
        <button class="more-q" type="button" aria-expanded="false">${T('quote.more')}</button>
        <span class="nowline" data-w="nowline" style="margin-top:22px"></span>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <div class="side"><p class="kick">${T('research')}</p><h2>${T('why.h2')}</h2></div>
      <div class="body">
        <blockquote class="q">${T('rain.why.quote')}<cite${T.langAttr('cite.mmy')}>${T('cite.mmy')}</cite></blockquote>
        <div class="sub">
          <p>${T('rain.why.research')}</p>
          <p class="ref">Vir, Chauhan, Kumar, Saini &amp; Saini (2026), Impact of Indian classical raga on plant growth and biochemical parameters in Rai and Methi. <i>International Journal of Applied Research</i> 12(5), 281–288. <a href="https://doi.org/10.22271/allresearch.2026.v12.i5c.13644">${T('readPaper')}</a></p>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <div class="side"><p class="kick">${T('research')}</p><h2>${T('rain.farmers.h2')}</h2></div>
      <div class="body carousel">
        <div class="reel-wrap at-start">
          <div class="reel" data-w="reel" tabindex="0" aria-label="${T('films.aria')}">
            ${FILMS.map((f, i) => `<figure><div class="film"><video src="${VID}${f}.mp4" poster="${VID}${f}.jpg" controls playsinline preload="none" aria-label="${T('films.one', { n: i + 1 })}"><track kind="captions" srclang="${T.code}" label="${T.lang.name}" src="${VID}${f}${T.code === 'en' ? '' : '.' + T.code}.vtt" default></video><p class="cue" aria-hidden="true"></p></div></figure>`).join('')}
          </div>
          <button class="reel-edge prev" data-dir="-1" tabindex="-1" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3 5 8l5 5"/></svg></button>
          <button class="reel-edge next" data-dir="1" tabindex="-1" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 3 5 5-5 5"/></svg></button>
        </div>
        <div class="reel-nav">
          <button data-dir="-1" aria-label="${T('films.prev')}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3 5 8l5 5"/></svg></button>
          <button data-dir="1" aria-label="${T('films.next')}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 3 5 5-5 5"/></svg></button>
        </div>
        <div class="invite">
          <p>${T('rain.invite.p')}</p>
          <button class="btn" data-w="video-open" aria-expanded="false" aria-controls="videoForm">${T('rain.invite.btn')}</button>
        </div>
        <form class="form" id="videoForm" data-w="video" hidden>
          <label>${T('form.name')}<input name="name" autocomplete="name" required></label>
          <label>${T('form.email')}<input name="email" type="email" autocomplete="email" required></label>
          <label>${T('form.wherePlay')}<input name="place"></label>
          <label>${T('form.videoLink')}<input name="link" type="url" placeholder="https://"></label>
          <label>${T('form.noticed')}<textarea name="message"></textarea></label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p><button class="btn" type="submit">${T('form.send')}</button></p>
          <p class="note" data-status aria-live="polite"></p>
        </form>
        <div class="sub">
          <p>${T('rain.farmers.research')}</p>
          <p class="ref">Cao, Zhao, Feng et al. (2025), Effects of Raga music and Chinese five-element music on milk production, antioxidant, neuroendocrine, immune, and welfare indicators in dairy cows. <i>Frontiers in Veterinary Science</i> 12, 1623026. <a href="https://doi.org/10.3389/fvets.2025.1623026">${T('readPaper')}</a></p>
        </div>
      </div>
    </div></section>


    <section class="row moonsec"><div class="cols">
      <h2>${T('rain.garden.h2')}</h2>
      <div class="body">
        <p>${T('rain.garden.p')}</p>
        <div class="circle-row wide">
          <div class="porthole rose" data-w="rose"><video src="media/rose-open.mp4" poster="media/rose-open.jpg" muted playsinline preload="none" disablepictureinpicture aria-hidden="true"></video></div>
          <div><p class="ref" style="margin:0">Chivukula &amp; Ramaswamy (2014), Effect of Different Types of Music on Rosa Chinensis Plants. <i>International Journal of Environmental Science and Development</i> 5(5), 431–434. <a href="https://doi.org/10.7763/IJESD.2014.V5.522">${T('readPaper')}</a></p>
          <p class="ref film-credit">Rose: <a href="https://commons.wikimedia.org/wiki/File:Time-lapse_of_opening_red_rose_isolated_on_black_background.Blooming_red_roses_flower_buds.webm">Alex Tr</a>, <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>, set over Monte Verde</p></div>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('rain.share.h2')}</h2>
      <div class="body">
        <p>${T('rain.share.p')}</p>
        <p class="weather" data-w="weather"></p>
        <p class="actions">
          <button class="btn" data-w="share-open" aria-expanded="false" aria-controls="shareForm">${T('share.photo')}</button>
          <button class="btn ghost" data-w="contact-open" aria-expanded="false" aria-controls="contactForm">${T('share.contact')}</button>
        </p>
        <form class="form" id="shareForm" data-w="share" hidden>
          <label>${T('form.name')}<input name="name" autocomplete="name" required></label>
          <label>${T('form.email')}<input name="email" type="email" autocomplete="email" required></label>
          <label>${T('form.whereTaken')}<input name="place"></label>
          <label>${T('form.photoLink')}<input name="link" type="url" placeholder="https://"></label>
          <label>${T('form.message')}<textarea name="message"></textarea></label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p><button class="btn" type="submit">${T('form.send')}</button></p>
          <p class="note" data-status aria-live="polite"></p>
        </form>
        <form class="form" id="contactForm" data-w="contact" hidden>
          <div class="form-two">
            <label>${T('form.first')}<input name="first_name" autocomplete="given-name" required></label>
            <label>${T('form.last')}<input name="last_name" autocomplete="family-name"></label>
          </div>
          <label>${T('form.email')}<input name="email" type="email" autocomplete="email" required></label>
          <label>${T('form.write')}<textarea name="message" required></textarea></label>
          <label class="check"><input type="checkbox" name="optin" value="1"> ${T('form.optin')}</label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p><button class="btn" type="submit">${T('form.sendMessage')}</button></p>
          <p class="note" data-status aria-live="polite"></p>
        </form>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <h2>${T('rain.tune.h2')}</h2>
      <div class="body">
        <p>${T('rain.tune.p')}</p>
        <form class="inline-form" data-w="subscribe"><input name="email" type="email" placeholder="${T('form.yourEmail')}" aria-label="${T('form.yourEmail')}" autocomplete="email" required><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn" type="submit">${T('form.subscribe')}</button><p class="note" data-status aria-live="polite"></p></form>
      </div>
    </div></section>`;

  // ── Footer: About Radyo Harmoni and About Maharishi Gandharva Veda (both fold open), affiliates, the legal lines ──
  const ABOUT = `
    <details class="about about-mgv">
      <summary>${T('about.title')}</summary>
      <div class="cols">
        <div><h4>${T('about.1.h')}</h4>
          <p>${T('about.1.p1')}</p>
          <p>${T('about.1.p2')}</p>
          <p>${T('about.1.p3')}</p></div>
        <div><h4>${T('about.2.h')}</h4>
          <p>${T('about.2.p1')}</p>
          <p>${T('about.2.p2')}</p>
          <p>${T('about.2.p3')}</p></div>
        <div><h4>${T('about.3.h')}</h4>
          <p>${T('about.3.p1')}</p>
          <p>${T('about.3.p2')}</p></div>
      </div>
    </details>`;
  const FOOT = `
    <div class="wrap">
      <div class="foot-row">
        <details class="about about-rh">
          <summary>${T('foot.aboutRh')}</summary>
          <div class="about-body"><p>${T('foot.aboutRhP')}</p></div>
        </details>
        <div class="foot-col friends">
          <h3 class="foot-h">${T('foot.affiliates')}</h3>
          <p><a href="https://tm-women.org/">TM-women.org</a><a href="https://apps.apple.com/app/id977489377">Veda App</a></p>
        </div>
        ${ABOUT}
      </div>
      <div class="legal">
        <p>${T('legal.music')}</p>
        <p>${T('legal.tm')}</p>
        <p>${T('legal.recaptcha')}</p>
        <p>${T('legal.copy')} <a href="privacy-policy/">${T('legal.privacy')}</a> <button class="linkish" data-consent-open>${T('legal.choices')}</button></p>
        <p class="langs" aria-label="${T('foot.languages')}">${T.langs.map(l => `<a href="${T.href(l.code)}" lang="${l.code}" hreflang="${l.code}" dir="${l.dir}"${l.code === T.code ? ' aria-current="true"' : ''}>${l.name}</a>`).join('')}</p>
      </div>
    </div>`;

  // The release build bakes these sections into the HTML (for search engines and AI agents that do not run scripts);
  // here they are only built when they are not already there.
  if (!$('#info').querySelector('.info-set')) $('#info').innerHTML = `<div class="info-set" data-set="peace">${PEACE}</div><div class="info-set" data-set="rain">${RAIN}</div>`;
  if (!$('#foot').children.length) $('#foot').innerHTML = FOOT;
  document.querySelectorAll('#foot .langs a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); T.choose(a.lang); }));
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
    b.textContent = T(open ? 'quote.less' : 'quote.more');
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
  cells.innerHTML = R.PERIODS.map((x, i) => `<li><button data-i="${i}" aria-pressed="false"><b>${T(`watch.${i}.name`)}</b><small>${R.pad(x.start)}–${R.pad((x.start + 3) % 24)}</small></button></li>`).join('');
  // The character of each watch's ragas (watch.N.character), after the time theory of ragas in the Indian classical tradition.
  let picked = null;
  function showWatch(i) {
    const p = R.period(), x = R.PERIODS[i], isNow = i === p.index;
    cells.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i));
    cap.innerHTML = T('band.cap', { now: isNow ? T('band.now') : '', watch: T(`watch.${i}.name`), from: `${R.pad(x.start)}:00`, to: `${R.pad((x.start + 3) % 24)}:00`, character: T(`watch.${i}.character`) });
  }
  cells.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { picked = +b.dataset.i === R.period().index ? null : +b.dataset.i; showWatch(+b.dataset.i); }));
  function paintHours() {
    const p = R.period();
    band.style.setProperty('--at', (((p.hourFloat - 1 + 24) % 24) / 24 * 100).toFixed(2) + '%');
    if (picked === null) showWatch(p.index);
    ws('nowline').forEach(el => {
      el.textContent = T('nowline', { tz: R.timezone(), watch: T(`watch.${p.index}.inline`), mood: T(`watch.${p.index}.mood`) });
    });
  }
  paintHours();
  setInterval(paintHours, 60000);

  // ── Rain Radio's skies, as round swatches that change the picture above ──
  const skies = w('skies');
  skies.innerHTML = RH.SKIES.map(([m, name, sw]) => `<button data-sky-pick="${m}" aria-pressed="${m === RH.sky}"><i style="background:${sw}"></i><b>${name}</b><small>${T(`sky.${m}.note`)}</small></button>`).join('');
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
    return d === 0 ? T('moon.isTonight') : T.plural('moon.days', d, { lit: Math.round(moonNow.illumination * 100).toLocaleString(T.lang.locale) });
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

  // ── Blooming gardens: a pink rose filmed as it opens (time-lapse by Alex Tr, CC BY 3.0), set over Monte Verde. It rests
  //    as a bud, opens slowly while Rain Radio plays, and closes gently again when the music stops. ──
  (function garden() {
    const box = w('rose'), v = box.querySelector('video');
    const OPEN = .78, BUD = .04;             // the fullest it shows (the last frames run past the circle), and at rest
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pinned = new URLSearchParams(location.search).get('bloom');   // ?bloom=1 holds it open, for review
    let seen = false, canPlay = true;
    // Loaded only when the section comes into view
    new IntersectionObserver((e, ob) => {
      if (!e[0].isIntersecting) return;
      ob.disconnect(); seen = true;
      v.preload = 'auto'; v.load();
      v.addEventListener('loadedmetadata', () => { v.currentTime = (pinned !== null ? +pinned * OPEN : BUD) * v.duration; }, { once: true });
    }, { rootMargin: '200px' }).observe(box);
    let target = BUD;
    v.addEventListener('timeupdate', () => { if (!v.paused && v.currentTime >= target * v.duration) v.pause(); });
    setInterval(() => {
      if (!seen || !v.duration || v.seeking) return;
      const playing = RH.radio.wantPlay && RH.radio.station === 'rain' && !RH.radio.audio.paused;
      target = pinned !== null ? +pinned * OPEN : playing ? OPEN : BUD;
      const want = target * v.duration, now = v.currentTime;
      if (reduce || pinned !== null) { if (!v.paused) v.pause(); if (Math.abs(want - now) > .05) v.currentTime = want; return; }
      if (want > now + .04) {
        // Opening: the film plays forward, slowed (about half a minute to open); where a phone will not play it, by steps
        if (canPlay && v.paused) { v.playbackRate = .4; const p = v.play(); if (p) p.catch(e => { if (e && e.name === 'NotAllowedError') canPlay = false; }); }   // a pause interrupting play() is not a refusal
        if (!canPlay) v.currentTime = Math.min(want, now + .05);
      } else {
        if (!v.paused) v.pause();
        if (want < now - .04) v.currentTime = Math.max(want, now - .05);   // closing, gently, by steps
      }
    }, 120);
  })();

  // ── Today in Monte Verde, from Open-Meteo ──
  (async function weather() {
    const el = w('weather');
    const WORDS = { 0: 'clear', 1: 'mostlyClear', 2: 'partly', 3: 'overcast', 45: 'fog', 48: 'fog', 51: 'lightDrizzle', 53: 'drizzle', 55: 'heavyDrizzle',
      61: 'lightRain', 63: 'rainfall', 65: 'heavyRain', 80: 'showers', 81: 'showers', 82: 'heavyShowers', 95: 'thunder', 96: 'thunder', 99: 'thunder' };
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.30&longitude=-84.82&current=temperature_2m,weather_code,cloud_cover&daily=precipitation_sum&forecast_days=1&timezone=auto');
      if (!r.ok) return;
      const j = await r.json(), c = j.current;
      const rain = j.daily && j.daily.precipitation_sum ? j.daily.precipitation_sum[0] : null;
      const num = v => v.toLocaleString(T.lang.locale);
      el.textContent = T('weather.line', { date: dateLong(new Date()), sky: T('weather.' + (WORDS[c.weather_code] || 'changing')), temp: num(Math.round(c.temperature_2m)),
        clouds: num(c.cloud_cover), rain: rain != null ? T('weather.rain', { mm: num(rain) }) : '' });
    } catch (e) { /* the date alone is enough */ }
  })();

  // ── Forms: contact, photos and subscribe go to the site's own form service (api/form.php, which mails through
  //    AhaSend). Protected by reCAPTCHA v3, loaded only once someone starts a form. Where there is no form service
  //    (the preview), or the network fails, they hand over to the visitor's email app instead. ──
  const MAIL = 'info@radyoharmoni.org';
  const ENDPOINT = 'api/form.php';
  const SITE_KEY = '6LeQlGYsAAAAAB53X7mvV4EXw0qC6DFCSr-fuZ9S';
  const PROD = /(^|\.)radyoharmoni\.org$/.test(location.hostname);
  // The form service answers in English; its few messages are shown in the page's language
  const SERVER = [[/name and a message/, 'form.err.nameMessage'], [/fill in your name/, 'form.err.name'], [/valid email/, 'form.err.email'],
    [/should start with https/, 'form.err.link'], [/Too many/, 'form.err.tooMany'], [/robot/, 'form.err.robot'], [/reload the page/, 'form.err.reload'],
    [/could not be sent/, 'form.err.notSent']];
  const serverText = msg => { const m = SERVER.find(([re]) => re.test(msg || '')); return m ? T(m[1]) : T('form.error'); };
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
      btn.disabled = true; status.textContent = T('form.sending');
      try {
        const g = await loadCaptcha();
        if (g) d.token = await g.execute(SITE_KEY, { action: type });
        const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        if (!(r.headers.get('content-type') || '').includes('json')) throw new Error('no form service');
        const j = await r.json();
        if (j.ok) {
          form.innerHTML = `<p class="thanks">${T('thanks.' + type)}</p>`;
          document.dispatchEvent(new CustomEvent('rh:form', { detail: type }));
        } else {
          status.textContent = serverText(j.error);
          btn.disabled = false;
        }
      } catch (err) {
        status.textContent = T('form.opening');
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
