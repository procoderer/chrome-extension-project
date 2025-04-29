function scrapeJobDescription() {
  const el = document.querySelector('[data-automation-id="jobPostingDescription"]');
  if (el && el instanceof HTMLElement) {
    console.log("✅ Found job description element");
    console.log(el.innerText.trim());
    return el.innerText.trim();
  }
  return '';
}

function sendJobDescription() {
  const jobDesc = scrapeJobDescription();
  if (!jobDesc) return;

  chrome.runtime.sendMessage({
    type: 'SCRAPED_JOB_DESCRIPTION',
    payload: { text: jobDesc }
  }, (res) => {
    console.log("✅ Message sent to background:", res);
  });
}

window.addEventListener("load", () => {
  setTimeout(sendJobDescription, 1000);
});