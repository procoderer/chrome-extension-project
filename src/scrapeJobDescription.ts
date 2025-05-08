export {};

const SELECTOR = '[data-automation-id="jobPostingDescription"]';

/** Grab text safely */
const getText = () =>
  document.querySelector<HTMLElement>(SELECTOR)?.innerText.trim() ?? "";

/** Push the text to the extension */
const push = (text: string) => {
  if (!text) return;
  chrome.runtime.sendMessage({
    type: "SCRAPED_JOB_DESCRIPTION",
    payload: { text },
  });
};

/** Initial send (after first load) */
window.addEventListener("load", () => setTimeout(() => push(getText()), 1_000));

/** Detect route changes in an SPA */
["pushState", "replaceState"].forEach(fn => {
  const orig = (history as any)[fn];
  (history as any)[fn] = function (...args: any[]) {
    orig.apply(this, args);
    setTimeout(() => push(getText()), 1_000);
  };
});
window.addEventListener("popstate", () => setTimeout(() => push(getText()), 1_000));

/** Detect DOM mutations (job description rewritten in place) */
const observer = new MutationObserver(() => push(getText()));
observer.observe(document.body, { childList: true, subtree: true });
