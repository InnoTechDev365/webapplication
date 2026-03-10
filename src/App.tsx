import React, { useState, useEffect } from 'react';
import { useFinanceData } from './hooks/useFinanceData';
import { getFinancialAdvice } from './lib/gemini';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Goals from './components/Goals';
import { Toaster } from 'react-hot-toast';
import { Sparkles, X, Loader2, Wallet } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAdvice, setShowAdvice] = useState(false);
  const [advice, setAdvice] = useState<string[]>([]);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { 
    transactions, 
    budgets, 
    goals, 
    loading: dataLoading,
    addTransaction,
    deleteTransaction,
    addBudget,
    addGoal
  } = useFinanceData(session?.user?.id);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const user = await response.json();
          setSession({ user });
        } else {
          setSession(null);
        }
      } catch (error) {
        setSession(null);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleGetAdvice = async () => {
    setShowAdvice(true);
    setAdviceLoading(true);
    try {
      const recommendations = await getFinancialAdvice(transactions, budgets, goals);
      setAdvice(recommendations);
    } catch (error) {
      console.error(error);
    } finally {
      setAdviceLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30">
        <Toaster position="top-right" />
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 px-8 py-6 flex items-center justify-between bg-black/50 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Wallet size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">ExpenseCoin</span>
          </div>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </nav>

        {/* Hero Section */}
        <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold">
                <Sparkles size={16} />
                AI-Powered Personal Finance
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Master your money with <span className="text-emerald-500">precision.</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                ExpenseCoin helps you track every penny, set smart budgets, and reach your financial goals with AI-driven insights.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
                >
                  Get Started for Free
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all">
                  View Demo
                </button>
              </div>
              <div className="flex items-center gap-8 pt-8 border-t border-white/5">
                <div>
                  <p className="text-3xl font-bold">10k+</p>
                  <p className="text-gray-500 text-sm">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">$2M+</p>
                  <p className="text-gray-500 text-sm">Tracked Daily</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">4.9/5</p>
                  <p className="text-gray-500 text-sm">User Rating</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#141414] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-white/5 rounded-full"></div>
                    <div className="h-8 w-8 bg-emerald-500/20 rounded-lg"></div>
                  </div>
                  <div className="h-32 w-full bg-white/5 rounded-3xl"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-3xl"></div>
                    <div className="h-24 bg-white/5 rounded-3xl"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-white/5 rounded-full"></div>
                    <div className="h-4 w-2/3 bg-white/5 rounded-full"></div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-3xl rounded-full"></div>
              </div>
            </div>
          </div>
        </main>

        {showAuthModal && (
          <Auth 
            onClose={() => setShowAuthModal(false)} 
            onSuccess={async () => {
              const response = await fetch('/api/user');
              if (response.ok) {
                const user = await response.json();
                setSession({ user });
              }
            }}
          />
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            transactions={transactions} 
            budgets={budgets} 
            onAdviceClick={handleGetAdvice}
          />
        );
      case 'transactions':
        return (
          <Transactions 
            transactions={transactions} 
            onAdd={addTransaction} 
            onDelete={deleteTransaction} 
          />
        );
      case 'budgets':
        return (
          <Budgets 
            budgets={budgets} 
            transactions={transactions} 
            onAdd={addBudget} 
          />
        );
      case 'goals':
        return (
          <Goals 
            goals={goals} 
            onAdd={addGoal} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      userEmail={session.user.email}
    >
      <Toaster position="top-right" />
      
      {dataLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
      ) : (
        renderContent()
      )}

      {/* AI Advice Modal */}
      {showAdvice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-400" />
                <h3 className="text-xl font-bold">Smart Financial Advice</h3>
              </div>
              <button onClick={() => setShowAdvice(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {adviceLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="animate-spin text-emerald-600" size={40} />
                  <p className="text-gray-500 font-medium animate-pulse">Analyzing your financial habits...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {advice.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-emerald-900 font-medium leading-relaxed">{item}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAdvice(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl mt-4 transition-all active:scale-[0.98]"
                  >
                    Got it, thanks!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
