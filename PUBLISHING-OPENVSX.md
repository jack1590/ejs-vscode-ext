# Publishing to Open VSX Registry (for Cursor)

## Why You Need This

Cursor and other VS Code forks use Open VSX Registry instead of Microsoft's marketplace.
To make your extension appear in Cursor's built-in search, you need to publish to Open VSX.

## Step-by-Step Guide

### 1. Create an Open VSX Account

1. Go to https://open-vsx.org/
2. Click **"Sign Up"** or **"Login"** (top right)
3. Sign in with **GitHub** (easiest option)
4. This will create your Open VSX account automatically

### 2. Create a Personal Access Token

1. After logging in, go to https://open-vsx.org/user-settings/tokens
2. Click **"Create new Access Token"**
3. Give it a name (e.g., "Publishing Token")
4. **Copy the token** immediately (you won't see it again!)
5. Save it somewhere safe (password manager, secure note)

### 3. Install ovsx CLI

```bash
npm install -g ovsx
```

### 4. Login to Open VSX

```bash
ovsx login
```

When prompted, paste your Personal Access Token from step 2.

Or use the token directly:

```bash
ovsx login -p YOUR_ACCESS_TOKEN
```

### 5. Publish Your Extension

```bash
cd /Users/jcjoyac/Documents/client-apps-roku/vscode-ejs-navigator

# Compile and package
npm run compile
npx @vscode/vsce package

# Publish to Open VSX
ovsx publish ejs-navigator-0.0.2.vsix
```

Or publish directly without packaging first:

```bash
ovsx publish -p YOUR_ACCESS_TOKEN
```

### 6. Verify Publication

Go to: https://open-vsx.org/extension/jack1590/ejs-navigator

Your extension should appear there!

## Important Notes

### Namespace/Publisher

- Open VSX uses the same publisher name as VS Code marketplace
- Your publisher: `jack1590`
- Make sure you claim this namespace in Open VSX

### Version Management

- Keep versions in sync between both marketplaces
- Publish to both whenever you release an update:
  ```bash
  # Microsoft Marketplace
  vsce publish
  
  # Open VSX
  ovsx publish
  ```

### Differences from VSCode Marketplace

1. **No Microsoft review**: Open VSX publishes instantly
2. **Open source**: Completely open and free
3. **Used by**: Cursor, VSCodium, Eclipse Theia, Gitpod, etc.

## Quick Publish Script

I'll create a script that publishes to both marketplaces:

```bash
#!/bin/bash
# publish-all.sh - Publish to both marketplaces

set -e

echo "🔨 Compiling extension..."
npm run compile

echo "📦 Packaging..."
vsce package

echo "🚀 Publishing to Microsoft Marketplace..."
vsce publish

echo "🌍 Publishing to Open VSX..."
ovsx publish

echo "✅ Published to both marketplaces!"
```

## Troubleshooting

### "Publisher not found"

You need to create a namespace on Open VSX:
1. Go to https://open-vsx.org/user-settings/namespaces
2. Click "Create Namespace"
3. Enter: `jack1590`
4. Submit

### "Invalid token"

Re-generate your token:
1. https://open-vsx.org/user-settings/tokens
2. Delete old token
3. Create new one
4. Run `ovsx login` again

## After Publishing

Your extension will appear in:
- ✅ **Cursor**: Search in Extensions panel
- ✅ **VSCodium**: Search in Extensions panel  
- ✅ **Eclipse Theia**: Extension marketplace
- ✅ **Gitpod**: Workspace extensions

## Resources

- Open VSX Homepage: https://open-vsx.org/
- Publishing Guide: https://github.com/eclipse/openvsx/wiki/Publishing-Extensions
- Your extension: https://open-vsx.org/extension/jack1590/ejs-navigator
