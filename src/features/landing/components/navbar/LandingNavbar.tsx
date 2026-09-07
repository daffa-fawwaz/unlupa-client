import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 border-b transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-border" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="w-10 h-10 rounded border border-border flex items-center justify-center bg-muted overflow-hidden">
              <img
                src="/unlupa.logo.png"
                alt="UNLUPA Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <span className="font-display tracking-widest text-xl font-bold text-foreground">
            UNLUPA
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-12 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {["Metode", "Fitur", "Biaya"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative font-mono uppercase text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full opacity-50"></span>
            </a>
          ))}
        </div>

        {/* Right: Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Pendaftaran
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {["Metode", "Fitur", "Biaya"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-base font-medium text-muted-foreground hover:text-foreground py-2 border-b border-border transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="w-full flex justify-center items-center py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
