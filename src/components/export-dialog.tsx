"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, FileImage, FileSpreadsheet, FileText } from "lucide-react"

interface ExportDialogProps {
  onExport: (format: "pdf" | "csv" | "png") => void
}

export function ExportDialog({ onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<"pdf" | "csv" | "png">("csv")

  const handleExport = () => {
    onExport(format)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Calendar Data</DialogTitle>
          <DialogDescription>Choose the format you'd like to export your market data in.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4" />
                <span>CSV (Spreadsheet)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>PDF (Report)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="png" id="png" />
              <Label htmlFor="png" className="flex items-center space-x-2">
                <FileImage className="w-4 h-4" />
                <span>PNG (Image)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleExport}>Export {format.toUpperCase()}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
