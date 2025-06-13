# Changelog

All notable changes to the Tana CSS Customizer extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-13

### Added
- **Initial Release** - Full-featured Chrome extension for customizing Tana CSS
- **Professional CSS Editor** with comprehensive editing features:
  - Real-time CSS linting with error detection and warnings
  - Auto-completion for CSS properties (Ctrl/Cmd+K or Ctrl+Space)
  - Smart indentation with Tab/Shift+Tab support
  - Auto-closing braces and bracket matching
  - Format CSS with Ctrl/Cmd+L for clean, readable code
  - Line-by-line error detection with helpful suggestions
- **Advanced Functionality**:
  - Live preview - see changes instantly in Tana
  - Auto-save - CSS is saved as you type
  - Resizable interface - adjust popup and editor sizes
  - Instructions toggle - show/hide help section to save space
  - Debug panel for troubleshooting connection issues
  - Persistent preferences - all settings saved across browser sessions
- **Built-in Preset Themes**:
  - 🌙 Dark Theme - Complete dark mode with proper contrast
  - 📝 Larger Text - Increased font sizes for better readability
  - 📦 Compact View - Reduced spacing for more content on screen
  - 🎨 Custom Colors - Beautiful purple color scheme with gradients
- **Chrome Extension Features**:
  - Manifest V3 compliance
  - Content script injection with fallback methods
  - Chrome Storage API for persistent preferences
  - Runs only on Tana domains (app.tana.inc)
  - No external dependencies - fully self-contained
- **User Experience**:
  - Professional UI with clean, modern design
  - Comprehensive keyboard shortcuts
  - Auto-save functionality with debounced storage updates
  - Real-time CSS validation and error reporting
  - Resize functionality with mouse event handling
  - Instructions panel with toggle functionality

### Technical Details
- **Manifest Version**: 3
- **Permissions**: storage, activeTab, scripting, tabs
- **Host Permissions**: https://app.tana.inc/*
- **Content Script**: Runs at document_idle for optimal performance
- **CSP Compliant**: No external CDN dependencies
- **Browser Support**: Chrome (Manifest V3)

### Security & Privacy
- ✅ Only runs on Tana domains (app.tana.inc)
- ✅ All CSS is stored locally in your browser
- ✅ No data is sent to external servers
- ✅ Open source and fully auditable

## [Unreleased]

### Planned Features
- Chrome Web Store publication
- Additional preset themes
- Import/export functionality for CSS snippets
- Syntax highlighting improvements
- Advanced CSS property suggestions
- Theme marketplace/sharing functionality

---

## Notes

### Version Numbering
- **Major** (1.x.x): Breaking changes or major feature additions
- **Minor** (x.1.x): New features that are backwards compatible
- **Patch** (x.x.1): Bug fixes and small improvements

### Release Process
1. Update version in `manifest.json`
2. Update version in `package.json`
3. Update this CHANGELOG.md
4. Create git tag with version number
5. Package extension for distribution