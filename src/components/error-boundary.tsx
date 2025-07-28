"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  error: Error | unknown
  reset?: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <span>Something went wrong</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        {reset && (
          <Button onClick={reset} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
