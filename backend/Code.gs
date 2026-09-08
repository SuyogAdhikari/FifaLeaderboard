/**
 * FIFA Ranking Power League — Google Sheets backend
 *
 * Apps Script shares one global scope across every file in a project, so
 * this split into several files is purely for readability — it behaves
 * exactly like one script.
 *
 *   Code.gs     - doGet/doPost routing (this file)
 *   Sheets.gs   - sheet name constants + a shared lookup helper
 *   Matches.gs  - reading + appending match rows, with target enforcement
 *   Seasons.gs  - reading seasons, archiving/starting a season, target updates
 *   Players.gs  - reading, adding, soft-removing, renaming players
 *   Utils.gs    - small shared helpers (JSON response)
 *
 * SHEET SETUP — three tabs, exactly these headers:
 *
 * Tab 1: "Matches"
 *   Timestamp | Season | PlayerA | PlayerB | ScoreA | ScoreB
 *
 * Tab 2: "Seasons"
 *   Name | Status | StartedAt | EndedAt | TargetGames
 *   One starting row, e.g.:  Season 1 | active | (today's date) | | 27
 *   TargetGames is optional per row — leave blank to fall back to the
 *   SEASON_TARGET constant in js/config.js.
 *
 * Tab 3: "Players"
 *   Name | Active
 *   One row per player, e.g.: Basanta | TRUE
 *   Active = TRUE means they appear in the "record a match" dropdowns.
 *   Setting it to FALSE removes them from that list without touching
 *   their match history.
 *
 * DEPLOY
 * 1. Extensions > Apps Script — create one script file per module above
 *    (or paste everything into one file; it works identically either way).
 * 2. Deploy > New deployment > Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 * 3. Authorize, then paste the Web app URL into API_URL in js/config.js.
 * 4. Every time you edit this script, create a new version under
 *    "Manage deployments" for the change to actually go live — the URL
 *    itself never changes, but Apps Script keeps serving the old code
 *    until a new version is deployed.
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
      case "updateSeasonTarget":
        return handleUpdateSeasonTarget(body);
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
