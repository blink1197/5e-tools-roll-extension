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

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (res.ok) alert("Test message sent successfully!");
            else alert("Failed to send test message: " + res.statusText);
        })
        .catch(err => alert("Error sending test message: " + err));
});

// ----------------------------
// Dice Roller
// ----------------------------
function rollDice(formula, mode = "normal") {
    // parse dice like 2d20+3-1
    const match = formula.match(/(\d*)d(\d+)(.*)/i);
    if (!match) return null;

    let count = parseInt(match[1] || "1");
    const sides = parseInt(match[2]);
    const modifierPart = match[3] || "";

    let rolls = [];

    // ADV/DIS only applies to single d20
    if ((mode === "adv" || mode === "dis") && count === 1 && sides === 20) {
        const r1 = Math.floor(Math.random() * 20) + 1;
        const r2 = Math.floor(Math.random() * 20) + 1;

        let kept, dropped;
        if (mode === "adv") {
            kept = Math.max(r1, r2);
            dropped = Math.min(r1, r2);
        } else {
            kept = Math.min(r1, r2);
            dropped = Math.max(r1, r2);
        }

        const modifier = Number(modifierPart.replace(/\s/g, "")) || 0;
        const total = kept + modifier;

        return {
            total,
            breakdown: `[${kept}]+~~[${dropped}]~~${modifierPart ? ' ' + modifierPart : ''}`,
            expression: formula,
            mode
        };
    }

    // normal rolls
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const sum = rolls.reduce((a, b) => a + b, 0);
    const modifier = Number(modifierPart.replace(/\s/g, "")) || 0;
    const total = sum + modifier;

    return {
        total,
        breakdown: rolls.map(r => `[${r}]`).join("+") + (modifierPart ? " " + modifierPart : ""),
        expression: formula,
        mode
    };
}

// ----------------------------
// Send roll to Discord
// ----------------------------
function sendCustomRoll(mode = "normal") {
    const url = input.value.trim();
    if (!url) return alert("Enter webhook URL first");

    const formula = document.getElementById("rollInput").value.trim();
    if (!formula) return alert("Enter a roll formula");

    const roll = rollDice(formula, mode);
    if (!roll) return alert("Invalid roll format");

    // Optional title
    let titleInput = document.getElementById("titleInput").value.trim();
    let embedTitle = titleInput || "Custom Roll";

    // Append mode if ADV or DIS only (skip normal)
    if (mode === "adv") embedTitle += " (ADV)";
    else if (mode === "dis") embedTitle += " (DIS)";

    // Convert total to emoji
    const digitMap = {
        "0": ":zero:", "1": ":one:", "2": ":two:", "3": ":three:", "4": ":four:",
        "5": ":five:", "6": ":six:", "7": ":seven:", "8": ":eight:", "9": ":nine:", "-": "➖"
    };
    const totalEmoji = String(roll.total).split("").map(d => digitMap[d] || d).join("");

    const cleanBreakdown = roll.breakdown.replace(/~~.*?~~/g, "");

    // Detect NAT20 / NAT1 — only for d20
    let rollColorEmoji = "";
    let embedColor = 3447003; // default blue

    if (roll.expression.match(/d20/i)) {
        // extract all dice numbers in breakdown
        const diceResults = roll.breakdown.match(/\d+/g)?.map(n => parseInt(n)) || [];
        if (diceResults.includes(20)) {
            rollColorEmoji = "🟢";
            embedColor = 5763719;
        } else if (diceResults.includes(1)) {
            rollColorEmoji = "🔴";
            embedColor = 15548997;
        }
    }

    // Build payload
    const payload = {
        username: "Custom Dice Roller",
        embeds: [{
            title: embedTitle,
            description: `${totalEmoji} ${rollColorEmoji}\n\n||🎲 ${roll.expression} → ${roll.breakdown}||`,
            color: embedColor
        }]
    };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) alert("Failed to send custom roll: " + res.statusText);
        })
        .catch(err => alert("Error sending custom roll: " + err));
}

document.getElementById("normalBtn").onclick = () => sendCustomRoll("normal");
document.getElementById("advBtn").onclick = () => sendCustomRoll("adv");
document.getElementById("disBtn").onclick = () => sendCustomRoll("dis");
