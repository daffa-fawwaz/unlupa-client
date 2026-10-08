import { useState, type FormEvent } from 'react';
import { Sparkles } from "@/components/foundations/hugeicons";
import { useApp } from '../../context/AppContext';
import type { Language } from '../../types';
import { personalService } from '@/features/personal/services/personal.services';
import { Dialog, Modal, ModalOverlay } from '@/components/application/modals/modal';
import { InlineAlert } from '@/components/base/alert/alert';
import { Badge } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { CloseButton } from '@/components/base/buttons/close-button';
import { Input } from '@/components/base/input/input';
import { TextArea } from '@/components/base/textarea/textarea';

interface GeneratedBookData {
  title: string;
  description?: string;
  chapters: Array<{
    title: string;
    cards?: Array<{ question: string; answer: string }>;
  }>;
}

interface AIBookBuilderModalProps {
  onClose: () => void;
  onImport: (bookData: GeneratedBookData) => void | Promise<void>;
  language: Language;
}

export function AIBookBuilderModal({ onClose, onImport, language }: AIBookBuilderModalProps) {
  const { isFeatureAllowed, recordAIUsage, openUpgradeModal, dailyAIUsage, tierConfig, userProfile } = useApp();
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPro = userProfile.plan === 'premium' || userProfile.plan === 'institutional' || userProfile.role === 'admin' || userProfile.role === 'superadmin';
  const limits = isPro ? tierConfig.premiumTier : tierConfig.freeTier;
  const today = new Date().toISOString().split('T')[0];
  const todayUsed = dailyAIUsage.date === today ? dailyAIUsage.count : 0;
  const remainingGenerations = Math.max(0, limits.maxDailyAIGenerations - todayUsed);

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    if (!topic.trim() && !text.trim()) {
      setError(language === 'en' ? 'Add a topic or paste source notes first.' : 'Tambahkan topik atau tempel catatan sumber terlebih dahulu.');
      return;
    }

    const check = isFeatureAllowed('ai_builder');
    if (!check.allowed) {
      onClose();
      openUpgradeModal(
        check.reason,
        language === 'en'
          ? `You have reached your daily limit of ${check.limit} AI generations. Upgrade to Unlupa Pro for up to 30 generations per day.`
          : `Anda telah mencapai batas harian ${check.limit}x AI Builder. Upgrade ke Unlupa Pro untuk kuota hingga 30x per hari.`,
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await personalService.generateAIBook({ topic: topic.trim(), text: text.trim(), language });
      const book = response?.data?.book as GeneratedBookData | undefined;
      if (!book?.title || !Array.isArray(book.chapters)) {
        setError(language === 'en' ? 'AI did not return a complete book. Try adding more specific notes.' : 'AI belum menghasilkan kitab yang lengkap. Coba tambahkan catatan yang lebih spesifik.');
        return;
      }
      recordAIUsage();
      await onImport(book);
    } catch (error) {
      const requestError = error as { response?: { data?: { message?: string } }; message?: string };
      setError(requestError.response?.data?.message || requestError.message || (language === 'en' ? 'Could not reach the AI service.' : 'Layanan AI tidak dapat dihubungi.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay isOpen isDismissable={!isLoading} onOpenChange={open => { if (!open && !isLoading) onClose(); }}>
      <Modal className="max-w-xl overflow-hidden rounded-t-3xl sm:rounded-3xl">
        <Dialog aria-label={language === 'en' ? 'Build a book with AI' : 'Buat kitab dengan AI'}>
          {({ close }) => (
            <form onSubmit={handleGenerate} className="flex max-h-[inherit] flex-col">
              <div className="relative flex shrink-0 items-start gap-3 border-b border-secondary px-5 py-5 sm:px-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
                  <Sparkles className="size-5" />
                </div>
                <div className="min-w-0 pr-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-primary">{language === 'en' ? 'Build with AI' : 'Buat dengan AI'}</h2>
                    <Badge color="brand" size="sm">{remainingGenerations}/{limits.maxDailyAIGenerations} {language === 'en' ? 'left' : 'tersisa'}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-secondary">
                    {language === 'en' ? 'Turn a topic or source notes into a structured book and review cards.' : 'Ubah topik atau catatan sumber menjadi kitab terstruktur dan kartu murajaah.'}
                  </p>
                </div>
                <CloseButton label={language === 'en' ? 'Close AI builder' : 'Tutup AI builder'} onPress={close} isDisabled={isLoading} className="absolute right-4 top-4" />
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                {error && <InlineAlert variant="error" title={error} onDismiss={() => setError(null)} />}
                <Input
                  label={language === 'en' ? 'Topic' : 'Topik'}
                  value={topic}
                  onChange={value => { setTopic(value); if (error) setError(null); }}
                  placeholder={language === 'en' ? 'Example: Foundations of Arabic grammar' : 'Contoh: Dasar-dasar nahwu'}
                  hint={language === 'en' ? 'Optional when you provide detailed notes below.' : 'Opsional jika Anda memberikan catatan lengkap di bawah.'}
                />
                <TextArea
                  label={language === 'en' ? 'Source notes or Q&A pairs' : 'Catatan sumber atau pasangan tanya-jawab'}
                  value={text}
                  onChange={value => { setText(value); if (error) setError(null); }}
                  placeholder={language === 'en' ? 'Paste notes, an outline, or Q: / A: pairs here...' : 'Tempel catatan, kerangka, atau pasangan T: / J: di sini...'}
                  rows={8}
                  hint={language === 'en' ? 'More context produces a more accurate chapter structure.' : 'Konteks yang lebih lengkap menghasilkan struktur bab yang lebih akurat.'}
                />
                <InlineAlert
                  variant="info"
                  title={language === 'en' ? 'Review before studying' : 'Periksa sebelum belajar'}
                  description={language === 'en' ? 'AI-generated chapters and cards will be added as an editable personal book.' : 'Bab dan kartu hasil AI akan ditambahkan sebagai kitab pribadi yang dapat diedit.'}
                />
              </div>

              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-secondary bg-secondary px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <Button color="secondary" size="md" onPress={close} isDisabled={isLoading} className="w-full sm:w-auto">{language === 'en' ? 'Cancel' : 'Batal'}</Button>
                <Button type="submit" size="md" iconLeading={Sparkles} isLoading={isLoading} isDisabled={!topic.trim() && !text.trim()} className="w-full sm:w-auto">
                  {language === 'en' ? 'Generate book' : 'Buat kitab'}
                </Button>
              </div>
            </form>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
