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
    question: "Apa sebenarnya UNLUPA itu?",
    answer: (
      <>
        <p className="mb-4">
          UNLUPA adalah platform pembelajaran yang dirancang untuk menjaga ilmu
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
    question: "Masalah apa yang ingin diselesaikan oleh UNLUPA?",
    answer: (
      <>
        <p className="mb-4">
          Banyak orang belajar, menghafal, dan mengikuti kelas — tetapi setelah
          beberapa waktu, ilmu itu hilang, kabur, atau tinggal kenangan.
        </p>
        <p className="mb-4">UNLUPA hadir untuk menjawab satu masalah inti:</p>
        <div className="faq-quote">
          "Bagaimana ilmu yang sudah dipelajari bisa bertahan, bukan hanya
          lewat?"
        </div>
      </>
    ),
    group: "gold",
  },
  {
    question: "Apa yang membedakan UNLUPA dari aplikasi belajar lain?",
    answer: (
      <>
        <p className="mb-4">
          Sebagian besar aplikasi fokus pada: menyelesaikan materi, mengejar
          target, atau lulus ujian.
        </p>
        <p className="mb-4">
          UNLUPA fokus pada satu hal yang sering dilupakan:
        </p>
        <div className="faq-quote">
          "Apakah ilmu itu masih hidup setelah dipelajari?"
        </div>
        <p className="mt-4">
          UNLUPA menggunakan sistem peninjauan ilmiah agar ilmu tidak tenggelam
          oleh waktu.
        </p>
      </>
    ),
    group: "gold",
  },
  {
    question: "Mengapa UNLUPA terasa berbeda dari aplikasi belajar lain?",
    answer: (
      <>
        <p className="mb-4">
          Karena UNLUPA tidak dibangun untuk: kejar angka, kejar streak, atau
          kejar badge.
        </p>
        <div className="faq-quote">
          UNLUPA dibangun untuk satu niat: Ilmu tidak menjadi kenangan.
        </div>
      </>
    ),
    group: "gold",
  },
  {
    question: "Bagaimana UNLUPA menyikapi kesalahan dan lupa?",
    answer: (
      <>
        <p className="mb-4">
          Lupa adalah bagian dari belajar, bukan kesalahan.
        </p>
        <p className="mb-4">
          UNLUPA tidak menilai Anda dari seberapa sering lupa, seberapa lama
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

  {
    question: "Bagaimana peran guru dalam UNLUPA?",
    answer: (
      <>
        <p>
          Guru berperan sebagai pembuat kelas, penyusun kitab & materi, pengamat
          perkembangan murid, dan pembimbing (bukan sekadar pengontrol hafalan).
        </p>
        <p className="mt-2">
          UNLUPA membantu guru melihat progres nyata, bukan menambah beban
          administrasi.
        </p>
      </>
    ),
    group: "blue",
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
