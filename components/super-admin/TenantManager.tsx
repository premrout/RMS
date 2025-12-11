
import React, { useState, useEffect } from 'react';
import { 
  Plus, MoreHorizontal, Mail, Shield, Building, 
  Lock, Unlock, Trash2, Edit3, Key, Eye
} from 'lucide-react';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { User, SubscriptionPlan } from '../../types';
import { api } from '../../services/api';

const TenantManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as 'ADMIN' | 'USER' | 'SUPER_ADMIN',
    hotelName: '',
    planId: '',
    status: 'Active' as 'Active' | 'Suspended'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, plansData] = await Promise.all([
        api.getUsers(),
        api.getPlans()
      ]);
      setUsers(usersData);
      setPlans(plansData);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '', // Required for new users
      role: 'ADMIN',
      hotelName: '',
      planId: plans[0]?.id || '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Leave empty to keep unchanged
      role: user.role,
      hotelName: user.hotelName,
      planId: '', // Ideally fetch user's current plan
      status: 'Active' // Should come from user object
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
      } else {
        await api.createUser(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will delete the user and their associated data.")) {
      await api.deleteUser(id);
      loadData();
    }
  };

  const toggleStatus = async (user: any) => {
      // Mock status toggle
      alert(`Toggled status for ${user.name}`);
  };

  const handleImpersonate = (user: User) => {
      if(confirm(`You are about to login as ${user.name}. You will see exactly what they see. Proceed?`)) {
          alert("Impersonation session started. Redirecting...");
          // In a real app, this would set a session token and redirect to the main dashboard
      }
  };

  const columns = [
    {
      key: 'name',
      label: 'User & Hotel',
      render: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
             {row.avatar ? <img src={row.avatar} className="w-full h-full rounded-full object-cover"/> : row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
               <Building size={10} /> {row.hotelName}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contact',
      render: (row: User) => (
        <div className="text-sm text-slate-600 flex items-center gap-2">
           <Mail size={14} className="text-slate-400" /> {row.email}
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (row: User) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            row.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
            row.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
            'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
            <Shield size={10} />
            {row.role === 'ADMIN' ? 'Hotel Admin' : row.role === 'USER' ? 'Staff' : 'Super Admin'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: User) => (
        <div className="flex items-center justify-end gap-2">
            {row.role !== 'SUPER_ADMIN' && (
                <button 
                    onClick={() => handleImpersonate(row)} 
                    className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100" 
                    title="Impersonate User (Login As)"
                >
                    <Eye size={16} />
                </button>
            )}
            <button onClick={() => handleEdit(row)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors" title="Edit User">
                <Edit3 size={16} />
            </button>
            <button onClick={() => toggleStatus(row)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Suspend User">
                <Lock size={16} />
            </button>
             <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete User">
                <Trash2 size={16} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DataTable 
        title="Tenants & Users"
        data={users}
        columns={columns as any}
        isLoading={loading}
        onAdd={handleCreate}
        addButtonLabel="Add New User"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Create New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           {/* Basic Info */}
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

           {/* Security */}
           <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                   <Key size={14} /> Password {editingUser && <span className="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>}
               </label>
               <input 
                 type="password" 
                 value={formData.password}
                 onChange={(e) => setFormData({...formData, password: e.target.value})}
                 required={!editingUser}
                 placeholder={editingUser ? "••••••••" : "Create a password"}
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
               />
           </div>

           {/* Role & Context */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">System Role</label>
                   <select 
                     value={formData.role}
                     onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                   >
                       <option value="ADMIN">Hotel Admin (Tenant)</option>
                       <option value="USER">Hotel Staff</option>
                       <option value="SUPER_ADMIN">Super Admin</option>
                   </select>
               </div>
               
               {/* Only show hotel name if not super admin */}
               {formData.role !== 'SUPER_ADMIN' && (
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Hotel Property Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.hotelName}
                        onChange={(e) => setFormData({...formData, hotelName: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                  </div>
               )}
           </div>

           {/* Plan Selection (Only for Hotel Admins) */}
           {formData.role === 'ADMIN' && (
               <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                   <label className="text-sm font-bold text-slate-700">Subscription Plan</label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                       {plans.map(plan => (
                           <div 
                             key={plan.id}
                             onClick={() => setFormData({...formData, planId: plan.id})}
                             className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                 formData.planId === plan.id 
                                 ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                                 : 'bg-white border-slate-200 hover:border-slate-300'
                             }`}
                           >
                               <div className="font-bold text-sm text-slate-800">{plan.name}</div>
                               <div className="text-xs text-slate-500">₹{plan.price}/mo</div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

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
                 {editingUser ? 'Save Changes' : 'Create User'}
               </button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default TenantManager;
