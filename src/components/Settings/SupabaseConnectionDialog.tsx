
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Database, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SupabaseConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (url: string, anonKey: string) => Promise<void> | void;
}

export const SupabaseConnectionDialog = ({ open, onOpenChange, onConnect }: SupabaseConnectionDialogProps) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    if (!url || !anonKey) {
      toast.error('Please enter your Supabase URL and anon key');
      return;
    }

    setIsConnecting(true);
    
    try {
      await onConnect(url, anonKey);
      setIsConnected(true);
      toast.success('Successfully connected to Supabase!');

      setTimeout(() => {
        onOpenChange(false);
        resetDialog();
      }, 800);
    } catch (error) {
      toast.error('Failed to connect to Supabase');
      setIsConnecting(false);
    }
  };

  const resetDialog = () => {
    setUrl('');
    setAnonKey('');
    setIsConnecting(false);
    setIsConnected(false);
  };

  const handleClose = () => {
    if (!isConnecting) {
      onOpenChange(false);
      resetDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connect your Supabase (BYO)
          </DialogTitle>
          <DialogDescription>
            Paste your Supabase project URL and anon key. Your data will be saved locally and mirrored to your Supabase.
          </DialogDescription>
        </DialogHeader>
        
        {isConnected ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">Connection Successful!</h3>
              <p className="text-sm text-muted-foreground">Your data is now synced with Supabase</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Supabase URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isConnecting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anon">Anon Key</Label>
              <Input
                id="anon"
                type="password"
                placeholder="Paste anon public key"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                disabled={isConnecting}
              />
            </div>
            
            <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
              <div className="text-sm text-blue-800 space-y-1">
                <div className="font-medium">What happens when you connect:</div>
                <div>• Your existing local data will be uploaded to your Supabase</div>
                <div>• Future data saves locally and syncs to your Supabase</div>
                <div>• Disconnect any time to stay local-only</div>
              </div>
            </div>
            
            <Button 
              onClick={handleConnect} 
              className="w-full"
              disabled={!url || !anonKey || isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
