/*
 * Google Analytics 4 with Consent Mode v2, and a quiet consent card.
 * Runs only on radyoharmoni.org, so previews never mix into the real numbers. `?consent` shows the card in a preview.
 * The same Google tag as the old WordPress site (GT-MR8ZQC5R → G-VMWZGMMGDV), so history carries on.
 */
(function () {
  'use strict';
  const PROD = /(^|\.)radyoharmoni\.org$/.test(location.hostname);
  const PREVIEW = new URLSearchParams(location.search).has('consent');
  window.rhTrack = () => {};
  if (!PROD && !PREVIEW) return;

  const TAG = 'GT-MR8ZQC5R';
  // Statistics wait for a yes in the EEA, the UK, Switzerland and Türkiye; elsewhere they are on unless declined.
  const ASK_FIRST = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
    'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH', 'TR'];
  const KEY = 'rh-consent';
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  const NO_ADS = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  gtag('consent', 'default', { ...NO_ADS, analytics_storage: 'denied', region: ASK_FIRST, wait_for_update: 500 });
  gtag('consent', 'default', { ...NO_ADS, analytics_storage: 'granted' });
  if (saved) gtag('consent', 'update', { analytics_storage: saved === 'granted' ? 'granted' : 'denied' });
  gtag('set', 'ads_data_redaction', true);

  if (PROD) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', TAG, { allow_google_signals: false, allow_ad_personalization_signals: false });
    window.rhTrack = (name, params) => gtag('event', name, params || {});
  }
  document.documentElement.classList.add('has-consent');

  // ── The consent card ─────────────────────────────────────────
  const card = document.createElement('div');
  card.className = 'consent';
  card.setAttribute('role', 'dialog');
  const T = window.RH_T;
  card.setAttribute('aria-label', T('consent.aria'));
  card.innerHTML = `
    <p>${T('consent.text')}</p>
    <div class="consent-row">
      <button class="consent-yes" data-c="granted">${T('consent.allow')}</button>
      <button class="consent-no" data-c="denied">${T('consent.no')}</button>
      <a href="privacy-policy/#cookies">${T('legal.privacy')}</a>
    </div>`;
  const choose = v => {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    gtag('consent', 'update', { analytics_storage: v });
    card.classList.remove('show');
    setTimeout(() => card.remove(), 700);
  };
  card.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) choose(b.dataset.c); });
  const show = () => {
    if (!card.isConnected) document.body.appendChild(card);
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('show')));
  };
  // It waits for the opening to finish, so the first moments belong to the sea.
  if (!saved || PREVIEW) {
    if (window.RH && window.RH.ready) setTimeout(show, 1200);
    else document.addEventListener('rh:ready', () => setTimeout(show, 1200), { once: true });
  }
  document.addEventListener('click', e => { if (e.target.closest('[data-consent-open]')) { e.preventDefault(); show(); } });

  // ── What is measured: listening, not people ─────────────────
  const RH = window.RH;
  if (!RH || !PROD) return;
  const track = window.rhTrack;
  let wasPlaying = false, station = RH.radio.station, minutes = 0;
  RH.radio.on('state', s => {
    if (s.wantPlay && !wasPlaying) track('radio_play', { station: s.station });
    if (!s.wantPlay && wasPlaying) track('radio_pause', { station: s.station });
    if (s.station !== station) { track('station_change', { station: s.station }); station = s.station; }
    wasPlaying = s.wantPlay;
  });
  // Listening time, in five-minute steps
  setInterval(() => {
    if (!RH.radio.audio.paused && RH.radio.wantPlay) {
      minutes++;
      if (minutes % 5 === 0) track('listen_5min', { station: RH.radio.station, minutes });
    }
  }, 60000);
  RH.light.on(l => track('light_choice', { light: l.choice }));
  document.addEventListener('rh:sky', e => track('sky_choice', { sky: e.detail }));
  document.addEventListener('click', e => {
    const t = e.target.closest('a, button');
    if (!t) return;
    const href = t.getAttribute('href') || '';
    if (t.matches('[data-min]')) track('timer_set', { minutes: +t.dataset.min });
    else if (t.id === 'mute') track('mute_toggle', { muted: !RH.radio.audio.muted });
    else if (t.id === 'fsBtn') track('fullscreen_toggle');
    else if (/paypal\.com/.test(href)) track('donate_click');
    else if (/artsforenlightenment\.org/.test(href) && t.closest('#concerts')) track('concert_register_click');
    else if (/doi\.org/.test(href)) track('paper_open', { link: href });
    else if (t.matches('[data-w="share-open"]')) track('share_photo_open');
    else if (t.matches('[data-w="contact-open"]')) track('contact_open');
  });
  document.addEventListener('rh:form', e => track('form_sent', { form: e.detail }));
  document.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('.about') && e.target.open) track('about_open'); }, true);
  document.addEventListener('play', e => {
    const v = e.target;
    if (v.closest && v.closest('[data-w="reel"]')) track('film_play', { film: (v.getAttribute('src') || '').split('/').pop() });
  }, true);
})();
