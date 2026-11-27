/* ============================================================
   CHORCHA — router + interactions
   ============================================================ */
const TICKERS = [];
let CURRENT = { path:[], query:{} };

function tick(fn, ms) { const id = setInterval(fn, ms); TICKERS.push(id); return id; }
function clearTickers() { while (TICKERS.length) clearInterval(TICKERS.pop()); }

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart.split("/").filter(Boolean);
  const query = {};
  if (queryPart) queryPart.split("&").forEach(kv => { const [k, v] = kv.split("="); if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || ""); });
  return { path, query };
}

function navigate(hash) {
  if (location.hash === hash) { CURRENT = parseHash(); render(); }
  else location.hash = hash;
}

function resolveView() {
  const u = me();
  if (!u) return viewAuth();
  if (u.status !== "approved" && !isStaff(u)) return viewPending();
  const { path, query } = CURRENT;
  const [root, a, b] = path;
  if (!root || root === "dashboard") return viewDashboard();
  switch (root) {
    case "learn": return viewLearn();
    case "subject": return viewSubject(a);
    case "chapter": return viewChapter(a);
    case "practice": return viewPractice(a);
    case "exams": return viewExams();
    case "exam": return viewExamRunner(a);
    case "exam-result": return viewExamResult(a);
    case "mistakes": return viewMistakes();
    case "revision": return viewRevision();
    case "cq": return a ? viewCQDetail(a) : viewCQList(query);
    case "analytics": return viewAnalytics();
    case "videos": return viewVideos();
    case "video": return viewVideo(a);
    case "match": return viewMatch();
    case "leaderboard": return viewLeaderboard();
    case "friends": return viewFriends();
    case "chat": return viewChat(a);
    case "notifications": return viewNotifications();
    case "profile": return viewProfile();
    case "settings": return viewSettings();
    case "admin": return viewAdmin(a || "overview");
    default: return viewDashboard();
  }
}

function render() {
  clearTickers();
  document.documentElement.setAttribute("data-lang", DEVICE.lang);
  document.documentElement.setAttribute("data-theme", DEVICE.theme);
  const view = resolveView();
  const root = document.getElementById("root");
  const scrollY = window.scrollY;
  if (view.bare) root.innerHTML = view.body;
  else root.innerHTML = shell(view.active, view.title, view.body);
  document.title = `${view.title.replace(/›/g, "·")} · ${APP.name}`;
  afterRender();
  if (PRACTICE && !PRACTICE.finished) {
    // practice timer display only needs occasional refresh; keep scroll stable
  }
  window.scrollTo(0, scrollY);
}

function afterRender() {
  const { path } = CURRENT;
  const [root, a] = path;
  if (root === "chat") {
    const body = document.getElementById("threadBody");
    if (body) body.scrollTop = body.scrollHeight;
    const back = document.getElementById("chatBack");
    if (back && a) back.style.display = "grid";
    if (!a) document.querySelectorAll("#chatShell").forEach(x => x.classList.add("showlist"));
  }
  if (root === "practice") startPracticeClock();
  if (root === "exam" && a) startExamClock(a);
  if (root === "match" && MATCH && !MATCH.finished) startMatchClock();
  if (root === "video" && PLAYER) startPlayerClock();
  if (REC) startRecClock();
}

/* ---------------- practice clock ---------------- */
function startPracticeClock() {
  if (!PRACTICE || PRACTICE.finished) return;
  tick(() => {
    const node = document.getElementById("practiceClock");
    if (!node || !PRACTICE || PRACTICE.finished) return;
    const secs = Math.floor((Date.now() - PRACTICE.startedAt) / 1000);
    node.innerHTML = `${icon("clock", 14)} <span class="num">${fmtClock(secs)}</span>`;
  }, 1000);
}

/* ---------------- exam clock ---------------- */
function startExamClock(attId) {
  const el = () => document.getElementById("examClock");
  const update = () => {
    const att = DB.examAttempts.find(x => x.id === attId);
    if (!att || att.status !== "active") return;
    const left = Math.max(0, Math.floor((att.deadline - Date.now()) / 1000));
    const node = el();
    if (node) {
      node.innerHTML = `${icon("clock", 14)} <span class="num">${fmtClock(left)}</span>`;
      node.className = "timer " + (left <= 30 ? "crit" : left <= 120 ? "warn" : "");
    }
    if (left <= 0) {
      submitExam(att.id);
      toast("Time is up — your answers were submitted.", "err");
      navigate(`#/exam-result/${att.id}`);
    }
  };
  update();
  tick(update, 1000);
}

/* ---------------- match clock ---------------- */
function startMatchClock() {
  tick(() => {
    if (!MATCH || MATCH.finished) return;
    const left = Math.max(0, Math.floor((MATCH.deadline - Date.now()) / 1000));
    const node = document.getElementById("matchClock");
    if (node) node.textContent = fmtClock(left);
    if (left <= 0) { finishMatch(); return; }
    if (Date.now() >= MATCH.botNextAt && MATCH.botAnswered < MATCH.queue.length) {
      MATCH.botAnswered++;
      if (Math.random() < 0.68) MATCH.scoreB++;
      MATCH.botNextAt = Date.now() + 7000 + Math.random() * 4000;
      if (MATCH.botAnswered >= MATCH.queue.length) { finishMatch(); return; }
      render();
    }
  }, 1000);
}

/* ---------------- video player clock ---------------- */
function startPlayerClock() {
  tick(() => {
    if (!PLAYER || !PLAYER.playing) return;
    const v = DB.videos.find(x => x.id === PLAYER.videoId);
    if (!v) return;
    PLAYER.position = Math.min(v.duration, PLAYER.position + 0.5 * PLAYER.rate);
    const tEl = document.getElementById("playerTime");
    const fEl = document.getElementById("seekFill");
    if (tEl) tEl.textContent = `${fmtDur(PLAYER.position)} / ${fmtDur(v.duration)}`;
    if (fEl) fEl.style.width = Math.min(100, PLAYER.position / v.duration * 100) + "%";
    if (PLAYER.position >= v.duration - 0.6) {
      PLAYER.playing = false;
      const rec = DB.videoProgress.find(p => p.userId === DB.currentUserId && p.videoId === v.id);
      const first = !rec || !rec.completed;
      if (rec) { rec.position = v.duration; rec.completed = true; rec.at = new Date().toISOString(); }
      else DB.videoProgress.push({ userId:DB.currentUserId, videoId:v.id, position:v.duration, completed:true, at:new Date().toISOString() });
      if (first) { awardXP(me(), 15, "Video lesson completed"); touchStreak(me()); toast("Lesson complete · +15 XP"); }
      v.views = (v.views || 0) + 1;
      save(true); render();
    }
  }, 500);
  tick(() => {
    if (!PLAYER) return;
    const v = DB.videos.find(x => x.id === PLAYER.videoId);
    if (!v) return;
    let rec = DB.videoProgress.find(p => p.userId === DB.currentUserId && p.videoId === v.id);
    if (!rec) { rec = { userId:DB.currentUserId, videoId:v.id, position:PLAYER.position, completed:false, at:new Date().toISOString() }; DB.videoProgress.push(rec); }
    rec.position = PLAYER.position; rec.at = new Date().toISOString();
    save();
  }, 5000);
}

/* ---------------- recording clock ---------------- */
function startRecClock() {
  tick(() => {
    const el = document.getElementById("recClock");
    if (!el || !REC) return;
    const secs = Math.floor((Date.now() - REC.startedAt) / 1000);
    el.textContent = fmtClock(secs);
    if (secs >= 60) stopRecording();
  }, 500);
}

/* ---------------- chat helpers ---------------- */
function sendChat(convId, text) {
  text = (text || "").trim();
  if (!text) return;
  sendMessage(convId, { text });
  const input = document.getElementById("chatInput");
  if (input) input.value = "";
  render();
  const box = document.getElementById("threadBody");
  if (box) box.scrollTop = box.scrollHeight;
  const c = convById(convId);
  if (c && c.type === "dm") {
    setTimeout(() => {
      if (!convById(convId)) return;
      const partner = convById(convId).members.find(id => id !== DB.currentUserId);
      const slot = document.getElementById("typingSlot");
      if (slot && CURRENT.path[1] === convId) slot.innerHTML = `<div class="typing"><i></i><i></i><i></i></div>`;
      setTimeout(() => {
        simulateReply(convId);
        if (CURRENT.path[0] === "chat" && CURRENT.path[1] === convId) {
          markConvRead(convById(convId));
          render();
          const b2 = document.getElementById("threadBody");
          if (b2) b2.scrollTop = b2.scrollHeight;
        } else save();
      }, 1400);
    }, 700);
  }
}
function stopRecording() {
  if (!REC) return;
  const dur = Math.max(1, Math.round((Date.now() - REC.startedAt) / 1000));
  const convId = REC.convId;
  REC = null;
  sendMessage(convId, { voice:{ dur } });
  render();
  toast("Voice note sent");
}

/* ---------------- global click handling ---------------- */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const act = el.dataset.action;
  const id = el.dataset.id;

  switch (act) {
    /* auth */
    case "auth-tab": {
      const card = document.getElementById("authCard");
      if (card) card.innerHTML = authForm(el.dataset.mode);
      break;
    }
    case "demo-login": {
      const u = userById(id);
      if (!u) break;
      DB.currentUserId = u.id; u.lastLoginAt = new Date().toISOString(); save(true);
      toast(`Signed in as ${u.name}`);
      location.hash = "#/dashboard"; render();
      break;
    }
    case "logout": logout(); location.hash = ""; render(); break;
    case "forgot": {
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Reset password</h2>
        <p class="small muted" style="margin-top:4px">We'll send a recovery link to your email.</p></div>
        <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
        <div class="modal-body"><div class="field"><label class="label">${esc(t("email"))}</label>
          <input class="input" id="resetEmail" type="email" placeholder="you@example.com"></div>
          <p class="hint">In this demo build, recovery emails are simulated.</p></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
          <button class="btn btn-primary" data-action="send-reset">${esc(t("send"))}</button></div>`, { label:"Reset password" });
      break;
    }
    case "send-reset": closeModal(); toast("Recovery link sent — check your inbox"); break;
    case "check-status": {
      const u = me();
      if (u && u.status === "approved") { toast("Approved! Welcome to Chorcha."); render(); }
      else toast("Still in review — an administrator will approve your account soon.", "err");
      break;
    }

    /* preferences */
    case "toggle-lang": DEVICE.lang = DEVICE.lang === "en" ? "bn" : "en"; saveDevice(); render(); break;
    case "set-lang": DEVICE.lang = el.dataset.lang; saveDevice(); render(); break;
    case "toggle-theme": DEVICE.theme = DEVICE.theme === "light" ? "dark" : "light"; saveDevice(); render(); break;
    case "set-theme": DEVICE.theme = el.dataset.theme; saveDevice(); render(); break;
    case "toggle-pref": {
      DEVICE.prefs = DEVICE.prefs || {};
      const k = el.dataset.key; DEVICE.prefs[k] = !DEVICE.prefs[k];
      saveDevice();
      el.classList.toggle("on");
      toast(`${k === "preview" ? "Lock-screen previews" : k} ${DEVICE.prefs[k] ? "enabled" : "disabled"}`);
      break;
    }
    case "toggle-priv": {
      const u = me(); const k = el.dataset.key;
      u.priv[k] = !u.priv[k]; save();
      el.classList.toggle("on"); el.setAttribute("aria-pressed", String(u.priv[k]));
      toast("Privacy updated"); break;
    }
    case "change-password": {
      const val = (document.getElementById("newPass") || {}).value || "";
      if (val.length < 6) { toast("Use at least 6 characters.", "err"); break; }
      me().password = val; save(true); toast("Password updated");
      document.getElementById("newPass").value = "";
      break;
    }
    case "delete-account": {
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Delete this account?</h2>
        <p class="small muted" style="margin-top:4px">Profile, progress, drafts and chats will be removed from this device. This cannot be undone.</p></div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
        <button class="btn btn-danger" data-action="confirm-delete-account">${esc(t("deleteAccount"))}</button></div>`, { label:"Delete account" });
      break;
    }
    case "confirm-delete-account": {
      const uidToDelete = DB.currentUserId;
      DB.users = DB.users.filter(x => x.id !== uidToDelete);
      DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:uidToDelete, action:"account_self_deleted", target:uidToDelete, detail:"Deleted at user request" });
      logout(); closeModal(); location.hash = ""; render();
      toast("Account deleted");
      break;
    }
    case "edit-profile": {
      const u = me();
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Edit profile</h2>
        <p class="small muted" style="margin-top:4px">Your username and email are permanent.</p></div>
        <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
        <div class="modal-body">
          <div class="field"><label class="label">${esc(t("displayName"))}</label><input class="input" id="editName" value="${esc(u.name)}" maxlength="42"></div>
          <div class="field"><label class="label">${esc(t("username"))}</label><input class="input" value="@${esc(u.username)}" disabled></div>
          <div class="field"><label class="label">${esc(t("class"))} · ${esc(t("medium"))}</label><input class="input" value="${esc(t("class"))} ${u.cls} · ${esc(u.medium)} · ${esc(u.group)}" disabled>
            <span class="hint">Class and medium changes are handled by an administrator under curriculum rules.</span></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
          <button class="btn btn-primary" data-action="save-profile">${esc(t("save"))}</button></div>`, { label:"Edit profile" });
      break;
    }
    case "save-profile": {
      const val = (document.getElementById("editName") || {}).value || "";
      if (val.trim().length < 3) { toast("Name is too short.", "err"); break; }
      me().name = val.trim(); save(true); closeModal(); render(); toast("Profile updated");
      break;
    }

    /* search */
    case "search": openSearch(); break;
    case "close-modal": closeModal(); break;

    /* practice */
    case "choose-opt": {
      if (!PRACTICE || PRACTICE.revealed) break;
      PRACTICE.chosen = Number(el.dataset.i); render(); break;
    }
    case "reveal": {
      if (!PRACTICE || PRACTICE.chosen === null) break;
      const q = practiceQuestion(); const qt = qText(q);
      const correct = PRACTICE.chosen === qt.ans;
      PRACTICE.revealed = true;
      PRACTICE.answers = PRACTICE.answers.filter(a => a.questionId !== q.id);
      PRACTICE.answers.push({ questionId:q.id, chosen:PRACTICE.chosen, correct });
      render(); break;
    }
    case "next-q": {
      if (!PRACTICE) break;
      if (PRACTICE.index >= PRACTICE.queue.length - 1) {
        PRACTICE.finished = true;
        const secs = Math.round((Date.now() - PRACTICE.startedAt) / 1000);
        recordPractice({ subjectId:PRACTICE.subjectId, chapterId:PRACTICE.chapterId, answers:PRACTICE.answers, total:PRACTICE.queue.length, seconds:secs });
        toast(`Practice recorded · +${PRACTICE.answers.filter(a => a.correct).length * 8 + 5} XP`);
        render();
      } else {
        PRACTICE.index++; PRACTICE.chosen = null; PRACTICE.revealed = false; render();
      }
      break;
    }
    case "prev-q": {
      if (!PRACTICE || PRACTICE.index === 0) break;
      PRACTICE.index--;
      const q = practiceQuestion();
      const prev = PRACTICE.answers.find(a => a.questionId === q.id);
      PRACTICE.chosen = prev ? prev.chosen : null;
      PRACTICE.revealed = !!prev;
      render(); break;
    }
    case "hint": {
      const q = practiceQuestion();
      if (!PRACTICE.hints.includes(q.id)) PRACTICE.hints.push(q.id);
      render(); break;
    }
    case "bookmark-q": {
      const i = DB.bookmarks.indexOf(id);
      if (i >= 0) DB.bookmarks.splice(i, 1); else DB.bookmarks.push(id);
      save(); render(); break;
    }
    case "retry-practice": {
      const ch = PRACTICE.chapterId;
      PRACTICE = null; startPractice(ch); render(); break;
    }
    case "mixed-practice": {
      const sid = el.dataset.subject;
      const ids = subjectQuestions(sid).map(q => q.id);
      PRACTICE = null;
      if (!startPractice(null, { subjectId:sid, questionIds:ids, mode:"mixed", title:subjName(subjectOf(sid)) + " · Mixed" })) break;
      navigate(`#/practice/${PRACTICE.chapterId}`);
      break;
    }
    case "practice-one": {
      const q = DB.questions.find(x => x.id === id);
      if (!q) break;
      PRACTICE = null;
      startPractice(q.chapterId, { questionIds:[q.id], mode:"mistakes" });
      navigate(`#/practice/${q.chapterId}`);
      break;
    }
    case "practice-mistakes": {
      const subj = el.dataset.subject;
      let items = myMistakes();
      if (subj) items = items.filter(m => m.subjectId === subj);
      if (!items.length) { toast("No active mistakes to practise.", "err"); break; }
      const ids = items.map(m => m.questionId);
      const q = DB.questions.find(x => x.id === ids[0]);
      PRACTICE = null;
      if (!startPractice(q.chapterId, { questionIds:ids, mode:"mistakes", title:"Mistake practice", shuffle:false })) break;
      navigate(`#/practice/${q.chapterId}`);
      break;
    }
    case "filter-mistakes": MISTAKE_FILTER = el.dataset.subject; render(); break;

    /* revision */
    case "revision-choose": {
      if (!REVISION || REVISION.revealed) break;
      REVISION.chosen = Number(el.dataset.i); render(); break;
    }
    case "revision-reveal": {
      const m = DB.mistakes.find(x => x.id === REVISION.queue[REVISION.index]);
      const q = DB.questions.find(x => x.id === m.questionId);
      const correct = REVISION.chosen === qText(q).ans;
      REVISION.revealed = true;
      if (correct) REVISION.correct++;
      reviewMistake(m.id, correct ? 4 : 2);
      if (q && DB.mistakes.find(x => x.id === m.id)?.status === "cleared") toast("Mistake cleared · +10 XP");
      render(); break;
    }
    case "revision-next": {
      if (REVISION.index >= REVISION.queue.length - 1) {
        REVISION.done = true;
        awardXP(me(), 15, "Revision session"); touchStreak(me()); save(true);
      } else { REVISION.index++; REVISION.chosen = null; REVISION.revealed = false; }
      render(); break;
    }

    /* exams */
    case "start-exam": startExam(el.dataset.preset); break;
    case "confirm-exam": {
      const presetId = el.dataset.preset;
      const preset = examPresets().find(p => p.id === presetId);
      if (!preset) break;
      let pool = preset.id === "mock" ? DB.questions.filter(q => q.status === "published")
        : preset.chapterId ? subjectQuestions(preset.subjectId, preset.chapterId)
        : subjectQuestions(preset.subjectId);
      let qs = pool.slice().sort(() => Math.random() - 0.5).slice(0, preset.count);
      const att = createExamAttempt({ title:preset.title, subjectId:preset.subjectId, chapterId:preset.chapterId, questionIds:qs.map(q => q.id), durationSec:preset.durationSec, negative:preset.negative || 0 });
      closeModal();
      navigate(`#/exam/${att.id}`);
      break;
    }
    case "exam-answer": {
      const att = DB.examAttempts.find(x => x.status === "active" && x.userId === DB.currentUserId);
      if (!att) break;
      const qid = att.questionIds[att.current || 0];
      att.answers[qid] = Number(el.dataset.i);
      save(); render(); break;
    }
    case "exam-nav": {
      const att = DB.examAttempts.find(x => x.status === "active" && x.userId === DB.currentUserId);
      if (!att) break;
      att.current = Math.max(0, Math.min(att.questionIds.length - 1, (att.current || 0) + Number(el.dataset.dir)));
      save(); render(); break;
    }
    case "exam-goto": {
      const att = DB.examAttempts.find(x => x.status === "active" && x.userId === DB.currentUserId);
      if (!att) break;
      att.current = Number(el.dataset.i); save(); render(); break;
    }
    case "flag-q": {
      const att = DB.examAttempts.find(x => x.status === "active" && x.userId === DB.currentUserId);
      if (!att) break;
      const qid = att.questionIds[att.current || 0];
      att.flags = att.flags || [];
      const i = att.flags.indexOf(qid);
      if (i >= 0) att.flags.splice(i, 1); else att.flags.push(qid);
      save(); render(); break;
    }
    case "exam-clear": {
      const att = DB.examAttempts.find(x => x.status === "active" && x.userId === DB.currentUserId);
      if (!att) break;
      delete att.answers[att.questionIds[att.current || 0]]; save(); render(); break;
    }
    case "exam-submit": {
      const att = DB.examAttempts.find(x => x.status === "active" && x.userId === DB.currentUserId);
      if (!att) break;
      const answered = att.questionIds.filter(qid => att.answers[qid] !== undefined).length;
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Submit exam?</h2>
        <p class="small muted" style="margin-top:4px">${esc(att.title)}</p></div></div>
        <div class="modal-body"><div class="grid g2">
          <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)"><div class="eyebrow">${esc(t("answered"))}</div><b class="num" style="font-size:21px">${answered}/${att.questionIds.length}</b></div>
          <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)"><div class="eyebrow">${esc(t("unanswered"))}</div><b class="num" style="font-size:21px">${att.questionIds.length - answered}</b></div>
        </div><p class="small muted">Answers are scored server-side; this action cannot be undone.</p></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
          <button class="btn btn-primary" data-action="confirm-submit-exam" data-id="${att.id}">${esc(t("submit"))}</button></div>`, { label:"Submit exam" });
      break;
    }
    case "confirm-submit-exam": {
      const result = submitExam(id);
      closeModal();
      toast(`Submitted · ${result ? result.score + "/" + result.max : "scored"}`);
      navigate(`#/exam-result/${id}`);
      break;
    }
    case "exit-exam": {
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Leave this exam?</h2>
        <p class="small muted" style="margin-top:4px">Your answers are saved and the timer keeps running. You can resume from the Exams page.</p></div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
        <button class="btn btn-primary" data-action="do-exit-exam">${DEVICE.lang === "bn" ? "বেরিয়ে যান" : "Leave exam"}</button></div>`, { label:"Leave exam" });
      break;
    }
    case "do-exit-exam": closeModal(); navigate("#/exams"); break;

    /* cq */
    case "filter-cq": CQ_FILTER = el.dataset.subject; render(); break;
    case "print": window.print(); break;
    case "clear-cq": {
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Clear this draft?</h2><p class="small muted">Your written answers and self-assessment marks will be removed.</p></div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
        <button class="btn btn-danger" data-action="confirm-clear-cq" data-id="${el.dataset.cq}">${esc(t("save"))}</button></div>`, { label:"Clear draft" });
      break;
    }
    case "confirm-clear-cq": {
      delete DB.cqDrafts[cqDraftKey(el.dataset.id)]; save(true); closeModal(); render(); toast("Draft cleared");
      break;
    }

    /* friends */
    case "search-friends": {
      FRIEND_QUERY = (document.getElementById("friendSearch") || {}).value || "";
      render();
      break;
    }
    case "add-friend": {
      const res = sendFriendRequest(id);
      if (res && res.error) toast(res.error, "err"); else { toast("Friend request sent"); }
      render(); break;
    }
    case "accept-req": {
      let req = DB.friendRequests.find(r => r.id === id);
      if (!req) req = DB.friendRequests.find(r => r.from === el.dataset.from && r.to === DB.currentUserId && r.status === "pending");
      if (req) { respondRequest(req.id, true); toast("Friend request accepted"); }
      render(); break;
    }
    case "decline-req": respondRequest(id, false); render(); break;
    case "unfriend": unfriend(id); toast("Removed from friends"); render(); break;
    case "block-user": toggleBlock(id); toast("Account blocked"); render(); break;
    case "toggle-block": toggleBlock(id); toast("Block status updated"); render(); break;
    case "open-dm": {
      const c = ensureDM(DB.currentUserId, id);
      navigate(`#/chat/${c.id}`); break;
    }
    case "new-dm": {
      const fs = friendsOf(DB.currentUserId).map(userById).filter(Boolean);
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">New message</h2><p class="small muted" style="margin-top:4px">Private 1v1 conversations stay between two people.</p></div>
        <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
        <div class="modal-body"><div class="col" style="gap:4px">
          ${fs.map(f => `<button class="list-item" style="border:1px solid var(--line);border-radius:11px;margin-bottom:5px" data-action="open-dm" data-id="${f.id}">
            ${avatar(f, "sm")}<div class="meta"><b>${esc(f.name)}</b><span>@${esc(f.username)}</span></div>${icon("chevronRight", 14, "chev")}</button>`).join("") || `<p class="small muted">Add friends first to start a private chat.</p>`}
        </div></div>`, { label:"New message" });
      break;
    }
    case "new-group": {
      const fs = friendsOf(DB.currentUserId).map(userById).filter(Boolean);
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">${esc(t("createGroup"))}</h2>
        <p class="small muted" style="margin-top:4px">Groups need at least 3 participants. Per policy, group conversations may be reviewed by administrators.</p></div>
        <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
        <div class="modal-body">
          <div class="field"><label class="label">${DEVICE.lang === "bn" ? "গ্রুপের নাম" : "Group name"}</label><input class="input" id="groupName" placeholder="Class 9 Science Squad" maxlength="48"></div>
          <div class="field"><label class="label">${DEVICE.lang === "bn" ? "সদস্য বেছে নিন" : "Add members"} <span class="tiny faint">(${DEVICE.lang === "bn" ? "কমপক্ষে ২ জন" : "at least 2"})</span></label>
            <div class="col" style="gap:5px;max-height:220px;overflow:auto">
              ${fs.map(f => `<label class="checkline" style="padding:7px 9px;border:1px solid var(--line);border-radius:9px">
                <input type="checkbox" data-group-member="${f.id}"> ${avatar(f, "sm")}<span style="flex:1">${esc(f.name)} <span class="tiny faint">@${esc(f.username)}</span></span></label>`).join("") || `<p class="small muted">Add friends first.</p>`}
            </div></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
        <button class="btn btn-primary" data-action="confirm-group">${esc(t("createGroup"))}</button></div>`, { label:"New group" });
      break;
    }
    case "confirm-group": {
      const name = (document.getElementById("groupName") || {}).value || "";
      const members = Array.from(document.querySelectorAll("[data-group-member]:checked")).map(x => x.dataset.groupMember);
      if (!name.trim()) { toast("Give the group a name.", "err"); break; }
      const res = createGroup(name.trim(), members);
      if (res.error) { toast(res.error, "err"); break; }
      closeModal(); toast("Group created"); navigate(`#/chat/${res.id}`);
      break;
    }
    case "send-chat": {
      const input = document.getElementById("chatInput");
      sendChat(el.dataset.id, input ? input.value : "");
      break;
    }
    case "start-rec": {
      REC = { convId:el.dataset.id, startedAt:Date.now() };
      render(); toast("Recording… tap stop to send");
      break;
    }
    case "stop-rec": stopRecording(); break;
    case "cancel-rec": REC = null; render(); break;
    case "chat-back": navigate("#/chat"); break;
    case "report-chat": {
      openModal(`<div class="modal-head"><div class="grow"><span class="eyebrow">${DEVICE.lang === "bn" ? "নিরাপত্তা" : "Safety"}</span>
        <h2 class="h2" style="margin-top:4px">${esc(t("reportChat"))}</h2>
        <p class="small muted" style="margin-top:4px">A report opens a case. The administrator can read this full conversation until the case is resolved (7–10 days). The other person is never told.</p></div>
        <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
        <div class="modal-body">
          <div class="field"><label class="label">${esc(t("reason"))}</label>
            <textarea class="textarea" id="reportReason" placeholder="${DEVICE.lang === "bn" ? "কী ঘটেছে সংক্ষেপে লিখুন…" : "Briefly describe what happened…"}" style="min-height:96px"></textarea></div>
          <div class="rule" style="border:1px solid var(--line);border-radius:10px;padding:10px">${icon("info", 15)}<span>Cases are reviewed within 7–10 days. Outcomes: warning, written response, or suspension.</span></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
          <button class="btn btn-danger" data-action="confirm-report" data-id="${el.dataset.id}">${esc(t("report"))}</button></div>`, { label:"Report conversation" });
      break;
    }
    case "confirm-report": {
      const reason = (document.getElementById("reportReason") || {}).value || "";
      if (reason.trim().length < 5) { toast("Please add a short reason.", "err"); break; }
      const res = reportConversation(el.dataset.id, reason.trim());
      if (res.error) { toast(res.error, "err"); break; }
      closeModal(); toast("Report filed — the safety team has been notified.");
      render(); break;
    }

    /* match */
    case "quick-match": {
      const sel = document.getElementById("matchSubject");
      const subjectId = sel ? sel.value : "math";
      const pool = DB.users.filter(x => x.id !== DB.currentUserId && x.status === "approved" && !isStaff(x));
      const opp = pool[Math.floor(Math.random() * pool.length)] || DB.users[1];
      beginMatch(subjectId, opp.id);
      break;
    }
    case "challenge": beginMatch("math", id); break;
    case "match-answer": {
      if (!MATCH || MATCH.revealed) break;
      const q = matchQuestion(); const qd = qText(q);
      MATCH.chosen = Number(el.dataset.i);
      MATCH.revealed = true;
      if (MATCH.chosen === qd.ans) MATCH.scoreA++;
      MATCH.answers++;
      render(); break;
    }
    case "match-next": {
      if (!MATCH) break;
      if (MATCH.index >= MATCH.queue.length - 1) { finishMatch(); break; }
      MATCH.index++; MATCH.chosen = null; MATCH.revealed = false;
      render(); break;
    }
    case "match-lobby": MATCH = null; render(); break;

    /* leaderboard */
    case "lb-scope": LB_SCOPE = el.dataset.scope; render(); break;

    /* video */
    case "player-toggle": {
      if (!PLAYER) break;
      PLAYER.playing = !PLAYER.playing; render(); break;
    }
    case "player-jump": {
      if (!PLAYER) break;
      PLAYER.position = Number(el.dataset.at); PLAYER.playing = true; render(); break;
    }
    case "player-rate": {
      if (!PLAYER) break;
      const rates = [1, 1.25, 1.5, 2, 0.75];
      PLAYER.rate = rates[(rates.indexOf(PLAYER.rate) + 1) % rates.length]; render(); break;
    }
    case "player-seek": {
      if (!PLAYER) break;
      const v = DB.videos.find(x => x.id === PLAYER.videoId);
      const rect = el.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      PLAYER.position = pct * v.duration; render(); break;
    }
    case "player-full": {
      const p = document.querySelector(".player");
      if (p && p.requestFullscreen) p.requestFullscreen().catch(() => {});
      break;
    }
    case "video-publish": {
      publishVideo(id, el.dataset.status); render(); toast(`Video ${el.dataset.status}`);
      break;
    }
    case "upload-video": openUploadVideo(); break;
    case "save-video-upload": {
      const title = (document.getElementById("vTitle") || {}).value || "";
      const subjectId = (document.getElementById("vSubject") || {}).value || "math";
      const dur = Number((document.getElementById("vDur") || {}).value || 10);
      if (!title.trim()) { toast("Add a title.", "err"); break; }
      const v = {
        id:uid("v"), title:{ en:title.trim(), bn:title.trim() }, subjectId,
        chapterId:(subjectChapterId || "math-frac"), duration:Math.max(60, dur * 60),
        presenter:nm(me()), status:"draft", views:0, hue:["#4A5568", "#1A202C"], created:new Date().toISOString()
      };
      DB.videos.unshift(v);
      DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:"video_uploaded", target:title.trim(), detail:"Draft created, awaiting preview" });
      save(true); closeModal(); render(); toast("Upload complete — saved as draft");
      break;
    }

    /* admin */
    case "admin-tab": ADMIN_TAB = el.dataset.tab; navigate(`#/admin/${ADMIN_TAB}`); break;
    case "admin-announce": openAnnounce(); break;
    case "send-announcement": {
      const title = (document.getElementById("anTitle") || {}).value || "";
      const body = (document.getElementById("anBody") || {}).value || "";
      const audience = (document.getElementById("anAudience") || {}).value || "all";
      if (!title.trim() || !body.trim()) { toast("Add a title and message.", "err"); break; }
      const targets = DB.users.filter(x => x.status === "approved" && (audience === "all" || !isStaff(x)));
      targets.forEach(x => notify(x.id, { type:"info", title:title.trim(), body:body.trim(), link:"#/notifications" }));
      DB.announcements.unshift({ id:uid("an"), title:title.trim(), body:body.trim(), audience, at:new Date().toISOString(), by:DB.currentUserId });
      DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:"announcement_sent", target:title.trim(), detail:`${targets.length} recipients` });
      save(true); closeModal(); render(); toast(`Announcement sent to ${targets.length} accounts`);
      break;
    }
    case "approve-user": {
      setAccountStatus(id, "approved");
      toast("Account approved"); render(); break;
    }
    case "promote-admin": {
      const res = setUserRole(id, "admin");
      if (res.error) { toast(res.error, "err"); break; }
      render();
      toast(`${res.target.name} is now an administrator`);
      break;
    }
    case "demote-admin": {
      const u = userById(id);
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Remove administrator access?</h2>
        <p class="small muted" style="margin-top:4px">${esc(nm(u))} keeps the account and all progress but loses the admin console.</p></div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
        <button class="btn btn-danger" data-action="confirm-demote" data-id="${id}">${DEVICE.lang === "bn" ? "অ্যাডমিন সরান" : "Remove admin"}</button></div>`, { label:"Remove administrator" });
      break;
    }
    case "confirm-demote": {
      const res = setUserRole(el.dataset.id, "student");
      closeModal();
      if (res.error) { toast(res.error, "err"); break; }
      render();
      toast(`${res.target.name} is now a student account`);
      break;
    }
    case "reject-user": {
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Reject registration</h2>
        <p class="small muted" style="margin-top:4px">An optional reason is shown to the student.</p></div></div>
        <div class="modal-body"><div class="field"><label class="label">${esc(t("reason"))} <span class="tiny faint">${esc(t("optional"))}</span></label>
          <textarea class="textarea" id="rejectReason" placeholder="e.g. Duplicate account, please contact the school office." style="min-height:88px"></textarea></div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
        <button class="btn btn-danger" data-action="confirm-reject" data-id="${id}">${esc(t("reject"))}</button></div>`, { label:"Reject registration" });
      break;
    }
    case "confirm-reject": {
      const reason = (document.getElementById("rejectReason") || {}).value || "";
      setAccountStatus(el.dataset.id, "rejected", reason.trim()); closeModal(); render(); toast("Registration rejected");
      break;
    }
    case "suspend-user": setAccountStatus(id, "suspended", "Suspended by administrator"); render(); toast("Account suspended"); break;
    case "toggle-video-access": {
      const u = userById(id); if (!u) break;
      setVideoAccess(id, !u.videoAccess);
      toast(u.videoAccess ? `Video access granted to ${u.name}` : `Video access revoked for ${u.name}`);
      render(); break;
    }
    case "wipe-user": {
      openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Remove this account?</h2>
        <p class="small muted" style="margin-top:4px">This removes ${esc(nm(userById(id)))} from the demo database. The action is logged.</p></div></div>
        <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
        <button class="btn btn-danger" data-action="confirm-wipe" data-id="${id}">${esc(t("deleteForever"))}</button></div>`, { label:"Remove account" });
      break;
    }
    case "confirm-wipe": {
      const target = userById(el.dataset.id);
      DB.users = DB.users.filter(x => x.id !== el.dataset.id);
      DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:"account_removed", target:target ? target.email : el.dataset.id, detail:"Administrative deletion" });
      save(true); closeModal(); render(); toast("Account removed");
      break;
    }
    case "new-question": openNewQuestion(); break;
    case "save-question": {
      const qTextVal = (document.getElementById("nqText") || {}).value || "";
      const opts = [0,1,2,3].map(i => (document.getElementById(`nqOpt${i}`) || {}).value || "");
      const ans = Number((document.getElementById("nqAns") || {}).value || 0);
      const subjectId = (document.getElementById("nqSubject") || {}).value || "math";
      const chapterId = (document.getElementById("nqChapter") || {}).value || "math-frac";
      const exp = (document.getElementById("nqExp") || {}).value || "";
      if (!qTextVal.trim() || opts.some(o => !o.trim())) { toast("Fill the question and all four options.", "err"); break; }
      addQuestion({ q:qTextVal.trim(), opts, ans, exp:exp.trim(), subjectId, chapterId, source:"Admin authored · reviewed" });
      closeModal(); render(); toast("Question published");
      break;
    }
    case "admin-open-report": {
      const rep = DB.reports.find(r => r.id === id);
      if (!rep) break;
      openResolveCase(rep); break;
    }
    case "view-reported-chat": openTranscript(id); break;
    case "resolve-report": {
      const rep = DB.reports.find(r => r.id === id);
      if (!rep) break;
      openResolveCase(rep); break;
    }
    case "resolve-case": {
      const repId = el.dataset.id;
      const outcome = (document.querySelector("[name=caseOutcome]:checked") || {}).value;
      const note = (document.getElementById("caseNote") || {}).value || "";
      if (!outcome) { toast("Choose an outcome.", "err"); break; }
      resolveReport(repId, outcome, note.trim());
      closeModal(); render(); toast("Case resolved · admin chat visibility ended");
      break;
    }
    case "star-group": toggleStar(id); render(); break;
    case "group-tab": ADMIN_GROUP_TAB = el.dataset.tab; render(); break;
    case "view-group": openGroupViewer(id); break;

    /* notifications */
    case "mark-all-read": markNotificationsRead(); render(); break;
    case "read-notif": {
      const n = DB.notifications.find(x => x.id === id);
      if (n) n.read = true;
      save();
      break;
    }
    default: break;
  }
});

/* ---------------- key + input handling ---------------- */
document.addEventListener("keydown", e => {
  const target = e.target;
  if (e.key === "Enter" && target.matches && target.matches("[data-send-chat]")) {
    e.preventDefault();
    sendChat(target.dataset.sendChat, target.value);
  }
  if (e.key === "Enter" && target.matches && target.matches("[data-enter]")) {
    e.preventDefault();
    document.querySelector(`[data-action="${target.dataset.enter}"]`)?.click();
  }
  if (e.key === "/" && !target.matches("input,textarea")) { e.preventDefault(); openSearch(); }
  if (e.key === "Enter" && target.id === "globalSearch") {
    const first = document.querySelector("#searchResults a");
    if (first) first.click();
  }
});

document.addEventListener("input", e => {
  const t = e.target;
  if (t.matches && t.matches("[data-cq-input]")) {
    const cqId = t.dataset.cq, i = t.dataset.cqInput;
    const d = cqDraft(cqId);
    d.texts[i] = t.value; d.updatedAt = new Date().toISOString();
    save();
    const status = t.closest(".card")?.querySelector(".draftstatus");
    if (status) { status.className = "draftstatus saved"; status.innerHTML = `${icon("check", 12)} ${t("saved")} just now`; }
  }
  if (t.id === "globalSearch") {
    renderSearchResults(t.value);
  }
});

document.addEventListener("change", e => {
  const t = e.target;
  if (t.matches && t.matches("[data-cq-assess]")) {
    const cqId = t.dataset.cq, i = t.dataset.cqAssess;
    const d = cqDraft(cqId);
    d.assess[i] = Number(t.value); d.updatedAt = new Date().toISOString();
    save(true); render();
  }
  if (t.id === "nqSubject") {
    const chapters = CHAPTERS.filter(c => c.subjectId === t.value);
    const sel = document.getElementById("nqChapter");
    if (sel) sel.innerHTML = chapters.map(c => `<option value="${c.id}">${esc(chapName(c))}</option>`).join("");
    subjectChapterId = chapters[0]?.id;
  }
  if (t.id === "nqChapter") subjectChapterId = t.value;
  if (t.id === "vSubject") {
    const chapters = CHAPTERS.filter(c => c.subjectId === t.value);
    subjectChapterId = chapters[0]?.id;
  }
});
let subjectChapterId = "math-frac";

document.addEventListener("submit", e => {
  if (e.target.id !== "authForm") return;
  e.preventDefault();
  if (!me()) {
    const data = Object.fromEntries(new FormData(e.target).entries());
    const mode = document.querySelector(".auth-tabs button.active")?.dataset.mode || "login";
    const errBox = document.getElementById("authError");
    const fail = (msg) => {
      if (errBox) { errBox.hidden = false; errBox.innerHTML = `${icon("alert", 13)} ${esc(msg)}`; }
      else toast(msg, "err");
    };
    if (mode === "login") {
      const res = login(data.email, data.password);
      if (res.error) return fail(res.error);
      location.hash = "#/dashboard"; render();
    } else {
      const res = register({
        email:data.email, username:data.username, name:data.name, cls:data.cls,
        medium:data.medium, group:data.group, password:data.password, confirm:data.confirm
      });
      if (res.error) return fail(res.error);
      render();
      if (res.firstAccount) {
        location.hash = "#/dashboard";
        toast("Owner account created — you are signed in as administrator");
      } else {
        toast("Account created — awaiting administrator approval");
      }
    }
  }
});

/* ---------------- modals ---------------- */
function openSearch() {
  openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">Search</h2>
    <p class="small muted" style="margin-top:2px">Subjects, chapters, questions and students</p></div>
    <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <input class="input" id="globalSearch" placeholder="${esc(t("search"))}" autocomplete="off">
      <div id="searchResults" class="col" style="gap:4px;max-height:52vh;overflow:auto"></div>
    </div>`, { label:"Search" });
  renderSearchResults("");
}
function renderSearchResults(query) {
  const box = document.getElementById("searchResults");
  if (!box) return;
  const q = (query || "").toLowerCase().trim();
  const out = [];
  const subjectMatches = SUBJECTS.filter(s => !q || subjName(s).toLowerCase().includes(q)).slice(0, 4);
  subjectMatches.forEach(s => out.push({ href:`#/subject/${s.id}`, icon:"book", title:subjName(s), sub:t("subjects") }));
  CHAPTERS.filter(c => q && chapName(c).toLowerCase().includes(q)).slice(0, 4).forEach(c => {
    const s = subjectOf(c.subjectId);
    out.push({ href:`#/chapter/${c.id}`, icon:"layers", title:chapName(c), sub:subjName(s) });
  });
  DB.questions.filter(x => q && (x.en.q.toLowerCase().includes(q) || (x.bn && x.bn.q.includes(q)))).slice(0, 4).forEach(x => {
    out.push({ href:`#/practice/${x.chapterId}`, icon:"practice", title:qText(x).q.slice(0, 70), sub:chapName(chapterOf(x.chapterId)) });
  });
  DB.users.filter(x => q && (x.username.includes(q) || x.name.toLowerCase().includes(q)) && !isStaff(x)).slice(0, 3).forEach(x => {
    out.push({ href:`#/friends`, icon:"users", title:x.name, sub:"@" + x.username });
  });
  box.innerHTML = out.length ? out.map(o => `<a class="list-item" href="${o.href}" data-action="close-modal" style="border:1px solid var(--line);border-radius:10px">
    <span class="stat-ico">${icon(o.icon, 15)}</span><div class="meta"><b>${esc(o.title)}</b><span>${esc(o.sub)}</span></div>${icon("arrowRight", 14, "chev")}</a>`).join("")
    : `<p class="small muted" style="padding:10px 2px">No matches for “${esc(query || "")}”.</p>`;
}

function openResolveCase(rep) {
  const age = reportAgeDays(rep);
  openModal(`<div class="modal-head"><div class="grow"><span class="eyebrow">${esc(t("reportsTab"))}</span>
    <h2 class="h2" style="margin-top:3px">${esc(t("resolve"))}</h2>
    <p class="small muted" style="margin-top:4px">${esc(nm(userById(rep.reporterId)))} reported a conversation with ${esc(nm(userById(rep.subjectId)))} · open ${Math.floor(age)} days</p></div>
    <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <div class="card card-pad" style="box-shadow:none;background:var(--surface-2)"><div class="eyebrow">${esc(t("reason"))}</div><p class="small" style="margin-top:3px">${esc(rep.reason)}</p></div>
      <div class="col" style="gap:7px">
        ${[["warning", t("warningNotice"), "Recorded on the account, no suspension."],
           ["response", t("responseToReporter"), "Send a written finding to the reporter only."],
           ["ban", t("banOffender"), "Immediately suspends the other participant."]].map((o, i) => `<label class="checkline" style="border:1px solid var(--line);border-radius:10px;padding:10px;align-items:flex-start">
          <input type="radio" name="caseOutcome" value="${o[0]}" ${i === 0 ? "checked" : ""}>
          <span><b style="display:block;font-size:12.5px;color:var(--ink)">${esc(o[1])}</b><span class="tiny faint">${esc(o[2])}</span></span></label>`).join("")}
      </div>
      <div class="field"><label class="label">${DEVICE.lang === "bn" ? "নোট (রেকর্ডে থাকবে)" : "Case note (kept in the audit log)"}</label>
        <textarea class="textarea" id="caseNote" placeholder="Summary of the finding…" style="min-height:74px"></textarea></div>
      <p class="tiny" style="color:var(--rose)">${esc(t("visibilityEnds"))}</p>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" data-action="resolve-case" data-id="${rep.id}">${esc(t("closeCase"))}</button></div>`, { label:"Resolve case" });
}

function openTranscript(repId) {
  const rep = DB.reports.find(r => r.id === repId);
  const c = convById(rep.conversationId);
  if (!c) return;
  openModal(`<div class="modal-head"><div class="grow"><span class="eyebrow">${DEVICE.lang === "bn" ? "মামলা" : "Case"} ${esc(rep.id)}</span>
    <h2 class="h2" style="margin-top:3px">${esc(nm(userById(rep.reporterId)))} · ${esc(nm(userById(rep.subjectId)))}</h2>
    <p class="small" style="color:var(--rose);margin-top:4px">${esc(t("reportedChat"))}</p></div>
    <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <div class="card-pad" style="background:var(--surface-2);border-radius:12px;max-height:46vh;overflow:auto;display:flex;flex-direction:column;gap:8px">
        ${c.messages.map(m => `<div class="row" style="gap:8px;align-items:flex-start">${avatar(userById(m.from), "sm")}
          <div style="flex:1"><b style="font-size:11.5px">${esc(nm(userById(m.from)))} <span class="tiny faint" style="font-weight:500">${new Date(m.at).toLocaleString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}</span></b>
          <div class="small" style="margin-top:2px">${m.voice ? "🎙 Voice note · " + fmtDur(m.voice.dur) : esc(m.text || "")}</div></div></div>`).join("")}
      </div>
      <div class="rule" style="border:1px solid var(--line);border-radius:10px;padding:10px">${icon("clock", 15)}<span>Visibility is tied to this open case. Resolving it removes access to this transcript immediately.</span></div>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("close"))}</button>
      <button class="btn btn-primary" data-action="resolve-report" data-id="${rep.id}">${esc(t("resolve"))}</button></div>`, { label:"Reported conversation", wide:true });
}

function openGroupViewer(convId) {
  const g = convById(convId);
  if (!g) return;
  openModal(`<div class="modal-head"><div class="grow"><span class="eyebrow">${esc(t("groupsTab"))} · ${g.members.length} ${DEVICE.lang === "bn" ? "সদস্য" : "members"}</span>
    <h2 class="h2" style="margin-top:3px">${esc(g.name)}</h2></div>
    <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <div class="row wrap" style="gap:8px">${g.members.map(id => `<span class="chip">${avatar(userById(id), "sm")} ${esc(nm(userById(id)))}</span>`).join("")}</div>
      <div class="card-pad" style="background:var(--surface-2);border-radius:12px;max-height:44vh;overflow:auto;display:flex;flex-direction:column;gap:8px">
        ${g.messages.map(m => `<div class="row" style="gap:8px;align-items:flex-start">${avatar(userById(m.from), "sm")}
          <div style="flex:1"><b style="font-size:11.5px">${esc(nm(userById(m.from)))} <span class="tiny faint" style="font-weight:500">${new Date(m.at).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })}</span></b>
          <div class="small">${esc(m.text || "🎙 " + t("voiceNote"))}</div></div></div>`).join("") || `<p class="small muted">No messages yet.</p>`}
      </div>
      <div class="row" style="gap:8px"><button class="btn btn-sm ${DB.stars.includes(g.id) ? "btn-soft" : "btn-ghost"}" data-action="star-group" data-id="${g.id}">${icon("star", 14)} ${DB.stars.includes(g.id) ? esc(t("markedGroups")) : esc(t("markedGroups"))}</button>
        <span class="tiny faint" style="margin-left:auto">${DEVICE.lang === "bn" ? "প্রশাসক সদস্যপদ গ্রুপকে জানানো হয় না।" : "Administrator membership is silent and disclosed in the privacy policy."}</span></div>
    </div>`, { label:"Group moderation", wide:true });
}

function openAnnounce() {
  openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">${esc(t("sendAnnouncement"))}</h2>
    <p class="small muted" style="margin-top:4px">${esc(t("announcementsHint"))}</p></div>
    <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <div class="field"><label class="label">${esc(t("audience"))}</label>
        <select class="select" id="anAudience"><option value="all">${esc(t("everything"))}</option><option value="approved">${esc(t("approvedOnly"))}</option><option value="pending">${esc(t("pendingOnly"))}</option></select></div>
      <div class="field"><label class="label">${esc(t("title"))}</label><input class="input" id="anTitle" maxlength="80" placeholder="Model exams open Sunday"></div>
      <div class="field"><label class="label">${esc(t("message"))}</label><textarea class="textarea" id="anBody" placeholder="Write the announcement…" style="min-height:96px"></textarea></div>
      <p class="hint">No private data is included. Announcements appear in the notification centre.</p>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" data-action="send-announcement">${esc(t("sendAnnouncement"))}</button></div>`, { label:"Announcement" });
}

function openNewQuestion() {
  const chapters = CHAPTERS.filter(c => c.subjectId === "math");
  openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">New MCQ</h2>
    <p class="small muted" style="margin-top:4px">Saved as published with an admin author citation.</p></div>
    <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <div class="grid g2">
        <div class="field"><label class="label">${esc(t("learn"))}</label><select class="select" id="nqSubject">${SUBJECTS.map(s => `<option value="${s.id}">${esc(subjName(s))}</option>`).join("")}</select></div>
        <div class="field"><label class="label">${esc(t("chapters"))}</label><select class="select" id="nqChapter">${chapters.map(c => `<option value="${c.id}">${esc(chapName(c))}</option>`).join("")}</select></div>
      </div>
      <div class="field"><label class="label">${esc(t("questionText"))}</label><textarea class="textarea" id="nqText" placeholder="Question text…" style="min-height:80px"></textarea></div>
      <div class="grid g2">
        ${[0,1,2,3].map(i => `<div class="field"><label class="label">${esc(t("option"))} ${"ABCD"[i]}</label><input class="input" id="nqOpt${i}" placeholder="Option ${"ABCD"[i]}"></div>`).join("")}
      </div>
      <div class="grid g2">
        <div class="field"><label class="label">${esc(t("correctOption"))}</label>
          <select class="select" id="nqAns">${["A","B","C","D"].map((l, i) => `<option value="${i}">${l}</option>`).join("")}</select></div>
        <div class="field"><label class="label">${esc(t("explanation"))}</label><input class="input" id="nqExp" placeholder="Why this answer is correct…"></div>
      </div>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" data-action="save-question">${esc(t("saveQuestion"))}</button></div>`, { label:"New question" });
}

function openUploadVideo() {
  openModal(`<div class="modal-head"><div class="grow"><h2 class="h2">${esc(t("upload"))}</h2>
    <p class="small muted" style="margin-top:4px">Uploads enter draft and stay invisible to students until published.</p></div>
    <button class="icon-btn plain" data-action="close-modal">${icon("x", 18)}</button></div>
    <div class="modal-body">
      <div class="field"><label class="label">${esc(t("title"))}</label><input class="input" id="vTitle" placeholder="Lesson title"></div>
      <div class="grid g2">
        <div class="field"><label class="label">${esc(t("learn"))}</label><select class="select" id="vSubject">${SUBJECTS.map(s => `<option value="${s.id}">${esc(subjName(s))}</option>`).join("")}</select></div>
        <div class="field"><label class="label">${esc(t("duration"))} (min)</label><input class="input" id="vDur" type="number" min="1" max="180" value="12"></div>
      </div>
      <div class="lock-card" style="padding:24px;border-style:dashed">
        <div class="lock-ico" style="width:44px;height:44px;border-radius:13px">${icon("upload", 20)}</div>
        <p class="small muted">Drop an MP4/HLS source here — validated for MIME, size and duration on the server.</p>
        <span class="tag grey">Simulated in this demo</span>
      </div>
    </div>
    <div class="modal-foot"><button class="btn btn-ghost" data-action="close-modal">${esc(t("cancel"))}</button>
      <button class="btn btn-primary" data-action="save-video-upload">${icon("upload", 15)} ${esc(t("upload"))}</button></div>`, { label:"Upload video" });
}

/* ---------------- boot ---------------- */
window.addEventListener("hashchange", () => {
  CURRENT = parseHash();
  closeModal();
  render();
  window.scrollTo(0, 0);
});

(function boot() {
  CURRENT = parseHash();
  const u = me();
  if (!location.hash) {
    location.replace("#/" + (u ? (u.status === "approved" || isStaff(u) ? "dashboard" : "pending") : ""));
  }
  render();
  if (u && (u.status === "approved" || isStaff(u))) {
    setTimeout(() => {
      if (CURRENT.path[0] === "dashboard" && DB.friendRequests.some(r => r.to === u.id && r.status === "pending")) {
        /* subtle second signal beyond the bell badge */
      }
    }, 600);
  }
})();
