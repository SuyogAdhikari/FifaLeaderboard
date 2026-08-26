import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

export function renderHeadToHead(seasonPlayers, h2h) {
  if (seasonPlayers.length === 0) {
    els.h2hTable.innerHTML = "";
    return;
  }

  let html =
    "<thead><tr><th></th>" +
    seasonPlayers.map((p) => `<th>${escapeHtml(p.slice(0, 2).toUpperCase())}</th>`).join("") +
    "</tr></thead><tbody>";

  seasonPlayers.forEach((row) => {
    html += `<tr><td class="left h2h-name">${escapeHtml(row)}</td>`;
    seasonPlayers.forEach((col) => {
      if (row === col) {
        html += `<td class="h2h-diag">—</td>`;
        return;
      }
      const w = h2h.wins[row][col];
      const opW = h2h.wins[col][row];
      const dCount = h2h.draws[row][col];
      html += `<td>
        <div class="h2h-cell-wins ${w > opW ? "h2h-win" : "h2h-dim"}">${w}</div>
        ${dCount > 0 ? `<div class="h2h-cell-draws">${dCount}D</div>` : ""}
      </td>`;
    });
    html += "</tr>";
  });
  html += "</tbody>";

  els.h2hTable.innerHTML = html;
}
