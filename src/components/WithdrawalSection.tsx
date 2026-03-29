import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Smartphone, ShieldCheck, History, RefreshCcw, Landmark, PhoneOutgoing } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ScheduledWithdrawal } from '@/types';
import { cn } from '@/lib/utils';

interface WithdrawalSectionProps {
  balance: number;
  onWithdraw: (withdrawal: ScheduledWithdrawal) => void;
  onRevertFunds: (amount: number, method: 'mobile' | 'bank') => void;
  linkedMobile?: string;
  linkedBank?: string;
  history: ScheduledWithdrawal[];
}

export const WithdrawalSection: React.FC<WithdrawalSectionProps> = ({ 
  balance, 
  onWithdraw, 
  onRevertFunds,
  linkedMobile = "+254 712 345 678",
  linkedBank = "**** 5678 (KCB BANK)",
  history 
}) => {
  const [revertAmount, setRevertAmount] = useState<string>('');
  const [method, setMethod] = useState<'mobile' | 'bank'>('mobile');
  const [showRevertForm, setShowRevertForm] = useState(false);
  const [pin, setPin] = useState('');

  const handleRevert = () => {
    if (!revertAmount || Number(revertAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (Number(revertAmount) > balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (pin.length < 4) {
      toast.error("Please enter your 4-digit PIN");
      return;
    }

    onRevertFunds(Number(revertAmount), method);
    toast.success(`Successfully initiated reversion of $${revertAmount} to your ${method === 'mobile' ? 'Mobile Money' : 'Bank Account'}`);
    setRevertAmount('');
    setPin('');
    setShowRevertForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-3xl font-black text-foreground tracking-tight">Fund Management</h2>
        <p className="text-sm text-muted-foreground">Revert balance to source or view history.</p>
      </div>

      <Card className="border-none shadow-2xl bg-primary text-primary-foreground rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Available Balance</p>
            <Wallet className="h-5 w-5 opacity-70" />
          </div>
          <div className="text-4xl font-black tracking-tight mt-1">${balance.toFixed(2)}</div>
        </CardHeader>
        <CardContent className="relative z-10 pt-4 pb-8">
          <Button 
            onClick={() => setShowRevertForm(true)}
            className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl text-lg font-black shadow-xl shadow-black/10 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <RefreshCcw className="h-5 w-5" />
            Revert to Source
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showRevertForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-border bg-card rounded-[2rem] p-6 space-y-6 shadow-xl">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Select Reversion Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMethod('mobile')}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                      method === 'mobile' ? "border-primary bg-primary/5 text-primary" : "border-border bg-accent/30 text-muted-foreground hover:bg-accent/50"
                    )}
                  >
                    <PhoneOutgoing className="h-6 w-6" />
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase">Mobile Money</p>
                      <p className="text-[9px] opacity-70">{linkedMobile}</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setMethod('bank')}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                      method === 'bank' ? "border-primary bg-primary/5 text-primary" : "border-border bg-accent/30 text-muted-foreground hover:bg-accent/50"
                    )}
                  >
                    <Landmark className="h-6 w-6" />
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase">Bank Account</p>
                      <p className="text-[9px] opacity-70">{linkedBank}</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Amount to Revert</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full h-14 pl-10 pr-4 rounded-2xl bg-accent/30 border-none focus:ring-2 focus:ring-primary text-xl font-black"
                      value={revertAmount}
                      onChange={(e) => setRevertAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Confirm PIN</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="password" 
                      maxLength={4}
                      placeholder="****"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-accent/30 border-none focus:ring-2 focus:ring-primary text-xl font-black tracking-[1em]"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-14 rounded-2xl font-bold" 
                  onClick={() => setShowRevertForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 h-14 rounded-2xl font-black shadow-lg shadow-primary/20"
                  onClick={handleRevert}
                >
                  Initiate Revert
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-xl tracking-tight">Recent History</h3>
          <History className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 bg-accent/10 border-2 border-dashed border-border rounded-[2rem] text-muted-foreground">
              <p className="text-xs font-bold uppercase tracking-widest">No transactions found</p>
            </div>
          ) : (
            history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{tx.planId ? 'Plan Withdrawal' : 'Reversion'}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm">-${tx.amount.toFixed(2)}</p>
                  <p className="text-[9px] font-black uppercase text-primary tracking-widest">{tx.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import { Download } from 'lucide-react';