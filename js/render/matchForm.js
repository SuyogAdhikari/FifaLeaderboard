import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

/** Populate the two player selects with the active roster, preserving the current selection where possible. */
export function renderMatchFormSelects(activeRoster) {
  [els.selA, els.selB].forEach((sel, idx) => {
    const prevVal = sel.value;
    sel.innerHTML = activeRoster.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("");
    if (activeRoster.includes(prevVal)) sel.value = prevVal;
    else sel.selectedIndex = Math.min(idx, activeRoster.length - 1);
  });
}

export function showFormError(message) {
  els.formError.textContent = message;
  els.formError.style.display = message ? "block" : "none";
}

export function setSavingText(text) {
  els.savingText.textContent = text;
}
