/**
 * Matches.gs — reading and appending match rows, with season-target
 * enforcement so a player who has already played their season's quota of
 * games can't have another match recorded against their name (mirrors the
 * client-side dropdown filter in js/render/matchForm.js, but enforced here
 * too since the Web App has no auth and can be posted to directly).
 */

/** All recorded matches, oldest first, as plain objects. */
function getMatches() {
  const sheet = getSheet(MATCH_SHEET);
  const rows = sheet.getDataRange().getValues().slice(1);

  return rows
    .filter((r) => r[2] && r[3])
    .map((r, i) => ({
      id: "row_" + (i + 2),
      timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      season: String(r[1] || "Season 1"),
      playerA: String(r[2]),
      playerB: String(r[3]),
      scoreA: Number(r[4]),
      scoreB: Number(r[5]),
    }));
}

function handleAddMatch(body) {
  const playerA = String(body.playerA || "").trim();
  const playerB = String(body.playerB || "").trim();
  const scoreA = Number(body.scoreA);
  const scoreB = Number(body.scoreB);
  const season = String(body.season || "").trim();

  if (!playerA || !playerB || isNaN(scoreA) || isNaN(scoreB) || !season) {
    return jsonResponse({ ok: false, error: "Missing or invalid fields" });
  }

  const seasonObj = getSeasons().find((s) => s.name === season);
  const target =
    seasonObj && typeof seasonObj.targetGames === "number" && seasonObj.targetGames > 0 ? seasonObj.targetGames : null;

  if (target) {
    const existing = getMatches().filter((m) => m.season === season);
    const playedCount = (name) => existing.filter((m) => m.playerA === name || m.playerB === name).length;

    if (playedCount(playerA) >= target) {
      return jsonResponse({ ok: false, error: playerA + " has already played this season's " + target + " games." });
    }
    if (playedCount(playerB) >= target) {
      return jsonResponse({ ok: false, error: playerB + " has already played this season's " + target + " games." });
    }
  }

  const sheet = getSheet(MATCH_SHEET);
  const timestamp = new Date();
  sheet.appendRow([timestamp, season, playerA, playerB, scoreA, scoreB]);

  return jsonResponse({ ok: true, timestamp: timestamp.toISOString() });
}
