import { useState, useRef } from "react";
import { Unlock, HeartHandshake, Leaf, Droplet, Gift, Edit3, ShieldCheck } from "lucide-react";

export const PriceSection = () => {
  const [customAmount, setCustomAmount] = useState("");
  const customCardRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const fillAmount = (amount: string) => {
    setCustomAmount(amount);
    if (customInputRef.current) customInputRef.current.focus();
    if (customCardRef.current) {
      const card = customCardRef.current;
      card.classList.add("border-primary");
      setTimeout(() => card.classList.remove("border-primary"), 300);
    }
  };

  return (
    <div className="flex flex-col">
      <section id="biaya" className="relative w-full max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* 1. HEADER & NARASI UTAMA */}
        <div className="text-center mb-20 md:mb-24">
          <div className="inline-flex items-center gap-3 mb-10">
            <span className="w-px h-8 bg-gradient-to-b from-transparent to-primary"></span>
            <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">Nilai Bersama</span>
            <span className="w-px h-8 bg-gradient-to-b from-transparent to-primary"></span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-16 leading-tight tracking-tight">
            Kontribusi untuk <br /> <span className="text-primary italic">Kebermanfaatan &amp; Keberlanjutan</span>
          </h2>

          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] text-muted-foreground/5 font-serif leading-none select-none pointer-events-none">“</div>
            <div className="mb-12 relative z-10">
              <p className="text-xl md:text-3xl text-foreground font-serif font-light leading-relaxed tracking-wide">
                <strong className="font-bold text-primary">UNLUPA</strong> dibangun agar bisa dimanfaatkan oleh siapa pun yang ingin menjaga ilmunya.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 md:p-10">
              <p className="text-base md:text-lg text-muted-foreground font-light leading-loose text-center">
                Kami tidak ingin harga menjadi penghalang bagi <span className="text-foreground font-medium border-b border-primary/30 pb-0.5">pelajar</span>, <span className="text-foreground font-medium border-b border-primary/30 pb-0.5">penghafal Al-Qur’an</span>, atau siapa pun yang sungguh-sungguh ingin belajar dan mempertahankan hafalannya.
              </p>
            </div>
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-4 text-center">
                <span className="w-12 h-px bg-border"></span>
                <p className="text-muted-foreground italic font-serif text-lg md:text-xl">“Namun, agar sistem ini dapat terus berjalan, berkembang, dan memberi manfaat jangka panjang, keberlanjutan perlu dijaga bersama.”</p>
                <span className="w-12 h-px bg-border"></span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MEKANISME (Phase Cards) */}
        <div className="grid md:grid-cols-2 gap-6 mb-20 md:mb-24">
          <div className="p-6 md:p-8 bg-card border border-border rounded-xl border-l-4 border-l-border flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Fase 01</span>
              <h3 className="font-serif text-2xl text-foreground mb-3">Bulan Pertama <br /><span className="text-muted-foreground text-lg italic">Bebas untuk Mengenal</span></h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Bulan pertama dapat digunakan tanpa kewajiban kontribusi. Kami ingin Anda benar-benar merasakan bagaimana UNLUPA membantu menjaga ilmu dengan lebih tenang dan terarah.</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-mono"><Unlock className="w-3 h-3" /> Open Access</div>
          </div>
          <div className="p-6 md:p-8 bg-card border border-border rounded-xl border-l-4 border-l-primary bg-primary/5 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2 block">Fase 02</span>
              <h3 className="font-serif text-2xl text-foreground mb-3">Mulai Bulan Kedua <br /><span className="text-primary text-lg italic">Kontribusi Wajib, Nominal Bebas</span></h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Setiap pengguna wajib berkontribusi untuk menjaga keberlanjutan sistem. Namun, besar kontribusi tidak ditentukan. Anda bebas menentukan nominal sesuai kemampuan dan nilai yang Anda rasakan dari UNLUPA.</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-primary font-mono"><HeartHandshake className="w-3 h-3" /> Shared Responsibility</div>
          </div>
        </div>

        {/* 3. PRESET KONTRIBUSI */}
        <div className="mb-20 md:mb-24">
          <div className="text-center mb-12">
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Pilih Kontribusi Anda</h3>
            <p className="text-muted-foreground text-sm font-light max-w-xl mx-auto">Tidak ada nominal yang benar atau salah. Pilihlah sesuai kemampuan.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <button onClick={() => fillAmount("25000")} className="text-left p-6 md:p-8 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Leaf className="w-6 h-6" /></div>
                <div><span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1 block">Pelajar</span><h4 className="font-serif text-lg font-bold text-foreground">Jumlah Ringan</h4></div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">Untuk pelajar atau pengguna dengan kondisi keuangan terbatas. Cocok jika Anda ingin tetap berkontribusi meski nominal kecil.</p>
              <div className="font-mono text-lg font-bold text-foreground">Rp 25.000</div>
              <p className="text-[10px] text-muted-foreground mt-1 italic">Contoh nominal</p>
            </button>
            <button onClick={() => fillAmount("50000")} className="text-left p-6 md:p-8 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Droplet className="w-6 h-6" /></div>
                <div><span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1 block">Rutin</span><h4 className="font-serif text-lg font-bold text-foreground">Jumlah Sedang</h4></div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">Untuk pengguna rutin yang merasakan manfaat UNLUPA dalam menjaga pembelajaran sehari-hari.</p>
              <div className="font-mono text-lg font-bold text-foreground">Rp 50.000</div>
              <p className="text-[10px] text-muted-foreground mt-1 italic">Contoh nominal</p>
            </button>
            <button onClick={() => fillAmount("100000")} className="text-left p-6 md:p-8 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Gift className="w-6 h-6" /></div>
                <div><span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1 block">Support</span><h4 className="font-serif text-lg font-bold text-foreground">Jumlah Lebih</h4></div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">Untuk Anda yang ingin mendukung keberlanjutan UNLUPA lebih jauh, agar semakin banyak orang merasakan manfaatnya.</p>
              <div className="font-mono text-lg font-bold text-foreground">Rp 100.000</div>
              <p className="text-[10px] text-muted-foreground mt-1 italic">Contoh nominal</p>
            </button>
          </div>
          <div ref={customCardRef} className="mt-6 bg-card border border-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><Edit3 className="w-6 h-6" /></div>
              <div><h4 className="font-serif text-lg font-bold text-foreground">Atau Tentukan Sendiri</h4><p className="text-xs text-muted-foreground">Anda juga dapat mengisi nominal sendiri sesuai kemampuan.</p></div>
            </div>
            <div className="flex-1 w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">Rp</span>
              <input ref={customInputRef} type="text" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} placeholder="0" className="w-full bg-background border border-input rounded-lg text-base text-foreground pl-9 py-3 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" />
              <p className="text-[10px] text-muted-foreground mt-2 italic text-right">“Semua kontribusi dihargai. Tidak ada perbandingan. Tidak ada penilaian.”</p>
            </div>
          </div>
        </div>

        {/* 4. PENEGASAN MORAL */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="p-8 md:p-12 bg-card border border-border rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"><ShieldCheck className="w-6 h-6 text-primary" /></div>
            <p className="font-serif text-xl md:text-2xl text-foreground italic mb-6 leading-relaxed text-center">“Kami percaya, siapa pun yang ingin ilmunya terjaga, <br /> juga ingin ikut menjaga sistem yang membantunya.”</p>
            <p className="text-sm text-muted-foreground font-light mb-8 max-w-xl mx-auto">Setiap kontribusi, sekecil apa pun, adalah bagian dari keberlanjutan bersama.</p>
            <div className="w-12 h-px bg-border mx-auto mb-6"></div>
            <div className="space-y-1">
              <p className="font-mono text-sm text-primary tracking-widest uppercase">UNLUPA ingin tumbuh bersama Anda</p>
              <p className="font-mono text-xs text-muted-foreground">Dengan Adil. Dengan Tenang. Dengan Kebermanfaatan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
