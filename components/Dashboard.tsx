
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { DailyData, DashboardMetrics, ActionItem, Channel, Competitor } from '../types';
import { 
  ArrowUpRight, ArrowDownRight, IndianRupee, Users, Activity, 
  BedDouble, AlertTriangle, CheckCircle, XCircle, Clock, 
  Calendar, Flame, ChevronRight, AlertCircle, TrendingUp, X, RefreshCw, Crosshair
} from 'lucide-react';

interface DashboardProps {
  data: DailyData[];
  metrics: DashboardMetrics;
  actions: ActionItem[];
  channels: Channel[];
  competitors: Competitor[];
}

const StatCard = ({ title, value, trend, icon: Icon, prefix = '', subtext = '' }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{prefix}{value}</h3>
      <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span className="ml-1 font-medium">{Math.abs(trend)}% vs last 30 days</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${trend >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data, metrics, actions, channels, competitors }) => {
  
  // Format Indian Rupees
  const formatINR = (val: number) => {
    if (val >= 100000) return (val / 100000).toFixed(2) + 'L';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
    return val.toString();
  };

  // Identify High Demand Dates dynamically from data
  const highDemandDates = useMemo(() => {
    return data
      .filter(day => day.occupancy > 70)
      .slice(0, 5)
      .map(day => {
        const dateObj = new Date(day.date);
        return {
          date: day.date,
          day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
          displayDate: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          occupancy: day.occupancy,
          adr: day.adr,
          isExtreme: day.occupancy > 90
        };
      });
  }, [data]);

  // Data for Competitor Chart (Next 7 Days)
  const compChartData = useMemo(() => {
      const today = new Date();
      return data
        .filter(d => new Date(d.date) >= today)
        .slice(0, 7)
        .map(d => ({
            date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
            myRate: d.adr,
            marketAvg: d.competitorRate
        }));
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Section 1: Today's Performance */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <Activity className="text-indigo-600" size={20} />
           <h2 className="text-xl font-bold text-slate-800">Today's Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Occupancy" 
            value={metrics.occupancyRate} 
            trend={-1.4} 
            icon={Users} 
            prefix=""
            subtext="24 Rooms Available"
          />
          <StatCard 
            title="Avg. Daily Rate (ADR)" 
            value={metrics.avgADR.toLocaleString('en-IN')} 
            trend={2.1} 
            icon={IndianRupee} 
            prefix="₹" 
          />
          <StatCard 
            title="RevPAR" 
            value={metrics.revPAR.toLocaleString('en-IN')} 
            trend={5.2} 
            icon={BedDouble} 
            prefix="₹" 
          />
          <StatCard 
            title="Total Revenue" 
            value={formatINR(metrics.totalRevenue)} 
            trend={8.4} 
            icon={TrendingUp} 
            prefix="₹" 
          />
        </div>
      </section>

      {/* Section 2: Priority Operations Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upcoming High Demand Dates */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Flame className="text-orange-500" size={18} /> High Demand Dates
                  </h3>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Next 30 Days</span>
              </div>
              <div className="p-2 flex-1 overflow-y-auto max-h-[300px]">
                  {highDemandDates.length > 0 ? (
                      <div className="space-y-1">
                          {highDemandDates.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center border ${item.isExtreme ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                          <span className="text-xs font-bold uppercase">{item.day}</span>
                                          <span className="text-lg font-bold leading-none">{new Date(item.date).getDate()}</span>
                                      </div>
                                      <div>
                                          <p className="font-semibold text-slate-800">{item.displayDate}</p>
                                          <div className="flex items-center gap-2">
                                              <p className="text-xs text-slate-500">Occ: {item.occupancy}%</p>
                                              {item.isExtreme && <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 rounded">HOT</span>}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-sm font-bold text-slate-900">₹{item.adr.toLocaleString('en-IN')}</p>
                                      <p className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Optimize</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="p-6 text-center text-slate-400">
                          <Calendar size={32} className="mx-auto mb-2 opacity-50"/>
                          <p>No high demand dates detected soon.</p>
                      </div>
                  )}
              </div>
              <div className="p-3 border-t border-slate-100 text-center">
                  <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center justify-center gap-1 w-full">
                      View Full Calendar <ChevronRight size={14} />
                  </button>
              </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <AlertCircle className="text-indigo-500" size={18} /> Action Center
                  </h3>
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-700 w-6 h-6 flex items-center justify-center rounded-full">{actions.length}</span>
              </div>
              <div className="p-2 flex-1 overflow-y-auto max-h-[300px]">
                  <div className="space-y-1">
                      {actions.map(action => (
                          <div key={action.id} className="p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group relative">
                              <button className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={14} />
                              </button>
                              <div className="flex justify-between items-start mb-1 pr-6">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                      action.type === 'Rate' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                      action.type === 'Inventory' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                      action.type === 'Reservation' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                      'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}>
                                      {action.type}
                                  </span>
                                  <span className="text-[10px] text-slate-400">Just now</span>
                              </div>
                              <p className="text-sm font-medium text-slate-800 leading-snug">{action.message}</p>
                              {action.priority === 'High' && (
                                  <div className="flex items-center gap-1 mt-2 text-rose-600 text-xs font-bold">
                                      <AlertTriangle size={12} /> Priority
                                  </div>
                              )}
                          </div>
                      ))}
                      {actions.length === 0 && (
                          <div className="p-6 text-center text-slate-400">
                             <CheckCircle size={32} className="mx-auto mb-2 opacity-50 text-emerald-500"/>
                             <p>All caught up! No pending actions.</p>
                          </div>
                      )}
                  </div>
              </div>
              <div className="p-3 border-t border-slate-100 text-center">
                  <button className="text-sm text-slate-500 hover:text-indigo-600 font-medium">Clear Completed</button>
              </div>
          </div>

          {/* Channel Health Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Activity className="text-emerald-500" size={18} /> Channel Health
                  </h3>
                  <button className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"><RefreshCw size={10}/> Refresh</button>
              </div>
              <div className="p-4 flex-1">
                  <div className="space-y-4">
                      {channels.map(channel => (
                          <div key={channel.id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200 group-hover:border-indigo-200 transition-colors">
                                      {channel.logo}
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-slate-800">{channel.name}</p>
                                      <p className="text-[10px] text-slate-400">Sync: {channel.lastSync}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  {channel.status === 'Connected' ? (
                                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Live
                                      </span>
                                  ) : channel.status === 'Error' ? (
                                      <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">
                                          <XCircle size={12} /> Error
                                      </span>
                                  ) : (
                                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                                          <Clock size={12} /> Pending
                                      </span>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-xs text-center text-slate-500">
                      System Status: <span className="text-emerald-600 font-bold">Operational</span>
                  </p>
              </div>
          </div>
      </section>

      {/* Section 3: Detailed Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue & Occupancy Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-lg font-bold text-slate-800">Revenue & Occupancy</h3>
                      <p className="text-sm text-slate-500">Last 30 Days</p>
                  </div>
                  <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Last 30 Days</option>
                  </select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{fontSize: 12}} 
                      stroke="#94a3b8" 
                      tickFormatter={(str) => {
                          const d = new Date(str);
                          return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                      }}
                      minTickGap={30}
                    />
                    <YAxis yAxisId="left" tick={{fontSize: 12}} stroke="#94a3b8" />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} stroke="#94a3b8" domain={[0, 100]} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'RevPAR (₹)' ? `₹${value}` : `${value}%`, 
                        name
                      ]}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revpar" 
                      stroke="#4f46e5" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                      name="RevPAR (₹)"
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="occupancy" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fill="transparent" 
                      name="Occupancy (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Competitor Market Position Widget */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Crosshair size={20} className="text-rose-500" /> Market Position
                      </h3>
                      <p className="text-sm text-slate-500">Your Rate vs Market Average (Next 7 Days)</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                      <div className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-600 rounded-full"></span> My Rate</div>
                      <div className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full"></span> Market Avg</div>
                  </div>
              </div>
              <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={compChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                          <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                          <Tooltip 
                              formatter={(value: number) => `₹${value.toLocaleString()}`}
                              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="myRate" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                          <Line type="monotone" dataKey="marketAvg" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <span>Tracking {competitors.length} competitors</span>
                  <button className="text-indigo-600 font-bold hover:underline">Manage CompSet</button>
              </div>
          </div>

      </section>
    </div>
  );
};

export default Dashboard;
