import "@/App.css";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Outlet />
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}

export default App;
