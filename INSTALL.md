# 🚀 Installation & Setup Guide

## Quick Start (Chrome/Edge/Brave)

### Option 1: Load Unpacked (Recommended for Development)

1. **Navigate to Extensions**:
   - Chrome: Open `chrome://extensions/`
   - Edge: Open `edge://extensions/`
   - Brave: Open `brave://extensions/`

2. **Enable Developer Mode**:
   - Look for the toggle in the top-right corner
   - Click to enable it

3. **Load the Extension**:
   - Click "Load unpacked"
   - Navigate to the extension folder
   - Select the folder containing `manifest.json`
   - Click "Open"

4. **Verify Installation**:
   - You should see the extension listed
   - Status shows "Enabled"
   - Extension icon appears in your toolbar

## Firefox Setup

### Option 1: Temporary Load (Development)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the extension `manifest.json`
4. Confirm the add-on appears in the Temporary Extensions list

### Option 2: Persistent Install (Signed XPI)

1. Create a zip of this extension with `manifest.json` at the archive root
2. Upload to Firefox Add-ons (AMO) for signing
3. Install the signed `.xpi` output
4. Restart Firefox and verify the extension remains installed

### Option 2: Using a File Manager

1. **Windows**:
   - Right-click the extension folder
   - Copy path: `c:\Users\islams6\Downloads\dummy`
   - Go to `chrome://extensions/`
   - Drag and drop the folder into the page

2. **macOS/Linux**:
   - Open file manager to extension folder
   - Drag it to `chrome://extensions/`

## 🧪 Testing the Extension

### Test 1: Basic UI Test
1. Click the extension icon in toolbar
2. You should see the popup with:
   - URL input field
   - Three checkboxes (History, Cookies, Cache)
   - "Clean Now" button
   - "Clean Current Site" button

### Test 2: Current Site Cleaning
1. Visit any website (e.g., google.com)
2. Click extension icon
3. Click "Clean Current Site"
4. You should see:
   - Loading message
   - Success message after 2-3 seconds
   - Results showing deleted items

### Test 3: Custom URL Cleaning
1. Click extension icon
2. Enter `example.com` (or any domain)
3. Keep checkboxes checked
4. Click "Clean Now"
5. Should complete with results

### Test 4: Keyboard Shortcut
1. Press `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac)
2. Current site should be cleaned

### Test 5: Context Menu
1. Right-click on any webpage
2. You should see "Clean This Site (All-in-One Cleaner)" option
3. Click it to clean the current website

## ⚙️ Configuration

### Permissions
The extension requires these permissions (already in manifest.json):
```json
{
  "permissions": [
    "history",           // Read/delete browsing history
    "cookies",           // Read/delete cookies
    "browsingData",      // Clear cache
    "contextMenus"       // Add context menu item
  ],
  "host_permissions": [
    "<all_urls>"         // Allow operation on all websites
  ]
}
```

### Keyboard Shortcut Customization

**Chrome:**
1. Go to `chrome://extensions/shortcuts`
2. Scroll to "All-in-One Cleaner"
3. Find "Clean current site"
4. Click the input field and press your desired key combination
5. Click "Save"

**Edge:**
1. Go to `edge://extensions/shortcuts`
2. Follow same steps as Chrome

**Brave:**
1. Go to `brave://extensions/shortcuts`
2. Follow same steps as Chrome

## 📁 File Descriptions

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration and metadata |
| `popup.html` | UI for the extension popup |
| `popup.js` | Popup logic and event handling |
| `background.js` | Core cleaning logic (runs in background) |
| `styles.css` | Beautiful styling for the popup |
| `package.json` | NPM configuration (optional) |
| `README.md` | User documentation |
| `INSTALL.md` | This file |

## 🔍 Debugging

### View Console Logs
1. Right-click extension icon → "Inspect popup" (Chrome/Edge)
2. Look at the Console tab
3. Or check background worker logs:
   - Go to `chrome://extensions/`
   - Click "Service Worker" link under the extension
   - View console output

### Check Permissions
1. Go to `chrome://extensions/`
2. Find "All-in-One Cleaner"
3. Click "Details"
4. Scroll down to see "Permissions"
5. Verify all required permissions are listed

### Verify Extension ID
- Extension ID visible on `chrome://extensions/` page
- Note it for debugging purposes

## 🐛 Common Issues & Solutions

### Issue: Nothing Happens When I Click Clean
**Solution**:
1. Check console for errors (Inspect popup)
2. Verify permissions granted
3. Try refreshing the extension:
   - Go to `chrome://extensions/`
   - Toggle off and on
   - Clear site data first (manually)

### Issue: Keyboard Shortcut Doesn't Work
**Solution**:
1. Go to `chrome://extensions/shortcuts`
2. Check that shortcut is enabled
3. Verify no conflicts with other shortcuts
4. Try a different key combination

### Issue: Context Menu Not Showing
**Solution**:
1. Refresh the extension
2. Right-click → "Inspect" → check Console
3. Verify "contextMenus" in permissions
4. Try reloading the extension

### Issue: Extension Won't Load
**Solution**:
1. Verify folder contains `manifest.json`
2. Check manifest.json syntax (must be valid JSON)
3. Try "Load unpacked" again
4. Check browser console for errors

## 📊 Performance Tips

- **Large History**: First clean might take 5-10 seconds with massive history
- **Cookies**: Usually processes instantly
- **Cache**: Depends on cache size

## 🔐 Security Checklist

✅ All code runs locally in your browser
✅ No external API calls
✅ No data transmitted anywhere
✅ Permissions are minimal and necessary
✅ Code is auditable and transparent

## 🎯 Next Steps

1. **Test thoroughly** with different websites
2. **Customize keyboard shortcut** (optional)
3. **Pin extension icon** to toolbar for easy access
4. **Share feedback** or report issues
5. **Consider pinning** to your browser toolbar

## 📞 Getting Help

If you encounter issues:
1. Check console logs (Inspect popup)
2. Verify manifest.json is valid
3. Try refreshing the extension
4. Restart your browser
5. Reload the extension

---

Happy cleaning! 🧹✨
