
import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, Shield, Lock, Unlock, Mail, Edit3, Trash2, 
  CheckCircle, AlertTriangle, Key, Search
} from 'lucide-react';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { User, RoleDefinition } from '../../types';
import { api } from '../../services/api';

const AdminManager: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

  // Form State for Admin
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subRole: 'SUPPORT',
    status: 'Active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminsData, rolesData] = await Promise.all([
        api.getInternalAdmins(),
        api.getRoles()
      ]);
      setAdmins(adminsData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAdmin(null);
    setFormData({
      name: '',
      email: '',
      subRole: 'SUPPORT',
      status: 'Invited'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingAdmin(user);
    setFormData({
      name: user.name,
      email: user.email,
      subRole: user.subRole || 'SUPPORT',
      status: user.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save admin
    alert("Admin saved (Mock)");
    setIsModalOpen(false);
    loadData();
  };

  const memberColumns = [
    {
      key: 'name',
      label: 'Team Member',
      render: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
             {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
               <Mail size={10} /> {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'subRole',
      label: 'Role',
      render: (row: User) => {
        const role = roles.find(r => r.name.toUpperCase() === row.subRole) || { name: row.subRole };
        let color = 'bg-slate-100 text-slate-700';
        if (row.subRole === 'OWNER') color = 'bg-purple-100 text-purple-700 border-purple-200';
        if (row.subRole === 'DEVELOPER') color = 'bg-blue-100 text-blue-700 border-blue-200';
        if (row.subRole === 'SUPPORT') color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border border-transparent ${color}`}>
                <Shield size={10} /> {role.name}
            </span>
        );
      }
    },
    {
      key: 'mfaEnabled',
      label: '2FA Status',
      render: (row: User) => (
        row.mfaEnabled ? (
            <span className="text-emerald-600 font-medium text-xs flex items-center gap-1">
                <CheckCircle size={12} /> Enabled
            </span>
        ) : (
            <span className="text-amber-500 font-medium text-xs flex items-center gap-1">
                <AlertTriangle size={12} /> Disabled
            </span>
        )
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: User) => (
        <span className={`text-xs font-bold ${row.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
            {row.status}
        </span>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Active',
      render: (row: User) => <span className="text-xs text-slate-500">{row.lastLogin || 'Never'}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: User) => (
        <div className="flex items-center justify-end gap-2">
            <button onClick={() => handleEdit(row)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Edit3 size={16} />
            </button>
            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                <Trash2 size={16} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Module Header */}
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Internal Admins</h2>
           <p className="text-sm text-slate-500">Manage internal team members and their access.</p>
        </div>
      </div>

      <DataTable 
        title="Staff List"
        data={admins}
        columns={memberColumns as any}
        isLoading={loading}
        onAdd={handleCreate}
        addButtonLabel="Invite Member"
      />

      {/* INVITE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAdmin ? 'Edit Team Member' : 'Invite Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
              </div>
           </div>

           <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700">Role Assignment</label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {roles.map(role => (
                       <div 
                         key={role.id}
                         onClick={() => setFormData({...formData, subRole: role.name.toUpperCase()})}
                         className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                             formData.subRole === role.name.toUpperCase() 
                             ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                             : 'bg-white border-slate-200 hover:border-slate-300'
                         }`}
                       >
                           <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                               formData.subRole === role.name.toUpperCase() ? 'border-indigo-600' : 'border-slate-300'
                           }`}>
                               {formData.subRole === role.name.toUpperCase() && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                           </div>
                           <div>
                               <div className="font-bold text-sm text-slate-800">{role.name}</div>
                               <div className="text-xs text-slate-500 leading-tight mt-1">{role.description}</div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
               <button 
                 type="button"
                 onClick={() => setIsModalOpen(false)}
                 className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
               >
                 {editingAdmin ? 'Save Changes' : 'Send Invitation'}
               </button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminManager;
