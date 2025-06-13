#!/bin/bash
# Setup script for the partials system

echo "🧩 Setting up Partials System for Roblox Region Scanner"
echo "======================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project root directory confirmed"

# Check if partials directory exists
if [ ! -d "public/partials" ]; then
    echo "❌ Error: Partials directory not found. Please ensure the partials system is properly installed."
    exit 1
fi

echo "✅ Partials directory found"

# Count partials
PARTIAL_COUNT=$(ls -1 public/partials/*.html 2>/dev/null | wc -l)
echo "📁 Found $PARTIAL_COUNT partial files"

# List available partials
echo ""
echo "📋 Available Partials:"
for partial in public/partials/*.html; do
    if [ -f "$partial" ]; then
        basename=$(basename "$partial" .html)
        echo "   - $basename"
    fi
done

echo ""
echo "🚀 Quick Start Options:"
echo ""
echo "1. 📖 View the demo page:"
echo "   Open http://localhost:3000/partials-demo.html"
echo ""
echo "2. 🔧 Use the partials version of the main app:"
echo "   Open http://localhost:3000/index-partials.html"
echo ""
echo "3. 🎯 Run the integrated demo:"
echo "   Open http://localhost:3000/?demo=partials"
echo ""
echo "4. 📚 Read the documentation:"
echo "   cat PARTIALS.md"
echo ""

# Check if server is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server appears to be running on http://localhost:3000"
else
    echo "⚠️  Server doesn't appear to be running. Start it with:"
    echo "   npm start"
fi

echo ""
echo "🎉 Partials system is ready to use!"
echo ""
echo "💡 Quick Test Commands (in browser console):"
echo "   await partials.load('header')"
echo "   await partials.render('game-preview', '#some-container', {gameName: 'Test'})"
echo "   partials.getLoadedPartials()"
echo "   await components.init()"
