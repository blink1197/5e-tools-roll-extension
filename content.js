console.log("[5e Roll Capture] content script loaded");

document.addEventListener("click", (event) => {
    const el = event.target.closest("span, a, button");
    if (!el) return;

    if (
        el.dataset.roll ||
        el.dataset.packedDice ||
        el.className?.toLowerCase().includes("roll")
    ) {
        console.log("[5e Roll Capture] Rollable clicked:", {
            text: el.textContent.trim(),
            dataset: el.dataset,
            classes: el.className
        });
    }
}, true);
