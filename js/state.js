/**
 * state.js
 * Pure data functions — standings, head-to-head, formatting.
 * Nothing here touches the DOM, so it's easy to test or reuse.
 */
window.FifaState = (function () {
  function computeStandings(players, matches) {
    const table = {};
    players.forEach((p) => {
      table[p] = { name: p, played: 0, wins: 0, losses: 0, draws: 0, gf: 0, ga: 0, points: 0, form: [] };
    });

    matches.forEach((m) => {
      if (!table[m.playerA] || !table[m.playerB]) return;
      const A = table[m.playerA];
      const B = table[m.playerB];
      A.played++; B.played++;
      A.gf += m.scoreA; A.ga += m.scoreB;
      B.gf += m.scoreB; B.ga += m.scoreA;

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
      const gdX = x.gf - x.ga, gdY = y.gf - y.ga;
      if (gdY !== gdX) return gdY - gdX;
      return y.gf - x.gf;
    });
  }

  function computeH2H(players, matches) {
    const grid = {};
    players.forEach((p) => {
      grid[p] = {};
      players.forEach((q) => { grid[p][q] = 0; });
    });
    matches.forEach((m) => {
      if (!grid[m.playerA] || !grid[m.playerB]) return;
      if (m.scoreA > m.scoreB) grid[m.playerA][m.playerB]++;
      else if (m.scoreB > m.scoreA) grid[m.playerB][m.playerA]++;
    });
    return grid;
  }

  function derivePlayers(matches, defaults) {
    const names = new Set();
    matches.forEach((m) => { names.add(m.playerA); names.add(m.playerB); });
    defaults.forEach((p) => names.add(p));
    return Array.from(names);
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  return { computeStandings, computeH2H, derivePlayers, fmtDate };
})();
