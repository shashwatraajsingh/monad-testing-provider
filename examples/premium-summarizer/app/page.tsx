'use client';

import { useEffect, useState } from 'react';

interface CryptoData {
  symbol: string;
  name: string;
  priceUsd: number;
  priceChange24hPercent: number;
  marketCapUsd: number;
}

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch('/api/premium/summarize');
      const result = await response.json();
      setCryptoData(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setCryptoData([]);
      setLoading(false);
    }
  };

  const fetchSpecificCrypto = async (symbol: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/premium/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
      });
      const result = await response.json();
      if (result.data) {
        setCryptoData([result.data]);
      } else {
        setCryptoData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching specific crypto:', error);
      setCryptoData([]);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔒 Protected Crypto Data
          </h1>
          <p className="text-xl text-blue-200 mb-2">
            Premium cryptocurrency market data protected by Monad X402
          </p>
          <div className="inline-block bg-yellow-500/20 border border-yellow-500 rounded-lg px-6 py-3 mt-4">
            <p className="text-yellow-200 font-semibold">
              ⚡ AI Bots & Scrapers: Payment Required Before Access
            </p>
            <p className="text-yellow-100 text-sm mt-1">
              This page is protected by monad-x402 SDK
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <label className="block text-white text-lg font-semibold mb-3">
              Filter by Cryptocurrency:
            </label>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  setSelectedCrypto('');
                  fetchCryptoData();
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCrypto === ''
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                All
              </button>
              {['BTC', 'ETH', 'SOL', 'MON'].map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => {
                    setSelectedCrypto(symbol);
                    fetchSpecificCrypto(symbol);
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCrypto === symbol
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Crypto Cards */}
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
            <p className="text-white mt-4 text-xl">Loading premium data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {cryptoData.map((crypto) => (
              <div
                key={crypto.symbol}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-blue-400 transition-all hover:transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {crypto.symbol}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      crypto.priceChange24hPercent >= 0
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {crypto.priceChange24hPercent >= 0 ? '↑' : '↓'}{' '}
                    {Math.abs(crypto.priceChange24hPercent).toFixed(2)}%
                  </span>
                </div>
                <p className="text-blue-200 text-sm mb-4">{crypto.name}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-300 text-sm">Current Price</p>
                    <p className="text-white text-3xl font-bold">
                      {formatPrice(crypto.priceUsd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Market Cap</p>
                    <p className="text-white text-xl font-semibold">
                      {formatMarketCap(crypto.marketCapUsd)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              🛡️ How This Protection Works
            </h3>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>
                  <strong>Payment-Gated API:</strong> All API endpoints are protected by monad-x402 middleware
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>
                  <strong>Bot Detection:</strong> AI scrapers and bots must pay before accessing data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>
                  <strong>Blockchain Verified:</strong> Payments are verified on Monad testnet
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>
                  <strong>Human Users:</strong> Regular users can browse freely through the UI
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
