import { useEffect, useState } from "react";
import { Clock, CheckCircle, ChefHat, AlertCircle, RefreshCw } from "lucide-react";
import { PedidoService } from "../../services/api";
import type { Pedido } from "../../types";

interface OrderBoardProps {
    viewMode: 'gestor' | 'cozinha' | 'balcao';
}

export function OrderBoard({ viewMode }: OrderBoardProps) {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);

    const carregarPedidos = async () => {
        setLoading(true);
        try {
            const dados = await PedidoService.listarFila();
            setPedidos(dados);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarPedidos();
        const interval = setInterval(carregarPedidos, 30000);
        return () => clearInterval(interval);
    }, [viewMode]); // Recarrega se mudar o modo

    const avancarStatus = async (id: number) => {
        try {
            await PedidoService.avancarStatus(id);
            carregarPedidos();
        } catch {
            alert("Erro ao avançar status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RECEBIDO': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'EM_PREPARO': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'PRONTO': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-stone-100 text-stone-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <ChefHat className="text-amber-500" /> 
                        Fila de Pedidos
                    </h2>
                    <p className="text-stone-500">Acompanhe e gerencie os pedidos em tempo real.</p>
                </div>
                <button onClick={carregarPedidos} className="p-3 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 transition-colors" title="Atualizar">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-stone-500 uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Recebidos
                    </h3>
                    {pedidos.filter(p => p.status === 'RECEBIDO').map(p => (
                        <CardPedido key={p.id} pedido={p} color={getStatusColor('RECEBIDO')} onAdvance={() => avancarStatus(p.id)} btnLabel="Iniciar Preparo" />
                    ))}
                    {pedidos.filter(p => p.status === 'RECEBIDO').length === 0 && <EmptyState msg="Nenhum pedido novo" />}
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-stone-500 uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Em Preparo
                    </h3>
                    {pedidos.filter(p => p.status === 'EM_PREPARO').map(p => (
                        <CardPedido key={p.id} pedido={p} color={getStatusColor('EM_PREPARO')} onAdvance={() => avancarStatus(p.id)} btnLabel="Finalizar" />
                    ))}
                    {pedidos.filter(p => p.status === 'EM_PREPARO').length === 0 && <EmptyState msg="Cozinha livre" />}
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-stone-500 uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Prontos
                    </h3>
                    {pedidos.filter(p => p.status === 'PRONTO').map(p => (
                        <CardPedido key={p.id} pedido={p} color={getStatusColor('PRONTO')} onAdvance={() => avancarStatus(p.id)} btnLabel="Entregar" />
                    ))}
                    {pedidos.filter(p => p.status === 'PRONTO').length === 0 && <EmptyState msg="Nada para entregar" />}
                </div>
            </div>
        </div>
    );
}

const CardPedido = ({ pedido, color, onAdvance, btnLabel }: { pedido: Pedido, color: string, onAdvance: () => void, btnLabel: string }) => (
    <div className={`bg-white dark:bg-stone-900 p-5 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all ${color.replace('bg-', 'border-').split(' ')[2]}`}>
        <div className="flex justify-between items-start mb-3">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${color}`}>{pedido.status}</span>
            <span className="text-xs text-stone-400 flex items-center gap-1"><Clock size={12} /> {new Date(pedido.dataHora).toLocaleTimeString().slice(0, 5)}</span>
        </div>
        <h4 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">{pedido.cliente}</h4>
        <div className="text-sm text-stone-600 dark:text-stone-400 mb-4 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
            <ul className="list-disc list-inside space-y-1">
                {pedido.descricaoItens.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
        <div className="flex justify-between items-center border-t border-stone-100 dark:border-stone-800 pt-3">
            <span className="font-bold text-stone-800 dark:text-stone-100">R$ {pedido.total.toFixed(2)}</span>
            <button onClick={onAdvance} className="text-xs font-bold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-1">
                {btnLabel} <CheckCircle size={14} />
            </button>
        </div>
    </div>
);

const EmptyState = ({ msg }: { msg: string }) => (
    <div className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6 text-center text-stone-400">
        <AlertCircle className="mx-auto mb-2 opacity-50" />
        <p className="text-sm font-medium">{msg}</p>
    </div>
);