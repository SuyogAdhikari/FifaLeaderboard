import { els } from "./dom.js";
import { showTargetError, showNewSeasonError } from "./render.js";
import { showPlayerError } from "../render/players.js";
import { saveTarget, startNewSeason, addPlayer } from "./api-actions.js";

export function bindEvents() {
  els.saveTargetBtn.addEventListener("click", () => {
    const value = parseInt(els.targetGamesInput.value, 10);
    if (isNaN(value) || value <= 0) {
      showTargetError("Enter a valid number of games.");
      return;
    }
    saveTarget(value);
  });

  els.startNewSeasonBtn.addEventListener("click", () => {
    const name = els.newSeasonName.value.trim();
    const targetValue = parseInt(els.newSeasonTarget.value, 10);
    if (isNaN(targetValue) || targetValue <= 0) {
      showNewSeasonError("Enter a valid number of games for the new season.");
      return;
    }
    if (!confirm("Archive the current season and start a new one? This can't be undone from here.")) return;
    startNewSeason(name, targetValue);
    els.newSeasonName.value = "";
    els.newSeasonTarget.value = "";
  });

  els.addPlayerBtn.addEventListener("click", () => {
    const name = els.newPlayerName.value.trim();
    if (!name) {
      showPlayerError(els, "Enter a name first.");
      return;
    }
    addPlayer(name);
    els.newPlayerName.value = "";
  });
}