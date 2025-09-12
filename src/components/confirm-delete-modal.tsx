"use client"

import type React from "react"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isLoading?: boolean
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "This action cannot be undone. This will permanently delete the item.",
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Card className="w-full max-w-md mx-4 bg-white border-2 border-gray-200 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle id="modal-title" className="text-lg font-semibold text-black">
                  {title}
                </CardTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              disabled={isLoading}
            >
              <X className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription id="modal-description" className="text-gray-600 text-sm leading-relaxed">
            {description}
            {itemName && <span className="block mt-2 font-medium text-black">"{itemName}"</span>}
          </CardDescription>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
