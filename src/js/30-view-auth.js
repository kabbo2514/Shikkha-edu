/* ============================================================
   CHORCHA — auth, approval gate, dashboard
   ============================================================ */

function viewAuth() {
  return {
    bare: true,
    title: "Sign in",
    body: `<div class="auth">
      <section class="auth-art">
        <div class="brand">
          <span class="brandmark">${icon("sparkles", 22)}</span>
          <div><div class="brandname" style="font-size:19px">${APP.name}</div>
          <div class="brandsub" style="color:rgba(255,255,255,.5)">NCTB · Class 6–10</div></div>
        </div>
        <h1>Study with<br><em>intention.</em></h1>
        <p class="lede">A calmer way to prepare for the NCTB curriculum — chapter practice with explanations, creative questions with model answers, real exams, and a revision queue that remembers what you forget.</p>
        <div class="auth-feats">
          <div class="auth-feat"><b>${fmtNum(DB.questions.length)}</b><span>reviewed MCQs</span></div>
          <div class="auth-feat"><b>${DB.cqs.length}</b><span>creative questions</span></div>
          <div class="auth-feat"><b>Bilingual</b><span>Bangla & English</span></div>
        </div>
        <div class="foot"><span>© 2026 Chorcha</span><span>Admin-approved accounts</span><span>Student safety by design</span></div>
      </section>
      <section class="auth-panel">
        <div class="auth-card" id="authCard">${authForm("login")}</div>
      </section>
    </div>`
  };
}

function authForm(mode) {
  const isLogin = mode === "login";
  return `
    <div>
      <div class="brandmark" style="width:44px;height:44px;margin-bottom:16px">${icon("sparkles", 22)}</div>
      <h2 class="h1" style="font-size:27px">${isLogin ? (DEVICE.lang === "bn" ? "আবার স্বাগতম" : "Welcome back") : (DEVICE.lang === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create your account")}</h2>
      <p class="muted small" style="margin-top:6px">${isLogin ? (DEVICE.lang === "bn" ? "শেখা চালিয়ে যেতে সাইন ইন করুন।" : "Sign in to continue where you left off.") : esc(t("registerNote"))}</p>
      ${!isLogin && !DB.users.some(x => x.role === "owner") ? `<div class="row" style="gap:10px;align-items:flex-start;margin-top:12px;padding:11px 13px;border-radius:11px;background:var(--surface-2);border:1px solid var(--line)">
        <span style="color:var(--violet);display:flex;flex:0 0 auto">${icon("shieldCheck", 16)}</span>
        <p class="tiny" style="line-height:1.6;margin:0"><b>${DEVICE.lang === "bn" ? "প্রথম অ্যাকাউন্ট · মালিক প্রশাসক" : "First account · owner administrator"}</b><br>${DEVICE.lang === "bn" ? "এই ইনস্টলেশনের প্রথম অ্যাকাউন্টটি স্বয়ংক্রিয়ভাবে অনুমোদিত হবে এবং মালিক প্রশাসক হবে — পরে অন্য প্রশাসক নিয়োগ করতে পারবেন।" : "This is the first account on this installation. It is approved automatically as the owner administrator and can appoint other administrators from the admin console."}</p></div>` : ""}
    </div>
    <div class="auth-tabs" role="tablist">
      <button data-action="auth-tab" data-mode="login" class="${isLogin ? "active" : ""}" role="tab">${esc(t("signIn"))}</button>
      <button data-action="auth-tab" data-mode="register" class="${!isLogin ? "active" : ""}" role="tab">${esc(t("signUp"))}</button>
    </div>
    <form id="authForm" novalidate>
      ${isLogin ? `
        <div class="col" style="gap:13px">
          <div class="field"><label class="label" for="email">${esc(t("email"))}</label>
            <input class="input" id="email" name="email" type="email" autocomplete="username" placeholder="you@example.com" required></div>
          <div class="field"><label class="label" for="password">${esc(t("password"))}</label>
            <input class="input" id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required></div>
          <div class="row" style="justify-content:space-between">
            <label class="checkline" style="align-items:center"><input type="checkbox" name="remember" checked> ${DEVICE.lang === "bn" ? "সেশন মনে রাখুন" : "Keep me signed in"}</label>
            <button type="button" class="small" data-action="forgot" style="color:var(--blue);font-weight:650">${DEVICE.lang === "bn" ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}</button>
          </div>
          <div id="authError" class="errmsg" hidden></div>
          <button class="btn btn-primary btn-lg btn-block" type="submit">${esc(t("signIn"))} ${icon("arrowRight", 17)}</button>
        </div>
      ` : `
        <div class="form-grid">
          <div class="field span2"><label class="label" for="name">${esc(t("fullName"))}</label>
            <input class="input" id="name" name="name" placeholder="${DEVICE.lang === "bn" ? "রাফি আহমেদ" : "Rafi Ahmed"}" required></div>
          <div class="field"><label class="label" for="username">${esc(t("username"))}</label>
            <input class="input" id="username" name="username" placeholder="rafi_09" autocomplete="username" required>
            <span class="hint">${DEVICE.lang === "bn" ? "৩+ অক্ষর, শুধু a-z, 0-9, _" : "3+ chars · a-z, 0-9, _"}</span></div>
          <div class="field"><label class="label" for="email">${esc(t("email"))}</label>
            <input class="input" id="email" name="email" type="email" placeholder="you@example.com" required></div>
          <div class="field"><label class="label" for="cls">${esc(t("class"))}</label>
            <select class="select" id="cls" name="cls">${[6,7,8,9,10].map(c => `<option value="${c}">${esc(t("class"))} ${c}</option>`).join("")}</select></div>
          <div class="field"><label class="label" for="medium">${esc(t("medium"))}</label>
            <select class="select" id="medium" name="medium"><option value="bangla">${esc(t("bangla"))}</option><option value="english">${esc(t("english"))}</option></select></div>
          <div class="field span2"><label class="label" for="group">${DEVICE.lang === "bn" ? "শিক্ষার্থী গ্রুপ" : "Student group"}</label>
            <select class="select" id="group" name="group">${["Science","Commerce","Humanities","General"].map(g => `<option>${g}</option>`).join("")}</select></div>
          <div class="field"><label class="label" for="password">${esc(t("password"))}</label>
            <input class="input" id="password" name="password" type="password" placeholder="6+ characters" required></div>
          <div class="field"><label class="label" for="confirm">${esc(t("confirmPassword"))}</label>
            <input class="input" id="confirm" name="confirm" type="password" placeholder="••••••••" required></div>
          <div class="span2"><div id="authError" class="errmsg" hidden></div></div>
          <div class="span2"><button class="btn btn-primary btn-lg btn-block" type="submit">${esc(t("signUp"))} ${icon("arrowRight", 17)}</button></div>
        </div>
      `}
    </form>
    <div class="row" style="gap:10px"><span style="flex:1;height:1px;background:var(--line)"></span><span class="tiny faint">${esc(t("or"))}</span><span style="flex:1;height:1px;background:var(--line)"></span></div>
    <div>
      <div class="row" style="justify-content:space-between;margin-bottom:8px">
        <span class="eyebrow">${esc(t("demoAccounts"))}</span>
        <span class="tiny faint">${DEVICE.lang === "bn" ? "পাসওয়ার্ড প্রয়োজন নেই" : "one tap"}</span>
      </div>
      <div class="demo-grid">
        <button class="demo-btn" data-action="demo-login" data-id="u-student"><b>${DEVICE.lang === "bn" ? "শিক্ষার্থী" : "Student"}</b><span>Class 9 · approved</span></button>
        <button class="demo-btn" data-action="demo-login" data-id="u-admin"><b>${DEVICE.lang === "bn" ? "প্রশাসক" : "Admin"}</b><span>Full console</span></button>
        <button class="demo-btn" data-action="demo-login" data-id="u-pending"><b>${DEVICE.lang === "bn" ? "অপেক্ষমাণ" : "Pending"}</b><span>Awaiting review</span></button>
      </div>
    </div>
    <p class="tiny faint" style="text-align:center">${DEVICE.lang === "bn" ? "সাইন ইন করলে আপনি শিক্ষা-উদ্দেশ্যে গোপনীয়তা নীতি মেনে নিচ্ছেন।" : "By signing in you accept the student privacy policy."}</p>
  `;
}

function viewPending() {
  const u = me();
  const rejected = u.status === "rejected";
  const suspended = u.status === "suspended" || u.status === "banned";
  const steps = [
    { label: DEVICE.lang === "bn" ? "অ্যাকাউন্ট তৈরি" : "Account created", done: true, at: u.created },
    { label: DEVICE.lang === "bn" ? "প্রশাসক যাচাই" : "Administrator review", done: u.status === "approved", active: u.status === "pending" },
    { label: DEVICE.lang === "bn" ? "শেখা শুরু" : "Learning unlocked", done: u.status === "approved" }
  ];
  return {
    bare: true,
    title: rejected ? "Registration not approved" : suspended ? "Account paused" : t("pendingTitle"),
    body: `<div style="min-height:100vh;display:grid;place-items:center;padding:24px;position:relative;z-index:2">
      <div class="card" style="width:100%;max-width:600px;padding:34px">
        <div class="row" style="justify-content:space-between;margin-bottom:24px">
          <div class="row"><span class="brandmark">${icon("sparkles", 20)}</span><b style="letter-spacing:-.03em">${APP.name}</b></div>
          <button class="btn btn-sm btn-ghost" data-action="logout">${icon("logout", 14)} ${esc(t("signOut"))}</button>
        </div>
        <div class="lock-ico" style="background:${rejected || suspended ? "var(--rose-soft)" : "var(--amber-soft)"};color:${rejected || suspended ? "var(--rose)" : "var(--amber)"};margin-bottom:18px">
          ${icon(rejected ? "x" : suspended ? "alert" : "clock", 28)}
        </div>
        <h1 class="h1" style="font-size:27px">${rejected ? (DEVICE.lang === "bn" ? "নিবন্ধন অনুমোদিত হয়নি" : "Registration not approved") : suspended ? (DEVICE.lang === "bn" ? "অ্যাকাউন্ট স্থগিত" : "Account paused") : (DEVICE.lang === "bn" ? "আপনার অ্যাকাউন্ট যাচাই চলছে" : "Your account is being reviewed")}</h1>
        <p class="muted" style="margin-top:8px;font-size:13.5px">${rejected
          ? esc(u.rejectedReason || "The administrator did not approve this registration. You may contact the school administrator for a review.")
          : suspended
            ? esc(DEVICE.lang === "bn" ? "নিরাপত্তা পর্যালোচনার কারণে অ্যাকাউন্টটি সাময়িকভাবে বন্ধ। প্রশাসকের সাথে যোগাযোগ করুন।" : "This account is paused pending a safety review. Contact the administrator to appeal.")
            : esc(DEVICE.lang === "bn" ? "প্রতিটি নতুন শিক্ষার্থীর অ্যাকাউন্ট প্রশাসক যাচাই করেন। অনুমোদনের পর সব শেখার সুবিধা চালু হবে — সাধারণত এক কর্মদিবসের মধ্যে।" : "Every new student account is reviewed by an administrator. Once approved, practice, exams, chat and competitions unlock — usually within one working day.")}</p>
        <div class="card card-pad" style="margin-top:20px;background:var(--surface-2);box-shadow:none">
          <div class="eyebrow" style="margin-bottom:12px">${DEVICE.lang === "bn" ? "অবস্থা" : "Review timeline"}</div>
          ${steps.map((s, i) => `<div class="row" style="gap:12px;align-items:flex-start;padding:7px 0">
            <span class="verdict ${s.done ? "ok" : s.active ? "skip" : "skip"}" style="${s.done ? "" : "background:var(--surface-3);color:var(--faint)"}">${icon(s.done ? "check" : "clock", 12)}</span>
            <div style="flex:1"><b style="font-size:13px;display:block">${esc(s.label)}</b>
              <span class="tiny faint">${s.done ? timeAgo(s.at) : s.active ? (DEVICE.lang === "bn" ? "পর্যালোচনা চলছে" : "In review now") : (DEVICE.lang === "bn" ? "অপেক্ষমাণ" : "Waiting")}</span></div>
            ${s.done ? `<span class="tag green">${esc(t("approved"))}</span>` : ""}
          </div>`).join("")}
        </div>
        <div class="row" style="margin-top:20px;gap:9px;flex-wrap:wrap">
          <button class="btn btn-primary" data-action="check-status">${icon("refresh", 16)} ${esc(t("checkStatus"))}</button>
          <button class="btn btn-ghost" data-action="logout">${esc(t("signOut"))}</button>
          <span class="tiny faint" style="margin-left:auto">${esc(u.email)}</span>
        </div>
      </div>
    </div>`
  };
}

/* ---------------- dashboard ---------------- */
function viewDashboard() {
  const u = me();
  const st = overallStats();
  const lvl = xpProgress(u.xp);
  const due = dueMistakes();
  const attempts = myAttempts().slice().sort((a, b) => b.at.localeCompare(a.at));
  const lastAttempt = attempts[0];
  const lastSubject = lastAttempt ? subjectOf(lastAttempt.subjectId) : null;
  const lastChapter = lastAttempt ? chapterOf(lastAttempt.chapterId) : null;
  const qotd = DB.questions[hashStr(dayKey(new Date())) % Math.min(18, DB.questions.length)];

  const subjects = SUBJECTS.filter(isUnlockedSubject).map(s => {
    const qs = subjectQuestions(s.id);
    const acc = subjectAccuracy(s.id);
    return { s, qs:qs.length, acc, done: attempts.some(a => a.subjectId === s.id) };
  });

  const activity = [
    ...myAttempts().map(a => ({ kind:"practice", at:a.at, subject:a.subjectId, chapter:a.chapterId, data:a })),
    ...myExams().map(e => ({ kind:"exam", at:e.result.at, subject:e.subjectId, chapter:e.chapterId, data:e })),
    ...DB.matches.filter(m => m.players.includes(u.id)).map(m => ({ kind:"match", at:m.at, data:m }))
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5);

  const days = {};
  myAttempts().forEach(a => { const k = dayKey(a.at); days[k] = (days[k] || 0) + 1; });

  return {
    active:"dashboard",
    title:`${t("dashboard")}`,
    body:`<div class="page">
      <section class="hero">
        <div class="greet">${esc(t("welcome"))} · ${new Date().toLocaleDateString(DEVICE.lang === "bn" ? "bn-BD" : "en-GB", { weekday:"long", day:"numeric", month:"long" })}</div>
        <h2>${DEVICE.lang === "bn" ? "শুভ সকাল," : "Good to see you,"} <em>${esc(nm(u).split(" ")[0])}.</em></h2>
        <p>${DEVICE.lang === "bn" ? "আজ একটু চর্চা করুন — ধারাবাহিকতাই আসল শক্তি।" : "A little deliberate practice today goes further than a long session tomorrow."}</p>
        <div class="streak"><span class="flame">${icon("flame", 12)}</span> ${u.streak || 0} ${esc(t("streak"))} ${streakState().done ? `<span style="opacity:.6">·</span> <span style="opacity:.75">${DEVICE.lang === "bn" ? "আজ সম্পন্ন" : "done today"}</span>` : ""}</div>
        <div class="hero-row">
          <div class="hero-stat"><b>${fmtNum(u.xp || 0)}</b><span>${esc(t("totalPoints"))}</span></div>
          <div class="hero-stat"><b>${st.accuracy}%</b><span>${esc(t("accuracy"))}</span></div>
          <div class="hero-stat"><b>${st.exams}</b><span>${esc(t("examsTaken"))}</span></div>
          <div class="hero-stat"><b>${due.length}</b><span>${esc(t("revisionQueue"))}</span></div>
        </div>
        <div class="hero-cta">
          ${lastSubject ? `<a class="btn btn-primary" href="#/practice/${lastAttempt.chapterId}">${icon("play", 15)} ${esc(t("continueLearning"))}</a>` : `<a class="btn btn-primary" href="#/learn">${icon("book", 15)} ${esc(t("startPractice"))}</a>`}
          <a class="btn btn-ghost" href="#/revision">${icon("refresh", 15)} ${esc(t("revision"))}</a>
        </div>
      </section>

      <section class="grid g4">
        ${statCard({ icon:"target", label:t("accuracy"), value:st.accuracy + "%", sub:`${st.correct} / ${st.total} ${DEVICE.lang === "bn" ? "সঠিক উত্তর" : "answers correct"}`, trend:"4.2%", trendUp:true, tone:"green" })}
        ${statCard({ icon:"sparkles", label:t("level") + " " + lvl.lvl, value:fmtNum(u.xp || 0), unit:"XP", sub:`${lvl.need} XP ${DEVICE.lang === "bn" ? "পরবর্তী লেভেলে" : "to level " + (lvl.lvl + 1)}`, tone:"violet" })}
        ${statCard({ icon:"clock", label:t("studyTime"), value:Math.round(st.seconds / 60), unit:"min", sub:`${st.attempts} ${DEVICE.lang === "bn" ? "টি সেশন" : "sessions logged"}`, tone:"amber" })}
        ${statCard({ icon:"mistakes", label:t("revisionQueue"), value:due.length, sub:`${myMistakes().length} ${DEVICE.lang === "bn" ? "টি সক্রিয় কার্ড" : "active cards · SM-2"}`, tone:"green" })}
      </section>

      <section class="grid g-1-2">
        <div class="card">
          <div class="card-head"><h2 class="h3" style="flex:1">${esc(t("continueLearning"))}</h2><a class="btn btn-sm btn-ghost" href="#/learn">${esc(t("viewAll"))}</a></div>
          <div class="col" style="padding:16px 20px 20px">
            ${lastSubject ? `<a class="subj-card" href="#/chapter/${lastAttempt.chapterId}">
              <span class="subj-glyph" style="background:linear-gradient(150deg,${lastSubject.color[0]},${lastSubject.color[1]})">${esc(lastSubject.glyph)}</span>
              <span class="subj-meta"><b>${esc(chapName(lastChapter))}</b><span>${esc(subjName(lastSubject))} · ${DEVICE.lang === "bn" ? "শেষ অনুশীলন" : "last practised"} ${timeAgo(lastAttempt.at)}</span></span>
              ${icon("chevronRight", 16, "chev")}</a>` : `<div class="empty" style="padding:24px 6px">${icon("book", 22)}<b>${esc(t("empty"))}</b><p>${DEVICE.lang === "bn" ? "প্রথম অধ্যায় বেছে নিয়ে অনুশীলন শুরু করুন।" : "Pick a chapter to begin your first practice set."}</p><a class="btn btn-primary btn-sm" href="#/learn">${esc(t("subjects"))}</a></div>`}
            <div class="row wrap" style="gap:8px;margin-top:6px">
              <a class="chip" href="#/practice/math-frac">${icon("practice", 13)} ${DEVICE.lang === "bn" ? "ভগ্নাংশ" : "Fractions"}</a>
              <a class="chip" href="#/practice/phy-mech">${icon("practice", 13)} ${DEVICE.lang === "bn" ? "বলবিদ্যা" : "Mechanics"}</a>
              <a class="chip" href="#/practice/eng-tense">${icon("practice", 13)} Tenses</a>
              <a class="chip" href="#/learn">${icon("plus", 13)} ${esc(t("allSubjects"))}</a>
            </div>
          </div>
          <div class="divider"></div>
          <div class="card-head" style="padding-bottom:2px"><h2 class="h3">${esc(t("recentActivity"))}</h2><a class="btn btn-sm btn-ghost" href="#/analytics">${esc(t("analytics"))}</a></div>
          <div class="list">
            ${activity.length ? activity.map(a => {
              const s = subjectOf(a.subject);
              if (a.kind === "match") {
                const m = a.data, opp = m.players.find(p => p !== u.id);
                const res = m.winner === u.id ? t("win") : m.winner ? t("loss") : t("draw");
                return `<div class="list-item"><span class="stat-ico" style="background:var(--violet-soft);color:var(--violet)">${icon("swords", 15)}</span>
                  <span class="meta"><b>1v1 · ${esc(subjName(subjectOf(m.subjectId)))} — ${esc(res)}</b><span>${m.scoreA}–${m.scoreB} vs ${esc(nm(userById(opp)))} · ${timeAgo(m.at)}</span></span></div>`;
              }
              const ok = a.kind === "exam" ? a.data.result.pct : Math.round(a.data.correct / a.data.total * 100);
              return `<a class="list-item" href="#/chapter/${a.chapter}">
                <span class="stat-ico" style="background:${s ? `linear-gradient(150deg,${s.color[0]},${s.color[1]})` : "var(--surface-3)"};color:#fff">${icon(a.kind === "exam" ? "exam" : "practice", 15)}</span>
                <span class="meta"><b>${esc(chapName(chapterOf(a.chapter)))} · ${ok}%</b><span>${esc(subjName(s))} · ${a.kind === "exam" ? t("exams") : t("practice")} · ${timeAgo(a.at)}</span></span>
                <span class="tag ${ok >= 70 ? "green" : ok >= 45 ? "amber" : "rose"}">${ok}%</span></a>`;
            }).join("") : emptyState("clock", t("noActivity"), DEVICE.lang === "bn" ? "অনুশীলন করলে এখানে দেখা যাবে।" : "Your practice and exam history will appear here.")}
          </div>
        </div>

        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="row" style="justify-content:space-between;margin-bottom:14px">
              <div><div class="eyebrow">${esc(t("revisionQueue"))}</div><h3 class="h2" style="margin-top:4px">${due.length} <span class="muted" style="font-size:13px;font-weight:600">${DEVICE.lang === "bn" ? "টি কার্ড" : due.length === 1 ? "card due" : "cards due"}</span></h3></div>
              <div class="ring" style="--p:${Math.min(100, due.length * 12)}"><span>${due.length}</span></div>
            </div>
            ${due.slice(0, 3).map(m => {
              const q = DB.questions.find(x => x.id === m.questionId);
              return `<a class="row" href="#/revision" style="padding:9px 0;border-top:1px solid var(--line);text-decoration:none;color:inherit">
                <span class="tag ${m.count > 1 ? "rose" : "amber"}">${m.count}×</span>
                <span style="flex:1;min-width:0;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(q ? qText(q).q : "")}</span>
                ${icon("chevronRight", 14, "chev")}</a>`;
            }).join("")}
            <a class="btn btn-soft btn-block" style="margin-top:14px" href="#/revision">${icon("refresh", 15)} ${DEVICE.lang === "bn" ? "পুনরাবৃত্তি শুরু" : "Start revision"}</a>
          </div>

          <div class="card card-pad" style="background:linear-gradient(160deg,var(--surface),var(--surface-2))">
            <div class="row" style="justify-content:space-between">
              <span class="eyebrow">${esc(t("questionOfTheDay"))}</span>
              <span class="tag blue">${esc(subjName(subjectOf(qotd.subjectId)))}</span>
            </div>
            <p style="font-size:13.5px;font-weight:650;line-height:1.55;margin:10px 0 14px">${esc(qText(qotd).q)}</p>
            <a class="btn btn-ghost btn-sm" href="#/practice/${qotd.chapterId}">${icon("practice", 14)} ${esc(t("startPractice"))}</a>
          </div>

          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:12px">${esc(t("upcoming"))}</div>
            <div class="row" style="gap:11px;align-items:flex-start">
              <span class="stat-ico amber">${icon("calendar", 16)}</span>
              <div style="flex:1">
                <b style="font-size:13px;display:block">${DEVICE.lang === "bn" ? "মডেল পরীক্ষা · গণিত" : "Model exam · Mathematics"}</b>
                <span class="tiny faint">${DEVICE.lang === "bn" ? "রবিবার, সকাল ৮টা · ৩০ মিনিট · ২০ প্রশ্ন" : "Sunday, 8:00 am · 30 min · 20 questions"}</span>
                <a class="btn btn-sm btn-soft" style="margin-top:8px" href="#/exams">${DEVICE.lang === "bn" ? "বিস্তারিত" : "Details"} ${icon("arrowRight", 13)}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-head" style="margin-bottom:12px">
          <h2 class="h2">${esc(t("subjects"))}</h2>
          <span class="tiny faint">${DEVICE.lang === "bn" ? `শ্রেণি ${u.cls} · ${u.medium === "bangla" ? "বাংলা" : "ইংরেজি"} মাধ্যম` : `Class ${u.cls} · ${u.medium === "bangla" ? "Bangla" : "English"} medium`}</span>
          <a class="btn btn-sm btn-ghost" href="#/learn">${esc(t("viewAll"))} ${icon("arrowRight", 14)}</a>
        </div>
        <div class="grid g4">
          ${subjects.slice(0, 8).map(x => `<a class="subj-card" href="#/subject/${x.s.id}">
            <span class="subj-glyph" style="background:linear-gradient(150deg,${x.s.color[0]},${x.s.color[1]})">${esc(x.s.glyph)}</span>
            <span class="subj-meta"><b>${esc(subjName(x.s))}</b><span>${x.s.chapters.length} ${esc(t("chapters"))} · ${x.done ? x.acc + "%" : esc(t("startPractice"))}</span></span>
          </a>`).join("")}
        </div>
      </section>

      <section class="card card-pad">
        <div class="row" style="justify-content:space-between;margin-bottom:10px">
          <div><div class="eyebrow">${esc(t("practiceConsistency"))}</div><p class="small muted" style="margin-top:3px">${DEVICE.lang === "bn" ? "গত ১৬ সপ্তাহের অনুশীলন" : "Your practice over the last 16 weeks"}</p></div>
          <a class="btn btn-sm btn-ghost" href="#/analytics">${esc(t("analytics"))} ${icon("arrowRight", 14)}</a>
        </div>
        ${heatmap(days)}
      </section>
    </div>`
  };
}
