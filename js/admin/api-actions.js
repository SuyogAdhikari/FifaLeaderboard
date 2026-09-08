import { isApiConfigured } from "../config.js";
import { state, applyFetchedData } from "./state.js";
import * as api from "../api/client.js";
import { els } from "./dom.js";
import { renderAdmin, showTargetError, showNewSeasonError, showConfigWarning, hideConfigWarning } from "./render.js";
import { showPlayerError } from "../render/players.js";

const playerHandlers = {
  onRenamePlayer: (oldName, newName) => renamePlayer(oldName, newName),
  onRemovePlayer: (name) => removePlayer(name),
};

function render() {
  renderAdmin(state, playerHandlers);
}

export async function fetchData() {
  if (!isApiConfigured()) {
    showConfigWarning(`This page isn't connected to your Google Sheet yet. Set <code>API_URL</code> in <code>js/config.js</code>.`);
    render();
    return;
  }

  try {
    const data = await api.getLeagueData();
    if (data.ok) {
      applyFetchedData(data);
      hideConfigWarning();
    }
  } catch (e) {
    showConfigWarning(`Couldn't reach the sheet — check your connection and refresh.`);
  }

  render();
}

export async function saveTarget(targetGames) {
  showTargetError("");
  els.targetSavingText.textContent = "Saving…";
  try {
    const data = await api.updateSeasonTarget(targetGames);
    if (!data.ok) {
      showTargetError(data.error || "Couldn't save.");
      els.targetSavingText.textContent = "";
      return;
    }
    els.targetSavingText.textContent = "Saved";
    setTimeout(() => (els.targetSavingText.textContent = ""), 1500);
    await fetchData();
  } catch (e) {
    els.targetSavingText.textContent = "";
    showTargetError("Couldn't reach the sheet.");
  }
}

export async function startNewSeason(name, targetGames) {
  showNewSeasonError("");
  els.startNewSeasonBtn.disabled = true;
  els.startNewSeasonBtn.textContent = "Starting…";
  try {
    const data = await api.startNewSeason(name, targetGames);
    if (!data.ok) {
      showNewSeasonError(data.error || "Couldn't start season.");
      return;
    }
    await fetchData();
  } catch (e) {
    showNewSeasonError("Couldn't reach the sheet.");
  } finally {
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
