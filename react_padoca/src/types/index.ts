import { Usuario, Funcionario, TipoUsuario } from "./usuario";

export type { Usuario, Funcionario, TipoUsuario };

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
    tipo: 'BALCAO' | 'ENCOMENDA';
    total: number;
    dataHora: string;
    descricaoItens: string[];
}

export interface DashboardStats {
    totalVendas: number;
    pedidosHoje: number;
    produtosAtivos: number;
    faturamentoMensal: number;
}

export interface Endereco {
    id?: number;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    tipo: string;
}

export interface UsuarioDTO {
    nome: string;
    email: string;
    senha?: string;
    cpf?: string;
    telefone?: string;
    tipo: string;
}

export interface LoginDTO {
    email: string;
    senha: string;
}

export interface LoginResponseDTO {
    token: string;
    usuario: Usuario;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}