// ============================================================
//  Resume review: checks the content against common resume-writing
//  rules and returns issues for the "Review" tab.
//  issue = { level: 'error' | 'warn' | 'tip', msg, focus?, fix?: { label, run } }
// ============================================================

const MSG = {
  noName: L('نام خود را بنویسید.', 'Add your name.'),
  noTitle: L('یک عنوان شغلی زیر نام بنویسید تا کارفرما در یک نگاه بفهمد دنبال چه شغلی هستید.', 'Add a job title under your name so recruiters know at a glance what role you want.'),
  noEmail: L('ایمیل اضافه کنید؛ اصلی‌ترین راه تماس کارفرما با شماست.', 'Add an email — it is the main way employers will reach you.'),
  badEmail: L('ایمیل درست به نظر نمی‌رسد.', 'The email address doesn’t look valid.'),
  noPhone: L('شماره تماس اضافه کنید.', 'Add a phone number.'),
  noLinkedin: L('لینک لینکدین اضافه کنید؛ بیشتر کارفرمایان پروفایل شما را می‌بینند.', 'Add your LinkedIn — most recruiters will look you up.'),
  noSummary: L('یک خلاصه کوتاه (درباره من) بنویسید؛ اولین جایی است که خوانده می‌شود.', 'Write a short summary — it’s the first thing people read.'),
  shortSummary: L('خلاصه خیلی کوتاه است؛ ۳ تا ۵ خط با یک دستاورد مشخص بهتر است.', 'Your summary is very short; 3–5 lines with one concrete achievement works best.'),
  longSummary: L('خلاصه طولانی است ({0} کلمه)؛ زیر ۱۰۰ کلمه نگه دارید.', 'Your summary is long ({0} words); keep it under about 100.'),
  noExperience: L('سابقه شغلی ندارید؟ کارآموزی، پروژه یا کار داوطلبانه اضافه کنید.', 'No work experience yet? Add internships, projects or volunteering instead.'),
  incomplete: L('«{0}»: عنوان و نام شرکت یا مؤسسه را کامل کنید.', '“{0}”: fill in both the title and the organization.'),
  noDate: L('«{0}»: تاریخ را مشخص کنید.', '“{0}”: add dates.'),
  noDesc: L('«{0}»: چند مورد از کارها و دستاوردهایتان را بنویسید.', '“{0}”: add a few bullet points about what you achieved.'),
  weakVerb: L('«{0}»: به‌جای «مسئول…» با کار و نتیجه شروع کنید؛ مثلاً «افزایش ۲۰٪ فروش در ۶ ماه».', '“{0}”: instead of “Responsible for…”, start with an action verb and a result, e.g. “Grew sales 20% in 6 months”.'),
  longDesc: L('«{0}»: توضیح طولانی است؛ به ۲ تا ۵ مورد کوتاه خلاصه کنید.', '“{0}”: the description is long; trim it to 2–5 short bullets.'),
  quantify: L('در سوابق شغلی عددی نیست؛ دستاوردها را با عدد نشان دهید (درصد، مبلغ، تعداد، زمان).', 'Your experience has no numbers; quantify results (%, $, counts, time saved).'),
  firstPerson: L('', 'Avoid “I / my” — start bullet points with verbs instead.'),
  endBeforeStart: L('«{0}»: تاریخ پایان قبل از شروع است.', '“{0}”: the end date is before the start date.'),
  notChrono: L('بخش «{0}» به ترتیب زمانی نیست؛ جدیدترین مورد باید اول باشد.', '“{0}” isn’t in reverse-chronological order — newest should come first.'),
  noEducation: L('سوابق تحصیلی را اضافه کنید.', 'Add your education.'),
  noSkills: L('چند مهارت مرتبط با شغل اضافه کنید.', 'Add some skills relevant to the job.'),
  tooManySkills: L('{0} مهارت زیاد است؛ ۸ تا ۱۵ مهارتِ مرتبط کافی است.', '{0} skills is a lot; 8–15 relevant ones are enough.'),
  allExpert: L('همه مهارت‌ها در بالاترین سطح‌اند؛ سطح‌های واقعی‌تر اعتمادپذیرترند.', 'Every skill is at the top level; realistic levels are more credible.'),
  enPersonal: L('', 'For the US, UK, Canada and Australia, leave out: {0}.'),
  enPhoto: L('', 'Photos are usually left off resumes in the US, UK and Canada.'),
  faMilitary: L('اگر آقا هستید، وضعیت نظام وظیفه برای کارفرمایان ایرانی مهم است.', ''),
  arabic: L('حروف عربی «ي» یا «ك» در متن هست؛ به «ی» و «ک» فارسی تبدیل شوند تا در جستجو درست پیدا شوند.', ''),
  multiPage: L('رزومه {0} صفحه شده؛ برای کمتر از ۱۰ سال سابقه، یک صفحه بهتر است. دکمهٔ «جا دادن در یک صفحه» را امتحان کنید یا موارد قدیمی را کوتاه کنید.', 'Your resume is {0} pages; with under ~10 years of experience, one page is best. Try “Fit to one page” or trim older items.'),
  hiddenSecs: L('{0} بخش پنهان است و در PDF نمی‌آید.', '{0} hidden section(s) won’t appear in the PDF.'),
  fixSort: L('مرتب کن', 'Sort'), fixRemove: L('حذف کن', 'Remove'), fixHidePhoto: L('عکس را بردار', 'Hide photo'),
  fixAdd: L('افزودن', 'Add'), fixFit: L('جا بده', 'Fit'), fixLetters: L('اصلاح کن', 'Fix'), go: L('برو', 'Go'),
  score: L('امتیاز رزومه', 'Resume score'), allGood: L('عالی! مشکل مهمی پیدا نشد.', 'Great — no important issues found.'),
  lvError: L('مهم', 'Important'), lvWarn: L('بهتر است', 'Recommended'), lvTip: L('نکته', 'Tip'),
  guide: L('اصول رزومه‌نویسی', 'Resume essentials'),
};

const WEAK_START = { fa: /^[\s•\-–*]*(مسئول|مسئولیت|وظایف|کار روی|کمک در|انجام امور)/, en: /^[\s•\-–*]*(responsible for|duties include|worked on|helped with|in charge of|tasked with)/i };
const fmt = (s, ...a) => a.reduce((r, v, i) => r.replace(`{${i}}`, () => v), s);
const words = s => s.trim().split(/\s+/).filter(Boolean).length;
const sortKey = it => (it.end ? ymValue(it.end, true) : ymValue(it.start));

function sortByDate(sec) {
  sec.items.sort((a, b) => sortKey(b) - sortKey(a));
}

// Replace Arabic Yeh/Kaf with Persian ones in every text field (not photo data)
function fixArabicLetters(doc) {
  const walk = o => {
    for (const k of Object.keys(o)) {
      if (k === 'photo') continue;
      if (typeof o[k] === 'string') o[k] = o[k].replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/ى/g, 'ی');
      else if (o[k] && typeof o[k] === 'object') walk(o[k]);
    }
  };
  walk(doc.profile); walk(doc.personal); walk(doc.sections);
}

function reviewResume(doc, pages = 1) {
  const lang = doc.settings.lang, out = [];
  const tx = m => m[lang];
  const add = (level, msg, extra = {}) => { if (msg) out.push({ level, msg, ...extra }); };
  const visible = doc.sections.filter(s => !s.hidden);
  const filled = s => s && hasContent(s);
  const firstOf = type => visible.find(s => s.type === type);
  const path = (s, rest) => `sections.${doc.sections.indexOf(s)}.${rest}`;
  const contactIdx = type => doc.contacts.findIndex(c => c.type === type);
  const contactVal = type => doc.contacts.find(c => c.type === type && c.value.trim())?.value.trim();

  if (pages > 1) add('tip', fmt(tx(MSG.multiPage), lang === 'fa' ? toFaDigits(pages) : pages),
    typeof fitOnePage === 'function' ? { fix: { label: tx(MSG.fixFit), run: fitOnePage } } : {});

  // header & contact
  if (!doc.profile.name.trim()) add('error', tx(MSG.noName), { focus: 'profile.name' });
  if (!doc.profile.title.trim()) add('warn', tx(MSG.noTitle), { focus: 'profile.title' });
  const email = contactVal('email');
  if (!email) add('error', tx(MSG.noEmail), contactIdx('email') >= 0 ? { focus: `contacts.${contactIdx('email')}.value` } : { fix: { label: tx(MSG.fixAdd), run: () => doc.contacts.unshift({ type: 'email', value: '' }) } });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) add('error', tx(MSG.badEmail), { focus: `contacts.${contactIdx('email')}.value` });
  if (!contactVal('phone')) add('warn', tx(MSG.noPhone), contactIdx('phone') >= 0 ? { focus: `contacts.${contactIdx('phone')}.value` } : { fix: { label: tx(MSG.fixAdd), run: () => doc.contacts.push({ type: 'phone', value: '' }) } });
  if (lang === 'en' && !contactVal('linkedin')) add('tip', tx(MSG.noLinkedin), contactIdx('linkedin') >= 0 ? { focus: `contacts.${contactIdx('linkedin')}.value` } : { fix: { label: tx(MSG.fixAdd), run: () => doc.contacts.push({ type: 'linkedin', value: '' }) } });

  // summary
  const about = firstOf('about');
  if (!filled(about)) add('warn', tx(MSG.noSummary), about ? { focus: path(about, 'content') } : {});
  else {
    const n = words(about.content);
    if (n < 18) add('tip', tx(MSG.shortSummary), { focus: path(about, 'content') });
    else if (n > 110) add('warn', fmt(tx(MSG.longSummary), lang === 'fa' ? toFaDigits(n) : n), { focus: path(about, 'content') });
  }

  // experience
  const exp = firstOf('experience');
  const expItems = filled(exp) ? exp.items.map((it, j) => [it, j]).filter(([it]) => !isBlank(it)) : [];
  if (!expItems.length && !['internship', 'projects', 'volunteer'].some(t => filled(firstOf(t)))) add('warn', tx(MSG.noExperience));
  for (const [it, j] of expItems) {
    const name = it.title.trim() || it.sub.trim() || '…';
    const p = rest => path(exp, `items.${j}.${rest}`);
    if (!it.title.trim() || !it.sub.trim()) add('warn', fmt(tx(MSG.incomplete), name), { focus: p(it.title.trim() ? 'sub' : 'title') });
    if (!it.start && !it.period.trim()) add('warn', fmt(tx(MSG.noDate), name), { focus: p('title') });
    if (!it.desc.trim()) add('warn', fmt(tx(MSG.noDesc), name), { focus: p('desc') });
    else if (it.desc.split('\n').some(line => WEAK_START[lang].test(line))) add('tip', fmt(tx(MSG.weakVerb), name), { focus: p('desc') });
    if (it.desc.length > 650) add('warn', fmt(tx(MSG.longDesc), name), { focus: p('desc') });
  }
  if (expItems.some(([it]) => it.desc.trim()) && !expItems.some(([it]) => /[0-9۰-۹]/.test(it.desc))) add('tip', tx(MSG.quantify));
  if (lang === 'en') {
    const text = [about?.content || '', ...expItems.map(([it]) => it.desc)].join(' ');
    if (/\b(I|my|me)\b/.test(text)) add('tip', tx(MSG.firstPerson));
  }

  // dates: order and validity in every dated section
  for (const s of visible) {
    if (!s.items || !PRESETS[s.type].date) continue;
    s.items.forEach((it, j) => {
      if (it.start && it.end && it.end !== 'present' && ymValue(it.end, true) < ymValue(it.start)) {
        add('error', fmt(tx(MSG.endBeforeStart), it.title.trim() || s.title), { focus: path(s, `items.${j}.title`) });
      }
    });
    const keys = s.items.filter(it => it.start).map(sortKey);
    if (keys.some((k, i) => i > 0 && k > keys[i - 1])) add('tip', fmt(tx(MSG.notChrono), s.title), { fix: { label: tx(MSG.fixSort), run: () => sortByDate(s) } });
  }

  // education & skills
  if (!filled(firstOf('education'))) add('warn', tx(MSG.noEducation));
  const sk = firstOf('skills');
  const skills = sk ? sk.items.filter(it => it.name.trim()) : [];
  if (!skills.length) add('warn', tx(MSG.noSkills));
  else if (skills.length > 18) add('tip', fmt(tx(MSG.tooManySkills), lang === 'fa' ? toFaDigits(skills.length) : skills.length));
  else if (skills.length >= 5 && sk.style !== 'tags' && skills.every(it => it.level === 5)) add('tip', tx(MSG.allExpert));

  // conventions that differ by market
  if (lang === 'en') {
    const personalTypes = ['birth', 'marital', 'gender', 'nationality', 'military'];
    const extra = doc.personal.filter(p => personalTypes.includes(p.type) && p.value.trim());
    if (extra.length) {
      add('tip', fmt(tx(MSG.enPersonal), extra.map(p => PERSONAL_TYPES[p.type].label.en.toLowerCase()).join(', ')),
        { fix: { label: tx(MSG.fixRemove), run: () => { doc.personal = doc.personal.filter(p => !extra.includes(p)); } } });
    }
    if (doc.settings.photo && doc.profile.photo && TEMPLATES[doc.settings.template].photo !== false) {
      add('tip', tx(MSG.enPhoto), { fix: { label: tx(MSG.fixHidePhoto), run: () => { doc.settings.photo = false; } } });
    }
  } else {
    const gender = doc.personal.find(p => p.type === 'gender')?.value.trim();
    if (!doc.personal.some(p => p.type === 'military') && gender !== 'زن') {
      add('tip', tx(MSG.faMilitary), { fix: { label: tx(MSG.fixAdd), run: () => doc.personal.push({ type: 'military', label: '', value: '' }) } });
    }
    if (/[يكى]/.test(JSON.stringify([doc.profile.name, doc.profile.title, doc.personal, doc.sections]))) {
      add('warn', tx(MSG.arabic), { fix: { label: tx(MSG.fixLetters), run: () => fixArabicLetters(doc) } });
    }
  }

  const hidden = doc.sections.filter(s => s.hidden && hasContent(s)).length;
  if (hidden) add('tip', fmt(tx(MSG.hiddenSecs), lang === 'fa' ? toFaDigits(hidden) : hidden));

  // issues the user dismissed (never errors) are left out
  const dismissed = new Set(doc.settings.dismissed);
  const active = out.filter(i => i.level === 'error' || !dismissed.has(i.msg));
  const rank = { error: 0, warn: 1, tip: 2 };
  active.sort((a, b) => rank[a.level] - rank[b.level]);
  const score = Math.max(0, 100 - active.reduce((s, i) => s + (i.level === 'error' ? 12 : i.level === 'warn' ? 5 : 2), 0));
  return { issues: active, score, dismissedCount: out.length - active.length };
}

// Checklist of the parts every resume needs, shown as a progress bar
const STEPS = {
  name: L('نام', 'Name'), title: L('عنوان شغلی', 'Job title'), email: L('ایمیل', 'Email'), phone: L('شماره تماس', 'Phone'),
  summary: L('خلاصه (درباره من)', 'Summary'), experience: L('سابقه کار، کارآموزی یا پروژه با توضیح', 'Experience, internship or project with details'),
  dates: L('تاریخ سوابق', 'Dates on your experience'), education: L('سوابق تحصیلی', 'Education'), skills: L('حداقل ۵ مهارت', 'At least 5 skills'),
  languages: L('زبان‌ها', 'Languages'), linkedin: L('لینکدین', 'LinkedIn'), photo: L('عکس', 'Photo'),
};
function completeness(doc) {
  const lang = doc.settings.lang;
  const vis = type => doc.sections.find(s => s.type === type && !s.hidden);
  const contact = type => doc.contacts.some(c => c.type === type && c.value.trim());
  const work = ['experience', 'internship', 'projects', 'volunteer'].map(vis).filter(Boolean);
  const entries = work.flatMap(s => s.items.filter(it => !isBlank(it)));
  const about = vis('about');
  const steps = [
    ['name', !!doc.profile.name.trim()],
    ['title', !!doc.profile.title.trim()],
    ['email', contact('email')],
    ['phone', contact('phone')],
    ['summary', !!about && words(about.content) >= 18],
    ['experience', entries.some(it => it.desc.trim())],
    ['dates', entries.length > 0 && entries.every(it => it.start || it.period.trim())],
    ['education', !!vis('education') && hasContent(vis('education'))],
    ['skills', (vis('skills')?.items.filter(it => it.name.trim()).length || 0) >= 5],
    ['languages', !!vis('languages') && hasContent(vis('languages'))],
  ];
  if (lang === 'en') steps.push(['linkedin', contact('linkedin')]);
  else if (doc.settings.photo && TEMPLATES[doc.settings.template].photo !== false) steps.push(['photo', !!doc.profile.photo]);
  const list = steps.map(([k, ok]) => ({ label: STEPS[k][lang], ok }));
  const done = list.filter(s => s.ok).length;
  return { list, done, total: list.length, pct: Math.round(done / list.length * 100) };
}
