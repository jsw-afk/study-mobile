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
  let answered = false;
  let isNotesQuiz = false;
  let results = {};   // 위치별 채점 결과(정답 여부). 이전/다음 자유 이동해도 점수 중복집계 방지
  const scoreCount = () => Object.values(results).filter(Boolean).length;

  // ---- 유틸 ----
  const $ = (id) => document.getElementById(id);
  const screens = ["home", "sections", "quiz", "result", "notes"];
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
      // 전체는 바로 퀴즈, 특정 과목은 단원 선택 화면으로
      b.onclick = () => (s === "전체" ? startQuiz(null) : showSections(s));
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

  // ---- 단원(섹션) 선택 ----
  function sectionOf(q) { return (q.no || "").split("-")[0] || "?"; }

  function showSections(subject) {
    const qs = ALL.filter((q) => q.subject === subject);
    const secs = {}, secOrder = [];
    qs.forEach((q) => {
      const s = sectionOf(q);
      if (!secs[s]) { secs[s] = { title: q.sectitle || "", count: 0 }; secOrder.push(s); }
      secs[s].count++;
      if (!secs[s].title && q.sectitle) secs[s].title = q.sectitle;
    });
    secOrder.sort((a, b) => (parseInt(a, 10) || 9999) - (parseInt(b, 10) || 9999));

    $("secTitle").textContent = subject + " · 단원 선택";
    const menu = $("sectionMenu");
    menu.innerHTML = "";

    // 맨 위: 과목 전체
    const allBtn = document.createElement("button");
    allBtn.innerHTML = `<span><span class="dot ${subjClass(subject)}"></span>${subject} 전체</span><span class="cnt">${qs.length}문항</span>`;
    allBtn.onclick = () => startQuiz(subject);
    menu.appendChild(allBtn);

    secOrder.forEach((s) => {
      const info = secs[s];
      const b = document.createElement("button");
      b.innerHTML = `<span>${s}. ${esc(info.title || "단원 " + s)}</span><span class="cnt">${info.count}문항</span>`;
      b.onclick = () => startSectionQuiz(subject, s);
      menu.appendChild(b);
    });
    show("sections");
  }

  function startSectionQuiz(subject, section) {
    pool = ALL.filter((q) => q.subject === subject && sectionOf(q) === section);
    if (!pool.length) { alert("해당 단원에 문제가 없습니다."); return; }
    isNotesQuiz = false;
    beginPool();
  }
  function selectedOrder() {
    const el = document.querySelector('input[name="order"]:checked');
    return el ? el.value : "seq";
  }
  function subjRank(s) { return s === "C언어" ? 0 : s === "Java" ? 1 : s === "Python" ? 2 : 3; }
  function noKey(q) {
    const m = /(\d+)\D+(\d+)/.exec(q.no || "");
    return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] : [9999, 9999];
  }
  function beginPool() {
    const idx = pool.map((_, i) => i);
    if (selectedOrder() === "rand") {
      shuffle(idx);
    } else {
      // 순서대로: 과목(C→Java→Python) → 번호(섹션-문항) 순
      idx.sort((a, b) => {
        const r = subjRank(pool[a].subject) - subjRank(pool[b].subject);
        if (r) return r;
        const ka = noKey(pool[a]), kb = noKey(pool[b]);
        return ka[0] - kb[0] || ka[1] - kb[1];
      });
    }
    order = idx;
    cur = 0; results = {};
    show("quiz");
    render();
  }

  // ---- 문제 표시 ----
  function render() {
    const q = pool[order[cur]];
    answered = false;
    $("progress").textContent = `문제 ${cur + 1} / ${order.length}`;
    $("score").textContent = "";   // 맞힌 개수 카운트는 표시하지 않음

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

    // 코드 실행 패널 초기화 (코드가 있을 때만 노출)
    const hasCode = !!q.code;
    $("runToggle").hidden = !hasCode;
    $("runPanel").hidden = true;
    $("runToggle").textContent = "▶ 코드 실행";
    if (hasCode) {
      $("editor").value = q.code;
      $("runLang").textContent = "언어: " + (q.subject || "");
      $("runOut").textContent = "";
      $("runOut").className = "run-out";
    }

    const ans = $("answer");
    ans.value = ""; ans.disabled = false;
    $("submitBtn").disabled = false;
    $("feedback").innerHTML = "";
    $("noteToggleWrap").hidden = true;
    // 이전/다음은 항상 보이며 채점과 무관하게 이동 가능
    $("prevBtn").disabled = (cur === 0);
    $("nextBtn").textContent = (cur === order.length - 1) ? "결과 ▶" : "다음 ▶";
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
    results[cur] = ok;   // 푼 문제 표시용(개수 카운트는 안 함)

    const fb = $("feedback");
    // 정답은 줄바꿈을 보존해 실제 출력 형태 그대로 표시(pre)
    const ansHtml = (q.answers && q.answers.length)
      ? q.answers.map((a) => `<pre class="ans-pre">${esc(a)}</pre>`).join('<div class="ans-or">또는</div>')
      : '<span>(정답 정보 없음)</span>';
    let html = ok
      ? `<div class="ok">✅ 정답!</div>`
      : `<div class="no">❌ 오답</div><div class="ans-label">정답</div>${ansHtml}`;
    // 맞히든 틀리든 해설은 항상 보여준다
    if (q.solution) html += `<div class="sol"><div class="sol-label">📘 해설</div>${esc(q.solution)}</div>`;
    fb.innerHTML = html;

    // 오답 시 자동으로 오답노트에 저장(체크 해제로 취소 가능)
    const wrap = $("noteToggleWrap");
    const toggle = $("noteToggle");
    wrap.hidden = false;
    // 틀려도 자동 추가하지 않는다. 이미 담긴 문제면 체크 표시, 아니면 해제(기본).
    toggle.checked = noteIndex(loadNotes(), q) >= 0;
    toggle.onchange = () => {
      if (toggle.checked) addNote(q, input);
      else removeNote(q);
    };
  }

  function next() {
    if (cur + 1 < order.length) { cur++; render(); }
    else finish();
  }

  function finish() {
    const total = order.length;
    const done = Object.keys(results).length;   // 실제로 푼(넘긴) 문제 수
    $("resultText").innerHTML =
      `<div style="font-size:24px;font-weight:700;color:#1a73e8">풀이 완료 🎉</div>` +
      `<div style="margin-top:10px">전체 ${total}문제 중 ${done}문제를 풀었어요</div>` +
      `<div style="margin-top:12px;font-size:14px;color:#5f6368">틀린 문제는 📕 체크해서 오답노트에 담을 수 있어요</div>`;
    show("result");
  }

  function prev() {
    if (cur > 0) { cur--; render(); }
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
  $("prevBtn").onclick = prev;
  $("notesBtn").onclick = () => { renderNotes(); };
  $("retryNotesBtn").onclick = startNotesQuiz;

  // ---- 코드 실행 (Wandbox 공개 API, 브라우저에서 직접 호출 · 인터넷 필요) ----
  const WANDBOX = "https://wandbox.org/api/compile.json";
  const COMPILER = { "C언어": "gcc-13.2.0-c", "Java": "openjdk-jdk-21+35", "Python": "cpython-3.14.0" };

  function wrapForRun(subject, code) {
    if (subject === "C언어") {
      if (!/\bmain\s*\(/.test(code))
        return "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\nint main(void){\n" + code + "\nreturn 0;\n}\n";
      return code;
    }
    if (subject === "Java") {
      // Wandbox 는 소스 파일명이 prog.java 라 'public class' 면 오류 → public 제거
      let c = code.replace(/\bpublic\s+class\b/g, "class");
      if (!/\bclass\b/.test(c))
        c = "class Main{ public static void main(String[] a){\n" + code + "\n} }";
      return c;
    }
    return code; // Python 은 그대로
  }

  async function runCode() {
    const q = pool[order[cur]];
    const compiler = COMPILER[q.subject] || "cpython-3.14.0";
    const code = wrapForRun(q.subject, $("editor").value);
    const out = $("runOut");
    out.className = "run-out";
    out.textContent = "실행 중... (몇 초 걸릴 수 있어요)";
    $("runBtn").disabled = true;
    try {
      const res = await fetch(WANDBOX, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code, compiler: compiler, stdin: "" })
      });
      const d = await res.json();
      const cerr = d.compiler_error || "";
      const runOut = (d.program_output || "") + (d.program_error || "");
      if (String(d.status) !== "0" && cerr) {
        out.className = "run-out err";
        out.textContent = "[컴파일 오류]\n" + cerr;
      } else {
        out.textContent = runOut || "(출력 없음)";
      }
    } catch (e) {
      out.className = "run-out err";
      out.textContent = "실행 실패 — 인터넷 연결이 필요합니다.\n" + e;
    } finally {
      $("runBtn").disabled = false;
    }
  }

  $("runToggle").onclick = () => {
    const p = $("runPanel");
    p.hidden = !p.hidden;
    $("runToggle").textContent = p.hidden ? "▶ 코드 실행" : "▼ 코드 실행 닫기";
  };
  $("runBtn").onclick = runCode;

  // ---- 시작 ----
  buildHome();
  show("home");
})();
