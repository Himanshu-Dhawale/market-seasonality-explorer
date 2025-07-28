"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketData } from "@/lib/market-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CalendarCellProps {
  date: Date
  data?: MarketData
  metric: "volatility" | "liquidity" | "performance"
  timeframe: "daily" | "weekly" | "monthly"
  isToday: boolean
  isSelected: boolean
  isPastDate: boolean
  onClick: () => void
}

export function CalendarCell({
  date,
  data,
  metric,
  timeframe,
  isToday,
  isSelected,
  isPastDate,
  onClick,
}: CalendarCellProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (!data) {
    return (
      <div className="aspect-square p-1">
        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
          {date.getDate()}
        </div>
      </div>
    )
  }

  const getMetricValue = () => {
    switch (metric) {
      case "volatility":
        return data.volatility
      case "liquidity":
        return data.volume
      case "performance":
        return data.priceChange
      default:
        return 0
    }
  }

  const getColorIntensity = () => {
    const value = getMetricValue()
    if (metric === "volatility") {
      if (value < 0.02) return "low"
      if (value < 0.05) return "medium"
      return "high"
    } else if (metric === "liquidity") {
      if (value < 1000000) return "low"
      if (value < 5000000) return "medium"
      return "high"
    } else {
      if (Math.abs(value) < 0.02) return "low"
      if (Math.abs(value) < 0.05) return "medium"
      return "high"
    }
  }

  const getBackgroundColor = () => {
    const intensity = getColorIntensity()
    if (metric === "performance") {
      const value = getMetricValue()
      if (value > 0) {
        return intensity === "low" ? "bg-green-100" : intensity === "medium" ? "bg-green-300" : "bg-green-500"
      } else if (value < 0) {
        return intensity === "low" ? "bg-red-100" : intensity === "medium" ? "bg-red-300" : "bg-red-500"
      } else {
        return "bg-gray-100"
      }
    } else {
      return intensity === "low" ? "bg-green-100" : intensity === "medium" ? "bg-yellow-300" : "bg-red-400"
    }
  }

  const getPerformanceIcon = () => {
    const value = getMetricValue()
    if (metric === "performance") {
      if (value > 0.01) return <TrendingUp className="w-3 h-3 text-green-700" />
      if (value < -0.01) return <TrendingDown className="w-3 h-3 text-red-700" />
      return <Minus className="w-3 h-3 text-gray-500" />
    }
    return null
  }

  const formatTooltipValue = (value: number) => {
    if (metric === "volatility") {
      return `${(value * 100).toFixed(2)}%`
    } else if (metric === "liquidity") {
      return `$${(value / 1000000).toFixed(2)}M`
    } else {
      return `${(value * 100).toFixed(2)}%`
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "aspect-square p-1 cursor-pointer transition-all duration-200",
              "hover:scale-105 hover:shadow-md",
              isSelected && "ring-2 ring-blue-500",
              isToday && "ring-2 ring-orange-400",
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={cn(
                "w-full h-full rounded-md flex flex-col items-center justify-center text-xs font-medium transition-colors",
                getBackgroundColor(),
                isPastDate ? "opacity-100" : "opacity-50",
                isHovered && "brightness-110",
              )}
            >
              <div className="text-gray-800">{date.getDate()}</div>

              {metric === "liquidity" && <Volume2 className="w-3 h-3 mt-1 text-blue-600" />}

              {metric === "performance" && <div className="mt-1">{getPerformanceIcon()}</div>}

              {metric === "volatility" && <div className="mt-1 w-4 h-1 bg-current opacity-60 rounded" />}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="font-medium">{date.toLocaleDateString()}</div>
            <div>Open: ${data.open.toFixed(2)}</div>
            <div>Close: ${data.close.toFixed(2)}</div>
            <div>High: ${data.high.toFixed(2)}</div>
            <div>Low: ${data.low.toFixed(2)}</div>
            <div>Volume: ${(data.volume / 1000000).toFixed(2)}M</div>
            <div>Volatility: {(data.volatility * 100).toFixed(2)}%</div>
            <div>Change: {(data.priceChange * 100).toFixed(2)}%</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
