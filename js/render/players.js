import { escapeHtml } from "../utils/format.js";

/**
 * Player roster management — rendered exclusively on the Admin page now
 * (js/admin/render.js). Takes its DOM refs as a parameter rather than
 * importing a fixed `els`, purely so it can be reused there without being
 * coupled to one specific document.
 */

export function showPlayerError(refs, message) {
  refs.playerError.textContent = message;
  refs.playerError.style.display = message ? "block" : "none";
}

/**
 * @param {object} state
 * @param {{playersManageWarning, addPlayerRow, playersList, playerError}} refs
 * @param {{onRename: (oldName:string,newName:string)=>void, onRemove:(name:string)=>void}} handlers
 */
export function renderPlayers(state, refs, { onRename, onRemove }) {
  if (!state.playersTabAvailable || state.playersRoster.length === 0) {
    refs.playersManageWarning.style.display = "block";
    refs.playersManageWarning.innerHTML = `Add a <code>Players</code> tab to your Sheet to enable renaming, adding,
      and removing players from here. Until then this list is read-only, built from match history.`;
    refs.addPlayerRow.style.display = "none";
    refs.playersList.innerHTML = state.allPlayersEver
      .map((name) => `<div class="player-row"><div class="player-row-name">${escapeHtml(name)}</div></div>`)
      .join("");
    return;
  }

  refs.playersManageWarning.style.display = "none";
  refs.addPlayerRow.style.display = "flex";

  const activePlayers = state.playersRoster.filter((p) => p.active);
  refs.playersList.innerHTML =
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

  refs.playersList.querySelectorAll("[data-rename]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const oldName = btn.getAttribute("data-rename");
      const newName = prompt('Rename "' + oldName + '" to:', oldName);
      if (!newName || !newName.trim() || newName.trim() === oldName) return;
      onRename(oldName, newName.trim());
    });
  });

  refs.playersList.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-remove");
      if (confirm('Remove "' + name + '" from the active roster? Past matches stay in the history.')) {
        onRemove(name);
      }
    });
  });
}
