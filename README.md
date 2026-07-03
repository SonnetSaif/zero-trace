# 🧹 All-in-One Cleaner - Browser Extension

A lightweight, privacy-focused browser extension that cleans history, cache, and cookies for specific websites with a single click.

## ✨ Features

- **History Cleaner**: Remove all history entries for a specific domain/subdomain/path
- **Cache Cleaner**: Clear cache storage for specified website
- **Cookie Cleaner**: Delete all cookies associated with a domain
- **Multiple Matching Modes**: 
  - Domain + Subdomains (e.g., `example.com` and `*.example.com`)
  - URL Path Prefix matching (e.g., `example.com/blog/`)
- **Three Ways to Clean**:
  1. Popup UI: Enter URL and click "Clean Now"
  2. Quick Action: Click "Clean Current Site" button
  3. Keyboard Shortcut: `Ctrl+Shift+L` (or `Cmd+Shift+L` on Mac)
  4. Context Menu: Right-click on any page and select "Clean This Site"
- **Preference Memory**: Remembers your cleaning preferences
- **Detailed Results**: Shows count of deleted items

## 🚀 Installation

### Chrome / Edge / Brave / Chromium-based Browsers

1. **Download or Clone** this repository
2. Open `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer Mode** (top right corner)
4. Click **Load unpacked**
5. Select the extension folder
6. The extension is now installed! ✅

### Firefox

1. **Note**: Firefox has different extension API requirements. For Firefox support, additional modifications needed.
2. For now, open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select `manifest.json` from the extension folder
5. The extension will be loaded (temporary until browser restart)

## 📖 Usage

### Method 1: Popup UI

1. Click the extension icon in your toolbar
2. Enter a website URL or domain:
   - `example.com` - cleans domain and all subdomains
   - `https://example.com/path/` - cleans only specific path
   - `sub.example.com` - cleans specific subdomain
3. Select what to clean (History, Cookies, Cache)
4. Click **Clean Now**
5. View results showing how many items were deleted

### Method 2: Quick Clean Current Site

1. Click the extension icon
2. Click **Clean Current Site** button
3. Current website is instantly cleaned (all three options)

### Method 3: Keyboard Shortcut

- **Windows/Linux**: Press `Ctrl+Shift+L`
- **Mac**: Press `Cmd+Shift+L`
- Instantly cleans the current website

### Method 4: Context Menu

1. Right-click on any webpage
2. Select **"Clean This Site (All-in-One Cleaner)"**
3. Current website is cleaned

## 🔧 Matching Logic

### Domain Matching
- Input: `example.com`
- Matches: 
  - `example.com`
  - `www.example.com`
  - `sub.example.com`
  - `any.domain.example.com`

### Path Matching
- Input: `example.com/blog/`
- Matches: 
  - `example.com/blog/`
  - `example.com/blog/post-1`
  - `www.example.com/blog/api`
- Does NOT match:
  - `example.com/other/`

## 📋 Permissions Explained

- **`history`**: Read and delete your browsing history
- **`cookies`**: Read and delete cookies
- **`browsingData`**: Clear cache storage
- **`contextMenus`**: Add right-click context menu option
- **`<all_urls>`**: Allow the extension to work on any website

## 🛡️ Privacy & Security

- ✅ **Offline First**: All operations happen locally in your browser
- ✅ **No Data Collection**: We don't collect, store, or send your data anywhere
- ✅ **Open Source**: Code is transparent and auditable
- ✅ **No Ads**: Completely ad-free
- ✅ **No Tracking**: No analytics or telemetry

## ⚙️ File Structure

```
├── manifest.json          # Extension configuration
├── popup.html             # Popup UI interface
├── popup.js               # Popup logic and event handlers
├── background.js          # Background service worker
├── styles.css             # Styling for popup
└── README.md             # This file
```

## 🔄 How It Works

1. **History Cleaning**:
   - Queries entire browsing history
   - Filters entries matching the domain/path
   - Deletes each matching entry

2. **Cookie Cleaning**:
   - Retrieves all cookies for the domain
   - Removes cookies for both domain and subdomains
   - Handles different store IDs

3. **Cache Cleaning**:
   - Uses Chrome's `browsingData.remove()` API
   - Clears cache, cacheStorage for specified origins
   - Handles both http:// and https:// variants

## ⚡ Keyboard Shortcuts

You can customize the keyboard shortcut:

1. Go to `chrome://extensions/shortcuts` (Chrome) or `about:addons` → Manage Shortcuts (Firefox)
2. Find "All-in-One Cleaner"
3. Click on "Clean current site" shortcut
4. Enter your preferred combination
5. Click Save

## 🐛 Troubleshooting

### Nothing happens when I click Clean
- Make sure you've entered a valid URL or domain
- Check browser console (F12) for any errors
- Verify extension has required permissions

### Extension doesn't have permission for a site
- Some sites like Chrome Web Store are protected
- The extension can't clean data for system pages

### Keyboard shortcut not working
- Verify it's enabled in `chrome://extensions/shortcuts`
- Some keyboard combinations may conflict with OS shortcuts
- Try a different shortcut combination

## 🚀 Future Enhancements

- [ ] Browsing data analytics (show storage usage per site)
- [ ] Auto-clean on schedule
- [ ] Whitelist/Blacklist for automatic cleaning
- [ ] Session management
- [ ] Export/Import settings
- [ ] Dark mode
- [ ] Multi-language support

## 📝 Notes

- **Irreversible**: Deleted data cannot be recovered. Use carefully!
- **History Search**: History API has limitations; some very old entries might not be searchable
- **Third-party Cookies**: Extension removes both first-party and third-party cookies for a domain

## 📄 License

This extension is free and open source. Feel free to modify and distribute.

## 💡 Tips

1. **Before removing data**: Consider exporting important history first
2. **Regular cleanup**: Use keyboard shortcut for quick regular maintenance
3. **Privacy mode**: Sites with long history benefit most from this extension
4. **Path-specific cleaning**: Useful for cleaning specific sections of large websites

---

Happy cleaning! 🧹✨
