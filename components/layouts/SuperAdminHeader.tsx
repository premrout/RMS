
import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  title: string;
}

const SuperAdminHeader: React.FC<HeaderProps> = ({ user, title }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
      {/* Page Title & Breadcrumb (Simplified) */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 capitalize">{title.replace('_', ' ').toLowerCase()}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Global Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
             {user.avatar ? <img src={user.avatar} alt="avatar" className="rounded-full" /> : "SA"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{user.name}</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
