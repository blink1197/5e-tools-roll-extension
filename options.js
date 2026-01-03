const input = document.getElementById("webhook");
const saveBtn = document.getElementById("saveBtn");

// Load current webhook
chrome.storage.sync.get("discordWebhook", ({ discordWebhook }) => {
    if (discordWebhook) input.value = discordWebhook;
});

// Save webhook
saveBtn.addEventListener("click", () => {
    const url = input.value.trim();
    chrome.storage.sync.set({ discordWebhook: url }, () => {
        alert("Webhook saved!");
    });
});
