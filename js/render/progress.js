import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";
import { SEASON_TARGET } from "../config.js";

export function renderProgress(standings) {
  els.progressList.innerHTML =
    standings
      .map((s) => {
        const pct = Math.min(100, (s.played / SEASON_TARGET) * 100);
        const done = s.played >= SEASON_TARGET;
        return `
          <div class="progress-row">
            <div class="progress-name">${escapeHtml(s.name)}</div>
            <div class="progress-track"><div class="progress-fill${done ? " done" : ""}" style="width:${pct}%"></div></div>
            <div class="progress-count">${s.played} / ${SEASON_TARGET}</div>
          </div>`;
      })
      .join("") || `<p class="empty-text">No matches yet this season.</p>`;
}
