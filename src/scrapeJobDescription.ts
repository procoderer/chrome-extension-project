export function extractJobDescription(): string | undefined{
  try {
    if (!window.location.hostname.includes("workday")) {
      console.warn("Not a Workday page. Skipping job description extraction.");
      return;
    }

    const jobDescriptionDiv = document.querySelector('[data-automation-id="jobDescription"]');
    if (!jobDescriptionDiv) {
      console.error("Could not find the job description div.");
      return;
    }

    const jobDescriptionText = (jobDescriptionDiv as HTMLElement).innerText.trim();
    if (!jobDescriptionText) {
      console.error("Job description div is empty.");
      return;
    }

    return jobDescriptionText;
    } catch (err) {
    console.error("Error extracting job description:", err);
  }
}
