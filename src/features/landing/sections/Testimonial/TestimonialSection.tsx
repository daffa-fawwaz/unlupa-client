import { Activity } from "lucide-react";

export const TestimonialSection = () => {
  const logsLeft = [
    {
      initial: "A",
      name: "Abdullah F.",
      role: "Hafalan Terjaga",
      text: '"Dengan UNLUPA, rasa cemas hilang. Saya tahu persis mana ayat yang kuat, mana yang butuh perhatian."',
      roleClass: "role-emerald",
      avatarColor: "text-emerald-400",
    },
    {
      initial: "H",
      name: "dr. Hasan",
      role: "Padat tapi Lancar",
      text: '"Jadwal praktik padat sering bikin hafalan lepas. Sistem ini menjaga saya tetap murajaah di sela-sela pasien."',
      roleClass: "role-teal",
      avatarColor: "text-teal-400",
    },
    {
      initial: "R",
      name: "Rina S.",
      role: "Fokus Akademik",
      text: '"Fitur Load Control menyelamatkan semester saya. Bisa belajar banyak materi kedokteran tanpa burnout."',
      roleClass: "role-blue",
      avatarColor: "text-blue-400",
    },
    {
      initial: "Z",
      name: "Zainab",
      role: "Bisnis & Quran",
      text: '"Bisnis jalan, hafalan aman. Notifikasi cerdasnya tahu kapan saya harus berhenti meeting sejenak untuk murajaah."',
      roleClass: "role-purple",
      avatarColor: "text-purple-400",
    },
  ];

  const logsRight = [
    {
      initial: "U",
      name: "Ust. Hidayat",
      role: "Monitoring Santri",
      text: '"Saya bisa memantau perkembangan santri secara real-time. Tidak ada lagi tebak-tebakan siapa yang lancar."',
      roleClass: "role-amber",
      avatarColor: "text-amber-400",
    },
    {
      initial: "D",
      name: "Dimas A.",
      role: "Efisiensi Waktu",
      text: '"Sebagai orang teknis, saya kagum. Tombol feedback kejujurannya benar-benar memaksa disiplin, hasilnya efisien."',
      roleClass: "role-purple",
      avatarColor: "text-purple-400",
    },
    {
      initial: "S",
      name: "Sarah M.",
      role: "Daily Routine",
      text: "\"Fitur 'Daily Review' membuat saya tidak perlu mikir 'hari ini harus ulang apa'. Tinggal buka, kerjakan, selesai.\"",
      roleClass: "role-blue",
      avatarColor: "text-blue-400",
    },
    {
      initial: "F",
      name: "Fajar",
      role: "Mutqin Target",
      text: "\"Akhirnya hafalan saya tidak 'bocor halus' lagi. Sistem ini menjaga apa yang sudah saya hafal agar tidak hilang.\"",
      roleClass: "role-red",
      avatarColor: "text-red-400",
    },
  ];

  return (
    <section
      id="social-proof"
      className="relative w-full py-32 z-10 overflow-hidden"
    >
      {/* Connector */}
      <div className="connector-vertical"></div>

      {/* HEADER */}
      <div className="text-center mb-20 px-6 animate-fade-in-up">
        <p className="font-mono text-amber-500 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 flex items-center justify-center gap-2">
          <Activity className="w-3 h-3" /> Live Data Logs
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 leading-tight tracking-wide">
          Gema{" "}
          <span className="text-amber-500 font-cinzel text-glow">Penjaga</span>
        </h2>
        <p className="text-gray-400 font-light text-sm md:text-base tracking-wide max-w-2xl mx-auto">
          Arus data dari mereka yang telah mengubah "kecemasan" menjadi
          "ketenangan". <br />
          <span className="text-xs text-gray-500 mt-2 block italic">
            (Sentuh kartu untuk membaca)
          </span>
        </p>
      </div>

      {/* ROW 1: MOVING LEFT */}
      <div className="scroller mb-8" data-direction="left">
        <div className="scroller__inner">
          {[...logsLeft, ...logsLeft].map((log, index) => (
            <div
              key={`left-${index}`}
              className={`log-card ${log.roleClass} p-6 rounded-xl`}
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="avatar-box">{log.initial}</div>
                <div>
                  <h4 className="text-white font-serif text-base tracking-wide">
                    {log.name}
                  </h4>
                  <p
                    className={`text-[10px] ${log.avatarColor} font-mono uppercase tracking-widest mt-1`}
                  >
                    {log.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 font-light text-sm leading-relaxed">
                {log.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2: MOVING RIGHT */}
      <div className="scroller" data-direction="right">
        <div className="scroller__inner">
          {[...logsRight, ...logsRight].map((log, index) => (
            <div
              key={`right-${index}`}
              className={`log-card ${log.roleClass} p-6 rounded-xl`}
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="avatar-box">{log.initial}</div>
                <div>
                  <h4 className="text-white font-serif text-base tracking-wide">
                    {log.name}
                  </h4>
                  <p
                    className={`text-[10px] ${log.avatarColor} font-mono uppercase tracking-widest mt-1`}
                  >
                    {log.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 font-light text-sm leading-relaxed">
                {log.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
