# Contributing to Tana CSS Customizer

Thank you for your interest in contributing to the Tana CSS Customizer! This document provides guidelines for contributing to this Chrome extension project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions relevant to the project

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/tana-css-customizer.git
   cd tana-css-customizer
   ```
3. **Install dependencies** (if any):
   ```bash
   npm install
   ```

## Development Setup

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the project folder
4. The extension should now appear in your Chrome extensions

### Project Structure

```
tana-css/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup UI
├── popup.js          # Popup functionality
├── content.js        # Content script for CSS injection
├── content.css       # Default content styles
├── icons/           # Extension icons
├── package.json     # Project metadata
├── README.md        # Project documentation
├── LICENSE          # MIT License
├── CHANGELOG.md     # Version history
└── CONTRIBUTING.md  # This file
```

### Key Technologies

- **Chrome Extension Manifest V3**
- **Vanilla JavaScript** (ES6+)
- **Chrome APIs**: Storage, Tabs, Scripting
- **CSS3** for styling
- **HTML5** for popup interface

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a detailed bug report** including:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Chrome version and OS
   - Console errors (if any)
   - Screenshots (if helpful)

### Suggesting Features

1. **Check existing feature requests** first
2. **Create a feature request** with:
   - Clear description of the feature
   - Use case and benefits
   - Implementation suggestions (if any)
   - Mockups or examples (if helpful)

### Types of Contributions Welcome

- **Bug fixes**
- **Feature enhancements**
- **UI/UX improvements**
- **Documentation updates**
- **Code optimizations**
- **New preset themes**
- **Testing improvements**

## Coding Standards

### JavaScript Style Guide

- Use **ES6+ features** where appropriate
- Follow **camelCase** naming convention
- Use **const** for constants, **let** for variables
- Add **JSDoc comments** for functions
- Keep functions **small and focused**
- Use **meaningful variable names**

```javascript
// Good
const cssEditor = document.getElementById('css-editor');

/**
 * Applies custom CSS to the active Tana page
 * @param {string} css - The CSS to apply
 * @returns {Promise<boolean>} Success status
 */
async function applyCustomCSS(css) {
  // Implementation
}

// Avoid
var editor = document.getElementById('css-editor');
function doStuff(x) { /* unclear purpose */ }
```

### HTML/CSS Guidelines

- Use **semantic HTML5** elements
- Follow **BEM** or similar CSS methodology
- Keep **CSS organized** and commented
- Use **CSS custom properties** for theming
- Ensure **accessibility** standards
- Test **responsive behavior**

### Chrome Extension Best Practices

- Follow **Manifest V3** guidelines
- Use **content security policy** compliant code
- Handle **permissions** appropriately
- Implement **error handling** for all Chrome APIs
- Test across **different Chrome versions**

## Testing

### Manual Testing Checklist

Before submitting changes, test:

- [ ] Extension loads without errors
- [ ] Popup interface displays correctly
- [ ] CSS editor functionality works
- [ ] CSS application to Tana pages
- [ ] Storage and preferences saving
- [ ] Keyboard shortcuts
- [ ] Resize functionality
- [ ] Debug panel information
- [ ] All preset themes
- [ ] Error handling scenarios

### Browser Testing

Test the extension in:
- Chrome stable (latest)
- Chrome beta (if available)
- Different screen sizes/resolutions

### Tana Page Testing

Test on different Tana pages:
- Main workspace view
- Node detail views
- Settings pages
- Different Tana themes/modes

## Submitting Changes

### Pull Request Process

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test thoroughly** using the manual testing checklist

4. **Update documentation** if needed:
   - Update README.md for new features
   - Add entries to CHANGELOG.md
   - Update this CONTRIBUTING.md if process changes

5. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add feature: CSS property auto-completion
   
   - Implement property suggestion panel
   - Add keyboard shortcut Ctrl/Cmd+K
   - Include 30+ common CSS properties
   - Add click-to-insert functionality"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Testing notes
   - Screenshots (if UI changes)

### Pull Request Guidelines

- **One feature per PR** - keep changes focused
- **Include tests** when applicable
- **Update version numbers** if needed
- **Follow commit message format**:
  - First line: Brief summary (50 chars max)
  - Blank line
  - Detailed description if needed

## Release Process

### Version Management

The project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Checklist

1. Update version in `manifest.json`
2. Update version in `package.json`
3. Update `CHANGELOG.md` with new version
4. Test extension thoroughly
5. Create git tag: `git tag v1.0.1`
6. Push tag: `git push origin v1.0.1`
7. Create GitHub release
8. Package extension for Chrome Web Store (when ready)

## Getting Help

### Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Tana Documentation](https://help.tana.inc/)

### Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: your.email@example.com (for security issues)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub repository insights

Thank you for contributing to make Tana CSS Customizer better for everyone! 🎉