import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";
import { PLAYER_AVATARS } from "../config.js";

const PODIUM_RANK_LABEL = { 1: "1st", 2: "2nd", 3: "3rd" };

function avatarMarkup(name) {
  const photoUrl = PLAYER_AVATARS[name];
  if (photoUrl) {
    return `<img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(name)}" onerror="this.replaceWith(document.createTextNode('${escapeHtml(
      name.slice(0, 2).toUpperCase()
    )}'))" />`;
  }
  return escapeHtml(name.slice(0, 2).toUpperCase());
}

/** Top-3 circular avatars (gold/silver/bronze rings, crown on 1st) shown above the table. */
function renderPodiumStrip(standings) {
  const podiumPlayers = standings.filter((s) => s.played > 0).slice(0, 3);

  if (podiumPlayers.length === 0) {
    els.podiumRow.innerHTML = "";
    els.podiumRow.style.display = "none";
    return;
  }

  els.podiumRow.style.display = "flex";
  els.podiumRow.innerHTML = podiumPlayers
    .map((s, i) => {
      const rank = i + 1;
      const crown = rank === 1 ? `<span class="podium-crown">&#128081;</span>` : "";
      return `
        <div class="podium-item" data-rank="${rank}">
          <div class="podium-avatar-wrap">
            ${crown}
            <div class="podium-avatar">${avatarMarkup(s.name)}</div>
          </div>
          <div class="podium-rank-label">${PODIUM_RANK_LABEL[rank]}</div>
          <div class="podium-name">${escapeHtml(s.name)}</div>
          <div class="podium-points">${s.points} pts</div>
        </div>`;
    })
    .join("");
}

function gdClass(gd) {
  if (gd > 0) return "gd-pos";
  if (gd < 0) return "gd-neg";
  return "gd-neutral";
}

function formatGd(gd) {
  return gd > 0 ? `+${gd}` : String(gd);
}

/**
 * Renders the whole Standings section: the top-3 podium strip plus the
 * full table, including the goal-difference column and each player's
 * points gained in the last 7 days.
 */
export function renderStandingsSection(standings, weeklyChange) {
  renderPodiumStrip(standings);

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
          <td class="${gained > 0 ? "gd-pos" : "gd-neutral"}">${gained > 0 ? "+" + gained : "0"}</td>
        </tr>`;
    })
    .join("");
}
