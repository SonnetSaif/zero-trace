# Browser Extension Architecture & Technical Overview

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Browser (Chrome/Edge/Brave)         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │     Popup UI (popup.html/css/js)     │  │
│  │                                      │  │
│  │  • URL input field                   │  │
│  │  • Cleanup options (checkboxes)      │  │
│  │  • Clean buttons                     │  │
│  │  • Results display                   │  │
│  └──────────────────────────────────────┘  │
│              ↕ (messages)                   │
│  ┌──────────────────────────────────────┐  │
│  │  Background Service Worker (bg.js)   │  │
│  │                                      │  │
│  │  • History cleaner logic             │  │
│  │  • Cookie cleaner logic              │  │
│  │  • Cache cleaner logic               │  │
│  │  • Context menu handler              │  │
│  │  • Keyboard shortcut handler         │  │
│  │  • URL domain extraction             │  │
│  └──────────────────────────────────────┘  │
│         ↕ (API calls)                      │
│  ┌──────────────────────────────────────┐  │
│  │   Browser APIs (Chrome Extensions)   │  │
│  │                                      │  │
│  │  • chrome.history.*                  │  │
│  │  • chrome.cookies.*                  │  │
│  │  • chrome.browsingData.*             │  │
│  │  • chrome.contextMenus.*             │  │
│  │  • chrome.commands.*                 │  │
│  │  • chrome.tabs.*                     │  │
│  │  • chrome.runtime.*                  │  │
│  │  • chrome.storage.*                  │  │
│  └──────────────────────────────────────┘  │
│         ↕ (system-level)                   │
│  ┌──────────────────────────────────────┐  │
│  │   Browser Data (History/Cache/Cook)  │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## 📚 Data Flow

### Cleaning Flow:
```
User Input (URL)
       ↓
Extract Domain & Path
       ↓
Validate Input
       ↓
Send Message to Background Worker
       ↓
Background Worker:
  ├─ Query History API
  ├─ Query Cookies API
  └─ Call Browsing Data API
       ↓
Processing:
  ├─ Filter history by domain/path
  ├─ Delete matching entries
  ├─ Remove cookies
  └─ Clear cache
       ↓
Return Results
       ↓
Display to User
```

## 🔌 API Reference

### Chrome APIs Used:

#### 1. **chrome.history**
```javascript
// Search history
chrome.history.search({ text: '', maxResults: 999999 }, callback)

// Delete history entry
chrome.history.deleteUrl({ url: 'https://example.com' })
```

#### 2. **chrome.cookies**
```javascript
// Get all cookies for domain
chrome.cookies.getAll({ domain: 'example.com' }, callback)

// Remove a cookie
chrome.cookies.remove({
  url: 'https://example.com/path',
  name: 'cookieName',
  storeId: 'storeId'
})
```

#### 3. **chrome.browsingData**
```javascript
// Remove browsing data (cache, etc.)
chrome.browsingData.remove(
  { origins: ['https://example.com'], since: 0 },
  { cache: true, cacheStorage: true },
  callback
)
```

#### 4. **chrome.contextMenus**
```javascript
// Create context menu item
chrome.contextMenus.create({
  id: 'cleanCurrentSite',
  title: 'Clean This Site',
  contexts: ['page']
})

// Handle click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Handle cleaning
})
```

#### 5. **chrome.commands**
```javascript
// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'clean-current-site') {
    // Perform cleaning
  }
})
```

#### 6. **chrome.runtime**
```javascript
// Send message to background
chrome.runtime.sendMessage({ action: 'cleanData', ... }, response => {
  // Handle response
})

// Receive messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle message
  sendResponse({ ... })
})
```

#### 7. **chrome.storage**
```javascript
// Save preferences
chrome.storage.local.set({ key: value })

// Load preferences
chrome.storage.local.get(['key'], data => {
  console.log(data.key)
})
```

## 🔄 Message Protocol

### Message Format:

**From Popup to Background:**
```javascript
{
  action: 'cleanData',
  domain: 'example.com',
  path: '/blog/',
  cleanHistory: true,
  cleanCookies: true,
  cleanCache: true
}
```

**Response from Background:**
```javascript
{
  success: true,
  results: {
    history: 42,    // items deleted
    cookies: 15,    // items deleted
    cache: 1        // cache cleared (1 = cleared)
  }
}
```

## 🧮 Domain/Path Matching Algorithm

### Matching Rules:

```javascript
function isHistoryMatch(historyUrl, targetDomain, targetPath) {
  // 1. Parse URLs
  const parsedUrl = new URL(historyUrl)
  const historyDomain = parsedUrl.hostname
  const historyPath = parsedUrl.pathname
  
  // 2. Domain matching (exact or subdomain)
  const domainMatch = 
    historyDomain === targetDomain ||
    historyDomain.endsWith(`.${targetDomain}`)
  
  if (!domainMatch) return false
  
  // 3. Path matching (prefix)
  if (targetPath && targetPath !== '/') {
    return historyPath.startsWith(targetPath)
  }
  
  return true
}
```

### Examples:

| Input | Matches | Reason |
|-------|---------|--------|
| `example.com` | `example.com/page` | Exact domain |
| `example.com` | `www.example.com/page` | Subdomain |
| `example.com` | `api.sub.example.com/page` | Deep subdomain |
| `example.com/blog/` | `example.com/blog/post-1` | Path prefix |
| `example.com/blog/` | `example.com/other/page` | ❌ Different path |

## 📊 Storage Strategy

### Local Storage (chrome.storage.local):
```javascript
{
  "cleanHistory": true,
  "cleanCookies": true,
  "cleanCache": true
}
```

**Why Local Storage?**
- Persists user preferences
- Fast access
- Per-browser profile

## 🚀 Execution Context

### Popup Script (popup.js):
- Runs when popup is opened
- Handles user input
- Sends messages to background worker
- Displays results

### Background Service Worker (background.js):
- Always ready to receive messages
- Never sleeps (modern Chrome)
- Handles actual cleaning operations
- Manages context menu and keyboard shortcuts

### Manifest (manifest.json):
- Declares all capabilities
- Defines permissions
- Specifies scripts and resources
- Configures keyboard shortcuts

## 🔐 Security Considerations

1. **No Remote Code**: All code is local
2. **No Content Scripts**: Doesn't inject into pages
3. **Minimal Permissions**: Only what's needed
4. **No External APIs**: No phone-home functionality
5. **User Confirmation**: Every action requires user click

## ⚡ Performance Optimization

### Current Optimizations:
1. **Efficient History Search**: Uses single query, filters in-memory
2. **Batch Cookie Deletion**: Processes all cookies efficiently
3. **Parallel API Calls**: History and cookies processed simultaneously
4. **Minimal UI Blocking**: Async operations

### Potential Future Optimizations:
1. Pagination for very large history
2. Caching of domain information
3. Background pre-processing
4. Partial history date range support

## 📝 Logging & Debugging

### Console Access:
```javascript
// In popup.js
console.log('Debug message')

// In background.js
console.log('Background debug')

// View in Inspect popup window
// Right-click extension icon → "Inspect popup"
```

## 🔄 State Management

### Current State:
```javascript
{
  userPreferences: {
    cleanHistory: boolean,
    cleanCookies: boolean,
    cleanCache: boolean
  },
  currentOperation: {
    domain: string,
    path: string,
    inProgress: boolean
  }
}
```

## 🎯 Error Handling

### Current Error Handling:
1. **Invalid URL**: Shows user-friendly error
2. **API Failures**: Caught and reported
3. **Permission Denied**: Silently fails (permission issue)
4. **Network Issues**: Not applicable (local only)

---

This architecture ensures clean separation of concerns, efficient resource usage, and reliable functionality across different Chromium-based browsers.
