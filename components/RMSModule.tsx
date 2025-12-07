
import React, { useState } from 'react';
import { DailyData, Competitor } from '../types';
import PricingEngine from './PricingEngine';
import RMSAnalytics from './RMSAnalytics';
import CompetitorMonitor from './CompetitorMonitor';
import MarketIntel from './MarketIntel';
import { Sparkles, BarChart3, Users, Globe } from 'lucide-react';

interface RMSModuleProps {
  data: DailyData[];
  competitors: Competitor[];
  onAddCompetitor: (name: string) => void;
  onRemoveCompetitor: (id: string) => void;
  onUpdateRate: (date: string, competitorId: string, newRate: number) => void;
  onUpdateMyRate: (date: string, newRate: number) => void;
}

const RMSModule: React.FC<RMSModuleProps> = ({ 
    data, 
    competitors, 
    onAddCompetitor, 
    onRemoveCompetitor, 
    onUpdateRate,
    onUpdateMyRate
}) => {
  const [activeTab, setActiveTab] = useState<'RECOMMENDATIONS' | 'ANALYTICS' | 'COMPETITORS' | 'INTEL'>('RECOMMENDATIONS');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Revenue Management System (RMS)</h1>
           <p className="text-slate-500 mt-1">AI-driven insights for pricing, demand forecasting, and competitive analysis.</p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('RECOMMENDATIONS')}
                className={`${activeTab === 'RECOMMENDATIONS' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
                <Sparkles size={18} /> Price Recommendations
            </button>
            <button 
                onClick={() => setActiveTab('ANALYTICS')}
                className={`${activeTab === 'ANALYTICS' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
                <BarChart3 size={18} /> Analytics & Forecasting
            </button>
            <button 
                onClick={() => setActiveTab('COMPETITORS')}
                className={`${activeTab === 'COMPETITORS' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
                <Users size={18} /> Competitor Monitor
            </button>
            <button 
                onClick={() => setActiveTab('INTEL')}
                className={`${activeTab === 'INTEL' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
            >
                <Globe size={18} /> Market Intelligence
            </button>
        </nav>
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === 'RECOMMENDATIONS' && <PricingEngine data={data} onUpdateRate={onUpdateMyRate} />}
        
        {activeTab === 'ANALYTICS' && <RMSAnalytics />}
        
        {activeTab === 'COMPETITORS' && (
            <CompetitorMonitor 
                data={data} 
                competitors={competitors}
                onAddCompetitor={onAddCompetitor}
                onRemoveCompetitor={onRemoveCompetitor}
                onUpdateRate={onUpdateRate}
            />
        )}

        {activeTab === 'INTEL' && <MarketIntel />}
      </div>
    </div>
  );
};

export default RMSModule;
