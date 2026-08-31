/** All seasons as plain objects. Empty array if the Seasons tab doesn't exist. */
function getSeasons() {
  const sheet = getSheet(SEASON_SHEET);
  if (!sheet) return [];

  const rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter((r) => r[0])
    .map((r) => ({
      name: String(r[0]),
      status: String(r[1] || "active").toLowerCase(),
      startedAt: r[2] instanceof Date ? r[2].toISOString() : String(r[2] || ""),
      endedAt: r[3] instanceof Date ? r[3].toISOString() : String(r[3] || ""),
      targetGames: r[4] !== "" && r[4] != null && !isNaN(Number(r[4])) ? Number(r[4]) : null,
    }));
}

/** Archives the currently-active season and appends a new active one. */
function handleNewSeason(body) {
  const seasonSheet = getSheet(SEASON_SHEET);
  if (!seasonSheet) return jsonResponse({ ok: false, error: "No 'Seasons' tab found" });

  const values = seasonSheet.getDataRange().getValues();
  const rows = values.slice(1);
  const now = new Date();

  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][1]).toLowerCase() === "active") {
      const sheetRow = i + 2;
      seasonSheet.getRange(sheetRow, 2).setValue("completed");
      seasonSheet.getRange(sheetRow, 4).setValue(now);
    }
  }

  let newName = String(body.name || "").trim();
  if (!newName) {
    let maxNum = 0;
    rows.forEach((r) => {
      const m = String(r[0]).match(/(\d+)\s*$/);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
    });
    newName = "Season " + (maxNum + 1);
  }

  const targetNum = Number(body.targetGames);
  const targetValue = !isNaN(targetNum) && targetNum > 0 ? targetNum : "";

  seasonSheet.appendRow([newName, "active", now, "", targetValue]);
  return jsonResponse({ ok: true, season: newName });
}

/** Updates the games-per-player target for the currently active season. */
function handleUpdateSeasonTarget(body) {
  const targetNum = Number(body.targetGames);
  if (isNaN(targetNum) || targetNum <= 0) {
    return jsonResponse({ ok: false, error: "Enter a valid number of games" });
  }

  const seasonSheet = getSheet(SEASON_SHEET);
  if (!seasonSheet) return jsonResponse({ ok: false, error: "No 'Seasons' tab found" });

  const values = seasonSheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]).toLowerCase() === "active") {
      seasonSheet.getRange(i + 1, 5).setValue(targetNum);
      return jsonResponse({ ok: true, targetGames: targetNum });
    }
  }
  return jsonResponse({ ok: false, error: "No active season found" });
}