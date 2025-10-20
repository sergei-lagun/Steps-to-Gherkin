/**
 * Popup script for Step Recorder Chrome Extension
 * Handles UI interactions and Gherkin generation
 */

import { toGherkin } from '../utils/gherkin.js';

/**
 * DOM elements
 */
const elements = {
  toggle: null,
  refresh: null,
  clear: null,
  feature: null,
  gherkin: null
};

/**
 * Initialize DOM elements
 */
function initializeElements() {
  elements.toggle = document.getElementById('toggle');
  elements.refresh = document.getElementById('refresh');
  elements.clear = document.getElementById('clear');
  elements.feature = document.getElementById('feature');
  elements.gherkin = document.getElementById('gherkin');
}

/**
 * Send message to background script
 * @param {Object} message - Message to send
 * @returns {Promise} Response from background script
 */
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Get recording state from storage
 * @returns {Promise<boolean>} Recording state
 */
async function getRecordingState() {
  try {
    const data = await chrome.storage.local.get(['recording']);
    return data.recording !== false; // Default to true
  } catch (error) {
    console.error('Error getting recording state:', error);
    return true;
  }
}

/**
 * Set recording state
 * @param {boolean} enabled - Recording enabled
 * @returns {Promise<boolean>} Success status
 */
async function setRecordingState(enabled) {
  try {
    await chrome.storage.local.set({ recording: enabled });
    return true;
  } catch (error) {
    console.error('Error setting recording state:', error);
    return false;
  }
}

/**
 * Refresh the Gherkin output
 */
async function refreshGherkin() {
  try {
    const featureName = elements.feature.value.trim();
    const steps = await sendMessage({ cmd: 'getSteps' });
    elements.gherkin.value = toGherkin(steps, featureName);
  } catch (error) {
    console.error('Error refreshing Gherkin:', error);
    elements.gherkin.value = 'Error loading steps. Please try again.';
  }
}

/**
 * Clear all recorded steps
 */
async function clearSteps() {
  try {
    await sendMessage({ cmd: 'clearSteps' });
    await refreshGherkin();
  } catch (error) {
    console.error('Error clearing steps:', error);
    alert('Error clearing steps. Please try again.');
  }
}

/**
 * Handle recording toggle
 * @param {Event} event - Change event
 */
async function handleToggleChange(event) {
  try {
    const enabled = event.target.checked;
    await setRecordingState(enabled);
  } catch (error) {
    console.error('Error toggling recording:', error);
    // Revert checkbox state on error
    event.target.checked = !event.target.checked;
    alert('Error updating recording state. Please try again.');
  }
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
  elements.refresh.addEventListener('click', refreshGherkin);
  elements.clear.addEventListener('click', clearSteps);
  elements.toggle.addEventListener('change', handleToggleChange);
}

/**
 * Initialize the popup
 */
async function initialize() {
  try {
    initializeElements();
    initializeEventListeners();
    
    // Load initial state
    const recording = await getRecordingState();
    elements.toggle.checked = recording;
    
    // Load initial Gherkin
    await refreshGherkin();
    
    console.log('Step Recorder popup initialized');
  } catch (error) {
    console.error('Error initializing popup:', error);
    elements.gherkin.value = 'Error initializing popup. Please refresh.';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
