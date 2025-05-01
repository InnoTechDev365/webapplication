
import React from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

export function SupabaseConnector() {
  const { isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();

  return (
    <div className="rounded-lg bg-white/10 p-4 text-white text-center">
      <p className="text-sm mb-2">
        {isSupabaseConnected ? 'Connected to Supabase' : 'Connect your Supabase'}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-full text-white border-white hover:bg-white hover:text-sidebar-background"
        onClick={isSupabaseConnected ? disconnectFromSupabase : connectToSupabase}
      >
        <Database className="mr-2 h-4 w-4" />
        {isSupabaseConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
}
