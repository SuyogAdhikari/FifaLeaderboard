/**
 * App-wide constants.
 *
 * Paste your Google Apps Script Web App URL below. See /README.md for the
 * full deployment walkthrough.
 */
export const API_URL =
  "https://script.google.com/macros/s/AKfycbxVm6zHXVqrmLHoSL_Z3bB-oCv1k21BlU754C9iOFA4U717C6sgG7m7O2w5tFg2QOI/exec";

export const SEASON_TARGET = 27;
export const REFRESH_MS = 15000;
export const DEFAULT_PLAYERS = ["B'santa", "Nobs", "Jungs", "Forty4Minutes"];

/** True once a real API URL has been pasted in above. */
export function isApiConfigured() {
  return Boolean(API_URL) && API_URL.indexOf("PASTE_YOUR") === -1;
}

// Map each player's name to an image path or URL. Add an entry per player;
// anyone missing from this list falls back to their initials automatically.
export const PLAYER_AVATARS = {
  "B'santa": "images/basanta.PNG",
  "Nobs": "images/nabin.png",
  "Jungs": "images/prabin.png",
  "Forty4Minutes": "images/suyog.png",
};