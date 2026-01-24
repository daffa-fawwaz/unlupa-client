import { LoginPage } from "@/pages/auth/LoginPage";
import { createBrowserRouter } from "react-router";
import App from "./App";
import { LandingLayout } from "../layouts/LandingLayout";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProtectedRoute } from "@/shared/guard/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // LANDING
      {
        element: <LandingLayout />,
        children: [{ index: true, element: <LandingPage /> }],
      },

      // AUTH
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },

      // DASHBOARD
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: "/dashboard", element: <DashboardPage /> }],
          },
        ],
      },
    ],
  },
]);
