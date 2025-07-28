import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type TimeframeType = "daily" | "weekly" | "monthly"
export type MetricType = "volatility" | "liquidity" | "performance"

interface MarketState {
  selectedDate: Date | null
  currentDate: Date
  selectedDateRange: { start: Date | null; end: Date | null }
  selectedSymbol: string
  timeframe: TimeframeType
  selectedMetric: MetricType
  isExportDialogOpen: boolean
  isSettingsOpen: boolean
  chartHeight: number
  colorScheme: "default" | "high-contrast" | "colorblind-friendly"
  autoRefresh: boolean
  refreshInterval: number
}

interface MarketActions {
  setSelectedDate: (date: Date | null) => void
  setCurrentDate: (date: Date) => void
  setDateRange: (range: { start: Date | null; end: Date | null }) => void
  navigateMonth: (direction: "prev" | "next") => void
  setSelectedSymbol: (symbol: string) => void
  setTimeframe: (timeframe: TimeframeType) => void
  setSelectedMetric: (metric: MetricType) => void
  toggleExportDialog: () => void
  toggleSettings: () => void
  setChartHeight: (height: number) => void
  setColorScheme: (scheme: MarketState["colorScheme"]) => void
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
  resetFilters: () => void
  resetToToday: () => void
}

type MarketStore = MarketState & MarketActions

const initialState: MarketState = {
  selectedDate: null,
  currentDate: new Date(),
  selectedDateRange: { start: null, end: null },
  selectedSymbol: "BTCUSDT",
  timeframe: "daily",
  selectedMetric: "volatility",
  isExportDialogOpen: false,
  isSettingsOpen: false,
  chartHeight: 300,
  colorScheme: "default",
  autoRefresh: true,
  refreshInterval: 30000,
}

export const useMarketStore = create<MarketStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSelectedDate: (date) => set({ selectedDate: date }),
        setCurrentDate: (date) => set({ currentDate: date }),
        setDateRange: (range) => set({ selectedDateRange: range }),
        navigateMonth: (direction) => {
          const { currentDate } = get()
          const newDate = new Date(currentDate)
          if (direction === "prev") {
            newDate.setMonth(currentDate.getMonth() - 1)
          } else {
            newDate.setMonth(currentDate.getMonth() + 1)
          }
          set({ currentDate: newDate })
        },

        setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
        setTimeframe: (timeframe) => set({ timeframe }),
        setSelectedMetric: (metric) => set({ selectedMetric: metric }),

        toggleExportDialog: () => set((state) => ({ isExportDialogOpen: !state.isExportDialogOpen })),
        toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
        setChartHeight: (height) => set({ chartHeight: height }),

        setColorScheme: (scheme) => set({ colorScheme: scheme }),
        setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
        setRefreshInterval: (interval) => set({ refreshInterval: interval }),

        resetFilters: () =>
          set({
            selectedSymbol: "BTCUSDT",
            timeframe: "daily",
            selectedMetric: "volatility",
          }),
        resetToToday: () =>
          set({
            selectedDate: new Date(),
            currentDate: new Date(),
            selectedDateRange: { start: null, end: null },
          }),
      }),
      {
        name: "market-store",
        partialize: (state) => ({
          selectedSymbol: state.selectedSymbol,
          timeframe: state.timeframe,
          selectedMetric: state.selectedMetric,
          colorScheme: state.colorScheme,
          autoRefresh: state.autoRefresh,
          refreshInterval: state.refreshInterval,
          chartHeight: state.chartHeight,
        }),
      },
    ),
    { name: "market-store" },
  ),
)
