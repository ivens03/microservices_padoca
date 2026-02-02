import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Menu, Utensils, Plus, Minus, Sun, Moon, 
  Coffee, Cake, Sandwich, ShoppingBasket, Wine, User, Clock
} from 'lucide-react';
import { ProdutoService, PedidoService, CategoriaService } from '../services/api';
import type { Produto, Categoria } from '../types';

interface CartItem extends Produto {
    qty: number;
}

// Função auxiliar para ícones
const getIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if(n.includes('bebida')) return Coffee;
    if(n.includes('doce') || n.includes('confeitaria')) return Cake;
    if(n.includes('lanche')) return Sandwich;
    if(n.includes('mercado')) return ShoppingBasket;
    if(n.includes('adega')) return Wine;
    return Menu;
}

export default function ClientApp() {
  const [activeTab, setActiveTab] = useState('menu'); 
  const [activeCategory, setActiveCategory] = useState<number | 'todos'>('todos');
  
  const [products, setProducts] = useState<Produto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
        try {
            const [p, c] = await Promise.all([ProdutoService.listarTodos(), CategoriaService.listar()]);
            setProducts(p);
            setCategories(c);
        } catch (e) {
            console.error("Erro ao carregar dados", e);
        }
    };
    init();
  }, []);

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
              cliente: "Cliente App", 
              tipo: "BALCAO",
              itens: cart.map(i => ({ produtoId: i.id, quantidade: i.qty }))
          });
          alert("Pedido enviado para a cozinha! 🍳");
          setCart([]);
          setIsCartOpen(false);
      } catch {
          alert("Erro ao enviar pedido.");
      }
  };

  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(p => p.categoria?.id === activeCategory);

  const cartTotal = cart.reduce((acc, item) => acc + (item.preco * item.qty), 0);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 pb-20 md:pb-0 transition-colors duration-300">
        
        <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md shadow-sm border-b border-amber-100 dark:border-stone-800">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-lg text-white"><Utensils size={20} /></div>
                    <h1 className="text-xl font-bold text-amber-900 dark:text-amber-500">Padoca</h1>
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

        {isCartOpen && (
            <div className="fixed inset-0 z-[60] flex justify-end">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                <div className="relative w-full max-w-md bg-white dark:bg-stone-900 h-full p-6 shadow-2xl flex flex-col animate-fade-in-up">
                    <h2 className="text-2xl font-bold mb-6">Seu Pedido</h2>
                    <div className="flex-grow overflow-y-auto space-y-4">
                        {cart.length === 0 ? <p className="text-stone-400 text-center mt-10">Carrinho vazio.</p> : cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-4">
                                <div>
                                    <p className="font-bold">{item.nome}</p>
                                    <p className="text-sm text-stone-500">R$ {item.preco.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded"><Minus size={16}/></button>
                                    <span className="font-bold w-4 text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded"><Plus size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 border-t border-stone-100 pt-4">
                        <div className="flex justify-between text-xl font-bold mb-4">
                            <span>Total</span>
                            <span>R$ {cartTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={checkout} disabled={cart.length === 0} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all">Confirmar Pedido</button>
                    </div>
                </div>
            </div>
        )}

        <main className="max-w-7xl mx-auto pt-24 px-4 flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-64 sticky top-24 h-fit space-y-6">
                <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800">
                    <h3 className="font-bold text-stone-400 text-xs uppercase tracking-widest mb-4 px-2">Navegação</h3>
                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'menu' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
                            <Menu size={20}/> Cardápio
                        </button>
                        <button onClick={() => setActiveTab('pedidos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'pedidos' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
                            <Clock size={20}/> Meus Pedidos
                        </button>
                        <button onClick={() => setActiveTab('conta')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'conta' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
                            <User size={20}/> Conta
                        </button>
                    </nav>
                </div>

                {activeTab === 'menu' && (
                    <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800">
                        <h3 className="font-bold text-stone-400 text-xs uppercase tracking-widest mb-4 px-2">Categorias</h3>
                        <nav className="space-y-1">
                            <button onClick={() => setActiveCategory('todos')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeCategory === 'todos' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}>
                                <Menu size={16} /> Todos
                            </button>
                            {categories.map(cat => {
                                const Icon = getIcon(cat.nome);
                                return (
                                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'}`}>
                                        <Icon size={16} /> {cat.nome}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>
                )}
            </aside>

            <div className="flex-grow">
                {activeTab === 'menu' ? (
                    <>
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Cardápio</h2>
                                <p className="text-stone-500 mt-1">Escolha suas delícias favoritas</p>
                            </div>
                        </div>
                        
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 text-center border border-dashed border-stone-300 dark:border-stone-700">
                                <ShoppingBasket size={48} className="mx-auto text-stone-300 mb-4" />
                                <p className="text-stone-500 font-medium">Nenhum produto encontrado nesta categoria.</p>
                                <p className="text-xs text-stone-400 mt-1">Acesse o painel administrativo para cadastrar itens.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                {filteredProducts.map(prod => (
                                    <div key={prod.id} className="bg-white dark:bg-stone-900 p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-stone-100 dark:border-stone-800 flex flex-col h-full">
                                        <div className="h-48 rounded-2xl overflow-hidden mb-4 relative flex-shrink-0">
                                            <img src={`http://localhost:8080${prod.imagemUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300?text=Sem+Foto'} />
                                            {prod.quantidadeEstoque <= 0 && <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold uppercase tracking-widest border-2 border-white/20 m-2 rounded-xl">Esgotado</div>}
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg leading-tight text-stone-800 dark:text-stone-100">{prod.nome}</h3>
                                            <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">R$ {prod.preco.toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-grow">{prod.descricao}</p>
                                        <button 
                                            onClick={() => addToCart(prod)} 
                                            disabled={prod.quantidadeEstoque <= 0}
                                            className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-3.5 rounded-2xl font-bold hover:bg-amber-600 dark:hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-stone-200 dark:shadow-none"
                                        >
                                            {prod.quantidadeEstoque > 0 ? 'Adicionar ao Pedido' : 'Indisponível'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-100 dark:border-stone-800">
                        <p className="text-stone-400">Funcionalidade em desenvolvimento...</p>
                        <button onClick={() => setActiveTab('menu')} className="mt-4 text-amber-600 font-bold hover:underline">Voltar ao Cardápio</button>
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
}