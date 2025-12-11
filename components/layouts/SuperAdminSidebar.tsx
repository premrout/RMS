
import React from 'react';
import { 
  LayoutDashboard, Users, Shield, CreditCard, FileText, 
  Settings, Bell, Server, Lock, 
  ChevronLeft, ChevronRight, LogOut, Code, Activity,
  Megaphone, LayoutTemplate, LifeBuoy, Puzzle, Flag
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

const SuperAdminSidebar: React.FC<SidebarProps> = ({ 
  isOpen, setIsOpen, activeView, setActiveView, onLogout 
}) => {
  
  const menuItems = [
    { id: 'SA_OVERVIEW', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'SA_ANALYTICS', label: 'Analytics', icon: Activity },
    { id: 'SA_PLANS', label: 'Pricing Management', icon: CreditCard },
    { id: 'SA_TENANTS', label: 'Tenants & Users', icon: Users },
    { id: 'SA_ADMINS', label: 'Admins & Roles', icon: Shield },
    { id: 'SA_ROLES', label: 'Roles & Permissions', icon: Lock },
    { id: 'SA_BILLING', label: 'Billing & Transactions', icon: FileText },
    { id: 'SA_NOTIFICATIONS', label: 'Notifications', icon: Bell },
    { id: 'SA_CMS', label: 'Content Management', icon: LayoutTemplate },
    { id: 'SA_SETTINGS', label: 'Web App Settings', icon: Settings },
    { id: 'SA_FLAGS', label: 'Feature Flags', icon: Flag },
    { id: 'SA_LOGS', label: 'Audit Logs', icon: FileText },
    { id: 'SA_SUPPORT', label: 'Support / Tickets', icon: LifeBuoy },
    { id: 'SA_INTEGRATIONS', label: 'Integrations', icon: Puzzle },
    { id: 'SA_DEVELOPER', label: 'Developer', icon: Code },
  ];

  return (
    <aside 
      className={`${isOpen ? 'w-72' : 'w-20'} bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 z-50 h-screen fixed left-0 top-0`}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 relative">
        <div className={`flex items-center gap-2 ${!isOpen && 'justify-center w-full'}`}>
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
             <Lock size={20} />
          </div>
          {isOpen && (
            <span className="font-bold text-white text-lg tracking-tight">
              RevOp<span className="text-indigo-400">Admin</span>
            </span>
          )}
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 bg-indigo-600 text-white p-1 rounded-full shadow-lg border-2 border-slate-900 hover:bg-indigo-500 transition-colors z-50"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative
              ${activeView === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                : 'hover:bg-slate-800 hover:text-white border border-transparent'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <item.icon size={20} className={`${activeView === item.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'}`} />
            {isOpen && <span>{item.label}</span>}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button 
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-900/20 hover:text-rose-300 transition-colors ${!isOpen && 'justify-center'}`}
        >
          <LogOut size={20} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
