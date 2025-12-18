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
  const [isConnecting, setIsConnecting] = useState(false);
  
  useEffect(() => {
    setIsSupabaseConnected(storageManager.isConnectedToSupabase());
  }, []);
  
  const connectToSupabase = async (url: string, anonKey: string) => {
    setIsConnecting(true);
    
    try {
      // Validate and clean URL
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://${cleanUrl}`;
      }
      // Remove trailing slash
      cleanUrl = cleanUrl.replace(/\/$/, '');
      
      // Validate URL format
      if (!cleanUrl.includes('supabase.co') && !cleanUrl.includes('localhost')) {
        throw new Error('Invalid Supabase URL. It should look like: https://your-project.supabase.co');
      }
      
      // Validate anon key
      const cleanKey = anonKey.trim();
      if (!cleanKey || cleanKey.length < 50) {
        throw new Error('Invalid anon key. Make sure you copied the full key from Supabase.');
      }

      // Save credentials first
      setSupabaseCredentials(cleanUrl, cleanKey);

      // Test the connection
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Failed to create Supabase client. Check your credentials.');
      }

      // Verify all required tables exist with better error handling
      const { verifyTablesExist } = await import('../remoteSync');
      
      let verification;
      try {
        verification = await verifyTablesExist();
      } catch (e: any) {
        // Connection error
        clearSupabaseCredentials();
        if (e.message?.includes('FetchError') || e.message?.includes('fetch')) {
          throw new Error('Cannot reach Supabase. Check your URL and internet connection.');
        }
        throw new Error(`Connection failed: ${e.message || 'Unknown error'}`);
      }
      
      if (!verification.ok) {
        const success = await writeToClipboard(SETUP_SQL);
        const missingTablesMsg = verification.missingTables.join(', ');
        
        clearSupabaseCredentials();
        
        if (success) {
          toast.info('Setup SQL copied to clipboard! Run it in your Supabase SQL Editor first.', {
            duration: 10000
          });
        } else {
          console.info('[Supabase Setup SQL]\n', SETUP_SQL);
        }
        
        throw new Error(`Missing database tables: ${missingTablesMsg}. Please run the setup SQL first.`);
      }

      // Tables exist - proceed with connection
      const userId = storageManager.getUserId();
      
      // Pull existing data from Supabase
      const { pullAll } = await import('../remoteSync');
      let remoteData;
      try {
        remoteData = await pullAll(userId);
      } catch (e) {
        console.warn('Could not pull remote data, will use local:', e);
        remoteData = { transactions: [], budgets: [], categories: [] };
      }
      
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
      
      toast.success('Connected to Supabase! Your data is now synced.');
    } catch (e: any) {
      clearSupabaseCredentials();
      storageManager.connectToSupabase(false);
      setIsSupabaseConnected(false);
      
      const errorMessage = e.message || 'Unknown error';
      
      // Don't show duplicate toast - error will be displayed by the dialog
      console.error('Supabase connection error:', e);
      throw new Error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromSupabase = async () => {
    storageManager.connectToSupabase(false);
    clearSupabaseCredentials();
    setIsSupabaseConnected(false);
    toast.success('Disconnected from Supabase. Your data remains stored locally.');
  };

  return {
    isSupabaseConnected,
    isConnecting,
    connectToSupabase,
    disconnectFromSupabase
  };
};
