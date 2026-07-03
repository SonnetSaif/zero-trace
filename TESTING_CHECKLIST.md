# ✅ Testing Checklist

## Installation Tests

- [ ] Extension loads without errors
- [ ] Extension icon appears in toolbar
- [ ] Extension listed in `chrome://extensions/`
- [ ] Status shows "Enabled"
- [ ] Extension has a unique ID assigned

## Popup UI Tests

- [ ] Popup opens when icon clicked
- [ ] All UI elements visible and properly formatted
- [ ] URL input field accepts text
- [ ] Three checkboxes are present and clickable
- [ ] "Clean Now" button is clickable
- [ ] "Clean Current Site" button is clickable
- [ ] Status area displays messages
- [ ] Results area shows after cleaning

## Input Validation Tests

- [ ] Empty input shows error message
- [ ] Invalid URL shows error message
- [ ] Valid domain accepted (e.g., "google.com")
- [ ] Valid URL accepted (e.g., "https://example.com")
- [ ] Path-based URL accepted (e.g., "example.com/path/")
- [ ] Trimming works (leading/trailing spaces)

## Checkbox Tests

- [ ] All three checkboxes default to checked
- [ ] Unchecking History works
- [ ] Unchecking Cookies works
- [ ] Unchecking Cache works
- [ ] At least one checkbox required (shows error if all unchecked)
- [ ] Preferences saved and remembered

## Cleaning Functionality Tests

### History Cleaning
- [ ] Clicking "Clean Now" starts cleaning
- [ ] Loading message appears
- [ ] History entries are actually deleted
- [ ] Multiple URLs for domain are cleaned
- [ ] Subdomains are included
- [ ] Results show count of deleted items
- [ ] Success message appears

### Cookie Cleaning
- [ ] Cookies for domain are deleted
- [ ] Subdomain cookies are deleted
- [ ] Results show correct cookie count
- [ ] Site still functions after cleaning

### Cache Cleaning
- [ ] Cache is cleared
- [ ] CacheStorage is cleared
- [ ] Service worker cache cleared
- [ ] Results show cache cleared

## Quick Clean Tests

- [ ] "Clean Current Site" button works
- [ ] Current website domain detected correctly
- [ ] All options (history/cookies/cache) selected
- [ ] Cleaning completes successfully
- [ ] Results displayed with counts

## Domain Matching Tests

### Exact Domain
- [ ] Input: `example.com`
- [ ] Cleans: example.com ✓
- [ ] Cleans: www.example.com ✓
- [ ] Cleans: api.example.com ✓
- [ ] Cleans: any.subdomain.example.com ✓

### Path Matching
- [ ] Input: `example.com/blog/`
- [ ] Cleans: example.com/blog/ ✓
- [ ] Cleans: example.com/blog/post-1 ✓
- [ ] Does NOT clean: example.com/news/ ✗

### With HTTP/HTTPS
- [ ] Input: `http://example.com` works
- [ ] Input: `https://example.com` works
- [ ] Input: `example.com` (no protocol) works
- [ ] All three produce same results

## Keyboard Shortcut Tests

- [ ] Shortcut works: `Ctrl+Shift+L` (Windows)
- [ ] Shortcut works: `Cmd+Shift+L` (Mac)
- [ ] Cleans current website
- [ ] Works from any tab
- [ ] Works while popup is closed

## Context Menu Tests

- [ ] Right-click on webpage shows menu
- [ ] "Clean This Site" option appears
- [ ] Clicking cleans current website
- [ ] Works on any website
- [ ] Shows results (optional)

## Preference Memory Tests

- [ ] Uncheck History → Popup closes
- [ ] Open popup again → History still unchecked
- [ ] Uncheck all → Shows error when clicking Clean
- [ ] Check Cookies only → Only cookies cleaned
- [ ] Preferences persist across browser restart

## UI/UX Tests

- [ ] Colors display correctly (gradients)
- [ ] Buttons have hover effects
- [ ] Buttons have click feedback
- [ ] Text is readable (sufficient contrast)
- [ ] Icons/symbols display correctly
- [ ] Results panel scrolls if too long
- [ ] Status messages clear and understandable
- [ ] No layout breaking or overlapping

## Error Handling Tests

- [ ] Invalid URL shows friendly error
- [ ] API errors handled gracefully
- [ ] Permission errors handled
- [ ] No JavaScript errors in console
- [ ] User-friendly error messages shown
- [ ] Can retry after error

## Performance Tests

- [ ] Popup opens instantly (< 1 second)
- [ ] Cleaning completes reasonably (< 10 seconds)
- [ ] No frozen/unresponsive interface
- [ ] CPU usage is normal during cleaning
- [ ] Memory usage is reasonable
- [ ] No memory leaks after repeated use

## Compatibility Tests

### Chrome
- [ ] Loads in Chrome ✓
- [ ] All features work ✓
- [ ] UI looks good ✓

### Chromium-based
- [ ] Works in Edge ✓
- [ ] Works in Brave ✓
- [ ] Works in Vivaldi ✓ (if supported)

## Security Tests

- [ ] No console errors/warnings
- [ ] No security warnings
- [ ] No unintended permissions requested
- [ ] API calls are appropriate
- [ ] No data collection
- [ ] No external API calls
- [ ] No tracking code
- [ ] Manifest.json is valid

## Accessibility Tests

- [ ] Keyboard navigation works (Tab through elements)
- [ ] Enter key activates buttons
- [ ] Space bar toggles checkboxes
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Works with screen readers (basic)
- [ ] No keyboard traps

## Edge Cases

- [ ] Very long domain name handled
- [ ] Very long path handled
- [ ] Special characters in domain handled
- [ ] International domains handled (IDN)
- [ ] Multiple subdomains deep handled
- [ ] Very large history cleaned
- [ ] Very large cookie list handled
- [ ] Rapid repeated clicks handled

## Browser Data Tests

### Real Data
- [ ] Test with actual browsing history
- [ ] Test with actual cookies
- [ ] Test with actual cache
- [ ] Verify data is actually deleted (manual check)

### Various Websites
- [ ] Google - works ✓
- [ ] GitHub - works ✓
- [ ] Facebook - works ✓
- [ ] Twitter - works ✓
- [ ] Bank site - works ✓
- [ ] Internal sites - works ✓

## Permission Tests

- [ ] Permission to read history granted
- [ ] Permission to delete history works
- [ ] Permission to read cookies granted
- [ ] Permission to delete cookies works
- [ ] Permission to clear cache works
- [ ] No unexpected permissions requested

## Integration Tests

- [ ] Multiple tabs open - works ✓
- [ ] Works with other extensions installed
- [ ] Works with privacy extensions installed
- [ ] Works with ad blockers installed
- [ ] Doesn't conflict with built-in features

## Stress Tests

- [ ] Clean same domain twice - works ✓
- [ ] Clean different domains in sequence - works ✓
- [ ] Multiple rapid operations - works ✓
- [ ] Very large history search - works ✓

## Documentation Tests

- [ ] README.md is accurate
- [ ] QUICKSTART.md is clear
- [ ] INSTALL.md instructions work
- [ ] ARCHITECTURE.md is correct
- [ ] All examples work as described
- [ ] Links work (if any)

## Final Verification

- [ ] All core features working
- [ ] UI is polished and professional
- [ ] Documentation is complete
- [ ] No console errors
- [ ] No unhandled exceptions
- [ ] Ready for users ✅

---

## Test Results Summary

| Category | Tests | Passed | Failed |
|----------|-------|--------|--------|
| Installation | 5 | | |
| Popup UI | 8 | | |
| Input Validation | 6 | | |
| Checkboxes | 6 | | |
| Cleaning | 7 | | |
| Quick Clean | 5 | | |
| Domain Matching | 5 | | |
| HTTP/HTTPS | 3 | | |
| Keyboard | 3 | | |
| Context Menu | 5 | | |
| Preferences | 5 | | |
| UI/UX | 9 | | |
| Error Handling | 5 | | |
| Performance | 5 | | |
| Compatibility | 3 | | |
| Security | 8 | | |
| Accessibility | 7 | | |
| Edge Cases | 8 | | |
| Browser Data | 6 | | |
| Permissions | 6 | | |
| Integration | 5 | | |
| Stress Tests | 4 | | |
| Documentation | 6 | | |
| **TOTAL** | **162** | | |

---

## Known Limitations

- [ ] History API can't retrieve extremely old entries (Chrome limitation)
- [ ] Some protected sites won't allow cookie deletion
- [ ] Firefox requires separate testing/modification
- [ ] Safari requires separate implementation

---

## Sign-Off

**Tested By:** ___________________
**Date:** ___________________
**Status:** ☐ Ready for Release | ☐ Needs Fixes

**Notes:**
_________________________________________
_________________________________________
_________________________________________

---

Good luck testing! 🧪✨
