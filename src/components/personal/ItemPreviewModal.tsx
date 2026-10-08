import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Power,
  RotateCw,
  Sparkles,
  WalletCards,
  X,
} from "@/components/foundations/hugeicons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import type { BookItem, Language } from "../../types";
import { AudioRecorderPlayer } from "../shared/AudioRecorderPlayer";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import { BilingualCardText } from "../common/BilingualCardText";

interface Props {
  item: BookItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  language: Language;
}

export const ItemPreviewModal = ({
  item,
  isOpen,
  onClose,
  onNavigateNext,
  onNavigatePrev,
  onActivate,
  onDeactivate,
  language,
}: Props) => {
  const [flippedItemId, setFlippedItemId] = useState<string | null>(null);
  const showAnswer = Boolean(item && flippedItemId === item.id);
  const toggleAnswer = () => {
    if (!item) return;
    setFlippedItemId((current) => (current === item.id ? null : item.id));
  };

  useSwipeGesture(null, {
    disabled: !isOpen,
    onSwipeLeft: () => onNavigateNext?.(),
    onSwipeRight: () => (onNavigatePrev ? onNavigatePrev() : onClose()),
    threshold: 40,
  });

  if (!isOpen || !item) return null;

  return (
    <ModalOverlay isOpen isDismissable onOpenChange={(open) => !open && onClose()}>
      <Modal className="max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl">
        <Dialog aria-label={language === "en" ? "Card preview" : "Pratinjau kartu"} className="!overflow-hidden">
          {({ close }) => (
            <div className="flex max-h-[inherit] flex-col">
              <header className="relative flex shrink-0 items-center justify-between gap-3 overflow-hidden border-b border-brand-200 bg-[linear-gradient(135deg,var(--color-brand-50)_0%,var(--color-bg-primary)_76%)] px-5 py-4 sm:px-6">
                <div className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-brand-200/40 blur-3xl" />
                <div className="relative flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs"><WalletCards className="size-4.5" /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-primary">{language === "en" ? "Card preview" : "Pratinjau kartu"}</h2>
                      {item.isActive ? <BadgeWithDot color="success" size="sm">{language === "en" ? "Active" : "Aktif"}</BadgeWithDot> : <Badge color="gray" size="sm">{language === "en" ? "Inactive" : "Nonaktif"}</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-secondary">{language === "en" ? "Click the card to flip between both sides." : "Klik kartu untuk membalik kedua sisinya."}</p>
                  </div>
                </div>

                <div className="relative flex items-center gap-1">
                  {(onNavigatePrev || onNavigateNext) && (
                    <div className="mr-1 flex rounded-xl border border-secondary bg-primary p-1 shadow-xs">
                      <ButtonUtility icon={ChevronLeft} color="tertiary" size="xs" tooltip={language === "en" ? "Previous card" : "Kartu sebelumnya"} onPress={onNavigatePrev} isDisabled={!onNavigatePrev} />
                      <ButtonUtility icon={ChevronRight} color="tertiary" size="xs" tooltip={language === "en" ? "Next card" : "Kartu berikutnya"} onPress={onNavigateNext} isDisabled={!onNavigateNext} />
                    </div>
                  )}
                  <ButtonUtility icon={X} color="tertiary" tooltip={language === "en" ? "Close preview" : "Tutup pratinjau"} onPress={close} className="bg-primary/80 shadow-xs" />
                </div>
              </header>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-secondary/20 p-4 sm:p-6">
                <button type="button" onClick={toggleAnswer} className="block w-full text-left [perspective:1400px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
                  <div className={`relative min-h-[360px] w-full transition-transform duration-500 [transform-style:preserve-3d] sm:min-h-[420px] ${showAnswer ? "[transform:rotateY(180deg)]" : ""}`}>
                    <section className="absolute inset-0 flex flex-col overflow-y-auto rounded-3xl border border-secondary bg-primary p-5 shadow-lg [backface-visibility:hidden] sm:p-7">
                      <div className="flex items-center justify-between"><Badge color="brand" size="sm">{language === "en" ? "Question" : "Pertanyaan"}</Badge><RotateCw className="size-4 text-fg-quaternary" /></div>
                      <div className="flex flex-1 flex-col justify-center py-5">
                        <BilingualCardText text={item.question} type="question" variant="detail-modal" emptyFallback={language === "en" ? "[Image question]" : "[Pertanyaan berupa gambar]"} />
                        {item.imageQ && <img src={item.imageQ} alt={language === "en" ? "Question visual" : "Gambar pertanyaan"} className="mt-4 max-h-60 w-full rounded-2xl bg-secondary object-contain ring-1 ring-secondary" />}
                      </div>
                      <div className="flex items-center justify-center gap-2 border-t border-secondary pt-3 text-xs font-medium text-brand-secondary"><RotateCw className="size-3.5" />{language === "en" ? "Flip to answer" : "Balik ke jawaban"}</div>
                    </section>

                    <section className="absolute inset-0 flex flex-col overflow-y-auto rounded-3xl border border-brand-200 bg-[linear-gradient(145deg,var(--color-bg-primary)_0%,var(--color-brand-50)_100%)] p-5 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-7">
                      <div className="flex items-center justify-between"><Badge color="success" size="sm">{language === "en" ? "Answer" : "Jawaban"}</Badge><RotateCw className="size-4 text-brand-500" /></div>
                      <div className="flex flex-1 flex-col justify-center py-5">
                        <BilingualCardText text={item.answer} type="answer" variant="detail-modal" emptyFallback={language === "en" ? "[No text answer]" : "[Tidak ada teks jawaban]"} />
                        {item.imageA && <img src={item.imageA} alt={language === "en" ? "Answer visual" : "Gambar jawaban"} className="mt-4 max-h-56 w-full rounded-2xl bg-primary object-contain ring-1 ring-brand-200" />}
                        {item.explanation && (
                          <div className="mt-4 rounded-2xl border border-brand-200 bg-primary/85 p-4">
                            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-700"><Sparkles className="size-3.5" />{language === "en" ? "Explanation" : "Penjelasan"}</p>
                            <BilingualCardText text={item.explanation} type="answer" variant="detail-modal" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 border-t border-brand-200 pt-3 text-xs font-medium text-brand-secondary"><RotateCw className="size-3.5" />{language === "en" ? "Flip to question" : "Balik ke pertanyaan"}</div>
                    </section>
                  </div>
                </button>

                <div className="rounded-2xl border border-secondary bg-primary p-3.5 shadow-xs">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-secondary"><BookOpen className="size-3.5 text-brand-600" />{language === "en" ? "Voice note" : "Catatan suara"}</div>
                  <AudioRecorderPlayer itemId={item.id} itemType="book" itemLabel={language === "en" ? "Voice note" : "Setoran suara"} language={language} compact />
                </div>
              </div>

              <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-secondary bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  {!item.isActive && onActivate ? (
                    <Button color="secondary" size="sm" iconLeading={CheckCircle2} onPress={onActivate}>{language === "en" ? "Activate card" : "Aktifkan kartu"}</Button>
                  ) : item.isActive && onDeactivate ? (
                    <Button color="secondary" size="sm" iconLeading={Power} onPress={onDeactivate}>{language === "en" ? "Deactivate card" : "Nonaktifkan kartu"}</Button>
                  ) : null}
                </div>
                <Button size="sm" iconLeading={RotateCw} onPress={toggleAnswer}>{showAnswer ? (language === "en" ? "Show question" : "Lihat pertanyaan") : language === "en" ? "Show answer" : "Lihat jawaban"}</Button>
              </footer>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
