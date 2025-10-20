/**
 * Background script for Step Recorder Chrome Extension
 * Handles storage operations and message passing
 */

import { addStep, getRecordedSteps, clearRecordedSteps, setRecordingState } from '../utils/storage.js';

/**
 * Handle navigation events from webNavigation API
 * @param {Object} details - Navigation details
 */
function handleNavigation(details) {
  // Only handle main frame navigations
  if (details.frameId !== 0) return;
  
  addStep({ 
    type: 'navigate', 
    url: details.url 
  }).catch(error => {
    console.error('Error recording navigation:', error);
  });
}

/**
 * Handle messages from content scripts and popup
 * @param {Object} message - Message object
 * @param {Object} sender - Message sender
 * @param {Function} sendResponse - Response callback
 * @returns {boolean} True if response is async
 */
async function handleMessage(message, sender, sendResponse) {
  try {
    switch (message.cmd) {
      case 'getSteps':
        const steps = await getRecordedSteps();
        sendResponse(steps);
        return true;
        
      case 'clearSteps':
        const clearSuccess = await clearRecordedSteps();
        sendResponse({ success: clearSuccess });
        return true;
        
      case 'recordToggle':
        const toggleSuccess = await setRecordingState(message.enabled);
        sendResponse({ success: toggleSuccess });
        return true;
        
      case 'pushStep':
        const addSuccess = await addStep(message.step);
        sendResponse({ success: addSuccess });
        return true;
        
      default:
        console.warn('Unknown message command:', message.cmd);
        sendResponse({ success: false, error: 'Unknown command' });
        return false;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
    return false;
  }
}

// Event listeners
chrome.webNavigation.onCommitted.addListener(handleNavigation);
chrome.runtime.onMessage.addListener(handleMessage);

// Initialize extension
console.log('Step Recorder extension background script loaded');
