import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Users, 
  Bell,
  Settings,
  ShieldCheck,
  Wallet,
  Smartphone,
  ArrowUpRight,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { UserState, PlanDay } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface DashboardProps {
  userState: UserState;
  onWithdrawPlan: (planId: string, agentNumber: string, pin: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userState, onWithdrawPlan }) => {
  const totalPlanned = userState.plans.reduce((acc, curr) => curr.status === 'active' ? acc + curr.amount : acc, 0);
  const activePlans = userState.plans.filter(p => p.status === 'active').sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextPlan = activePlans[0];

  const [withdrawingPlan, setWithdrawingPlan] = useState<PlanDay | null>(null);
  const [agentNumber, setAgentNumber] = useState('');
  const [pin, setPin] = useState('');

  const handleConfirmWithdraw = () => {
    if (!agentNumber || pin.length < 4) {
      toast.error("Valid Agent ID and 4-digit PIN required");
      return;
    }
    if (withdrawingPlan) {
      onWithdrawPlan(withdrawingPlan.id, agentNumber, pin);
      setWithdrawingPlan(null);
      setAgentNumber('');
      setPin('');
      toast.success("Withdrawal successful");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-[1.75rem] flex items-center justify-center border-2 border-primary/20 shadow-inner overflow-hidden">
             <img 
               src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/4c1c7fe6-6af0-4066-8fb6-9083007a6e4b/app-logo-76381490-1774763923129.webp" 
               alt="M-PLANA" 
               className="w-full h-full object-cover p-1"
             />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">M-PLANA</h1>
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mt-1.5 opacity-80">Beat the odds</p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button className="p-3.5 rounded-2xl bg-card border border-border shadow-sm relative group hover:bg-accent transition-all duration-300">
            <Bell className="h-5.5 w-5.5 text-foreground/70 group-hover:text-primary" />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
          </button>
          <button className="p-3.5 rounded-2xl bg-card border border-border shadow-sm group hover:bg-accent transition-all duration-300">
            <Settings className="h-5.5 w-5.5 text-foreground/70 group-hover:text-primary" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[3rem] bg-primary p-10 text-primary-foreground shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.25)]"
        style={{ '--primary-rgb': '141, 110, 99' } as any}
      >
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-52 h-52 bg-white/10 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-52 h-52 bg-black/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <p className="text-primary-foreground/70 font-black text-[11px] uppercase tracking-[0.25em] flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Personal Treasury
            </p>
            <RefreshCw className="h-5 w-5 opacity-40 animate-spin-slow" />
          </div>
          
          <h2 className="text-6xl font-black mb-12 tracking-tighter">{formatCurrency(userState.balance)}</h2>
          
          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="bg-white/10 px-6 py-4 rounded-[2rem] backdrop-blur-xl border border-white/20">
              <p className="text-primary-foreground/60 text-[10px] uppercase font-black tracking-widest mb-1.5">Active Plans</p>
              <p className="font-black text-2xl">{formatCurrency(totalPlanned)}</p>
            </div>
            <div>
              <p className="text-primary-foreground/60 text-[10px] uppercase font-black tracking-widest mb-1.5">Next Payout</p>
              <p className="font-black text-2xl">{nextPlan ? formatCurrency(nextPlan.amount) : '$0.00'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Plans Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="font-black text-foreground text-2xl tracking-tight">Upcoming Withdrawals</h3>
          <button className="text-primary text-[10px] font-black bg-primary/10 px-5 py-2.5 rounded-2xl uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10">Timeline</button>
        </div>

        <div className="space-y-4">
          {activePlans.length === 0 ? (
            <div className="text-center py-20 bg-card border-2 border-dashed rounded-[3rem] border-border shadow-inner">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                 <CalendarIcon className="h-10 w-10 text-primary/40" />
              </div>
              <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.2em]">No active plans</p>
              <p className="text-[10px] text-muted-foreground/60 mt-2 font-bold">Secure your future by planning today</p>
            </div>
          ) : (
            activePlans.slice(0, 5).map((plan, i) => (
              <motion.div 
                key={plan.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex items-center justify-between p-6 bg-card rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-700 shadow-inner group-hover:rotate-6">
                    <CalendarIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-foreground">{format(plan.date, 'MMM dd, yyyy')}</p>
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.15em] mt-1">M-PLANA Reserve</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <p className="font-black text-2xl text-foreground tracking-tight">{formatCurrency(plan.amount)}</p>
                  <Button 
                    onClick={() => setWithdrawingPlan(plan)}
                    className="h-9 px-6 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    Withdraw
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-5">
        <Card className="border-none bg-accent/30 shadow-none rounded-[2.5rem] p-2 overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center shadow-sm">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Market Rate</p>
              <p className="text-xl font-black text-foreground">+12.8%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-accent/30 shadow-none rounded-[2.5rem] p-2 overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Security</p>
              <p className="text-xl font-black text-foreground uppercase">Verified</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {withdrawingPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
            onClick={() => setWithdrawingPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-card rounded-[3rem] border border-border p-10 shadow-2xl space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 text-primary">
                  <Wallet className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Withdraw Plan</h3>
                <p className="text-sm text-muted-foreground px-4">
                  You are withdrawing <span className="font-black text-foreground">{formatCurrency(withdrawingPlan.amount)}</span> for the plan on {format(withdrawingPlan.date, 'MMMM dd')}
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Agent Identity</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Enter Agent ID"
                      className="h-14 pl-12 rounded-2xl bg-accent/40 border-none focus:ring-2 focus:ring-primary text-lg font-bold"
                      value={agentNumber}
                      onChange={(e) => setAgentNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Secure PIN</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="password"
                      maxLength={4}
                      placeholder="****"
                      className="h-14 pl-12 rounded-2xl bg-accent/40 border-none focus:ring-2 focus:ring-primary text-2xl font-black tracking-[1em]"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest opacity-60"
                  onClick={() => setWithdrawingPlan(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                  onClick={handleConfirmWithdraw}
                >
                  Confirm
                </Button>
              </div>
              
              <div className="flex items-center gap-2 justify-center py-2 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Secure Transaction</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};