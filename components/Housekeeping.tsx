
import React, { useState, useEffect } from 'react';
import { 
  Brush, CheckCircle, Clock, AlertTriangle, User, Filter, Wrench, MoreHorizontal, LogOut, LogIn, Key, PlayCircle
} from 'lucide-react';
import { api } from '../services/api';
import { HousekeepingRoom, RoomStatus, OccupancyStatus } from '../types';

const Housekeeping: React.FC = () => {
  const [rooms, setRooms] = useState<HousekeepingRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterFloor, setFilterFloor] = useState<number | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await api.getHousekeepingRooms();
      setRooms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: string, newStatus: RoomStatus) => {
      setRooms(rooms.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const getStatusColor = (status: RoomStatus) => {
      switch(status) {
          case 'CLEAN': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case 'DIRTY': return 'bg-rose-100 text-rose-700 border-rose-200';
          case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'INSPECT': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'MAINTENANCE': return 'bg-slate-200 text-slate-600 border-slate-300';
          default: return 'bg-white text-slate-700';
      }
  };

  const getOccupancyIcon = (status: OccupancyStatus) => {
      switch(status) {
          case 'VACANT': return <div className="text-emerald-500 font-bold text-[10px] flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Vacant</div>;
          case 'OCCUPIED': return <div className="text-indigo-500 font-bold text-[10px] flex items-center gap-1"><User size={12}/> Occupied</div>;
          case 'CHECK_OUT': return <div className="text-rose-500 font-bold text-[10px] flex items-center gap-1"><LogOut size={12}/> Due Out</div>;
          case 'CHECK_IN': return <div className="text-amber-500 font-bold text-[10px] flex items-center gap-1"><LogIn size={12}/> Due In</div>;
      }
  };

  const filteredRooms = rooms.filter(r => {
      const floorMatch = filterFloor === 'ALL' || r.floor === filterFloor;
      const statusMatch = filterStatus === 'ALL' || r.status === filterStatus;
      return floorMatch && statusMatch;
  });

  const stats = {
      clean: rooms.filter(r => r.status === 'CLEAN').length,
      dirty: rooms.filter(r => r.status === 'DIRTY').length,
      progress: rooms.filter(r => r.status === 'IN_PROGRESS').length,
      inspect: rooms.filter(r => r.status === 'INSPECT').length,
      maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Housekeeping</h1>
           <p className="text-slate-500 mt-1">Manage room cleaning status and assignments.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                <Wrench size={16} /> Maintenance Request
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
                <Brush size={16} /> Auto-Assign
            </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border border-emerald-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Clean</p>
                  <p className="text-xl font-bold text-emerald-600">{stats.clean}</p>
              </div>
              <CheckCircle className="text-emerald-200" size={24} />
          </div>
          <div className="bg-white border border-rose-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Dirty</p>
                  <p className="text-xl font-bold text-rose-600">{stats.dirty}</p>
              </div>
              <Brush className="text-rose-200" size={24} />
          </div>
          <div className="bg-white border border-amber-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">In Progress</p>
                  <p className="text-xl font-bold text-amber-600">{stats.progress}</p>
              </div>
              <Clock className="text-amber-200" size={24} />
          </div>
          <div className="bg-white border border-blue-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Inspect</p>
                  <p className="text-xl font-bold text-blue-600">{stats.inspect}</p>
              </div>
              <Key className="text-blue-200" size={24} />
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">OOO</p>
                  <p className="text-xl font-bold text-slate-600">{stats.maintenance}</p>
              </div>
              <AlertTriangle className="text-slate-200" size={24} />
          </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter size={16} /> Filters:
          </div>
          <select 
            value={filterFloor} 
            onChange={(e) => setFilterFloor(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
              <option value="ALL">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
              <option value="ALL">All Statuses</option>
              <option value="CLEAN">Clean</option>
              <option value="DIRTY">Dirty</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="INSPECT">Inspect</option>
              <option value="MAINTENANCE">Maintenance</option>
          </select>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
              <div className="col-span-full text-center py-12 text-slate-400">Loading rooms...</div>
          ) : filteredRooms.map(room => (
              <div key={room.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                  {/* Card Header */}
                  <div className={`px-4 py-3 flex justify-between items-center border-b ${
                      room.status === 'CLEAN' ? 'bg-emerald-50 border-emerald-100' :
                      room.status === 'DIRTY' ? 'bg-rose-50 border-rose-100' :
                      room.status === 'IN_PROGRESS' ? 'bg-amber-50 border-amber-100' :
                      room.status === 'INSPECT' ? 'bg-blue-50 border-blue-100' :
                      'bg-slate-100 border-slate-200'
                  }`}>
                      <h3 className="font-bold text-lg text-slate-800">{room.number}</h3>
                      <div className="flex gap-1">
                          {room.priority && <AlertTriangle size={14} className="text-amber-500" fill="currentColor" />}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getStatusColor(room.status)}`}>
                              {room.status.replace('_', ' ')}
                          </span>
                      </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 space-y-3">
                      <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">{room.type}</span>
                          {getOccupancyIcon(room.occupancy)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                          <User size={12} className="text-slate-400"/>
                          <span className="font-medium truncate">{room.assignedTo || 'Unassigned'}</span>
                      </div>

                      {room.notes && (
                          <p className="text-[10px] text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100 flex items-start gap-1">
                              <AlertTriangle size={10} className="mt-0.5 shrink-0" /> {room.notes}
                          </p>
                      )}
                  </div>

                  {/* Card Actions */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50 flex gap-1 justify-center">
                      {room.status === 'DIRTY' && (
                          <button 
                            onClick={() => updateStatus(room.id, 'IN_PROGRESS')}
                            className="w-full text-xs font-bold text-amber-600 hover:bg-amber-100 py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                          >
                              <PlayCircle size={12} /> Start
                          </button>
                      )}
                      {room.status === 'IN_PROGRESS' && (
                          <button 
                            onClick={() => updateStatus(room.id, 'CLEAN')} // Skip inspect for demo
                            className="w-full text-xs font-bold text-emerald-600 hover:bg-emerald-100 py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                          >
                              <CheckCircle size={12} /> Finish
                          </button>
                      )}
                      {room.status === 'CLEAN' && (
                          <button 
                            onClick={() => updateStatus(room.id, 'DIRTY')}
                            className="w-full text-xs font-bold text-slate-400 hover:bg-slate-200 py-1.5 rounded transition-colors"
                          >
                              Reset
                          </button>
                      )}
                      {room.status === 'INSPECT' && (
                          <button 
                            onClick={() => updateStatus(room.id, 'CLEAN')}
                            className="w-full text-xs font-bold text-blue-600 hover:bg-blue-100 py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                          >
                              <CheckCircle size={12} /> Approve
                          </button>
                      )}
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default Housekeeping;
