export const LandingFooter = () => {
  return (
    <footer className="py-12 bg-[#0f0720] border-t border-white/5 text-center">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
          <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
            <img
              src="/unlupa.logo.png"
              alt="UNLUPA Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-white">UNLUPA</span>
        </div>
        <p className="text-purple-200/40 text-sm">
          &copy; {new Date().getFullYear()} UNLUPA. Dibuat untuk penuntut ilmu.
        </p>
      </div>
    </footer>
  );
};
