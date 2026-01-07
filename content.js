console.log("[5e Roll Capture] content script loaded");

// ----------------------------
// Queue for pending roll intents
// ----------------------------
window.__pendingRolls = window.__pendingRolls || [];

// ----------------------------
// Click listener — capture roll intent
// ----------------------------
document.addEventListener("mousedown", (event) => {
    const el = event.target.closest(".roller.render-roller");
    if (!el) return;

    let packed;
    try {
        packed = JSON.parse(el.dataset.packedDice);
    } catch {
        return; // Not a rollable element
    }

    const intent = {
        label: packed.name,
        expression: packed.toRoll,
        context: packed.context,
        time: Date.now()
    };

    // Push into pending queue
    window.__pendingRolls.push(intent);

    // Optional: store last click context
    window.__lastRollContext = intent;

    console.log("[Roll Click]", {
        label: packed.name,
        expression: packed.toRoll,
        context: packed.context,
        display: el.textContent.trim()
    });
}, true);

// ----------------------------
// Function to handle each resolved roll
// ----------------------------
function handleRollResult(node) {
    const total = node.querySelector(".roll")?.textContent?.trim();
    const title = node.getAttribute("title");

    const allRollsEl = node.querySelector(".all-rolls");

    let breakdown = "";

    if (allRollsEl) {
        breakdown = Array.from(allRollsEl.childNodes)
            .map(n => {
                if (
                    n.nodeType === Node.ELEMENT_NODE &&
                    n.classList.contains("rll__dropped")
                ) {
                    return `~~${n.textContent.trim()}~~`;
                }

                return n.textContent;
            })
            .join("")
            .trim();
    }

    const rollbox = node.closest(".out-roll-wrp");
    const roller =
        rollbox?.dataset?.rollboxLastRolledByName ||
        document.querySelector(".out-roll-id")?.textContent?.trim();

    const intent = window.__pendingRolls?.shift();

    if (!intent) {
        console.warn("[5e Roll Capture] Roll without intent");
    }

    const result = {
        roller,
        total,
        breakdown,
        title,
        intent
    };

    console.log("[5e Roll Result]", result);

    sendToDiscord(result);
}


// ----------------------------
// Observe rollbox and its children
// ----------------------------
function observeRollbox() {
    // Observe the document for the rollbox to appear
    const bodyObserver = new MutationObserver(() => {
        const rollWrp = document.querySelector(".out-roll-wrp");
        if (rollWrp) {
            console.log("[5e Roll Capture] Rollbox ready");

            // Disconnect body observer — we found the rollbox
            bodyObserver.disconnect();

            // Handle any existing rolls already in the DOM
            rollWrp.querySelectorAll(".out-roll-item").forEach(handleRollResult);

            // Observe new rolls as they appear
            const observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        if (!node.classList.contains("out-roll-item")) continue;

                        handleRollResult(node);
                    }
                }
            });

            observer.observe(rollWrp, { childList: true });
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });
}

// ----------------------------
// Transform roll into a Discord payload
// ----------------------------
function buildDiscordPayload(result) {

    const tokenImg = document.querySelector("#float-token img.stats__token")?.src;
    const avatarUrl = tokenImg ? new URL(tokenImg, window.location.origin).href : null;

    const { roller, total, breakdown, title } = result;
    return {
        username: roller,
        avatar_url: avatarUrl,
        embeds: [
            {
                title: title || "Roll",
                description: `
                **Breakdown:** ${breakdown}\n
                **Result:** ${total}\n`,
                color: 3447003,
            }
        ]
    };
}

// ----------------------------
// Send the payload to a Discord webhook
// ----------------------------
function sendToDiscord(result) {
    chrome.storage.sync.get("discordWebhook", ({ discordWebhook }) => {
        if (!discordWebhook) {
            console.warn("[5e Roll Capture] No Discord webhook configured.");
            return;
        }

        const payload = buildDiscordPayload(result);

        fetch(discordWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) console.error("Discord webhook failed:", res.statusText);
            })
            .catch(err => console.error("Discord webhook error:", err));
    });
}



// Start observing immediately
observeRollbox();
