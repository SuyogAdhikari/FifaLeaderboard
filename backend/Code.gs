/**
 * FIFA League — Google Sheets backend
 *
 * This project is split into several files (Google Apps Script shares one
 * global scope across all files in a project, so this is purely for
 * readability — it behaves exactly like a single script):
 *
 *   Code.gs     - doGet/doPost routing (this file)
 *   Sheets.gs   - sheet name constants + a shared helper to look them up
 *   Matches.gs  - reading + appending match rows
 *   Seasons.gs  - reading seasons, archiving/starting a season
 *   Players.gs  - reading, adding, removing, renaming players
 *   Utils.gs    - small shared helpers (JSON response)
 *
 * SHEET SETUP — you need THREE tabs:
 *
 * Tab 1: "Matches"
 *   Headers (row 1, A1:F1): Timestamp | Season | PlayerA | PlayerB | ScoreA | ScoreB
 *
 * Tab 2: "Seasons"
 *   Headers (row 1, A1:D1): Name | Status | StartedAt | EndedAt
 *   Add one data row to start:  Season 1 | active | (today's date)  |  (leave blank)
 *
 * Tab 3: "Players"
 *   Headers (row 1, A1:B1): Name | Active
 *   Add one row per player, e.g.:  Basanta | TRUE
 *   (Active = TRUE means they show up when recording new matches. Setting it
 *   to FALSE "removes" them from that list without touching match history.)
 *
 * DEPLOY:
 * 1. Extensions > Apps Script, create one file per module above (or paste
 *    them all into one file — the app works identically either way).
 * 2. Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Authorize, then copy the Web app URL into js/config.js (API_URL).
 * 4. Any time you edit this script, create a new version under
 *    "Manage deployments" for the changes to go live — the URL stays the same.
 */

function doGet(e) {
  return jsonResponse({
    ok: true,
    matches: getMatches(),
    seasons: getSeasons(),
    players: getPlayers(),
    playersTabAvailable: hasPlayersSheet(),
  });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || "addMatch";

    switch (action) {
      case "addMatch":
        return handleAddMatch(body);
      case "newSeason":
        return handleNewSeason(body);
      case "addPlayer":
        return handleAddPlayer(body);
      case "removePlayer":
        return handleRemovePlayer(body);
      case "renamePlayer":
        return handleRenamePlayer(body);
      default:
        return jsonResponse({ ok: false, error: "Unknown action: " + action });
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}
