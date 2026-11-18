/* App-only credits and deliberate sharing. Never included in printed resumes. */
const APP_VERSION = '1.0.0';
const PUBLIC_SITE = 'https://mrromof.github.io/resume-builder/';
const communityText = (fa, en) => lang() === 'fa' ? fa : en;
function creatorLink(label, url, iconName) {
  return h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, iconName ? icon(iconName) : null, h('span', { class: 'creator-name' }, label));
}
function shareIcon() {
  const span = h('span', { class: 'ic', 'aria-hidden': 'true' });
  span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>';
  return span;
}
function renderCommunity() {
  const shareLabel = communityText('اشتراک سایت', 'Share website');
  const card = h('div', { class: 'creator-card' },
    h('div', { class: 'creator-layout' },
      h('div', { class: 'creator-people' },
        creatorLink('Mohammad Fathi', 'https://github.com/MrRomof', 'github'),
        creatorLink('Fourka Team', 'https://www.linkedin.com/company/fourka/', 'linkedin')),
      h('button', { type: 'button', class: 'site-share', id: 'shareSite', onclick: shareSite, title: shareLabel, 'aria-label': shareLabel }, shareIcon())),
    h('span', { class: 'copy-feedback', id: 'copyFeedback', role: 'status', hidden: '' }));
  fill($('#community'), card);
  $('#appVersion').textContent = `v${APP_VERSION}`;
  const button = $('#shareResume');
  const label = communityText('ارسال رزومه', 'Send resume');
  button.querySelector('.lbl').textContent = label;
  button.title = label; button.setAttribute('aria-label', label); button.onclick = resumeShareDialog;
  renderStats();
}
let copyFeedbackTimer;
function manualCopySite() {
  const input = h('input', { value: PUBLIC_SITE, readonly: '', class: 'share-url', 'aria-label': communityText('لینک سایت', 'Website URL') });
  openDialog(communityText('کپی آدرس سایت', 'Copy website address'), input, [h('button', { class: 'btn', onclick: () => dlg.close() }, communityText('بستن', 'Close'))]);
  input.focus(); input.select();
}
async function copySite() {
  try {
    if (!navigator.clipboard) return manualCopySite();
    await navigator.clipboard.writeText(PUBLIC_SITE);
    const feedback = $('#copyFeedback');
    feedback.textContent = communityText('آدرس سایت کپی شد', 'Website address copied'); feedback.hidden = false;
    clearTimeout(copyFeedbackTimer); copyFeedbackTimer = setTimeout(() => { feedback.hidden = true; }, 3500);
  } catch { manualCopySite(); }
}
async function shareSite() {
  if (navigator.share) {
    try { await navigator.share({ title: 'Resume Builder', url: PUBLIC_SITE }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  await copySite();
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
