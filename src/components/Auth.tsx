import React, { useEffect } from 'react';
import { Wallet, X, LogIn } from 'lucide-react';

interface AuthProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function Auth({ onClose, onSuccess }: AuthProps) {
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/api/auth/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'google_oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose, onSuccess]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/50 hover:text-white p-2 transition-colors"
          >
            <X size={24} />
          </button>
        )}
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-900/20">
            <Wallet size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ExpenseCoin</h1>
          <p className="text-gray-400 mt-2">Master your finances with Google Sheets</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            Continue with Google
          </button>
          
          <div className="mt-6 flex items-center gap-4 text-gray-500 text-xs">
            <div className="h-px flex-1 bg-white/5"></div>
            <span>SECURE OAUTH 2.0</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          
          <p className="text-gray-400 text-sm text-center mt-6 leading-relaxed">
            We use Google Sheets as your personal database. Your data stays in your account, and we only access the files we create.
          </p>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
