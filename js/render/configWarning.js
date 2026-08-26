import { els } from "../ui/dom.js";

export function showConfigWarning(html) {
  els.configWarning.innerHTML = html;
  els.configWarning.style.display = "block";
}

export function hideConfigWarning() {
  els.configWarning.style.display = "none";
}
