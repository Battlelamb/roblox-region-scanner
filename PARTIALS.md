# 🧩 Partials System

A lightweight, flexible partial/component system for the Roblox Region Scanner application that allows you to break down your HTML into reusable, maintainable components.

## 📋 Overview

The partials system provides:
- **Component-based architecture** - Break large HTML files into smaller, focused partials
- **Template interpolation** - Dynamic data binding with `{{variable}}` syntax
- **Caching** - Improved performance through intelligent caching
- **Async loading** - Non-blocking partial loading
- **Batch operations** - Efficient bulk operations

## 🚀 Quick Start

### 1. Basic Usage

```javascript
import partials from './js/partials.js';

// Load a partial
const html = await partials.load('header');

// Render a partial to DOM with data
await partials.render('game-preview', '#container', {
    gameName: 'Epic Game',
    playing: '1,234',
    visits: '567,890'
});
```

### 2. Using the Components Manager

```javascript
import components from './js/components.js';

// Initialize all components
await components.init();

// Update specific components
await components.updateGamePreview({
    name: 'New Game',
    playing: 5000,
    visits: 1000000
});
```

## 📁 File Structure

```
public/
├── partials/                     # Partial HTML files
│   ├── header.html              # App header
│   ├── game-preview.html        # Game preview panel
│   ├── search-panel.html        # Search input
│   ├── advanced-settings.html   # Settings panel
│   ├── game-info.html          # Game info sidebar
│   ├── sidebar-tabs.html       # Navigation tabs
│   ├── filters-panel.html      # Filters
│   ├── server-list-panel.html  # Server list
│   ├── ad-banner.html          # Advertisement
│   └── loader.html             # Loading overlay
├── js/
│   ├── partials.js             # Core partials system
│   ├── components.js           # Components manager
│   ├── app-partials.js         # Main app using partials
│   └── partials-demo.js        # Demo utilities
├── index-partials.html         # Main app with partials
└── partials-demo.html          # Interactive demo
```

## 🎯 Available Partials

| Partial | Description | Template Variables |
|---------|-------------|-------------------|
| `header` | Application header | `title` |
| `game-preview` | Game preview panel | `thumbnailUrl`, `gameName`, `playing`, `visits` |
| `search-panel` | Search input panel | `placeholder`, `buttonText` |
| `advanced-settings` | Settings panel | `maxServers`, `batchSize`, `delay` |
| `game-info` | Game info sidebar | `thumbnailUrl`, `gameName`, `playing`, `visits` |
| `sidebar-tabs` | Navigation tabs | _(no variables)_ |
| `filters-panel` | Filters panel | `maxPing` |
| `server-list-panel` | Server list | _(no variables)_ |
| `ad-banner` | Advertisement | `adContent`, `adDescription` |
| `loader` | Loading overlay | `message`, `progress` |

## 🔧 API Reference

### PartialsManager

#### Methods

- `load(partialName, useCache = true)` - Load a partial HTML file
- `render(partialName, container, data = {})` - Render partial to DOM
- `append(partialName, container, data = {})` - Append partial to DOM
- `interpolate(html, data)` - Interpolate template variables
- `preload(partialNames)` - Preload multiple partials
- `clearCache()` - Clear the cache
- `getLoadedPartials()` - Get list of loaded partials

### ComponentsManager

#### Methods

- `init()` - Initialize all components
- `updateComponent(componentName, data)` - Update specific component
- `updateGamePreview(gameData)` - Update game preview
- `updateGameInfo(gameData)` - Update game info
- `updateLoader(message, progress)` - Update loader
- `isInitialized()` - Check if initialized
- `reinit()` - Reinitialize all components

## 💡 Template Interpolation

Partials support simple template interpolation using `{{variable}}` syntax:

```html
<!-- partial: game-info.html -->
<h3>{{gameName}}</h3>
<p>Playing: {{playing}}</p>
<p>Visits: {{visits}}</p>
```

```javascript
// Usage
await partials.render('game-info', '#container', {
    gameName: 'Adventure Quest',
    playing: '2,500',
    visits: '1,000,000'
});
```

## ⚡ Performance Features

### Caching
- Partials are cached after first load
- Use `useCache: false` to bypass cache
- Call `clearCache()` to reset

### Batch Loading
```javascript
// Preload multiple partials efficiently
await partials.preload([
    'header', 
    'game-preview', 
    'search-panel'
]);
```

### Async Operations
All operations are async and non-blocking:
```javascript
// These run in parallel
const [header, footer] = await Promise.all([
    partials.load('header'),
    partials.load('footer')
]);
```

## 🎮 Demo

Visit `/partials-demo.html` for an interactive demonstration of:
- Loading different partials
- Template interpolation
- Performance testing
- Cache management
- System status

Or add `?demo=partials` to the main app URL for an integrated demo.

## 🔄 Migration Guide

### From Static HTML

**Before:**
```html
<!-- All in one file -->
<header class="app-header">
    <h1>Roblox Region Scanner</h1>
</header>
<div class="game-preview">
    <!-- Complex HTML structure -->
</div>
```

**After:**
```html
<!-- Main file -->
<div id="header-container"></div>
<div id="game-preview-container"></div>

<script type="module">
import components from './js/components.js';
await components.init();
</script>
```

### Benefits of Migration

1. **Maintainability** - Smaller, focused files
2. **Reusability** - Components can be reused
3. **Performance** - Lazy loading and caching
4. **Development** - Easier to work with individual components
5. **Testing** - Components can be tested in isolation

## 🛠 Development Workflow

1. **Create Partials** - Break down HTML into logical components
2. **Add Template Variables** - Use `{{variable}}` where needed
3. **Update Components Manager** - Add default data and update methods
4. **Test** - Use the demo page to verify functionality
5. **Integrate** - Update main app to use new partials

## 🔍 Debugging

Enable debug logging:
```javascript
// Check loaded partials
console.log(partials.getLoadedPartials());

// Listen for render events
document.addEventListener('partialRendered', (e) => {
    console.log('Rendered:', e.detail.partialName);
});

// Check component status
console.log('Components initialized:', components.isInitialized());
```

## 🤝 Contributing

When adding new partials:

1. Create the HTML file in `/partials/`
2. Add template variables with `{{variable}}` syntax
3. Update the components manager with default data
4. Add the partial to the preload list
5. Update this documentation
6. Test with the demo page

## 📄 License

This partials system is part of the Roblox Region Scanner project and follows the same license terms.
