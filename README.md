# FIFA Ranking Power League

A matchday dashboard for a friend group's FIFA season: a static frontend
backed by a Google Sheet, with a Google Apps Script Web App in between.

## Project structure

```
fifa-league/
├── index.html                  # dashboard — markup only
├── admin.html                  # admin page — markup only
├── css/
│   └── styles.css              # all styling, one design system for both pages
├── js/
│   ├── config.js                API_URL + tunables (SEASON_TARGET, REFRESH_MS, DEFAULT_PLAYERS, avatars)
│   ├── app.js                   dashboard entry point: bind events, first render, start polling
│   ├── events.js                dashboard DOM event listeners -> actions
│   ├── actions.js                dashboard orchestration: api + state + re-render
│   ├── api/
│   │   └── client.js            fetch() calls to the Apps Script backend, nothing else
│   ├── state/
│   │   └── store.js             single mutable dashboard state object
│   ├── logic/
│   │   └── standings.js         pure functions: standings, head-to-head, projections,
│   │                            clinch/race status, weekly points change
│   ├── render/
│   │   ├── index.js             top-level renderApp(), composes every dashboard section
│   │   ├── configWarning.js
│   │   ├── seasonBar.js
│   │   ├── statCards.js
│   │   ├── matchForm.js
│   │   ├── standingsTable.js    podium strip + table (GD, win%, 7-day points change)
│   │   ├── outlook.js           per-player card: form, projection, race-for-position
│   │   ├── headToHead.js
│   │   ├── matchLog.js
│   │   └── players.js           roster UI — rendered only by Admin, see below
│   ├── admin/                   admin page's own app/state/render/events, same shape as above
│   └── ui/
│       └── dom.js               cached getElementById references (dashboard only)
└── backend/                     Google Apps Script project
    ├── Code.gs                  doGet/doPost routing
    ├── Sheets.gs                sheet name constants + lookup helper
    ├── Matches.gs                match reads/writes, season-target enforcement
    ├── Seasons.gs                season reads, archiving, target updates
    ├── Players.gs                roster reads/writes
    └── Utils.gs                  small shared helpers
```

Each module has one job: `api/` only talks to the network, `state/` only
holds data, `logic/` only computes (no DOM, easy to unit test), `render/`
only writes to the DOM, and `actions.js`/`events.js` are the only places
that tie a user action to an API call, a state update, and a re-render.

**Dashboard vs. Admin.** The dashboard (`index.html`) is read-mostly: it
shows the season and lets you record a match. All *configuration* —
changing a season's games-per-player target, starting a new season, and
managing the player roster — lives on the Admin page (`admin.html`)
instead. This used to be split awkwardly (the dashboard had a half-working
"start new season" button of its own, and a fully-built-but-hidden Players
section), which is why Admin exists as a single, deliberate place for it now.

## Dashboard sections

- **Record a match** — writes straight to the sheet. A player who's
  already played the season's target number of games is automatically
  excluded from the dropdowns (and rejected server-side too, since the
  Web App has no auth and can be posted to directly).
- **Standings** — the league table (GD, win%, points, and each player's
  points gained in the last 7 days), with a small podium strip for the
  top 3 above it.
- **Player outlook** *(collapsed by default)* — one card per player
  combining win rate, recent form, games-played progress, a simple
  linear projection of their season-end points, and their status in the
  race for position (locked in with a medal, leading, or how many points
  they need in how many games to move up).
- **Head to head** *(collapsed by default)* — pick two players to see
  their full match history against each other, not just aggregate counts.
- **Score history** *(collapsed by default)* — every match, filterable
  by player.

## Running it

The JS is loaded as native ES modules (`<script type="module">`), so the
site needs to be served over `http(s)://`, not opened directly as a
`file://` path. Any static host works — Netlify, GitHub Pages, Vercel, or
just `npx serve` locally.

## Google Sheet setup

Three tabs, exactly these headers:

**Matches** — `Timestamp | Season | PlayerA | PlayerB | ScoreA | ScoreB`

**Seasons** — `Name | Status | StartedAt | EndedAt | TargetGames`, with one
starting row, e.g. `Season 1 | active | 2026-08-26 | | 27`. `TargetGames`
is optional per row — leave it blank to fall back to the `SEASON_TARGET`
constant in `js/config.js`.

**Players** — `Name | Active`, one row per player, e.g. `Basanta | TRUE`.
`Active = TRUE` means they appear in the "record a match" dropdowns;
`FALSE` removes them from that list without touching match history.

## Deploying the backend

1. In your Sheet, go to **Extensions > Apps Script**.
2. Create one script file per file under `backend/` and paste in the
   matching content. Apps Script shares one global scope across every
   file in a project, so the split is purely for readability.
3. **Deploy > New deployment > Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize the script, then copy the Web app URL into `API_URL` in
   `js/config.js`.
5. Whenever you edit the script, create a new version under **Manage
   deployments** for the changes to actually go live — the URL itself
   never changes, but Apps Script keeps serving whatever code was live at
   your last "New version" deploy until you make another one. This is the
   single most common cause of "I changed the code but nothing happened."

## Known, accepted tradeoffs

- The Apps Script Web App is deployed with "Anyone" access and no auth
  token — anyone with the URL can add matches or edit the roster. Fine
  for a private link shared with your group; worth knowing if the URL
  leaks.
- Player names are HTML-escaped before being inserted into the page
  (`js/utils/format.js`), so unusual names can't break the layout or
  inject markup.
- The season-end projection (`computeProjections`) is a simple linear
  extrapolation of current points-per-game — it doesn't know who's left
  to play or account for form. Treat it as "if this pace holds," not a
  forecast.
