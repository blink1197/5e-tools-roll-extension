console.log("[5e Roll Capture] content script loaded");

window.__pendingRolls = window.__pendingRolls || [];
window.__pendingRolls.push({
    label: packed.name,
    expression: packed.toRoll,
    context: packed.context,
    time: Date.now()
});


document.addEventListener("click", (event) => {
    const el = event.target.closest(".roller.render-roller");
    if (!el) return;

    let packed;
    try {
        packed = JSON.parse(el.dataset.packedDice);
    } catch {
        return;
    }

    console.log("[Roll Click]", {
        label: packed.name,
        expression: packed.toRoll,
        context: packed.context,
        display: el.textContent.trim()
    });

    window.__lastRollContext = {
        label: packed.name,
        expression: packed.toRoll,
        context: packed.context,
        time: Date.now()
    };
}, true);

function waitForRollbox() {
    const el = document.querySelector(".out-roll-wrp");
    if (el) return Promise.resolve(el);

    return new Promise(resolve => {
        const obs = new MutationObserver(() => {
            const el = document.querySelector(".out-roll-wrp");
            if (el) {
                obs.disconnect();
                resolve(el);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    });
}


waitForRollbox().then((rollWrp) => {
    console.log("[5e Roll Capture] Rollbox ready");

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
});



function handleRollResult(node) {
    const total = node.querySelector(".roll")?.textContent?.trim();
    const breakdown = node.querySelector(".all-rolls")?.textContent?.trim();
    const title = node.getAttribute("title");

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
}
