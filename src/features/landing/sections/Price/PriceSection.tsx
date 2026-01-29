import { useState, useRef } from "react";
import {
  Unlock,
  HeartHandshake,
  Leaf,
  Droplet,
  Gift,
  Edit3,
  ShieldCheck,
} from "lucide-react";
import { ShardCard } from "./components/ShardCard";

export const PriceSection = () => {
  const [customAmount, setCustomAmount] = useState("");
  const customCardRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const fillAmount = (amount: string) => {
    setCustomAmount(amount);

    // Focus and visual feedback
    if (customInputRef.current) customInputRef.current.focus();

    if (customCardRef.current) {
      const card = customCardRef.current;
      card.classList.add("border-amber-500");
      card.style.backgroundColor = "rgba(245, 158, 11, 0.05)";

      setTimeout(() => {
        card.classList.remove("border-amber-500");
        card.style.backgroundColor = "transparent"; // Or revert to original style if needed
      }, 300);
    }
  };

  return (
    <div className="flex flex-col">
      <section
        id="biaya"
        className="relative w-full max-w-5xl mx-auto px-6 md:px-12 py-32 z-10"
      >
        {/* 1. HEADER & NARASI UTAMA (REVISED LAYOUT) */}
        <div className="text-center mb-24 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-10 opacity-70">
            <span className="w-px h-8 bg-linear-to-b from-transparent to-amber-500"></span>
            <span className="font-cinzel text-xs text-amber-500 tracking-[0.3em] uppercase">
              Nilai Bersama
            </span>
            <span className="w-px h-8 bg-linear-to-b from-transparent to-amber-500"></span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-white mb-20 leading-tight">
            Kontribusi untuk <br />{" "}
            <span className="text-amber-500 italic">
              Kebermanfaatan & Keberlanjutan
            </span>
          </h2>

          <div className="max-w-3xl mx-auto relative">
            {/* Quote Mark Background */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] text-white/5 font-serif leading-none select-none pointer-events-none">
              “
            </div>

            {/* Kalimat 1: Manifesto */}
            <div className="mb-16 relative z-10">
              <p className="text-xl md:text-3xl text-white font-serif font-light leading-relaxed tracking-wide">
                <strong className="font-bold text-amber-100">UNLUPA</strong>{" "}
                dibangun agar bisa dimanfaatkan oleh siapa pun yang ingin
                menjaga ilmunya.
              </p>
            </div>

            {/* Kalimat 2: Inklusivitas */}
            <div className="bg-linear-to-b from-white/5 to-transparent p-1 rounded-2xl">
              <div className="bg-[#050505] rounded-xl p-8 md:p-10 border border-white/10 shadow-2xl">
                <p className="text-gray-400 font-light text-base md:text-lg leading-loose text-center">
                  Kami tidak ingin harga menjadi penghalang bagi{" "}
                  <span className="text-white font-medium border-b border-white/20 pb-0.5">
                    pelajar
                  </span>
                  ,{" "}
                  <span className="text-white font-medium border-b border-white/20 pb-0.5">
                    penghafal Al-Qur’an
                  </span>
                  , atau siapa pun yang sungguh-sungguh ingin belajar dan
                  mempertahankan hafalannya.
                </p>
              </div>
            </div>

            {/* Kalimat 3: Tanggung Jawab */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-4 text-center">
                <span className="w-12 h-px bg-amber-500/50"></span>
                <p className="text-amber-100/80 italic font-serif text-lg md:text-xl">
                  "Namun, agar sistem ini dapat terus berjalan, berkembang, dan
                  memberi manfaat jangka panjang, keberlanjutan perlu dijaga
                  bersama."
                </p>
                <span className="w-12 h-px bg-amber-500/50"></span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MEKANISME (Phase Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 animate-fade-in-up delay-100">
          {/* Phase 1 */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-gray-500 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">
                Fase 01
              </span>
              <h3 className="font-serif text-2xl text-white mb-4">
                Bulan Pertama <br />
                <span className="text-gray-400 text-lg italic">
                  Bebas untuk Mengenal
                </span>
              </h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Bulan pertama dapat digunakan tanpa kewajiban kontribusi. Kami
                ingin Anda benar-benar merasakan bagaimana UNLUPA membantu
                menjaga ilmu dengan lebih tenang dan terarah.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 font-mono">
              <Unlock className="w-3 h-3" /> Open Access
            </div>
          </div>

          {/* Phase 2 */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-amber-500 flex flex-col justify-between bg-linear-to-br from-amber-900/10 to-transparent">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 mb-2 block">
                Fase 02
              </span>
              <h3 className="font-serif text-2xl text-white mb-4">
                Mulai Bulan Kedua <br />
                <span className="text-amber-400 text-lg italic">
                  Kontribusi Wajib, Nominal Bebas
                </span>
              </h3>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                Setiap pengguna wajib berkontribusi untuk menjaga keberlanjutan
                sistem. Namun, besar kontribusi tidak ditentukan. Anda bebas
                menentukan nominal sesuai kemampuan dan nilai yang Anda rasakan
                dari UNLUPA.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-amber-500 font-mono">
              <HeartHandshake className="w-3 h-3" /> Shared Responsibility
            </div>
          </div>
        </div>

        {/* 3. PRESET KONTRIBUSI */}
        <div className="mb-24 animate-fade-in-up delay-200">
          <div className="text-center mb-12">
            <h3 className="font-cinzel text-xl text-white mb-3">
              Pilih Kontribusi Anda
            </h3>
            <p className="text-gray-400 text-sm font-light">
              Tidak ada nominal yang benar atau salah. Pilihlah sesuai
              kemampuan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ringan (Green) */}
            <ShardCard
              color="green"
              icon={Leaf}
              label="Pelajar"
              title="Jumlah Ringan"
              description="Untuk pelajar atau pengguna dengan kondisi keuangan terbatas. Cocok jika Anda ingin tetap berkontribusi meski nominal kecil."
              placeholder="Rp 25.000 (Contoh)"
              onClick={() => fillAmount("25.000")}
            />

            {/* Sedang (Blue) */}
            <ShardCard
              color="blue"
              icon={Droplet}
              label="Rutin"
              title="Jumlah Sedang"
              description="Untuk pengguna rutin yang merasakan manfaat UNLUPA dalam menjaga pembelajaran sehari-hari."
              placeholder="Rp 50.000 (Contoh)"
              onClick={() => fillAmount("50.000")}
            />

            {/* Lebih (Purple) */}
            <ShardCard
              color="purple"
              icon={Gift}
              label="Support"
              title="Jumlah Lebih"
              description="Untuk Anda yang ingin mendukung keberlanjutan UNLUPA lebih jauh, agar semakin banyak orang merasakan manfaatnya."
              placeholder="Rp 100.000 (Contoh)"
              onClick={() => fillAmount("100.000")}
            />
          </div>

          {/* Custom (Gold) */}
          <div
            className="mt-6 shard-card shard-gold flex flex-col md:flex-row items-center gap-6 md:gap-10 transition-all duration-300"
            id="custom-card"
            ref={customCardRef}
          >
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-400">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg text-white">
                  Atau Tentukan Sendiri
                </h4>
                <p className="text-xs text-gray-400">
                  Anda juga dapat mengisi nominal sendiri sesuai kemampuan.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <span className="absolute left-0 top-3 text-amber-500/50 font-mono text-lg">
                Rp
              </span>
              <input
                type="text"
                id="custom-amount"
                ref={customInputRef}
                className="clean-input text-lg text-amber-400 text-left pl-8"
                placeholder=""
                style={{ "--text-color": "#fbbf24" } as React.CSSProperties}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <p className="text-[10px] text-amber-500/50 mt-2 italic text-right">
                "Semua kontribusi dihargai. Tidak ada perbandingan. Tidak ada
                penilaian."
              </p>
            </div>
          </div>
        </div>

        {/* 4. PENEGASAN MORAL & PENUTUP */}
        <div className="text-center animate-fade-in-up delay-300 max-w-3xl mx-auto">
          <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden border border-white/10">
            {/* Background Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full"></div>

            <div className="relative z-10">
              <ShieldCheck className="w-8 h-8 text-amber-500 mx-auto mb-6 opacity-80" />

              <p className="font-serif text-xl md:text-2xl text-white italic mb-4 leading-relaxed">
                "Kami percaya, siapa pun yang ingin ilmunya terjaga, <br /> juga
                ingin ikut menjaga sistem yang membantunya."
              </p>

              <p className="text-sm text-gray-400 font-light mb-10">
                Setiap kontribusi, sekecil apa pun, adalah bagian dari
                keberlanjutan bersama.
              </p>

              <div className="w-16 h-px bg-white/10 mx-auto mb-8"></div>

              <div className="space-y-2">
                <p className="font-cinzel text-amber-500 text-sm tracking-widest uppercase">
                  UNLUPA ingin tumbuh bersama Anda
                </p>
                <p className="font-mono text-xs text-gray-500">
                  Dengan Adil. Dengan Tenang. Dengan Kebermanfaatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
