
import React, { useState } from 'react';
import { Channel } from '../types';
import { Share2, Link, RefreshCw, Settings, Check, AlertTriangle, ToggleRight, Server, Shield, FileText, IndianRupee, Layers, List } from 'lucide-react';

interface ChannelManagerProps {
  channels: Channel[];
}

const ChannelManager: React.FC<ChannelManagerProps> = ({ channels }) => {
  const [activeTab, setActiveTab] = useState<'CHANNELS' | 'SETTINGS' | 'MAPPING'>('CHANNELS');
  const [expertMode, setExpertMode] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || '1');

  // Mock Rate Plans for Mapping
  const ratePlans = [
      { id: 'RP1', name: 'Standard Plan (EP)', code: 'BAR_EP' },
      { id: 'RP2', name: 'Breakfast Included (CP)', code: 'BAR_CP' },
      { id: 'RP3', name: 'Non-Refundable', code: 'NR_EP' },
  ];

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || channels[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Channel Manager</h1>
           <p className="text-slate-500 mt-1">Distribution Hub & Connectivity Settings</p>
        </div>
        <div className="flex items-center gap-3">
            {activeTab === 'CHANNELS' && (
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-600 uppercase">Expert Mode</span>
                    <button onClick={() => setExpertMode(!expertMode)}>
                        <ToggleRight size={32} className={`${expertMode ? 'text-indigo-600' : 'text-slate-300'} transition-colors`} />
                    </button>
                </div>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">
                <RefreshCw size={16} /> Force Sync
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('CHANNELS')}
            className={`${
              activeTab === 'CHANNELS'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Share2 size={18}/> Channels List
          </button>
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`${
              activeTab === 'SETTINGS'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Settings size={18} /> Channel Settings
          </button>
          <button
            onClick={() => setActiveTab('MAPPING')}
            className={`${
              activeTab === 'MAPPING'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Link size={18} /> Room & Rate Mapping
          </button>
        </nav>
      </div>

      {/* -----------------------------------------------------------------------------------------
          1. CHANNELS PAGE 
         ----------------------------------------------------------------------------------------- */}
      {activeTab === 'CHANNELS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {channels.map(channel => (
                 <div key={channel.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-xl font-bold text-slate-700 border border-slate-100">
                              {channel.logo}
                          </div>
                          <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                              channel.status === 'Connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              channel.status === 'Error' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                              {channel.status}
                          </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{channel.name}</h3>
                      <p className="text-sm text-slate-500 mb-6">ID: {channel.id}9928X</p>
                      
                      <div className="space-y-3">
                           <div className="flex justify-between text-sm items-center">
                               <span className="text-slate-500">Last Inventory Sync</span>
                               <span className="text-slate-900 font-medium">{channel.lastSync}</span>
                           </div>
                           <div className="flex justify-between text-sm items-center">
                               <span className="text-slate-500">Bookings (Today)</span>
                               <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">12</span>
                           </div>
                      </div>

                      {expertMode && (
                          <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500 space-y-1">
                              <p className="flex justify-between"><span>API Latency:</span> <span className="text-emerald-600">120ms</span></p>
                              <p className="flex justify-between"><span>XML Push:</span> <span className="text-emerald-600">Success</span></p>
                              <div className="flex gap-2 mt-2">
                                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 py-1.5 rounded text-center">View Logs</button>
                                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 py-1.5 rounded text-center">Raw XML</button>
                              </div>
                          </div>
                      )}

                      <div className="mt-6 flex gap-2">
                          <button 
                             onClick={() => { setSelectedChannelId(channel.id); setActiveTab('SETTINGS'); }}
                             className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                              Configure
                          </button>
                      </div>
                 </div>
             ))}
             
             {/* Add New Channel Card */}
             <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-100 hover:border-indigo-300 hover:text-indigo-500 transition-all cursor-pointer min-h-[250px] group">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                     <Share2 size={24} />
                 </div>
                 <span className="font-bold">Connect New Channel</span>
                 <p className="text-xs mt-2 text-center px-8">Add Expedia, Airbnb, Trip.com and 100+ others.</p>
             </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------------------------
          2. CHANNEL SETTINGS 
         ----------------------------------------------------------------------------------------- */}
      {activeTab === 'SETTINGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Selector */}
            <div className="lg:col-span-1 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Select Channel</p>
                {channels.map(c => (
                    <button
                        key={c.id}
                        onClick={() => setSelectedChannelId(c.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${selectedChannelId === c.id ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'}`}
                    >
                        <span className="text-lg">{c.logo}</span>
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Config Form */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Credentials */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield size={18} className="text-indigo-600"/> Credentials & API</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Hotel ID / Property Code</label>
                            <input type="text" defaultValue="H-992812" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">API Key / Password</label>
                            <input type="password" defaultValue="****************" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Sync Frequency</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>Real-time (Instant)</option>
                                <option>Every 15 Minutes</option>
                                <option>Hourly</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-slate-100 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-200 transition-colors">Test Connection</button>
                        </div>
                    </div>
                </div>

                {/* Restrictions */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Server size={18} className="text-indigo-600"/> Restrictions Support</h3>
                    <p className="text-sm text-slate-500 mb-4">Enable which restrictions should be synced to {selectedChannel.name}.</p>
                    <div className="flex flex-wrap gap-4">
                        {['Min Length of Stay (MinLOS)', 'Max Length of Stay (MaxLOS)', 'Closed to Arrival (CTA)', 'Closed to Departure (CTD)'].map(r => (
                            <label key={r} className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                                <span className="text-sm font-medium text-slate-700">{r}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Pricing Markup */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><IndianRupee size={18} className="text-indigo-600"/> Pricing Markup</h3>
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-4">
                        <p className="text-sm text-indigo-800">
                            <strong>Note:</strong> Adjust the base rate sent to this channel. Useful to cover commission costs.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="space-y-1 flex-1">
                            <label className="text-sm font-medium text-slate-700">Markup Type</label>
                            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                <option>Percentage (%)</option>
                                <option>Fixed Amount (₹)</option>
                            </select>
                        </div>
                         <div className="space-y-1 flex-1">
                            <label className="text-sm font-medium text-slate-700">Value</label>
                            <input type="number" defaultValue={selectedChannel.commission} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+ 0" />
                        </div>
                        <div className="flex-1 pt-6 text-sm font-medium text-slate-600">
                            Base Rate ₹4000 ➝ Sent ₹{4000 * (1 + (selectedChannel.commission/100))}
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all">
                        Save Settings
                    </button>
                </div>

            </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------------------------
          3. ROOM & RATE MAPPING 
         ----------------------------------------------------------------------------------------- */}
      {activeTab === 'MAPPING' && (
         <div className="space-y-8">
             
             {/* Room Mapping Section */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Layers size={18}/> Room Type Mapping</h3>
                        <p className="text-sm text-slate-500 mt-1">Map JyotiPrem room types to {selectedChannel.name} room IDs.</p>
                    </div>
                    <select 
                        value={selectedChannelId} 
                        onChange={(e) => setSelectedChannelId(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-700 py-2 px-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {channels.map(c => <option key={c.id} value={c.id}>For {c.name}</option>)}
                    </select>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900 w-1/3">JyotiPrem Room</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 w-1/3">OTA Room ID / Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-6 py-4 font-medium text-slate-900">Deluxe Double Room</td>
                            <td className="px-6 py-4">
                                <select className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option>Double Room with Balcony (ID: 4421)</option>
                                    <option>Standard Room (ID: 4425)</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-right"><span className="text-emerald-600 font-bold text-xs flex items-center justify-end gap-1"><Check size={14}/> Mapped</span></td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-medium text-slate-900">Standard Single</td>
                            <td className="px-6 py-4">
                                <select className="w-full border-slate-300 rounded-md text-sm p-2 bg-slate-50 border focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="">-- Select OTA Room --</option>
                                    <option>Single Economy (ID: 4499)</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-right"><span className="text-amber-500 font-bold text-xs flex items-center justify-end gap-1"><AlertTriangle size={14}/> Pending</span></td>
                        </tr>
                    </tbody>
                </table>
             </div>

             {/* Rate Plan Mapping Section */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><List size={18}/> Rate Plan Mapping</h3>
                    <p className="text-sm text-slate-500 mt-1">Ensure the correct prices are sent for each meal plan.</p>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900 w-1/3">JyotiPrem Rate Plan</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 w-1/3">OTA Rate Plan ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 text-right">Mapping</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {ratePlans.map((rp, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{rp.name}</p>
                                    <p className="text-xs text-slate-400 font-mono">{rp.code}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <input type="text" placeholder="Enter ID (e.g. 99281)" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </td>
                                <td className="px-6 py-4 text-right">
                                     <button className="text-indigo-600 font-medium text-xs hover:underline">Test Mapping</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

             {/* GST / Tax Handling */}
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                 <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText size={18} className="text-indigo-600"/> Tax Handling (India GST)</h3>
                 <div className="flex items-start gap-4">
                     <div className="flex-1">
                         <label className="flex items-center gap-2 mb-2">
                             <input type="radio" name="tax" defaultChecked className="text-indigo-600 focus:ring-indigo-500" />
                             <span className="text-sm font-medium text-slate-800">Auto-Calculate GST (Recommended)</span>
                         </label>
                         <p className="text-xs text-slate-500 ml-6">
                             System will automatically append GST based on declared price slabs (e.g., 12% for ₹1001-₹7500).
                         </p>
                     </div>
                     <div className="flex-1">
                         <label className="flex items-center gap-2 mb-2">
                             <input type="radio" name="tax" className="text-indigo-600 focus:ring-indigo-500" />
                             <span className="text-sm font-medium text-slate-800">Inclusive Pricing</span>
                         </label>
                         <p className="text-xs text-slate-500 ml-6">
                             Prices sent to channel already include tax. No extra tax will be added by the OTA.
                         </p>
                     </div>
                 </div>
             </div>

             <div className="flex justify-end pt-4">
                 <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all">
                    Save All Mappings
                 </button>
             </div>
         </div>
      )}
    </div>
  );
};

export default ChannelManager;
