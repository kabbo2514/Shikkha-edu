/* ============================================================
   CHORCHA — admin console, profile, settings
   ============================================================ */
let ADMIN_TAB = "overview";

function viewAdmin(tab) {
  if (!isAdmin()) {
    return { active:"dashboard", title:t("admin"), body:`<div class="page"><div class="card">${emptyState("lock", "Administrator access only", "This area is restricted to accounts provisioned through the trusted admin process.", `<a class="btn btn-sm btn-ghost" href="#/dashboard">${esc(t("dashboard"))}</a>`)}</div></div>` };
  }
  const tabs = [
    ["overview", t("overview")],
    ["approvals", t("approvals"), DB.users.filter(u => u.status === "pending").length],
    ["users", t("users")],
    ["content", t("content")],
    ["videos", t("videoLibrary")],
    ["reports", t("reportsTab"), DB.reports.filter(r => r.status === "open").length],
    ["groups", t("groupsTab")],
    ["audit", t("audit")]
  ];
  return {
    active:"admin",
    title:`${t("admin")} › ${t(tabs.find(x => x[0] === tab)?.[1] || "overview")}`,
    body:`<div class="page">
      <div class="row wrap" style="gap:10px">
        <div style="flex:1;min-width:220px">
          <div class="row" style="gap:9px"><span class="admin-flag">${icon("shieldCheck", 12)} ${DEVICE.lang === "bn" ? "প্রশাসক" : "Admin console"}</span>
          ${isOwner() ? `<span class="tag violet">${icon("award", 11)} ${DEVICE.lang === "bn" ? "মালিক" : "Owner"}</span>` : ""}
          <span class="tag grey">${DB.users.filter(u => u.status === "approved").length} ${DEVICE.lang === "bn" ? "অনুমোদিত" : "approved"}</span></div>
          <h1 class="h1" style="margin-top:8px">${esc(t("admin"))}</h1>
          <p class="small muted" style="margin-top:4px">${DEVICE.lang === "bn" ? "সব সিদ্ধান্ত অডিট লগে সংরক্ষিত হয়। মডারেশন ও অ্যাক্সেস পরিবর্তন সার্ভারে প্রয়োগ হয়।" : "Every decision is written to the audit log. Moderation, access and approvals are enforced server-side."}</p>
        </div>
        <div class="row" style="gap:7px">
          <a class="btn btn-sm btn-ghost" href="#/analytics">${icon("chart", 14)} ${esc(t("analytics"))}</a>
          <button class="btn btn-sm btn-ghost" data-action="admin-announce">${icon("bell", 14)} ${esc(t("announcements"))}</button>
        </div>
      </div>
      <div class="tabs">
        ${tabs.map(x => `<button class="tab ${tab === x[0] ? "active" : ""}" data-action="admin-tab" data-tab="${x[0]}">${esc(x[1])}${x[2] ? `<span class="cnt ${x[0] === "reports" ? "alert" : ""}">${x[2]}</span>` : ""}</button>`).join("")}
      </div>
      ${tab === "overview" ? adminOverview() : ""}
      ${tab === "approvals" ? adminApprovals() : ""}
      ${tab === "users" ? adminUsers() : ""}
      ${tab === "content" ? adminContent() : ""}
      ${tab === "videos" ? adminVideos() : ""}
      ${tab === "reports" ? adminReports() : ""}
      ${tab === "groups" ? adminGroups() : ""}
      ${tab === "audit" ? adminAudit() : ""}
    </div>`
  };
}

function adminOverview() {
  const pending = DB.users.filter(u => u.status === "pending");
  const openReports = DB.reports.filter(r => r.status === "open");
  const overdue = openReports.filter(r => reportAgeDays(r) > 7);
  const regs = DB.users.filter(u => new Date(u.created).getTime() > Date.now() - 14 * 864e5);
  const byDay = {};
  regs.forEach(u => { const k = dayKey(u.created); byDay[k] = (byDay[k] || 0) + 1; });
  const bars = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date(Date.now() - (9 - i) * 864e5);
    return { label:new Date(d).toLocaleDateString("en-GB", { day:"2-digit" }), value:byDay[dayKey(d)] || 0 };
  });
  return `<div class="grid g2">
    <div class="grid g4" style="grid-column:1/-1">
      ${statCard({ icon:"userPlus", label:DEVICE.lang === "bn" ? "অপেক্ষমাণ" : "Awaiting approval", value:pending.length, sub:DEVICE.lang === "bn" ? "এক কর্মদিবসের মধ্যে" : "review within 1 working day", tone:"amber" })}
      ${statCard({ icon:"users", label:DEVICE.lang === "bn" ? "সক্রিয় শিক্ষার্থী" : "Active students", value:DB.users.filter(u => u.status === "approved").length, tone:"green" })}
      ${statCard({ icon:"shield", label:DEVICE.lang === "bn" ? "খোলা মামলা" : "Open chat cases", value:openReports.length, sub:`${overdue.length} ${DEVICE.lang === "bn" ? "মেয়াদোত্তীর্ণ" : "overdue"}`, tone:"violet" })}
      ${statCard({ icon:"layers", label:DEVICE.lang === "bn" ? "প্রশ্ন ব্যাংক" : "Question bank", value:DB.questions.length, sub:`${DB.cqs.length} CQ · ${DB.videos.length} videos`, tone:"green" })}
    </div>
    <div class="card card-pad">
      <div class="eyebrow">${DEVICE.lang === "bn" ? "গত ১০ দিনে নিবন্ধন" : "Registrations · last 10 days"}</div>
      ${barChart(bars)}
    </div>
    <div class="col" style="gap:14px">
      <div class="card">
        <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "অনুমোদনের অপেক্ষায়" : "Pending approvals"}</h2><a class="btn btn-sm btn-ghost" href="#/admin/approvals">${esc(t("viewAll"))}</a></div>
        ${pending.length ? pending.slice(0, 3).map(u => `<div class="list-item">${avatar(u, "sm")}
          <div class="meta"><b>${esc(u.name)}</b><span>@${esc(u.username)} · ${esc(t("class"))} ${u.cls} · ${timeAgo(u.created)}</span></div>
          <button class="btn btn-sm btn-primary" data-action="approve-user" data-id="${u.id}">${esc(t("approve"))}</button></div>`).join("")
          : `<div class="empty" style="padding:20px"><p class="small">${DEVICE.lang === "bn" ? "কিউ খালি।" : "Queue is clear."}</p></div>`}
      </div>
      <div class="card">
        <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "মডারেশন প্রয়োজন" : "Needs moderation"}</h2><a class="btn btn-sm btn-ghost" href="#/admin/reports">${esc(t("reportsTab"))}</a></div>
        ${openReports.length ? openReports.slice(0, 2).map(r => {
          const age = reportAgeDays(r);
          return `<div class="list-item"><span class="stat-ico ${age > 7 ? "amber" : ""}">${icon("flag", 15)}</span>
            <div class="meta"><b>${esc(r.reason.slice(0, 46))}${r.reason.length > 46 ? "…" : ""}</b>
              <span>${DEVICE.lang === "bn" ? "বয়স" : "open"} ${Math.floor(age)} ${DEVICE.lang === "bn" ? "দিন" : "days"} · ${age > 7 ? esc(t("overdue")) : Math.ceil(10 - age) + " " + t("daysLeft")}</span></div>
            <button class="btn btn-sm btn-ghost" data-action="admin-open-report" data-id="${r.id}">${esc(t("resolve"))}</button></div>`;
        }).join("") : `<div class="empty" style="padding:20px"><p class="small">${DEVICE.lang === "bn" ? "কোনো খোলা মামলা নেই।" : "No open cases."}</p></div>`}
      </div>
      <div class="card">
        <div class="card-head"><h2 class="h3">${esc(t("audit"))}</h2><a class="btn btn-sm btn-ghost" href="#/admin/audit">${esc(t("viewAll"))}</a></div>
        <div class="card-pad" style="padding-top:8px">
          ${DB.audit.length ? DB.audit.slice(0, 4).map(a => `<div class="audit"><span class="dot"></span><div class="meta"><b>${esc(a.action.replace(/_/g, " "))}</b> · ${esc(a.target)}<div class="tm">${esc((userById(a.actor) || {}).name || "System")} · ${timeAgo(a.at)}</div></div></div>`).join("") : `<p class="small faint">${DEVICE.lang === "bn" ? "এখনো কোনো কার্যক্রম নেই।" : "No admin actions recorded yet."}</p>`}
        </div>
      </div>
    </div>
  </div>`;
}

function adminApprovals() {
  const pending = DB.users.filter(u => u.status === "pending");
  const rejected = DB.users.filter(u => u.status === "rejected");
  return `<div class="col" style="gap:14px">
    <div class="card">
      <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "অপেক্ষমাণ অ্যাকাউন্ট" : "Accounts awaiting review"}</h2><span class="tag amber">${pending.length}</span></div>
      ${pending.length ? `<div class="table-wrap"><table class="table">
        <thead><tr><th>${DEVICE.lang === "bn" ? "শিক্ষার্থী" : "Student"}</th><th>${esc(t("class"))}</th><th>${esc(t("medium"))}</th><th>${DEVICE.lang === "bn" ? "নিবন্ধিত" : "Registered"}</th><th></th></tr></thead>
        <tbody>${pending.map(u => `<tr>
          <td><div class="who">${avatar(u, "sm")}<div><b>${esc(u.name)}</b><span>@${esc(u.username)} · ${esc(u.email)}</span></div></div></td>
          <td>${u.cls} · ${esc(u.group || "")}</td><td>${esc(u.medium)}</td>
          <td class="tiny faint">${timeAgo(u.created)}</td>
          <td><div class="row" style="gap:6px;justify-content:flex-end">
            <button class="btn btn-sm btn-primary" data-action="approve-user" data-id="${u.id}">${esc(t("approve"))}</button>
            <button class="btn btn-sm btn-danger" data-action="reject-user" data-id="${u.id}">${esc(t("reject"))}</button></div></td></tr>`).join("")}</tbody>
      </table></div>` : emptyState("check", DEVICE.lang === "bn" ? "সব অনুমোদিত" : "No pending registrations", DEVICE.lang === "bn" ? "নতুন নিবন্ধন এলে এখানে দেখাবে।" : "New signups will appear here for review.")}
    </div>
    ${rejected.length ? `<div class="card"><div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "প্রত্যাখ্যাত" : "Rejected"}</h2></div>
      <div class="list">${rejected.map(u => `<div class="list-item">${avatar(u, "sm")}<div class="meta"><b>${esc(u.name)}</b><span>${esc(u.email)} · ${esc(u.rejectedReason || "No reason recorded")}</span></div>
        <button class="btn btn-sm btn-ghost" data-action="approve-user" data-id="${u.id}">${esc(t("approve"))}</button></div>`).join("")}</div></div>` : ""}
    <div class="card card-pad" style="background:var(--surface-2)">
      <div class="row" style="gap:9px;align-items:flex-start"><span class="stat-ico">${icon("info", 16)}</span>
        <p class="small muted">${DEVICE.lang === "bn" ? "প্রতিটি অনুমোদন ও প্রত্যাখ্যান প্রশাসকের আইডি ও সময়সহ অডিট লগে লেখা হয়। শিক্ষার্থী নিজে কখনো অনুমোদন দিতে পারে না।" : "Approvals and rejections are logged with the administrator id and timestamp. Students can never approve themselves — the client cannot write approval status."}</p></div>
    </div>
  </div>`;
}

function adminUsers() {
  const owner = isOwner();
  const rows = DB.users.slice().sort((a, b) => {
    const rank = x => x.role === "owner" ? 0 : x.role === "admin" ? 1 : 2;
    return rank(a) - rank(b) || String(a.name || "").localeCompare(String(b.name || ""));
  });
  return `<div class="col" style="gap:14px">
    <div class="card">
      <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "সব অ্যাকাউন্ট" : "Accounts & administrators"}</h2>
        <span class="tiny faint">${rows.length} ${DEVICE.lang === "bn" ? "টি অ্যাকাউন্ট" : "accounts"} · ${DB.users.filter(u => isStaff(u)).length} ${DEVICE.lang === "bn" ? "প্রশাসক" : "staff"}</span></div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${DEVICE.lang === "bn" ? "শিক্ষার্থী" : "Account"}</th><th>${DEVICE.lang === "bn" ? "ভূমিকা" : "Role"}</th><th>${esc(t("status"))}</th><th>${esc(t("videoAccess"))}</th><th>XP</th><th></th></tr></thead>
        <tbody>${rows.map(u => {
          const roleTag = u.role === "owner" ? "violet" : u.role === "admin" ? "blue" : "grey";
          const roleLabel = u.role === "owner" ? (DEVICE.lang === "bn" ? "মালিক" : "Owner") : u.role === "admin" ? (DEVICE.lang === "bn" ? "প্রশাসক" : "Administrator") : (DEVICE.lang === "bn" ? "শিক্ষার্থী" : "Student");
          return `<tr>
          <td><div class="who">${avatar(u, "sm")}<div><b>${esc(u.name)}</b><span>@${esc(u.username)} · ${esc(t("class"))} ${u.cls}</span></div></div></td>
          <td><span class="tag ${roleTag}">${u.role === "owner" ? icon("award", 10) + " " : ""}${roleLabel}</span></td>
          <td><span class="tag ${u.status === "approved" ? "green" : u.status === "pending" ? "amber" : "rose"}">${esc(u.status)}</span></td>
          <td><button class="toggle ${u.videoAccess ? "on" : ""}" data-action="toggle-video-access" data-id="${u.id}" aria-label="${esc(t("videoAccess"))}" aria-pressed="${!!u.videoAccess}"></button></td>
          <td class="num">${fmtNum(u.xp)}</td>
          <td><div class="row" style="gap:5px;justify-content:flex-end">
            ${owner && u.role !== "owner" ? (u.role === "admin"
              ? `<button class="btn btn-sm btn-ghost" data-action="demote-admin" data-id="${u.id}">${DEVICE.lang === "bn" ? "অ্যাডমিন সরান" : "Remove admin"}</button>`
              : `<button class="btn btn-sm btn-soft" data-action="promote-admin" data-id="${u.id}"${u.status !== "approved" ? " disabled" : ""}>${icon("shieldCheck", 13)} ${DEVICE.lang === "bn" ? "অ্যাডমিন করুন" : "Make admin"}</button>`) : ""}
            ${u.role === "owner" ? `<span class="tiny faint">${DEVICE.lang === "bn" ? "প্রথম অ্যাকাউন্ট" : "First account"}</span>` : ""}
            ${u.status === "approved" && u.role !== "owner" ? `<button class="btn btn-sm btn-ghost" data-action="suspend-user" data-id="${u.id}">${esc(t("suspend"))}</button>` : u.status === "suspended" ? `<button class="btn btn-sm btn-ghost" data-action="approve-user" data-id="${u.id}">${DEVICE.lang === "bn" ? "পুনরুদ্ধার" : "Reactivate"}</button>` : ""}
            ${u.role === "owner" ? "" : `<button class="btn btn-sm btn-ghost" data-action="wipe-user" data-id="${u.id}" aria-label="Reset">${icon("trash", 14)}</button>`}</div></td></tr>`;
        }).join("")}</tbody>
      </table></div>
      <div class="card-pad" style="border-top:1px solid var(--line)">
        <div class="row" style="gap:9px;align-items:flex-start"><span class="stat-ico">${icon("shieldCheck", 16)}</span>
          <p class="tiny faint" style="line-height:1.6">${owner
            ? (DEVICE.lang === "bn" ? "মালিক হিসেবে আপনি যেকোনো অনুমোদিত শিক্ষার্থীকে প্রশাসক বানাতে বা সরাতে পারেন। প্রতিটি পরিবর্তন অডিট লগে লেখা হয়। মালিকের ভূমিকা কখনো বদলানো যায় না।" : "As owner you can appoint any approved account as an administrator, or remove that access again. Every change is written to the audit log. The owner role itself can never be reassigned or removed.")
            : (DEVICE.lang === "bn" ? "শুধু মালিক (প্রথম অ্যাকাউন্ট) প্রশাসকের ভূমিকা বদলাতে পারেন।" : "Only the owner account — the first account created on this installation — can appoint or remove administrators.")}</p></div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "ভিডিও অ্যাক্সেস অডিট" : "Video access audit"}</h2><span class="tag grey">${DB.videoGrants.length}</span></div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${DEVICE.lang === "bn" ? "শিক্ষার্থী" : "Account"}</th><th>${DEVICE.lang === "bn" ? "সিদ্ধান্ত" : "Grant"}</th><th>${DEVICE.lang === "bn" ? "প্রদানকারী" : "By"}</th><th>${DEVICE.lang === "bn" ? "সময়" : "When"}</th></tr></thead>
        <tbody>${DB.videoGrants.map(g => `<tr><td>${esc((userById(g.userId) || {}).name || "–")}</td>
          <td><span class="tag ${g.granted ? "green" : "rose"}">${g.granted ? esc(t("grant")) : esc(t("revoke"))}</span></td>
          <td class="tiny">${esc((userById(g.adminId) || {}).name || "system")}</td>
          <td class="tiny faint">${new Date(g.at).toLocaleString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}</td></tr>`).join("")}</tbody>
      </table></div>
      <div class="card-pad"><p class="tiny faint">${DEVICE.lang === "bn" ? "অ্যাক্সেস সর্বদা সব-বা-কিছু নয় — একটি অ্যাকাউন্ট চালু হলে সব প্রকাশিত ভিডিও, বন্ধ হলে কোনোটি নয়।" : "Access is all-or-nothing per account: ON unlocks every published video, including future ones; OFF removes all of them instantly."}</p></div>
    </div>
  </div>`;
}

function adminContent() {
  const rows = DB.questions.slice(-14).reverse();
  return `<div class="col" style="gap:14px">
    <div class="grid g4">
      ${statCard({ icon:"layers", label:DEVICE.lang === "bn" ? "MCQ" : "MCQs", value:DB.questions.length, tone:"violet" })}
      ${statCard({ icon:"edit", label:DEVICE.lang === "bn" ? "সৃজনশীল" : "Creative Qs", value:DB.cqs.length, tone:"green" })}
      ${statCard({ icon:"check", label:DEVICE.lang === "bn" ? "প্রকাশিত" : "Published", value:DB.questions.filter(q => q.status === "published").length, tone:"green" })}
      ${statCard({ icon:"upload", label:DEVICE.lang === "bn" ? "সূত্রসহ" : "With sources", value:DB.questions.filter(q => q.source).length, tone:"amber" })}
    </div>
    <div class="card">
      <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "প্রশ্ন ব্যাংক" : "Question bank"}</h2>
        <button class="btn btn-sm btn-primary" data-action="new-question">${icon("plus", 14)} ${DEVICE.lang === "bn" ? "নতুন MCQ" : "New MCQ"}</button></div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${esc(t("questionText"))}</th><th>${DEVICE.lang === "bn" ? "বিষয়" : "Subject"}</th><th>${esc(t("difficulty"))}</th><th>${DEVICE.lang === "bn" ? "উৎস" : "Source"}</th></tr></thead>
        <tbody>${rows.map(q => `<tr>
          <td style="max-width:380px"><b style="font-weight:600;font-size:12px;line-height:1.45;display:block">${esc(q.en.q)}</b>
            <span class="tiny faint">${q.bn ? "EN + BN" : "EN only"} · ${q.en.opts.length} options · ans ${"ABCD"[q.en.ans]}</span></td>
          <td><span class="tag blue">${esc(subjName(subjectOf(q.subjectId)))}</span></td>
          <td>${markPill(q)}</td>
          <td class="tiny faint" style="max-width:180px">${esc(q.source || "—")}</td></tr>`).join("")}</tbody>
      </table></div>
      <div class="card-pad row" style="gap:10px;border-top:1px solid var(--line)">
        <span class="tiny faint" style="flex:1">${DEVICE.lang === "bn" ? "CSV আমদানি, সংস্করণ ইতিহাস ও রোলব্যাক প্রশাসনিক কর্মপ্রবাহের অংশ।" : "CSV import, version history and rollback are part of the administrative workflow; every question keeps its source citation."}</span>
        <span class="tag green">${icon("check", 11)} review required</span>
      </div>
    </div>
  </div>`;
}

function adminVideos() {
  return `<div class="col" style="gap:14px">
    <div class="card">
      <div class="card-head"><h2 class="h3">${esc(t("videoLibrary"))}</h2>
        <button class="btn btn-sm btn-primary" data-action="upload-video">${icon("upload", 14)} ${esc(t("upload"))}</button></div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${esc(t("title"))}</th><th>${DEVICE.lang === "bn" ? "অবস্থা" : "Status"}</th><th>${esc(t("duration"))}</th><th>${DEVICE.lang === "bn" ? "দেখা" : "Views"}</th><th></th></tr></thead>
        <tbody>${DB.videos.map(v => `<tr>
          <td><b style="font-size:12.5px;display:block">${esc(v.title[DEVICE.lang] || v.title.en)}</b><span class="tiny faint">${esc(subjName(subjectOf(v.subjectId)))} · ${esc(chapName(chapterOf(v.chapterId)))} · ${esc(v.presenter)}</span></td>
          <td><span class="tag ${v.status === "published" ? "green" : v.status === "draft" ? "amber" : "grey"}">${esc(v.status === "draft" ? t("publishedDraft") : v.status)}</span></td>
          <td class="num">${fmtDur(v.duration)}</td><td class="num">${fmtNum(v.views)}</td>
          <td><div class="row" style="gap:5px;justify-content:flex-end">
            ${v.status !== "published" ? `<button class="btn btn-sm btn-soft" data-action="video-publish" data-id="${v.id}" data-status="published">${esc(t("publish"))}</button>` : `<button class="btn btn-sm btn-ghost" data-action="video-publish" data-id="${v.id}" data-status="draft">${esc(t("unpublish"))}</button>`}
            <button class="icon-btn plain" data-action="video-publish" data-id="${v.id}" data-status="archived" aria-label="${esc(t("archive"))}">${icon("trash", 15)}</button></div></td></tr>`).join("")}</tbody>
      </table></div>
      <div class="card-pad"><p class="tiny faint">${DEVICE.lang === "bn" ? "শুধু প্রশাসক আপলোড করতে পারেন। খসড়া কোনো শিক্ষার্থী দেখতে পায় না; প্রকাশের পর ভিডিও-অ্যাক্সেসপ্রাপ্ত সবাই দেখতে পারে।" : "Only administrators can upload. Drafts are invisible to students; publishing makes the lesson available to every account with video access."}</p></div>
    </div>
  </div>`;
}

function adminReports() {
  const open = DB.reports.filter(r => r.status === "open");
  const resolved = DB.reports.filter(r => r.status === "resolved");
  return `<div class="col" style="gap:14px">
    <div class="grid g3">
      ${statCard({ icon:"flag", label:DEVICE.lang === "bn" ? "সক্রিয় মামলা" : "Open cases", value:open.length, tone:"violet" })}
      ${statCard({ icon:"clock", label:DEVICE.lang === "bn" ? "৭+ দিন পুরোনো" : "Overdue (7+ days)", value:open.filter(r => reportAgeDays(r) > 7).length, tone:"amber" })}
      ${statCard({ icon:"check", label:DEVICE.lang === "bn" ? "নিষ্পত্তি" : "Resolved", value:resolved.length, tone:"green" })}
    </div>
    <div class="card card-pad" style="background:var(--amber-soft);border-color:transparent">
      <div class="row" style="gap:9px;align-items:flex-start">${icon("shield", 17)}<p class="small" style="line-height:1.6">${DEVICE.lang === "bn" ? "রিপোর্ট করা ১vs১ কথোপকথন কেবল মামলা নিষ্পত্তির আগ পর্যন্ত দেখা যায়। নিষ্পত্তি হলে দৃশ্যমানতা সাথে সাথে বন্ধ হয়, তবে সিদ্ধান্তের রেকর্ড স্থায়ী অডিট লগে থাকে।" : "Opening a reported 1v1 conversation grants temporary visibility of its full history. That access ends the moment the case is resolved — the case record itself stays permanently in the audit log."}</p></div>
    </div>
    ${open.length ? open.map(r => {
      const age = reportAgeDays(r);
      const left = 10 - age;
      const reporter = userById(r.reporterId), other = userById(r.subjectId);
      const c = convById(r.conversationId);
      return `<div class="case-card ${age > 7 ? "overdue" : ""}">
        <div class="row wrap" style="gap:9px">
          <span class="tag ${age > 7 ? "rose" : "amber"}">${icon("flag", 11)} ${DEVICE.lang === "bn" ? "সক্রিয়" : "Open case"}</span>
          <span class="deadline ${age > 7 ? "over" : left < 4 ? "warn" : "ok"}">${icon("clock", 12)} ${age > 7 ? (DEVICE.lang === "bn" ? "মেয়াদোত্তীর্ণ" : "Overdue — escalated") : `${Math.max(0, Math.ceil(left))} ${esc(t("daysLeft"))}`}</span>
          <span class="tiny faint" style="margin-left:auto">${esc(t("caseAge"))} ${timeAgo(r.createdAt)}</span>
        </div>
        <div class="row" style="gap:9px">${avatar(reporter, "sm")}<div style="flex:1"><b style="font-size:12.5px">${esc(nm(reporter))} → ${esc(nm(other))}</b>
          <div class="tiny faint">${DEVICE.lang === "bn" ? "কারণ" : "Reason"}: ${esc(r.reason)}</div></div>
          <span class="tag grey">${c ? c.messages.length : 0} ${DEVICE.lang === "bn" ? "বার্তা" : "messages"}</span></div>
        <div class="row wrap" style="gap:7px">
          <button class="btn btn-sm btn-ghost" data-action="view-reported-chat" data-id="${r.id}">${icon("message", 14)} ${DEVICE.lang === "bn" ? "কথোপকথন দেখুন" : "Review transcript"}</button>
          <button class="btn btn-sm btn-primary" data-action="resolve-report" data-id="${r.id}">${esc(t("resolve"))}</button>
          <span class="tiny faint" style="margin-left:auto">${esc(t("visibilityEnds"))}</span>
        </div>
      </div>`;
    }).join("") : `<div class="card">${emptyState("check", DEVICE.lang === "bn" ? "কোনো খোলা মামলা নেই" : "No open cases", DEVICE.lang === "bn" ? "রিপোর্ট এলে এখানে দেখা যাবে।" : "Reports filed by participants will queue here with a deadline.")}</div>`}
    ${resolved.length ? `<div class="card">
      <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "নিষ্পত্তিকৃত" : "Resolved cases"}</h2><span class="tiny faint">${DEVICE.lang === "bn" ? "স্থায়ী রেকর্ড" : "Permanent record"}</span></div>
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${DEVICE.lang === "bn" ? "মামলা" : "Case"}</th><th>${esc(t("outcome"))}</th><th>${DEVICE.lang === "bn" ? "সমাধান" : "Resolved"}</th><th>${DEVICE.lang === "bn" ? "প্রশাসক" : "Admin"}</th></tr></thead>
        <tbody>${resolved.map(r => `<tr><td><b>${esc(nm(userById(r.reporterId)))} → ${esc(nm(userById(r.subjectId)))}</b><div class="tiny faint">${esc(r.reason)}</div></td>
          <td><span class="tag ${r.outcome === "ban" ? "rose" : r.outcome === "warning" ? "amber" : "green"}">${esc(r.outcome === "ban" ? "Ban / suspend" : r.outcome === "warning" ? "Warning" : "Written response")}</span></td>
          <td class="tiny faint">${timeAgo(r.resolvedAt)}</td><td class="tiny">${esc((userById(r.reviewerId) || {}).name || "–")}</td></tr>`).join("")}</tbody>
      </table></div></div>` : ""}
  </div>`;
}

function adminGroups() {
  const groups = DB.conversations.filter(c => c.type === "group");
  const cls = ADMIN_GROUP_TAB === "marked" ? "marked" : "all";
  const rows = cls === "marked" ? groups.filter(g => DB.stars.includes(g.id)) : groups;
  return `<div class="col" style="gap:14px">
    <div class="row wrap" style="gap:8px">
      <div class="pill-group">
        <button class="pill ${cls === "all" ? "active" : ""}" data-action="group-tab" data-tab="all">${esc(t("allGroups"))} <span class="num" style="opacity:.6">${groups.length}</span></button>
        <button class="pill ${cls === "marked" ? "active" : ""}" data-action="group-tab" data-tab="marked">${esc(t("markedGroups"))} <span class="num" style="opacity:.6">${groups.filter(g => DB.stars.includes(g.id)).length}</span></button>
      </div>
      <span class="tiny faint" style="margin-left:auto">${DEVICE.lang === "bn" ? "প্রশাসক গ্রুপের সাইলেন্ট সদস্য — গ্রুপকে জানানো হয় না" : "Administrators are silent members of every group and see these conversations live."}</span>
    </div>
    <div class="grid g3">
      ${rows.map(g => {
        const last = g.messages[g.messages.length - 1];
        return `<div class="group-card">
          <div class="row" style="gap:9px">
            <span class="avatar" style="background:linear-gradient(150deg,#7C5CE0,#3E2C86)">${icon("users", 15)}</span>
            <div style="flex:1;min-width:0"><b style="font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(g.name)}</b>
              <span class="tiny faint">${g.members.length} ${DEVICE.lang === "bn" ? "সদস্য" : "members"} · ${timeAgo(last ? last.at : g.createdAt)}</span></div>
            <button class="star ${DB.stars.includes(g.id) ? "on" : ""}" data-action="star-group" data-id="${g.id}" aria-label="${esc(t("markedGroups"))}">${icon("star", 17)}</button>
          </div>
          <p class="small" style="color:var(--muted);line-height:1.5;min-height:34px">${last ? esc((userById(last.from) || {}).name || "") + ": " + esc((last.text || "").slice(0, 80)) : "—"}</p>
          <div class="row wrap" style="gap:5px">
            ${g.members.slice(0, 4).map(id => avatar(userById(id), "sm")).join("")}
            ${g.members.length > 4 ? `<span class="tiny faint">+${g.members.length - 4}</span>` : ""}
            <button class="btn btn-sm btn-ghost" style="margin-left:auto" data-action="view-group" data-id="${g.id}">${DEVICE.lang === "bn" ? "দেখুন" : "View"}</button>
          </div>
        </div>`;
      }).join("")}
    </div>
    ${!rows.length ? `<div class="card">${emptyState("star", DEVICE.lang === "bn" ? "কোনো চিহ্নিত গ্রুপ নেই" : "No marked groups", DEVICE.lang === "bn" ? "গ্রুপে স্টার দিন যাতে সহজে খুঁজে পান।" : "Star a group to keep it in this tab for attention.")}</div>` : ""}
  </div>`;
}
let ADMIN_GROUP_TAB = "all";

function adminAudit() {
  return `<div class="card">
    <div class="card-head"><h2 class="h3">${esc(t("audit"))}</h2><span class="tag grey">${DB.audit.length} ${DEVICE.lang === "bn" ? "এন্ট্রি" : "entries"}</span></div>
    <div class="card-pad" style="padding-top:10px">
      ${DB.audit.length ? DB.audit.map(a => `<div class="audit">
        <span class="dot" style="background:${/resolved|ban|suspend|reject/i.test(a.action) ? "var(--rose)" : /grant|approve|created/i.test(a.action) ? "var(--emerald)" : "var(--blue)"}"></span>
        <div class="meta"><b>${esc(a.action.replace(/_/g, " "))}</b>
          <div class="small muted">${esc(a.target)}${a.detail ? " · " + esc(a.detail) : ""}</div>
          <div class="tm">${esc((userById(a.actor) || {}).name || "System")} · ${new Date(a.at).toLocaleString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}</div></div>
        <span class="tm">${timeAgo(a.at)}</span></div>`).join("") : `<div class="empty">${icon("shield", 22)}<b>${DEVICE.lang === "bn" ? "লগ খালি" : "Audit log is empty"}</b><p>${DEVICE.lang === "bn" ? "প্রশাসনিক কাজ এখানে রেকর্ড হবে।" : "Administrative actions will be recorded here."}</p></div>`}
    </div>
  </div>`;
}

/* ---------------- profile ---------------- */
function viewProfile() {
  const u = me();
  const st = overallStats();
  const lvl = xpProgress(u.xp);
  const league = leagueOf(u.xp);
  const ach = achievementsFor(u);
  const joined = new Date(u.created).toLocaleDateString("en-GB", { month:"long", year:"numeric" });
  return {
    active:"profile",
    title:t("profile"),
    body:`<div class="page">
      <div class="card" style="overflow:hidden">
        <div style="height:92px;background:radial-gradient(500px 200px at 15% -20%,var(--blue),transparent 70%),linear-gradient(120deg,#12325C,#0A1626)"></div>
        <div class="card-pad" style="margin-top:-44px">
          <div class="row wrap" style="gap:16px;align-items:flex-end">
            ${avatar(u, "xl")}
            <div style="flex:1;min-width:180px;padding-bottom:4px">
              <h1 class="h2" style="font-size:22px">${esc(nm(u))}</h1>
              <p class="small muted">@${esc(u.username)} · ${esc(t("class"))} ${u.cls} · ${esc(u.medium === "bangla" ? t("bangla") : t("english"))} · ${esc(u.group)}</p>
              <div class="row wrap" style="gap:6px;margin-top:7px">
                <span class="tag ${isStaff(u) ? "violet" : "green"}">${u.role === "owner" ? (DEVICE.lang === "bn" ? "মালিক · প্রশাসক" : "Owner · Administrator") : u.role === "admin" ? (DEVICE.lang === "bn" ? "প্রশাসক" : "Administrator") : esc(t("approved"))}</span>
                <span class="tag amber">${icon("flame", 11)} ${u.streak || 0} ${esc(t("streak"))}</span>
                <span class="tag grey">${esc(league.name[DEVICE.lang])}</span>
                <span class="tag grey">${DEVICE.lang === "bn" ? "যোগ দিয়েছেন" : "Joined"} ${joined}</span>
              </div>
            </div>
            <div class="row" style="gap:7px;padding-bottom:4px">
              <button class="btn btn-sm btn-ghost" data-action="edit-profile">${icon("edit", 14)} ${DEVICE.lang === "bn" ? "সম্পাদনা" : "Edit profile"}</button>
              <a class="btn btn-sm btn-ghost" href="#/settings">${icon("settings", 14)}</a>
            </div>
          </div>
          <div class="grid g4" style="margin-top:20px">
            <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)"><div class="eyebrow">${esc(t("xp"))}</div><div class="stat-val" style="font-size:22px">${fmtNum(u.xp)}</div>
              <div class="bar" style="margin-top:7px"><i style="width:${lvl.pct}%"></i></div>
              <span class="tiny faint">${DEVICE.lang === "bn" ? "লেভেল" : "Level"} ${lvl.lvl} · ${lvl.need} XP ${DEVICE.lang === "bn" ? "বাকি" : "to next"}</span></div>
            <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)"><div class="eyebrow">${esc(t("accuracy"))}</div><div class="stat-val" style="font-size:22px">${st.accuracy}%</div><span class="tiny faint">${st.correct}/${st.total} ${DEVICE.lang === "bn" ? "সঠিক উত্তর" : "correct answers"}</span></div>
            <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)"><div class="eyebrow">${esc(t("studyTime"))}</div><div class="stat-val" style="font-size:22px">${Math.round(st.seconds / 60)}<small>min</small></div><span class="tiny faint">${st.attempts} ${DEVICE.lang === "bn" ? "সেশন" : "sessions"}</span></div>
            <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)"><div class="eyebrow">${esc(t("achievements"))}</div><div class="stat-val" style="font-size:22px">${ach.filter(a => a.unlocked).length}<small>/${ach.length}</small></div><span class="tiny faint">${DEVICE.lang === "bn" ? "আনলক করা" : "unlocked"}</span></div>
          </div>
        </div>
      </div>

      <div class="grid g-2-1">
        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="row" style="justify-content:space-between;margin-bottom:10px"><div><div class="eyebrow">${esc(t("subjectPerformance"))}</div></div><a class="btn btn-sm btn-ghost" href="#/analytics">${esc(t("analytics"))}</a></div>
            ${SUBJECTS.filter(isUnlockedSubject).map(s => {
              const acc = subjectAccuracy(s.id);
              const n = myAttempts().filter(a => a.subjectId === s.id).length;
              if (!n) return "";
              return `<div style="margin-bottom:10px"><div class="row" style="justify-content:space-between;font-size:12px;margin-bottom:4px"><span>${esc(subjName(s))}</span><span class="num">${acc}%</span></div>
                <div class="bar ${acc >= 70 ? "green" : ""}"><i style="width:${acc}%"></i></div></div>`;
            }).join("") || `<p class="small muted">${DEVICE.lang === "bn" ? "অনুশীলন শুরু করলে ফলাফল দেখাবে।" : "Start practising to build your subject profile."}</p>`}
          </div>
          <div class="card">
            <div class="card-head"><h2 class="h3">${esc(t("achievements"))}</h2></div>
            <div class="grid g4" style="padding:14px 20px 20px">
              ${ach.map(a => `<div style="text-align:center;opacity:${a.unlocked ? 1 : .5}">
                <div class="stat-ico ${a.unlocked ? "amber" : ""}" style="margin:0 auto 7px;width:38px;height:38px;flex:0 0 38px;background:${a.unlocked ? "var(--amber-soft)" : "var(--surface-3)"}">${icon(a.unlocked ? "award" : "lock", 17)}</div>
                <b style="font-size:11px;display:block;line-height:1.3">${esc(a.name[DEVICE.lang] || a.name.en)}</b>
                <span class="tiny faint">${a.unlocked ? esc(t("unlocked")) : esc(t("locked"))}</span></div>`).join("")}
            </div>
          </div>
        </div>
        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:10px">${esc(t("privacy"))}</div>
            <div class="row" style="justify-content:space-between;padding:7px 0"><div><b style="font-size:12.5px">${DEVICE.lang === "bn" ? "অনলাইন অবস্থা" : "Online status"}</b><div class="tiny faint">${DEVICE.lang === "bn" ? "বন্ধুরা দেখতে পাবে" : "Visible to friends"}</div></div>
              <button class="toggle ${u.priv.online ? "on" : ""}" data-action="toggle-priv" data-key="online" aria-pressed="${u.priv.online}"></button></div>
            <div class="row" style="justify-content:space-between;padding:7px 0"><div><b style="font-size:12.5px">${DEVICE.lang === "bn" ? "লিডারবোর্ডে পরিসংখ্যান" : "Leaderboard stats"}</b><div class="tiny faint">${DEVICE.lang === "bn" ? "নাম ও XP দেখাবে" : "Show name and XP publicly"}</div></div>
              <button class="toggle ${u.priv.stats ? "on" : ""}" data-action="toggle-priv" data-key="stats" aria-pressed="${u.priv.stats}"></button></div>
            <a class="btn btn-sm btn-ghost btn-block" style="margin-top:8px" href="#/settings">${esc(t("privacy"))} ${icon("arrowRight", 13)}</a>
          </div>
          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:8px">${DEVICE.lang === "bn" ? "অ্যাকাউন্ট তথ্য" : "Account details"}</div>
            <div class="kv"><span>${esc(t("email"))}</span><b style="font-size:11.5px">${esc(u.email)}</b></div>
            <div class="kv"><span>${esc(t("username"))}</span><b>@${esc(u.username)}</b></div>
            <div class="kv"><span>${esc(t("status"))}</span><b>${esc(u.status)}</b></div>
            <div class="kv"><span>${esc(t("videoAccess"))}</span><b>${u.videoAccess ? "ON" : "OFF"}</b></div>
            <div class="kv"><span>${esc(t("rank"))}</span><b>#${Math.max(1, leaderboard("global").findIndex(r => r.u.id === u.id) + 1)}</b></div>
          </div>
        </div>
      </div>
    </div>`
  };
}

/* ---------------- settings ---------------- */
function viewSettings() {
  const u = me();
  return {
    active:"settings",
    title:t("settings"),
    body:`<div class="page" style="max-width:860px">
      ${pageHead(t("settings"), DEVICE.lang === "bn" ? "ভাষা, থিম, বিজ্ঞপ্তি ও গোপনীয়তা নিয়ন্ত্রণ।" : "Language, appearance, notifications and account safety.")}
      <div class="card card-pad">
        <div class="eyebrow" style="margin-bottom:12px">${esc(t("preferences"))}</div>
        <div class="row wrap" style="gap:16px">
          <div class="field" style="flex:1;min-width:180px"><label class="label">${esc(t("language"))}</label>
            <div class="pill-group"><button class="pill ${DEVICE.lang === "en" ? "active" : ""}" data-action="set-lang" data-lang="en">English</button><button class="pill ${DEVICE.lang === "bn" ? "active" : ""}" data-action="set-lang" data-lang="bn">বাংলা</button></div></div>
          <div class="field" style="flex:1;min-width:180px"><label class="label">${esc(t("theme"))}</label>
            <div class="pill-group"><button class="pill ${DEVICE.theme === "light" ? "active" : ""}" data-action="set-theme" data-theme="light">${icon("sun", 13)} ${esc(t("light"))}</button><button class="pill ${DEVICE.theme === "dark" ? "active" : ""}" data-action="set-theme" data-theme="dark">${icon("moon", 13)} ${esc(t("dark"))}</button></div></div>
        </div>
      </div>

      <div class="card card-pad">
        <div class="eyebrow" style="margin-bottom:6px">${esc(t("notifications"))}</div>
        <div class="col" style="gap:2px">
          ${[
            ["practice", DEVICE.lang === "bn" ? "অনুশীলনের অনুস্মারক" : "Practice reminders", DEVICE.lang === "bn" ? "প্রতিদিনের চর্চার হালকা রিমাইন্ডার" : "A gentle nudge to keep your streak", true],
            ["exam", DEVICE.lang === "bn" ? "পরীক্ষার সময়সূচি" : "Exam schedules", DEVICE.lang === "bn" ? "শুরুর আগে সতর্কতা" : "Warnings before timed tests open", true],
            ["social", DEVICE.lang === "bn" ? "বন্ধু ও বার্তা" : "Friends and messages", DEVICE.lang === "bn" ? "অনুরোধ, গ্রহণ ও নতুন বার্তা" : "Requests, accepts and new messages", true],
            ["marketing", DEVICE.lang === "bn" ? "ঘোষণা ও পরামর্শ" : "Announcements and tips", DEVICE.lang === "bn" ? "টিমের পাঠানো শিক্ষামূলক পরামর্শ" : "Occasional study guidance from the team", false],
            ["preview", DEVICE.lang === "bn" ? "লক স্ক্রিনে বার্তা" : "Message previews on lock screen", DEVICE.lang === "bn" ? "ডিফল্টভাবে বন্ধ — গোপনীয়তার জন্য" : "Off by default for privacy", false]
          ].map((row, i) => `<div class="row" style="justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)">
            <div><b style="font-size:12.5px">${esc(row[1])}</b><div class="tiny faint">${esc(row[2])}</div></div>
            <button class="toggle blue ${row[3] ? "on" : ""}" data-action="toggle-pref" data-key="${row[0]}" aria-pressed="${row[3]}"></button></div>`).join("")}
        </div>
        <p class="tiny faint" style="margin-top:10px">${DEVICE.lang === "bn" ? "নিরাপত্তা ও অ্যাকাউন্ট বিজ্ঞপ্তি সবসময় পাঠানো হয়, বন্ধ করা যায় না।" : "Security and account notices are always delivered and cannot be disabled."}</p>
      </div>

      <div class="card card-pad">
        <div class="eyebrow" style="margin-bottom:10px">${esc(t("sessions"))}</div>
        <div class="row" style="gap:10px;padding:8px 0"><span class="stat-ico green">${icon("dashboard", 16)}</span>
          <div style="flex:1"><b style="font-size:12.5px">${DEVICE.lang === "bn" ? "এই ডিভাইস" : "This device"} · Web</b><div class="tiny faint">${DEVICE.lang === "bn" ? "সক্রিয় এখন" : "Active now"} · ${typeof navigator !== "undefined" ? esc(navigator.platform || "Browser") : ""}</div></div>
          <span class="tag green">${DEVICE.lang === "bn" ? "বর্তমান" : "Current"}</span></div>
        <div class="row" style="gap:10px;padding:8px 0"><span class="stat-ico">${icon("clock", 16)}</span>
          <div style="flex:1"><b style="font-size:12.5px">${DEVICE.lang === "bn" ? "শেষ লগইন" : "Last sign-in"}</b><div class="tiny faint">${u.lastLoginAt ? timeAgo(u.lastLoginAt) : esc(t("today"))}</div></div>
          <button class="btn btn-sm btn-ghost" data-action="logout">${esc(t("signOut"))}</button></div>
      </div>

      <div class="grid g2">
        <div class="card card-pad">
          <div class="eyebrow" style="margin-bottom:8px">${esc(t("changePassword"))}</div>
          <div class="field"><label class="label" for="newPass">${esc(t("newPassword"))}</label><input class="input" id="newPass" type="password" placeholder="6+ characters"></div>
          <button class="btn btn-ghost btn-block" style="margin-top:10px" data-action="change-password">${esc(t("save"))}</button>
        </div>
        <div class="card card-pad">
          <div class="eyebrow" style="margin-bottom:8px">${esc(t("privacy"))} · ${esc(t("account"))}</div>
          <p class="small muted">${DEVICE.lang === "bn" ? "অ্যাকাউন্ট মুছলে প্রোফাইল, অগ্রগতি ও চ্যাট ইতিহাস সরানো হয়। অডিট রেকর্ড নির্ধারিত সময় পর্যন্ত থাকে।" : "Deleting your account removes your profile, progress and chat history. Moderation audit records are retained as required."}</p>
          <button class="btn btn-danger btn-block" style="margin-top:10px" data-action="delete-account">${esc(t("deleteAccount"))}</button>
        </div>
      </div>

      <div class="card card-pad" style="background:var(--surface-2)">
        <div class="row wrap" style="gap:12px">
          <span class="brandmark" style="width:32px;height:32px;flex:0 0 32px">${icon("sparkles", 17)}</span>
          <div style="flex:1;min-width:180px"><b style="font-size:12.5px">${APP.name} ${APP.version}</b>
            <p class="tiny faint">${DEVICE.lang === "bn" ? "NCTB শ্রেণি ৬–১০ · বাংলা ও ইংরেজি · প্রশাসক-নিয়ন্ত্রিত প্ল্যাটফর্ম" : "NCTB classes 6–10 · Bangla & English · Administrator-governed platform"}</p></div>
          <span class="tag grey">${DEVICE.lang === "bn" ? "ডেমো বিল্ড" : "Demo build"}</span>
        </div>
      </div>
    </div>`
  };
}
