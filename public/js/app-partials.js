// 📁 public/js/app-partials.js
// Main application file using the partials system

import * as dom from "./dom.js";
import * as state from "./state.js";
import * as ui from "./ui.js";
import * as globe from "./globe.js";
import * as api from "./api.js";
import components from "./components.js";

document.addEventListener("DOMContentLoaded", async () => {
  // --- INITIALIZATION ---
  let isGlobeInitialized = false;
  let previewDebounceTimer;

  // Initialize components first
  await components.init();

  state.loadAdvancedSettings();
  ui.runIntroAnimation();
  setupEventListeners();

  // --- CORE LOGIC ---
  function sortServers(servers) {
    const { by, order } = state.currentSort;
    const sorted = [...servers];

    sorted.sort((a, b) => {
      let valA = a[by],
        valB = b[by];
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      const modifier = by === "playing" ? -1 : 1;
      if (valA < valB) return order === "asc" ? -1 * modifier : 1 * modifier;
      if (valA > valB) return order === "asc" ? 1 * modifier : -1 * modifier;
      return 0;
    });

    return sorted;
  }

  function applyFiltersAndRender() {
    let filtered = [...state.allServers];
    if (state.currentFilters.region !== "all") {
      filtered = filtered.filter(
        (s) => s.regionName === state.currentFilters.region
      );
    }
    filtered = filtered.filter(
      (s) => (s.ping || 0) <= state.animatedFilters.maxPing
    );

    const sorted = sortServers(filtered);
    ui.updateFilterStatus(sorted.length, state.allServers.length);

    if (isGlobeInitialized) {
      globe.updateServers(sorted);
    }
    ui.updateServerList(sorted);
  }

  async function showGamePreview(placeId) {
    try {
      await components.updateGamePreview({
        thumbnailUrl: '',
        name: 'Loading...',
        playing: '...',
        visits: '...'
      });
      
      ui.showGamePreviewPanel();

      const gameData = await api.fetchGameDetails(placeId);
      if (gameData) {
        await components.updateGamePreview(gameData);
      }
    } catch (error) {
      console.error("Failed to load game preview:", error);
      await components.updateGamePreview({
        thumbnailUrl: '',
        name: 'Failed to load',
        playing: 'N/A',
        visits: 'N/A'
      });
    }
  }

  async function findServers() {
    const input = dom.placeIdInput.value.trim();
    if (!input) {
      ui.showStatus("Please enter a Place ID.");
      return;
    }

    const placeId = parseInt(input);
    if (isNaN(placeId) || placeId <= 0) {
      ui.showStatus("Please enter a valid numeric Place ID.");
      return;
    }

    // Reset application state
    state.currentPlaceId = placeId;
    state.allServers = [];
    state.currentFilters.region = "all";
    state.animatedFilters.maxPing = 500;

    ui.showView("main");
    ui.showLoader("Finding servers...");

    try {
      // Initialize globe if needed
      if (!isGlobeInitialized) {
        globe.initGlobe();
        isGlobeInitialized = true;
      }

      // Update game info in sidebar
      const gameData = await api.fetchGameDetails(placeId);
      if (gameData) {
        await components.updateGameInfo(gameData);
      }

      // Get servers with progress tracking
      const servers = await api.fetchServersWithProgress(
        placeId,
        state.advancedSettings.serversToScan,
        async (progress, message) => {
          await components.updateLoader(message, progress);
        }
      );

      if (!servers.length) {
        ui.hideLoader();
        ui.showStatus("No servers found for this Place ID.");
        return;
      }

      state.allServers = servers;

      // Process geolocation with progress tracking
      await api.processGeoLocation(
        servers,
        state.advancedSettings.batchSize,
        state.advancedSettings.delayBetweenGeolocationBatches,
        async (processed, total, currentServer) => {
          const progress = Math.round((processed / total) * 100);
          const message = `Processing server locations... (${processed}/${total})`;
          await components.updateLoader(message, progress);

          // Apply filters and render incrementally
          applyFiltersAndRender();
        }
      );

      // Populate region filter dropdown
      ui.populateRegionFilter(servers);

      // Final render
      applyFiltersAndRender();
      ui.hideLoader();

    } catch (error) {
      console.error("Error finding servers:", error);
      ui.hideLoader();
      ui.showStatus(`Error: ${error.message}`);
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Search functionality
    dom.findServersBtn.addEventListener("click", findServers);
    dom.placeIdInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") findServers();
    });

    // Input validation and preview
    dom.placeIdInput.addEventListener("input", (e) => {
      const value = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = value;

      clearTimeout(previewDebounceTimer);
      if (value.length >= 6) {
        previewDebounceTimer = setTimeout(() => {
          showGamePreview(parseInt(value));
        }, 800);
      } else {
        ui.hideGamePreviewPanel();
      }
    });

    // Navigation
    dom.appTitleLink.addEventListener("click", () => {
      ui.showView("initial");
      ui.hideGamePreviewPanel();
      dom.placeIdInput.value = "";
    });

    // Advanced settings
    dom.toggleAdvancedSettings.addEventListener("click", ui.toggleAdvancedSettings);
    
    // Settings inputs
    dom.serversToScanInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      dom.serversToScanValue.textContent = value;
      state.advancedSettings.serversToScan = value;
      state.saveAdvancedSettings();
    });

    dom.batchSizeInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      state.advancedSettings.batchSize = value;
      state.saveAdvancedSettings();
    });

    dom.delayBetweenGeolocationBatchesInput.addEventListener("input", (e) => {
      const value = parseInt(e.target.value);
      state.advancedSettings.delayBetweenGeolocationBatches = value;
      state.saveAdvancedSettings();
    });

    // Filters
    dom.regionFilter.addEventListener("change", (e) => {
      state.currentFilters.region = e.target.value;
      applyFiltersAndRender();
    });

    dom.maxPingFilter.addEventListener("input", (e) => {
      const targetValue = parseInt(e.target.value);
      ui.animateFilterValue("maxPing", targetValue, applyFiltersAndRender);
    });

    // Sorting
    dom.sortBySelect.addEventListener("change", (e) => {
      state.currentSort.by = e.target.value;
      applyFiltersAndRender();
    });

    dom.sortOrderBtn.addEventListener("click", () => {
      state.currentSort.order = state.currentSort.order === "asc" ? "desc" : "asc";
      ui.updateSortButton();
      applyFiltersAndRender();
    });

    // Sidebar tabs
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("sidebar-tab")) {
        const targetTab = e.target.dataset.tab;
        ui.switchSidebarTab(targetTab);
      }
    });

    // Component events
    document.addEventListener("partialRendered", (e) => {
      const { partialName } = e.detail;
      console.log(`✅ Partial rendered: ${partialName}`);
    });
  }

  // --- GLOBAL FUNCTIONS ---
  window.toggleAdBanner = () => {
    const adContainer = document.querySelector(".ad-container");
    if (adContainer) {
      adContainer.classList.toggle("minimized");
    }
  };

  console.log("🚀 App with partials system initialized");
});
