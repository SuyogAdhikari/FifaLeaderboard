import { isApiConfigured } from "./config.js";
import { state, applyFetchedData } from "./state/store.js";
import * as api from "./api/client.js";
import { els } from "./ui/dom.js";
import { renderApp } from "./render/index.js";
import { showConfigWarning, hideConfigWarning } from "./render/configWarning.js";
import { setSavingText, showFormError } from "./render/matchForm.js";
import { showPlayerError } from "./render/players.js";

const playerHandlers = {
  onRenamePlayer: (oldName, newName) => renamePlayer(oldName, newName),
  onRemovePlayer: (name) => removePlayer(name),
};

function render() {
  renderApp(state, playerHandlers);
}

export async function fetchData() {
  if (!isApiConfigured()) {
    showConfigWarning(`This dashboard isn't connected to your Google Sheet yet. Open <code>index.html</code>,
      find <code>const API_URL = "..."</code> in <code>js/config.js</code>, and paste in your
      Apps Script Web App URL. See <code>SETUP.md</code> for the full walkthrough.`);
    render();
    return;
  }

  try {
    const data = await api.getLeagueData();
    if (data.ok) {
      applyFetchedData(data);

      if (state.seasons.length === 0) {
        showConfigWarning(`No seasons found in your <code>Seasons</code> tab. Add a header row
          (<code>Name | Status | StartedAt | EndedAt</code>) and one data row like
          <code>Season 1 | active | (today) | </code>. See <code>SETUP.md</code>.`);
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
    await api.addMatch(state.activeSeasonName, playerA, playerB, scoreA, scoreB);
    setSavingText("Saved");
    setTimeout(() => setSavingText(""), 1500);
    await fetchData();
  } catch (e) {
    setSavingText("");
    showFormError("Couldn't save to the sheet. Check your connection and try again.");
  }
}

export async function createNewSeason() {
  els.startNewSeasonBtn.disabled = true;
  els.startNewSeasonBtn.textContent = "Starting…";
  try {
    const data = await api.startNewSeason();
    if (data.ok) state.selectedSeason = data.season;
    await fetchData();
  } catch (e) {
    els.startNewSeasonBtn.disabled = false;
    els.startNewSeasonBtn.textContent = "Start new season";
  }
}

export async function addPlayer(name) {
  showPlayerError(els, "");
  try {
    const data = await api.addPlayer(name);
    if (!data.ok) {
      showPlayerError(els, data.error || "Couldn't add player.");
      return;
    }
    await fetchData();
  } catch (e) {
    showPlayerError(els, "Couldn't reach the sheet.");
  }
}

async function removePlayer(name) {
  showPlayerError(els, "");
  try {
    const data = await api.removePlayer(name);
    if (!data.ok) {
      showPlayerError(els, data.error || "Couldn't remove player.");
      return;
    }
    await fetchData();
  } catch (e) {
    showPlayerError(els, "Couldn't reach the sheet.");
  }
}

async function renamePlayer(oldName, newName) {
  showPlayerError(els, "");
  try {
    const data = await api.renamePlayer(oldName, newName);
    if (!data.ok) {
      showPlayerError(els, data.error || "Couldn't rename player.");
      return;
    }
    await fetchData();
  } catch (e) {
    showPlayerError(els, "Couldn't reach the sheet.");
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
