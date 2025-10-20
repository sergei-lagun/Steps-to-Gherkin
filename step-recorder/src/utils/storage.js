/**
 * Storage utility functions for Chrome extension
 */

const STORAGE_KEYS = {
  RECORDED_STEPS: 'recordedSteps',
  RECORDING: 'recording'
};

/**
 * Get recorded steps from storage
 * @returns {Promise<Array>} Array of recorded steps
 */
export async function getRecordedSteps() {
  try {
    const data = await chrome.storage.local.get([STORAGE_KEYS.RECORDED_STEPS]);
    return data[STORAGE_KEYS.RECORDED_STEPS] || [];
  } catch (error) {
    console.error('Error getting recorded steps:', error);
    return [];
  }
}

/**
 * Save recorded steps to storage
 * @param {Array} steps - Array of steps to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveRecordedSteps(steps) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.RECORDED_STEPS]: steps });
    return true;
  } catch (error) {
    console.error('Error saving recorded steps:', error);
    return false;
  }
}

/**
 * Add a new step to recorded steps
 * @param {Object} step - Step object to add
 * @returns {Promise<boolean>} Success status
 */
export async function addStep(step) {
  try {
    const steps = await getRecordedSteps();
    steps.push({ 
      timestamp: Date.now(), 
      ...step 
    });
    return await saveRecordedSteps(steps);
  } catch (error) {
    console.error('Error adding step:', error);
    return false;
  }
}

/**
 * Clear all recorded steps
 * @returns {Promise<boolean>} Success status
 */
export async function clearRecordedSteps() {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.RECORDED_STEPS]: [] });
    return true;
  } catch (error) {
    console.error('Error clearing recorded steps:', error);
    return false;
  }
}

/**
 * Get recording state
 * @returns {Promise<boolean>} Recording enabled status
 */
export async function getRecordingState() {
  try {
    const data = await chrome.storage.local.get([STORAGE_KEYS.RECORDING]);
    return data[STORAGE_KEYS.RECORDING] !== false; // Default to true
  } catch (error) {
    console.error('Error getting recording state:', error);
    return true;
  }
}

/**
 * Set recording state
 * @param {boolean} enabled - Recording enabled status
 * @returns {Promise<boolean>} Success status
 */
export async function setRecordingState(enabled) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.RECORDING]: enabled });
    return true;
  } catch (error) {
    console.error('Error setting recording state:', error);
    return false;
  }
}
