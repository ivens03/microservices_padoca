import React from 'react';
import { User, Mail, Phone, Briefcase, Tag, Trash2, Edit } from 'lucide-react';
import { Usuario, Funcionario, TipoUsuario } from '../../types';

interface UserCardProps {
    user: Usuario | Funcionario;
    onEdit?: (user: Usuario | Funcionario) => void;
    onDelete?: (userId: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
    const isFuncionario = (u: Usuario | Funcionario): u is Funcionario => {
        return u.tipo === "FUNCIONARIO" || u.tipo === "ADMIN" || u.tipo === "GESTOR" || u.tipo === "ENTREGADOR";
    };

    const userTypeLabel: Record<TipoUsuario, string> = {
        CLIENTE: "Cliente",
        FUNCIONARIO: "Funcionário",
        ENTREGADOR: "Entregador",
        ADMIN: "Administrador",
        GESTOR: "Gestor"
    };

    return (
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all group flex flex-col relative">
            <div className={`absolute top-0 left-0 h-1.5 w-full rounded-t-3xl ${user.ativo ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4 pt-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl border-2 border-white dark:border-stone-800 shadow-sm">
                        {user.nome.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight text-stone-800 dark:text-stone-100">{user.nome}</h3>
                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{userTypeLabel[user.tipo]}</p>
                    </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <button 
                            onClick={() => onEdit(user)} 
                            className="p-2 text-stone-400 hover:text-blue-500 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-full transition-all"
                            title="Editar"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button 
                            onClick={() => user.id && onDelete(user.id)} 
                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-full transition-all"
                            title="Excluir"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2 text-sm text-stone-700 dark:text-stone-300 flex-grow">
                <p className="flex items-center gap-2"><Mail size={16} className="text-stone-400"/> {user.email}</p>
                {user.telefone && <p className="flex items-center gap-2"><Phone size={16} className="text-stone-400"/> {user.telefone}</p>}
                {isFuncionario(user) && (
                    <>
                        {user.matricula && <p className="flex items-center gap-2"><Tag size={16} className="text-stone-400"/> Matrícula: {user.matricula}</p>}
                        {user.cargo && <p className="flex items-center gap-2"><Briefcase size={16} className="text-stone-400"/> Cargo: {user.cargo}</p>}
                    </>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
                <p>Membro desde: {new Date(user.dataCriacao).toLocaleDateString('pt-BR')}</p>
                {!user.ativo && <p className="text-red-500 font-bold mt-1">Inativo</p>}
            </div>
        </div>
    );
};

export default UserCard;
