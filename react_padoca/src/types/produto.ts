import type { Categoria } from "./categoria";

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagemUrl: string;
    ativo: boolean;
    categoria?: Categoria;
    quantidadeEstoque: number;
    estoqueMinimo: number;
}

export type { Categoria };