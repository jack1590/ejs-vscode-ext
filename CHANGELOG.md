# Changelog

All notable changes to the "EJS Navigator for Roku" extension will be documented in this file.

## [0.0.3] - 2026-01-28

### Added
- **Intelligent Autocomplete**: Real-time suggestions as you type EJS expressions
  - Triggers on `.`, `(`, and space characters
  - Shows property names with type information
  - Displays value previews for primitives
  - Context-aware completions based on current path
- **Partial Path Hover**: Hover over any segment of a dotted path to see that specific level
  - Example: Hover "heroWrapper" in `Hero.default.heroWrapper.liveTag.visible` shows the heroWrapper object
  - Formatted previews for objects, arrays, and primitives
  - Truncated display for large objects
- **Configurable JSON Indexing**: Flexible file configuration with glob pattern support
  - Setting: `ejsNavigator.jsonFiles` accepts array of paths/patterns
  - Default: `["product/descarga.json", "data/constants.json"]`
  - Supports patterns like `data/**/*.json` or `config/*.json`
  - Auto-reindexing when settings change
- **Visual Documentation**: Feature screenshots demonstrating all capabilities
  - Go to Definition screenshot showing navigation in action
  - Hover Preview screenshot showing tooltip with object data
  - Autocomplete screenshot showing intelligent suggestions

### Fixed
- **Nested Path Navigation**: Dramatically improved accuracy for deeply nested paths
  - Sequential offset-based search eliminates false matches
  - Correctly navigates to properties with duplicate names
  - Significant performance improvement (no more freezing on complex paths)
  - Example: `PlanPickerV2Screen.styles.screen.planItem.background` now navigates correctly

### Improved
- Hover tooltips now show type information for all value types
- Better performance for large JSON files with many nested properties
- More reliable indexing with offset tracking through recursive calls

### Changed
- Removed deprecated `ejsNavigator.productDataPath` and `ejsNavigator.constantsPath` settings
- Consolidated to single `ejsNavigator.jsonFiles` array configuration

## [0.0.2] - 2026-01-28

### Added
- Extension icon for marketplace listing
- Updated package.json with icon reference

### Fixed
- Icon format converted from JPEG to PNG for VSCode compatibility

## [0.0.1] - 2026-01-28

### Added
- Initial release
- Go to Definition support for EJS templates in BrightScript files (.bs, .brs)
- Go to Definition support for EJS templates in XML files
- Hover provider to preview values from JSON files
- Support for `descarga.json` and `constants.json` indexing
- Support for EJS patterns:
  - `"{{%- s(path.to.value) %}}"`
  - `"{{%= path.to.value %}}"`
  - `"{{%- o(path.to.value) %}}"`
- Support for prefixed paths (CONST, ENV, EVENT, CONFIG, PAGE)
- Automatic JSON file indexing on workspace open
- Automatic re-indexing when JSON files change
- Configuration options for custom JSON file paths

### Features
- Fast navigation from template variables to JSON definitions
- Value preview on hover
- Multi-file JSON support
- Custom delimiter support (`"{{` and `}}"`)

### Known Limitations
- Large JSON files (>1MB) may take a moment to index
- Only supports exact path matches (no fuzzy search yet)
- Nested object navigation shows parent object location
