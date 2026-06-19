import "@/App.css";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Outlet />
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
      />
    </>
  );
}

export default App;
