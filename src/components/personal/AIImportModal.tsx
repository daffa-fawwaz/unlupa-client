import { useState, type FormEvent } from "react";
import { BookOpen, Sparkles, X } from "@/components/foundations/hugeicons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { InlineAlert } from "@/components/base/alert/alert";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { personalService } from "@/features/personal/services/personal.services";
import type { Language } from "../../types";

interface AIImportModalProps {
  onClose: () => void;
  onImport: (cards: { question: string; answer: string }[]) => void;
  language: Language;
}

export function AIImportModal({ onClose, onImport, language }: AIImportModalProps) {
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    if (!topic.trim() && !text.trim()) {
      setError(language === "en" ? "Please provide a topic or text." : "Masukkan topik atau bahan catatan terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await personalService.generateAICards({
        topic: topic.trim(),
        text: text.trim(),
        language,
      });
      const cards = response?.data?.cards;

      if (Array.isArray(cards) && cards.length > 0) {
        onImport(cards);
      } else {
        setError(language === "en" ? "No cards could be generated." : "AI belum dapat menghasilkan kartu dari bahan tersebut.");
      }
    } catch (caughtError: unknown) {
      console.error(caughtError);
      const requestError = caughtError as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      setError(requestError.response?.data?.message || requestError.message || (language === "en" ? "Could not connect to the AI service." : "Tidak dapat terhubung ke layanan AI."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay
      isOpen
      isDismissable={!isLoading}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
    >
      <Modal className="max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl">
        <Dialog aria-label={language === "en" ? "Generate flashcards with AI" : "Buat kartu dengan AI"}>
          {({ close }) => (
            <form onSubmit={handleGenerate} className="flex max-h-[inherit] flex-col">
              <div className="relative shrink-0 overflow-hidden border-b border-brand-200 bg-[linear-gradient(135deg,var(--color-brand-50)_0%,var(--color-bg-primary)_72%)] px-5 py-5 sm:px-6">
                <div className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-brand-200/40 blur-3xl" />
                <div className="relative flex items-start gap-3 pr-10">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs ring-1 ring-brand-600 ring-inset">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-primary">
                        {language === "en" ? "Generate flashcards with AI" : "Buat kartu dengan AI"}
                      </h2>
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 ring-1 ring-brand-200 ring-inset">
                        AI assistant
                      </span>
                    </div>
                    <p className="mt-1 max-w-lg text-sm leading-5 text-secondary">
                      {language === "en"
                        ? "Describe a topic, paste your notes, or combine both for more focused cards."
                        : "Tuliskan topik, tempel catatan, atau gunakan keduanya agar kartu lebih terarah."}
                    </p>
                  </div>
                </div>
                <ButtonUtility
                  icon={X}
                  color="tertiary"
                  tooltip={language === "en" ? "Close AI generator" : "Tutup generator AI"}
                  onPress={close}
                  isDisabled={isLoading}
                  className="absolute right-4 top-4 bg-primary/80 shadow-xs backdrop-blur-sm"
                />
              </div>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                {error && <InlineAlert variant="error" title={error} onDismiss={() => setError(null)} />}

                <Input
                  label={language === "en" ? "Topic" : "Topik"}
                  value={topic}
                  onChange={setTopic}
                  placeholder={language === "en" ? "Example: Basic Arabic vocabulary" : "Contoh: Kosakata dasar Bahasa Arab"}
                  hint={language === "en" ? "Optional when source notes are provided below." : "Opsional jika bahan catatan di bawah sudah diisi."}
                  icon={BookOpen}
                  isDisabled={isLoading}
                />

                <TextArea
                  label={language === "en" ? "Source notes or Q&A pairs" : "Bahan catatan atau pasangan tanya-jawab"}
                  value={text}
                  onChange={setText}
                  placeholder={
                    language === "en"
                      ? "Paste lesson notes, a short article, or Q: ... / A: ... pairs"
                      : "Tempel ringkasan materi, artikel pendek, atau pasangan T: ... / J: ..."
                  }
                  rows={7}
                  hint={language === "en" ? "The generated cards will be added to the currently selected chapter." : "Kartu hasil AI akan dimasukkan ke bab yang sedang dipilih."}
                  isDisabled={isLoading}
                />

                <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-brand-700 shadow-xs ring-1 ring-brand-200 ring-inset">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {language === "en" ? "For better results" : "Agar hasil lebih baik"}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-secondary">
                      {language === "en"
                        ? "Use specific terms and include the facts that must appear in the answers."
                        : "Gunakan topik yang spesifik dan sertakan fakta penting yang wajib muncul pada jawaban."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-secondary bg-secondary px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <Button color="secondary" size="md" onPress={close} isDisabled={isLoading} className="w-full sm:w-auto">
                  {language === "en" ? "Cancel" : "Batal"}
                </Button>
                <Button
                  type="submit"
                  size="md"
                  iconLeading={Sparkles}
                  isLoading={isLoading}
                  showTextWhileLoading
                  isDisabled={!topic.trim() && !text.trim()}
                  className="w-full sm:w-auto"
                >
                  {isLoading
                    ? language === "en"
                      ? "Generating cards..."
                      : "Sedang membuat kartu..."
                    : language === "en"
                      ? "Generate flashcards"
                      : "Buat kartu"}
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
