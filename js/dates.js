// ============================================================
//  Dates: { y, m } where m = 1..12, or 0 for "year only".
//  Persian resumes use the Solar Hijri (Jalali) calendar,
//  English resumes the Gregorian one. end may also be 'present'.
// ============================================================

const MONTHS = {
  fa: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/* Jalali <-> Gregorian (algorithm from jalaali-js, MIT) */
const idiv = (a, b) => ~~(a / b);
const imod = (a, b) => a - ~~(a / b) * b;
function jalCal(jy) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const gy = jy + 621;
  let leapJ = -14, jp = breaks[0], jump = 0;
  for (let i = 1; i < breaks.length; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += idiv(jump, 33) * 8 + idiv(imod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ += idiv(n, 33) * 8 + idiv(imod(n, 33) + 3, 4);
  if (imod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = idiv(gy, 4) - idiv((idiv(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + idiv(jump + 4, 33) * 33;
  let leap = imod(imod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}
function g2d(gy, gm, gd) {
  let d = idiv((gy + idiv(gm - 8, 6) + 100100) * 1461, 4) + idiv(153 * imod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - idiv(idiv(gy + 100100 + idiv(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}
function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j = j + idiv(idiv(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = idiv(imod(j, 1461), 4) * 5 + 308;
  const gd = idiv(imod(i, 153), 5) + 1;
  const gm = imod(idiv(i, 153), 12) + 1;
  const gy = idiv(j, 1461) - 100100 + idiv(8 - gm, 6);
  return { gy, gm, gd };
}
function j2d(jy, jm, jd) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - idiv(jm, 7) * (jm - 7) + jd - 1;
}
function d2j(jdn) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  let k = jdn - g2d(gy, 3, r.march);
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + idiv(k, 31), jd: imod(k, 31) + 1 };
    k -= 186;
  } else {
    jy -= 1; k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + idiv(k, 30), jd: imod(k, 30) + 1 };
}
const toJalali = (gy, gm, gd) => d2j(g2d(gy, gm, gd));
const toGregorian = (jy, jm, jd) => d2g(j2d(jy, jm, jd));

/* ---------- helpers used by the app ---------- */
function parseYM(v) {
  if (!v || typeof v !== 'object') return null;
  const y = Math.round(+v.y), m = Math.round(+v.m);
  if (!Number.isFinite(y) || y < 1200 || y > 2200) return null;
  return { y, m: m >= 1 && m <= 12 ? m : 0 };
}

function currentYM(lang) {
  const now = new Date();
  if (lang === 'en') return { y: now.getFullYear(), m: now.getMonth() + 1 };
  const j = toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return { y: j.jy, m: j.jm };
}

// Convert a month between calendars using the middle of the month
function convertYM(d, from, to) {
  if (!d || from === to) return d;
  if (from === 'fa') {
    if (!d.m) return { y: d.y + 621, m: 0 };
    const g = toGregorian(d.y, d.m, 15);
    return { y: g.gy, m: g.gm };
  }
  if (!d.m) return { y: d.y - 621, m: 0 };
  const j = toJalali(d.y, d.m, 15);
  return { y: j.jy, m: j.jm };
}

// Sortable number for a date ('present' is the latest, missing the earliest).
// A year-only date counts as January, or as December when it is an end date.
const ymValue = (d, isEnd = false) => (d === 'present' ? Infinity : d ? d.y * 12 + (d.m || (isEnd ? 12 : 1)) : -Infinity);

function formatYM(d, lang) {
  if (!d) return '';
  const month = d.m ? MONTHS[lang][d.m - 1] + ' ' : '';
  return month + (lang === 'fa' ? toFaDigits(d.y) : d.y);
}

// Text shown on the resume for an entry's dates
function formatPeriod(it, lang) {
  if (!it.start) return it.period.trim();
  const start = formatYM(it.start, lang);
  if (!it.end) return start;
  const end = it.end === 'present' ? UI.presentShort[lang] : formatYM(it.end, lang);
  return `${start} – ${end}`;
}
