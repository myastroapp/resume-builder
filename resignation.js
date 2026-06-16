import { isPro, tryUnlock } from "./pro.js";

const BUY_URL = "https://buy.stripe.com/9B6cN73EJcga3ff8YRbwk0c";
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const DEFAULT_BODY =
`Please accept this letter as formal notice of my resignation from my position as [Role] at [Company]. My last day will be [last day — typically two weeks from today].

Thank you for the opportunity to be part of the team. I've genuinely valued my time here and what I've learned, and I'll do everything I can to ensure a smooth handover before I leave.

Please let me know how I can help with the transition. I wish [Company] continued success.`;

function render() {
  $("p-name").textContent = $("name").value || "Your Name";
  $("p-contact").textContent = [$("email").value, $("phone").value, $("location").value].filter(Boolean).join("  ·  ");

  let d;
  try { d = $("date").value ? new Date($("date").value + "T00:00:00") : new Date(); } catch (e) { d = new Date(); }
  $("p-date").textContent = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const rec = $("recipient").value.trim();
  const recip = [];
  if (rec) recip.push(rec);
  if ($("company").value.trim()) recip.push($("company").value.trim());
  if ($("companyAddr").value.trim()) recip.push($("companyAddr").value.trim());
  $("p-recipient").textContent = recip.join("\n");

  $("p-greeting").textContent = "Dear " + (rec || "Hiring Manager") + ",";

  let body = $("body").value
    .replace(/\[Role\]/g, $("role").value || "this")
    .replace(/\[Company\]/g, $("company").value || "your company");
  const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  $("p-body").innerHTML = paras.map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");

  $("p-sign").textContent = $("name").value || "Your Name";
  $("p-credit").style.display = isPro() ? "none" : "block";
}

const openUnlock = () => ($("unlock").hidden = false);
const closeUnlock = () => ($("unlock").hidden = true);

function wire() {
  $("body").value = DEFAULT_BODY;
  try { $("date").value = new Date().toISOString().slice(0, 10); } catch (e) { /* ignore */ }
  document.querySelectorAll(".form input, .form textarea").forEach((i) => i.addEventListener("input", render));
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
