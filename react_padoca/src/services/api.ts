import type { 
    Categoria, 
    CategoriaDTO, 
    Produto, 
    DashboardStats, 
    Pedido, 
    Usuario, 
    UsuarioDTO, 
    LoginDTO, 
    LoginResponseDTO,
    Endereco
} from "../types";

const API_BASE = "http://localhost:8080/api";

// Função auxiliar para pegar o cabeçalho com token
const getAuthHeader = () => {
    const token = localStorage.getItem('padoca_token');
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// Função para upload de arquivos (não usa Content-Type json)
const getUploadHeader = () => {
    const token = localStorage.getItem('padoca_token');
    return {
        "Authorization": `Bearer ${token}`
    };
};

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error("Erro ao carregar dashboard");
    return res.json();
  }
};

export const CategoriaService = {
  listar: async (): Promise<Categoria[]> => {
    const res = await fetch(`${API_BASE}/categorias`);
    if (!res.ok) return [];
    return res.json();
  },
  salvar: async (dto: CategoriaDTO): Promise<Categoria> => {
    const res = await fetch(`${API_BASE}/categorias`, {
      method: "POST",
      headers: getAuthHeader(), // <--- CORREÇÃO AQUI
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Erro ao salvar categoria");
    return res.json();
  },
  editar: async (id: number, dto: CategoriaDTO): Promise<Categoria> => {
    const res = await fetch(`${API_BASE}/categorias/${id}`, {
      method: "PUT",
      headers: getAuthHeader(), // <--- CORREÇÃO AQUI
      body: JSON.stringify(dto),
    });
    return res.json();
  },
  deletar: async (id: number): Promise<void> => {
    await fetch(`${API_BASE}/categorias/${id}`, { 
        method: "DELETE",
        headers: getAuthHeader() // <--- CORREÇÃO AQUI
    });
  },
};

export const ProdutoService = {
  listarTodos: async (): Promise<Produto[]> => {
     const res = await fetch(`${API_BASE}/produtos`);
     if (!res.ok) return [];
     return res.json();
  },
  buscarPorId: async (id: number): Promise<Produto> => {
    const res = await fetch(`${API_BASE}/produtos/${id}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error("Erro ao buscar produto por ID");
    return res.json();
  },
  criar: async (produtoJSON: Record<string, unknown>, arquivo: File | null) => {
    console.log("Frontend sending produtoJSON (create):", produtoJSON);
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(produtoJSON)], { type: "application/json" });
    formData.append("produto", jsonBlob);
    
    if (arquivo) {
        formData.append("imagem", arquivo);
    }

    const res = await fetch(`${API_BASE}/produtos`, { 
        method: "POST", 
        headers: getUploadHeader(),
        body: formData 
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  atualizar: async (id: number, produtoJSON: Record<string, unknown>, arquivo: File | null) => {
    console.log("Frontend sending produtoJSON (update):", produtoJSON);
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(produtoJSON)], { type: "application/json" });
    formData.append("produto", jsonBlob);

    if (arquivo) {
        formData.append("imagem", arquivo);
    }

    const res = await fetch(`${API_BASE}/produtos/${id}`, {
        method: "PUT",
        headers: getUploadHeader(),
        body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  deletar: async (id: number) => {
      await fetch(`${API_BASE}/produtos/${id}`, { 
          method: 'DELETE',
          headers: getAuthHeader()
      });
  }
};

export const PedidoService = {
  listarFila: async (): Promise<Pedido[]> => {
    const res = await fetch(`${API_BASE}/pedidos`, {
        headers: getAuthHeader()
    });
    if (!res.ok) return [];
    return res.json();
  },
  // ... (mantenha os outros métodos, adicionando getAuthHeader onde for POST/PUT/PATCH)
  criar: async (pedido: any) => {
    const res = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(pedido)
    });
    if (!res.ok) throw new Error("Erro ao criar pedido");
    return res.json();
  },
  avancarStatus: async (id: number) => {
    await fetch(`${API_BASE}/pedidos/${id}/avancar`, { 
        method: 'PATCH',
        headers: getAuthHeader()
    });
  }
};

// ... Mantenha o UsuarioService e AuthService como estavam, eles já pareciam corretos.
// Adicionando o FeedbackService novo:

export interface FeedbackDTO {
    cliente: string;
    mensagem: string;
    avaliacao: number;
}

export const FeedbackService = {
    enviar: async (dto: FeedbackDTO) => {
        const res = await fetch(`${API_BASE}/feedbacks`, {
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(dto)
        });
        if(!res.ok) throw new Error("Erro ao enviar feedback");
        return res.json();
    },
    listar: async () => {
        const res = await fetch(`${API_BASE}/feedbacks`, {
            headers: getAuthHeader()
        });
        if(!res.ok) return [];
        return res.json();
    }
};

export const UsuarioService = {
    // --- Métodos Administrativos ---
    listar: async (): Promise<Usuario[]> => {
        const res = await fetch(`${API_BASE}/usuarios`, {
             headers: getAuthHeader()
        });
        if (!res.ok) return [];
        return res.json();
    },
    salvar: async (dto: UsuarioDTO): Promise<Usuario> => {
        const res = await fetch(`${API_BASE}/usuarios`, {
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(dto),
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Erro ao salvar usuário");
        }
        return res.json();
    },
    deletar: async (id: number) => {
        await fetch(`${API_BASE}/usuarios/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    },

    // --- Métodos do Próprio Usuário (Perfil e Endereços) ---
    getMe: async (): Promise<Usuario> => {
        const token = localStorage.getItem('padoca_token');
        if (!token) throw new Error("Usuário não autenticado.");

        const res = await fetch(`${API_BASE}/usuarios/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Erro ao carregar perfil.");
        return res.json();
    },

    atualizarPerfil: async (dados: { nome: string, telefone: string, email: string, tipo: string, senha?: string }) => {
        const token = localStorage.getItem('padoca_token');
        
        // Garante que os campos obrigatórios do DTO Backend sejam preenchidos
        const payload = {
            ...dados,
            senha: dados.senha || "nao_alterar", 
            tipo: dados.tipo || "CLIENTE"
        };

        const res = await fetch(`${API_BASE}/usuarios/me`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Erro ao atualizar perfil");
        return res.json();
    },

    adicionarEndereco: async (endereco: Omit<Endereco, 'id'>) => {
        const token = localStorage.getItem('padoca_token');
        const res = await fetch(`${API_BASE}/usuarios/me/enderecos`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(endereco)
        });
        
        if (!res.ok) throw new Error("Erro ao adicionar endereço");
        return res.json();
    },

    removerEndereco: async (id: number) => {
        const token = localStorage.getItem('padoca_token');
        const res = await fetch(`${API_BASE}/usuarios/me/enderecos/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Erro ao remover endereço");
    }
};

export const AuthService = {
    login: async (creds: LoginDTO): Promise<LoginResponseDTO> => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds)
        });
        
        if (!res.ok) {
            throw new Error("Usuário ou senha inválidos");
        }
        
        return res.json();
    }
};