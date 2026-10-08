import { useState } from 'react';
import { Check, Layers, Pencil, Share2, ShieldCheck } from "@/components/foundations/hugeicons";
import { HugeiconsIcon } from '@hugeicons/react';
import { BookDashedIcon } from '@hugeicons/core-free-icons';
import { useApp } from '../../context/AppContext';
import { resolveAssetUrl } from '../../lib/assets';
import { Dialog, Modal, ModalOverlay } from '@/components/application/modals/modal';
import { InlineAlert } from '@/components/base/alert/alert';
import { Badge, BadgeWithDot } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { CloseButton } from '@/components/base/buttons/close-button';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedBookId?: string | null;
}

type PublishDialogProps = Omit<PublishModalProps, 'isOpen'>;

const PublishDialog = ({ onClose, preselectedBookId }: PublishDialogProps) => {
  const { books, items, library, publishBookToLibrary, language } = useApp();
  const myBooks = books.filter(book => !book.isReadonly);
  const firstUnpublished = myBooks.find(book => !library.some(entry => entry.book.id === book.id));
  const initialBookId = preselectedBookId && myBooks.some(book => book.id === preselectedBookId)
    ? preselectedBookId
    : firstUnpublished?.id || myBooks[0]?.id || '';
  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [allowEdit, setAllowEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedBook = myBooks.find(book => book.id === selectedBookId);
  const selectedBookItems = selectedBook ? items.filter(item => item.bookId === selectedBook.id) : [];
  const isSelectedAlreadyPublished = selectedBook ? library.some(entry => entry.book.id === selectedBook.id) : false;

  const handlePublish = async () => {
    if (!selectedBookId || isSelectedAlreadyPublished || isSubmitting) return;
    setIsSubmitting(true);
    setStatus(null);
    try {
      const result = await publishBookToLibrary(selectedBookId, allowEdit);
      setStatus({ type: result.success ? 'success' : 'error', message: result.message });
      if (result.success) window.setTimeout(onClose, 1600);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : (language === 'en' ? 'Failed to publish book.' : 'Gagal mempublikasikan kitab.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal className="max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl">
      <Dialog aria-label={language === 'en' ? 'Publish book to library' : 'Publikasikan kitab ke pustaka'}>
        {({ close }) => (
          <div className="flex max-h-[inherit] flex-col">
            <div className="relative flex shrink-0 items-start gap-3 border-b border-secondary px-5 py-5 sm:px-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
                <Share2 className="size-5" />
              </div>
              <div className="min-w-0 pr-10">
                <h2 className="text-lg font-semibold text-primary">{language === 'en' ? 'Publish to library' : 'Publikasikan ke pustaka'}</h2>
                <p className="mt-0.5 text-sm text-secondary">
                  {language === 'en' ? 'Share an original book and choose how readers may use it.' : 'Bagikan kitab karya sendiri dan tentukan izin penggunaannya.'}
                </p>
              </div>
              <CloseButton label={language === 'en' ? 'Close publish modal' : 'Tutup modal publikasi'} onPress={close} isDisabled={isSubmitting} className="absolute right-4 top-4" />
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              {status && <InlineAlert variant={status.type} title={status.message} onDismiss={() => setStatus(null)} />}

              <section>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-primary">{language === 'en' ? 'Select a personal book' : 'Pilih kitab pribadi'}</h3>
                    <p className="mt-0.5 text-xs text-tertiary">{language === 'en' ? 'Imported read-only books are not eligible.' : 'Kitab impor hanya-baca tidak dapat dipublikasikan.'}</p>
                  </div>
                  <Badge color="gray" size="sm">{myBooks.length} {language === 'en' ? 'available' : 'tersedia'}</Badge>
                </div>

                {myBooks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-secondary bg-secondary/30 px-5 py-8 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><HugeiconsIcon icon={BookDashedIcon} className="size-4.5" /></div>
                    <p className="mt-2 text-sm font-medium text-primary">{language === 'en' ? 'No personal books yet' : 'Belum ada kitab pribadi'}</p>
                    <p className="mt-1 text-xs text-secondary">{language === 'en' ? 'Create a book before publishing to the library.' : 'Buat kitab terlebih dahulu sebelum mempublikasikannya.'}</p>
                  </div>
                ) : (
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {myBooks.map(book => {
                      const bookItemsCount = items.filter(item => item.bookId === book.id).length;
                      const isPublished = library.some(entry => entry.book.id === book.id);
                      const isSelected = selectedBookId === book.id;
                      const coverSrc = resolveAssetUrl(book.coverUrl);
                      return (
                        <button
                          key={book.id}
                          type="button"
                          disabled={isPublished}
                          onClick={() => { setSelectedBookId(book.id); setStatus(null); }}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition ${isPublished ? 'cursor-not-allowed border-secondary bg-disabled_subtle opacity-60' : isSelected ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-secondary bg-primary hover:border-brand-200'}`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {coverSrc ? (
                              <img src={coverSrc} alt="" className="h-14 w-11 shrink-0 rounded-xl object-cover ring-1 ring-secondary" />
                            ) : (
                              <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><HugeiconsIcon icon={BookDashedIcon} className="size-4.5" /></div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-primary">{book.title}</p>
                              <p className="mt-0.5 truncate text-xs text-secondary">{book.authorName || (language === 'en' ? 'Personal work' : 'Karya pribadi')}</p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                <Badge color="gray" size="sm" className="gap-1"><Layers className="size-3" />{bookItemsCount} {language === 'en' ? 'cards' : 'kartu'}</Badge>
                                {isPublished ? <BadgeWithDot color="success" size="sm">{language === 'en' ? 'Published' : 'Terbit'}</BadgeWithDot> : <BadgeWithDot color="brand" size="sm">{language === 'en' ? 'Ready' : 'Siap'}</BadgeWithDot>}
                              </div>
                            </div>
                          </div>
                          {!isPublished && <div className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-brand-600 bg-brand-solid text-white' : 'border-primary'}`}>{isSelected && <Check className="size-3" />}</div>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-sm font-medium text-primary">{language === 'en' ? 'Reader permission' : 'Izin pembaca'}</h3>
                <p className="mt-0.5 text-xs text-tertiary">{language === 'en' ? 'Choose how imported copies may be used.' : 'Pilih bagaimana salinan hasil impor dapat digunakan.'}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[
                    { value: false, icon: ShieldCheck, title: language === 'en' ? 'Read-only' : 'Hanya baca', badge: language === 'en' ? 'Recommended' : 'Disarankan', description: language === 'en' ? 'Readers can study and review without changing the original structure.' : 'Pembaca dapat belajar dan murajaah tanpa mengubah struktur asli.' },
                    { value: true, icon: Pencil, title: language === 'en' ? 'Allow editing' : 'Izinkan edit', badge: language === 'en' ? 'Open copy' : 'Salinan terbuka', description: language === 'en' ? 'Readers may change chapters and cards in their imported copy.' : 'Pembaca dapat mengubah bab dan kartu pada salinan mereka.' },
                  ].map(option => {
                    const selected = allowEdit === option.value;
                    return (
                      <button
                        key={option.title}
                        type="button"
                        onClick={() => setAllowEdit(option.value)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selected
                            ? option.value
                              ? 'border-utility-green-600 bg-utility-green-50 ring-1 ring-utility-green-600'
                              : 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                            : option.value
                              ? 'border-secondary bg-primary hover:border-utility-green-300'
                              : 'border-secondary bg-primary hover:border-brand-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className={`flex size-9 items-center justify-center rounded-xl ${
                            option.value
                              ? selected ? 'bg-utility-green-600 text-white' : 'bg-utility-green-50 text-utility-green-700'
                              : selected ? 'bg-brand-solid text-white' : 'bg-brand-50 text-brand-700'
                          }`}><option.icon className="size-4" /></div>
                          <Badge color={selected ? (option.value ? 'success' : 'brand') : 'gray'} size="sm">{option.badge}</Badge>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-primary">{option.title}</p>
                        <p className="mt-1 text-xs leading-5 text-secondary">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {selectedBook && !isSelectedAlreadyPublished && (
                <InlineAlert
                  variant="info"
                  title={language === 'en' ? `${selectedBook.title} is ready` : `${selectedBook.title} siap dipublikasikan`}
                  description={`${selectedBookItems.length} ${language === 'en' ? 'cards will be included in the published book.' : 'kartu akan disertakan dalam kitab yang dipublikasikan.'}`}
                />
              )}
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-secondary bg-secondary px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button color="secondary" size="md" onPress={close} isDisabled={isSubmitting} className="w-full sm:w-auto">{language === 'en' ? 'Cancel' : 'Batal'}</Button>
              <Button size="md" iconLeading={Share2} onPress={handlePublish} isLoading={isSubmitting} isDisabled={!selectedBookId || isSelectedAlreadyPublished} className="w-full sm:w-auto">
                {isSelectedAlreadyPublished ? (language === 'en' ? 'Already published' : 'Sudah dipublikasikan') : (language === 'en' ? 'Publish to library' : 'Publikasikan')}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </Modal>
  );
};

export const PublishModal = ({ isOpen, onClose, preselectedBookId }: PublishModalProps) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay isOpen isDismissable onOpenChange={open => { if (!open) onClose(); }}>
      <PublishDialog onClose={onClose} preselectedBookId={preselectedBookId} />
    </ModalOverlay>
  );
};
