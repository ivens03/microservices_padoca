import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, ClipboardList, TrendingUp, Package } from 'lucide-react';
import { DashboardService, ProdutoService } from '../../services/api';
import type { Produto, DashboardStats } from '../../types'; 

export const DashboardGestor = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardStats>({
    totalVendasHoje: 0,
    itensCriticos: 0,
    filaPedidos: 0,
    lucroMedio: 0
  });
  const [alertas, setAlertas] = useState<Produto[]>([]);

  useEffect(() => {
    const carregar = async () => {
        try {
          const [stats, produtos] = await Promise.all([
            DashboardService.getStats(),
            ProdutoService.listarTodos()
          ]);
    
          setKpis(stats);
          const criticos = produtos.filter((p) => p.quantidadeEstoque <= p.estoqueMinimo);
          setAlertas(criticos);
    
        } catch (error) {
          console.error("Erro ao carregar dashboard", error);
        } finally {
          setLoading(false);
        }
    };
    carregar();
  }, []);

  const cards = [
    { 
      label: 'Vendas Hoje', 
      value: `R$ ${kpis.totalVendasHoje?.toFixed(2) || '0.00'}`, 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-50'
    },
    { 
      label: 'Itens Críticos', 
      value: kpis.itensCriticos, 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50'
    },
    { 
      label: 'Fila de Pedidos', 
      value: kpis.filaPedidos, 
      icon: ClipboardList, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50'
    },
    { 
      label: 'Lucro Médio', 
      value: `${kpis.lucroMedio}%`, 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50'
    },
  ];

  if (loading) return <div className="p-10 text-center animate-pulse">Carregando indicadores...</div>;

  return (
    <div className="space-y-6 animate-page-transition">
      <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
        <div>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Painel de Controle</h2>
            <p className="text-sm font-medium text-amber-600 uppercase tracking-widest mt-1">Visão Geral (Tempo Real)</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} dark:bg-stone-800 p-2.5 rounded-2xl ${stat.color}`}><stat.icon size={22} /></div>
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>
      
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm animate-fade-in">
         <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
            <Package size={20} className="text-red-500" /> Estoque Crítico (Repor Urgente)
         </h3>
         <div className="space-y-3 overflow-y-auto max-h-[400px]">
             {alertas.length === 0 ? (
                 <div className="text-center py-8 text-stone-400 text-sm">Tudo certo com o estoque! 🎉</div>
             ) : (
                 alertas.map((prod) => (
                    <div key={prod.id} className="flex items-center gap-3 p-3 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                        <img src={`http://localhost:8080${prod.imagemUrl}`} className="w-10 h-10 rounded-lg object-cover bg-white" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/40'} />
                        <div className="flex-grow">
                            <p className="text-xs font-bold text-stone-700 dark:text-stone-200">{prod.nome}</p>
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">
                                Restam: {prod.quantidadeEstoque} (Mínimo: {prod.estoqueMinimo})
                            </p>
                        </div>
                    </div>
                 ))
             )}
         </div>
      </div>
    </div>
  );
};