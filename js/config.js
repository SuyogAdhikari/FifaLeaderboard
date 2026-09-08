/**
 * App-wide constants.
 *
 * Paste your Google Apps Script Web App URL below. See /README.md for the
 * full deployment walkthrough.
 */
export const API_URL =
  "https://script.google.com/macros/s/AKfycbykcBuZWDDApJpS5DZ5Cx4RYOj1V2dflQCeVAlxArLVe-mSp8VEI5FL9sZCVsPZ_aSS/exec";

export const SEASON_TARGET = 27;
export const REFRESH_MS = 15000;
export const DEFAULT_PLAYERS = ["B'santa", "Nobs", "Jungs", "Forty4Minutes"];

/** True once a real API URL has been pasted in above. */
export function isApiConfigured() {
  return Boolean(API_URL) && API_URL.indexOf("PASTE_YOUR") === -1;
}

// Map each player's name to an avatar image. Anyone missing from this list
// falls back to their initials automatically (see js/render/standingsTable.js).
export const PLAYER_AVATARS = {
  "B'santa": "images/basanta.PNG",
  "Nobs": "images/nabin.PNG",
  "Jungs": "images/prabin.PNG",
  "Forty4Minutes": "images/suyog.PNG",
};
