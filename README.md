# Step Recorder → Gherkin

A Chrome extension that records user interactions in the browser and exports them as Gherkin scenarios for automated testing.

## Features

- **Automatic Recording**: Records clicks, form inputs, submissions, and navigation
- **Smart Selectors**: Generates robust CSS selectors using data-testid, IDs, aria-labels, and fallback strategies
- **SPA Support**: Tracks single-page application navigation via history API
- **Gherkin Export**: Converts recorded steps to Gherkin format for BDD testing
- **Toggle Recording**: Enable/disable recording as needed

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `step-recorder` folder
5. The extension icon should appear in your browser toolbar

## Usage

1. **Start Recording**: Click the extension icon and ensure "Recording enabled" is checked
2. **Interact with Web Pages**: Click buttons, fill forms, navigate between pages
3. **View Results**: Click the extension icon to see the generated Gherkin scenarios
4. **Export**: Copy the Gherkin text and save it to a `.feature` file

## Project Structure

```
step-recorder/
├── manifest.json                 # Extension configuration
├── src/
│   ├── background/
│   │   └── background.js         # Service worker for storage and messaging
│   ├── content/
│   │   ├── content.js           # Main content script
│   │   ├── event-listeners.js  # DOM event handling
│   │   └── history-monitor.js   # SPA navigation tracking
│   ├── popup/
│   │   ├── popup.html          # Extension popup UI
│   │   ├── popup.css           # Popup styles
│   │   └── popup.js            # Popup functionality
│   └── utils/
│       ├── selectors.js        # CSS selector generation
│       ├── gherkin.js          # Gherkin conversion
│       └── storage.js          # Chrome storage utilities
├── icons/                       # Extension icons
└── README.md                    # This file
```

## Development

### Prerequisites

- Chrome browser with developer mode enabled
- Basic knowledge of Chrome extension development

### Building

This extension uses ES6 modules and doesn't require a build process. Simply load the `step-recorder` folder as an unpacked extension in Chrome.

### Key Components

- **Background Script**: Handles storage operations and message passing between content scripts and popup
- **Content Scripts**: Inject into web pages to capture user interactions
- **Popup**: Provides UI for viewing and managing recorded steps
- **Utilities**: Modular functions for selector generation, Gherkin conversion, and storage

## API

### Storage Keys

- `recordedSteps`: Array of recorded interaction steps
- `recording`: Boolean indicating if recording is enabled

### Message Commands

- `getSteps`: Retrieve all recorded steps
- `clearSteps`: Clear all recorded steps
- `recordToggle`: Enable/disable recording
- `pushStep`: Add a new step to the recording

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
