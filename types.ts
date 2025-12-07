
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
  RMS = 'RMS',
  BOOKING_ENGINE = 'BOOKING_ENGINE',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS'
}

export type RMSView = 'SUGGESTIONS' | 'COMPETITORS' | 'ANALYTICS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  hotelName: string;
}

export type PageState = 'LANDING' | 'PRICING' | 'LOGIN' | 'APP';

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
