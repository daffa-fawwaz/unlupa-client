import { ShareBooksDashboard } from "@/features/personal/components/ShareBooksDashboard";

export const ShareBooksPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col relative w-full overflow-hidden">
      <main className="flex-1 w-full mx-auto relative z-10 lg:pl-16 p-2 lg:p-4 transition-all duration-300">
        <ShareBooksDashboard />
      </main>
    </div>
  );
};
