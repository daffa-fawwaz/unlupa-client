import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Filter,
  RefreshCw,
  Menu,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { useState } from "react";

export const TeacherRequestPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="relative min-h-screen bg-deep-universe text-white font-primary max-w-7xl mx-auto p-6 md:p-10">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar Integration */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile sidebar */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="relative z-10 space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 transition text-amber-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          <p className="text-sm font-mono tracking-widest md:inline">
            MENU
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <User className="w-5 h-5 text-amber-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide">
                TEACHER <span className="text-amber-400">REQUESTS</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm max-w-lg">
              Manage incoming applications from users who want to become
              teachers on the platform. Review their details and approve or
              reject them.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-gray-400 hover:text-white group"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 group-hover:text-amber-500" />
            </button>

            <div className="relative group">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-amber-500 transition" />
              <select className="pl-10 pr-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer hover:bg-white/10 transition min-w-[160px] font-medium">
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <Clock className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-amber-500/80 mb-2 uppercase tracking-wider">
                Pending Review
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">Awaiting decision</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <CheckCircle className="w-32 h-32 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-emerald-500/80 mb-2 uppercase tracking-wider">
                Approved
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">New teachers joined</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition transform group-hover:scale-110 duration-500">
              <XCircle className="w-32 h-32 text-rose-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-rose-500/80 mb-2 uppercase tracking-wider">
                Rejected
              </p>
              <h3 className="text-4xl font-display font-bold text-white">
                {0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Applications declined
              </p>
            </div>
          </div>
        </div>

        {/* Requests Table (Desktop) */}
        <div className="hidden md:block glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-display font-semibold text-white">
              Recent Applications
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-400 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Empty State */}
                <tr className="hover:bg-white/5 transition">
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-white/5 border border-white/10">
                        <User className="w-12 h-12 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-display font-semibold text-white">
                        No Applications Yet
                      </h3>
                      <p className="text-gray-500 text-sm max-w-md">
                        Once users apply to become teachers, their requests will
                        appear here for review.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Requests List (Mobile) - Empty State Only for now per static code */}
        <div className="md:hidden glass-panel rounded-2xl border border-white/5 p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              <User className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">
              No Applications Yet
            </h3>
            <p className="text-gray-500 text-sm max-w-md">
              Once users apply to become teachers, their requests will appear
              here for review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
