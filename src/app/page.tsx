"use client"

import { MarketCalendar } from "@/components/market-calendar"
import { DataDashboard } from "@/components/data-dashboard"
import { FilterControls } from "@/components/filter-controls"
import { HistoricalAnalysis } from "@/components/historical-analysis"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ApiErrorHandler } from "@/components/api-error-handler"
import { Card } from "@/components/ui/card"
import { useMonthlyMarketData, usePrefetchAdjacentMonths, useRealTimeData } from "@/hooks/use-market-data"
import { useMarketStore } from "../../stores/market-store"

export default function MarketSeasonalityExplorer() {
  const { selectedDate } = useMarketStore()
  const { data: monthlyData, isLoading, error, refetch } = useMonthlyMarketData()

  usePrefetchAdjacentMonths()

  useRealTimeData()

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Market Seasonality Explorer</h1>
            <p className="text-muted-foreground mt-2">
              Interactive calendar for visualizing historical volatility, liquidity, and performance data
            </p>
          </header>

          <ApiErrorHandler error={error as Error} retry={refetch} isNetworkError={error?.message?.includes("fetch")} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Market Seasonality Explorer</h1>
          <p className="text-muted-foreground mt-2">
            Interactive calendar for visualizing historical volatility, liquidity, and performance data
          </p>
        </header>

        <FilterControls />

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-muted-foreground">Loading market data from Binance...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <MarketCalendar data={monthlyData} />
                </Card>
              </div>

              <div className="lg:col-span-1">
                <DataDashboard />
              </div>
            </div>

            {selectedDate && <HistoricalAnalysis />}
          </>
        )}
      </div>
    </div>
  )
}
