export function rollDice(formula, mode = "normal") {
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


export function buildDiscordPayload(roll, title = "Custom Roll") {

    // append ADV/DIS label only
    if (roll.mode === "adv") title += " (ADV)";
    else if (roll.mode === "dis") title += " (DIS)";

    // convert total to emoji
    const digitMap = {
        "0": ":zero:", "1": ":one:", "2": ":two:", "3": ":three:", "4": ":four:",
        "5": ":five:", "6": ":six:", "7": ":seven:", "8": ":eight:", "9": ":nine:", "-": "➖"
    };

    const totalEmoji =
        String(roll.total).split("").map(d => digitMap[d] || d).join("");

    // NAT20/NAT1 detection (only counted dice, only d20)
    let rollColorEmoji = "";
    let embedColor = 3447003;

    if (roll.sides === 20) {

        const countedOnly = roll.breakdown.replace(/~~.*?~~/g, "");

        const diceResults =
            countedOnly.match(/\[(\d+)\]/g)
                ?.map(x => parseInt(x.replace(/\D/g, ""))) || [];

        if (diceResults.includes(20)) {
            rollColorEmoji = "🟢";
            embedColor = 5763719;
        }
        else if (diceResults.includes(1)) {
            rollColorEmoji = "🔴";
            embedColor = 15548997;
        }
    }

    return {
        username: "Custom Dice Roller",
        embeds: [{
            title,
            description: `${totalEmoji} ${rollColorEmoji}\n\n||🎲 ${roll.expression} → ${roll.breakdown}||`,
            color: embedColor
        }]
    };
}


export function sendRollToDiscord(webhookUrl, payload) {

    return fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}