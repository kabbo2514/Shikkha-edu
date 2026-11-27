/* ============================================================
   CHORCHA — creative questions
   ============================================================ */
let CQ_FILTER = "";

function cqDraftKey(cqId) { return DB.currentUserId + ":" + cqId; }
function cqDraft(cqId) {
  const k = cqDraftKey(cqId);
  if (!DB.cqDrafts[k]) DB.cqDrafts[k] = { texts:{}, assess:{}, updatedAt:null };
  return DB.cqDrafts[k];
}

function viewCQList(query) {
  const filter = query && query.subject ? query.subject : CQ_FILTER;
  const rows = DB.cqs.filter(c => !filter || c.subjectId === filter);
  return {
    active:"cq",
    title:`${t("cq")}`,
    body:`<div class="page">
      ${pageHead(t("cq"), DEVICE.lang === "bn" ? "বোর্ড-ধাঁচের সৃজনশীল প্রশ্ন — ক, খ, গ, ঘ অংশ, মডেল উত্তর ও মার্কিং রুব্রিক সহ।" : "Board-style creative questions with ক–ঘ sub-questions, model answers, marking rubrics and space to write.",
        `<span class="tag violet">${DB.cqs.length} ${DEVICE.lang === "bn" ? "প্রশ্ন" : "questions"}</span>`)}
      <div class="row wrap" style="gap:7px">
        <button class="chip ${!filter ? "active" : ""}" data-action="filter-cq" data-subject="">${esc(t("allSubjects"))}</button>
        ${SUBJECTS.filter(isUnlockedSubject).map(s => `<button class="chip ${filter === s.id ? "active" : ""}" data-action="filter-cq" data-subject="${s.id}">${esc(subjName(s))}</button>`).join("")}
      </div>
      <div class="col" style="gap:14px">
        ${rows.length ? rows.map(c => {
          const s = subjectOf(c.subjectId);
          const ct = cqText(c);
          const marks = c.en.parts.reduce((a, p) => a + p.marks, 0);
          const draft = DB.cqDrafts[cqDraftKey(c.id)];
          const written = draft ? Object.values(draft.texts || {}).filter(x => x && x.trim()).length : 0;
          return `<a class="card card-pad" href="#/cq/${c.id}" style="text-decoration:none;color:inherit;display:block">
            <div class="row" style="gap:10px;margin-bottom:10px;flex-wrap:wrap">
              <span class="tag" style="background:${s.color[0]}22;color:${s.color[0]}">${esc(subjName(s))}</span>
              <span class="tag grey">${esc(chapName(chapterOf(c.chapterId)))}</span>
              <span class="tag violet">${marks} ${DEVICE.lang === "bn" ? "নম্বর" : "marks"}</span>
              ${written ? `<span class="tag green">${icon("edit", 11)} ${written}/4 ${DEVICE.lang === "bn" ? "লেখা হয়েছে" : "written"}</span>` : ""}
              <span style="margin-left:auto" class="chev">${icon("chevronRight", 16)}</span>
            </div>
            <p style="font-size:14px;font-weight:650;line-height:1.55">${esc(ct.stem)}</p>
            <div class="row wrap" style="gap:6px;margin-top:12px">
              ${c.en.parts.map(p => `<span class="tag grey">${esc(p.label)} · ${p.marks}</span>`).join("")}
              <span class="tiny faint" style="margin-left:auto">${esc(c.source || "")}</span>
            </div>
          </a>`;
        }).join("") : emptyState("layers", DEVICE.lang === "bn" ? "এই বিষয়ে প্রশ্ন নেই" : "No creative questions here yet", DEVICE.lang === "bn" ? "অন্য বিষয় বেছে নিন।" : "Try another subject filter.")}
      </div>
    </div>`
  };
}

function viewCQDetail(cqId) {
  const c = DB.cqs.find(x => x.id === cqId);
  if (!c) return viewCQList();
  const s = subjectOf(c.subjectId);
  const ct = cqText(c);
  const draft = cqDraft(c.id);
  const totalMarks = c.en.parts.reduce((a, p) => a + p.marks, 0);
  const obtained = Object.values(draft.assess || {}).reduce((a, b) => a + Number(b || 0), 0);
  const writtenCount = Object.values(draft.texts || {}).filter(x => x && x.trim()).length;
  return {
    active:"cq",
    title:`${t("cq")} › ${esc(chapName(chapterOf(c.chapterId)))}`,
    body:`<div class="page">
      <div class="breadcrumb"><a href="#/cq">${esc(t("cq"))}</a>${icon("chevronRight", 12)}<span>${esc(subjName(s))}</span>${icon("chevronRight", 12)}<span>${esc(chapName(chapterOf(c.chapterId)))}</span></div>
      <div class="card card-pad">
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:12px">
          <span class="tag" style="background:${s.color[0]}22;color:${s.color[0]}">${esc(subjName(s))}</span>
          <span class="tag grey">${esc(chapName(chapterOf(c.chapterId)))}</span>
          <span class="tag violet">${totalMarks} ${DEVICE.lang === "bn" ? "নম্বর" : "marks"}</span>
          <div class="spacer"></div>
          <button class="btn btn-sm btn-ghost" data-action="print">${icon("print", 14)} ${esc(t("print"))}</button>
        </div>
        <p style="font-size:15.5px;line-height:1.7;font-weight:600">${esc(ct.stem)}</p>
        <p class="tiny faint" style="margin-top:8px">${esc(c.source || "")}</p>
      </div>

      <div class="col" style="gap:14px">
        ${ct.parts.map((p, i) => {
          const enPart = c.en.parts[i];
          const val = (draft.texts && draft.texts[i]) || "";
          const marks = draft.assess && draft.assess[i] != null ? draft.assess[i] : "";
          return `<div class="card card-pad">
            <div class="row" style="gap:10px;align-items:flex-start">
              <span class="qno tag blue" style="font-size:13px;padding:3px 9px">${esc(p.label)}</span>
              <p style="flex:1;font-size:13.5px;line-height:1.65">${esc(p.text)}</p>
              <span class="tag grey">${enPart.marks}</span>
            </div>
            <div class="field" style="margin-top:12px">
              <label class="label" for="cq-${i}">${esc(t("writeAnswer"))} <span class="tiny faint" style="font-weight:500">${DEVICE.lang === "bn" ? "স্বয়ংক্রিয়ভাবে সংরক্ষিত" : "autosaved locally"}</span></label>
              <textarea class="textarea" id="cq-${i}" data-cq-input="${i}" data-cq="${c.id}" placeholder="${DEVICE.lang === "bn" ? "এখানে আপনার উত্তর লিখুন…" : "Write your answer here…"}" style="min-height:${enPart.marks >= 3 ? 120 : 84}px">${esc(val)}</textarea>
              <div class="row" style="justify-content:space-between">
                <span class="tiny faint">${val.trim().split(/\s+/).filter(Boolean).length} ${DEVICE.lang === "bn" ? "শব্দ" : "words"}</span>
                <span class="draftstatus ${draft.updatedAt ? "saved" : ""}">${draft.updatedAt ? `${icon("check", 12)} ${esc(t("saved"))} ${timeAgo(draft.updatedAt)}` : ""}</span>
              </div>
            </div>
            <details style="margin-top:10px">
              <summary class="row" style="cursor:pointer;font-size:12px;font-weight:650;color:var(--blue);list-style:none">${icon("sparkles", 14)} ${esc(t("showAnswer"))}</summary>
              <div class="cq-answer" style="margin-top:10px">
                <div class="row" style="gap:6px;margin-bottom:6px"><span class="tag green">${DEVICE.lang === "bn" ? "মডেল উত্তর" : "Model answer"}</span><span class="tiny faint">${DEVICE.lang === "bn" ? "রেফারেন্স উপকরণ" : "reference material"}</span></div>
                ${esc(p.answer)}
                <div class="divider" style="margin:10px 0"></div>
                <div class="tiny" style="color:var(--muted)"><b>${DEVICE.lang === "bn" ? "মার্কিং রুব্রিক" : "Marking rubric"}:</b> ${esc(p.rubric)}</div>
              </div>
            </details>
            <div class="rubric" style="margin-top:12px">
              <div class="row" style="gap:10px">
                <span class="tiny" style="flex:1;color:var(--muted)">${esc(t("selfAssess"))} — ${esc(p.label)}</span>
                <input class="range" type="range" min="0" max="${enPart.marks}" step="1" value="${marks === "" ? 0 : marks}" data-cq-assess="${i}" data-cq="${c.id}" aria-label="${esc(t("selfAssess"))} ${esc(p.label)}">
                <span class="tiny num" style="width:38px;text-align:right">${marks === "" ? "–" : marks} / ${enPart.marks}</span>
              </div>
            </div>
          </div>`;
        }).join("")}
      </div>

      <div class="card card-pad row" style="gap:18px;flex-wrap:wrap">
        <div class="ring" style="--p:${totalMarks ? obtained / totalMarks * 100 : 0};--size:70px"><span style="font-size:12px">${obtained}/${totalMarks}</span></div>
        <div style="flex:1;min-width:190px">
          <b style="font-size:13px">${esc(t("marksObtained"))}</b>
          <p class="small muted" style="margin-top:2px">${DEVICE.lang === "bn" ? "নিজের উত্তর রুব্রিক দিয়ে মূল্যায়ন করুন। এটি স্বয়ংক্রিয় গ্রেডিং নয়।" : "Self-assessment against the rubric is stored with this draft. Free-text answers are never auto-graded."}</p>
          <div class="row" style="gap:8px;margin-top:9px;flex-wrap:wrap">
            <span class="draftstatus ${writtenCount ? "saved" : ""}">${icon("edit", 12)} ${writtenCount}/4 ${DEVICE.lang === "bn" ? "অংশ লেখা হয়েছে" : "parts written"}</span>
            <button class="btn btn-sm btn-ghost" data-action="clear-cq" data-cq="${c.id}">${DEVICE.lang === "bn" ? "খসড়া মুছুন" : "Clear draft"}</button>
          </div>
        </div>
        <div class="row" style="gap:8px">
          <a class="btn btn-ghost btn-sm" href="#/cq">${esc(t("back"))}</a>
          <a class="btn btn-primary btn-sm" href="#/practice/${c.chapterId}">${icon("practice", 14)} ${esc(t("practice"))}</a>
        </div>
      </div>
    </div>`
  };
}
