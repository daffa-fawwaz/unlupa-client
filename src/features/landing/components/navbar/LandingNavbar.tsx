import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-[#0f0720]/80 backdrop-blur-xl border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="w-10 h-10 rounded border border-amber-500/30 flex items-center justify-center bg-white/5 overflow-hidden">
              <img
                src="/unlupa.logo.png"
                alt="UNLUPA Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <span className="font-display tracking-widest text-xl font-bold text-white">
            UNLUPA
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-12 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {["Metode", "Fitur", "Biaya"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative font-mono uppercase text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 tracking-wide group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full opacity-50"></span>
            </a>
          ))}
        </div>

        {/* Right: Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="relative px-6 py-2 rounded-lg border text-sm font-medium text-white overflow-hidden group transition-all duration-300 bg-white/10 border-primary/30 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
          >
            <span className="relative z-10">Pendaftaran</span>
            <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0f0720]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {["Metode", "Fitur", "Biaya"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-base font-medium text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <button className="w-full py-3 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors">
              Masuk
            </button>
            <button className="w-full py-3 rounded-lg bg-primary/20 border border-primary/30 text-white font-medium text-sm hover:bg-primary/30 transition-all shadow-[0_0_15px_rgba(124,58,237,0.1)]">
              Pendaftaran
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
