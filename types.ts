
export interface DailyData {
  date: string;
  occupancy: number; // 0-100
  adr: number; // Average Daily Rate
  revpar: number; // Revenue Per Available Room
  competitorRate: number; // Kept for backward compatibility (Average)
  competitorRates?: Record<string, number>; // Map of competitor ID to rate
  bookings: number;
}

export interface Competitor {
  id: string;
  name: string;
  color: string;
}

export interface PriceSuggestion {
  date: string;
  currentPrice: number;
  recommendedPrice: number;
  reason: string;
  demandLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
}

export interface EventData {
  title: string;
  date: string;
  description: string;
  sourceUrl?: string;
  sourceTitle?: string;
  sources?: { title: string; uri: string }[];
}

export interface DashboardMetrics {
  totalRevenue: number;
  occupancyRate: number;
  avgADR: number;
  revPAR: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  CHANNELS = 'CHANNELS',
  RESERVATIONS = 'RESERVATIONS',
  GUESTS = 'GUESTS',
  RMS = 'RMS',
  BOOKING_ENGINE = 'BOOKING_ENGINE',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  HOUSEKEEPING = 'HOUSEKEEPING',
  // Super Admin Views
  SA_OVERVIEW = 'SA_OVERVIEW',
  SA_ANALYTICS = 'SA_ANALYTICS',
  SA_PLANS = 'SA_PLANS', // Pricing Management
  SA_TENANTS = 'SA_TENANTS',
  SA_ADMINS = 'SA_ADMINS',
  SA_ROLES = 'SA_ROLES',
  SA_BILLING = 'SA_BILLING',
  SA_NOTIFICATIONS = 'SA_NOTIFICATIONS',
  SA_CMS = 'SA_CMS', // Content Management
  SA_SETTINGS = 'SA_SETTINGS', // Web App Settings
  SA_FLAGS = 'SA_FLAGS', // Feature Flags
  SA_LOGS = 'SA_LOGS',
  SA_SUPPORT = 'SA_SUPPORT',
  SA_INTEGRATIONS = 'SA_INTEGRATIONS',
  SA_DEVELOPER = 'SA_DEVELOPER'
}

export type RMSView = 'SUGGESTIONS' | 'COMPETITORS' | 'ANALYTICS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SUPER_ADMIN';
  subRole?: 'SUPPORT' | 'FINANCE' | 'DEVELOPER' | 'OWNER'; // Granular roles
  avatar?: string;
  hotelName: string;
  hotelId?: string;
  status?: 'Active' | 'Invited' | 'Suspended';
  lastLogin?: string;
  mfaEnabled?: boolean;
}

export type PageState = 'LANDING' | 'PRICING' | 'LOGIN' | 'APP' | 'SUPER_ADMIN';

// New Types for Expanded Modules

export interface Booking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  channel: string; // 'Booking.com', 'Agoda', 'Direct', etc.
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'CheckedIn';
  amount: number;
  bookedOn: string;
}

export interface Channel {
  id: string;
  name: string;
  logo: string; // emoji or url
  status: 'Connected' | 'Error' | 'Pending';
  lastSync: string;
  commission: number;
}

export interface RoomType {
  id: string;
  name: string;
  inventory: number;
  basePrice: number;
}

export interface ActionItem {
  id: string;
  type: 'Rate' | 'Inventory' | 'Reservation' | 'System';
  message: string;
  priority: 'High' | 'Medium' | 'Low';
}

// Guest CRM Types
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  totalStays: number;
  totalSpend: number;
  lastStay: string;
  tags: string[]; // e.g., 'VIP', 'Corporate', 'Long Stay', 'Problematic'
  notes?: string;
  preferences?: string; // e.g. "High Floor", "Vegan"
}

// Housekeeping Types
export type RoomStatus = 'CLEAN' | 'DIRTY' | 'IN_PROGRESS' | 'INSPECT' | 'MAINTENANCE';
export type OccupancyStatus = 'VACANT' | 'OCCUPIED' | 'CHECK_OUT' | 'CHECK_IN';

export interface HousekeepingRoom {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  occupancy: OccupancyStatus;
  floor: number;
  assignedTo?: string;
  notes?: string;
  priority?: boolean;
}

// Super Admin Specific Types
export interface Tenant {
  id: string;
  hotelName: string;
  adminName: string;
  email: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  status: 'Active' | 'Trial' | 'Suspended';
  joinedDate: string;
  mrr: number;
  lastLogin: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'Monthly' | 'Yearly';
  features: string[];
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  ipAddress: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'SYNC' | 'SYSTEM';
  resource: string; // e.g., 'User', 'Plan', 'Rate'
  details: string; // Summary of change
  metadata?: Record<string, any>; // Full diff or JSON payload
  status: 'SUCCESS' | 'FAILURE';
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED' | 'REFUNDED';
  date: string;
  planName: string;
  paymentMethod: string; // 'Credit Card', 'Razorpay', 'Bank Transfer'
}

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  defaultCurrency: string;
  minPasswordLength: number;
  sessionTimeout: number; // in minutes
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  razorpayKeyId?: string;
  geminiApiKey?: string;
}

export interface PlatformAnalyticsData {
  mrrHistory: { month: string; amount: number }[];
  userGrowth: { month: string; users: number; tenants: number }[];
  churnRate: number;
  churnTrend: number; // percentage change
  apiUsage: { tenantName: string; requests: number; errorRate: number }[];
  featureUsage: { feature: string; count: number; percentage: number }[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  isSystem?: boolean; // Cannot be deleted
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string; // e.g. "sk_live_..."
  scopes: ('READ' | 'WRITE' | 'ADMIN')[];
  lastUsed: string;
  created: string;
  status: 'Active' | 'Revoked';
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'Active' | 'Failed' | 'Disabled';
  failureCount: number;
  lastTriggered: string;
  secret: string;
}
