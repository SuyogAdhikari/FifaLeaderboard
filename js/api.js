/**
 * api.js
 * Everything that talks to the Google Apps Script web app lives here.
 * Nothing else in the codebase should call fetch() directly.
 */
window.FifaApi = (function () {
  async function fetchMatches() {
    const { API_URL, isApiConfigured } = window.FifaConfig;
    if (!isApiConfigured()) {
      return { ok: false, notConfigured: true, matches: [] };
    }
    try {
      const res = await fetch(API_URL, { method: "GET" });
      const data = await res.json();
      return data.ok ? { ok: true, matches: data.matches || [] } : { ok: false, matches: [] };
    } catch (err) {
      return { ok: false, error: err, matches: [] };
    }
  }

  async function postMatch(playerA, playerB, scoreA, scoreB) {
    const { API_URL } = window.FifaConfig;
    try {
      await fetch(API_URL, {
        method: "POST",
        // text/plain avoids a CORS preflight request, which Apps Script doesn't handle
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ playerA, playerB, scoreA, scoreB }),
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  return { fetchMatches, postMatch };
})();
