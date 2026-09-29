import "@/App.css";
import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { AppProvider, useApp } from "@/context/AppContext";

function AppShell() {
  const { theme } = useApp();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-primary text-primary transition-colors">
      <ScrollRestoration />
      <Outlet />
      <Toaster
        theme={theme}
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
