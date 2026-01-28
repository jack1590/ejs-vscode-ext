# Quick Start Guide

## Installation & Testing

### Option 1: Test in Development Mode (Recommended First)

1. Open the extension folder in VSCode:
   ```bash
   cd vscode-ejs-navigator
   code .
   ```

2. Press `F5` to launch the Extension Development Host
   - This opens a new VSCode window with your extension loaded
   - Open your Roku project in this new window

3. Test the extension:
   - Open any `.bs`, `.brs`, or `.xml` file
   - Find an EJS template like `"{{%- s(paletteV2.primary.orange) %}}"`
   - **Cmd+Click** (Mac) or **Ctrl+Click** (Windows/Linux) on the path
   - You should jump to the definition in `descarga.json`!
   - **Hover** over the path to see a preview of the value

### Option 2: Package and Install Locally

1. Install vsce (VSCode Extension Manager):
   ```bash
   npm install -g @vscode/vsce
   ```

2. Package the extension:
   ```bash
   cd vscode-ejs-navigator
   vsce package
   ```
   This creates a `.vsix` file

3. Install in VSCode:
   - Open VSCode
   - Go to Extensions (Cmd+Shift+X)
   - Click "..." menu → "Install from VSIX..."
   - Select the generated `.vsix` file

## Features

### 1. Go to Definition (Cmd/Ctrl + Click)
Works with these patterns:
```brightscript
' String helper
"{{%- s(paletteV2.primary.orange) %}}"

' Object helper
"{{%- o(Application.primaryBackground) %}}"

' Direct value
"{{%= StandardButton.fontSize %}}"

' Constants
"{{%- s(CONST.Video.videoTypes.MOVIE) %}}"
```

### 2. Hover Preview
Hover over any EJS variable to see:
- The actual value from JSON
- The file and line number where it's defined

### 3. Multi-file Support
Automatically indexes:
- `product/descarga.json`
- `data/constants.json`

## Configuration

Add to your `.vscode/settings.json` if your files are in different locations:

```json
{
  "ejsNavigator.productDataPath": "product/descarga.json",
  "ejsNavigator.constantsPath": "data/constants.json"
}
```

## Troubleshooting

### Extension not activating?
- Check the Output panel (View → Output)
- Select "EJS Navigator" from the dropdown
- Look for errors

### Go to Definition not working?
1. Make sure the JSON files are indexed:
   - Check console: "Indexed: /path/to/descarga.json"
2. Verify your cursor is inside the EJS expression
3. Try hovering first to see if the path is recognized

### Need to re-index?
- Save any JSON file to trigger re-indexing
- Or reload the window: Cmd+Shift+P → "Developer: Reload Window"

## Development

### Watch Mode
For active development:
```bash
npm run watch
```
Then press F5 to launch Extension Development Host

### Making Changes
1. Edit TypeScript files in `src/`
2. Save (compilation happens automatically with watch mode)
3. Reload the Extension Development Host (Cmd+R in the dev window)

## Next Steps

### Potential Enhancements:
1. **Auto-completion** for EJS paths
2. **Diagnostics** for invalid paths
3. **Refactoring support** (rename across files)
4. **Support for ENV, CONFIG, EVENT, PAGE** prefixes with separate file indexing
5. **Performance optimization** for very large JSON files
6. **Multi-root workspace** support

### Publishing to VS Marketplace:
```bash
vsce publish
```
(Requires a publisher account on VS Marketplace)

## File Structure

```
vscode-ejs-navigator/
├── src/
│   ├── extension.ts           # Extension entry point
│   ├── ejsParser.ts           # Parses EJS syntax
│   ├── ejsDefinitionProvider.ts   # Go to definition
│   ├── ejsHoverProvider.ts    # Hover previews
│   └── jsonIndexer.ts         # Indexes JSON files
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript config
└── README.md                  # User documentation
```
