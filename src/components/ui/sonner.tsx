import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
} from "@/components/foundations/hugeicons";

const iconShell = "flex size-9 items-center justify-center rounded-xl";

const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: (
          <span
            className={`${iconShell} bg-success-primary text-success-primary`}
          >
            <CheckCircle2 className="size-4.5" />
          </span>
        ),
        error: (
          <span className={`${iconShell} bg-error-primary text-error-primary`}>
            <AlertCircle className="size-4.5" />
          </span>
        ),
        warning: (
          <span
            className={`${iconShell} bg-utility-yellow-50 text-utility-yellow-700`}
          >
            <AlertTriangle className="size-4.5" />
          </span>
        ),
        info: (
          <span
            className={`${iconShell} bg-utility-blue-50 text-utility-blue-700`}
          >
            <Info className="size-4.5" />
          </span>
        ),
        loading: (
          <span className={`${iconShell} bg-brand-50 text-brand-700`}>
            <Loader2 className="size-4.5 animate-spin" />
          </span>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "!w-[min(420px,calc(100vw-32px))] !items-center !gap-3 !rounded-2xl !border-0 !bg-primary !px-4 !py-3.5 !pr-11 !text-primary !shadow-xl",
          success: "!border-0",
          error: "!border-0",
          warning: "!border-0",
          info: "!border-0",
          loading: "!border-0",
          content: "!min-w-0 !flex-1 !gap-0.5",
          title: "!text-sm !font-semibold !leading-5 !text-primary",
          description: "!text-sm !leading-5 !text-secondary",
          icon:
            "!m-0 !size-9 !shrink-0 !self-center !justify-center [&_svg]:!m-0",
          closeButton:
            "!left-auto !right-2.5 !top-2.5 !translate-x-0 !translate-y-0 !border-0 !bg-secondary !text-tertiary !shadow-none hover:!bg-brand-50 hover:!text-brand-700",
          actionButton:
            "!rounded-lg !bg-brand-solid !font-semibold !text-white hover:!bg-brand-solid_hover",
          cancelButton:
            "!rounded-lg !bg-secondary !font-semibold !text-secondary",
        },
      }}
      style={
        {
          "--normal-bg": "var(--color-bg-primary)",
          "--normal-text": "var(--color-text-primary)",
          "--normal-border": "var(--color-border-secondary)",
          "--border-radius": "1rem",
          "--toast-icon-margin-start": "0px",
          "--toast-icon-margin-end": "0px",
          "--toast-svg-margin-start": "0px",
          "--toast-svg-margin-end": "0px",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
