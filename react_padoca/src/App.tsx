import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importação das Páginas
import { Login } from "./pages/Login";
import ClientApp from "./pages/ClientApp"; // O App do Cliente (Cardápio, etc)
import AdminApp from "./pages/AdminApp";   // O Painel Administrativo (Gestor/Equipe)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Inicial: Tela de Login */}
        <Route path="/" element={<Login />} />

        {/* Rota do Cliente (o "iFood" da Padoca) */}
        <Route path="/app" element={<ClientApp />} />

        {/* Rota Administrativa (Gestor e Funcionários) */}
        <Route path="/admin" element={<AdminApp />} />

        {/* Qualquer rota desconhecida redireciona para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}