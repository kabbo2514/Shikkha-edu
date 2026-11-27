/* ============================================================
   CHORCHA — leaderboard, videos, analytics, notifications
   ============================================================ */
let LB_SCOPE = "global";
let PLAYER = null;

function viewLeaderboard() {
  const u = me();
  const rows = leaderboard(LB_SCOPE);
  const myRank = rows.findIndex(r => r.u.id === u.id);
  const top = rows.slice(0, 3);
  const rest = rows.slice(3, 100);
  const myLeague = leagueOf(u.xp);
  const nextLeague = LEAGUES[LEAGUES.indexOf(myLeague) + 1];
  return {
    active:"leaderboard",
    title:t("leaderboard"),
    body:`<div class="page">
      ${pageHead(t("leaderboard"), DEVICE.lang === "bn" ? "প্রতিদিনের চর্চা পয়েন্টে রূপ নেয়। লিগ, সিজন ও বন্ধুদের মধ্যে তুলনা করুন।" : "Points come from verified practice, exams and matches. Climb the season ladder at your own pace.",
        `<div class="row" style="gap:6px"><span class="tag amber">${icon("trophy", 11)} ${esc(myLeague.name[DEVICE.lang])}</span><span class="tag grey">${DEVICE.lang === "bn" ? "সিজন ৩" : "Season 3"}</span></div>`)}
      <div class="card card-pad" style="background:linear-gradient(140deg,var(--surface),var(--surface-2))">
        <div class="row wrap" style="gap:16px">
          <div class="ring" style="--p:${nextLeague ? Math.min(100, Math.round((u.xp - myLeague.min) / (nextLeague.min - myLeague.min) * 100)) : 100}"><span>${nextLeague ? Math.min(100, Math.round((u.xp - myLeague.min) / (nextLeague.min - myLeague.min) * 100)) : 100}%</span></div>
          <div style="flex:1;min-width:180px">
            <div class="eyebrow">${esc(t("yourFriends"))} ${DEVICE.lang === "bn" ? "· আপনার অবস্থান" : "· your standing"}</div>
            <div class="row" style="gap:10px;margin-top:5px"><b style="font-size:19px">#${myRank >= 0 ? myRank + 1 : "–"}</b><span class="muted small">${DEVICE.lang === "bn" ? "মোট" : "of"} ${rows.length} ${DEVICE.lang === "bn" ? "শিক্ষার্থী" : "students"}</span></div>
            <p class="tiny faint" style="margin-top:4px">${nextLeague ? (DEVICE.lang === "bn" ? `${nextLeague.min - u.xp} XP পরে ${nextLeague.name[DEVICE.lang]}` : `${(nextLeague.min - u.xp).toLocaleString()} XP to ${nextLeague.name.en}`) : (DEVICE.lang === "bn" ? "সর্বোচ্চ লিগে আছেন" : "Top league reached")}</p>
          </div>
          <div class="pill-group">
            ${[["global", t("global")], ["friends", t("friendsBoard")], ["month", t("thisMonth")]].map(([k, l]) => `<button class="pill ${LB_SCOPE === k ? "active" : ""}" data-action="lb-scope" data-scope="${k}">${esc(l)}</button>`).join("")}
          </div>
        </div>
      </div>

      <div class="podium">
        ${[top[1], top[0], top[2]].filter(Boolean).map((r) => {
          const idx = r === top[0] ? 0 : r === top[1] ? 1 : 2;
          return `<div class="pod ${idx === 0 ? "first" : ""}">
            <span class="rank">${idx === 0 ? "1st" : idx === 1 ? "2nd" : "3rd"}</span>
            ${idx === 0 ? `<span class="tag amber" style="font-size:9px">${icon("trophy", 10)} ${DEVICE.lang === "bn" ? "চ্যাম্পিয়ন" : "Champion"}</span>` : ""}
            ${avatar(r.u, "lg", r.u.id === u.id ? "online" : "")}
            <div class="nm">${esc(nm(r.u))}${r.u.id === u.id ? " · you" : ""}</div>
            <div class="xp">${fmtNum(r.xp)} XP</div>
            <span class="league">${esc(leagueOf(r.u.xp).name[DEVICE.lang])}</span>
          </div>`;
        }).join("")}
      </div>

      <div class="card">
        <div class="card-head"><h2 class="h3">${LB_SCOPE === "friends" ? esc(t("friendsBoard")) : LB_SCOPE === "month" ? esc(t("thisMonth")) : esc(t("global"))}</h2><span class="tiny faint">${esc(t("topHundred"))}</span></div>
        <div style="padding-top:4px">
          ${rest.map((r, i) => `<div class="lb-row ${r.u.id === u.id ? "me" : ""}">
            <span class="lb-rank">${i + 4}</span>
            ${avatar(r.u, "sm")}
            <div style="flex:1;min-width:0"><b style="font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(nm(r.u))}${r.u.id === u.id ? ` <span class="tag blue" style="font-size:9px">${DEVICE.lang === "bn" ? "আপনি" : "you"}</span>` : ""}</b>
              <span class="tiny faint">@${esc(r.u.username)} · ${esc(t("level"))} ${levelOf(r.u.xp)}</span></div>
            <span class="league">${esc(leagueOf(r.u.xp).name[DEVICE.lang])}</span>
            <span class="lb-xp num">${fmtNum(r.xp)}</span>
          </div>`).join("")}
        </div>
        ${!rest.length ? emptyState("trophy", DEVICE.lang === "bn" ? "আরও শিক্ষার্থী দরকার" : "More students needed", DEVICE.lang === "bn" ? "অন্য তালিকা দেখুন।" : "Try the global leaderboard.") : ""}
      </div>

      <div class="card">
        <div class="card-head"><h2 class="h3">${esc(t("achievements"))}</h2></div>
        <div class="grid g4" style="padding:14px 20px 20px">
          ${achievementsFor(me()).map(a => `<div class="card card-pad" style="box-shadow:none;background:${a.unlocked ? "var(--surface-2)" : "var(--surface)"};opacity:${a.unlocked ? 1 : .62}">
            <div class="row" style="gap:9px"><span class="stat-ico ${a.unlocked ? "amber" : ""}" style="${a.unlocked ? "" : "background:var(--surface-3);color:var(--faint)"}">${icon(a.unlocked ? "award" : "lock", 16)}</span>
            <span class="tag ${a.unlocked ? "amber" : "grey"}" style="font-size:9px">${a.unlocked ? esc(t("unlocked")) : esc(t("locked"))}</span></div>
            <b style="font-size:12.5px;display:block;margin-top:8px">${esc(a.name[DEVICE.lang] || a.name.en)}</b>
            <span class="tiny faint">${esc(a.desc[DEVICE.lang] || a.desc.en)}</span>
          </div>`).join("")}
        </div>
      </div>
    </div>`
  };
}

/* ---------------- videos ---------------- */
function viewVideos() {
  const u = me();
  const access = videoAccessFor(u) || isAdmin();
  const vids = isAdmin() ? DB.videos : publishedVideos();
  const watched = DB.videoProgress.filter(v => v.userId === u.id);
  return {
    active:"videos",
    title:t("videos"),
    body:`<div class="page">
      ${pageHead(t("videos"), DEVICE.lang === "bn" ? "প্রশাসক-অনুমোদিত ভিডিও পাঠ — অধ্যায়ভিত্তিক, নিজের গতিতে।" : "Chapter-aligned lessons, produced by the Chorcha team. Access is granted per account by an administrator.",
        `<span class="tag ${access ? "green" : "rose"}">${access ? (isAdmin() ? "Admin preview" : esc(t("unlocked"))) : esc(t("locked"))}</span>`)}
      ${!access ? `<div class="lock-card">
        <div class="lock-ico">${icon("lock", 28)}</div>
        <h2 class="h2">${esc(t("lockedTitle"))}</h2>
        <p class="muted small" style="max-width:430px">${esc(t("lockedBody"))} ${DEVICE.lang === "bn" ? "স্কুল প্রশাসকের সাথে যোগাযোগ করুন; অনুমোদন পেলে সব প্রকাশিত ভিডিও একসাথে চালু হবে।" : "Permission is all-or-nothing: once granted, every published lesson opens at once."}</p>
        <div class="row wrap" style="justify-content:center;gap:8px">
          <span class="chip">${icon("userCheck", 13)} ${DEVICE.lang === "bn" ? "অ্যাকাউন্টভিত্তিক" : "Per account"}</span>
          <span class="chip">${icon("shieldCheck", 13)} ${DEVICE.lang === "bn" ? "অডিট করা" : "Audited grants"}</span>
          <span class="chip">${icon("clock", 13)} ${DEVICE.lang === "bn" ? "তাৎক্ষণিক বাতিল" : "Instant revoke"}</span>
        </div>
        <a class="btn btn-ghost btn-sm" href="#/settings" style="margin-top:4px">${DEVICE.lang === "bn" ? "সহায়তা নিন" : "Contact support"}</a>
      </div>` : `
      <div class="grid g4">
        ${statCard({ icon:"video", label:DEVICE.lang === "bn" ? "পাঠ" : "Lessons", value:publishedVideos().length, sub:`${watched.filter(w => w.completed).length} ${DEVICE.lang === "bn" ? "সম্পন্ন" : "completed"}`, tone:"violet" })}
        ${statCard({ icon:"clock", label:DEVICE.lang === "bn" ? "মোট সময়" : "Library time", value:Math.round(publishedVideos().reduce((a, v) => a + v.duration, 0) / 60), unit:"min", tone:"amber" })}
        ${statCard({ icon:"play", label:DEVICE.lang === "bn" ? "দেখা হয়েছে" : "In progress", value:watched.filter(w => !w.completed && w.position > 5).length, sub:DEVICE.lang === "bn" ? "নিজের জায়গা থেকে চালু হবে" : "resumes where you left off", tone:"green" })}
        ${statCard({ icon:"sparkles", label:DEVICE.lang === "bn" ? "নতুন" : "New this month", value:DB.videos.filter(v => new Date(v.created).getMonth() === new Date().getMonth()).length, tone:"violet" })}
      </div>
      <div class="video-grid">
        ${vids.map(v => {
          const s = subjectOf(v.subjectId);
          const prog = DB.videoProgress.find(p => p.userId === u.id && p.videoId === v.id);
          const pct = prog ? Math.min(100, Math.round(prog.position / v.duration * 100)) : 0;
          return `<a class="vcard" href="#/video/${v.id}">
            <div class="poster" style="background:radial-gradient(400px 200px at 80% 0%,${v.hue[0]}cc,transparent 70%),linear-gradient(150deg,${v.hue[0]},${v.hue[1]})">
              <span class="glyph">${esc(s ? s.glyph : "▶")}</span>
              <span class="dur">${fmtDur(v.duration)}</span>
              ${v.status !== "published" ? `<span class="tag ${v.status === "draft" ? "amber" : "grey"}" style="position:absolute;left:8px;top:8px;z-index:2">${esc(v.status === "draft" ? t("publishedDraft") : t("archived"))}</span>` : ""}
              <span class="playbtn">${icon("play", 18)}</span>
              ${pct ? `<span style="position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(0,0,0,.35);z-index:2"><span style="display:block;height:100%;width:${pct}%;background:#fff"></span></span>` : ""}
            </div>
            <div class="vmeta">
              <b>${esc(v.title[DEVICE.lang] || v.title.en)}</b>
              <span>${esc(s ? subjName(s) : "")} · ${esc(chapName(chapterOf(v.chapterId)))}</span>
              <span class="tiny faint">${esc(v.presenter)} · ${fmtNum(v.views)} ${DEVICE.lang === "bn" ? "বার দেখা" : "views"}</span>
              ${pct ? `<span class="vprogress"><span class="bar" style="flex:1;height:4px"><i style="width:${pct}%"></i></span>${pct}%</span>` : ""}
            </div>
          </a>`;
        }).join("")}
      </div>`}
    </div>`
  };
}

function viewVideo(videoId) {
  const v = DB.videos.find(x => x.id === videoId);
  if (!v) return viewVideos();
  const u = me();
  const access = videoAccessFor(u) || isAdmin();
  if (!access || (v.status !== "published" && !isAdmin())) {
    return { active:"videos", title:t("videos"), body:`<div class="page"><div class="card">${emptyState("lock", t("lockedTitle"), t("lockedBody"), `<a class="btn btn-sm btn-ghost" href="#/videos">${esc(t("back"))}</a>`)}</div></div>` };
  }
  const prog = DB.videoProgress.find(p => p.userId === u.id && p.videoId === v.id);
  if (!PLAYER || PLAYER.videoId !== v.id) PLAYER = { videoId:v.id, position:prog ? prog.position : 0, playing:false, rate:1, lastTick:Date.now() };
  const s = subjectOf(v.subjectId);
  const related = DB.videos.filter(x => x.id !== v.id && x.subjectId === v.subjectId && x.status === "published");
  const pct = Math.min(100, Math.round(PLAYER.position / v.duration * 100));
  return {
    active:"videos",
    title:`${t("videos")} › ${esc(v.title.en)}`,
    body:`<div class="page">
      <div class="breadcrumb"><a href="#/videos">${esc(t("videos"))}</a>${icon("chevronRight", 12)}<span>${esc(s ? subjName(s) : "")}</span></div>
      <div class="grid g-2-1" style="align-items:start">
        <div>
          <div class="player">
            <div class="scene"><div class="big">${esc(v.title[DEVICE.lang] || v.title.en)}</div></div>
            <button class="center-play" data-action="player-toggle" aria-label="${DEVICE.lang === "bn" ? "চালান" : "Play"}">${icon(PLAYER.playing ? "pause" : "play", 24)}</button>
            ${PLAYER.playing ? `<div class="tag green" style="position:absolute;top:12px;left:12px;z-index:3">${DEVICE.lang === "bn" ? "চলছে" : "Playing"}</div>` : ""}
          </div>
          <div class="playbar">
            <button class="icon-btn plain" data-action="player-toggle" style="width:28px;height:28px;flex:0 0 28px">${icon(PLAYER.playing ? "pause" : "play", 16)}</button>
            <span class="num" id="playerTime" style="min-width:82px">${fmtDur(PLAYER.position)} / ${fmtDur(v.duration)}</span>
            <div class="seek" id="seek" data-action="player-seek"><i id="seekFill" style="width:${pct}%"></i></div>
            <button class="btn btn-sm btn-ghost" data-action="player-rate" style="min-width:48px">${PLAYER.rate}×</button>
            <button class="icon-btn plain" data-action="player-full" style="width:28px;height:28px;flex:0 0 28px" aria-label="Fullscreen">${icon("target", 15)}</button>
          </div>
          <div class="card card-pad" style="margin-top:14px">
            <div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:8px">
              <span class="tag" style="background:${s.color[0]}22;color:${s.color[0]}">${esc(s ? subjName(s) : "")}</span>
              <span class="tag grey">${esc(chapName(chapterOf(v.chapterId)))}</span>
              <span class="tag grey">${fmtDur(v.duration)}</span>
              ${v.status !== "published" ? `<span class="tag amber">${esc(v.status === "draft" ? t("publishedDraft") : t("archived"))}</span>` : ""}
            </div>
            <h1 class="h2" style="font-size:20px">${esc(v.title[DEVICE.lang] || v.title.en)}</h1>
            <p class="small muted" style="margin-top:6px">${DEVICE.lang === "bn" ? `${esc(v.presenter)} উপস্থাপিত · এই অধ্যায়ের মূল ধারণা, উদাহরণ ও সাধারণ ভুলগুলো ধাপে ধাপে দেখানো হয়েছে।` : `Presented by ${esc(v.presenter)}. A focused walkthrough of this chapter's core ideas, worked examples and the mistakes students make most often.`}</p>
            <div class="row" style="gap:6px;margin-top:12px;flex-wrap:wrap">
              <span class="chip">${icon("shieldCheck", 13)} ${DEVICE.lang === "bn" ? "সুরক্ষিত স্ট্রিম" : "Protected stream"}</span>
              <span class="chip">${icon("volume", 13)} ${DEVICE.lang === "bn" ? "ক্যাপশন যেখানে আছে" : "Captions where available"}</span>
              <span class="chip">${icon("clock", 13)} ${DEVICE.lang === "bn" ? "অবস্থান সংরক্ষিত" : "Resumes automatically"}</span>
            </div>
          </div>
          ${isAdmin() ? `<div class="card card-pad" style="margin-top:14px">
            <div class="row" style="gap:10px;flex-wrap:wrap"><span class="admin-flag">${icon("shield", 12)} Admin</span>
            <span class="small muted" style="flex:1">Lifecycle controls</span>
            ${v.status !== "published" ? `<button class="btn btn-sm btn-primary" data-action="video-publish" data-id="${v.id}" data-status="published">${esc(t("publish"))}</button>` : `<button class="btn btn-sm btn-ghost" data-action="video-publish" data-id="${v.id}" data-status="draft">${esc(t("unpublish"))}</button>`}
            <button class="btn btn-sm btn-ghost" data-action="video-publish" data-id="${v.id}" data-status="archived">${esc(t("archive"))}</button></div>
          </div>` : ""}
        </div>
        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:8px">${DEVICE.lang === "bn" ? "এই পাঠে" : "In this lesson"}</div>
            ${[0,1,2,3].map((i) => {
              const at = Math.round(v.duration / 4 * i);
              return `<button class="row" data-action="player-jump" data-at="${at}" style="width:100%;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);text-align:left">
                <span class="tiny num faint" style="width:36px">${fmtDur(at)}</span>
                <span style="flex:1;font-size:12px;line-height:1.4">${[DEVICE.lang === "bn" ? "ধারণা ও সংজ্ঞা" : "Core idea, clearly defined", DEVICE.lang === "bn" ? "ধাপে ধাপে উদাহরণ" : "A worked example, step by step", DEVICE.lang === "bn" ? "সাধারণ ভুল" : "The common mistakes", DEVICE.lang === "bn" ? "দ্রুত সারসংক্ষেপ" : "Quick recap and practice prompt"][i]}</span>
                ${icon("play", 11, "chev")}</button>`;
            }).join("")}
          </div>
          <div class="card">
            <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "সম্পর্কিত পাঠ" : "Related lessons"}</h2></div>
            <div class="list">
              ${related.length ? related.map(r => `<a class="list-item" href="#/video/${r.id}">
                <span class="subj-glyph" style="width:34px;height:34px;flex:0 0 34px;font-size:11px;background:linear-gradient(150deg,${r.hue[0]},${r.hue[1]})">${icon("play", 13)}</span>
                <span class="meta"><b>${esc(r.title[DEVICE.lang] || r.title.en)}</b><span>${fmtDur(r.duration)} · ${esc(chapName(chapterOf(r.chapterId)))}</span></span></a>`).join("") : `<div class="empty" style="padding:22px"><p class="small">${DEVICE.lang === "bn" ? "আর কোনো পাঠ নেই।" : "No other lessons in this subject yet."}</p></div>`}
            </div>
          </div>
        </div>
      </div>
    </div>`
  };
}

/* ---------------- analytics ---------------- */
function viewAnalytics() {
  const u = me();
  const st = overallStats();
  const exams = myExams().slice().sort((a, b) => a.result.at.localeCompare(b.result.at));
  const scoreSeries = exams.slice(-8);
  const labels = scoreSeries.map(e => new Date(e.result.at).toLocaleDateString("en-GB", { day:"2-digit", month:"short" }));
  const subjects = SUBJECTS.filter(isUnlockedSubject).map(s => ({ s, acc:subjectAccuracy(s.id), attempts:myAttempts().filter(a => a.subjectId === s.id).length })).filter(x => x.attempts);
  const chapters = CHAPTERS.filter(c => myAttempts().some(a => a.chapterId === c.id) || myMistakes().some(m => m.chapterId === c.id)).map(c => {
    const att = myAttempts().filter(a => a.chapterId === c.id);
    const total = att.reduce((a, b) => a + b.total, 0), correct = att.reduce((a, b) => a + b.correct, 0);
    return { c, acc: total ? Math.round(correct / total * 100) : 0, attempts: att.length, mistakes: myMistakes().filter(m => m.chapterId === c.id).length };
  }).sort((a, b) => b.attempts - a.attempts).slice(0, 6);
  const days = {};
  myAttempts().forEach(a => { const k = dayKey(a.at); days[k] = (days[k] || 0) + 1; });
  const avg = exams.length ? Math.round(exams.reduce((s, e) => s + e.result.pct, 0) / exams.length) : 0;
  const trend = exams.length >= 2 ? exams[exams.length - 1].result.pct - exams[exams.length - 2].result.pct : 0;
  return {
    active:"analytics",
    title:t("analytics"),
    body:`<div class="page">
      ${pageHead(t("analytics"), DEVICE.lang === "bn" ? "প্রতিটি সংখ্যার পিছনে কী হিসাব আছে তা এখানে স্পষ্ট।" : "Every number here is computed from your own attempts — practice and exams are counted separately.",
        `<a class="btn btn-sm btn-ghost" data-action="print">${icon("print", 14)} ${esc(t("print"))}</a>`)}
      <div class="grid g4">
        ${statCard({ icon:"exam", label:t("examsTaken"), value:st.exams, sub:`${st.attempts} ${DEVICE.lang === "bn" ? "সেশন" : "practice sets"}`, tone:"violet" })}
        ${statCard({ icon:"target", label:t("avgScore"), value:avg + "%", sub:`${trend >= 0 ? "+" : ""}${trend}% ${DEVICE.lang === "bn" ? "শেষ পরীক্ষায়" : "vs previous exam"}`, trend:Math.abs(trend) + "%", trendUp:trend >= 0, tone:"green" })}
        ${statCard({ icon:"practice", label:t("accuracy"), value:st.accuracy + "%", sub:`${st.correct}/${st.total} ${DEVICE.lang === "bn" ? "সঠিক" : "answers"}`, tone:"amber" })}
        ${statCard({ icon:"clock", label:t("studyTime"), value:Math.round(st.seconds / 60), unit:"min", sub:`${(st.seconds / Math.max(1, st.attempts) / 60).toFixed(1)} ${DEVICE.lang === "bn" ? "মিনিট/সেশন" : "min per session"}`, tone:"green" })}
      </div>

      <div class="grid g-1-2">
        <div class="card card-pad">
          <div class="row" style="justify-content:space-between;margin-bottom:12px">
            <div><div class="eyebrow">${esc(t("scoreHistory"))}</div><p class="tiny faint">${DEVICE.lang === "bn" ? "শেষ ৮টি পরীক্ষার স্কোর (%)" : "Last 8 exam scores (%) — practice is excluded"}</p></div>
            <span class="tag ${avg >= 70 ? "green" : "amber"}">${avg}%</span>
          </div>
          ${scoreSeries.length ? lineChart(scoreSeries.map(e => e.result.pct), labels, { label:"Exam score history" }) : emptyState("chart", DEVICE.lang === "bn" ? "এখনো ডেটা নেই" : "No exam data yet", DEVICE.lang === "bn" ? "একটি পরীক্ষা দিলে এখানে প্রবণতা দেখা যাবে।" : "Take an exam to unlock score trends.")}
          <div class="row" style="justify-content:space-between;margin-top:10px"><span class="tiny faint">${DEVICE.lang === "bn" ? "প্রথম" : "Oldest"}</span><span class="tiny faint">${DEVICE.lang === "bn" ? "সর্বশেষ" : "Latest"}</span></div>
        </div>
        <div class="card card-pad">
          <div class="row" style="justify-content:space-between;margin-bottom:8px">
            <div><div class="eyebrow">${esc(t("subjectPerformance"))}</div><p class="tiny faint">${DEVICE.lang === "bn" ? "বিষয়ভিত্তিক নির্ভুলতা (অনুশীলন + পরীক্ষা)" : "Accuracy by subject across practice and exams"}</p></div>
          </div>
          ${subjects.length ? barChart(subjects.map(x => ({ label:x.s.name[DEVICE.lang].split(" ")[0], value:x.acc, tone:x.acc >= 70 ? "green" : x.acc >= 45 ? "" : "amber" }))) : emptyState("chart", DEVICE.lang === "bn" ? "তথ্য নেই" : "Not enough data", "")}
          <div class="col" style="gap:7px;margin-top:14px">
            ${subjects.map(x => `<div class="row" style="gap:8px;font-size:11.5px"><span style="flex:1;color:var(--muted)">${esc(subjName(x.s))}</span><span class="num">${x.acc}%</span><span class="tiny faint">· ${x.attempts} ${DEVICE.lang === "bn" ? "সেট" : "sets"}</span></div>`).join("")}
          </div>
        </div>
      </div>

      <div class="grid g-2-1">
        <div class="card">
          <div class="card-head"><h2 class="h3">${DEVICE.lang === "bn" ? "অধ্যায়ভিত্তিক অগ্রগতি" : "Chapter progress"}</h2><span class="tiny faint">${DEVICE.lang === "bn" ? "সর্বোচ্চ অনুশীলিত" : "Most practised"}</span></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th>${esc(t("chapters"))}</th><th>${DEVICE.lang === "bn" ? "সেট" : "Sets"}</th><th>${esc(t("accuracy"))}</th><th>${DEVICE.lang === "bn" ? "ভুল" : "Mistakes"}</th></tr></thead>
            <tbody>${chapters.map(x => `<tr>
              <td><b>${esc(chapName(x.c))}</b><div class="tiny faint">${esc(subjName(subjectOf(x.c.subjectId)))}</div></td>
              <td class="num">${x.attempts}</td>
              <td><span class="tag ${x.acc >= 70 ? "green" : x.acc >= 45 ? "amber" : "rose"}">${x.acc}%</span></td>
              <td class="num">${x.mistakes || "–"}</td></tr>`).join("")}</tbody>
          </table></div>
          ${!chapters.length ? emptyState("chart", DEVICE.lang === "bn" ? "এখনো অধ্যায় ডেটা নেই" : "No chapter data yet", "") : ""}
        </div>
        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="eyebrow" style="margin-bottom:10px">${esc(t("practiceConsistency"))}</div>
            ${heatmap(days)}
          </div>
          <div class="card card-pad" style="background:var(--surface-2)">
            <div class="row" style="gap:8px;margin-bottom:6px">${icon("info", 15, "muted")}<b style="font-size:12.5px">${DEVICE.lang === "bn" ? "হিসাবের নিয়ম" : "How these are computed"}</b></div>
            <div class="kv"><span>${esc(t("accuracy"))}</span><b>${DEVICE.lang === "bn" ? "সঠিক ÷ মোট উত্তর" : "correct ÷ answered"}</b></div>
            <div class="kv"><span>${esc(t("avgScore"))}</span><b>${DEVICE.lang === "bn" ? "পরীক্ষার % এর গড়" : "mean of exam percentages"}</b></div>
            <div class="kv"><span>${esc(t("studyTime"))}</span><b>${DEVICE.lang === "bn" ? "সেশনভিত্তিক সময়ের যোগফল" : "sum of session durations"}</b></div>
            <div class="kv"><span>${esc(t("streak"))}</span><b>${DEVICE.lang === "bn" ? "একটানা সক্রিয় দিন" : "consecutive active days"}</b></div>
            <p class="tiny faint" style="margin-top:8px">${DEVICE.lang === "bn" ? "ডুপ্লিকেট ইভেন্ট বাদ দেওয়া হয়; সময়স্থানীয় তারিখ ব্যবহার করা হয়।" : "Duplicate events are rejected by id, and dates use your local timezone."}</p>
          </div>
        </div>
      </div>
    </div>`
  };
}

/* ---------------- notifications ---------------- */
function viewNotifications() {
  const rows = myNotifications();
  const iconFor = ty => ({ exam:"exam", revision:"refresh", friend:"users", report:"shield", video:"video", match:"swords", account:"userCheck", pending:"userPlus" }[ty] || "bell");
  return {
    active:"notifications",
    title:t("notifications"),
    body:`<div class="page">
      ${pageHead(t("notifications"), DEVICE.lang === "bn" ? "নিরাপত্তা বিজ্ঞপ্তি সবসময় আসবে; পছন্দসই বিষয় সেটিংসে বন্ধ করতে পারবেন।" : "Security and account notices are always delivered. Optional reminders can be tuned in Settings.",
        `<button class="btn btn-sm btn-ghost" data-action="mark-all-read">${icon("check", 14)} ${DEVICE.lang === "bn" ? "সব পড়া হয়েছে" : "Mark all read"}</button>`)}
      <div class="card">
        ${rows.length ? rows.map(n => `<a class="notif ${n.read ? "" : "unread"}" href="${n.link || "#/notifications"}" data-action="read-notif" data-id="${n.id}">
          <span class="ico">${icon(iconFor(n.type), 15)}</span>
          <div class="meta"><b>${esc(n.title)}</b><p>${esc(n.body)}</p></div>
          <span class="tm">${timeAgo(n.at)}</span>
        </a>`).join("") : `<div class="empty">${icon("bell", 24)}<b>${esc(t("noUnread"))}</b><p>${DEVICE.lang === "bn" ? "নতুন কিছু এলে এখানে দেখা যাবে।" : "Exam reminders, results and messages will show up here."}</p></div>`}
      </div>
      <div class="card card-pad">
        <div class="row" style="gap:10px;flex-wrap:wrap">
          <span class="stat-ico">${icon("bell", 16)}</span>
          <div style="flex:1;min-width:200px"><b style="font-size:12.5px">${DEVICE.lang === "bn" ? "লক স্ক্রিনে কিছু দেখাবে না" : "Nothing sensitive on lock screens"}</b>
            <p class="tiny faint">${DEVICE.lang === "bn" ? "মেসেজ প্রিভিউ ডিফল্টভাবে বন্ধ। সেটিংসে প্রতি-ডিভাইসে চালু করা যায়।" : "Message previews are off by default; enable them per device in Settings."}</p></div>
          <a class="btn btn-sm btn-ghost" href="#/settings">${esc(t("preferences"))}</a>
        </div>
      </div>
    </div>`
  };
}
