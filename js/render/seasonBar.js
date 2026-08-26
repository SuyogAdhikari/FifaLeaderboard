import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

/**
 * @param {object} state
 * @param {boolean} isActiveSeason
 * @param {boolean} allReachedTarget
 */
export function renderSeasonBar(state, isActiveSeason, allReachedTarget) {
  const sortedSeasons = [...state.seasons].sort((a, b) => {
    if (a.status === "active") return -1;
    if (b.status === "active") return 1;
    return new Date(b.startedAt) - new Date(a.startedAt);
  });

  els.seasonSelect.innerHTML = sortedSeasons
    .map(
      (s) =>
        `<option value="${escapeHtml(s.name)}" ${s.name === state.selectedSeason ? "selected" : ""}>${escapeHtml(
          s.name
        )}${s.status === "active" ? " (active)" : ""}</option>`
    )
    .join("");

  const currentSeasonObj = state.seasons.find((s) => s.name === state.selectedSeason);
  if (currentSeasonObj) {
    els.seasonBadge.textContent = currentSeasonObj.status;
    els.seasonBadge.className = "season-badge " + currentSeasonObj.status;
    els.seasonBadge.style.display = "inline-block";
  } else {
    els.seasonBadge.style.display = "none";
  }

  els.archivedNote.style.display = isActiveSeason ? "none" : "block";
  els.recordSection.style.display = isActiveSeason ? "block" : "none";
  els.seasonCompleteBanner.style.display = isActiveSeason && allReachedTarget ? "flex" : "none";
}
