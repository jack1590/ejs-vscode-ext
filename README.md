# EJS Navigator for Roku

Navigate from EJS template variables in your Roku BrightScript code to their definitions in `descarga.json` and `constants.json`.

## Features

- **Go to Definition**: Ctrl+Click (Cmd+Click on Mac) on EJS variables to jump to their definition in JSON files
- **Hover Preview**: Hover over EJS variables to see their values
- **Multi-file Support**: Supports `descarga.json`, `constants.json`, and other config files

## Supported Patterns

```brightscript
' In .bs, .brs, or .xml files:
"{{%- s(paletteV2.primary.orange) %}}"
"{{%= StandardButton.fontSize %}}"
"{{%- o(Application.primaryBackground) %}}"
"{{%- s(CONST.Video.videoTypes.MOVIE) %}}"
"{{%- s(Fonts.interSemiBold) %}}"
```

## Usage

1. Install the extension
2. Open your Roku project
3. Ctrl+Click (or Cmd+Click) on any EJS variable to navigate to its definition
4. Hover over variables to see their values

## Configuration

The extension can be configured in VSCode settings (Settings → Extensions → EJS Navigator):

### `ejsNavigator.jsonFiles` (Array)

Specify which JSON files to index. Supports both specific file paths and glob patterns.

**Default:**
```json
[
  "product/descarga.json",
  "data/constants.json"
]
```

**Examples:**

```json
// Specific files
{
  "ejsNavigator.jsonFiles": [
    "product/descarga.json",
    "data/constants.json",
    "config/app-config.json"
  ]
}

// Using glob patterns
{
  "ejsNavigator.jsonFiles": [
    "product/**/*.json",
    "data/**/*.json",
    "config/*.json"
  ]
}

// Mixed approach
{
  "ejsNavigator.jsonFiles": [
    "product/descarga.json",
    "data/**/*.json"
  ]
}
```

**Glob Pattern Examples:**
- `data/*.json` - All JSON files directly in the data folder
- `data/**/*.json` - All JSON files in data folder and subfolders
- `**/*.config.json` - All .config.json files in the workspace
- `product/descarga.json` - Specific file

The extension will automatically re-index when you change these settings.

## Development

```bash
cd vscode-ejs-navigator
npm install
npm run compile
# Press F5 in VSCode to launch Extension Development Host
```
