/**
 * main.js
 * The only module that owns app state and wires the others together.
 * Load order (see index.html): config -> api -> state -> render -> main.
 */
(function () {
  const Config = window.FifaConfig;
  const Api = window.FifaApi;
  const State = window.FifaState;
  const Render = window.FifaRender;

  let matches = [];
  let players = [...Config.DEFAULT_PLAYERS];
  let pollTimer = null;

  document.getElementById("targetLabel").textContent = Config.SEASON_TARGET;

  function renderAll() {
    const standings = State.computeStandings(players, matches);
    const h2h = State.computeH2H(players, matches);

    Render.subhead(players, matches, Config.isApiConfigured());
    Render.statCards(standings, matches);
    Render.seasonProgress(standings, Config.SEASON_TARGET);
    Render.standingsTable(standings);
    Render.playerSelects(players);
    Render.h2hTable(players, h2h);
    Render.scoreHistory(matches);
  }

  async function refresh() {
    if (!Config.isApiConfigured()) {
      Render.configWarning(true);
      renderAll();
      return;
    }
    const result = await Api.fetchMatches();
    if (result.ok) {
      matches = result.matches;
      players = State.derivePlayers(matches, Config.DEFAULT_PLAYERS);
      Render.lastSync("Synced " + new Date().toLocaleTimeString());
    } else if (!result.notConfigured) {
      Render.lastSync("Couldn't reach the sheet — retrying…");
    }
    renderAll();
  }

  async function handleAddMatch() {
    Render.formError("");
    const playerA = document.getElementById("selA").value;
    const playerB = document.getElementById("selB").value;
    const scoreAraw = document.getElementById("scoreA").value;
    const scoreBraw = document.getElementById("scoreB").value;

    if (!Config.isApiConfigured()) {
      Render.formError("Connect your Google Sheet first — see the notice above.");
      return;
    }
    if (!playerA || !playerB || playerA === playerB) {
      Render.formError("Pick two different players.");
      return;
    }
    if (scoreAraw === "" || scoreBraw === "") {
      Render.formError("Enter both scores.");
      return;
    }
    const scoreA = parseInt(scoreAraw, 10);
    const scoreB = parseInt(scoreBraw, 10);
    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      Render.formError("Scores must be valid numbers.");
      return;
    }

    Render.savingText("Saving…");
    const result = await Api.postMatch(playerA, playerB, scoreA, scoreB);
    if (result.ok) {
      Render.savingText("Saved");
      setTimeout(() => Render.savingText(""), 1500);
      Render.clearScoreInputs();
      await refresh();
    } else {
      Render.savingText("");
      Render.formError("Couldn't save to the sheet. Check your connection and try again.");
    }
  }

  function init() {
    document.getElementById("addMatchBtn").addEventListener("click", handleAddMatch);
    document.getElementById("refreshBtn").addEventListener("click", refresh);

    renderAll();
    refresh();
    pollTimer = setInterval(refresh, Config.REFRESH_MS);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
