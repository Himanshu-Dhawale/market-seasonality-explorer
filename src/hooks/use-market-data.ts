"use client"

import React, { useEffect } from "react"
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query"
import { marketAPI } from "@/lib/api-integration"
import { useMarketStore } from "../../stores/market-store"

export const marketKeys = {
  all: ["market"] as const,
  data: () => [...marketKeys.all, "data"] as const,
  symbol: (symbol: string) => [...marketKeys.data(), symbol] as const,
  symbolMonth: (symbol: string, year: number, month: number) => [...marketKeys.symbol(symbol), year, month] as const,
  historical: (symbol: string, date: Date) =>
    [...marketKeys.symbol(symbol), "historical", date.toISOString().split("T")[0]] as const,
  stats: (symbol: string) => [...marketKeys.symbol(symbol), "stats"] as const,
}

export function useMonthlyMarketData() {
  const { selectedSymbol, currentDate } = useMarketStore()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  return useQuery({
    queryKey: marketKeys.symbolMonth(selectedSymbol, year, month),
    queryFn: async () => {
      try {
        return await marketAPI.getMonthlyData(selectedSymbol, year, month)
      } catch (error) {
        console.error("Failed to fetch monthly data:", error)
        throw error
      }
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useHistoricalData() {
  const { selectedSymbol, selectedDate } = useMarketStore()

  return useQuery({
    queryKey: selectedDate ? marketKeys.historical(selectedSymbol, selectedDate) : ["no-date"],
    queryFn: async () => {
      if (!selectedDate) return []

      try {
        const klineData = await marketAPI.getKlineData(selectedSymbol, "1d", 30)

        return klineData.map((item: any) => ({
          ...item,
          date: item.date,
        }))
      } catch (error) {
        console.error("Failed to fetch historical data:", error)
        throw error
      }
    },
    enabled: !!selectedDate,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

export function use24hrStats() {
  const { selectedSymbol, autoRefresh, refreshInterval } = useMarketStore()

  return useQuery({
    queryKey: marketKeys.stats(selectedSymbol),
    queryFn: async () => {
      try {
        return await marketAPI.get24hrStats(selectedSymbol)
      } catch (error) {
        console.error("Failed to fetch 24hr stats:", error)
        throw error
      }
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 30 * 1000,
    retry: 3,
  })
}

export function useMultiSymbolData(symbols: string[]) {
  const { currentDate } = useMarketStore()

  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: marketKeys.symbolMonth(symbol, currentDate.getFullYear(), currentDate.getMonth()),
      queryFn: async () => {
        try {
          return await marketAPI.getMonthlyData(symbol, currentDate.getFullYear(), currentDate.getMonth())
        } catch (error) {
          console.error(`Failed to fetch data for ${symbol}:`, error)
          throw error
        }
      },
      staleTime: 2 * 60 * 1000,
      retry: 2,
    })),
  })
}

export function usePrefetchAdjacentMonths() {
  const queryClient = useQueryClient()
  const { selectedSymbol, currentDate } = useMarketStore()

  const prefetchMonth = async (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    await queryClient.prefetchQuery({
      queryKey: marketKeys.symbolMonth(selectedSymbol, year, month),
      queryFn: async () => {
        try {
          return await marketAPI.getMonthlyData(selectedSymbol, year, month)
        } catch (error) {
          console.error("Failed to prefetch month data:", error)
          return {}
        }
      },
      staleTime: 2 * 60 * 1000,
    })
  }

  const prevMonth = new Date(currentDate)
  prevMonth.setMonth(currentDate.getMonth() - 1)

  const nextMonth = new Date(currentDate)
  nextMonth.setMonth(currentDate.getMonth() + 1)

  useEffect(() => {
    prefetchMonth(prevMonth)
    prefetchMonth(nextMonth)
  }, [selectedSymbol, currentDate])
}

export function useRealTimeData() {
  const { selectedSymbol } = useMarketStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    const ws = marketAPI.createWebSocketConnection(selectedSymbol, (data) => {
      queryClient.setQueryData(marketKeys.stats(selectedSymbol), (oldData: any) => ({
        ...oldData,
        lastPrice: data.price,
        priceChangePercent: data.priceChange,
        volume: data.volume,
      }))
    })

    return () => {
      ws.close()
    }
  }, [selectedSymbol, queryClient])
}

export function useInvalidateMarketData() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: marketKeys.all }),
    invalidateSymbol: (symbol: string) => queryClient.invalidateQueries({ queryKey: marketKeys.symbol(symbol) }),
    refetchCurrent: () => queryClient.refetchQueries({ queryKey: marketKeys.data() }),
  }
}