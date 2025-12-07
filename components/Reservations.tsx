
import React, { useState } from 'react';
import { Booking } from '../types';
import { 
  Search, Filter, Download, MoreHorizontal, Calendar, User, 
  AlertTriangle, XCircle, CheckCircle, Clock, FileText, 
  Edit, Trash2, Eye, RefreshCw, X
} from 'lucide-react';

const Reservations: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  // Mock Data
  const bookings: Booking[] = [
      { id: 'RES-1001', guestName: 'Amit Patel', checkIn: '2024-12-15', checkOut: '2024-12-18', roomType: 'Deluxe Double', channel: 'Booking.com', status: 'Confirmed', amount: 14500, bookedOn: '2024-12-01' },
      { id: 'RES-1002', guestName: 'Sarah Jenkins', checkIn: '2024-12-16', checkOut: '2024-12-17', roomType: 'Standard Single', channel: 'Agoda', status: 'CheckedIn', amount: 3200, bookedOn: '2024-12-05' },
      { id: 'RES-1003', guestName: 'Rahul Sharma', checkIn: '2024-12-20', checkOut: '2024-12-25', roomType: 'Suite', channel: 'Direct', status: 'Pending', amount: 28000, bookedOn: '2024-12-10' },
      { id: 'RES-1004', guestName: 'Priya Singh', checkIn: '2024-12-12', checkOut: '2024-12-14', roomType: 'Family Room', channel: 'MakeMyTrip', status: 'Cancelled', amount: 8900, bookedOn: '2024-11-28' },
      { id: 'RES-1005', guestName: 'John Doe', checkIn: '2024-12-18', checkOut: '2024-12-20', roomType: 'Deluxe Double', channel: 'Goibibo', status: 'Confirmed', amount: 9500, bookedOn: '2024-12-12' },
      { id: 'RES-1006', guestName: 'Vikram Malhotra', checkIn: '2024-12-24', checkOut: '2024-12-28', roomType: 'Standard Single', channel: 'Booking.com', status: 'Confirmed', amount: 12000, bookedOn: '2024-12-14' },
  ];

  const alerts = [
      { id: 1, type: 'Overbooking', message: 'Standard Single is overbooked by 1 on Dec 24', severity: 'High', count: 1 },
      { id: 2, type: 'Discrepancy', message: 'Rate mismatch detected for RES-1003 (Expedia)', severity: 'Medium', count: 1 }
  ];

  const auditLogMock = [
      { time: '2024-12-14 10:45 AM', user: 'System (Booking.com)', action: 'Booking Modified', details: 'Check-out date changed from Dec 27 to Dec 28' },
      { time: '2024-12-14 09:30 AM', user: 'Rajesh Kumar', action: 'Email Sent', details: 'Sent booking confirmation email' },
      { time: '2024-12-14 09:15 AM', user: 'System', action: 'Payment Verified', details: 'Credit Card (ending 4242) charged ₹12,000' },
      { time: '2024-12-14 09:14 AM', user: 'System (Booking.com)', action: 'Booking Created', details: 'New reservation received via Channel Manager' },
  ];

  const handleAction = (id: string, action: string) => {
      if (action === 'LOG') {
          setSelectedBooking(id);
          setShowAuditLog(true);
      } else {
          alert(`${action} action triggered for ${id}`);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Reservations Center</h1>
           <p className="text-slate-500 mt-1">Centralized booking management and audit logs.</p>
        </div>
        <div className="flex gap-3">
             <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                <RefreshCw size={16} /> Sync
            </button>
            <button className="bg-indigo-600 text-white border border-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
                <Download size={16} /> Export List
            </button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-3 ${
                      alert.severity === 'High' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'
                  }`}>
                      <div className={`p-2 rounded-full ${
                          alert.severity === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                          <AlertTriangle size={20} />
                      </div>
                      <div>
                          <h4 className={`font-bold text-sm ${
                              alert.severity === 'High' ? 'text-rose-800' : 'text-amber-800'
                          }`}>
                              {alert.type} Alert
                          </h4>
                          <p className={`text-sm mt-1 ${
                              alert.severity === 'High' ? 'text-rose-600' : 'text-amber-700'
                          }`}>
                              {alert.message}
                          </p>
                          <button className="text-xs font-bold underline mt-2 hover:opacity-80">Resolve Issue</button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by Guest Name, Booking ID, or Email" 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            
            {/* Quick Date Filter */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                {['ALL', 'TODAY', 'TOMORROW', 'THIS_WEEK'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                            activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
              <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none hover:border-indigo-300 bg-white">
                  <option>All Channels</option>
                  <option>Booking.com</option>
                  <option>Agoda</option>
                  <option>MakeMyTrip</option>
                  <option>Direct</option>
              </select>
              <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none hover:border-indigo-300 bg-white">
                  <option>All Room Types</option>
                  <option>Deluxe Double</option>
                  <option>Standard Single</option>
                  <option>Suite</option>
              </select>
              <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none hover:border-indigo-300 bg-white">
                  <option>All Statuses</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                  <option>Checked In</option>
              </select>
              <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
                   <Calendar size={16} /> 
                   <span>Dec 01 - Dec 31, 2024</span>
              </div>
          </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Booking Details</th>
                        <th className="px-6 py-4 font-semibold">Room & Source</th>
                        <th className="px-6 py-4 font-semibold">Stay Dates</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Total</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                        {booking.guestName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{booking.guestName}</div>
                                        <div className="text-xs text-slate-500 font-mono">{booking.id} • {booking.bookedOn}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-800">{booking.roomType}</div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                    <Globe size={12} className="text-indigo-400" /> {booking.channel}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{new Date(booking.checkIn).toLocaleDateString('en-US', {day: 'numeric', month: 'short'})}</div>
                                <div className="text-xs text-slate-400">to {new Date(booking.checkOut).toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    booking.status === 'Cancelled' ? 'bg-slate-50 text-slate-500 border-slate-100 line-through' :
                                    booking.status === 'CheckedIn' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="font-bold text-slate-900">₹{booking.amount.toLocaleString()}</span>
                                <p className="text-[10px] text-emerald-600">Paid</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleAction(booking.id, 'MODIFY')}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" 
                                        title="Modify"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(booking.id, 'LOG')}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" 
                                        title="Audit Log"
                                    >
                                        <FileText size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(booking.id, 'CANCEL')}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" 
                                        title="Cancel Booking"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
              Showing {bookings.length} of 142 bookings
          </div>
      </div>

      {/* Audit Log Modal */}
      {showAuditLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Audit Log</h3>
                        <p className="text-xs text-slate-500">History for {selectedBooking}</p>
                    </div>
                    <button onClick={() => setShowAuditLog(false)} className="hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20}/></button>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-0">
                    <div className="relative">
                         {/* Timeline Line */}
                         <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200"></div>

                         {auditLogMock.map((log, idx) => (
                             <div key={idx} className="relative pl-16 pr-6 py-4 hover:bg-slate-50 transition-colors">
                                 {/* Dot */}
                                 <div className={`absolute left-[27px] top-5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${
                                     idx === 0 ? 'bg-indigo-600 ring-2 ring-indigo-100' : 'bg-slate-300'
                                 }`}></div>
                                 
                                 <div className="flex justify-between items-start mb-1">
                                     <span className="text-sm font-bold text-slate-800">{log.action}</span>
                                     <span className="text-xs text-slate-400 font-mono">{log.time}</span>
                                 </div>
                                 <p className="text-sm text-slate-600 mb-1">{log.details}</p>
                                 <div className="flex items-center gap-1.5">
                                     <User size={12} className="text-slate-400"/>
                                     <span className="text-xs text-slate-500">{log.user}</span>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                    <button onClick={() => setShowAuditLog(false)} className="text-sm font-medium text-indigo-600 hover:underline">
                        Close Log
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

// Helper component for source icon
const Globe = ({size, className}: {size: number, className: string}) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

export default Reservations;
