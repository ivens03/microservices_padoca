import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, ArrowRight, Lock, Mail } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de Autenticação
    setTimeout(() => {
      setLoading(false);
      if (email.includes('admin') || email.includes('padoca')) {
        navigate('/admin'); // Vai para o Painel do Gestor/Equipe
      } else {
        navigate('/app'); // Vai para o App do Cliente
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 rounded-[32px] shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row border border-stone-100 dark:border-stone-800">
        
        {/* Lado Esquerdo - Visual */}
        <div className="md:w-1/2 bg-amber-500 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             {/* Padrão de fundo decorativo */}
             <svg width="100%" height="100%"><pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="currentColor" /></pattern><rect width="100%" height="100%" fill="url(#pattern-circles)" /></svg>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6">
              <ChefHat size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Bem-vindo à Padoca</h1>
            <p className="text-amber-100 text-lg">Pães artesanais, confeitaria fina e o melhor almoço da região, agora a um clique de distância.</p>
          </div>
          
          <div className="text-sm text-amber-200 relative z-10 mt-8">
            © 2025 Padoca Digital. Feito com amor.
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Acesse sua conta</h2>
          <p className="text-stone-500 mb-8">Digite seus dados para continuar.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-stone-800 dark:text-stone-100" 
                  placeholder="seu@email.com" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-stone-800 dark:text-stone-100" 
                  placeholder="******" 
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm font-bold text-amber-600 hover:text-amber-700">Esqueceu a senha?</button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Acessar Sistema'} 
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-stone-500 text-sm">
              Não tem uma conta? <button className="text-amber-600 font-bold hover:underline">Cadastre-se</button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}