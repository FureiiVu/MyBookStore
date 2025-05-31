import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/homePage";
import AuthCallbackPage from "./pages/auth-callback/authCallbackPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
      </Routes>
    </>
  );
}
