import { DEFAULT_PLAYERS } from "../config.js";

export const state = {
  allMatches: [],
  seasons: [],
  playersRoster: [],
  playersTabAvailable: false,
  activeSeasonName: null,
  allPlayersEver: [...DEFAULT_PLAYERS],
};

export function applyFetchedData({ matches, seasons, players, playersTabAvailable }) {
  state.allMatches = matches || [];
  state.seasons = seasons || [];
  state.playersRoster = players || [];
  state.playersTabAvailable = Boolean(playersTabAvailable);

  const active = state.seasons.find((s) => s.status === "active");
  state.activeSeasonName = active ? active.name : state.seasons[0] ? state.seasons[0].name : null;

  const namesInData = new Set(DEFAULT_PLAYERS);
  state.allMatches.forEach((m) => {
    namesInData.add(m.playerA);
    namesInData.add(m.playerB);
  });
  state.playersRoster.forEach((p) => namesInData.add(p.name));
  state.allPlayersEver = Array.from(namesInData);
}