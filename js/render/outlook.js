import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

/**
 * "Player Outlook" — a single collapsed-by-default section that replaces
 * what used to be three separate sections (Performance, Projected Finish,
 * Race for Position). All three were really answering one question per
 * player — "how's my season going" — so they're combined into one card
 * per player instead of three separate lists a reader had to cross-reference.
 */

const FORM_COLOR = { W: "var(--teal)", L: "var(--red)", D: "var(--gold)" };
const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"]; // gold, silver, bronze

function raceStatusMarkup(clinch, rank) {
  if (clinch.locked) {
    const medal = MEDALS[rank - 1];
    return `<span class="outlook-race-tag">${medal ? medal + " Locked in" : "&#128274; Locked in"}</span>`;
  }
  if (rank === 1) {
    return `<span class="outlook-race-tag outlook-race-leading">Leading</span>`;
  }
  const need =
    clinch.pointsToMoveUp === 0
      ? "Tied on points"
      : `${clinch.pointsToMoveUp} pt${clinch.pointsToMoveUp === 1 ? "" : "s"} in ${clinch.gamesLeft} game${
          clinch.gamesLeft === 1 ? "" : "s"
        } to move up`;
  return `<span class="outlook-race-tag">${need}</span>`;
}

/**
 * @param {object} state
 * @param {object[]} standings
 * @param {object[]} projections   from computeProjections — order is NOT guaranteed to match standings
 * @param {object[]} clinchStatus  from computeClinchStatus — order matches standings
 * @param {number} seasonTarget
 */
export function renderOutlook(state, standings, projections, clinchStatus, seasonTarget) {
  const count = standings.length;
  els.outlookToggleBtn.textContent = state.outlookExpanded
    ? "Hide player outlook \u25B2"
    : `Show player outlook (${count}) \u25BC`;
  els.outlookBody.style.display = state.outlookExpanded ? "block" : "none";

  if (!state.outlookExpanded) return;

  if (standings.length === 0) {
    els.outlookGrid.innerHTML = `<p class="empty-text">No matches yet this season.</p>`;
    return;
  }

  const projectionByName = {};
  projections.forEach((p) => (projectionByName[p.name] = p));

  els.outlookGrid.innerHTML = standings
    .map((s, i) => {
      const rank = i + 1;
      const winPct = s.played > 0 ? Math.round((s.wins / s.played) * 100) : 0;
      const chips = s.form
        .slice(-5)
        .map((f) => `<span class="perf-chip" style="background:${FORM_COLOR[f]}">${f}</span>`)
        .join("");
      const gamesPct = Math.min(100, (s.played / seasonTarget) * 100);
      const gamesDone = s.played >= seasonTarget;
      const projected = projectionByName[s.name];
      const clinch = clinchStatus[i];

      return `
        <div class="outlook-card">
          <div class="outlook-card-head">
            <span class="outlook-rank">#${rank}</span>
            <span class="perf-name">${escapeHtml(s.name)}</span>
          </div>

          <div class="perf-winrate-label">Win rate</div>
          <div class="perf-winrate">${winPct}%</div>
          <div class="perf-line">${s.wins}W · ${s.draws}D · ${s.losses}L</div>
          <div class="perf-line">${s.gf} scored · ${s.ga} conceded</div>
          <div class="perf-form">${chips}</div>

          <div class="perf-progress">
            <div class="perf-progress-track"><div class="perf-progress-fill${
              gamesDone ? " done" : ""
            }" style="width:${gamesPct}%"></div></div>
            <div class="perf-progress-count">${s.played} / ${seasonTarget} games</div>
          </div>

          <div class="outlook-footer">
            <span class="outlook-projected">Projected: <strong>~${projected ? projected.projectedPoints : s.points}</strong> pts</span>
            ${raceStatusMarkup(clinch, rank)}
          </div>
        </div>`;
    })
    .join("");
}
