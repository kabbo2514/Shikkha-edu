/* ============================================================
   CHORCHA — learn, practice, exams, mistakes, revision
   ============================================================ */
let PRACTICE = null;
let EXAMSESSION = null;
let REVISION = null;

function startPractice(chapterId, opts) {
  opts = opts || {};
  const chapter = chapterOf(chapterId);
  const subjectId = opts.subjectId || (chapter ? chapter.subjectId : null);
  let pool;
  if (opts.questionIds) pool = opts.questionIds.map(id => DB.questions.find(q => q.id === id)).filter(Boolean);
  else pool = subjectQuestions(subjectId, chapterId);
  if (!pool.length) { toast("No questions available for this chapter yet.", "err"); return false; }
  let queue = pool.slice();
  if (opts.shuffle !== false) queue = queue.sort(() => Math.random() - 0.5).slice(0, Math.min(opts.limit || 10, queue.length));
  const first = queue[0];
  PRACTICE = {
    queue: queue.map(q => q.id), index:0, answers:[], startedAt:Date.now(),
    chapterId: chapterId || first.chapterId, subjectId: first.subjectId,
    revealed:false, chosen:null, hints:[], finished:false, mode:opts.mode || "chapter",
    title: opts.title || chapName(chapterOf(chapterId || first.chapterId))
  };
  return true;
}
function practiceQuestion() { return DB.questions.find(q => q.id === PRACTICE.queue[PRACTICE.index]); }

/* ---------------- subjects ---------------- */
function viewLearn() {
  const u = me();
  const attempts = myAttempts();
  const subjects = SUBJECTS.map(s => ({ s, unlocked:isUnlockedSubject(s) }));
  const totalQ = subjectQuestions("math").length;
  return {
    active:"learn",
    title:`${t("learn")} › ${t("subjects")}`,
    body:`<div class="page">
      ${pageHead(t("subjects"), DEVICE.lang === "bn" ? `শ্রেণি ${u.cls} · ${u.medium === "bangla" ? "বাংলা" : "ইংরেজি"} মাধ্যম · ${esc(u.group)} গ্রুপ` : `Class ${u.cls} · ${u.medium === "bangla" ? "Bangla" : "English"} medium · ${esc(u.group)} group`,
        `<div class="row" style="gap:8px"><span class="chip active">${esc(t("allSubjects"))}</span><a class="chip" href="#/cq">${icon("layers", 13)} ${esc(t("cq"))}</a><a class="chip" href="#/exams">${icon("exam", 13)} ${esc(t("exams"))}</a></div>`)}
      <div class="grid g3">
        ${subjects.map(({ s, unlocked }) => {
          const qs = subjectQuestions(s.id);
          const acc = subjectAccuracy(s.id);
          const done = attempts.filter(a => a.subjectId === s.id).length;
          return `<div class="card card-pad" style="display:flex;flex-direction:column;gap:14px;${unlocked ? "" : "opacity:.55"}">
            <div class="row">
              <span class="subj-glyph" style="background:linear-gradient(150deg,${s.color[0]},${s.color[1]});width:46px;height:46px;flex:0 0 46px">${esc(s.glyph)}</span>
              <div style="flex:1;min-width:0"><b style="font-size:14px;display:block">${esc(subjName(s))}</b>
                <span class="tiny faint">${s.chapters.length} ${esc(t("chapters"))} · ${qs.length} ${esc(t("questions"))}</span></div>
              ${unlocked ? `<span class="tag ${acc >= 70 ? "green" : acc ? "amber" : "grey"}">${acc ? acc + "%" : DEVICE.lang === "bn" ? "নতুন" : "New"}</span>` : `<span class="tag grey">${icon("lock", 11)}</span>`}
            </div>
            <div class="col" style="gap:7px">
              ${s.chapters.map(c => {
                const cq = subjectQuestions(s.id, c.id);
                const ca = attempts.filter(a => a.chapterId === c.id);
                const pct = ca.length ? Math.round(ca.reduce((t2, a) => t2 + a.correct, 0) / ca.reduce((t2, a) => t2 + a.total, 0) * 100) : 0;
                return `<a href="${unlocked ? `#/chapter/${c.id}` : "#"}" class="row" style="gap:9px;padding:6px 0;text-decoration:none;color:inherit;border-top:1px solid var(--line)">
                  <span style="width:5px;height:5px;border-radius:50%;background:${ca.length ? "var(--emerald)" : "var(--faint)"};flex:0 0 5px"></span>
                  <span style="flex:1;min-width:0;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(chapName(c))}</span>
                  <span class="tiny faint num">${cq.length}</span>
                  ${ca.length ? `<span class="tiny num" style="color:${pct >= 70 ? "var(--emerald)" : "var(--amber)"};font-weight:700">${pct}%</span>` : ""}
                </a>`;
              }).join("")}
            </div>
            <a class="btn btn-sm ${unlocked ? "btn-ghost" : "btn-ghost"}" href="${unlocked ? `#/subject/${s.id}` : "#"}" ${unlocked ? "" : 'aria-disabled="true" style="pointer-events:none"'}>
              ${unlocked ? esc(t("viewAll")) : DEVICE.lang === "bn" ? "আপনার শ্রেণির জন্য নয়" : "Not for your class"} ${icon("arrowRight", 14)}
            </a>
          </div>`;
        }).join("")}
      </div>
      <div class="card card-pad row" style="gap:16px;flex-wrap:wrap">
        <span class="stat-ico" style="background:var(--emerald-soft);color:var(--emerald);width:40px;height:40px;flex-basis:40px">${icon("layers", 19)}</span>
        <div style="flex:1;min-width:200px"><b style="font-size:13.5px">${DEVICE.lang === "bn" ? "সৃজনশীল প্রশ্ন ও মডেল উত্তর" : "Creative questions, with model answers"}</b>
          <p class="small muted" style="margin-top:2px">${DEVICE.lang === "bn" ? "ক, খ, গ, ঘ অংশে লিখুন, রুব্রিক দিয়ে নিজেকে মূল্যায়ন করুন এবং ড্রাফট সংরক্ষণ করুন।" : "Write against ক–ঘ, self-assess with the rubric, and keep drafts saved on this device."}</p></div>
        <a class="btn btn-primary btn-sm" href="#/cq">${esc(t("cq"))} ${icon("arrowRight", 14)}</a>
      </div>
    </div>`
  };
}

function viewSubject(subjectId) {
  const s = subjectOf(subjectId);
  if (!s) return viewLearn();
  const attempts = myAttempts();
  const acc = subjectAccuracy(s.id);
  const totalQ = subjectQuestions(s.id).length;
  return {
    active:"learn",
    title:`${t("learn")} › ${subjName(s)}`,
    body:`<div class="page">
      <div class="breadcrumb"><a href="#/learn">${esc(t("learn"))}</a>${icon("chevronRight", 12)}<span>${esc(subjName(s))}</span></div>
      <div class="card" style="overflow:hidden">
        <div style="padding:24px 24px 20px;background:radial-gradient(600px 240px at 92% -20%,${s.color[0]}55,transparent 65%),linear-gradient(150deg,${s.color[0]},${s.color[1]});color:#fff;position:relative">
          <span class="eyebrow" style="color:rgba(255,255,255,.65)">${DEVICE.lang === "bn" ? `শ্রেণি ${me().cls} · ${s.classes.join(", ")}` : `Class ${s.classes.join(", ")} · NCTB`}</span>
          <h1 class="h1" style="margin-top:6px">${esc(subjName(s))}</h1>
          <div class="row" style="gap:22px;margin-top:16px;flex-wrap:wrap">
            <div><b style="font-size:20px">${s.chapters.length}</b> <span class="small" style="color:rgba(255,255,255,.7)">${esc(t("chapters"))}</span></div>
            <div><b style="font-size:20px">${totalQ}</b> <span class="small" style="color:rgba(255,255,255,.7)">${esc(t("questions"))}</span></div>
            <div><b style="font-size:20px">${acc}%</b> <span class="small" style="color:rgba(255,255,255,.7)">${esc(t("accuracy"))}</span></div>
            <div><b style="font-size:20px">${attempts.filter(a => a.subjectId === s.id).length}</b> <span class="small" style="color:rgba(255,255,255,.7)">${DEVICE.lang === "bn" ? "সেশন" : "sessions"}</span></div>
          </div>
          <div class="row" style="gap:8px;margin-top:18px">
            <button class="btn btn-sm" style="background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.24)" data-action="mixed-practice" data-subject="${s.id}">${icon("practice", 14)} ${DEVICE.lang === "bn" ? "মিশ্র অনুশীলন" : "Mixed practice"}</button>
            <a class="btn btn-sm" style="background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.24)" href="#/cq?subject=${s.id}">${icon("layers", 14)} ${esc(t("cq"))}</a>
          </div>
        </div>
        <div class="list">
          ${s.chapters.map((c, i) => {
            const qs = subjectQuestions(s.id, c.id);
            const ca = attempts.filter(a => a.chapterId === c.id);
            const cAcc = ca.length ? Math.round(ca.reduce((t2, a) => t2 + a.correct, 0) / ca.reduce((t2, a) => t2 + a.total, 0) * 100) : 0;
            return `<a class="list-item" href="#/chapter/${c.id}" style="padding:16px 22px">
              <span class="tag grey num" style="width:30px;justify-content:center">${String(i + 1).padStart(2, "0")}</span>
              <span class="meta"><b>${esc(chapName(c))}</b><span>${c.topics.slice(0, 2).join(" · ")} · ${qs.length} ${esc(t("questions"))}</span></span>
              ${ca.length ? `<div style="width:88px" class="col" ><div class="bar ${cAcc >= 70 ? "green" : "amber"}"><i style="width:${cAcc}%"></i></div><span class="tiny faint" style="text-align:right">${cAcc}%</span></div>` : `<span class="tag blue">${DEVICE.lang === "bn" ? "নতুন" : "Start"}</span>`}
              ${icon("chevronRight", 15, "chev")}</a>`;
          }).join("")}
        </div>
      </div>
    </div>`
  };
}

function viewChapter(chapterId) {
  const c = chapterOf(chapterId);
  if (!c) return viewLearn();
  const s = subjectOf(c.subjectId);
  const qs = subjectQuestions(s.id, c.id);
  const cqs = DB.cqs.filter(x => x.chapterId === c.id);
  const attempts = myAttempts().filter(a => a.chapterId === chapterId);
  const acc = attempts.length ? Math.round(attempts.reduce((t2, a) => t2 + a.correct, 0) / attempts.reduce((t2, a) => t2 + a.total, 0) * 100) : 0;
  const wrongHere = myMistakes().filter(m => m.chapterId === chapterId);
  return {
    active:"learn",
    title:`${t("learn")} › ${subjName(s)} › ${chapName(c)}`,
    body:`<div class="page">
      <div class="breadcrumb"><a href="#/learn">${esc(t("learn"))}</a>${icon("chevronRight", 12)}<a href="#/subject/${s.id}">${esc(subjName(s))}</a>${icon("chevronRight", 12)}<span>${esc(chapName(c))}</span></div>
      <div class="grid g-2-1">
        <div class="card card-pad">
          <div class="row" style="gap:12px;align-items:flex-start">
            <span class="subj-glyph" style="background:linear-gradient(150deg,${s.color[0]},${s.color[1]});width:46px;height:46px;flex:0 0 46px">${esc(s.glyph)}</span>
            <div style="flex:1"><span class="eyebrow">${esc(subjName(s))}</span>
              <h1 class="h1" style="font-size:26px;margin-top:3px">${esc(chapName(c))}</h1>
              <div class="row wrap" style="gap:6px;margin-top:8px">${c.topics.map(tp => `<span class="tag grey">${esc(tp)}</span>`).join("")}</div></div>
          </div>
          <div class="grid g3" style="margin-top:20px">
            <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)">
              <div class="stat-label">${esc(t("questions"))}</div><div class="stat-val" style="font-size:22px">${qs.length + cqs.length}</div>
              <span class="tiny faint">${qs.length} MCQ · ${cqs.length} CQ</span></div>
            <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)">
              <div class="stat-label">${esc(t("accuracy"))}</div><div class="stat-val" style="font-size:22px">${acc}%</div>
              <span class="tiny faint">${attempts.length} ${DEVICE.lang === "bn" ? "সেশন" : "sessions"}</span></div>
            <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)">
              <div class="stat-label">${esc(t("mistakes"))}</div><div class="stat-val" style="font-size:22px">${wrongHere.length}</div>
              <span class="tiny faint">${DEVICE.lang === "bn" ? "পুনরাবৃত্তির অপেক্ষায়" : "in revision queue"}</span></div>
          </div>
          <div class="row wrap" style="gap:9px;margin-top:20px">
            <a class="btn btn-primary" href="#/practice/${c.id}">${icon("play", 15)} ${esc(t("startPractice"))}</a>
            <button class="btn btn-ghost" data-action="start-exam" data-preset="ch-${c.id}">${icon("exam", 15)} ${DEVICE.lang === "bn" ? "অধ্যায় পরীক্ষা" : "Chapter test"}</button>
            ${wrongHere.length ? `<a class="btn btn-ghost" href="#/revision" style="color:var(--rose)">${icon("refresh", 15)} ${wrongHere.length} ${DEVICE.lang === "bn" ? "ভুল ঠিক করুন" : "to fix"}</a>` : ""}
          </div>
        </div>
        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:10px">${DEVICE.lang === "bn" ? "দক্ষতা" : "Mastery"}</div>
            <div class="row" style="gap:14px">
              <div class="ring ${acc >= 70 ? "emerald" : ""}" style="--p:${acc};--size:64px"><span style="font-size:13px">${acc}%</span></div>
              <div style="flex:1"><b style="font-size:12.5px;display:block">${acc >= 85 ? (DEVICE.lang === "bn" ? "দুর্দান্ত" : "Strong") : acc >= 60 ? (DEVICE.lang === "bn" ? "উন্নতির পথে" : "Improving") : (DEVICE.lang === "bn" ? "আরও অনুশীলন দরকার" : "Needs practice")}</b>
                <span class="tiny faint">${DEVICE.lang === "bn" ? "শেষ ৫টি সেশনের নির্ভুলতা অনুযায়ী" : "Based on accuracy across your sessions"}</span></div>
            </div>
          </div>
          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:10px">${esc(t("cq"))}</div>
            ${cqs.length ? cqs.map(x => `<a class="row" href="#/cq/${x.id}" style="padding:8px 0;border-bottom:1px solid var(--line);text-decoration:none;color:inherit;gap:9px">
              <span class="tag violet">${x.en.parts.reduce((a, p) => a + p.marks, 0)}</span>
              <span style="flex:1;font-size:12px;line-height:1.4">${esc(cqText(x).stem.slice(0, 72))}${cqText(x).stem.length > 72 ? "…" : ""}</span>
              ${icon("chevronRight", 13, "chev")}</a>`).join("") : `<p class="small muted">${DEVICE.lang === "bn" ? "এই অধ্যায়ে এখনো সৃজনশীল প্রশ্ন নেই।" : "No creative questions for this chapter yet."}</p>`}
          </div>
        </div>
      </div>
    </div>`
  };
}

/* ---------------- practice ---------------- */
function viewPractice(chapterId) {
  if (!PRACTICE || (chapterId && PRACTICE.chapterId !== chapterId)) {
    if (!startPractice(chapterId)) return viewLearn();
  }
  if (PRACTICE.finished) return viewPracticeResult();
  const q = practiceQuestion();
  if (!q) return viewPracticeResult();
  const s = subjectOf(q.subjectId);
  const chosen = PRACTICE.chosen;
  const total = PRACTICE.queue.length;
  const answeredCount = PRACTICE.answers.length;
  const secs = Math.floor((Date.now() - PRACTICE.startedAt) / 1000);
  const qt = qText(q);
  const hiddenOpts = PRACTICE.hints.includes(q.id) ? qt.opts.map((o, i) => i === qt.ans ? -1 : i).filter(i => i >= 0).slice(0, 2) : [];
  return {
    active:"learn",
    title:`${t("practice")} › ${PRACTICE.title}`,
    body:`<div class="page">
      <div class="row wrap" style="gap:10px">
        <a class="btn btn-sm btn-ghost" href="#/chapter/${PRACTICE.chapterId}">${icon("arrowLeft", 14)} ${esc(t("back"))}</a>
        <div style="flex:1;min-width:140px"><div class="tiny faint">${esc(subjName(s))} · ${esc(chapName(chapterOf(PRACTICE.chapterId)))}</div>
          <div class="row" style="gap:8px;margin-top:3px"><b style="font-size:13px">${esc(PRACTICE.title)}</b><span class="tag ${PRACTICE.mode === "mistakes" ? "rose" : PRACTICE.mode === "mixed" ? "violet" : "blue"}">${PRACTICE.mode === "mistakes" ? esc(t("mistakes")) : PRACTICE.mode === "mixed" ? (DEVICE.lang === "bn" ? "মিশ্র" : "Mixed") : (DEVICE.lang === "bn" ? "অধ্যায়" : "Chapter")}</span></div></div>
        <span class="timer" style="font-size:14px" id="practiceClock">${icon("clock", 14)} <span class="num">${fmtClock(secs)}</span></span>
        <span class="tag grey">${PRACTICE.index + 1} / ${total}</span>
      </div>
      <div class="quizbar"><div class="bar"><i style="width:${(PRACTICE.index) / total * 100}%"></i></div>
        <span class="tiny faint num">${answeredCount} ${DEVICE.lang === "bn" ? "উত্তর দেওয়া" : "answered"}</span></div>

      <div class="card qcard">
        <div class="qmeta">
          <span class="tag blue">${DEVICE.lang === "bn" ? "প্রশ্ন" : "Question"} ${PRACTICE.index + 1}</span>
          ${markPill(q)}
          <span class="tag grey">${q.marks} ${DEVICE.lang === "bn" ? "নম্বর" : "mark"}</span>
          <button class="icon-btn plain" data-action="toggle-lang" aria-label="Language" style="margin-left:auto;width:32px;height:32px;flex:0 0 32px">${icon("globe", 15)}</button>
          <button class="icon-btn ${DB.bookmarks.includes(q.id) ? "" : "plain"}" data-action="bookmark-q" data-id="${q.id}" aria-label="${esc(t("bookmark"))}" style="width:32px;height:32px;flex:0 0 32px;color:${DB.bookmarks.includes(q.id) ? "var(--blue)" : "var(--muted)"}">${icon("bookmark", 15)}</button>
        </div>
        <h2 class="qtext${DEVICE.lang === "bn" ? " bn" : ""}">${esc(qt.q)}</h2>
        <div class="options">
          ${qt.opts.map((opt, i) => {
            let cls = "";
            if (PRACTICE.revealed) {
              if (i === qt.ans) cls = "correct";
              else if (i === chosen) cls = "wrong";
              else cls = "dim";
            } else if (i === chosen) cls = "selected";
            else if (hiddenOpts.includes(i)) cls = "dim";
            return `<button class="opt ${cls}" data-action="choose-opt" data-i="${i}" ${PRACTICE.revealed || hiddenOpts.includes(i) ? "disabled" : ""}>
              <span class="key">${"ABCD"[i]}</span>
              <span class="txt">${esc(opt)}</span>
              <span class="mark">${icon(PRACTICE.revealed && i === qt.ans ? "check" : "x", 18)}</span>
            </button>`;
          }).join("")}
        </div>
        ${PRACTICE.revealed ? `<div class="explain">
          <b>${icon("sparkles", 14)} ${esc(t("explanation"))}</b>
          <span>${esc(qt.exp)}</span>
          <div class="tiny faint" style="margin-top:8px">${esc(q.source || "")}</div>
        </div>` : ""}
        <div class="quizfoot">
          <button class="btn btn-ghost btn-sm" data-action="prev-q" ${PRACTICE.index === 0 ? "disabled" : ""}>${icon("arrowLeft", 14)} ${esc(t("previous"))}</button>
          ${!PRACTICE.revealed ? `<button class="btn btn-ghost btn-sm" data-action="hint" ${PRACTICE.hints.includes(q.id) ? "disabled" : ""}>${icon("sparkles", 14)} 50/50</button>` : ""}
          <div class="spacer"></div>
          ${PRACTICE.revealed
            ? `<button class="btn btn-primary" data-action="next-q">${PRACTICE.index === total - 1 ? esc(t("finish")) : esc(t("next"))} ${icon("arrowRight", 15)}</button>`
            : `<button class="btn btn-primary" data-action="reveal" ${chosen === null ? "disabled" : ""}>${DEVICE.lang === "bn" ? "উত্তর যাচাই" : "Check answer"}</button>`}
        </div>
      </div>
      <p class="tiny faint" style="text-align:center">${DEVICE.lang === "bn" ? "অনুশীলনে তাৎক্ষণিক ব্যাখ্যা পাবেন। পরীক্ষায় উত্তর জমা দেওয়ার আগে কিছু প্রকাশ হয় না।" : "Practice reveals feedback instantly. Exams never reveal answers before submission."}</p>
    </div>`
  };
}

function viewPracticeResult() {
  const s = subjectOf(PRACTICE.subjectId);
  const correct = PRACTICE.answers.filter(a => a.correct).length;
  const total = PRACTICE.queue.length;
  const pct = Math.round(correct / total * 100);
  const secs = Math.round((Date.now() - PRACTICE.startedAt) / 1000);
  return {
    active:"learn",
    title:`${t("practice")} › ${DEVICE.lang === "bn" ? "ফলাফল" : "Results"}`,
    body:`<div class="page">
      <div class="card score-hero">
        <div style="text-align:center">
          <div class="score-big">${pct}<small>%</small></div>
          <div class="tag ${pct >= 70 ? "green" : pct >= 45 ? "amber" : "rose"}" style="margin-top:8px">${pct >= 85 ? (DEVICE.lang === "bn" ? "দুর্দান্ত" : "Excellent") : pct >= 70 ? (DEVICE.lang === "bn" ? "ভালো" : "Good") : pct >= 45 ? (DEVICE.lang === "bn" ? "উন্নতি দরকার" : "Keep going") : (DEVICE.lang === "bn" ? "আবার চেষ্টা করুন" : "Review needed")}</div>
        </div>
        <div class="score-meta">
          <div><div class="eyebrow">${esc(t("correct"))}</div><b class="num" style="font-size:18px;color:var(--emerald)">${correct}</b></div>
          <div><div class="eyebrow">${esc(t("wrong"))}</div><b class="num" style="font-size:18px;color:var(--rose)">${total - correct}</b></div>
          <div><div class="eyebrow">${esc(t("studyTime"))}</div><b class="num" style="font-size:18px">${fmtClock(secs)}</b></div>
          <div><div class="eyebrow">${esc(t("xp"))}</div><b class="num" style="font-size:18px;color:var(--blue)">+${correct * 8 + 5}</b></div>
        </div>
      </div>
      <div class="grid g-2-1">
        <div class="card">
          <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "উত্তর পর্যালোচনা" : "Answer review"}</h2><span class="tiny faint">${esc(chapName(chapterOf(PRACTICE.chapterId)))}</span></div>
          <div class="col" style="padding:14px 20px 20px">
            ${PRACTICE.queue.map((qid, i) => {
              const q = DB.questions.find(x => x.id === qid); if (!q) return "";
              const qt = qText(q); const a = PRACTICE.answers.find(x => x.questionId === qid);
              const ok = a && a.correct;
              return `<details class="review-item"><summary>
                <span class="verdict ${ok ? "ok" : "no"}">${icon(ok ? "check" : "x", 12)}</span>
                <span style="flex:1">${i + 1}. ${esc(qt.q.length > 96 ? qt.q.slice(0, 96) + "…" : qt.q)}</span>
                ${markPill(q)}</summary>
                <div class="body">
                  <div style="margin-bottom:8px">${a ? `<b style="color:${ok ? "var(--emerald)" : "var(--rose)"}">${DEVICE.lang === "bn" ? "আপনার উত্তর" : "Your answer"}:</b> ${esc(qt.opts[a.chosen])}` : `<b class="faint">${DEVICE.lang === "bn" ? "উত্তর দেওয়া হয়নি" : "Skipped"}</b>`}</div>
                  <div style="margin-bottom:8px"><b style="color:var(--emerald)">${DEVICE.lang === "bn" ? "সঠিক উত্তর" : "Correct answer"}:</b> ${esc(qt.opts[qt.ans])}</div>
                  <div>${esc(qt.exp)}</div>
                </div></details>`;
            }).join("")}
          </div>
        </div>
        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:12px">${esc(t("quickActions"))}</div>
            <div class="col" style="gap:8px">
              <button class="btn btn-primary btn-block" data-action="retry-practice">${icon("refresh", 15)} ${esc(t("retry"))}</button>
              <a class="btn btn-ghost btn-block" href="#/chapter/${PRACTICE.chapterId}">${icon("book", 15)} ${esc(t("chapters"))}</a>
              ${myMistakes().length ? `<a class="btn btn-ghost btn-block" href="#/mistakes" style="color:var(--rose)">${icon("mistakes", 15)} ${myMistakes().length} ${DEVICE.lang === "bn" ? "ভুল ঠিক করুন" : "mistakes to fix"}</a>` : ""}
            </div>
          </div>
          <div class="card card-pad" style="background:var(--surface-2)">
            <div class="row" style="gap:8px;margin-bottom:6px">${icon("info", 15, "muted")}<b style="font-size:12.5px">${DEVICE.lang === "bn" ? "এরপর কী?" : "What next?"}</b></div>
            <p class="small muted">${DEVICE.lang === "bn" ? "ভুল উত্তরগুলো স্বয়ংক্রিয়ভাবে পুনরাবৃত্তি তালিকায় যোগ হয়েছে। SM-2 সময়সূচি অনুযায়ী সেগুলো আবার দেখানো হবে।" : "Every incorrect answer has been added to your revision queue and scheduled with spaced repetition (SM-2)."}</p>
          </div>
        </div>
      </div>
    </div>`
  };
}

/* ---------------- exams ---------------- */
function examPresets() {
  const u = me();
  const presets = [];
  const subjects = SUBJECTS.filter(isUnlockedSubject);
  subjects.forEach(s => {
    const qs = subjectQuestions(s.id);
    if (qs.length >= 6) presets.push({
      id:"sub-" + s.id, title:`${subjName(s)} · ${DEVICE.lang === "bn" ? "বিষয় পরীক্ষা" : "Subject test"}`,
      subjectId:s.id, count:Math.min(10, qs.length), durationSec:Math.min(10, qs.length) * 60, tone:"blue",
      desc:DEVICE.lang === "bn" ? `${Math.min(10, qs.length)} MCQ · ${Math.min(10, qs.length)} মিনিট · সব অধ্যায়` : `${Math.min(10, qs.length)} MCQs · ${Math.min(10, qs.length)} minutes · all chapters`
    });
    s.chapters.forEach(c => {
      const cq = subjectQuestions(s.id, c.id);
      if (cq.length >= 2) presets.push({
        id:"ch-" + c.id, title:`${chapName(c)}`, subjectId:s.id, chapterId:c.id,
        count:cq.length, durationSec:Math.max(180, cq.length * 75), tone:"green",
        desc:DEVICE.lang === "bn" ? `${cq.length} MCQ · ${Math.max(3, Math.round(cq.length * 1.25))} মিনিট · ${subjName(s)}` : `${cq.length} MCQs · ${Math.max(3, Math.round(cq.length * 1.25))} minutes · ${subjName(s)}`
      });
    });
  });
  presets.push({
    id:"mock", title:DEVICE.lang === "bn" ? "মক বোর্ড পরীক্ষা" : "Mock board exam", subjectId:"mixed", chapterId:null,
    count:20, durationSec:30 * 60, tone:"violet", negative:0.25,
    desc:DEVICE.lang === "bn" ? "২০ MCQ · ৩০ মিনিট · নেগেটিভ মার্কিং" : "20 MCQs · 30 minutes · negative marking (−0.25)"
  });
  return presets;
}

function viewExams() {
  const active = DB.examAttempts.find(a => a.userId === DB.currentUserId && a.status === "active");
  const history = myExams();
  const presets = examPresets().filter(p => p.id !== "mock" || true);
  return {
    active:"exams",
    title:t("exams"),
    body:`<div class="page">
      ${pageHead(t("exams"), DEVICE.lang === "bn" ? "সার্ভার-নিয়ন্ত্রিত সময়, জমা দেওয়ার পর মূল্যায়ন এবং বিস্তারিত ফলাফল।" : "Timed practice under exam rules — answers stay hidden until you submit, and every attempt is preserved.",
        `<a class="btn btn-sm btn-ghost" href="#/analytics">${icon("chart", 14)} ${esc(t("analytics"))}</a>`)}
      ${active ? `<div class="card card-pad row" style="gap:14px;border-color:var(--amber);background:linear-gradient(100deg,var(--amber-soft),var(--surface) 60%)">
        <span class="stat-ico amber">${icon("clock", 18)}</span>
        <div style="flex:1"><b style="font-size:13.5px">${DEVICE.lang === "bn" ? "একটি পরীক্ষা চলছে" : "You have an exam in progress"}</b>
          <p class="small muted">${esc(active.title)} · ${active.questionIds.length} ${esc(t("questions"))} · ${DEVICE.lang === "bn" ? "আপনার উত্তর সংরক্ষিত আছে" : "your answers are saved"}</p></div>
        <a class="btn btn-primary" href="#/exam/${active.id}">${DEVICE.lang === "bn" ? "চালিয়ে যান" : "Resume"} ${icon("arrowRight", 15)}</a></div>` : ""}

      <div class="grid g3">
        ${presets.slice(0, 9).map(p => `<div class="card card-pad" style="display:flex;flex-direction:column;gap:12px">
          <div class="row"><span class="stat-ico ${p.tone === "green" ? "green" : p.tone === "violet" ? "violet" : ""}">${icon(p.chapterId ? "practice" : "exam", 16)}</span>
            <span class="tag ${p.tone === "green" ? "green" : p.tone === "violet" ? "violet" : "blue"}">${p.negative ? (DEVICE.lang === "bn" ? "মক" : "Mock") : (DEVICE.lang === "bn" ? "টাইমড" : "Timed")}</span></div>
          <div><b style="font-size:14px;display:block;line-height:1.35">${esc(p.title)}</b>
            <span class="tiny faint">${esc(p.desc)}</span></div>
          <div class="row" style="margin-top:auto;gap:6px">
            <button class="btn btn-sm btn-primary" data-action="start-exam" data-preset="${p.id}">${esc(t("beginExam"))} ${icon("arrowRight", 13)}</button>
            <span class="tiny faint" style="margin-left:auto">${myExams().filter(e => e.subjectId === p.subjectId).length} ${DEVICE.lang === "bn" ? "টি সম্পন্ন" : "done"}</span>
          </div>
        </div>`).join("")}
      </div>

      <div class="card">
        <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "পরীক্ষার ইতিহাস" : "Exam history"}</h2><span class="tiny faint">${history.length} ${DEVICE.lang === "bn" ? "টি প্রচেষ্টা" : "attempts"}</span></div>
        ${history.length ? `<div class="table-wrap"><table class="table">
          <thead><tr><th>${DEVICE.lang === "bn" ? "পরীক্ষা" : "Assessment"}</th><th>${esc(t("correct"))}</th><th>${esc(t("accuracy"))}</th><th>${esc(t("studyTime"))}</th><th>${DEVICE.lang === "bn" ? "তারিখ" : "Date"}</th><th></th></tr></thead>
          <tbody>${history.map(e => `<tr>
            <td><b>${esc(e.title)}</b><div class="tiny faint">${esc(subjName(subjectOf(e.subjectId)) || (e.subjectId === "mixed" ? "Mixed" : ""))}</div></td>
            <td class="num">${e.result.score}/${e.result.max}</td>
            <td><span class="tag ${e.result.pct >= 70 ? "green" : e.result.pct >= 45 ? "amber" : "rose"}">${e.result.pct}%</span></td>
            <td class="num">${fmtClock(e.result.seconds)}</td>
            <td class="tiny faint">${timeAgo(e.result.at)}</td>
            <td><a class="btn btn-sm btn-ghost" href="#/exam-result/${e.id}">${DEVICE.lang === "bn" ? "দেখুন" : "Review"}</a></td></tr>`).join("")}</tbody>
        </table></div>` : emptyState("exam", DEVICE.lang === "bn" ? "এখনো কোনো পরীক্ষা দেননি" : "No exams attempted yet", DEVICE.lang === "bn" ? "প্রথম পরীক্ষা শুরু করতে উপরের কার্ড থেকে বেছে নিন।" : "Pick a timed test above to get your first score on record.")}
      </div>
    </div>`
  };
}

function startExam(presetId) {
  const preset = examPresets().find(p => p.id === presetId);
  if (!preset) return;
  let pool;
  if (preset.id === "mock") pool = DB.questions.filter(q => q.status === "published");
  else if (preset.chapterId) pool = subjectQuestions(preset.subjectId, preset.chapterId);
  else pool = subjectQuestions(preset.subjectId);
  const qs = pool.slice().sort(() => Math.random() - 0.5).slice(0, preset.count);
  if (qs.length < 3) { toast(DEVICE.lang === "bn" ? "এই পরীক্ষার জন্য পর্যাপ্ত প্রশ্ন নেই।" : "Not enough questions yet for this test.", "err"); return; }
  openModal(`
    <div class="modal-head"><div class="grow">
      <span class="eyebrow">${esc(preset.negative ? "Mock board" : "Timed test")}</span>
      <h2 class="h2" style="margin-top:4px">${esc(preset.title)}</h2>
      <p class="small muted" style="margin-top:4px">${esc(preset.desc)}</p></div>
      <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <div class="rules">
        ${[
          [DEVICE.lang === "bn" ? `${qs.length}টি প্রশ্ন, মোট ${qs.length} নম্বর` : `${qs.length} questions, ${qs.length} marks total`, "exam"],
          [DEVICE.lang === "bn" ? `সময় ${Math.round(preset.durationSec / 60)} মিনিট — ডিভাইস বন্ধ করলেও সময় চলবে` : `You have ${Math.round(preset.durationSec / 60)} minutes. The clock is server time and keeps running if the app closes.`, "clock"],
          [DEVICE.lang === "bn" ? "উত্তর জমা দেওয়ার আগে সঠিক উত্তর দেখা যাবে না" : "Answers and explanations stay hidden until submission.", "shield"],
          [preset.negative ? (DEVICE.lang === "bn" ? "প্রতিটি ভুল উত্তরে ০.২৫ নম্বর কাটা যাবে" : "Each wrong answer costs 0.25 marks (negative marking).") : (DEVICE.lang === "bn" ? "কোনো নেগেটিভ মার্কিং নেই" : "No negative marking for this test."), "info"],
          [DEVICE.lang === "bn" ? "যেকোনো সময় প্রশ্ন চিহ্নিত করে পরে ফিরে আসতে পারবেন" : "Flag questions and return to them from the palette at any time.", "flag"]
        ].map(r => `<div class="rule">${icon(r[1], 15)}<span>${esc(r[0])}</span></div>`).join("")}
      </div>
      <label class="checkline"><input type="checkbox" id="examAck"> ${DEVICE.lang === "bn" ? "আমি নির্দেশনা পড়েছি এবং সময় সম্পর্কে সচেতন" : "I have read the instructions and understand the timer."}</label>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" data-action="confirm-exam" data-preset="${preset.id}" id="examStartBtn" disabled>${esc(t("beginExam"))} ${icon("arrowRight", 15)}</button></div>
  `, { label:"Exam instructions" });
  setTimeout(() => {
    const cb = document.getElementById("examAck"), btn = document.getElementById("examStartBtn");
    if (cb && btn) cb.addEventListener("change", () => { btn.disabled = !cb.checked; });
  }, 40);
}

function viewExamRunner(attId) {
  const att = DB.examAttempts.find(a => a.id === attId && a.userId === DB.currentUserId);
  if (!att) return viewExams();
  if (att.status !== "active") return viewExamResult(attId);
  EXAMSESSION = EXAMSESSION || {};
  EXAMSESSION.attId = att.id;
  const idx = Math.min(att.current || 0, att.questionIds.length - 1);
  const q = DB.questions.find(x => x.id === att.questionIds[idx]);
  const qt = qText(q);
  const chosen = att.answers[q.id];
  const answered = att.questionIds.filter(id => att.answers[id] !== undefined).length;
  const flagged = (att.flags || []).includes(q.id);
  return {
    active:"exams",
    title:`${t("exams")} › ${att.title}`,
    body:`<div class="page">
      <div class="row wrap" style="gap:10px">
        <button class="btn btn-sm btn-ghost" data-action="exit-exam">${icon("arrowLeft", 14)} ${DEVICE.lang === "bn" ? "বন্ধ করুন" : "Leave"}</button>
        <div style="flex:1"><b style="font-size:13.5px">${esc(att.title)}</b>
          <div class="tiny faint">${DEVICE.lang === "bn" ? "সার্ভার সময় অনুযায়ী" : "Server-authoritative timer"} · ${answered}/${att.questionIds.length} ${esc(t("answered"))}</div></div>
        <span class="timer" id="examClock">${icon("clock", 14)} <span class="num">--:--</span></span>
      </div>
      <div class="exam-shell">
        <div class="card qcard">
          <div class="qmeta">
            <span class="tag blue">${DEVICE.lang === "bn" ? "প্রশ্ন" : "Question"} ${idx + 1} / ${att.questionIds.length}</span>
            ${markPill(q)}
            <button class="chip ${flagged ? "active" : ""}" data-action="flag-q" style="margin-left:auto">${icon("flag", 13)} ${flagged ? esc(t("flagged")) : esc(t("flag"))}</button>
          </div>
          <h2 class="qtext${DEVICE.lang === "bn" ? " bn" : ""}">${esc(qt.q)}</h2>
          <div class="options">
            ${qt.opts.map((opt, i) => `<button class="opt ${chosen === i ? "selected" : ""}" data-action="exam-answer" data-i="${i}">
              <span class="key">${"ABCD"[i]}</span><span class="txt">${esc(opt)}</span>
              <span class="mark">${icon("check", 18)}</span></button>`).join("")}
          </div>
          <div class="quizfoot">
            <button class="btn btn-ghost btn-sm" data-action="exam-nav" data-dir="-1" ${idx === 0 ? "disabled" : ""}>${icon("arrowLeft", 14)} ${esc(t("previous"))}</button>
            <button class="btn btn-ghost btn-sm" data-action="exam-clear" ${chosen === undefined ? "disabled" : ""}>${DEVICE.lang === "bn" ? "মুছুন" : "Clear"}</button>
            <div class="spacer"></div>
            ${idx === att.questionIds.length - 1
              ? `<button class="btn btn-primary" data-action="exam-submit">${esc(t("submit"))} ${icon("check", 15)}</button>`
              : `<button class="btn btn-primary" data-action="exam-nav" data-dir="1">${esc(t("next"))} ${icon("arrowRight", 15)}</button>`}
          </div>
        </div>
        <div class="card card-pad" style="position:sticky;top:86px">
          <div class="eyebrow" style="margin-bottom:10px">${esc(t("questionPalette"))}</div>
          <div class="palette">
            ${att.questionIds.map((qid, i) => {
              const cls = i === idx ? "current" : (att.flags || []).includes(qid) ? "flagged" : att.answers[qid] !== undefined ? "answered" : "";
              return `<button class="${cls}" data-action="exam-goto" data-i="${i}">${i + 1}</button>`;
            }).join("")}
          </div>
          <div class="legend"><span><i style="background:var(--emerald)"></i>${esc(t("answered"))}</span><span><i style="background:var(--amber)"></i>${esc(t("flagged"))}</span><span><i style="background:var(--faint)"></i>${esc(t("unanswered"))}</span></div>
          <div class="divider" style="margin:14px 0"></div>
          <div class="kv"><span>${esc(t("answered"))}</span><b class="num">${answered}</b></div>
          <div class="kv"><span>${esc(t("unanswered"))}</span><b class="num">${att.questionIds.length - answered}</b></div>
          <button class="btn btn-primary btn-block" style="margin-top:12px" data-action="exam-submit">${esc(t("submit"))}</button>
          <p class="tiny faint" style="margin-top:8px;text-align:center">${DEVICE.lang === "bn" ? "জমা দিলে আর পরিবর্তন করা যাবে না।" : "Submission is final and scored server-side."}</p>
        </div>
      </div>
    </div>`
  };
}

function viewExamResult(attId) {
  const att = DB.examAttempts.find(a => a.id === attId);
  if (!att || !att.result) return viewExams();
  const r = att.result;
  const tone = r.pct >= 70 ? "green" : r.pct >= 45 ? "amber" : "rose";
  const qs = att.questionIds.map(id => DB.questions.find(q => q.id === id)).filter(Boolean);
  return {
    active:"exams",
    title:`${t("exams")} › ${DEVICE.lang === "bn" ? "ফলাফল" : "Result"}`,
    body:`<div class="page">
      <div class="breadcrumb"><a href="#/exams">${esc(t("exams"))}</a>${icon("chevronRight", 12)}<span>${esc(att.title)}</span></div>
      <div class="card">
        <div class="score-hero">
          <div class="ring ${r.pct >= 70 ? "emerald" : ""}" style="--p:${r.pct};--size:112px"><span style="font-size:24px">${r.pct}%</span></div>
          <div>
            <span class="tag ${tone}">${r.pct >= 70 ? (DEVICE.lang === "bn" ? "উত্তীর্ণ" : "Passed") : (DEVICE.lang === "bn" ? "আরও অনুশীলন" : "Below pass mark")}</span>
            <div class="score-big" style="margin-top:6px">${r.score}<small>/${r.max}</small></div>
            <p class="small muted">${esc(att.title)} · ${new Date(r.at).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</p>
          </div>
          <div class="score-meta">
            <div><div class="eyebrow">${esc(t("correct"))}</div><b class="num" style="font-size:18px;color:var(--emerald)">${r.correct}</b></div>
            <div><div class="eyebrow">${esc(t("wrong"))}</div><b class="num" style="font-size:18px;color:var(--rose)">${r.wrong}</b></div>
            <div><div class="eyebrow">${esc(t("unanswered"))}</div><b class="num" style="font-size:18px;color:var(--faint)">${r.skipped}</b></div>
            <div><div class="eyebrow">${esc(t("studyTime"))}</div><b class="num" style="font-size:18px">${fmtClock(r.seconds)}</b></div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="card-pad">
          <div class="grid g3">
            <div><div class="eyebrow" style="margin-bottom:7px">${DEVICE.lang === "bn" ? "বিষয়ভিত্তিক" : "By subject"}</div>
              ${Object.entries(r.breakdown).map(([sid, b]) => `<div class="row" style="gap:8px;padding:4px 0"><span style="font-size:11.5px;flex:1">${esc(subjName(subjectOf(sid)))}</span><span class="tiny num">${b.correct}/${b.total}</span></div>
                <div class="bar" style="height:4px"><i style="width:${b.total ? b.correct / b.total * 100 : 0}%"></i></div>`).join("")}</div>
            <div><div class="eyebrow" style="margin-bottom:7px">${DEVICE.lang === "bn" ? "নিয়ম" : "Scoring rules"}</div>
              <div class="kv"><span>${DEVICE.lang === "bn" ? "সঠিক উত্তরে" : "Per correct"}</span><b>+1</b></div>
              <div class="kv"><span>${DEVICE.lang === "bn" ? "ভুল উত্তরে" : "Per wrong"}</span><b>${r.negative ? "−" + r.negative : "0"}</b></div>
              <div class="kv"><span>${DEVICE.lang === "bn" ? "উত্তরহীন" : "Unanswered"}</span><b>0</b></div></div>
            <div><div class="eyebrow" style="margin-bottom:7px">${DEVICE.lang === "bn" ? "পরবর্তী পদক্ষেপ" : "Next steps"}</div>
              <a class="btn btn-soft btn-block btn-sm" style="margin-bottom:7px" href="#/revision">${icon("refresh", 14)} ${DEVICE.lang === "bn" ? "ভুলগুলো পুনরাবৃত্তি" : "Revise mistakes"}</a>
              <a class="btn btn-ghost btn-block btn-sm" href="#/exams">${icon("exam", 14)} ${DEVICE.lang === "bn" ? "আরেকটি পরীক্ষা" : "Another test"}</a></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "প্রশ্নভিত্তিক পর্যালোচনা" : "Question-by-question review"}</h2><span class="tiny faint">${DEVICE.lang === "bn" ? "এখন উত্তর ও ব্যাখ্যা দৃশ্যমান" : "Answers and explanations unlocked"}</span></div>
        <div class="col" style="padding:14px 20px 20px">
          ${qs.map((q, i) => {
            const qt = qText(q); const a = att.answers[q.id];
            const ok = a === qt.ans;
            return `<details class="review-item"><summary>
              <span class="verdict ${a === undefined ? "skip" : ok ? "ok" : "no"}">${icon(a === undefined ? "info" : ok ? "check" : "x", 12)}</span>
              <span style="flex:1">${i + 1}. ${esc(qt.q.length > 100 ? qt.q.slice(0, 100) + "…" : qt.q)}</span>${markPill(q)}</summary>
              <div class="body">
                <div style="margin-bottom:7px">${a === undefined ? `<b class="faint">${esc(t("unanswered"))}</b>` : `<b style="color:${ok ? "var(--emerald)" : "var(--rose)"}">${DEVICE.lang === "bn" ? "আপনার উত্তর" : "Your answer"}:</b> ${esc(qt.opts[a])}`}</div>
                <div style="margin-bottom:7px"><b style="color:var(--emerald)">${DEVICE.lang === "bn" ? "সঠিক উত্তর" : "Correct answer"}:</b> ${esc(qt.opts[qt.ans])}</div>
                <div>${esc(qt.exp)}</div>
              </div></details>`;
          }).join("")}
        </div>
      </div>
    </div>`
  };
}

/* ---------------- mistakes + revision ---------------- */
function viewMistakes() {
  const all = myMistakes();
  const subjFilter = MISTAKE_FILTER;
  const rows = all.filter(m => !subjFilter || m.subjectId === subjFilter);
  const bySubject = {};
  all.forEach(m => { bySubject[m.subjectId] = (bySubject[m.subjectId] || 0) + 1; });
  const due = dueMistakes().length;
  const cleared = DB.mistakes.filter(m => m.userId === DB.currentUserId && m.status === "cleared").length;
  const mastery = all.length + cleared ? Math.round(cleared / Math.max(1, all.length + cleared) * 100) : 0;
  return {
    active:"mistakes",
    title:`${t("mistakes")} › ${DEVICE.lang === "bn" ? "ভুলের লাইব্রেরি" : "Mistake library"}`,
    body:`<div class="page">
      ${pageHead(t("mistakes"), DEVICE.lang === "bn" ? "আপনার প্রতিটি ভুল সংরক্ষিত থাকে — মূল প্রশ্ন, আপনার উত্তর ও ব্যাখ্যা সহ।" : "Every wrong answer is captured with the question, what you chose, and the explanation — then scheduled for review.",
        `<a class="btn btn-primary btn-sm" href="#/revision">${icon("refresh", 14)} ${esc(t("revision"))} ${due ? `<span class="tag" style="background:rgba(255,255,255,.25);color:inherit">${due}</span>` : ""}</a>`)}
      <div class="grid g4">
        ${statCard({ icon:"mistakes", label:DEVICE.lang === "bn" ? "সক্রিয় ভুল" : "Active mistakes", value:all.length, tone:"violet" })}
        ${statCard({ icon:"clock", label:t("due"), value:due, tone:"amber" })}
        ${statCard({ icon:"check", label:DEVICE.lang === "bn" ? "সমাধান হয়েছে" : "Cleared", value:cleared, tone:"green" })}
        ${statCard({ icon:"target", label:t("mastery"), value:mastery + "%", tone:"green" })}
      </div>
      <div class="row wrap" style="gap:7px">
        <button class="chip ${!subjFilter ? "active" : ""}" data-action="filter-mistakes" data-subject="">${esc(t("allSubjects"))} <span class="num">${all.length}</span></button>
        ${Object.keys(bySubject).map(sid => `<button class="chip ${subjFilter === sid ? "active" : ""}" data-action="filter-mistakes" data-subject="${sid}">${esc(subjName(subjectOf(sid)))} <span class="num">${bySubject[sid]}</span></button>`).join("")}
        <span class="spacer"></span>
        ${rows.length ? `<button class="btn btn-sm btn-ghost" data-action="practice-mistakes" data-subject="${subjFilter || ""}">${icon("practice", 14)} ${esc(t("retryMistakes"))}</button>` : ""}
      </div>
      <div class="card">
        ${rows.length ? `<div class="table-wrap"><table class="table">
          <thead><tr><th>${DEVICE.lang === "bn" ? "প্রশ্ন" : "Question"}</th><th>${DEVICE.lang === "bn" ? "বিষয়" : "Subject"}</th><th>${DEVICE.lang === "bn" ? "বার" : "Times"}</th><th>${DEVICE.lang === "bn" ? "পরবর্তী পুনরাবৃত্তি" : "Next review"}</th><th>${esc(t("mastery"))}</th><th></th></tr></thead>
          <tbody>${rows.map(m => {
            const q = DB.questions.find(x => x.id === m.questionId); if (!q) return "";
            const qt = qText(q);
            const isDue = (m.dueAt || "") <= dayKey(new Date());
            return `<tr>
              <td style="max-width:330px"><b style="font-weight:600;font-size:12.5px;display:block;line-height:1.4">${esc(qt.q.slice(0, 82))}${qt.q.length > 82 ? "…" : ""}</b><span class="tiny faint">${esc(chapName(chapterOf(q.chapterId)))}</span></td>
              <td><span class="tag blue">${esc(subjName(subjectOf(q.subjectId)))}</span></td>
              <td class="num"><span class="tag ${m.count > 2 ? "rose" : "amber"}">${m.count}×</span></td>
              <td class="tiny ${isDue ? "" : "faint"}" style="font-weight:${isDue ? "700" : "500"};color:${isDue ? "var(--blue)" : ""}">${isDue ? esc(t("due")) : esc(m.dueAt || "")}</td>
              <td><div class="bar" style="height:5px;width:64px"><i style="width:${Math.min(100, (m.reviews || 0) * 25)}%"></i></div></td>
              <td><button class="btn btn-sm btn-ghost" data-action="practice-one" data-qid="${q.id}">${DEVICE.lang === "bn" ? "অনুশীলন" : "Practise"}</button></td></tr>`;
          }).join("")}</tbody></table></div>`
          : emptyState("check", DEVICE.lang === "bn" ? "কোনো ভুল নেই!" : "No mistakes waiting", DEVICE.lang === "bn" ? "ভুল উত্তর দিলে সেগুলো এখানে জমা হবে এবং পুনরাবৃত্তির জন্য সময় নির্ধারিত হবে।" : "Incorrect answers from practice and exams land here automatically, with a spaced-repetition schedule.")}
      </div>
      <div class="card card-pad" style="background:var(--surface-2)">
        <div class="row" style="gap:10px;align-items:flex-start">
          <span class="stat-ico">${icon("info", 16)}</span>
          <div><b style="font-size:12.5px">${DEVICE.lang === "bn" ? "কীভাবে কাজ করে" : "How mastery is calculated"}</b>
            <p class="small muted" style="margin-top:4px">${DEVICE.lang === "bn" ? "মাস্টারি = সমাধান হওয়া ভুল ÷ (সক্রিয় + সমাধান হওয়া ভুল)। প্রতিটি সঠিক পুনরাবৃত্তি SM-2 সময়সূচি বাড়ায়; পরপর সঠিক হলে ভুলটি তালিকা থেকে সরে যায়।" : "Mastery = cleared mistakes ÷ (active + cleared). Each successful review extends the SM-2 interval; two strong reviews retire a card from the queue. Exam and practice history stay separate."}</p></div>
        </div>
      </div>
    </div>`
  };
}
let MISTAKE_FILTER = "";

function viewRevision() {
  const due = dueMistakes();
  if (!REVISION) REVISION = { queue: due.map(m => m.id), index:0, revealed:false, chosen:null, correct:0, done:false };
  if (!REVISION.queue.length) {
    return {
      active:"mistakes", title:`${t("revision")}`,
      body:`<div class="page">${pageHead(t("revision"), DEVICE.lang === "bn" ? "স্পেসড রিপিটিশন তালিকা।" : "Spaced repetition, tuned to when you are about to forget.")}
        <div class="card">${emptyState("check", DEVICE.lang === "bn" ? "আজকের তালিকা খালি" : "Revision queue clear", DEVICE.lang === "bn" ? "আজ আর কিছু বাকি নেই। নতুন অনুশীলন করলে ভুলগুলো এখানে আসবে।" : "Nothing is due today. New mistakes from practice will appear here on schedule.", `<a class="btn btn-primary btn-sm" href="#/learn">${esc(t("startPractice"))}</a>`)}</div>
      </div>`
    };
  }
  if (REVISION.done) {
    return {
      active:"mistakes", title:`${t("revision")} › ${DEVICE.lang === "bn" ? "সম্পন্ন" : "Complete"}`,
      body:`<div class="page"><div class="card card-pad" style="text-align:center;padding:44px">
        <div class="ring emerald" style="--p:100;--size:92px;margin:0 auto 18px"><span>${icon("check", 28)}</span></div>
        <h1 class="h1">${DEVICE.lang === "bn" ? "সেশন সম্পন্ন" : "Revision complete"}</h1>
        <p class="muted" style="margin-top:8px">${DEVICE.lang === "bn" ? `${REVISION.correct}টি সঠিক, ${REVISION.queue.length}টি কার্ড পর্যালোচিত।` : `${REVISION.correct} of ${REVISION.queue.length} correct. Your next reviews are scheduled.`}</p>
        <div class="row" style="justify-content:center;margin-top:20px"><a class="btn btn-primary" href="#/mistakes">${esc(t("mistakes"))}</a>
        <a class="btn btn-ghost" href="#/dashboard">${esc(t("dashboard"))}</a></div></div></div>`
    };
  }
  const m = DB.mistakes.find(x => x.id === REVISION.queue[REVISION.index]);
  const q = m ? DB.questions.find(x => x.id === m.questionId) : null;
  if (!q) { REVISION.index++; if (REVISION.index >= REVISION.queue.length) REVISION.done = true; return viewRevision(); }
  const qt = qText(q);
  const total = REVISION.queue.length;
  return {
    active:"mistakes",
    title:`${t("revision")} › ${DEVICE.lang === "bn" ? "কার্ড" : "Card"} ${REVISION.index + 1}`,
    body:`<div class="page">
      <div class="row wrap" style="gap:10px">
        <a class="btn btn-sm btn-ghost" href="#/mistakes">${icon("arrowLeft", 14)} ${esc(t("back"))}</a>
        <div style="flex:1"><b style="font-size:13px">${esc(t("revisionQueue"))}</b>
          <div class="tiny faint">${DEVICE.lang === "bn" ? "SM-2 সময়সূচি · প্রতিটি সঠিক উত্তর বিরতি বাড়ায়" : "SM-2 schedule · a correct review pushes the next date further out"}</div></div>
        <span class="tag ${m.count > 1 ? "rose" : "amber"}">${m.count}× ${DEVICE.lang === "bn" ? "ভুল" : "wrong"}</span>
        <span class="tag grey">${REVISION.index + 1}/${total}</span>
      </div>
      <div class="quizbar"><div class="bar"><i style="width:${REVISION.index / total * 100}%;background:linear-gradient(90deg,#3DDBAB,#0EA47A)"></i></div></div>
      <div class="card qcard">
        <div class="qmeta"><span class="tag green">${esc(subjName(subjectOf(q.subjectId)))}</span>${markPill(q)}
          <span class="tiny faint" style="margin-left:auto">${esc(chapName(chapterOf(q.chapterId)))}</span></div>
        <h2 class="qtext${DEVICE.lang === "bn" ? " bn" : ""}">${esc(qt.q)}</h2>
        <div class="options">
          ${qt.opts.map((opt, i) => {
            let cls = "";
            if (REVISION.revealed) cls = i === qt.ans ? "correct" : i === REVISION.chosen ? "wrong" : "dim";
            else if (i === REVISION.chosen) cls = "selected";
            return `<button class="opt ${cls}" data-action="revision-choose" data-i="${i}" ${REVISION.revealed ? "disabled" : ""}>
              <span class="key">${"ABCD"[i]}</span><span class="txt">${esc(opt)}</span>
              <span class="mark">${icon(REVISION.revealed && i === qt.ans ? "check" : "x", 18)}</span></button>`;
          }).join("")}
        </div>
        ${REVISION.revealed ? `<div class="explain"><b>${icon("sparkles", 14)} ${esc(t("explanation"))}</b><span>${esc(qt.exp)}</span></div>` : ""}
        <div class="quizfoot">
          <span class="tiny faint">${DEVICE.lang === "bn" ? "আত্মবিশ্বাসের সাথে মনে করতে পারলে সঠিক চিহ্নিত করুন।" : "Answer honestly — the schedule adapts to your recall."}</span>
          <div class="spacer"></div>
          ${REVISION.revealed
            ? `<button class="btn btn-primary" data-action="revision-next">${REVISION.index === total - 1 ? esc(t("finish")) : esc(t("next"))} ${icon("arrowRight", 15)}</button>`
            : `<button class="btn btn-primary" data-action="revision-reveal" ${REVISION.chosen === null ? "disabled" : ""}>${DEVICE.lang === "bn" ? "উত্তর যাচাই" : "Check answer"}</button>`}
        </div>
      </div>
      <p class="tiny faint" style="text-align:center">${DEVICE.lang === "bn" ? `পরবর্তী নির্ধারিত তারিখ: ${m.dueAt}` : `Currently scheduled for ${m.dueAt}`}</p>
    </div>`
  };
}
