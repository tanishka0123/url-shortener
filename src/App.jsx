import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Applayout from "./layouts/Applayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Link from "./pages/Link";
import RedirectLinks from "./pages/RedirectLinks";
import UrlProvider from "./Context";
import RequireAuth from "./components/RequireAuth";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    element: <Applayout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <Link />
          </RequireAuth>
        ),
      },
      {
        path: "/:id",
        element: <RedirectLinks />,
      },
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
