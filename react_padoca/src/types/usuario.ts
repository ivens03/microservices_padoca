import { Endereco } from "./index";

export type TipoUsuario = "CLIENTE" | "FUNCIONARIO" | "ENTREGADOR" | "ADMIN" | "GESTOR";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha?: string;
    cpf: string;
    telefone?: string;
    tipo: TipoUsuario;
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao: string;
    enderecos: Endereco[];
}

export interface Funcionario extends Usuario {
    matricula: string;
    cargo: string;
}
