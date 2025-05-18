import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./components/pages/home/index.tsx";
import LoginForm from "./components/pages/auth/LoginForm.tsx";
import RegisterForm from "./components/pages/auth/RegisterForm.tsx";
import "./index.css";
import Dashboard from "./components/pages/dashboard/index.tsx";
import Profile from "./components/pages/profile/index.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <ProtectedRoute requireAuth={false}>
        <RegisterForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireAuth={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute requireAuth={true}>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
