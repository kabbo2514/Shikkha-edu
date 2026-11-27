/* ============================================================
   CHORCHA — store, domain rules, persistence
   ============================================================ */
const DB_KEY = "chorcha.state.v2";
const DEVICE_KEY = "chorcha.device.v2";
let DB = null;
let DEVICE = { lang:"en", theme:"light" };

function defaultState() {
  return {
    version: 2,
    users: JSON.parse(JSON.stringify(PEERS)),
    currentUserId: null,
    questions: JSON.parse(JSON.stringify(QUESTIONS)),
    cqs: JSON.parse(JSON.stringify(CQS)),
    videos: JSON.parse(JSON.stringify(VIDEOS)),
    attempts: [],
    examAttempts: [],
    mistakes: [],
    bookmarks: [],
    conversations: JSON.parse(JSON.stringify(SEED_CONVERSATIONS)),
    reports: JSON.parse(JSON.stringify(SEED_REPORTS)),
    notifications: [],
    audit: [],
    friendships: [["u-student","u-ayesha"],["u-student","u-mahin"],["u-student","u-arif"],["u-ayesha","u-mim"]],
    friendRequests: [{ id:"fr1", from:"u-mim", to:"u-student", status:"pending", at:new Date(Date.now() - 36e5 * 5).toISOString() }],
    blocks: [],
    reads: {},
    videoGrants: [{ userId:"u-admin", adminId:"u-admin", granted:true, at:"2026-06-02T09:00:00Z" },
                  { userId:"u-student", adminId:"u-admin", granted:true, at:"2026-08-14T10:30:00Z" },
                  { userId:"u-ayesha", adminId:"u-admin", granted:true, at:"2026-09-02T12:10:00Z" }],
    videoProgress: [],
    matches: [],
    ratings: {},
    cqDrafts: {},
    reviewedCount: 0,
    xpLog: [],
    stars: [],
    announcements: [{ id:"an1", title:"Half-yearly model exams open Sunday", body:"Class 9 and 10 model exams unlock 8 am Sunday. Attempts are limited to two per subject.", audience:"approved", at:new Date(Date.now() - 864e5 * 2).toISOString(), by:"u-admin" }],
    joinedAt: new Date(Date.now() - 864e5 * 34).toISOString()
  };
}

function seedHistory(S) {
  const raf = (seed) => { let x = hashStr(seed) % 1000; return () => (x = (x * 9301 + 49297) % 233280) / 233280; };
  const subjects = ["math","physics","chemistry","biology","ict","english"];
  S.users.forEach(u => {
    if ((u.role && u.role !== "student") || u.status !== "approved") return;
    const rnd = raf(u.id);
    const n = u.id === "u-student" ? 24 : 8;
    for (let i = 0; i < n; i++) {
      const daysAgo = Math.floor(rnd() * 30);
      const subj = subjects[Math.floor(rnd() * subjects.length)];
      const chaps = CHAPTERS.filter(c => c.subjectId === subj);
      const ch = chaps[Math.floor(rnd() * chaps.length)];
      const pool = S.questions.filter(q => q.chapterId === ch.id);
      const total = Math.min(pool.length, 4 + Math.floor(rnd() * 3));
      const correct = Math.max(1, Math.round(total * (0.48 + rnd() * 0.5)));
      const at = new Date(Date.now() - daysAgo * 864e5 - Math.floor(rnd() * 8) * 36e5).toISOString();
      S.attempts.push({
        id:"at-" + u.id + "-" + i, userId:u.id, kind:"practice", subjectId:subj, chapterId:ch.id,
        total, correct, wrong:total - correct, skipped:0, seconds:total * (35 + Math.round(rnd() * 40)),
        at, xp:correct * 8
      });
      if (u.id === "u-student") {
        pool.slice(0, total - correct).forEach((q, qi) => {
          S.mistakes.push({
            id:"mk-" + u.id + "-" + i + "-" + qi, userId:u.id, questionId:q.id, subjectId:subj, chapterId:ch.id,
            count:1, lastAt:at, ease:2.5, interval:1, dueAt:dayKey(new Date()), status:"active", firstAt:at
          });
        });
      }
    }
    if (u.id === "u-student") {
      for (let i = 1; i <= 6; i++) {
        const at = new Date(Date.now() - i * 864e5 - 36e5 * 3).toISOString();
        const total = 10, correct = 5 + ((i * 3) % 5);
        S.examAttempts.push({
          id:"ex-" + i, userId:u.id, kind:"exam", title:"Model test · " + i, subjectId:"math", chapterId:"math-eq",
          questionIds:[], answers:{}, status:"submitted", startedAt:at, submittedAt:at,
          durationSec:600, result:{ total:10, correct, wrong:total - correct, skipped:0, score:correct, max:10, pct:correct * 10,
            breakdown:{ math: correct }, seconds: 540, at }
        });
      }
      S.matches = [
        { id:"m-a", players:["u-student","u-ayesha"], subjectId:"physics", count:8, scoreA:6, scoreB:5, winner:"u-student", delta:+18, at:new Date(Date.now() - 864e5 * 3).toISOString() },
        { id:"m-b", players:["u-student","u-mahin"], subjectId:"math", count:8, scoreA:4, scoreB:7, winner:"u-mahin", delta:-14, at:new Date(Date.now() - 864e5 * 8).toISOString() },
        { id:"m-c", players:["u-student","u-sadia"], subjectId:"ict", count:8, scoreA:6, scoreB:6, winner:null, delta:0, at:new Date(Date.now() - 864e5 * 12).toISOString() }
      ];
      S.videoProgress = [{ userId:"u-student", videoId:"v1", position:220, completed:false, at:new Date().toISOString() }];
      S.reads["c1"] = "2026-11-10T09:24:00Z";
    }
  });
}

function blankRatings(S) {
  S.users.forEach(u => { if (!u.role || u.role === "student") S.ratings[u.id] = 1000 + Math.round((u.xp || 0) / 40); });
}

function loadState() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) { DB = JSON.parse(raw); normalize(); return; }
  } catch (e) { console.warn("state load failed", e); }
  DB = defaultState();
  seedHistory(DB);
  blankRatings(DB);
  seedNotifications();
  save(true);
}

function normalize() {
  const d = defaultState();
  for (const k of Object.keys(d)) if (DB[k] === undefined) DB[k] = d[k];
  // ensure question + cq sets include new content
  DB.questions = DB.questions || [];
  QUESTIONS.forEach(q => { if (!DB.questions.some(x => x.id === q.id)) DB.questions.push(JSON.parse(JSON.stringify(q))); });
  DB.cqs = DB.cqs || [];
  CQS.forEach(c => { if (!DB.cqs.some(x => x.id === c.id)) DB.cqs.push(JSON.parse(JSON.stringify(c))); });
  DB.videos = DB.videos || [];
  VIDEOS.forEach(v => { if (!DB.videos.some(x => x.id === v.id)) DB.videos.push(JSON.parse(JSON.stringify(v))); });
  // every account needs a role; accounts created before the owner/admin split are students
  DB.users.forEach(u => { if (!u.role) u.role = "student"; });
}

function loadDevice() {
  try { const raw = localStorage.getItem(DEVICE_KEY); if (raw) DEVICE = Object.assign(DEVICE, JSON.parse(raw)); } catch (e) {}
}

let saveTimer = null;
function save(now) {
  clearTimeout(saveTimer);
  const write = () => {
    try { localStorage.setItem(DB_KEY, JSON.stringify(DB)); } catch (e) { console.warn("save failed", e); }
  };
  if (now) write(); else saveTimer = setTimeout(write, 220);
}
function saveDevice() { try { localStorage.setItem(DEVICE_KEY, JSON.stringify(DEVICE)); } catch (e) {} }

/* ---------------- selectors ---------------- */
const userById = id => DB.users.find(u => u.id === id) || null;
const me = () => userById(DB.currentUserId);
const isStaff = u => !!u && (u.role === "admin" || u.role === "owner");
const isAdmin = () => isStaff(me());
const isOwner = () => { const u = me(); return !!(u && u.role === "owner"); };
const roleName = u => !u ? "" : u.role === "owner" ? "Owner" : u.role === "admin" ? "Administrator" : "Student";
const isApproved = () => { const u = me(); return !!(u && u.status === "approved"); };
const t = key => (I18N[DEVICE.lang] && I18N[DEVICE.lang][key]) || I18N.en[key] || key;
const nm = u => u ? (DEVICE.lang === "bn" && u.nameBn ? u.nameBn : u.name) : "Unknown";
const qText = q => (DEVICE.lang === "bn" && q.bn) ? q.bn : q.en;
const cqText = c => (DEVICE.lang === "bn" && c.bn) ? c.bn : c.en;
const subjName = s => s ? s.name[DEVICE.lang] || s.name.en : "";
const chapName = c => c ? c.name[DEVICE.lang] || c.name.en : "";
const leagueOf = xp => [...LEAGUES].reverse().find(l => (xp || 0) >= l.min) || LEAGUES[0];

function subjectQuestions(subjectId, chapterId) {
  return DB.questions.filter(q => q.subjectId === subjectId && (!chapterId || q.chapterId === chapterId) && q.status === "published");
}
function isUnlockedSubject(s) {
  const u = me(); if (!u) return false;
  if (isAdmin()) return true;
  return s.classes.includes(u.cls) && (s.group === "all" || u.cls <= 8 || s.group === (u.group || "").toLowerCase() || (u.group || "").toLowerCase().includes(s.group));
}
function myAttempts() { return DB.attempts.filter(a => a.userId === DB.currentUserId); }
function myExams() { return DB.examAttempts.filter(a => a.userId === DB.currentUserId && a.status === "submitted"); }
function myMistakes() { return DB.mistakes.filter(m => m.userId === DB.currentUserId && m.status === "active"); }
function dueMistakes() {
  const today = dayKey(new Date());
  return myMistakes().filter(m => (m.dueAt || today) <= today);
}
function subjectAccuracy(subjectId) {
  const rows = myAttempts().filter(a => a.subjectId === subjectId);
  const total = rows.reduce((s, a) => s + a.total, 0), correct = rows.reduce((s, a) => s + a.correct, 0);
  return total ? Math.round(correct / total * 100) : 0;
}
function overallStats() {
  const att = myAttempts(), ex = myExams();
  const total = att.reduce((s, a) => s + a.total, 0) + ex.reduce((s, a) => s + a.result.total, 0);
  const correct = att.reduce((s, a) => s + a.correct, 0) + ex.reduce((s, a) => s + a.result.correct, 0);
  const seconds = att.reduce((s, a) => s + (a.seconds || 0), 0) + ex.reduce((s, a) => s + (a.result.seconds || 0), 0);
  return { attempts:att.length + ex.length, total, correct, accuracy: total ? Math.round(correct / total * 100) : 0, seconds, exams:ex.length };
}
function streakState() {
  const u = me(); if (!u) return { streak:0, done:false };
  const today = dayKey(new Date());
  const active = (DB.attempts.concat(DB.examAttempts.filter(e => e.result))).some(a =>
    a.userId === u.id && dayKey(a.at || (a.result && a.result.at) || a.submittedAt || Date.now()) === today);
  return { streak: u.streak || 0, done: active };
}

/* ---------------- notifications ---------------- */
function notify(userId, { type = "info", title, body, link }) {
  DB.notifications.unshift({ id:uid("n"), userId, type, title, body, link:link || "", at:new Date().toISOString(), read:false });
  if (DB.notifications.length > 240) DB.notifications.length = 240;
  save();
}
function seedNotifications() {
  const now = Date.now();
  notify("u-student", { type:"exam", title:"Model exam opens Sunday", body:"Class 9 mathematics model exam · 20 questions · 30 minutes.", link:"#/exams" });
  notify("u-student", { type:"revision", title:"6 mistakes are due today", body:"A short revision keeps your accuracy climbing.", link:"#/revision" });
  notify("u-student", { type:"friend", title:"Mim Akter sent a friend request", body:"Class 9 · Humanities", link:"#/friends" });
  DB.notifications[DB.notifications.length - 1].at = new Date(now - 36e5 * 5).toISOString();
  notify("u-admin", { type:"report", title:"New chat report filed", body:"A 1v1 conversation needs review — visibility is active until resolution.", link:"#/admin/reports" });
  notify("u-admin", { type:"pending", title:"2 accounts awaiting approval", body:"Review registrations in the admin console.", link:"#/admin/approvals" });
}
function myNotifications() { return DB.notifications.filter(n => n.userId === DB.currentUserId); }
function unreadNotifications() { return myNotifications().filter(n => !n.read).length; }
function markNotificationsRead() {
  myNotifications().forEach(n => n.read = true); save();
}

/* ---------------- auth ---------------- */
function login(email, password) {
  const u = DB.users.find(x => x.email.toLowerCase() === String(email).trim().toLowerCase());
  if (!u) return { error:"No account found for that email." };
  if (u.password !== password) return { error:"Incorrect password. Please try again." };
  if (u.status === "banned") return { error:"This account has been banned. Contact the administrator." };
  if (u.status === "suspended") return { error:"This account is suspended. Contact the administrator." };
  DB.currentUserId = u.id;
  u.lastLoginAt = new Date().toISOString();
  save(true);
  return { user:u };
}
function register(data) {
  const { email, username, name, cls, medium, group, password, confirm } = data;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error:"Enter a valid email address." };
  if (DB.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return { error:"An account already uses this email." };
  if (!/^[a-z0-9_]{3,}$/.test(username)) return { error:"Username needs 3+ lowercase letters, digits or underscores." };
  if (DB.users.some(u => u.username.toLowerCase() === username.toLowerCase())) return { error:"That username is taken." };
  if (!name || name.trim().length < 3) return { error:"Enter your full name." };
  if (!password || password.length < 6) return { error:"Password must be at least 6 characters." };
  if (password !== confirm) return { error:"Passwords do not match." };
  /* The very first account on an installation becomes the owner administrator:
     approved immediately, full console access, and the only role allowed to
     appoint or remove other administrators. Every later signup waits for review. */
  const firstAccount = !DB.users.some(x => x.role === "owner");
  const u = {
    id:uid("u"), email:email.trim(), username:username.trim(), name:name.trim(),
    role: firstAccount ? "owner" : "student",
    status: firstAccount ? "approved" : "pending", cls:Number(cls), medium, group, password, hue:hashStr(username) % 360,
    xp:0, streak:0, videoAccess:firstAccount, priv:{ online:true, stats:true },
    created:new Date().toISOString()
  };
  if (firstAccount) u.approvedAt = u.created;
  DB.users.push(u);
  if (firstAccount) {
    notify(u.id, { type:"account", title:"You are the owner administrator", body:"This was the first account on this installation, so it was approved automatically. You can review students and appoint other administrators from the admin console.", link:"#/admin/users" });
    DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:"system", action:"owner_bootstrapped", target:u.email, detail:"First account on this installation — auto-approved and granted the owner administrator role" });
  } else {
    DB.notifications.unshift({ id:uid("n"), userId:"u-admin", type:"pending", title:"New registration", body:`${u.name} · Class ${u.cls} · awaiting approval`, link:"#/admin/approvals", at:new Date().toISOString(), read:false });
    DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:"system", action:"registration_created", target:u.email, detail:"Entered pending queue" });
  }
  DB.currentUserId = u.id;
  save(true);
  return { user:u, firstAccount };
}
function logout() { DB.currentUserId = null; save(true); }

/* ---------------- XP, streaks, achievements ---------------- */
function awardXP(u, amount, reason) {
  if (!u || amount <= 0) return;
  u.xp = (u.xp || 0) + amount;
  DB.xpLog.unshift({ id:uid("x"), userId:u.id, amount, reason, at:new Date().toISOString() });
  if (DB.xpLog.length > 400) DB.xpLog.length = 400;
}
function touchStreak(u) {
  if (!u) return;
  const today = dayKey(new Date());
  if (u.lastActiveDay === today) return;
  const yKey = dayKey(new Date(Date.now() - 864e5));
  u.streak = u.lastActiveDay === yKey ? (u.streak || 0) + 1 : 1;
  u.lastActiveDay = today;
}
function achievementsFor(u) {
  const ctx = {
    userId:u.id, attempts:DB.attempts.filter(a => a.userId === u.id),
    examsTaken:DB.examAttempts.filter(a => a.userId === u.id && a.status === "submitted"),
    streak:u.streak || 0, matches:DB.matches.filter(m => m.players.includes(u.id)),
    reviewedCount:u.id === DB.currentUserId ? DB.reviewedCount : 3,
    videoProgress:DB.videoProgress.filter(v => v.userId === u.id),
    friendIds:friendsOf(u.id)
  };
  return ACHIEVEMENTS.map(a => ({ ...a, unlocked: !!a.test(ctx) }));
}

/* ---------------- practice + exam recording ---------------- */
function recordPractice({ subjectId, chapterId, answers, total, seconds }) {
  const u = me(); if (!u) return null;
  const correct = answers.filter(a => a && a.correct).length;
  const wrong = answers.filter(a => a && a.correct === false).length;
  const at = new Date().toISOString();
  const attempt = {
    id:uid("at"), userId:u.id, kind:"practice", subjectId, chapterId,
    total, correct, wrong, skipped:total - correct - wrong, seconds, at, xp:correct * 8
  };
  DB.attempts.unshift(attempt);
  answers.forEach(a => {
    if (!a) return;
    if (a.correct === false) registerMistake(u, a.questionId);
    if (a.correct === true) softenMistake(u, a.questionId);
    if (a.correct === true && DB.mistakes.some(m => m.userId === u.id && m.questionId === a.questionId && m.status === "active" && m.lastOutcome === "review")) {
      clearMistake(u, a.questionId);
    }
  });
  awardXP(u, correct * 8 + 5, "Practice set");
  touchStreak(u);
  save();
  return attempt;
}
function registerMistake(u, questionId) {
  const q = DB.questions.find(x => x.id === questionId); if (!q) return;
  const existing = DB.mistakes.find(m => m.userId === u.id && m.questionId === questionId && m.status === "active");
  const now = new Date();
  if (existing) {
    existing.count = (existing.count || 1) + 1;
    existing.lastAt = now.toISOString();
    existing.ease = Math.max(1.3, (existing.ease || 2.5) - 0.2);
    existing.interval = 1;
    existing.dueAt = dayKey(new Date(Date.now() + 864e5));
    existing.lastOutcome = "wrong";
  } else {
    DB.mistakes.unshift({
      id:uid("mk"), userId:u.id, questionId, subjectId:q.subjectId, chapterId:q.chapterId,
      count:1, firstAt:now.toISOString(), lastAt:now.toISOString(), ease:2.5, interval:1,
      dueAt:dayKey(new Date(Date.now() + 864e5)), status:"active", lastOutcome:"wrong"
    });
  }
}
function softenMistake(u, questionId) {
  const m = DB.mistakes.find(x => x.userId === u.id && x.questionId === questionId && x.status === "active");
  if (m) m.lastOutcome = "review";
}
function clearMistake(u, questionId) {
  const m = DB.mistakes.find(x => x.userId === u.id && x.questionId === questionId && x.status === "active");
  if (!m) return;
  m.status = "cleared"; m.clearedAt = new Date().toISOString();
  DB.reviewedCount = (DB.reviewedCount || 0) + 1;
  awardXP(u, 10, "Mistake cleared");
}
/* SM-2 scheduling */
function reviewMistake(mistakeId, quality) {
  const m = DB.mistakes.find(x => x.id === mistakeId); if (!m) return null;
  const u = me();
  let ease = m.ease || 2.5, interval = m.interval || 1;
  if (quality >= 3) {
    interval = Math.round((m.count || 1) <= 1 ? 1 : Math.max(1, interval) * ease);
    if (interval > 120) interval = 120;
    m.reviews = (m.reviews || 0) + 1;
  } else {
    interval = 1;
  }
  ease = Math.min(3, Math.max(1.3, ease + (0.1 - (5 - quality) * 0.08)));
  m.ease = ease; m.interval = interval;
  m.lastReviewAt = new Date().toISOString();
  m.dueAt = dayKey(new Date(Date.now() + interval * 864e5));
  if (quality >= 4) { clearMistake(u, m.questionId); }
  save();
  return m;
}

function createExamAttempt(preset) {
  DB.examAttempts = DB.examAttempts.filter(a => !(a.userId === DB.currentUserId && a.status === "active"));
  const att = {
    id:uid("ex"), userId:DB.currentUserId, title:preset.title, subjectId:preset.subjectId,
    chapterId:preset.chapterId || null, questionIds:preset.questionIds,
    answers:{}, flags:[], status:"active",
    startedAt:new Date().toISOString(), durationSec:preset.durationSec,
    deadline:Date.now() + preset.durationSec * 1000,
    rules:{ negative:preset.negative || 0, shuffle:true }
  };
  DB.examAttempts.unshift(att);
  save(true);
  return att;
}
function scoreExam(att) {
  const qs = att.questionIds.map(id => DB.questions.find(q => q.id === id)).filter(Boolean);
  let correct = 0, wrong = 0, skipped = 0;
  const breakdown = {};
  qs.forEach(q => {
    breakdown[q.subjectId] = breakdown[q.subjectId] || { total:0, correct:0 };
    breakdown[q.subjectId].total++;
    const a = att.answers[q.id];
    if (a === undefined || a === null) skipped++;
    else if (a === q.en.ans) { correct++; breakdown[q.subjectId].correct++; }
    else wrong++;
  });
  const negative = att.rules && att.rules.negative ? att.rules.negative : 0;
  const score = Math.max(0, correct - wrong * negative);
  const pct = qs.length ? Math.round(score / qs.length * 100) : 0;
  const seconds = Math.min(att.durationSec, Math.round((Date.now() - new Date(att.startedAt).getTime()) / 1000));
  return { total:qs.length, correct, wrong, skipped, score, max:qs.length, pct, breakdown, seconds, at:new Date().toISOString(), negative };
}
function submitExam(attId) {
  const att = DB.examAttempts.find(a => a.id === attId); if (!att) return null;
  if (att.status !== "active") return att.result || null;
  att.result = scoreExam(att);
  att.status = "submitted";
  att.submittedAt = new Date().toISOString();
  const u = me();
  att.questionIds.forEach(qid => {
    const q = DB.questions.find(x => x.id === qid); if (!q) return;
    const a = att.answers[qid];
    if (a !== undefined && a !== null && a !== q.en.ans) registerMistake(u, qid);
  });
  awardXP(u, att.result.correct * 10 + 20, "Exam completed");
  touchStreak(u);
  notify(u.id, { type:"exam", title:"Exam evaluated", body:`${att.title} — ${att.result.score}/${att.result.max} (${att.result.pct}%)`, link:`#/exam-result/${att.id}` });
  save(true);
  return att.result;
}

/* ---------------- social ---------------- */
function friendsOf(userId) {
  return DB.friendships.filter(f => f.includes(userId)).map(f => f.find(x => x !== userId)).filter(id => {
    return !DB.blocks.some(b => (b[0] === userId && b[1] === id) || (b[1] === userId && b[0] === id));
  });
}
function areFriends(a, b) { return DB.friendships.some(f => f.includes(a) && f.includes(b)); }
function requestState(a, b) {
  const r = DB.friendRequests.find(x => x.status === "pending" && ((x.from === a && x.to === b) || (x.from === b && x.to === a)));
  return r ? r.from === a ? "outgoing" : "incoming" : null;
}
function sendFriendRequest(toId) {
  const u = me(); if (!u || toId === u.id) return;
  if (requestState(u.id, toId) || areFriends(u.id, toId)) return;
  if (DB.blocks.some(b => (b[0] === u.id && b[1] === toId) || (b[1] === u.id && b[0] === toId))) return { error:"This account is blocked." };
  DB.friendRequests.unshift({ id:uid("fr"), from:u.id, to:toId, status:"pending", at:new Date().toISOString() });
  notify(toId, { type:"friend", title:`${u.name} sent a friend request`, body:`@${u.username} · Class ${u.cls}`, link:"#/friends" });
  save(); return true;
}
function respondRequest(reqId, accept) {
  const r = DB.friendRequests.find(x => x.id === reqId); if (!r) return;
  r.status = accept ? "accepted" : "declined";
  if (accept) {
    DB.friendships.push([r.from, r.to]);
    const u = me();
    notify(r.from, { type:"friend", title:`${u.name} accepted your request`, body:"Start a private chat any time.", link:"#/chat" });
  }
  save();
}
function unfriend(id) {
  DB.friendships = DB.friendships.filter(f => !(f.includes(DB.currentUserId) && f.includes(id)));
  save();
}
function toggleBlock(id) {
  const u = DB.currentUserId;
  const idx = DB.blocks.findIndex(b => (b[0] === u && b[1] === id) || (b[1] === u && b[0] === id));
  if (idx >= 0) DB.blocks.splice(idx, 1); else DB.blocks.push([u, id]);
  save();
}

/* ---------------- chat ---------------- */
function convFor(a, b) { return DB.conversations.find(c => c.type === "dm" && c.members.includes(a) && c.members.includes(b)); }
function ensureDM(a, b) {
  let c = convFor(a, b);
  if (!c) {
    c = { id:uid("c"), type:"dm", members:[a, b], createdAt:new Date().toISOString(), messages:[] };
    DB.conversations.unshift(c); save();
  }
  return c;
}
function convById(id) { return DB.conversations.find(c => c.id === id); }
function convTitle(c) {
  if (!c) return "";
  if (c.type === "group") return c.name;
  const other = c.members.find(x => x !== DB.currentUserId);
  return nm(userById(other));
}
function convOther(c) { return c.type === "dm" ? userById(c.members.find(x => x !== DB.currentUserId)) : null; }
function convMessages(c) {
  if (!c) return [];
  if (c.type === "group") return c.messages;
  const report = activeReportFor(c.id);
  if (report || isAdmin()) return c.messages;
  return c.messages;
}
function activeReportFor(convId) {
  return DB.reports.find(r => r.conversationId === convId && r.status === "open");
}
function canAdminSee(c) {
  if (c.type === "group") return true;
  return !!activeReportFor(c.id);
}
function markConvRead(c) { DB.reads[c.id] = new Date().toISOString(); save(); }
function unreadCount(c) {
  const last = DB.reads[c.id];
  return c.messages.filter(m => m.from !== DB.currentUserId && (!last || m.at > last)).length;
}
function totalUnread() {
  return myConversations().reduce((s, c) => s + unreadCount(c), 0);
}
function myConversations() {
  return DB.conversations.filter(c => c.members.includes(DB.currentUserId))
    .sort((a, b) => (b.messages[b.messages.length - 1]?.at || b.createdAt).localeCompare(a.messages[a.messages.length - 1]?.at || a.createdAt));
}
function sendMessage(convId, payload) {
  const c = convById(convId); if (!c) return null;
  const u = me();
  if (c.type === "dm") {
    const other = c.members.find(x => x !== u.id);
    if (DB.blocks.some(b => (b[0] === u.id && b[1] === other) || (b[1] === u.id && b[0] === other))) return { error:"Messaging is unavailable for this account." };
  }
  const msg = Object.assign({ id:uid("m"), from:u.id, at:new Date().toISOString() }, payload);
  c.messages.push(msg);
  DB.reads[c.id] = msg.at;
  save();
  return msg;
}
function simulateReply(convId) {
  const c = convById(convId); if (!c) return null;
  const u = me();
  const partner = c.type === "dm" ? userById(c.members.find(x => x !== u.id)) : userById(c.members.find(x => x !== u.id));
  if (!partner) return null;
  const replies = [
    "Got it — let me check and get back to you.",
    "That chapter is tricky. Practise set 2 helped me a lot.",
    "Nice! Want to compare answers after this?",
    "I'm revising the same topic tonight 🌙",
    "Wait, which page? I'll look it up.",
    "Thanks! That clears it up."
  ];
  const msg = { id:uid("m"), from:partner.id, text:replies[Math.floor(Math.random() * replies.length)], at:new Date().toISOString() };
  c.messages.push(msg);
  save();
  return msg;
}
function createGroup(name, memberIds) {
  const u = me();
  const members = Array.from(new Set([u.id, ...memberIds]));
  if (members.length < 3) return { error:"A group needs at least 3 participants." };
  const c = { id:uid("c"), type:"group", name, members, adminJoined:true, createdAt:new Date().toISOString(), messages:[] };
  DB.conversations.unshift(c);
  DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:u.id, action:"group_created", target:c.name, detail:"Administrator silently joined per policy" });
  save(); return c;
}
function reportConversation(convId, reason) {
  const c = convById(convId); if (!c || c.type !== "dm") return { error:"Only 1v1 conversations can be reported." };
  if (!c.members.includes(DB.currentUserId)) return { error:"Only a participant can report this conversation." };
  if (activeReportFor(convId)) return { error:"A case is already open for this conversation." };
  const other = c.members.find(x => x !== DB.currentUserId);
  const rep = {
    id:uid("r"), conversationId:convId, reporterId:DB.currentUserId, subjectId:other,
    reason, createdAt:new Date().toISOString(), status:"open", outcome:null
  };
  DB.reports.unshift(rep);
  DB.audit.unshift({ id:uid("a"), at:rep.createdAt, actor:DB.currentUserId, action:"chat_report_filed", target:convId, detail:`Visibility granted for case ${rep.id}` });
  DB.conversations.forEach(x => { if (x.id === convId) x.reported = true; });
  notify("u-admin", { type:"report", title:"New chat report filed", body:`${me().name} reported a private conversation.`, link:"#/admin/reports" });
  save(true); return rep;
}
function reportAgeDays(rep) { return (Date.now() - new Date(rep.createdAt).getTime()) / 864e5; }
function resolveReport(repId, outcome, note) {
  const rep = DB.reports.find(r => r.id === repId); if (!rep || rep.status !== "open") return;
  const admin = me();
  rep.status = "resolved"; rep.outcome = outcome; rep.resolvedAt = new Date().toISOString(); rep.note = note || "";
  rep.reviewerId = admin.id;
  const other = rep.subjectId;
  if (outcome === "ban") {
    const v = userById(other);
    if (v) { v.status = "suspended"; v.suspendedAt = rep.resolvedAt; }
    notify(other, { type:"account", title:"Account suspended", body:"Your account was suspended following a safety review.", link:"" });
  } else if (outcome === "warning") {
    const v = userById(other);
    if (v) v.warnings = (v.warnings || 0) + 1;
    notify(other, { type:"account", title:"Safety warning issued", body:"A warning was recorded on your account following a conversation review.", link:"" });
  }
  notify(rep.reporterId, { type:"report", title:"Your report has been resolved", body:"The safety team has completed its review and taken appropriate action. Thank you for helping keep Chorcha safe.", link:"" });
  DB.audit.unshift({
    id:uid("a"), at:rep.resolvedAt, actor:admin.id, action:"chat_report_resolved",
    target:rep.id, detail:`Outcome: ${outcome}. Admin chat visibility revoked.`
  });
  const c = convById(rep.conversationId);
  if (c) c.reported = false;
  save(true);
}

/* ---------------- video ---------------- */
function videoAccessFor(u) { return !!(u && u.videoAccess); }
function setVideoAccess(userId, grant) {
  const u = userById(userId); if (!u) return;
  u.videoAccess = grant;
  DB.videoGrants.unshift({ userId, adminId:DB.currentUserId, granted:grant, at:new Date().toISOString() });
  DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:grant ? "video_access_granted" : "video_access_revoked", target:u.email, detail:"All-or-nothing account-level access" });
  notify(userId, {
    type:"video", title:grant ? "Video library unlocked" : "Video access removed",
    body:grant ? "You can now watch every published video lesson." : "Video lessons are no longer available for your account.",
    link:"#/videos"
  });
  save();
}
function publishedVideos() { return DB.videos.filter(v => v.status === "published"); }
function videoProgressOf(videoId) {
  return DB.videoProgress.find(v => v.userId === DB.currentUserId && v.videoId === videoId);
}

/* ---------------- matches ---------------- */
function recordMatch({ opponentId, subjectId, scoreA, scoreB, count }) {
  const u = me();
  const winner = scoreA === scoreB ? null : scoreA > scoreB ? u.id : opponentId;
  const delta = winner === u.id ? 18 : winner === null ? 0 : -14;
  const m = { id:uid("m"), players:[u.id, opponentId], subjectId, count, scoreA, scoreB, winner, delta, at:new Date().toISOString() };
  DB.matches.unshift(m);
  if (DB.ratings[u.id] === undefined) DB.ratings[u.id] = 1200;
  DB.ratings[u.id] = Math.max(100, DB.ratings[u.id] + delta);
  if (DB.ratings[opponentId] === undefined) DB.ratings[opponentId] = 1200;
  DB.ratings[opponentId] = Math.max(100, DB.ratings[opponentId] - delta);
  awardXP(u, winner === u.id ? 60 : 25, "1v1 match");
  touchStreak(u);
  notify(u.id, { type:"match", title:winner === u.id ? "You won the match!" : winner ? "Match complete" : "Match drawn", body:`${scoreA} – ${scoreB} against ${nm(userById(opponentId))}`, link:"#/match" });
  save(true);
  return m;
}

/* ---------------- admin actions ---------------- */
function setAccountStatus(userId, status, note) {
  const u = userById(userId); if (!u) return;
  const before = u.status;
  u.status = status;
  if (status === "approved") u.approvedAt = new Date().toISOString();
  if (status === "rejected") u.rejectedReason = note || "";
  if (status === "approved") u.videoAccess = !!u.videoAccess;
  DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:`account_${status}`, target:u.email, detail:note || `Status ${before} → ${status}` });
  notify(u.id, {
    type:"account",
    title: status === "approved" ? "Your account is approved" : status === "rejected" ? "Registration not approved" : "Account status updated",
    body: status === "approved" ? "All learning features are unlocked. Welcome to Chorcha." : status === "rejected" ? (note || "Contact the administrator for details.") : "Contact the administrator if you believe this is a mistake.",
    link:"#/dashboard"
  });
  save(true);
}
function setUserRole(userId, role) {
  const actor = me(), target = userById(userId);
  if (!actor || !target) return { error:"Account not found." };
  if (!isOwner()) return { error:"Only the owner account can change administrator roles." };
  if (target.role === "owner") return { error:"The owner role is permanent." };
  if (role !== "admin" && role !== "student") return { error:"Unknown role." };
  if (role === "admin" && target.status !== "approved") return { error:"Approve this account before granting admin access." };
  target.role = role;
  if (role === "admin") target.videoAccess = true;
  const at = new Date().toISOString();
  DB.audit.unshift({
    id:uid("a"), at, actor:actor.id,
    action: role === "admin" ? "admin_role_granted" : "admin_role_revoked",
    target:target.email,
    detail: role === "admin" ? "Administrator access granted by the owner" : "Administrator access removed by the owner"
  });
  notify(target.id, {
    type:"account",
    title: role === "admin" ? "Administrator access granted" : "Administrator access removed",
    body: role === "admin" ? "The owner appointed you as an administrator. The admin console is now available in your navigation." : "Your account is a standard student account again.",
    link: role === "admin" ? "#/admin" : "#/dashboard"
  });
  save(true);
  return { ok:true, target, role };
}
function addQuestion(data) {
  const q = {
    id:uid("q"), subjectId:data.subjectId, chapterId:data.chapterId, difficulty:data.difficulty || "medium",
    marks:1, source:data.source || "Admin authored", status:"published",
    en:{ q:data.q, opts:data.opts, ans:data.ans, exp:data.exp || "Reviewed by the content team." }, bn:null
  };
  DB.questions.push(q);
  DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:"question_created", target:q.id, detail:`${chapterOf(q.chapterId)?.id || ""}` });
  save(true); return q;
}
function publishVideo(id, status) {
  const v = DB.videos.find(x => x.id === id); if (!v) return;
  v.status = status;
  DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:`video_${status}`, target:v.title.en, detail:"Lifecycle change" });
  save();
}
function toggleStar(convId) {
  const i = DB.stars.indexOf(convId);
  if (i >= 0) DB.stars.splice(i, 1); else DB.stars.push(convId);
  DB.audit.unshift({ id:uid("a"), at:new Date().toISOString(), actor:DB.currentUserId, action:DB.stars.includes(convId) ? "group_marked" : "group_unmarked", target:convId, detail:"Group marked for attention" });
  save();
}

/* leaderboard */
function leaderboard(scope) {
  let rows = DB.users.filter(u => u.status === "approved" && !isStaff(u));
  if (scope === "friends") { const f = friendsOf(DB.currentUserId); rows = rows.filter(u => f.includes(u.id)); }
  rows = rows.map(u => {
    let xp = u.xp || 0;
    if (scope === "month") {
      xp = DB.attempts.filter(a => a.userId === u.id && new Date(a.at).getMonth() === new Date().getMonth()).reduce((s, a) => s + (a.xp || 0), 0)
        + DB.examAttempts.filter(a => a.userId === u.id && a.status === "submitted" && new Date(a.result.at).getMonth() === new Date().getMonth()).reduce((s, a) => s + a.result.correct * 10, 0);
    }
    return { u, xp };
  });
  return rows.sort((a, b) => b.xp - a.xp);
}

/* ---------------- init ---------------- */
loadDevice();
loadState();
