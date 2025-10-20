/**
 * Utility functions for building CSS selectors from DOM elements
 */

const MAX_TEXT = 60;

/**
 * Extract text content from an element
 * @param {Element} el - DOM element
 * @returns {string} Truncated text content
 */
export function getElementText(el) {
  if (!el) return '';
  const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
  if (text) return text.slice(0, MAX_TEXT);
  // fallback to associated label text if element has no visible text
  const label = getElementLabelText(el);
  return label.slice(0, MAX_TEXT);
}

/**
 * Get role attribute from element
 * @param {Element} el - DOM element
 * @returns {string|null} Role attribute value
 */
export function getElementRole(el) {
  return el.getAttribute('role');
}

/**
 * Get aria-label or aria-labelledby from element
 * @param {Element} el - DOM element
 * @returns {string|null} Aria label
 */
export function getElementAriaLabel(el) {
  return el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
}

/**
 * Resolve associated label text for a form control if present
 * Checks aria-labelledby, wrapping <label>, and label[for]
 * @param {Element} el - DOM element
 * @returns {string} Label text or empty string
 */
export function getElementLabelText(el) {
  if (!el) return '';

  // aria-labelledby can reference one or more IDs
  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/).filter(Boolean);
    const parts = ids.map(id => {
      const ref = document.getElementById(id);
      return (ref?.innerText || ref?.textContent || '').trim().replace(/\s+/g, ' ');
    }).filter(Boolean);
    const joined = parts.join(' ').trim();
    if (joined) return joined;
  }

  // if element is wrapped by a <label>
  const wrappingLabel = el.closest('label');
  if (wrappingLabel) {
    const labelText = (wrappingLabel.innerText || wrappingLabel.textContent || '').trim().replace(/\s+/g, ' ');
    if (labelText) return labelText;
  }

  // label[for="id"] association
  if (el.id) {
    const forLabel = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (forLabel) {
      const labelText = (forLabel.innerText || forLabel.textContent || '').trim().replace(/\s+/g, ' ');
      if (labelText) return labelText;
    }
  }

  // aria-label as a last resort
  const aria = el.getAttribute('aria-label');
  return (aria || '').trim();
}

/**
 * Get data-testid, data-test, or data-qa from element
 * @param {Element} el - DOM element
 * @returns {string|null} Test ID attribute
 */
export function getElementTestId(el) {
  return el.getAttribute('data-testid') || 
         el.getAttribute('data-test') || 
         el.getAttribute('data-qa');
}

/**
 * Build ID selector if element has valid ID
 * @param {Element} el - DOM element
 * @returns {string|null} ID selector or null
 */
export function buildIdSelector(el) {
  const id = el.id && /^[A-Za-z_][\w\-\:\.]*$/.test(el.id) ? el.id : null;
  return id ? `#${CSS.escape(el.id)}` : null;
}

/**
 * Build name selector
 * @param {Element} el - DOM element
 * @returns {string|null} Name selector or null
 */
export function buildNameSelector(el) {
  const name = el.getAttribute('name');
  return name ? `[name="${name}"]` : null;
}

/**
 * Build tag with nth-of-type selector
 * @param {Element} el - DOM element
 * @returns {string} Tag selector with nth-of-type if needed
 */
export function buildTagNthSelector(el) {
  const tag = el.tagName.toLowerCase();
  if (!el.parentElement) return tag;
  
  const siblings = Array.from(el.parentElement.children)
    .filter(child => child.tagName === el.tagName);
  
  if (siblings.length === 1) return tag;
  
  const index = siblings.indexOf(el) + 1;
  return `${tag}:nth-of-type(${index})`;
}

/**
 * Build CSS path selector with limited depth
 * @param {Element} el - DOM element
 * @param {number} depth - Maximum depth to traverse
 * @returns {string} CSS path selector
 */
export function buildCssPath(el, depth = 4) {
  const parts = [];
  let node = el;
  
  while (node && parts.length < depth) {
    const idSelector = buildIdSelector(node);
    if (idSelector) {
      parts.unshift(idSelector);
      break;
    }
    
    const testId = getElementTestId(node);
    if (testId) {
      parts.unshift(`[data-testid="${testId}"]`);
      break;
    }
    
    const nameSelector = buildNameSelector(node);
    const tagSelector = buildTagNthSelector(node);
    parts.unshift(nameSelector ? `${tagSelector}${nameSelector}` : tagSelector);
    node = node.parentElement;
  }
  
  return parts.join(' > ');
}

/**
 * Build the best selector for an element
 * @param {Element} el - DOM element
 * @returns {string} Best available selector
 */
export function buildSelector(el) {
  if (!el) return '';
  
  // Priority order: data-testid > id > aria-label > role > css path
  const testId = getElementTestId(el);
  if (testId) return `[data-testid="${testId}"]`;
  
  const idSelector = buildIdSelector(el);
  if (idSelector) return idSelector;
  
  const ariaLabel = getElementAriaLabel(el);
  if (ariaLabel) return `[aria-label="${ariaLabel}"]`;
  
  const role = getElementRole(el);
  if (role) return `${el.tagName.toLowerCase()}[role="${role}"]`;
  
  return buildCssPath(el, 5);
}

/**
 * Check if element is interactive
 * @param {Element} el - DOM element
 * @returns {boolean} True if element is interactive
 */
export function isInteractiveElement(el) {
  const tag = el.tagName?.toLowerCase();
  const interactiveTags = ['a', 'button', 'input', 'textarea', 'select', 'summary', 'option'];
  
  return interactiveTags.includes(tag) || 
         el.onclick || 
         el.getAttribute?.('role') === 'button';
}
