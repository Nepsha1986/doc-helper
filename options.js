document.addEventListener("DOMContentLoaded", async () => {
    const gistInput = document.getElementById("gistUrl");
    const saveButton = document.getElementById("save");
    const status = document.getElementById("status");

    // Load saved Gist URL
    chrome.storage.local.get("gistUrl", (data) => {
        if (data.gistUrl) {
            gistInput.value = data.gistUrl;
        }
    });

    // Save the Gist URL
    saveButton.addEventListener("click", () => {
        const gistUrl = gistInput.value.trim();
        if (!gistUrl) {
            status.textContent = "Please enter a valid URL.";
            status.style.color = "red";
            return;
        }

        chrome.storage.local.set({ gistUrl }, () => {
            status.textContent = "Saved successfully!";
            status.style.color = "green";
        });
    });
});
