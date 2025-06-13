# Tana CSS Customizer

A powerful Chrome extension that allows you to customize the appearance of [Tana](https://tana.inc) with custom CSS. Features a professional code editor with syntax highlighting, linting, auto-completion, and real-time preview.

![Extension Demo](https://via.placeholder.com/800x600/667eea/ffffff?text=Tana+CSS+Customizer+Demo)

## ✨ Features

### 🎨 **Professional CSS Editor**
- **Real-time CSS linting** with error detection and warnings
- **Auto-completion** for CSS properties (`Ctrl/Cmd+K` or `Ctrl+Space`)
- **Smart indentation** with Tab/Shift+Tab support
- **Auto-closing braces** and bracket matching
- **Format CSS** with `Ctrl/Cmd+L` for clean, readable code
- **Line-by-line error detection** with helpful suggestions

### 🚀 **Advanced Functionality**
- **Live preview** - see changes instantly in Tana
- **Auto-save** - your CSS is saved as you type
- **Resizable interface** - adjust popup and editor sizes to your workflow
- **Instructions toggle** - show/hide help section to save space
- **Debug panel** for troubleshooting connection issues
- **Persistent preferences** - all settings saved across browser sessions

### 🎭 **Built-in Preset Themes**
- **🌙 Dark Theme** - Complete dark mode with proper contrast
- **📝 Larger Text** - Increased font sizes for better readability
- **📦 Compact View** - Reduced spacing for more content on screen
- **🎨 Custom Colors** - Beautiful purple color scheme with gradients

## Installation

### From Chrome Web Store (Coming Soon)
*Extension will be available on the Chrome Web Store once published*

### Manual Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `tana-css` folder
5. The extension should now appear in your Chrome extensions

## 🎯 Quick Start

1. **Navigate to Tana**: Open [app.tana.inc](https://app.tana.inc) in Chrome
2. **Open the extension**: Click the Tana CSS Customizer icon in your toolbar
3. **Start customizing**: 
   - Try a preset theme for instant results
   - Or write custom CSS in the professional editor
   - Use auto-completion (`Ctrl/Cmd+K`) for CSS properties
4. **Apply changes**: Click "Apply CSS" to see your changes instantly
5. **Resize as needed**: Drag the resize handle to adjust the interface

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` / `Shift+Tab` | Indent / Outdent selected lines |
| `Ctrl/Cmd+L` | Format and beautify CSS |
| `Ctrl/Cmd+K` | Show CSS property suggestions |
| `Ctrl+Space` | Show CSS property suggestions (alternative) |
| `Enter` after `{` | Auto-indent next line |
| `{` | Auto-close with matching `}` |

## 🔧 Editor Features

- **Real-time linting**: Catch errors as you type
- **Property suggestions**: Smart auto-completion for CSS properties
- **Error detection**: Missing semicolons, unmatched braces, unknown properties
- **Format on command**: Clean up messy CSS instantly
- **Auto-indentation**: Proper code structure maintained automatically

## Example CSS

### Dark Theme
```css
body, .tana-app {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
}

.tana-sidebar {
  background-color: #2d2d2d !important;
}
```

### Larger Text
```css
.tana-node {
  font-size: 16px !important;
  line-height: 1.6 !important;
}
```

### Custom Colors
```css
.tana-node {
  border-left: 3px solid #667eea !important;
  background-color: #f8f9ff !important;
}
```

## How It Works

The extension uses:
- **Content Scripts** to inject CSS into Tana pages
- **Chrome Storage API** to persist your custom styles
- **Popup Interface** for easy CSS editing and management

## Safety & Privacy

- ✅ Only runs on Tana domains (`app.tana.inc`)
- ✅ All CSS is stored locally in your browser
- ✅ No data is sent to external servers
- ✅ Open source and fully auditable

## Development

### Project Structure
```
tana-css/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup UI
├── popup.js          # Popup functionality
├── content.js        # Content script for CSS injection
├── content.css       # Default content styles
├── icons/           # Extension icons
└── README.md        # This file
```

### Building Icons

The extension expects icon files at:
- `icons/icon16.png` (16x16px)
- `icons/icon48.png` (48x48px) 
- `icons/icon128.png` (128x128px)

Create these icons with the Tana CSS Customizer branding.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Tana
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This extension is not officially affiliated with Tana. Use at your own discretion. Custom CSS may affect Tana's functionality, so test changes carefully.

## Support

If you encounter issues:
1. Check that you're on a Tana page (`app.tana.inc`)
2. Try clearing and reapplying your CSS
3. Check browser console for errors
4. Open an issue on GitHub with details

---

**Made with ❤️ for the Tana community**