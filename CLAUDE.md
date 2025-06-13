# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Chrome Extension (Manifest V3) that allows users to customize Tana's CSS styling through a popup interface. The extension includes a professional CSS editor with syntax highlighting, linting, auto-completion, and real-time preview.

## Commands

### Development & Testing
- `npm run dev` - Instructions for loading extension in Chrome developer mode
- `npm run validate` - Validates extension structure by checking manifest.json
- `npm run package` - Creates a zip file for extension distribution

### Extension Loading
Load the extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the project directory

## Architecture

### Core Files
- `manifest.json` - Chrome extension configuration (Manifest V3)
- `popup.html/popup.js` - Extension popup UI with CSS editor
- `content.js` - Content script that injects CSS into Tana pages
- `content.css` - Default content styles

### Key Components
- **CSS Editor**: Professional editor with linting, auto-completion, and formatting
- **Preset System**: Built-in themes (dark, larger text, compact view, custom colors)  
- **Storage**: Uses Chrome's sync storage API for persistence
- **Content Script Injection**: Only runs on `https://app.tana.inc/*`

### Communication Flow
1. Popup UI (`popup.js`) ↔ Chrome Storage API
2. Storage changes trigger content script updates
3. Content script (`content.js`) applies CSS to Tana pages
4. Real-time preview through storage listeners

### Permissions
- `storage` - For saving user CSS
- `activeTab`, `scripting`, `tabs` - For content script injection
- Host permission: `https://app.tana.inc/*` only

## Key Implementation Details
- Uses Chrome Storage sync API for cross-device persistence
- Content script listens for storage changes and message passing
- CSS injection is handled via dynamic style element creation
- Extension only activates on Tana domains for security