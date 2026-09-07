import { Link } from "react-router";

const exploreLinks = [
  { label: "Metode", href: "#metode" },
  { label: "Fitur", href: "#fitur" },
  { label: "Biaya", href: "#biaya" },
  { label: "Untuk Siapa", href: "#untuk-siapa" },
];

const aboutLinks = [
  { label: "Solusi", href: "#solution" },
  { label: "Gema Penjaga", href: "#social-proof" },
];

const startLinks = [
  { label: "Masuk", href: "/login" },
  { label: "Daftar", href: "/register" },
];

export const LandingFooter = () => {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="md:w-72 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded border border-border flex items-center justify-center overflow-hidden bg-muted">
                <img
                  src="/unlupa.logo.png"
                  alt="UNLUPA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display tracking-widest font-bold text-foreground">
                UNLUPA
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Dibuat untuk penuntut ilmu.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Jelajahi
              </p>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Tentang UNLUPA
              </p>
              <ul className="space-y-3">
                {aboutLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Mulai
              </p>
              <ul className="space-y-3">
                {startLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UNLUPA. Dibuat untuk penuntut ilmu.
          </p>
        </div>
      </div>
    </footer>
  );
};