import React, { useState } from 'react';
import { Gift, Calendar, User, FileText, PlusCircle } from 'lucide-react';
import { PedidoService } from '../../services/api';

export function RegistrarEncomenda() {
    const [form, setForm] = useState({
        cliente: '',
        data: '',
        hora: '',
        descricao: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await PedidoService.criar({
                cliente: form.cliente,
                tipo: 'ENCOMENDA',
                dataHora: `${form.data}T${form.hora}`, // Formato ISO simples
                itens: [{ descricao: form.descricao }] // Adaptação para item avulso
            });
            alert("Encomenda registrada com sucesso!");
            setForm({ cliente: '', data: '', hora: '', descricao: '' });
        } catch (error) {
            console.error(error);
            alert("Erro ao registrar encomenda.");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <Gift className="text-pink-500" size={24} /> Nova Encomenda
                    </h2>
                    <p className="text-xs text-stone-500">Agendar pedido para data futura.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl max-w-2xl mx-auto space-y-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><User size={12}/> Nome do Cliente</label>
                    <input required value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-pink-500/30 transition-all" placeholder="Ex: Maria Silva" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Data</label>
                        <input type="date" required value={form.data} onChange={e => setForm({...form, data: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-pink-500/30 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Hora</label>
                        <input type="time" required value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-pink-500/30 transition-all" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><FileText size={12}/> Detalhes do Pedido</label>
                    <textarea required value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} className="w-full p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none border border-transparent focus:border-pink-500/30 transition-all h-32 resize-none" placeholder="Ex: Bolo de Chocolate 2kg, escrever 'Parabéns Ana'" />
                </div>

                <button className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-pink-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    <PlusCircle size={20}/> Registrar Encomenda
                </button>
            </form>
        </div>
    );
}