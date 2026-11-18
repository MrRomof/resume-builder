# Resume Builder — English & Persian

A free, open-source, one-page resume builder that runs entirely in your browser. No sign-up, no paywall, no server: your data never leaves your device.

**Features**

- **English and Persian** with one click (LTR / RTL). Each resume keeps one version per language; the second one is created from the first so you only translate.
- **19 templates:** Classic, Modern, Spotlight (centered photo), Bold, Creative, Geometric, Wave, Halo, Aurora, Ribbon, Cards, Slant, Monogram, Developer, Elegant, Compact, Minimal, Executive and **Simple (ATS)**, a plain single-column layout for job portals that screen resumes with software.
- **Fit to one page:** adjustable spacing, plus a button that tightens spacing and text size until the PDF fits on one page.
- **Pages grow with your content.** The resume expands page by page, shows where each A4 page ends, and prints as multiple pages without cutting entries in half.
- **Any color** (presets, color picker or HEX), 20+ Google Fonts, text size, photo on/off and shape.
- **Section icons** with adjustable size: 70+ built-in icons plus the full [Lucide](https://lucide.dev) library (1,500+ icons, searchable; needs internet).
- **Flexible content.** Add, remove, reorder, hide or move sections between columns: experience, internships, education, projects, certifications, courses, awards, publications, volunteering, references, skills, languages, soft skills, interests and custom sections.
- **Contact links** (GitHub, LinkedIn, Dribbble, Behance, Telegram, WhatsApp, X…) that stay clickable in the PDF.
- **Compact month/year date picker** (end date only when you want one). Uses the Solar Hijri calendar for Persian and Gregorian for English, with "year only" and "Present". Dates convert automatically when you switch language.
- **Ready-made suggestions:** 260+ skills across 19 fields, soft skills, languages, interests, job titles, degrees, plus autocomplete while typing. Suggestions open by category (e.g. Engineering → all engineering titles).
- **Resume review.** A score plus warnings and tips based on common resume-writing advice: missing contact info, summary length, no numbers in achievements, weak "Responsible for…" phrasing, dates out of order, too many skills, personal details that are not used in some countries, and Arabic ي/ك in Persian text. Many issues have a one-click fix.
- **Progress bar** for resume completeness, plus dismissible review tips.
- **Writing tips** for every section.
- **Multiple resumes.** Duplicate one per job application and tailor it.
- **Saving:** undo/redo, autosave, JSON save/open, and "copy as plain text" for application forms.
- **PDF export** through the browser's print dialog. The file name comes from your name.
- **Responsive:** on phones, settings open as a bottom sheet.

## Use

1. Open `index.html` (or the GitHub Pages site).
2. Click anywhere on the page to type. Hover over a section to see its buttons: move, other column, level style, icon, tips, hide, delete.
3. Press **Download PDF** and choose **Save as PDF**. Turn on **Background graphics** if colors are missing.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Layout: top bar, side panel, page |
| `style.css` | App UI, A4 page and templates (each template under `.tpl-<name>`) |
| `js/data.js` | Icons, contact types, personal fields, section types, fonts, UI strings, samples, data migration |
| `js/dates.js` | Jalali ↔ Gregorian conversion and date formatting |
| `js/suggest.js` | Suggestion lists, per-section tips, general guide |
| `js/templates.js` | Template layouts |
| `js/check.js` | Resume review rules |
| `js/app.js` | Editing, panel, dialogs, history, storage, printing |

There is no build step and there are no dependencies. All user-facing text is written as `L('فارسی', 'English')`.

## Contributing

- **New template:** add a layout to `TEMPLATES` in `js/templates.js` and its styles under `.tpl-<name>` in `style.css`.
- **New contact type or section:** add an entry to `CONTACT_TYPES` or `PRESETS` in `js/data.js`.
- **More suggestions or tips:** extend `SUGGEST`, `TIPS` or `GUIDE` in `js/suggest.js`.
- **New review rule:** add it to `reviewResume` in `js/check.js`.

---

<div dir="rtl">

## فارسی

رزومه‌سازی رایگان و متن‌باز که کاملاً در مرورگر کار می‌کند؛ بدون ثبت‌نام، بدون پرداخت و بدون سرور. اطلاعات شما از دستگاهتان خارج نمی‌شود.

**امکانات اصلی:**
- دو زبان فارسی و انگلیسی
- ۱۹ قالب، از جمله «مرکزی» با عکس وسط، «هاله»، «شفق»، «روبان»، «کارتی»، «حروف اول»، «برنامه‌نویس» و «ساده (ATS)» برای سایت‌های کاریابی
- تنظیم فاصله‌ها و دکمهٔ «جا دادن در یک صفحه»
- بزرگ شدن خودکار صفحه با محتوا و چاپ چندصفحه‌ای
- انتخاب هر رنگ دلخواه و بیش از ۲۰ فونت
- آیکون برای عنوان بخش‌ها با اندازه قابل تنظیم و کتابخانه کامل Lucide
- انتخاب تاریخ با ماه و سال، شمسی برای فارسی و میلادی برای انگلیسی
- بیش از ۲۶۰ مهارت آماده در ۱۹ حوزه
- بررسی خودکار رزومه با امتیاز، هشدار و پیشنهاد، و نوار پیشرفت تکمیل رزومه
- راهنمای نوشتن برای هر بخش
- چند رزومه برای آگهی‌های مختلف
- واگرد (Undo)
- کپی متن ساده
- خروجی PDF
- طراحی واکنش‌گرا برای گوشی

**استفاده:** فایل `index.html` را باز کنید، روی صفحه بنویسید و «دریافت PDF» را بزنید.

</div>

License: [MIT](LICENSE)

## GitHub Pages

This project needs no backend or build step. In Settings → Pages, choose **Deploy from a branch**, **main**, **/(root)**, then Save. Expected URL after a successful deployment: https://mrromof.github.io/resume-builder/

Resume data is saved in the browser. Export JSON from the old site and import it on the new site to move your resumes.

## Version 1.0.0 — creators and sharing

The app displays one shared creator card above all three sidebar tabs, outside the printed PDF.
It links Mohammad Fathi (name and GitHub icon) to GitHub and Fourka Team (name and LinkedIn icon) to LinkedIn, with keyboard
focus styling, responsive layout, and reduced-motion support. Website sharing
uses the native share sheet or clipboard/manual-copy fallback. Resume sharing
supports text/JSON files, falling back to downloading an attachment. PDF sharing
uses the existing print-to-PDF flow; attach that PDF in your messaging app.

Global visitor counters are **not active yet**. An optional Worker/D1 service and
setup steps are in `services/visits/README.md`. Set `analytics-config.json` only
after deploying an endpoint you control. Counts estimate unique browsers, not
verified individuals; no resume content is included in analytics requests.
Without an endpoint or if it fails, the card shows an unavailable message and dashes instead of invented totals. The site itself
still requires no backend for resume editing or PDF export.

Validation: mobile/desktop Persian/English layout, accordion alignment, print
exclusion, file-sharing/download fallback, optional counter rendering, and SQLite
counter retry/unique-browser tests. Cloudflare deployment is pending owner setup.

Sidebar update: the version stays at the bottom of the sidebar. The card has two creator links stacked on the left and a centered share button
on the right. The share button opens the share sheet or copies the URL with inline
feedback when native sharing is unavailable. Both sharing controls use the
three-circle connected share icon. Resume sharing sits beside PDF export in the header. On mobile,
both undo/redo controls remain visible, progress is hidden, and the review badge
overlays the settings button. Card shimmer takes 1.8 seconds; the border highlight
rests for five seconds then travels for four seconds. Light mode uses pale blue;
dark mode retains the original highlight. Reduced motion disables both effects.
