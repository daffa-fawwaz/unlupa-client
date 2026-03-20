import { PersonalDashboard } from "@/features/personal/components/PersonalDashboard";

export const PersonalPage = () => {
  return (
    <div className="min-h-screen bg-deep-universe text-white font-sans selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative bg-deep-universe z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PersonalDashboard />
      </div>
    </div>
  );
};
