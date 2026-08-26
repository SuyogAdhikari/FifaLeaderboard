/** All players as plain objects. Empty array if the Players tab doesn't exist. */
function getPlayers() {
  const sheet = getSheet(PLAYER_SHEET);
  if (!sheet) return [];

  const rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter((r) => r[0])
    .map((r) => ({
      name: String(r[0]),
      active: r[1] === true || String(r[1]).toLowerCase() === "true",
    }));
}

function handleAddPlayer(body) {
  const name = String(body.name || "").trim();
  if (!name) return jsonResponse({ ok: false, error: "Missing name" });

  const sheet = getSheet(PLAYER_SHEET);
  if (!sheet) return jsonResponse({ ok: false, error: "No 'Players' tab found" });

  const rows = sheet.getDataRange().getValues().slice(1);
  const exists = rows.some((r) => String(r[0]).toLowerCase() === name.toLowerCase());
  if (exists) return jsonResponse({ ok: false, error: "That player already exists" });

  sheet.appendRow([name, true]);
  return jsonResponse({ ok: true });
}

/** Soft-delete: flips Active to FALSE so match history stays intact. */
function handleRemovePlayer(body) {
  const name = String(body.name || "").trim();
  if (!name) return jsonResponse({ ok: false, error: "Missing name" });

  const sheet = getSheet(PLAYER_SHEET);
  if (!sheet) return jsonResponse({ ok: false, error: "No 'Players' tab found" });

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === name.toLowerCase()) {
      sheet.getRange(i + 1, 2).setValue(false);
      return jsonResponse({ ok: true });
    }
  }
  return jsonResponse({ ok: false, error: "Player not found" });
}

/** Renames a player in the roster and propagates the change across match history. */
function handleRenamePlayer(body) {
  const oldName = String(body.oldName || "").trim();
  const newName = String(body.newName || "").trim();
  if (!oldName || !newName) return jsonResponse({ ok: false, error: "Missing name" });

  const playerSheet = getSheet(PLAYER_SHEET);
  if (!playerSheet) return jsonResponse({ ok: false, error: "No 'Players' tab found" });

  const values = playerSheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === oldName.toLowerCase()) {
      playerSheet.getRange(i + 1, 1).setValue(newName);
      found = true;
      break;
    }
  }
  if (!found) return jsonResponse({ ok: false, error: "Player not found" });

  renamePlayerInMatchHistory(oldName, newName);
  return jsonResponse({ ok: true });
}

function renamePlayerInMatchHistory(oldName, newName) {
  const matchSheet = getSheet(MATCH_SHEET);
  const lastRow = matchSheet.getLastRow();
  if (lastRow <= 1) return;

  const colA = matchSheet.getRange(2, 3, lastRow - 1, 1); // PlayerA
  const colB = matchSheet.getRange(2, 4, lastRow - 1, 1); // PlayerB
  colA.createTextFinder(oldName).matchEntireCell(true).matchCase(false).replaceAllWith(newName);
  colB.createTextFinder(oldName).matchEntireCell(true).matchCase(false).replaceAllWith(newName);
}
