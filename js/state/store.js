import { DEFAULT_PLAYERS } from "../config.js";

/**
 * Single in-memory store. Kept as a plain mutable object (rather than
 * scattered module-level `let`s) so every module reads/writes one shared
 * source of truth and it's obvious at a glance what the app's state is.
 *
 * Player *management* (add/remove/rename) lives entirely in Admin now —
 * the dashboard only needs to know the roster to filter the match-record
 * dropdowns, so playersRoster/playersTabAvailable are read-only here.
 */
export const state = {
  allMatches: [],
  seasons: [],
  playersRoster: [], // [{ name, active }] — only populated if a Players tab exists
  playersTabAvailable: false,
  selectedSeason: null,
  activeSeasonName: null,
  allPlayersEver: [...DEFAULT_PLAYERS],
  logFilterPlayer: "all",
  logExpanded: false,
  outlookExpanded: false,
  h2hPlayerA: null,
  h2hPlayerB: null,
  h2hExpanded: false,
};

/** Recompute state.activeSeasonName / selectedSeason / allPlayersEver from freshly-fetched data. */
export function applyFetchedData({ matches, seasons, players, playersTabAvailable }) {
  state.allMatches = matches || [];
  state.seasons = seasons || [];
  state.playersRoster = players || [];
  state.playersTabAvailable = Boolean(playersTabAvailable);

  const active = state.seasons.find((s) => s.status === "active");
  state.activeSeasonName = active ? active.name : state.seasons[0] ? state.seasons[0].name : null;

  if (!state.selectedSeason || !state.seasons.find((s) => s.name === state.selectedSeason)) {
    state.selectedSeason = state.activeSeasonName;
  }

  const namesInData = new Set(DEFAULT_PLAYERS);
  state.allMatches.forEach((m) => {
    namesInData.add(m.playerA);
    namesInData.add(m.playerB);
  });
  state.playersRoster.forEach((p) => namesInData.add(p.name));
  state.allPlayersEver = Array.from(namesInData);
}
