/** Every DOM node the app reads or writes, looked up once and reused. */
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
  startNewSeasonBtn: byId("startNewSeasonBtn"),

  lastSync: byId("lastSync"),
  refreshBtn: byId("refreshBtn"),

  statGrid: byId("statGrid"),
  podiumRow: byId("podiumRow"),
  perfGrid: byId("perfGrid"),

  targetLabel: byId("targetLabel"),
  progressList: byId("progressList"),

  projTargetLabel: byId("projTargetLabel"),
  projectionList: byId("projectionList"),

  standingsBody: byId("standingsBody"),

  recordSection: byId("recordSection"),
  selA: byId("selA"),
  selB: byId("selB"),
  scoreA: byId("scoreA"),
  scoreB: byId("scoreB"),
  formError: byId("formError"),
  addMatchBtn: byId("addMatchBtn"),
  savingText: byId("savingText"),

  h2hTable: byId("h2hTable"),

  managePlayersSub: byId("managePlayersSub"),
  playersManageWarning: byId("playersManageWarning"),
  addPlayerRow: byId("addPlayerRow"),
  playersList: byId("playersList"),
  newPlayerName: byId("newPlayerName"),
  addPlayerBtn: byId("addPlayerBtn"),
  playerError: byId("playerError"),

  logFilterSelect: byId("logFilterSelect"),
  logList: byId("logList"),
};
