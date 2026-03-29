import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Dashboard } from './components/Dashboard';
import { PlannerCalendar } from './components/PlannerCalendar';
import { AgentNetwork } from './components/AgentNetwork';
import { DepositSection } from './components/DepositSection';
import { WithdrawalSection } from './components/WithdrawalSection';
import { DependantsSection } from './components/DependantsSection';
import { SentPlans } from './components/SentPlans';
import { ReceivedPlans } from './components/ReceivedPlans';
import { Navigation } from './components/Navigation';
import { PlanDay, UserState, ScheduledWithdrawal, SharedPlan, PlanStatus } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState<'brown' | 'dark'>('brown');
  
  const [userState, setUserState] = useState<UserState>({
    balance: 1250.00,
    plans: [
      { id: 'p1', date: new Date(), amount: 25.00, status: 'active' },
      { id: 'p2', date: new Date(Date.now() + 86400000), amount: 45.00, status: 'active' },
    ],
    withdrawals: [],
    dependants: [
      { id: '1', name: 'Sarah Wilson', contact: '+1234567890' },
      { id: '2', name: 'James Junior', contact: '+1987654321' },
    ],
    sentPlans: [],
    receivedPlans: [
      {
        id: 'rp1',
        senderName: 'Michael Brown',
        senderContact: '+254 700 111 222',
        receiverName: 'John Doe',
        receiverContact: '+254 712 345 678',
        amount: 50.00,
        date: new Date(Date.now() + 172800000),
        status: 'pending',
        type: 'received'
      }
    ],
    theme: 'brown',
    linkedMobileNumber: '+254 712 345 678',
    linkedBankAccount: '**** 5678 (KCB BANK)'
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'brown' ? 'dark' : 'brown');
  };

  const handlePlanChange = (newPlans: PlanDay[]) => {
    setUserState(prev => ({ ...prev, plans: newPlans }));
  };

  const handleWithdrawPlan = (planId: string, agentNumber: string, pin: string) => {
    const plan = userState.plans.find(p => p.id === planId);
    if (!plan) return;

    const newWithdrawal: ScheduledWithdrawal = {
      id: Math.random().toString(36).substr(2, 9),
      amount: plan.amount,
      date: new Date(),
      agentNumber,
      status: 'completed',
      planId: plan.id
    };

    setUserState(prev => ({
      ...prev,
      plans: prev.plans.map(p => p.id === planId ? { ...p, status: 'withdrawn' as PlanStatus } : p),
      balance: prev.balance - plan.amount,
      withdrawals: [newWithdrawal, ...prev.withdrawals]
    }));
  };

  const handleRevertFunds = (amount: number, method: 'mobile' | 'bank') => {
    const newWithdrawal: ScheduledWithdrawal = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      date: new Date(),
      agentNumber: method === 'mobile' ? userState.linkedMobileNumber : userState.linkedBankAccount,
      status: 'pending'
    };

    setUserState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      withdrawals: [newWithdrawal, ...prev.withdrawals]
    }));
  };

  const handleSendPlanToOthers = (contact: string, plans: PlanDay[]) => {
    const totalAmount = plans.reduce((acc, p) => acc + p.amount, 0);
    
    const newSentPlans: SharedPlan[] = plans.map(p => ({
      id: Math.random().toString(36).substr(2, 9),
      senderName: 'John Doe',
      senderContact: userState.linkedMobileNumber,
      receiverName: 'Recipient',
      receiverContact: contact,
      amount: p.amount,
      date: p.date,
      status: 'pending',
      type: 'sent'
    }));

    setUserState(prev => ({
      ...prev,
      balance: prev.balance - totalAmount,
      sentPlans: [...newSentPlans, ...prev.sentPlans]
    }));
  };

  const handleAcceptPlan = (id: string) => {
    const plan = userState.receivedPlans.find(p => p.id === id);
    if (!plan) return;

    const newPlan: PlanDay = {
      id: Math.random().toString(36).substr(2, 9),
      date: plan.date,
      amount: plan.amount,
      status: 'active'
    };

    setUserState(prev => ({
      ...prev,
      plans: [...prev.plans, newPlan],
      balance: prev.balance + plan.amount,
      receivedPlans: prev.receivedPlans.filter(p => p.id !== id)
    }));
    toast.success("Plan accepted and added to your calendar");
  };

  const handleDeclinePlan = (id: string) => {
    setUserState(prev => ({
      ...prev,
      receivedPlans: prev.receivedPlans.filter(p => p.id !== id)
    }));
    toast.info("Plan declined");
  };

  const handleDeposit = (amount: number) => {
    setUserState(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard userState={userState} onWithdrawPlan={handleWithdrawPlan} />;
      case 'planner':
        return <PlannerCalendar plans={userState.plans} onPlanChange={handlePlanChange} onWithdrawPlan={handleWithdrawPlan} />;
      case 'agents':
        return <AgentNetwork />;
      case 'deposit':
        return <DepositSection onDeposit={handleDeposit} />;
      case 'withdrawal':
        return <WithdrawalSection 
          balance={userState.balance} 
          onWithdraw={() => {}} 
          onRevertFunds={handleRevertFunds} 
          history={userState.withdrawals}
          linkedMobile={userState.linkedMobileNumber}
          linkedBank={userState.linkedBankAccount}
        />;
      case 'dependants':
        return <DependantsSection onSendPlan={handleSendPlanToOthers} />;
      case 'sent-plans':
        return <SentPlans plans={userState.sentPlans} />;
      case 'received-plans':
        return <ReceivedPlans plans={userState.receivedPlans} onAccept={handleAcceptPlan} onDecline={handleDeclinePlan} />;
      default:
        return <Dashboard userState={userState} onWithdrawPlan={handleWithdrawPlan} />;
    }
  };

  // Theme variable injections
  const brownVars = {
    '--background': 'oklch(0.98 0.01 60)',
    '--foreground': 'oklch(0.25 0.05 45)',
    '--card': 'oklch(1 0 0)',
    '--card-foreground': 'oklch(0.25 0.05 45)',
    '--primary': 'oklch(0.45 0.15 45)',
    '--primary-foreground': 'oklch(1 0 0)',
    '--accent': 'oklch(0.96 0.05 85)',
    '--border': 'oklch(0.9 0.01 60)',
    '--ring': 'oklch(0.45 0.15 45)',
  } as React.CSSProperties;

  const darkVars = {
    '--background': 'oklch(0.2 0.02 260)',
    '--foreground': 'oklch(0.95 0.01 260)',
    '--card': 'oklch(0.25 0.02 260)',
    '--card-foreground': 'oklch(0.95 0.01 260)',
    '--primary': 'oklch(0.9 0.01 260)',
    '--primary-foreground': 'oklch(0.15 0.02 260)',
    '--accent': 'oklch(0.3 0.02 260)',
    '--border': 'oklch(0.35 0.02 260)',
    '--ring': 'oklch(0.9 0.01 260)',
  } as React.CSSProperties;

  return (
    <div 
      className={`min-h-screen pb-32 transition-colors duration-300 ${theme === 'dark' ? 'dark bg-background text-foreground' : 'bg-background text-foreground'}`}
      style={theme === 'brown' ? brownVars : darkVars}
    >
      <main className="max-w-md mx-auto p-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
};

export default App;