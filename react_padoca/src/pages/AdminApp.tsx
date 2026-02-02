import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, ShoppingBasket, Tags, ChefHat, Moon, Sun, LogOut, 
  ClipboardList, UtensilsCrossed 
} from "lucide-react"; 

import { DashboardGestor } from "../modules/dashboard/DashboardGestor";
import { GestaoMercado } from "../modules/mercado/GestaoMercado";
import { GestaoCategorias } from "../modules/categorias/GestaoCategorias";
import { OrderBoard } from "../modules/pedidos/OrderBoard";

export default function AdminApp() {
  const [viewMode, setViewMode] = useState<'gestor' | 'equipe'>('gestor');
  const [abaAtiva, setAbaAtiva] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const menuItems = useMemo(() => {
    if (viewMode === 'gestor') {
        return [
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'mercado', label: 'Estoque', icon: ShoppingBasket },
            { id: 'categorias', label: 'Categorias', icon: Tags },
        ];
    } else {
        return [
            { id: 'pedidos', label: 'Cozinha', icon: ClipboardList },
            { id: 'estoque-rapido', label: 'Estoque Rápido', icon: UtensilsCrossed },
        ];
    }
  }, [viewMode]);

  const toggleViewMode = (mode: 'gestor' | 'equipe') => {
      setViewMode(mode);
      setAbaAtiva(mode === 'gestor' ? 'dashboard' : 'pedidos');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-500 flex">
        <aside className="w-72 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 p-6 flex flex-col gap-6 fixed h-full z-20">
            <div className="flex items-center gap-3 px-2">
                <div className="bg-stone-800 dark:bg-amber-600 p-2 rounded-xl text-white shadow-lg"><ChefHat size={24} /></div>
                <div><h1 className="text-lg font-bold">Padoca Admin</h1><p className="text-xs text-stone-500">Gestão 2.0</p></div>
            </div>

            <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-xl flex border border-stone-200 dark:border-stone-700">
                <button onClick={() => toggleViewMode('equipe')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'equipe' ? 'bg-white shadow-sm text-blue-600' : 'text-stone-400'}`}>Equipe</button>
                <button onClick={() => toggleViewMode('gestor')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'gestor' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}>Gestor</button>
            </div>

            <nav className="space-y-1 flex-grow">
                {menuItems.map(item => (
                    <button key={item.id} onClick={() => setAbaAtiva(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all active:scale-95 ${abaAtiva === item.id ? 'bg-stone-800 text-white shadow-xl' : 'text-stone-500 hover:bg-stone-50'}`}>
                        <item.icon size={20}/> {item.label}
                    </button>
                ))}
            </nav>

            <div className="space-y-2">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-stone-100 text-xs font-bold">
                    {isDarkMode ? <Sun size={14}/> : <Moon size={14}/>} Tema
                </button>
                <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-red-500 hover:bg-red-50 text-xs font-bold">
                    <LogOut size={14}/> Sair
                </button>
            </div>
        </aside>

        <main className="ml-72 flex-grow p-8 w-full max-w-[1600px] mx-auto">
            {viewMode === 'gestor' && (
                <>
                    {abaAtiva === "dashboard" && <DashboardGestor />}
                    {abaAtiva === "mercado" && <GestaoMercado />}
                    {abaAtiva === "categorias" && <GestaoCategorias />}
                </>
            )}
            {viewMode === 'equipe' && (
                <>
                    {abaAtiva === "pedidos" && <OrderBoard />}
                    {abaAtiva === "estoque-rapido" && <GestaoMercado />}
                </>
            )}
        </main>
      </div>
    </div>
  );
}