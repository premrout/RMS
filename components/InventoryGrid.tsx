
import React, { useState } from 'react';
import { DailyData } from '../types';
import { 
  ChevronLeft, ChevronRight, Edit2, Lock, Unlock, X, Save, 
  Sparkles, CheckSquare, Square, LayoutList, Layers, ArrowRight
} from 'lucide-react';

interface InventoryGridProps {
  data: DailyData[];
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ data }) => {
  const [selectedRoom, setSelectedRoom] = useState("Deluxe Room");
  const [viewDays, setViewDays] = useState<14 | 30>(14);
  const [viewMode, setViewMode] = useState<'SINGLE' | 'MULTI'>('MULTI');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock Room Types for the Multi-View
  const roomTypes = [
    { id: 'RT1', name: "Standard Single", baseRate: 3500 },
    { id: 'RT2', name: "Deluxe Room", baseRate: 4500 },
    { id: 'RT3', name: "Suite", baseRate: 8500 },
    { id: 'RT4', name: "Family Room", baseRate: 6500 }
  ];

  // Bulk Update State
  const [bulkConfig, setBulkConfig] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    days: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true },
    updates: {
      rate: { enabled: false, value: '' },
      inventory: { enabled: false, value: '' },
      minStay: { enabled: false, value: '' },
      stopSell: { enabled: false, value: false }
    }
  });

  const toggleDay = (day: string) => {
    setBulkConfig(prev => ({
      ...prev,
      days: { ...prev.days, [day]: !prev.days[day as keyof typeof prev.days] }
    }));
  };

  const toggleUpdateType = (type: 'rate' | 'inventory' | 'minStay' | 'stopSell') => {
    setBulkConfig(prev => ({
      ...prev,
      updates: { 
        ...prev.updates, 
        [type]: { ...prev.updates[type], enabled: !prev.updates[type].enabled } 
      }
    }));
  };

  const getInventoryColor = (occupancy: number) => {
    const availability = 10 - Math.floor(occupancy / 10);
    if (availability <= 0) return 'bg-rose-100 text-rose-800 font-bold';
    if (availability < 4) return 'bg-amber-100 text-amber-800 font-medium';
    return 'bg-white text-slate-700';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Inventory & Rates</h1>
           <p className="text-slate-500 mt-1">Manage availability, pricing, and restrictions across all channels.</p>
        </div>
        <div className="flex gap-2">
             <div className="bg-white border border-slate-300 rounded-lg p-1 shadow-sm flex">
                <button 
                    onClick={() => setViewMode('MULTI')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'MULTI' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <Layers size={16} /> Overview
                </button>
                <button 
                    onClick={() => setViewMode('SINGLE')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'SINGLE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <LayoutList size={16} /> Detailed
                </button>
             </div>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
              {viewMode === 'SINGLE' && (
                <div className="relative">
                    <select 
                        value={selectedRoom} 
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="appearance-none bg-slate-50 border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
                    >
                        {roomTypes.map(rt => <option key={rt.id} value={rt.name}>{rt.name}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
              )}
              {viewMode === 'MULTI' && (
                  <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                      Showing All Room Types
                  </span>
              )}

              <div className="h-8 w-px bg-slate-200 mx-2"></div>

              <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={20}/></button>
                 <span className="text-sm font-bold text-slate-800 min-w-[120px] text-center flex items-center justify-center gap-2">
                    <span className="text-slate-400 font-normal">Dec 2024</span>
                 </span>
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight size={20}/></button>
              </div>

              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                 <button onClick={() => setViewDays(14)} className={`px-3 py-1 rounded text-xs font-bold transition-all ${viewDays === 14 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>14 Days</button>
                 <button onClick={() => setViewDays(30)} className={`px-3 py-1 rounded text-xs font-bold transition-all ${viewDays === 30 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>30 Days</button>
              </div>
          </div>

          <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowBulkModal(true)}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                  <Edit2 size={16} className="text-indigo-600" /> Bulk Update
              </button>
              <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-2">
                  <Save size={18} /> Push to Channels
              </button>
          </div>
      </div>

      {/* STAAH-Style Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 relative">
          <div className="overflow-auto custom-scrollbar flex-1">
              <table className="w-full text-center border-collapse">
                  <thead className="sticky top-0 z-20 shadow-sm">
                      <tr>
                          <th className="p-4 text-left min-w-[200px] bg-slate-50 border-b border-r border-slate-200 sticky left-0 z-20">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  {viewMode === 'MULTI' ? 'Room Types' : 'Parameters'}
                              </span>
                          </th>
                          {data.slice(0, viewDays).map((d, i) => (
                              <th key={i} className={`p-2 min-w-[90px] border-b border-r border-slate-200 ${i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                                  <div className={`text-xs font-bold ${[0,6].includes(new Date(d.date).getDay()) ? 'text-rose-600' : 'text-slate-700'}`}>
                                      {new Date(d.date).toLocaleDateString('en-US', {weekday: 'short'})}
                                  </div>
                                  <div className="text-sm font-bold text-slate-800">{new Date(d.date).getDate()}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{new Date(d.date).toLocaleDateString('en-US', {month: 'short'})}</div>
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      
                      {/* --- MULTI ROOM VIEW --- */}
                      {viewMode === 'MULTI' && roomTypes.map((room) => (
                          <React.Fragment key={room.id}>
                              {/* Room Header Row */}
                              <tr className="bg-slate-50 border-b border-slate-200">
                                  <td className="p-3 text-left sticky left-0 bg-slate-100 border-r border-slate-200 z-10">
                                      <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                                          {room.name}
                                          <span className="text-[10px] bg-white border px-1 rounded text-slate-500">ID: {room.id}</span>
                                      </div>
                                  </td>
                                  {data.slice(0, viewDays).map((_, i) => (
                                      <td key={i} className="bg-slate-50/50 border-r border-slate-200"></td>
                                  ))}
                              </tr>
                              
                              {/* Rate Row */}
                              <tr className="group">
                                  <td className="px-4 py-2 text-left sticky left-0 bg-white border-r border-slate-200 z-10">
                                      <div className="text-xs font-semibold text-slate-600">Rate (₹)</div>
                                  </td>
                                  {data.slice(0, viewDays).map((d, i) => {
                                      // Simulate different rates per room
                                      const variance = room.baseRate * 0.1; 
                                      const rate = Math.round(d.adr + (room.baseRate - 4500) + (Math.random() * variance));
                                      return (
                                        <td key={i} className={`p-1 border-r border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}`}>
                                            <input 
                                                className="w-full text-center text-sm font-medium text-slate-700 bg-transparent rounded border border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all py-1"
                                                defaultValue={rate}
                                            />
                                        </td>
                                      )
                                  })}
                              </tr>

                              {/* Inventory Row */}
                              <tr className="group border-b border-slate-200">
                                  <td className="px-4 py-2 text-left sticky left-0 bg-white border-r border-slate-200 z-10">
                                      <div className="text-xs font-semibold text-slate-600">Availability</div>
                                  </td>
                                  {data.slice(0, viewDays).map((d, i) => {
                                      const avail = Math.max(0, 10 - Math.floor(d.occupancy / 10) + (Math.floor(Math.random() * 3) - 1));
                                      const isStopSell = avail === 0;
                                      return (
                                        <td key={i} className={`p-1 border-r border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}`}>
                                            <div className={`flex items-center justify-center h-full rounded ${getInventoryColor((10-avail)*10)}`}>
                                                {isStopSell ? (
                                                    <Lock size={14} className="text-rose-500" />
                                                ) : (
                                                    <input 
                                                        className="w-full text-center text-sm font-bold bg-transparent border-none focus:ring-0 p-0"
                                                        defaultValue={avail}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                      )
                                  })}
                              </tr>
                          </React.Fragment>
                      ))}

                      {/* --- SINGLE ROOM DETAILED VIEW --- */}
                      {viewMode === 'SINGLE' && (
                        <>
                           {/* Availability */}
                           <tr className="group">
                                <td className="p-4 text-left bg-slate-50 border-b border-r border-slate-200 sticky left-0 z-10">
                                    <div className="text-sm font-bold text-slate-700">Availability</div>
                                    <div className="text-xs text-slate-400 font-medium">Rooms to sell</div>
                                </td>
                                {data.slice(0, viewDays).map((d, i) => {
                                    const avail = 10 - Math.floor(d.occupancy / 10);
                                    return (
                                        <td key={i} className={`p-2 border-b border-r border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}`}>
                                            <input 
                                                type="number" 
                                                className={`w-full text-center text-sm rounded py-1.5 border-2 transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none ${getInventoryColor(d.occupancy)}`}
                                                defaultValue={avail}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>

                            {/* Rate */}
                            <tr className="group">
                                <td className="p-4 text-left bg-slate-50 border-b border-r border-slate-200 sticky left-0 z-10">
                                    <div className="text-sm font-bold text-slate-700">Rate (₹)</div>
                                    <div className="text-xs text-slate-400 font-medium">Standard Plan</div>
                                </td>
                                {data.slice(0, viewDays).map((d, i) => (
                                    <td key={i} className={`p-2 border-b border-r border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'} relative`}>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                className="w-full text-center text-sm font-semibold text-slate-700 rounded py-1.5 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                                defaultValue={d.adr}
                                            />
                                            {i % 7 === 0 && (
                                                <div className="absolute -top-1.5 -right-1 group/tooltip">
                                                    <Sparkles size={10} className="text-indigo-600 bg-white rounded-full shadow-sm" fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Min Stay */}
                            <tr className="group">
                                <td className="p-4 text-left bg-slate-50 border-b border-r border-slate-200 sticky left-0 z-10">
                                    <div className="text-sm font-bold text-slate-700">Min. Stay</div>
                                    <div className="text-xs text-slate-400 font-medium">Nights</div>
                                </td>
                                {data.slice(0, viewDays).map((d, i) => (
                                    <td key={i} className={`p-2 border-b border-r border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}`}>
                                        <input 
                                            type="number" 
                                            className="w-full text-center text-xs text-slate-500 bg-transparent border border-transparent hover:border-slate-200 rounded focus:outline-none focus:border-indigo-300"
                                            defaultValue={1}
                                        />
                                    </td>
                                ))}
                            </tr>

                            {/* Stop Sell */}
                            <tr className="group">
                                <td className="p-4 text-left bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                                    <div className="text-sm font-bold text-slate-700">Stop Sell</div>
                                    <div className="text-xs text-slate-400 font-medium">Restriction</div>
                                </td>
                                {data.slice(0, viewDays).map((d, i) => (
                                    <td key={i} className={`p-2 border-r border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}`}>
                                        <button className="text-slate-300 hover:text-rose-500 transition-colors w-full flex justify-center py-1">
                                            <Unlock size={16} />
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </>
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {/* Bulk Update Modal Overlay */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Edit2 size={20}/> Bulk Update Inventory & Rates</h3>
                    <button onClick={() => setShowBulkModal(false)} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Date Range & Days */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Date Range</label>
                            <div className="flex items-center gap-2">
                                <input type="date" value={bulkConfig.startDate} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                <span className="text-slate-400"><ArrowRight size={16}/></span>
                                <input type="date" value={bulkConfig.endDate} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Days of Week</label>
                            <div className="flex justify-between gap-1">
                                {Object.keys(bulkConfig.days).map(day => (
                                    <button 
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                                            bulkConfig.days[day as keyof typeof bulkConfig.days] 
                                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                            : 'bg-slate-50 text-slate-400 border border-slate-100'
                                        }`}
                                    >
                                        {day.charAt(0)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* Updates */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Set Values</h4>
                        
                        {/* Rate */}
                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 transition-colors hover:border-indigo-200">
                            <button onClick={() => toggleUpdateType('rate')} className={`text-slate-500 hover:text-indigo-600`}>
                                {bulkConfig.updates.rate.enabled ? <CheckSquare className="text-indigo-600" size={20}/> : <Square size={20}/>}
                            </button>
                            <span className={`w-24 font-medium ${bulkConfig.updates.rate.enabled ? 'text-slate-900' : 'text-slate-400'}`}>Rate (₹)</span>
                            <input 
                                disabled={!bulkConfig.updates.rate.enabled}
                                type="number" 
                                placeholder="Enter Amount"
                                className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400 outline-none focus:border-indigo-500" 
                            />
                        </div>

                        {/* Inventory */}
                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 transition-colors hover:border-indigo-200">
                            <button onClick={() => toggleUpdateType('inventory')} className={`text-slate-500 hover:text-indigo-600`}>
                                {bulkConfig.updates.inventory.enabled ? <CheckSquare className="text-indigo-600" size={20}/> : <Square size={20}/>}
                            </button>
                            <span className={`w-24 font-medium ${bulkConfig.updates.inventory.enabled ? 'text-slate-900' : 'text-slate-400'}`}>Availability</span>
                            <input 
                                disabled={!bulkConfig.updates.inventory.enabled}
                                type="number" 
                                placeholder="Quantity"
                                className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400 outline-none focus:border-indigo-500" 
                            />
                        </div>

                         {/* Stop Sell */}
                         <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 transition-colors hover:border-indigo-200">
                            <button onClick={() => toggleUpdateType('stopSell')} className={`text-slate-500 hover:text-indigo-600`}>
                                {bulkConfig.updates.stopSell.enabled ? <CheckSquare className="text-indigo-600" size={20}/> : <Square size={20}/>}
                            </button>
                            <span className={`w-24 font-medium ${bulkConfig.updates.stopSell.enabled ? 'text-slate-900' : 'text-slate-400'}`}>Stop Sell</span>
                            <select 
                                disabled={!bulkConfig.updates.stopSell.enabled}
                                className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400 outline-none focus:border-indigo-500"
                            >
                                <option>Open</option>
                                <option>Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button 
                        onClick={() => setShowBulkModal(false)}
                        className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { alert('Updates queued!'); setShowBulkModal(false); }}
                        className="px-6 py-2.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                        Apply Updates
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
