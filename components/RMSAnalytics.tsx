
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { IndianRupee, Percent, BedDouble, Calendar, ArrowUpRight } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className={`text-xs mt-1 font-medium ${color}`}>{subtext}</p>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg text-slate-400">
      <Icon size={20} />
    </div>
  </div>
);

const RMSAnalytics: React.FC = () => {
  // Mock Data
  const leadTimeData = [
    { range: '0-3 Days', bookings: 45 },
    { range: '4-7 Days', bookings: 30 },
    { range: '8-14 Days', bookings: 25 },
    { range: '15-30 Days', bookings: 15 },
    { range: '30+ Days', bookings: 10 },
  ];

  const channelData = [
    { name: 'Booking.com', value: 45 },
    { name: 'MakeMyTrip', value: 25 },
    { name: 'Direct Website', value: 15 },
    { name: 'Agoda', value: 10 },
    { name: 'Walk-in', value: 5 },
  ];

  const demandForecast = [
    { date: 'Dec 01', demand: 65 },
    { date: 'Dec 05', demand: 70 },
    { date: 'Dec 10', demand: 85 },
    { date: 'Dec 15', demand: 95 },
    { date: 'Dec 20', demand: 90 },
    { date: 'Dec 25', demand: 100 },
    { date: 'Dec 30', demand: 98 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="ADR (Average Daily Rate)" 
            value="₹4,850" 
            subtext="+12% vs last month" 
            icon={IndianRupee} 
            color="text-emerald-600"
        />
        <StatCard 
            title="RevPAR" 
            value="₹3,920" 
            subtext="+8% vs last month" 
            icon={ArrowUpRight} 
            color="text-emerald-600"
        />
        <StatCard 
            title="Occupancy Rate" 
            value="82%" 
            subtext="-2% vs last month" 
            icon={Percent} 
            color="text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Booking Lead Time Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-600" /> Booking Lead Time
            </h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadTimeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="range" type="category" width={80} tick={{fontSize: 12}} stroke="#64748b" />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="bookings" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Number of bookings by days in advance</p>
        </div>

        {/* Channel Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BedDouble size={18} className="text-indigo-600" /> Channel Mix
            </h3>
            <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={channelData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {channelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Demand Forecast */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ArrowUpRight size={18} className="text-indigo-600" /> Demand Forecast (Next 30 Days)
            </h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demandForecast} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                        <YAxis tick={{fontSize: 12}} stroke="#94a3b8" label={{ value: 'Demand Index', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#94a3b8', fontSize: 12} }} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2">Predicted demand score based on local events and historical data.</p>
        </div>

      </div>
    </div>
  );
};

export default RMSAnalytics;
