/*
 * Languages. Each language has its own address (/tr/, /ar/ …) whose page says which in <html lang>; in development,
 * ?lang=tr does the same. Dictionaries live in i18n/<code>.js beside the page; English is always loaded and fills
 * any gap. Load after i18n/en.js and before the page's own scripts.
 *
 *   RH_T('key', { n: 3 })   text for the key, {placeholders} filled
 *   RH_T.plural('key', n)   key.one / key.few / key.other … by the language's plural rules
 *   RH_T.apply(root)        fills [data-t] (inner HTML), [data-t-aria], [data-t-ph] (placeholder) and [data-t-title]
 */
(function () {
  'use strict';
  // code, name in its own language, locale for dates and numbers, direction, how the title may be animated
  // (letters: one by one; words: whole words, for scripts whose letters join or combine)
  const LANGS = [
    ['en', 'English', 'en-GB'], ['tr', 'Türkçe', 'tr-TR'], ['ru', 'Русский', 'ru-RU'], ['ar', 'العربية', 'ar', 'rtl', 'words'],
    ['de', 'Deutsch', 'de-DE'], ['fr', 'Français', 'fr-FR'], ['es', 'Español', 'es-ES'], ['pt', 'Português', 'pt-BR'],
    ['ja', '日本語', 'ja-JP'], ['zh', '中文', 'zh-CN'], ['hi', 'हिन्दी', 'hi-IN', 'ltr', 'words'], ['th', 'ไทย', 'th-TH', 'ltr', 'words'],
    ['it', 'Italiano', 'it-IT'], ['fa', 'فارسی', 'fa-IR', 'rtl', 'words'], ['el', 'Ελληνικά', 'el-GR'], ['bg', 'Български', 'bg-BG'],
    ['ur', 'اردو', 'ur-PK', 'rtl', 'words'], ['bn', 'বাংলা', 'bn-BD', 'ltr', 'words'], ['sw', 'Kiswahili', 'sw-KE']
  ].map(([code, name, locale, dir, anim]) => ({ code, name, locale, dir: dir || 'ltr', anim: anim || 'letters' }));

  const html = document.documentElement;
  const qs = new URLSearchParams(location.search);
  // On the language addresses the build writes the language into the page; ?lang= is for development
  const paths = !!document.querySelector('meta[name="rh-i18n"]');
  let code = ((!paths && qs.get('lang')) || html.lang || 'en').toLowerCase().split('-')[0];
  if (!LANGS.some(l => l.code === code)) code = 'en';
  const lang = LANGS.find(l => l.code === code);
  html.lang = code;
  html.dir = lang.dir;

  const dict = () => window.RH_I18N || {};
  // In development the dictionary is not in the page yet: it is added here (beside the page), before the scripts
  // that need it. The release pages carry their dictionary themselves.
  if (code !== 'en' && !dict()[code]) document.write(`<script src="i18n/${code}.js"><\/script>`);

  function lookup(key) {
    const d = dict();
    const v = d[code] && d[code][key];
    if (v != null && v !== '') return v;
    const e = d.en && d.en[key];
    if (e == null) console.warn('i18n: no text for', key);
    return e;
  }
  function fill(s, vars) {
    return vars ? String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m)) : s;
  }
  function T(key, vars) {
    const s = lookup(key);
    return s == null ? key : fill(s, vars);
  }
  T.list = key => lookup(key) || [];
  // True where this language keeps the English words (a name in Latin letters), so it can be marked lang="en":
  // capitals then follow English rules (Turkish would write MAHARİSHİ)
  T.same = key => code !== 'en' && !!dict()[code] && dict()[code][key] === (dict().en || {})[key];
  T.langAttr = key => (T.same(key) ? ' lang="en"' : '');
  const rules = new Intl.PluralRules(lang.locale);
  T.plural = (key, n, vars) => {
    const form = rules.select(n);
    const d = dict(), own = d[code] || {};
    const s = own[`${key}.${form}`] || own[`${key}.other`] || lookup(`${key}.${form}`) || lookup(`${key}.other`) || key;
    return fill(s, Object.assign({ n: n.toLocaleString(lang.locale) }, vars));
  };
  T.apply = (root = document) => {
    root.querySelectorAll('[data-t]').forEach(el => { el.innerHTML = T(el.dataset.t); });
    root.querySelectorAll('[data-t-aria]').forEach(el => el.setAttribute('aria-label', T(el.dataset.tAria)));
    root.querySelectorAll('[data-t-ph]').forEach(el => el.setAttribute('placeholder', T(el.dataset.tPh)));
    root.querySelectorAll('[data-t-title]').forEach(el => el.setAttribute('title', T(el.dataset.tTitle)));
  };
  T.date = (d, opts) => d.toLocaleDateString(lang.locale, opts);
  T.code = code;
  T.lang = lang;
  // In alphabetical order of their own names, as the lists show them
  T.langs = LANGS.slice().sort((a, b) => new Intl.Collator('en').compare(a.name, b.name));
  T.paths = paths;

  // The address of a language: its own folder on the site, or ?lang= in development. The station (#peace, #rain) and
  // the review switches in the query (?clean …) come along.
  // A link to a language that can be written into the page: relative to the site root, which is every page's base
  T.href = target => (paths ? (target === 'en' ? './' : target + '/') : T.url(target));
  T.url = target => {
    if (paths) {
      // every language page has <base href> at the site root, so the root is document.baseURI
      const root = new URL('.', document.baseURI);
      const u = new URL(target === 'en' ? './' : target + '/', root);
      u.search = location.search; u.hash = location.hash;
      return u.href;
    }
    const u = new URL(location.href);
    if (target === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', target);
    return u.href;
  };
  T.choose = target => {
    try { localStorage.setItem('rh-lang', target); } catch (e) {}
    location.href = T.url(target);
  };

  // Text split for the rising title: letters (by grapheme) where letters stand alone, whole words where they join
  T.pieces = text => {
    if (lang.anim === 'words') return text.split(/(\s+)/).filter(Boolean);
    if (window.Intl && Intl.Segmenter) return [...new Intl.Segmenter(lang.locale, { granularity: 'grapheme' }).segment(text)].map(s => s.segment);
    return [...text];
  };

  window.RH_T = T;
})();
