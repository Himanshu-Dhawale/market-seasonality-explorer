"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, TrendingUp, Pause } from "lucide-react"

interface EdgeCaseHandlerProps {
  data: any
  date: Date
}

export function EdgeCaseHandler({ data, date }: EdgeCaseHandlerProps) {
  // Detect various edge cases
  const detectEdgeCases = () => {
    const cases = []

    // No data available
    if (!data) {
      cases.push({
        type: "no-data",
        severity: "warning",
        message: "No market data available for this date",
        icon: <Pause className="w-4 h-4" />,
      })
    }

    if (data) {
      // Zero volume (halted trading)
      if (data.volume === 0) {
        cases.push({
          type: "zero-volume",
          severity: "warning",
          message: "No trading volume - market may be halted",
          icon: <Pause className="w-4 h-4" />,
        })
      }

      // Extreme volatility (>50%)
      if (data.volatility > 0.5) {
        cases.push({
          type: "extreme-volatility",
          severity: "error",
          message: `Extreme volatility detected: ${(data.volatility * 100).toFixed(1)}%`,
          icon: <AlertTriangle className="w-4 h-4" />,
        })
      }

      // Flash crash detection (low much lower than open/close)
      const avgPrice = (data.open + data.close) / 2
      const lowDeviation = (avgPrice - data.low) / avgPrice
      if (lowDeviation > 0.3) {
        cases.push({
          type: "flash-crash",
          severity: "error",
          message: "Potential flash crash detected",
          icon: <TrendingDown className="w-4 h-4" />,
        })
      }

      // Massive price change (>20%)
      if (Math.abs(data.priceChange) > 0.2) {
        cases.push({
          type: "extreme-price-change",
          severity: "error",
          message: `Extreme price movement: ${(data.priceChange * 100).toFixed(1)}%`,
          icon: data.priceChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
        })
      }

      // Unusual volume (>10x normal)
      const normalVolume = 2500000 // Baseline normal volume
      if (data.volume > normalVolume * 10) {
        cases.push({
          type: "volume-spike",
          severity: "warning",
          message: `Unusual volume spike: ${(data.volume / 1000000).toFixed(1)}M`,
          icon: <AlertTriangle className="w-4 h-4" />,
        })
      }

      // Weekend/Holiday detection
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        cases.push({
          type: "weekend",
          severity: "info",
          message: "Weekend - reduced trading activity expected",
          icon: <Pause className="w-4 h-4" />,
        })
      }

      // Data inconsistency (high > low validation)
      if (data.high < data.low) {
        cases.push({
          type: "data-inconsistency",
          severity: "error",
          message: "Data inconsistency detected - high price lower than low price",
          icon: <AlertTriangle className="w-4 h-4" />,
        })
      }

      // Price outside OHLC range
      if (data.open > data.high || data.open < data.low || data.close > data.high || data.close < data.low) {
        cases.push({
          type: "ohlc-inconsistency",
          severity: "error",
          message: "Open/Close prices outside High/Low range",
          icon: <AlertTriangle className="w-4 h-4" />,
        })
      }
    }

    return cases
  }

  const edgeCases = detectEdgeCases()

  if (edgeCases.length === 0) {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-orange-800">Data Anomalies Detected</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {edgeCases.map((edgeCase, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {edgeCase.icon}
              <span className="text-sm">{edgeCase.message}</span>
            </div>
            <Badge variant={getSeverityColor(edgeCase.severity) as any}>{edgeCase.severity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
