
import React, { useState } from 'react';
import { Bell, Send, AlertTriangle, Info, CheckCircle, Search, Trash2 } from 'lucide-react';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';

const NotificationManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
      { id: '1', title: 'System Maintenance', type: 'System', status: 'Sent', date: '2024-12-15', recipients: 'All Users' },
      { id: '2', title: 'New Feature: AI Pricing', type: 'Feature', status: 'Scheduled', date: '2024-12-20', recipients: 'Admin Role' },
      { id: '3', title: 'Billing Issue Resolved', type: 'Alert', status: 'Sent', date: '2024-12-10', recipients: 'Tenant: Hotel Mumbai' },
  ]);

  const [formData, setFormData] = useState({
      title: '',
      message: '',
      type: 'Info',
      recipients: 'ALL'
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setNotifications([...notifications, {
          id: Date.now().toString(),
          title: formData.title,
          type: formData.type,
          status: 'Scheduled',
          date: new Date().toISOString().split('T')[0],
          recipients: formData.recipients
      }]);
      setIsModalOpen(false);
  };

  const columns = [
      { key: 'title', label: 'Subject', render: (row: any) => <span className="font-medium text-slate-900">{row.title}</span> },
      { key: 'type', label: 'Type', render: (row: any) => (
          <span className={`px-2 py-1 rounded text-xs font-bold ${
              row.type === 'Alert' ? 'bg-rose-100 text-rose-700' : 
              row.type === 'System' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>{row.type}</span>
      )},
      { key: 'recipients', label: 'Audience' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status', render: (row: any) => (
          <span className={`flex items-center gap-1 text-xs font-bold ${
              row.status === 'Sent' ? 'text-emerald-600' : 'text-slate-500'
          }`}>
              {row.status === 'Sent' ? <CheckCircle size={12}/> : <Info size={12}/>}
              {row.status}
          </span>
      )},
      { key: 'actions', label: 'Actions', render: () => (
          <button className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
      )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Notification Center</h2>
           <p className="text-sm text-slate-500">Send system-wide alerts and announcements.</p>
        </div>
      </div>

      <DataTable 
        title="Broadcast History"
        data={notifications}
        columns={columns}
        onAdd={() => setIsModalOpen(true)}
        addButtonLabel="New Broadcast"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send Notification">
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Subject</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
              </div>
              <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Message Type</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                      <option value="Info">General Information</option>
                      <option value="System">System Maintenance</option>
                      <option value="Alert">Critical Alert</option>
                      <option value="Feature">Feature Announcement</option>
                  </select>
              </div>
              <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Recipients</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={e => setFormData({...formData, recipients: e.target.value})}
                  >
                      <option value="ALL">All Users</option>
                      <option value="ADMINS">All Admins</option>
                      <option value="PLAN_PRO">Professional Plan Tenants</option>
                  </select>
              </div>
              <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Message Body</label>
                  <textarea required rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">Cancel</button>
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
                      <Send size={16}/> Send Now
                  </button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default NotificationManager;
