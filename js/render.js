/**
 * render.js
 * All DOM writes live here. Every function takes plain data in and
 * paints one part of the page — no fetching, no calculation.
 */
window.FifaRender = (function () {
  const { fmtDate } = window.FifaState;

  function subhead(players, matches, configured) {
    const el = document.getElementById("subhead");
    if (!configured) {
      el.textContent = players.length + " players · not connected";
      return;
    }
    el.textContent = players.length + " players · " + matches.length + " matches played this season";
  }

  function configWarning(show) {
    document.getElementById("configWarning").style.display = show ? "block" : "none";
  }

  function lastSync(text) {
    document.getElementById("lastSync").textContent = text;
  }

  function statCards(standings, matches) {
    const el = document.getElementById("statGrid");
    if (matches.length === 0) {
      el.innerHTML = "";
      return;
    }
    const leader = standings[0];
    const topScorer = [...standings].sort((a, b) => b.gf - a.gf)[0];
    const bestForm = [...standings]
      .filter((s) => s.played > 0)
      .sort((a, b) => (b.points / b.played) - (a.points / a.played))[0];

    el.innerHTML = `
      <div class="card"><div class="card-label">&#127942; Top of table</div>
        <div class="card-value">${leader.name}</div><div class="card-sub">${leader.points} pts</div></div>
      <div class="card"><div class="card-label">&#128293; Best form</div>
        <div class="card-value">${bestForm ? bestForm.name : "—"}</div>
        <div class="card-sub">${bestForm ? (bestForm.points / bestForm.played).toFixed(1) : "0"} pts/match</div></div>
      <div class="card"><div class="card-label">&#9917; Top scorer</div>
        <div class="card-value">${topScorer.name}</div><div class="card-sub">${topScorer.gf} goals</div></div>
      <div class="card"><div class="card-label">&#128197; Matches</div>
        <div class="card-value">${matches.length}</div><div class="card-sub">all-time</div></div>
    `;
  }

  function seasonProgress(standings, seasonTarget) {
    const el = document.getElementById("progressList");
    el.innerHTML = standings.map((s) => {
      const pct = Math.min(100, (s.played / seasonTarget) * 100);
      const done = s.played >= seasonTarget;
      return `
        <div class="progress-row">
          <div class="progress-name">${s.name}</div>
          <div class="progress-track"><div class="progress-fill${done ? " done" : ""}" style="width:${pct}%"></div></div>
          <div class="progress-count">${s.played} / ${seasonTarget}</div>
        </div>`;
    }).join("");
  }

  function standingsTable(standings) {
    const tbody = document.getElementById("standingsBody");
    tbody.innerHTML = standings.map((s, i) => {
      const gd = s.gf - s.ga;
      const dots = s.form.slice(-5).map((f) =>
        `<span class="dot" style="background:${f === "W" ? "var(--teal)" : f === "L" ? "var(--red)" : "var(--gold)"}" title="${f}"></span>`
      ).join("");
      return `
        <tr class="${i === 0 && s.played > 0 ? "leader" : ""}">
          <td class="left">${i + 1}</td>
          <td class="left name-cell">${s.name}</td>
          <td>${s.played}</td>
          <td class="w">${s.wins}</td>
          <td class="d">${s.draws}</td>
          <td class="l">${s.losses}</td>
          <td>${gd > 0 ? "+" + gd : gd}</td>
          <td><div class="form-dots">${dots || '<span class="d">—</span>'}</div></td>
          <td class="right pts-cell">${s.points}</td>
        </tr>`;
    }).join("");
  }

  function playerSelects(players) {
    ["selA", "selB"].forEach((id, idx) => {
      const sel = document.getElementById(id);
      const prevVal = sel.value;
      sel.innerHTML = players.map((p) => `<option value="${p}">${p}</option>`).join("");
      if (players.includes(prevVal)) sel.value = prevVal;
      else sel.selectedIndex = Math.min(idx, players.length - 1);
    });
  }

  function h2hTable(players, h2h) {
    const el = document.getElementById("h2hTable");
    let html = "<thead><tr><th></th>" +
      players.map((p) => `<th>${p.slice(0, 2).toUpperCase()}</th>`).join("") + "</tr></thead><tbody>";
    players.forEach((row) => {
      html += `<tr><td class="left h2h-name">${row}</td>`;
      players.forEach((col) => {
        if (row === col) { html += `<td class="h2h-diag">—</td>`; return; }
        const wins = h2h[row][col];
        const opWins = h2h[col][row];
        html += `<td class="${wins > opWins ? "h2h-win" : "h2h-dim"}">${wins}</td>`;
      });
      html += "</tr>";
    });
    html += "</tbody>";
    el.innerHTML = html;
  }

  function scoreHistory(matches) {
    const el = document.getElementById("logList");
    if (matches.length === 0) {
      el.innerHTML = `<p class="empty-text">No matches recorded yet — add the first one above.</p>`;
      return;
    }
    const sorted = [...matches].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    el.innerHTML = sorted.map((m) => `
      <div class="log-item">
        <div>
          <div class="log-match">
            <span style="font-weight:${m.scoreA > m.scoreB ? 700 : 400}">${m.playerA}</span>
            <span class="log-score">${m.scoreA} – ${m.scoreB}</span>
            <span style="font-weight:${m.scoreB > m.scoreA ? 700 : 400}">${m.playerB}</span>
          </div>
          <div class="log-date">${fmtDate(m.timestamp)}</div>
        </div>
      </div>
    `).join("");
  }

  function formError(msg) {
    const el = document.getElementById("formError");
    el.textContent = msg || "";
    el.style.display = msg ? "block" : "none";
  }

  function savingText(text) {
    document.getElementById("savingText").textContent = text || "";
  }

  function clearScoreInputs() {
    document.getElementById("scoreA").value = "";
    document.getElementById("scoreB").value = "";
  }

  return {
    subhead, configWarning, lastSync, statCards, seasonProgress,
    standingsTable, playerSelects, h2hTable, scoreHistory,
    formError, savingText, clearScoreInputs,
  };
})();
