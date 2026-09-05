import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

export function renderPositionRace(clinchStatus) {
  if (clinchStatus.length === 0) {
    els.positionRaceList.innerHTML = `<p class="empty-text">No standings yet.</p>`;
    return;
  }

  els.positionRaceList.innerHTML = clinchStatus
    .map((s, i) => {
      const rank = i + 1;

      if (s.clinched) {
        return `
          <div class="race-row">
            <span class="race-rank">#${rank}</span>
            <span class="race-name">${escapeHtml(s.name)}</span>
            <span class="race-tag race-tag-clinched">&#10003; Clinched</span>
          </div>`;
      }

      if (i === 0) {
        return `
          <div class="race-row">
            <span class="race-rank">#${rank}</span>
            <span class="race-name">${escapeHtml(s.name)}</span>
            <span class="race-note">Leading — not yet clinched</span>
          </div>`;
      }

      if (!s.canCatchUp) {
        return `
          <div class="race-row">
            <span class="race-rank">#${rank}</span>
            <span class="race-name">${escapeHtml(s.name)}</span>
            <span class="race-tag race-tag-out">Can't catch #${rank - 1} this season</span>
          </div>`;
      }

      const difficultyPct = s.gamesLeft > 0 ? Math.min(100, (s.pointsToMoveUp / (s.gamesLeft * 3)) * 100) : 100;

      return `
        <div class="race-row">
          <span class="race-rank">#${rank}</span>
          <span class="race-name">${escapeHtml(s.name)}</span>
          <div class="race-track"><div class="race-fill" style="width:${difficultyPct}%"></div></div>
          <span class="race-need">${
            s.pointsToMoveUp === 0
              ? "Tied on points"
              : s.pointsToMoveUp + " pt" + (s.pointsToMoveUp === 1 ? "" : "s") + " in " + s.gamesLeft + " game" + (s.gamesLeft === 1 ? "" : "s")
          }</span>
        </div>`;
    })
    .join("");
}