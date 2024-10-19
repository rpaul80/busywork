chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelection') {
        const selection = window.getSelection()?.toString() || '';
        sendResponse({ selection });
    }
});

// Optionally, you can add this to capture the current page content
document.addEventListener('DOMContentLoaded', () => {
    const pageContent = document.body.innerText;
    chrome.runtime.sendMessage({
        action: 'setPageContent',
        content: pageContent
    });
});