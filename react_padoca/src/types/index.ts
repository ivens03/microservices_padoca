export interface Categoria {
    id: number;
    nome: string;
    descricao?: string;
}

export interface CategoriaDTO {
    nome: string;
    descricao?: string;
}

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagemUrl: string;
    ativo: boolean;
    // O backend pode retornar null ou objeto
    categoria: Categoria | null;
    quantidadeEstoque: number;
    estoqueMinimo: number;
}

export interface Pedido {
    id: number;
    cliente: string;
    status: string;
    tipo: string;
    total: number;
    dataHora: string;
    descricaoItens: string[];
}

export interface DashboardStats {
    totalVendasHoje: number;
    itensCriticos: number;
    filaPedidos: number;
    lucroMedio: number;
}