import { LoginPage } from "@/pages/auth/LoginPage";
import { createBrowserRouter } from "react-router";
import App from "./App";
import { LandingLayout } from "../layouts/LandingLayout";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ProtectedRoute } from "@/components/guard/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardShell } from "@/features/dashboard/DashboardShell";
import { NotFoundPage } from "@/pages/404/NotFoundPage";
import { TeacherRequestPage } from "@/features/dashboard/admin/pages/TeacherRequestPage";
import { UserListPage } from "@/features/dashboard/admin/pages/UserListPage";
import { AlquranPage } from "@/pages/alquran/AlquranPage";
import { ComingSoonRoomPage } from "@/pages/dashboard/ComingSoonRoomPage";
import { StatusItemsByJuzPage } from "@/features/alquran/pages/StatusItemsByJuzPage";
import { StatusItemsView } from "@/features/alquran/pages/StatusItemsView";
import { PersonalPage } from "@/pages/personal/PersonalPage";

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
        element: (
          <ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />
        ),
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "/dashboard", element: <DashboardShell /> },
              { path: "/dashboard/alquran", element: <AlquranPage /> },
              { path: "/dashboard/pribadi", element: <PersonalPage /> },
              { path: "/dashboard/kelas", element: <ComingSoonRoomPage /> },
              // Status-based item pages
              {
                path: "/dashboard/alquran/status/:status",
                element: <StatusItemsByJuzPage />,
              },
              {
                path: "/dashboard/alquran/status/:status/:juzId",
                element: <StatusItemsView />,
              },
              {
                element: <ProtectedRoute allowedRoles={["admin"]} />,
                children: [
                  {
                    path: "/dashboard/teacher-requests",
                    element: <TeacherRequestPage />,
                  },
                  {
                    path: "/dashboard/user-list",
                    element: <UserListPage />,
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
