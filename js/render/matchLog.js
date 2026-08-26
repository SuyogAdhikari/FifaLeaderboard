import { els } from "../ui/dom.js";
import { escapeHtml, formatDate } from "../utils/format.js";

export function renderMatchLog(state, seasonMatches, seasonPlayers) {
  const filterOptions = ["all", ...seasonPlayers];
  if (!filterOptions.includes(state.logFilterPlayer)) state.logFilterPlayer = "all";

  els.logFilterSelect.innerHTML = filterOptions
    .map(
      (p) =>
        `<option value="${escapeHtml(p)}" ${p === state.logFilterPlayer ? "selected" : ""}>${
          p === "all" ? "All players" : escapeHtml(p)
        }</option>`
    )
    .join("");

  const filteredMatches =
    state.logFilterPlayer === "all"
      ? seasonMatches
      : seasonMatches.filter((m) => m.playerA === state.logFilterPlayer || m.playerB === state.logFilterPlayer);

  if (filteredMatches.length === 0) {
    els.logList.innerHTML = `<p class="empty-text">No matches to show.</p>`;
    return;
  }

  const sorted = [...filteredMatches].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  els.logList.innerHTML = sorted
    .map(
      (m) => `
      <div class="log-item">
        <div>
          <div class="log-match">
            <span style="font-weight:${m.scoreA > m.scoreB ? 700 : 400}">${escapeHtml(m.playerA)}</span>
            <span class="log-score">${m.scoreA} – ${m.scoreB}</span>
            <span style="font-weight:${m.scoreB > m.scoreA ? 700 : 400}">${escapeHtml(m.playerB)}</span>
          </div>
          <div class="log-date">${formatDate(m.timestamp)}</div>
        </div>
      </div>
    `
    )
    .join("");
}
