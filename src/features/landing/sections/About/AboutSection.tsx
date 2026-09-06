import {
  Shield,
  AlertCircle,
  Coffee,
  BookOpen,
  Scale,
  Eye,
  Users,
  Map,
} from "lucide-react";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative w-full max-w-4xl mx-auto px-6 py-24 z-10"
    >
      {/* Connector Line (Visual Guide) - using CSS class now or Tailwind equivalent */}
      <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-foreground/10 to-transparent md:block"></div>

      {/* HEADER */}
      <div className="text-center mb-32 animate-fade-in-up relative z-10">
        <div className="inline-flex items-center gap-3 mb-8 opacity-70">
          <span className="w-px h-8 bg-linear-to-b from-transparent to-primary"></span>
          <span className="font-cinzel text-xs text-primary tracking-[0.3em] uppercase">
            Akad Moral Platform
          </span>
          <span className="w-px h-8 bg-linear-to-b from-transparent to-primary"></span>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-12 leading-tight">
          Nilai & <span className="text-highlight italic">Prinsip</span>
        </h1>

        <div className="max-w-2xl mx-auto space-y-8 text-lg font-light leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground font-normal">UNLUPA</strong> tidak
            dibangun hanya sebagai teknologi. <br />
            UNLUPA dibangun sebagai amanah.
          </p>
          <div className="p-6 border-l-2 border-warning/30 bg-surface-1 rounded-r-xl text-left">
            <p className="text-warning italic font-serif">
              "Amanah untuk menjaga ilmu, menjaga proses belajar, dan menjaga
              manusia yang belajar maupun yang membangun sistem ini."
            </p>
          </div>
          <p className="text-sm text-muted-foreground font-mono pt-4">
            Nilai dan prinsip berikut adalah komitmen terbuka kami kepada
            seluruh pengguna UNLUPA.
          </p>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="space-y-16 relative z-10">
        {/* 1. Ilmu Dijaga */}
        <div className="bg-card border border-border p-6 md:p-8 rounded relative animate-fade-in-up hover:border-info/30 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-foreground/10 pointer-events-none select-none group-hover:text-info/20 transition-colors">
            01
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-info/10 border border-info/30 flex items-center justify-center text-info">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Ilmu Dijaga, Bukan Sekadar Dipelajari
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p className="text-foreground/90 font-normal">
                  Kami percaya, tujuan belajar bukan hanya memahami hari ini,
                  tetapi menjaga ilmu agar tetap hidup dan bisa digunakan di
                  masa depan.
                </p>
                <p>
                  Karena itu, UNLUPA tidak mendorong belajar berlebihan,
                  melainkan belajar tepat, terarah, dan berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Lupa & Tanggung Jawab */}
        <div className="bg-card border border-border p-6 md:p-8 rounded relative animate-fade-in-up hover:border-destructive/30 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-foreground/10 pointer-events-none select-none group-hover:text-destructive/20 transition-colors">
            02
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Lupa Bukan Kesalahan Manusia
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p className="text-foreground/90 font-normal italic">
                  "Kami tidak menyalahkan pelajar karena lupa."
                </p>
                <p>
                  Dalam banyak kasus, lupa terjadi karena tidak adanya sistem
                  yang membantu menjaga ingatan.
                </p>
                <p>
                  UNLUPA hadir untuk mengambil peran sistem tersebut, agar
                  manusia bisa belajar dengan lebih tenang.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Ketenangan */}
        <div className="bg-card border border-border p-6 md:p-8 rounded relative animate-fade-in-up hover:border-primary/30 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-foreground/10 pointer-events-none select-none group-hover:text-primary/20 transition-colors">
            03
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Coffee className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Ketenangan Lebih Utama
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p className="text-foreground/90 font-normal">
                  Belajar yang baik tidak lahir dari paksaan. Ia tumbuh dari
                  ketenangan, konsistensi, dan rasa aman.
                </p>
                <p>
                  Karena itu, UNLUPA menghindari tekanan, target agresif, dan
                  rasa bersalah, baik dalam belajar maupun dalam berkontribusi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Al-Qur'an (Special) */}
        <div className="bg-card border border-success/20 p-6 md:p-8 rounded relative animate-fade-in-up hover:border-success/50 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-success/10 pointer-events-none select-none group-hover:text-success/20 transition-colors">
            04
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-success/10 border border-success/50 flex items-center justify-center text-success">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-success mb-4">
                Al-Qur’an Diperlakukan Istimewa
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p className="text-success font-normal">
                  Al-Qur’an adalah Kalamullah.
                </p>
                <p>
                  Cara menghafalnya, menjaganya, dan mengulanginya tidak bisa
                  disamakan dengan materi biasa.
                </p>
                <p>
                  UNLUPA memperlakukan hafalan Al-Qur’an sebagai amanah jangka
                  panjang, yang dijaga dengan kehati-hatian, kesabaran, dan
                  penghormatan penuh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Kebermanfaatan & Keberlanjutan */}
        <div className="bg-card border border-border p-6 md:p-8 rounded relative animate-fade-in-up hover:border-warning/30 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-foreground/10 pointer-events-none select-none group-hover:text-warning/20 transition-colors">
            05
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center text-warning">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Manfaat Luas & Keberlanjutan Adil
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p>
                  Kami ingin UNLUPA dapat dimanfaatkan oleh siapa pun yang ingin
                  menjaga ilmunya, tanpa terhalang kondisi ekonomi.
                </p>
                <p>
                  Namun kami juga percaya, kebermanfaatan yang besar perlu
                  keberlanjutan yang adil.
                </p>
                <p className="text-foreground/90 border-l-2 border-warning/50 pl-3">
                  Karena itu, UNLUPA mengajak pengguna berkontribusi sesuai
                  kemampuan, tanpa paksaan angka, tanpa menutup pintu bagi siapa
                  pun.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Kejujuran */}
        <div className="bg-card border border-border p-6 md:p-8 rounded relative animate-fade-in-up hover:border-primary/30 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-foreground/10 pointer-events-none select-none group-hover:text-primary/20 transition-colors">
            06
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Eye className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Kejujuran Utama
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p className="text-foreground/90 font-normal">
                  Kami memilih jujur, meski tidak selalu terlihat sempurna.
                </p>
                <p>
                  Kontribusi digunakan untuk menjaga sistem, mengembangkan
                  pembelajaran, menjaga akses, dan menjaga keberlangsungan
                  orang-orang yang mengabdikan dirinya.
                </p>
                <p>
                  Kami tidak menyembunyikan hal ini, karena kejujuran adalah
                  bagian dari amanah.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Manusia */}
        <div className="bg-card border border-border p-6 md:p-8 rounded relative animate-fade-in-up hover:border-destructive/30 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-foreground/10 pointer-events-none select-none group-hover:text-destructive/20 transition-colors">
            07
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Manusia di Balik Sistem
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p>
                  Di balik setiap sistem yang baik, ada manusia yang berpikir,
                  bekerja, dan bertanggung jawab.
                </p>
                <p className="text-foreground/90 font-normal">
                  Kami percaya, menjaga ilmu juga berarti menjaga kehidupan yang
                  layak bagi mereka yang memperjuangkannya.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Perjalanan Panjang */}
        <div className="bg-card border border-border p-6 md:p-8 rounded relative animate-fade-in-up hover:border-info/30 transition-colors group">
          <div className="absolute right-5 top-5 font-display text-5xl font-bold text-foreground/10 pointer-events-none select-none group-hover:text-info/20 transition-colors">
            08
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-info/10 border border-info/30 flex items-center justify-center text-info">
                <Map className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-foreground mb-4">
                Belajar adalah Perjalanan Panjang
              </h3>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p>
                  UNLUPA tidak menjanjikan hasil instan. UNLUPA menemani
                  perjalanan panjang, langkah demi langkah, dengan kesabaran dan
                  konsistensi.
                </p>
                <p className="italic">
                  "Kami lebih memilih hasil yang bertahan lama daripada
                  pencapaian cepat yang rapuh."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PENUTUP (THE PLEDGE) */}
      <div className="mt-32 text-center animate-fade-in-up">
        <div className="inline-block p-10 border border-warning/20 bg-surface-1 rounded-2xl max-w-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-warning to-transparent"></div>

          <h3 className="font-cinzel text-xl text-warning mb-6 tracking-widest">
            Akad Kami kepada Anda
          </h3>

          <p className="text-foreground font-serif text-xl italic mb-8 leading-relaxed">
            "Selama UNLUPA digunakan, kami berkomitmen untuk menjaga amanah
            ilmu, menjaga ketenangan belajar, menjaga kejujuran sistem, dan
            menjaga manusia di balik teknologi ini."
          </p>

          <p className="text-muted-foreground text-sm font-light">
            Jika suatu saat UNLUPA tidak lagi menjaga nilai-nilai ini, <br />
            maka UNLUPA layak untuk dikritik, diingatkan, dan diperbaiki.
          </p>
        </div>
      </div>
    </section>
  );
};
