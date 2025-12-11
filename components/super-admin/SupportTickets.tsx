
import React, { useState } from 'react';
import { LifeBuoy, MessageSquare, CheckCircle, Clock, User } from 'lucide-react';
import DataTable from '../ui/DataTable';

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState([
      { id: 'T-1023', subject: 'API Integration Error', tenant: 'Hotel Mumbai', priority: 'High', status: 'Open', created: '2 hours ago' },
      { id: 'T-1022', subject: 'Billing Question', tenant: 'Seaside Resort', priority: 'Low', status: 'Closed', created: '1 day ago' },
      { id: 'T-1021', subject: 'Feature Request: Dark Mode', tenant: 'City Inn', priority: 'Medium', status: 'In Progress', created: '3 days ago' },
  ]);

  const columns = [
      { key: 'id', label: 'Ticket ID', render: (row: any) => <span className="font-mono font-bold text-slate-700">{row.id}</span> },
      { key: 'subject', label: 'Subject', render: (row: any) => <span className="font-medium text-slate-900">{row.subject}</span> },
      { key: 'tenant', label: 'Tenant', render: (row: any) => <div className="flex items-center gap-1 text-slate-600"><User size={12}/> {row.tenant}</div> },
      { key: 'priority', label: 'Priority', render: (row: any) => (
          <span className={`text-xs font-bold px-2 py-1 rounded ${
              row.priority === 'High' ? 'bg-rose-100 text-rose-700' : 
              row.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>{row.priority}</span>
      )},
      { key: 'status', label: 'Status', render: (row: any) => (
          <span className={`flex items-center gap-1 text-xs font-bold ${
              row.status === 'Open' ? 'text-rose-600' : 
              row.status === 'In Progress' ? 'text-indigo-600' : 'text-emerald-600'
          }`}>
              {row.status === 'Open' ? <Clock size={12}/> : <CheckCircle size={12}/>}
              {row.status}
          </span>
      )},
      { key: 'actions', label: 'Actions', render: () => (
          <button className="text-indigo-600 hover:underline text-xs font-bold">View Ticket</button>
      )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Support Tickets</h2>
           <p className="text-sm text-slate-500">Helpdesk and customer inquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">Open Tickets</p>
              <h3 className="text-2xl font-bold text-rose-600">5</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">Avg Response Time</p>
              <h3 className="text-2xl font-bold text-indigo-600">2.5 hrs</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">Satisfaction Score</p>
              <h3 className="text-2xl font-bold text-emerald-600">4.8/5</h3>
          </div>
      </div>

      <DataTable 
        title="Recent Tickets"
        data={tickets}
        columns={columns}
      />
    </div>
  );
};

export default SupportTickets;
