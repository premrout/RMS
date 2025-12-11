
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, User, Phone, Mail, Tag, Edit3, 
  MapPin, Calendar, Clock, DollarSign, Download, Filter, Star
} from 'lucide-react';
import DataTable from './ui/DataTable';
import Modal from './ui/Modal';
import { Guest } from '../types';
import { api } from '../services/api';

const GuestCRM: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [activeSegment, setActiveSegment] = useState<'ALL' | 'VIP' | 'CORPORATE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const data = await api.getGuests();
      setGuests(data);
    } catch (error) {
      console.error("Failed to load guests", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            g.phone.includes(searchTerm);
      
      const matchesSegment = activeSegment === 'ALL' || 
                             (activeSegment === 'VIP' && g.tags.includes('VIP')) ||
                             (activeSegment === 'CORPORATE' && g.tags.includes('Corporate'));
      
      return matchesSearch && matchesSegment;
  });

  const columns = [
    {
      key: 'name',
      label: 'Guest Name',
      render: (g: Guest) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                {g.name.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-slate-900">{g.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={10} /> {g.nationality}
                </div>
            </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (g: Guest) => (
        <div className="text-sm">
            <div className="flex items-center gap-1.5 text-slate-700">
                <Mail size={12} className="text-slate-400" /> {g.email}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                <Phone size={12} className="text-slate-400" /> {g.phone}
            </div>
        </div>
      )
    },
    {
      key: 'stats',
      label: 'History',
      render: (g: Guest) => (
        <div className="text-sm">
            <div className="font-bold text-slate-800">{g.totalStays} Stays</div>
            <div className="text-xs text-slate-500">Last: {g.lastStay}</div>
        </div>
      )
    },
    {
      key: 'spend',
      label: 'Total Spend',
      render: (g: Guest) => (
        <div className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-fit">
            ₹{(g.totalSpend / 1000).toFixed(1)}k
        </div>
      )
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (g: Guest) => (
        <div className="flex flex-wrap gap-1">
            {g.tags.map(tag => (
                <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    tag === 'VIP' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    tag === 'Corporate' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                    {tag}
                </span>
            ))}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (g: Guest) => (
        <button 
            onClick={() => setSelectedGuest(g)}
            className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
        >
            <Edit3 size={14} /> Details
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Guest Relationship Management</h1>
           <p className="text-slate-500 mt-1">Manage guest profiles, track history, and personalize experiences.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                <Download size={16} /> Export
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
                <Users size={16} /> Add Guest
            </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Guests</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{guests.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Users size={24} />
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Repeat Rate</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">24%</h3>
                  <p className="text-xs text-emerald-600 font-bold">▲ 2% vs last month</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Clock size={24} />
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Avg Lifetime Value</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">₹15,400</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <DollarSign size={24} />
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Segments */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['ALL', 'VIP', 'CORPORATE'].map(seg => (
                      <button 
                        key={seg}
                        onClick={() => setActiveSegment(seg as any)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                            activeSegment === seg ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                          {seg === 'ALL' ? 'All Guests' : seg === 'VIP' ? 'VIPs' : 'Corporate'}
                      </button>
                  ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search guests..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
              </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
              <DataTable 
                title=""
                data={filteredGuests}
                columns={columns as any}
                isLoading={loading}
              />
          </div>
      </div>

      {/* Guest Detail Modal */}
      <Modal
        isOpen={!!selectedGuest}
        onClose={() => setSelectedGuest(null)}
        title="Guest Profile"
        size="lg"
      >
        {selectedGuest && (
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500">
                        {selectedGuest.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedGuest.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                        <Mail size={12} /> {selectedGuest.email}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                        <Phone size={12} /> {selectedGuest.phone}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {selectedGuest.tags.includes('VIP') && (
                                    <div className="flex flex-col items-end text-amber-500">
                                        <Star fill="currentColor" size={24} />
                                        <span className="text-[10px] font-bold uppercase">VIP Guest</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <Tag size={16} className="text-indigo-600"/> Preferences & Notes
                        </h4>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Special Requests</label>
                            <p className="text-sm text-slate-800 mt-1">{selectedGuest.preferences || "No preferences recorded."}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Internal Notes</label>
                            <textarea 
                                className="w-full mt-1 p-2 text-sm border border-slate-300 rounded bg-white focus:outline-none focus:border-indigo-500"
                                rows={3}
                                placeholder="Add note..."
                                defaultValue={selectedGuest.notes}
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3">
                            <Clock size={16} className="text-emerald-600"/> Stay History
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm p-2 bg-white rounded border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-700">Dec 2024</p>
                                    <p className="text-xs text-slate-500">Deluxe Room • 3 Nights</p>
                                </div>
                                <span className="font-mono font-bold text-slate-900">₹15,000</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-2 bg-white rounded border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-700">Oct 2024</p>
                                    <p className="text-xs text-slate-500">Suite • 2 Nights</p>
                                </div>
                                <span className="font-mono font-bold text-slate-900">₹22,000</span>
                            </div>
                        </div>
                        <button className="w-full mt-3 text-xs font-bold text-indigo-600 hover:underline">View All History</button>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button 
                        onClick={() => setSelectedGuest(null)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default GuestCRM;
