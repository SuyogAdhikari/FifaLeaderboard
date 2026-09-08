import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

/**
 * Populate the two player selects with the active roster, excluding anyone
 * who has already played the season's target number of games — they can't
 * be selected for a new match once they've hit that cap (also enforced
 * server-side in backend/Matches.gs, since this dropdown filter alone
 * can't stop a direct POST to the unauthenticated Web App).
 */
export function renderMatchFormSelects(activeRoster, standings, seasonTarget) {
  const playedByName = {};
  standings.forEach((s) => {
    playedByName[s.name] = s.played;
  });

  const eligible = activeRoster.filter((p) => (playedByName[p] || 0) < seasonTarget);
  const maxedOut = activeRoster.filter((p) => (playedByName[p] || 0) >= seasonTarget);

  [els.selA, els.selB].forEach((sel, idx) => {
    const prevVal = sel.value;
    sel.innerHTML = eligible.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("");
    if (eligible.includes(prevVal)) sel.value = prevVal;
    else sel.selectedIndex = Math.min(idx, eligible.length - 1);
  });

  if (maxedOut.length > 0) {
    els.formMaxedNote.textContent =
      maxedOut.map(escapeHtml).join(", ") + " reached this season's game limit and can't be selected.";
    els.formMaxedNote.style.display = "block";
  } else {
    els.formMaxedNote.style.display = "none";
  }

  els.addMatchBtn.disabled = eligible.length < 2;
}

export function showFormError(message) {
  els.formError.textContent = message;
  els.formError.style.display = message ? "block" : "none";
}

export function setSavingText(text) {
  els.savingText.textContent = text;
}
