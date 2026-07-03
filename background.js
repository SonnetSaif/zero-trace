// Utility function to extract domain from URL
function extractDomain(url) {
    try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        return parsedUrl.hostname;
    } catch {
        return null;
    }
}

// Extract path from URL (for prefix matching)
function extractPath(url) {
    try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        return parsedUrl.pathname;
    } catch {
        return '/';
    }
}

// Check if history URL matches the target domain/path
function isHistoryMatch(historyUrl, targetDomain, targetPath) {
    try {
        const parsedUrl = new URL(historyUrl);
        const historyDomain = parsedUrl.hostname;
        const historyPath = parsedUrl.pathname;

        // Check domain and subdomains (*.domain.com matches domain.com)
        const domainMatch = historyDomain === targetDomain || 
                          historyDomain.endsWith(`.${targetDomain}`);
        
        if (!domainMatch) return false;

        // Check path prefix
        if (targetPath && targetPath !== '/') {
            return historyPath.startsWith(targetPath);
        }
        
        return true;
    } catch {
        return false;
    }
}

// Clean history
async function cleanHistory(domain, path) {
    return new Promise((resolve) => {
        chrome.history.search({ text: '', maxResults: 999999 }, (results) => {
            const toDelete = results.filter(item => 
                isHistoryMatch(item.url, domain, path)
            );

            toDelete.forEach(item => {
                chrome.history.deleteUrl({ url: item.url });
            });

            resolve(toDelete.length);
        });
    });
}

// Clean cookies
async function cleanCookies(domain) {
    return new Promise((resolve) => {
        chrome.cookies.getAll({ domain: domain }, (cookies) => {
            let deleted = 0;
            cookies.forEach(cookie => {
                chrome.cookies.remove({
                    url: `https://${domain}${cookie.path}`,
                    name: cookie.name,
                    storeId: cookie.storeId
                }, () => {
                    deleted++;
                });
            });

            // Also check subdomains
            chrome.cookies.getAll({ domain: `.${domain}` }, (subdomainCookies) => {
                subdomainCookies.forEach(cookie => {
                    chrome.cookies.remove({
                        url: `https://${domain}${cookie.path}`,
                        name: cookie.name,
                        storeId: cookie.storeId
                    }, () => {
                        deleted++;
                    });
                });

                setTimeout(() => resolve(deleted), 500);
            });
        });
    });
}

// Clean cache/browsing data
async function cleanCache(domain) {
    return new Promise((resolve) => {
        const origins = [
            `https://${domain}`,
            `http://${domain}`,
            `https://www.${domain}`,
            `http://www.${domain}`
        ];

        chrome.browsingData.remove(
            {
                origins: origins,
                since: 0
            },
            {
                cache: true,
                cacheStorage: true,
                cookies: false,
                history: false
            },
            () => {
                resolve(1);
            }
        );
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'cleanData') {
        (async () => {
            const domain = message.domain;
            const path = message.path;
            const results = {
                history: 0,
                cookies: 0,
                cache: 0
            };

            try {
                if (message.cleanHistory) {
                    results.history = await cleanHistory(domain, path);
                }
                if (message.cleanCookies) {
                    results.cookies = await cleanCookies(domain);
                }
                if (message.cleanCache) {
                    results.cache = await cleanCache(domain);
                }

                sendResponse({
                    success: true,
                    results: results
                });
            } catch (error) {
                sendResponse({
                    success: false,
                    error: error.message
                });
            }
        })();

        return true; // Will respond asynchronously
    }

    if (message.action === 'getCurrentDomain') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0]?.url;
            if (url) {
                const domain = extractDomain(url);
                sendResponse({ domain: domain });
            } else {
                sendResponse({ domain: null });
            }
        });
        return true;
    }
});

// Context menu for quick clean
chrome.contextMenus.create({
    id: 'cleanCurrentSite',
    title: 'Clean This Site (All-in-One Cleaner)',
    contexts: ['page']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cleanCurrentSite') {
        const domain = extractDomain(tab.url);
        if (domain) {
            chrome.runtime.sendMessage({
                action: 'cleanData',
                domain: domain,
                path: '/',
                cleanHistory: true,
                cleanCookies: true,
                cleanCache: true
            });
        }
    }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
    if (command === 'clean-current-site') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const domain = extractDomain(tabs[0].url);
            if (domain) {
                chrome.runtime.sendMessage({
                    action: 'cleanData',
                    domain: domain,
                    path: '/',
                    cleanHistory: true,
                    cleanCookies: true,
                    cleanCache: true
                });
            }
        });
    }
});
