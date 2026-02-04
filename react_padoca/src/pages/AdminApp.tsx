import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, Truck, Package, X, AlignJustify,
  LogOut, Sun, Moon, ChefHat, Tag, Calendar, type LucideIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importação dos Módulos
import { DashboardGestor } from '../modules/dashboard/DashboardGestor';
import { GestaoFuncionarios } from '../modules/funcionarios/GestaoFuncionarios';
import { GestaoMercado } from '../modules/mercado/GestaoMercado';
import { OrderBoard } from '../modules/pedidos/OrderBoard';
import { RegistrarEncomenda } from '../modules/encomendas/RegistrarEncomenda';
import { AgendaEncomendas } from '../modules/encomendas/AgendaEncomendas';
import { GestaoCategorias } from '../modules/categorias/GestaoCategorias';

// --- COMPONENTE EXTRAÍDO: CONTEÚDO DA SIDEBAR ---
interface SidebarProps {
    viewMode: 'gestor' | 'cozinha' | 'balcao';
    abaAtiva: string;
    onTabChange: (aba: string) => void;
    onLogout: () => void;
    menuItems: Array<{ id: string, label: string, icon: LucideIcon }>;
}

const SidebarContent = ({ viewMode, abaAtiva, onTabChange, onLogout, menuItems }: SidebarProps) => (
    <>
        <div className="flex items-center gap-3 px-2 mb-6">
            <div className="bg-amber-500 p-2 rounded-xl text-white"><ChefHat size={24} /></div>
            <div>
                <h1 className="font-bold text-lg text-stone-800 dark:text-stone-100">Padoca Admin</h1>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{viewMode}</p>
            </div>
        </div>

        <nav className="flex-grow space-y-1">
            {menuItems.map(item => (
                <button 
                    key={item.id} 
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${abaAtiva === item.id ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                >
                    <item.icon size={20}/> {item.label}
                </button>
            ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-stone-100 dark:border-stone-800">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium">
                <LogOut size={20}/> Sair
            </button>
        </div>
    </>
);

export default function AdminApp() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'gestor' | 'cozinha' | 'balcao'>('gestor'); 
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Define os itens do menu com base no perfil (viewMode)
  const menuItems = useMemo(() => {
      if (viewMode === 'gestor') {
          return [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
              { id: 'encomendas', label: 'Nova Encomenda', icon: Package },
              { id: 'agenda', label: 'Agenda', icon: Calendar },
              { id: 'mercado', label: 'Estoque', icon: Truck },
              { id: 'categorias', label: 'Categorias', icon: Tag },
              { id: 'funcionarios', label: 'Equipe', icon: Users },
          ];
      }
      if (viewMode === 'cozinha') {
          return [
              { id: 'pedidos', label: 'Fila de Pedidos', icon: ChefHat },
              { id: 'agenda', label: 'Agenda Encomendas', icon: Calendar },
          ];
      }
      return [ // Balcão
          { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
          { id: 'encomendas', label: 'Registrar Encomenda', icon: Package },
          { id: 'agenda', label: 'Ver Agenda', icon: Calendar },
      ];
  }, [viewMode]);

  // Função centralizada para troca de abas
  const handleTabChange = (aba: string) => {
      setAbaAtiva(aba);
      setIsMobileMenuOpen(false); // Fecha menu mobile ao navegar
  };

  const handleLogout = () => {
      if (confirm("Deseja realmente sair?")) {
          localStorage.removeItem('padoca_token');
          localStorage.removeItem('padoca_user');
          navigate('/login');
      }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300 flex">
        
        {/* SIDEBAR MOBILE */}
        <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-stone-900 shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-out transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-end mb-2"><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-500"><X size={24}/></button></div>
            <SidebarContent viewMode={viewMode} abaAtiva={abaAtiva} onTabChange={handleTabChange} onLogout={handleLogout} menuItems={menuItems} />
        </aside>

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:flex w-72 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 p-6 flex-col fixed h-full z-20">
            <SidebarContent viewMode={viewMode} abaAtiva={abaAtiva} onTabChange={handleTabChange} onLogout={handleLogout} menuItems={menuItems} />
        </aside>

        {/* MAIN CONTENT */}
        <main className="w-full md:ml-72 flex-grow p-4 md:p-8 pt-20 md:pt-8 max-w-[1600px] mx-auto">
            
            {/* Header Mobile / Desktop Controls */}
            <div className="flex justify-between items-center mb-8 md:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white dark:bg-stone-800 rounded-xl shadow-sm text-stone-600"><AlignJustify size={24}/></button>
                <div className="flex gap-2">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-white dark:bg-stone-800 rounded-xl shadow-sm text-amber-500">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
                </div>
            </div>

            {/* Conteúdo Dinâmico */}
            <div className="animate-fade-in">
                {viewMode === 'gestor' && (
                    <>
                        {abaAtiva === 'dashboard' && <DashboardGestor />}
                        {abaAtiva === 'funcionarios' && <GestaoFuncionarios />}
                        {abaAtiva === 'mercado' && <GestaoMercado />}
                        {abaAtiva === 'categorias' && <GestaoCategorias />}
                    </>
                )}

                {(viewMode === 'gestor' || viewMode === 'balcao' || viewMode === 'cozinha') && (
                    <>
                        {abaAtiva === 'pedidos' && <OrderBoard viewMode={viewMode} />}
                        {abaAtiva === 'agenda' && <AgendaEncomendas />}
                    </>
                )}

                {(viewMode === 'gestor' || viewMode === 'balcao') && (
                    <>
                        {abaAtiva === 'encomendas' && <RegistrarEncomenda />}
                    </>
                )}
            </div>

            {/* Simulação de troca de perfil (Apenas Dev) */}
            <div className="fixed bottom-4 right-4 bg-stone-800 text-white p-4 rounded-xl shadow-2xl opacity-50 hover:opacity-100 transition-opacity text-xs hidden md:block">
                <p className="mb-2 font-bold uppercase tracking-widest">Modo de Visualização</p>
                <div className="flex gap-2">
                    <button onClick={() => setViewMode('gestor')} className={`px-3 py-1 rounded border ${viewMode === 'gestor' ? 'bg-amber-500 border-amber-500' : 'border-stone-600'}`}>Gestor</button>
                    <button onClick={() => setViewMode('cozinha')} className={`px-3 py-1 rounded border ${viewMode === 'cozinha' ? 'bg-amber-500 border-amber-500' : 'border-stone-600'}`}>Cozinha</button>
                    <button onClick={() => setViewMode('balcao')} className={`px-3 py-1 rounded border ${viewMode === 'balcao' ? 'bg-amber-500 border-amber-500' : 'border-stone-600'}`}>Balcão</button>
                </div>
            </div>

        </main>
      </div>
    </div>
  );
}