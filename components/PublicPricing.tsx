import React from 'react';
import { PageState } from '../types';
import { Check } from 'lucide-react';

interface PublicPricingProps {
  setPage: (page: PageState) => void;
}

const PublicPricing: React.FC<PublicPricingProps> = ({ setPage }) => {
  const plans = [
    {
      name: "Starter",
      price: "₹3,999",
      period: "/month",
      desc: "Perfect for small B&Bs and homestays.",
      features: [
        "Up to 10 Rooms",
        "Daily Price Updates",
        "Basic Reporting",
        "Email Support"
      ],
      cta: "Start Free Trial",
      highlight: false
    },
    {
      name: "Professional",
      price: "₹7,999",
      period: "/month",
      desc: "Ideal for boutique hotels seeking growth.",
      features: [
        "Up to 50 Rooms",
        "Real-time Price Updates",
        "Competitor Rate Shopping",
        "Event Intelligence",
        "Priority Support",
        "Channel Manager Integration"
      ],
      cta: "Get Started",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For hotel chains and large properties.",
      features: [
        "Unlimited Rooms",
        "Multi-property Dashboard",
        "API Access",
        "Dedicated Account Manager",
        "Custom Onboarding",
        "White-label Reports"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-500">
            Choose the plan that fits your property size. No hidden setup fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white rounded-2xl p-8 border ${
                plan.highlight 
                  ? 'border-indigo-600 shadow-xl scale-105 z-10' 
                  : 'border-slate-200 shadow-sm hover:shadow-md'
              } transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-slate-500 mt-2 text-sm min-h-[40px]">{plan.desc}</p>
              
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-slate-400 font-medium">{plan.period}</span>
              </div>

              <button 
                onClick={() => setPage('LOGIN')}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  plan.highlight 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {plan.cta}
              </button>

              <div className="mt-8 space-y-4">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="text-emerald-500 mr-3 flex-shrink-0" size={20} />
                    <span className="text-slate-600 text-sm">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <p className="text-slate-500">Need help choosing? <button className="text-indigo-600 font-bold underline">Talk to an expert</button></p>
        </div>
      </div>
    </div>
  );
};

export default PublicPricing;
