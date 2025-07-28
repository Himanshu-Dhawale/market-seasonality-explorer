"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useMonthlyMarketData } from "@/hooks/use-market-data"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useMarketStore } from "../../stores/market-store"

export function DataDashboard() {
  const { selectedDate, selectedSymbol } = useMarketStore()
  const { data: marketData, isLoading } = useMonthlyMarketData()

  if (!selectedDate) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a date to view detailed market data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    )
  }

  const dateKey = selectedDate.toISOString().split("T")[0]
  const data = marketData?.[dateKey]

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <p>No data available for selected date</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const priceChangePercent = data.priceChange * 100
  const isPositive = priceChangePercent >= 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedSymbol}</span>
            <Badge variant={isPositive ? "default" : "destructive"}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {priceChangePercent.toFixed(2)}%
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-lg font-semibold">${data.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Close</p>
              <p className="text-lg font-semibold">${data.close.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High</p>
              <p className="text-lg font-semibold text-green-600">${data.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low</p>
              <p className="text-lg font-semibold text-red-600">${data.low.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Volatility</span>
            </div>
            <p className="text-2xl font-bold mt-2">{(data.volatility * 100).toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground">Daily volatility measure</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Volume</span>
            </div>
            <p className="text-2xl font-bold mt-2">${(data.volume / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-muted-foreground">Trading volume</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
