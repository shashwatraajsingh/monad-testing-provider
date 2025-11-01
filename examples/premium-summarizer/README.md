# 🔒 Protected Crypto Data - Monad X402 Demo

A Next.js web application demonstrating the **monad-x402** SDK's ability to protect web content from AI scrapers and bots by requiring payment before access.

## 🌟 Features

- **Payment-Gated API**: All API endpoints protected by monad-x402 middleware
- **Bot Detection**: AI scrapers and bots must pay before accessing data
- **Blockchain Verified**: Payments verified on Monad testnet
- **Beautiful UI**: Modern, responsive interface built with Next.js 15 and Tailwind CSS
- **Real-time Crypto Data**: Display cryptocurrency prices with filtering capabilities

## 🚀 How It Works

The **monad-x402** SDK protects your API endpoints by:

1. **Detecting Bot Traffic**: Identifies AI scrapers and automated bots
2. **Requiring Payment**: Forces bots to pay (in crypto) before accessing protected content
3. **Blockchain Verification**: Validates payments on the Monad blockchain
4. **Allowing Human Access**: Regular users can browse freely through the UI

## 📋 Prerequisites

- Node.js 18+ and npm
- A Monad wallet address (for receiving payments)
- Access to Monad testnet

## 🛠️ Installation

1. **Clone and navigate to the project**:
   ```bash
   cd examples/premium-summarizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Your Monad wallet address that will receive payments
   PAYMENT_RECIPIENT_ADDRESS=0xYourMonadWalletAddress
   
   # Facilitator endpoint (use sandbox for testing)
   FACILITATOR_URL=https://monad-x402.vercel.app/api/facilitator
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
premium-summarizer/
├── app/
│   ├── api/
│   │   └── premium/
│   │       └── summarize/
│   │           └── route.ts          # Protected API endpoint
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page component
├── middleware.ts                     # monad-x402 payment middleware
├── .env.local.example               # Environment variables template
├── package.json                     # Dependencies
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## 🔐 Protected Endpoints

### `/api/premium/summarize`

**Price**: 750,000 wei (on testnet)  
**Network**: Monad testnet  
**Description**: Premium cryptocurrency market data

**GET Request**:
```bash
curl http://localhost:3000/api/premium/summarize
```

**POST Request** (for specific crypto):
```bash
curl -X POST http://localhost:3000/api/premium/summarize \
  -H "Content-Type: application/json" \
  -d '{"symbol": "ETH"}'
```

**Note**: Bots and AI scrapers attempting to access these endpoints will receive a payment request and must complete payment before receiving data.

## 🎨 Customization

### Modify Payment Requirements

Edit `middleware.ts` to change payment amounts or add new protected routes:

```typescript
export const middleware = paymentMiddleware(
  process.env.PAYMENT_RECIPIENT_ADDRESS!,
  {
    '/api/premium/summarize': {
      price: '750000',  // Change price here
      network: 'testnet',
      config: {
        description: 'Your custom description',
        mimeType: 'application/json',
        maxTimeoutSeconds: 10
      }
    }
  },
  {
    url: process.env.FACILITATOR_URL!
  }
);
```

### Add More Crypto Data

Edit `app/api/premium/summarize/route.ts` to add more cryptocurrencies:

```typescript
const CRYPTO_PRICES = {
  BTC: { /* ... */ },
  ETH: { /* ... */ },
  // Add your new crypto here
  DOGE: {
    symbol: 'DOGE',
    name: 'Dogecoin',
    priceUsd: 0.08,
    priceChange24hPercent: 1.23,
    marketCapUsd: 1.15e10
  }
};
```

## 🧪 Testing

### Test as a Human User
Simply open the app in your browser and interact with it normally. The UI will work seamlessly.

### Test as a Bot
Try scraping the API endpoint programmatically:

```bash
# This will trigger the payment requirement
curl http://localhost:3000/api/premium/summarize
```

You'll receive a response requiring payment before access is granted.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🔧 Troubleshooting

**Issue**: "Payment recipient address not configured"  
**Solution**: Make sure you've set `PAYMENT_RECIPIENT_ADDRESS` in `.env.local`

**Issue**: "Facilitator URL not configured"  
**Solution**: Set `FACILITATOR_URL` in `.env.local`

**Issue**: Styles not loading  
**Solution**: Run `npm install` to ensure Tailwind CSS is installed

## 📚 Learn More

- [monad-x402 Documentation](https://github.com/monad-labs/monad-x402)
- [Next.js Documentation](https://nextjs.org/docs)
- [Monad Blockchain](https://monad.xyz)

## 📄 License

MIT License - feel free to use this demo as a starting point for your own projects!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Built with ❤️ using monad-x402, Next.js 15, and Tailwind CSS**
