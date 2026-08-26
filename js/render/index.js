import { els } from "../ui/dom.js";
import { SEASON_TARGET, DEFAULT_PLAYERS } from "../config.js";
import {
  matchesForSeason,
  playersForSeason,
  computeStandings,
  computeH2H,
  computeProjections,
  getActiveRosterNames,
} from "../logic/standings.js";

import { renderSeasonBar } from "./seasonBar.js";
import { renderStatCards } from "./statCards.js";
import { renderPodium } from "./podium.js";
import { renderPerformance } from "./performance.js";
import { renderProgress } from "./progress.js";
import { renderProjection } from "./projection.js";
import { renderStandingsTable } from "./standingsTable.js";
import { renderMatchFormSelects } from "./matchForm.js";
import { renderHeadToHead } from "./headToHead.js";
import { renderPlayers } from "./players.js";
import { renderMatchLog } from "./matchLog.js";

/**
 * Recompute derived data from state and redraw every section. Called after
 * every fetch and after every local state change (season/filter switch).
 *
 * @param {object} state
 * @param {{onRenamePlayer:Function, onRemovePlayer:Function}} playerHandlers
 */
export function renderApp(state, playerHandlers) {
  const isActiveSeason = state.selectedSeason === state.activeSeasonName;
  const seasonMatches = state.selectedSeason ? matchesForSeason(state.allMatches, state.selectedSeason) : [];
  const seasonPlayers = playersForSeason(seasonMatches, DEFAULT_PLAYERS);
  const standings = computeStandings(seasonMatches, seasonPlayers);
  const h2h = computeH2H(seasonMatches, seasonPlayers);

  els.subhead.textContent =
    (state.selectedSeason || "No season") + " · " + seasonPlayers.length + " players · " + seasonMatches.length + " matches";

  els.targetLabel.textContent = SEASON_TARGET;

  const allReachedTarget = seasonPlayers.length > 0 && standings.every((s) => s.played >= SEASON_TARGET);

  renderSeasonBar(state, isActiveSeason, allReachedTarget);
  renderStatCards(seasonMatches, standings);
  renderPodium(standings);
  renderPerformance(standings);
  renderProgress(standings);
  renderProjection(computeProjections(standings, SEASON_TARGET));
  renderStandingsTable(standings);
  renderMatchFormSelects(getActiveRosterNames(state));
  renderHeadToHead(seasonPlayers, h2h);
  renderPlayers(state, { onRename: playerHandlers.onRenamePlayer, onRemove: playerHandlers.onRemovePlayer });
  renderMatchLog(state, seasonMatches, seasonPlayers);
}
