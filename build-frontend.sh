#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting production build pipeline..."
echo "---------------------------------------------------"

echo "🔍 [1/4] Running ESLint..."
npm run lint

echo "🛡️ [2/4] Running TypeScript type check..."
npx tsc --noEmit

echo "🏗️ [3/4] Building Vite production bundle..."
npm run build

echo "📁 Copying index.html to 404.html for SPA routing support..."
cp dist/index.html dist/404.html

echo "📦 [4/4] Build Size Report:"
echo "---------------------------------------------------"
echo "Total dist size: $(du -sh dist | awk '{print $1}')"
echo "Top assets:"
find dist/assets -type f \( -name "*.js" -o -name "*.css" \) -exec du -h {} + | sort -hr | head -n 5
echo "---------------------------------------------------"
echo "✅ Build completed successfully!"