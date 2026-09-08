import { els } from "../ui/dom.js";
import { SEASON_TARGET, DEFAULT_PLAYERS } from "../config.js";
import {
  matchesForSeason,
  playersForSeason,
  computeStandings,
  computeHeadToHeadDetail,
  computeProjections,
  computeClinchStatus,
  computeWeeklyPointsChange,
  resolveSeasonTarget,
  getActiveRosterNames,
} from "../logic/standings.js";

import { renderSeasonBar } from "./seasonBar.js";
import { renderStatCards } from "./statCards.js";
import { renderPodium } from "./podium.js";
import { renderPerformance } from "./performance.js";
import { renderProjection } from "./projection.js";
import { renderStandingsTable } from "./standingsTable.js";
import { renderPositionRace } from "./positionRace.js";
import { renderMatchFormSelects } from "./matchForm.js";
import { renderHeadToHead } from "./headToHead.js";
import { renderPlayers } from "./players.js";
import { renderMatchLog } from "./matchLog.js";

export function renderApp(state, playerHandlers) {
  const isActiveSeason = state.selectedSeason === state.activeSeasonName;
  const seasonMatches = state.selectedSeason ? matchesForSeason(state.allMatches, state.selectedSeason) : [];
  const seasonPlayers = playersForSeason(seasonMatches, DEFAULT_PLAYERS);
  const standings = computeStandings(seasonMatches, seasonPlayers);

  const selectedSeasonObj = state.seasons.find((s) => s.name === state.selectedSeason);
  const seasonTarget = resolveSeasonTarget(selectedSeasonObj, SEASON_TARGET);

  const h2hPlayerA = seasonPlayers.includes(state.h2hPlayerA) ? state.h2hPlayerA : seasonPlayers[0] || null;
  const h2hPlayerB =
    seasonPlayers.includes(state.h2hPlayerB) && state.h2hPlayerB !== h2hPlayerA
      ? state.h2hPlayerB
      : seasonPlayers.find((p) => p !== h2hPlayerA) || null;
  const h2hDetail =
    h2hPlayerA && h2hPlayerB ? computeHeadToHeadDetail(seasonMatches, h2hPlayerA, h2hPlayerB) : null;

  els.subhead.textContent =
    (state.selectedSeason || "No season") + " · " + seasonPlayers.length + " players · " + seasonMatches.length + " matches";

  const allReachedTarget = seasonPlayers.length > 0 && standings.every((s) => s.played >= seasonTarget);

  renderSeasonBar(state, isActiveSeason, allReachedTarget);
  renderStatCards(seasonMatches, standings);
  renderPodium(standings);
  renderPerformance(standings, seasonTarget);
  renderProjection(computeProjections(standings, seasonTarget), seasonTarget);
  renderStandingsTable(standings, computeWeeklyPointsChange(seasonMatches, seasonPlayers));
  renderPositionRace(computeClinchStatus(standings, seasonTarget));
  renderMatchFormSelects(getActiveRosterNames(state), standings, seasonTarget);
  renderHeadToHead(seasonPlayers, { playerA: h2hPlayerA, playerB: h2hPlayerB, expanded: state.h2hExpanded }, h2hDetail);
  renderPlayers(state, els, { onRename: playerHandlers.onRenamePlayer, onRemove: playerHandlers.onRemovePlayer });
  renderMatchLog(state, seasonMatches, seasonPlayers);
}