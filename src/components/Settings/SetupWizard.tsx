import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Database, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy,
  ChevronRight,
  ChevronLeft,
  Cloud,
  HardDrive,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { writeToClipboard } from '@/lib/browserUtils';
import { SETUP_SQL } from '@/lib/remoteSync';
import { syncManager } from '@/lib/syncManager';

interface SetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

type Step = 'welcome' | 'choose-storage' | 'supabase-setup' | 'credentials' | 'complete';

export const SetupWizard = ({ open, onOpenChange, onComplete }: SetupWizardProps) => {
  const [step, setStep] = useState<Step>('welcome');
  const [storageChoice, setStorageChoice] = useState<'local' | 'supabase'>('local');
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  const handleCopySQL = async () => {
    const success = await writeToClipboard(SETUP_SQL);
    if (success) {
      setSqlCopied(true);
      toast.success('Setup SQL copied to clipboard!');
    } else {
      toast.error('Failed to copy. Check console for SQL.');
      console.info('[Supabase Setup SQL]\n', SETUP_SQL);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    const result = await syncManager.connect(url, anonKey);

    setIsConnecting(false);

    if (result.success) {
      setStep('complete');
    } else {
      setError(result.error || 'Connection failed');
    }
  };

  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
    resetWizard();
    
    // Reload to apply changes
    setTimeout(() => window.location.reload(), 500);
  };

  const resetWizard = () => {
    setStep('welcome');
    setStorageChoice('local');
    setUrl('');
    setAnonKey('');
    setError(null);
    setSqlCopied(false);
  };

  const handleLocalOnly = () => {
    setStorageChoice('local');
    setStep('complete');
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to Finance Tracker</h3>
              <p className="text-muted-foreground text-sm">
                Let's set up your data storage in just a few steps.
              </p>
            </div>

            <div className="grid gap-4">
              <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => { setStorageChoice('local'); setStep('choose-storage'); }}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <HardDrive className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Quick Start (Local Only)</h4>
                    <p className="text-sm text-muted-foreground">
                      Store data in your browser. No setup needed.
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => { setStorageChoice('supabase'); setStep('choose-storage'); }}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Cloud className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Cloud Sync (Supabase)</h4>
                    <p className="text-sm text-muted-foreground">
                      Sync across devices with your own database.
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'choose-storage':
        return (
          <div className="space-y-6 py-4">
            {storageChoice === 'local' ? (
              <>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <HardDrive className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Local Storage</h3>
                  <p className="text-muted-foreground text-sm">
                    Your data will be stored securely in your browser.
                  </p>
                </div>

                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Keep in mind:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Data is stored only in this browser</li>
                          <li>Clearing browser data will erase your records</li>
                          <li>You can add cloud sync later in Settings</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('welcome')} className="flex-1">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleLocalOnly} className="flex-1">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Cloud className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cloud Sync with Supabase</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect to your own free Supabase database.
                  </p>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Benefits:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Access data from any device</li>
                        <li>Automatic backup to the cloud</li>
                        <li>You own and control your data</li>
                        <li>Free tier available from Supabase</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('welcome')} className="flex-1">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => setStep('supabase-setup')} className="flex-1">
                    Set Up Supabase
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        );

      case 'supabase-setup':
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Step 1: Create Database Tables</h3>
              <p className="text-muted-foreground text-sm">
                Run this SQL in your Supabase project to create the required tables.
              </p>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Setup Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside text-sm space-y-3">
                  <li>
                    <span className="text-muted-foreground">Go to </span>
                    <a 
                      href="https://supabase.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Supabase Dashboard <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Create a new project (or use existing)</span>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Go to </span>
                    <strong>SQL Editor</strong>
                    <span className="text-muted-foreground"> in the sidebar</span>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Click </span>
                    <strong>"New query"</strong>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Paste the SQL below and click </span>
                    <strong>"Run"</strong>
                  </li>
                </ol>

                <Button 
                  onClick={handleCopySQL} 
                  className="w-full"
                  variant={sqlCopied ? "secondary" : "default"}
                >
                  {sqlCopied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      SQL Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Setup SQL
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('choose-storage')} className="flex-1">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setStep('credentials')} className="flex-1">
                I've Run the SQL
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'credentials':
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Step 2: Enter Credentials</h3>
              <p className="text-muted-foreground text-sm">
                Find these in your Supabase project under Settings → API
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Project URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isConnecting}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anon">Anon (Public) Key</Label>
                <Input
                  id="anon"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  disabled={isConnecting}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Found under "Project API keys" → "anon public"
                </p>
              </div>

              {error && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-red-800">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('supabase-setup')} disabled={isConnecting} className="flex-1">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleConnect} 
                disabled={!url || !anonKey || isConnecting}
                className="flex-1"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
              <p className="text-muted-foreground text-sm">
                {storageChoice === 'supabase' 
                  ? 'Your data will now sync across all your devices.'
                  : 'Your data is being stored locally in this browser.'}
              </p>
            </div>

            <Card className="bg-muted">
              <CardContent className="p-4 text-center">
                <p className="text-sm">
                  {storageChoice === 'supabase' 
                    ? '✓ Connected to Supabase • ✓ Data synced'
                    : '✓ Local storage active • You can add cloud sync anytime'}
                </p>
              </CardContent>
            </Card>

            <Button onClick={handleComplete} className="w-full">
              Start Using App
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isConnecting) {
        onOpenChange(newOpen);
        if (!newOpen) resetWizard();
      }
    }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Setup
          </DialogTitle>
          <DialogDescription>
            Choose how you want to store your financial data.
          </DialogDescription>
        </DialogHeader>
        
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};
