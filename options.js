const input = document.getElementById("webhook");
const saveBtn = document.getElementById("saveBtn");
const testBtn = document.getElementById("testBtn");

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

// Test webhook
testBtn.addEventListener("click", () => {
    const url = input.value.trim();
    if (!url) return alert("Please enter a valid URL");

    const payload = {
        username: "5e Roll Capture",
        content: "✅ Test message from your webhook!"
    };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (res.ok) {
                alert("Test message sent successfully!");
            } else {
                alert("Failed to send test message: " + res.statusText);
            }
        })
        .catch(err => alert("Error sending test message: " + err));
});
