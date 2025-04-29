(function() {
    try {
      //error handling for no workday page
      if (!window.location.hostname.includes('workday')) {
        console.warn('Not a Workday page. Skipping job description extraction.');
        return;
      }
  
      //attempt to find specific div
      const jobDescriptionDiv = document.querySelector('[data-automation-id="jobDescription"]');
  
      if (!jobDescriptionDiv) {
        console.error('Could not find the job description div.');
        return;
      }
  
      //error handle empty text
      const jobDescriptionText = jobDescriptionDiv.innerText.trim();
  
      if (!jobDescriptionText) {
        console.error('Job description div is empty.');
        return;
      }
  
      //returnable object
      const jobData = {
        url: window.location.href,
        jobDescription: jobDescriptionText,
      };
  
      console.log('Extracted Job Description:', jobData);
  
      //return job data
      return jobData;
  
    } catch (error) {
      console.error('An error occurred while extracting the job description:', error);
    }
  })();
  