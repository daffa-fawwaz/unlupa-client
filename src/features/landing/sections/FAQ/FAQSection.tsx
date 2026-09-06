import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "Apa sebenarnya UNLUPA itu?",
    answer: (
      <>
        <p className="mb-4">UNLUPA adalah platform pembelajaran yang dirancang untuk menjaga ilmu agar tidak hilang setelah dipelajari.</p>
        <p>Bukan hanya membantu memahami hari ini, tetapi memastikan hafalan, pemahaman, dan pelajaran tetap hidup dalam jangka panjang.</p>
      </>
    ),
  },
  {
    question: "Masalah apa yang ingin diselesaikan oleh UNLUPA?",
    answer: (
      <>
        <p className="mb-4">Banyak orang belajar, menghafal, dan mengikuti kelas — tetapi setelah beberapa waktu, ilmu itu hilang, kabur, atau tinggal kenangan.</p>
        <p className="mb-4">UNLUPA hadir untuk menjawab satu masalah inti:</p>
        <div className="border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r-md italic text-foreground">“Bagaimana ilmu yang sudah dipelajari bisa bertahan, bukan hanya lewat?”</div>
      </>
    ),
  },
  {
    question: "Apa yang membedakan UNLUPA dari aplikasi belajar lain?",
    answer: (
      <>
        <p className="mb-4">Sebagian besar aplikasi fokus pada: menyelesaikan materi, mengejar target, atau lulus ujian.</p>
        <p className="mb-4">UNLUPA fokus pada satu hal yang sering dilupakan:</p>
        <div className="border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r-md italic text-foreground">“Apakah ilmu itu masih hidup setelah dipelajari?”</div>
        <p className="mt-4">UNLUPA menggunakan sistem peninjauan ilmiah agar ilmu tidak tenggelam oleh waktu.</p>
      </>
    ),
  },
  {
    question: "Mengapa UNLUPA terasa berbeda dari aplikasi belajar lain?",
    answer: (
      <>
        <p className="mb-4">Karena UNLUPA tidak dibangun untuk: kejar angka, kejar streak, atau kejar badge.</p>
        <div className="border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r-md italic text-foreground">UNLUPA dibangun untuk satu niat: Ilmu tidak menjadi kenangan.</div>
      </>
    ),
  },
  {
    question: "Bagaimana UNLUPA menyikapi kesalahan dan lupa?",
    answer: (
      <>
        <p className="mb-4">Lupa adalah bagian dari belajar, bukan kesalahan.</p>
        <p className="mb-4">UNLUPA tidak menilai Anda dari seberapa sering lupa, seberapa lama berhenti, atau seberapa cepat menguasai.</p>
        <div className="border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r-md italic text-foreground">Yang diperhatikan hanyalah: Bagaimana kondisi hafalan Anda saat ini, berdasarkan respon Anda sendiri.</div>
      </>
    ),
  },
  {
    question: "Bagaimana peran guru dalam UNLUPA?",
    answer: (
      <>
        <p>Guru berperan sebagai pembuat kelas, penyusun kitab &amp; materi, pengamat perkembangan murid, dan pembimbing (bukan sekadar pengontrol hafalan).</p>
        <p className="mt-2">UNLUPA membantu guru melihat progres nyata, bukan menambah beban administrasi.</p>
      </>
    ),
  },
];

export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <section className="relative w-full max-w-3xl mx-auto px-6 py-24">
      {/* HEADER */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-px h-8 bg-gradient-to-b from-transparent to-primary"></span>
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">Pusat Informasi</span>
          <span className="w-px h-8 bg-gradient-to-b from-transparent to-primary"></span>
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6 leading-tight">
          Pertanyaan yang Sering <br /> <span className="text-primary italic">Ditanyakan</span>
        </h2>
        <p className="text-muted-foreground font-light text-sm tracking-wide">Jawaban untuk keraguan Anda yang ingin belajar dengan serius.</p>
      </div>

      {/* FAQ CONTAINER */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={faq.question} className={`bg-card border rounded-xl overflow-hidden transition-colors ${activeIndex === index ? "border-primary/30" : "border-border hover:border-border/80"}`}>
            <button onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
              <h3 className="font-serif text-base md:text-lg text-foreground pr-4">{faq.question}</h3>
              <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${activeIndex === index ? "rotate-180 text-primary" : ""}`} />
            </button>
            <div className="grid transition-all duration-300" style={{ gridTemplateRows: activeIndex === index ? "1fr" : "0fr", opacity: activeIndex === index ? 1 : 0 }}>
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed font-light">{faq.answer}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
