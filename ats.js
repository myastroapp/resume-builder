// ATS keyword checker: compare a resume against a job description. Pure core exported for tests; DOM wiring guarded.
const $ = (id) => (typeof document !== "undefined" ? document.getElementById(id) : null);

const STOPWORDS = new Set(("a an the and or but if then else for to of in on at by with from as is are was were be been being " +
  "this that these those it its we you your our their they them he she his her i me my will would can could should may might must " +
  "do does did done have has had having not no yes so than too very just about into over under out up down off above below " +
  "who whom which what when where why how all any both each few more most other some such only own same s t " +
  "you re ve ll d m o re " +
  "work working works experience experienced years year role roles position positions company companies team teams " +
  "ability able strong excellent good great new including include includes etc per via within across using used use " +
  "requirements required require preferred plus must-have responsibilities responsibility skills skill candidate candidates " +
  "job description looking join help support provide ensure across well also like").split(/\s+/));

export function tokenize(text) {
  return String(text).toLowerCase().split(/[^a-z0-9+#.]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter((t) => t.length >= 2 && !/^\d+$/.test(t) && !STOPWORDS.has(t));
}

export function analyzeAts(resume, jd, limit = 30) {
  const resumeSet = new Set(tokenize(resume));
  const counts = new Map();
  for (const t of tokenize(jd)) counts.set(t, (counts.get(t) || 0) + 1);
  const keywords = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count, inResume: resumeSet.has(word) }));
  const matched = keywords.filter((k) => k.inResume).map((k) => k.word);
  const missing = keywords.filter((k) => !k.inResume).map((k) => k.word);
  const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
  return { score, matched, missing, keywords };
}

if (typeof document !== "undefined") {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const run = () => {
    const resume = $("resume").value, jd = $("jd").value;
    if (!resume.trim() || !jd.trim()) { $("result").hidden = true; return; }
    const r = analyzeAts(resume, jd);
    $("result").hidden = false;
    $("score").textContent = r.score + "%";
    $("score").style.color = r.score >= 75 ? "var(--good)" : r.score >= 50 ? "#b8860b" : "var(--bad)";
    $("matched").innerHTML = r.matched.length ? r.matched.map((w) => `<span class="kw good">${esc(w)}</span>`).join("") : '<span class="muted">none yet</span>';
    $("missing").innerHTML = r.missing.length ? r.missing.map((w) => `<span class="kw bad">${esc(w)}</span>`).join("") : '<span class="muted">none — great match!</span>';
  };
  $("resume").addEventListener("input", run);
  $("jd").addEventListener("input", run);
  run();
}
