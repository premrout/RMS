import React, { useState } from 'react';
import { PageState } from '../types';
import { CheckCircle, TrendingUp, BarChart3, Clock, Zap } from 'lucide-react';

interface LandingPageProps {
  setPage: (page: PageState) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            The easiest way to sell your rooms <br className="hidden md:block" />
            <span className="text-indigo-600">at the best price.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-10">
            RevOpRMS uses AI to analyze market demand and competitors in real-time, automatically adjusting your rates to maximize revenue for hotels in India.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setPage('LOGIN')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => setPage('PRICING')}
              className="bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all"
            >
              View Pricing
            </button>
          </div>
          <div className="mt-12 text-sm text-slate-500 flex justify-center items-center gap-6">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Cancel anytime</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Setup in 15 mins</span>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        </div>
      </section>

      {/* Dashboard Preview / Trust */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
         <div className="max-w-6xl mx-auto px-4">
             <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-2 md:p-4">
                 <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                    alt="Dashboard Preview" 
                    className="w-full h-auto rounded-xl opacity-90"
                 />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg opacity-0 animate-fade-in">Interactive Demo</span>
                 </div>
             </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need to grow revenue</h2>
          <p className="text-slate-500 mt-4 text-lg">Designed specifically for independent hotels and boutique properties.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Pricing</h3>
            <p className="text-slate-500 leading-relaxed">
              Automatically adjust your prices 24/7 based on occupancy, demand, and competitor rates to ensure you never leave money on the table.
            </p>
          </div>
          
          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Updates</h3>
            <p className="text-slate-500 leading-relaxed">
              Push rate updates to Booking.com, Expedia, Agoda, and MakeMyTrip instantly. No more manual data entry errors.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Market Intelligence</h3>
            <p className="text-slate-500 leading-relaxed">
              Know when demand is high in your city before your competitors do. Track local events and festivals automatically.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="bg-indigo-900 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl font-bold mb-6">Ready to increase your revenue by 20%?</h2>
              <p className="text-indigo-200 mb-10 text-lg">Join 2,000+ hoteliers who trust RevOpRMS for their pricing strategy.</p>
              <button onClick={() => setPage('LOGIN')} className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                  Get Started for Free
              </button>
          </div>
      </section>
    </div>
  );
};

export default LandingPage;