/* ============================================================
   CHORCHA — friends, chat, 1v1 matches
   ============================================================ */
let FRIEND_QUERY = "";
let CHAT_VIEW = null;
let REC = null;
let MATCH = null;

function viewFriends() {
  const u = me();
  const friends = friendsOf(u.id).map(userById).filter(Boolean);
  const incoming = DB.friendRequests.filter(r => r.to === u.id && r.status === "pending");
  const outgoing = DB.friendRequests.filter(r => r.from === u.id && r.status === "pending");
  const q = FRIEND_QUERY.trim().toLowerCase();
  const people = DB.users.filter(x => x.id !== u.id && x.status === "approved" && !isStaff(x)
    && (!q || x.username.includes(q) || x.name.toLowerCase().includes(q)));
  return {
    active:"friends",
    title:t("friends"),
    body:`<div class="page">
      ${pageHead(t("friends"), DEVICE.lang === "bn" ? "ইউজারনেম দিয়ে খুঁজুন, অনুরোধ পাঠান, আর নিরাপদে কথা বলুন।" : "Find classmates by their unique username. Friend requests, blocks and reports keep the space safe.",
        `<a class="btn btn-sm btn-ghost" href="#/chat">${icon("message", 14)} ${esc(t("messages"))}</a>`)}
      <div class="grid g-2-1">
        <div class="col" style="gap:14px">
          <div class="card">
            <div class="card-head"><h2 class="h3">${esc(t("yourFriends"))}</h2><span class="tag grey">${friends.length}</span></div>
            <div class="list">
              ${friends.length ? friends.map(f => `<div class="list-item">
                ${avatar(f, "", (f.priv && f.priv.online) ? "online" : "")}
                <div class="meta"><b>${esc(f.name)}</b><span>@${esc(f.username)} · ${esc(t("class"))} ${f.cls} · ${esc(leagueOf(f.xp).name[DEVICE.lang])}</span></div>
                <button class="icon-btn plain" data-action="open-dm" data-id="${f.id}" aria-label="${esc(t("messages"))}">${icon("message", 17)}</button>
                <button class="icon-btn plain" data-action="block-user" data-id="${f.id}" aria-label="${esc(t("block"))}">${icon("eyeOff", 16)}</button>
                <button class="icon-btn plain" data-action="unfriend" data-id="${f.id}" aria-label="${esc(t("remove"))}">${icon("trash", 16)}</button>
              </div>`).join("") : emptyState("users", DEVICE.lang === "bn" ? "এখনো কোনো বন্ধু নেই" : "No friends yet", DEVICE.lang === "bn" ? "ডান পাশ থেকে সহপাঠী খুঁজে অনুরোধ পাঠান।" : "Search for classmates on the right and send your first request.")}
            </div>
          </div>

          <div class="card">
            <div class="card-head"><h2 class="h3">${esc(t("people"))}</h2>
              <span class="tiny faint">${people.length} ${DEVICE.lang === "bn" ? "জন" : "found"}</span></div>
            <div style="padding:0 20px 14px">
              <div class="row" style="gap:8px">
                <input class="input" id="friendSearch" placeholder="${esc(t("searchFriends"))}" value="${esc(FRIEND_QUERY)}" data-enter="search-friends" style="min-height:40px">
                <button class="btn btn-ghost" data-action="search-friends" aria-label="${esc(t("search"))}">${icon("search", 16)}</button>
              </div>
            </div>
            <div class="list">
              ${people.slice(0, 8).map(p => {
                const st = areFriends(u.id, p.id) ? "friend" : requestState(u.id, p.id);
                const blocked = DB.blocks.some(b => b.includes(u.id) && b.includes(p.id));
                return `<div class="list-item">
                  ${avatar(p, "sm")}
                  <div class="meta"><b>${esc(p.name)} ${blocked ? `<span class="tag rose">${esc(t("block"))}</span>` : ""}</b><span>@${esc(p.username)} · ${esc(t("class"))} ${p.cls} · ${esc(p.group || "")}</span></div>
                  ${st === "friend" ? `<span class="tag green">${icon("check", 11)} ${esc(t("yourFriends"))}</span>`
                    : st === "outgoing" ? `<span class="tag grey">${esc(t("requested"))}</span>`
                    : st === "incoming" ? `<button class="btn btn-sm btn-soft" data-action="accept-req" data-from="${p.id}">${esc(t("accept"))}</button>`
                    : blocked ? `<button class="btn btn-sm btn-ghost" data-action="toggle-block" data-id="${p.id}">${esc(t("unblock"))}</button>`
                    : `<button class="btn btn-sm btn-ghost" data-action="add-friend" data-id="${p.id}">${icon("userPlus", 14)} ${esc(t("addFriend"))}</button>`}
                </div>`;
              }).join("") || `<div class="empty"><p>${DEVICE.lang === "bn" ? "কোনো ব্যবহারকারী পাওয়া যায়নি।" : "No usernames match that search."}</p></div>`}
            </div>
          </div>
        </div>

        <div class="col" style="gap:14px">
          <div class="card">
            <div class="card-head"><h2 class="h3">${esc(t("pendingRequests"))}</h2>${incoming.length ? `<span class="tag rose">${incoming.length}</span>` : ""}</div>
            <div class="list">
              ${incoming.length ? incoming.map(r => { const f = userById(r.from); return `<div class="list-item">
                ${avatar(f, "sm")}
                <div class="meta"><b>${esc(f.name)}</b><span>@${esc(f.username)} · ${timeAgo(r.at)}</span></div>
                <button class="btn btn-sm btn-primary" data-action="accept-req" data-id="${r.id}">${esc(t("accept"))}</button>
                <button class="icon-btn plain" data-action="decline-req" data-id="${r.id}" aria-label="${esc(t("decline"))}">${icon("x", 16)}</button>
              </div>`; }).join("") : `<div class="empty" style="padding:22px"><p>${DEVICE.lang === "bn" ? "নতুন অনুরোধ নেই।" : "No pending requests."}</p></div>`}
            </div>
            ${outgoing.length ? `<div class="divider"></div><div class="card-pad"><div class="eyebrow" style="margin-bottom:8px">${DEVICE.lang === "bn" ? "পাঠানো হয়েছে" : "Sent"}</div>
              ${outgoing.map(r => { const f = userById(r.to); return `<div class="row" style="gap:8px;padding:5px 0">${avatar(f, "sm")}<span class="small" style="flex:1">${esc(f.name)}</span><span class="tag grey">${esc(t("requested"))}</span></div>`; }).join("")}</div>` : ""}
          </div>
          <div class="card card-pad">
            <div class="row" style="gap:9px;margin-bottom:8px">${icon("shieldCheck", 16, "muted")}<b style="font-size:12.5px">${DEVICE.lang === "bn" ? "নিরাপত্তা" : "Safety"}</b></div>
            <p class="small muted">${DEVICE.lang === "bn" ? "ব্লক করা অ্যাকাউন্ট অনুরোধ বা বার্তা পাঠাতে পারবে না। ১vs১ চ্যাট ব্যক্তিগত; রিপোর্ট করলে তদন্তের জন্য প্রশাসক তা দেখতে পারেন।" : "Blocked accounts cannot message or send requests. One-to-one chats stay private unless a participant files a report, which opens a time-limited review."}</p>
            <a class="btn btn-sm btn-ghost btn-block" style="margin-top:10px" href="#/settings">${esc(t("privacy"))} ${icon("arrowRight", 13)}</a>
          </div>
        </div>
      </div>
    </div>`
  };
}

/* ---------------- chat ---------------- */
function chatBubble(m, c) {
  const u = me();
  const mine = m.from === u.id;
  const author = userById(m.from);
  const tm = new Date(m.at).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
  let inner;
  if (m.voice) {
    inner = `<div class="voice"><button aria-label="${esc(t("play"))}">${icon("play", 11)}</button>
      <span class="wave">${Array.from({ length: 22 }).map((_, i) => `<i style="height:${4 + ((i * 7) % 14)}px"></i>`).join("")}</span>
      <span class="dur">${fmtDur(m.voice.dur)}</span></div>`;
  } else {
    inner = esc(m.text || "");
  }
  const readTick = mine && c.type === "dm" ? `<span style="opacity:.75">${icon("check", 10)}</span>` : "";
  return `<div class="msg ${mine ? "me" : ""}">
    ${!mine ? avatar(author, "sm") : ""}
    <div class="bubble">${inner}<div class="tm">${c.type === "group" && !mine ? `<b style="opacity:.7;margin-right:3px">${esc((author && author.name.split(" ")[0]) || "")}</b>` : ""}${tm} ${readTick}</div></div>
  </div>`;
}

function viewChat(convId) {
  const convs = myConversations();
  if (!convId && convs.length) convId = convs[0].id;
  const c = convById(convId);
  if (c) { markConvRead(c); CHAT_VIEW = c.id; }
  const messages = c ? c.messages : [];
  let lastDay = "";
  const body = messages.map(m => {
    const k = new Date(m.at).toDateString();
    let sep = "";
    if (k !== lastDay) {
      lastDay = k;
      const today = new Date().toDateString() === k;
      const yest = new Date(Date.now() - 864e5).toDateString() === k;
      sep = `<div class="daysep">${today ? esc(t("today")) : yest ? esc(t("yesterday")) : new Date(m.at).toLocaleDateString("en-GB", { day:"numeric", month:"short" })}</div>`;
    }
    return sep + chatBubble(m, c);
  }).join("");

  const other = c ? convOther(c) : null;
  const rep = c ? activeReportFor(c.id) : null;
  const canReport = c && c.type === "dm" && !rep;

  return {
    active:"chat",
    title:`${t("messages")}${c ? " › " + esc(convTitle(c)) : ""}`,
    body:`<div class="page" style="gap:12px">
      <div class="chat-shell ${c ? "" : "showlist"}" id="chatShell">
        <aside class="convlist">
          <div class="convsearch row" style="gap:8px">
            <button class="btn btn-primary btn-sm" data-action="new-group" style="flex:1">${icon("plus", 14)} ${esc(t("createGroup"))}</button>
            <button class="icon-btn" data-action="new-dm" aria-label="${esc(t("messages"))}">${icon("edit", 16)}</button>
          </div>
          <div style="overflow-y:auto;flex:1">
            ${convs.map(x => {
              const o = convOther(x);
              const last = x.messages[x.messages.length - 1];
              const un = unreadCount(x);
              return `<a class="convitem ${c && c.id === x.id ? "active" : ""}" href="#/chat/${x.id}">
                ${x.type === "group"
                  ? `<span class="avatar" style="background:linear-gradient(150deg,#7C5CE0,#3E2C86)">${icon("users", 16)}</span>`
                  : avatar(o, "", o && o.priv && o.priv.online ? "online" : "")}
                <span class="meta"><span class="nm">${esc(convTitle(x))}${x.type === "group" ? `<span class="tag grey" style="font-size:8.5px">${x.members.length}</span>` : ""}</span>
                  <span class="pv">${last ? (last.voice ? "🎙 " + esc(t("voiceNote")) : esc((userById(last.from) === me() ? "You: " : "") + (last.text || ""))) : DEVICE.lang === "bn" ? "নতুন কথোপকথন" : "New conversation"}</span></span>
                <span class="side"><span class="tm">${last ? new Date(last.at).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }) : ""}</span>${un ? `<span class="unread">${un}</span>` : ""}</span>
              </a>`;
            }).join("") || `<div class="empty" style="padding:26px"><p class="small">${DEVICE.lang === "bn" ? "কোনো চ্যাট নেই।" : "No conversations yet."}</p></div>`}
          </div>
          <div style="padding:10px 12px;border-top:1px solid var(--line)"><p class="tiny faint" style="line-height:1.5">${DEVICE.lang === "bn" ? "১vs১ চ্যাট রিপোর্ট করলে ৭–১০ দিনের জন্য প্রশাসক দেখতে পারেন।" : "1v1 chats are private unless reported. Group chats may be reviewed for safety."}</p></div>
        </aside>
        <section class="thread">
          ${c ? `
            <div class="thread-head">
              <a class="icon-btn plain" href="#/chat" data-action="chat-back" aria-label="${esc(t("back"))}" style="display:none" id="chatBack">${icon("arrowLeft", 17)}</a>
              ${c.type === "group"
                ? `<span class="avatar" style="background:linear-gradient(150deg,#7C5CE0,#3E2C86)">${icon("users", 16)}</span>`
                : avatar(other, "", other && other.priv && other.priv.online ? "online" : "")}
              <div style="flex:1;min-width:0">
                <b style="font-size:13px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(convTitle(c))}</b>
                <span class="tiny faint">${c.type === "group" ? `${c.members.length} ${DEVICE.lang === "bn" ? "জন সদস্য" : "members"}` : `@${esc(other ? other.username : "")} · ${DEVICE.lang === "bn" ? "সক্রিয়" : "active now"}`}</span>
              </div>
              ${c.type === "dm" && areFriends(DB.currentUserId, other.id) ? `<a class="icon-btn plain" href="#/match" aria-label="${esc(t("challengeFriend"))}" title="${esc(t("challengeFriend"))}">${icon("swords", 17)}</a>` : ""}
              ${canReport ? `<button class="icon-btn plain" data-action="report-chat" data-id="${c.id}" aria-label="${esc(t("reportChat"))}" title="${esc(t("reportChat"))}">${icon("flag", 17)}</button>` : ""}
              ${c.type === "group" ? `<span class="avatar-stack">${c.members.slice(0, 3).map(id => avatar(userById(id), "sm")).join("")}</span>` : ""}
            </div>
            ${privacyBanner(c)}
            <div class="thread-body" id="threadBody">${body || `<div class="empty" style="margin:auto"><div class="ico">${icon("message", 22)}</div><b>${DEVICE.lang === "bn" ? "কথোপকথন শুরু করুন" : "Say hello"}</b><p>${DEVICE.lang === "bn" ? "প্রথম বার্তাটি আপনিই পাঠান।" : "Send the first message — it stays between the two of you."}</p></div>`}</div>
            <div id="typingSlot"></div>
            ${REC && REC.convId === c.id ? `<div class="composer"><div class="recording"><span class="dot"></span> ${esc(t("recording"))} <span class="num" id="recClock">0:00</span><span class="spacer" style="flex:1"></span></div>
              <button class="btn btn-sm btn-ghost" data-action="cancel-rec">${esc(t("cancel"))}</button>
              <button class="btn btn-sm btn-danger" data-action="stop-rec">${icon("check", 14)} ${esc(t("stop"))}</button></div>`
            : `<div class="composer">
                <input class="input" id="chatInput" placeholder="${esc(t("typeMessage"))}" data-send-chat="${c.id}" autocomplete="off">
                <button class="icon-btn plain" data-action="start-rec" data-id="${c.id}" aria-label="${esc(t("record"))}">${icon("mic", 18)}</button>
                <button class="send" data-action="send-chat" data-id="${c.id}" aria-label="${esc(t("send"))}">${icon("send", 17)}</button>
              </div>`}
          ` : `<div class="thread-body" style="align-items:center;justify-content:center">
              ${emptyState("message", DEVICE.lang === "bn" ? "একটি কথোপকথন বেছে নিন" : "Select a conversation", DEVICE.lang === "bn" ? "বাম দিকের তালিকা থেকে চ্যাট খুলুন, অথবা নতুন গ্রুপ তৈরি করুন।" : "Choose a chat from the list, or start a new group with your friends.")}
            </div>`}
        </section>
      </div>
    </div>`
  };
}

/* ---------------- match ---------------- */
function viewMatch() {
  if (MATCH && MATCH.finished) return viewMatchResult();
  if (MATCH) return viewMatchLive();
  const u = me();
  const subjects = SUBJECTS.filter(s => isUnlockedSubject(s) && subjectQuestions(s.id).length >= 8);
  const friends = friendsOf(u.id).map(userById).filter(Boolean);
  const history = DB.matches.filter(m => m.players.includes(u.id));
  const wins = history.filter(m => m.winner === u.id).length;
  const rating = DB.ratings[u.id] || 1000;
  return {
    active:"match",
    title:t("match"),
    body:`<div class="page">
      ${pageHead(t("match"), DEVICE.lang === "bn" ? "একই প্রশ্ন, একই ঘড়ি — কে বেশি দ্রুত সঠিক উত্তর দিতে পারে?" : "Same questions, same clock. Server-authoritative scoring keeps every duel fair.",
        `<span class="tag violet">${DEVICE.lang === "bn" ? "রেটিং" : "Rating"} ${rating}</span>`)}
      <div class="grid g-2-1">
        <div class="card card-pad">
          <div class="row" style="gap:10px;margin-bottom:14px">
            <span class="stat-ico violet">${icon("swords", 17)}</span>
            <div><b style="font-size:14px">${esc(t("findOpponent"))}</b><p class="tiny faint">${DEVICE.lang === "bn" ? "৮টি প্রশ্ন · ৫ মিনিট · তাৎক্ষণিক স্কোর" : "8 questions · 5 minutes · live score"}</p></div>
          </div>
          <div class="field" style="margin-bottom:12px"><label class="label">${DEVICE.lang === "bn" ? "বিষয়" : "Subject"}</label>
            <select class="select" id="matchSubject">${subjects.map(s => `<option value="${s.id}">${esc(subjName(s))}</option>`).join("")}</select></div>
          <button class="btn btn-primary btn-block btn-lg" data-action="quick-match">${icon("swords", 16)} ${esc(t("findOpponent"))}</button>
          <div class="row" style="gap:6px;margin-top:10px;justify-content:center">
            <span class="tiny faint">${DEVICE.lang === "bn" ? "এলো রেটিং · ডিসকানেক্ট গ্রেস ৩০ সেকেন্ড" : "ELO rating · 30s reconnect grace · fixed question set"}</span>
          </div>
          <div class="divider" style="margin:18px 0"></div>
          <div class="eyebrow" style="margin-bottom:10px">${esc(t("challengeFriend"))}</div>
          <div class="col" style="gap:6px">
            ${friends.length ? friends.slice(0, 5).map(f => `<div class="row" style="gap:10px;padding:7px 0;border-bottom:1px solid var(--line)">
              ${avatar(f, "sm")}
              <div style="flex:1"><b style="font-size:12.5px;display:block">${esc(f.name)}</b><span class="tiny faint">@${esc(f.username)} · ${DB.ratings[f.id] || 1000} ELO</span></div>
              <button class="btn btn-sm btn-ghost" data-action="challenge" data-id="${f.id}">${DEVICE.lang === "bn" ? "চ্যালেঞ্জ" : "Challenge"}</button>
            </div>`).join("") : `<p class="small muted">${DEVICE.lang === "bn" ? "চ্যালেঞ্জ করতে আগে বন্ধু যোগ করুন।" : "Add a friend to send a direct challenge."}</p>`}
          </div>
        </div>
        <div class="col" style="gap:14px">
          <div class="card card-pad">
            <div class="eyebrow">${DEVICE.lang === "bn" ? "আপনার রেকর্ড" : "Your record"}</div>
            <div class="row" style="gap:20px;margin-top:10px">
              <div><div class="stat-val" style="font-size:26px">${wins}</div><div class="stat-label">${esc(t("win"))}</div></div>
              <div><div class="stat-val" style="font-size:26px">${history.filter(m => m.winner && m.winner !== u.id).length}</div><div class="stat-label">${esc(t("loss"))}</div></div>
              <div><div class="stat-val" style="font-size:26px">${history.filter(m => !m.winner).length}</div><div class="stat-label">${esc(t("draw"))}</div></div>
            </div>
          </div>
          <div class="card">
            <div class="card-head"><h2 class="h3">${esc(t("matchHistory"))}</h2></div>
            <div class="list">
              ${history.length ? history.slice(0, 6).map(m => {
                const opp = userById(m.players.find(p => p !== u.id));
                const res = m.winner === u.id ? t("win") : m.winner ? t("loss") : t("draw");
                return `<div class="list-item">${avatar(opp, "sm")}
                  <div class="meta"><b>${esc(nm(opp))} · ${m.scoreA}–${m.scoreB}</b><span>${esc(subjName(subjectOf(m.subjectId)))} · ${timeAgo(m.at)}</span></div>
                  <span class="tag ${m.winner === u.id ? "green" : m.winner ? "rose" : "grey"}">${esc(res)}</span></div>`;
              }).join("") : `<div class="empty" style="padding:24px"><p class="small">${DEVICE.lang === "bn" ? "এখনো কোনো ম্যাচ নেই।" : "No matches played yet."}</p></div>`}
            </div>
          </div>
        </div>
      </div>
    </div>`
  };
}

function beginMatch(subjectId, opponentId) {
  const u = me();
  const pool = subjectQuestions(subjectId).slice().sort(() => Math.random() - 0.5).slice(0, 8);
  if (pool.length < 4) { toast(DEVICE.lang === "bn" ? "এই বিষয়ে যথেষ্ট প্রশ্ন নেই।" : "Not enough questions in that subject.", "err"); return; }
  const opp = userById(opponentId) || DB.users.find(x => x.id !== u.id && x.status === "approved" && !isStaff(x));
  MATCH = {
    subjectId, opponentId:opp.id, queue:pool.map(q => q.id), index:0, scoreA:0, scoreB:0,
    startedAt:Date.now(), deadline:Date.now() + 5 * 60 * 1000, finished:false,
    botNextAt:Date.now() + 7000, botAnswered:0, chosen:null, revealed:false, answers:0
  };
  navigate("#/match");
}
function matchQuestion() { return DB.questions.find(q => q.id === MATCH.queue[MATCH.index]); }

function viewMatchLive() {
  const q = matchQuestion();
  if (!q) return viewMatchResult();
  const opp = userById(MATCH.opponentId);
  const qd = qText(q);
  const total = MATCH.queue.length;
  const left = Math.max(0, Math.floor((MATCH.deadline - Date.now()) / 1000));
  const u = me();
  return {
    active:"match",
    title:`${t("match")} › ${DEVICE.lang === "bn" ? "লাইভ" : "Live"}`,
    body:`<div class="page">
      <div class="card card-pad">
        <div class="vs">
          <div class="vs-side">${avatar(u, "lg")}<div><b style="font-size:13px;display:block">${esc(nm(u))}</b><span class="tiny faint">${DEVICE.lang === "bn" ? "আপনি" : "You"} · ${DB.ratings[u.id] || 1000} ELO</span></div></div>
          <div class="vs-mid">vs</div>
          <div class="vs-side right">${avatar(opp, "lg")}<div><b style="font-size:13px;display:block">${esc(nm(opp))}</b><span class="tiny faint">${DB.ratings[opp.id] || 1000} ELO</span></div></div>
        </div>
        <div class="row" style="gap:14px;margin-top:16px">
          <b class="num" style="font-size:22px;color:var(--blue)">${MATCH.scoreA}</b>
          <div class="duel-bar"><div class="a" style="width:${MATCH.scoreA / total * 100}%"></div><div class="b" style="width:${MATCH.scoreB / total * 100}%"></div></div>
          <b class="num" style="font-size:22px;color:var(--emerald)">${MATCH.scoreB}</b>
        </div>
        <div class="row" style="margin-top:10px;justify-content:space-between">
          <span class="tiny faint">${DEVICE.lang === "bn" ? "প্রশ্ন" : "Question"} ${MATCH.index + 1} / ${total}</span>
          <span class="timer ${left < 30 ? "crit" : left < 60 ? "warn" : ""}" style="font-size:14px">${icon("clock", 14)} <span class="num" id="matchClock">${fmtClock(left)}</span></span>
          <span class="tiny faint">${esc(subjName(subjectOf(MATCH.subjectId)))}</span>
        </div>
      </div>
      <div class="card qcard">
        <div class="qmeta"><span class="tag blue">${DEVICE.lang === "bn" ? "লাইভ প্রশ্ন" : "Live question"}</span>${markPill(q)}
          <span class="tag grey" style="margin-left:auto">${DEVICE.lang === "bn" ? "উভয় খেলোয়াড় একই প্রশ্ন পাচ্ছেন" : "Both players get the same set"}</span></div>
        <h2 class="qtext${DEVICE.lang === "bn" ? " bn" : ""}">${esc(qd.q)}</h2>
        <div class="options">
          ${qd.opts.map((o, i) => {
            let cls = MATCH.chosen === i ? "selected" : "";
            if (MATCH.revealed) cls = i === qd.ans ? "correct" : i === MATCH.chosen ? "wrong" : "dim";
            return `<button class="opt ${cls}" data-action="match-answer" data-i="${i}" ${MATCH.revealed ? "disabled" : ""}>
              <span class="key">${"ABCD"[i]}</span><span class="txt">${esc(o)}</span>
              <span class="mark">${icon(MATCH.revealed && i === qd.ans ? "check" : "x", 18)}</span></button>`;
          }).join("")}
        </div>
        ${MATCH.revealed ? `<div class="explain"><b>${icon(MATCH.chosen === qd.ans ? "check" : "x", 14)} ${MATCH.chosen === qd.ans ? (DEVICE.lang === "bn" ? "সঠিক" : "Correct") : (DEVICE.lang === "bn" ? "সঠিক উত্তর" : "Correct answer")}: ${esc(qd.opts[qd.ans])}</b><span>${esc(qd.exp)}</span></div>` : ""}
        <div class="quizfoot">
          <span class="tiny faint">${DEVICE.lang === "bn" ? `প্রতিপক্ষ ${MATCH.botAnswered}/${total} প্রশ্নের উত্তর দিয়েছে` : `Opponent has answered ${MATCH.botAnswered}/${total} questions`}</span>
          <div class="spacer"></div>
          ${MATCH.revealed ? `<button class="btn btn-primary" data-action="match-next">${MATCH.index === total - 1 ? esc(t("finish")) : esc(t("next"))} ${icon("arrowRight", 15)}</button>` : ""}
        </div>
      </div>
      <div class="row" style="justify-content:center;gap:8px"><span class="tiny faint">${DEVICE.lang === "bn" ? "ম্যাচ ছেড়ে গেলে ৩০ সেকেন্ডের মধ্যে ফিরতে হবে।" : "Leaving forfeits after a 30-second reconnect grace period."}</span></div>
    </div>`
  };
}

function finishMatch() {
  if (!MATCH) return;
  // simulate opponent's remaining answers deterministically
  const remaining = MATCH.queue.length - MATCH.botAnswered;
  let bot = MATCH.scoreB;
  for (let i = 0; i < remaining; i++) if (Math.random() < 0.68) bot++;
  MATCH.scoreB = bot;
  MATCH.finished = true;
  recordMatch({ opponentId:MATCH.opponentId, subjectId:MATCH.subjectId, scoreA:MATCH.scoreA, scoreB:MATCH.scoreB, count:MATCH.queue.length });
  save(true);
  navigate("#/match");
}
function viewMatchResult() {
  const u = me();
  const opp = userById(MATCH.opponentId);
  const win = MATCH.scoreA > MATCH.scoreB, draw = MATCH.scoreA === MATCH.scoreB;
  return {
    active:"match",
    title:`${t("match")} › ${DEVICE.lang === "bn" ? "ফলাফল" : "Result"}`,
    body:`<div class="page">
      <div class="card card-pad" style="text-align:center;padding:38px">
        <span class="tag ${win ? "green" : draw ? "grey" : "rose"}" style="margin-bottom:14px">${win ? esc(t("win")) : draw ? esc(t("draw")) : esc(t("loss"))}</span>
        <div class="vs" style="max-width:520px;margin:0 auto">
          <div class="vs-side" style="background:${win ? "var(--emerald-soft)" : "var(--surface-2)"}">${avatar(u, "lg")}<div><b style="font-size:13px;display:block">${esc(nm(u))}</b><span class="tiny faint">${DEVICE.lang === "bn" ? "আপনি" : "You"}</span></div></div>
          <div class="score-big" style="font-size:38px">${MATCH.scoreA}–${MATCH.scoreB}</div>
          <div class="vs-side right">${avatar(opp, "lg")}<div><b style="font-size:13px;display:block">${esc(nm(opp))}</b><span class="tiny faint">@${esc(opp.username)}</span></div></div>
        </div>
        <p class="muted small" style="margin-top:16px">${esc(subjName(subjectOf(MATCH.subjectId)))} · ${MATCH.queue.length} ${DEVICE.lang === "bn" ? "প্রশ্ন" : "questions"} · ${esc(t("rating"))} ${DB.ratings[u.id] || 1000} <span class="tag ${win ? "green" : draw ? "grey" : "rose"}">${win ? "+18" : draw ? "±0" : "−14"}</span></p>
        <div class="row" style="justify-content:center;gap:9px;margin-top:20px">
          <button class="btn btn-primary" data-action="quick-match">${icon("refresh", 15)} ${DEVICE.lang === "bn" ? "আবার খেলুন" : "Rematch"}</button>
          <a class="btn btn-ghost" href="#/leaderboard">${esc(t("leaderboard"))}</a>
          <button class="btn btn-ghost" data-action="match-lobby">${esc(t("matchLobby"))}</button>
        </div>
      </div>
    </div>`
  };
}
