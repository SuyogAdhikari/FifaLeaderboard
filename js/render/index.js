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
import { renderMatchFormSelects } from "./matchForm.js";
import { renderStandingsSection } from "./standingsTable.js";
import { renderOutlook } from "./outlook.js";
import { renderHeadToHead } from "./headToHead.js";
import { renderMatchLog } from "./matchLog.js";

/**
 * Recompute derived data from state and redraw every section, top to
 * bottom in the same order they appear on the page. Called after every
 * fetch and after every local state change (season switch, a filter
 * changing, a section being expanded, etc).
 *
 * Player *management* isn't rendered here at all — that's Admin's job now
 * (js/admin/render.js) — this only reads the roster to filter the
 * match-record dropdowns.
 *
 * @param {object} state
 */
export function renderApp(state) {
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
  renderMatchFormSelects(getActiveRosterNames(state), standings, seasonTarget);
  renderStandingsSection(standings, computeWeeklyPointsChange(seasonMatches, seasonPlayers));
  renderOutlook(
    state,
    standings,
    computeProjections(standings, seasonTarget),
    computeClinchStatus(standings, seasonTarget),
    seasonTarget
  );
  renderHeadToHead(seasonPlayers, { playerA: h2hPlayerA, playerB: h2hPlayerB, expanded: state.h2hExpanded }, h2hDetail);
  renderMatchLog(state, seasonMatches, seasonPlayers);
}
