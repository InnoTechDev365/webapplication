
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
  onConnect: () => void;
}

export const SupabaseConnectionDialog = ({ open, onOpenChange, onConnect }: SupabaseConnectionDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection process
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast.success('Successfully connected to Supabase!');
      
      // Wait a moment to show success state
      setTimeout(() => {
        onConnect();
        onOpenChange(false);
        resetDialog();
      }, 1500);
      
    } catch (error) {
      toast.error('Failed to connect to Supabase');
      setIsConnecting(false);
    }
  };

  const resetDialog = () => {
    setEmail('');
    setPassword('');
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
            Connect to Supabase
          </DialogTitle>
          <DialogDescription>
            Sign in to sync your data with Supabase. Your data will be stored both locally and in the cloud.
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isConnecting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isConnecting}
              />
            </div>
            
            <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
              <div className="text-sm text-blue-800 space-y-1">
                <div className="font-medium">What happens when you connect:</div>
                <div>• Your existing data will be uploaded to Supabase</div>
                <div>• Future data will be saved both locally and in Supabase</div>
                <div>• You can access your data from any device</div>
              </div>
            </div>
            
            <Button 
              onClick={handleConnect} 
              className="w-full"
              disabled={!email || !password || isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Connect to Supabase
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
