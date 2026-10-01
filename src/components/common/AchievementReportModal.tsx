import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, FileText, Download, Share2, Settings2, BookOpen,
  Sparkles, Building2, UserCircle, PenTool, Image as ImageIcon, Instagram, Target
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { AnimatePresence, motion } from 'motion/react';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { Badge } from '@/components/base/badges/badges';
import { FloatingAlert } from '@/components/base/alert/alert';
import { Button } from '@/components/base/buttons/button';
import { CloseButton } from '@/components/base/buttons/close-button';
import { Input } from '@/components/base/input/input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type GeneratorAlert = {
  variant: 'success' | 'error' | 'info';
  title: string;
  description: string;
} | null;

export const AchievementReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const isDesktop = useBreakpoint('sm');
  const { quranStats, personalStats, userProfile, language } = useApp();
  const [reportType, setReportType] = useState<'certificate' | 'report' | 'social'>('social');
  const [reportSource, setReportSource] = useState<'quran' | 'personal'>('quran');
  
  // Customization State
  const [instName, setInstName] = useState('Rumah Tahfizh Unlupa');
  const [instLogo, setInstLogo] = useState('');
  const [teacherName, setTeacherName] = useState('Ust. Ahmad Al-Hafizh');
  const [headName, setHeadName] = useState('K.H. Budi Santoso');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorAlert, setGeneratorAlert] = useState<GeneratorAlert>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const isQuran = reportSource === 'quran';
  const primaryStat = isQuran ? (quranStats?.active || 0) : (personalStats?.activeItems || 0);
  const primaryLabel = isQuran ? 'Hafalan Aktif' : 'Item Aktif';
  const primaryLabelCert = isQuran ? 'Pages Memorized' : 'Active Items';
  const primarySuffix = isQuran ? 'hal' : 'item';
  const primaryDesc = isQuran ? 'Termasuk hafalan baru & lama' : 'Materi yang sedang dipelajari';
  const secondaryStat = isQuran ? (quranStats?.mastered || 0) : (personalStats?.totalItems || 0);
  const secondaryLabel = isQuran ? 'Mutqin (>30 Hari)' : 'Total Koleksi';
  const secondaryLabelCert = isQuran ? 'Pages Mastered (Mutqin)' : 'Items Saved';
  const secondarySuffix = isQuran ? 'hal' : 'item';
  const secondaryDesc = isQuran ? '> 30 Hari Tanpa Lupa' : 'Semua materi dalam database';
  
  const reportSubtitle = isQuran ? 'Laporan Progres Tahfizh Mutqin' : 'Laporan Progres Kelas Pribadi';
  const certSubtitle = isQuran ? 'Sertifikat Tahfizh' : 'Sertifikat Kelas Pribadi';

  const generateImageBlob = async (): Promise<Blob | null> => {
    if (!printRef.current) return null;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: reportType === 'social' ? 3 : 2, // High resolution
        useCORS: true,
        backgroundColor: reportType === 'social' ? '#0f172a' : '#ffffff'
      });
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (err) {
      console.error('Failed to generate image', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const blob = await generateImageBlob();
    if (!blob) {
      setGeneratorAlert({
        variant: 'error',
        title: language === 'en' ? 'Export failed' : 'Ekspor gagal',
        description: language === 'en' ? 'The image could not be generated. Please try again.' : 'Gambar tidak dapat dibuat. Silakan coba lagi.',
      });
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `Unlupa-${reportType}-${(userProfile?.fullName || 'User').replace(/\s+/g, '-')}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setGeneratorAlert({
      variant: 'success',
      title: language === 'en' ? 'PNG saved' : 'PNG berhasil disimpan',
      description: language === 'en' ? 'Your document is ready on this device.' : 'Dokumenmu sudah tersimpan di perangkat ini.',
    });
  };

  const handleShare = async () => {
    const blob = await generateImageBlob();
    if (!blob) {
      setGeneratorAlert({
        variant: 'error',
        title: language === 'en' ? 'Unable to share' : 'Gagal membagikan',
        description: language === 'en' ? 'The image could not be generated. Please try again.' : 'Gambar tidak dapat dibuat. Silakan coba lagi.',
      });
      return;
    }
    const file = new File([blob], `Unlupa-${reportType}.png`, { type: 'image/png' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: language === 'en' ? 'Quran Progress' : 'Progres Hafalan Al-Qur\'an',
          text: language === 'en' ? 'Alhamdulillah, my memorization progress with Unlupa.id' : 'Alhamdulillah, progres hafalan saya bersama Unlupa.id',
          files: [file]
        });
        setGeneratorAlert({
          variant: 'success',
          title: language === 'en' ? 'Document shared' : 'Dokumen berhasil dibagikan',
          description: language === 'en' ? 'Your achievement document was shared successfully.' : 'Dokumen pencapaianmu berhasil dibagikan.',
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('Share failed', err);
        setGeneratorAlert({
          variant: 'error',
          title: language === 'en' ? 'Unable to share' : 'Gagal membagikan',
          description: language === 'en' ? 'Please retry or save the PNG instead.' : 'Silakan coba lagi atau simpan PNG sebagai pengganti.',
        });
      }
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = file.name;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setGeneratorAlert({
        variant: 'info',
        title: language === 'en' ? 'PNG downloaded instead' : 'PNG diunduh sebagai pengganti',
        description: language === 'en' ? 'File sharing is unavailable in this browser.' : 'Fitur berbagi file tidak tersedia di browser ini.',
      });
    }
  };

  const todayStr = new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const previewWidth = reportType === 'certificate' ? 800 : reportType === 'social' ? 450 : 566;
  const previewHeight = reportType === 'certificate' ? 566 : 800;
  const previewScale = isDesktop
    ? reportType === 'certificate' ? 0.68 : reportType === 'social' ? 0.72 : 0.72
    : reportType === 'certificate' ? 0.4 : reportType === 'social' ? 0.68 : 0.54;

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label={language === 'en' ? 'Close certificate generator' : 'Tutup pembuat sertifikat'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isGenerating ? undefined : onClose}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-report-title"
            initial={isDesktop ? { opacity: 0, y: 24, scale: 0.98 } : { y: '100%' }}
            animate={isDesktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, y: 24, scale: 0.98 } : { y: '100%' }}
            transition={isDesktop ? { duration: 0.2 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-3xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-secondary bg-primary px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs">
                  <Award className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 id="achievement-report-title" className="truncate text-lg font-semibold tracking-tight text-primary">
                      {language === 'en' ? 'Certificate Studio' : 'Studio Sertifikat'}
                    </h3>
                    <Badge color="brand" size="sm" className="hidden sm:flex">Export</Badge>
                  </div>
                  <p className="truncate text-xs text-secondary sm:text-sm">
                    {language === 'en' ? 'Design and export your learning achievement' : 'Desain dan ekspor pencapaian belajarmu'}
                  </p>
                </div>
              </div>
              <CloseButton slot={null} size="md" onPress={onClose} isDisabled={isGenerating} label="Close certificate generator" />
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto lg:flex lg:overflow-hidden">
              <aside className="w-full space-y-6 bg-primary p-4 sm:p-5 lg:w-88 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-secondary">
                <div className="rounded-2xl border border-secondary bg-secondary/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{userProfile.fullName || 'Unlupa User'}</p>
                      <p className="text-xs text-secondary">{language === 'en' ? 'Live achievement data' : 'Data pencapaian langsung'}</p>
                    </div>
                  </div>
                </div>

                <section className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{language === 'en' ? 'Learning source' : 'Sumber pembelajaran'}</p>
                    <p className="mt-0.5 text-xs text-secondary">{language === 'en' ? 'Choose the data shown in the document.' : 'Pilih data yang ditampilkan pada dokumen.'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      aria-pressed={reportSource === 'quran'}
                      onClick={() => setReportSource('quran')}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${reportSource === 'quran' ? 'border-brand bg-brand-50 text-brand-700 shadow-xs' : 'border-secondary bg-primary text-secondary hover:bg-primary_hover'}`}
                    >
                      <BookOpen className="size-4.5 shrink-0" />
                      <span className="text-sm font-semibold">Al-Quran</span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={reportSource === 'personal'}
                      onClick={() => setReportSource('personal')}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${reportSource === 'personal' ? 'border-brand bg-brand-50 text-brand-700 shadow-xs' : 'border-secondary bg-primary text-secondary hover:bg-primary_hover'}`}
                    >
                      <Target className="size-4.5 shrink-0" />
                      <span className="text-sm font-semibold">{language === 'en' ? 'Personal' : 'Pribadi'}</span>
                    </button>
                  </div>
                </section>

                <section className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{language === 'en' ? 'Document format' : 'Format dokumen'}</p>
                    <p className="mt-0.5 text-xs text-secondary">{language === 'en' ? 'Optimized for each publishing format.' : 'Dioptimalkan untuk setiap kebutuhan publikasi.'}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'social', label: language === 'en' ? 'Story' : 'Story', icon: Instagram },
                      { value: 'certificate', label: language === 'en' ? 'Certificate' : 'Sertifikat', icon: Award },
                      { value: 'report', label: language === 'en' ? 'Report' : 'Rapor', icon: FileText },
                    ] as const).map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={reportType === value}
                        onClick={() => setReportType(value)}
                        className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition ${reportType === value ? 'border-brand bg-brand-50 text-brand-700 shadow-xs' : 'border-secondary bg-primary text-secondary hover:bg-primary_hover'}`}
                      >
                        <Icon className="size-5" />
                        <span className="w-full truncate text-xs font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {reportType !== 'social' && (
                  <section className="space-y-4 border-t border-secondary pt-5">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-fg-quaternary">
                        <Settings2 className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">{language === 'en' ? 'Document details' : 'Detail dokumen'}</p>
                        <p className="text-xs text-secondary">{language === 'en' ? 'Customize official information.' : 'Sesuaikan informasi resmi.'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Input size="sm" icon={Building2} label={language === 'en' ? 'Institution name' : 'Nama lembaga'} value={instName} onChange={setInstName} />
                      <Input size="sm" icon={ImageIcon} label={language === 'en' ? 'Logo URL (optional)' : 'URL logo (opsional)'} value={instLogo} onChange={setInstLogo} placeholder="https://..." />
                      <Input size="sm" icon={UserCircle} label={language === 'en' ? 'Teacher or mentor' : 'Guru atau pembimbing'} value={teacherName} onChange={setTeacherName} />
                      <Input size="sm" icon={PenTool} label={language === 'en' ? 'Head of institution' : 'Pimpinan lembaga'} value={headName} onChange={setHeadName} />
                    </div>
                  </section>
                )}

                <div className="grid grid-cols-2 gap-2 border-t border-secondary pt-5">
                  <Button color="secondary" size="lg" iconLeading={Share2} isLoading={isGenerating} onPress={handleShare} className="w-full">
                    {language === 'en' ? 'Share' : 'Bagikan'}
                  </Button>
                  <Button size="lg" iconLeading={Download} isLoading={isGenerating} onPress={handleDownload} className="w-full">
                    {language === 'en' ? 'Save PNG' : 'Simpan PNG'}
                  </Button>
                </div>
              </aside>

              <section className="flex min-h-[440px] flex-1 flex-col border-t border-secondary bg-secondary/40 lg:min-h-0 lg:border-l-0 lg:border-t-0">
                <div className="flex items-center justify-between gap-3 border-b border-secondary bg-primary/80 px-4 py-3 sm:px-5">
                  <div>
                    <p className="text-sm font-semibold text-primary">{language === 'en' ? 'Live preview' : 'Pratinjau langsung'}</p>
                    <p className="text-xs text-secondary">{previewWidth} × {previewHeight}px PNG</p>
                  </div>
                  <Badge color="success" size="sm">{language === 'en' ? 'Ready to export' : 'Siap diekspor'}</Badge>
                </div>
                <div className="flex flex-1 justify-center overflow-auto p-4 sm:p-6">
                  <div
                    className="relative shrink-0"
                    style={{ width: previewWidth * previewScale, height: previewHeight * previewScale }}
                  >
                    <div
                      ref={printRef}
                      className={`${reportType === 'social' ? 'bg-slate-950' : 'bg-white'} relative flex shrink-0 flex-col overflow-hidden shadow-xl`}
                      style={{
                        aspectRatio: reportType === 'certificate' ? '1.414 / 1' : reportType === 'social' ? '9 / 16' : '1 / 1.414',
                        width: previewWidth,
                        minHeight: previewHeight,
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'top left',
                      }}
                    >
              {/* Common Unlupa Watermark / Border */}
              <div className="absolute inset-0 border-[12px] border-indigo-900/5 pointer-events-none z-10 pointer-events-none"></div>
              <div className="absolute inset-2 border-2 border-indigo-900/10 pointer-events-none z-10 pointer-events-none"></div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

              {/* Verified by Unlupa.id Default Logo (Bottom Center) */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-1.5 opacity-50 z-20 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Verified by Unlupa.id</span>
              </div>

              {reportType === 'social' ? (
                /* SOCIAL STORY LAYOUT */
                <div className="flex-1 flex flex-col p-8 relative z-20 text-center justify-between items-center overflow-hidden h-full">
                  <div className="absolute inset-0 bg-slate-950 pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
                  <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                  
                  <div className="relative z-10 w-full pt-8 flex-1 flex flex-col justify-center">
                    <div className="flex justify-center mb-6 relative">
                      <div className="w-24 h-24 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl relative z-10 bg-slate-800">
                         {userProfile.avatarUrl ? (
                           <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" crossOrigin="anonymous" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">{userProfile.fullName.charAt(0)}</div>
                         )}
                      </div>
                      <div className="absolute bottom-0 right-1/2 translate-x-10 translate-y-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-20 border border-amber-300">
                        Hafizh
                      </div>
                    </div>

                    <h2 className="text-sm font-bold text-blue-200/80 tracking-[0.2em] uppercase mb-2">{userProfile.fullName}</h2>
                    <h1 className="text-[2.5rem] font-black text-white leading-[1.1] mb-10 drop-shadow-lg">
                      {language === 'en' ? 'Alhamdulillah,' : 'Alhamdulillah,'}<br/>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-300 to-emerald-400">
                        {language === 'en' ? 'Great Progress!' : 'Progres Luar Biasa!'}
                      </span>
                    </h1>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 flex flex-col items-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                        <Target className="w-6 h-6 text-blue-400 mb-3 opacity-80" />
                        <span className="text-5xl font-black text-white mb-1 drop-shadow-md">{primaryStat}</span>
                        <span className="text-[10px] uppercase tracking-widest text-blue-200/80 font-bold text-center leading-tight">{primaryLabel.split(' ')[0]}<br/>{primaryLabel.split(' ').slice(1).join(' ')}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 flex flex-col items-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                        <Award className="w-6 h-6 text-emerald-400 mb-3 opacity-80" />
                        <span className="text-5xl font-black text-emerald-400 mb-1 drop-shadow-md">{secondaryStat}</span>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-200/80 font-bold text-center leading-tight">{secondaryLabel.split(' ')[0]}<br/>{secondaryLabel.split(' ').slice(1).join(' ')}</span>
                      </div>
                    </div>

                    {/* Retention Mini Chart */}
                    {isQuran ? (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mx-2 relative overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Kekuatan Memori</p>
                      <div className="flex items-end justify-center gap-1.5 h-20">
                        {[
                          { val: quranStats.intervalLessThan5, col: 'bg-rose-500' },
                          { val: quranStats.intervalLessThan10 - quranStats.intervalLessThan5, col: 'bg-amber-500' },
                          { val: quranStats.intervalLessThan20 - quranStats.intervalLessThan10, col: 'bg-purple-500' },
                          { val: quranStats.intervalLessThan30 - quranStats.intervalLessThan20, col: 'bg-blue-500' },
                          { val: quranStats.intervalOver30, col: 'bg-emerald-500' }
                        ].map((b, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className={`w-full rounded-t-md ${b.col} shadow-lg shadow-black/20`} style={{ height: `${Math.max(15, (b.val / (quranStats.active || 1)) * 100)}%` }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    ) : (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mx-2 relative overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Rata-rata Memori</p>
                      <div className="flex items-center justify-center h-20">
                        <span className="text-4xl font-black text-amber-400 drop-shadow-md">{Math.round(personalStats.avgStability * 100)}%</span>
                      </div>
                    </div>
                    )}
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-2 mt-auto pb-4">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white tracking-widest uppercase">Unlupa.id</span>
                    </div>
                    <p className="text-[9px] text-slate-500 tracking-widest uppercase">AI-Powered Memorization</p>
                  </div>
                </div>
              ) : reportType === 'certificate' ? (
                /* CERTIFICATE LAYOUT */
                <div className="flex-1 flex flex-col p-12 relative z-20 text-center">
                  <div className="flex justify-between items-start">
                    {instLogo ? (
                      <img src={instLogo} alt="Logo" className="h-16 object-contain" crossOrigin="anonymous" />
                    ) : (
                      <div className="h-16 flex items-center justify-center">
                        <span className="text-xl font-black text-indigo-900">{instName}</span>
                      </div>
                    )}
                    
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{certSubtitle}</p>
                      <p className="text-xs text-slate-500">{todayStr}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center mt-8">
                    <h1 className="text-5xl font-black text-indigo-950 mb-2 font-serif tracking-tight">CERTIFICATE</h1>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.3em] mb-8">Of Achievement</p>
                    
                    <p className="text-sm text-slate-600 mb-2">This certificate is proudly presented to</p>
                    <h2 className="text-4xl font-bold text-slate-900 mb-6 italic" style={{ fontFamily: 'Georgia, serif' }}>
                      {userProfile.fullName}
                    </h2>
                    
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      For outstanding dedication and commitment in memorizing with adaptive review methodology.
                    </p>

                    <div className="mt-8 flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-3xl font-black text-indigo-600">{primaryStat}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{primaryLabelCert}</p>
                      </div>
                      <div className="w-px h-12 bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-3xl font-black text-amber-500">{secondaryStat}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{secondaryLabelCert}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-end px-10">
                    <div className="text-center w-48">
                      <div className="h-12 border-b border-slate-300 mb-2 flex items-end justify-center pb-2">
                         <span className="text-indigo-900/20 font-serif italic text-lg">{teacherName.split(' ')[0]}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{teacherName}</p>
                      <p className="text-[10px] text-slate-500">Mentor / Muhaffizh</p>
                    </div>
                    
                    <div className="w-20 h-20 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center flex-col shadow-inner">
                      <Award className="w-6 h-6 text-amber-500 mb-1" />
                      <span className="text-[7px] font-bold text-amber-700 uppercase">Excellent</span>
                    </div>

                    <div className="text-center w-48">
                      <div className="h-12 border-b border-slate-300 mb-2 flex items-end justify-center pb-2">
                        <span className="text-indigo-900/20 font-serif italic text-lg">{headName.split(' ')[0]}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{headName}</p>
                      <p className="text-[10px] text-slate-500">Head of Institution</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* REPORT LAYOUT */
                <div className="flex-1 flex flex-col p-10 relative z-20">
                  {/* Report Header */}
                  <div className="flex items-start justify-between border-b-2 border-indigo-900 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                       {instLogo ? (
                          <img src={instLogo} alt="Logo" className="w-16 h-16 object-contain" crossOrigin="anonymous" />
                        ) : (
                          <div className="w-16 h-16 bg-indigo-900 text-white flex items-center justify-center font-bold text-2xl">
                            {instName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{instName}</h1>
                          <p className="text-sm font-semibold text-indigo-600">{reportSubtitle}</p>
                        </div>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-bold text-slate-800 uppercase tracking-wider mb-1">Tanggal Cetak</p>
                      <p className="text-slate-600">{todayStr}</p>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 flex items-center gap-5">
                    <img src={userProfile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" crossOrigin="anonymous" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nama Santri</p>
                      <h2 className="text-xl font-bold text-slate-900">{userProfile.fullName}</h2>
                      <p className="text-sm text-slate-600 mt-0.5">{userProfile.email}</p>
                    </div>
                  </div>

                  {/* Memory Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 text-center">
                      <p className="text-sm font-bold text-indigo-800 mb-1">{primaryLabel}</p>
                      <p className="text-4xl font-black text-indigo-600">{primaryStat} <span className="text-base font-semibold text-indigo-400">{primarySuffix}</span></p>
                      <p className="text-[10px] text-indigo-500 mt-2">{primaryDesc}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
                      <p className="text-sm font-bold text-emerald-800 mb-1">{secondaryLabel}</p>
                      <p className="text-4xl font-black text-emerald-600">{secondaryStat} <span className="text-base font-semibold text-emerald-400">{secondarySuffix}</span></p>
                      <p className="text-[10px] text-emerald-500 mt-2">{secondaryDesc}</p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="mb-auto">
                    {isQuran ? (
                    <>
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Distribusi Kekuatan Hafalan</h3>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                           <span className="text-slate-700">Sangat Kuat (&gt; 30 Hari)</span>
                         </div>
                         <span className="font-bold text-slate-900">{quranStats.intervalOver30} hal</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                           <span className="text-slate-700">Kuat (20 - 29 Hari)</span>
                         </div>
                         <span className="font-bold text-slate-900">{quranStats.intervalLessThan30 - quranStats.intervalOver30} hal</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                           <span className="text-slate-700">Stabil (10 - 19 Hari)</span>
                         </div>
                         <span className="font-bold text-slate-900">{quranStats.intervalLessThan20 - quranStats.intervalLessThan30} hal</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                           <span className="text-slate-700">Berkembang (5 - 9 Hari)</span>
                         </div>
                         <span className="font-bold text-slate-900">{quranStats.intervalLessThan10 - quranStats.intervalLessThan20} hal</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                           <span className="text-slate-700">Hafalan Baru (&lt; 5 Hari)</span>
                         </div>
                         <span className="font-bold text-slate-900">{quranStats.intervalLessThan5} hal</span>
                       </div>
                    </div>
                    </>
                    ) : (
                    <>
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Statistik Kekuatan Ingatan</h3>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                           <span className="text-slate-700">Rata-rata Kekuatan Memori (Stability)</span>
                         </div>
                         <span className="font-bold text-slate-900">{Math.round(personalStats.avgStability * 100)}%</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                           <span className="text-slate-700">Item Tersimpan</span>
                         </div>
                         <span className="font-bold text-slate-900">{personalStats.totalItems} item</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                           <span className="text-slate-700">Jadwal Review Hari Ini</span>
                         </div>
                         <span className="font-bold text-slate-900">{personalStats.dueToday} item</span>
                       </div>
                    </div>
                    </>
                    )}
                  </div>

                  {/* Signatures */}
                  <div className="mt-8 flex justify-between items-end">
                    <div className="text-center w-40">
                      <div className="h-12 border-b border-slate-400 mb-2 pb-2"></div>
                      <p className="text-xs font-bold text-slate-800">{headName}</p>
                      <p className="text-[10px] text-slate-500">Pimpinan</p>
                    </div>
                    <div className="text-center w-40">
                      <div className="h-12 border-b border-slate-400 mb-2 pb-2"></div>
                      <p className="text-xs font-bold text-slate-800">{teacherName}</p>
                      <p className="text-[10px] text-slate-500">Muhaffizh / Mentor</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    {generatorAlert && (
      <FloatingAlert
        variant={generatorAlert.variant}
        title={generatorAlert.title}
        description={generatorAlert.description}
        onDismiss={() => setGeneratorAlert(null)}
      />
    )}
    </>
  );
};
