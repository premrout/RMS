
import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Key, 
  Activity, 
  Save, 
  Shield, 
  Database, 
  Server, 
  Globe, 
  Bell, 
  Plus, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROPERTY' | 'USERS' | 'API' | 'HEALTH'>('PROPERTY');

  // Mock Data for Users
  const [users, setUsers] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@hotelmumbai.com', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Priya Sharma', email: 'priya@hotelmumbai.com', role: 'Manager', status: 'Active', lastLogin: '4 hours ago' },
    { id: 3, name: 'Front Desk', email: 'reception@hotelmumbai.com', role: 'Staff', status: 'Active', lastLogin: '1 hour ago' },
  ]);

  // Mock Data for API Keys
  const [apiKeys] = useState([
    { id: 'key_live_...', name: 'Production API', created: '2024-01-15', lastUsed: 'Just now' },
    { id: 'key_test_...', name: 'Staging Environment', created: '2024-03-10', lastUsed: '2 days ago' },
  ]);

  // Mock Data for Webhooks
  const [webhookLogs] = useState([
    { id: 'evt_1', type: 'booking.created', status: 200, time: '10:42 AM', source: 'Booking.com' },
    { id: 'evt_2', type: 'rate.pushed', status: 200, time: '10:40 AM', source: 'System' },
    { id: 'evt_3', type: 'inventory.sync_failed', status: 502, time: '09:15 AM', source: 'MakeMyTrip' },
    { id: 'evt_4', type: 'booking.cancelled', status: 200, time: '08:30 AM', source: 'Agoda' },
  ]);

  // Mock System Health
  const services = [
    { name: 'Primary Database (Postgres)', status: 'Healthy', uptime: '99.99%', latency: '45ms', icon: Database },
    { name: 'Redis Cache Layer', status: 'Healthy', uptime: '100%', latency: '5ms', icon: Server },
    { name: 'OTA Gateway (Channel Manager)', status: 'Degraded', uptime: '98.50%', latency: '850ms', icon: Globe },
    { name: 'Notification Service (Email/SMS)', status: 'Healthy', uptime: '99.95%', latency: '120ms', icon: Bell },
  ];

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
           <p className="text-slate-500 mt-1">Super admin controls for property, users, and system configuration.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { id: 'PROPERTY', label: 'Property Settings', icon: Building },
            { id: 'USERS', label: 'User Roles', icon: Users },
            { id: 'API', label: 'API & Webhooks', icon: Key },
            { id: 'HEALTH', label: 'System Health', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        
        {/* --- PROPERTY SETTINGS --- */}
        {activeTab === 'PROPERTY' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Hotel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Property Name</label>
                      <input type="text" defaultValue="Hotel Mumbai Deluxe" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Contact Email</label>
                      <input type="email" defaultValue="admin@hotelmumbai.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">Address</label>
                      <input type="text" defaultValue="123 Colaba Causeway, Mumbai, MH, 400001" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Default Currency</label>
                      <input type="text" disabled defaultValue="INR (₹)" className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Timezone</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>Asia/Kolkata (IST)</option>
                        <option>Asia/Dubai</option>
                      </select>
                   </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-indigo-900 text-white p-6 rounded-xl relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="font-bold text-lg mb-2">Enterprise Plan</h3>
                   <p className="text-indigo-200 text-sm mb-4">Your subscription renews on Jan 1, 2025.</p>
                   <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold">Manage Billing</button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              </div>
            </div>
          </div>
        )}

        {/* --- USER ROLES --- */}
        {activeTab === 'USERS' && (
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">Team Members</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700">
                   <Plus size={16} /> Add User
                </button>
             </div>
             <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-white border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-4 font-semibold text-slate-900">User</th>
                   <th className="px-6 py-4 font-semibold text-slate-900">Role</th>
                   <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                   <th className="px-6 py-4 font-semibold text-slate-900">Last Login</th>
                   <th className="px-6 py-4 font-semibold text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {users.map(user => (
                   <tr key={user.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4">
                       <div className="font-medium text-slate-900">{user.name}</div>
                       <div className="text-slate-400 text-xs">{user.email}</div>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                         user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                         user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                         'bg-slate-100 text-slate-700'
                       }`}>
                         <Shield size={12} /> {user.role}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className="text-emerald-600 font-medium text-xs flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {user.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-slate-500">{user.lastLogin}</td>
                     <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-2"
                        title="Remove User"
                       >
                         <Trash2 size={18} />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {/* --- API & WEBHOOKS --- */}
        {activeTab === 'API' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Webhook Logs */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={18} /> Webhook Logs</h3>
                      <button className="text-slate-500 hover:text-indigo-600"><RefreshCw size={16} /></button>
                   </div>
                   <div className="max-h-[400px] overflow-y-auto">
                     <table className="w-full text-left text-sm">
                       <thead className="bg-white border-b border-slate-200 sticky top-0">
                         <tr>
                           <th className="px-4 py-2 font-medium text-slate-900">Time</th>
                           <th className="px-4 py-2 font-medium text-slate-900">Event</th>
                           <th className="px-4 py-2 font-medium text-slate-900">Status</th>
                           <th className="px-4 py-2 font-medium text-slate-900">Source</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {webhookLogs.map(log => (
                           <tr key={log.id} className="hover:bg-slate-50">
                             <td className="px-4 py-3 text-slate-500 font-mono text-xs">{log.time}</td>
                             <td className="px-4 py-3 font-medium text-slate-800">{log.type}</td>
                             <td className="px-4 py-3">
                               <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                 log.status >= 200 && log.status < 300 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                               }`}>
                                 {log.status}
                               </span>
                             </td>
                             <td className="px-4 py-3 text-slate-500">{log.source}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              </div>

              {/* API Keys Side Panel */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">API Credentials</h3>
                  <div className="space-y-4">
                     {apiKeys.map(key => (
                       <div key={key.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                             <span className="font-semibold text-sm text-slate-700">{key.name}</span>
                             <span className="text-[10px] text-slate-400">Used {key.lastUsed}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 rounded">
                             <code className="text-xs text-slate-600 font-mono flex-1 overflow-hidden text-ellipsis">{key.id}</code>
                             <button className="text-slate-400 hover:text-indigo-600"><Copy size={14} /></button>
                          </div>
                       </div>
                     ))}
                     <button className="w-full mt-2 border border-dashed border-indigo-300 text-indigo-600 bg-indigo-50 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                        Generate New Key
                     </button>
                  </div>
                </div>
              </div>
           </div>
        )}

        {/* --- SYSTEM HEALTH --- */}
        {activeTab === 'HEALTH' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${
                        svc.status === 'Healthy' ? 'bg-emerald-100 text-emerald-600' : 
                        svc.status === 'Degraded' ? 'bg-amber-100 text-amber-600' : 
                        'bg-rose-100 text-rose-600'
                      }`}>
                         <svc.icon size={24} />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        svc.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 
                        svc.status === 'Degraded' ? 'bg-amber-50 text-amber-700' : 
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {svc.status}
                      </span>
                   </div>
                   <h3 className="font-bold text-slate-800 mb-1">{svc.name}</h3>
                   <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                      <div>
                         <p className="text-xs text-slate-400">Uptime</p>
                         <p className="font-mono font-medium text-slate-700">{svc.uptime}</p>
                      </div>
                      <div>
                         <p className="text-xs text-slate-400">Latency</p>
                         <p className="font-mono font-medium text-slate-700">{svc.latency}</p>
                      </div>
                   </div>
                </div>
              ))}

              <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200 p-6 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-full shadow-sm"><CheckCircle className="text-emerald-500" size={24} /></div>
                    <div>
                       <h4 className="font-bold text-slate-800">All Systems Operational</h4>
                       <p className="text-sm text-slate-500">Last incident reported 45 days ago (Redis Connection Timeout).</p>
                    </div>
                 </div>
                 <button className="text-indigo-600 font-medium text-sm hover:underline">View Incident History</button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
