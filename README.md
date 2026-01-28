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

- `ejsNavigator.productDataPath`: Path to descarga.json (default: "product/descarga.json")
- `ejsNavigator.constantsPath`: Path to constants.json (default: "data/constants.json")

## Development

```bash
cd vscode-ejs-navigator
npm install
npm run compile
# Press F5 in VSCode to launch Extension Development Host
```
