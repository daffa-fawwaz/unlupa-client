import { Moon, BookOpen, Users, Shield } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";

export const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const phaseStyle: Record<string, { bg: string; text: string }> = {
    success: { bg: "bg-success/10", text: "text-success" },
    info: { bg: "bg-info/10", text: "text-info" },
    warning: { bg: "bg-warning/10", text: "text-warning" },
    primary: { bg: "bg-primary/10", text: "text-primary" },
  };

  const slides = [
    {
      badge: "Mengapa UNLUPA",
      titleLines: ["Lupa Bukan Takdir.", "Lupa Adalah Pilihan Sistem."],
      description: "UNLUPA hadir untuk mengubah cara Anda menjaga ilmu. Dari hafalan Al-Qur'an hingga materi pembelajaran sehari-hari — sistem kami dirancang agar ilmu Anda terjaga, tidak hanya dipelajari lalu dilupakan.",
      cta: { text: "Mulai Menjaga Ilmu", href: "/register", secondaryText: "Masuk", secondaryHref: "/login" },
      illustration: (
        <div className="relative w-full h-full max-w-xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-[1.15fr_1fr]">
              <div className="p-5 md:p-6 space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Moon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm md:text-[0.95rem]">Ruang Hafalan Al-Qur'an</p>
                    <p className="text-xs text-muted-foreground">Sistem 5 fase terstruktur dengan penjagaan jangka panjang</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm md:text-[0.95rem]">Ruang Kelas Terintegrasi</p>
                    <p className="text-xs text-muted-foreground">Mengikuti kurikulum guru dengan sistem pengulangan terjaga</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm md:text-[0.95rem]">Ruang Personal Custom</p>
                    <p className="text-xs text-muted-foreground">Materi pribadi untuk jangka panjang sesuai kebutuhan Anda</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm md:text-[0.95rem]">Daily Review Otomatis</p>
                    <p className="text-xs text-muted-foreground">Sistem cerdas menentukan apa yang perlu ditinjau hari ini</p>
                  </div>
                </div>
              </div>
              <div className="p-5 md:p-6 bg-primary/5 border-t md:border-t-0 md:border-l border-primary/10 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground">4 Tombol Feedback Kejujuran</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Inti sistem UNLUPA. Parameter akurat untuk menentukan waktu ulang yang tepat, bukan sekadar tebakan. Kejujuran dalam menilai kemampuan sendiri adalah kunci penjagaan ilmu yang berkelanjutan.</p>
                <div className="mt-auto pt-5 flex items-center gap-1.5">
                  <span className="h-1.5 flex-1 rounded-full bg-success/60" />
                  <span className="h-1.5 flex-1 rounded-full bg-info/60" />
                  <span className="h-1.5 flex-1 rounded-full bg-warning/60" />
                  <span className="h-1.5 flex-1 rounded-full bg-primary/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: "Metodologi Terbukti",
      titleLines: ["Metode 5 Fase Hafalan", "Yang Terstruktur & Terbukti."],
      description: "Dari awal menghafal hingga graduation dan penjagaan jangka panjang. Setiap fase dirancang dengan metodologi yang menghormati cara kerja otak dan adab menghafal Al-Qur'an.",
      cta: { text: "Pelajari Metodenya", href: "#metode", secondaryText: "Lihat Fitur", secondaryHref: "#fitur" },
      illustration: (
        <div className="relative w-full h-full max-w-xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="space-y-4">
              {[
                { phase: "01", title: "Fase Menghafal", desc: "Menghafal ayat baru dengan metode talaqqi dan tasmik", resolvedColor: "success" },
                { phase: "02", title: "Fase Muraja'ah", desc: "Mengulang hafalan harian untuk menguatkan memori jangka pendek", resolvedColor: "info" },
                { phase: "03", title: "Fase Interval", desc: "Pengulangan dengan jarak waktu yang meningkat (spaced repetition)", resolvedColor: "warning" },
                { phase: "04", title: "Fase FSRS", desc: "Algoritma Free Spaced Repetition Scheduler untuk jangka panjang", resolvedColor: "warning" },
                { phase: "05", title: "Fase Graduation", desc: "Hafalan lolos ujian dan masuk fase penjagaan jangka panjang", resolvedColor: "primary" },
              ].map((item) => (
                <div key={item.phase} className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-xl group hover:border-primary/20 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${phaseStyle[item.resolvedColor].bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`font-mono ${phaseStyle[item.resolvedColor].text} font-bold`}>{item.phase}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: "Sistem Cerdas",
      titleLines: [
        "Daily Review Otomatis.",
        "Tidak Perlu Pusing Memikirkan Apa Yang Harus Diulang.",
      ],
      description: "UNLUPA menentukan secara otomatis apa yang perlu ditinjau hari ini. Algoritma FSRS dan Interval bekerja di latar belakang untuk mengoptimalkan jadwal pengulangan Anda.",
      cta: { text: "Coba Sistem Review", href: "/register", secondaryText: "Masuk", secondaryHref: "/login" },
      illustration: (
        <div className="relative w-full h-full max-w-xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-7 pt-7">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-3 py-1 text-xs font-medium text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Otomatis
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 mt-6 border-t border-border">
              <div className="px-4 py-6 text-center border-b sm:border-b-0 sm:border-r border-border">
                <p className="text-4xl font-bold font-serif text-primary leading-none">24</p>
                <p className="text-sm font-medium text-foreground mt-2">Review Hari Ini</p>
                <p className="text-xs text-muted-foreground mt-1">Item Perlu Ditinjau</p>
              </div>
              <div className="px-4 py-6 text-center border-b sm:border-b-0 sm:border-r border-border">
                <p className="text-4xl font-bold font-serif text-success leading-none">18</p>
                <p className="text-sm font-medium text-foreground mt-2">Selesai Hari Ini</p>
                <p className="text-xs text-muted-foreground mt-1">Item Telah Diselesaikan</p>
              </div>
              <div className="px-4 py-6 text-center">
                <p className="text-4xl font-bold font-serif text-accent leading-none">± 32</p>
                <p className="text-sm font-medium text-foreground mt-2">Estimasi Waktu</p>
                <p className="text-xs text-muted-foreground mt-1">Menit Fokus Hari Ini</p>
              </div>
            </div>
            <div className="px-7 py-4 border-t border-border bg-muted/30 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <p className="text-xs text-muted-foreground">FSRS &amp; Interval — jadwal ulang dihitung untuk Anda setiap hari</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => setActiveIndex((prev) => (prev + 1) % slides.length), 8000);
    return () => clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];

  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Hero Content */}
      <section className="relative min-h-screen flex flex-col pt-24 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex-1 flex flex-col w-full">
          {/* Hero Header */}
          <div className="mb-16 md:mb-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">Platform Penjagaan Ilmu</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-8 max-w-4xl mx-auto">
              Lupa Bukan Takdir.<br /><span className="text-primary">Lupa Adalah Pilihan Sistem.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              UNLUPA hadir untuk mengubah cara Anda menjaga ilmu. Dari hafalan Al-Qur&#39;an hingga materi pembelajaran sehari-hari — sistem kami dirancang agar ilmu Anda terjaga, tidak hanya dipelajari lalu dilupakan.
            </p>
          </div>

          {/* Hero Slider - single active slide, no horizontal scroll */}
          <div className="relative flex-1 flex flex-col items-center w-full">
            <div className="relative w-full max-w-5xl mx-auto min-h-[500px] md:min-h-[600px] flex items-center justify-center">
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Text Content */}
                <div className="min-w-0 w-full max-w-xl text-center lg:text-left order-2 lg:order-1 mx-auto lg:mx-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest text-primary">{activeSlide.badge}</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
                    {activeSlide.titleLines.map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < activeSlide.titleLines.length - 1 && <br />}
                      </span>
                    ))}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                    {activeSlide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    {activeSlide.cta.href.startsWith("#") ? (
                      <button onClick={() => handleNav(activeSlide.cta.href)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
                        {activeSlide.cta.text}
                      </button>
                    ) : (
                      <Link to={activeSlide.cta.href} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
                        {activeSlide.cta.text}
                      </Link>
                    )}
                    {activeSlide.cta.secondaryHref.startsWith("#") ? (
                      <button onClick={() => handleNav(activeSlide.cta.secondaryHref)} className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors w-full sm:w-auto">
                        {activeSlide.cta.secondaryText}
                      </button>
                    ) : (
                      <Link to={activeSlide.cta.secondaryHref} className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors w-full sm:w-auto">
                        {activeSlide.cta.secondaryText}
                      </Link>
                    )}
                  </div>
                </div>
                {/* Illustration */}
                <div className="min-w-0 w-full flex items-center justify-center order-1 lg:order-2 relative z-10">
                  {activeSlide.illustration}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setActiveIndex((p) => (p - 1 + slides.length) % slides.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hidden lg:flex"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((p) => (p + 1) % slides.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hidden lg:flex"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
