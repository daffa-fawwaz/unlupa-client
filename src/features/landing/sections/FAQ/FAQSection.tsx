import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
  group: "gold" | "emerald" | "blue" | "purple";
};

const faqs: FAQItem[] = [
  // GROUP 1: ESENSI & FILOSOFI (Gold Accent)
  {
    question: "Apa sebenarnya BAQEN itu?",
    answer: (
      <>
        <p className="mb-4">
          BAQEN adalah platform pembelajaran yang dirancang untuk menjaga ilmu
          agar tidak hilang setelah dipelajari.
        </p>
        <p>
          Bukan hanya membantu memahami hari ini, tetapi memastikan hafalan,
          pemahaman, dan pelajaran tetap hidup dalam jangka panjang.
        </p>
      </>
    ),
    group: "gold",
  },
  {
    question: "Masalah apa yang ingin diselesaikan oleh BAQEN?",
    answer: (
      <>
        <p className="mb-4">
          Banyak orang belajar, menghafal, dan mengikuti kelas — tetapi setelah
          beberapa waktu, ilmu itu hilang, kabur, atau tinggal kenangan.
        </p>
        <p className="mb-4">BAQEN hadir untuk menjawab satu masalah inti:</p>
        <div className="faq-quote">
          "Bagaimana ilmu yang sudah dipelajari bisa bertahan, bukan hanya
          lewat?"
        </div>
      </>
    ),
    group: "gold",
  },
  {
    question: "Apa yang membedakan BAQEN dari aplikasi belajar lain?",
    answer: (
      <>
        <p className="mb-4">
          Sebagian besar aplikasi fokus pada: menyelesaikan materi, mengejar
          target, atau lulus ujian.
        </p>
        <p className="mb-4">BAQEN fokus pada satu hal yang sering dilupakan:</p>
        <div className="faq-quote">
          "Apakah ilmu itu masih hidup setelah dipelajari?"
        </div>
        <p className="mt-4">
          BAQEN menggunakan sistem peninjauan ilmiah agar ilmu tidak tenggelam
          oleh waktu.
        </p>
      </>
    ),
    group: "gold",
  },
  {
    question: "Mengapa BAQEN terasa berbeda dari aplikasi belajar lain?",
    answer: (
      <>
        <p className="mb-4">
          Karena BAQEN tidak dibangun untuk: kejar angka, kejar streak, atau
          kejar badge.
        </p>
        <div className="faq-quote">
          BAQEN dibangun untuk satu niat: Ilmu tidak menjadi kenangan.
        </div>
      </>
    ),
    group: "gold",
  },

  // GROUP 2: METODOLOGI & CARA KERJA (Emerald Accent)
  {
    question: "Bagaimana cara BAQEN menjaga ilmu agar tidak lupa?",
    answer: (
      <>
        <p>
          BAQEN menggunakan algoritma, rumus serta weight untuk penjadwalan
          pengulangan ilmiah yang:
        </p>
        <ul className="faq-list">
          <li>Menanyakan materi tepat sebelum lupa</li>
          <li>Tidak terlalu sering</li>
          <li>Tidak terlalu jarang</li>
          <li>Disesuaikan dengan kekuatan hafalan masing-masing orang</li>
        </ul>
        <p>
          Untuk Al-Qur’an, sistemnya dimodifikasi secara khusus agar tetap
          manusiawi dan aman.
        </p>
      </>
    ),
    group: "emerald",
  },
  {
    question: "Apakah saya harus mengulang setiap hari selamanya?",
    answer: (
      <>
        <p className="mb-4">
          <strong>Tidak.</strong> BAQEN memiliki fase yang jelas: belajar,
          penguatan, aktif, pemeliharaan, hingga penyelesaian (graduation).
        </p>
        <p>
          Ketika hafalan sudah kuat, Anda boleh menghentikan review tanpa
          merusak sistem. Ilmu yang sudah kokoh tidak dipaksa untuk terus
          ditanya.
        </p>
      </>
    ),
    group: "emerald",
  },
  {
    question: "Bagaimana BAQEN menyikapi kesalahan dan lupa?",
    answer: (
      <>
        <p className="mb-4">
          Lupa adalah bagian dari belajar, bukan kesalahan.
        </p>
        <p className="mb-4">
          BAQEN tidak menilai Anda dari seberapa sering lupa, seberapa lama
          berhenti, atau seberapa cepat menguasai.
        </p>
        <div className="faq-quote">
          Yang diperhatikan hanyalah: Bagaimana kondisi hafalan Anda saat ini,
          berdasarkan respon Anda sendiri.
        </div>
      </>
    ),
    group: "emerald",
  },

  // GROUP 3: PENGGUNAAN & FITUR (Blue Accent)
  {
    question: "Apakah BAQEN hanya untuk hafalan Al-Qur’an?",
    answer: (
      <>
        <p className="mb-4">
          <strong>Tidak.</strong> BAQEN mendukung:
        </p>
        <ul className="faq-list">
          <li>Hafalan Al-Qur’an (dengan sistem khusus Qur’ani)</li>
          <li>Pelajaran kitab & kelas</li>
          <li>Pembelajaran pribadi (self-learning)</li>
          <li>Materi buatan guru atau pengguna sendiri</li>
        </ul>
        <p>Semua jenis ilmu bisa dijaga, bukan hanya Al-Qur’an.</p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah BAQEN akan memberatkan saya dengan banyak review?",
    answer: (
      <>
        <p className="mb-4">
          <strong>Tidak.</strong> BAQEN menghitung beban hafalan secara
          realistis, memberi peringatan jika terlalu berat, dan memberi kendali
          pada pengguna, bukan memaksa.
        </p>
        <p className="italic text-gray-400">Anda tetap manusia, bukan mesin.</p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Bagaimana peran guru dalam BAQEN?",
    answer: (
      <>
        <p>
          Guru berperan sebagai pembuat kelas, penyusun kitab & materi, pengamat
          perkembangan murid, dan pembimbing (bukan sekadar pengontrol hafalan).
        </p>
        <p className="mt-2">
          BAQEN membantu guru melihat progres nyata, bukan menambah beban
          administrasi.
        </p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah murid bisa belajar mandiri tanpa kelas?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Bisa.</strong> Setiap pengguna memiliki ruang pribadi untuk
          membuat kitab sendiri, mengimpor kitab dari perpustakaan, dan belajar
          mandiri dengan sistem yang sama kuatnya.
        </p>
        <p>Belajar tidak harus menunggu kelas.</p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah saya bisa membuat dan membagikan kitab saya sendiri?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Ya.</strong> Pengguna dapat membuat kitab pribadi untuk diri
          sendiri atau membagikannya ke perpustakaan agar bermanfaat untuk orang
          lain.
        </p>
        <p>
          Namun, karya yang dibagikan tetap dijaga keasliannya dan melalui
          moderasi.
        </p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah kitab yang saya impor bisa saya edit?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Tidak.</strong> Kitab yang diimpor dari perpustakaan bisa
          dipelajari dan dihafal, tapi tidak bisa diubah.
        </p>
        <p>
          Ini untuk menjaga keaslian karya, adab keilmuan, dan hak pencipta
          materi.
        </p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah BAQEN cocok untuk pesantren dan sekolah?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Sangat cocok.</strong> BAQEN dirancang dengan lingkungan
          pendidikan, pembelajaran bertahap, pengawasan guru, dan kesadaran
          bahwa belajar adalah proses jangka panjang.
        </p>
        <p>Bukan sistem instan.</p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah BAQEN cocok untuk belajar pribadi di rumah?",
    answer: (
      <>
        <p>
          <strong>Ya.</strong> BAQEN tidak bergantung pada institusi. Siapa pun
          yang ingin menjaga ilmunya bisa menggunakannya.
        </p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah BAQEN menggantikan peran guru?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Tidak.</strong> BAQEN adalah alat bantu, bukan pengganti guru.
        </p>
        <p>
          Guru tetap membimbing, menasehati, meluruskan, dan memberi makna.
          BAQEN hanya membantu menjaga prosesnya.
        </p>
      </>
    ),
    group: "blue",
  },
  {
    question: "Apakah BAQEN gratis?",
    answer: (
      <>
        <p>Sebagian fitur tersedia untuk digunakan tanpa hambatan.</p>
        <p>
          Untuk keberlanjutan sistem, ada mekanisme kontribusi yang transparan,
          adil, tidak memaksa, dan menjaga kebermanfaatan jangka panjang.
        </p>
      </>
    ),
    group: "blue",
  },

  // GROUP 4: HUMANIS & PSIKOLOGI (Purple Accent)
  {
    question: "Bagaimana jika saya tidak konsisten melakukan review harian?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Tidak masalah.</strong> BAQEN tidak menghukum, tidak
          mengurangi nilai, dan tidak merusak sistem belajar Anda hanya karena
          Anda melewatkan review.
        </p>
        <p>
          Sistem kami bekerja berdasarkan interaksi nyata, bukan asumsi. Jika
          Anda tidak melakukan review hari ini, sistem hanya menunggu — tidak
          menghukum.
        </p>
      </>
    ),
    group: "purple",
  },
  {
    question: "Apakah hafalan saya akan rusak jika saya sering lupa review?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Tidak.</strong> Hafalan tidak “rusak” hanya karena jeda.
        </p>
        <p>
          Yang terjadi hanyalah jarak waktu penguatan menjadi lebih panjang, dan
          itu akan disesuaikan kembali saat Anda melanjutkan.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          BAQEN dirancang untuk mengikuti ritme manusia, bukan memaksa manusia
          mengikuti ritme mesin.
        </p>
      </>
    ),
    group: "purple",
  },
  {
    question:
      "Apakah sistem akan menganggap saya “gagal” jika saya tidak aktif beberapa hari?",
    answer: (
      <>
        <p>
          <strong>Tidak pernah.</strong> BAQEN tidak mengenal istilah gagal.
        </p>
        <p>
          Yang ada hanyalah: belum dikerjakan, sudah dikerjakan, atau belum
          diberi umpan balik. Sistem hanya bekerja ketika Anda memberi respon
          secara sadar.
        </p>
      </>
    ),
    group: "purple",
  },
  {
    question:
      "Apakah sistem belajar BAQEN bisa kacau jika saya tidak disiplin?",
    answer: (
      <>
        <p>
          <strong>Tidak.</strong> Sistem BAQEN tidak berjalan otomatis tanpa
          Anda. Ia hanya merespon apa yang benar-benar Anda lakukan dan Anda
          laporkan.
        </p>
        <p>Tanpa feedback dari Anda, sistem tidak membuat asumsi apa pun.</p>
      </>
    ),
    group: "purple",
  },
  {
    question: "Apakah saya harus selalu jujur saat memberi respon?",
    answer: (
      <>
        <p>
          Kejujuran adalah kunci, tapi bukan untuk sistem — melainkan untuk diri
          Anda sendiri.
        </p>
        <p>
          BAQEN tidak menghukum ketidakjujuran, tetapi kejujuran akan membuat
          sistem membantu Anda dengan tepat.
        </p>
      </>
    ),
    group: "purple",
  },
  {
    question:
      "Bagaimana jika saya merasa hafalan sudah kuat dan tidak perlu ditanya lagi?",
    answer: (
      <>
        <p className="mb-2">BAQEN menyediakan fase penyelesaian.</p>
        <p>
          Ketika Anda merasa hafalan sudah kokoh: Anda bisa membekukan item,
          menghentikan pengulangan, dan fokus pada ilmu lain.
        </p>
        <p className="italic text-sm text-gray-400 mt-2">
          Belajar di BAQEN punya akhir yang sehat, bukan siklus tanpa ujung.
        </p>
      </>
    ),
    group: "purple",
  },
  {
    question:
      "Apakah BAQEN cocok untuk orang yang sering naik-turun semangatnya?",
    answer: (
      <>
        <p className="mb-2">
          <strong>Justru iya.</strong> BAQEN dirancang untuk manusia yang:
          semangatnya naik turun, punya kesibukan, dan tidak selalu stabil.
        </p>
        <p>Karena ilmu tidak boleh hilang hanya karena hidup berjalan.</p>
      </>
    ),
    group: "purple",
  },
  {
    question: "Apakah saya harus sempurna untuk menggunakan BAQEN?",
    answer: (
      <>
        <p>
          <strong>Tidak.</strong> BAQEN dibuat bukan untuk yang sempurna, tetapi
          untuk yang ingin menjaga ilmu dengan jujur.
        </p>
      </>
    ),
    group: "purple",
  },
  {
    question: "Apa prinsip utama BAQEN dalam belajar?",
    answer: (
      <>
        <div className="faq-quote">
          "Satu prinsip sederhana: Ilmu dijaga, bukan dikejar. Belajar untuk
          hidup, bukan untuk sekadar selesai."
        </div>
      </>
    ),
    group: "purple",
  },
];

export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative w-full max-w-3xl mx-auto px-6 py-24 z-10">
      {/* HEADER */}
      <div className="text-center mb-24 animate-fade-in-up">
        <div className="inline-flex items-center gap-3 mb-6 opacity-70">
          <span className="w-px h-8 bg-linear-to-b from-transparent to-amber-500"></span>
          <span className="font-cinzel text-xs text-amber-500 tracking-[0.3em] uppercase">
            Pusat Informasi
          </span>
          <span className="w-px h-8 bg-linear-to-b from-transparent to-amber-500"></span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl text-white mb-6 leading-tight">
          Pertanyaan yang Sering <br />{" "}
          <span className="text-amber-500 italic">Ditanyakan</span>
        </h1>
        <p className="text-gray-400 font-light text-sm tracking-wide">
          Jawaban untuk keraguan Anda yang ingin belajar dengan serius.
        </p>
      </div>

      {/* FAQ CONTAINER */}
      <div
        className="space-y-4 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item accent-${faq.group} ${
              activeIndex === index ? "active" : ""
            }`}
          >
            <div className="faq-header" onClick={() => toggleFAQ(index)}>
              <h3 className="font-serif text-lg md:text-xl text-white pr-4 text-left">
                {faq.question}
              </h3>
              <ChevronDown className="icon-chevron w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0" />
            </div>
            <div
              className="faq-content"
              style={{
                maxHeight: activeIndex === index ? "1000px" : "0",
                opacity: activeIndex === index ? 1 : 0.8,
              }}
            >
              <div className="faq-content-inner">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
