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
        const domainMatch = historyDomain === targetDomain ||
            historyDomain.endsWith(`.${targetDomain}`);

        if (!domainMatch) return false;

        if (targetPath && targetPath !== '/') {
            return historyPath.startsWith(targetPath);
        }

        return true;
    } catch {
        return false;
    }
}

function isKeywordHistoryMatch(historyItem, keyword) {
    const normalizedKeyword = keyword.toLowerCase();
    const url = (historyItem.url || '').toLowerCase();
    const title = (historyItem.title || '').toLowerCase();
    return url.includes(normalizedKeyword) || title.includes(normalizedKeyword);
}

function getCookieLookupDomain(domain) {
    return domain.startsWith('.') ? domain : `.${domain}`;
}

function buildCookieRemovalUrl(cookie) {
    const cookieDomain = cookie.domain.startsWith('.')
        ? cookie.domain.slice(1)
        : cookie.domain;
    const protocol = cookie.secure ? 'https' : 'http';
    return `${protocol}://${cookieDomain}${cookie.path}`;
}

async function getCookiesByDomain(domain) {
    return new Promise((resolve) => {
        chrome.cookies.getAll({ domain: domain }, (cookies) => {
            resolve(cookies);
        });
    });
}

async function removeCookies(cookies) {
    return new Promise((resolve) => {
        if (!cookies.length) {
            resolve(0);
            return;
        }

        const seen = new Set();
        const uniqueCookies = cookies.filter((cookie) => {
            const key = `${cookie.storeId}|${cookie.domain}|${cookie.path}|${cookie.name}`;
            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });

        let deleted = 0;
        let processed = 0;

        uniqueCookies.forEach((cookie) => {
            chrome.cookies.remove({
                url: buildCookieRemovalUrl(cookie),
                name: cookie.name,
                storeId: cookie.storeId
            }, (removedCookie) => {
                if (removedCookie) {
                    deleted++;
                }

                processed++;
                if (processed === uniqueCookies.length) {
                    resolve(deleted);
                }
            });
        });
    });
}

async function findOriginsForKeyword(keyword) {
    const keywordLower = keyword.toLowerCase();
    const origins = new Set();

    await Promise.all([
        new Promise((resolve) => {
            chrome.history.search({ text: keywordLower, maxResults: 999999 }, (results) => {
                results.forEach((item) => {
                    try {
                        const parsedUrl = new URL(item.url);
                        const hostname = parsedUrl.hostname.toLowerCase();
                        if (hostname.includes(keywordLower)) {
                            origins.add(`https://${hostname}`);
                            origins.add(`http://${hostname}`);
                        }
                    } catch {
                        // Ignore invalid URL entries from history.
                    }
                });

                resolve();
            });
        }),
        new Promise((resolve) => {
            chrome.cookies.getAll({}, (cookies) => {
                cookies.forEach((cookie) => {
                    const cookieDomain = cookie.domain.startsWith('.')
                        ? cookie.domain.slice(1)
                        : cookie.domain;
                    const normalizedDomain = cookieDomain.toLowerCase();
                    if (normalizedDomain.includes(keywordLower)) {
                        origins.add(`https://${normalizedDomain}`);
                        origins.add(`http://${normalizedDomain}`);
                    }
                });

                resolve();
            });
        })
    ]);

    return Array.from(origins);
}

// Clean history
async function cleanHistory(target) {
    return new Promise((resolve) => {
        if (target.matchMode === 'keyword') {
            chrome.history.search({ text: target.keyword, maxResults: 999999 }, (results) => {
                const toDelete = results.filter((item) =>
                    isKeywordHistoryMatch(item, target.keyword)
                );

                toDelete.forEach((item) => {
                    chrome.history.deleteUrl({ url: item.url });
                });

                resolve(toDelete.length);
            });
            return;
        }

        chrome.history.search({ text: '', maxResults: 999999 }, (results) => {
            const toDelete = results.filter((item) =>
                isHistoryMatch(item.url, target.domain, target.path)
            );

            toDelete.forEach((item) => {
                chrome.history.deleteUrl({ url: item.url });
            });

            resolve(toDelete.length);
        });
    });
}

// Clean cookies
async function cleanCookies(target) {
    if (target.matchMode === 'keyword') {
        return new Promise((resolve) => {
            chrome.cookies.getAll({}, async (cookies) => {
                const matchingCookies = cookies.filter((cookie) =>
                    cookie.domain.toLowerCase().includes(target.keyword)
                );
                const deleted = await removeCookies(matchingCookies);
                resolve(deleted);
            });
        });
    }

    const directCookies = await getCookiesByDomain(target.domain);
    const subdomainCookies = await getCookiesByDomain(
        getCookieLookupDomain(target.domain)
    );
    return removeCookies([...directCookies, ...subdomainCookies]);
}

// Clean cache/browsing data
async function cleanCache(target) {
    return new Promise((resolve) => {
        if (target.matchMode === 'keyword') {
            findOriginsForKeyword(target.keyword).then((origins) => {
                if (!origins.length) {
                    resolve(0);
                    return;
                }

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
                        resolve(origins.length);
                    }
                );
            });
            return;
        }

        const origins = [
            `https://${target.domain}`,
            `http://${target.domain}`,
            `https://www.${target.domain}`,
            `http://www.${target.domain}`
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
            const target = {
                matchMode: message.matchMode === 'keyword' ? 'keyword' : 'url',
                domain: message.domain,
                path: message.path || '/',
                keyword: message.keyword ? message.keyword.toLowerCase() : null
            };
            const results = {
                history: 0,
                cookies: 0,
                cache: 0
            };

            try {
                if (message.cleanHistory) {
                    results.history = await cleanHistory(target);
                }
                if (message.cleanCookies) {
                    results.cookies = await cleanCookies(target);
                }
                if (message.cleanCache) {
                    results.cache = await cleanCache(target);
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
                matchMode: 'url',
                domain: domain,
                path: '/',
                keyword: null,
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
                    matchMode: 'url',
                    domain: domain,
                    path: '/',
                    keyword: null,
                    cleanHistory: true,
                    cleanCookies: true,
                    cleanCache: true
                });
            }
        });
    }
});
