
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Facebook, Instagram, ShieldCheck, User as UserIcon, Hotel, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface AuthProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [role, setRole] = useState<'ADMIN' | 'USER'>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    
    try {
        if(provider === 'email') {
            const user = await api.login(email, password);
            onLogin(user);
        } else {
            // Mock social login for now
             setTimeout(() => {
                onLogin({
                  id: '123',
                  name: role === 'ADMIN' ? 'Rajesh Kumar' : 'Staff Member',
                  email: `user@${provider}.com`,
                  role: role,
                  hotelName: 'Hotel Mumbai Deluxe',
                  avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=4f46e5&color=fff'
                });
            }, 1000);
        }
    } catch (err) {
        setError('Invalid credentials or server error.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center bg-white border-b border-slate-100">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
             <Hotel size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome to JyotiPrem</h2>
          <p className="text-slate-500 mt-2">Sign in to manage your property revenue</p>
        </div>

        <div className="p-8 space-y-4">
           {/* Role Toggle */}
           <div className="bg-slate-100 p-1 rounded-lg flex mb-6">
              <button 
                onClick={() => setRole('ADMIN')}
                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ShieldCheck size={16} className="mr-2" />
                Admin
              </button>
              <button 
                onClick={() => setRole('USER')}
                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'USER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <UserIcon size={16} className="mr-2" />
                Staff
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
                placeholder="Email address" 
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
          
          <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={() => handleLogin('facebook')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-white bg-[#1877F2] hover:bg-[#166fe5] font-medium transition-colors"
            >
                <Facebook size={20} />
            </button>
            <button 
                onClick={() => handleLogin('instagram')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 font-medium transition-colors"
            >
                <Instagram size={20} />
            </button>
          </div>

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
