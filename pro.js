// Pro unlock for the resume builder (removes the footer credit). Honor-system client-side (v1).
const PRO_CODE = "CV-PRO-8M4T-2J9P";
export function isPro() { try { return localStorage.getItem("cv_pro") === "1"; } catch { return false; } }
export function setPro() { try { localStorage.setItem("cv_pro", "1"); } catch { /* ignore */ } }
export function tryUnlock(code) {
  if ((code || "").trim().toUpperCase() === PRO_CODE) { setPro(); return true; }
  return false;
}
