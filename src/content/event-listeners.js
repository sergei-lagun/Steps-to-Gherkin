/**
 * Event listeners for content script
 */

import { buildSelector, getElementText, isInteractiveElement } from '../utils/selectors.js';
import { getRecordingState } from '../utils/storage.js';

/**
 * Send step to background script
 * @param {Object} step - Step object to record
 */
async function recordStep(step) {
  try {
    // Check if recording is enabled
    const isRecording = await getRecordingState();
    if (!isRecording) return;
    
    // Send message to background script
    chrome.runtime.sendMessage({ 
      cmd: 'pushStep', 
      step 
    }).catch(error => {
      console.error('Error sending step to background:', error);
    });
  } catch (error) {
    console.error('Error recording step:', error);
  }
}

/**
 * Handle click events
 * @param {Event} event - Click event
 */
function handleClick(event) {
  const element = event.target.closest('*');
  if (!element || !isInteractiveElement(element)) return;
  
  const step = {
    type: 'click',
    selector: buildSelector(element),
    text: getElementText(element),
    tag: element.tagName?.toLowerCase(),
    url: location.href
  };
  
  recordStep(step);
}

/**
 * Handle change events (form inputs)
 * @param {Event} event - Change event
 */
function handleChange(event) {
  const element = event.target;
  if (!element) return;
  
  let value = '';
  const tagName = element.tagName.toLowerCase();
  
  if (tagName === 'input' || tagName === 'textarea') {
    const type = element.getAttribute('type') || 'text';
    value = type === 'password' ? '••••' : (element.value ?? '');
  } else if (tagName === 'select') {
    value = element.value;
  }
  
  const step = {
    type: 'input',
    selector: buildSelector(element),
    value,
    tag: tagName,
    url: location.href
  };
  
  recordStep(step);
}

/**
 * Handle form submit events
 * @param {Event} event - Submit event
 */
function handleSubmit(event) {
  const element = event.target;
  const step = {
    type: 'submit',
    selector: buildSelector(element),
    text: getElementText(element),
    url: location.href
  };
  
  recordStep(step);
}

/**
 * Initialize event listeners
 */
export function initializeEventListeners() {
  // Add event listeners with capture to ensure we catch all events
  document.addEventListener('click', handleClick, { capture: true });
  document.addEventListener('change', handleChange, { capture: true });
  document.addEventListener('submit', handleSubmit, { capture: true });
  
  console.log('Step Recorder event listeners initialized');
}
