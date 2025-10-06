import { getSupabaseClient } from './supabaseClient';
import type { Transaction, Budget, Category, UserSettings } from './types';

export const SETUP_SQL = `-- Run this once in your Supabase SQL Editor (project-specific)
-- Tables
create table if not exists app_settings (
  app_user_id text primary key,
  currency text not null default 'USD',
  language text not null default 'en'
);

create table if not exists categories (
  id text primary key,
  app_user_id text not null,
  name text not null,
  color text not null,
  icon text,
  type text not null check (type in ('income','expense'))
);

create table if not exists transactions (
  id text primary key,
  app_user_id text not null,
  amount numeric not null,
  description text not null,
  date timestamptz not null,
  category text not null,
  type text not null check (type in ('income','expense')),
  notes text,
  tags text[]
);

create table if not exists budgets (
  id text primary key,
  app_user_id text not null,
  "categoryId" text not null,
  amount numeric not null,
  period text not null check (period in ('monthly','weekly','yearly'))
);

-- Enable RLS and allow anon access (safe if this is YOUR private project)
alter table app_settings enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;

create policy if not exists anon_all_app_settings on app_settings for all using (true) with check (true);
create policy if not exists anon_all_categories on categories for all using (true) with check (true);
create policy if not exists anon_all_transactions on transactions for all using (true) with check (true);
create policy if not exists anon_all_budgets on budgets for all using (true) with check (true);
`;

function ensureClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  return client;
}

export async function testConnection() {
  const supabase = ensureClient();
  // Try a lightweight select to verify API works. If table doesn't exist, this will error.
  const { error } = await supabase.from('app_settings').select('app_user_id').limit(1);
  return { ok: !error, error };
}

export async function verifyTablesExist(): Promise<{ ok: boolean; missingTables: string[] }> {
  const supabase = ensureClient();
  const requiredTables = ['app_settings', 'categories', 'transactions', 'budgets'];
  const missingTables: string[] = [];

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        missingTables.push(table);
      }
    } catch (e) {
      missingTables.push(table);
    }
  }

  return {
    ok: missingTables.length === 0,
    missingTables
  };
}

export async function syncSettings(appUserId: string, settings: UserSettings) {
  const supabase = ensureClient();
  const payload = { app_user_id: appUserId, currency: settings.currency, language: settings.language };
  await supabase.from('app_settings').upsert(payload, { onConflict: 'app_user_id' });
}

export async function syncCategories(appUserId: string, categories: Category[]) {
  const supabase = ensureClient();
  const rows = categories.map(c => ({ ...c, app_user_id: appUserId }));
  if (rows.length === 0) return;
  await supabase.from('categories').upsert(rows, { onConflict: 'id' });
}

export async function syncBudgets(appUserId: string, budgets: Budget[]) {
  const supabase = ensureClient();
  const rows = budgets.map(b => ({ ...b, app_user_id: appUserId }));
  if (rows.length === 0) return;
  await supabase.from('budgets').upsert(rows, { onConflict: 'id' });
}

export async function syncTransactions(appUserId: string, transactions: Transaction[]) {
  const supabase = ensureClient();
  const rows = transactions.map(t => ({ ...t, app_user_id: appUserId }));
  if (rows.length === 0) return;
  await supabase.from('transactions').upsert(rows, { onConflict: 'id' });
}

export async function pullAll(appUserId: string) {
  const supabase = ensureClient();
  const [settings, categories, budgets, transactions] = await Promise.all([
    supabase.from('app_settings').select('*').eq('app_user_id', appUserId).maybeSingle(),
    supabase.from('categories').select('*').eq('app_user_id', appUserId),
    supabase.from('budgets').select('*').eq('app_user_id', appUserId),
    supabase.from('transactions').select('*').eq('app_user_id', appUserId),
  ]);
  return {
    settings: settings.data,
    categories: categories.data ?? [],
    budgets: budgets.data ?? [],
    transactions: transactions.data ?? [],
  };
}
