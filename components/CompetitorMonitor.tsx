
import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { DailyData, Competitor } from '../types';
import { Plus, Trash2, Save, TrendingUp, AlertCircle, ArrowUp, ArrowDown, Minus, Trophy, Target, BarChart3, RefreshCw, ChevronsDown, ChevronsUp, Crown } from 'lucide-react';

interface CompetitorMonitorProps {
  data: DailyData[];
  competitors: Competitor[];
  onAddCompetitor: (name: string) => void;
  onRemoveCompetitor: (id: string) => void;
  onUpdateRate: (date: string, competitorId: string, newRate: number) => void;
}

const CompetitorMonitor: React.FC<CompetitorMonitorProps> = ({ 
  data, 
  competitors, 
  onAddCompetitor, 
  onRemoveCompetitor,
  onUpdateRate 
}) => {
  const [newCompName, setNewCompName] = useState('');
  const [editingCell, setEditingCell] = useState<{date: string, compId: string} | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleAdd = () => {
    if (newCompName.trim()) {
      onAddCompetitor(newCompName);
      setNewCompName('');
    }
  };

  const handleCellClick = (date: string, compId: string, currentRate: number) => {
    setEditingCell({ date, compId });
    setTempValue(currentRate.toString());
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const val = parseInt(tempValue);
      if (!isNaN(val)) {
        onUpdateRate(editingCell.date, editingCell.compId, val);
      }
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    }
  };

  const handleSimulateScan = () => {
      setScanning(true);
      setTimeout(() => setScanning(false), 2000);
  };

  // Calculate Market Position Metrics
  const marketStats = useMemo(() => {
    if (data.length === 0 || competitors.length === 0) return null;

    let totalMyRate = 0;
    let totalMarketRate = 0;
    let rankSum = 0;

    data.slice(0, 30).forEach(day => {
        totalMyRate += day.adr;
        totalMarketRate += day.competitorRate;

        // Calculate Rank for this day
        const rates = [day.adr, ...Object.values(day.competitorRates || {})];
        rates.sort((a, b) => b - a); // Descending
        const myRank = rates.indexOf(day.adr) + 1;
        rankSum += myRank;
    });

    const avgVariance = ((totalMyRate - totalMarketRate) / totalMarketRate) * 100;
    const avgRank = Math.round(rankSum / 30);
    const setSize = competitors.length + 1;

    return {
        avgVariance: Math.round(avgVariance),
        avgRank,
        setSize,
        isPremium: avgVariance > 0
    };
  }, [data, competitors]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Competitor Rate Shopper</h1>
          <p className="text-slate-500 mt-1">Track and compare your rates against your compset.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button 
                onClick={handleSimulateScan}
                disabled={scanning}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
                <RefreshCw size={18} className={scanning ? 'animate-spin text-indigo-600' : ''} /> 
                {scanning ? 'Scanning...' : 'Scan Rates'}
            </button>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    placeholder="New Competitor Name"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[150px]"
                />
                <button 
                    onClick={handleAdd}
                    disabled={!newCompName.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <Plus size={18} /> Add
                </button>
            </div>
        </div>
      </div>

      {/* Market Stats Cards */}
      {marketStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Market Positioning</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        {marketStats.isPremium ? 'Premium' : 'Value'} Strategy
                    </h3>
                    <p className={`text-xs font-bold mt-1 ${marketStats.isPremium ? 'text-indigo-600' : 'text-emerald-600'}`}>
                        {marketStats.avgVariance > 0 ? '+' : ''}{marketStats.avgVariance}% vs Market Avg
                    </p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Target size={24} />
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Price Rank</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        #{marketStats.avgRank} <span className="text-sm font-medium text-slate-400">of {marketStats.setSize}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Avg rank over 30 days
                    </p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Trophy size={24} />
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Tracking</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        {competitors.length} <span className="text-sm font-medium text-slate-400">Properties</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Real-time rate monitoring
                    </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <BarChart3 size={24} />
                </div>
            </div>
        </div>
      )}

      {/* Comparison Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600"/> Rate Comparison Trend
            </h3>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-indigo-600"></span> My Rate
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 border-t-2 border-dashed border-slate-400"></span> Market Avg
                </div>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" tickFormatter={(str) => str.slice(5)} />
                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value: number) => `₹${value}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                {/* My Rate */}
                <Line 
                    type="monotone" 
                    dataKey="adr" 
                    name="My Rate" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{r: 6}}
                />
                {/* Market Average Line */}
                <Line 
                    type="monotone" 
                    dataKey="competitorRate" 
                    name="Market Avg" 
                    stroke="#94a3b8" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false}
                />
                {/* Competitors */}
                {competitors.map((comp) => (
                    <Line 
                        key={comp.id}
                        type="monotone" 
                        dataKey={`competitorRates.${comp.id}`} 
                        name={comp.name} 
                        stroke={comp.color} 
                        strokeWidth={2} 
                        dot={false}
                        hide={competitors.length > 5} // Hide lines if too many, user can toggle via legend
                    />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* Competitor List & Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitors.map(comp => (
              <div key={comp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: comp.color }}></div>
                      <span className="font-semibold text-slate-700">{comp.name}</span>
                  </div>
                  <button 
                    onClick={() => onRemoveCompetitor(comp.id)}
                    className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-2 bg-slate-50 rounded-lg"
                    title="Remove Competitor"
                  >
                      <Trash2 size={16} />
                  </button>
              </div>
          ))}
          {competitors.length === 0 && (
              <div className="col-span-3 bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
                  <AlertCircle className="mx-auto mb-2 opacity-50" size={24} />
                  No competitors added. Add one above to start tracking.
              </div>
          )}
      </div>

      {/* Data Entry Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-800">Rate Shopper Input</h3>
              <p className="text-xs text-slate-500 mt-1">Compare daily rates. Click cells to edit manually.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Lowest in Market</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Highest in Market</div>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 sticky left-0 bg-slate-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">Date</th>
                <th className="px-6 py-4 font-semibold text-indigo-700 bg-indigo-50/50">My Rate (₹)</th>
                <th className="px-6 py-4 font-semibold text-slate-700 bg-slate-100">Market Avg (₹)</th>
                <th className="px-6 py-4 font-semibold text-slate-700 bg-slate-100">Variance</th>
                {competitors.map(comp => (
                    <th key={comp.id} className="px-6 py-4 font-semibold text-slate-900" style={{ borderBottom: `3px solid ${comp.color}` }}>
                        {comp.name} (₹)
                    </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice(0, 15).map((day, idx) => {
                  const variance = day.competitorRate > 0 ? ((day.adr - day.competitorRate) / day.competitorRate) * 100 : 0;
                  const isPremium = variance > 0;
                  const varianceVal = Math.abs(Math.round(variance));

                  // Find min and max rates for this day among competitors
                  const rates = competitors.map(c => day.competitorRates?.[c.id] || 0).filter(r => r > 0);
                  const minRate = rates.length > 0 ? Math.min(...rates) : 0;
                  const maxRate = rates.length > 0 ? Math.max(...rates) : 0;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                            {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-600 bg-indigo-50/30">₹{day.adr.toLocaleString('en-IN')}</td>
                        
                        {/* Market Avg */}
                        <td className="px-6 py-4 text-slate-600 bg-slate-50/50 font-medium">
                            ₹{day.competitorRate.toLocaleString('en-IN')}
                        </td>
                        
                        {/* Variance */}
                        <td className="px-6 py-4 bg-slate-50/50">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                isPremium ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                                {isPremium ? <ArrowUp size={12}/> : varianceVal === 0 ? <Minus size={12}/> : <ArrowDown size={12}/>}
                                {varianceVal}%
                            </span>
                        </td>

                        {competitors.map(comp => {
                            const rate = day.competitorRates?.[comp.id] || 0;
                            const isEditing = editingCell?.date === day.date && editingCell?.compId === comp.id;
                            const isLowest = rate === minRate && rate > 0;
                            const isHighest = rate === maxRate && rate > 0;

                            return (
                                <td 
                                    key={comp.id} 
                                    className={`px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors relative ${
                                        isLowest ? 'text-emerald-700 font-bold bg-emerald-50/30' : isHighest ? 'text-rose-700 font-medium bg-rose-50/30' : ''
                                    }`}
                                    onClick={() => handleCellClick(day.date, comp.id, rate)}
                                >
                                    {isEditing ? (
                                        <div className="absolute inset-0 p-2">
                                            <input 
                                                autoFocus
                                                type="number" 
                                                value={tempValue}
                                                onChange={(e) => setTempValue(e.target.value)}
                                                onBlur={handleCellBlur}
                                                onKeyDown={handleKeyDown}
                                                className="w-full h-full px-2 text-sm border border-indigo-500 rounded shadow-sm outline-none bg-white"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <span>₹{rate.toLocaleString('en-IN')}</span>
                                            {isLowest && <ChevronsDown size={14} className="text-emerald-500" />}
                                            {isHighest && <ChevronsUp size={14} className="text-rose-500" />}
                                        </div>
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                  )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompetitorMonitor;
