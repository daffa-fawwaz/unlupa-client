export const LandingFooter = () => {
  return (
    <footer className="py-12 bg-[#0f0720] border-t border-white/5 text-center">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
          <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(147,51,234,0.5)]">
            B
          </div>
          <span className="font-bold text-white">BAQEN</span>
        </div>
        <p className="text-purple-200/40 text-sm">
          &copy; {new Date().getFullYear()} BAQEN. Dibuat untuk penuntut ilmu.
        </p>
      </div>
    </footer>
  );
};
