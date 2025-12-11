
import React, { useState, useEffect } from 'react';
import { 
  Key, Globe, Code, Plus, Trash2, RefreshCw, Copy, CheckCircle, XCircle, AlertTriangle, Play, HardDrive, Database, Server
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiKey, WebhookEndpoint } from '../../types';
import Modal from '../ui/Modal';

const DeveloperTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'KEYS' | 'WEBHOOKS' | 'LOGS' | 'MAINTENANCE'>('KEYS');
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Key State
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['READ']);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // New Webhook State
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(['tenant.created']);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'KEYS') {
        const data = await api.getApiKeys();
        setKeys(data);
      } else if (activeTab === 'WEBHOOKS') {
        const data = await api.getWebhooks();
        setWebhooks(data);
      }
    } catch (error) {
      console.error("Failed to load developer data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    try {
        // Mock API call
        const key = await api.createApiKey({ name: newKeyName, scopes: newKeyScopes as any });
        setGeneratedKey("sk_live_generated_secret_key_1234567890"); // Mock secret
        setKeys([...keys, key as ApiKey]);
    } catch (e) {
        alert("Failed to create key");
    }
  };

  const handleAddWebhook = () => {
      const newHook: WebhookEndpoint = {
          id: `wh_${Date.now()}`,
          url: newWebhookUrl,
          events: newWebhookEvents,
          status: 'Active',
          failureCount: 0,
          lastTriggered: 'Never',
          secret: 'whsec_...'
      };
      setWebhooks([...webhooks, newHook]);
      setIsModalOpen(false);
      setNewWebhookUrl('');
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
  };

  const handleMaintenanceAction = (action: string) => {
      alert(`Triggered action: ${action}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Developer Resources</h2>
           <p className="text-sm text-slate-500">Manage API access and system integrations.</p>
        </div>
        <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-2">
            <Code size={16} /> View API Documentation
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('KEYS')}
            className={`${activeTab === 'KEYS' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Key size={18} /> API Keys
          </button>
          <button
            onClick={() => setActiveTab('WEBHOOKS')}
            className={`${activeTab === 'WEBHOOKS' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Globe size={18} /> Webhooks
          </button>
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`${activeTab === 'LOGS' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Code size={18} /> Request Logs
          </button>
          <button
            onClick={() => setActiveTab('MAINTENANCE')}
            className={`${activeTab === 'MAINTENANCE' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <HardDrive size={18} /> System Maintenance
          </button>
        </nav>
      </div>

      {/* --- API KEYS --- */}
      {activeTab === 'KEYS' && (
          <div className="space-y-6">
              <div className="flex justify-end">
                  <button 
                    onClick={() => { setGeneratedKey(null); setIsModalOpen(true); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"
                  >
                      <Plus size={16} /> Generate Key
                  </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
                          <tr>
                              <th className="px-6 py-4 font-semibold">Name</th>
                              <th className="px-6 py-4 font-semibold">Key Prefix</th>
                              <th className="px-6 py-4 font-semibold">Permissions</th>
                              <th className="px-6 py-4 font-semibold">Created</th>
                              <th className="px-6 py-4 font-semibold">Last Used</th>
                              <th className="px-6 py-4 font-semibold text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {keys.map(key => (
                              <tr key={key.id} className={key.status === 'Revoked' ? 'opacity-50 bg-slate-50' : ''}>
                                  <td className="px-6 py-4 font-medium text-slate-900">{key.name}</td>
                                  <td className="px-6 py-4 font-mono text-xs">{key.prefix}</td>
                                  <td className="px-6 py-4">
                                      <div className="flex gap-1">
                                          {key.scopes.map(scope => (
                                              <span key={scope} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold">
                                                  {scope}
                                              </span>
                                          ))}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4">{key.created}</td>
                                  <td className="px-6 py-4">{key.lastUsed}</td>
                                  <td className="px-6 py-4 text-right">
                                      {key.status === 'Active' ? (
                                          <button className="text-rose-600 hover:bg-rose-50 p-2 rounded transition-colors" title="Revoke Key">
                                              <Trash2 size={16} />
                                          </button>
                                      ) : (
                                          <span className="text-slate-400 text-xs italic">Revoked</span>
                                      )}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* --- WEBHOOKS --- */}
      {activeTab === 'WEBHOOKS' && (
          <div className="space-y-6">
              <div className="flex justify-end">
                  <button 
                    onClick={() => { setNewWebhookUrl(''); setIsModalOpen(true); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"
                  >
                      <Plus size={16} /> Add Endpoint
                  </button>
              </div>

              <div className="grid gap-4">
                  {webhooks.map(hook => (
                      <div key={hook.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-lg ${
                                  hook.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                                  hook.status === 'Failed' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                                  <Globe size={20} />
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-slate-900 font-mono text-sm">{hook.url}</h3>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                          hook.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                          hook.status === 'Failed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                          {hook.status}
                                      </span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">Events: {hook.events.join(', ')}</p>
                                  {hook.status === 'Failed' && (
                                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                                          <AlertTriangle size={12} /> {hook.failureCount} recent failures
                                      </p>
                                  )}
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                              <p>Last triggered: {hook.lastTriggered}</p>
                              <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-1">
                                  <Play size={12} /> Test
                              </button>
                              <button className="text-rose-600 hover:underline">Delete</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- LOGS --- */}
      {activeTab === 'LOGS' && (
          <div className="bg-slate-900 rounded-xl p-6 font-mono text-xs text-slate-300 h-96 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                  <span className="w-20">Time</span>
                  <span className="w-16">Method</span>
                  <span className="w-16">Status</span>
                  <span className="flex-1">Path</span>
                  <span className="w-20 text-right">Latency</span>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                      <span className="w-20 text-slate-500">10:42:01</span>
                      <span className="w-16 text-emerald-400">POST</span>
                      <span className="w-16 text-emerald-400">200</span>
                      <span className="flex-1 text-slate-200">/v1/tenants/create</span>
                      <span className="w-20 text-right text-slate-500">120ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="w-20 text-slate-500">10:41:55</span>
                      <span className="w-16 text-blue-400">GET</span>
                      <span className="w-16 text-emerald-400">200</span>
                      <span className="flex-1 text-slate-200">/v1/analytics/daily</span>
                      <span className="w-20 text-right text-slate-500">45ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="w-20 text-slate-500">10:40:12</span>
                      <span className="w-16 text-emerald-400">POST</span>
                      <span className="w-16 text-rose-400">401</span>
                      <span className="flex-1 text-slate-200">/v1/webhooks/test</span>
                      <span className="w-20 text-right text-slate-500">12ms</span>
                  </div>
              </div>
          </div>
      )}

      {/* --- MAINTENANCE --- */}
      {activeTab === 'MAINTENANCE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><HardDrive size={18}/> Cache Management</h3>
                  <p className="text-sm text-slate-500 mb-6">Operations to clear system caches. Use with caution during high traffic.</p>
                  <div className="space-y-3">
                      <button onClick={() => handleMaintenanceAction('Clear API Cache')} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex justify-between items-center group">
                          <span className="text-sm font-medium text-slate-700">Clear API Cache</span>
                          <span className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 font-bold">RUN NOW</span>
                      </button>
                      <button onClick={() => handleMaintenanceAction('Flush Redis')} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex justify-between items-center group">
                          <span className="text-sm font-medium text-slate-700">Flush RedisDB</span>
                          <span className="text-xs text-rose-600 opacity-0 group-hover:opacity-100 font-bold">RUN NOW</span>
                      </button>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Database size={18}/> Database Operations</h3>
                  <p className="text-sm text-slate-500 mb-6">Database maintenance tasks.</p>
                  <div className="space-y-3">
                      <button onClick={() => handleMaintenanceAction('Vacuum DB')} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex justify-between items-center group">
                          <span className="text-sm font-medium text-slate-700">Vacuum Database (Optimize)</span>
                          <span className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 font-bold">RUN NOW</span>
                      </button>
                      <button onClick={() => handleMaintenanceAction('Re-index')} className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex justify-between items-center group">
                          <span className="text-sm font-medium text-slate-700">Re-index Search Tables</span>
                          <span className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 font-bold">RUN NOW</span>
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'KEYS' ? 'Generate API Key' : 'Add Webhook Endpoint'}
      >
        {activeTab === 'KEYS' ? (
            !generatedKey ? (
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">Key Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Mobile App"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Permissions</label>
                        <div className="flex gap-4">
                            {['READ', 'WRITE', 'ADMIN'].map(scope => (
                                <label key={scope} className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={newKeyScopes.includes(scope)}
                                        onChange={(e) => {
                                            if (e.target.checked) setNewKeyScopes([...newKeyScopes, scope]);
                                            else setNewKeyScopes(newKeyScopes.filter(s => s !== scope));
                                        }}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-600">{scope}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button 
                            onClick={handleGenerateKey}
                            disabled={!newKeyName}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Generate Key
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900">API Key Generated</h3>
                    <p className="text-sm text-slate-500">Please copy this key now. You won't be able to see it again.</p>
                    
                    <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                        <code className="text-xs font-mono text-slate-700 flex-1 break-all">{generatedKey}</code>
                        <button onClick={() => copyToClipboard(generatedKey)} className="text-slate-400 hover:text-indigo-600">
                            <Copy size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-sm font-bold text-slate-600 hover:underline"
                    >
                        Close
                    </button>
                </div>
            )
        ) : (
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Endpoint URL</label>
                    <input 
                        type="url" 
                        placeholder="https://api.yoursite.com/webhooks"
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Events to Subscribe</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                        <option>All Events (*)</option>
                        <option>tenant.created</option>
                        <option>invoice.paid</option>
                    </select>
                    <p className="text-xs text-slate-400">Currently subscribes to all events for demo.</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={handleAddWebhook}
                        disabled={!newWebhookUrl}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Add Endpoint
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default DeveloperTools;
