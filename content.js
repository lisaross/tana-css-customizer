// Content script for Tana CSS Customizer
// This script runs on Tana pages and handles CSS injection

(function() {
  'use strict';
  
  console.log('Tana CSS Customizer: Content script loaded on', location.href);
  
  // Apply stored CSS when page loads
  loadAndApplyStoredCSS();
  
  // Listen for storage changes (when CSS is updated from popup)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.customCSS) {
      const newCSS = changes.customCSS.newValue || '';
      applyCustomCSS(newCSS);
    }
  });
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      console.log('Tana CSS Customizer: Received message:', request);
      
      if (request.action === 'applyCSS') {
        applyCustomCSS(request.css);
        sendResponse({ success: true, message: 'CSS applied' });
      } else if (request.action === 'removeCSS') {
        removeCustomCSS();
        sendResponse({ success: true, message: 'CSS removed' });
      } else if (request.action === 'ping') {
        sendResponse({ success: true, message: 'Content script is ready', url: location.href });
      } else {
        sendResponse({ success: false, error: 'Unknown action: ' + request.action });
      }
    } catch (error) {
      console.error('Tana CSS Customizer: Message handling error:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    // Return true to indicate we will send a response asynchronously
    return true;
  });
  
  // Function to load and apply stored CSS
  async function loadAndApplyStoredCSS() {
    try {
      const result = await chrome.storage.sync.get(['customCSS']);
      if (result.customCSS) {
        applyCustomCSS(result.customCSS);
      }
    } catch (error) {
      console.error('Tana CSS Customizer: Error loading stored CSS:', error);
    }
  }
  
  // Function to apply custom CSS to the page
  function applyCustomCSS(css) {
    // Remove existing custom CSS
    const existingStyle = document.getElementById('tana-css-customizer');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Apply new CSS if provided
    if (css && css.trim()) {
      const style = document.createElement('style');
      style.id = 'tana-css-customizer';
      style.textContent = css;
      document.head.appendChild(style);
      
      console.log('Tana CSS Customizer: CSS applied');
    }
  }
  
  // Function to remove custom CSS
  function removeCustomCSS() {
    const existingStyle = document.getElementById('tana-css-customizer');
    if (existingStyle) {
      existingStyle.remove();
      console.log('Tana CSS Customizer: CSS removed');
    }
  }
  
  // Re-apply CSS when navigating within Tana (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      // Small delay to ensure page elements are loaded
      setTimeout(loadAndApplyStoredCSS, 500);
    }
  }).observe(document, { subtree: true, childList: true });
  
  // Make functions available globally for popup script injection
  window.tanaCustomizerApplyCSS = applyCustomCSS;
  window.tanaCustomizerRemoveCSS = removeCustomCSS;
  
})();