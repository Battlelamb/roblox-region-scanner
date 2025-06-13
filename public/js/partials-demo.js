// 📁 public/js/partials-demo.js
// Demo file showing how to use the partials system

import partials from './partials.js';
import components from './components.js';

// Demo function to show various partials features
async function runPartialsDemo() {
  console.log('🎯 Starting Partials System Demo...');

  // 1. Basic partial loading
  console.log('\n1️⃣ Basic Partial Loading:');
  const headerHtml = await partials.load('header');
  console.log('✅ Header partial loaded:', headerHtml.substring(0, 50) + '...');

  // 2. Template interpolation
  console.log('\n2️⃣ Template Interpolation:');
  const gamePreviewHtml = await partials.load('game-preview');
  const interpolated = partials.interpolate(gamePreviewHtml, {
    thumbnailUrl: 'https://example.com/game.jpg',
    gameName: 'Epic Adventure Game',
    playing: '1,234',
    visits: '5,678,901'
  });
  console.log('✅ Interpolated game preview:', interpolated.substring(0, 100) + '...');

  // 3. Rendering partials to DOM
  console.log('\n3️⃣ Rendering to DOM:');
  
  // Create a demo container
  const demoContainer = document.createElement('div');
  demoContainer.id = 'demo-container';
  demoContainer.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 300px;
    background: white;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '× Close Demo';
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
  `;
  closeBtn.onclick = () => demoContainer.remove();
  
  demoContainer.appendChild(closeBtn);
  document.body.appendChild(demoContainer);

  // Render different partials to the demo container
  await partials.render('search-panel', demoContainer, {
    placeholder: 'Demo: Enter game ID...',
    buttonText: 'Demo Search'
  });

  console.log('✅ Demo search panel rendered to DOM');

  // 4. Batch preloading
  console.log('\n4️⃣ Batch Preloading:');
  const startTime = performance.now();
  await partials.preload(['header', 'game-preview', 'search-panel', 'loader']);
  const endTime = performance.now();
  console.log(`✅ Preloaded 4 partials in ${(endTime - startTime).toFixed(2)}ms`);

  // 5. Cache management
  console.log('\n5️⃣ Cache Management:');
  console.log('📦 Loaded partials:', partials.getLoadedPartials());
  
  // 6. Components system demo
  console.log('\n6️⃣ Components System:');
  if (!components.isInitialized()) {
    console.log('⚠️  Components not initialized, initializing now...');
    await components.init();
  }
  
  // Update components with demo data
  await components.updateGamePreview({
    thumbnailUrl: 'https://via.placeholder.com/150x150/4CAF50/white?text=DEMO',
    name: 'Demo Game: Partials Showcase',
    playing: 42,
    visits: 1337
  });
  
  await components.updateLoader('Demo: Components Working!', 75);
  
  console.log('✅ Components updated with demo data');

  console.log('\n🎉 Partials Demo Complete! Check the demo panel on the right.');
  
  // Auto-remove demo after 10 seconds
  setTimeout(() => {
    if (demoContainer.parentNode) {
      demoContainer.remove();
      console.log('🧹 Demo container auto-removed');
    }
  }, 10000);
}

// Performance comparison function
async function comparePerformance() {
  console.log('\n⚡ Performance Comparison:');
  
  const iterations = 10;
  
  // Test 1: Loading with cache
  console.time('With Cache');
  for (let i = 0; i < iterations; i++) {
    await partials.load('header', true);
  }
  console.timeEnd('With Cache');
  
  // Test 2: Loading without cache
  console.time('Without Cache');
  for (let i = 0; i < iterations; i++) {
    await partials.load('header', false);
  }
  console.timeEnd('Without Cache');
}

// Export demo functions for manual testing
window.runPartialsDemo = runPartialsDemo;
window.comparePartialsPerformance = comparePerformance;

// Auto-run demo if URL contains ?demo=partials
if (window.location.search.includes('demo=partials')) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runPartialsDemo, 2000); // Wait 2s for app to load
  });
}

export { runPartialsDemo, comparePerformance };
