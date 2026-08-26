import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";
import { SEASON_TARGET } from "../config.js";

export function renderProjection(projections) {
  els.projTargetLabel.textContent = SEASON_TARGET;

  if (projections.length === 0) {
    els.projectionList.innerHTML = `<p class="empty-text">No matches yet this season.</p>`;
    return;
  }

  const maxProjected = Math.max(1, ...projections.map((p) => p.projectedPoints));

  els.projectionList.innerHTML = projections
    .map((p) => {
      const currentPct = Math.min(100, (p.points / maxProjected) * 100);
      const projectedPct = Math.min(100, (p.projectedPoints / maxProjected) * 100);
      return `
        <div class="proj-row">
          <div class="proj-name">${escapeHtml(p.name)}</div>
          <div class="proj-track">
            <div class="proj-fill-projected" style="width:${projectedPct}%"></div>
            <div class="proj-fill-current" style="width:${currentPct}%"></div>
          </div>
          <div class="proj-value">${p.points} → <strong>~${p.projectedPoints}</strong> pts</div>
        </div>`;
    })
    .join("");
}
