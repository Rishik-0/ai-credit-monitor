# AI Credit Monitor (Manifest V3)

A secure, high-performance Chrome Extension engineered to provide a unified FinOps dashboard for AI developers. It monitors enterprise AI resource utilization, API credit balances, and network latency across multiple LLM providers without routing data through third-party servers.

<img width="399" height="554" alt="dashboard" src="https://github.com/user-attachments/assets/bd6894f5-a40b-40e6-81fa-4c490feb8837" />



## Built With

* **Frontend:** React, Tailwind CSS (for glassmorphism UI)
* **Runtime:** Chrome Extensions API (Manifest V3)
* **Build Tool:** Vite
* **Security:** `crypto-js` (AES-256 Encryption)
* **Architecture:** Strategy/Adapter Pattern

## Systems Architecture

This extension is built with a strict focus on local security, modularity, and Manifest V3 compliance.

* **The Adapter Pattern:** The core engine utilizes an extensible interface (`BaseAdapter`), allowing infinite horizontal scaling for new APIs without touching the core UI logic.
* **Military-Grade Local Security:** Implements `crypto-js` AES encryption. API keys are encrypted at rest in `chrome.storage.local` and only decrypted in memory during network execution.
* **Graceful UI Degradation:** The React rendering engine dynamically degrades from a "Full Telemetry" billing dashboard to a sleek "Ping Monitor" based on the specific capabilities of each provider's REST API.
* **Smart Polling & Rate Limiting:** Implements a decoupled Background Sync Engine with a strict 15-second manual cooldown lock and a passive 120-second auto-poll interval to prevent `429 Too Many Requests` bans.

## Supported Providers & Telemetry

The application intelligently renders data based on the API's public endpoint capabilities:

| Provider | Telemetry Level | Tracked Metrics |
| :--- | :--- | :--- |
| **OpenRouter** | Full Telemetry | Exact Credit Balance, Status, Latency |
| **OpenAI** | Full Telemetry | USD Usage, Hard Limits, Status, Latency |
| **ElevenLabs** | Full Telemetry | Character Count, Character Limits, Status, Latency |
| **YouTube Data v3**| Full Telemetry | Daily Quota Points, Status, Latency |
| **Gemini** | Ping Monitor | Connection Status, Live Latency (ms) |
| **Anthropic** | Ping Monitor | Connection Status, Live Latency (ms) |
| **Groq** | Ping Monitor | Connection Status, Live Latency (ms) |
| **Replicate** | Ping Monitor | Connection Status, Live Latency (ms) |
| **Hugging Face** | Ping Monitor | Connection Status, Live Latency (ms) |
| **Perplexity** | Ping Monitor | Connection Status, Live Latency (ms) |

## Known Limitations
* **YouTube Data v3 Quota:** Currently tracked via a "Local Ledger" estimation. This reflects usage within the extension but does not synchronize with external usage (e.g., Python scripts or server-side calls) using the same API key, as the public YouTube API does not expose a global quota-fetch endpoint.

## Privacy & Security

**Zero-Knowledge Architecture:** This extension operates 100% locally. 
1. No telemetry, analytics, or API keys are ever sent to an external database.
2. Network calls are made directly from your browser to the respective AI providers.
3. Does not use unsafe `window.fetch` monkey-patching or require invasive `<all_urls>` DOM permissions.

## Developer Setup

To build and run this extension locally:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the Vite React build (optimized for Manifest V3 CSP):
   ```bash
   npm run build
   ```
4. Open Chrome and navigate to `chrome://extensions/`.
5. Enable **Developer mode** in the top right.
6. Click **Load unpacked** and select the `/dist` directory from this project.

## Author
**Rishik Raj P.** Engineered with ❤️ for modern AI development.
