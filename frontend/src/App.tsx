import { Routes, Route } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

import HomePage from "./pages/home/homePage";
import BookDetail from "./pages/home/bookDetail";
import AuthCallbackPage from "./pages/auth-callback/authCallbackPage";
import MainLayout from "./layout/mainLayout";
import CartPage from "./pages/home/cartPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpFallbackRedirectUrl={"/auth-callback"}
            />
          }
        />

        <Route path="/auth-callback" element={<AuthCallbackPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/book-detail/:id" element={<BookDetail />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>
    </>
  );
}
