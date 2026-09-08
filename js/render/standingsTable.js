import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

function gdClass(gd) {
  if (gd > 0) return "gd-pos";
  if (gd < 0) return "gd-neg";
  return "gd-neutral";
}

function formatGd(gd) {
  return gd > 0 ? `+${gd}` : String(gd);
}

export function renderStandingsTable(standings, weeklyChange) {
  els.standingsBody.innerHTML = standings
    .map((s, i) => {
      const winPct = s.played > 0 ? Math.round((s.wins / s.played) * 100) : 0;
      const gd = s.gf - s.ga;
      const gained = weeklyChange[s.name] || 0;
      return `
        <tr class="${i === 0 && s.played > 0 ? "leader" : ""}">
          <td class="left">${i + 1}</td>
          <td class="left name-cell">${escapeHtml(s.name)}</td>
          <td>${s.played}</td>
          <td class="w">${s.wins}</td>
          <td class="d">${s.draws}</td>
          <td class="l">${s.losses}</td>
          <td class="${gdClass(gd)}">${formatGd(gd)}</td>
          <td class="winrate-cell">${winPct}%</td>
          <td class="right pts-cell">${s.points}</td>
          <td class="${gained > 0 ? "gd-pos" : "gd-neg"}">${gained > 0 ? "+" + gained : "0"}</td>
        </tr>`;
    })
    .join("");
}