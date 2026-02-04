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

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    tipo: 'GESTOR' | 'FUNCIONARIO' | 'CLIENTE'; // Era 'cargo', mudamos para 'tipo'
    ativo: boolean;
    cpf?: string;
}

export interface UsuarioDTO {
    nome: string;
    email: string;
    senha?: string;
    tipo: 'GESTOR' | 'FUNCIONARIO' | 'CLIENTE'; // Era 'cargo', mudamos para 'tipo'
    cpf?: string;
}

export interface LoginDTO {
    email: string;
    senha?: string;
}

export interface LoginResponseDTO {
    token: string;
    nome: string;
    tipo: 'CLIENTE' | 'FUNCIONARIO' | 'GESTOR';
}