/* App-only credits and deliberate sharing. Never included in printed resumes. */
const APP_VERSION = '1.0.0';
const PUBLIC_SITE = 'https://mrromof.github.io/resume_builder/';
const communityText = (fa, en) => lang() === 'fa' ? fa : en;
function creatorLink(label, url, iconName) {
  return h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, iconName ? icon(iconName) : null, label);
}
function renderCommunity() {
  const link = creatorLink;
  const card = h('div', { class: 'creator-card' },
    h('div', { class: 'creator-heading' }, icon('linkedin'), h('span', {}, communityText('تیم سازنده', 'Made by')), h('small', { dir: 'ltr' }, `v${APP_VERSION}`)),
    h('div', { class: 'creator-people' },
      h('div', { class: 'creator-person' }, link('Mohammad Fathi', 'https://www.linkedin.com/in/mohammad-fathi-718236259'),
        h('div', { class: 'creator-links' }, link('LinkedIn', 'https://www.linkedin.com/in/mohammad-fathi-718236259', 'linkedin'), link('GitHub', 'https://github.com/MrRomof', 'github'))),
      h('div', { class: 'creator-person' }, link('Fourka Team', 'https://www.linkedin.com/company/fourka/'),
        h('div', { class: 'creator-links' }, link('LinkedIn', 'https://www.linkedin.com/company/fourka/', 'linkedin')))));
  fill($('#community'), card, h('div', { class: 'community-actions' },
    h('button', { type: 'button', class: 'btn', id: 'shareSite', onclick: shareSite }, communityText('اشتراک سایت', 'Share website')),
    h('button', { type: 'button', class: 'btn', id: 'shareResume', onclick: resumeShareDialog }, communityText('ارسال رزومه', 'Send resume'))));
  renderStats();
}
async function shareSite() {
  try {
    if (navigator.share) { await navigator.share({ title: 'Resume Builder', url: PUBLIC_SITE }); return; }
    if (navigator.clipboard) { await navigator.clipboard.writeText(PUBLIC_SITE); toast(communityText('لینک سایت کپی شد', 'Website link copied')); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  const input = h('input', { value: PUBLIC_SITE, readonly: '', class: 'share-url', 'aria-label': communityText('لینک سایت', 'Website URL') });
  openDialog(communityText('اشتراک سایت', 'Share website'), input, [h('button', { class: 'btn', onclick: () => dlg.close() }, communityText('بستن', 'Close'))]);
  input.focus(); input.select();
}
function resumeShareDialog() {
  const name = (resumeName(R).replace(/[\\/:*?"<>|]+/g, '').trim() || 'resume');
  async function sendFile(json) {
    const content = json ? JSON.stringify(S, null, 2) : plainText(S);
    const type = json ? 'application/json' : 'text/plain;charset=utf-8';
    const filename = `${name}-${lang()}.${json ? 'json' : 'txt'}`;
    try {
      const file = new File([content], filename, { type });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) { await navigator.share({ files: [file], title: name }); return; }
    } catch (e) { if (e.name === 'AbortError') return; }
    download(filename, content, type);
    toast(communityText('فایل را به پیام یا ایمیل خود پیوست کنید.', 'Attach the downloaded file to your message or email.'));
  }
  openDialog(communityText('ارسال رزومه', 'Send resume'), h('div', { class: 'resume-share' },
    h('p', {}, communityText('فرمت را انتخاب کنید. فایل شامل اطلاعات شخصی رزومهٔ فعلی شماست؛ گیرنده را خودتان انتخاب می‌کنید.', 'Choose a format. The file contains your current resume’s personal details; you choose its recipient.')),
    h('button', { class: 'btn', onclick: () => { dlg.close(); $('#btnPrint').click(); } }, communityText('ذخیرهٔ PDF برای ارسال', 'Save PDF to send')),
    h('button', { class: 'btn', onclick: () => sendFile(false) }, communityText('ارسال متن رزومه', 'Send resume text')),
    h('button', { class: 'btn', onclick: () => sendFile(true) }, communityText('ارسال فایل قابل ویرایش (JSON)', 'Send editable file (JSON)'))),
    [h('button', { class: 'btn', onclick: () => dlg.close() }, communityText('بستن', 'Close'))]);
}

// Optional global counters: disabled until an owner-controlled endpoint is deployed.
let communityStats = null;
function renderStats() {
  document.querySelector('.community-stats')?.remove();
  if (!communityStats) return;
  const row = h('div', { class: 'community-stats', title: communityText('کاربران تخمینی بر اساس مرورگر؛ دستگاه‌های مختلف و پاک کردن داده‌ها می‌تواند شمارش را تغییر دهد.', 'Estimated unique browsers; multiple devices and cleared storage affect this count.') },
    h('span', {}, `${num(communityStats.views)} ${communityText('بازدید', 'views')}`),
    h('span', {}, `${num(communityStats.visitors)} ${communityText('کاربر تخمینی', 'estimated users')}`));
  $('#community').append(row);
}
async function loadCommunityStats() {
  try {
    const configResponse = await fetch('analytics-config.json', { cache: 'no-cache' });
    if (!configResponse.ok) return;
    const { endpoint } = await configResponse.json();
    if (!endpoint || !/^https:\/\//.test(endpoint)) return;
    let visitor = null;
    try {
      visitor = localStorage.getItem('resume-visitor-v1');
      if (!/^[a-f0-9-]{36}$/.test(visitor || '')) {
        visitor = crypto.randomUUID(); localStorage.setItem('resume-visitor-v1', visitor);
      }
    } catch { visitor = null; }
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor, event: crypto.randomUUID() }), credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(6000) });
    if (!response.ok) return;
    const data = await response.json();
    if (!Number.isSafeInteger(data.views) || !Number.isSafeInteger(data.visitors) || data.views < 0 || data.visitors < 0 || data.visitors > data.views) return;
    communityStats = data; renderStats();
  } catch { /* Unavailable counters must never block editing or display invented totals. */ }
}
