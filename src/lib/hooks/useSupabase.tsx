
import { useState, useEffect } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';
import { setSupabaseCredentials, clearSupabaseCredentials, getSupabaseClient } from '../supabaseClient';
import { SETUP_SQL } from '../remoteSync';
import { writeToClipboard } from '../browserUtils';

export const useSupabase = () => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(
    storageManager.isConnectedToSupabase()
  );
  
  useEffect(() => {
    setIsSupabaseConnected(storageManager.isConnectedToSupabase());
  }, []);
  
  const connectToSupabase = async (url: string, anonKey: string) => {
    try {
      // Validate credentials format
      if (!url.includes('supabase.co') && !url.includes('localhost')) {
        throw new Error('Invalid Supabase URL format');
      }
      
      if (!anonKey || anonKey.length < 50) {
        throw new Error('Invalid anon key format');
      }

      // Save credentials first
      setSupabaseCredentials(url, anonKey);

      // Test the connection
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Failed to create Supabase client');
      }

      // Verify all required tables exist
      const { verifyTablesExist } = await import('../remoteSync');
      const verification = await verifyTablesExist();
      
      if (!verification.ok) {
        const success = await writeToClipboard(SETUP_SQL);
        const missingTablesMsg = verification.missingTables.join(', ');
        
        clearSupabaseCredentials();
        
        if (success) {
          toast.error(`Cannot connect: Missing database tables (${missingTablesMsg}). Setup SQL copied to clipboard - run it in your Supabase SQL editor first.`, {
            duration: 10000
          });
        } else {
          toast.error(`Cannot connect: Missing database tables (${missingTablesMsg}). Check console for setup SQL.`, {
            duration: 10000
          });
          console.info('[Supabase Setup SQL - Copy and run this in your SQL Editor first]\n', SETUP_SQL);
        }
        throw new Error(`Missing required tables: ${missingTablesMsg}`);
      }

      // Tables exist - proceed with connection
      const userId = storageManager.getUserId();
      
      // Pull existing data from Supabase
      const { pullAll } = await import('../remoteSync');
      const remoteData = await pullAll(userId);
      
      // Get local data
      const localTransactions = storageManager.getTransactions();
      const localBudgets = storageManager.getBudgets();
      const localCategories = storageManager.getCategories();
      
      // Merge data (prefer remote data if both exist, keep local if remote is empty)
      const mergedTransactions = remoteData.transactions.length > 0 ? remoteData.transactions : localTransactions;
      const mergedBudgets = remoteData.budgets.length > 0 ? remoteData.budgets : localBudgets;
      const mergedCategories = remoteData.categories.length > 0 ? remoteData.categories : localCategories;
      
      // Connect storage manager
      storageManager.connectToSupabase(true);
      setIsSupabaseConnected(true);
      
      // Save merged data to both local and Supabase
      storageManager.saveTransactions(mergedTransactions);
      storageManager.saveBudgets(mergedBudgets);
      storageManager.saveCategories(mergedCategories);
      
      toast.success('Connected to Supabase! Data synced successfully.');
    } catch (e: any) {
      clearSupabaseCredentials();
      storageManager.connectToSupabase(false);
      setIsSupabaseConnected(false);
      
      const errorMessage = e.message || 'Unknown error';
      if (errorMessage.includes('Invalid')) {
        toast.error(`Connection failed: ${errorMessage}`);
      } else if (errorMessage.includes('Missing required tables')) {
        // Already showed detailed error above
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error('Network error: Check your internet connection and Supabase URL.');
      } else {
        toast.error('Failed to connect to Supabase. Verify your credentials and database setup.');
      }
      
      console.error('Supabase connection error:', e);
      throw e;
    }
  };

  const disconnectFromSupabase = async () => {
    storageManager.connectToSupabase(false);
    clearSupabaseCredentials();
    setIsSupabaseConnected(false);
    toast.success('Disconnected from Supabase');
  };

  return {
    isSupabaseConnected,
    connectToSupabase,
    disconnectFromSupabase
  };
};
