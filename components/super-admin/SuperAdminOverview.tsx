
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Building, Users, Server, Activity, ArrowUpRight, 
  MapPin, Clock, Plus, Shield, FileText, AlertCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { PlatformAnalyticsData } from '../../types';

interface SuperAdminOverviewProps {
  setActiveView: (view: string) => void;
}

const SuperAdminOverview: React.FC<SuperAdminOverviewProps> = ({ setActiveView }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PlatformAnalyticsData | null>(null);

  // Mock Data for specific overview widgets not in global analytics
  const recentActivity = [
    { id: 1, type: 'signup', message: 'New tenant "Goa Beach Resort" registered', time: '10 mins ago', icon: Building, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 2, type: 'upgrade', message: 'Hotel Mumbai upgraded to Enterprise Plan', time: '2 hours ago', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 3, type: 'alert', message: 'High latency detected on API Gateway', time: '4 hours ago', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { id: 4, type: 'user', message: 'Rajesh Kumar added as Admin', time: '5 hours ago', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  const topLocations = [
    { city: 'Mumbai', count: 18, percentage: 35 },
    { city: 'Delhi NCR', count: 12, percentage: 24 },
    { city: 'Goa', count: 8, percentage: 16 },
    { city: 'Bangalore', count: 6, percentage: 12 },
    { city: 'Other', count: 11, percentage: 22 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await api.getPlatformAnalytics();
        setData(analytics);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
           <ArrowUpRight size={12}/> {subtext}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Fallback if data fetch fails
  const chartData = data?.mrrHistory || [
    { month: 'Jan', amount: 40000 }, { month: 'Feb', amount: 55000 },
    { month: 'Mar', amount: 75000 }, { month: 'Apr', amount: 92000 },
    { month: 'May', amount: 110000 }, { month: 'Jun', amount: 135000 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
            title="Total MRR" 
            value={`₹${(chartData[chartData.length-1].amount/1000).toFixed(0)}k`} 
            subtext="15% vs last month" 
            icon={TrendingUp} 
            color="bg-indigo-500" 
        />
        <StatCard 
            title="Active Hotels" 
            value={data?.userGrowth[data.userGrowth.length-1].tenants || 55} 
            subtext="5 new this week" 
            icon={Building} 
            color="bg-emerald-500" 
        />
        <StatCard 
            title="Total Users" 
            value={data?.userGrowth[data.userGrowth.length-1].users || 142} 
            subtext="Active across platforms" 
            icon={Users} 
            color="bg-blue-500" 
        />
        <StatCard 
            title="System Health" 
            value="99.9%" 
            subtext="Uptime (30 days)" 
            icon={Server} 
            color="bg-slate-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Revenue Growth Trend</h3>
                <select className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-slate-50 outline-none">
                    <option>Last 6 Months</option>
                    <option>Year to Date</option>
                </select>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip 
                            formatter={(value: number) => `₹${value.toLocaleString()}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 3. Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-indigo-600"/> Live Activity
            </h3>
            <div className="space-y-6 relative">
                {/* Connector Line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100"></div>
                
                {recentActivity.map((activity) => (
                    <div key={activity.id} className="relative flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm ${activity.bg} ${activity.color}`}>
                            <activity.icon size={14} />
                        </div>
                        <div className="pt-1">
                            <p className="text-sm font-medium text-slate-800 leading-snug">{activity.message}</p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <Clock size={10} /> {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 text-xs font-bold text-slate-500 hover:text-indigo-600 py-2 border-t border-slate-100 transition-colors">
                View Audit Logs
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 4. Geographic Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-rose-500"/> Tenant Distribution
              </h3>
              <div className="space-y-4">
                  {topLocations.map((loc, idx) => (
                      <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-slate-700">{loc.city}</span>
                              <span className="text-slate-500">{loc.count} Hotels</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full opacity-80" 
                                style={{ width: `${loc.percentage}%` }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 5. Quick Actions Grid */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveView('SA_TENANTS')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                  >
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Plus size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Add Tenant</span>
                  </button>

                  <button 
                    onClick={() => setActiveView('SA_ADMINS')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                  >
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Shield size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Manage Admins</span>
                  </button>

                  <button 
                    onClick={() => setActiveView('SA_LOGS')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                  >
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <FileText size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Audit Logs</span>
                  </button>

                  <button 
                    onClick={() => setActiveView('SA_SETTINGS')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                  >
                      <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Server size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">System Config</span>
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SuperAdminOverview;
