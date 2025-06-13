# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Chrome Extension (Manifest V3) that allows users to customize Tana's CSS styling through a popup interface. The extension includes a professional CSS editor with syntax highlighting, intelligent auto-completion with type-ahead filtering, real-time linting, code formatting, and live preview functionality.

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
- **CSS Editor**: Professional editor with syntax highlighting, linting, and intelligent auto-completion
- **Smart Autocomplete**: Advanced CSS property suggestions with type-ahead filtering and keyboard navigation
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

## Enhanced Autocomplete System

### CSS Property Suggestions
- **Trigger**: `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) 
- **Alternative**: `Ctrl+Space` for cross-platform compatibility
- **Properties**: 60+ common CSS properties including animations, flexbox, grid, and transforms

### Smart Filtering Modes
1. **Prefix Match** (highest priority): `"back"` → background, background-color, background-image
2. **Contains Match** (medium priority): `"size"` → font-size, background-size, box-sizing  
3. **Fuzzy Match** (lowest priority): `"ani"` → animation, animation-delay, animation-duration

### Keyboard Navigation
- **↑/↓ Arrow Keys**: Navigate through suggestions
- **Enter**: Insert selected property with colon
- **Escape**: Close suggestion panel
- **Type-ahead**: Continue typing to filter suggestions in real-time
- **Mouse**: Click or hover to select suggestions

### Visual Features
- **Highlighted Matches**: Matching characters are visually highlighted
- **Smart Sorting**: Most relevant suggestions appear first
- **Professional UI**: Modern design with gradient header and keyboard hints
- **Auto-positioning**: Panel positioned intelligently near cursor
- **Auto-hide**: Panel closes after 15 seconds of inactivity

## Key Implementation Details
- Uses Chrome Storage sync API for cross-device persistence
- Content script listens for storage changes and message passing
- CSS injection is handled via dynamic style element creation
- Extension only activates on Tana domains for security
- Intelligent suggestion panel with efficient content updates and timer management