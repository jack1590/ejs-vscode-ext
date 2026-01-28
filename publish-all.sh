#!/bin/bash

# Publish to both Microsoft VS Code Marketplace and Open VSX Registry

set -e

echo "🔨 Compiling TypeScript..."
npm run compile

echo ""
echo "📦 Packaging extension..."
vsce package

echo ""
echo "🚀 Publishing to Microsoft Marketplace..."
vsce publish

echo ""
echo "🌍 Publishing to Open VSX (for Cursor & other forks)..."
ovsx publish

echo ""
echo "✅ Successfully published to both marketplaces!"
echo ""
echo "Your extension is now available on:"
echo "  - VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=jack1590.ejs-navigator"
echo "  - Open VSX: https://open-vsx.org/extension/jack1590/ejs-navigator"
echo ""
