/* ============================================================
   CHORCHA — UI primitives
   ============================================================ */
const ICONS = {
  dashboard:'<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>',
  book:'<path d="M4 19.5V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19"/>',
  practice:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
  exam:'<path d="M9 3h6v3H9z"/><rect x="4" y="4" width="16" height="17" rx="2"/><path d="m8 12 2 2 4-4"/><path d="M8 18h6"/>',
  mistakes:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="m9 15 6-6"/><path d="m15 15-6-6"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  chart:'<path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
  message:'<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  swords:'<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m2 2 20 20"/><path d="M9.5 17.5 21 6V3h-3L6.5 14.5"/><path d="m11 19-6-6"/>',
  trophy:'<path d="M6 3h12v5a6 6 0 0 1-12 0z"/><path d="M6 5H3v2a4 4 0 0 0 4 4"/><path d="M18 5h3v2a4 4 0 0 1-4 4"/><path d="M12 14v4"/><path d="M8 21h8"/><path d="M10 18h4v3h-4z"/>',
  play:'<path d="m6 3 14 9-14 9z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 2.6 14H2.5a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 2.6V2.5a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 17 4.6a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1A1.7 1.7 0 0 0 21.5 10h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/>',
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrowRight:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  arrowLeft:'<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  flame:'<path d="M12 22c4 0 7-2.7 7-6.5 0-4.5-4-6-4-9.5 0 0-3 1.5-3 5 0 1.6-1 2-1.5 1.5C9.5 11 9 10 9 9c-2 2-4 3.6-4 6.5C5 19.3 8 22 12 22z"/>',
  sparkles:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6.5 6.5 2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  bookmark:'<path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  flag:'<path d="M4 21V4h9l-1 3h8l-2 5 2 5h-8l-1-3H4"/>',
  send:'<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 19v3"/>',
  pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  star:'<path d="m12 3 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9.1 9z"/>',
  trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v6M14 11v6"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  download:'<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 21h16"/>',
  print:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M6 18h12v3H6z"/>',
  chevronRight:'<path d="m9 5 7 7-7 7"/>',
  chevronLeft:'<path d="m15 5-7 7 7 7"/>',
  chevronDown:'<path d="m5 9 7 7 7-7"/>',
  userPlus:'<path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M17 11h6"/>',
  userCheck:'<path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="m17 11 2 2 4-4"/>',
  eyeOff:'<path d="M9.9 4.2A10 10 0 0 1 22 12a10 10 0 0 1-2.2 3.2"/><path d="M6.6 6.6A10 10 0 0 0 2 12a10 10 0 0 0 14.7 4.1"/><path d="M2 2l20 20"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  upload:'<path d="M12 21V9"/><path d="m7 13 5-5 5 5"/><path d="M4 3h16"/>',
  video:'<rect x="2" y="5" width="14" height="14" rx="3"/><path d="m22 8-6 4 6 4z"/>',
  home:'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
  more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  shieldCheck:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  award:'<circle cx="12" cy="9" r="6"/><path d="m8.2 14-1.2 8 5-3 5 3-1.2-8"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  volume:'<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  trending:'<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'
};
function icon(name, size, cls) {
  const p = ICONS[name] || ICONS.info;
  return `<svg viewBox="0 0 24 24" width="${size || 18}" height="${size || 18}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${cls || ""}" aria-hidden="true">${p}</svg>`;
}
function esc(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
function avatar(u, size, extra) {
  if (!u) return "";
  const cls = "avatar " + (size === "lg" ? "lg" : size === "xl" ? "xl" : size === "sm" ? "sm" : "");
  return `<span class="${cls} ${extra || ""}" style="background:${avatarGrad(u.hue || 210)}" aria-hidden="true">${esc(initials(u.name))}</span>`;
}
function avatarBtn(u, extra) { return avatar(u, "", extra); }

let toastTimer = [];
function toast(msg, type) {
  const wrap = document.getElementById("toasts");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = "toast " + (type || "ok");
  el.innerHTML = `${icon(type === "err" ? "alert" : "check", 16)}<span>${esc(msg)}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateY(8px)"; setTimeout(() => el.remove(), 260); }, 2800);
}

function openModal(html, opts) {
  opts = opts || {};
  closeModal();
  const wrap = document.createElement("div");
  wrap.className = "overlay";
  wrap.id = "overlay";
  wrap.innerHTML = `<div class="modal ${opts.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || "Dialog")}">${html}</div>`;
  wrap.addEventListener("click", e => { if (e.target === wrap) closeModal(); });
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";
  const focusable = wrap.querySelector("input,textarea,select,button");
  if (focusable) setTimeout(() => focusable.focus(), 60);
}
function closeModal() {
  const w = document.getElementById("overlay");
  if (w) w.remove();
  document.body.style.overflow = "";
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function emptyState(iconName, title, body, action) {
  return `<div class="empty">
    <div class="ico">${icon(iconName, 24)}</div>
    <b>${esc(title)}</b>
    <p>${esc(body)}</p>
    ${action || ""}
  </div>`;
}
function pageHead(title, sub, actions) {
  return `<div class="section-head">
    <div style="flex:1;min-width:200px">
      <h1 class="h1">${title}</h1>
      ${sub ? `<p class="muted" style="margin-top:6px;font-size:13.5px;max-width:640px">${sub}</p>` : ""}
    </div>
    ${actions || ""}
  </div>`;
}
function statCard(o) {
  return `<div class="card stat-card">
    <div class="stat-top">
      <div class="stat-ico ${o.tone || ""}">${icon(o.icon, 16)}</div>
      <span class="stat-label">${esc(o.label)}</span>
      ${o.trend ? `<span class="trend ${o.trendUp ? "up" : "down"}" style="margin-left:auto">${o.trendUp ? "▲" : "▼"} ${esc(o.trend)}</span>` : ""}
    </div>
    <div class="stat-val">${o.value}${o.unit ? `<small>${esc(o.unit)}</small>` : ""}</div>
    ${o.sub ? `<span class="tiny muted">${esc(o.sub)}</span>` : ""}
  </div>`;
}

/* ---------------- charts ---------------- */
function lineChart(values, labels, opts) {
  opts = opts || {};
  const w = 520, h = opts.height || 150, pad = 10;
  if (!values.length) values = [0];
  const max = Math.max(...values, 10) * 1.12;
  const stepX = (w - pad * 2) / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => [pad + i * stepX, h - pad - (v / max) * (h - pad * 2)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = d + ` L${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L${pts[0][0].toFixed(1)} ${h - pad} Z`;
  const grid = [0.25, 0.5, 0.75].map(f => `<line class="gridline" x1="${pad}" x2="${w - pad}" y1="${(h - pad) * f + pad * (1 - f)}" y2="${(h - pad) * f + pad * (1 - f)}"/>`).join("");
  const dots = pts.map((p, i) => `<circle class="pt ${i === pts.length - 1 ? "last" : ""}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"/>`).join("");
  const axis = labels && labels.length
    ? labels.map((l, i) => i % Math.ceil(labels.length / 6) === 0 ? `<text class="axis-label" x="${pad + i * stepX}" y="${h - 1}" text-anchor="middle">${esc(l)}</text>` : "").join("")
    : "";
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${esc(opts.label || "Line chart")}">
    <defs><linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--blue)" stop-opacity=".28"/><stop offset="100%" stop-color="var(--blue)" stop-opacity="0"/>
    </linearGradient></defs>
    ${grid}<path class="area" d="${area}"/><path class="line" d="${d}"/>${dots}${axis}
  </svg>`;
}
function barChart(rows) {
  const max = Math.max(...rows.map(r => r.value), 1);
  return `<div class="bars">${rows.map(r => `<div class="barcol">
    <div class="b ${r.tone || ""}" style="height:${Math.max(4, r.value / max * 100)}%"></div>
    <span>${esc(r.label)}</span></div>`).join("")}</div>`;
}
function heatmap(days) {
  const cells = [];
  for (let i = 111; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    const k = dayKey(d);
    const n = days[k] || 0;
    const lvl = n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 7 ? 3 : 4;
    cells.push(`<i data-l="${lvl}" title="${k} · ${n} sets"></i>`);
  }
  return `<div class="heat">${cells.join("")}</div>
    <div class="heat-legend"><span>Less</span><i data-l="0" style="background:var(--surface-3)"></i><i data-l="1" style="background:color-mix(in srgb,var(--emerald) 26%,var(--surface-3))"></i><i data-l="2" style="background:color-mix(in srgb,var(--emerald) 50%,var(--surface-3))"></i><i data-l="3" style="background:color-mix(in srgb,var(--emerald) 74%,var(--surface-3))"></i><i data-l="4" style="background:var(--emerald)"></i><span>More</span></div>`;
}

/* ---------------- shell ---------------- */
const NAV_MAIN = [
  { id:"dashboard", label:"dashboard", icon:"dashboard", href:"#/dashboard" },
  { id:"learn", label:"learn", icon:"book", href:"#/learn" },
  { id:"exams", label:"exams", icon:"exam", href:"#/exams" },
  { id:"mistakes", label:"mistakes", icon:"mistakes", href:"#/mistakes", badgeFn:() => dueMistakes().length }
];
const NAV_GROW = [
  { id:"cq", label:"cq", icon:"layers", href:"#/cq" },
  { id:"analytics", label:"analytics", icon:"chart", href:"#/analytics" },
  { id:"videos", label:"videos", icon:"play", href:"#/videos" },
  { id:"match", label:"match", icon:"swords", href:"#/match" },
  { id:"leaderboard", label:"leaderboard", icon:"trophy", href:"#/leaderboard" }
];
const NAV_SOCIAL = [
  { id:"friends", label:"friends", icon:"users", href:"#/friends", badgeFn:() => DB.friendRequests.filter(r => r.to === DB.currentUserId && r.status === "pending").length },
  { id:"chat", label:"messages", icon:"message", href:"#/chat", badgeFn:() => totalUnread() }
];

function navLink(n, active) {
  const badge = n.badgeFn ? n.badgeFn() : 0;
  return `<a class="nav-item ${active === n.id ? "active" : ""}" href="${n.href}">
    ${icon(n.icon, 18)}<span>${esc(t(n.label))}</span>
    ${badge ? `<span class="nav-badge ${n.id === "chat" ? "" : "soft"}">${badge}</span>` : ""}
  </a>`;
}
function shell(active, title, body) {
  const u = me();
  const unread = unreadNotifications();
  const admin = isAdmin();
  return `<div class="app">
    <aside class="sidebar">
      <a class="side-brand" href="#/dashboard">
        <span class="brandmark">${icon("sparkles", 20)}</span>
        <span><span class="brandname">${APP.name}</span><span class="brandsub">${DEVICE.lang === "bn" ? "শেখা · চর্চা · জয়" : "Learn · Practise · Win"}</span></span>
      </a>
      <nav class="side-nav" aria-label="Main">
        ${NAV_MAIN.map(n => navLink(n, active)).join("")}
        <div class="side-label">${DEVICE.lang === "bn" ? "প্রতিযোগিতা" : "Grow"}</div>
        ${NAV_GROW.map(n => navLink(n, active)).join("")}
        <div class="side-label">${DEVICE.lang === "bn" ? "সঙ্গ" : "Together"}</div>
        ${NAV_SOCIAL.map(n => navLink(n, active)).join("")}
        ${admin ? `<div class="side-label">${DEVICE.lang === "bn" ? "প্রশাসন" : "Operations"}</div>
          <a class="nav-item ${active === "admin" ? "active" : ""}" href="#/admin">${icon("shield", 18)}<span>${esc(t("admin"))}</span>
          <span class="nav-badge soft">${DB.users.filter(x => x.status === "pending").length}</span></a>` : ""}
      </nav>
      <div class="side-foot">
        <a class="nav-item ${active === "settings" ? "active" : ""}" href="#/settings">${icon("settings", 18)}<span>${esc(t("settings"))}</span></a>
        <a class="side-user" href="#/profile">
          ${avatar(u, "sm", "online")}
          <span class="meta"><span class="nm">${esc(nm(u))}</span><span class="sub">${esc(t("class"))} ${u.cls} · ${esc(u.medium === "bangla" ? t("bangla") : t("english"))}</span></span>
          ${icon("chevronRight", 15, "chev")}
        </a>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div class="topbar-title">${devBreadcrumb(title)}</div>
        <div class="topbar-actions">
          <button class="icon-btn plain" data-action="search" aria-label="${esc(t("search"))}">${icon("search", 18)}</button>
          <button class="icon-btn plain" data-action="toggle-lang" aria-label="${DEVICE.lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}" title="${DEVICE.lang === "bn" ? "English" : "বাংলা"}">${icon("globe", 18)}</button>
          <button class="icon-btn plain" data-action="toggle-theme" aria-label="${esc(t("theme"))}">${icon(DEVICE.theme === "dark" ? "sun" : "moon", 18)}</button>
          <a class="icon-btn plain" href="#/notifications" aria-label="${esc(t("notifications"))}" style="position:relative">
            ${icon("bell", 18)}${unread ? `<span class="badge-dot count">${unread > 9 ? "9+" : unread}</span>` : ""}
          </a>
          <span style="width:1px;height:22px;background:var(--line);margin:0 2px"></span>
          <a href="#/profile" style="display:flex;align-items:center;gap:8px">${avatar(u, "sm")}</a>
        </div>
      </header>
      <main class="content" id="view">${body}</main>
    </div>
    <nav class="mobilenav" aria-label="Primary">
      ${[
        { id:"dashboard", label:"dashboard", icon:"home", href:"#/dashboard" },
        { id:"learn", label:"learn", icon:"book", href:"#/learn" },
        { id:"exams", label:"exams", icon:"exam", href:"#/exams" },
        { id:"chat", label:"messages", icon:"message", href:"#/chat", badgeFn:() => totalUnread() },
        { id:"profile", label:"profile", icon:"users", href:"#/profile" }
      ].map(n => { const b = n.badgeFn ? n.badgeFn() : 0; return `<a class="mnav ${active === n.id ? "active" : ""}" href="${n.href}" style="position:relative">${icon(n.icon, 20)}<span>${esc(t(n.label))}</span>${b ? `<span class="badge-dot count">${b}</span>` : ""}</a>`; }).join("")}
    </nav>
  </div>`;
}
function devBreadcrumb(title) {
  const parts = String(title || "").split("›").map(p => p.trim());
  if (parts.length === 1) return `<b>${esc(parts[0])}</b>`;
  return parts.map((p, i) => i === parts.length - 1 ? `<b>${esc(p)}</b>` : `<span>${esc(p)}</span>${icon("chevronRight", 12)}`).join("");
}

/* ---------------- common fragments ---------------- */
function privacyBanner(c) {
  if (!c) return "";
  if (c.type === "group") return `<div class="privacy-banner">${icon("shieldCheck", 13)} ${esc(t("groupNotice"))}</div>`;
  const rep = activeReportFor(c.id);
  if (rep) return `<div class="privacy-banner alert">${icon("alert", 13)} ${esc(t("reportedChat"))}</div>`;
  return `<div class="privacy-banner">${icon("lock", 13)} ${esc(t("privateChat"))}</div>`;
}
function levelOf(xp) { return Math.floor(Math.sqrt((xp || 0) / 120)) + 1; }
function xpProgress(xp) {
  const lvl = levelOf(xp), base = Math.pow(lvl - 1, 2) * 120, next = Math.pow(lvl, 2) * 120;
  return { lvl, pct: Math.min(100, Math.round((xp - base) / (next - base) * 100)), need: Math.max(0, next - xp) };
}
function markPill(q) {
  const map = { easy:["green", "easy"], medium:["amber", "medium2"], hard:["rose", "hard"] };
  const m = map[q.difficulty] || map.medium;
  return `<span class="tag ${m[0]}">${esc(t(m[1]))}</span>`;
}
