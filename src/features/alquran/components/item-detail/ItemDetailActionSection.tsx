import { Sparkles, Edit2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import type {
  ActionConfig,
  ActionPhase,
  StatusDisplay,
} from "@/features/alquran/components/item-detail/ItemDetailView.config";
import { PHASES } from "@/features/alquran/components/item-detail/ItemDetailView.config";

interface ItemDetailActionSectionProps {
  phase: ActionPhase;
  config: ActionConfig;
  statusDisplay: StatusDisplay;
  onPrimaryAction: () => void | Promise<void>;
  onSecondaryAction: () => void | Promise<void>;
  secondaryActionDisabled?: boolean;
  secondaryActionLabel?: string;
  secondaryActionError?: string | null;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

interface PhaseButtonProps {
  label: string;
  icon: ReactNode;
  className: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
}

function PhaseButton({
  label,
  icon,
  className,
  onClick,
  disabled = false,
}: PhaseButtonProps) {
  const buttonClass = `shrink-0 w-full lg:w-auto min-w-[200px] md:min-w-[240px] flex items-center justify-center gap-3 md:gap-4 py-4 md:py-5 px-6 md:px-10 rounded-lg font-black text-lg md:text-xl cursor-pointer hover:opacity-90 active:opacity-80 transition-colors relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed ${className}`;

  const content = (
    <>
      <div className="relative z-10 p-2 md:p-2.5 bg-background/20 rounded-lg pointer-events-none">
        {icon}
      </div>
      <span className="relative z-10 text-center pointer-events-none">{label}</span>
    </>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {content}
    </button>
  );
}

interface ActionIconButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
}

function ActionIconButton({
  label,
  icon,
  onClick,
  variant = "default",
}: ActionIconButtonProps) {
  const baseStyles = "flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-colors";
  const variantStyles = variant === "danger"
    ? "bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 hover:border-destructive/50"
    : "bg-surface-1 border border-border text-muted-foreground hover:bg-surface-2 hover:border-border";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${variantStyles}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PhaseProgress({ phase }: { phase: ActionPhase }) {
  const currentIndex = PHASES.indexOf(phase);

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mb-6 md:mb-8">
      {PHASES.map((step, index) => {
        const isActive = step === phase;
        const isPast = currentIndex > index;

        return (
          <div key={step} className="flex items-center gap-2 md:gap-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-colors z-10 ${
                  isActive
                    ? "bg-primary text-primary-foreground scale-110"
                    : isPast
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-surface-1 text-muted-foreground border border-border"
                }`}
              >
                {index + 1}
              </div>
            </div>

            {index < PHASES.length - 1 && (
              <div
                className={`h-0.5 w-4 md:w-16 rounded-full transition-colors ${
                  isPast ? "bg-primary/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}

      <span className="hidden sm:inline-block md:ml-6 px-3 md:px-4 py-1.5 rounded-full bg-surface-1 border border-border text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2 sm:mt-0">
        {phase === "menghafal" && "Langkah 1 dari 3"}
        {phase === "terjaga" && "Langkah 2 dari 3"}
        {phase === "graduate" && "Langkah 3 dari 3"}
      </span>
    </div>
  );
}

export function ItemDetailActionSection({
  phase,
  config,
  statusDisplay,
  onPrimaryAction,
  onSecondaryAction,
  secondaryActionDisabled = false,
  secondaryActionLabel,
  secondaryActionError,
  onEditClick,
  onDeleteClick,
}: ItemDetailActionSectionProps) {
  return (
    <div className="p-1 rounded-xl bg-surface-1 border border-border mx-auto w-full">
      <div className="bg-background rounded-xl p-5 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start text-center md:text-left">
          <div
            className={`w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl border flex items-center justify-center ${statusDisplay.iconBg}`}
          >
            {statusDisplay.icon}
          </div>

          <div className="flex flex-col justify-center py-2 flex-1 w-full">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-4">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" />
              <span className="text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.25em] uppercase text-muted-foreground">
                Status Saat Ini
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4 tracking-tight">
              {statusDisplay.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-lg max-w-2xl bg-surface-1 p-4 md:p-5 rounded-lg border border-border">
              {statusDisplay.description}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

        <div className="relative z-10 bg-surface-1 rounded-xl p-5 md:p-10 border border-border">
          <PhaseProgress phase={phase} />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-between">
            <div className="flex-1 text-center lg:text-left w-full">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-2 md:mb-3">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span className="text-primary text-xs md:text-sm font-bold tracking-wider uppercase">
                  Tindakan Selanjutnya
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2 md:mb-3">
                {config.sectionTitle}
              </h3>

              <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {config.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <PhaseButton
                onClick={onPrimaryAction}
                className={config.buttonClass}
                icon={config.icon}
                label={config.label}
              />            </div>
          </div>

          {/* Item Management Actions */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Kelola Item
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <ActionIconButton
                label="Edit Item"
                icon={<Edit2 className="w-4 h-4" />}
                onClick={onEditClick}
              />
              <ActionIconButton
                label="Hapus"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={onDeleteClick}
                variant="danger"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
