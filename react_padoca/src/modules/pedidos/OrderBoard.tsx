import { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { PedidoService } from '../../services/api';
import type { Pedido } from '../../types';

export function OrderBoard() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        let isMounted = true;
        const carregarPedidos = async () => {
            try {
                const dados = await PedidoService.listarFila();
                if (isMounted) setPedidos(dados);
            } catch (error) {
                console.error("Erro ao buscar pedidos", error);
            }
        };
        carregarPedidos();
        const intervalo = setInterval(carregarPedidos, 5000);
        return () => { isMounted = false; clearInterval(intervalo); };
    }, []);

    const avancarStatus = async (id: number) => {
        await PedidoService.avancarStatus(id);
        const dados = await PedidoService.listarFila();
        setPedidos(dados);
    };

    const getCorStatus = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'pendente': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'preparando': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pronto': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-stone-100 text-stone-600';
        }
    };

    return (
        <div className="space-y-6 animate-page-transition">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <ClipboardList className="text-blue-500" /> Fila da Cozinha
                    </h2>
                    <p className="text-xs text-stone-500">Pedidos aguardando preparo.</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{pedidos.length}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">Pendentes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pedidos.length === 0 && (
                    <p className="col-span-full text-center text-stone-400 py-10">Cozinha livre! 🎉</p>
                )}
                
                {pedidos.map(pedido => (
                    <div key={pedido.id} className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all">
                        <div className={`h-1.5 w-full ${pedido.tipo === 'ENTREGA' ? 'bg-purple-500' : 'bg-amber-500'}`}></div>
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${pedido.tipo === 'ENTREGA' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {pedido.tipo}
                                    </span>
                                    <h4 className="font-bold text-lg mt-1 text-stone-800 dark:text-stone-100">{pedido.cliente}</h4>
                                </div>
                                <span className="text-xs font-bold text-stone-400 flex items-center gap-1">
                                    <Clock size={12}/> {pedido.dataHora}
                                </span>
                            </div>
                            
                            <ul className="space-y-2 mb-4 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                                {pedido.descricaoItens.map((item, idx) => (
                                    <li key={idx} className="text-sm font-medium text-stone-600 dark:text-stone-300 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 flex-shrink-0"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="p-4 pt-0">
                            <button 
                                onClick={() => avancarStatus(pedido.id)}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${getCorStatus(pedido.status)}`}
                            >
                                {pedido.status === 'pendente' && 'Iniciar Preparo'}
                                {pedido.status === 'preparando' && 'Marcar Pronto'}
                                {pedido.status === 'pronto' && 'Entregar'}
                                <CheckCircle size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}