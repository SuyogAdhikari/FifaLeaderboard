import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

const FORM_COLOR = { W: "var(--teal)", L: "var(--red)", D: "var(--gold)" };

export function renderPerformance(standings, seasonTarget) {
  if (standings.length === 0) {
    els.perfGrid.innerHTML = `<p class="empty-text">No matches yet this season.</p>`;
    return;
  }

  els.perfGrid.innerHTML = standings
    .map((s) => {
      const winPct = s.played > 0 ? Math.round((s.wins / s.played) * 100) : 0;
      const chips = s.form
        .slice(-5)
        .map((f) => `<span class="perf-chip" style="background:${FORM_COLOR[f]}">${f}</span>`)
        .join("");
      const progressPct = Math.min(100, (s.played / seasonTarget) * 100);
      const progressDone = s.played >= seasonTarget;
      return `
        <div class="perf-card">
          <div class="perf-name">${escapeHtml(s.name)}</div>
          <div class="perf-winrate-label">Win rate</div>
          <div class="perf-winrate">${winPct}%</div>
          <div class="perf-line">${s.wins}W · ${s.draws}D · ${s.losses}L</div>
          <div class="perf-line">${s.gf} scored · ${s.ga} conceded</div>
          <div class="perf-form">${chips}</div>
          <div class="perf-progress">
            <div class="perf-progress-track"><div class="perf-progress-fill${
              progressDone ? " done" : ""
            }" style="width:${progressPct}%"></div></div>
            <div class="perf-progress-count">${s.played} / ${seasonTarget} games</div>
          </div>
        </div>`;
    })
    .join("");
}