import { DailyData, Competitor, Booking, User } from '../types';

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

  // --- Auth ---
  login: async (email: string, password: string): Promise<User> => {
      const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });
      if(!res.ok) throw new Error("Login failed");
      return await res.json();
  }
};
