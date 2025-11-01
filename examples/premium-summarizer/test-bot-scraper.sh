#!/bin/bash

echo "================================================"
echo "🤖 Testing Bot/AI Scraper Protection"
echo "================================================"
echo ""
echo "This script simulates an AI bot trying to scrape"
echo "the protected API endpoint without payment."
echo ""
echo "Expected: 402 Payment Required response"
echo "================================================"
echo ""

echo "📡 Attempting to scrape: GET /api/premium/summarize"
echo ""

curl -i http://localhost:3001/api/premium/summarize

echo ""
echo ""
echo "================================================"
echo "📡 Attempting to scrape: POST /api/premium/summarize"
echo ""

curl -i -X POST http://localhost:3001/api/premium/summarize \
  -H "Content-Type: application/json" \
  -d '{"symbol": "ETH"}'

echo ""
echo ""
echo "================================================"
echo "✅ As you can see, the bot receives a 402 Payment"
echo "   Required response with payment instructions!"
echo "================================================"
