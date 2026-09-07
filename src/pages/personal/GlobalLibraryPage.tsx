import { GlobalLibraryDashboard } from "@/features/personal/components/GlobalLibraryDashboard";

export const GlobalLibraryPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative w-full overflow-hidden">
      <main className="flex-1 w-full relative z-10 lg:pl-16 transition-all duration-300">
        <GlobalLibraryDashboard />
      </main>
    </div>
  );
};
