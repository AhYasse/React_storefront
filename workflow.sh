#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

case "$1" in
  "dev")
    echo -e "${BLUE}🚀 Starting development server...${NC}"
    npm run dev
    ;;
  "build")
    echo -e "${BLUE}🏗️ Running full build pipeline...${NC}"
    bash ./build-frontend.sh
    ;;
  "preview")
    echo -e "${BLUE}👀 Previewing production build...${NC}"
    npm run preview
    ;;
  "clean")
    echo -e "${BLUE}🧹 Cleaning up build artifacts and caches...${NC}"
    rm -rf dist
    rm -rf node_modules/.vite
    echo -e "${GREEN}✅ Cleanup complete.${NC}"
    ;;
  "install")
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    ;;
  *)
    echo "Usage: ./workflow.sh {dev|build|preview|clean|install}"
    echo ""
    echo "Commands:"
    echo "  dev      - Start the Vite development server"
    echo "  build    - Run lint, typecheck, and production build"
    echo "  preview  - Serve the production build locally"
    echo "  clean    - Remove dist folder and Vite cache"
    echo "  install  - Run npm install"
    exit 1
    ;;
esac