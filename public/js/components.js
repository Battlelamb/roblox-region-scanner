// 📁 public/js/components.js
// Component management using the partials system

import partials from './partials.js';

class ComponentsManager {
  constructor() {
    this.initialized = false;
    this.defaultData = {
      header: {
        title: 'Roblox Region Scanner'
      },
      gamePreview: {
        thumbnailUrl: '',
        gameName: 'Game Name',
        playing: '0',
        visits: '0'
      },
      searchPanel: {
        placeholder: 'Enter Roblox Place ID (e.g., 920587237)',
        buttonText: 'Find Servers'
      },
      advancedSettings: {
        maxServers: '100',
        batchSize: '5',
        delay: '500'
      },
      gameInfo: {
        thumbnailUrl: '',
        gameName: 'Game Name',
        playing: 'N/A',
        visits: 'N/A'
      },
      filtersPanel: {
        maxPing: '500'
      },
      adBanner: {
        adContent: 'Your Ad Here',
        adDescription: '300 x 250 Banner Space'
      },
      loader: {
        message: 'Loading...',
        progress: '0'
      }
    };
  }

  /**
   * Initialize all components with default data
   */
  async init() {
    if (this.initialized) return;

    try {
      // Preload all partials for better performance
      await partials.preload([
        'header',
        'game-preview',
        'search-panel', 
        'advanced-settings',
        'game-info',
        'sidebar-tabs',
        'filters-panel',
        'server-list-panel',
        'ad-banner',
        'loader'
      ]);

      // Render all components
      await this.renderAll();
      
      this.initialized = true;
      console.log('✅ Components initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize components:', error);
    }
  }

  /**
   * Render all components with default data
   */
  async renderAll() {
    const renderPromises = [
      partials.render('header', '#app-header-container', this.defaultData.header),
      partials.render('game-preview', '#game-preview-container', this.defaultData.gamePreview),
      partials.render('search-panel', '#search-panel-container', this.defaultData.searchPanel),
      partials.render('advanced-settings', '#advanced-settings-container', this.defaultData.advancedSettings),
      partials.render('game-info', '#game-info-container', this.defaultData.gameInfo),
      partials.render('sidebar-tabs', '#sidebar-tabs-container'),
      partials.render('filters-panel', '#filters-panel-container', this.defaultData.filtersPanel),
      partials.render('server-list-panel', '#server-list-container'),
      partials.render('ad-banner', '#ad-banner-container', this.defaultData.adBanner),
      partials.render('loader', '#loader-container', this.defaultData.loader)
    ];

    await Promise.all(renderPromises);
  }

  /**
   * Update a specific component with new data
   */
  async updateComponent(componentName, data = {}) {
    const containerMap = {
      'header': '#app-header-container',
      'game-preview': '#game-preview-container', 
      'search-panel': '#search-panel-container',
      'advanced-settings': '#advanced-settings-container',
      'game-info': '#game-info-container',
      'sidebar-tabs': '#sidebar-tabs-container',
      'filters-panel': '#filters-panel-container',
      'server-list-panel': '#server-list-container',
      'ad-banner': '#ad-banner-container',
      'loader': '#loader-container'
    };

    const container = containerMap[componentName];
    if (!container) {
      console.error(`Unknown component: ${componentName}`);
      return;
    }

    const mergedData = {
      ...this.defaultData[componentName.replace('-', '').replace('-', '')],
      ...data
    };

    await partials.render(componentName, container, mergedData);
  }

  /**
   * Update game preview data
   */
  async updateGamePreview(gameData) {
    await this.updateComponent('game-preview', {
      thumbnailUrl: gameData.thumbnailUrl || '',
      gameName: gameData.name || 'Game Name',
      playing: gameData.playing?.toLocaleString() || '0',
      visits: gameData.visits?.toLocaleString() || '0'
    });
  }

  /**
   * Update game info sidebar
   */
  async updateGameInfo(gameData) {
    await this.updateComponent('game-info', {
      thumbnailUrl: gameData.thumbnailUrl || '',
      gameName: gameData.name || 'Game Name', 
      playing: gameData.playing?.toLocaleString() || 'N/A',
      visits: gameData.visits?.toLocaleString() || 'N/A'
    });
  }

  /**
   * Update loader component
   */
  async updateLoader(message, progress = 0) {
    await this.updateComponent('loader', {
      message: message,
      progress: progress.toString()
    });
  }

  /**
   * Update filters panel
   */
  async updateFilters(data) {
    await this.updateComponent('filters-panel', {
      maxPing: data.maxPing?.toString() || '500'
    });
  }

  /**
   * Get default data for a component
   */
  getDefaultData(componentName) {
    const key = componentName.replace('-', '').replace('-', '');
    return this.defaultData[key] || {};
  }

  /**
   * Check if components are initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Reinitialize all components (useful for theme changes, etc.)
   */
  async reinit() {
    this.initialized = false;
    partials.clearCache();
    await this.init();
  }
}

// Create global instance
const components = new ComponentsManager();

export default components;
export { ComponentsManager };
