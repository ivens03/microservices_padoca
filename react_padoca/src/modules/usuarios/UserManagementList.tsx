import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, User as UserIcon, X } from 'lucide-react';
import { UsuarioService } from '../../services/api';
import { Usuario, Funcionario, TipoUsuario, UsuarioDTO } from '../../types';
import UserCard from '../../components/common/UserCard';

interface UserManagementListProps {
    userTypeFilter: TipoUsuario;
    onUserCreated?: () => void;
}

interface UserFormProps {
    onSave: (data: UsuarioDTO, isFuncionario: boolean, isEditing: boolean, userId?: number) => Promise<void>;
    onCancel: () => void;
    initialUser?: Usuario | Funcionario | null;
    userTypeFilter: TipoUsuario;
}

const UserForm: React.FC<UserFormProps> = ({ onSave, onCancel, initialUser, userTypeFilter }) => {
    const isEditing = !!initialUser;
    const isFuncionario = userTypeFilter !== "CLIENTE";

    const [formData, setFormData] = useState<UsuarioDTO>(initialUser ? {
        nome: initialUser.nome,
        email: initialUser.email,
        cpf: initialUser.cpf,
        telefone: initialUser.telefone,
        tipo: initialUser.tipo,
        ...(isFuncionario && (initialUser as Funcionario).matricula && { matricula: (initialUser as Funcionario).matricula }),
        ...(isFuncionario && (initialUser as Funcionario).cargo && { cargo: (initialUser as Funcionario).cargo }),
    } : {
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        telefone: '',
        tipo: userTypeFilter
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData, isFuncionario, isEditing, initialUser?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl animate-fade-in-up space-y-6">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-emerald-500" /> {isEditing ? `Editar ${userTypeFilter}` : `Novo ${userTypeFilter}`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nome</label>
                        <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    {!isEditing && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Senha</label>
                            <input required type="password" name="senha" value={formData.senha} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">CPF</label>
                        <input required type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Telefone</label>
                        <input type="text" name="telefone" value={formData.telefone || ''} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    {isFuncionario && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Matrícula</label>
                                <input required type="text" name="matricula" value={(formData as Funcionario).matricula || ''} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Cargo</label>
                                <input required type="text" name="cargo" value={(formData as Funcionario).cargo || ''} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                        </>
                    )}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Tipo</label>
                        <select required name="tipo" value={formData.tipo} onChange={handleChange} className="w-full p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500">
                            {Object.values(TipoUsuario).map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl font-bold text-stone-500 bg-stone-100 hover:bg-stone-200">Cancelar</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-emerald-700">
                    {isEditing ? 'Salvar Alterações' : `Adicionar ${userTypeFilter}`}
                </button>
            </div>
        </form>
    );
};

const UserManagementList: React.FC<UserManagementListProps> = ({ userTypeFilter, onUserCreated }) => {
    const [users, setUsers] = useState<Array<Usuario | Funcionario>>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | Funcionario | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const allUsers = await UsuarioService.listarTodos();
            const filteredUsers = allUsers.filter(user => user.tipo === userTypeFilter);
            setUsers(filteredUsers);
        } catch (error) {
            console.error(`Erro ao buscar ${userTypeFilter}s:`, error);
            alert(`Erro ao buscar ${userTypeFilter}s.`);
        }
    }, [userTypeFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSaveUser = async (data: UsuarioDTO, isFuncionario: boolean, isEditing: boolean, userId?: number) => {
        try {
            if (isEditing && userId) {
                await UsuarioService.atualizar(userId, data);
                alert(`${userTypeFilter} atualizado com sucesso!`);
            } else {
                if (isFuncionario) {
                    await UsuarioService.registrarFuncionario(data);
                } else {
                    await UsuarioService.registrar(data);
                }
                alert(`${userTypeFilter} adicionado com sucesso!`);
            }
            
            setIsFormOpen(false);
            setEditingUser(null);
            fetchUsers();
            onUserCreated && onUserCreated();
        } catch (error) {
            console.error(`Erro ao salvar ${userTypeFilter}:`, error);
            alert(`Erro ao salvar ${userTypeFilter}.`);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm(`Tem certeza que deseja excluir este ${userTypeFilter}?`)) return;
        try {
            await UsuarioService.deletar(id);
            alert(`${userTypeFilter} excluído com sucesso!`);
            fetchUsers();
        } catch (error) {
            console.error(`Erro ao excluir ${userTypeFilter}:`, error);
            alert(`Erro ao excluir ${userTypeFilter}.`);
        }
    };

    const handleEditUser = (user: Usuario | Funcionario) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleNewUserClick = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6 animate-page-transition">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-all hover:shadow-md">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><UserIcon className="text-blue-500" /> Gestão de {userTypeFilter === "CLIENTE" ? "Clientes" : "Colaboradores"}</h2>
                    <p className="text-xs text-stone-500">Lista e gerenciamento de usuários do tipo {userTypeFilter.toLowerCase()}.</p>
                </div>
                <button onClick={handleNewUserClick} className="bg-stone-800 dark:bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold shadow-md hover:opacity-90 active:scale-95 transition-all">
                    {isFormOpen ? <X size={18}/> : <PlusCircle size={18} />} {isFormOpen ? 'Fechar' : `Novo ${userTypeFilter}`}
                </button>
            </div>

            {isFormOpen && (
                <UserForm
                    onSave={handleSaveUser}
                    onCancel={() => { setIsFormOpen(false); setEditingUser(null); }}
                    initialUser={editingUser}
                    userTypeFilter={userTypeFilter}
                />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.length === 0 && !isFormOpen ? (
                    <div className="col-span-full text-center py-10 text-stone-400 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        Nenhum {userTypeFilter.toLowerCase()} encontrado.
                    </div>
                ) : (
                    users.map(user => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default UserManagementList;
