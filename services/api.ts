
import { DailyData, Competitor, Booking, User, SubscriptionPlan, AuditLogEntry, Invoice, SystemSettings, PlatformAnalyticsData, RoleDefinition, ApiKey, WebhookEndpoint, Guest, HousekeepingRoom } from '../types';

const API_URL = 'http://localhost:8000/api'; // Adjust based on deployment

export const api = {
  // --- Daily Data & Rates ---
  getDailyData: async (): Promise<DailyData[]> => {
    try {
      const res = await fetch(`${API_URL}/daily-data`);
      if (!res.ok) throw new Error('Failed to fetch data');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  updateRate: async (date: string, newRate: number) => {
    const res = await fetch(`${API_URL}/rates/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: date, new_rate: newRate })
    });
    return res.json();
  },

  seedData: async (data: DailyData[]) => {
      await fetch(`${API_URL}/daily-data/seed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });
  },

  // --- Competitors ---
  getCompetitors: async (): Promise<Competitor[]> => {
    try {
      const res = await fetch(`${API_URL}/competitors`);
      return await res.json();
    } catch(e) {
      console.error(e);
      return [];
    }
  },

  addCompetitor: async (competitor: Omit<Competitor, 'id'>) => {
    const res = await fetch(`${API_URL}/competitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(competitor)
    });
    return res.json();
  },

  deleteCompetitor: async (id: string) => {
    await fetch(`${API_URL}/competitors/${id}`, { method: 'DELETE' });
  },

  // --- Plans (Super Admin) ---
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
        const res = await fetch(`${API_URL}/plans`);
        if (!res.ok) {
            return [
                { id: '1', name: 'Starter', price: 3999, period: 'Monthly', features: ['10 Rooms', 'Basic Reports'], active: true },
                { id: '2', name: 'Professional', price: 7999, period: 'Monthly', features: ['50 Rooms', 'AI Pricing', 'Channel Manager'], active: true },
            ];
        }
        return await res.json();
    } catch (e) {
        return [
            { id: '1', name: 'Starter', price: 3999, period: 'Monthly', features: ['10 Rooms', 'Basic Reports'], active: true },
            { id: '2', name: 'Professional', price: 7999, period: 'Monthly', features: ['50 Rooms', 'AI Pricing', 'Channel Manager'], active: true },
        ];
    }
  },

  createPlan: async (plan: Omit<SubscriptionPlan, 'id'>) => {
      const res = await fetch(`${API_URL}/plans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(plan)
      });
      return res.json();
  },

  updatePlan: async (id: string, plan: Partial<SubscriptionPlan>) => {
      const res = await fetch(`${API_URL}/plans/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(plan)
      });
      return res.json();
  },

  deletePlan: async (id: string) => {
      await fetch(`${API_URL}/plans/${id}`, { method: 'DELETE' });
  },

  // --- Users & Tenants (Super Admin) ---
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) throw new Error("Mock fallback");
      return await res.json();
    } catch(e) {
       return [
          { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@grand.com', role: 'ADMIN', hotelName: 'Grand Hotel Mumbai', avatar: '', status: 'Active' },
          { id: 'u2', name: 'Sarah Smith', email: 'sarah@grand.com', role: 'USER', hotelName: 'Grand Hotel Mumbai', avatar: '', status: 'Active' },
          { id: 'u3', name: 'Super Admin', email: 'admin@revop.com', role: 'SUPER_ADMIN', subRole: 'OWNER', hotelName: 'HQ', avatar: '', status: 'Active' },
        ];
    }
  },

  createUser: async (user: any) => {
      const res = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
      });
      return res.json();
  },

  updateUser: async (id: string, user: any) => {
      const res = await fetch(`${API_URL}/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
      });
      return res.json();
  },

  deleteUser: async (id: string) => {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
  },

  // --- Internal Admins (Super Admin) ---
  getInternalAdmins: async (): Promise<User[]> => {
      try {
          const res = await fetch(`${API_URL}/admins`);
          if (!res.ok) throw new Error("Mock fallback");
          return await res.json();
      } catch (e) {
          return [
              { id: 'a1', name: 'Alice Admin', email: 'alice@revop.com', role: 'SUPER_ADMIN', subRole: 'OWNER', hotelName: 'HQ', status: 'Active', mfaEnabled: true, lastLogin: '2 mins ago' },
              { id: 'a2', name: 'Bob Builder', email: 'bob@revop.com', role: 'SUPER_ADMIN', subRole: 'DEVELOPER', hotelName: 'HQ', status: 'Active', mfaEnabled: true, lastLogin: '1 hour ago' },
              { id: 'a3', name: 'Charlie Support', email: 'charlie@revop.com', role: 'SUPER_ADMIN', subRole: 'SUPPORT', hotelName: 'HQ', status: 'Active', mfaEnabled: false, lastLogin: '2 days ago' },
              { id: 'a4', name: 'Fiona Finance', email: 'fiona@revop.com', role: 'SUPER_ADMIN', subRole: 'FINANCE', hotelName: 'HQ', status: 'Invited', mfaEnabled: false },
          ];
      }
  },

  getRoles: async (): Promise<RoleDefinition[]> => {
      try {
          const res = await fetch(`${API_URL}/roles`);
          if (!res.ok) throw new Error("Mock fallback");
          return await res.json();
      } catch (e) {
          return [
              { id: 'r1', name: 'Owner', description: 'Full access to all systems and billing.', permissions: ['*'], usersCount: 1, isSystem: true },
              { id: 'r2', name: 'Developer', description: 'Access to API, Logs, and System Settings.', permissions: ['system.read', 'system.write', 'logs.read', 'api.manage'], usersCount: 1, isSystem: false },
              { id: 'r3', name: 'Support Agent', description: 'Read-only access to tenants and logs for troubleshooting.', permissions: ['users.read', 'tenants.read', 'logs.read'], usersCount: 1, isSystem: false },
              { id: 'r4', name: 'Finance', description: 'Access to Billing and Invoices only.', permissions: ['billing.read', 'billing.manage'], usersCount: 1, isSystem: false },
          ];
      }
  },

  // --- Developer Tools ---
  getApiKeys: async (): Promise<ApiKey[]> => {
      try {
          const res = await fetch(`${API_URL}/developer/keys`);
          if(!res.ok) throw new Error("Mock");
          return await res.json();
      } catch (e) {
          return [
              { id: '1', name: 'Mobile App', prefix: 'sk_live_83js...', scopes: ['READ'], lastUsed: '2 mins ago', created: '2024-01-10', status: 'Active' },
              { id: '2', name: 'Billing Sync', prefix: 'sk_live_92kx...', scopes: ['READ', 'WRITE'], lastUsed: '1 day ago', created: '2024-02-15', status: 'Active' },
              { id: '3', name: 'Test Key', prefix: 'sk_test_12ab...', scopes: ['ADMIN'], lastUsed: 'Never', created: '2024-12-01', status: 'Revoked' },
          ];
      }
  },

  createApiKey: async (data: Partial<ApiKey>) => {
      // Mock creation
      return { ...data, id: `key_${Date.now()}`, prefix: 'sk_live_new...', created: 'Just now', lastUsed: 'Never', status: 'Active' };
  },

  getWebhooks: async (): Promise<WebhookEndpoint[]> => {
      try {
          const res = await fetch(`${API_URL}/developer/webhooks`);
          if(!res.ok) throw new Error("Mock");
          return await res.json();
      } catch (e) {
          return [
              { id: 'wh_1', url: 'https://api.crm-system.com/hooks/revop', events: ['tenant.created', 'tenant.updated'], status: 'Active', failureCount: 0, lastTriggered: '10 mins ago', secret: 'whsec_...' },
              { id: 'wh_2', url: 'https://hooks.slack.com/services/T000/B000/XXX', events: ['system.alert'], status: 'Active', failureCount: 0, lastTriggered: '2 days ago', secret: 'whsec_...' },
              { id: 'wh_3', url: 'https://internal-analytics.revop.com/ingest', events: ['*'], status: 'Failed', failureCount: 15, lastTriggered: '1 hour ago', secret: 'whsec_...' },
          ];
      }
  },

  // --- Guests ---
  getGuests: async (): Promise<Guest[]> => {
      try {
          const res = await fetch(`${API_URL}/guests`);
          if(!res.ok) throw new Error("Mock");
          return await res.json();
      } catch (e) {
          return [
              { id: 'g1', name: 'Amit Patel', email: 'amit.p@gmail.com', phone: '+91 9876543210', nationality: 'IN', totalStays: 5, totalSpend: 120000, lastStay: '2024-12-01', tags: ['VIP', 'High Spender'], preferences: 'Vegetarian, High Floor' },
              { id: 'g2', name: 'Sarah Jenkins', email: 'sarah.j@outlook.com', phone: '+44 7700 900077', nationality: 'UK', totalStays: 1, totalSpend: 15000, lastStay: '2024-11-15', tags: ['OTA', 'Leisure'], preferences: 'Extra Pillow' },
              { id: 'g3', name: 'Rahul Sharma', email: 'rahul.tech@corp.com', phone: '+91 9988776655', nationality: 'IN', totalStays: 12, totalSpend: 450000, lastStay: '2024-12-10', tags: ['Corporate', 'Long Stay'], preferences: 'Quiet Room, Invoice Required' },
              { id: 'g4', name: 'John Doe', email: 'johndoe@email.com', phone: '+1 555 0199', nationality: 'US', totalStays: 2, totalSpend: 45000, lastStay: '2024-10-20', tags: [], preferences: '' },
              { id: 'g5', name: 'Priya Singh', email: 'priya.s@gmail.com', phone: '+91 9123456780', nationality: 'IN', totalStays: 3, totalSpend: 35000, lastStay: '2024-09-05', tags: ['Family'], preferences: 'Connecting Rooms' },
          ];
      }
  },

  // --- Housekeeping ---
  getHousekeepingRooms: async (): Promise<HousekeepingRoom[]> => {
    try {
      const res = await fetch(`${API_URL}/housekeeping`);
      if (!res.ok) throw new Error("Mock fallback");
      return await res.json();
    } catch (e) {
      return [
        { id: '101', number: '101', type: 'Standard Single', status: 'DIRTY', occupancy: 'VACANT', floor: 1, priority: true },
        { id: '102', number: '102', type: 'Deluxe Double', status: 'CLEAN', occupancy: 'OCCUPIED', floor: 1, assignedTo: 'Sarah' },
        { id: '103', number: '103', type: 'Suite', status: 'IN_PROGRESS', occupancy: 'CHECK_OUT', floor: 1, assignedTo: 'John' },
        { id: '201', number: '201', type: 'Standard Single', status: 'INSPECT', occupancy: 'VACANT', floor: 2 },
        { id: '202', number: '202', type: 'Deluxe Double', status: 'MAINTENANCE', occupancy: 'VACANT', floor: 2, notes: 'AC Repair' },
        { id: '203', number: '203', type: 'Family Room', status: 'CLEAN', occupancy: 'CHECK_IN', floor: 2 },
      ];
    }
  },

  // --- Audit Logs ---
  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
      try {
          const res = await fetch(`${API_URL}/audit-logs`);
          if (!res.ok) throw new Error("Mock fallback");
          return await res.json();
      } catch (e) {
          // Mock Logs
          return [
              { id: 'log_1', timestamp: '2024-12-15 10:42:01', actorName: 'Rajesh Kumar', actorRole: 'ADMIN', ipAddress: '192.168.1.5', action: 'UPDATE', resource: 'Rate', details: 'Updated rates for Dec 25-30', status: 'SUCCESS', metadata: { old: 4500, new: 5500 } },
              { id: 'log_2', timestamp: '2024-12-15 10:15:22', actorName: 'System', actorRole: 'SYSTEM', ipAddress: 'localhost', action: 'SYNC', resource: 'Channel', details: 'Failed to sync with Agoda', status: 'FAILURE' },
              { id: 'log_3', timestamp: '2024-12-14 16:30:00', actorName: 'Super Admin', actorRole: 'SUPER_ADMIN', ipAddress: '10.0.0.1', action: 'CREATE', resource: 'Plan', details: 'Created new Enterprise Plan', status: 'SUCCESS' },
              { id: 'log_4', timestamp: '2024-12-14 09:00:15', actorName: 'Sarah Smith', actorRole: 'USER', ipAddress: '192.168.1.8', action: 'LOGIN', resource: 'Security', details: 'User logged in successfully', status: 'SUCCESS' },
              { id: 'log_5', timestamp: '2024-12-13 14:20:10', actorName: 'Rajesh Kumar', actorRole: 'ADMIN', ipAddress: '192.168.1.5', action: 'DELETE', resource: 'User', details: 'Removed staff member John Doe', status: 'SUCCESS' },
          ];
      }
  },

  // --- Billing & Invoices ---
  getInvoices: async (): Promise<Invoice[]> => {
      try {
          const res = await fetch(`${API_URL}/invoices`);
          if(!res.ok) throw new Error("Mock fallback");
          return await res.json();
      } catch (e) {
          return [
              { id: 'INV-2024-001', tenantId: 't1', tenantName: 'Grand Hotel Mumbai', amount: 15999, status: 'PAID', date: '2024-12-01', planName: 'Enterprise', paymentMethod: 'Razorpay' },
              { id: 'INV-2024-002', tenantId: 't2', tenantName: 'City Stay Inn', amount: 3999, status: 'OVERDUE', date: '2024-12-05', planName: 'Starter', paymentMethod: 'Credit Card' },
              { id: 'INV-2024-003', tenantId: 't3', tenantName: 'Seaside Resort', amount: 7999, status: 'PAID', date: '2024-12-10', planName: 'Professional', paymentMethod: 'Bank Transfer' },
              { id: 'INV-2024-004', tenantId: 't1', tenantName: 'Grand Hotel Mumbai', amount: 15999, status: 'PAID', date: '2024-11-01', planName: 'Enterprise', paymentMethod: 'Razorpay' },
              { id: 'INV-2024-005', tenantId: 't4', tenantName: 'Hilltop View', amount: 3999, status: 'PENDING', date: '2024-12-15', planName: 'Starter', paymentMethod: 'Razorpay' },
          ];
      }
  },

  // --- System Settings ---
  getSystemSettings: async (): Promise<SystemSettings | null> => {
      try {
          const res = await fetch(`${API_URL}/settings`);
          if(!res.ok) throw new Error("Mock fallback");
          return await res.json();
      } catch (e) {
          // Mock Settings
          return {
              platformName: 'RevOpRMS',
              supportEmail: 'support@revoprms.com',
              maintenanceMode: false,
              allowRegistrations: true,
              defaultCurrency: 'INR',
              minPasswordLength: 8,
              sessionTimeout: 60,
              smtpHost: 'smtp.sendgrid.net',
              smtpPort: 587,
              smtpUser: 'apikey',
              razorpayKeyId: 'rzp_test_1234567890',
              geminiApiKey: 'AIzaSy...'
          };
      }
  },

  updateSystemSettings: async (settings: SystemSettings) => {
      await fetch(`${API_URL}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
      });
  },

  // --- Analytics ---
  getPlatformAnalytics: async (): Promise<PlatformAnalyticsData> => {
      try {
        const res = await fetch(`${API_URL}/analytics`);
        if(!res.ok) throw new Error("Mock fallback");
        return await res.json();
      } catch (e) {
        return {
            mrrHistory: [
                { month: 'Jul', amount: 150000 },
                { month: 'Aug', amount: 165000 },
                { month: 'Sep', amount: 180000 },
                { month: 'Oct', amount: 195000 },
                { month: 'Nov', amount: 210000 },
                { month: 'Dec', amount: 240000 },
            ],
            userGrowth: [
               { month: 'Jul', users: 80, tenants: 20 },
               { month: 'Aug', users: 95, tenants: 24 },
               { month: 'Sep', users: 110, tenants: 28 },
               { month: 'Oct', users: 125, tenants: 35 },
               { month: 'Nov', users: 135, tenants: 42 },
               { month: 'Dec', users: 142, tenants: 55 },
            ],
            churnRate: 2.4,
            churnTrend: -0.5,
            apiUsage: [
                { tenantName: 'Grand Hotel Mumbai', requests: 45000, errorRate: 0.05 },
                { tenantName: 'City Stay Inn', requests: 12000, errorRate: 1.2 },
                { tenantName: 'Seaside Resort', requests: 28000, errorRate: 0.1 },
                { tenantName: 'Hilltop View', requests: 8500, errorRate: 0.0 },
                { tenantName: 'Urban Pods', requests: 32000, errorRate: 0.4 },
            ],
            featureUsage: [
                { feature: 'Price Intelligence', count: 95, percentage: 85 },
                { feature: 'Channel Manager', count: 82, percentage: 70 },
                { feature: 'Booking Engine', count: 45, percentage: 40 },
                { feature: 'Reports', count: 60, percentage: 55 },
                { feature: 'Inventory', count: 98, percentage: 90 },
            ]
        };
      }
  },

  // --- Auth ---
  login: async (email: string, password: string, role?: string): Promise<User> => {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        if(!res.ok) throw new Error("Login failed");
        return await res.json();
      } catch (e) {
        // Fallback Mock for when backend is offline
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        return {
            id: '123',
            name: role === 'SUPER_ADMIN' ? 'System Administrator' : (role === 'ADMIN' ? 'Rajesh Kumar' : 'Staff Member'),
            email: email || `user@example.com`,
            role: (role as any) || 'ADMIN',
            hotelName: role === 'SUPER_ADMIN' ? 'RevOpRMS HQ' : 'Hotel Mumbai Deluxe',
            avatar: role === 'SUPER_ADMIN' 
              ? 'https://ui-avatars.com/api/?name=Super+Admin&background=1e293b&color=fff' 
              : 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=4f46e5&color=fff',
            status: 'Active'
        };
      }
  }
};
