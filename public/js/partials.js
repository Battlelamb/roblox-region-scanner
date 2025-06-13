// 📁 public/js/partials.js
// Partials system for loading and managing HTML components

class PartialsManager {
  constructor() {
    this.cache = new Map();
    this.loadedPartials = new Set();
  }

  /**
   * Load a partial HTML file
   * @param {string} partialName - Name of the partial (without .html extension)
   * @param {boolean} useCache - Whether to use cached version if available
   * @returns {Promise<string>} - HTML content of the partial
   */
  async load(partialName, useCache = true) {
    if (useCache && this.cache.has(partialName)) {
      return this.cache.get(partialName);
    }

    try {
      const response = await fetch(`/partials/${partialName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load partial: ${partialName}`);
      }
      
      const html = await response.text();
      this.cache.set(partialName, html);
      this.loadedPartials.add(partialName);
      
      return html;
    } catch (error) {
      console.error(`Error loading partial ${partialName}:`, error);
      return '';
    }
  }

  /**
   * Render a partial into a container element
   * @param {string} partialName - Name of the partial
   * @param {HTMLElement|string} container - Container element or selector
   * @param {object} data - Data to interpolate into the partial
   * @returns {Promise<HTMLElement>} - The container element
   */
  async render(partialName, container, data = {}) {
    const element = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!element) {
      console.error(`Container not found: ${container}`);
      return null;
    }

    const html = await this.load(partialName);
    const interpolatedHtml = this.interpolate(html, data);
    
    element.innerHTML = interpolatedHtml;
    
    // Trigger a custom event for when a partial is rendered
    element.dispatchEvent(new CustomEvent('partialRendered', {
      detail: { partialName, data }
    }));
    
    return element;
  }

  /**
   * Append a partial to a container element
   * @param {string} partialName - Name of the partial
   * @param {HTMLElement|string} container - Container element or selector
   * @param {object} data - Data to interpolate into the partial
   * @returns {Promise<HTMLElement>} - The newly created element
   */
  async append(partialName, container, data = {}) {
    const element = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!element) {
      console.error(`Container not found: ${container}`);
      return null;
    }

    const html = await this.load(partialName);
    const interpolatedHtml = this.interpolate(html, data);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = interpolatedHtml;
    
    // If the partial has a single root element, append that
    // Otherwise, append all children
    const children = Array.from(tempDiv.children);
    const newElement = children.length === 1 ? children[0] : tempDiv;
    
    if (children.length === 1) {
      element.appendChild(children[0]);
    } else {
      children.forEach(child => element.appendChild(child));
    }
    
    return newElement;
  }

  /**
   * Simple template interpolation
   * @param {string} html - HTML template with {{variable}} placeholders
   * @param {object} data - Data object to interpolate
   * @returns {string} - Interpolated HTML
   */
  interpolate(html, data) {
    return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }

  /**
   * Preload multiple partials
   * @param {string[]} partialNames - Array of partial names to preload
   * @returns {Promise<void>}
   */
  async preload(partialNames) {
    const promises = partialNames.map(name => this.load(name));
    await Promise.all(promises);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
    this.loadedPartials.clear();
  }

  /**
   * Get list of loaded partials
   * @returns {string[]}
   */
  getLoadedPartials() {
    return Array.from(this.loadedPartials);
  }
}

// Create global instance
const partials = new PartialsManager();

export default partials;
export { PartialsManager };
