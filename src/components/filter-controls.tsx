"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Settings, RefreshCw, RotateCcw } from "lucide-react"
import { use24hrStats, useInvalidateMarketData } from "@/hooks/use-market-data"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useMarketStore } from "../../stores/market-store"

const CRYPTO_SYMBOLS = [
  { value: "BTCUSDT", label: "Bitcoin (BTC/USDT)" },
  { value: "ETHUSDT", label: "Ethereum (ETH/USDT)" },
  { value: "ADAUSDT", label: "Cardano (ADA/USDT)" },
  { value: "SOLUSDT", label: "Solana (SOL/USDT)" },
  { value: "DOTUSDT", label: "Polkadot (DOT/USDT)" },
  { value: "LINKUSDT", label: "Chainlink (LINK/USDT)" },
]

export function FilterControls() {
  const {
    selectedSymbol,
    timeframe,
    selectedMetric,
    setSelectedSymbol,
    setTimeframe,
    setSelectedMetric,
    toggleExportDialog,
    toggleSettings,
    resetFilters,
    resetToToday,
  } = useMarketStore()

  const { data: stats, isLoading: statsLoading } = use24hrStats()
  const { refetchCurrent } = useInvalidateMarketData()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Symbol:</label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_SYMBOLS.map((symbol) => (
                  <SelectItem key={symbol.value} value={symbol.value}>
                    {symbol.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {statsLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              stats && (
                <Badge variant={stats.priceChangePercent >= 0 ? "default" : "destructive"}>
                  {stats.priceChangePercent >= 0 ? "+" : ""}
                  {stats.priceChangePercent.toFixed(2)}%
                </Badge>
              )
            )}
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Timeframe:</label>
            <div className="flex space-x-1">
              {(["daily", "weekly", "monthly"] as const).map((tf) => (
                <Badge
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Metric:</label>
            <div className="flex space-x-1">
              {(["volatility", "liquidity", "performance"] as const).map((metric) => (
                <Badge
                  key={metric}
                  variant={selectedMetric === metric ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedMetric(metric)}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => refetchCurrent()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={toggleExportDialog}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={toggleSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
