import "@/styles/landing.css"
import { LandingFooter } from "@/features/landing/components/footer/LandingFooter";
import { LandingNavbar } from "@/features/landing/components/navbar/LandingNavbar";
import { Outlet } from "react-router";

export const LandingLayout = () => {
  return (
    <>
      <div className="min-h-screen max-w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
        <LandingNavbar />
        <Outlet />
        <LandingFooter />
      </div>
    </>
  );
};
