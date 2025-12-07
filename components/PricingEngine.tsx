
import React, { useState, useEffect } from 'react';
import { DailyData, PriceSuggestion } from '../types';
import { analyzePricing } from '../services/gemini';
import { Sparkles, Check, X, Loader2, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';

interface PricingEngineProps {
  data: DailyData[];
  onUpdateRate: (date: string, newRate: number) => void;
}

const PricingEngine: React.FC<PricingEngineProps> = ({ data, onUpdateRate }) => {
  const [suggestions, setSuggestions] = useState<PriceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("Mumbai");
  const [trendData, setTrendData] = useState<any[]>([]);
  const [appliedRates, setAppliedRates] = useState<Record<string, boolean>>({});

  // Generate historical data for the 60-day trend graph (30 past + 30 future)
  useEffect(() => {
    const history: any[] = [];
    const today = new Date();
    
    // Generate 30 days of history
    for (let i = 30; i > 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        history.push({
            date: d.toISOString().split('T')[0],
            price: 4500 + Math.random() * 1000,
            type: 'History'
        });
    }

    // Combine with future data
    const future = data.map(d => ({
        date: d.date,
        price: d.adr,
        type: 'Forecast'
    }));

    setTrendData([...history, ...future]);
  }, [data]);

  const handleGenerateAI = async () => {
    setLoading(true);
    const results = await analyzePricing(data, city);
    setSuggestions(results);
    setAppliedRates({});
    setLoading(false);
  };

  const handleApplyRate = (suggestion: PriceSuggestion) => {
      onUpdateRate(suggestion.date, suggestion.recommendedPrice);
      setAppliedRates(prev => ({ ...prev, [suggestion.date]: true }));
  };

  const handleApplyAll = () => {
      suggestions.forEach(s => {
          onUpdateRate(s.date, s.recommendedPrice);
      });
      const allApplied: Record<string, boolean> = {};
      suggestions.forEach(s => allApplied[s.date] = true);
      setAppliedRates(allApplied);
  };

  const getDemandMultiplier = (demandLevel: string) => {
      switch(demandLevel) {
          case 'Extreme': return 1.5;
          case 'High': return 1.25;
          case 'Medium': return 1.0;
          case 'Low': return 0.85;
          default: return 1.0;
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Price Recommendations</h1>
          <p className="text-slate-500 mt-1">AI-driven dynamic pricing with market demand analysis.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="City Name"
            />
            {suggestions.length > 0 && (
                <button 
                onClick={handleApplyAll}
                className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                <Check size={18} />
                <span>Apply All</span>
                </button>
            )}
            <button 
            onClick={handleGenerateAI}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 shadow-sm"
            >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            <span>Optimize Rates</span>
            </button>
        </div>
      </div>

      {/* 60-Day Rate Trend Graph */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-600" /> 60-Day Rate Trend
              </h3>
              <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-300 rounded-full"></span> History</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-600 rounded-full"></span> Forecast</div>
              </div>
          </div>
          <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        tick={{fontSize: 11}} 
                        stroke="#94a3b8" 
                        tickFormatter={(str) => {
                            const d = new Date(str);
                            return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                        }}
                        interval={6}
                      />
                      <YAxis tick={{fontSize: 11}} stroke="#94a3b8" />
                      <Tooltip 
                          formatter={(value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`}
                          labelFormatter={(label) => new Date(label as string).toLocaleDateString()}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#10b981', fontSize: 12 }} />
                      <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#4f46e5" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorPrice)" 
                      />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Occupancy</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Multiplier</th>
                <th className="px-6 py-4 font-semibold text-slate-900">Current Rate</th>
                <th className="px-6 py-4 font-semibold text-indigo-700 bg-indigo-50/50">Rec. Price</th>
                <th className="px-6 py-4 font-semibold text-slate-900">AI Reasoning</th>
                <th className="px-6 py-4 font-semibold text-slate-900 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice(0, 10).map((day, idx) => {
                const suggestion = suggestions.find(s => s.date === day.date);
                const multiplier = suggestion ? getDemandMultiplier(suggestion.demandLevel) : 1.0;
                const isApplied = appliedRates[day.date];
                
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{new Date(day.date).toLocaleDateString('en-US', {day: 'numeric', month: 'short', weekday: 'short'})}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${day.occupancy > 80 ? 'bg-emerald-500' : day.occupancy < 40 ? 'bg-amber-400' : 'bg-indigo-500'}`} 
                            style={{ width: `${day.occupancy}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{day.occupancy}%</span>
                      </div>
                    </td>
                    
                    {/* Multiplier Column */}
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                            multiplier > 1.0 ? 'bg-emerald-100 text-emerald-800' : 
                            multiplier < 1.0 ? 'bg-amber-100 text-amber-800' : 
                            'bg-slate-100 text-slate-600'
                        }`}>
                           {multiplier}x
                        </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 font-mono">₹{day.adr.toLocaleString('en-IN')}</td>
                    
                    {/* AI Suggestion Column */}
                    <td className="px-6 py-4 bg-indigo-50/30">
                      {loading ? (
                        <div className="h-4 w-12 bg-slate-200 animate-pulse rounded"></div>
                      ) : suggestion ? (
                        <div className="flex flex-col">
                            <span className={`font-bold text-lg ${suggestion.recommendedPrice > day.adr ? 'text-emerald-600' : 'text-rose-600'}`}>
                                ₹{suggestion.recommendedPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-500">
                                {suggestion.recommendedPrice > day.adr ? '▲ Increase' : '▼ Decrease'}
                            </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">--</span>
                      )}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                         {loading ? (
                             <div className="space-y-1">
                                 <div className="h-2 w-full bg-slate-200 animate-pulse rounded"></div>
                                 <div className="h-2 w-2/3 bg-slate-200 animate-pulse rounded"></div>
                             </div>
                         ) : suggestion ? (
                             <div className="text-xs leading-relaxed text-slate-700">
                                <div className="flex items-center gap-1 mb-1">
                                    <Sparkles size={10} className="text-indigo-500" />
                                    <span className="font-semibold text-indigo-700">JyotiPrem Analysis</span>
                                </div>
                                {suggestion.reason}
                             </div>
                         ) : (
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Info size={12}/> Click optimize to see analysis</span>
                         )}
                    </td>

                    <td className="px-6 py-4 text-right">
                        {isApplied ? (
                            <span className="inline-flex items-center text-emerald-600 font-bold text-xs gap-1">
                                <Check size={14} /> Applied
                            </span>
                        ) : suggestion ? (
                            <button 
                                onClick={() => handleApplyRate(suggestion)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                            >
                                Apply
                            </button>
                        ) : (
                             <button disabled className="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed">
                                Apply
                            </button>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingEngine;
