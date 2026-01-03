console.log("[5e Roll Capture] content script loaded");

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

