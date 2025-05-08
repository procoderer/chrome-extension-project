# JobAppAI

JobAppAI is a Google Chrome extension that parses job postings on Workday to quickly provide users with key skills, a summary of the job description, and a tailored cover letter. Users can specify particular skills to extract as well as rely on a set of default skills automatically identified by the extension.

## Installation

### Install From Release

- Download the latest release from the [Releases](https://github.com/procoderer/chrome-extension-project)
- Unzip the downloaded ZIP file
- Add a file named `.env` in the root directory that contains the line `VITE_GEMINI_API_KEY="example_api_key"` (replacing example_api_key with your `gemini-2.0-flash` API key)
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Drag and drop the unzipped folder into the extensions page

### Install From Source

1. Clone the repository:

   ```bash
   git clone https://github.com/procoderer/chrome-extension-project.git
   ```

2. Add a file named `.env` in the root directory that contains the line `VITE_GEMINI_API_KEY="example_api_key"` (replacing example_api_key with your `gemini-2.0-flash` API key)

3. Install dependencies:

   ```bash
   cd chrome-extension-project
   npm install
   ```

4. Build the extension:

   ```bash
   npm run build
   ```

5. Load the extension in Chrome:

   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory from the project

## Development

- Run the development server with hot reloading:

  ```bash
  npm run dev
  ```

- Load the unpacked extension in Chrome from the `dist` directory
- Make changes to the source code and the extension will automatically reload

## Features

- Extract job description
- Identify key skills from job description
- Generate summary of job description
- Generate cover letter based on job description

## Team Member Responsibilities (up to milestone)

- Dilini: extract job description feature, landing page
- Yun: identify key skills feature, reviewing PRs/merging branches, README.md
- Andrea: generate summary feature, TESTING.md
- Shafaa: generate cover letter feature

## Known Bugs and Incomplete Features

No unresolved bugs have been found. In the future, we may want to allow the user to enter in their API key in the actual extension instead of making them add a `.env` file with their API key. In addition, we currently only have a barebones user interface and want to modify it.

## Credits

The initial setup of this project was based on the tutorial by [Harshita Joshi](https://github.com/Harshita-mindfire) on creating a Chrome extension with React and TypeScript. The corresponding Medium article can be found [here](https://medium.com/@tharshita13/creating-a-chrome-extension-with-react-a-step-by-step-guide-47fe9bab24a1).

Further setup was done by [Michelle Chang](https://github.com/michellechang02) by replacing the Webpack initialization of the app with Vite.

The project has been extended with additional functionality, testing setup, and documentation. The most difficult part was figuring out the right combination of packages for the testing suite (for instance, I would avoid `jest-chrome`, `mockzilla`, `mockzilla-webextension`, to name but a few).

The dataset used for skills is from [Kaggle](https://www.kaggle.com/datasets/arbazkhan971/allskillandnonskill/data).
