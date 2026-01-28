#!/bin/bash

echo "🚀 Installing EJS Navigator in Cursor..."
echo ""

# Check if cursor CLI is available
if ! command -v cursor &> /dev/null; then
    echo "❌ Cursor CLI not found. Installing it first..."
    echo ""
    echo "Please run this command first:"
    echo "  Cmd+Shift+P in Cursor → 'Shell Command: Install cursor command in PATH'"
    echo ""
    exit 1
fi

echo "📦 Installing extension from marketplace..."
cursor --install-extension jack1590.ejs-navigator

echo ""
echo "✅ Done! Please restart Cursor to activate the extension."
echo ""
echo "To verify installation:"
echo "  1. Open Cursor"
echo "  2. Cmd+Shift+X (Extensions)"
echo "  3. Search for 'EJS Navigator'"
echo ""
