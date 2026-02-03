import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, ShoppingBasket, Tags, ChefHat, Moon, Sun, LogOut, 
  ClipboardList, UtensilsCrossed, Coffee, PlusCircle, BookOpen,
  AlignJustify, X, Users
} from "lucide-react"; 

// Componentes
import { DashboardGestor } from "../modules/dashboard/DashboardGestor";
import { GestaoMercado } from "../modules/mercado/GestaoMercado";
import { GestaoCategorias } from "../modules/categorias/GestaoCategorias";
import { GestaoFuncionarios } from "../modules/funcionarios/GestaoFuncionarios"; // Importado
import { OrderBoard } from "../modules/pedidos/OrderBoard";
import { RegistrarEncomenda } from "../modules/encomendas/RegistrarEncomenda";
import { AgendaEncomendas } from "../modules/encomendas/AgendaEncomendas";

export default function AdminApp() {
  const [viewMode, setViewMode] = useState<'gestor' | 'equipe'>('gestor');
  const [abaAtiva, setAbaAtiva] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [abaAtiva, viewMode]);

  const menuItems = useMemo(() => {
    if (viewMode === 'gestor') {
        return [
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'mercado', label: 'Estoque Mercado', icon: ShoppingBasket },
            { id: 'categorias', label: 'Categorias', icon: Tags },
            { id: 'funcionarios', label: 'Funcionários', icon: Users }, // Nova Opção
        ];
    } else {
        return [
            { id: 'pedidos', label: 'Pedidos de Balcão', icon: ClipboardList },
            { id: 'padaria', label: 'Itens Padaria', icon: Coffee },
            { id: 'almoco', label: 'Cardápio Almoço', icon: UtensilsCrossed },
            { id: 'mercado', label: 'Mercado', icon: ShoppingBasket },
            { id: 'nova-encomenda', label: 'Nova Encomenda', icon: PlusCircle },
            { id: 'agenda', label: 'Agenda Encomendas', icon: BookOpen },
        ];
    }
  }, [viewMode]);

  const toggleViewMode = (mode: 'gestor' | 'equipe') => {
      setViewMode(mode);
      setAbaAtiva(mode === 'gestor' ? 'dashboard' : 'pedidos');
  };

  const SidebarContent = () => (
      <>
        <div className="flex items-center gap-3 px-2 mb-6">
            <div className="bg-stone-800 dark:bg-amber-600 p-2 rounded-xl text-white shadow-lg"><ChefHat size={24} /></div>
            <div><h1 className="text-lg font-bold">Padoca Admin</h1><p className="text-xs text-stone-500">Gestão 2.0</p></div>
        </div>

        <div className="bg-stone-200 dark:bg-stone-800 p-1.5 rounded-xl flex border border-stone-300 dark:border-stone-700 mb-6">
            <button onClick={() => toggleViewMode('equipe')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${viewMode === 'equipe' ? 'bg-white text-blue-600' : 'text-stone-500 hover:text-stone-700'}`}>Equipe</button>
            <button onClick={() => toggleViewMode('gestor')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${viewMode === 'gestor' ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}>Gestor</button>
        </div>

        <nav className="space-y-1 flex-grow overflow-y-auto custom-scrollbar pr-2">
            {menuItems.map(item => (
                <button key={item.id} onClick={() => setAbaAtiva(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all active:scale-95 ${abaAtiva === item.id ? (viewMode === 'gestor' ? 'bg-stone-800 text-white shadow-xl dark:bg-amber-600' : 'bg-blue-600 text-white shadow-xl') : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:translate-x-1'}`}>
                    <item.icon size={20}/> {item.label}
                </button>
            ))}
        </nav>

        <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4 mt-auto">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs font-bold hover:bg-stone-100 transition-colors">{isDarkMode ? <Sun size={14}/> : <Moon size={14}/>} Tema</button>
            <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold transition-colors"><LogOut size={14}/> Sair</button>
        </div>
      </>
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-500 flex flex-col md:flex-row">
        
        <header className="md:hidden fixed top-0 w-full z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 h-16 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"><AlignJustify size={24}/></button>
                <div className="flex items-center gap-2"><div className="bg-stone-800 dark:bg-amber-600 p-1.5 rounded-lg text-white"><ChefHat size={18} /></div><h1 className="text-sm font-bold">Padoca Admin</h1></div>
            </div>
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">IV</div></div>
        </header>

        <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}/>
        <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-stone-900 shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-out transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-end mb-2"><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-500"><X size={24}/></button></div>
            <SidebarContent />
        </aside>

        <aside className="hidden md:flex w-72 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 p-6 flex-col fixed h-full z-20"><SidebarContent /></aside>

        <main className="w-full md:ml-72 flex-grow p-4 md:p-8 pt-20 md:pt-8 max-w-[1600px] mx-auto">
            {viewMode === 'gestor' && (
                <div className="animate-fade-in">
                    {abaAtiva === "dashboard" && <DashboardGestor />}
                    {abaAtiva === "mercado" && <GestaoMercado />}
                    {abaAtiva === "categorias" && <GestaoCategorias />}
                    {abaAtiva === "funcionarios" && <GestaoFuncionarios />}
                </div>
            )}
            {viewMode === 'equipe' && (
                <div className="animate-fade-in">
                    {abaAtiva === "pedidos" && <OrderBoard />}
                    {(abaAtiva === "padaria" || abaAtiva === "almoco" || abaAtiva === "mercado") && <GestaoMercado />}
                    {abaAtiva === "nova-encomenda" && <RegistrarEncomenda />}
                    {abaAtiva === "agenda" && <AgendaEncomendas />}
                </div>
            )}
        </main>

      </div>
    </div>
  );
}