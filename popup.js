
// DOM elements
const cssEditor = document.getElementById('css-editor');
const applyButton = document.getElementById('apply-css');
const clearButton = document.getElementById('clear-css');
const statusDiv = document.getElementById('status');
const toggleDebugButton = document.getElementById('toggle-debug');
const debugPanel = document.getElementById('debug-panel');
const debugContent = document.getElementById('debug-content');
const toggleInstructionsButton = document.getElementById('toggle-instructions');
const instructionsPanel = document.querySelector('.instructions');
const resizeHandle = document.querySelector('.resize-handle');

// Debug function to check extension status
async function debugExtension() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('=== Tana CSS Customizer Debug ===');
    console.log('Current tab URL:', tab?.url);
    console.log('Tab ID:', tab?.id);
    console.log('Is Tana page:', tab?.url?.includes('app.tana.inc'));
    
    // Check if content script is loaded
    if (tab && tab.url && tab.url.includes('app.tana.inc')) {
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        console.log('Content script response:', response);
      } catch (error) {
        console.log('Content script not responding:', error.message);
      }
    }
    
    // Check stored CSS
    const result = await chrome.storage.sync.get(['customCSS']);
    console.log('Stored CSS:', result.customCSS || 'None');
    console.log('===================================');
  } catch (error) {
    console.error('Debug error:', error);
  }
}

// Load saved CSS and preferences on popup open
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const result = await chrome.storage.sync.get(['customCSS', 'popupSize', 'showInstructions']);
    
    // Load saved size preferences
    if (result.popupSize) {
      if (result.popupSize.width) {
        document.body.style.width = result.popupSize.width + 'px';
      }
      if (result.popupSize.height) {
        document.body.style.height = result.popupSize.height + 'px';
      }
      if (result.popupSize.editorHeight) {
        cssEditor.style.height = result.popupSize.editorHeight + 'px';
      }
    }
    
    // Load instructions visibility preference (default to shown)
    const showInstructions = result.showInstructions !== false;
    if (!showInstructions) {
      instructionsPanel.classList.add('hidden');
      toggleInstructionsButton.textContent = 'Show Instructions';
    }
    
    // Only load saved CSS if it exists, otherwise keep the example CSS
    if (result.customCSS && result.customCSS.trim()) {
      cssEditor.value = result.customCSS;
    }
    // If no saved CSS, the example CSS from HTML will remain
    
    // Ensure textarea is editable
    cssEditor.removeAttribute('readonly');
    cssEditor.removeAttribute('disabled');
    cssEditor.disabled = false;
    cssEditor.readOnly = false;
    
    // Initialize functionality
    initializeResize();
    initializeInstructionsToggle();
    
    // Focus and select all text
    setTimeout(() => {
      cssEditor.focus();
      cssEditor.select();
      console.log('Textarea focused and all text selected');
    }, 200);
    
    // Run debug check
    await debugExtension();
  } catch (error) {
    console.error('Error loading saved CSS:', error);
  }
});

// Apply CSS button handler
applyButton.addEventListener('click', async () => {
  const css = cssEditor.value.trim();
  
  try {
    // Save CSS to storage first
    await chrome.storage.sync.set({ customCSS: css });
    console.log('CSS saved to storage');
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Current tab:', tab?.url);
    
    if (!tab) {
      showStatus('No active tab found', 'error');
      return;
    }
    
    if (!tab.url || !tab.url.includes('app.tana.inc')) {
      showStatus('Please navigate to Tana (app.tana.inc) first', 'error');
      return;
    }
    
    // Try to use content script first, then fallback to direct injection
    let appliedSuccessfully = false;
    
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'applyCSS',
        css: css
      });
      
      if (response && response.success) {
        showStatus('CSS applied via content script!', 'success');
        appliedSuccessfully = true;
      }
    } catch (messageError) {
      console.log('Content script not available, trying direct injection:', messageError);
    }
    
    // If content script failed, try direct script injection
    if (!appliedSuccessfully) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: injectCustomCSS,
          args: [css]
        });
        
        showStatus('CSS applied via direct injection!', 'success');
        appliedSuccessfully = true;
      } catch (scriptError) {
        console.error('Direct injection also failed:', scriptError);
      }
    }
    
    if (!appliedSuccessfully) {
      showStatus('Unable to inject CSS. Try refreshing the Tana page.', 'error');
    }
    
  } catch (error) {
    console.error('Error applying CSS:', error);
    showStatus(`Error: ${error.message}`, 'error');
  }
});

// Clear CSS button handler
clearButton.addEventListener('click', async () => {
  cssEditor.value = '';
  
  try {
    // Clear from storage
    await chrome.storage.sync.remove(['customCSS']);
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url && tab.url.includes('app.tana.inc')) {
      // Remove custom CSS from the current tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: removeCustomCSS
      });
      
      showStatus('CSS cleared successfully!', 'success');
    } else {
      showStatus('CSS cleared from extension', 'success');
    }
  } catch (error) {
    console.error('Error clearing CSS:', error);
    showStatus('Error clearing CSS. Please try again.', 'error');
  }
});


// Function to inject CSS into the page
function injectCustomCSS(css) {
  // Remove existing custom CSS
  const existingStyle = document.getElementById('tana-css-customizer');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element
  if (css.trim()) {
    const style = document.createElement('style');
    style.id = 'tana-css-customizer';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Function to remove custom CSS from the page
function removeCustomCSS() {
  const existingStyle = document.getElementById('tana-css-customizer');
  if (existingStyle) {
    existingStyle.remove();
  }
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}


// Debug panel toggle
toggleDebugButton.addEventListener('click', async () => {
  if (debugPanel.style.display === 'none') {
    debugPanel.style.display = 'block';
    toggleDebugButton.textContent = 'Hide Debug Info';
    
    // Update debug info
    const debugInfo = await getDebugInfo();
    debugContent.innerHTML = debugInfo;
  } else {
    debugPanel.style.display = 'none';
    toggleDebugButton.textContent = 'Show Debug Info';
  }
});

// Auto-save CSS as user types (debounced)
let saveTimeout;
cssEditor.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await chrome.storage.sync.set({ customCSS: cssEditor.value });
    } catch (error) {
      console.error('Error auto-saving CSS:', error);
    }
  }, 1000);
});

// Simple event handlers to ensure textarea works
cssEditor.addEventListener('click', (e) => {
  cssEditor.readOnly = false;
  cssEditor.disabled = false;
  cssEditor.focus();
  console.log('Textarea clicked and focused');
});

cssEditor.addEventListener('keydown', (e) => {
  console.log('Key pressed:', e.key);
  
  // Handle Tab key for indentation
  if (e.key === 'Tab') {
    e.preventDefault();
    
    const start = cssEditor.selectionStart;
    const end = cssEditor.selectionEnd;
    const value = cssEditor.value;
    
    if (e.shiftKey) {
      // Shift+Tab: Remove indentation
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', end);
      const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
      
      const lines = value.substring(lineStart, actualLineEnd).split('\n');
      const dedentedLines = lines.map(line => {
        if (line.startsWith('  ')) return line.substring(2);
        if (line.startsWith('\t')) return line.substring(1);
        return line;
      });
      
      const newText = value.substring(0, lineStart) + dedentedLines.join('\n') + value.substring(actualLineEnd);
      cssEditor.value = newText;
      
      // Restore cursor position
      const newStart = Math.max(lineStart, start - 2);
      cssEditor.setSelectionRange(newStart, newStart);
    } else {
      // Tab: Add indentation
      if (start === end) {
        // No selection - insert tab at cursor
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        cssEditor.value = newValue;
        cssEditor.setSelectionRange(start + 2, start + 2);
      } else {
        // Selection - indent all selected lines
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', end);
        const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
        
        const lines = value.substring(lineStart, actualLineEnd).split('\n');
        const indentedLines = lines.map(line => '  ' + line);
        
        const newText = value.substring(0, lineStart) + indentedLines.join('\n') + value.substring(actualLineEnd);
        cssEditor.value = newText;
        
        // Restore selection
        cssEditor.setSelectionRange(start + 2, end + (indentedLines.length * 2));
      }
    }
  }
  
  // Handle Enter key for auto-indentation
  if (e.key === 'Enter') {
    setTimeout(() => {
      const start = cssEditor.selectionStart;
      const value = cssEditor.value;
      const lineStart = value.lastIndexOf('\n', start - 2) + 1;
      const prevLine = value.substring(lineStart, start - 1);
      
      // Check if previous line ends with { or is indented
      const match = prevLine.match(/^(\s*)/);
      const indent = match ? match[1] : '';
      
      if (prevLine.trim().endsWith('{')) {
        // Add extra indentation after opening brace
        const newIndent = indent + '  ';
        const newValue = value.substring(0, start) + newIndent + value.substring(start);
        cssEditor.value = newValue;
        cssEditor.setSelectionRange(start + newIndent.length, start + newIndent.length);
      } else if (indent) {
        // Maintain current indentation
        const newValue = value.substring(0, start) + indent + value.substring(start);
        cssEditor.value = newValue;
        cssEditor.setSelectionRange(start + indent.length, start + indent.length);
      }
    }, 0);
  }
  
  // Handle bracket matching and auto-completion
  if (e.key === '{') {
    setTimeout(() => {
      const start = cssEditor.selectionStart;
      const value = cssEditor.value;
      
      // Auto-close braces
      const newValue = value.substring(0, start) + '}' + value.substring(start);
      cssEditor.value = newValue;
      cssEditor.setSelectionRange(start, start);
    }, 0);
  }
  
  // Handle formatting shortcuts
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'l') {
      // Ctrl/Cmd + L: Format CSS
      e.preventDefault();
      formatCSS();
    }
    
    if (e.key === 'k') {
      // Ctrl/Cmd + K: Show CSS property suggestions
      e.preventDefault();
      showPropertySuggestions();
    }
  }
  
  // Handle Ctrl+Space (not Cmd+Space to avoid Spotlight)
  if (e.ctrlKey && e.key === ' ' && !e.metaKey) {
    e.preventDefault();
    showPropertySuggestions();
  }
});

cssEditor.addEventListener('input', (e) => {
  console.log('Input detected, length:', cssEditor.value.length);
  
  // Run CSS linting after a short delay
  clearTimeout(lintTimeout);
  lintTimeout = setTimeout(() => {
    lintCSS();
  }, 500);
});

// CSS Linting functionality
let lintTimeout;

function lintCSS() {
  const css = cssEditor.value;
  const errors = [];
  const warnings = [];
  
  // Basic CSS validation rules
  const lines = css.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.endsWith('*/')) {
      return;
    }
    
    // Check for missing semicolons (property lines that don't end with ; or {)
    if (trimmed.includes(':') && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
      warnings.push({
        line: lineNum,
        message: `Missing semicolon`,
        type: 'warning'
      });
    }
    
    // Check for missing opening/closing braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    
    // Check for unknown CSS properties (basic list)
    const propertyMatch = trimmed.match(/^\s*([a-z-]+)\s*:/);
    if (propertyMatch) {
      const property = propertyMatch[1];
      const commonProperties = [
        'color', 'background', 'background-color', 'font-size', 'font-family', 'font-weight',
        'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left',
        'right', 'bottom', 'z-index', 'opacity', 'visibility', 'overflow', 'text-align',
        'line-height', 'border-radius', 'box-shadow', 'text-shadow', 'transform', 'transition',
        'animation', 'flex', 'grid', 'justify-content', 'align-items', 'float', 'clear'
      ];
      
      if (!commonProperties.includes(property) && !property.startsWith('-webkit-') && !property.startsWith('-moz-') && !property.startsWith('-ms-')) {
        warnings.push({
          line: lineNum,
          message: `Unknown property: ${property}`,
          type: 'warning'
        });
      }
    }
    
    // Check for potential typos in values
    if (trimmed.includes('!imprtant')) {
      errors.push({
        line: lineNum,
        message: `Typo: "!imprtant" should be "!important"`,
        type: 'error'
      });
    }
  });
  
  // Check for unmatched braces
  const totalOpenBraces = (css.match(/{/g) || []).length;
  const totalCloseBraces = (css.match(/}/g) || []).length;
  
  if (totalOpenBraces !== totalCloseBraces) {
    errors.push({
      line: 'end',
      message: `Unmatched braces: ${totalOpenBraces} opening, ${totalCloseBraces} closing`,
      type: 'error'
    });
  }
  
  // Update lint display
  updateLintDisplay(errors, warnings);
}

function updateLintDisplay(errors, warnings) {
  let lintPanel = document.getElementById('lint-panel');
  
  if (!lintPanel) {
    // Create lint panel if it doesn't exist
    lintPanel = document.createElement('div');
    lintPanel.id = 'lint-panel';
    lintPanel.style.cssText = `
      margin-top: 8px;
      padding: 8px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 11px;
      max-height: 100px;
      overflow-y: auto;
      display: none;
    `;
    
    const editorContainer = document.querySelector('.editor-container');
    editorContainer.appendChild(lintPanel);
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    lintPanel.style.display = 'none';
    return;
  }
  
  lintPanel.style.display = 'block';
  
  let html = '';
  
  errors.forEach(error => {
    html += `<div style="color: #dc3545; margin-bottom: 2px;">
      <strong>Error</strong> (line ${error.line}): ${error.message}
    </div>`;
  });
  
  warnings.forEach(warning => {
    html += `<div style="color: #856404; margin-bottom: 2px;">
      <strong>Warning</strong> (line ${warning.line}): ${warning.message}
    </div>`;
  });
  
  if (html === '') {
    html = '<div style="color: #28a745;">✓ No issues found</div>';
  }
  
  lintPanel.innerHTML = html;
}

// CSS Formatting function
function formatCSS() {
  let css = cssEditor.value;
  
  // Basic CSS formatting
  css = css
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Add newlines after braces
    .replace(/\{/g, ' {\n  ')
    .replace(/\}/g, '\n}\n')
    // Add newlines after semicolons
    .replace(/;/g, ';\n  ')
    // Clean up multiple newlines
    .replace(/\n\s*\n/g, '\n')
    // Remove trailing spaces on lines
    .replace(/ +$/gm, '')
    // Fix indentation
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.endsWith('{') || trimmed === '') {
        return trimmed;
      } else if (trimmed === '}') {
        return trimmed;
      } else {
        return '  ' + trimmed;
      }
    })
    .join('\n')
    // Clean up
    .replace(/\n+/g, '\n')
    .trim();
  
  cssEditor.value = css;
  showStatus('CSS formatted!', 'success');
}

// CSS Property suggestions
function showPropertySuggestions() {
  const cssProperties = [
    'align-items', 'animation', 'background', 'background-color', 'border', 'border-radius',
    'box-shadow', 'color', 'cursor', 'display', 'flex', 'flex-direction', 'font-family',
    'font-size', 'font-weight', 'grid', 'height', 'justify-content', 'line-height',
    'margin', 'max-width', 'opacity', 'overflow', 'padding', 'position', 'text-align',
    'text-decoration', 'transform', 'transition', 'visibility', 'width', 'z-index'
  ];
  
  const start = cssEditor.selectionStart;
  const value = cssEditor.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const currentLine = value.substring(lineStart, start);
  const words = currentLine.trim().split(/\s+/);
  const lastWord = words[words.length - 1] || '';
  
  // Filter properties that match the current typing
  const suggestions = cssProperties.filter(prop => 
    prop.toLowerCase().startsWith(lastWord.toLowerCase())
  );
  
  if (suggestions.length > 0) {
    showSuggestionPanel(suggestions, lastWord);
  }
}

function showSuggestionPanel(suggestions, currentWord) {
  // Remove existing suggestion panel
  const existing = document.getElementById('suggestion-panel');
  if (existing) existing.remove();
  
  const panel = document.createElement('div');
  panel.id = 'suggestion-panel';
  panel.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-height: 150px;
    overflow-y: auto;
    z-index: 1000;
    font-size: 12px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  `;
  
  suggestions.slice(0, 10).forEach((suggestion, index) => {
    const item = document.createElement('div');
    item.textContent = suggestion;
    item.style.cssText = `
      padding: 4px 8px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    `;
    
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = '#f0f0f0';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = '';
    });
    
    item.addEventListener('click', () => {
      insertSuggestion(suggestion, currentWord);
      panel.remove();
    });
    
    panel.appendChild(item);
  });
  
  // Position panel near the textarea
  const rect = cssEditor.getBoundingClientRect();
  panel.style.left = rect.left + 'px';
  panel.style.top = (rect.top + 20) + 'px';
  
  document.body.appendChild(panel);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (panel.parentNode) panel.remove();
  }, 5000);
}

function insertSuggestion(suggestion, currentWord) {
  const start = cssEditor.selectionStart;
  const value = cssEditor.value;
  
  // Replace the current word with the suggestion
  const beforeCursor = value.substring(0, start - currentWord.length);
  const afterCursor = value.substring(start);
  
  const newValue = beforeCursor + suggestion + ': ' + afterCursor;
  cssEditor.value = newValue;
  cssEditor.setSelectionRange(start - currentWord.length + suggestion.length + 2, start - currentWord.length + suggestion.length + 2);
  cssEditor.focus();
}

// Instructions toggle functionality
function initializeInstructionsToggle() {
  toggleInstructionsButton.addEventListener('click', async () => {
    const isHidden = instructionsPanel.classList.contains('hidden');
    
    if (isHidden) {
      instructionsPanel.classList.remove('hidden');
      toggleInstructionsButton.textContent = 'Hide Instructions';
    } else {
      instructionsPanel.classList.add('hidden');
      toggleInstructionsButton.textContent = 'Show Instructions';
    }
    
    // Save preference
    try {
      await chrome.storage.sync.set({ showInstructions: !isHidden });
    } catch (error) {
      console.error('Error saving instructions preference:', error);
    }
  });
}

// Complete resize functionality
function initializeResize() {
  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;
  
  // Handle popup resize via the resize handle
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(document.body).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(document.body).height, 10);
    e.preventDefault();
    e.stopPropagation();
    
    // Add visual feedback
    document.body.style.userSelect = 'none';
    resizeHandle.style.opacity = '1';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    
    const newWidth = startWidth + e.clientX - startX;
    const newHeight = startHeight + e.clientY - startY;
    
    // Apply constraints
    const minWidth = 350;
    const maxWidth = 1200;
    const minHeight = 400;
    const maxHeight = 1400;
    
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    
    document.body.style.width = constrainedWidth + 'px';
    document.body.style.height = constrainedHeight + 'px';
  });
  
  document.addEventListener('mouseup', async (e) => {
    if (isResizing) {
      isResizing = false;
      
      // Remove visual feedback
      document.body.style.userSelect = '';
      resizeHandle.style.opacity = '';
      
      // Save the new size preferences
      const currentWidth = parseInt(document.body.style.width, 10);
      const currentHeight = parseInt(document.body.style.height, 10);
      const editorHeight = parseInt(cssEditor.style.height, 10) || 300;
      
      try {
        await chrome.storage.sync.set({
          popupSize: {
            width: currentWidth,
            height: currentHeight,
            editorHeight: editorHeight
          }
        });
        console.log('Popup size saved:', { width: currentWidth, height: currentHeight, editorHeight });
      } catch (error) {
        console.error('Error saving popup size:', error);
      }
    }
  });
  
  // Handle CSS editor resize separately
  const editorObserver = new ResizeObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.target === cssEditor) {
        const editorHeight = entry.contentRect.height;
        
        // Save editor height preference (debounced)
        clearTimeout(editorResizeTimeout);
        editorResizeTimeout = setTimeout(async () => {
          try {
            const result = await chrome.storage.sync.get(['popupSize']);
            const popupSize = result.popupSize || {};
            popupSize.editorHeight = editorHeight;
            
            await chrome.storage.sync.set({ popupSize });
            console.log('Editor height saved:', editorHeight);
          } catch (error) {
            console.error('Error saving editor height:', error);
          }
        }, 1000);
      }
    }
  });
  
  editorObserver.observe(cssEditor);
}

let editorResizeTimeout;

// Get comprehensive debug information
async function getDebugInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const result = await chrome.storage.sync.get(['customCSS']);
    
    let info = `<strong>Current Tab:</strong><br>`;
    info += `URL: ${tab?.url || 'Unknown'}<br>`;
    info += `ID: ${tab?.id || 'Unknown'}<br>`;
    info += `Is Tana: ${tab?.url?.includes('app.tana.inc') ? 'Yes' : 'No'}<br><br>`;
    
    info += `<strong>Extension Status:</strong><br>`;
    info += `Manifest Version: 3<br>`;
    info += `Permissions: storage, activeTab, scripting, tabs<br><br>`;
    
    info += `<strong>Storage:</strong><br>`;
    info += `CSS Length: ${result.customCSS?.length || 0} chars<br>`;
    info += `Has CSS: ${result.customCSS ? 'Yes' : 'No'}<br><br>`;
    
    // Test content script
    if (tab && tab.url && tab.url.includes('app.tana.inc')) {
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        info += `<strong>Content Script:</strong><br>Connected: Yes<br>`;
      } catch (error) {
        info += `<strong>Content Script:</strong><br>Connected: No<br>Error: ${error.message}<br>`;
      }
    } else {
      info += `<strong>Content Script:</strong><br>Not on Tana page<br>`;
    }
    
    info += `<br><strong>Textarea Status:</strong><br>`;
    info += `Focused: ${document.activeElement === cssEditor ? 'Yes' : 'No'}<br>`;
    info += `Value Length: ${cssEditor.value.length}<br>`;
    info += `Readonly: ${cssEditor.readOnly ? 'Yes' : 'No'}<br>`;
    info += `Disabled: ${cssEditor.disabled ? 'Yes' : 'No'}<br>`;
    
    return info;
  } catch (error) {
    return `Error getting debug info: ${error.message}`;
  }
}