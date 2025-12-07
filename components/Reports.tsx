
import React, { useState } from 'react';
import { 
  BarChart3, Download, FileText, PieChart, Calendar, Mail, Clock, CheckCircle, FileSpreadsheet, File as FileIcon, X, TrendingUp, IndianRupee
} from 'lucide-react';

const Reports: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const reportTypes = [
    { 
      id: 'daily-sales',
      title: 'Daily Sales Report', 
      desc: 'Comprehensive breakdown of daily revenue, taxes, and payments collected.', 
      icon: BarChart3, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-100' 
    },
    { 
      id: 'occupancy',
      title: 'Occupancy Report', 
      desc: 'Occupancy percentages by room type and date range.', 
      icon: PieChart, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      id: 'revenue',
      title: 'Revenue Analysis', 
      desc: 'Detailed analysis of ADR, RevPAR, and total revenue trends.', 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-100' 
    },
    { 
      id: 'cancellations',
      title: 'Cancellations Report', 
      desc: 'List of cancelled bookings, reasons, and lost revenue impact.', 
      icon: X, 
      color: 'text-rose-600', 
      bg: 'bg-rose-100' 
    },
    { 
      id: 'commissions',
      title: 'Channel Commissions', 
      desc: 'Commission payout estimation per OTA channel (Booking.com, Agoda, etc.).', 
      icon: IndianRupee, 
      color: 'text-amber-600', 
      bg: 'bg-amber-100' 
    },
  ];

  const recentExports = [
    { name: 'Daily_Sales_Dec_15.pdf', date: 'Dec 16, 2024 08:00 AM', type: 'PDF', status: 'Ready' },
    { name: 'Channel_Commissions_Nov.csv', date: 'Dec 01, 2024 10:30 AM', type: 'CSV', status: 'Ready' },
    { name: 'Occupancy_Q3_2024.pdf', date: 'Oct 05, 2024 02:15 PM', type: 'PDF', status: 'Ready' },
  ];

  const handleExport = (format: 'CSV' | 'PDF', reportName: string) => {
      alert(`Downloading ${reportName} as ${format}...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
           <p className="text-slate-500 mt-1">Generate insights, export data, and schedule automated emails.</p>
        </div>
        <button 
            onClick={() => setShowScheduleModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
            <Clock size={18} /> Schedule Report
        </button>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${report.bg} rounded-lg flex items-center justify-center`}>
                          <report.icon className={report.color} size={24} />
                      </div>
                      <div className="flex gap-1">
                          <button 
                            onClick={() => handleExport('CSV', report.title)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Export CSV"
                          >
                              <FileSpreadsheet size={18} />
                          </button>
                          <button 
                            onClick={() => handleExport('PDF', report.title)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Export PDF"
                          >
                              <FileIcon size={18} />
                          </button>
                      </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{report.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1">{report.desc}</p>
                  
                  <button className="w-full border border-slate-200 rounded-lg py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                      View Report
                  </button>
              </div>
          ))}
      </div>

      {/* Recent Exports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Download size={18} /> Recent Downloads
              </h3>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white border-b border-slate-200">
                  <tr>
                      <th className="px-6 py-4 font-semibold text-slate-900">File Name</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Generated On</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Format</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {recentExports.map((file, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                              {file.type === 'PDF' ? <FileIcon size={16} className="text-rose-500"/> : <FileSpreadsheet size={16} className="text-emerald-500"/>}
                              {file.name}
                          </td>
                          <td className="px-6 py-4">{file.date}</td>
                          <td className="px-6 py-4">
                              <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">{file.type}</span>
                          </td>
                          <td className="px-6 py-4">
                              <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1 w-fit">
                                  <CheckCircle size={12}/> {file.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button className="text-indigo-600 hover:underline font-medium text-xs">Download Again</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Mail size={20}/> Schedule Automated Report</h3>
                    <button onClick={() => setShowScheduleModal(false)} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Report Type</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                            {reportTypes.map(r => <option key={r.id}>{r.title}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Frequency</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option>Daily (at 8:00 AM)</option>
                            <option>Weekly (Every Monday)</option>
                            <option>Monthly (1st of Month)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Recipients</label>
                        <input type="text" placeholder="Enter email addresses (comma separated)" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <p className="text-xs text-slate-400">Example: admin@hotel.com, manager@hotel.com</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Format</label>
                        <div className="flex gap-4">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500"/>
                                 <span className="text-sm text-slate-600">PDF Summary</span>
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500"/>
                                 <span className="text-sm text-slate-600">CSV Data File</span>
                             </label>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button 
                        onClick={() => setShowScheduleModal(false)}
                        className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { alert('Schedule Saved!'); setShowScheduleModal(false); }}
                        className="px-6 py-2.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                        Save Schedule
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
