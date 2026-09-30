import React, { useState, useEffect, useRef } from 'react';
import { BookItem, Chapter, Language } from '../../types';
import { X, UploadCloud, BookOpen, ChevronDown } from 'lucide-react';
import { uploadImageToStorage } from '../../lib/imageUtils';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { question: string; answer: string; explanation?: string; imageQ?: string; imageA?: string; chapterId?: string }, keepOpen?: boolean) => void;
  chapters: Chapter[];
  initialData?: Partial<BookItem>;
  initialChapterId?: string;
  language: Language;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen, onClose, onSubmit, chapters, initialData, initialChapterId, language
}) => {
  const [form, setForm] = useState({
    question: '',
    answer: '',
    explanation: '',
    imageQ: '',
    imageA: '',
    chapterId: ''
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputQ = useRef<HTMLInputElement>(null);
  const fileInputA = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const hasExp = Boolean(initialData?.explanation);
      setShowExplanation(hasExp);
      setForm({
        question: initialData?.question || '',
        answer: initialData?.answer || '',
        explanation: initialData?.explanation || '',
        imageQ: initialData?.imageQ || '',
        imageA: initialData?.imageA || '',
        chapterId: initialData?.chapterId || initialChapterId || ''
      });
    }
  }, [isOpen, initialData, initialChapterId]);

  if (!isOpen) return null;

  const submitForm = (keepOpen: boolean) => {
    if (!form.question.trim() && !form.imageQ) return;
    if (!form.answer.trim() && !form.imageA) return;
    
    onSubmit({
      question: form.question,
      answer: form.answer,
      explanation: form.explanation.trim() || undefined,
      imageQ: form.imageQ || undefined,
      imageA: form.imageA || undefined,
      chapterId: form.chapterId || undefined
    }, keepOpen);

    if (keepOpen) {
      setForm(prev => ({
        ...prev,
        question: '',
        answer: '',
        explanation: '',
        imageQ: '',
        imageA: ''
      }));
      setShowExplanation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to close if submitted via enter key or generic submit
    submitForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageQ' | 'imageA') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const storageUrl = await uploadImageToStorage(file);
      setForm(prev => ({ ...prev, [field]: storageUrl }));
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to render chapter options hierarchically
  const renderChapterOptions = (parentId: string | null | undefined, depth = 0) => {
    const children = chapters.filter(c => (c.parentId || null) === (parentId || null));
    let nodes: React.ReactNode[] = [];
    children.forEach(ch => {
      const prefix = '\u00A0\u00A0'.repeat(depth) + (depth > 0 ? '└ ' : '');
      nodes.push(
        <option key={ch.id} value={ch.id}>{prefix}{ch.title}</option>
      );
      nodes = nodes.concat(renderChapterOptions(ch.id, depth + 1));
    });
    return nodes;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? (language === 'en' ? 'Edit Card' : 'Edit Kartu') : (language === 'en' ? 'Add Knowledge Card' : 'Tambah Kartu Review')}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {chapters.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Assign to Chapter' : 'Pilih Bab'}
              </label>
              <select
                value={form.chapterId}
                onChange={e => setForm({ ...form, chapterId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">-- {language === 'en' ? 'No Chapter' : 'Tanpa Bab'} --</option>
                {renderChapterOptions(null)}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Question' : 'Pertanyaan'}
            </label>
            <textarea
              rows={2}
              placeholder={language === 'en' ? 'Enter text...' : 'Teks pertanyaan...'}
              value={form.question}
              onChange={e => setForm({ ...form, question: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputQ.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                {language === 'en' ? 'Upload Image' : 'Unggah Gambar'}
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputQ} onChange={e => handleImageUpload(e, 'imageQ')} />
              
              {form.imageQ && (
                <div className="relative w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group">
                  <img src={form.imageQ} alt="Preview Q" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm({...form, imageQ: ''})} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Answer' : 'Jawaban'}
            </label>
            <textarea
              rows={3}
              placeholder={language === 'en' ? 'Enter answer text...' : 'Teks jawaban...'}
              value={form.answer}
              onChange={e => setForm({ ...form, answer: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputA.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                {language === 'en' ? 'Upload Image' : 'Unggah Gambar'}
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputA} onChange={e => handleImageUpload(e, 'imageA')} />

              <button
                type="button"
                onClick={() => setShowExplanation(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/90 hover:bg-indigo-100/90 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold transition-colors border border-indigo-200/80 dark:border-indigo-800 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'en' ? '+ Insert Explanation' : '+ Sisipkan Penjelasan'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-indigo-500 transition-transform duration-200 ${showExplanation ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {form.imageA && (
              <div className="relative w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group mt-2">
                <img src={form.imageA} alt="Preview A" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm({...form, imageA: ''})} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {showExplanation && (
              <div className="space-y-1.5 mt-3 p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    {language === 'en' ? 'Explanation (Optional)' : 'Penjelasan (Opsional)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExplanation(false);
                      setForm(prev => ({ ...prev, explanation: '' }));
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Remove' : 'Hapus'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder={language === 'en' ? 'Add extra explanation, notes, or tips...' : 'Tuliskan penjelasan tambahan, tips, atau catatan konteks...'}
                  value={form.explanation}
                  onChange={e => setForm({ ...form, explanation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200/70 dark:border-indigo-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : 'Tutup Keluar'}
            </button>
            {!initialData && (
              <button
                type="button"
                onClick={() => submitForm(true)}
                disabled={(!form.question.trim() && !form.imageQ) || (!form.answer.trim() && !form.imageA)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-emerald-200 dark:border-emerald-800 cursor-pointer"
              >
                {language === 'en' ? 'Save & Add Another' : 'Simpan & Tambah Lagi'}
              </button>
            )}
            <button
              type="submit"
              disabled={(!form.question.trim() && !form.imageQ) || (!form.answer.trim() && !form.imageA)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              {language === 'en' ? 'Save Card' : (initialData ? 'Simpan Perubahan' : 'Simpan & Tutup')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

