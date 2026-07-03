// Extract domain from URL
function extractDomain(url) {
    try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        return parsedUrl.hostname;
    } catch {
        return null;
    }
}

// Extract path from URL
function extractPath(url) {
    try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        return parsedUrl.pathname;
    } catch {
        return '/';
    }
}

// Display status message
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status show ${type}`;
}

// Display results
function displayResults(results) {
    const resultsEl = document.getElementById('results');
    let html = '<div class="results-item">';
    html += `<div class="results-label">History Entries Deleted:</div>`;
    html += `<div class="results-value">${results.history} items</div>`;
    html += '</div>';
    
    html += '<div class="results-item">';
    html += `<div class="results-label">Cookies Deleted:</div>`;
    html += `<div class="results-value">${results.cookies} items</div>`;
    html += '</div>';
    
    html += '<div class="results-item">';
    html += `<div class="results-label">Cache Cleared:</div>`;
    html += `<div class="results-value">Yes</div>`;
    html += '</div>';
    
    resultsEl.innerHTML = html;
    resultsEl.classList.add('show');
}

// Clean data
function performClean() {
    const urlInput = document.getElementById('urlInput').value.trim();
    
    if (!urlInput) {
        showStatus('Please enter a website URL or domain', 'error');
        return;
    }

    const domain = extractDomain(urlInput);
    const path = extractPath(urlInput);

    if (!domain) {
        showStatus('Invalid URL or domain format', 'error');
        return;
    }

    const cleanHistory = document.getElementById('cleanHistory').checked;
    const cleanCookies = document.getElementById('cleanCookies').checked;
    const cleanCache = document.getElementById('cleanCache').checked;

    if (!cleanHistory && !cleanCookies && !cleanCache) {
        showStatus('Please select at least one option to clean', 'error');
        return;
    }

    showStatus('Cleaning... Please wait', 'loading');
    document.getElementById('cleanBtn').disabled = true;
    document.getElementById('cleanCurrentBtn').disabled = true;

    chrome.runtime.sendMessage({
        action: 'cleanData',
        domain: domain,
        path: path,
        cleanHistory: cleanHistory,
        cleanCookies: cleanCookies,
        cleanCache: cleanCache
    }, (response) => {
        document.getElementById('cleanBtn').disabled = false;
        document.getElementById('cleanCurrentBtn').disabled = false;

        if (response.success) {
            showStatus('✅ Cleaning completed successfully!', 'success');
            displayResults(response.results);
        } else {
            showStatus(`❌ Error: ${response.error}`, 'error');
        }
    });
}

// Get current domain and clean
function cleanCurrentSite() {
    chrome.runtime.sendMessage({ action: 'getCurrentDomain' }, (response) => {
        if (response.domain) {
            document.getElementById('urlInput').value = response.domain;
            showStatus('Cleaning current site... Please wait', 'loading');
            document.getElementById('cleanBtn').disabled = true;
            document.getElementById('cleanCurrentBtn').disabled = true;

            chrome.runtime.sendMessage({
                action: 'cleanData',
                domain: response.domain,
                path: '/',
                cleanHistory: true,
                cleanCookies: true,
                cleanCache: true
            }, (cleanResponse) => {
                document.getElementById('cleanBtn').disabled = false;
                document.getElementById('cleanCurrentBtn').disabled = false;

                if (cleanResponse.success) {
                    showStatus('✅ Current site cleaned successfully!', 'success');
                    displayResults(cleanResponse.results);
                } else {
                    showStatus(`❌ Error: ${cleanResponse.error}`, 'error');
                }
            });
        } else {
            showStatus('Could not detect current site', 'error');
        }
    });
}

// Event listeners
document.getElementById('cleanBtn').addEventListener('click', performClean);
document.getElementById('cleanCurrentBtn').addEventListener('click', cleanCurrentSite);

// Allow Enter key to trigger clean
document.getElementById('urlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performClean();
    }
});

// Load saved preferences
window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['cleanHistory', 'cleanCookies', 'cleanCache'], (data) => {
        if (data.cleanHistory !== undefined) {
            document.getElementById('cleanHistory').checked = data.cleanHistory;
        }
        if (data.cleanCookies !== undefined) {
            document.getElementById('cleanCookies').checked = data.cleanCookies;
        }
        if (data.cleanCache !== undefined) {
            document.getElementById('cleanCache').checked = data.cleanCache;
        }
    });
});

// Save preferences when changed
document.getElementById('cleanHistory').addEventListener('change', (e) => {
    chrome.storage.local.set({ cleanHistory: e.target.checked });
});
document.getElementById('cleanCookies').addEventListener('change', (e) => {
    chrome.storage.local.set({ cleanCookies: e.target.checked });
});
document.getElementById('cleanCache').addEventListener('change', (e) => {
    chrome.storage.local.set({ cleanCache: e.target.checked });
});
