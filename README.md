# Market Seasonality Explorer

A React application for visualizing historical volatility, liquidity, and performance data for cryptocurrency markets using an interactive calendar interface.

## Features

- **Interactive Calendar**: Visual representation of market data with color-coded cells
- **Real-time Data**: Live market data from Binance API with WebSocket connections
- **Multiple Metrics**: View volatility, liquidity, and performance data
- **Historical Analysis**: Detailed charts and trends for selected dates
- **Responsive Design**: Works on desktop and mobile devices
- **State Management**: Zustand for global state, TanStack Query for data fetching

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **API**: Binance REST API & WebSocket

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── api-error-handler.tsx    # API error handling
│   ├── calendar-cell.tsx        # Individual calendar cell
│   ├── data-dashboard.tsx       # Selected date details
│   ├── filter-controls.tsx      # Symbol/metric filters
│   ├── historical-analysis.tsx  # Charts and analysis
│   ├── loading-spinner.tsx      # Loading indicator
│   └── market-calendar.tsx      # Main calendar component
├── hooks/
│   └── use-market-data.ts       # Data fetching hooks
├── lib/
│   ├── api-integration.ts       # Binance API client
│   └── market-data.ts          # Data types and utilities
├── providers/
│   └── query-provider.tsx      # TanStack Query setup
└── stores/
    └── market-store.ts         # Zustand state management
\`\`\`

## Key Components

### MarketCalendar
Main calendar interface displaying market data as color-coded cells based on selected metrics.

### DataDashboard
Sidebar showing detailed information for the selected date including OHLC prices and key metrics.

### HistoricalAnalysis
Comprehensive charts showing price trends, volatility patterns, and volume analysis around selected dates.

### FilterControls
Control panel for selecting cryptocurrency symbols, timeframes, and metrics with real-time 24hr statistics.

## State Management

### Market Store (Zustand)
- Calendar navigation state
- Selected symbols and metrics
- UI preferences and settings
- Persistent user preferences

### Data Hooks (TanStack Query)
- `useMonthlyMarketData`: Monthly calendar data
- `useHistoricalData`: Historical analysis data
- `use24hrStats`: Real-time market statistics
- `useRealTimeData`: WebSocket price updates

## API Integration

### Binance REST API
- `/klines`: Historical candlestick data
- `/ticker/24hr`: 24-hour statistics
- `/avgPrice`: Average price data

### WebSocket Streams
- Real-time price updates
- Live market statistics

## Data Flow

1. User selects symbol/metric in FilterControls
2. Market store updates global state
3. Data hooks fetch from Binance API
4. Calendar renders with color-coded data
5. User clicks date to view details
6. Historical analysis loads additional data

## Error Handling

- Network connectivity issues
- API rate limiting
- Invalid symbols/parameters
- Data inconsistencies
- Graceful fallbacks and retry logic

## Performance Features

- Query caching and stale-while-revalidate
- Adjacent month prefetching
- Optimistic updates
- Debounced API calls
- Efficient re-renders with Zustand

## Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open http://localhost:3000

## Environment Variables

No API keys required - uses public Binance endpoints.

## Browser Support

- Modern browsers with ES2020+ support
- WebSocket support for real-time features
- Responsive design for mobile devices
