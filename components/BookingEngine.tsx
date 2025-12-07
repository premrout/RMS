
import React, { useState } from 'react';
import { Tag, Globe, Palette, CreditCard, LayoutTemplate, Plus, Trash2, BarChart3, Users, MousePointer, ShoppingCart, CheckCircle, Smartphone, Monitor } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BookingEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'WIDGET' | 'PROMOS' | 'SETTINGS'>('ANALYTICS');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [font, setFont] = useState('Inter');
  
  // Mock Data
  const [promos, setPromos] = useState([
    { code: 'EARLYBIRD', discount: '15%', type: 'Percentage', validUntil: '2024-12-31', status: 'Active' },
    { code: 'SUMMER24', discount: '500', type: 'Fixed Amount', validUntil: '2024-06-30', status: 'Expired' },
    { code: 'LONGSTAY', discount: '20%', type: 'Percentage', validUntil: '2025-01-01', status: 'Active' },
  ]);

  const analyticsData = [
    { date: 'Mon', visits: 1200, bookings: 45 },
    { date: 'Tue', visits: 1350, bookings: 52 },
    { date: 'Wed', visits: 1100, bookings: 38 },
    { date: 'Thu', visits: 1400, bookings: 60 },
    { date: 'Fri', visits: 1600, bookings: 75 },
    { date: 'Sat', visits: 1800, bookings: 90 },
    { date: 'Sun', visits: 1750, bookings: 85 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Direct Booking Engine</h1>
           <p className="text-slate-500 mt-1">Manage your direct sales channel, customize widget, and track conversions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Globe size={18} /> View Live Site
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
                { id: 'ANALYTICS', label: 'Conversion Analytics', icon: BarChart3 },
                { id: 'WIDGET', label: 'Widget & Theme', icon: Palette },
                { id: 'PROMOS', label: 'Promotions', icon: Tag },
                { id: 'SETTINGS', label: 'Configuration', icon: LayoutTemplate },
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                    <tab.icon size={18} /> {tab.label}
                </button>
            ))}
        </nav>
      </div>

      {/* ----------------------------------------------------------------------
          1. ANALYTICS TAB
         ---------------------------------------------------------------------- */}
      {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Total Visits</p>
                          <Users size={18} className="text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">10,250</h3>
                      <p className="text-xs text-emerald-600 font-medium mt-1">▲ 12% vs last week</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Searches</p>
                          <MousePointer size={18} className="text-purple-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">4,120</h3>
                      <p className="text-xs text-emerald-600 font-medium mt-1">▲ 5% vs last week</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Direct Bookings</p>
                          <ShoppingCart size={18} className="text-indigo-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">445</h3>
                      <p className="text-xs text-emerald-600 font-medium mt-1">▲ 8% vs last week</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Conversion Rate</p>
                          <CheckCircle size={18} className="text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">4.3%</h3>
                      <p className="text-xs text-emerald-600 font-medium mt-1">▲ 0.5% vs last week</p>
                  </div>
              </div>

              {/* Conversion Funnel Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Traffic vs Bookings Trend</h3>
                  <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 12}} />
                              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <Area type="monotone" dataKey="visits" stroke="#6366f1" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2} />
                              <Area type="monotone" dataKey="bookings" stroke="#10b981" fillOpacity={1} fill="transparent" strokeWidth={2} />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      )}

      {/* ----------------------------------------------------------------------
          2. WIDGET & THEME TAB
         ---------------------------------------------------------------------- */}
      {activeTab === 'WIDGET' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Palette size={18}/> Customization</h3>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Brand Color</label>
                              <div className="flex flex-wrap gap-2">
                                  {['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#1e293b'].map(color => (
                                      <button 
                                        key={color} 
                                        onClick={() => setPrimaryColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${primaryColor === color ? 'border-slate-600 ring-2 ring-slate-200' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                      />
                                  ))}
                                  <input 
                                    type="color" 
                                    value={primaryColor} 
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-8 h-8 p-0 rounded-full border-0 overflow-hidden cursor-pointer" 
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Font Family</label>
                              <select 
                                value={font} 
                                onChange={(e) => setFont(e.target.value)} 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                  <option value="Inter">Inter (Clean)</option>
                                  <option value="Merriweather">Merriweather (Serif)</option>
                                  <option value="Roboto">Roboto (Modern)</option>
                              </select>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                       <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Monitor size={18}/> Display Options</h3>
                       <div className="space-y-3">
                           <label className="flex items-center gap-2">
                               <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                               <span className="text-sm text-slate-700">Show Best Price Guarantee</span>
                           </label>
                           <label className="flex items-center gap-2">
                               <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                               <span className="text-sm text-slate-700">Show Scarcity Alerts ("Only 2 left!")</span>
                           </label>
                           <label className="flex items-center gap-2">
                               <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                               <span className="text-sm text-slate-700">Dark Mode</span>
                           </label>
                       </div>
                  </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-2">
                  <div className="bg-slate-100 rounded-xl border border-slate-200 p-8 h-full flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-4 right-4 flex gap-2">
                          <button className="bg-white p-2 rounded-lg shadow-sm hover:text-indigo-600"><Monitor size={16}/></button>
                          <button className="bg-white p-2 rounded-lg shadow-sm text-slate-400 hover:text-indigo-600"><Smartphone size={16}/></button>
                      </div>

                      {/* Fake Widget Mockup */}
                      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ fontFamily: font }}>
                          <div className="p-6 text-white" style={{ backgroundColor: primaryColor }}>
                              <h3 className="text-xl font-bold">Book Your Stay</h3>
                              <p className="text-white/80 text-sm">Best rates guaranteed when you book direct.</p>
                          </div>
                          <div className="p-6 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                      <p className="text-xs text-slate-500 uppercase font-bold">Check In</p>
                                      <p className="font-semibold text-slate-800">Dec 15, 2024</p>
                                  </div>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                      <p className="text-xs text-slate-500 uppercase font-bold">Check Out</p>
                                      <p className="font-semibold text-slate-800">Dec 18, 2024</p>
                                  </div>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                                   <div>
                                       <p className="text-xs text-slate-500 uppercase font-bold">Guests</p>
                                       <p className="font-semibold text-slate-800">2 Adults, 1 Room</p>
                                   </div>
                                   <button className="text-xs font-bold underline" style={{ color: primaryColor }}>Add Room</button>
                              </div>
                              <div className="bg-orange-50 text-orange-700 text-xs px-3 py-2 rounded flex items-center gap-2">
                                  <Tag size={12} /> Special Offer: Get 15% off with code EARLYBIRD
                              </div>
                              <button 
                                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                                style={{ backgroundColor: primaryColor }}
                              >
                                  Search Availability
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* ----------------------------------------------------------------------
          3. PROMOTIONS TAB
         ---------------------------------------------------------------------- */}
      {activeTab === 'PROMOS' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <div>
                      <h3 className="font-bold text-slate-800">Active Promo Codes</h3>
                      <p className="text-xs text-slate-500">Manage coupons and special offers.</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700">
                      <Plus size={16}/> Create New
                  </button>
              </div>
              <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-white border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-4 font-semibold text-slate-900">Code</th>
                          <th className="px-6 py-4 font-semibold text-slate-900">Discount</th>
                          <th className="px-6 py-4 font-semibold text-slate-900">Valid Until</th>
                          <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                          <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {promos.map((promo, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{promo.code}</td>
                              <td className="px-6 py-4">{promo.discount} ({promo.type})</td>
                              <td className="px-6 py-4">{promo.validUntil}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${promo.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                                      {promo.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {/* ----------------------------------------------------------------------
          4. SETTINGS TAB (Configuration)
         ---------------------------------------------------------------------- */}
      {activeTab === 'SETTINGS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Gateway */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CreditCard size={18}/> Payment Gateway</h3>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-[#0c2d48] rounded flex items-center justify-center text-white font-bold text-xs">RZP</div>
                           <div>
                               <p className="font-bold text-slate-800">Razorpay (India)</p>
                               <p className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle size={10}/> Connected</p>
                           </div>
                       </div>
                       <button className="text-sm text-slate-500 underline hover:text-indigo-600">Configure</button>
                   </div>
                   <div className="space-y-3">
                       <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                           <span className="text-sm font-medium text-slate-700">Collect 100% Payment</span>
                           <input type="radio" name="payment" defaultChecked className="text-indigo-600" />
                       </label>
                       <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                           <span className="text-sm font-medium text-slate-700">Partial Payment (Deposit)</span>
                           <input type="radio" name="payment" className="text-indigo-600" />
                       </label>
                   </div>
              </div>

              {/* Checkout Configuration */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><LayoutTemplate size={18}/> Checkout Settings</h3>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="font-medium text-slate-800 text-sm">Multi-room Booking</p>
                              <p className="text-xs text-slate-500">Allow guests to book multiple rooms in one transaction</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                      </div>
                      <div className="border-t border-slate-100"></div>
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="font-medium text-slate-800 text-sm">Guest Details</p>
                              <p className="text-xs text-slate-500">Require full address and GST number</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default BookingEngine;
