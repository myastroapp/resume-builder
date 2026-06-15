import { isPro, tryUnlock } from "./pro.js";

const BUY_URL = "https://buy.stripe.com/9B6cN73EJcga3ff8YRbwk0c";
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escA = (s) => String(s).replace(/"/g, "&quot;");

function addExp(role = "", company = "", dates = "", desc = "") {
  const el = document.createElement("div");
  el.className = "entry";
  el.innerHTML =
    `<button class="rm" type="button">remove</button>` +
    `<input class="e-role" placeholder="Role / title" value="${escA(role)}">` +
    `<input class="e-company" placeholder="Company" value="${escA(company)}">` +
    `<input class="e-dates" placeholder="Dates (e.g. 2022–Present)" value="${escA(dates)}">` +
    `<textarea class="e-desc" rows="2" placeholder="What you did (one line per bullet)">${esc(desc)}</textarea>`;
  el.querySelector(".rm").addEventListener("click", () => { el.remove(); render(); });
  el.querySelectorAll("input,textarea").forEach((i) => i.addEventListener("input", render));
  $("exp").appendChild(el);
}

function addEdu(degree = "", school = "", dates = "") {
  const el = document.createElement("div");
  el.className = "entry";
  el.innerHTML =
    `<button class="rm" type="button">remove</button>` +
    `<input class="d-degree" placeholder="Degree" value="${escA(degree)}">` +
    `<input class="d-school" placeholder="School" value="${escA(school)}">` +
    `<input class="d-dates" placeholder="Dates" value="${escA(dates)}">`;
  el.querySelector(".rm").addEventListener("click", () => { el.remove(); render(); });
  el.querySelectorAll("input").forEach((i) => i.addEventListener("input", render));
  $("edu").appendChild(el);
}

function render() {
  $("p-name").textContent = $("name").value || "Your Name";
  $("p-role").textContent = $("role").value;
  $("p-contact").textContent = [$("email").value, $("phone").value, $("location").value, $("links").value].filter(Boolean).join("  ·  ");
  const sum = $("summary").value.trim();
  $("p-summary").textContent = sum;
  $("sec-summary").style.display = sum ? "block" : "none";

  let expHtml = "";
  for (const e of $("exp").querySelectorAll(".entry")) {
    const role = e.querySelector(".e-role").value, co = e.querySelector(".e-company").value;
    const dt = e.querySelector(".e-dates").value, desc = e.querySelector(".e-desc").value;
    if (!role && !co && !desc) continue;
    const bullets = desc.trim() ? `<div class="desc">${desc.split(/\n/).filter(Boolean).map((l) => "• " + esc(l)).join("<br>")}</div>` : "";
    expHtml += `<div class="r-item"><div class="h"><span>${esc(role)}${co ? ", " + esc(co) : ""}</span><span>${esc(dt)}</span></div>${bullets}</div>`;
  }
  $("p-exp").innerHTML = expHtml;
  $("sec-exp").style.display = expHtml ? "block" : "none";

  let eduHtml = "";
  for (const e of $("edu").querySelectorAll(".entry")) {
    const deg = e.querySelector(".d-degree").value, sch = e.querySelector(".d-school").value, dt = e.querySelector(".d-dates").value;
    if (!deg && !sch) continue;
    eduHtml += `<div class="r-item"><div class="h"><span>${esc(deg)}${sch ? ", " + esc(sch) : ""}</span><span>${esc(dt)}</span></div></div>`;
  }
  $("p-edu").innerHTML = eduHtml;
  $("sec-edu").style.display = eduHtml ? "block" : "none";

  const skills = $("skills").value.split(",").map((s) => s.trim()).filter(Boolean);
  $("p-skills").innerHTML = skills.map((s) => `<span>${esc(s)}</span>`).join("");
  $("sec-skills").style.display = skills.length ? "block" : "none";

  $("p-credit").style.display = isPro() ? "none" : "block";
}

const openUnlock = () => ($("unlock").hidden = false);
const closeUnlock = () => ($("unlock").hidden = true);

function wire() {
  addExp("Senior Engineer", "Acme Inc.", "2022–Present", "Led a team of 5 engineers\nShipped the flagship product to 1M+ users");
  addEdu("B.S. Computer Science", "State University", "2014–2018");
  document.querySelectorAll(".form input, .form textarea").forEach((i) => i.addEventListener("input", render));
  $("add-exp").addEventListener("click", () => { addExp(); render(); });
  $("add-edu").addEventListener("click", () => { addEdu(); render(); });
  $("btn-print").addEventListener("click", () => window.print());
  $("p-credit").addEventListener("click", openUnlock);
  $("p-credit").style.cursor = "pointer";
  $("p-credit").title = "Remove this footer (Pro)";
  $("buy").href = BUY_URL;
  $("btn-code").addEventListener("click", () => {
    if (tryUnlock($("code").value)) { closeUnlock(); render(); }
    else { $("code").value = ""; $("code").placeholder = "Invalid code — check your receipt"; }
  });
  $("unlock-close").addEventListener("click", closeUnlock);
  $("unlock").addEventListener("click", (e) => { if (e.target.id === "unlock") closeUnlock(); });
  render();
}
wire();
