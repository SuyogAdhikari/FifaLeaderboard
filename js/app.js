import { REFRESH_MS } from "./config.js";
import { bindEvents } from "./events.js";
import { fetchData, render } from "./actions.js";

function init() {
  bindEvents();
  render(); // draw once with empty state so the page isn't blank while the first fetch is in flight
  fetchData();
  setInterval(fetchData, REFRESH_MS);
}

init();
