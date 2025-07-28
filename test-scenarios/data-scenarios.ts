export const normalMarketScenarios = {
  // Typical trading day with moderate volatility
  typicalTradingDay: {
    date: "2024-01-15",
    open: 42500.0,
    high: 43200.0,
    low: 42100.0,
    close: 42800.0,
    volume: 2500000,
    volatility: 0.026, // 2.6%
    priceChange: 0.007, // 0.7% gain
    numberOfTrades: 125000,
  },

  // High volatility day (major news/events)
  highVolatilityDay: {
    date: "2024-01-16",
    open: 42800.0,
    high: 46500.0,
    low: 41200.0,
    close: 45200.0,
    volume: 8500000,
    volatility: 0.124, // 12.4% volatility
    priceChange: 0.056, // 5.6% gain
    numberOfTrades: 450000,
  },

  // Low volatility day (weekend/holiday)
  lowVolatilityDay: {
    date: "2024-01-17",
    open: 45200.0,
    high: 45350.0,
    low: 45050.0,
    close: 45180.0,
    volume: 850000,
    volatility: 0.007, // 0.7% volatility
    priceChange: -0.0004, // -0.04% slight decline
    numberOfTrades: 35000,
  },

  // Market crash scenario
  crashDay: {
    date: "2024-01-18",
    open: 45180.0,
    high: 45200.0,
    low: 38500.0,
    close: 39200.0,
    volume: 15000000,
    volatility: 0.171, // 17.1% volatility
    priceChange: -0.132, // -13.2% crash
    numberOfTrades: 750000,
  },

  // Recovery/pump day
  pumpDay: {
    date: "2024-01-19",
    open: 39200.0,
    high: 48500.0,
    low: 38800.0,
    close: 47200.0,
    volume: 12000000,
    volatility: 0.204, // 20.4% volatility
    priceChange: 0.204, // 20.4% pump
    numberOfTrades: 680000,
  },
}

export const extremeScenarios = {
  // Flash crash (very brief but extreme)
  flashCrash: {
    date: "2024-01-20",
    open: 47200.0,
    high: 47300.0,
    low: 15000.0, // Flash crash to $15k
    close: 46800.0,
    volume: 25000000,
    volatility: 0.688, // 68.8% volatility
    priceChange: -0.008, // -0.8% end result
    numberOfTrades: 1200000,
  },

  // Halted trading (no volume)
  haltedTrading: {
    date: "2024-01-21",
    open: 46800.0,
    high: 46800.0,
    low: 46800.0,
    close: 46800.0,
    volume: 0, // No trading
    volatility: 0,
    priceChange: 0,
    numberOfTrades: 0,
  },

  // Massive volume spike
  volumeSpike: {
    date: "2024-01-22",
    open: 46800.0,
    high: 47500.0,
    low: 46200.0,
    close: 47100.0,
    volume: 50000000, // 50M volume (10x normal)
    volatility: 0.028,
    priceChange: 0.006,
    numberOfTrades: 2500000,
  },
}
