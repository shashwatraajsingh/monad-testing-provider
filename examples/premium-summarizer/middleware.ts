import { paymentMiddleware } from 'monad-x402';

export const middleware = paymentMiddleware(
  process.env.PAYMENT_RECIPIENT_ADDRESS!,
  {
    '/api/premium/summarize': {
      price: '750000',
      network: 'testnet',
      config: {
        description: 'Premium AI text summarization (<= 1,000 chars)',
        mimeType: 'application/json',
        maxTimeoutSeconds: 10
      }
    }
  },
  {
    url: process.env.FACILITATOR_URL!
  }
);

export const config = {
  matcher: ['/api/premium/:path*']
};
