
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Facebook, Instagram, ShieldCheck, User as UserIcon, TrendingUp, AlertCircle, Loader2, Lock } from 'lucide-react';
import { api } from '../services/api';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [role, setRole] = useState<'ADMIN' | 'USER' | 'SUPER_ADMIN'>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    
    try {
        if(provider === 'email') {
            const user = await api.login(email, password, role);
            onLogin(user);
        } else if (provider === 'google') {
             // Mock Google Login
             await new Promise(resolve => setTimeout(resolve, 800));
             onLogin({
                 id: 'g_123',
                 name: 'Google User',
                 email: 'user@gmail.com',
                 role: 'ADMIN',
                 hotelName: 'My Hotel',
                 avatar: 'https://ui-avatars.com/api/?name=Google+User&background=db4437&color=fff',
                 status: 'Active'
             });
        }
    } catch (err) {
        console.error(err);
        setError('Invalid credentials or server error.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center bg-white border-b border-slate-100">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
             <TrendingUp size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome to RevOp<span className="text-indigo-600">RMS</span></h2>
          <p className="text-slate-500 mt-2">Sign in to manage your property revenue</p>
        </div>

        <div className="p-8 space-y-4">
           {/* Role Toggle */}
           <div className="bg-slate-100 p-1 rounded-lg flex mb-6">
              <button 
                onClick={() => setRole('ADMIN')}
                className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-md transition-all ${role === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ShieldCheck size={14} className="mr-1.5" />
                Hotel Admin
              </button>
              <button 
                onClick={() => setRole('USER')}
                className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-md transition-all ${role === 'USER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <UserIcon size={14} className="mr-1.5" />
                Staff
              </button>
               <button 
                onClick={() => setRole('SUPER_ADMIN')}
                className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded-md transition-all ${role === 'SUPER_ADMIN' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Lock size={14} className="mr-1.5" />
                Super Admin
              </button>
           </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin('email'); }}>
             <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'SUPER_ADMIN' ? "admin@revoprms.com" : "Email address"}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
             />
             <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
             />
             <button disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
             </button>
          </form>
          
          {role !== 'SUPER_ADMIN' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <button 
                onClick={() => handleLogin('google')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl shadow-sm text-slate-700 bg-white hover:bg-slate-50 font-medium transition-colors"
              >
                <Mail className="text-red-500 mr-3" size={20} />
                Google
              </button>
            </>
          )}

        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
            <button onClick={onBack} className="text-sm text-indigo-600 font-medium hover:underline">
                Back to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
