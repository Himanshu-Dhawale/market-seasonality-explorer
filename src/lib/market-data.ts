export interface MarketData {
  date?: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  volatility: number
  priceChange: number
}

export function generateMockData(currentDate: Date, symbol: string): Record<string, MarketData> {
  const data: Record<string, MarketData> = {}
  const basePrice = getBasePriceForSymbol(symbol)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let previousClose = basePrice

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateKey = date.toISOString().split("T")[0]

    const volatility = 0.01 + Math.random() * 0.08
    const priceChange = (Math.random() - 0.5) * volatility * 2

    const open = previousClose * (1 + (Math.random() - 0.5) * 0.01)
    const close = open * (1 + priceChange)
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)
    const volume = 1000000 + Math.random() * 10000000

    data[dateKey] = {
      open,
      high,
      low,
      close,
      volume,
      volatility,
      priceChange,
    }

    previousClose = close
  }

  return data
}

function getBasePriceForSymbol(symbol: string): number {
  const basePrices: Record<string, number> = {
    BTCUSDT: 45000,
    ETHUSDT: 3000,
    ADAUSDT: 0.5,
    SOLUSDT: 100,
    DOTUSDT: 8,
    LINKUSDT: 15,
  }

  return basePrices[symbol] || 1000
}

export async function fetchBinanceData(symbol: string, interval = "1d", limit = 30) {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch data from Binance API")
    }

    const data = await response.json()

    return data.map((kline: any[]) => ({
      date: new Date(kline[0]).toISOString().split("T")[0],
      open: Number.parseFloat(kline[1]),
      high: Number.parseFloat(kline[2]),
      low: Number.parseFloat(kline[3]),
      close: Number.parseFloat(kline[4]),
      volume: Number.parseFloat(kline[5]),
      volatility: calculateVolatility(
        Number.parseFloat(kline[2]),
        Number.parseFloat(kline[3]),
        Number.parseFloat(kline[4]),
      ),
      priceChange: (Number.parseFloat(kline[4]) - Number.parseFloat(kline[1])) / Number.parseFloat(kline[1]),
    }))
  } catch (error) {
    console.error("Error fetching Binance data:", error)
    return []
  }
}

function calculateVolatility(high: number, low: number, close: number): number {
  return (high - low) / close
}