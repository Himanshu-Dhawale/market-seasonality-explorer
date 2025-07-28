"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, BarChart3, Activity } from "lucide-react"
import { useHistoricalData } from "@/hooks/use-market-data"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useMarketStore } from "../../stores/market-store"

export function HistoricalAnalysis() {
  const { selectedDate, chartHeight } = useMarketStore()
  const { data: historicalData, isLoading, error } = useHistoricalData()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-destructive">
            <p>Error loading historical data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!selectedDate || !historicalData?.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a date to view historical analysis</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Historical Analysis</span>
          <span className="text-sm font-normal text-muted-foreground">
            - 30 days around {selectedDate.toLocaleDateString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="price" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Price Trends</span>
            </TabsTrigger>
            <TabsTrigger value="volatility" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Volatility</span>
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Volume</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Price Movement</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "Close Price"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="close"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">High-Low Range</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                      />
                      <Line type="monotone" dataKey="high" stroke="#22c55e" strokeWidth={2} dot={false} name="High" />
                      <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={2} dot={false} name="Low" />
                      <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} name="Close" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="volatility" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Daily Volatility</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Volatility"]}
                      />
                      <Bar dataKey="volatility" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Volatility Trend</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="volatilityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Volatility"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="volatility"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#volatilityGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="volume" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Trading Volume</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, "Volume"]}
                      />
                      <Bar dataKey="volume" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Volume vs Price</h3>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis yAxisId="price" orientation="left" tickFormatter={(value) => `$${value.toFixed(0)}`} />
                      <YAxis
                        yAxisId="volume"
                        orientation="right"
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: number, name: string) => {
                          if (name === "Volume") return [`$${(value / 1000000).toFixed(2)}M`, name]
                          return [`$${value.toFixed(2)}`, name]
                        }}
                      />
                      <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="close"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name="Price"
                      />
                      <Bar yAxisId="volume" dataKey="volume" fill="#06b6d4" opacity={0.3} name="Volume" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
