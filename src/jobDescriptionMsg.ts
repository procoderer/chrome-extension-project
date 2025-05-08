interface ScrapedJobDescriptionMsg {
  type: "SCRAPED_JOB_DESCRIPTION";
  payload: { text: string };
}
interface GetJobDescriptionMsg  { type: "GET_JOB_DESCRIPTION" }
interface RequestScrapeMsg      { type: "REQUEST_SCRAPE" }   // background → content
