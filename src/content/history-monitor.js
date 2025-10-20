/**
 * History monitoring for SPA navigation
 */

/**
 * Wrap history methods to detect SPA navigation
 * @param {string} method - History method name
 */
function wrapHistoryMethod(method) {
  const original = history[method];
  history[method] = function(...args) {
    const result = original.apply(this, args);
    
    // Record navigation after state change
    chrome.runtime.sendMessage({ 
      cmd: 'pushStep', 
      step: { 
        type: 'navigate', 
        url: location.href 
      } 
    }).catch(error => {
      console.error('Error recording SPA navigation:', error);
    });
    
    return result;
  };
}

/**
 * Handle popstate events (back/forward navigation)
 */
function handlePopState() {
  chrome.runtime.sendMessage({ 
    cmd: 'pushStep', 
    step: { 
      type: 'navigate', 
      url: location.href 
    } 
  }).catch(error => {
    console.error('Error recording popstate navigation:', error);
  });
}

/**
 * Initialize history monitoring
 */
export function initializeHistoryMonitoring() {
  // Wrap pushState and replaceState methods
  wrapHistoryMethod('pushState');
  wrapHistoryMethod('replaceState');
  
  // Listen for popstate events
  window.addEventListener('popstate', handlePopState);
  
  console.log('Step Recorder history monitoring initialized');
}
