
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Filter, Plus, Edit2, Trash2, Users, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';

interface FeatureFlag {
    id: string;
    name: string;
    key: string;
    description: string;
    status: 'Active' | 'Inactive';
    rolloutPercentage: number;
    targetAudience: 'All' | 'Beta Users' | 'Internal' | 'Premium Plan';
    lastUpdated: string;
}

const FeatureFlags: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([
      { id: '1', name: 'AI Price Forecasting v2', key: 'ai_forecasting_v2', description: 'New LSTM based model for demand prediction', status: 'Active', rolloutPercentage: 25, targetAudience: 'Beta Users', lastUpdated: '2 hours ago' },
      { id: '2', name: 'Dark Mode', key: 'theme_dark_mode', description: 'System wide dark theme support', status: 'Inactive', rolloutPercentage: 0, targetAudience: 'Internal', lastUpdated: '1 day ago' },
      { id: '3', name: 'WhatsApp Integration', key: 'channel_whatsapp', description: 'Direct messaging with guests via WhatsApp', status: 'Active', rolloutPercentage: 100, targetAudience: 'Premium Plan', lastUpdated: '1 week ago' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FeatureFlag>>({
      name: '', key: '', description: '', rolloutPercentage: 0, targetAudience: 'Internal'
  });

  const handleToggleStatus = (id: string) => {
      setFlags(flags.map(f => f.id === id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f));
  };

  const columns = [
      { key: 'name', label: 'Feature', render: (row: FeatureFlag) => (
          <div>
              <div className="font-bold text-slate-900">{row.name}</div>
              <div className="text-xs text-slate-500 font-mono">{row.key}</div>
          </div>
      )},
      { key: 'status', label: 'State', render: (row: FeatureFlag) => (
          <button onClick={() => handleToggleStatus(row.id)} className={`flex items-center gap-2 transition-colors ${row.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
              {row.status === 'Active' ? <ToggleRight size={28} fill="currentColor" className="opacity-20" /> : <ToggleLeft size={28} />}
              <span className="text-xs font-bold uppercase">{row.status}</span>
          </button>
      )},
      { key: 'rolloutPercentage', label: 'Rollout', render: (row: FeatureFlag) => (
          <div className="w-32">
              <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{row.rolloutPercentage}%</span>
                  <span className="text-slate-400">Target</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${row.status === 'Active' ? 'bg-indigo-600' : 'bg-slate-300'}`} style={{ width: `${row.rolloutPercentage}%` }}></div>
              </div>
          </div>
      )},
      { key: 'targetAudience', label: 'Audience', render: (row: FeatureFlag) => (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-600">
              <Users size={12} /> {row.targetAudience}
          </span>
      )},
      { key: 'actions', label: 'Actions', render: () => (
          <div className="flex justify-end gap-2">
              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={16}/></button>
              <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16}/></button>
          </div>
      )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Feature Flags</h2>
           <p className="text-sm text-slate-500">Manage feature rollouts and beta access.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
            <Plus size={18} /> New Feature Flag
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Active Flags</p>
                  <h3 className="text-2xl font-bold text-emerald-600">2</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Beta Features</p>
                  <h3 className="text-2xl font-bold text-indigo-600">1</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Zap size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Stale Flags</p>
                  <h3 className="text-2xl font-bold text-amber-600">0</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle size={24} /></div>
          </div>
      </div>

      <DataTable 
        title="Feature Toggles"
        data={flags}
        columns={columns as any}
        addButtonLabel="Add Flag"
        onAdd={() => setIsModalOpen(true)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Feature Flag">
          <form className="space-y-4">
              <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Feature Name</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. New Dashboard" />
              </div>
              <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Key (Snake Case)</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. new_dashboard_v2" />
              </div>
              <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Target Audience</label>
                      <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option>All Users</option>
                          <option>Beta Users</option>
                          <option>Internal Only</option>
                          <option>Premium Plan</option>
                      </select>
                  </div>
                  <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Rollout %</label>
                      <input type="number" min="0" max="100" defaultValue="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Create Flag</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default FeatureFlags;
