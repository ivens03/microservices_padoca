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
    tipo: 'BALCAO' | 'ENCOMENDA'; // Adicionado para evitar erro de tipo
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
    tipo: string; // "Casa", "Trabalho"
}

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    tipo: 'GESTOR' | 'FUNCIONARIO' | 'CLIENTE' | 'ADMIN' | 'ENTREGADOR';
    ativo: boolean;
    cpf?: string;
    enderecos: Endereco[];
    dataCriacao: string; // Adicionado para o AdminApp
}

export interface UsuarioDTO {
    nome: string;
    email: string;
    senha?: string;
    cpf?: string;
    telefone?: string;
    tipo: string;
    cargo?: string;
    matricula?: string;
}

export interface LoginDTO {
    email: string;
    senha: string;
}

export interface LoginResponseDTO {
    token: string;
    usuario: Usuario; // Agora retorna o objeto completo
}