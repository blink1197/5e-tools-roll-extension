import { buildDiscordPayload, rollDice, sendRollToDiscord } from "./dice.js";

const input = document.getElementById("webhook");

// Load saved webhook
chrome.storage.sync.get("discordWebhook", ({ discordWebhook }) => {
    if (discordWebhook) input.value = discordWebhook;
});

// Save webhook
document.getElementById("saveBtn").onclick = () => {
    const url = input.value.trim();
    chrome.storage.sync.set({ discordWebhook: url }, () => {
        alert("Webhook saved!");
    });
};

// Test webhook
testBtn.addEventListener("click", () => {
    const url = input.value.trim();
    if (!url) return alert("Please enter a valid URL");

    const payload = {
        username: "5e Roll Capture",
        content: "✅ Test message from your webhook!"
    };

    sendRollToDiscord(url, payload)
        .then(res => {
            if (!res.ok) alert("Failed to send roll");
        })
        .catch(err => alert(err));
});

// ----------------------------
// Send roll to Discord
// ----------------------------
function sendCustomRoll(mode = "normal") {
    const url = input.value.trim();
    if (!url) return alert("Enter webhook URL first");

    const formula = document.getElementById("rollInput").value.trim();
    if (!formula) return alert("Enter a roll formula");

    const titleInput = document.getElementById("titleInput").value.trim();

    const roll = rollDice(formula, mode);
    if (!roll) return alert("Invalid roll");

    const payload = buildDiscordPayload(roll, titleInput || "Custom Roll");

    sendRollToDiscord(url, payload)
        .then(res => {
            if (!res.ok) alert("Failed to send roll");
        })
        .catch(err => alert(err));
}

document.getElementById("normalBtn").onclick = () => sendCustomRoll("normal");
document.getElementById("advBtn").onclick = () => sendCustomRoll("adv");
document.getElementById("disBtn").onclick = () => sendCustomRoll("dis");
