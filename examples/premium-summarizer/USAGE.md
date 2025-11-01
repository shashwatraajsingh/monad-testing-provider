# 📖 Usage Guide - Protected Crypto Data

## 🎯 Overview

This application demonstrates **monad-x402** SDK's capability to protect web content from AI scrapers and bots by requiring payment before access. The middleware automatically detects bot traffic and enforces payment, while allowing human users to browse freely.

## 🚀 Quick Start

### 1. Configure Your Wallet

Edit `.env.local` and add your Monad wallet address:

```env
PAYMENT_RECIPIENT_ADDRESS=0xYourActualMonadWalletAddress
FACILITATOR_URL=https://monad-x402.vercel.app/api/facilitator
```

### 2. Start the Server

```bash
npm run dev
```

The app will start on `http://localhost:3000` (or next available port).

## 🌐 Using the Web Interface

### For Human Users

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Browse freely** - The beautiful UI displays cryptocurrency data
3. **Filter by crypto** - Click buttons to filter by BTC, ETH, SOL, or MON
4. **No payment required** - Human users can access all data through the UI

### What You'll See

- **Real-time crypto prices** for Bitcoin, Ethereum, Solana, and Monad
- **24-hour price changes** with color-coded indicators
- **Market capitalization** for each cryptocurrency
- **Interactive filtering** to view specific cryptocurrencies
- **Beautiful gradient UI** with modern design

## 🤖 Testing Bot Protection

### Method 1: Using the Test Script

Run the included test script to simulate a bot scraper:

```bash
./test-bot-scraper.sh
```

This will attempt to scrape the API and show the **402 Payment Required** response.

### Method 2: Manual cURL Testing

**Test GET request:**
```bash
curl -i http://localhost:3001/api/premium/summarize
```

**Test POST request:**
```bash
curl -i -X POST http://localhost:3001/api/premium/summarize \
  -H "Content-Type: application/json" \
  -d '{"symbol": "ETH"}'
```

### Expected Bot Response

When a bot tries to scrape without payment, it receives:

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "evm-transfer",
      "network": "monad-testnet",
      "maxAmountRequired": "750000",
      "resource": "http://localhost:3001/api/premium/summarize",
      "description": "Premium AI text summarization (<= 1,000 chars)",
      "mimeType": "application/json",
      "payTo": "0xYourMonadWalletAddress",
      "maxTimeoutSeconds": 10
    }
  ]
}
```

## 🔐 How the Protection Works

### Architecture

```
┌─────────────┐
│   Browser   │ ──────────────────────────────┐
│  (Human)    │                               │
└─────────────┘                               │
                                              ▼
┌─────────────┐                      ┌──────────────┐
│  AI Bot/    │ ────────────────────▶│  Next.js     │
│  Scraper    │                      │  Middleware  │
└─────────────┘                      │  (monad-x402)│
                                     └──────────────┘
                                              │
                                              ├─── Detects Bot Traffic
                                              │
                                              ├─── Checks Payment Header
                                              │
                                              ▼
                                     ┌──────────────┐
                                     │   Decision   │
                                     └──────────────┘
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        │                                           │
                   ✅ Human User                              🤖 Bot/Scraper
                        │                                           │
                        ▼                                           ▼
              ┌──────────────────┐                      ┌──────────────────┐
              │  Allow Access    │                      │ 402 Payment      │
              │  to API          │                      │ Required         │
              └──────────────────┘                      └──────────────────┘
```

### Protection Flow

1. **Request Received** → Middleware intercepts all requests to `/api/premium/*`
2. **Bot Detection** → Checks if request is from a bot/scraper
3. **Payment Check** → Verifies if payment header is present
4. **Response**:
   - ✅ **Human/Paid**: Access granted
   - ❌ **Bot/Unpaid**: 402 Payment Required with payment instructions

## 🎨 Customization

### Change Payment Amount

Edit `middleware.ts`:

```typescript
export const middleware = paymentMiddleware(
  process.env.PAYMENT_RECIPIENT_ADDRESS!,
  {
    '/api/premium/summarize': {
      price: '1000000',  // Change to 1,000,000 wei
      network: 'testnet',
      // ...
    }
  }
);
```

### Add New Protected Routes

```typescript
export const middleware = paymentMiddleware(
  process.env.PAYMENT_RECIPIENT_ADDRESS!,
  {
    '/api/premium/summarize': {
      price: '750000',
      network: 'testnet',
      config: { /* ... */ }
    },
    '/api/premium/analytics': {  // New route
      price: '1000000',
      network: 'testnet',
      config: {
        description: 'Premium analytics data',
        mimeType: 'application/json',
        maxTimeoutSeconds: 15
      }
    }
  }
);
```

### Add More Cryptocurrencies

Edit `app/api/premium/summarize/route.ts`:

```typescript
const CRYPTO_PRICES = {
  BTC: { /* ... */ },
  ETH: { /* ... */ },
  SOL: { /* ... */ },
  MON: { /* ... */ },
  // Add new crypto
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    priceUsd: 35.67,
    priceChange24hPercent: 3.21,
    marketCapUsd: 1.34e10
  }
};
```

## 🧪 Testing Scenarios

### Scenario 1: Human User Browsing
- ✅ Opens app in browser
- ✅ Sees all crypto data
- ✅ Can filter and interact
- ✅ No payment required

### Scenario 2: Bot Scraping (No Payment)
- ❌ Attempts to access API
- ❌ Receives 402 Payment Required
- ❌ Cannot access data
- ✅ Gets payment instructions

### Scenario 3: Bot with Valid Payment
- ✅ Includes payment proof in header
- ✅ Payment verified on blockchain
- ✅ Access granted to API
- ✅ Receives requested data

## 📊 API Endpoints

### `GET /api/premium/summarize`

Returns all cryptocurrency data.

**Response (when accessed through UI):**
```json
{
  "data": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "priceUsd": 65234.12,
      "priceChange24hPercent": 2.14,
      "marketCapUsd": 1280000000000
    },
    // ... more cryptos
  ],
  "lastUpdated": "2025-11-01T12:21:05.000Z",
  "requestId": "uuid-here",
  "instructions": "POST { symbol: 'ETH' } for a specific asset"
}
```

### `POST /api/premium/summarize`

Returns specific cryptocurrency data.

**Request:**
```json
{
  "symbol": "ETH"
}
```

**Response:**
```json
{
  "requestId": "uuid-here",
  "timestamp": "2025-11-01T12:21:05.000Z",
  "data": {
    "symbol": "ETH",
    "name": "Ethereum",
    "priceUsd": 3185.67,
    "priceChange24hPercent": -0.45,
    "marketCapUsd": 376000000000
  }
}
```

## 🔍 Monitoring

Watch the terminal output to see the middleware in action:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x402 Middleware] Request to: /api/premium/summarize
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[x402 Middleware] ✅ Route is protected
[x402 Middleware] Configuration: {
  recipient: '0xYourMonadWalletAddress',
  price: '750000',
  network: 'monad-testnet',
  facilitator: 'https://monad-x402.vercel.app/api/facilitator',
  hasPayment: false
}
[x402 Middleware] 💳 No payment header found, returning 402
```

## 🚨 Troubleshooting

### Issue: "Payment recipient address not configured"
**Solution:** Set `PAYMENT_RECIPIENT_ADDRESS` in `.env.local`

### Issue: Styles not loading
**Solution:** Ensure Tailwind CSS is installed: `npm install`

### Issue: Port already in use
**Solution:** Next.js will automatically use the next available port (e.g., 3001)

### Issue: API returns 402 in browser
**Solution:** This is expected for direct API access. Use the UI at `http://localhost:3000`

## 📚 Additional Resources

- [monad-x402 GitHub](https://github.com/monad-labs/monad-x402)
- [Next.js Documentation](https://nextjs.org/docs)
- [Monad Blockchain](https://monad.xyz)
- [HTTP 402 Payment Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)

## 💡 Use Cases

This protection mechanism is perfect for:

- **Premium API Services** - Monetize your APIs
- **Data Marketplaces** - Sell access to valuable data
- **AI Training Data** - Prevent unauthorized scraping
- **Research Databases** - Protect proprietary research
- **Financial Data** - Secure premium market data
- **Content Platforms** - Monetize premium content

---

**Built with ❤️ using monad-x402**
