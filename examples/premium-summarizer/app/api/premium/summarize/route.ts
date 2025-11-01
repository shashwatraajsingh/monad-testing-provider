import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CRYPTO_PRICES = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: 65234.12,
    priceChange24hPercent: 2.14,
    marketCapUsd: 1.28e12
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: 3185.67,
    priceChange24hPercent: -0.45,
    marketCapUsd: 3.76e11
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    priceUsd: 142.03,
    priceChange24hPercent: 4.93,
    marketCapUsd: 6.34e10
  },
  MON: {
    symbol: 'MON',
    name: 'Monad',
    priceUsd: 2.45,
    priceChange24hPercent: 8.01,
    marketCapUsd: 1.02e9
  }
} as const;

type SupportedSymbol = keyof typeof CRYPTO_PRICES;

interface PriceQueryRequest {
  symbol?: string;
}

export async function POST(request: Request) {
  let body: PriceQueryRequest;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      {
        error: 'invalid_payload',
        message: 'Request body must be valid JSON.'
      },
      { status: 400 }
    );
  }

  const symbol = (body.symbol ?? 'BTC').toUpperCase() as SupportedSymbol;

  if (!(symbol in CRYPTO_PRICES)) {
    return NextResponse.json(
      {
        error: 'unsupported_symbol',
        message: `Supported symbols: ${Object.keys(CRYPTO_PRICES).join(', ')}`
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    data: CRYPTO_PRICES[symbol]
  });
}

export function GET() {
  return NextResponse.json({
    data: Object.values(CRYPTO_PRICES),
    lastUpdated: new Date().toISOString(),
    requestId: crypto.randomUUID(),
    instructions: "POST { symbol: 'ETH' } for a specific asset"
  });
}
