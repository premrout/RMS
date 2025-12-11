
import React, { useState, useEffect } from 'react';
import { Plus, Check, Edit3, Trash2, X, MoreHorizontal, CheckCircle, Shield } from 'lucide-react';
import { SubscriptionPlan } from '../../types';
import Modal from '../ui/Modal';
import { api } from '../../services/api';

const PricingPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: '',
    price: 0,
    period: 'Monthly',
    features: [''],
    active: true
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await api.getPlans();
      setPlans(data);
    } catch (error) {
      console.error("Failed to load plans", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: 0,
      period: 'Monthly',
      features: [''],
      active: true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.updatePlan(editingPlan.id, formData);
      } else {
        await api.createPlan(formData as Omit<SubscriptionPlan, 'id'>);
      }
      setIsModalOpen(false);
      loadPlans();
    } catch (error) {
      console.error("Error saving plan", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      await api.deletePlan(id);
      loadPlans();
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Subscription Plans</h2>
           <p className="text-sm text-slate-500">Manage pricing tiers and feature sets.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Plus size={18} /> Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
            {/* Plan Header */}
            <div className={`p-6 border-b border-slate-100 ${!plan.active && 'opacity-60 bg-slate-50'}`}>
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                   plan.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                 }`}>
                   {plan.active ? 'Active' : 'Archived'}
                 </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
                <span className="text-sm text-slate-500 font-medium">/ {plan.period === 'Monthly' ? 'mo' : 'yr'}</span>
              </div>
            </div>

            {/* Features List */}
            <div className="p-6 flex-1 bg-slate-50/30">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white">
               <button 
                onClick={() => handleEdit(plan)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
               >
                 <Edit3 size={16} /> Edit
               </button>
               <button 
                onClick={() => handleDelete(plan.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
               >
                 <Trash2 size={16} /> Delete
               </button>
            </div>
          </div>
        ))}

        {/* Empty State / Add New Placeholder */}
        {plans.length === 0 && !loading && (
           <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Shield size={48} className="mx-auto mb-4 opacity-20" />
              <p>No pricing plans found.</p>
              <button onClick={handleCreate} className="text-indigo-600 font-bold hover:underline mt-2">Create your first plan</button>
           </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? 'Edit Plan' : 'Create New Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Plan Name</label>
                 <input 
                   required
                   type="text" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   placeholder="e.g. Professional"
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Price (₹)</label>
                 <input 
                   required
                   type="number" 
                   value={formData.price}
                   onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Billing Period</label>
                 <select 
                   value={formData.period}
                   onChange={(e) => setFormData({...formData, period: e.target.value as 'Monthly' | 'Yearly'})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   <option value="Monthly">Monthly</option>
                   <option value="Yearly">Yearly</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Status</label>
                 <div className="flex items-center gap-3 py-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, active: !formData.active})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-slate-600">{formData.active ? 'Active (Visible)' : 'Archived (Hidden)'}</span>
                 </div>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Features</label>
              {formData.features?.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                   <input 
                     type="text"
                     value={feat}
                     onChange={(e) => handleFeatureChange(idx, e.target.value)}
                     placeholder="e.g. Unlimited Reports"
                     className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   />
                   <button 
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                   >
                     <X size={18} />
                   </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={addFeature}
                className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Feature
              </button>
           </div>

           <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
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
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default PricingPlans;
