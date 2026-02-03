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

// --- NOVOS TIPOS PARA FUNCIONÁRIOS ---
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    cargo: 'GESTOR' | 'FUNCIONARIO';
    ativo: boolean;
}

export interface UsuarioDTO {
    nome: string;
    email: string;
    senha?: string;
    cargo: 'GESTOR' | 'FUNCIONARIO';
}