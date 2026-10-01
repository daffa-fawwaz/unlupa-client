import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { CloseButton } from "@/components/base/buttons/close-button";
import { cx } from "@/utils/cx";

type AlertVariant = "success" | "error" | "warning" | "info";

export interface InlineAlertProps {
  title: string;
  description?: ReactNode;
  variant?: AlertVariant;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

type FloatingAlertProps = Omit<InlineAlertProps, "className"> & {
  className?: string;
};

const variants = {
  success: {
    icon: CheckCircle2,
    root: "border-success/30 bg-success/10",
    iconWrap: "bg-success/15 text-success",
  },
  error: {
    icon: AlertCircle,
    root: "border-error/30 bg-error-primary",
    iconWrap: "bg-error-primary text-error-primary",
  },
  warning: {
    icon: TriangleAlert,
    root: "border-warning/30 bg-warning/10",
    iconWrap: "bg-warning/15 text-warning",
  },
  info: {
    icon: Info,
    root: "border-brand/30 bg-brand-50",
    iconWrap: "bg-brand-100 text-brand-700",
  },
} satisfies Record<AlertVariant, { icon: typeof Info; root: string; iconWrap: string }>;

export const InlineAlert = ({
  title,
  description,
  variant = "info",
  onDismiss,
  actionLabel,
  onAction,
  className,
}: InlineAlertProps) => {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cx("flex items-start gap-3 rounded-2xl border p-3.5 shadow-xs", config.root, className)}
    >
      <div className={cx("flex size-9 shrink-0 items-center justify-center rounded-xl", config.iconWrap)}>
        <Icon className="size-4.5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-primary">{title}</p>
        {description && <div className="mt-0.5 text-sm leading-relaxed text-secondary">{description}</div>}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-2 text-sm font-semibold text-brand-secondary transition-colors hover:text-brand-secondary_hover"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {onDismiss && (
        <CloseButton
          slot={null}
          size="xs"
          onPress={onDismiss}
          label="Dismiss alert"
          className="-mr-1 -mt-1 shrink-0"
        />
      )}
    </div>
  );
};

export const FloatingAlert = ({ className, ...props }: FloatingAlertProps) => (
  <div
    className={cx(
      "fixed inset-x-3 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-[400] animate-in slide-in-from-bottom-4 duration-200",
      "sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-5 sm:w-full sm:max-w-sm sm:slide-in-from-top-4",
      className,
    )}
  >
    <InlineAlert {...props} className="bg-primary/95 backdrop-blur-xl" />
  </div>
);
