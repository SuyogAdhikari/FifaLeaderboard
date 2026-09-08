import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"]; // gold, silver, bronze

export function renderPositionRace(clinchStatus) {
  if (clinchStatus.length === 0) {
    els.positionRaceList.innerHTML = `<p class="empty-text">No standings yet.</p>`;
    return;
  }

  els.positionRaceList.innerHTML = clinchStatus
    .map((s, i) => {
      const rank = i + 1;

      if (s.locked) {
        const medal = MEDALS[i];
        return `
          <div class="race-row">
            <span class="race-rank">#${rank}</span>
            <span class="race-name">${escapeHtml(s.name)}</span>
            <span class="race-medal">${medal ? medal : "&#128274; Locked"}</span>
          </div>`;
      }

      if (i === 0) {
        return `
          <div class="race-row">
            <span class="race-rank">#${rank}</span>
            <span class="race-name">${escapeHtml(s.name)}</span>
            <span class="race-note">Leading</span>
          </div>`;
      }

      return `
        <div class="race-row">
          <span class="race-rank">#${rank}</span>
          <span class="race-name">${escapeHtml(s.name)}</span>
          <span class="race-need">${
            s.pointsToMoveUp === 0
              ? "Tied on points"
              : s.pointsToMoveUp + " pt" + (s.pointsToMoveUp === 1 ? "" : "s") + " in " + s.gamesLeft + " game" + (s.gamesLeft === 1 ? "" : "s")
          }</span>
        </div>`;
    })
    .join("");
}