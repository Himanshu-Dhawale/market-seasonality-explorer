# API Documentation

## Binance API Integration

The application integrates with Binance's public REST API and WebSocket streams for real-time cryptocurrency market data.

## REST Endpoints

### Get Kline/Candlestick Data
\`\`\`
GET /api/v3/klines
\`\`\`

**Parameters:**
- `symbol`: Trading pair (e.g., BTCUSDT)
- `interval`: Time interval (1d for daily)
- `limit`: Number of records (max 1000)
- `startTime`: Start timestamp (optional)
- `endTime`: End timestamp (optional)

**Response:**
\`\`\`json
[
  [
    1640995200000,  // Open time
    "46000.00",     // Open price
    "47000.00",     // High price
    "45000.00",     // Low price
    "46500.00",     // Close price
    "1234.56789",   // Volume
    1641081599999,  // Close time
    "57890123.45",  // Quote asset volume
    12345,          // Number of trades
    "617.89123",    // Taker buy base asset volume
    "28945678.90"   // Taker buy quote asset volume
  ]
]
\`\`\`

### Get 24hr Ticker Statistics
\`\`\`
GET /api/v3/ticker/24hr
\`\`\`

**Parameters:**
- `symbol`: Trading pair

**Response:**
\`\`\`json
{
  "symbol": "BTCUSDT",
  "priceChange": "500.00",
  "priceChangePercent": "1.08",
  "weightedAvgPrice": "46250.00",
  "prevClosePrice": "46000.00",
  "lastPrice": "46500.00",
  "lastQty": "0.01",
  "bidPrice": "46499.00",
  "askPrice": "46501.00",
  "openPrice": "46000.00",
  "highPrice": "47000.00",
  "lowPrice": "45000.00",
  "volume": "1234.56789",
  "quoteVolume": "57890123.45",
  "openTime": 1640995200000,
  "closeTime": 1641081599999,
  "firstId": 123456789,
  "lastId": 123456890,
  "count": 12345
}
\`\`\`

## WebSocket Streams

### Individual Symbol Ticker
\`\`\`
wss://stream.binance.com:9443/ws/{symbol}@ticker
\`\`\`

**Stream Data:**
\`\`\`json
{
  "e": "24hrTicker",
  "E": 1641081600000,
  "s": "BTCUSDT",
  "p": "500.00",
  "P": "1.08",
  "w": "46250.00",
  "x": "46000.00",
  "c": "46500.00",
  "Q": "0.01",
  "b": "46499.00",
  "B": "1.00",
  "a": "46501.00",
  "A": "1.00",
  "o": "46000.00",
  "h": "47000.00",
  "l": "45000.00",
  "v": "1234.56789",
  "q": "57890123.45",
  "O": 1640995200000,
  "C": 1641081599999,
  "F": 123456789,
  "L": 123456890,
  "n": 12345
}
\`\`\`

## Data Transformation

### Raw to Application Format
The API client transforms Binance data into our application format:

\`\`\`typescript
interface MarketData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  volatility: number
  priceChange: number
}
\`\`\`

### Calculations
- **Volatility**: `(high - low) / close`
- **Price Change**: `(close - open) / open`
- **Volume**: Raw volume from API

## Rate Limits

### REST API
- 1200 requests per minute per IP
- 10 requests per second per IP

### WebSocket
- 5 incoming messages per second
- 10 connections per IP

## Error Handling

### HTTP Status Codes
- `400`: Bad Request (invalid parameters)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error
- `503`: Service Unavailable

### Error Response Format
\`\`\`json
{
  "code": -1121,
  "msg": "Invalid symbol."
}
\`\`\`

## Best Practices

### Caching Strategy
- Cache kline data for 2 minutes
- Cache 24hr stats for 30 seconds
- Prefetch adjacent months

### Connection Management
- Reconnect WebSocket on disconnect
- Exponential backoff for failed requests
- Graceful degradation for offline mode

### Data Validation
- Validate symbol format
- Check timestamp ranges
- Handle missing data points
