import { els } from "./ui/dom.js";
import { isApiConfigured } from "./config.js";
import { state } from "./state/store.js";
import { showFormError } from "./render/matchForm.js";
import {
  fetchData,
  submitMatch,
  selectSeason,
  selectLogFilter,
  toggleMatchLog,
  toggleOutlook,
  selectH2HPlayerA,
  selectH2HPlayerB,
  toggleH2HExpanded,
} from "./actions.js";

export function bindEvents() {
  els.addMatchBtn.addEventListener("click", () => {
    showFormError("");
    const playerA = els.selA.value;
    const playerB = els.selB.value;
    const scoreA = els.scoreA.value;
    const scoreB = els.scoreB.value;

    if (!isApiConfigured()) {
      showFormError("Connect your Google Sheet first — see the notice above.");
      return;
    }
    if (!state.activeSeasonName) {
      showFormError("No active season found.");
      return;
    }
    if (!playerA || !playerB || playerA === playerB) {
      showFormError("Pick two different players.");
      return;
    }
    if (scoreA === "" || scoreB === "") {
      showFormError("Enter both scores.");
      return;
    }
    const sa = parseInt(scoreA, 10);
    const sb = parseInt(scoreB, 10);
    if (isNaN(sa) || isNaN(sb) || sa < 0 || sb < 0) {
      showFormError("Scores must be valid numbers.");
      return;
    }

    submitMatch(playerA, playerB, sa, sb);
    els.scoreA.value = "";
    els.scoreB.value = "";
  });

  els.seasonSelect.addEventListener("change", (e) => selectSeason(e.target.value));
  els.logFilterSelect.addEventListener("change", (e) => selectLogFilter(e.target.value));
  els.logToggleBtn.addEventListener("click", toggleMatchLog);
  els.outlookToggleBtn.addEventListener("click", toggleOutlook);
  els.h2hSelA.addEventListener("change", (e) => selectH2HPlayerA(e.target.value));
  els.h2hSelB.addEventListener("change", (e) => selectH2HPlayerB(e.target.value));
  els.h2hToggleBtn.addEventListener("click", toggleH2HExpanded);
  els.refreshBtn.addEventListener("click", fetchData);
}
