# 5e.tools Roll Capture - Discord Webhook

Capture dice rolls from [5e.tools](https://5e.tools/) and automatically send them to a Discord channel via webhook.

---

## Features

- Capture all dice rolls (initiative, attacks, damage, etc.) from 5e.tools
- Show monster or PC token avatars in Discord embeds
- User-configurable Discord webhook URL via extension options page
- Works for first roll and subsequent rolls reliably
- **Test your webhook** from the options page before rolling
---

## Installation (Local)

1. Clone this repository:
   ```bash
   git clone https://github.com/blink1197/5e-tools-roll-extension.git

2. Open Chrome → chrome://extensions/

3. Enable Developer mode (toggle in the top-right)

4. Click Load unpacked → select the folder you cloned

5. Extension should now appear in your toolbar


## Usage

1. Click the extension icon and open the Options page

2. Enter your Discord Webhook URL and click Save

3. Go to 5e.tools and start rolling dice

4. Optionally, click Test Webhook to send a test message to your Discord channel
    - This ensures your webhook is valid and working

5. Rolls will automatically be sent to your Discord channel

## Notes

- Only works on https://5e.tools/* pages

- Token images are automatically captured if available

- No other data is collected or transmitted

- You can update your webhook anytime via the Options page
