/**
 * Utility functions for converting recorded steps to Gherkin format
 */

/**
 * Convert a single step to Gherkin format
 * @param {Object} step - Recorded step object
 * @param {number} index - Step index (0-based)
 * @returns {string|null} Gherkin step or null if not supported
 */
export function stepToGherkin(step, index) {
  const safe = (value) => (value ?? '').toString().replace(/\n+/g, ' ').trim();
  
  switch (step.type) {
    case 'navigate':
      return (index === 0 ? 'Given' : 'And') + ` I open "${safe(step.url)}"`;
      
    case 'click': {
      const target = step.text ? 
        `"${safe(step.text)}"` : 
        step.selector ? 
        `element "${step.selector}"` : 
        'element';
      return (index === 0 ? 'When' : 'And') + ` I click ${target}`;
    }
    
    case 'input': {
      const value = step.value === '••••' ? '(a password)' : `"${safe(step.value)}"`;
      const target = step.selector ? ` into "${step.selector}"` : '';
      return (index === 0 ? 'When' : 'And') + ` I type ${value}${target}`;
    }
    
    case 'submit':
      return (index === 0 ? 'When' : 'And') + ` I submit the form`;
      
    default:
      return null;
  }
}

/**
 * Convert array of steps to complete Gherkin feature
 * @param {Array} steps - Array of recorded steps
 * @param {string} featureName - Optional feature name
 * @returns {string} Complete Gherkin feature
 */
export function toGherkin(steps, featureName = '') {
  const scenarioName = steps.find(step => step.type === 'navigate')?.url || 'Recorded scenario';
  
  const lines = [
    'Feature: ' + (featureName || 'Recorded user journey'),
    '',
    '  Scenario: ' + scenarioName,
  ];
  
  steps.forEach((step, index) => {
    const line = stepToGherkin(step, index);
    if (line) {
      lines.push('    ' + line);
    }
  });
  
  // Add placeholder for verification step
  lines.push('    Then I should see the expected result');
  
  return lines.join('\n');
}
