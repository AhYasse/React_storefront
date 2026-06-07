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

echo "📦 [4/4] Build Size Report:"
echo "---------------------------------------------------"
# Show human-readable sizes of the generated assets
ls -lh dist/ | awk '{print $9, $5}' | column -t
echo "---------------------------------------------------"
echo "✅ Build completed successfully!"