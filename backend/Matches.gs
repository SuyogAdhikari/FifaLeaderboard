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

  const sheet = getSheet(MATCH_SHEET);
  const timestamp = new Date();
  sheet.appendRow([timestamp, season, playerA, playerB, scoreA, scoreB]);

  return jsonResponse({ ok: true, timestamp: timestamp.toISOString() });
}
