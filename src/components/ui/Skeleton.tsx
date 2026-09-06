import * as React from "react"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        {
          "rounded-full": variant === "circular",
          "h-4 w-full": variant === "text",
        },
        className
      )}
      style={{
        width: variant !== "text" ? width : undefined,
        height: variant !== "text" ? height : undefined,
      }}
    />
  )
}

export function SkeletonText({
  lines = 3,
  className = "",
}: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-6", className)}>
      <Skeleton variant="rectangular" width="40%" height="24px" />
      <SkeletonText lines={3} />
      <Skeleton variant="rectangular" width="100%" height="120px" />
    </div>
  )
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
  className = "",
}: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" width="25%" height="16px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton key={col} variant="text" width="25%" height="16px" />
          ))}
        </div>
      ))}
    </div>
  )
}