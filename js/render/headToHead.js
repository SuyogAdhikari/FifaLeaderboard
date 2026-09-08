import { els } from "../ui/dom.js";
import { escapeHtml, formatDate } from "../utils/format.js";

const RESULT_LABEL = { W: "Win", D: "Draw", L: "Loss" };
const STREAK_WORD = { W: "win", D: "draw", L: "loss" };

function populateSelect(select, players, preferredValue) {
  const prevVal = select.value;
  select.innerHTML = players.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("");
  if (players.includes(preferredValue)) select.value = preferredValue;
  else if (players.includes(prevVal)) select.value = prevVal;
}

/**
 * @param {string[]} seasonPlayers
 * @param {{playerA:string|null, playerB:string|null, expanded:boolean}} selection
 * @param {object|null} detail  Output of computeHeadToHeadDetail, or null if fewer than 2 players this season.
 */
export function renderHeadToHead(seasonPlayers, selection, detail) {
  if (seasonPlayers.length < 2) {
    els.h2hSummary.innerHTML = `<p class="empty-text">Need at least two players with matches this season.</p>`;
    els.h2hToggleBtn.style.display = "none";
    els.h2hDetail.style.display = "none";
    return;
  }

  populateSelect(els.h2hSelA, seasonPlayers, selection.playerA);
  populateSelect(els.h2hSelB, seasonPlayers, selection.playerB);

  if (!detail || detail.summary.played === 0) {
    const a = detail ? detail.playerA : selection.playerA;
    const b = detail ? detail.playerB : selection.playerB;
    els.h2hSummary.innerHTML = `<p class="empty-text">${escapeHtml(a || "")} and ${escapeHtml(
      b || ""
    )} haven't played each other yet this season.</p>`;
    els.h2hToggleBtn.style.display = "none";
    els.h2hDetail.style.display = "none";
    return;
  }

  const { summary, playerA, playerB } = detail;
  const pctA = (summary.winsA / summary.played) * 100;
  const pctD = (summary.draws / summary.played) * 100;
  const pctB = (summary.winsB / summary.played) * 100;

  els.h2hSummary.innerHTML = `
    <div class="h2h-total">${summary.played} meeting${summary.played === 1 ? "" : "s"}</div>
    <div class="h2h-bar">
      <div class="h2h-bar-seg h2h-bar-a" style="width:${pctA}%" title="${escapeHtml(playerA)} wins"></div>
      <div class="h2h-bar-seg h2h-bar-d" style="width:${pctD}%" title="Draws"></div>
      <div class="h2h-bar-seg h2h-bar-b" style="width:${pctB}%" title="${escapeHtml(playerB)} wins"></div>
    </div>
    <div class="h2h-bar-legend">
      <span><span class="h2h-dot h2h-bar-a"></span>${escapeHtml(playerA)} ${summary.winsA}</span>
      <span><span class="h2h-dot h2h-bar-d"></span>Draws ${summary.draws}</span>
      <span><span class="h2h-dot h2h-bar-b"></span>${escapeHtml(playerB)} ${summary.winsB}</span>
    </div>
  `;

  els.h2hToggleBtn.style.display = "inline-block";
  els.h2hToggleBtn.textContent = selection.expanded ? "Hide match history \u25B2" : "Show match history \u25BC";
  els.h2hDetail.style.display = selection.expanded ? "block" : "none";

  if (!selection.expanded) return;

  const streakText = detail.streak
    ? `${escapeHtml(playerA)} ${detail.streak.count > 1 ? `on a ${detail.streak.count}-game ` : ""}${
        STREAK_WORD[detail.streak.result]
      }${detail.streak.count > 1 ? " streak" : ""} in this matchup`
    : "";

  els.h2hDetail.innerHTML = `
    <div class="h2h-stats-row">
      <div class="h2h-stat">
        <div class="h2h-stat-label">Goals</div>
        <div class="h2h-stat-value">${escapeHtml(playerA)} ${summary.goalsA} \u2013 ${summary.goalsB} ${escapeHtml(playerB)}</div>
      </div>
      <div class="h2h-stat">
        <div class="h2h-stat-label">Avg goals/game</div>
        <div class="h2h-stat-value">${detail.avgGoalsA.toFixed(1)} \u2013 ${detail.avgGoalsB.toFixed(1)}</div>
      </div>
      ${
        streakText
          ? `<div class="h2h-stat"><div class="h2h-stat-label">Streak</div><div class="h2h-stat-value">${streakText}</div></div>`
          : ""
      }
    </div>
    <div class="h2h-match-list">
      ${detail.matches
        .map(
          (m) => `
        <div class="h2h-match-row">
          <span class="h2h-match-date">${formatDate(m.timestamp)}</span>
          <span class="h2h-match-score">${m.scoreA} \u2013 ${m.scoreB}</span>
          <span class="h2h-match-result h2h-result-${m.result.toLowerCase()}">${RESULT_LABEL[m.result]}</span>
        </div>`
        )
        .join("")}
    </div>
  `;
}
