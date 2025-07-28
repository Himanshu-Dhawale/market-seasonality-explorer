import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "../../providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Market Seasonality Explorer",
  description: "Interactive calendar for visualizing historical volatility, liquidity, and performance data",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
