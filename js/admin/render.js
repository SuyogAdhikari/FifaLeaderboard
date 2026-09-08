import { els } from "./dom.js";
import { renderPlayers } from "../render/players.js";
import { SEASON_TARGET } from "../config.js";
import { resolveSeasonTarget } from "../logic/standings.js";

export function renderAdmin(state, playerHandlers) {
  const activeSeason = state.seasons.find((s) => s.name === state.activeSeasonName);

  if (!activeSeason) {
    els.adminSeasonSub.textContent = "No active season found.";
  } else {
    els.adminSeasonSub.textContent = `${activeSeason.name} · active`;
    // Don't clobber the value while the person is actively typing in it.
    if (document.activeElement !== els.targetGamesInput) {
      els.targetGamesInput.value = resolveSeasonTarget(activeSeason, SEASON_TARGET);
    }
  }

  renderPlayers(state, els, {
    onRename: playerHandlers.onRenamePlayer,
    onRemove: playerHandlers.onRemovePlayer,
  });
}

export function showTargetError(message) {
  els.targetError.textContent = message;
  els.targetError.style.display = message ? "block" : "none";
}

export function showNewSeasonError(message) {
  els.newSeasonError.textContent = message;
  els.newSeasonError.style.display = message ? "block" : "none";
}

export function showConfigWarning(html) {
  els.adminConfigWarning.innerHTML = html;
  els.adminConfigWarning.style.display = "block";
}

export function hideConfigWarning() {
  els.adminConfigWarning.style.display = "none";
}
