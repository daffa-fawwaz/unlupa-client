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
      <div className="connector-vertical hidden md:block"></div>

      {/* HEADER */}
      <div className="text-center mb-32 animate-fade-in-up relative z-10">
        <div className="inline-flex items-center gap-3 mb-8 opacity-70">
          <span className="w-px h-8 bg-linear-to-b from-transparent to-amber-500"></span>
          <span className="font-cinzel text-xs text-amber-500 tracking-[0.3em] uppercase">
            Akad Moral Platform
          </span>
          <span className="w-px h-8 bg-linear-to-b from-transparent to-amber-500"></span>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl text-white mb-12 leading-tight">
          Nilai & <span className="text-highlight italic">Prinsip</span>
        </h1>

        <div className="max-w-2xl mx-auto space-y-8 text-lg font-light leading-relaxed text-gray-300">
          <p>
            <strong className="text-white font-normal">BAQEN</strong> tidak
            dibangun hanya sebagai teknologi. <br />
            BAQEN dibangun sebagai amanah.
          </p>
          <div className="p-6 border-l-2 border-amber-500/30 bg-white/5 rounded-r-xl text-left">
            <p className="text-amber-100/90 italic font-serif">
              "Amanah untuk menjaga ilmu, menjaga proses belajar, dan menjaga
              manusia yang belajar maupun yang membangun sistem ini."
            </p>
          </div>
          <p className="text-sm text-gray-500 font-mono pt-4">
            Nilai dan prinsip berikut adalah komitmen terbuka kami kepada
            seluruh pengguna BAQEN.
          </p>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="space-y-16 relative z-10">
        {/* 1. Ilmu Dijaga */}
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up hover:border-blue-500/30 transition-colors group">
          <div className="num-badge group-hover:text-blue-500/20 transition-colors">
            01
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-white mb-4">
                Ilmu Dijaga, Bukan Sekadar Dipelajari
              </h3>
              <div className="space-y-4 text-gray-400 font-light leading-relaxed">
                <p className="text-white/90 font-normal">
                  Kami percaya, tujuan belajar bukan hanya memahami hari ini,
                  tetapi menjaga ilmu agar tetap hidup dan bisa digunakan di
                  masa depan.
                </p>
                <p>
                  Karena itu, BAQEN tidak mendorong belajar berlebihan,
                  melainkan belajar tepat, terarah, dan berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Lupa & Tanggung Jawab */}
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up hover:border-red-500/30 transition-colors group">
          <div className="num-badge group-hover:text-red-500/20 transition-colors">
            02
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-white mb-4">
                Lupa Bukan Kesalahan Manusia
              </h3>
              <div className="space-y-4 text-gray-400 font-light leading-relaxed">
                <p className="text-white/90 font-normal italic">
                  "Kami tidak menyalahkan pelajar karena lupa."
                </p>
                <p>
                  Dalam banyak kasus, lupa terjadi karena tidak adanya sistem
                  yang membantu menjaga ingatan.
                </p>
                <p>
                  BAQEN hadir untuk mengambil peran sistem tersebut, agar
                  manusia bisa belajar dengan lebih tenang.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Ketenangan */}
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up hover:border-teal-500/30 transition-colors group">
          <div className="num-badge group-hover:text-teal-500/20 transition-colors">
            03
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-teal-900/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Coffee className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-white mb-4">
                Ketenangan Lebih Utama
              </h3>
              <div className="space-y-4 text-gray-400 font-light leading-relaxed">
                <p className="text-white/90 font-normal">
                  Belajar yang baik tidak lahir dari paksaan. Ia tumbuh dari
                  ketenangan, konsistensi, dan rasa aman.
                </p>
                <p>
                  Karena itu, BAQEN menghindari tekanan, target agresif, dan
                  rasa bersalah, baik dalam belajar maupun dalam berkontribusi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Al-Qur'an (Special) */}
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up border-emerald-500/20 hover:border-emerald-500/50 transition-colors group bg-emerald-900/5">
          <div className="num-badge text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
            04
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-emerald-100 mb-4">
                Al-Qur’an Diperlakukan Istimewa
              </h3>
              <div className="space-y-4 text-emerald-100/70 font-light leading-relaxed">
                <p className="text-emerald-300 font-normal">
                  Al-Qur’an adalah Kalamullah.
                </p>
                <p>
                  Cara menghafalnya, menjaganya, dan mengulanginya tidak bisa
                  disamakan dengan materi biasa.
                </p>
                <p>
                  BAQEN memperlakukan hafalan Al-Qur’an sebagai amanah jangka
                  panjang, yang dijaga dengan kehati-hatian, kesabaran, dan
                  penghormatan penuh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Kebermanfaatan & Keberlanjutan */}
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up hover:border-amber-500/30 transition-colors group">
          <div className="num-badge group-hover:text-amber-500/20 transition-colors">
            05
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-amber-900/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-white mb-4">
                Manfaat Luas & Keberlanjutan Adil
              </h3>
              <div className="space-y-4 text-gray-400 font-light leading-relaxed">
                <p>
                  Kami ingin BAQEN dapat dimanfaatkan oleh siapa pun yang ingin
                  menjaga ilmunya, tanpa terhalang kondisi ekonomi.
                </p>
                <p>
                  Namun kami juga percaya, kebermanfaatan yang besar perlu
                  keberlanjutan yang adil.
                </p>
                <p className="text-white/90 border-l-2 border-amber-500/50 pl-3">
                  Karena itu, BAQEN mengajak pengguna berkontribusi sesuai
                  kemampuan, tanpa paksaan angka, tanpa menutup pintu bagi siapa
                  pun.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Kejujuran */}
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up hover:border-purple-500/30 transition-colors group">
          <div className="num-badge group-hover:text-purple-500/20 transition-colors">
            06
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-purple-900/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Eye className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-white mb-4">
                Kejujuran Utama
              </h3>
              <div className="space-y-4 text-gray-400 font-light leading-relaxed">
                <p className="text-white/90 font-normal">
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
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up hover:border-pink-500/30 transition-colors group">
          <div className="num-badge group-hover:text-pink-500/20 transition-colors">
            07
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-pink-900/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-white mb-4">
                Manusia di Balik Sistem
              </h3>
              <div className="space-y-4 text-gray-400 font-light leading-relaxed">
                <p>
                  Di balik setiap sistem yang baik, ada manusia yang berpikir,
                  bekerja, dan bertanggung jawab.
                </p>
                <p className="text-white/90 font-normal">
                  Kami percaya, menjaga ilmu juga berarti menjaga kehidupan yang
                  layak bagi mereka yang memperjuangkannya.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Perjalanan Panjang */}
        <div className="glass-panel p-6 md:p-8 rounded relative animate-fade-in-up hover:border-cyan-500/30 transition-colors group">
          <div className="num-badge group-hover:text-cyan-500/20 transition-colors">
            08
          </div>
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="shrink-0 pt-2">
              <div className="w-12 h-12 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Map className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-white mb-4">
                Belajar adalah Perjalanan Panjang
              </h3>
              <div className="space-y-4 text-gray-400 font-light leading-relaxed">
                <p>
                  BAQEN tidak menjanjikan hasil instan. BAQEN menemani
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
        <div className="inline-block p-10 border border-amber-500/20 bg-amber-900/5 rounded-2xl max-w-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent"></div>

          <h3 className="font-cinzel text-xl text-amber-500 mb-6 tracking-widest">
            Akad Kami kepada Anda
          </h3>

          <p className="text-white font-serif text-xl italic mb-8 leading-relaxed">
            "Selama BAQEN digunakan, kami berkomitmen untuk menjaga amanah ilmu,
            menjaga ketenangan belajar, menjaga kejujuran sistem, dan menjaga
            manusia di balik teknologi ini."
          </p>

          <p className="text-gray-500 text-sm font-light">
            Jika suatu saat BAQEN tidak lagi menjaga nilai-nilai ini, <br />
            maka BAQEN layak untuk dikritik, diingatkan, dan diperbaiki.
          </p>
        </div>
      </div>
    </section>
  );
};
