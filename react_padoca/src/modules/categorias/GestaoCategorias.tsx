import React, { useState, useEffect, useCallback } from "react";
import { Tags, Pencil, Trash2, PlusCircle, CheckCircle, Layers } from "lucide-react";
import { CategoriaService } from "../../services/api";
import type { Categoria } from "../../types";

export function GestaoCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    type: 'save' | 'delete' | null;
    title: string;
    message: string;
    action: (() => void) | null;
  }>({ isOpen: false, type: null, title: '', message: '', action: null });

  // Função estável para buscar dados (useCallback garante que a referência não mude)
  const carregarCategorias = useCallback(async () => {
      try {
          const dados = await CategoriaService.listar();
          setCategorias(dados);
      } catch (e) {
          console.error("Erro ao carregar categorias", e);
      }
  }, []);

  // Effect seguro: Envolvemos a chamada para deixar claro que é um efeito colateral assíncrono
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
        if (isMounted) await carregarCategorias();
    };
    init();
    return () => { isMounted = false; };
  }, [carregarCategorias]);

  const handleSaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (editingCategory) {
        setConfirmation({
            isOpen: true,
            type: 'save',
            title: 'Confirmar Edição',
            message: `Deseja alterar a categoria para "${inputValue}"?`,
            action: async () => {
                await CategoriaService.editar(editingCategory.id, { nome: inputValue, descricao: descriptionValue });
                resetForm();
                await carregarCategorias();
            }
        });
    } else {
        setConfirmation({
            isOpen: true,
            type: 'save',
            title: 'Confirmar Adição',
            message: `Deseja adicionar a nova categoria "${inputValue}"?`,
            action: async () => {
                await CategoriaService.salvar({ nome: inputValue, descricao: descriptionValue });
                resetForm();
                await carregarCategorias();
            }
        });
    }
  };

  const handleDeleteRequest = (cat: Categoria) => {
    setConfirmation({
        isOpen: true,
        type: 'delete',
        title: 'Excluir Categoria',
        message: `Tem certeza que deseja remover "${cat.nome}"?`,
        action: async () => {
            await CategoriaService.deletar(cat.id);
            await carregarCategorias();
        }
    });
  };

  const confirmAction = () => {
    if (confirmation.action) confirmation.action();
    setConfirmation({ ...confirmation, isOpen: false });
  };

  const resetForm = () => {
    setInputValue('');
    setDescriptionValue('');
    setEditingCategory(null);
  };

  const startEdit = (cat: Categoria) => {
    setInputValue(cat.nome);
    setDescriptionValue(cat.descricao || "");
    setEditingCategory(cat);
  };

  return (
    <div className="space-y-6 animate-page-transition relative">
       {/* Modal */}
       {confirmation.isOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmation({...confirmation, isOpen: false})}></div>
            <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-2xl relative w-full max-w-sm border border-stone-100 dark:border-stone-800 animate-fade-in-up text-center">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${confirmation.type === 'delete' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                    {confirmation.type === 'delete' ? <Trash2 size={32}/> : <CheckCircle size={32}/>}
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{confirmation.title}</h3>
                <p className="text-sm text-stone-500 mb-8 leading-relaxed">{confirmation.message}</p>
                <div className="flex gap-3">
                    <button onClick={() => setConfirmation({...confirmation, isOpen: false})} className="flex-1 py-3.5 rounded-2xl font-bold text-stone-500 hover:bg-stone-100 transition-all">Cancelar</button>
                    <button onClick={confirmAction} className={`flex-1 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${confirmation.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}>Confirmar</button>
                </div>
            </div>
         </div>
       )}

       <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
          <div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Tags className="text-purple-500" size={24}/> Gestão de Categorias
              </h2>
              <p className="text-xs text-stone-500">Defina as categorias para produtos de mercado.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleSaveRequest} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl h-fit">
             <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
                {editingCategory ? <Pencil size={20} className="text-amber-500"/> : <PlusCircle size={20} className="text-emerald-500"/>} 
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
             </h3>
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Nome da Categoria</label>
                   <input required value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-purple-500/30 transition-all" placeholder="Ex: Higiene" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Descrição</label>
                   <input value={descriptionValue} onChange={e => setDescriptionValue(e.target.value)} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-purple-500/30 transition-all" placeholder="Opcional" />
                </div>
                
                <div className="flex gap-3 pt-2">
                    {editingCategory && (
                        <button type="button" onClick={resetForm} className="px-6 py-4 rounded-2xl font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 transition-all">Cancelar</button>
                    )}
                    <button className="flex-1 bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-purple-700 transition-all active:scale-[0.98]">
                        {editingCategory ? 'Salvar Alteração' : 'Adicionar Categoria'}
                    </button>
                </div>
             </div>
          </form>

          <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
             <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2"><Layers size={20} className="text-blue-500"/> Categorias Ativas</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categorias.map(cat => (
                  <div key={cat.id} className={`relative p-4 rounded-2xl border-2 transition-all duration-300 group ${editingCategory?.id === cat.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' : 'border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-lg hover:-translate-y-1'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <div className={`p-2 rounded-xl ${editingCategory?.id === cat.id ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600'}`}>
                            <Tags size={18} />
                         </div>
                         <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-all"><Pencil size={16}/></button>
                            <button onClick={() => handleDeleteRequest(cat)} className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={16}/></button>
                         </div>
                      </div>
                      <h4 className="font-bold text-stone-800 dark:text-stone-200">{cat.nome}</h4>
                      <p className="text-[10px] text-stone-400 font-medium mt-1 uppercase tracking-wider truncate">{cat.descricao || "Sem descrição"}</p>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  )
}