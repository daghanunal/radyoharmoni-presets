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
          <p class="ref"><span lang="en">Travis, Morehead &amp; Parim (2023), <i>International Journal of Psychological Studies</i> 15(1), 8.</span> <a href="https://doi.org/10.5539/ijps.v15n1p8">${T('readPaper')}</a></p>
        </div>
      </div>
    </div></section>

    <section class="row moonsec moonband" id="concerts"><div class="cols">
      <h2>${T('peace.moon.h2')}</h2>
      <div class="body">
        <p>${T('peace.moon.p')}</p>
        <div class="circle-row">
          <div class="moon-photo" data-w="moon"><canvas aria-hidden="true"></canvas></div>
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
    </div></section>`;

  // ── Rain Radio ──────────────────────────────────────────────
  const FILMS = ['farmer-1', 'farmer-2', 'farmer-3', 'farmer-5'];
  const RAIN = `
    <section class="row"><div class="cols">
      <h2>${T('rain.sky.h2')}</h2>
      <div class="body">
        <p>${T('rain.sky.p')}</p>
        <div class="skies" data-w="skies" role="group" aria-label="${T('ctl.skyOverMV')}" hidden></div>
      </div>
    </div></section>

    <section class="row how-sec"><div class="cols">
      <h2>${T('rain.how.h2')}</h2>
      <div class="body">
        <div class="ways"><article><h3>${T('peace.listen.selfH')}</h3><p>${T('rain.how.selfP')}</p></article><article><h3>${T('peace.listen.aroundH')}</h3><p>${T('rain.how.envP')}</p></article></div>
      </div>
      <figure class="strip-r"><img src="media/rain-how-2.webp" alt="" loading="lazy" decoding="async"><figcaption class="strip-credit">${T('img.nicoya')}</figcaption></figure>
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
          <p class="ref"><span lang="en">Vikash, Chauhan, Kumar, Saini &amp; Saini (2026), Impact of Indian classical raga on plant growth and biochemical parameters in Rai and Methi. <i>International Journal of Applied Research</i> 12(5), 281–288.</span> <a href="https://doi.org/10.22271/allresearch.2026.v12.i5c.13644">${T('readPaper')}</a></p>
        </div>
      </div>
    </div></section>

    <section class="row"><div class="cols">
      <div class="side"><p class="kick">${T('research')}</p><h2>${T('rain.farmers.h2')}</h2></div>
      <div class="body carousel">
        <div class="reel-wrap at-start">
          <div class="reel" data-w="reel" tabindex="0" role="region" aria-label="${T('films.aria')}">
            ${FILMS.map((f, i) => `<figure><div class="film"><video src="${VID}${f}.mp4" data-poster="${VID}${f}.jpg" controls playsinline preload="none" aria-label="${T('films.one', { n: i + 1 })}"><track kind="captions" srclang="${T.code}" label="${T.lang.name}" src="${VID}${f}${T.code === 'en' ? '' : '.' + T.code}.vtt" default></video><p class="cue" aria-hidden="true"></p></div></figure>`).join('')}
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
          <label>${T('form.noticed')}<textarea name="message" maxlength="5000"></textarea></label>
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p><button class="btn" type="submit">${T('form.send')}</button></p>
          <p class="note" data-status aria-live="polite"></p>
        </form>
        <div class="sub">
          <p>${T('rain.farmers.research')}</p>
          <p class="ref"><span lang="en">Cao, Zhao, Feng et al. (2025), Effects of Raga music and Chinese five-element on milk production, antioxidant, neuroendocrine, immune, and welfare indicators in dairy cows. <i>Frontiers in Veterinary Science</i> 12, 1623026.</span> <a href="https://doi.org/10.3389/fvets.2025.1623026">${T('readPaper')}</a></p>
        </div>
      </div>
    </div></section>


    <section class="row moonsec"><div class="cols">
      <h2>${T('rain.garden.h2')}</h2>
      <div class="body">
        <p>${T('rain.garden.p')}</p>
        <p class="ref"><span lang="en">Chivukula &amp; Ramaswamy (2014), Effect of Different Types of Music on Rosa Chinensis Plants. <i>International Journal of Environmental Science and Development</i> 5(5), 431–434.</span> <a href="https://doi.org/10.7763/IJESD.2014.V5.522">${T('readPaper')}</a></p>
        <div class="voices garden-voice"><blockquote>${T('rain.garden.voice')}<cite>${T('rain.garden.voice.cite')}</cite></blockquote></div>
      </div>
      <figure class="strip-r"><img src="media/garden-2.webp" alt="" loading="lazy" decoding="async"><figcaption class="strip-credit">${T('img.nosara')}</figcaption></figure>
    </div></section>`;

  // ── On both stations: what a listener can do (concerts, share a photo, write, subscribe, give) ──
  const COMMON = `
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
          <label>${T('form.message')}<textarea name="message" maxlength="5000"></textarea></label>
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
          <label>${T('form.write')}<textarea name="message" maxlength="5000" required></textarea></label>
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
    </div></section>

    <section class="row" id="keep"><div class="cols">
      <h2>${T('keep.h2')}</h2>
      <div class="body">
        <p>${T('keep.p')}</p>
        <p class="actions"><a class="btn" href="https://www.paypal.com/donate/?hosted_button_id=8PV97C4VSV5R8">${T('keep.donate')}</a><a class="btn ghost" href="https://artsforenlightenment.org/">${T('keep.academy')}</a></p>
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
          <p>${T('about.3.p2')}</p>
          <p class="foot-note"><span lang="en" dir="ltr">* Travis, Morehead &amp; Parim (2023), <i>International Journal of Psychological Studies</i> 15(1), 8.</span> <a href="https://doi.org/10.5539/ijps.v15n1p8">${T('readPaper')}</a></p></div>
      </div>
    </details>`;
  // The eight praharas of the day and what each brings (the owner's table, revision v3 row 49)
  const PRAHARAS = `
    <details class="about about-praharas" id="praharas">
      <summary>${T('prahara.title')}</summary>
      <table class="praharas">
        <thead><tr><th scope="col">${T('prahara.colName')}</th><th scope="col">${T('prahara.colBenefits')}</th></tr></thead>
        <tbody>${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<tr><th scope="row">${T(`prahara.${n}.name`)}</th><td>${T(`prahara.${n}.benefits`)}</td></tr>`).join('')}</tbody>
      </table>
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
          <p><a href="https://apps.apple.com/app/id977489377">Veda App</a><a href="https://www.tm.org/">TM.org</a><a href="https://tm-women.org/">TM-Women.org</a></p>
        </div>
        ${ABOUT}
        ${PRAHARAS}
      </div>
      <div class="legal">
        <p>${T('legal.music')}</p>
        <p>${T('legal.tm')}</p>
        <p>${T('legal.recaptcha')}</p>
        <p>${T('legal.copy')} <a href="privacy-policy/">${T('legal.privacy')}</a> <button class="linkish" data-consent-open>${T('legal.choices')}</button></p>
        <p class="langs" role="navigation" aria-label="${T('foot.languages')}">${T.langs.map(l => `<a href="${T.href(l.code)}" lang="${l.code}" hreflang="${l.code}" dir="${l.dir}"${l.code === T.code ? ' aria-current="true"' : ''}>${l.name}</a>`).join('')}</p>
      </div>
    </div>`;

  // The release build bakes these sections into the HTML (for search engines and AI agents that do not run scripts);
  // here they are only built when they are not already there.
  if (!$('#info').querySelector('.info-set')) $('#info').innerHTML = `<div class="info-set" data-set="peace">${PEACE}</div><div class="info-set" data-set="rain">${RAIN}</div><div class="info-common">${COMMON}</div>`;
  if (!$('#foot').children.length) $('#foot').innerHTML = FOOT;
  document.querySelectorAll('#foot .langs a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); T.choose(a.lang); }));
  $('[data-w="nextfull"]').textContent = dateLong(moonNow.nextFull);
  $('[data-w="weather"]').textContent = dateLong(new Date());
  const w = (name, root = document) => root.querySelector(`[data-w="${name}"]`);
  const ws = name => document.querySelectorAll(`[data-w="${name}"]`);

  function showSet(id) {
    document.querySelectorAll('.info-set').forEach(el => el.classList.toggle('on', el.dataset.set === id));
    w('weather').hidden = id !== 'rain';   // today's weather at Monte Verde belongs with Rain Radio
  }
  showSet(RH.radio.station);
  // The heart over the picture leads down to Donate (the station stays in the address)
  $('#give').addEventListener('click', e => {
    e.preventDefault();
    $('#keep').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
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
    const html = T('band.cap', { now: isNow ? T('band.now') : '', watch: T(`watch.${i}.name`), watchInline: T(`watch.${i}.inline`), from: `${R.pad(x.start)}:00`, to: `${R.pad((x.start + 3) % 24)}:00`, character: T(`watch.${i}.character`) });
    const linked = html.replace('*', `<a class="star" href="#praharas" title="${T('prahara.title').replace('*', '')}">*</a>`);
    if (cap.dataset.html !== linked) { cap.dataset.html = linked; cap.innerHTML = linked; }   // only when it changes: the line is read aloud each time it is written
  }
  // The asterisk opens the praharas table in the footer before the page goes there
  document.addEventListener('click', e => { if (e.target.closest('a[href="#praharas"]')) { const d = document.getElementById('praharas'); if (d) d.open = true; } });
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
  // The posters load when the films come near the screen (on Peace Radio the films are not shown at all)
  new IntersectionObserver((e, ob) => {
    if (!e[0].isIntersecting) return;
    ob.disconnect(); reel.querySelectorAll('video[data-poster]').forEach(v => { v.poster = v.dataset.poster; });
  }, { rootMargin: '600px' }).observe(reel);
  // The films and the radio take turns, so two sounds never play at once: a film fades the radio out and, when the film
  // stops or ends, the radio comes back if it was playing before. Play on the radio stops the film.
  const films = [...reel.querySelectorAll('video')], filmOn = () => films.some(v => !v.paused);
  let radioBack = false;
  films.forEach(v => {
    v.addEventListener('play', () => { if (RH.radio.wantPlay) { radioBack = true; RH.radio.pause(); } });
    // a moment's wait: another film starting pauses this one first
    v.addEventListener('pause', () => setTimeout(() => { if (radioBack && !filmOn()) { radioBack = false; RH.radio.play(); } }, 250));
  });
  RH.radio.on('state', s => { if (s.wantPlay && filmOn()) { radioBack = false; films.forEach(v => v.pause()); } });
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
    reel.scrollBy({ left: (+b.dataset.dir) * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  document.addEventListener('rh:station', () => reel.querySelectorAll('video').forEach(v => v.pause()));

  // ── Full moon concerts ──
  const moonBox = w('moon');
  w('moondays').textContent = (() => {
    const d = Math.max(0, Math.round(moonNow.daysToFull));
    return d === 0 ? T('moon.isTonight') : T.plural('moon.days', d, { lit: Math.round(moonNow.illumination * 100).toLocaleString(T.lang.locale) });
  })();
  // The owner's full moon, in the concert night's phase or tonight's
  const moon = RH.photoMoon(moonBox.querySelector('canvas'));
  moon.set(moonNow.phase);
  const moonTo = p => moon.to(p);
  // Seen for the first time, tonight's moon grows to the concert's full moon.
  new IntersectionObserver((e, ob) => { if (e[0].isIntersecting) { ob.disconnect(); if (document.querySelector('.moonsel [data-m="full"]').getAttribute('aria-pressed') === 'true') moonTo(.5); } }).observe(moonBox);
  document.querySelectorAll('.moonsel button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.moonsel button').forEach(x => x.setAttribute('aria-pressed', x === b));
    moonTo(b.dataset.m === 'full' ? .5 : moonNow.phase);
  }));

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
  // Google's own address for reCAPTCHA where google.com is blocked (mainland China); never waits more than a few seconds
  const within = (p, ms) => Promise.race([p, new Promise(res => setTimeout(() => res(null), ms))]);
  const loadCaptcha = () => {
    if (!PROD) return Promise.resolve(null);
    if (!captcha) captcha = new Promise(res => {
      const sc = document.createElement('script');
      sc.src = 'https://www.recaptcha.net/recaptcha/api.js?render=' + SITE_KEY;
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
      d.type = type; d.elapsed = Date.now() - started;   // how long the form was open (the server's clock may differ)
      btn.disabled = true; status.textContent = T('form.sending');
      try {
        // On the site, a form goes with its reCAPTCHA token; without one (blocked, too slow) the email app takes over
        const g = await within(loadCaptcha(), 8000);
        if (PROD && !g) throw new Error('no reCAPTCHA');
        if (g) { d.token = await within(g.execute(SITE_KEY, { action: type }), 8000); if (!d.token) throw new Error('no reCAPTCHA token'); }
        const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        // no form service here (the preview), not set up yet, or the mail server failed: the email app takes over
        if (r.status >= 500 || !(r.headers.get('content-type') || '').includes('json')) throw new Error('no form service');
        const j = await r.json();
        if (j.ok) {
          form.innerHTML = `<p class="thanks" role="status" tabindex="-1">${T('thanks.' + type)}</p>`;
          form.querySelector('.thanks').focus();   // focus moves to the thanks, which is read aloud
          document.dispatchEvent(new CustomEvent('rh:form', { detail: type }));
        } else {
          status.textContent = serverText(j.error);
          btn.disabled = false;
        }
      } catch (err) {
        // the email app opens; if there is none, the address stays here to write to
        status.innerHTML = `${T('form.opening')} <a href="mailto:${MAIL}">${MAIL}</a>`;
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
