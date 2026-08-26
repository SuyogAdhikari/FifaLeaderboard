import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

export function renderStatCards(seasonMatches, standings) {
  if (seasonMatches.length === 0) {
    els.statGrid.innerHTML = "";
    return;
  }

  const leader = standings[0];
  const topScorer = [...standings].sort((a, b) => b.gf - a.gf)[0];
  const bestWinRate = [...standings]
    .filter((s) => s.played > 0)
    .sort((a, b) => b.wins / b.played - a.wins / a.played)[0];

  els.statGrid.innerHTML = `
    <div class="card"><div class="card-label">&#127942; Top of table</div>
      <div class="card-value">${escapeHtml(leader.name)}</div><div class="card-sub">${leader.points} pts</div></div>
    <div class="card"><div class="card-label">&#128293; Best win rate</div>
      <div class="card-value">${bestWinRate ? escapeHtml(bestWinRate.name) : "—"}</div>
      <div class="card-sub">${bestWinRate ? Math.round((bestWinRate.wins / bestWinRate.played) * 100) : 0}%</div></div>
    <div class="card"><div class="card-label">&#9917; Top scorer</div>
      <div class="card-value">${escapeHtml(topScorer.name)}</div><div class="card-sub">${topScorer.gf} goals</div></div>
    <div class="card"><div class="card-label">&#128197; Matches</div>
      <div class="card-value">${seasonMatches.length}</div><div class="card-sub">this season</div></div>
  `;
}
