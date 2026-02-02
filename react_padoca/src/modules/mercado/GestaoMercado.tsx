import React, { useState, useEffect, useCallback } from "react";
import { ShoppingBasket, Plus, X, Upload, Pencil, Trash2 } from "lucide-react";
import { ProdutoService, CategoriaService } from "../../services/api";
import type { Produto, Categoria } from "../../types";

export function GestaoMercado() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidadeEstoque: "0",
    estoqueMinimo: "5",
    categoriaId: "" as string
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const carregarDados = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
          ProdutoService.listarTodos(),
          CategoriaService.listar()
      ]);
      setProdutos(prods);
      setCategorias(cats);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoriaId) return alert("Selecione uma categoria!");
    setLoading(true);

    try {
      await ProdutoService.criar({
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        quantidadeEstoque: Number(form.quantidadeEstoque),
        estoqueMinimo: Number(form.estoqueMinimo),
        categoria: { id: Number(form.categoriaId) } 
      }, selectedFile);
      
      alert("Produto salvo!");
      setIsAdding(false);
      setForm({ nome: "", descricao: "", preco: "", quantidadeEstoque: "0", estoqueMinimo: "5", categoriaId: "" });
      setSelectedFile(null);
      setPreview("");
      await carregarDados();
    } catch {
      alert("Erro ao salvar produto");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
      if(confirm("Remover item do estoque?")) {
          await ProdutoService.deletar(id);
          await carregarDados();
      }
  }

  const startEdit = (p: Produto) => {
      setForm({
          nome: p.nome,
          descricao: p.descricao,
          preco: String(p.preco),
          quantidadeEstoque: String(p.quantidadeEstoque),
          estoqueMinimo: String(p.estoqueMinimo),
          categoriaId: p.categoria ? String(p.categoria.id) : ""
      });
      setIsAdding(true);
  };

  return (
    <div className="space-y-6 animate-page-transition">
      <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
        <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <ShoppingBasket className="text-emerald-500" size={24} /> Itens do Mercado
            </h2>
            <p className="text-xs text-stone-500">Gestão de produtos e estoque.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
            {isAdding ? <X size={18} /> : <Plus size={18} />} 
            {isAdding ? 'Cancelar' : 'Novo Produto'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-emerald-100 dark:border-stone-800 shadow-xl animate-fade-in-up space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-5">
              <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Nome</label>
                  <input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none" placeholder="Ex: Vinho Tinto" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Preço (R$)</label>
                    <input required type="number" step="0.01" value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Categoria</label>
                    <select className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none"
                        value={form.categoriaId}
                        onChange={e => setForm({...form, categoriaId: e.target.value})}
                    >
                        <option value="">Selecione...</option>
                        {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Estoque Atual</label>
                    <input type="number" required value={form.quantidadeEstoque} onChange={e => setForm({...form, quantidadeEstoque: e.target.value})} className="w-full p-2 bg-white dark:bg-stone-700 rounded-xl outline-none" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Mínimo</label>
                    <input type="number" required value={form.estoqueMinimo} onChange={e => setForm({...form, estoqueMinimo: e.target.value})} className="w-full p-2 bg-white dark:bg-stone-700 rounded-xl outline-none" />
                 </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Descrição</label>
                  <input required value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none" placeholder="Detalhes..." />
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Foto</label>
              <div onClick={() => document.getElementById('market-upload')?.click()} className="relative flex-grow min-h-[160px] border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer bg-stone-50 dark:bg-stone-800 hover:border-emerald-300">
                {preview ? <img src={preview} className="w-full h-full object-cover rounded-3xl" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-stone-400"/> <span className="text-xs font-bold text-stone-500">Enviar Foto</span></div>}
                <input id="market-upload" type="file" hidden onChange={(e) => e.target.files && (setSelectedFile(e.target.files[0]), setPreview(URL.createObjectURL(e.target.files[0])))} />
              </div>
            </div>
          </div>
          <button disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-emerald-700 transition-all">
              {loading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.map(p => (
           <div key={p.id} className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden group">
               <div className="h-40 relative">
                   <img src={`http://localhost:8080${p.imagemUrl}`} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300?text=Sem+Foto'} />
                   <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-xl font-bold text-emerald-700 text-xs">
                       Est: {p.quantidadeEstoque}
                   </div>
               </div>
               <div className="p-4">
                   <h3 className="font-bold text-stone-800 dark:text-stone-100">{p.nome}</h3>
                   <div className="flex justify-between items-center mt-2">
                       <span className="text-xs font-bold text-stone-400 uppercase">{p.categoria?.nome || 'Sem Categoria'}</span>
                       <span className="text-emerald-600 font-bold">R$ {p.preco.toFixed(2)}</span>
                   </div>
                   <div className="mt-4 flex gap-2 justify-end">
                       <button onClick={() => startEdit(p)} className="p-2 text-stone-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"><Pencil size={16}/></button>
                       <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
               </div>
           </div>
        ))}
      </div>
    </div>
  );
}