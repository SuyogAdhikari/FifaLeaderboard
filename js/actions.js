import { isApiConfigured } from "./config.js";
import { state, applyFetchedData } from "./state/store.js";
import * as api from "./api/client.js";
import { els } from "./ui/dom.js";
import { renderApp } from "./render/index.js";
import { showConfigWarning, hideConfigWarning } from "./render/configWarning.js";
import { setSavingText, showFormError } from "./render/matchForm.js";

function render() {
  renderApp(state);
}

export async function fetchData() {
  if (!isApiConfigured()) {
    showConfigWarning(`This dashboard isn't connected to your Google Sheet yet. Open
      <code>js/config.js</code> and paste your Apps Script Web App URL into
      <code>API_URL</code>. See <code>README.md</code> for the full walkthrough.`);
    render();
    return;
  }

  try {
    const data = await api.getLeagueData();
    if (data.ok) {
      applyFetchedData(data);

      if (state.seasons.length === 0) {
        showConfigWarning(`No seasons found in your <code>Seasons</code> tab. Add a header row
          (<code>Name | Status | StartedAt | EndedAt | TargetGames</code>) and one data row like
          <code>Season 1 | active | (today) | | 27</code>. See <code>README.md</code>.`);
      } else {
        hideConfigWarning();
      }

      els.lastSync.textContent = "Synced " + new Date().toLocaleTimeString();
    }
  } catch (e) {
    els.lastSync.textContent = "Couldn't reach the sheet — retrying…";
  }

  render();
}

export async function submitMatch(playerA, playerB, scoreA, scoreB) {
  setSavingText("Saving…");
  try {
    const data = await api.addMatch(state.activeSeasonName, playerA, playerB, scoreA, scoreB);
    if (!data.ok) {
      setSavingText("");
      showFormError(data.error || "Couldn't save to the sheet.");
      return;
    }
    setSavingText("Saved");
    setTimeout(() => setSavingText(""), 1500);
    await fetchData();
  } catch (e) {
    setSavingText("");
    showFormError("Couldn't save to the sheet. Check your connection and try again.");
  }
}

export function selectSeason(seasonName) {
  state.selectedSeason = seasonName;
  state.logFilterPlayer = "all";
  render();
}

export function selectLogFilter(playerName) {
  state.logFilterPlayer = playerName;
  render();
}

export function toggleMatchLog() {
  state.logExpanded = !state.logExpanded;
  render();
}

export function toggleOutlook() {
  state.outlookExpanded = !state.outlookExpanded;
  render();
}

export function selectH2HPlayerA(name) {
  state.h2hPlayerA = name;
  render();
}

export function selectH2HPlayerB(name) {
  state.h2hPlayerB = name;
  render();
}

export function toggleH2HExpanded() {
  state.h2hExpanded = !state.h2hExpanded;
  render();
}

export { render };
