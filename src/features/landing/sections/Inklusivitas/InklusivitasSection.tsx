import {
  BookHeart,
  GraduationCap,
  Presentation,
  Compass,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const InklusivitasSection = () => {
  return (
    <section
      id="untuk-siapa"
      className="relative w-full max-w-6xl px-6 md:px-12 py-32 z-10 mx-auto"
    >
      {/* Connector */}
      <div className="connector-vertical"></div>

      {/* HEADER */}
      <div className="text-center mb-24">
        <p className="font-mono text-amber-500 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_#fbbf24]"></span>{" "}
          Inklusivitas{" "}
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_#fbbf24]"></span>
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-4 leading-tight tracking-wide drop-shadow-md">
          UNLUPA Dibangun Untuk Mereka <br />
          <span className="text-gray-400 font-light italic">
            Yang Tidak Ingin Ilmunya Hilang
          </span>
        </h2>
        <div className="w-24 h-px bg-linear-to-r from-transparent via-amber-500/80 to-transparent mx-auto mt-8 mb-8 shadow-[0_0_10px_#fbbf24]"></div>
        <p className="text-gray-500 font-light text-sm tracking-wide">
          Apa pun latar belakang belajarnya
        </p>
      </div>

      {/* GRID SECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* 1. Pembelajar Al-Qur'an (Emerald) */}
        <div className="energy-card emerald p-8 rounded-2xl flex items-start gap-6 group cursor-default">
          <div className="icon-box shrink-0 text-emerald-400">
            <BookHeart className="w-7 h-7 icon-glow transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-white mb-2 title-glow transition-all duration-300">
              Pembelajar Al-Qur’an
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-emerald-100/80 transition-colors">
              Yang ingin menjaga hafalan tanpa tekanan berlebih dan tanpa rasa
              putus asa di tengah jalan.
            </p>
          </div>
        </div>

        {/* 2. Pelajar & Mahasiswa (Blue) */}
        <div className="energy-card blue p-8 rounded-2xl flex items-start gap-6 group cursor-default">
          <div className="icon-box shrink-0 text-blue-400">
            <GraduationCap className="w-7 h-7 icon-glow transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-white mb-2 title-glow transition-all duration-300">
              Pelajar & Mahasiswa
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-blue-100/80 transition-colors">
              Yang lelah belajar mati-matian hanya untuk ujian, lalu melupakan
              semuanya begitu saja.
            </p>
          </div>
        </div>

        {/* 3. Guru & Pengajar (Amber) */}
        <div className="energy-card amber p-8 rounded-2xl flex items-start gap-6 group cursor-default">
          <div className="icon-box shrink-0 text-amber-400">
            <Presentation className="w-7 h-7 icon-glow transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-white mb-2 title-glow transition-all duration-300">
              Guru & Pengajar
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-amber-100/80 transition-colors">
              Yang ingin membimbing murid dengan data yang akurat, bukan sekadar
              dengan emosi atau tebakan.
            </p>
          </div>
        </div>

        {/* 4. Pembelajar Mandiri (Purple) */}
        <div className="energy-card purple p-8 rounded-2xl flex items-start gap-6 group cursor-default">
          <div className="icon-box shrink-0 text-purple-400">
            <Compass className="w-7 h-7 icon-glow transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-white mb-2 title-glow transition-all duration-300">
              Pembelajar Mandiri
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-purple-100/80 transition-colors">
              Yang ingin membangun sistem belajar pribadi jangka panjang tanpa
              tergantung institusi.
            </p>
          </div>
        </div>
      </div>

      {/* UNIVERSAL CONCLUSION */}
      <div className="mt-8">
        <div className="energy-card amber p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center text-center md:text-left gap-8 md:gap-12 group cursor-default border-amber-500/20">
          {/* Animated Icon Orb */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="w-full h-full rounded-full border border-amber-500/50 bg-[#050505] flex items-center justify-center relative z-10 group-hover:border-amber-500 group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-9 h-9 text-amber-500 icon-glow transition-colors" />
            </div>
          </div>

          <div className="relative z-10 flex-1">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 drop-shadow-md">
              Dan Siapa Pun...
            </h3>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed group-hover:text-white transition-colors">
              Yang percaya bahwa ilmu adalah{" "}
              <span className="text-amber-400 font-bold border-b border-amber-500/30 pb-0.5 text-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                amanah
              </span>{" "}
              yang harus dijaga, bukan sekadar target yang harus dikejar.
            </p>
          </div>

          <div className="md:ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
            <ArrowRight className="w-8 h-8 text-amber-500 icon-glow" />
          </div>
        </div>
      </div>
    </section>
  );
};
