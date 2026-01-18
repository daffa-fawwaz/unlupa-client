export const RegisterLoading = () => {
  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-[#0f141e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden transition-all duration-500 mx-auto">
        <div
          id="state-loading"
          className="state-view text-center py-10 flex flex-col items-center justify-center w-full"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-amber-500/50 to-transparent"></div>
          <div className="cosmic-loader mb-6"></div>

          <h3 className="font-mono text-amber-500 text-xs uppercase tracking-widest mb-4 animate-pulse">
            Processing Request
          </h3>

          <h2 className="font-serif text-2xl text-white mb-4">
            Menyiapkan Ruang Belajar Anda...
          </h2>

          <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs mx-auto">
            Kami sedang menyiapkan ruang pribadi agar proses belajar Anda tetap
            tenang dan terarah.
          </p>

          <p className="text-gray-600 text-xs mt-8">
            Ini hanya memerlukan beberapa detik.
          </p>
        </div>
      </div>
    </div>
  );
};
