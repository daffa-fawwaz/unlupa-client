import { KeyRound, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

const ForgotPasswordForm = () => {
  return (
    <div className="w-full flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-10 shadow-sm relative overflow-hidden transition-all duration-500 mx-auto">
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

        {/* FORM VIEW */}
        <div id="state-form" className="animate-fade-in">
          <div className="text-center mb-8">
            <KeyRound className="w-10 h-10 text-primary mx-auto mb-4 opacity-80" />
            <h1 className="font-serif text-2xl text-foreground mb-3">
              Menemukan Akses Kembali
            </h1>

            <p className="text-foreground text-base font-medium mb-2">
              Tidak apa-apa lupa. <br />
              <span className="text-muted-foreground font-light text-sm">
                Ruang belajar Anda tetap aman dan utuh.
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
              Kami hanya perlu alamat email Anda untuk mengirimkan jalur aman
              kembali ke ruang belajar.
            </p>
          </div>

          <form id="recoveryForm" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6 relative">
              <label className="block font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="alamat@email.com"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Kirim Tautan Pemulihan
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-[10px] text-muted-foreground mb-4 italic">
              Anda tidak perlu terburu-buru. Kami menunggu dengan tenang.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[0.8rem] text-muted-foreground hover:text-primary transition-colors no-underline"
            >
              <ArrowLeft className="w-3 h-3" /> Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
