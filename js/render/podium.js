import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";
import { PLAYER_AVATARS } from "../config.js";

const RANK_LABEL = { 1: "1st", 2: "2nd", 3: "3rd" };

function avatarMarkup(name) {
  const photoUrl = PLAYER_AVATARS[name];
  if (photoUrl) {
    return `<img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(name)}" onerror="this.replaceWith(document.createTextNode('${escapeHtml(
      name.slice(0, 2).toUpperCase()
    )}'))" />`;
  }
  return escapeHtml(name.slice(0, 2).toUpperCase());
}

/** Top 3 of the current standings, shown as circular avatars. Only counts players who've played at least one match. */
export function renderPodium(standings) {
  const podiumPlayers = standings.filter((s) => s.played > 0).slice(0, 3);

  if (podiumPlayers.length === 0) {
    els.podiumRow.innerHTML = `<p class="empty-text">No matches yet this season.</p>`;
    return;
  }

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
          <div class="podium-rank-label">${RANK_LABEL[rank]}</div>
          <div class="podium-name">${escapeHtml(s.name)}</div>
          <div class="podium-points">${s.points} pts</div>
        </div>`;
    })
    .join("");
}