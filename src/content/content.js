/**
 * Main content script for Step Recorder Chrome Extension
 * Initializes event listeners and history monitoring
 */

import { initializeEventListeners } from './event-listeners.js';
import { initializeHistoryMonitoring } from './history-monitor.js';
import { setRecordingState } from '../utils/storage.js';

/**
 * Initialize the content script
 */
async function initialize() {
  try {
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize history monitoring for SPA navigation
    initializeHistoryMonitoring();
    
    // Set default recording state to enabled if not set
    const { recording } = await chrome.storage.local.get(['recording']);
    if (recording === undefined) {
      await setRecordingState(true);
    }
    
    console.log('Step Recorder content script initialized');
  } catch (error) {
    console.error('Error initializing content script:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
