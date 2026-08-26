const MATCH_SHEET = "Matches";
const SEASON_SHEET = "Seasons";
const PLAYER_SHEET = "Players";

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function hasPlayersSheet() {
  return Boolean(getSheet(PLAYER_SHEET));
}
