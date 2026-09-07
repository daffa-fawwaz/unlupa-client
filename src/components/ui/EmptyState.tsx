import * as React from "react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = "Belum Ada Data",
  description = "",
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-6">
          <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
            {icon}
          </div>
        </div>
      )}
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mb-6 text-muted-foreground max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}
