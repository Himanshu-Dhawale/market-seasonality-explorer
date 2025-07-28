export class MarketDataAPI {
  private baseUrl = "https://api.binance.com/api/v3"
  private wsUrl = "wss://stream.binance.com:9443/ws"

  async getKlineData(symbol: string, interval = "1d", limit = 100) {
    try {
      const response = await fetch(`${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformKlineData(data)
    } catch (error) {
      console.error("Error fetching kline data:", error)
      throw error
    }
  }

  async get24hrStats(symbol: string) {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr?symbol=${symbol}`)

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        symbol: data.symbol,
        priceChange: Number.parseFloat(data.priceChange),
        priceChangePercent: Number.parseFloat(data.priceChangePercent),
        volume: Number.parseFloat(data.volume),
        count: Number.parseInt(data.count),
        openPrice: Number.parseFloat(data.openPrice),
        highPrice: Number.parseFloat(data.highPrice),
        lowPrice: Number.parseFloat(data.lowPrice),
        lastPrice: Number.parseFloat(data.lastPrice),
      }
    } catch (error) {
      console.error("Error fetching 24hr stats:", error)
      throw error
    }
  }

  async getAvgPrice(symbol: string) {
    try {
      const response = await fetch(`${this.baseUrl}/avgPrice?symbol=${symbol}`)
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching average price:", error)
      throw error
    }
  }

  private transformKlineData(klineData: any[]) {
    return klineData.map((kline) => {
      const [
        openTime,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        quoteAssetVolume,
        numberOfTrades,
        takerBuyBaseAssetVolume,
        takerBuyQuoteAssetVolume,
      ] = kline

      const openPrice = Number.parseFloat(open)
      const closePrice = Number.parseFloat(close)
      const highPrice = Number.parseFloat(high)
      const lowPrice = Number.parseFloat(low)
      const volumeValue = Number.parseFloat(volume)

      const volatility = (highPrice - lowPrice) / closePrice
      const priceChange = (closePrice - openPrice) / openPrice

      return {
        date: new Date(openTime).toISOString().split("T")[0],
        open: openPrice,
        high: highPrice,
        low: lowPrice,
        close: closePrice,
        volume: volumeValue,
        volatility: volatility,
        priceChange: priceChange,
        timestamp: openTime,
        numberOfTrades: numberOfTrades,
        quoteAssetVolume: Number.parseFloat(quoteAssetVolume),
      }
    })
  }

  async getMonthlyData(symbol: string, year: number, month: number) {
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const startTime = startDate.getTime()
    const endTime = endDate.getTime()

    try {
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&endTime=${endTime}`,
      )

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`)
      }

      const data = await response.json()
      const transformedData = this.transformKlineData(data)

      const dataByDate: Record<string, any> = {}
      transformedData.forEach((item) => {
        dataByDate[item.date] = item
      })

      return dataByDate
    } catch (error) {
      console.error("Error fetching monthly data:", error)
      throw error
    }
  }

  createWebSocketConnection(symbol: string, callback: (data: any) => void) {
    const ws = new WebSocket(`${this.wsUrl}/${symbol.toLowerCase()}@ticker`)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      callback({
        symbol: data.s,
        price: Number.parseFloat(data.c),
        priceChange: Number.parseFloat(data.P),
        volume: Number.parseFloat(data.v),
      })
    }

    return ws
  }
}

export const marketAPI = new MarketDataAPI()