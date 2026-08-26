# FIFA Ranking Power League

A small matchday dashboard: a static frontend backed by a Google Sheet, with
a Google Apps Script Web App in between. Same functionality as the original
single-file version, reorganized into a normal frontend project layout.

## Project structure

```
fifa-league/
├── index.html                 # markup only
├── css/
│   └── styles.css             # all styling
├── js/
│   ├── config.js              # API_URL + tunables (SEASON_TARGET, REFRESH_MS, DEFAULT_PLAYERS)
│   ├── app.js                 # entry point: bind events, first render, start polling
│   ├── events.js              # DOM event listeners -> actions
│   ├── actions.js             # orchestrates api + state + re-render (the only layer that knows about all three)
│   ├── api/
│   │   └── client.js          # fetch() calls to the Apps Script backend, nothing else
│   ├── state/
│   │   └── store.js           # single mutable app state object
│   ├── logic/
│   │   └── standings.js       # pure functions: standings, head-to-head, roster filtering
│   ├── render/
│   │   ├── index.js           # top-level renderApp(), composes the sections below
│   │   ├── configWarning.js
│   │   ├── seasonBar.js
│   │   ├── statCards.js
│   │   ├── podium.js          # top-3 circular avatars, crown on 1st
│   │   ├── performance.js
│   │   ├── progress.js
│   │   ├── projection.js      # projected season-end points
│   │   ├── standingsTable.js  # now includes a Goal Difference (GD) column
│   │   ├── matchForm.js
│   │   ├── headToHead.js
│   │   ├── players.js
│   │   └── matchLog.js
│   └── ui/
│       └── dom.js             # cached getElementById references
└── backend/                   # Google Apps Script project (see below)
    ├── Code.gs                # doGet/doPost routing
    ├── Sheets.gs              # sheet name constants + lookup helper
    ├── Matches.gs
    ├── Seasons.gs
    ├── Players.gs
    └── Utils.gs
```

Each module has one job: `api/` only talks to the network, `state/` only
holds data, `logic/` only computes (no DOM, easy to unit test), `render/`
only writes to the DOM, and `actions.js` is the sole place that ties a user
action to an API call, a state update, and a re-render.

## Running it

The JS is loaded as native ES modules (`<script type="module">`), so the
site needs to be served over `http(s)://`, not opened directly as a
`file://` path. Any static host works — GitHub Pages, Netlify, Vercel, or
just `npx serve` locally.

## Google Sheet setup

You need three tabs:

**Matches** — headers `Timestamp | Season | PlayerA | PlayerB | ScoreA | ScoreB`

**Seasons** — headers `Name | Status | StartedAt | EndedAt`, with one
starting row, e.g. `Season 1 | active | 2026-08-26 | `

**Players** — headers `Name | Active`, one row per player, e.g.
`Basanta | TRUE`. `Active = TRUE` means they appear in the "record a match"
dropdowns; setting it to `FALSE` removes them from that list without
touching match history.

## Deploying the backend

1. In your Sheet, go to **Extensions > Apps Script**.
2. Create one script file per file under `backend/` (matching names is
   fine), and paste in the matching content. Apps Script shares one global
   scope across all files in a project, so the split is purely for
   readability — it behaves exactly like one script.
3. **Deploy > New deployment > Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize the script, then copy the Web app URL into `API_URL` in
   `js/config.js`.
5. Whenever you edit the script, create a new version under **Manage
   deployments** for changes to go live — the URL itself doesn't change.

## Newer additions

- **Goal Difference**: the Standings table now has a `GD` column
  (goals for − goals against), colored teal/red/dim for positive/negative/zero.
- **Podium**: a new section above Performance shows circular initials-avatars
  for the top 3 players in the current standings (gold/silver/bronze rings),
  with a crown on 1st place. Only players who've played at least one match
  are shown, so it stays empty until the season gets going.
- **Projected finish**: a new section estimates each player's season-end
  points by taking their current points-per-game rate and extrapolating it
  across the games they have left until the `SEASON_TARGET`
  (`js/logic/standings.js#computeProjections`). This is a simple linear
  projection — it doesn't know who's left to play or account for form —
  so treat it as an "if this pace holds" estimate, not a forecast.

## Notes carried over from the original version

- The **Players** management section renders correctly but its containing
  `<section>` is hidden (`style="display: none;"` in `index.html`) — this
  was already the case in the version this was rewritten from. Remove that
  inline style if you want to expose it.
- Player names are now HTML-escaped before being inserted into the page
  (`js/utils/format.js`), closing a minor XSS gap that existed in the
  original inline-script version. This doesn't change behavior for normal
  names.
- The Apps Script Web App is deployed with "Anyone" access and no auth
  token — anyone with the URL can add matches or edit the roster. Fine for
  a private link shared with your group; worth knowing if the URL leaks.
