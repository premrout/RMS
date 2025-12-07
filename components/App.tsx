
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Globe, 
  Settings, 
  Hotel,
  Menu,
  Bell,
  Share2,
  LogOut,
  User as UserIcon,
  TrendingUp,
  FileText,
  BedDouble,
  CreditCard
} from 'lucide-react';
import { DailyData, DashboardMetrics, ViewState, PageState, User, Competitor, Channel, ActionItem } from '../types';
import Dashboard from './Dashboard';
import ChatAssistant from './ChatAssistant';
import LandingPage from './LandingPage';
import PublicNavbar from './PublicNavbar';
import PublicPricing from './PublicPricing';
import Auth from './Auth';
import ChannelManager from './ChannelManager';
import InventoryGrid from './InventoryGrid';
import Reservations from './Reservations';
import Reports from './Reports';
import AdminPanel from './AdminPanel';
import RMSModule from './RMSModule';
import BookingEngine from './BookingEngine';
import { api } from '../services/api';

const COMPETITOR_COLORS = ['#ec4899', '#f59e0b', '#06b6d4', '#8b5cf6', '#84cc16'];

const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageState>('LANDING');
  const [user, setUser] = useState<User | null>(null);

  // Dashboard State
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [data, setData] = useState<DailyData[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    occupancyRate: 0,
    avgADR: 0,
    revPAR: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // New States for Modules
  const [channels, setChannels] = useState<Channel[]>([
      { id: '1', name: 'Booking.com', logo: 'B.', status: 'Connected', lastSync: '2 mins ago', commission: 15 },
      { id: '2', name: 'Agoda', logo: 'ag', status: 'Connected', lastSync: '5 mins ago', commission: 18 },
      { id: '3', name: 'MakeMyTrip', logo: 'MMT', status: 'Error', lastSync: '4 hours ago', commission: 20 },
      { id: '4', name: 'Goibibo', logo: 'Go', status: 'Connected', lastSync: '10 mins ago', commission: 19 },
  ]);

  const [actions, setActions] = useState<ActionItem[]>([
      { id: 'a1', type: 'Rate', message: 'High demand detected for Dec 25. Review rates.', priority: 'High' },
      { id: 'a2', type: 'System', message: 'MakeMyTrip connection error. Re-authenticate.', priority: 'High' },
      { id: 'a3', type: 'Inventory', message: 'Low inventory warning: Deluxe Room (2 left).', priority: 'Medium' },
      { id: 'a4', type: 'Reservation', message: 'New group booking request (5 rooms) pending approval.', priority: 'Medium' },
  ]);

  // Competitor State
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  // Function to generate and seed data if DB is empty
  const seedMockData = async (comps: Competitor[]) => {
      const mockData: DailyData[] = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
        const baseOcc = isWeekend ? 85 : 55;
        const occupancy = Math.min(100, Math.max(20, baseOcc + Math.random() * 20 - 10));
        
        const basePrice = 4500;
        const adr = Math.round(basePrice * (1 + (occupancy / 100)) + (Math.random() * 500));
        
        const compRates: Record<string, number> = {};
        let totalCompRate = 0;
        
        comps.forEach(comp => {
            const variance = (Math.random() * 0.3) - 0.15;
            const rate = Math.round(adr * (1 + variance));
            compRates[comp.id] = rate;
            totalCompRate += rate;
        });

        const avgCompRate = comps.length > 0 ? Math.round(totalCompRate / comps.length) : adr;

        mockData.push({
          date: dateStr,
          occupancy: Math.round(occupancy),
          adr,
          revpar: Math.round(adr * (occupancy / 100)),
          competitorRate: avgCompRate,
          competitorRates: compRates,
          bookings: Math.floor(Math.random() * 10) + 2
        });
      }
      
      await api.seedData(mockData);
      return mockData;
  };

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
        // 1. Fetch Competitors
        let comps = await api.getCompetitors();
        if (comps.length === 0) {
            // Seed competitors if none exist
            const defaults = [
                { name: 'Grand Hotel Mumbai', color: COMPETITOR_COLORS[0] },
                { name: 'City Stay Inn', color: COMPETITOR_COLORS[1] },
                { name: 'Seaside Resort', color: COMPETITOR_COLORS[2] }
            ];
            for (const d of defaults) await api.addCompetitor(d);
            comps = await api.getCompetitors();
        }
        setCompetitors(comps);

        // 2. Fetch Daily Data
        let daily = await api.getDailyData();
        if (daily.length === 0) {
            daily = await seedMockData(comps);
        }
        setData(daily);
        updateMetrics(daily);
    };

    if (currentPage === 'APP') {
        fetchData();
    }
  }, [currentPage]);

  const updateMetrics = (currentData: DailyData[]) => {
    const totalRev = currentData.reduce((sum, d) => sum + (d.revpar * 50), 0); 
    const avgOcc = currentData.reduce((sum, d) => sum + d.occupancy, 0) / currentData.length;
    const avgAdr = currentData.reduce((sum, d) => sum + d.adr, 0) / currentData.length;
    
    setMetrics({
      totalRevenue: Math.round(totalRev),
      occupancyRate: Math.round(avgOcc),
      avgADR: Math.round(avgAdr),
      revPAR: Math.round(avgAdr * (avgOcc / 100))
    });
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('APP');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('LANDING');
  };

  // Competitor Handlers
  const addCompetitor = async (name: string) => {
      const colorIndex = competitors.length % COMPETITOR_COLORS.length;
      const newComp = await api.addCompetitor({ name, color: COMPETITOR_COLORS[colorIndex] });
      setCompetitors([...competitors, newComp]);
  };

  const removeCompetitor = async (id: string) => {
      await api.deleteCompetitor(id);
      setCompetitors(competitors.filter(c => c.id !== id));
  };

  const updateCompetitorRate = (date: string, compId: string, newRate: number) => {
      // For this MVP, we update local state. In real app, we'd persist this to DB as well.
      const updatedData = data.map(day => {
          if (day.date === date) {
              const newRates = { ...day.competitorRates, [compId]: newRate };
              const rates = Object.values(newRates) as number[];
              const avg = rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
              return { ...day, competitorRates: newRates, competitorRate: Math.round(avg) };
          }
          return day;
      });
      setData(updatedData);
  };

  // Update Hotel Rate Handler
  const updateMyRate = async (date: string, newRate: number) => {
      await api.updateRate(date, newRate);
      
      const updatedData = data.map(day => {
          if (day.date === date) {
              const revpar = Math.round(newRate * (day.occupancy / 100));
              return { ...day, adr: newRate, revpar };
          }
          return day;
      });
      setData(updatedData);
      updateMetrics(updatedData);
  };

  const NavItem = ({ viewState, icon: Icon, label }: { viewState: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(viewState)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        view === viewState 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium whitespace-nowrap">{label}</span>
    </button>
  );

  // --------------------------------------------------------------------------
  // Public Website Render
  // --------------------------------------------------------------------------
  if (currentPage !== 'APP') {
    if (currentPage === 'LOGIN') {
      return <Auth onLogin={handleLogin} onBack={() => setCurrentPage('LANDING')} />;
    }

    return (
      <div className="min-h-screen font-sans flex flex-col">
        <PublicNavbar setPage={setCurrentPage} currentPage={currentPage} />
        <div className="flex-1">
          {currentPage === 'LANDING' && <LandingPage setPage={setCurrentPage} />}
          {currentPage === 'PRICING' && <PublicPricing setPage={setCurrentPage} />}
        </div>
        
        <footer className="bg-white border-t border-slate-100 py-12">
           <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
              <div className="flex items-center mb-4 md:mb-0">
                  <Hotel className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="font-bold text-slate-800">JyotiPrem</span>
              </div>
              <div className="flex space-x-6">
                 <button className="hover:text-indigo-600">Privacy Policy</button>
                 <button className="hover:text-indigo-600">Terms of Service</button>
                 <button className="hover:text-indigo-600">Contact</button>
              </div>
              <div className="mt-4 md:mt-0">
                 © 2024 JyotiPrem Systems Pvt Ltd.
              </div>
           </div>
        </footer>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Authenticated Dashboard Render
  // --------------------------------------------------------------------------
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-10`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100 cursor-pointer" onClick={() => setCurrentPage('LANDING')}>
          <div className="flex items-center space-x-2 text-indigo-600">
            <Hotel size={28} strokeWidth={2.5} />
            {sidebarOpen && <span className="text-xl font-bold tracking-tight text-slate-900">JyotiPrem</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {sidebarOpen ? (
                <>
                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Home</div>
                    <NavItem viewState={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
                    
                    <div className="mt-4 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</div>
                    <NavItem viewState={ViewState.INVENTORY} icon={CalendarDays} label="Rates & Inventory" />
                    <NavItem viewState={ViewState.CHANNELS} icon={Share2} label="Channel Manager" />
                    <NavItem viewState={ViewState.RESERVATIONS} icon={BedDouble} label="Reservations" />
                    
                    <div className="mt-4 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue & Growth</div>
                    <NavItem viewState={ViewState.RMS} icon={TrendingUp} label="RMS & Competitors" />
                    <NavItem viewState={ViewState.BOOKING_ENGINE} icon={Globe} label="Booking Engine" />
                    
                    <div className="mt-4 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis</div>
                    <NavItem viewState={ViewState.REPORTS} icon={FileText} label="Reports" />
                    
                    <div className="mt-4 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">System</div>
                    <NavItem viewState={ViewState.SETTINGS} icon={Settings} label="Settings" />
                </>
            ) : (
                <div className="flex flex-col items-center space-y-4 pt-2">
                    <button onClick={() => setView(ViewState.DASHBOARD)} className={`p-3 rounded-lg ${view === ViewState.DASHBOARD ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="Dashboard"><LayoutDashboard size={20} /></button>
                    <button onClick={() => setView(ViewState.INVENTORY)} className={`p-3 rounded-lg ${view === ViewState.INVENTORY ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="Inventory"><CalendarDays size={20} /></button>
                    <button onClick={() => setView(ViewState.CHANNELS)} className={`p-3 rounded-lg ${view === ViewState.CHANNELS ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="Channel Manager"><Share2 size={20} /></button>
                    <button onClick={() => setView(ViewState.RESERVATIONS)} className={`p-3 rounded-lg ${view === ViewState.RESERVATIONS ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="Reservations"><BedDouble size={20} /></button>
                    <button onClick={() => setView(ViewState.RMS)} className={`p-3 rounded-lg ${view === ViewState.RMS ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="RMS"><TrendingUp size={20} /></button>
                    <button onClick={() => setView(ViewState.BOOKING_ENGINE)} className={`p-3 rounded-lg ${view === ViewState.BOOKING_ENGINE ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="Booking Engine"><Globe size={20} /></button>
                    <button onClick={() => setView(ViewState.REPORTS)} className={`p-3 rounded-lg ${view === ViewState.REPORTS ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="Reports"><FileText size={20} /></button>
                    <button onClick={() => setView(ViewState.SETTINGS)} className={`p-3 rounded-lg ${view === ViewState.SETTINGS ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`} title="Settings"><Settings size={20} /></button>
                </div>
            )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-6">
            <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 flex items-center gap-2">
                <CreditCard size={14} /> Create Reservation
            </button>
            <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              {actions.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>}
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-800">{user?.hotelName || 'My Hotel'}</p>
                <div className="flex items-center justify-end gap-1">
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase">{user?.role}</span>
                    <p className="text-xs text-slate-500">{user?.name}</p>
                </div>
              </div>
              <div className="group relative">
                <button className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm overflow-hidden border border-indigo-200">
                   {user?.avatar ? <img src={user.avatar} alt="avatar" /> : <UserIcon size={16} />}
                </button>
                {/* Dropdown for logout */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 hidden group-hover:block p-1 z-50">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded flex items-center gap-2">
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          {view === ViewState.DASHBOARD && <Dashboard data={data} metrics={metrics} actions={actions} channels={channels} competitors={competitors} />}
          
          {view === ViewState.INVENTORY && <InventoryGrid data={data} />}

          {view === ViewState.CHANNELS && <ChannelManager channels={channels} />}
          
          {view === ViewState.RESERVATIONS && <Reservations />}

          {/* RMS Module combining Pricing and Competitors */}
          {view === ViewState.RMS && (
             <RMSModule 
                data={data} 
                competitors={competitors} 
                onAddCompetitor={addCompetitor} 
                onRemoveCompetitor={removeCompetitor} 
                onUpdateRate={updateCompetitorRate} 
                onUpdateMyRate={updateMyRate}
             />
          )}

          {view === ViewState.BOOKING_ENGINE && <BookingEngine />}

          {view === ViewState.REPORTS && <Reports />}

          {view === ViewState.SETTINGS && <AdminPanel />}
        </div>

        <ChatAssistant />
      </main>
    </div>
  );
};

export default App;
