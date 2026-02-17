# 5e.tools Roll Capture - Discord Webhook

Capture dice rolls from [5e.tools](https://5e.tools/) and automatically send them to a Discord channel via webhook.

---

## Features

* Capture all dice rolls (initiative, attacks, damage, etc.) from 5e.tools
* Send rolls as clean Discord embeds with totals and breakdown
* Show monster or PC token avatars in Discord messages when available
* **Popup overlay** when clicking the extension icon (quick access to settings & roller)
* **Options page** with the same functionality as the popup
* Custom dice roller (supports formulas like `1d20`, `2d6+3`, `5d8-2`)
* Advantage / Disadvantage rolling support
* User-configurable Discord webhook URL
* **Test your webhook** before rolling to confirm it works
* Works for first roll and subsequent rolls reliably

---

## Installation (Local)

1. Clone this repository:

   ```bash
   git clone https://github.com/blink1197/5e-tools-roll-extension.git
   ```

2. Open Chrome → `chrome://extensions/`

3. Enable **Developer mode** (toggle in the top-right)

4. Click **Load unpacked** → select the folder you cloned

5. The extension should now appear in your toolbar

---

## Usage

### Quick Setup (Popup Overlay)

1. Click the **extension icon** in your Chrome toolbar
2. Enter your **Discord Webhook URL**
3. Click **Save**
4. (Optional) Use the **custom dice roller** directly in the popup

---

### Using the Options Page

1. Right-click the extension icon → **Options**
2. Enter your **Discord Webhook URL** and click **Save**
3. Optionally click **Test Webhook** to send a test message

   * This ensures your webhook is valid and working

---

### Rolling Dice on 5e.tools

1. Go to **https://5e.tools/**
2. Roll dice normally (initiative, attacks, etc.)
3. Rolls will automatically be sent to your Discord channel

---

## Notes

* Only works on `https://5e.tools/*` pages
* Token images are automatically captured if available
* No personal data is collected or transmitted
* You can update your webhook anytime via **popup** or **options page**
* Popup and Options page share the same settings and roller functionality

---

## License

MIT License
