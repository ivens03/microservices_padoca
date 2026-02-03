import React, { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Trash2, Shield, Mail, Lock } from "lucide-react";
import { UsuarioService } from "../../services/api";
import type { Usuario } from "../../types";

export function GestaoFuncionarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estado do Formulário
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "FUNCIONARIO" as "FUNCIONARIO" | "GESTOR"
  });

  const carregarUsuarios = useCallback(async () => {
      try {
          const dados = await UsuarioService.listar();
          setUsuarios(dados);
      } catch (e) {
          console.error("Erro ao carregar usuários", e);
      }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.senha) return alert("Preencha todos os campos!");
    
    setLoading(true);
    try {
        await UsuarioService.salvar({
            nome: form.nome,
            email: form.email,
            senha: form.senha,
            cargo: form.cargo
        });
        alert("Funcionário cadastrado com sucesso!");
        setForm({ nome: "", email: "", senha: "", cargo: "FUNCIONARIO" });
        await carregarUsuarios();
    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar. Verifique se o e-mail já existe.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
      if (confirm("Tem certeza que deseja remover este acesso?")) {
          await UsuarioService.deletar(id);
          await carregarUsuarios();
      }
  };

  return (
    <div className="space-y-6 animate-page-transition">
       <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
          <div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Users className="text-blue-500" size={24}/> Gestão de Equipe
              </h2>
              <p className="text-xs text-stone-500">Cadastre e gerencie o acesso de funcionários.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulário de Cadastro */}
          <form onSubmit={handleSave} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl h-fit">
             <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-500"/> Novo Colaborador
             </h3>
             
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Nome Completo</label>
                   <input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-blue-500/30 transition-all" placeholder="Ex: Ana Souza" />
                </div>
                
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1 flex items-center gap-1"><Mail size={10}/> E-mail de Acesso</label>
                   <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-blue-500/30 transition-all" placeholder="ana@padoca.com" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1 flex items-center gap-1"><Lock size={10}/> Senha Inicial</label>
                        <input required type="password" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-blue-500/30 transition-all" placeholder="******" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1 flex items-center gap-1"><Shield size={10}/> Cargo</label>
                        <select value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value as any})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-blue-500/30 transition-all cursor-pointer">
                            <option value="FUNCIONARIO">Funcionário</option>
                            <option value="GESTOR">Gestor</option>
                        </select>
                    </div>
                </div>
                
                <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] mt-4">
                    {loading ? 'Salvando...' : 'Cadastrar Funcionário'}
                </button>
             </div>
          </form>

          {/* Lista de Funcionários */}
          <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
             <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2"><Users size={20} className="text-purple-500"/> Equipe Ativa</h3>
             <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {usuarios.length === 0 && <p className="text-stone-400 text-sm text-center py-10">Nenhum funcionário cadastrado.</p>}
                
                {usuarios.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.cargo === 'GESTOR' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {user.nome.charAt(0)}
                         </div>
                         <div>
                             <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm">{user.nome}</h4>
                             <p className="text-xs text-stone-500">{user.email}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${user.cargo === 'GESTOR' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                              {user.cargo}
                          </span>
                          <button onClick={() => handleDelete(user.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={16}/>
                          </button>
                      </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  )
}