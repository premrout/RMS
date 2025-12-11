
import React from 'react';
import { Puzzle, CreditCard, Terminal, CheckCircle, ExternalLink, Settings } from 'lucide-react';

const IntegrationsManager: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Integrations Marketplace</h2>
           <p className="text-sm text-slate-500">Manage third-party connections and extensions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Payment Gateway */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><CreditCard size={24}/></div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle size={10}/> Active
                  </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Razorpay</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1">Payment processing for subscriptions and tenant billing.</p>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                      <Settings size={14}/> Config
                  </button>
              </div>
          </div>

          {/* AI */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Terminal size={24}/></div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle size={10}/> Active
                  </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Google Gemini</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1">AI engine for pricing recommendations and chat assistant.</p>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                      <Settings size={14}/> Config
                  </button>
              </div>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><ExternalLink size={24}/></div>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded">Inactive</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">SendGrid</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1">Transactional email service for system notifications.</p>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700">
                      Connect
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default IntegrationsManager;
