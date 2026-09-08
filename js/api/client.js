import { API_URL } from "../config.js";

/** GET the full league dataset (matches, seasons, players). */
export async function getLeagueData() {
  const res = await fetch(API_URL, { method: "GET" });
  return res.json();
}

/**
 * POST an action to the backend.
 * Uses `text/plain` (instead of `application/json`) so the browser doesn't
 * send a CORS preflight request, which Apps Script Web Apps don't handle.
 */
export async function postAction(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export const addMatch = (season, playerA, playerB, scoreA, scoreB) =>
  postAction({ action: "addMatch", season, playerA, playerB, scoreA, scoreB });

export const startNewSeason = (name, targetGames) => postAction({ action: "newSeason", name, targetGames });

export const updateSeasonTarget = (targetGames) => postAction({ action: "updateSeasonTarget", targetGames });

export const addPlayer = (name) => postAction({ action: "addPlayer", name });

export const removePlayer = (name) => postAction({ action: "removePlayer", name });

export const renamePlayer = (oldName, newName) => postAction({ action: "renamePlayer", oldName, newName });
