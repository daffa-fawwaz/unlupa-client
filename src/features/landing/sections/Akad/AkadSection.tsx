import {
  Target,
  Shield,
  CloudOff,
  ShieldCheck,
  XCircle,
  CheckCircle,
  BookHeart,
  Cpu,
  HeartHandshake,
  ShieldAlert,
  RefreshCcw,
  Feather,
} from "lucide-react";

export const AkadSection = () => {
  return (
    <section className="relative w-full max-w-4xl mx-auto px-6 py-24 z-10">
      {/* HEADER */}
      <div className="text-center mb-24 animate-fade-in-up">
        <div className="inline-flex items-center gap-3 mb-8 opacity-70">
          <span className="w-px h-8 bg-linear-to-b from-transparent to-warning"></span>
          <span className="font-cinzel text-xs text-warning tracking-[0.3em] uppercase">
            Akad Moral & Etika
          </span>
          <span className="w-px h-8 bg-linear-to-b from-transparent to-warning"></span>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-10 leading-tight">
          Kesepakatan Kita <br />{" "}
          <span className="text-warning italic">Menjaga Ilmu</span>
        </h1>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 text-center">
          <p className="text-xl font-serif text-foreground italic mb-6">
            "UNLUPA dibangun untuk membantu menjaga ilmu agar tidak hilang
            setelah diperjuangkan."
          </p>
          <div className="w-16 h-px bg-border mx-auto mb-6"></div>
          <div className="text-muted-foreground font-light text-sm leading-relaxed space-y-4 text-left md:text-center max-w-2xl mx-auto">
            <p>
              Agar tujuan ini tercapai dengan baik, diperlukan kesepahaman dan
              kejujuran antara UNLUPA dan setiap penggunanya.
            </p>
            <p>
              Dokumen ini bukan sekadar aturan teknis, melainkan akad moral yang
              menjaga adab, tanggung jawab, dan ketenangan dalam belajar.
            </p>
            <p className="text-foreground font-medium">
              Dengan menggunakan UNLUPA, pengguna menyepakati nilai-nilai
              berikut sebagai dasar bersama.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-16">
        {/* 1. TUJUAN */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">01</div>
          <div className="flex items-start gap-6">
            <Target className="w-8 h-8 text-info shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Tujuan Penggunaan
              </h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                UNLUPA digunakan untuk membantu menjaga ilmu agar bertahan lama,
                bukan sekadar untuk mengejar target cepat, nilai sesaat, atau
                menyelesaikan program.
              </p>
              <div className="bg-info/5 border border-info/20 p-4 rounded-lg">
                <p className="text-sm text-foreground mb-2 font-semibold">
                  Pengguna memahami bahwa:
                </p>
                <ul className="list-none space-y-2 text-sm text-muted-foreground [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['•'] [&_li]:before:text-muted-foreground">
                  <li>UNLUPA bukan alat instan.</li>
                  <li>
                    UNLUPA tidak menjanjikan hafalan sempurna tanpa usaha.
                  </li>
                  <li>UNLUPA menemani proses jangka panjang.</li>
                </ul>
                <p className="text-info text-xs mt-3 italic">
                  "Belajar adalah perjalanan, bukan perlombaan."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AMANAH */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">02</div>
          <div className="flex items-start gap-6">
            <Shield className="w-8 h-8 text-success shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Ilmu Sebagai Amanah
              </h3>
              <div className="text-foreground/70 leading-relaxed space-y-4">
                <p>
                  Kami percaya, ilmu bukan sekadar materi yang dihafal, tetapi
                  amanah yang perlu dijaga.
                </p>
                <div className="pl-4 border-l-2 border-success/50">
                  <p className="text-foreground italic">Karena itu:</p>
                  <ul className="list-none space-y-2 text-sm text-muted-foreground mt-2 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['✓'] [&_li]:before:text-warning">
                    <li>Ilmu tidak dipelajari untuk dilupakan.</li>
                    <li>Hafalan tidak ditargetkan untuk sementara.</li>
                    <li>
                      Hasil belajar diupayakan agar bisa digunakan kembali dalam
                      kehidupan.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LUPA */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">03</div>
          <div className="flex items-start gap-6">
            <CloudOff className="w-8 h-8 text-muted-foreground shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Lupa & Proses Belajar
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                UNLUPA tidak menyalahkan pengguna ketika lupa terjadi. Lupa
                adalah bagian dari manusia. Yang menjadi tanggung jawab sistem
                adalah membantu mengelolanya dengan adil.
              </p>
              <p className="text-muted-foreground text-sm">
                Namun UNLUPA juga mengajak pengguna untuk menjalani proses
                belajar dengan kesadaran dan konsistensi.
              </p>
            </div>
          </div>
        </div>

        {/* 4. KEJUJURAN (THE CORE - REPLACED ICON) */}
        <div className="relative overflow-hidden rounded-2xl border border-warning/30 bg-warning/5 p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-warning/10 pointer-events-none select-none">04</div>
          <div className="flex items-center gap-4 mb-8">
            {/* Icon diganti menjadi Shield Check (Integritas/Perlindungan Kebenaran) */}
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center border border-warning/50">
              <ShieldCheck className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-cinzel text-2xl text-warning">
              Kejujuran sebagai Asas Utama
            </h3>
          </div>

          <div className="space-y-8 text-foreground/70">
            <p className="text-lg font-light">
              UNLUPA adalah sistem yang bekerja berdasarkan umpan balik
              (feedback) dari pengguna.
              <span className="text-foreground">
                Kejujuran bukan hanya nilai moral, tetapi syarat teknis utama
                agar sistem dapat bekerja dengan benar.
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dampak Tidak Jujur */}
              <div className="my-5 rounded-r-xl border-l-[3px] border-destructive bg-destructive/5 p-5">
                <h4 className="font-serif text-destructive mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Jika Tidak Jujur
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Melebihkan penilaian atau meremehkan kesulitan.
                </p>
                <ul className="text-xs text-destructive/80 space-y-2 list-disc pl-4">
                  <li>Sistem gagal menentukan waktu ulang.</li>
                  <li>Validitas perhitungan hilang.</li>
                  <li>Hafalan melemah tanpa disadari.</li>
                  <li>Merugikan diri sendiri, bukan sistem.</li>
                </ul>
              </div>

              {/* Dampak Jujur */}
              <div className="my-5 rounded-r-xl border-l-[3px] border-warning bg-warning/5 p-5">
                <h4 className="font-serif text-warning mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Jika Jujur
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Apa adanya sesuai kondisi ingatan saat ini.
                </p>
                <ul className="text-xs text-warning/80 space-y-2 list-disc pl-4">
                  <li>Jadwal ulang menjadi presisi.</li>
                  <li>UNLUPA melindungi sebelum lupa total.</li>
                  <li>Proses belajar menjadi aman & tenang.</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-warning/20">
              <p className="font-mono text-xs text-warning uppercase tracking-widest mb-2">
                Kesepakatan Kita
              </p>
              <p className="text-foreground italic font-serif">
                "Dengan menggunakan UNLUPA, pengguna menyepakati untuk jujur
                terhadap kondisi ingatannya dan kesulitannya. Ini bukan tuntutan
                kesempurnaan, melainkan komitmen pada proses."
              </p>
            </div>
          </div>
        </div>

        {/* 5. AL-QURAN */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">05</div>
          <div className="flex items-start gap-6">
            <BookHeart className="w-8 h-8 text-success shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Tentang Hafalan Al-Qur’an
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Ruang Al-Qur’an di UNLUPA dibuat dengan perlakuan khusus karena
                Al-Qur’an adalah amanah besar.
              </p>
              <div className="border-l-2 border-success/30 pl-4">
                <p className="text-sm text-foreground/60">Pengguna diharapkan:</p>
                <ul className="list-none space-y-2 text-sm text-success/80 mt-2 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['✓'] [&_li]:before:text-warning">
                  <li>Menjaga adab dalam penggunaan.</li>
                  <li>Tidak menjadikan hafalan sekadar target angka.</li>
                  <li>
                    Memahami bahwa menjaga hafalan adalah proses seumur hidup.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 6. BATASAN SISTEM */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">06</div>
          <div className="flex items-start gap-6">
            <Cpu className="w-8 h-8 text-info shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Sistem & Batasannya
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                UNLUPA membantu menentukan waktu yang tepat untuk mengulang
                ilmu. Namun UNLUPA tidak menggantikan:
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-surface-1 rounded text-xs text-muted-foreground">
                  Peran Guru
                </span>
                <span className="px-3 py-1 bg-surface-1 rounded text-xs text-muted-foreground">
                  Kesungguhan
                </span>
                <span className="px-3 py-1 bg-surface-1 rounded text-xs text-muted-foreground">
                  Tanggung Jawab Pribadi
                </span>
              </div>
              <p className="text-info text-sm mt-4 italic">
                "Sistem membantu, manusia tetap berperan."
              </p>
            </div>
          </div>
        </div>

        {/* 7. KONTRIBUSI */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">07</div>
          <div className="flex items-start gap-6">
            <HeartHandshake className="w-8 h-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Kontribusi & Keberlanjutan
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                UNLUPA dapat digunakan oleh siapa pun, namun keberlanjutan
                sistem dijaga bersama.
              </p>
              <ul className="list-none space-y-2 text-sm text-muted-foreground [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['•'] [&_li]:before:text-muted-foreground">
                <li>Mulai waktu tertentu, kontribusi bersifat wajib.</li>
                <li>Nominal ditentukan oleh pengguna (bebas).</li>
                <li>Tidak ada penilaian atas besar kecilnya kontribusi.</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                Dana digunakan untuk menjaga server, pengembangan, dan kehidupan
                tim yang merawat UNLUPA.
              </p>
            </div>
          </div>
        </div>

        {/* 8. ITIKAD BAIK */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">08</div>
          <div className="flex items-start gap-6">
            <ShieldAlert className="w-8 h-8 text-destructive shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Itikad Baik
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                UNLUPA dibangun dengan kejujuran, dan hanya dapat bertahan
                dengan itikad baik dari penggunanya.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Pengguna diharapkan tidak menyalahgunakan sistem, memanipulasi
                proses, atau menggunakan UNLUPA untuk tujuan yang bertentangan
                dengan nilai pendidikan.
              </p>
            </div>
          </div>
        </div>

        {/* 9. PERUBAHAN */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 animate-fade-in-up">
          <div className="absolute -top-1 right-4 font-display text-6xl font-bold text-foreground/10 pointer-events-none select-none">09</div>
          <div className="flex items-start gap-6">
            <RefreshCcw className="w-8 h-8 text-muted-foreground shrink-0 mt-1" />
            <div>
              <h3 className="font-cinzel text-xl text-foreground mb-4">
                Tentang Perubahan
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                UNLUPA akan terus berkembang. Sistem dan fitur dapat diperbaiki
                seiring waktu. Namun nilai utama (Menjaga Ilmu, Kejujuran,
                Kemanusiaan) tidak akan diubah.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PENUTUP (AKAD FINAL) */}
      <div className="mt-32 text-center animate-fade-in-up">
        <div className="inline-block p-10 border border-border bg-card rounded-2xl max-w-2xl relative overflow-hidden">
          <Feather className="w-8 h-8 text-warning mx-auto mb-6" />

          <h3 className="font-cinzel text-xl text-foreground mb-6 tracking-widest">
            Akad yang Kita Jaga Bersama
          </h3>

          <p className="text-foreground/70 font-light text-lg mb-8 leading-relaxed">
            "Dengan menggunakan UNLUPA, pengguna menyepakati untuk belajar
            dengan niat baik, menjaga adab terhadap ilmu, jujur dalam setiap
            proses, dan ikut menjaga keberlanjutan sistem sesuai kemampuan."
          </p>

          <p className="font-serif italic text-warning text-xl">
            Kami berkomitmen untuk menjaga amanah ini sebaik yang kami mampu.
          </p>
        </div>
      </div>
    </section>
  );
};
