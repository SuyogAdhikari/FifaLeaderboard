/**
 * Every DOM node the dashboard reads or writes, looked up once and reused.
 * (Admin has its own equivalent at js/admin/dom.js — the two pages don't
 * share a document, so they can't share this cache.)
 */
function byId(id) {
  return document.getElementById(id);
}

export const els = {
  subhead: byId("subhead"),
  configWarning: byId("configWarning"),

  seasonSelect: byId("seasonSelect"),
  seasonBadge: byId("seasonBadge"),
  archivedNote: byId("archivedNote"),
  seasonCompleteBanner: byId("seasonCompleteBanner"),

  lastSync: byId("lastSync"),
  refreshBtn: byId("refreshBtn"),

  statGrid: byId("statGrid"),

  recordSection: byId("recordSection"),
  selA: byId("selA"),
  selB: byId("selB"),
  scoreA: byId("scoreA"),
  scoreB: byId("scoreB"),
  formError: byId("formError"),
  formMaxedNote: byId("formMaxedNote"),
  addMatchBtn: byId("addMatchBtn"),
  savingText: byId("savingText"),

  podiumRow: byId("podiumRow"),
  standingsBody: byId("standingsBody"),

  outlookToggleBtn: byId("outlookToggleBtn"),
  outlookBody: byId("outlookBody"),
  outlookGrid: byId("outlookGrid"),

  h2hSelA: byId("h2hSelA"),
  h2hSelB: byId("h2hSelB"),
  h2hSummary: byId("h2hSummary"),
  h2hToggleBtn: byId("h2hToggleBtn"),
  h2hDetail: byId("h2hDetail"),

  logToggleBtn: byId("logToggleBtn"),
  logBody: byId("logBody"),
  logFilterSelect: byId("logFilterSelect"),
  logList: byId("logList"),
};
