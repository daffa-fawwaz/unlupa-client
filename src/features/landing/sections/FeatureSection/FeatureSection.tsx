import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Moon,
  Layers,
  Users,
  User,
  Library,
  Heart,
  CalendarClock,
  Gauge,
  LayoutDashboard,
  Star,
} from "lucide-react";
import { useRef } from "react";

export const FeatureSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: number) => {
    if (sliderRef.current) {
      const firstCard = sliderRef.current.firstElementChild as HTMLElement;
      if (firstCard) {
        const slideWidth = firstCard.clientWidth + 32; // card width + gap
        sliderRef.current.scrollBy({
          left: direction * slideWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section
      id="fitur"
      className="relative w-full max-w-[1400px] px-6 md:px-12 py-32 z-10 flex flex-col h-full justify-center mx-auto"
    >
      {/* HEADER */}
      <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <div className="text-amber-500 font-cinzel text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
            <Cpu className="w-4 h-4 neon-icon" />
            Core System
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-3 leading-tight tracking-wide">
            Fitur Inti{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-amber-600 drop-shadow-lg">
              UNLUPA
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light">
            Dirancang untuk menjaga ilmu, <br className="hidden md:block" />{" "}
            <span className="text-amber-500/80 italic font-serif">
              bukan sekadar mempelajarinya.
            </span>
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => scrollSlider(-1)}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 cursor-pointer group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:text-amber-400" />
          </button>
          <button
            onClick={() => scrollSlider(1)}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 cursor-pointer group"
          >
            <ChevronRight className="w-6 h-6 group-hover:text-amber-400" />
          </button>
        </div>
      </div>

      {/* FEATURES SLIDER */}
      <div
        ref={sliderRef}
        id="fitur-slider"
        className="flex overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-hide gap-8 pt-8 pb-12 px-2 items-stretch"
      >
        {/* 1. Ruang Menghafal Al-Qur’an (Emerald) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card emerald rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-emerald-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <Moon className="w-8 h-8 text-emerald-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-emerald-300 transition-colors drop-shadow-md">
              Ruang Menghafal <br />
              Al-Qur’an
            </h3>
            <div className="w-12 h-1 bg-emerald-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Ruang khusus dengan sistem yang tidak disamakan dengan materi
              lain, menghormati adab dan metode hifz.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-emerald-500/70 uppercase tracking-widest">
              Sacred Space
            </div>
            <span className="text-5xl font-serif text-emerald-500/40 font-bold group-hover:text-emerald-500 transition-colors drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              01
            </span>
          </div>
        </div>

        {/* 2. 4 Fase Hafalan (Amber) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card amber rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-amber-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <Layers className="w-8 h-8 text-amber-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-amber-300 transition-colors drop-shadow-md">
              5 Fase Hafalan <br />
              Terstruktur
            </h3>
            <div className="w-12 h-1 bg-amber-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Dari awal menghafal hingga fase graduation dan penjagaan jangka
              panjang yang terstruktur.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest">
              Methodology
            </div>
            <span className="text-5xl font-serif text-amber-500/40 font-bold group-hover:text-amber-500 transition-colors drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              02
            </span>
          </div>
        </div>

        {/* 3. Ruang Kelas (Blue) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card blue rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-blue-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <Users className="w-8 h-8 text-blue-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-blue-300 transition-colors drop-shadow-md">
              Ruang Kelas <br />
              Terintegrasi
            </h3>
            <div className="w-12 h-1 bg-blue-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Mengikuti materi dari guru dengan sistem pengulangan terjaga,
              terintegrasi langsung dengan kurikulum.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-blue-500/70 uppercase tracking-widest">
              Academic
            </div>
            <span className="text-5xl font-serif text-blue-500/40 font-bold group-hover:text-blue-500 transition-colors drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              03
            </span>
          </div>
        </div>

        {/* 4. Ruang Personal (Purple) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card purple rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-purple-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <User className="w-8 h-8 text-purple-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors drop-shadow-md">
              Ruang Personal <br />
              Custom
            </h3>
            <div className="w-12 h-1 bg-purple-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Membuat dan menjaga materi pribadi untuk jangka panjang sesuai
              kebutuhan spesifik Anda.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-purple-500/70 uppercase tracking-widest">
              Private
            </div>
            <span className="text-5xl font-serif text-purple-500/40 font-bold group-hover:text-purple-500 transition-colors drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              04
            </span>
          </div>
        </div>

        {/* 5. Library Kitab (Indigo) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card indigo rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-indigo-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <Library className="w-8 h-8 text-indigo-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-indigo-300 transition-colors drop-shadow-md">
              Library Kitab <br />
              Digital
            </h3>
            <div className="w-12 h-1 bg-indigo-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Kumpulan kitab dan materi siap pakai yang telah dikurasi untuk
              kemudahan akses tanpa batas.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-indigo-500/70 uppercase tracking-widest">
              Resources
            </div>
            <span className="text-5xl font-serif text-indigo-500/40 font-bold group-hover:text-indigo-500 transition-colors drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              05
            </span>
          </div>
        </div>

        {/* 6. Share Kitab (Red) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card red rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-red-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <Heart className="w-8 h-8 text-red-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-red-300 transition-colors drop-shadow-md">
              Share Kitab <br />
              (Amal Jariyah)
            </h3>
            <div className="w-12 h-1 bg-red-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Bagikan materi untuk kebermanfaatan bersama, menjadikan ilmu
              sebagai aliran pahala yang terus mengalir.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-red-500/70 uppercase tracking-widest">
              Contribution
            </div>
            <span className="text-5xl font-serif text-red-500/40 font-bold group-hover:text-red-500 transition-colors drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              06
            </span>
          </div>
        </div>

        {/* 7. Daily Review (Orange) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card orange rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-orange-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <CalendarClock className="w-8 h-8 text-orange-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-orange-300 transition-colors drop-shadow-md">
              Daily Review <br />
              Otomatis
            </h3>
            <div className="w-12 h-1 bg-orange-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Setiap hari, UNLUPA menentukan apa yang perlu ditinjau, menghapus
              kebingungan "belajar apa hari ini".{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-orange-500/70 uppercase tracking-widest">
              Automation
            </div>
            <span className="text-5xl font-serif text-orange-500/40 font-bold group-hover:text-orange-500 transition-colors drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
              07
            </span>
          </div>
        </div>

        {/* 8. Load Control (Teal) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card teal rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-teal-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <Gauge className="w-8 h-8 text-teal-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-teal-300 transition-colors drop-shadow-md">
              Load Control <br />
              System
            </h3>
            <div className="w-12 h-1 bg-teal-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Sistem cerdas yang menjaga agar beban belajar tetap manusiawi,
              konsisten, dan tidak membebani.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-teal-500/70 uppercase tracking-widest">
              Balance
            </div>
            <span className="text-5xl font-serif text-teal-500/40 font-bold group-hover:text-teal-500 transition-colors drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">
              08
            </span>
          </div>
        </div>

        {/* 9. Dashboard Guru (Sky) */}
        <div className="min-w-[320px] md:min-w-[380px] h-[520px] snap-center monolith-card sky rounded-[32px] p-10 flex flex-col group cursor-default justify-between">
          <div className="card-nebula bg-sky-500"></div>
          <div className="mb-auto relative z-10">
            <div className="icon-orb mb-8">
              {" "}
              <LayoutDashboard className="w-8 h-8 text-sky-400 neon-icon" />{" "}
            </div>
            <h3 className="text-3xl font-serif text-white mb-4 leading-tight group-hover:text-sky-300 transition-colors drop-shadow-md">
              Dashboard Guru <br />
              Real-time
            </h3>
            <div className="w-12 h-1 bg-sky-500/50 rounded-full mb-6 group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              {" "}
              Memantau perkembangan siswa secara real-time, untuk membimbing
              bukan sekadar menekan.{" "}
            </p>
          </div>
          <div className="pt-6 flex justify-between items-end border-t border-white/5 mt-4 relative z-10">
            <div className="text-[10px] font-mono text-sky-500/70 uppercase tracking-widest">
              Monitoring
            </div>
            <span className="text-5xl font-serif text-sky-500/40 font-bold group-hover:text-sky-500 transition-colors drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]">
              09
            </span>
          </div>
        </div>

        {/* 10. FITUR PEMBEDA (THE GOLD CORE) */}
        <div className="min-w-[320px] md:min-w-[420px] h-[520px] snap-center monolith-card gold rounded-[32px] p-8 md:p-10 flex flex-col relative group cursor-default justify-between">
          <div className="card-nebula bg-amber-500 opacity-20 group-hover:opacity-60 transition-opacity"></div>

          {/* Content Top */}
          <div className="relative z-10">
            <div className="icon-orb mb-6 md:mb-8">
              <Star className="w-10 h-10 text-amber-500 fill-amber-500/20 neon-icon" />
            </div>
            <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
              4 Tombol Feedback <br />{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-amber-600 drop-shadow-lg">
                Kejujuran
              </span>
            </h3>
            <div className="w-16 h-1 bg-amber-500 rounded-full mb-6 shadow-[0_0_20px_rgba(251,191,36,0.8)]"></div>
            <div className="pl-4 border-l-2 border-amber-500/30">
              <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed">
                Inti sistem UNLUPA. Parameter akurat untuk menentukan waktu
                ulang yang tepat, bukan sekadar tebakan.
              </p>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-6 flex justify-between items-end border-t border-amber-500/20 mt-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase shadow-black drop-shadow-md whitespace-nowrap">
                Core Engine Active
              </span>
            </div>
            {/* Angka 10 adjustment */}
            <span className="text-5xl font-serif text-amber-500/40 font-bold group-hover:text-amber-500 transition-colors drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] leading-none -mb-2">
              10
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
