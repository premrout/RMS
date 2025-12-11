
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, Activity, AlertTriangle, Download, 
  ArrowUpRight, ArrowDownRight, Server, Zap
} from 'lucide-react';
import { api } from '../../services/api';
import { PlatformAnalyticsData } from '../../types';

const PlatformAnalytics: React.FC = () => {
  const [data, setData] = useState<PlatformAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await api.getPlatformAnalytics();
      setData(result);
    } catch (error) {
      console.error("Failed to load analytics", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
           {trend >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
           {Math.abs(trend)}% vs last month
        </div>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg text-slate-400">
        <Icon size={20} />
      </div>
    </div>
  );

  if (loading || !data) {
    return <div className="p-12 text-center text-slate-400">Loading analytics data...</div>;
  }

  const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Platform Analytics</h2>
           <p className="text-sm text-slate-500">Growth metrics, system health, and usage insights.</p>
        </div>
        <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
            title="Monthly Recurring Revenue" 
            value={`₹${(data.mrrHistory[data.mrrHistory.length-1].amount/1000).toFixed(1)}k`} 
            trend={12.5} 
            icon={TrendingUp} 
        />
        <StatCard 
            title="Total Active Tenants" 
            value={data.userGrowth[data.userGrowth.length-1].tenants} 
            trend={8.2} 
            icon={Users} 
        />
        <StatCard 
            title="Avg Churn Rate" 
            value={`${data.churnRate}%`} 
            trend={data.churnTrend} 
            icon={AlertTriangle} 
        />
        <StatCard 
            title="API Request Volume" 
            value="1.2M" 
            trend={15.4} 
            icon={Activity} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MRR Growth Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Revenue Growth (MRR)</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.mrrHistory}>
                        <defs>
                            <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                        <Area type="monotone" dataKey="amount" stroke="#4f46e5" fillOpacity={1} fill="url(#colorMrr)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* User vs Tenant Growth */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">User & Tenant Growth</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tenants" name="Tenants (Hotels)" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="users" name="Total Users" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Feature Adoption */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Zap size={18} className="text-amber-500"/> Feature Adoption Rate</h3>
             <div className="space-y-4">
                 {data.featureUsage.map((feat, idx) => (
                     <div key={idx}>
                         <div className="flex justify-between text-sm mb-1">
                             <span className="font-medium text-slate-700">{feat.feature}</span>
                             <span className="font-bold text-slate-900">{feat.percentage}%</span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-2.5">
                             <div 
                                className="bg-indigo-600 h-2.5 rounded-full" 
                                style={{ width: `${feat.percentage}%` }}
                             ></div>
                         </div>
                         <p className="text-xs text-slate-500 mt-1">{feat.count} active tenants using this feature</p>
                     </div>
                 ))}
             </div>
        </div>

        {/* Top API Consumers */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Server size={18} className="text-indigo-600"/> Top API Consumers</h3>
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                         <tr>
                             <th className="px-4 py-3 font-medium">Tenant</th>
                             <th className="px-4 py-3 font-medium">Requests (Mo)</th>
                             <th className="px-4 py-3 font-medium">Error Rate</th>
                             <th className="px-4 py-3 font-medium">Status</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {data.apiUsage.map((usage, idx) => (
                             <tr key={idx} className="hover:bg-slate-50">
                                 <td className="px-4 py-3 font-bold text-slate-700">{usage.tenantName}</td>
                                 <td className="px-4 py-3 font-mono">{usage.requests.toLocaleString()}</td>
                                 <td className="px-4 py-3">
                                     <span className={`px-2 py-0.5 rounded text-xs font-bold ${usage.errorRate > 1 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                         {usage.errorRate}%
                                     </span>
                                 </td>
                                 <td className="px-4 py-3">
                                     <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Healthy
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                 <button className="text-indigo-600 text-sm font-bold hover:underline">View All API Logs</button>
             </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformAnalytics;
