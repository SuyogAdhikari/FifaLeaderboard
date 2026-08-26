import { els } from "../ui/dom.js";
import { escapeHtml } from "../utils/format.js";

export function showPlayerError(message) {
  els.playerError.textContent = message;
  els.playerError.style.display = message ? "block" : "none";
}

/**
 * @param {object} state
 * @param {{onRename: (oldName:string,newName:string)=>void, onRemove:(name:string)=>void}} handlers
 */
export function renderPlayers(state, { onRename, onRemove }) {
  if (!state.playersTabAvailable || state.playersRoster.length === 0) {
    els.playersManageWarning.style.display = "block";
    els.playersManageWarning.innerHTML = `Add a <code>Players</code> tab to your Sheet to enable renaming, adding,
      and removing players from here. Until then this list is read-only, built from match history. See <code>SETUP.md</code>.`;
    els.addPlayerRow.style.display = "none";
    els.playersList.innerHTML = state.allPlayersEver
      .map((name) => `<div class="player-row"><div class="player-row-name">${escapeHtml(name)}</div></div>`)
      .join("");
    return;
  }

  els.playersManageWarning.style.display = "none";
  els.addPlayerRow.style.display = "flex";

  const activePlayers = state.playersRoster.filter((p) => p.active);
  els.playersList.innerHTML =
    activePlayers
      .map(
        (p) => `
      <div class="player-row">
        <div class="player-row-name">${escapeHtml(p.name)}</div>
        <div class="player-row-actions">
          <button class="btn-icon" data-rename="${escapeHtml(p.name)}">Rename</button>
          <button class="btn-icon danger" data-remove="${escapeHtml(p.name)}">Remove</button>
        </div>
      </div>
    `
      )
      .join("") || `<p class="empty-text">No active players yet — add one below.</p>`;

  els.playersList.querySelectorAll("[data-rename]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const oldName = btn.getAttribute("data-rename");
      const newName = prompt('Rename "' + oldName + '" to:', oldName);
      if (!newName || !newName.trim() || newName.trim() === oldName) return;
      onRename(oldName, newName.trim());
    });
  });

  els.playersList.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-remove");
      if (confirm('Remove "' + name + '" from the active roster? Past matches stay in the history.')) {
        onRemove(name);
      }
    });
  });
}
