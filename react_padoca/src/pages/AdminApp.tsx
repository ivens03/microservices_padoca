import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, DollarSign, ClipboardList, PlusCircle, 
  Package, Trash2, ChefHat, 
  AlertTriangle, X, Upload, 
  BookOpen, Gift, Coffee, ShoppingBasket,
  Tags, Layers, MessageSquare, LogOut
} from 'lucide-react';
import { 
    ProdutoService, 
    PedidoService, 
    CategoriaService, 
    UsuarioService, 
    DashboardService 
} from '../services/api';
import type { Produto, Categoria, Pedido, Usuario, DashboardStats } from '../types';

// --- TIPO PERSONALIZADO PARA UI ---
// Interface para o produto formatado para o layout
interface ProdutoUI {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    minStock: number;
    image: string;
    type: string;
}

const API_URL = 'http://localhost:8080';

const formatPrice = (value: number | string) => {
  const num = Number(value) || 0;
  return num.toFixed(2).replace('.', ',');
};

const getCurrentFullDate = () => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const mapProdutoToLayout = (p: Produto): ProdutoUI => ({
    id: p.id,
    name: p.nome,
    price: p.preco,
    type: p.categoria?.nome?.includes('Almoço') ? 'Almoço' : 
          p.categoria?.nome?.includes('Mercado') ? 'Mercado' : 'Padaria',
    category: p.categoria?.nome || 'Geral',
    stock: p.quantidadeEstoque,
    minStock: p.estoqueMinimo,
    image: p.imagemUrl ? `${API_URL}${p.imagemUrl}` : ''
});

// --- COMPONENTES ---

const GestaoFeedback = () => {
  const feedbacks: Array<{id: number, message: string}> = []; // Placeholder tipado
  const averageRating = '0.0';

  return (
    <div className="space-y-6 animate-page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
         <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-stone-800 dark:text-stone-100">
               <MessageSquare className="text-amber-500" /> Feedback dos Clientes
            </h2>
            <p className="text-xs text-stone-500">Avaliações e comentários recebidos.</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
               <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{averageRating}</p>
               <p className="text-[10px] text-stone-400 uppercase tracking-widest">Média Geral</p>
            </div>
            <div className="h-10 w-px bg-stone-200 dark:bg-stone-700"></div>
            <div>
               <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{feedbacks.length}</p>
               <p className="text-[10px] text-stone-400 uppercase tracking-widest">Avaliações</p>
            </div>
         </div>
      </div>
      {feedbacks.length === 0 && <div className="text-center py-10 text-stone-400">Nenhum feedback registrado.</div>}
    </div>
  );
};

const GestaoCategorias = ({ categories, onUpdate }: { categories: Categoria[], onUpdate: () => void }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleSaveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
        await CategoriaService.salvar({ nome: inputValue });
        setInputValue('');
        onUpdate();
        alert('Categoria salva!');
    } catch (error) {
        console.error(error);
        alert('Erro ao salvar categoria.');
    }
  };

  const handleDeleteRequest = async (id: number) => {
    if(!confirm('Excluir categoria?')) return;
    try {
        await CategoriaService.deletar(id);
        onUpdate();
    } catch (error) {
        alert('Erro ao deletar. Verifique se há produtos vinculados.');
    }
  };

  return (
    <div className="space-y-6 animate-page-transition relative">
       <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
          <div><h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2"><Tags className="text-purple-500" size={24}/> Gestão de Categorias</h2><p className="text-xs text-stone-500">Defina as categorias para produtos de mercado.</p></div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleSaveRequest} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl h-fit">
             <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-emerald-500"/> Nova Categoria
             </h3>
             <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Nome da Categoria</label>
                  <input value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-purple-500/30 transition-all" placeholder="Ex: Higiene, Bebidas, etc." />
                </div>
                <button className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-purple-700 transition-all active:scale-[0.98]">
                    Adicionar Categoria
                </button>
             </div>
          </form>

          <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
             <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2"><Layers size={20} className="text-blue-500"/> Categorias Ativas</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="relative p-4 rounded-2xl border-2 border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-purple-200 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500"><Tags size={18} /></div>
                         <button type="button" onClick={() => handleDeleteRequest(cat.id)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={16}/></button>
                      </div>
                      <h4 className="font-bold text-stone-800 dark:text-stone-200">{cat.nome}</h4>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  )
}

const DashboardGestor = ({ products }: { products: ProdutoUI[] }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  useEffect(() => {
      DashboardService.getStats().then(setStats).catch(console.error);
  }, []);

  const totalVendas = stats?.totalVendas || 0; 
  const criticos = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="space-y-6 animate-page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
        <div><h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Painel de Controle</h2><p className="text-sm font-medium text-amber-600 uppercase tracking-widest mt-1">{getCurrentFullDate()}</p></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-green-50 dark:bg-stone-800 p-2.5 rounded-2xl text-green-600"><DollarSign size={22} /></div>
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Vendas Totais</p>
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mt-1">R$ {formatPrice(totalVendas)}</h3>
         </div>
         <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-red-50 dark:bg-stone-800 p-2.5 rounded-2xl text-red-600"><AlertTriangle size={22} /></div>
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Estoque Crítico</p>
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mt-1">{criticos} Itens</h3>
         </div>
         <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-blue-50 dark:bg-stone-800 p-2.5 rounded-2xl text-blue-600"><ClipboardList size={22} /></div>
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Pedidos Hoje</p>
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mt-1">{stats?.pedidosHoje || 0}</h3>
         </div>
         <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-purple-50 dark:bg-stone-800 p-2.5 rounded-2xl text-purple-600"><Package size={22} /></div>
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">Produtos Ativos</p>
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mt-1">{stats?.produtosAtivos || 0}</h3>
         </div>
      </div>
      
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm animate-fade-in">
          <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2"><Package size={20} className="text-red-500" /> Alertas de Estoque Baixo</h3>
          <div className="space-y-3">
              {products.filter(p => p.stock <= p.minStock).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                    {p.image && <img src={p.image} className="w-10 h-10 rounded-xl object-cover" alt="" />}
                    <div className="flex-grow">
                        <p className="text-xs font-bold text-stone-700 dark:text-stone-200">{p.name}</p>
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Estoque: {p.stock} (Mín: {p.minStock})</p>
                    </div>
                </div>
              ))}
              {criticos === 0 && <p className="text-stone-400 text-sm">Estoque saudável.</p>}
          </div>
      </div>
    </div>
  );
};

// Interface para os dados do formulário
interface ProdutoFormData {
    name: string;
    price: string;
    stock: string;
    minStock: string;
    categoryId: string;
}

const ProdutoForm = ({ 
    categories, 
    onSave, 
    onCancel 
}: { 
    categories: Categoria[], 
    onSave: (data: ProdutoFormData, file: File | null) => void, 
    onCancel: () => void 
}) => {
    const [formData, setFormData] = useState<ProdutoFormData>({ name: '', price: '', stock: '50', minStock: '10', categoryId: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');

    const handleFile = (file: File) => {
        if(file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl animate-fade-in-up space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nome</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Preço</label><input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Categoria</label>
                        <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none">
                            <option value="">Selecione...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Estoque</label><input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Mínimo</label><input required type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" /></div>
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Imagem</label>
                <div onClick={() => document.getElementById('file-upload')?.click()} className="relative w-full h-full min-h-[200px] border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-stone-50 dark:bg-stone-800 hover:border-amber-500">
                    {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : <div className="text-center"><Upload className="mx-auto mb-1 text-stone-400" size={20} /><p className="text-[10px] font-bold uppercase">Enviar foto</p></div>}
                    <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                </div>
            </div>
          </div>
          <div className="flex gap-4">
              <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl font-bold text-stone-500 bg-stone-100 hover:bg-stone-200">Cancelar</button>
              <button type="submit" className="flex-1 bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-amber-700">Salvar Produto</button>
          </div>
        </form>
    );
};

const EstoqueGeral = ({ products, onUpdate, categories }: { products: ProdutoUI[], onUpdate: () => void, categories: Categoria[] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSave = async (data: ProdutoFormData, file: File | null) => {
      try {
          await ProdutoService.criar({
              nome: data.name,
              descricao: 'Item de estoque',
              preco: parseFloat(data.price),
              quantidadeEstoque: parseInt(data.stock),
              estoqueMinimo: parseInt(data.minStock),
              categoria: { id: parseInt(data.categoryId) },
              ativo: true
          }, file);
          setIsFormOpen(false);
          onUpdate();
      } catch (error) {
          console.error(error);
          alert('Erro ao salvar produto');
      }
  };

  const handleDelete = async (id: number) => {
      if(!confirm("Excluir este item?")) return;
      await ProdutoService.deletar(id);
      onUpdate();
  };

  return (
    <div className="space-y-6 animate-page-transition">
      <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-all hover:shadow-md">
        <div><h2 className="text-xl font-bold">Gestão de Itens</h2><p className="text-xs text-stone-500">Alimente o estoque geral do sistema.</p></div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-stone-800 dark:bg-amber-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold shadow-md hover:opacity-90 active:scale-95 transition-all">{isFormOpen ? <X size={18}/> : <PlusCircle size={18} />} {isFormOpen ? 'Fechar' : 'Novo Item'}</button>
      </div>
      {isFormOpen && <ProdutoForm categories={categories} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />}
      
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 overflow-hidden shadow-sm animate-fade-in"><table className="w-full text-left"><thead className="bg-stone-50 dark:bg-stone-800 text-stone-400 text-[10px] font-bold uppercase tracking-widest"><tr><th className="px-6 py-4">Produto</th><th className="px-6 py-4 text-center">Estoque</th><th className="px-6 py-4 text-right">Ações</th></tr></thead><tbody className="divide-y divide-stone-50 dark:divide-stone-800">{products.map(p => (<tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors duration-200"><td className="px-6 py-4 flex items-center gap-3"><img src={p.image} className="w-10 h-10 rounded-xl object-cover transition-transform duration-300 hover:scale-125" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/50'} alt="" /><span className="font-bold text-sm text-stone-700 dark:text-stone-200">{p.name}</span></td><td className="px-6 py-4 text-center font-bold">{p.stock} un</td><td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleDelete(p.id)} className="p-2 text-stone-300 hover:text-red-500 transition-all"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div>
    </div>
  );
};

const GestaoCardapio = ({ products, onUpdate, categories }: { products: ProdutoUI[], onUpdate: () => void, categories: Categoria[] }) => {
    const bakeryItems = products.filter(p => p.type === 'Padaria');
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = async (data: ProdutoFormData, file: File | null) => {
        try {
            await ProdutoService.criar({
                nome: data.name,
                descricao: 'Item de Padaria',
                preco: parseFloat(data.price),
                quantidadeEstoque: parseInt(data.stock),
                estoqueMinimo: parseInt(data.minStock),
                categoria: { id: parseInt(data.categoryId) },
                ativo: true
            }, file);
            setIsAdding(false);
            onUpdate();
        } catch (e) { alert('Erro ao salvar'); }
    };

    return (
        <div className="space-y-6 animate-page-transition">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all">
                <div><h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2"><Coffee className="text-amber-500" size={24} /> Itens de Padaria & Vitrine</h2><p className="text-xs text-stone-500">Pão de queijo, cafés e salgados.</p></div>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-amber-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold hover:bg-amber-700 transition-all shadow-lg active:scale-95">{isAdding ? <X size={18} /> : <PlusCircle size={18} />} {isAdding ? 'Cancelar' : 'Novo Item'}</button>
            </div>
            {isAdding && <ProdutoForm categories={categories} onSave={handleSave} onCancel={() => setIsAdding(false)} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{bakeryItems.map(item => (<div key={item.id} className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden group flex flex-col relative hover:shadow-xl transition-all duration-300 animate-fade-in"><div className="absolute top-0 left-0 h-1.5 w-full bg-amber-500"></div><div className="h-40 relative overflow-hidden"><img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" onError={(e) => e.currentTarget.src='https://via.placeholder.com/300'} alt="" /><div className="absolute top-3 right-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-amber-700 shadow-sm border border-stone-100 dark:border-stone-800">R$ {formatPrice(item.price)}</div></div><div className="p-5 flex justify-between items-center"><div><h4 className="font-bold text-stone-800 dark:text-stone-100">{item.name}</h4><p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{item.category}</p></div><div className="flex gap-2"><button onClick={async () => { if(confirm('Deletar?')) { await ProdutoService.deletar(item.id); onUpdate(); } }} className="p-3 bg-stone-50 dark:bg-stone-800 text-stone-400 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={18} /></button></div></div></div>))}</div>
        </div>
    );
};

const OrderBoard = ({ orders, onUpdateStatus }: { orders: Pedido[], onUpdateStatus: (id: number) => void }) => {
  const getStatusLabel = (status: string) => { const labels: Record<string, string> = { 'RECEBIDO': 'Aceitar', 'EM_PREPARO': 'Finalizar', 'PRONTO': 'Entregar', 'ENTREGUE': 'Concluído', 'CANCELADO': 'Cancelado' }; return labels[status] || status; };
  
  return (
    <div className="space-y-6 animate-page-transition"><h2 className="text-xl font-bold flex items-center gap-2"><ClipboardList className="text-blue-500" /> Fila de Preparo</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{orders.filter(o => o.status !== 'ENTREGUE' && o.status !== 'CANCELADO').map(order => (<div key={order.id} className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden p-6 space-y-5 relative transition-all hover:shadow-xl hover:-translate-y-0.5 animate-fade-in"><div className={`absolute top-0 left-0 h-1.5 w-full transition-colors duration-500 ${order.tipo === 'ENCOMENDA' ? 'bg-purple-500' : 'bg-amber-500'}`}></div><div className="flex justify-between items-start pt-2"><div><div className="flex items-center gap-2 mb-0.5"><span className="text-[10px] font-bold text-stone-400 uppercase">#{order.id}</span><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${order.tipo === 'ENCOMENDA' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>{order.tipo}</span></div><h4 className="font-bold text-lg">{order.cliente}</h4></div><span className="text-[10px] font-bold text-stone-400">{new Date(order.dataHora).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div><div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800"><ul className="space-y-1.5">{order.descricaoItens.map((item, idx) => (<li key={idx} className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300"><div className="w-1 h-1 rounded-full bg-stone-300"></div>{item}</li>))}</ul></div><button onClick={() => onUpdateStatus(order.id)} className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-[0.98] transition-all bg-stone-800 hover:bg-stone-700`}>{getStatusLabel(order.status)}</button></div>))}</div></div>
  );
};

const RegistrarEncomenda = ({ onAdd }: { onAdd: () => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Lógica de encomenda
      alert("Encomendas em breve");
      onAdd();
  };
  
  return (
    <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl text-center text-stone-500">
        <Gift className="mx-auto mb-4 text-pink-500" size={32}/>
        <h3 className="text-xl font-bold text-stone-800">Nova Encomenda</h3>
        <p className="mb-6">Para registrar encomendas, utilize o menu de Pedidos ou o App do Cliente.</p>
        <button onClick={handleSubmit} className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold">Voltar</button>
    </div>
  );
};

const AgendaEncomendas = ({ commissions }: { commissions: Pedido[] }) => {
  return (
    <div className="space-y-6 animate-page-transition">
        <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm"><h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="text-pink-500" /> Agenda de Encomendas</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{commissions.map(comm => (
            <div key={comm.id} className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1.5 w-full bg-pink-400"></div>
                <div className="flex justify-between items-start mb-4"><div><span className="text-[10px] font-bold text-stone-400 uppercase">#{comm.id}</span><h4 className="font-bold text-lg">{comm.cliente}</h4></div></div>
                <ul className="text-sm text-stone-600 mb-4">{comm.descricaoItens.map((i,idx)=><li key={idx}>• {i}</li>)}</ul>
                <div className="inline-block bg-pink-50 text-pink-600 px-3 py-1 rounded-lg text-xs font-bold">{comm.status}</div>
            </div>
        ))}</div>
    </div>
  );
};

// --- APP PRINCIPAL (ADMIN) ---

export default function AdminApp() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('equipe'); 
  const [activeTab, setActiveTab] = useState('orders');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Estados de Dados Reais
  const [products, setProducts] = useState<ProdutoUI[]>([]);
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  
  // CORREÇÃO: User estava sendo lido mas não usado, removido para limpar erro
  // const [user, setUser] = useState<Usuario | null>(null);

  // Carregamento de Dados
  // CORREÇÃO: useCallbak para evitar o erro 'react-hooks/set-state-in-effect'
  const refreshData = useCallback(async () => {
      try {
          const [p, o, c] = await Promise.all([
              ProdutoService.listarTodos(),
              PedidoService.listarFila(),
              CategoriaService.listar(),
              // UsuarioService.getMe().catch(() => null)
          ]);
          setProducts(p.map(mapProdutoToLayout));
          setOrders(o);
          setCategories(c);
          // if(u) setUser(u);
      } catch (error) {
          console.error("Erro ao carregar dados:", error);
      }
  }, []);

  useEffect(() => {
      refreshData();
  }, [refreshData]);

  const handleUpdateOrderStatus = async (id: number) => {
      await PedidoService.avancarStatus(id);
      refreshData();
  };

  const menuItems = useMemo(() => {
    if (viewMode === 'gestor') { 
      return [
        { id: 'dashboard', label: 'Dashboard Geral', icon: BarChart3 }, 
        { id: 'inventory', label: 'Estoque Central', icon: Package }, 
        { id: 'categories', label: 'Categorias Mercado', icon: Tags }, 
        { id: 'feedbacks', label: 'Feedback Clientes', icon: MessageSquare },
      ]; 
    }
    return [
      { id: 'orders', label: 'Pedidos de Balcão', icon: ClipboardList }, 
      { id: 'bakery-menu', label: 'Itens Padaria', icon: Coffee }, 
      { id: 'market-menu', label: 'Mercado', icon: ShoppingBasket }, 
      { id: 'new-commission', label: 'Nova Encomenda', icon: PlusCircle }, 
      { id: 'agenda-commissions', label: 'Agenda Encomendas', icon: BookOpen }
    ];
  }, [viewMode]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-500">
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pageTransition { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
          .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
          .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-page-transition { animation: pageTransition 0.4s ease-out forwards; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 transition-all duration-300">
          <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4 group cursor-pointer transition-transform duration-300 active:scale-95">
                <div className="bg-stone-800 dark:bg-amber-600 p-2 rounded-xl text-white shadow-lg transition-all duration-300 group-hover:rotate-6"><ChefHat size={22} /></div>
                <div className="hidden sm:block"><h1 className="text-lg font-bold">Padoca Gestão</h1></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl flex border border-stone-200 dark:border-stone-700 shadow-inner">
                <button onClick={() => setViewMode('equipe')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${viewMode === 'equipe' ? 'bg-white dark:bg-stone-700 text-blue-600 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>Equipe</button>
                <button onClick={() => setViewMode('gestor')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${viewMode === 'gestor' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>Gestor</button>
              </div>
              <button onClick={() => { localStorage.clear(); navigate('/'); }} className="p-2.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all" title="Sair"><LogOut size={20}/></button>
            </div>
          </div>
        </header>

        <main className="max-w-[1440px] mx-auto pt-24 px-6 flex flex-col lg:flex-row gap-8 pb-10">
          <aside className="w-full lg:w-[300px] flex-shrink-0 space-y-4 lg:sticky lg:top-24 h-fit">
             <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-all hover:shadow-md">
                <div className="space-y-1">
                   {menuItems.map(item => { const Icon = item.icon; return (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 active:scale-95 ${activeTab === item.id ? (viewMode === 'gestor' ? 'bg-stone-800 text-white shadow-xl' : 'bg-blue-600 text-white shadow-xl') : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 hover:translate-x-1'}`}><Icon size={20}/> {item.label}</button>); })}
                </div>
             </div>
          </aside>

          <div className="flex-grow transition-all duration-500">
            {viewMode === 'gestor' ? (
              <>
                {activeTab === 'dashboard' && <DashboardGestor products={products} />}
                {activeTab === 'inventory' && <EstoqueGeral products={products} onUpdate={refreshData} categories={categories} />}
                {activeTab === 'categories' && <GestaoCategorias categories={categories} onUpdate={refreshData} />}
                {activeTab === 'feedbacks' && <GestaoFeedback />}
              </>
            ) : (
              <>
                {activeTab === 'orders' && <OrderBoard orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
                {activeTab === 'bakery-menu' && <GestaoCardapio products={products} onUpdate={refreshData} categories={categories} />}
                {activeTab === 'market-menu' && <GestaoCardapio products={products.filter(p => p.type === 'Mercado')} onUpdate={refreshData} categories={categories} />} {/* Reutilizando Cardapio mas filtrado */}
                {activeTab === 'new-commission' && <RegistrarEncomenda onAdd={() => setActiveTab('agenda-commissions')} />}
                {activeTab === 'agenda-commissions' && <AgendaEncomendas commissions={orders.filter(o => o.tipo === 'ENCOMENDA')} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}