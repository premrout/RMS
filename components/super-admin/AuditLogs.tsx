
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, FileText, CheckCircle, XCircle, 
  ChevronRight, Clock, Shield, User, Globe, Server
} from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { api } from '../../services/api';
import Modal from '../ui/Modal';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  
  // Filters
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterResource, setFilterResource] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to load logs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesResource = filterResource === 'ALL' || log.resource === filterResource;
    const matchesSearch = log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesResource && matchesSearch;
  });

  const getActionColor = (action: string) => {
    switch(action) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'LOGIN': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'SYSTEM': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getIconForResource = (resource: string) => {
    switch(resource.toLowerCase()) {
      case 'user': return <User size={14} />;
      case 'plan': return <FileText size={14} />;
      case 'system': return <Server size={14} />;
      case 'security': return <Shield size={14} />;
      default: return <Globe size={14} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">System Audit Logs</h2>
           <p className="text-sm text-slate-500">Track all administrative actions and system events.</p>
        </div>
        <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
         <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Actor, ID, or Details..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
         </div>
         <select 
           value={filterAction} 
           onChange={(e) => setFilterAction(e.target.value)}
           className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
         >
            <option value="ALL">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="SYSTEM">System</option>
         </select>
         <select 
           value={filterResource} 
           onChange={(e) => setFilterResource(e.target.value)}
           className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
         >
            <option value="ALL">All Resources</option>
            <option value="User">User</option>
            <option value="Plan">Subscription Plan</option>
            <option value="Rate">Rate</option>
            <option value="System">System Config</option>
         </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                  <tr>
                     <th className="px-6 py-4">Timestamp</th>
                     <th className="px-6 py-4">Actor</th>
                     <th className="px-6 py-4">Action</th>
                     <th className="px-6 py-4">Resource</th>
                     <th className="px-6 py-4">Summary</th>
                     <th className="px-6 py-4 text-right">Details</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading logs...</td></tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No logs match your filters.</td></tr>
                  ) : (
                    filteredLogs.map((log) => (
                       <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <Clock size={14} className="text-slate-400" />
                                {log.timestamp}
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="font-medium text-slate-900">{log.actorName}</div>
                             <div className="text-xs text-slate-400 flex items-center gap-1">
                                {log.ipAddress} • <span className="uppercase">{log.actorRole}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getActionColor(log.action)}`}>
                                {log.action}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className="p-1.5 bg-slate-100 rounded text-slate-500">
                                   {getIconForResource(log.resource)}
                                </span>
                                <span className="font-medium">{log.resource}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate">
                             <span className={log.status === 'FAILURE' ? 'text-rose-600 font-medium' : ''}>
                                {log.details}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button 
                                onClick={() => setSelectedLog(log)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                             >
                                <ChevronRight size={18} />
                             </button>
                          </td>
                       </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
         <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filteredLogs.length} events</span>
            <div className="flex gap-2">
               <button disabled className="px-3 py-1 border rounded bg-white text-slate-300 cursor-not-allowed">Previous</button>
               <button className="px-3 py-1 border rounded bg-white hover:bg-slate-50 text-slate-600">Next</button>
            </div>
         </div>
      </div>

      {/* Detail Modal */}
      <Modal
         isOpen={!!selectedLog}
         onClose={() => setSelectedLog(null)}
         title="Log Details"
         size="lg"
      >
         {selectedLog && (
            <div className="space-y-6">
               {/* Header Info */}
               <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                     <p className="text-xs text-slate-500 font-bold uppercase">Event ID</p>
                     <p className="font-mono text-sm text-slate-900">{selectedLog.id}</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-bold uppercase">Timestamp</p>
                     <p className="text-sm text-slate-900">{selectedLog.timestamp}</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-bold uppercase">Actor</p>
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{selectedLog.actorName}</span>
                        <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded">{selectedLog.actorRole}</span>
                     </div>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-bold uppercase">Source IP</p>
                     <p className="font-mono text-sm text-slate-900">{selectedLog.ipAddress}</p>
                  </div>
               </div>

               {/* Status Banner */}
               <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  selectedLog.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
               }`}>
                  {selectedLog.status === 'SUCCESS' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  <div>
                     <p className="font-bold text-sm">Action {selectedLog.status === 'SUCCESS' ? 'Completed Successfully' : 'Failed'}</p>
                     <p className="text-xs mt-0.5">{selectedLog.details}</p>
                  </div>
               </div>

               {/* Technical Data (Mock Diff) */}
               <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                     <FileText size={18} className="text-indigo-600" />
                     Change Payload
                  </h4>
                  <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                     <pre className="text-xs font-mono text-emerald-400">
                        {JSON.stringify(selectedLog.metadata || { 
                           resource_id: "res_12345",
                           changes: {
                              before: { status: "Inactive", tier: "Free" },
                              after: { status: "Active", tier: "Pro" }
                           },
                           trace_id: "tr_889210aa"
                        }, null, 2)}
                     </pre>
                  </div>
               </div>
               
               <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button 
                     onClick={() => setSelectedLog(null)}
                     className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
                  >
                     Close
                  </button>
               </div>
            </div>
         )}
      </Modal>
    </div>
  );
};

export default AuditLogs;
