export interface Categoria {
    id: number;
    nome: string;
    descricao?: string;
    ativo: boolean;
}

export interface CategoriaDTO {
    nome: string;
    descricao?: string;
}