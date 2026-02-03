import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock, User } from 'lucide-react';
import { PedidoService } from '../../services/api';
import type { Pedido } from '../../types';

export function AgendaEncomendas() {
    const [encomendas, setEncomendas] = useState<Pedido[]>([]);

    useEffect(() => {
        const carregar = async () => {
            try {
                const dados = await PedidoService.listarEncomendas();
                setEncomendas(dados);
            } catch (error) {
                console.error(error);
            }
        };
        carregar();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <BookOpen className="text-purple-500" size={24} /> Agenda de Encomendas
                    </h2>
                    <p className="text-xs text-stone-500">Próximas entregas agendadas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {encomendas.length === 0 && <p className="text-stone-400 col-span-full text-center py-10">Nenhuma encomenda agendada.</p>}
                
                {encomendas.map(enc => (
                    <div key={enc.id} className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Cliente</p>
                                <h4 className="font-bold text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2"><User size={16}/> {enc.cliente}</h4>
                            </div>
                            <div className="text-right">
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold">{enc.status}</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 mb-4 text-sm text-stone-500">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(enc.dataHora).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> {new Date(enc.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>

                        <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl text-sm text-stone-600 dark:text-stone-300">
                            {enc.descricaoItens?.map((item, i) => <p key={i}>{item}</p>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}