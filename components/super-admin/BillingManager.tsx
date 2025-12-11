
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Download, Search, AlertCircle, CheckCircle, 
  Clock, DollarSign, TrendingUp, Filter, RefreshCw 
} from 'lucide-react';
import DataTable from '../ui/DataTable';
import { Invoice } from '../../types';
import { api } from '../../services/api';

const BillingManager: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    mrr: 0,
    activeSubscribers: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getInvoices();
      setInvoices(data);
      
      // Calculate Stats
      const total = data.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);
      const pending = data.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((sum, i) => sum + i.amount, 0);
      
      setStats({
        totalRevenue: total,
        pendingAmount: pending,
        mrr: Math.round(total / 12), // Rough estimate
        activeSubscribers: new Set(data.map(i => i.tenantId)).size
      });
    } catch (error) {
      console.error("Failed to load billing data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (invoiceId: string) => {
    alert(`Downloading invoice ${invoiceId}...`);
  };

  const columns = [
    {
      key: 'id',
      label: 'Invoice Details',
      render: (row: Invoice) => (
        <div>
          <div className="font-bold text-slate-900">{row.id}</div>
          <div className="text-xs text-slate-500">{row.date}</div>
        </div>
      )
    },
    {
      key: 'tenantName',
      label: 'Tenant',
      render: (row: Invoice) => (
        <div>
          <div className="font-medium text-slate-900">{row.tenantName}</div>
          <div className="text-xs text-slate-500">ID: {row.tenantId}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row: Invoice) => (
        <div className="font-mono font-bold text-slate-800">
           ₹{row.amount.toLocaleString()}
           <div className="text-[10px] text-slate-400 font-sans">{row.planName}</div>
        </div>
      )
    },
    {
        key: 'paymentMethod',
        label: 'Method',
        render: (row: Invoice) => (
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                {row.paymentMethod}
            </span>
        )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Invoice) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            row.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
            row.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
            row.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-100' :
            'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
            {row.status === 'PAID' && <CheckCircle size={10} />}
            {row.status === 'PENDING' && <Clock size={10} />}
            {row.status === 'OVERDUE' && <AlertCircle size={10} />}
            {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Invoice) => (
        <button 
            onClick={() => handleDownload(row.id)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
            title="Download Invoice"
        >
            <Download size={16} />
        </button>
      )
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
              <p className="text-xs text-slate-400 mt-1">{subtext}</p>
          </div>
          <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
              <Icon size={24} className={color.replace('bg-', 'text-')} />
          </div>
      </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue (YTD)" 
            value={`₹${(stats.totalRevenue/100000).toFixed(2)}L`} 
            icon={DollarSign} 
            color="bg-emerald-500"
            subtext="Calculated from paid invoices"
          />
          <StatCard 
            title="Monthly Recurring (MRR)" 
            value={`₹${(stats.mrr/1000).toFixed(1)}k`} 
            icon={TrendingUp} 
            color="bg-indigo-500"
            subtext="Estimated recurring revenue"
          />
          <StatCard 
            title="Outstanding" 
            value={`₹${stats.pendingAmount.toLocaleString()}`} 
            icon={Clock} 
            color="bg-amber-500"
            subtext="Pending & Overdue invoices"
          />
          <StatCard 
            title="Active Tenants" 
            value={stats.activeSubscribers} 
            icon={CreditCard} 
            color="bg-blue-500"
            subtext="Billed in current cycle"
          />
      </div>

      {/* Main Content */}
      <DataTable 
        title="Invoices & Transactions"
        data={invoices}
        columns={columns as any}
        isLoading={loading}
      />
    </div>
  );
};

export default BillingManager;
