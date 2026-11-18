// ============================================================
//  Base data: icons, contact types, personal fields, section
//  presets, fonts, UI strings, sample resumes, data migration.
//  Suggestions & writing tips live in suggest.js, dates in dates.js.
//  Every user-facing text is L(persian, english).
// ============================================================

const L = (fa, en) => ({ fa, en });

const ICONS = {
  // contact & personal
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  gitlab: '<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>',
  dribbble: '<circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>',
  behance: '<path d="M3 6h5a3 3 0 0 1 0 6H3zM3 12h6a3 3 0 0 1 0 6H3z"/><path d="M14 13h7a3.5 3.5 0 0 0-7 0 3.5 3.5 0 0 0 6 2.5"/><line x1="15" y1="7" x2="20" y2="7"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  x: '<path d="M4 4l11.7 16H20L8.3 4z"/><path d="M20 4l-6.6 7.2M4 20l6.6-7.2"/>',
  youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
  medium: '<circle cx="7" cy="12" r="5"/><ellipse cx="16" cy="12" rx="2.5" ry="5"/><line x1="21.5" y1="7" x2="21.5" y2="17"/>',
  stack: '<path d="M4 15v5h14v-5"/><path d="M8 17h6M8.5 13.5l6 1.3M10 9.5l5.5 2.6M12.5 5.5l4.5 3.8M16 2.5l3 5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  // section icons
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  grad: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
  cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  gitBranch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  package: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  pie: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  barChart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  percent: '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
  anchor: '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
  feather: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  hash: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
  thumbsUp: '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  translate: '<path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  // app UI
  chevron: '<polyline points="6 9 12 15 18 9"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
  undo: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  redo: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
};

// Icons offered in the section-icon picker
const SECTION_ICONS = ['user', 'briefcase', 'building', 'grad', 'book', 'folder', 'code', 'terminal', 'gitBranch', 'cpu', 'database',
  'server', 'cloud', 'monitor', 'award', 'trophy', 'star', 'thumbsUp', 'file', 'clipboard', 'list', 'grid', 'heart', 'users', 'zap',
  'activity', 'globe', 'translate', 'smile', 'coffee', 'bookmark', 'target', 'trending', 'barChart', 'pie', 'percent', 'dollar', 'cart',
  'package', 'truck', 'tool', 'layers', 'pen', 'palette', 'image', 'camera', 'film', 'music', 'headphones', 'mic', 'feather', 'flask',
  'compass', 'map', 'anchor', 'home', 'clock', 'cal', 'key', 'lock', 'shield', 'message', 'mail', 'link', 'wifi', 'sun', 'gift', 'hash',
  'check', 'flag', 'pin'];

// base: URL prefix used when only a username is typed; multi: may be added more than once
const CONTACT_TYPES = {
  email:     { label: L('ایمیل', 'Email'), icon: 'mail', ph: 'name@example.com', url: v => 'mailto:' + v },
  phone:     { label: L('شماره تماس', 'Phone'), icon: 'phone', ph: '+98 912 000 0000', url: v => 'tel:' + digits(v) },
  website:   { label: L('وب‌سایت', 'Website'), icon: 'globe', ph: 'example.com', multi: true },
  linkedin:  { label: L('لینکدین', 'LinkedIn'), icon: 'linkedin', ph: 'linkedin.com/in/username', base: 'linkedin.com/in/' },
  github:    { label: L('گیت‌هاب', 'GitHub'), icon: 'github', ph: 'github.com/username', base: 'github.com/' },
  gitlab:    { label: L('گیت‌لب', 'GitLab'), icon: 'gitlab', ph: 'gitlab.com/username', base: 'gitlab.com/' },
  dribbble:  { label: L('دریبل', 'Dribbble'), icon: 'dribbble', ph: 'dribbble.com/username', base: 'dribbble.com/' },
  behance:   { label: L('بیهنس', 'Behance'), icon: 'behance', ph: 'behance.net/username', base: 'behance.net/' },
  telegram:  { label: L('تلگرام', 'Telegram'), icon: 'send', ph: '@username', base: 't.me/' },
  whatsapp:  { label: L('واتساپ', 'WhatsApp'), icon: 'chat', ph: '+98 912 000 0000', url: v => 'https://wa.me/' + intlPhone(v) },
  instagram: { label: L('اینستاگرام', 'Instagram'), icon: 'instagram', ph: '@username', base: 'instagram.com/' },
  x:         { label: L('ایکس (توییتر)', 'X (Twitter)'), icon: 'x', ph: '@username', base: 'x.com/' },
  youtube:   { label: L('یوتیوب', 'YouTube'), icon: 'youtube', ph: '@channel', base: 'youtube.com/@' },
  medium:    { label: L('مدیوم', 'Medium'), icon: 'medium', ph: '@username', base: 'medium.com/@' },
  stackoverflow: { label: L('استک‌اورفلو', 'Stack Overflow'), icon: 'stack', ph: 'stackoverflow.com/users/…' },
  location:  { label: L('آدرس / شهر', 'Location'), icon: 'pin', ph: L('تهران', 'Tehran, Iran') },
  custom:    { label: L('لینک دیگر', 'Other link'), icon: 'link', ph: L('نشانی یا شناسه', 'URL or handle'), multi: true },
};

// sug: key into SUGGEST for value autocomplete
const PERSONAL_TYPES = {
  city:        { label: L('محل سکونت', 'Location'), icon: 'pin', ph: L('مثلاً تهران', 'e.g. Tehran, Iran') },
  birth:       { label: L('تاریخ تولد', 'Date of birth'), icon: 'cal', ph: L('مثلاً ۱۵ مهر ۱۳۷۲', 'e.g. 7 Oct 1993') },
  military:    { label: L('وضعیت نظام وظیفه', 'Military service'), icon: 'shield', ph: L('پایان خدمت / معافیت دائم', 'Completed / Exempt'), sug: 'military' },
  marital:     { label: L('وضعیت تأهل', 'Marital status'), icon: 'heart', ph: L('مجرد / متأهل', 'Single / Married'), sug: 'marital' },
  nationality: { label: L('ملیت', 'Nationality'), icon: 'flag', ph: L('ایرانی', 'Iranian'), sug: 'nationality' },
  gender:      { label: L('جنسیت', 'Gender'), icon: 'user', ph: L('زن / مرد', 'Female / Male'), sug: 'gender' },
  license:     { label: L('گواهینامه رانندگی', "Driver's license"), icon: 'card', ph: L('پایه دو', 'Yes'), sug: 'license' },
  workmode:    { label: L('نوع همکاری', 'Availability'), icon: 'briefcase', ph: L('تمام‌وقت / دورکاری', 'Full-time / Remote'), sug: 'workmode' },
  salary:      { label: L('حقوق درخواستی', 'Expected salary'), icon: 'trending', ph: L('توافقی', 'Negotiable') },
  custom:      { label: L('مورد دلخواه', 'Custom field'), icon: 'info', ph: L('مقدار', 'Value'), multi: true },
};

// kind: text | timeline | list | skills ; col: default column in two-column templates
// date: 'range' | 'single' | null ; titleSug: autocomplete list for the entry title
const PRESETS = {
  about: { kind: 'text', icon: 'user', title: L('درباره من', 'Summary'), col: 'main',
    ph: L('در ۳ تا ۵ خط: چه کاره‌اید، چند سال تجربه دارید، مهم‌ترین مهارت‌ها و دستاوردتان چیست و دنبال چه موقعیتی هستید.',
          'In 3–5 lines: who you are, years of experience, your strongest skills and a key achievement, and what role you want.') },
  experience: { kind: 'timeline', icon: 'briefcase', title: L('سوابق شغلی', 'Experience'), col: 'main', date: 'range', titleSug: 'jobs',
    ph: { fa: { title: 'عنوان شغل', sub: 'نام شرکت / سازمان', extra: 'شهر', period: 'تاریخ', desc: '• با یک فعل شروع کنید و نتیجه را با عدد بگویید؛ مثلاً «زمان پاسخ‌گویی را ۳۰٪ کاهش دادم»' },
          en: { title: 'Job title', sub: 'Company', extra: 'City', period: 'Dates', desc: '• Start with an action verb and show the result with a number, e.g. “Cut response time by 30%”' } } },
  internship: { kind: 'timeline', icon: 'compass', title: L('کارآموزی', 'Internships'), col: 'main', date: 'range', titleSug: 'jobs',
    ph: { fa: { title: 'عنوان کارآموزی', sub: 'شرکت / سازمان', extra: 'شهر', period: 'تاریخ', desc: 'چه یاد گرفتید و چه کاری انجام دادید…' },
          en: { title: 'Intern role', sub: 'Company', extra: 'City', period: 'Dates', desc: 'What you did and learned…' } } },
  education: { kind: 'timeline', icon: 'grad', title: L('سوابق تحصیلی', 'Education'), col: 'main', date: 'range', titleSug: 'degrees',
    ph: { fa: { title: 'مقطع و رشته', sub: 'دانشگاه / مؤسسه', extra: 'شهر', period: 'تاریخ', desc: 'معدل (اگر خوب است)، پایان‌نامه، رتبه یا افتخار…' },
          en: { title: 'Degree and field', sub: 'University / School', extra: 'City', period: 'Dates', desc: 'GPA (if strong), thesis, honors…' } } },
  projects: { kind: 'list', icon: 'folder', title: L('پروژه‌ها', 'Projects'), col: 'main', date: 'range',
    ph: { fa: { title: 'نام پروژه', sub: 'نقش یا لینک', period: 'تاریخ', desc: 'مسئله، کاری که کردید، ابزارها و نتیجه…' },
          en: { title: 'Project name', sub: 'Role or link', period: 'Dates', desc: 'Problem, what you did, tools and outcome…' } } },
  certificates: { kind: 'list', icon: 'award', title: L('گواهینامه‌ها', 'Certifications'), col: 'main', date: 'single',
    ph: { fa: { title: 'نام گواهینامه', sub: 'صادرکننده', period: 'تاریخ', desc: 'توضیح (اختیاری)' },
          en: { title: 'Certificate name', sub: 'Issuer', period: 'Date', desc: 'Notes (optional)' } } },
  courses: { kind: 'list', icon: 'book', title: L('دوره‌های آموزشی', 'Courses'), col: 'main', date: 'single',
    ph: { fa: { title: 'نام دوره', sub: 'مؤسسه برگزارکننده', period: 'تاریخ', desc: 'توضیح (اختیاری)' },
          en: { title: 'Course name', sub: 'Provider', period: 'Date', desc: 'Notes (optional)' } } },
  awards: { kind: 'list', icon: 'star', title: L('افتخارات و جوایز', 'Awards'), col: 'main', date: 'single',
    ph: { fa: { title: 'عنوان جایزه یا افتخار', sub: 'اهداکننده', period: 'تاریخ', desc: 'توضیح (اختیاری)' },
          en: { title: 'Award', sub: 'Awarded by', period: 'Date', desc: 'Notes (optional)' } } },
  publications: { kind: 'list', icon: 'file', title: L('مقالات و انتشارات', 'Publications'), col: 'main', date: 'single',
    ph: { fa: { title: 'عنوان مقاله یا کتاب', sub: 'نشریه / کنفرانس / ناشر', period: 'تاریخ', desc: 'توضیح یا لینک (اختیاری)' },
          en: { title: 'Title', sub: 'Journal / Conference / Publisher', period: 'Date', desc: 'Notes or link (optional)' } } },
  volunteer: { kind: 'timeline', icon: 'heart', title: L('فعالیت‌های داوطلبانه', 'Volunteering'), col: 'main', date: 'range',
    ph: { fa: { title: 'نقش', sub: 'سازمان / انجمن', extra: 'شهر', period: 'تاریخ', desc: 'توضیح فعالیت…' },
          en: { title: 'Role', sub: 'Organization', extra: 'City', period: 'Dates', desc: 'What you did…' } } },
  references: { kind: 'list', icon: 'users', title: L('معرف‌ها', 'References'), col: 'main', date: null,
    ph: { fa: { title: 'نام معرف', sub: 'سمت و سازمان', period: '', desc: 'راه ارتباطی' },
          en: { title: 'Name', sub: 'Position and company', period: '', desc: 'Contact details' } } },
  skills: { kind: 'skills', icon: 'zap', title: L('مهارت‌ها', 'Skills'), col: 'side', style: 'bar', scale: 'skill', sug: 'skills' },
  languages: { kind: 'skills', icon: 'globe', title: L('زبان‌ها', 'Languages'), col: 'side', style: 'dots', scale: 'lang', sug: 'languages' },
  softskills: { kind: 'skills', icon: 'smile', title: L('مهارت‌های نرم', 'Soft skills'), col: 'side', style: 'tags', scale: 'skill', sug: 'soft' },
  interests: { kind: 'skills', icon: 'coffee', title: L('علاقه‌مندی‌ها', 'Interests'), col: 'side', style: 'tags', scale: 'skill', sug: 'interests' },
  customText: { kind: 'text', icon: 'bookmark', title: L('بخش متنی دلخواه', 'Custom text'), col: 'main', multi: true, ph: L('متن دلخواه…', 'Your text…') },
  customList: { kind: 'list', icon: 'bookmark', title: L('بخش فهرستی دلخواه', 'Custom list'), col: 'main', multi: true, date: 'range',
    ph: { fa: { title: 'عنوان', sub: 'زیرعنوان', period: 'تاریخ', desc: 'توضیح' },
          en: { title: 'Title', sub: 'Subtitle', period: 'Date', desc: 'Description' } } },
};

const SCALES = {
  skill: L(['مبتدی', 'متوسط', 'خوب', 'پیشرفته', 'حرفه‌ای'], ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']),
  lang: L(['مبتدی', 'مقدماتی', 'متوسط', 'پیشرفته', 'زبان مادری'], ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native']),
};
const SKILL_STYLES = { bar: L('نوار', 'Bar'), dots: L('نقطه', 'Dots'), text: L('نوشتاری', 'Text'), tags: L('برچسب (بدون سطح)', 'Tags (no level)') };

const COLORS = ['#1f4e79', '#2563eb', '#0f766e', '#15803d', '#6b2d5c', '#7c3aed', '#8b1e3f', '#be123c', '#b45309', '#c2410c', '#334155', '#111827'];

// family: Google Fonts name (loaded on demand) ; w: weights to request
const FONTS = {
  vazir:   { label: 'Vazirmatn', family: 'Vazirmatn', w: '400;500;600;700;800', css: '"Vazirmatn", Tahoma, sans-serif', langs: ['fa', 'en'] },
  sansAr:  { label: L('نوتو سنس', 'Noto Sans Arabic'), family: 'Noto Sans Arabic', w: '400;500;600;700;800', css: '"Noto Sans Arabic", Tahoma, sans-serif', langs: ['fa'] },
  naskh:   { label: L('نوتو نسخ', 'Noto Naskh Arabic'), family: 'Noto Naskh Arabic', w: '400;500;600;700', css: '"Noto Naskh Arabic", serif', langs: ['fa'] },
  kufi:    { label: L('نوتو کوفی', 'Noto Kufi Arabic'), family: 'Noto Kufi Arabic', w: '400;500;600;700;800', css: '"Noto Kufi Arabic", Tahoma, sans-serif', langs: ['fa'] },
  plexAr:  { label: L('آی‌بی‌ام پلکس', 'IBM Plex Sans Arabic'), family: 'IBM Plex Sans Arabic', w: '400;500;600;700', css: '"IBM Plex Sans Arabic", Tahoma, sans-serif', langs: ['fa'] },
  readex:  { label: L('ریدکس', 'Readex Pro'), family: 'Readex Pro', w: '400;500;600;700', css: '"Readex Pro", Tahoma, sans-serif', langs: ['fa'] },
  inter:   { label: 'Inter', family: 'Inter', w: '400;500;600;700;800', css: '"Inter", "Segoe UI", sans-serif', langs: ['en'] },
  roboto:  { label: 'Roboto', family: 'Roboto', w: '400;500;700', css: '"Roboto", Arial, sans-serif', langs: ['en'] },
  opensans:{ label: 'Open Sans', family: 'Open Sans', w: '400;500;600;700;800', css: '"Open Sans", Arial, sans-serif', langs: ['en'] },
  lato:    { label: 'Lato', family: 'Lato', w: '400;700', css: '"Lato", Arial, sans-serif', langs: ['en'] },
  source:  { label: 'Source Sans 3', family: 'Source Sans 3', w: '400;500;600;700;800', css: '"Source Sans 3", Arial, sans-serif', langs: ['en'] },
  plex:    { label: 'IBM Plex Sans', family: 'IBM Plex Sans', w: '400;500;600;700', css: '"IBM Plex Sans", Arial, sans-serif', langs: ['en'] },
  work:    { label: 'Work Sans', family: 'Work Sans', w: '400;500;600;700;800', css: '"Work Sans", Arial, sans-serif', langs: ['en'] },
  nunito:  { label: 'Nunito', family: 'Nunito', w: '400;500;600;700;800', css: '"Nunito", Arial, sans-serif', langs: ['en'] },
  montserrat: { label: 'Montserrat', family: 'Montserrat', w: '400;500;600;700;800', css: '"Montserrat", Arial, sans-serif', langs: ['en'] },
  poppins: { label: 'Poppins', family: 'Poppins', w: '400;500;600;700;800', css: '"Poppins", Arial, sans-serif', langs: ['en'] },
  raleway: { label: 'Raleway', family: 'Raleway', w: '400;500;600;700;800', css: '"Raleway", Arial, sans-serif', langs: ['en'] },
  lora:    { label: 'Lora (serif)', family: 'Lora', w: '400;500;600;700', css: '"Lora", Georgia, serif', langs: ['en'] },
  merri:   { label: 'Merriweather (serif)', family: 'Merriweather', w: '400;700', css: '"Merriweather", Georgia, serif', langs: ['en'] },
  garamond:{ label: 'EB Garamond (serif)', family: 'EB Garamond', w: '400;500;600;700;800', css: '"EB Garamond", Garamond, serif', langs: ['en'] },
  playfair:{ label: 'Playfair Display (serif)', family: 'Playfair Display', w: '400;500;600;700;800', css: '"Playfair Display", Georgia, serif', langs: ['en'] },
};
const defaultFont = lang => (lang === 'fa' ? 'vazir' : 'inter');

const UI = {
  brand: L('رزومه‌ساز', 'Resume Builder'),
  preview: L('پیش‌نمایش', 'Preview'), edit: L('ویرایش', 'Edit'),
  pdf: L('دریافت PDF', 'Download PDF'), panel: L('تنظیمات', 'Settings'),
  undo: L('واگرد', 'Undo'), redo: L('ازنو', 'Redo'),
  tabDesign: L('ظاهر', 'Design'), tabCheck: L('بررسی', 'Review'), tabFiles: L('رزومه‌ها', 'Resumes'),
  template: L('قالب', 'Template'), color: L('رنگ اصلی', 'Accent color'), customColor: L('رنگ دلخواه', 'Custom color'),
  font: L('فونت', 'Font'), size: L('اندازه متن', 'Text size'),
  photo: L('عکس', 'Photo'), photoShape: L('شکل عکس', 'Photo shape'), icons: L('آیکون عنوان بخش‌ها', 'Section title icons'),
  shapeAuto: L('مطابق قالب', 'Template default'), shapeCircle: L('دایره', 'Circle'), shapeRounded: L('گوشه گرد', 'Rounded'), shapeSquare: L('مربع', 'Square'),
  hint: L('روی هر قسمت صفحه کلیک کنید و بنویسید. ماوس را روی هر بخش ببرید تا دکمه‌های آن ظاهر شوند. همه‌چیز خودکار در همین مرورگر ذخیره می‌شود.',
          'Click anywhere on the page to type. Hover over a section to see its buttons. Everything is saved in this browser automatically.'),
  fit: L('محتوا از یک صفحه بیشتر شده؛ خلاصه‌تر بنویسید یا اندازه متن را کم کنید', 'Content is longer than one page — shorten it or reduce the text size'),
  addPhoto: L('افزودن عکس', 'Add photo'), removePhoto: L('حذف عکس', 'Remove photo'),
  contacts: L('اطلاعات تماس', 'Contact'), personal: L('اطلاعات فردی', 'Personal details'),
  addContact: L('راه ارتباطی', 'Contact'), addPersonal: L('مورد', 'Detail'),
  addSection: L('افزودن بخش', 'Add section'), addItem: L('افزودن مورد', 'Add item'),
  suggestions: L('پیشنهادها', 'Suggestions'),
  up: L('بالا', 'Move up'), down: L('پایین', 'Move down'), swapCol: L('انتقال به ستون دیگر', 'Move to other column'),
  levelStyle: L('نمایش سطح', 'Level style'), del: L('حذف', 'Delete'), changeLevel: L('تغییر سطح', 'Change level'),
  secIcon: L('آیکون عنوان', 'Title icon'), noIcon: L('بدون آیکون', 'No icon'),
  hide: L('پنهان در خروجی', 'Hide from PDF'), show: L('نمایش در خروجی', 'Show in PDF'), hiddenNote: L('پنهان', 'hidden'),
  tips: L('راهنمای نوشتن', 'Writing tips'),
  cancel: L('انصراف', 'Cancel'), ok: L('تأیید', 'Done'), addSelected: L('افزودن موارد انتخاب‌شده', 'Add selected'), added: L('اضافه شده', 'added'),
  pickContact: L('افزودن راه ارتباطی', 'Add a contact'), pickPersonal: L('افزودن اطلاعات فردی', 'Add a personal detail'),
  pickSection: L('افزودن بخش', 'Add a section'),
  namePh: L('نام و نام خانوادگی', 'Full name'), titlePh: L('عنوان شغلی (مثلاً توسعه‌دهنده فرانت‌اند)', 'Job title (e.g. Frontend Developer)'),
  secTitlePh: L('عنوان بخش', 'Section title'), labelPh: L('عنوان', 'Label'), skillPh: L('نام مهارت', 'Skill'), tagPh: L('عنوان', 'Item'),
  delSecConfirm: L('بخش «{0}» حذف شود؟', 'Delete the “{0}” section?'),
  resetConfirm: L('همه اطلاعات این زبانِ این رزومه پاک شود؟', 'Clear everything in this language of this resume?'),
  invalidFile: L('فایل معتبر نیست.', 'This file is not valid.'),
  storageFail: L('ذخیره در مرورگر ممکن نشد (احتمالاً عکس‌ها حجیم‌اند)؛ از «ذخیره فایل» استفاده کنید.', 'Could not save in this browser (photos may be too large); use “Save file”.'),
  newLang: L('نسخه فارسی از روی نسخه انگلیسی ساخته شد؛ متن‌ها را ترجمه کنید.', 'The English version was created from your Persian one — translate the texts.'),
  // dates
  date: L('تاریخ', 'Date'), start: L('شروع', 'Start'), end: L('پایان', 'End'),
  noEnd: L('ندارد', 'None'), present: L('تا کنون', 'Present'), presentShort: L('اکنون', 'Present'), onDate: L('تاریخ', 'Date'),
  yearOnly: L('فقط سال', 'Year only'), customText: L('یا متن دلخواه', 'Or custom text'), clearDate: L('حذف تاریخ', 'Clear'),
  endBeforeStart: L('تاریخ پایان قبل از شروع است.', 'End date is before the start date.'),
  // resumes & files
  myResumes: L('رزومه‌های من', 'My resumes'), newResume: L('رزومه جدید', 'New resume'), duplicate: L('کپی', 'Duplicate'),
  rename: L('تغییر نام', 'Rename'), delResume: L('حذف', 'Delete'), renamePrompt: L('نام رزومه:', 'Resume name:'),
  delResumeConfirm: L('رزومه «{0}» برای همیشه حذف شود؟', 'Delete “{0}” permanently?'),
  defaultName: L('رزومه من', 'My resume'), sampleName: L('نمونه', 'Sample'), copyOf: L('کپی {0}', '{0} (copy)'),
  tailorHint: L('برای هر آگهی شغلی یک کپی بسازید و آن را متناسب با همان شغل تنظیم کنید.', 'Make a copy for each job you apply to and tailor it to that role.'),
  files: L('فایل', 'File'), exportFile: L('ذخیره فایل', 'Save file'), importFile: L('بارگذاری فایل', 'Open file'),
  sample: L('ساخت نمونه', 'Create sample'), reset: L('پاک کردن این زبان', 'Clear this language'),
  copyText: L('کپی متن ساده', 'Copy as plain text'), copied: L('متن رزومه کپی شد؛ می‌توانید در فرم‌های استخدامی بچسبانید.', 'Resume text copied — paste it into job application forms.'),
  privacy: L('اطلاعات شما فقط در همین مرورگر می‌ماند و به هیچ سروری فرستاده نمی‌شود. همه امکانات رایگان است.', 'Your data stays in this browser and is never sent to a server. Everything is free.'),
  imported: L('فایل به‌صورت یک رزومه جدید اضافه شد.', 'The file was added as a new resume.'),
  year: L('سال', 'Year'), month: L('ماه', 'Month'),
  iconSize: L('اندازه آیکون‌ها', 'Icon size'), spacing: L('فاصله‌ها', 'Spacing'),
  fitOne: L('جا دادن در یک صفحه', 'Fit to one page'), fitDone: L('رزومه در یک صفحه جا شد. با «برگشت» می‌توانید آن را لغو کنید.', 'Your resume now fits on one page. Use Undo to revert.'),
  fitFail: L('محتوا برای یک صفحه زیاد است؛ موارد قدیمی‌تر یا کم‌اهمیت را کوتاه کنید.', 'There is too much content for one page — shorten older or less relevant items.'),
  iconsBasic: L('آیکون‌های اصلی', 'Basic'), iconsLibrary: L('کتابخانه Lucide', 'Lucide library'),
  searchIcons: L('جستجو به انگلیسی، مثلاً briefcase', 'Search, e.g. briefcase'), loadingIcons: L('در حال بارگذاری آیکون‌ها…', 'Loading icons…'),
  iconsOffline: L('برای این تب به اینترنت نیاز است.', 'This tab needs an internet connection.'),
  iconsCount: L('{0} آیکون', '{0} icons'), iconsCredit: L('آیکون‌های Lucide با مجوز ISC', 'Lucide icons, ISC license'),
  pageCount: L('{0} صفحه', '{0} page(s)'), pageN: L('صفحه {0}', 'Page {0}'),
  progress: L('تکمیل رزومه', 'Resume progress'), dismiss: L('نادیده بگیر', 'Dismiss'),
  showDismissed: L('نمایش {0} مورد نادیده‌گرفته', 'Show {0} dismissed'),
};

/* ---------- building data ---------- */
const uid = () => Math.random().toString(36).slice(2, 9);
const clampLevel = n => { const x = Math.round(+n); return Number.isFinite(x) ? Math.min(5, Math.max(1, x)) : 3; };
const has = (obj, k) => typeof k === 'string' && Object.hasOwn(obj, k);

function newItem(kind) {
  return kind === 'skills' ? { name: '', level: 3 } : { title: '', sub: '', extra: '', period: '', desc: '', start: null, end: null };
}
function newSection(type, lang) {
  const p = PRESETS[type];
  const s = { id: uid(), type, title: p.title[lang], col: p.col, icon: p.icon, hidden: false };
  if (p.kind === 'text') s.content = '';
  else if (p.kind === 'skills') { s.style = p.style; s.items = [newItem('skills'), newItem('skills'), newItem('skills')]; }
  else s.items = [newItem(p.kind)];
  return s;
}

function blankResume(lang = 'en') {
  return {
    version: 2,
    settings: { lang, template: 'classic', accent: COLORS[0], font: defaultFont(lang), size: 100, photo: lang === 'fa', photoShape: 'auto', icons: true, iconSize: 100, spacing: 100, dismissed: [] },
    profile: { name: '', title: '', photo: '' },
    contacts: [{ type: 'email', value: '' }, { type: 'phone', value: '' }, { type: 'linkedin', value: '' }],
    personal: lang === 'fa'
      ? [{ type: 'city', label: '', value: '' }, { type: 'birth', label: '', value: '' }, { type: 'military', label: '', value: '' }]
      : [{ type: 'city', label: '', value: '' }],
    sections: ['about', 'experience', 'education', 'skills', 'languages'].map(t => newSection(t, lang)),
  };
}

// Copy a resume into the other language: keep everything, swap default titles, convert dates
function translateResume(d, lang) {
  const r = structuredClone(d);
  const from = r.settings.lang;
  r.settings.lang = lang;
  if (!FONTS[r.settings.font].langs.includes(lang)) r.settings.font = defaultFont(lang);
  for (const s of r.sections) {
    if (s.title === PRESETS[s.type].title[from]) s.title = PRESETS[s.type].title[lang];
    for (const it of s.items || []) {
      if (it.start) it.start = convertYM(it.start, from, lang);
      if (it.end && it.end !== 'present') it.end = convertYM(it.end, from, lang);
    }
  }
  return r;
}

const SAMPLE_TEXT = {
  fa: {
    name: 'علی رضایی', title: 'توسعه‌دهنده ارشد فرانت‌اند',
    personal: [['city', 'تهران'], ['birth', '۱۵ مهر ۱۳۷۲'], ['military', 'پایان خدمت']],
    about: 'توسعه‌دهنده فرانت‌اند با بیش از شش سال تجربه در ساخت رابط‌های کاربری سریع و مقیاس‌پذیر با React و TypeScript. رهبری تیم چهارنفره و کاهش ۴۰٪ زمان بارگذاری پنل اصلی شرکت. به دنبال نقش ارشد در تیمی محصول‌محور.',
    experience: [
      ['توسعه‌دهنده ارشد فرانت‌اند', 'شرکت نمونه‌افزار', [1400, 7], 'present', '• رهبری تیم چهارنفره و بازطراحی پنل مدیریت با React\n• کاهش ۴۰٪ زمان بارگذاری صفحات و افزایش ۲۵٪ رضایت کاربران', 'تهران'],
      ['توسعه‌دهنده وب', 'استودیو طرح نو', [1397, 2], [1400, 6], '• پیاده‌سازی ۱۲ وب‌سایت فروشگاهی\n• ساخت کتابخانه کامپوننت مشترک که زمان توسعه را نصف کرد', 'اصفهان'],
    ],
    projects: [
      ['رزومه‌ساز متن‌باز', 'github.com/alirezaei/resume', [1403, 0], null, 'ابزار ساخت رزومه با چند قالب، دو زبان و خروجی PDF؛ بیش از ۵۰۰ ستاره در گیت‌هاب.'],
    ],
    education: [
      ['کارشناسی ارشد مهندسی نرم‌افزار', 'دانشگاه تهران', [1395, 0], [1397, 0], 'معدل ۱۸٫۲'],
      ['کارشناسی مهندسی کامپیوتر', 'دانشگاه صنعتی اصفهان', [1391, 0], [1395, 0], ''],
    ],
    languages: [['فارسی', 5], ['انگلیسی', 4]],
    interests: ['کوهنوردی', 'عکاسی', 'فعالیت‌های متن‌باز'],
  },
  en: {
    name: 'Ali Rezaei', title: 'Senior Frontend Developer',
    personal: [['city', 'Tehran, Iran']],
    about: 'Frontend developer with 6+ years of experience building fast, scalable interfaces with React and TypeScript. Led a team of four and cut load time of the main product by 40%. Looking for a senior role on a product-focused team.',
    experience: [
      ['Senior Frontend Developer', 'Sample Soft Co.', [2021, 10], 'present', '• Led a team of four and rebuilt the admin panel in React\n• Cut page load time by 40% and raised user satisfaction by 25%', 'Tehran'],
      ['Web Developer', 'Tarh-e No Studio', [2018, 5], [2021, 9], '• Shipped 12 e-commerce websites\n• Built a shared component library that halved development time', 'Isfahan'],
    ],
    projects: [
      ['Open-source Resume Builder', 'github.com/alirezaei/resume', [2024, 0], null, 'Resume tool with multiple templates, two languages and PDF export; 500+ GitHub stars.'],
    ],
    education: [
      ['M.Sc. Software Engineering', 'University of Tehran', [2016, 0], [2018, 0], 'GPA 18.2 / 20'],
      ['B.Sc. Computer Engineering', 'Isfahan University of Technology', [2012, 0], [2016, 0], ''],
    ],
    languages: [['Persian', 5], ['English', 4]],
    interests: ['Hiking', 'Photography', 'Open Source'],
  },
};

function sampleResume(settings) {
  const lang = settings.lang;
  const t = SAMPLE_TEXT[lang];
  const ym = v => (Array.isArray(v) ? { y: v[0], m: v[1] } : v);
  const sec = (type, data) => ({ ...newSection(type, lang), ...data });
  const entries = rows => rows.map(([title, sub, start, end, desc = '', extra = '']) => ({ title, sub, extra, desc, period: '', start: ym(start), end: ym(end) }));
  return normalize({
    version: 2,
    settings,
    profile: { name: t.name, title: t.title, photo: '' },
    contacts: [
      { type: 'email', value: 'ali.rezaei@example.com' },
      { type: 'phone', value: '+98 912 000 0000' },
      { type: 'linkedin', value: 'linkedin.com/in/ali-rezaei' },
      { type: 'github', value: 'github.com/alirezaei' },
    ],
    personal: t.personal.map(([type, value]) => ({ type, value })),
    sections: [
      sec('about', { content: t.about }),
      sec('experience', { items: entries(t.experience) }),
      sec('projects', { items: entries(t.projects) }),
      sec('education', { items: entries(t.education) }),
      sec('skills', { items: [['JavaScript / TypeScript', 5], ['React', 5], ['HTML & CSS', 5], ['Node.js', 3], ['Git', 4]].map(([name, level]) => ({ name, level })) }),
      sec('languages', { items: t.languages.map(([name, level]) => ({ name, level })) }),
      sec('interests', { items: t.interests.map(name => ({ name, level: 3 })) }),
    ],
  });
}

/* ---------- reading data (file or browser storage) ---------- */
const str = v => (v == null ? '' : String(v));

function normalize(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error('invalid resume');
  if (d.version !== 2) return fromV1(d);
  const lang = d.settings?.lang === 'fa' ? 'fa' : 'en';
  const b = blankResume(lang);
  const st = { ...b.settings, ...d.settings, lang };
  if (!has(TEMPLATES, st.template)) st.template = b.settings.template;
  if (!has(FONTS, st.font) || !FONTS[st.font].langs.includes(lang)) st.font = defaultFont(lang);
  if (!/^#[0-9a-f]{6}$/i.test(st.accent)) st.accent = b.settings.accent;
  if (!['auto', 'circle', 'rounded', 'square'].includes(st.photoShape)) st.photoShape = 'auto';
  st.size = Math.min(115, Math.max(80, +st.size || 100));
  st.photo = st.photo !== false;
  st.icons = st.icons !== false;
  st.iconSize = Math.min(170, Math.max(70, +st.iconSize || 100));
  st.spacing = Math.min(130, Math.max(75, +st.spacing || 100));
  delete st.deco;
  st.dismissed = Array.isArray(st.dismissed) ? st.dismissed.filter(x => typeof x === 'string').slice(-200) : [];
  const photo = str(d.profile?.photo);
  return {
    version: 2,
    settings: st,
    profile: { name: str(d.profile?.name), title: str(d.profile?.title), photo: photo.startsWith('data:image/') ? photo : '' },
    contacts: (Array.isArray(d.contacts) ? d.contacts : b.contacts)
      .filter(c => c && has(CONTACT_TYPES, c.type)).map(c => ({ type: c.type, value: str(c.value) })),
    personal: (Array.isArray(d.personal) ? d.personal : b.personal)
      .filter(p => p && has(PERSONAL_TYPES, p.type)).map(p => ({ type: p.type, label: str(p.label), value: str(p.value) })),
    sections: (Array.isArray(d.sections) ? d.sections : b.sections).filter(s => s && has(PRESETS, s.type)).map(s => fixSection(s, lang)),
  };
}

function fixSection(s, lang) {
  const base = newSection(s.type, lang);
  const kind = PRESETS[s.type].kind;
  const out = { id: str(s.id) || base.id, type: s.type, title: s.title == null ? base.title : str(s.title),
    col: s.col === 'main' || s.col === 'side' ? s.col : base.col,
    icon: base.icon, iconNode: null, hidden: s.hidden === true };
  const node = sanitizeIconNode(s.iconNode);
  if (s.icon === '' || has(ICONS, s.icon)) out.icon = s.icon;
  else if (/^lucide:[A-Za-z0-9]+$/.test(str(s.icon)) && node) { out.icon = s.icon; out.iconNode = node; }
  if (kind === 'text') out.content = str(s.content);
  else {
    const items = Array.isArray(s.items) ? s.items : base.items;
    out.items = items.filter(it => it && typeof it === 'object').map(it => {
      const n = newItem(kind);
      for (const k of Object.keys(n)) {
        if (k === 'level') n[k] = clampLevel(it.level);
        else if (k === 'start') n[k] = parseYM(it.start);
        else if (k === 'end') n[k] = it.end === 'present' ? 'present' : parseYM(it.end);
        else n[k] = str(it[k]);
      }
      return n;
    });
  }
  if (kind === 'skills') out.style = has(SKILL_STYLES, s.style) ? s.style : base.style;
  return out;
}

// Files saved by the first personal version (flat, Persian, no version number)
function fromV1(d) {
  if (!['name', 'title', 'email', 'phone', 'about', 'jobs', 'edu', 'skills'].some(k => k in d)) throw new Error('not a resume file');
  const r = blankResume('fa');
  if (d.accent) r.settings.accent = d.accent;
  r.profile = { name: str(d.name), title: str(d.title), photo: str(d.photo) };
  r.contacts = [
    { type: 'email', value: str(d.email) },
    { type: 'phone', value: str(d.phone) },
    { type: 'linkedin', value: str(d.linkedin) },
  ];
  r.personal = [
    { type: 'city', value: str(d.city) },
    { type: 'birth', value: str(d.birth) },
    { type: 'military', value: str(d.military) },
  ];
  if (d.marital) r.personal.push({ type: 'marital', value: str(d.marital) });
  const sec = t => r.sections.find(s => s.type === t);
  sec('about').content = str(d.about);
  if (Array.isArray(d.jobs)) sec('experience').items = d.jobs.map(j => ({ title: j.role, sub: j.company, period: j.period, desc: j.desc }));
  if (Array.isArray(d.edu)) sec('education').items = d.edu.map(e => ({ title: e.degree, sub: e.school, period: e.period, desc: e.desc }));
  if (Array.isArray(d.skills)) sec('skills').items = d.skills;
  return normalize(r);
}

/* ---------- icons from the Lucide library are stored as safe shape lists ---------- */
const SVG_TAGS = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);
const SVG_ATTRS = new Set(['d', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points']);
function sanitizeIconNode(nodes) {
  if (!Array.isArray(nodes)) return null;
  const out = [];
  for (const n of nodes.slice(0, 40)) {
    if (!Array.isArray(n) || !SVG_TAGS.has(n[0]) || !n[1] || typeof n[1] !== 'object') continue;
    const a = {};
    for (const [k, v] of Object.entries(n[1])) {
      if (SVG_ATTRS.has(k) && (typeof v === 'string' || typeof v === 'number') && String(v).length < 3000) a[k] = String(v);
    }
    out.push([n[0], a]);
  }
  return out.length ? out : null;
}

/* ---------- links for the PDF ---------- */
const toLatinDigits = v => v.replace(/[۰-۹]/g, c => '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c));
const toFaDigits = v => String(v).replace(/\d/g, c => '۰۱۲۳۴۵۶۷۸۹'[c]);
const digits = v => toLatinDigits(v).replace(/[^\d+]/g, '');
const intlPhone = v => digits(v).replace(/^\+/, '').replace(/^00/, '').replace(/^0/, '98');

function contactUrl(c) {
  const t = CONTACT_TYPES[c.type];
  const v = c.value.trim();
  if (!v || !t || c.type === 'location') return '';
  if (t.url) return t.url(v);
  if (/^https?:\/\//i.test(v)) return v;
  if (!v.includes('.') || /\s/.test(v)) return t.base ? 'https://' + t.base + v.replace(/^@/, '') : '';
  return 'https://' + v;
}
