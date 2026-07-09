/* 정처기 실기 모바일 웹 — 코드 출력 문제풀이
   - 문제 은행: questions.js 의 window.QUESTIONS (study_questions.json 임베드)
   - 오답노트: 브라우저 localStorage 에 저장 (백엔드/DB 불필요)
*/
(function () {
  "use strict";

  const ALL = (window.QUESTIONS || []).slice();
  const NOTES_KEY = "jeongcheogi_notes_v1";

  // ---- 상태 ----
  let pool = [];        // 현재 퀴즈 문제들
  let order = [];       // 셔플된 인덱스
  let cur = 0;
  let correct = 0;
  let answered = false;
  let isNotesQuiz = false;

  // ---- 유틸 ----
  const $ = (id) => document.getElementById(id);
  const screens = ["home", "quiz", "result", "notes"];
  function show(name) {
    screens.forEach((s) => $(s).classList.toggle("active", s === name));
    window.scrollTo(0, 0);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function norm(s) {
    return String(s == null ? "" : s).trim().replace(/\s+/g, " ");
  }
  function subjClass(subject) {
    if (subject === "C언어") return "c";
    if (subject === "Java") return "java";
    if (subject === "Python") return "python";
    return "";
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---- 오답노트 (localStorage) ----
  function loadNotes() {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveNotes(n) { localStorage.setItem(NOTES_KEY, JSON.stringify(n)); }
  function keyOf(q) { return (q.subject || "") + "|" + (q.no || "") + "|" + (q.code || "").slice(0, 40); }
  function noteIndex(notes, q) { const k = keyOf(q); return notes.findIndex((n) => keyOf(n.q) === k); }
  function addNote(q, myAnswer) {
    const notes = loadNotes();
    const i = noteIndex(notes, q);
    if (i >= 0) { notes[i].wrongCount++; notes[i].myLastAnswer = myAnswer; }
    else notes.push({ q: q, wrongCount: 1, myLastAnswer: myAnswer });
    saveNotes(notes);
  }
  function removeNote(q) {
    const notes = loadNotes();
    const i = noteIndex(notes, q);
    if (i >= 0) { notes.splice(i, 1); saveNotes(notes); }
  }
  function updateNotesCount() { $("notesCount").textContent = loadNotes().length; }

  // ---- 홈 화면 ----
  function buildHome() {
    const subs = ["전체", "C언어", "Java", "Python"];
    const counts = {};
    ALL.forEach((q) => (counts[q.subject] = (counts[q.subject] || 0) + 1));
    const dotFor = (s) => s === "전체" ? "all" : subjClass(s);
    const menu = $("subjectMenu");
    menu.innerHTML = "";
    subs.forEach((s) => {
      const n = s === "전체" ? ALL.length : (counts[s] || 0);
      const b = document.createElement("button");
      b.innerHTML = `<span><span class="dot ${dotFor(s)}"></span>${s}</span><span class="cnt">${n}문항</span>`;
      b.onclick = () => startQuiz(s === "전체" ? null : s);
      menu.appendChild(b);
    });
    updateNotesCount();
  }

  // ---- 퀴즈 시작 ----
  function startQuiz(subject) {
    pool = subject ? ALL.filter((q) => q.subject === subject) : ALL.slice();
    if (!pool.length) { alert("해당 범위에 문제가 없습니다."); return; }
    isNotesQuiz = false;
    beginPool();
  }
  function startNotesQuiz() {
    const notes = loadNotes();
    if (!notes.length) { alert("오답노트가 비어 있습니다."); return; }
    pool = notes.map((n) => n.q);
    isNotesQuiz = true;
    beginPool();
  }
  function beginPool() {
    order = shuffle(pool.map((_, i) => i));
    cur = 0; correct = 0;
    show("quiz");
    render();
  }

  // ---- 문제 표시 ----
  function render() {
    const q = pool[order[cur]];
    answered = false;
    $("progress").textContent = `문제 ${cur + 1} / ${order.length}`;
    $("score").textContent = `맞힘 ${correct}`;

    let badge = q.subject + (q.no ? " " + q.no : "") + (q.topic ? " · " + q.topic : "");
    if (isNotesQuiz) badge = "오답 · " + badge;
    const bd = $("badge");
    bd.textContent = badge;
    bd.className = "badge " + subjClass(q.subject);

    $("qtext").textContent = q.text || "";
    $("qtext").style.display = q.text ? "" : "none";

    const codeEl = $("code");
    if (q.code) { codeEl.textContent = q.code; codeEl.style.display = ""; }
    else { codeEl.textContent = ""; codeEl.style.display = "none"; }

    const ans = $("answer");
    ans.value = ""; ans.disabled = false;
    $("submitBtn").disabled = false;
    $("feedback").innerHTML = "";
    $("noteToggleWrap").hidden = true;
    $("nextBtn").hidden = true;
    ans.focus();
  }

  // ---- 채점 ----
  function grade() {
    if (answered) return;
    const q = pool[order[cur]];
    const input = $("answer").value;
    const answers = (q.answers || []).map(norm);
    const ninput = norm(input);
    const okExact = answers.includes(ninput);
    const okCase = answers.map((a) => a.toLowerCase()).includes(ninput.toLowerCase());
    const ok = okExact || okCase;

    answered = true;
    $("answer").disabled = true;
    $("submitBtn").disabled = true;
    if (ok) correct++;
    $("score").textContent = `맞힘 ${correct}`;

    const fb = $("feedback");
    const shown = (q.answers && q.answers.length) ? q.answers.join("  또는  ") : "(정답 정보 없음)";
    let html = ok
      ? `<div class="ok">✅ 정답!</div>`
      : `<div class="no">❌ 오답</div><div>정답: <span class="correct-ans">${esc(shown)}</span></div>`;
    if (!ok && q.solution) html += `<div class="sol">${esc(q.solution)}</div>`;
    fb.innerHTML = html;

    // 오답 시 자동으로 오답노트에 저장(체크 해제로 취소 가능)
    const wrap = $("noteToggleWrap");
    const toggle = $("noteToggle");
    wrap.hidden = false;
    if (!ok) { addNote(q, input); toggle.checked = true; }
    else { toggle.checked = noteIndex(loadNotes(), q) >= 0; }
    toggle.onchange = () => {
      if (toggle.checked) addNote(q, input);
      else removeNote(q);
    };

    $("nextBtn").hidden = false;
  }

  function next() {
    if (cur + 1 < order.length) { cur++; render(); }
    else finish();
  }

  function finish() {
    const total = order.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    $("resultText").innerHTML =
      `${total}문제 중 <b>${correct}문제</b> 정답<br>정답률 <b>${pct}%</b>` +
      `<br><span style="font-size:14px;color:#5f6368">오답은 📕 오답노트에 저장되었습니다</span>`;
    show("result");
  }

  // ---- 오답노트 화면 ----
  function renderNotes() {
    const notes = loadNotes();
    const list = $("notesList");
    if (!notes.length) { list.innerHTML = `<p class="empty">오답노트가 비어 있습니다.</p>`; show("notes"); return; }
    list.innerHTML = "";
    notes.forEach((n) => {
      const q = n.q;
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML =
        `<div class="nc-top"><span>${esc(q.subject)} ${esc(q.no || "")} · 틀림 ${n.wrongCount}회</span>` +
        `<button class="rm">삭제</button></div>` +
        (q.code ? `<pre>${esc(q.code)}</pre>` : "") +
        `<div style="margin-top:8px;font-size:13px">정답: <b>${esc((q.answers || []).join(", "))}</b></div>`;
      card.querySelector(".rm").onclick = () => { removeNote(q); renderNotes(); updateNotesCount(); };
      list.appendChild(card);
    });
    show("notes");
  }

  // ---- 이벤트 연결 ----
  document.addEventListener("click", (e) => {
    const go = e.target.getAttribute && e.target.getAttribute("data-go");
    if (go === "home") { buildHome(); show("home"); }
    else if (go === "retry") { beginPool(); }
  });
  $("submitBtn").onclick = grade;
  $("answer").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); answered ? next() : grade(); }
  });
  $("nextBtn").onclick = next;
  $("notesBtn").onclick = () => { renderNotes(); };
  $("retryNotesBtn").onclick = startNotesQuiz;

  // ---- 시작 ----
  buildHome();
  show("home");
})();
