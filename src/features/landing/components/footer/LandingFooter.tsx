export const LandingFooter = () => {
  return (
    <footer className="py-12 bg-card border-t border-border text-center">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded border border-border flex items-center justify-center overflow-hidden bg-muted">
            <img src="/unlupa.logo.png" alt="UNLUPA Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-foreground">UNLUPA</span>
        </div>
        <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} UNLUPA. Dibuat untuk penuntut ilmu.</p>
      </div>
    </footer>
  );
};
