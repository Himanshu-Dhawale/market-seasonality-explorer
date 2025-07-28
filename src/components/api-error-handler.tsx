"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react"

interface ApiErrorHandlerProps {
  error: Error
  retry?: () => void
  isNetworkError?: boolean
}

export function ApiErrorHandler({ error, retry, isNetworkError }: ApiErrorHandlerProps) {
  const getErrorMessage = () => {
    if (isNetworkError) {
      return "Unable to connect to Binance API. Please check your internet connection."
    }

    if (error.message.includes("429")) {
      return "Rate limit exceeded. Please wait a moment before trying again."
    }

    if (error.message.includes("400")) {
      return "Invalid symbol or parameters. Please check your selection."
    }

    if (error.message.includes("500")) {
      return "Binance API is temporarily unavailable. Please try again later."
    }

    return error.message || "An unexpected error occurred while fetching market data."
  }

  const getErrorIcon = () => {
    if (isNetworkError) {
      return <WifiOff className="w-5 h-5" />
    }
    return <AlertTriangle className="w-5 h-5" />
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-destructive">
          {getErrorIcon()}
          <span>API Error</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{getErrorMessage()}</p>
        {retry && (
          <Button onClick={retry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        <div className="text-xs text-muted-foreground">
          <p>If the problem persists:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Check if Binance API is accessible in your region</li>
            <li>Verify your internet connection</li>
            <li>Try refreshing the page</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
