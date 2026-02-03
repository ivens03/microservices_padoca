import type { Categoria, CategoriaDTO, Produto, DashboardStats, Pedido, Usuario, UsuarioDTO } from "../types";

const API_BASE = "http://localhost:8080/api";

// ... (DashboardService mantido igual) ...
export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error("Erro ao carregar dashboard");
    return res.json();
  }
};

// ... (CategoriaService mantido igual) ...
export const CategoriaService = {
  listar: async (): Promise<Categoria[]> => {
    const res = await fetch(`${API_BASE}/categorias`);
    if (!res.ok) return [];
    return res.json();
  },
  salvar: async (dto: CategoriaDTO): Promise<Categoria> => {
    const res = await fetch(`${API_BASE}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return res.json();
  },
  editar: async (id: number, dto: CategoriaDTO): Promise<Categoria> => {
    const res = await fetch(`${API_BASE}/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return res.json();
  },
  deletar: async (id: number): Promise<void> => {
    await fetch(`${API_BASE}/categorias/${id}`, { method: "DELETE" });
  },
};

// ... (ProdutoService mantido igual) ...
export const ProdutoService = {
  listarTodos: async (): Promise<Produto[]> => {
     const res = await fetch(`${API_BASE}/produtos`);
     if (!res.ok) return [];
     return res.json();
  },
  criar: async (produtoJSON: Record<string, unknown>, arquivo: File | null) => {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(produtoJSON)], { type: "application/json" });
    formData.append("produto", jsonBlob);
    
    if (arquivo) {
        formData.append("imagem", arquivo);
    }

    const res = await fetch(`${API_BASE}/produtos`, { method: "POST", body: formData });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  deletar: async (id: number) => {
      await fetch(`${API_BASE}/produtos/${id}`, { method: 'DELETE' });
  }
};

// ... (PedidoService mantido igual) ...
export const PedidoService = {
  listarFila: async (): Promise<Pedido[]> => {
    const res = await fetch(`${API_BASE}/pedidos`);
    if (!res.ok) return [];
    return res.json();
  },
  listarEncomendas: async (): Promise<Pedido[]> => {
    const res = await fetch(`${API_BASE}/pedidos`); 
    if (!res.ok) return [];
    const todos = await res.json();
    return todos.filter((p: Pedido) => p.tipo === 'ENCOMENDA'); 
  },
  criar: async (pedido: { cliente: string, tipo: string, dataHora?: string, itens: { produtoId?: number, quantidade?: number, descricao?: string }[] }) => {
    const res = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
    });
    if (!res.ok) throw new Error("Erro ao criar pedido");
    return res.json();
  },
  avancarStatus: async (id: number) => {
    await fetch(`${API_BASE}/pedidos/${id}/avancar`, { method: 'PATCH' });
  }
};

// --- NOVO SERVIÇO DE USUÁRIOS ---
export const UsuarioService = {
    listar: async (): Promise<Usuario[]> => {
        const res = await fetch(`${API_BASE}/usuarios`);
        if (!res.ok) return [];
        return res.json();
    },
    salvar: async (dto: UsuarioDTO): Promise<Usuario> => {
        const res = await fetch(`${API_BASE}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        });
        if (!res.ok) throw new Error("Erro ao salvar usuário");
        return res.json();
    },
    deletar: async (id: number) => {
        await fetch(`${API_BASE}/usuarios/${id}`, { method: 'DELETE' });
    }
};