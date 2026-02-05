import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Menu, Utensils, Plus, Minus, Sun, Moon, 
  Coffee, Cake, Sandwich, ShoppingBasket, Wine, User, Clock,
  Gift, Star, Info, MessageCircle, Phone, Mail, Send, UtensilsCrossed, Search,
  Package, PenTool, X, AlignJustify, ChefHat, MapPin, Home, LogOut, Bell, Pencil, Settings
} from 'lucide-react';
import { ProdutoService, PedidoService, CategoriaService, UsuarioService, FeedbackService } from '../services/api';
import type { Produto, Categoria } from '../types';

interface CartItem extends Produto {
    qty: number;
}

// Imagem de placeholder segura (não usa internet externa)
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3ESem Foto%3C/text%3E%3C/svg%3E";

// --- Componente de Navegação ---
interface NavigationMenuProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const NavigationMenu = ({ activeTab, onTabChange }: NavigationMenuProps) => (
    <nav className="space-y-1">
        <button onClick={() => onTabChange('menu')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'menu' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <Menu size={20}/> Cardápio
        </button>
        <button onClick={() => onTabChange('almoco')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'almoco' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <UtensilsCrossed size={20}/> Almoço
        </button>
        <button onClick={() => onTabChange('mercado')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'mercado' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <ShoppingBasket size={20}/> Mercado
        </button>
        <button onClick={() => onTabChange('encomendas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'encomendas' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <Gift size={20}/> Encomendas
        </button>
        <button onClick={() => onTabChange('fidelidade')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'fidelidade' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <Star size={20}/> Fidelidade
        </button>
        <button onClick={() => onTabChange('pedidos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'pedidos' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <Clock size={20}/> Meus Pedidos
        </button>
        <button onClick={() => onTabChange('conta')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'conta' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <User size={20}/> Conta
        </button>
        <button onClick={() => onTabChange('sobre')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'sobre' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
            <Info size={20}/> Sobre
        </button>
    </nav>
);

const getIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if(n.includes('bebida')) return Coffee;
    if(n.includes('doce') || n.includes('confeitaria')) return Cake;
    if(n.includes('lanche') || n.includes('salgado')) return Sandwich;
    if(n.includes('mercado') || n.includes('mercearia')) return ShoppingBasket;
    if(n.includes('adega')) return Wine;
    return Menu;
}

export default function ClientApp() {
  const [activeTab, setActiveTab] = useState('menu'); 
  const [activeCategory, setActiveCategory] = useState<number | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [products, setProducts] = useState<Produto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [user, setUser] = useState({
      nome: "Carregando...",
      email: "...",
      telefone: "(Cadastre seu telefone)",
      membroDesde: "...",
      enderecos: [
          { id: 1, tipo: 'Casa', logradouro: 'Cadastre seu endereço', icone: Home }
      ],
      notificacoes: true
  });

  useEffect(() => {
    const init = async () => {
        try {
            const [p, c] = await Promise.all([
                ProdutoService.listarTodos(),
                CategoriaService.listar()
            ]);
            setProducts(p);
            setCategories(c);

            try {
                const usuarioReal = await UsuarioService.getMe();
                const dataMembro = new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

                setUser(prev => ({
                    ...prev,
                    nome: usuarioReal.nome,
                    email: usuarioReal.email,
                    membroDesde: dataMembro 
                }));
            } catch (authError) {
                console.warn("Usuário não logado ou token expirado.", authError);
            }

        } catch (e) {
            console.error("Erro de conexão com o Back-end:", e);
        }
    };
    init();
  }, []);

  const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      setActiveCategory('todos');
      setSearchTerm('');
      setIsMobileMenuOpen(false);
  };

  const addToCart = (product: Produto) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const checkout = async () => {
      if(cart.length === 0) return;
      try {
          await PedidoService.criar({
              cliente: user.nome, 
              tipo: "BALCAO", 
              itens: cart.map(i => ({ produtoId: i.id, quantidade: i.qty }))
          });
          alert("Pedido enviado para a cozinha com sucesso! 🍳");
          setCart([]);
          setIsCartOpen(false);
      } catch (error) {
          console.error(error);
          alert("Erro ao enviar pedido. Verifique se o Back-end está rodando.");
      }
  };

const handleFeedbackSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (rating === 0) {
          alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
          return;
      }

      try {
          // Chama o Back-end
          await FeedbackService.enviar({
              cliente: user.nome || "Cliente Anônimo",
              mensagem: feedbackMsg || "Sem mensagem",
              avaliacao: rating
          });

          alert(`Obrigado! Seu feedback de ${rating} estrelas foi enviado.`);
          
          // Limpa o formulário
          setRating(0);
          setHoverRating(0);
          setFeedbackMsg('');

      } catch (error) {
          console.error("Erro ao enviar feedback:", error);
          alert("Não foi possível enviar seu feedback. Tente novamente.");
      }
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.preco * item.qty), 0);

  const getFilteredProducts = () => {
      let filtered = products;

      // BLINDAGEM CONTRA NULOS AQUI
      if (activeTab === 'almoco') {
          filtered = products.filter(p => 
              p.categoria?.nome?.toLowerCase()?.includes('almoço') || 
              p.categoria?.nome?.toLowerCase()?.includes('prato')
          );
      } else if (activeTab === 'mercado') {
          filtered = products.filter(p => 
              p.categoria?.nome?.toLowerCase()?.includes('mercado') || 
              p.categoria?.nome?.toLowerCase()?.includes('mercearia') || 
              p.categoria?.nome?.toLowerCase()?.includes('adega') || 
              p.categoria?.nome?.toLowerCase()?.includes('laticínios')
          );
      } else if (activeTab === 'menu') {
          filtered = products.filter(p => 
              !p.categoria?.nome?.toLowerCase()?.includes('mercado') && 
              !p.categoria?.nome?.toLowerCase()?.includes('encomenda') &&
              !p.categoria?.nome?.toLowerCase()?.includes('kit')
          );
      }

      if (activeCategory !== 'todos') {
          filtered = filtered.filter(p => p.categoria?.id === activeCategory);
      }

      if (searchTerm) {
          filtered = filtered.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      return filtered;
  };

  // BLINDAGEM E REMOÇÃO DE DUPLICATAS
  const encomendaProducts = products.filter(p => 
      p.categoria?.nome?.toLowerCase()?.includes('encomenda') || 
      p.categoria?.nome?.toLowerCase()?.includes('kit') || 
      p.categoria?.nome?.toLowerCase()?.includes('festa')
  );

  const displayProducts = getFilteredProducts();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 pb-20 md:pb-0 transition-colors duration-300">
        
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md shadow-sm border-b border-amber-100 dark:border-stone-800 h-16">
            <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors">
                        <AlignJustify size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-500 p-2 rounded-lg text-white hidden sm:block"><Utensils size={20} /></div>
                        <h1 className="text-xl font-bold text-amber-900 dark:text-amber-500">Padoca</h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800">{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
                    <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-white dark:bg-stone-800 rounded-full text-amber-800 dark:text-amber-500 shadow-sm hover:scale-105 transition-transform">
                        <ShoppingBag size={24} />
                        {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{cart.reduce((a,b)=>a+b.qty,0)}</span>}
                    </button>
                </div>
            </div>
        </header>

        {/* MENUS FLUTUANTES (Mobile + Carrinho) */}
        <div className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}/>
        <div className={`fixed top-0 left-0 z-[61] h-full w-72 bg-white dark:bg-stone-900 shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-out transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2"><div className="bg-amber-500 p-2 rounded-lg text-white"><Utensils size={20} /></div><h1 className="text-xl font-bold text-amber-900 dark:text-amber-500">Menu</h1></div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-500"><X size={24}/></button>
            </div>
            <div className="overflow-y-auto flex-grow custom-scrollbar">
                <NavigationMenu activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
            <div className="pt-6 border-t border-stone-100 dark:border-stone-800"><p className="text-xs text-center text-stone-400">Padoca App v2.0</p></div>
        </div>

        <div className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)}/>
        <div className={`fixed top-0 right-0 z-[61] h-full w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-out transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Seu Pedido</h2><button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"><Minus className="rotate-45" size={24}/></button></div>
            <div className="flex-grow overflow-y-auto space-y-4">{cart.length === 0 ? <p className="text-stone-400 text-center mt-10">Carrinho vazio.</p> : cart.map(item => (<div key={item.id} className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-4"><div><p className="font-bold">{item.nome}</p><p className="text-sm text-stone-500">R$ {item.preco.toFixed(2)}</p></div><div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800 rounded-lg p-1"><button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded"><Minus size={16}/></button><span className="font-bold w-4 text-center">{item.qty}</span><button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded"><Plus size={16}/></button></div></div>))}</div>
            <div className="mt-4 border-t border-stone-100 pt-4"><div className="flex justify-between text-xl font-bold mb-4"><span>Total</span><span>R$ {cartTotal.toFixed(2)}</span></div><button onClick={checkout} disabled={cart.length === 0} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all">Confirmar Pedido</button></div>
        </div>

        <div className="max-w-7xl mx-auto pt-20 px-4 flex flex-col md:flex-row gap-8">
            
            <aside className="hidden md:flex flex-col w-64 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-2 space-y-6 flex-shrink-0 custom-scrollbar">
                <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 flex-shrink-0">
                    <h3 className="font-bold text-stone-400 text-xs uppercase tracking-widest mb-4 px-2">Navegação</h3>
                    <NavigationMenu activeTab={activeTab} onTabChange={handleTabChange} />
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="flex-grow pb-10">
                
                {['menu', 'almoco', 'mercado'].includes(activeTab) && (
                    <>
                        {activeTab === 'mercado' && (
                            <div className="mb-8 animate-fade-in">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl flex items-center gap-4 border border-emerald-100 dark:border-emerald-800 mb-6"><div className="bg-white dark:bg-stone-800 p-3 rounded-full shadow-sm text-emerald-600"><ShoppingBasket size={32} /></div><div><h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">Mercado Padoca</h2><p className="text-emerald-700 dark:text-emerald-300">Leve o sabor da padoca para sua despensa.</p></div></div>
                                <div className="relative mb-6"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} /><input type="text" placeholder="Buscar no mercado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"/></div>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar"><button onClick={() => setActiveCategory('todos')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeCategory === 'todos' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white dark:bg-stone-900 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-100 dark:border-stone-800'}`}><Menu size={18} /> Todos</button>{categories.map(cat => {const Icon = getIcon(cat.nome); return (<button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-white dark:bg-stone-900 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-100 dark:border-stone-800'}`}><Icon size={18} /> {cat.nome}</button>)})}</div>
                            </div>
                        )}
                        
                        {activeTab !== 'mercado' && (
                            <div className="mb-6"><h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{activeTab === 'menu' ? 'Cardápio Completo' : 'Almoço do Dia'}</h2><p className="text-stone-500 mt-1">Todos os itens disponíveis</p></div>
                        )}

                        {displayProducts.length === 0 ? (
                            <div className="bg-amber-50 dark:bg-stone-900 rounded-3xl p-12 text-center border-2 border-dashed border-amber-200 dark:border-stone-700 animate-fade-in flex flex-col items-center justify-center h-64">
                                <div className="bg-white dark:bg-stone-800 p-4 rounded-full shadow-sm mb-4 animate-bounce"><ChefHat size={48} className="text-amber-500" /></div>
                                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">Estamos preparando novidades!</h3>
                                <p className="text-stone-500 max-w-md mx-auto leading-relaxed">Nossa equipe já está cadastrando as delícias desta seção. <br/> Volte em alguns instantes para conferir o que saiu do forno. 🍞</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                {displayProducts.map(prod => (
                                    <div key={prod.id} className="bg-white dark:bg-stone-900 p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-stone-100 dark:border-stone-800 flex flex-col h-full">
                                        {/* CORREÇÃO DA IMAGEM PARA REDE BLOQUEADA */}
                                        <div className="h-48 rounded-2xl overflow-hidden mb-4 relative flex-shrink-0">
                                            <img 
                                                src={`http://localhost:8080${prod.imagemUrl}`} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                onError={(e) => e.currentTarget.src = PLACEHOLDER_IMG} 
                                            />
                                            {prod.quantidadeEstoque <= 0 && <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold uppercase tracking-widest border-2 border-white/20 m-2 rounded-xl">Esgotado</div>}
                                        </div>
                                        <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-lg leading-tight text-stone-800 dark:text-stone-100">{prod.nome}</h3><span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">R$ {prod.preco.toFixed(2)}</span></div>
                                        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-grow">{prod.descricao}</p>
                                        <button onClick={() => addToCart(prod)} disabled={prod.quantidadeEstoque <= 0} className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-3.5 rounded-2xl font-bold hover:bg-amber-600 dark:hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-stone-200 dark:shadow-none">{prod.quantidadeEstoque > 0 ? 'Adicionar ao Pedido' : 'Indisponível'}</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'conta' && (
                    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                        <div className="bg-stone-100 dark:bg-stone-900 p-6 rounded-3xl flex items-center gap-4">
                            <div className="bg-white dark:bg-stone-800 p-4 rounded-full shadow-sm"><User size={32} className="text-stone-600 dark:text-stone-300"/></div>
                            <div>
                                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Minha Conta</h2>
                                <p className="text-stone-500 text-sm">Gerencie seus dados e preferências.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl border-2 border-white dark:border-stone-800 shadow-md">
                                    {user.nome.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{user.nome}</h3>
                                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Membro desde {user.membroDesde}</p>
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400"><Settings size={20}/></button>
                        </div>

                        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                            <h3 className="font-bold text-amber-600 flex items-center gap-2 mb-6"><User size={18}/> Dados Pessoais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Nome Completo</p>
                                    <p className="font-medium text-stone-700 dark:text-stone-200">{user.nome}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Email</p>
                                    <p className="font-medium text-stone-700 dark:text-stone-200">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Telefone</p>
                                    <p className="font-medium text-stone-700 dark:text-stone-200">{user.telefone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-amber-600 flex items-center gap-2"><MapPin size={18}/> Meus Endereços</h3>
                                <button className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">+ Novo</button>
                            </div>
                            <div className="space-y-3">
                                {user.enderecos.map((addr) => (
                                    <div key={addr.id} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 group hover:border-amber-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white dark:bg-stone-700 rounded-full flex items-center justify-center text-stone-400"><addr.icone size={18}/></div>
                                            <div>
                                                <p className="font-bold text-stone-800 dark:text-stone-200 text-sm">{addr.tipo}</p>
                                                <p className="text-xs text-stone-500">{addr.logradouro}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-stone-400 hover:text-amber-600 hover:bg-white dark:hover:bg-stone-700 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <Pencil size={16}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                            <h3 className="font-bold text-amber-600 flex items-center gap-2 mb-6"><Settings size={18}/> Segurança</h3>
                            <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700">
                                <div>
                                    <p className="font-bold text-stone-800 dark:text-stone-200 text-sm">Alteração de Senha</p>
                                    <p className="text-xs text-stone-500">Recomendamos usar uma senha forte.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="password" placeholder="Nova Senha" className="p-2 text-sm rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 outline-none focus:border-amber-500" />
                                    <button className="bg-stone-900 dark:bg-stone-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors">Salvar</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Bell className="text-amber-600" size={20}/>
                                <span className="font-bold text-stone-800 dark:text-stone-100">Receber notificações de promoções</span>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${user.notificacoes ? 'bg-amber-500' : 'bg-stone-300'}`} onClick={() => setUser({...user, notificacoes: !user.notificacoes})}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${user.notificacoes ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <button className="w-full text-center text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 p-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                            <LogOut size={18}/> Sair da Conta
                        </button>
                    </div>
                )}

                {activeTab === 'encomendas' && (
                    <div className="space-y-12 animate-fade-in"><div className="text-center max-w-2xl mx-auto"><div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500"><Gift size={32}/></div><h2 className="text-3xl font-bold mb-2 text-stone-800 dark:text-stone-100">Encomendas Especiais</h2><p className="text-stone-500">Torne sua festa inesquecível com nossos kits exclusivos ou personalize tudo do seu jeito.</p></div>{encomendaProducts.length > 0 && (<div><h3 className="font-bold text-xl text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2"><Package size={22} className="text-pink-500"/> Kits Prontos</h3><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{encomendaProducts.map(prod => (<div key={prod.id} className="bg-white dark:bg-stone-900 p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-stone-100 dark:border-stone-800 flex flex-col h-full ring-2 ring-transparent hover:ring-pink-100 dark:hover:ring-pink-900/30"><div className="h-48 rounded-2xl overflow-hidden mb-4 relative flex-shrink-0">
                        {/* IMAGEM PROTEGIDA AQUI TAMBÉM */}
                        <img src={`http://localhost:8080${prod.imagemUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => e.currentTarget.src = PLACEHOLDER_IMG} />
                        </div><div className="flex justify-between items-start mb-2"><h3 className="font-bold text-lg leading-tight text-stone-800 dark:text-stone-100">{prod.nome}</h3><span className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">R$ {prod.preco.toFixed(2)}</span></div><p className="text-sm text-stone-500 line-clamp-3 mb-4 flex-grow">{prod.descricao}</p><button onClick={() => addToCart(prod)} className="w-full bg-pink-500 text-white py-3.5 rounded-2xl font-bold hover:bg-pink-600 transition-all active:scale-95 shadow-lg shadow-pink-200 dark:shadow-none flex items-center justify-center gap-2"><ShoppingBag size={18} /> Encomendar Kit</button></div>))}</div></div>)}<div className="bg-white dark:bg-stone-900 rounded-[32px] p-8 md:p-12 border border-stone-100 dark:border-stone-800 shadow-xl relative overflow-hidden"><div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><PenTool size={180}/></div><div className="flex flex-col md:flex-row gap-8 items-start relative z-10"><div className="md:w-1/3"><div className="bg-pink-100 p-4 rounded-2xl w-fit text-pink-600 mb-4"><PenTool size={32}/></div><h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Monte do seu jeito</h3><p className="text-stone-500 leading-relaxed">Tem uma ideia específica? Descreva seu pedido, escolha a data e nós preparamos um orçamento especial para você.</p></div><div className="md:w-2/3 w-full bg-stone-50 dark:bg-stone-800/50 p-6 rounded-3xl border border-stone-100 dark:border-stone-700/50"><form className="space-y-5 text-left"><div><label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Data da Festa</label><input type="date" className="w-full p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-pink-500/20 transition-all font-medium text-stone-700 dark:text-stone-200"/></div><div><label className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">O que você precisa?</label><textarea className="w-full p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none h-32 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none font-medium text-stone-700 dark:text-stone-200" placeholder="Ex: Bolo de chocolate para 20 pessoas..."></textarea></div><button type="button" className="w-full bg-stone-800 dark:bg-white text-white dark:text-stone-900 py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"><Send size={18}/> Solicitar Orçamento</button></form></div></div></div></div>
                )}

                {activeTab === 'sobre' && (
                    <div className="space-y-6 animate-fade-in"><div className="bg-purple-50 dark:bg-purple-900/20 p-8 rounded-3xl flex items-center gap-6 border border-purple-100 dark:border-purple-800/30"><div className="w-20 h-20 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center text-purple-600 shadow-sm shrink-0"><Info size={32} /></div><div><h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Sobre a Padoca</h2><p className="text-purple-700 dark:text-purple-300">Conheça nossa história e fale com a gente.</p></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-100 dark:border-green-900/20 flex items-center gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"><div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-green-700 dark:text-green-100"><MessageCircle size={20} /></div><div><p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">WhatsApp</p><p className="font-bold text-stone-700 dark:text-stone-200">(11) 99999-9999</p></div></div><div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/20 flex items-center gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"><div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-100"><Phone size={20} /></div><div><p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Telefone</p><p className="font-bold text-stone-700 dark:text-stone-200">(11) 3333-3333</p></div></div><div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-100 dark:border-purple-900/20 flex items-center gap-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"><div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-100"><Mail size={20} /></div><div><p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">E-mail</p><p className="font-bold text-stone-700 dark:text-stone-200">contato@padoca.com</p></div></div></div><div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800"><h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-6"><Utensils className="text-amber-500" /> Nossa História</h3><div className="flex flex-col md:flex-row gap-8 items-start"><img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" alt="História" className="w-full md:w-1/3 rounded-2xl object-cover h-48 shadow-md" onError={(e) => e.currentTarget.src = PLACEHOLDER_IMG}/><div className="space-y-4 text-stone-600 dark:text-stone-300 text-sm leading-relaxed"><p>A <strong>Padoca</strong> nasceu do sonho de trazer o verdadeiro sabor do pão artesanal para a mesa das famílias.</p><p>Hoje, somos referência em confeitaria e refeições caseiras.</p><p className="text-amber-600 font-medium">"Aqui, cada fornada é feita com amor e dedicação."</p></div></div></div><div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm"><div className="flex items-start gap-4 mb-6"><div className="text-amber-500"><MessageCircle size={24}/></div><div><h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">Deixe seu Feedback</h3><p className="text-stone-500 text-sm">O que você achou dos nossos produtos e atendimento?</p></div></div><form onSubmit={handleFeedbackSubmit} className="space-y-6"><div><label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Sua Avaliação</label><div className="flex gap-2">{[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none transition-transform duration-200 hover:scale-125"><Star size={32} className={`transition-colors duration-200 ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200 dark:text-stone-700'}`} /></button>))}</div></div><div><label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Mensagem (Opcional)</label><textarea value={feedbackMsg} onChange={(e) => setFeedbackMsg(e.target.value)} className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-none outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm h-32 resize-none" placeholder="Conte-nos sua experiência..."></textarea></div><button type="submit" disabled={rating === 0} className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"><Send size={18} /> Enviar Opinião</button></form></div></div>
                )}

                {activeTab === 'fidelidade' && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-lg animate-fade-in relative overflow-hidden"><div className="absolute top-0 right-0 p-10 opacity-10"><Star size={120}/></div><h2 className="text-3xl font-bold mb-2">Clube Padoca</h2><p className="text-amber-100 text-lg mb-8">Acumule pontos e troque por delícias!</p><div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm max-w-sm"><p className="text-xs font-bold uppercase tracking-widest mb-1">Seu Saldo</p><p className="text-4xl font-bold">0 Pontos</p><div className="w-full bg-black/20 h-2 rounded-full mt-4"><div className="bg-white h-2 rounded-full w-0"></div></div><p className="text-xs mt-2">Faça seu primeiro pedido para pontuar!</p></div></div>
                )}

                {activeTab === 'pedidos' && (
                    <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 text-center border border-dashed border-stone-300 dark:border-stone-700 animate-fade-in"><Clock size={48} className="mx-auto text-stone-300 mb-4" /><p className="text-stone-500 font-medium">Você ainda não tem pedidos recentes.</p><button onClick={() => setActiveTab('menu')} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600">Fazer Pedido Agora</button></div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}