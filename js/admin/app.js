import { bindEvents } from "./events.js";
import { fetchData } from "./api-actions.js";

function init() {
  bindEvents();
  fetchData();
}

init();