
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
import { Database, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { reloadPage } from '@/lib/browserUtils';

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
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!url.trim()) {
      setConnectionError('Supabase URL is required');
      return false;
    }
    if (!anonKey.trim()) {
      setConnectionError('Anon key is required');
      return false;
    }
    if (!url.includes('supabase.co') && !url.includes('localhost')) {
      setConnectionError('Please enter a valid Supabase URL (e.g., https://your-project.supabase.co)');
      return false;
    }
    if (anonKey.length < 50) {
      setConnectionError('Anon key appears to be invalid (too short)');
      return false;
    }
    setConnectionError(null);
    return true;
  };

  const handleConnect = async () => {
    if (!validateInputs()) return;

    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      await onConnect(url.trim(), anonKey.trim());
      setIsConnected(true);

      setTimeout(() => {
        onOpenChange(false);
        resetDialog();
        // Optional: refresh page to ensure clean state
        setTimeout(() => reloadPage(), 100);
      }, 1500);
    } catch (error: any) {
      setConnectionError(error.message || 'Connection failed');
      setIsConnecting(false);
    }
  };

  const resetDialog = () => {
    setUrl('');
    setAnonKey('');
    setIsConnecting(false);
    setIsConnected(false);
    setConnectionError(null);
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
            
            {connectionError && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800 font-medium">
                    {connectionError}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
              <div className="text-sm text-blue-800 space-y-1">
                <div className="font-medium flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  How to find your Supabase credentials:
                </div>
                <div>• Go to your Supabase project dashboard</div>
                <div>• Navigate to Settings → API</div>
                <div>• Copy the Project URL and anon/public key</div>
                <div className="pt-1">
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline text-xs"
                  >
                    Open Supabase Dashboard <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <div className="text-sm text-green-800 space-y-1">
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
