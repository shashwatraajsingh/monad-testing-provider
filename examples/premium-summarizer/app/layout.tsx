import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Protected Crypto Data - Monad X402',
  description: 'Premium cryptocurrency data protected by monad-x402 SDK. AI bots must pay before scraping.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
