
import React, { useState, useEffect } from 'react';
import { 
  Plus, Shield, Lock
} from 'lucide-react';
import { RoleDefinition } from '../../types';
import { api } from '../../services/api';

const RolesManager: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const rolesData = await api.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Failed to load roles", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Module Header */}
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Roles & Permissions</h2>
           <p className="text-sm text-slate-500">Define access levels and security policies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map(role => (
              <div key={role.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                              <Shield size={20} />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900">{role.name}</h3>
                              <p className="text-xs text-slate-500">{role.usersCount} users assigned</p>
                          </div>
                      </div>
                      {role.isSystem && (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase">System</span>
                      )}
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-6 flex-1">{role.description}</p>
                  
                  <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Lock size={12}/> Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                          {role.permissions.map((perm, idx) => (
                              <span key={idx} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs font-mono text-slate-600">
                                  {perm}
                              </span>
                          ))}
                      </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                      <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                          Edit Role
                      </button>
                  </div>
              </div>
          ))}
          
          {/* Add New Role Card */}
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-100 transition-all cursor-pointer min-h-[300px]">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <Plus size={24} />
              </div>
              <h3 className="font-bold">Create Custom Role</h3>
              <p className="text-sm mt-1">Define granular access policies</p>
          </div>
      </div>
    </div>
  );
};

export default RolesManager;
