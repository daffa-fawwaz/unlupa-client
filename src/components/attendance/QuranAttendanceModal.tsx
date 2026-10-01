import React, { useState, useMemo } from 'react';
import type { Language } from '../../types';
import { CalendarDays, CheckCircle2, XCircle, AlertCircle, Check, Undo2, Info, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Badge } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { CloseButton } from '@/components/base/buttons/close-button';
import { useBreakpoint } from '@/hooks/use-breakpoint';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const QuranAttendanceModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  const isDesktop = useBreakpoint('sm');
  const { quranPages, attendanceExceptions, markAttendanceException } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'absent' | 'excused'>('overview');

  const stats = useMemo(() => {
    let firstActivationTime = Infinity;
    const activeDates = new Set<string>();

    (quranPages || []).forEach(p => {
      if (p && p.activatedAt) {
        const t = new Date(p.activatedAt).getTime();
        if (t < firstActivationTime) firstActivationTime = t;
        activeDates.add(new Date(p.activatedAt).toISOString().split('T')[0]);
      }
      if (p && Array.isArray(p.reviewLogs)) {
        p.reviewLogs.forEach(log => {
          if (log && log.date) {
            activeDates.add(new Date(log.date).toISOString().split('T')[0]);
          }
        });
      }
    });

    if (firstActivationTime === Infinity) {
      return { totalDays: 0, present: 0, absent: 0, excused: 0, absentDays: [], excusedDays: [] };
    }

    const startDate = new Date(firstActivationTime);
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let present = 0;
    let absent = 0;
    let excused = 0;
    const absentDays: { date: string; isToday: boolean }[] = [];
    const excusedDays: { date: string; status: 'izin' | 'sakit'; isToday: boolean }[] = [];

    const current = new Date(startDate);
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      const isToday = current.getTime() === today.getTime();

      if (activeDates.has(dateStr)) {
        present++;
      } else {
        const exception = attendanceExceptions?.[dateStr];
        if (exception === 'izin' || exception === 'sakit') {
          excused++;
          excusedDays.push({ date: dateStr, status: exception, isToday });
        } else {
          absent++;
          absentDays.push({ date: dateStr, isToday });
        }
      }

      current.setDate(current.getDate() + 1);
    }

    return { 
      totalDays: present + absent + excused, 
      present, 
      absent, 
      excused, 
      absentDays: absentDays.reverse(), 
      excusedDays: excusedDays.reverse() 
    };
  }, [quranPages, attendanceExceptions]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const attendanceRate = stats.totalDays > 0 ? Math.round((stats.present / stats.totalDays) * 100) : 0;
  const tabs = [
    {
      id: 'overview' as const,
      label: language === 'en' ? 'Present' : 'Hadir',
      value: stats.present,
      hint: language === 'en' ? 'Recorded' : 'Tercatat',
      icon: CheckCircle2,
      activeClass: 'border-emerald-300 bg-emerald-50 text-emerald-700 ring-emerald-500/15',
      iconClass: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'absent' as const,
      label: language === 'en' ? 'Absent' : 'Alpa',
      value: stats.absent,
      hint: language === 'en' ? 'Needs review' : 'Perlu ditinjau',
      icon: XCircle,
      activeClass: 'border-error_subtle bg-error-primary text-error-primary ring-error/15',
      iconClass: 'bg-error-primary text-error-primary',
    },
    {
      id: 'excused' as const,
      label: language === 'en' ? 'Excused' : 'Berhalangan',
      value: stats.excused,
      hint: language === 'en' ? 'Confirmed' : 'Dikonfirmasi',
      icon: AlertCircle,
      activeClass: 'border-warning/30 bg-warning/10 text-warning ring-warning/15',
      iconClass: 'bg-warning/15 text-warning',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label={language === 'en' ? 'Close attendance history' : 'Tutup riwayat kehadiran'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-history-title"
            initial={isDesktop ? { opacity: 0, y: 24, scale: 0.98 } : { y: '100%' }}
            animate={isDesktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, y: 24, scale: 0.98 } : { y: '100%' }}
            transition={isDesktop ? { duration: 0.2 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-secondary bg-primary shadow-2xl sm:rounded-3xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-secondary px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
                  <CalendarDays className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 id="attendance-history-title" className="truncate text-lg font-semibold tracking-tight text-primary">
                      {language === 'en' ? 'Attendance History' : 'Riwayat Kehadiran'}
                    </h3>
                    <Badge color="success" size="sm" className="hidden sm:flex">{attendanceRate}%</Badge>
                  </div>
                  <p className="truncate text-xs text-secondary sm:text-sm">
                    {language === 'en' ? `${stats.totalDays} learning days recorded` : `${stats.totalDays} hari belajar tercatat`}
                  </p>
                </div>
              </div>
              <CloseButton slot={null} size="md" onPress={onClose} label="Close attendance history" />
            </header>

            <div className="shrink-0 border-b border-secondary bg-secondary/30 p-3 sm:p-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {tabs.map(({ id, label, value, hint, icon: Icon, activeClass, iconClass }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={activeTab === id}
                    onClick={() => setActiveTab(id)}
                    className={`rounded-2xl border p-2 text-left ring-2 ring-transparent transition-all sm:p-3 ${activeTab === id ? activeClass : 'border-secondary bg-primary text-secondary hover:bg-primary_hover'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={`flex size-9 items-center justify-center rounded-xl ${iconClass}`}>
                        <Icon className="size-4.5" />
                      </div>
                      <span className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">{value}</span>
                    </div>
                    <p className="mt-3 truncate text-xs font-semibold sm:text-sm">{label}</p>
                    <p className="mt-0.5 hidden truncate text-xs opacity-70 sm:block">{hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <section className="rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                        <TrendingUp className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-primary">{language === 'en' ? 'Attendance rate' : 'Tingkat kehadiran'}</p>
                            <p className="mt-0.5 text-xs text-secondary">{language === 'en' ? 'Based on your recorded learning days' : 'Berdasarkan hari belajar yang tercatat'}</p>
                          </div>
                          <p className="text-2xl font-semibold tracking-tight text-brand-700">{attendanceRate}%</p>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-100">
                          <div className="h-full rounded-full bg-brand-solid" style={{ width: `${attendanceRate}%` }} />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-secondary bg-secondary/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-secondary bg-primary text-fg-quaternary">
                        <Info className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {language === 'en' ? 'How attendance is recorded' : 'Cara kehadiran dicatat'}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-secondary">
                          {language === 'en'
                            ? 'A day is marked present when you add memorization or complete a scheduled review. Days without activity are marked absent and can be updated to sick or permitted.'
                            : 'Hari ditandai hadir ketika kamu menambah hafalan atau menyelesaikan murajaah. Hari tanpa aktivitas ditandai alpa dan dapat diperbarui menjadi sakit atau izin.'}
                        </p>
                      </div>
                    </div>
                  </section>

                  {stats.absent > 0 && (
                    <section className="flex flex-col gap-3 rounded-2xl border border-error_subtle bg-error-primary p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-error-primary text-error-primary ring-1 ring-error_subtle ring-inset">
                          <XCircle className="size-4.5" />
                        </div>
                        <p className="text-sm font-medium text-error-primary">
                          {language === 'en' ? `${stats.absent} days need confirmation.` : `${stats.absent} hari alpa perlu dikonfirmasi.`}
                        </p>
                      </div>
                      <Button size="sm" color="secondary-destructive" onPress={() => setActiveTab('absent')} className="w-full sm:w-auto">
                        {language === 'en' ? 'Review days' : 'Tinjau hari'}
                      </Button>
                    </section>
                  )}
                </div>
              )}

              {activeTab === 'absent' && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3 px-1">
                    <div>
                      <h4 className="text-sm font-semibold text-primary">{language === 'en' ? 'Unexcused absences' : 'Alpa tanpa keterangan'}</h4>
                      <p className="text-xs text-secondary">{language === 'en' ? 'Confirm each day as sick or permitted.' : 'Konfirmasi setiap hari sebagai sakit atau izin.'}</p>
                    </div>
                    <Badge color="error" size="sm">{stats.absentDays.length} {language === 'en' ? 'days' : 'hari'}</Badge>
                  </div>

                  {stats.absentDays.length === 0 ? (
                    <div className="rounded-2xl border border-secondary bg-secondary/30 px-5 py-10 text-center">
                      <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
                        <Check className="size-5" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-primary">{language === 'en' ? 'No unexcused absences' : 'Tidak ada alpa tanpa keterangan'}</p>
                      <p className="mt-1 text-xs text-secondary">{language === 'en' ? 'All recorded days are accounted for.' : 'Semua hari yang tercatat sudah memiliki status.'}</p>
                    </div>
                  ) : (
                    stats.absentDays.map((item) => (
                      <article key={item.date} className="flex flex-col gap-3 rounded-2xl border border-secondary bg-primary p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-error-primary text-error-primary">
                            <CalendarDays className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-primary">{formatDate(item.date)}</p>
                            <p className="mt-0.5 text-xs text-secondary">{language === 'en' ? 'No learning activity recorded' : 'Tidak ada aktivitas belajar tercatat'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex">
                          <Button size="sm" color="secondary" onPress={() => markAttendanceException(item.date, 'sakit')}>
                            {language === 'en' ? 'Sick' : 'Sakit'}
                          </Button>
                          <Button size="sm" onPress={() => markAttendanceException(item.date, 'izin')}>
                            {language === 'en' ? 'Permit' : 'Izin'}
                          </Button>
                        </div>
                      </article>
                    ))
                  )}
                </section>
              )}

              {activeTab === 'excused' && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3 px-1">
                    <div>
                      <h4 className="text-sm font-semibold text-primary">{language === 'en' ? 'Excused records' : 'Riwayat berhalangan'}</h4>
                      <p className="text-xs text-secondary">{language === 'en' ? 'Confirmed sick and permitted days.' : 'Hari sakit dan izin yang telah dikonfirmasi.'}</p>
                    </div>
                    <Badge color="warning" size="sm">{stats.excusedDays.length} {language === 'en' ? 'days' : 'hari'}</Badge>
                  </div>

                  {stats.excusedDays.length === 0 ? (
                    <div className="rounded-2xl border border-secondary bg-secondary/30 px-5 py-10 text-center">
                      <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
                        <AlertCircle className="size-5" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-primary">{language === 'en' ? 'No excused records' : 'Belum ada riwayat berhalangan'}</p>
                      <p className="mt-1 text-xs text-secondary">{language === 'en' ? 'Sick and permitted days will appear here.' : 'Hari sakit dan izin akan tampil di sini.'}</p>
                    </div>
                  ) : (
                    stats.excusedDays.map((item) => (
                      <article key={item.date} className="flex items-center justify-between gap-3 rounded-2xl border border-secondary bg-primary p-3 shadow-xs">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
                            <CalendarDays className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-primary">{formatDate(item.date)}</p>
                            <Badge color={item.status === 'sakit' ? 'warning' : 'blue'} size="sm" className="mt-1">
                              {item.status === 'sakit' ? (language === 'en' ? 'Sick' : 'Sakit') : (language === 'en' ? 'Permit' : 'Izin')}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          color="secondary-destructive"
                          iconLeading={Undo2}
                          onPress={() => markAttendanceException(item.date, null)}
                        >
                          <span className="hidden sm:inline">{language === 'en' ? 'Revert' : 'Batalkan'}</span>
                        </Button>
                      </article>
                    ))
                  )}
                </section>
              )}
            </div>

            <footer className="flex shrink-0 justify-end border-t border-secondary bg-primary px-4 py-3 sm:px-5">
              <Button color="secondary" size="md" onPress={onClose}>{language === 'en' ? 'Close' : 'Tutup'}</Button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
