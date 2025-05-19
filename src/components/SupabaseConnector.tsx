
import React from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Database, LogIn } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

export function SupabaseConnector() {
  const { isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();

  const handleConnection = () => {
    if (!isSupabaseConnected) {
      // Simulate connection to Supabase
      connectToSupabase();
    } else {
      disconnectFromSupabase();
    }
  };

  return (
    <div className="rounded-lg bg-sidebar-accent p-4 shadow-md">
      <p className="text-sm mb-2 font-medium text-white">
        {isSupabaseConnected ? 'Connected to Supabase' : 'Connect to Supabase'}
      </p>
      {isSupabaseConnected ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white text-sidebar-background border-white hover:bg-sidebar-accent hover:text-white hover:border-white transition-colors"
          onClick={disconnectFromSupabase}
        >
          <Database className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white text-sidebar-background border-white hover:bg-sidebar-accent hover:text-white hover:border-white transition-colors"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Connect
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Connect to Supabase</SheetTitle>
              <SheetDescription>
                Connect to Supabase to enable cloud storage and synchronization across devices.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">ExpenseCoin & Supabase</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data will be synchronized between your browser and Supabase.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  When connected, your data will be:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Stored both locally and in Supabase</li>
                  <li>Available across multiple devices</li>
                  <li>Securely backed up in the cloud</li>
                </ul>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleConnection}>Connect to Supabase</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
