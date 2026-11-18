// ============================================================
//  App: state, page blocks, editing, dialogs, side panel, history
// ============================================================

const STORE_KEY = 'resume-builder-v3';
const OLD_KEYS = { v2: 'resume-builder-v2', v1: 'resume-data-v1' };
const PREFS_KEY = 'resume-builder-ui';
const A4_PX = 297 * 96 / 25.4;
const LUCIDE_URL = 'https://cdn.jsdelivr.net/npm/lucide@0.453.0/dist/umd/lucide.min.js';

// STATE = { version: 3, current, resumes: { [id]: { id, name, lang, docs: { fa?, en? } } } }
let STATE = loadState();
let R, S; // current resume entry, current language document
syncRefs();
let mode = 'edit';
let pages = { live: 1, print: 1 };
const prefs = loadPrefs();

/* ---------- storage ---------- */
function newEntry(name, lang, doc) {
  return { id: uid(), name, lang, docs: { [lang]: doc || blankResume(lang) } };
}
function fixEntry(r) {
  if (!r || typeof r !== 'object') return null;
  const docs = {};
  for (const l of ['fa', 'en']) {
    const d = r.docs?.[l];
    if (!d) continue;
    try { docs[l] = normalize(d.version === 2 ? { ...d, settings: { ...d.settings, lang: l } } : d); } catch (e) {}
  }
  const langs = Object.keys(docs);
  if (!langs.length) return null;
  return { id: str(r.id) || uid(), name: str(r.name), lang: docs[r.lang] ? r.lang : langs[0], docs };
}
function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY));
    if (raw && raw.resumes && typeof raw.resumes === 'object') {
      const resumes = {};
      for (const r of Object.values(raw.resumes)) { const e = fixEntry(r); if (e) resumes[e.id] = e; }
      const ids = Object.keys(resumes);
      if (ids.length) return { version: 3, current: resumes[raw.current] ? raw.current : ids[0], resumes };
    }
  } catch (e) {}
  // data from older versions of this app
  let entry = null;
  try { const v2 = JSON.parse(localStorage.getItem(OLD_KEYS.v2)); if (v2?.docs) entry = fixEntry({ lang: v2.lang, docs: v2.docs }); } catch (e) {}
  if (!entry) try { const v1 = JSON.parse(localStorage.getItem(OLD_KEYS.v1)); if (v1) entry = fixEntry({ lang: 'fa', docs: { fa: v1 } }); } catch (e) {}
  if (!entry) entry = newEntry('', 'en');
  return { version: 3, current: entry.id, resumes: { [entry.id]: entry } };
}
function syncRefs() { R = STATE.resumes[STATE.current]; S = R.docs[R.lang]; }
function loadPrefs() { try { return { tab: 'design', ...JSON.parse(localStorage.getItem(PREFS_KEY)) }; } catch (e) { return { tab: 'design' }; } }
function savePrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {} }

/* ---------- history (undo / redo) + persistence ---------- */
const hist = { undo: [], redo: [], last: null, typing: false, time: 0 };
let storageWarned = false;
function persist(json) {
  try { localStorage.setItem(STORE_KEY, json); }
  catch (e) { if (!storageWarned) { storageWarned = true; toast(t('storageFail')); } }
}
// typing = true groups keystrokes that come quickly into one undo step
function save(typing = false) {
  const json = JSON.stringify(STATE);
  if (json === hist.last) return;
  const now = Date.now();
  if (hist.last !== null && !(typing && hist.typing && now - hist.time < 1500)) {
    hist.undo.push(hist.last);
    if (hist.undo.length > 80) hist.undo.shift();
  }
  hist.typing = typing; hist.time = now; hist.last = json; hist.redo.length = 0;
  persist(json);
  updateHistoryButtons();
}
function restore(json) {
  STATE = JSON.parse(json); hist.last = json; hist.typing = false;
  syncRefs(); persist(json); render();
}
function undo() { if (hist.undo.length) { hist.redo.push(hist.last); restore(hist.undo.pop()); } }
function redo() { if (hist.redo.length) { hist.undo.push(hist.last); restore(hist.redo.pop()); } }
function commit() { save(); render(); }

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const editing = () => mode === 'edit';
const lang = () => S.settings.lang;
const num = n => (lang() === 'fa' ? toFaDigits(n) : String(n));
const tpl = () => TEMPLATES[S.settings.template] || TEMPLATES.classic;
const tr = v => (v && typeof v === 'object' && 'fa' in v ? v[lang()] : v);
function t(key, ...args) {
  let s = UI[key][lang()];
  args.forEach((a, i) => { s = s.replace(`{${i}}`, () => a); });
  return s;
}
const get = p => p.split('.').reduce((o, k) => o?.[k], S) ?? '';
function set(p, v) {
  const ks = p.split('.'); let o = S;
  for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
  o[ks.at(-1)] = v; save(true);
}
const isBlank = it => !Object.values(it).some(v => (typeof v === 'string' ? v.trim() : v && typeof v === 'object'));
const hasContent = s => (PRESETS[s.type].kind === 'text' ? !!s.content.trim() : s.items.some(it => !isBlank(it)));
const resumeName = r => r.name.trim() || r.docs[r.lang].profile.name.trim() || UI.defaultName[r.lang];

function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) e.append(c);
  return e;
}
// replaceChildren that skips null/false (the DOM would print them as text)
const fill = (el, ...kids) => el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false));
function icon(name, cls = 'ic') {
  const s = h('span', { class: cls, 'aria-hidden': 'true' });
  s.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  return s;
}
// Icon from a sanitized shape list (Lucide icons), built without innerHTML
const SVGNS = 'http://www.w3.org/2000/svg';
function nodeIcon(node, cls = 'ic') {
  const span = h('span', { class: cls, 'aria-hidden': 'true' });
  const svg = document.createElementNS(SVGNS, 'svg');
  const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  for (const [k, v] of Object.entries(base)) svg.setAttribute(k, v);
  for (const [tag, attrs] of node) {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    svg.append(el);
  }
  span.append(svg);
  return span;
}
function focusPath(path) {
  const el = document.querySelector(`#page [data-k="${path}"]`);
  if (!el) return;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  el.focus({ preventScroll: true }); caretToEnd(el);
}
function caretToEnd(el) {
  const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
  const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
}
let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 4500);
}
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = h('a', { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- editable field bound to a data path ---------- */
function f(path, ph, { tag = 'div', cls = '', multi = false, sug = null } = {}) {
  const v = get(path);
  if (!editing()) return v.trim() ? h(tag, { class: cls }, v.trim()) : null;
  const e = h(tag, { class: 'f ' + cls, 'data-k': path, 'data-ph': ph, 'data-multi': multi ? '1' : null, 'data-sug': sug, spellcheck: 'false' });
  try { e.contentEditable = 'plaintext-only'; } catch (err) { e.contentEditable = 'true'; }
  if (e.contentEditable !== 'plaintext-only') e.contentEditable = 'true';
  e.textContent = v;
  return e;
}

/* ---------- small controls (edit mode only) ---------- */
function ctrl(buttons, cls) {
  if (!editing()) return null;
  return h('div', { class: 'ctrl ' + cls }, buttons.filter(Boolean).map(([sym, title, fn]) =>
    h('button', { type: 'button', title, 'aria-label': title, class: sym === '×' ? 'danger' : null,
      onclick: e => { e.stopPropagation(); fn(); } }, ICONS[sym] ? icon(sym, 'ci-ic') : sym)));
}
const itemCtrl = (arr, i) => ctrl([
  i > 0 && ['↑', t('up'), () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; commit(); }],
  ['×', t('del'), () => { arr.splice(i, 1); commit(); }],
], 'item-ctrl');
const addBtn = (label, fn, sym = '+') =>
  editing() ? h('button', { type: 'button', class: 'add', onclick: fn }, `${sym} ${label}`) : null;
const showIcons = () => S.settings.icons && !tpl().plain;
function sectionIcon(sec) {
  if (!showIcons() || !sec.icon) return null;
  if (sec.icon.startsWith('lucide:')) return sec.iconNode ? nodeIcon(sec.iconNode, 'sec-ic') : null;
  return icon(sec.icon, 'sec-ic');
}

/* ---------- page blocks used by templates ---------- */
function photoBlock() {
  if (!S.settings.photo || tpl().photo === false) return null;
  const p = S.profile.photo;
  if (!p && !editing()) return null;
  const inner = p ? h('img', { src: p, alt: '' }) : [icon('user', 'ph-ic'), h('span', {}, t('addPhoto'))];
  const cls = 'photo' + (p ? ' has' : '');
  const box = editing()
    ? h('button', { type: 'button', class: cls, title: t('addPhoto'), onclick: () => $('#photoInput').click() }, inner)
    : h('div', { class: cls }, inner);
  return h('div', { class: 'photo-wrap item' }, box,
    p ? ctrl([['×', t('removePhoto'), () => { S.profile.photo = ''; commit(); }]], 'item-ctrl') : null);
}

const identBlock = () => h('div', { class: 'ident' },
  f('profile.name', t('namePh'), { tag: 'h1', cls: 'name' }),
  f('profile.title', t('titlePh'), { cls: 'role', sug: 'jobs' }));

function contactsBlock() {
  const rows = S.contacts.map((c, i) => {
    const ty = CONTACT_TYPES[c.type];
    const ic = tpl().plain ? null : icon(ty.icon);
    if (!editing()) {
      const v = c.value.trim();
      if (!v) return null;
      const url = contactUrl(c);
      return h('div', { class: 'ci' }, ic, url ? h('a', { class: 'cv lt', href: url }, v) : h('span', { class: 'cv lt' }, v));
    }
    return h('div', { class: 'ci item', title: tr(ty.label) }, ic,
      f(`contacts.${i}.value`, tr(ty.ph), { cls: 'cv lt' }), itemCtrl(S.contacts, i));
  }).filter(Boolean);
  if (!rows.length && !editing()) return null;
  return h('div', { class: 'contacts' }, rows, addBtn(t('addContact'), addContact));
}

function personalBlock() {
  const rows = S.personal.map((p, i) => {
    const ty = PERSONAL_TYPES[p.type];
    if (!editing() && !p.value.trim()) return null;
    const label = p.type === 'custom'
      ? f(`personal.${i}.label`, t('labelPh'), { tag: 'span', cls: 'pl' })
      : h('span', { class: 'pl' }, tr(ty.label));
    const value = f(`personal.${i}.value`, tr(ty.ph), { tag: 'span', cls: 'pv', sug: ty.sug });
    return h('div', { class: 'pi' + (editing() ? ' item' : '') }, tpl().plain ? null : icon(ty.icon),
      h('div', { class: 'pt' }, label, value), itemCtrl(S.personal, i));
  }).filter(Boolean);
  if (!rows.length && !editing()) return null;
  return h('div', { class: 'personal' }, rows, addBtn(t('addPersonal'), addPersonal));
}

const groupBlock = (title, block, ic) => block
  ? h('section', { class: 'sec grp' }, h('h2', { class: 'sec-title' + (showIcons() ? ' has-ic' : '') },
      showIcons() ? icon(ic, 'sec-ic') : null, h('span', {}, title)), block)
  : null;

const sectionsBlock = col => S.sections.filter(s => col == null || s.col === col).map(sectionBlock);

function sectionBlock(sec) {
  if (!editing() && (sec.hidden || !hasContent(sec))) return null;
  const i = S.sections.indexOf(sec), P = PRESETS[sec.type], base = `sections.${i}`;
  const body = P.kind === 'text' ? f(`${base}.content`, tr(P.ph), { cls: 'txt', multi: true })
    : P.kind === 'skills' ? skillsBody(sec, base) : entriesBody(sec, base);
  const titleText = editing() ? f(`${base}.title`, t('secTitlePh'), { tag: 'span' }) : h('span', {}, sec.title);
  const ic = sectionIcon(sec);
  return h('section', { class: `sec k-${P.kind} t-${sec.type}` + (P.kind === 'skills' ? ' st-' + skillStyle(sec) : '') + (sec.hidden ? ' is-hidden' : '') },
    h('h2', { class: 'sec-title' + (ic ? ' has-ic' : '') }, ic, titleText,
      sec.hidden ? h('small', { class: 'hidden-badge' }, t('hiddenNote')) : null),
    body, sectionCtrl(sec, i));
}

function entriesBody(sec, base) {
  const P = PRESETS[sec.type], ph = P.ph[lang()];
  const items = sec.items.map((it, j) => {
    if (!editing() && isBlank(it)) return null;
    const p = `${base}.items.${j}`;
    const sub = f(`${p}.sub`, ph.sub, { tag: 'span', cls: 'e-sub' });
    const extra = 'extra' in ph ? f(`${p}.extra`, ph.extra, { tag: 'span', cls: 'e-extra' }) : null;
    const meta = [sub, sub && extra && !editing() ? h('span', { class: 'e-dot' }, '·') : null, extra].filter(Boolean);
    return h('div', { class: 'entry item' },
      h('div', { class: 'e-head' }, f(`${p}.title`, ph.title, { cls: 'e-title', sug: P.titleSug }), P.date ? dateEl(it, P.date, ph.period) : null),
      meta.length ? h('div', { class: 'e-meta' }, meta) : null,
      f(`${p}.desc`, ph.desc, { cls: 'e-desc', multi: true }),
      itemCtrl(sec.items, j));
  });
  return [h('div', { class: P.kind === 'timeline' ? 'tl' : 'list' }, items),
    addBtn(t('addItem'), () => { sec.items.push(newItem(P.kind)); commit(); focusPath(`${base}.items.${sec.items.length - 1}.title`); })];
}

function dateEl(it, dateMode, ph) {
  const text = formatPeriod(it, lang());
  if (!editing()) return text ? h('div', { class: 'e-date' }, text) : null;
  return h('button', { type: 'button', class: 'e-date date-btn' + (text ? '' : ' empty'), onclick: () => datePicker(it, dateMode) }, text || ph);
}

const skillStyle = sec => (tpl().plain && sec.style !== 'tags' ? 'text' : sec.style);

function skillsBody(sec, base) {
  const P = PRESETS[sec.type], labels = SCALES[P.scale][lang()], style = skillStyle(sec);
  const items = sec.items.map((it, j) => {
    if (!editing() && !it.name.trim()) return null;
    const p = `${base}.items.${j}`;
    const name = f(`${p}.name`, style === 'tags' ? t('tagPh') : t('skillPh'), { tag: 'span', cls: 'sk-name', sug: P.sug });
    if (style === 'tags') {
      return h('span', { class: 'tag' }, name, editing()
        ? h('button', { type: 'button', class: 'tag-x', title: t('del'), onclick: () => { sec.items.splice(j, 1); commit(); } }, '×') : null);
    }
    const top = h('div', { class: 'sk-top' }, name);
    let below = null;
    if (style === 'bar') { top.append(h('span', { class: 'sk-lvl' }, labels[it.level - 1])); below = levelEl(it, labels, 'bar'); }
    else if (style === 'dots') top.append(levelEl(it, labels, 'dots'));
    else top.append(editing()
      ? h('button', { type: 'button', class: 'sk-lvl lvl-btn', title: t('changeLevel'), onclick: () => { it.level = it.level % 5 + 1; commit(); } }, labels[it.level - 1])
      : h('span', { class: 'sk-lvl' }, labels[it.level - 1]));
    return h('div', { class: 'skill item' }, top, below, itemCtrl(sec.items, j));
  });
  const adds = editing() ? h('div', { class: 'adds' },
    addBtn(t('addItem'), () => { sec.items.push(newItem('skills')); commit(); focusPath(`${base}.items.${sec.items.length - 1}.name`); }),
    P.sug ? addBtn(t('suggestions'), () => addSuggestions(sec), '✦') : null) : null;
  return [h('div', { class: style === 'tags' ? 'tags' : 'skills' }, items), adds];
}

function levelEl(it, labels, style) {
  return h('div', { class: style, role: editing() ? 'group' : 'img', 'aria-label': labels[it.level - 1] }, labels.map((lbl, k) => editing()
    ? h('button', { type: 'button', class: 'seg' + (k < it.level ? ' on' : ''), title: lbl, 'aria-label': lbl, onclick: () => { it.level = k + 1; commit(); } })
    : h('span', { class: 'seg' + (k < it.level ? ' on' : '') })));
}

function sectionCtrl(sec, i) {
  const P = PRESETS[sec.type];
  return ctrl([
    ['↑', t('up'), () => moveSection(i, -1)],
    ['↓', t('down'), () => moveSection(i, 1)],
    tpl().cols === 2 && ['⇄', t('swapCol'), () => { sec.col = sec.col === 'main' ? 'side' : 'main'; commit(); }],
    P.kind === 'skills' && !tpl().plain && ['◐', t('levelStyle'), async () => {
      const k = await pick(t('levelStyle'), Object.entries(SKILL_STYLES).map(([key, lbl]) => ({ key, label: tr(lbl), current: key === sec.style })));
      if (k) { sec.style = k; commit(); }
    }],
    showIcons() && ['✦', t('secIcon'), () => pickIcon(sec)],
    TIPS[sec.type] && ['bulb', t('tips'), () => showTips(sec)],
    [sec.hidden ? 'eye' : 'eyeOff', sec.hidden ? t('show') : t('hide'), () => { sec.hidden = !sec.hidden; commit(); }],
    ['×', t('del'), () => {
      if (!hasContent(sec) || confirm(t('delSecConfirm', sec.title))) { S.sections.splice(i, 1); commit(); }
    }],
  ], 'sec-ctrl');
}

const addSectionBtn = col => editing()
  ? h('button', { type: 'button', class: 'add add-sec', onclick: () => addSection(col) }, '+ ' + t('addSection')) : null;

const BLOCKS = {
  photo: photoBlock, ident: identBlock, contacts: contactsBlock, personal: personalBlock,
  group: groupBlock, sections: sectionsBlock, addSection: addSectionBtn,
};

/* ---------- actions ---------- */
function moveSection(i, d) {
  const one = tpl().cols === 1, col = S.sections[i].col;
  for (let j = i + d; j >= 0 && j < S.sections.length; j += d) {
    if (one || S.sections[j].col === col) {
      [S.sections[i], S.sections[j]] = [S.sections[j], S.sections[i]];
      commit(); return;
    }
  }
}

async function addSection(col) {
  const used = new Set(S.sections.map(s => s.type));
  const key = await pick(t('pickSection'), Object.entries(PRESETS).map(([k, p]) => ({ key: k, label: tr(p.title), icon: p.icon, disabled: !p.multi && used.has(k) })));
  if (!key) return;
  const s = newSection(key, lang());
  if (col) s.col = col;
  S.sections.push(s); commit();
  const kind = PRESETS[key].kind;
  focusPath(`sections.${S.sections.length - 1}.` + (kind === 'text' ? 'content' : kind === 'skills' ? 'items.0.name' : 'items.0.title'));
}

async function addContact() {
  const used = new Set(S.contacts.map(c => c.type));
  const key = await pick(t('pickContact'), Object.entries(CONTACT_TYPES).map(([k, c]) => ({ key: k, label: tr(c.label), icon: c.icon, disabled: !c.multi && used.has(k) })));
  if (!key) return;
  S.contacts.push({ type: key, value: '' }); commit();
  focusPath(`contacts.${S.contacts.length - 1}.value`);
}

async function addPersonal() {
  const used = new Set(S.personal.map(p => p.type));
  const key = await pick(t('pickPersonal'), Object.entries(PERSONAL_TYPES).map(([k, p]) => ({ key: k, label: tr(p.label), icon: p.icon, disabled: !p.multi && used.has(k) })));
  if (!key) return;
  S.personal.push({ type: key, label: '', value: '' }); commit();
  focusPath(`personal.${S.personal.length - 1}.` + (key === 'custom' ? 'label' : 'value'));
}

async function addSuggestions(sec) {
  const P = PRESETS[sec.type];
  const existing = new Set(sec.items.map(it => it.name.trim().toLowerCase()).filter(Boolean));
  const picked = await pickMany(sec.title || tr(P.title), SUGGEST[P.sug][lang()], existing);
  if (!picked.length) return;
  sec.items = sec.items.filter(it => it.name.trim());
  sec.items.push(...picked.map(name => ({ name, level: 3 })));
  commit();
}

function showTips(sec) {
  const list = TIPS[sec.type][lang()];
  const body = h('ul', { class: 'tips' }, list.map(s => h('li', {}, s)));
  openDialog(`${t('tips')} — ${sec.title}`, body, [h('button', { type: 'button', class: 'btn primary', onclick: () => dlg.close() }, t('ok'))], null);
}

function switchLang(l) {
  if (l === R.lang) return;
  const fresh = !R.docs[l];
  if (fresh) R.docs[l] = translateResume(S, l);
  R.lang = l; syncRefs();
  commit();
  if (fresh) toast(t('newLang'));
}

/* ---------- dialogs ---------- */
const dlg = $('#dlg');
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

function openDialog(title, body, foot, onClose, bodyCls = '', dlgCls = '') {
  $('#dlgTitle').textContent = title;
  $('#dlgBody').className = 'dlg-body ' + bodyCls;
  $('#dlgBody').replaceChildren(body);
  $('#dlgFoot').replaceChildren(...foot);
  dlg.className = dlgCls;
  dlg.onclose = onClose;
  if (!dlg.open) dlg.showModal();
}

// Single choice → key or null
function pick(title, options, cls = '') {
  return new Promise(resolve => {
    let done = false;
    const finish = v => { if (done) return; done = true; dlg.close(); resolve(v); };
    const body = h('div', { class: 'opts' }, options.map(o => h('button', {
      type: 'button', class: 'opt' + (o.current ? ' current' : ''), disabled: o.disabled ? '' : null, title: o.label || o.key,
      onclick: () => finish(o.key),
    }, o.icon ? icon(o.icon) : null, o.label ? h('span', {}, o.label) : null, o.disabled ? h('small', {}, t('added')) : null)));
    openDialog(title, body, [h('button', { type: 'button', class: 'btn', onclick: () => finish(null) }, t('cancel'))], () => finish(null), cls);
  });
}

// Multiple choice from grouped chips → array of names
function pickMany(title, groups, existing) {
  return new Promise(resolve => {
    let done = false;
    const chosen = new Set();
    const finish = v => { if (done) return; done = true; dlg.close(); resolve(v); };
    const ok = h('button', { type: 'button', class: 'btn primary', onclick: () => finish([...chosen]) });
    const update = () => { ok.disabled = !chosen.size; ok.textContent = t('addSelected') + (chosen.size ? ` (${num(chosen.size)})` : ''); };
    const body = h('div', {}, groups.map(g => h('div', { class: 'grp' },
      g.name ? h('h4', {}, g.name) : null,
      h('div', { class: 'chips' }, g.items.map(name => {
        const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', disabled: existing.has(name.trim().toLowerCase()) ? '' : null,
          onclick: () => { chosen.has(name) ? chosen.delete(name) : chosen.add(name); b.setAttribute('aria-pressed', chosen.has(name)); update(); } }, name);
        return b;
      })))));
    openDialog(title, body, [h('button', { type: 'button', class: 'btn', onclick: () => finish([]) }, t('cancel')), ok], () => finish([]));
    update();
  });
}

/* ---------- section icon picker: built-in set + Lucide library ---------- */
let lucidePromise = null;
function loadLucide() {
  if (window.lucide?.icons) return Promise.resolve(window.lucide.icons);
  if (!lucidePromise) {
    lucidePromise = new Promise((resolve, reject) => {
      const s = h('script', { src: LUCIDE_URL });
      s.onload = () => (window.lucide?.icons ? resolve(window.lucide.icons) : reject(new Error('no icons')));
      s.onerror = () => { lucidePromise = null; s.remove(); reject(new Error('load failed')); };
      document.head.append(s);
    });
  }
  return lucidePromise;
}
const kebab = n => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
// Lucide icon definitions are [[tag, attrs], …] (older builds wrap them as ['svg', attrs, children])
const lucideShapes = def => sanitizeIconNode(Array.isArray(def) && def[0] === 'svg' ? def[2] : def);

function pickIcon(sec) {
  let tab = sec.icon?.startsWith('lucide:') ? 'lib' : 'basic';
  const choose = (name, node = null) => { sec.icon = name; sec.iconNode = node; dlg.close(); commit(); };
  const tabs = h('div', { class: 'dlg-tabs', role: 'tablist' });
  const content = h('div', { class: 'icon-pane' });
  const drawTabs = () => tabs.replaceChildren(...[['basic', t('iconsBasic')], ['lib', t('iconsLibrary')]].map(([k, lbl]) =>
    h('button', { type: 'button', class: 'dtab', role: 'tab', 'aria-selected': tab === k, onclick: () => { tab = k; drawTabs(); drawContent(); } }, lbl)));
  const drawContent = () => {
    if (tab === 'basic') {
      content.replaceChildren(h('div', { class: 'icon-opts' },
        h('button', { type: 'button', class: 'opt none-opt' + (!sec.icon ? ' current' : ''), onclick: () => choose('') }, t('noIcon')),
        SECTION_ICONS.map(name => h('button', { type: 'button', class: 'opt' + (sec.icon === name ? ' current' : ''), title: name, onclick: () => choose(name) }, icon(name)))));
      return;
    }
    content.replaceChildren(h('p', { class: 'muted' }, t('loadingIcons')));
    loadLucide().then(all => {
      if (tab !== 'lib') return;
      const names = Object.keys(all).filter(n => /^[A-Z]/.test(n)).sort();
      const search = h('input', { type: 'search', class: 'dp-text', placeholder: t('searchIcons'), dir: 'ltr' });
      const count = h('small', { class: 'muted' });
      const grid = h('div', { class: 'icon-opts' });
      const draw = () => {
        const q = search.value.trim().toLowerCase().replace(/\s+/g, '-');
        const list = names.filter(n => !q || kebab(n).includes(q));
        count.textContent = t('iconsCount', num(list.length));
        fill(grid, list.slice(0, 300).map(n => {
          const node = lucideShapes(all[n]);
          return node ? h('button', { type: 'button', class: 'opt' + (sec.icon === 'lucide:' + n ? ' current' : ''), title: kebab(n), onclick: () => choose('lucide:' + n, node) }, nodeIcon(node)) : null;
        }));
      };
      search.addEventListener('input', draw);
      content.replaceChildren(h('div', { class: 'icon-search' }, icon('search', 'search-ic'), search), count, grid, h('p', { class: 'muted credit' }, t('iconsCredit')));
      draw(); search.focus();
    }).catch(() => { if (tab === 'lib') content.replaceChildren(h('p', { class: 'muted' }, t('iconsOffline'))); });
  };
  drawTabs(); drawContent();
  openDialog(t('secIcon'), h('div', {}, tabs, content), [h('button', { type: 'button', class: 'btn', onclick: () => dlg.close() }, t('cancel'))], null, '', 'icon-dlg');
}

/* ---------- date picker ---------- */
// Compact dropdown whose list opens inline below it (fixed height, scrollable)
let openDropdown = null;
function dropdown({ placeholder, options, getValue, onChange, near }) {
  const wrap = h('div', { class: 'dd' });
  let open = false;
  const api = {
    el: wrap,
    close() { if (open) { open = false; draw(); } },
    redraw() { draw(); },
  };
  function draw() {
    const v = getValue();
    const cur = options.find(o => o.value === v);
    const btn = h('button', { type: 'button', class: 'dd-btn' + (cur ? '' : ' empty'), 'aria-expanded': open, onclick: () => {
      if (!open && openDropdown && openDropdown !== api) openDropdown.close();
      open = !open; openDropdown = open ? api : null; draw();
    } }, h('span', {}, cur ? cur.label : placeholder), icon('chevron', 'dd-chev'));
    const list = open ? h('div', { class: 'dd-list', role: 'listbox' }, options.map(o =>
      h('button', { type: 'button', role: 'option', class: 'dd-opt' + (o.value === v ? ' on' : '') + (o.strong ? ' strong' : ''), 'aria-selected': o.value === v,
        'data-near': o.value === near ? '' : null,
        onclick: () => { open = false; openDropdown = null; onChange(o.value); draw(); } }, o.label))) : null;
    fill(wrap, btn, list);
    if (list) {
      const on = list.querySelector('.on') || (v == null ? list.querySelector('[data-near]') : null);
      if (on) list.scrollTop = on.offsetTop - list.clientHeight / 2 + on.offsetHeight / 2;
    }
  }
  draw();
  return api;
}

// Year + month side by side; month list starts with "year only"
function ymPicker(getV, setV) {
  const l = lang(), now = currentYM(l);
  const years = [];
  for (let y = now.y + 6; y >= now.y - 70; y--) years.push({ value: y, label: num(y) });
  const cur = getV()?.y;
  if (cur && !years.some(o => o.value === cur)) years.push({ value: cur, label: num(cur) });
  const months = [{ value: 0, label: t('yearOnly'), strong: true }, ...MONTHS[l].map((m, k) => ({ value: k + 1, label: m }))];
  const yearDD = dropdown({ placeholder: t('year'), options: years, near: now.y, getValue: () => getV()?.y,
    onChange: y => { setV({ y, m: getV()?.m || 0 }); monthDD.redraw(); } });
  const monthDD = dropdown({ placeholder: t('month'), options: months, getValue: () => getV()?.m,
    onChange: m => { setV({ y: getV()?.y || now.y, m }); yearDD.redraw(); } });
  return h('div', { class: 'ym-row' }, yearDD.el, monthDD.el);
}

function datePicker(it, dateMode) {
  let start = it.start ? { ...it.start } : null;
  let end = it.end && it.end !== 'present' ? { ...it.end } : null;
  let endMode = it.end === 'present' ? 'present' : it.end ? 'date' : 'none';
  let showCustom = !it.start && !!it.period.trim();
  const err = h('p', { class: 'dp-err', hidden: '' }, t('endBeforeStart'));
  const custom = h('input', { type: 'text', class: 'dp-text', value: it.start ? '' : it.period, placeholder: '…' });
  const body = h('div', { class: 'dp' });
  const validate = () => { err.hidden = !(start && endMode === 'date' && end && ymValue(end, true) < ymValue(start)); };
  const draw = () => {
    openDropdown = null;
    fill(body,
      h('div', { class: 'dp-sec' }, h('h4', {}, dateMode === 'range' ? t('start') : t('date')), ymPicker(() => start, v => { start = v; validate(); })),
      dateMode === 'range' ? h('div', { class: 'dp-sec' },
        h('div', { class: 'dp-row' }, h('h4', {}, t('end')),
          h('div', { class: 'seg-ctl sm' }, [['none', t('noEnd')], ['present', t('present')], ['date', t('onDate')]].map(([k, lbl]) =>
            h('button', { type: 'button', 'aria-pressed': endMode === k, onclick: () => { endMode = k; draw(); } }, lbl)))),
        endMode === 'date' ? ymPicker(() => end, v => { end = v; validate(); }) : null) : null,
      err,
      showCustom
        ? h('label', { class: 'dp-custom' }, h('span', {}, t('customText')), custom)
        : h('button', { type: 'button', class: 'link-btn', onclick: () => { showCustom = true; draw(); custom.focus(); } }, '+ ' + t('customText')));
    validate();
  };
  draw();
  const finish = () => {
    if (!err.hidden) return;
    if (start) {
      it.start = start;
      it.end = dateMode !== 'range' ? null : endMode === 'present' ? 'present' : endMode === 'date' && end ? end : null;
      it.period = '';
    } else {
      it.start = null; it.end = null; it.period = custom.value.trim();
    }
    dlg.close(); commit();
  };
  openDialog(dateMode === 'range' ? `${t('start')} / ${t('end')}` : t('date'), body, [
    h('button', { type: 'button', class: 'btn danger-btn', onclick: () => { it.start = null; it.end = null; it.period = ''; dlg.close(); commit(); } }, t('clearDate')),
    h('span', { class: 'grow' }),
    h('button', { type: 'button', class: 'btn', onclick: () => dlg.close() }, t('cancel')),
    h('button', { type: 'button', class: 'btn primary', onclick: finish }, t('ok')),
  ], null, '', 'date-dlg');
}

/* ---------- suggestions popup: categories as an accordion, filtered while typing ---------- */
const sugBox = $('#sug');
let sugEl = null, sugOpenGroup = null;

function showSug(el) {
  const groups = SUGGEST[el.dataset.sug]?.[lang()] || [];
  if (!groups.length) return hideSug();
  if (sugEl !== el) { sugOpenGroup = null; sugBox.scrollTop = 0; }
  sugEl = el;
  const q = el.innerText.trim().toLowerCase();
  const opt = s => h('button', { type: 'button', class: 'sug-opt', tabindex: '-1', onmousedown: e => { e.preventDefault(); applySug(s); } }, s);
  let content;
  if (!q) {
    content = groups.length === 1 ? groups[0].items.map(opt) : groups.map((g, gi) => [
      h('button', { type: 'button', class: 'sug-head', tabindex: '-1', 'aria-expanded': sugOpenGroup === gi,
        onmousedown: e => { e.preventDefault(); sugOpenGroup = sugOpenGroup === gi ? null : gi; showSug(el); } },
        h('span', {}, g.name), h('small', {}, num(g.items.length)), icon('chevron', 'sug-chev')),
      sugOpenGroup === gi ? h('div', { class: 'sug-items' }, g.items.map(opt)) : null]);
  } else {
    const matches = groups.map(g => ({ name: g.name, items: g.items.filter(s => s.trim().toLowerCase() !== q && s.toLowerCase().includes(q)) }))
      .filter(g => g.items.length);
    if (!matches.length) return hideSug();
    content = matches.map(g => [g.name && matches.length > 1 ? h('div', { class: 'sug-label' }, g.name) : null, g.items.map(opt)]);
  }
  const keep = sugBox.scrollTop;
  sugBox.replaceChildren(...[content].flat(Infinity).filter(Boolean));
  placeSug(el);
  sugBox.hidden = false;
  sugBox.scrollTop = keep;
  sugBox.querySelector('.sug-head[aria-expanded="true"]')?.scrollIntoView({ block: 'nearest' });
}
function placeSug(el) {
  const r = el.getBoundingClientRect();
  const top = $('.topbar').getBoundingClientRect().bottom;
  const below = innerHeight - r.bottom, above = r.top - top;
  const up = below < 240 && above > below;
  sugBox.style.maxHeight = Math.max(150, Math.min(380, (up ? above : below) - 14)) + 'px';
  sugBox.style.top = up ? 'auto' : r.bottom + 4 + 'px';
  sugBox.style.bottom = up ? innerHeight - r.top + 4 + 'px' : 'auto';
  // fixed width so the box doesn't jump when a category opens
  const vw = document.documentElement.clientWidth, w = Math.min(Math.max(270, Math.min(r.width, 340)), vw - 16);
  sugBox.style.width = w + 'px';
  if (lang() === 'fa') { sugBox.style.right = Math.max(8, Math.min(vw - r.right, vw - w - 8)) + 'px'; sugBox.style.left = 'auto'; }
  else { sugBox.style.left = Math.max(8, Math.min(r.left, vw - w - 8)) + 'px'; sugBox.style.right = 'auto'; }
}
function hideSug() { sugBox.hidden = true; sugEl = null; }
function applySug(s) {
  const el = sugEl; if (!el) return;
  el.textContent = s; set(el.dataset.k, s); hideSug(); caretToEnd(el); checkFit();
}
function moveSug(d) {
  const opts = [...sugBox.querySelectorAll('.sug-head, .sug-opt')];
  if (!opts.length) return;
  const cur = opts.findIndex(o => o.classList.contains('on'));
  const next = (cur + d + opts.length) % opts.length;
  opts.forEach((o, k) => o.classList.toggle('on', k === next));
  opts[next].scrollIntoView({ block: 'nearest' });
}
// keep the list open while the on-screen keyboard scrolls/resizes the page
addEventListener('scroll', e => {
  if (e.target === sugBox || !sugEl) return;
  if (document.activeElement === sugEl) placeSug(sugEl); else hideSug();
}, true);

/* ---------- fonts (loaded on demand from Google Fonts) ---------- */
const loadedFonts = new Set(['vazir', 'inter']);
function loadFont(key) {
  if (loadedFonts.has(key)) return;
  loadedFonts.add(key);
  const F = FONTS[key];
  const link = h('link', { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?family=${F.family.replace(/ /g, '+')}:wght@${F.w}&display=swap` });
  link.onload = () => document.fonts?.ready.then(checkFit);
  document.head.append(link);
}

/* ---------- rendering ---------- */
function applyPageVars(el) {
  const st = S.settings;
  el.className = `page tpl-${st.template} ${editing() ? 'editing' : 'viewing'}` + (st.photoShape !== 'auto' ? ' ph-' + st.photoShape : '');
  el.style.setProperty('--accent', st.accent);
  el.style.setProperty('--font', FONTS[st.font].css);
  el.style.setProperty('--fs', (9.6 * st.size / 100).toFixed(2) + 'pt');
  el.style.setProperty('--ic-scale', (st.iconSize / 100).toFixed(2));
  el.style.setProperty('--sp', (st.spacing / 100).toFixed(2));
  el.style.setProperty('--pages', pages.live);
  el.style.setProperty('--print-pages', pages.print);
}
const buildPage = () => tpl().render(BLOCKS).flat(Infinity).filter(Boolean);

function render() {
  const root = document.documentElement;
  root.lang = lang(); root.dir = lang() === 'fa' ? 'rtl' : 'ltr';
  root.style.setProperty('--accent', S.settings.accent);
  document.title = `${t('brand')} — ${resumeName(R)}`;
  loadFont(S.settings.font);
  hideSug();
  const page = $('#page');
  applyPageVars(page);
  page.replaceChildren(...buildPage());
  drawBreaks();
  renderChrome();
  renderCheck();
  fitZoom();
  checkFit();
}

// Shrink the A4 page to fit narrow screens
function fitZoom() {
  const avail = $('#stage').clientWidth - 24;
  const z = Math.min(1, avail / (210 * 96 / 25.4));
  $('#page').style.zoom = z < 1 ? z.toFixed(3) : '';
}
addEventListener('resize', () => { if (sugEl && document.activeElement === sugEl) placeSug(sugEl); else hideSug(); fitZoom(); });

// Dashed lines where each A4 page ends (screen only)
function drawBreaks() {
  const page = $('#page');
  page.querySelectorAll(':scope > .pbreak').forEach(e => e.remove());
  for (let k = 1; k < pages.live; k++) {
    page.append(h('div', { class: 'pbreak', style: `top:${k * 297}mm` }, h('span', {}, t('pageN', num(k + 1)))));
  }
}

// The page grows by whole A4 pages to fit its content. The print size comes from an
// off-screen copy in view mode; while editing, the live page may need extra room for
// placeholders and buttons, so it is measured too.
let fitTimer;
// builds an off-screen copy and returns how many A4 pages it needs { print, live }
function measurePages(printOnly = false) {
  const m = $('#measure'), prev = mode;
  mode = 'view';
  try { applyPageVars(m); m.classList.add('measuring'); m.replaceChildren(...buildPage()); }
  finally { mode = prev; }
  // each page break in print repeats column padding and moves whole entries down: allow ~28mm per break
  const count = px => {
    let n = Math.max(1, Math.ceil(px / A4_PX - 0.003));
    for (let i = 0; i < 3; i++) n = Math.max(n, Math.ceil((px + (n - 1) * 28 * 96 / 25.4) / A4_PX - 0.003));
    return n;
  };
  const print = count(m.getBoundingClientRect().height);
  let live = print;
  if (editing() && !printOnly) {
    try { applyPageVars(m); m.classList.add('measuring'); m.replaceChildren(...buildPage()); }
    catch (e) {}
    live = Math.max(print, Math.max(1, Math.ceil(m.getBoundingClientRect().height / A4_PX - 0.003)));
  }
  m.replaceChildren();
  return { print, live };
}

function checkFit() {
  clearTimeout(fitTimer);
  fitTimer = setTimeout(() => {
    const { print: printPages, live: livePages } = measurePages();
    const changed = livePages !== pages.live || printPages !== pages.print;
    pages = { live: livePages, print: printPages };
    const page = $('#page');
    page.style.setProperty('--pages', pages.live);
    page.style.setProperty('--print-pages', pages.print);
    if (changed) drawBreaks();
    $('#pageInfo').hidden = pages.print < 2;
    $('#pageCount').textContent = t('pageCount', num(pages.print));
    renderCheck();
  }, 150);
}

// shrink spacing first, then text size, until the PDF fits on one page
function fitOnePage() {
  const st = S.settings, orig = { size: st.size, spacing: st.spacing };
  const tries = [];
  for (let sp = orig.spacing; sp >= 75; sp -= 5) tries.push([orig.size, sp]);
  for (let sz = orig.size - 2; sz >= 85; sz -= 2) tries.push([sz, Math.min(orig.spacing, 75)]);
  const hit = tries.find(([size, spacing]) => { st.size = size; st.spacing = spacing; return measurePages(true).print === 1; });
  if (!hit) { Object.assign(st, orig); toast(t('fitFail')); return; }
  commit();
  toast(t('fitDone'));
}

/* ---------- toolbar & side panel ---------- */
function renderChrome() {
  document.querySelectorAll('[data-t]').forEach(e => { e.textContent = t(e.dataset.t); });
  document.querySelectorAll('[data-tt]').forEach(e => { e.title = t(e.dataset.tt); e.setAttribute('aria-label', t(e.dataset.tt)); });
  $('#btnPreview .lbl').textContent = editing() ? t('preview') : t('edit');
  $('#btnPreview').setAttribute('aria-pressed', !editing());
  document.querySelectorAll('#langs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang()));
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === prefs.tab));
  document.querySelectorAll('.tab-pane').forEach(p => { p.hidden = p.dataset.pane !== prefs.tab; });
  updateHistoryButtons();
  renderDesign();
  renderFiles();
}

function updateHistoryButtons() {
  $('#btnUndo').disabled = !hist.undo.length;
  $('#btnRedo').disabled = !hist.redo.length;
}

let designLang = null;
function renderDesign() {
  const st = S.settings;
  $('#tpls').replaceChildren(...Object.entries(TEMPLATES).map(([k, T]) => h('button', {
    type: 'button', class: 'tpl-btn', 'aria-pressed': k === st.template, onclick: () => { st.template = k; commit(); },
  }, h('span', { class: 'thumb th-' + k }), h('span', {}, tr(T.name)))));
  $('#swatches').replaceChildren(...COLORS.map(c => h('button', {
    type: 'button', class: 'swatch', style: `background:${c}`, 'aria-label': c, 'aria-pressed': c === st.accent,
    onclick: () => { st.accent = c; commit(); },
  })));
  if (document.activeElement !== $('#colorPick')) $('#colorPick').value = st.accent;
  if (document.activeElement !== $('#colorHex')) $('#colorHex').value = st.accent;
  if (designLang !== lang()) {
    designLang = lang();
    $('#fontSel').replaceChildren(...Object.entries(FONTS).filter(([, F]) => F.langs.includes(designLang))
      .map(([k, F]) => h('option', { value: k }, tr(F.label))));
  }
  $('#fontSel').value = st.font;
  $('#sizeRange').value = st.size;
  $('#sizeOut').textContent = num(st.size) + '%';
  $('#spaceRange').value = st.spacing;
  $('#spaceOut').textContent = num(st.spacing) + '%';
  $('#photoChk').checked = st.photo;
  $('#iconsChk').checked = st.icons;
  $('#iconSize').value = st.iconSize;
  $('#iconSizeOut').textContent = num(st.iconSize) + '%';
  $('#iconSizeRow').hidden = !st.icons;
  $('#photoShape').replaceChildren(...[['auto', 'shapeAuto'], ['circle', 'shapeCircle'], ['rounded', 'shapeRounded'], ['square', 'shapeSquare']]
    .map(([k, key]) => h('button', { type: 'button', 'aria-pressed': st.photoShape === k, onclick: () => { st.photoShape = k; commit(); } }, t(key))));
  $('#photoRow').hidden = tpl().photo === false;
}

let guideOpen = false;
function renderCheck() {
  const { issues, score, dismissedCount } = reviewResume(S, pages.print);
  const prog = completeness(S);
  const tx = m => m[lang()];
  const important = issues.filter(i => i.level !== 'tip').length;
  document.querySelectorAll('.check-badge').forEach(b => { b.textContent = important ? num(important) : ''; b.hidden = !important; });
  // progress in the top bar
  $('#progFill').style.width = prog.pct + '%';
  $('#progText').textContent = num(prog.pct) + '%';
  $('#btnProgress').title = `${t('progress')}: ${num(prog.done)}/${num(prog.total)}`;
  $('#btnProgress').className = 'progress ' + (prog.pct >= 90 ? 'good' : prog.pct >= 60 ? 'ok' : 'low');

  const level = score >= 85 ? 'good' : score >= 60 ? 'ok' : 'low';
  const list = issues.length
    ? h('ul', { class: 'issues' }, issues.map(i => h('li', { class: 'issue ' + i.level },
        icon(i.level === 'tip' ? 'bulb' : 'alert', 'iss-ic'),
        h('div', { class: 'iss-body' },
          h('small', { class: 'iss-lv' }, tx(i.level === 'error' ? MSG.lvError : i.level === 'warn' ? MSG.lvWarn : MSG.lvTip)),
          h('p', {}, i.msg),
          h('div', { class: 'iss-act' },
            i.focus ? h('button', { type: 'button', class: 'btn sm', onclick: () => goTo(i.focus) }, tx(MSG.go)) : null,
            i.fix ? h('button', { type: 'button', class: 'btn sm primary', onclick: () => { i.fix.run(); commit(); } }, i.fix.label) : null,
            i.level !== 'error' ? h('button', { type: 'button', class: 'link-btn sm', onclick: () => { S.settings.dismissed.push(i.msg); commit(); } }, t('dismiss')) : null)))))
    : h('p', { class: 'all-good' }, icon('check', 'iss-ic'), tx(MSG.allGood));
  fill($('#checkPane'),
    h('div', { class: 'card' },
      h('div', { class: 'card-top' }, h('span', {}, t('progress')), h('strong', {}, `${num(prog.done)}/${num(prog.total)}`)),
      h('div', { class: 'meter ' + (prog.pct >= 90 ? 'good' : prog.pct >= 60 ? 'ok' : 'low') }, h('span', { style: `width:${prog.pct}%` })),
      h('ul', { class: 'steps' }, prog.list.map(s => h('li', { class: s.ok ? 'done' : '' }, icon(s.ok ? 'check' : 'info', 'step-ic'), s.label)))),
    h('div', { class: 'card' },
      h('div', { class: 'card-top' }, h('span', {}, tx(MSG.score)), h('strong', {}, num(score))),
      h('div', { class: 'meter ' + level }, h('span', { style: `width:${score}%` }))),
    list,
    dismissedCount ? h('button', { type: 'button', class: 'link-btn', onclick: () => { S.settings.dismissed = []; commit(); } }, t('showDismissed', num(dismissedCount))) : null,
    h('details', { class: 'guide', open: guideOpen ? '' : null, ontoggle: e => { guideOpen = e.target.open; } }, h('summary', {}, tx(MSG.guide)), h('ul', {}, GUIDE[lang()].map(s => h('li', {}, s)))));
}

function goTo(path) {
  closePanel();
  if (!editing()) { mode = 'edit'; render(); }
  setTimeout(() => focusPath(path), 50);
}

function renderFiles() {
  const rows = Object.values(STATE.resumes).map(r => h('li', { class: 'res' + (r.id === STATE.current ? ' on' : '') },
    h('button', { type: 'button', class: 'res-main', onclick: () => { STATE.current = r.id; syncRefs(); commit(); } },
      h('span', { class: 'res-name' }, resumeName(r)),
      h('span', { class: 'res-langs' }, Object.keys(r.docs).map(l => h('span', { class: 'lang-chip' + (l === r.lang ? ' on' : '') }, l.toUpperCase()))))));
  $('#resList').replaceChildren(...rows);
  $('#btnDelResume').disabled = Object.keys(STATE.resumes).length < 2;
}

function openPanel(tab) {
  if (tab) { prefs.tab = tab; savePrefs(); renderChrome(); }
  document.body.classList.add('panel-open');
}
function closePanel() { document.body.classList.remove('panel-open'); }

/* ---------- plain text (for job application forms) ---------- */
function plainText(doc) {
  const l = doc.settings.lang, out = [];
  const p = doc.profile;
  [p.name, p.title].map(s => s.trim()).filter(Boolean).forEach(s => out.push(s));
  const cs = doc.contacts.map(c => c.value.trim()).filter(Boolean);
  if (cs.length) out.push(cs.join(' | '));
  const ps = doc.personal.filter(x => x.value.trim()).map(x => `${x.type === 'custom' ? x.label : PERSONAL_TYPES[x.type].label[l]}: ${x.value.trim()}`);
  if (ps.length) out.push(ps.join(' | '));
  for (const s of doc.sections) {
    if (s.hidden || !hasContent(s)) continue;
    const kind = PRESETS[s.type].kind;
    out.push('', l === 'en' ? s.title.toUpperCase() : s.title, '');
    if (kind === 'text') out.push(s.content.trim());
    else if (kind === 'skills') {
      const labels = SCALES[PRESETS[s.type].scale][l];
      out.push(s.items.filter(it => it.name.trim()).map(it => it.name.trim() + (s.style === 'tags' ? '' : ` (${labels[it.level - 1]})`)).join(l === 'fa' ? '، ' : ', '));
    } else {
      for (const it of s.items) {
        if (isBlank(it)) continue;
        const period = formatPeriod(it, l);
        out.push([it.title, it.sub, it.extra].map(x => x.trim()).filter(Boolean).join(' — ') + (period ? ` (${period})` : ''));
        if (it.desc.trim()) out.push(it.desc.trim());
        out.push('');
      }
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/* ---------- page events ---------- */
const page = $('#page');
page.addEventListener('input', e => {
  const el = e.target.closest?.('[data-k]'); if (!el) return;
  let v = el.innerText.replace(/\n$/, '');
  if (!v.trim()) { el.replaceChildren(); v = ''; }
  set(el.dataset.k, v);
  if (el.dataset.sug) showSug(el);
  checkFit();
});
page.addEventListener('keydown', e => {
  const el = e.target.closest?.('[data-k]'); if (!el) return;
  const sugOpen = !sugBox.hidden && sugEl === el;
  if (sugOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); moveSug(e.key === 'ArrowDown' ? 1 : -1); return; }
  if (sugOpen && e.key === 'Escape') { hideSug(); return; }
  const active = sugOpen && sugBox.querySelector('.on');
  if (e.key === 'Enter' && active) {
    e.preventDefault();
    if (active.classList.contains('sug-head')) active.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    else applySug(active.textContent);
    return;
  }
  if (e.key === 'Enter' && !el.dataset.multi) { e.preventDefault(); el.blur(); }
});
page.addEventListener('paste', e => {
  const el = e.target.closest?.('[data-k]'); if (!el) return;
  e.preventDefault();
  let text = e.clipboardData.getData('text/plain');
  if (!el.dataset.multi) text = text.replace(/\s*\n\s*/g, ' ');
  document.execCommand('insertText', false, text);
});
page.addEventListener('focusin', e => { const el = e.target.closest?.('[data-sug]'); if (el) showSug(el); });
page.addEventListener('focusout', hideSug);

$('#photoInput').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const img = new Image();
  img.onload = () => {
    // crop to a centered square and shrink so the saved data stays small
    const side = Math.min(img.width, img.height), size = Math.min(520, side);
    const c = h('canvas', { width: size, height: size });
    c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
    S.profile.photo = c.toDataURL('image/jpeg', 0.85);
    S.settings.photo = true;
    URL.revokeObjectURL(img.src); commit();
  };
  img.src = URL.createObjectURL(file);
  e.target.value = '';
});

/* ---------- toolbar & panel events ---------- */
document.querySelectorAll('#langs button').forEach(b => { b.onclick = () => switchLang(b.dataset.lang); });
document.querySelectorAll('.tab').forEach(b => { b.onclick = () => { prefs.tab = b.dataset.tab; savePrefs(); renderChrome(); }; });
$('#btnPreview').onclick = () => { mode = editing() ? 'view' : 'edit'; render(); };
$('#btnUndo').onclick = undo;
$('#btnRedo').onclick = redo;
$('#btnPanel').onclick = () => (document.body.classList.contains('panel-open') ? closePanel() : openPanel());
$('#btnProgress').onclick = () => openPanel('check');
$('#btnPanelClose').onclick = closePanel;
$('#scrim').onclick = closePanel;

$('#colorPick').addEventListener('input', e => { S.settings.accent = e.target.value; $('#colorHex').value = e.target.value; save(true); render(); });
$('#colorHex').addEventListener('change', e => {
  let v = e.target.value.trim();
  if (/^#?[0-9a-f]{3}$/i.test(v)) v = '#' + v.replace('#', '').split('').map(c => c + c).join('');
  if (!v.startsWith('#')) v = '#' + v;
  if (/^#[0-9a-f]{6}$/i.test(v)) { S.settings.accent = v.toLowerCase(); commit(); } else e.target.value = S.settings.accent;
});
$('#fontSel').addEventListener('change', e => { S.settings.font = e.target.value; commit(); });
$('#sizeRange').addEventListener('input', e => { S.settings.size = +e.target.value; save(true); render(); });
$('#spaceRange').addEventListener('input', e => { S.settings.spacing = +e.target.value; save(true); render(); });
$('#btnFit').addEventListener('click', fitOnePage);
$('#iconSize').addEventListener('input', e => { S.settings.iconSize = +e.target.value; save(true); render(); });
$('#photoChk').addEventListener('change', e => { S.settings.photo = e.target.checked; commit(); });
$('#iconsChk').addEventListener('change', e => { S.settings.icons = e.target.checked; commit(); });

// resumes & files
$('#btnNewResume').onclick = () => {
  const e = newEntry('', lang());
  e.docs[e.lang].settings = { ...S.settings, dismissed: [] };
  STATE.resumes[e.id] = e; STATE.current = e.id; syncRefs(); commit();
};
$('#btnDupResume').onclick = () => {
  const e = structuredClone(R);
  e.id = uid(); e.name = t('copyOf', resumeName(R));
  STATE.resumes[e.id] = e; STATE.current = e.id; syncRefs(); commit();
};
$('#btnRenResume').onclick = () => {
  const n = prompt(t('renamePrompt'), resumeName(R));
  if (n != null) { R.name = n.trim(); commit(); }
};
$('#btnDelResume').onclick = () => {
  const ids = Object.keys(STATE.resumes);
  if (ids.length < 2 || !confirm(t('delResumeConfirm', resumeName(R)))) return;
  delete STATE.resumes[R.id];
  STATE.current = Object.keys(STATE.resumes)[0]; syncRefs(); commit();
};
$('#btnSample').onclick = () => {
  const doc = sampleResume({ ...S.settings, dismissed: [] });
  const e = newEntry(t('sampleName'), lang(), doc);
  STATE.resumes[e.id] = e; STATE.current = e.id; syncRefs(); commit();
};
$('#btnClear').onclick = () => {
  if (!confirm(t('resetConfirm'))) return;
  const fresh = blankResume(lang());
  fresh.settings = { ...S.settings, dismissed: [] };
  R.docs[R.lang] = fresh; syncRefs(); commit();
};
$('#btnExport').onclick = () => {
  const name = (resumeName(R).replace(/[\\/:*?"<>|]+/g, '').trim() || 'resume') + `-${lang()}.json`;
  download(name, JSON.stringify(S, null, 2), 'application/json');
};
$('#btnImport').onclick = () => $('#jsonInput').click();
$('#jsonInput').addEventListener('change', async e => {
  const file = e.target.files[0]; if (!file) return;
  e.target.value = '';
  try {
    const d = normalize(JSON.parse(await file.text()));
    const entry = newEntry(file.name.replace(/\.json$/i, ''), d.settings.lang, d);
    STATE.resumes[entry.id] = entry; STATE.current = entry.id; syncRefs(); commit();
    toast(t('imported'));
  } catch (err) { alert(t('invalidFile')); }
});
$('#btnCopyText').onclick = async () => {
  const text = plainText(S);
  try { await navigator.clipboard.writeText(text); toast(t('copied')); }
  catch (err) { download('resume.txt', text, 'text/plain;charset=utf-8'); }
};

// keyboard: undo / redo, Escape closes the mobile panel
addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.body.classList.contains('panel-open') && !dlg.open) closePanel();
  if (!(e.ctrlKey || e.metaKey) || dlg.open) return;
  if (/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
  else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); redo(); }
});

// Print always uses the clean view; the PDF file name comes from the page title.
// The button switches first too, for browsers that skip beforeprint.
let restoreAfterPrint = null, printState = null;
$('#btnPrint').onclick = () => {
  if (editing()) { restoreAfterPrint = 'edit'; mode = 'view'; render(); }
  window.print();
};
addEventListener('beforeprint', () => {
  printState = { mode: restoreAfterPrint || mode, title: document.title };
  restoreAfterPrint = null;
  if (editing()) { mode = 'view'; render(); }
  const name = S.profile.name.trim();
  document.title = name ? (lang() === 'fa' ? `رزومه ${name}` : `${name.replace(/\s+/g, '-')}-Resume`) : t('brand');
});
addEventListener('afterprint', () => {
  if (!printState) return;
  if (printState.mode !== mode) { mode = printState.mode; render(); }
  document.title = printState.title;
  printState = null;
});

hist.last = JSON.stringify(STATE);
persist(hist.last);
render();
document.fonts?.ready.then(checkFit);
