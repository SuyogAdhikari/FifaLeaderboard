/** Every DOM node the Admin page reads or writes. Separate from the dashboard's js/ui/dom.js since this is a different document. */
function byId(id) {
  return document.getElementById(id);
}

export const els = {
  adminConfigWarning: byId("adminConfigWarning"),

  adminSeasonSub: byId("adminSeasonSub"),
  targetGamesInput: byId("targetGamesInput"),
  saveTargetBtn: byId("saveTargetBtn"),
  targetSavingText: byId("targetSavingText"),
  targetError: byId("targetError"),

  newSeasonName: byId("newSeasonName"),
  newSeasonTarget: byId("newSeasonTarget"),
  startNewSeasonBtn: byId("startNewSeasonBtn"),
  newSeasonError: byId("newSeasonError"),

  playersManageWarning: byId("playersManageWarning"),
  addPlayerRow: byId("addPlayerRow"),
  playersList: byId("playersList"),
  newPlayerName: byId("newPlayerName"),
  addPlayerBtn: byId("addPlayerBtn"),
  playerError: byId("playerError"),
};
