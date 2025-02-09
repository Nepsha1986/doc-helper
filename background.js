chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });
});

chrome.action.onClicked.addListener(async (tab) => {
    let { enabled } = await chrome.storage.local.get("enabled");
    enabled = !enabled;
    await chrome.storage.local.set({ enabled });

    if (enabled) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
        });
        chrome.action.setIcon({ path: "icon-on.png" });
    } else {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => location.reload(),
        });
        chrome.action.setIcon({ path: "icon-off.png" });
    }
});
