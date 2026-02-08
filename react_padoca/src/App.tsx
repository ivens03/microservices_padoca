import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./pages/Login";
import ClientApp from "./pages/ClientApp";
import AdminApp from "./pages/AdminApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/app" element={<ClientApp />} />

        <Route path="/admin" element={<AdminApp />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}