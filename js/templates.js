// ============================================================
//  Templates: each one arranges the shared blocks into a page.
//  b.photo() b.ident() b.contacts() b.personal() b.group(title, block, icon)
//  b.sections(col) b.addSection(col) — col is 'main' | 'side' | undefined (all)
//  Styles for each template live in style.css under .tpl-<key>.
//  cols: 1 = single column (sections share one order)
//  photo: false = template never shows a photo
//  plain: true  = text only (no icons, no level bars, no shapes) — safest for ATS
// ============================================================

const sideBlocks = b => [
  b.group(t('contacts'), b.contacts(), 'mail'),
  b.group(t('personal'), b.personal(), 'user'),
  b.sections('side'), b.addSection('side'),
];

// Decorative wave used at the bottom of the "wave" header
function waveEdge() {
  const s = h('span', { class: 'wave-edge', 'aria-hidden': 'true' });
  s.innerHTML = '<svg viewBox="0 0 210 16" preserveAspectRatio="none"><path d="M0 9 C 30 18, 60 2, 105 9 S 175 17, 210 6 V16 H0 Z" fill="#fff"/></svg>';
  return s;
}

// Initials badge used when there is no photo (e.g. "Sara Ahmadi" → "SA")
function monogram() {
  const words = (S.profile.name || '').trim().split(/\s+/).filter(Boolean);
  const chars = words.slice(0, 2).map(w => [...w][0]);
  const txt = lang() === 'fa' ? chars.join('\u200c') : chars.join('').toUpperCase();
  return h('div', { class: 'mono', 'aria-hidden': 'true' }, txt || icon('user'));
}

const TEMPLATES = {
  classic: {
    name: L('کلاسیک', 'Classic'), cols: 2,
    render: b => [
      h('aside', { class: 'col side dark' }, b.photo(), sideBlocks(b)),
      h('main', { class: 'col main' }, b.ident(), b.sections('main'), b.addSection('main')),
    ],
  },

  modern: {
    name: L('مدرن', 'Modern'), cols: 2,
    render: b => [
      h('header', { class: 'band dark' }, b.photo(), h('div', { class: 'band-text' }, b.ident(), b.contacts())),
      h('div', { class: 'body' },
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main')),
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side'))),
    ],
  },

  spotlight: {
    name: L('مرکزی', 'Spotlight'), cols: 2,
    render: b => [
      h('header', { class: 'shead' },
        h('div', { class: 'shead-side' }, b.group(t('contacts'), b.contacts(), 'mail')),
        h('div', { class: 'shead-center' }, b.photo(), b.ident()),
        h('div', { class: 'shead-side' }, b.group(t('personal'), b.personal(), 'user'))),
      h('div', { class: 'col one' },
        b.sections('main'),
        h('div', { class: 'side-grid' }, b.sections('side')),
        b.addSection()),
    ],
  },

  bold: {
    name: L('تیره', 'Bold'), cols: 2,
    render: b => [
      h('aside', { class: 'col side dark' }, b.photo(), sideBlocks(b)),
      h('main', { class: 'col main' }, b.ident(), b.sections('main'), b.addSection('main')),
    ],
  },

  creative: {
    name: L('خلاق', 'Creative'), cols: 2,
    render: b => [
      h('header', { class: 'chead' }, b.photo(), h('div', { class: 'chead-text' }, b.ident(), b.contacts())),
      h('div', { class: 'body' },
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side')),
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main'))),
    ],
  },

  geometric: {
    name: L('هندسی', 'Geometric'), cols: 2,
    render: b => [
      h('header', { class: 'ghead dark' }, h('div', { class: 'ghead-text' }, b.ident(), b.contacts()), b.photo()),
      h('div', { class: 'body' },
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side')),
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main'))),
    ],
  },

  wave: {
    name: L('موج', 'Wave'), cols: 2,
    render: b => [
      h('header', { class: 'whead dark' }, b.photo(), h('div', { class: 'whead-text' }, b.ident(), b.contacts()), waveEdge()),
      h('div', { class: 'body' },
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main')),
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side'))),
    ],
  },

  halo: {
    name: L('هاله', 'Halo'), cols: 2,
    render: b => [
      h('header', { class: 'hhead dark' }, b.photo(), b.ident(), b.contacts()),
      h('div', { class: 'body' },
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main')),
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side'))),
    ],
  },

  aurora: {
    name: L('شفق', 'Aurora'), cols: 2,
    render: b => [
      h('header', { class: 'auhead dark' }, h('div', { class: 'auhead-text' }, b.ident(), b.contacts()), b.photo()),
      h('div', { class: 'body' },
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side')),
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main'))),
    ],
  },

  ribbon: {
    name: L('روبان', 'Ribbon'), cols: 2,
    render: b => [
      h('aside', { class: 'col side' }, b.photo(), sideBlocks(b)),
      h('main', { class: 'col main' }, b.ident(), b.sections('main'), b.addSection('main')),
    ],
  },

  cards: {
    name: L('کارتی', 'Cards'), cols: 2,
    render: b => [
      h('header', { class: 'cdhead' }, b.photo(), h('div', { class: 'cdhead-text' }, b.ident(), b.contacts())),
      h('div', { class: 'body' },
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side')),
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main'))),
    ],
  },

  slant: {
    name: L('مورب', 'Slant'), cols: 2,
    render: b => [
      h('main', { class: 'col main' }, b.ident(), b.sections('main'), b.addSection('main')),
      h('aside', { class: 'col side dark' }, b.photo(), sideBlocks(b)),
    ],
  },

  monogram: {
    name: L('حروف اول', 'Monogram'), cols: 1,
    render: b => [
      h('div', { class: 'col one' },
        h('header', { class: 'mghead' }, (S.settings.photo && b.photo()) || monogram(),
          h('div', { class: 'mghead-text' }, b.ident(), b.contacts(), b.personal())),
        b.sections(), b.addSection()),
    ],
  },

  terminal: {
    name: L('برنامه‌نویس', 'Developer'), cols: 2,
    render: b => [
      h('header', { class: 'thead dark' }, h('span', { class: 'win-dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')),
        h('div', { class: 'thead-row' }, h('div', { class: 'thead-text' }, b.ident(), b.contacts()), b.photo())),
      h('div', { class: 'body' },
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main')),
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side'))),
    ],
  },

  elegant: {
    name: L('شیک', 'Elegant'), cols: 2,
    render: b => [
      h('header', { class: 'ehead' }, b.ident()),
      h('div', { class: 'body' },
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main')),
        h('aside', { class: 'col side' }, b.photo(), sideBlocks(b))),
    ],
  },

  compact: {
    name: L('فشرده', 'Compact'), cols: 2,
    render: b => [
      h('header', { class: 'khead' }, h('div', { class: 'khead-text' }, b.ident(), b.contacts()), b.photo()),
      h('div', { class: 'body' },
        h('main', { class: 'col main' }, b.sections('main'), b.addSection('main')),
        h('aside', { class: 'col side' }, b.group(t('personal'), b.personal(), 'user'), b.sections('side'), b.addSection('side'))),
    ],
  },

  minimal: {
    name: L('مینیمال', 'Minimal'), cols: 1,
    render: b => [
      h('div', { class: 'col one' },
        h('header', { class: 'mhead' }, h('div', { class: 'mhead-text' }, b.ident(), b.contacts(), b.personal()), b.photo()),
        b.sections(), b.addSection()),
    ],
  },

  executive: {
    name: L('رسمی', 'Executive'), cols: 1,
    render: b => [
      h('div', { class: 'col one' },
        h('header', { class: 'xhead' }, b.photo(), b.ident(), b.contacts(), b.personal()),
        b.sections(), b.addSection()),
    ],
  },

  ats: {
    name: L('ساده (ATS)', 'Simple (ATS)'), cols: 1, photo: false, plain: true,
    render: b => [
      h('div', { class: 'col one' },
        h('header', { class: 'ahead' }, b.ident(), b.contacts(), b.personal()),
        b.sections(), b.addSection()),
    ],
  },
};
