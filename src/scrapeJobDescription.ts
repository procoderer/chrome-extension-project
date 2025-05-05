export {};

/**
 * Extracts the text of the Workday job‑description element.
 */
const scrapeJobDescription = (): string => {
  const el = document.querySelector<HTMLElement>(
    '[data-automation-id="jobPostingDescription"]'
  );
  return el?.innerText.trim() ?? "";
};

/**
 * Sends the scraped description to the background worker.
 */
const sendJobDescription = (): void => {
  const text = scrapeJobDescription();
  if (!text) return;

  chrome.runtime.sendMessage<ScrapedJobDescriptionMsg>(
    { type: "SCRAPED_JOB_DESCRIPTION", payload: { text } },
    (res) => {
      console.log("✅ Message sent to background:", res);
    }
  );
};

// Run once the page finishes loading (plus a small buffer for dynamic content)
window.addEventListener("load", () => setTimeout(sendJobDescription, 1_000));
