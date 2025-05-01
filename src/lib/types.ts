
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO date string
  category: string;
  type: 'income' | 'expense';
  notes?: string;
  tags?: string[];
  currency?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  currency?: string;
}

export interface UserSettings {
  currency: string;
  language: string;
  storageType: 'local' | 'supabase';
}
