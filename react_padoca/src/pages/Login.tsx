import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, ArrowRight, Lock, Mail, User, Phone, ArrowLeft, CheckCircle, Send, AlertCircle, FileText } from 'lucide-react';
import { UsuarioService, AuthService } from '../services/api';

type AuthView = 'login' | 'register' | 'forgot';

export function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  
  // ESTADO PARA MENSAGEM DE ERRO NA TELA
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '', 
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const switchView = (v: AuthView) => {
      setErrorMsg('');
      setView(v);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentando fazer login..."); // DEBUG

    try {
      const data = await AuthService.login({ 
          email: formData.email, 
          senha: formData.password 
      });
      
      console.log("Resposta do Login:", data); // DEBUG: Veja o que chega aqui no console do navegador (F12)

      if (!data || !data.token) {
          throw new Error("Token não recebido");
      }
      
      localStorage.setItem('padoca_token', data.token);
      localStorage.setItem('padoca_user', JSON.stringify(data.usuario));

      // Verificação robusta
      const tipoUsuario = data.usuario?.tipo;
      console.log("Tipo do usuário:", tipoUsuario); // DEBUG

      if (tipoUsuario === 'CLIENTE') {
        console.log("Navegando para /client"); // DEBUG
        navigate('/app');
      } else if (tipoUsuario === 'ADMIN' || tipoUsuario === 'GESTOR' || tipoUsuario === 'FUNCIONARIO') {
        console.log("Navegando para /admin"); // DEBUG
        navigate('/admin');
      } else {
        console.warn("Tipo de usuário desconhecido ou indefinido:", tipoUsuario);
        alert("Erro: Tipo de usuário não reconhecido.");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Login falhou! Verifique o console (F12) para detalhes.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
        setErrorMsg("As senhas digitadas não coincidem.");
        return;
    }
    
    setLoading(true);
    
    try {
        const cpfLimpo = formData.cpf.replace(/\D/g, '');

        await UsuarioService.salvar({
            nome: formData.name,
            email: formData.email,
            senha: formData.password,
            cpf: cpfLimpo, 
            tipo: 'CLIENTE' // <--- CORREÇÃO: Mudado de 'cargo' para 'tipo'
        });

        const loginResponse = await AuthService.login({
            email: formData.email,
            senha: formData.password
        });

        localStorage.setItem('padoca_token', loginResponse.token);
        localStorage.setItem('padoca_user', JSON.stringify(loginResponse));
        navigate('/app');

    } catch (error) {
        console.error("Erro detalhado:", error);
        if (error instanceof Error) {
             setErrorMsg(error.message);
        } else {
             setErrorMsg("Não foi possível realizar o cadastro (Erro desconhecido).");
        }
    } finally {
        setLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setErrorMsg('');
        // Aqui simulamos sucesso com uma mensagem na própria tela ou um alert pequeno se preferir, 
        // mas para manter consistência, vamos voltar ao login
        alert(`Link de recuperação enviado para ${formData.email}`);
        switchView('login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row border border-stone-100 dark:border-stone-800 min-h-[600px]">
        
        {/* Lado Esquerdo - Visual */}
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
                {view === 'login' && 'Faça login para acessar suas delícias favoritas.'}
                {view === 'register' && 'Crie sua conta em segundos e aproveite.'}
                {view === 'forgot' && 'Recupere seu acesso de forma simples.'}
            </p>
          </div>
          <div className="text-sm text-amber-200 relative z-10 mt-8">© 2025 Padoca Digital.</div>
        </div>

        {/* Lado Direito - Formulários */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center animate-fade-in relative">
          
          {/* MENSAGEM DE ERRO VISUAL */}
          {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 animate-pulse-short">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-bold leading-relaxed">{errorMsg}</p>
              </div>
          )}

          {/* VIEW: LOGIN */}
          {view === 'login' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Acesse sua conta</h2>
                <p className="text-stone-500 mb-6">Digite seus dados para continuar.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium" placeholder="seu@email.com" />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                        <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium" placeholder="Senha" />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={() => switchView('forgot')} className="text-sm font-bold text-amber-600 hover:text-amber-700">Esqueceu a senha?</button>
                    </div>

                    <button disabled={loading} className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                        {loading ? 'Entrando...' : 'Acessar Sistema'} {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-stone-500 text-sm">Não tem uma conta? <button onClick={() => switchView('register')} className="text-amber-600 font-bold hover:underline">Cadastre-se</button></p>
                </div>
              </div>
          )}

          {/* VIEW: REGISTER */}
          {view === 'register' && (
              <div className="animate-fade-in">
                <button onClick={() => switchView('login')} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><ArrowLeft size={24}/></button>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Crie sua conta</h2>
                <p className="text-stone-500 mb-6">Preencha os dados abaixo.</p>

                <form onSubmit={handleRegister} className="space-y-3">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" size={20} />
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-sm" placeholder="Nome Completo" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group">
                            <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" size={20} />
                            <input required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-sm" placeholder="CPF (apenas números)" />
                        </div>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" size={20} />
                            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-sm" placeholder="Telefone" />
                        </div>
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" size={20} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-sm" placeholder="E-mail" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" size={20} />
                            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-sm" placeholder="Senha" />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" size={20} />
                            <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-sm" placeholder="Confirmar" />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg mt-4 disabled:opacity-70">
                        {loading ? 'Cadastrando...' : 'Começar Agora'} {!loading && <CheckCircle size={20} />}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button onClick={() => switchView('login')} className="text-stone-400 hover:text-stone-600 text-sm font-bold">Voltar para o Login</button>
                </div>
              </div>
          )}

          {/* VIEW: FORGOT */}
          {view === 'forgot' && (
              <div className="animate-fade-in">
                <button onClick={() => switchView('login')} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><ArrowLeft size={24}/></button>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Recuperar Senha</h2>
                <p className="text-stone-500 mb-8">Informe seu e-mail para receber as instruções.</p>

                <form onSubmit={handleForgot} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500" size={20} />
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium" placeholder="seu@email.com" />
                    </div>

                    <button disabled={loading} className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                        {loading ? 'Enviando...' : 'Enviar Link'} {!loading && <Send size={20} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={() => switchView('login')} className="text-stone-400 hover:text-stone-600 text-sm font-bold">Lembrei minha senha</button>
                </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}