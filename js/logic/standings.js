/**
 * Pure functions for turning raw match rows into standings / head-to-head
 * data. Nothing in this module touches the DOM or app state, so it can be
 * unit-tested in isolation.
 */

/** Matches belonging to a given season. */
export function matchesForSeason(allMatches, seasonName) {
  return allMatches.filter((m) => m.season === seasonName);
}

/** Distinct player names that appear in a set of matches (falls back to the defaults if empty). */
export function playersForSeason(matches, defaultPlayers) {
  const set = new Set();
  matches.forEach((m) => {
    set.add(m.playerA);
    set.add(m.playerB);
  });
  if (set.size === 0) defaultPlayers.forEach((p) => set.add(p));
  return Array.from(set);
}

/**
 * League table: 3 points for a win, 1 for a draw. Sorted by points, then
 * goal difference, then goals scored.
 */
export function computeStandings(matches, playerList) {
  const table = {};
  playerList.forEach((p) => {
    table[p] = { name: p, played: 0, wins: 0, losses: 0, draws: 0, gf: 0, ga: 0, points: 0, form: [] };
  });

  matches.forEach((m) => {
    if (!table[m.playerA] || !table[m.playerB]) return;
    const A = table[m.playerA];
    const B = table[m.playerB];
    A.played++;
    B.played++;
    A.gf += m.scoreA;
    A.ga += m.scoreB;
    B.gf += m.scoreB;
    B.ga += m.scoreA;

    if (m.scoreA > m.scoreB) {
      A.wins++; A.points += 3; A.form.push("W");
      B.losses++; B.form.push("L");
    } else if (m.scoreB > m.scoreA) {
      B.wins++; B.points += 3; B.form.push("W");
      A.losses++; A.form.push("L");
    } else {
      A.draws++; A.points += 1; A.form.push("D");
      B.draws++; B.points += 1; B.form.push("D");
    }
  });

  return Object.values(table).sort((x, y) => {
    if (y.points !== x.points) return y.points - x.points;
    const gdX = x.gf - x.ga;
    const gdY = y.gf - y.ga;
    if (gdY !== gdX) return gdY - gdX;
    return y.gf - x.gf;
  });
}

/**
 * Full match-by-match breakdown between exactly two players, from
 * playerA's perspective, plus summary stats for that pairing. Assumes the
 * two names are distinct; returns a zeroed summary (played: 0) if they
 * haven't met yet.
 */
export function computeHeadToHeadDetail(matches, playerA, playerB) {
  const meetings = matches
    .filter(
      (m) =>
        (m.playerA === playerA && m.playerB === playerB) ||
        (m.playerA === playerB && m.playerB === playerA)
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const summary = { played: meetings.length, winsA: 0, winsB: 0, draws: 0, goalsA: 0, goalsB: 0 };

  const detailedMatches = meetings.map((m) => {
    const aIsFirst = m.playerA === playerA;
    const scoreA = aIsFirst ? m.scoreA : m.scoreB;
    const scoreB = aIsFirst ? m.scoreB : m.scoreA;

    summary.goalsA += scoreA;
    summary.goalsB += scoreB;

    let result; // from playerA's perspective
    if (scoreA > scoreB) {
      summary.winsA++;
      result = "W";
    } else if (scoreB > scoreA) {
      summary.winsB++;
      result = "L";
    } else {
      summary.draws++;
      result = "D";
    }

    return { timestamp: m.timestamp, scoreA, scoreB, result };
  });

  // Current streak from playerA's perspective, walking back from the most recent meeting.
  let streak = 0;
  let streakResult = null;
  for (let i = detailedMatches.length - 1; i >= 0; i--) {
    const r = detailedMatches[i].result;
    if (streakResult === null) {
      streakResult = r;
      streak = 1;
    } else if (r === streakResult) {
      streak++;
    } else {
      break;
    }
  }

  return {
    playerA,
    playerB,
    summary,
    matches: detailedMatches.slice().reverse(), // most recent first, for display
    avgGoalsA: summary.played > 0 ? summary.goalsA / summary.played : 0,
    avgGoalsB: summary.played > 0 ? summary.goalsB / summary.played : 0,
    streak: streak > 0 ? { result: streakResult, count: streak } : null,
  };
}

/**
 * Projects each player's likely season-end points total by extrapolating
 * their current points-per-game rate across the games they have left until
 * the season target. This is a simple linear projection (it doesn't account
 * for who's left to play, form trends, etc.) — treat it as a "if this pace
 * holds" estimate, not a guarantee.
 *
 * Returns entries sorted by projected points, richest first.
 */
export function computeProjections(standings, seasonTarget) {
  return standings
    .map((s) => {
      const remainingGames = Math.max(0, seasonTarget - s.played);
      const pointsPerGame = s.played > 0 ? s.points / s.played : 0;
      const projectedPoints = s.points + pointsPerGame * remainingGames;
      return {
        name: s.name,
        played: s.played,
        points: s.points,
        remainingGames,
        pointsPerGame,
        projectedPoints: Math.round(projectedPoints),
      };
    })
    .sort((a, b) => b.projectedPoints - a.projectedPoints);
}

/** Names eligible to appear in the "record a match" dropdowns. */
export function getActiveRosterNames(state) {
  if (state.playersTabAvailable && state.playersRoster.length > 0) {
    return state.playersRoster.filter((p) => p.active).map((p) => p.name);
  }
  return state.allPlayersEver;
}

/** Resolves the games-per-player target for a season, falling back to a default when the season has none set. */
export function resolveSeasonTarget(season, fallback) {
  return season && typeof season.targetGames === "number" && season.targetGames > 0 ? season.targetGames : fallback;
}