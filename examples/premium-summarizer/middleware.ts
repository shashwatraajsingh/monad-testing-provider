import { paymentMiddleware } from 'monad-x402';

export const middleware = paymentMiddleware(
  process.env.PAYMENT_RECIPIENT_ADDRESS!,
  {
    '/': {
      price: '500000',
      network: 'testnet',
      config: {
        description: 'Access to protected crypto data homepage',
        mimeType: 'text/html',
        maxTimeoutSeconds: 10
      }
    },
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
  matcher: ['/', '/api/premium/:path*']
};
