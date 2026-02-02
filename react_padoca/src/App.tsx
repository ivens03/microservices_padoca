import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { User, ChefHat, Store, ArrowRight } from "lucide-react";
import ClientApp from "./pages/ClientApp";
import AdminApp from "./pages/AdminApp";

function HomeSelection() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full text-center">
        <div className="mb-12 inline-block p-4 bg-amber-500 rounded-full text-white shadow-lg"><Store size={48}/></div>
        <h1 className="text-4xl font-bold text-stone-800 mb-12">Bem-vindo à Padoca</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/cliente" className="group bg-white p-10 rounded-[30px] shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-amber-400 flex flex-col items-center">
            <div className="bg-amber-100 p-6 rounded-full mb-6 group-hover:rotate-12 transition-transform text-amber-600"><User size={48}/></div>
            <h2 className="text-2xl font-bold mb-2">Sou Cliente</h2>
            <p className="text-stone-500 mb-6">Fazer pedidos e ver cardápio</p>
            <span className="flex items-center gap-2 font-bold text-amber-600">Acessar <ArrowRight size={16}/></span>
          </Link>

          <Link to="/admin" className="group bg-white p-10 rounded-[30px] shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-400 flex flex-col items-center">
            <div className="bg-blue-100 p-6 rounded-full mb-6 group-hover:-rotate-12 transition-transform text-blue-600"><ChefHat size={48}/></div>
            <h2 className="text-2xl font-bold mb-2">Sou Funcionário</h2>
            <p className="text-stone-500 mb-6">Área restrita de gestão</p>
            <span className="flex items-center gap-2 font-bold text-blue-600">Entrar <ArrowRight size={16}/></span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeSelection />} />
        <Route path="/cliente/*" element={<ClientApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}