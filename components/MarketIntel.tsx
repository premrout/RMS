import React, { useState } from 'react';
import { EventData } from '../types';
import { findLocalEvents } from '../services/gemini';
import { Search, MapPin, Calendar, ExternalLink, Loader2, Info, Globe, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MarketIntel: React.FC = () => {
  const [city, setCity] = useState("Mumbai");
  const [month, setMonth] = useState("December");
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    const results = await findLocalEvents(city, month);
    setEvents(results);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <h1 className="text-3xl font-bold mb-4 relative z-10">Market Intelligence</h1>
        <p className="text-indigo-200 max-w-2xl relative z-10 mb-8">
          Discover local demand drivers like weddings, festivals, and conferences in your area using real-time Google Search data.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative z-10 max-w-3xl">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg"
              placeholder="City (e.g., Mumbai)"
            />
          </div>
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
              type="text" 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg"
              placeholder="Month (e.g., December)"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-white text-indigo-900 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            <span>Analyze Market</span>
          </button>
        </form>
      </div>

      {searched && (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Globe className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-slate-900">Live Market Report</h2>
            </div>
            
            {loading ? (
                <div className="bg-white p-12 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 animate-pulse">
                    <Loader2 className="animate-spin mb-4 text-indigo-500" size={32} />
                    <p className="font-medium text-slate-600">Scanning events and travel trends for {city}...</p>
                    <p className="text-xs mt-2">Powered by Gemini Search Grounding</p>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                    <Info className="mx-auto mb-2 text-slate-300" size={32} />
                    No market data found. Please check your API key or try a different city.
                </div>
            ) : (
                <div className="grid gap-6">
                    {events.map((evt, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{evt.title}</h3>
                                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mt-2 inline-block">
                                        Analysis for {evt.date}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed">
                                <ReactMarkdown>{evt.description}</ReactMarkdown>
                            </div>
                            
                            {/* Sources Section */}
                            {evt.sources && evt.sources.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-xl">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <LinkIcon size={12}/> Sources & Citations
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {evt.sources.map((source, i) => (
                                            <a 
                                                key={i} 
                                                href={source.uri} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center gap-2 p-2 rounded hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-xs text-slate-600 group"
                                            >
                                                <div className="bg-white p-1 rounded border border-slate-200 text-indigo-600 group-hover:text-indigo-700">
                                                    <ExternalLink size={10} />
                                                </div>
                                                <span className="truncate group-hover:text-indigo-700 group-hover:underline">
                                                    {source.title || source.uri}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default MarketIntel;
