"use client"

import type React from "react"
import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarCell } from "@/components/calendar-cell"
import type { MarketData } from "@/lib/market-data"
import { useMarketStore } from "../../stores/market-store"

interface MarketCalendarProps {
  data?: Record<string, MarketData>
}

export function MarketCalendar({ data = {} }: MarketCalendarProps) {
  const { selectedDate, currentDate, selectedSymbol, timeframe, selectedMetric, setSelectedDate, navigateMonth } =
    useMarketStore()

  const { year, month } = useMemo(
    () => ({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    }),
    [currentDate],
  )

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const today = new Date()

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      navigateMonth("prev")
    } else if (event.key === "ArrowRight") {
      navigateMonth("next")
    } else if (event.key === "Escape") {
      setSelectedDate(null)
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold">
          {monthNames[month]} {year}
        </h2>

        <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Viewing: {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} | Metric:{" "}
        {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} | Symbol: {selectedSymbol}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const dateKey = date.toISOString().split("T")[0]
          const dayData = data[dateKey]
          const isToday = date.toDateString() === today.toDateString()
          const isSelected = selectedDate?.toDateString() === date.toDateString()
          const isPastDate = date < today

          return (
            <CalendarCell
              key={day}
              date={date}
              data={dayData}
              metric={selectedMetric}
              timeframe={timeframe}
              isToday={isToday}
              isSelected={isSelected}
              isPastDate={isPastDate}
              onClick={() => setSelectedDate(isSelected ? null : date)}
            />
          )
        })}
      </div>

      <div className="flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Low {selectedMetric}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span>Medium {selectedMetric}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>High {selectedMetric}</span>
        </div>
      </div>
    </div>
  )
}
