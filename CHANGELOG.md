# Changelog

All notable changes to the "EJS Navigator for Roku" extension will be documented in this file.

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
