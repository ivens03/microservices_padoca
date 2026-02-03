import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, ArrowRight, Lock, Mail, User, Phone, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { UsuarioService } from '../services/api'; // Supondo que usaremos o serviço para cadastrar

type AuthView = 'login' | 'register' | 'forgot';

export function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('login'); // Controla qual tela aparece
  const [loading, setLoading] = useState(false);

  // Estados dos Formulários
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // --- AÇÕES ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de Login
    setTimeout(() => {
      setLoading(false);
      if (formData.email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }
    setLoading(true);
    
    try {
        // Tenta cadastrar no backend (se a rota for pública)
        // await UsuarioService.salvar({ 
        //    nome: formData.name, 
        //    email: formData.email, 
        //    senha: formData.password, 
        //    cargo: 'FUNCIONARIO' // ou CLIENTE se tiver essa distinção 
        // });
        
        // Simulação
        setTimeout(() => {
            setLoading(false);
            alert("Cadastro realizado com sucesso! Faça login para continuar.");
            setView('login');
        }, 1500);
    } catch (error) {
        setLoading(false);
        alert("Erro ao cadastrar.");
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de envio de e-mail
    setTimeout(() => {
        setLoading(false);
        alert(`Um link de recuperação foi enviado para ${formData.email}`);
        setView('login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row border border-stone-100 dark:border-stone-800 min-h-[600px]">
        
        {/* Lado Esquerdo - Visual (Fixo) */}
        <div className="md:w-1/2 bg-amber-500 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg width="100%" height="100%"><pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="currentColor" /></pattern><rect width="100%" height="100%" fill="url(#pattern-circles)" /></svg>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6">
              <ChefHat size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
                {view === 'login' && 'Bem-vindo à Padoca'}
                {view === 'register' && 'Junte-se a nós'}
                {view === 'forgot' && 'Recupere sua conta'}
            </h1>
            <p className="text-amber-100 text-lg">
                {view === 'login' && 'Pães artesanais, confeitaria fina e o melhor almoço da região.'}
                {view === 'register' && 'Crie sua conta e ganhe pontos de fidelidade em cada compra.'}
                {view === 'forgot' && 'Não se preocupe, vamos ajudar você a voltar a saborear nossas delícias.'}
            </p>
          </div>
          
          <div className="text-sm text-amber-200 relative z-10 mt-8">
            © 2025 Padoca Digital.
          </div>
        </div>

        {/* Lado Direito - Formulários Dinâmicos */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center animate-fade-in relative">
          
          {/* --- VIEW: LOGIN --- */}
          {view === 'login' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Acesse sua conta</h2>
                <p className="text-stone-500 mb-8">Digite seus dados para continuar.</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="seu@email.com" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                        <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="Senha" />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={() => setView('forgot')} className="text-sm font-bold text-amber-600 hover:text-amber-700">Esqueceu a senha?</button>
                    </div>

                    <button disabled={loading} className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                        {loading ? 'Entrando...' : 'Acessar Sistema'} {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-stone-500 text-sm">Não tem uma conta? <button onClick={() => setView('register')} className="text-amber-600 font-bold hover:underline">Cadastre-se</button></p>
                </div>
              </div>
          )}

          {/* --- VIEW: CADASTRO --- */}
          {view === 'register' && (
              <div className="animate-fade-in">
                <button onClick={() => setView('login')} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><ArrowLeft size={24}/></button>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Crie sua conta</h2>
                <p className="text-stone-500 mb-6">Preencha os dados abaixo.</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="Nome Completo" />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="E-mail" />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="Telefone (Opcional)" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="Senha" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                            <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="Confirmar" />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg mt-4 disabled:opacity-70">
                        {loading ? 'Cadastrando...' : 'Finalizar Cadastro'} {!loading && <CheckCircle size={20} />}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button onClick={() => setView('login')} className="text-stone-400 hover:text-stone-600 text-sm font-bold">Voltar para o Login</button>
                </div>
              </div>
          )}

          {/* --- VIEW: ESQUECEU A SENHA --- */}
          {view === 'forgot' && (
              <div className="animate-fade-in">
                <button onClick={() => setView('login')} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><ArrowLeft size={24}/></button>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Recuperar Senha</h2>
                <p className="text-stone-500 mb-8">Informe seu e-mail para receber as instruções.</p>

                <form onSubmit={handleForgot} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" placeholder="seu@email.com" />
                    </div>

                    <button disabled={loading} className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                        {loading ? 'Enviando...' : 'Enviar Link'} {!loading && <Send size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={() => setView('login')} className="text-stone-400 hover:text-stone-600 text-sm font-bold">Lembrei minha senha</button>
                </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}