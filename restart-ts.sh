#!/bin/bash
# TypeScript Server Restart Script

echo "🔄 Restarting TypeScript server..."

# Kill any existing TypeScript server processes
pkill -f tsserver 2>/dev/null || true

# Clear TypeScript cache
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf .tsbuildinfo 2>/dev/null || true

echo "✅ TypeScript server cache cleared"
echo ""
echo "📝 Next steps in your IDE (VSCode/Cursor):"
echo "   1. Press Cmd+Shift+P (or Ctrl+Shift+P on Windows)"
echo "   2. Type: 'TypeScript: Restart TS Server'"
echo "   3. Press Enter"
echo ""
echo "The red marker on SearchDialog.tsx should disappear!"
