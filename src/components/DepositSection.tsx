import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Landmark, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DepositSectionProps {
  onDeposit: (amount: number) => void;
}

export const DepositSection: React.FC<DepositSectionProps> = ({ onDeposit }) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'card' | 'm-pesa' | 'bank'>('card');

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    onDeposit(numAmount);
    setAmount('');
    toast.success(`Successfully deposited $${numAmount.toFixed(2)}`);
  };

  const methods = [
    { id: 'card', icon: CreditCard, label: 'Credit Card', color: 'bg-primary' },
    { id: 'm-pesa', icon: Wallet, label: 'Mobile Money', color: 'bg-emerald-500' },
    { id: 'bank', icon: Landmark, label: 'Bank Transfer', color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border-2 border-primary/20 shadow-inner">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">Add Funds</h2>
        <p className="text-muted-foreground text-sm font-medium">Top up your planner balance securely</p>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-2xl">$</span>
          <Input 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-12 h-16 text-3xl font-black rounded-3xl border-2 border-border focus:border-primary transition-all bg-card shadow-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as any)}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all relative overflow-hidden",
                method === m.id ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/30"
              )}
            >
              {method === m.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                </div>
              )}
              <div className={cn("p-3 rounded-2xl text-white shadow-lg", m.color)}>
                <m.icon className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="py-2">
          <Button className="w-full h-16 text-xl font-black shadow-xl shadow-primary/20 rounded-[2rem]" onClick={handleDeposit}>
            Deposit Now <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest bg-accent/30 py-3 rounded-2xl border border-accent">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Encrypted Secure Transaction</span>
        </div>

        <Card className="bg-card border-dashed border-2 border-border rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Quick Select</h4>
              <div className="h-1 w-10 bg-primary/20 rounded-full" />
            </div>
            <div className="flex gap-3">
              {[10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="flex-1 py-3 bg-accent/50 border border-transparent rounded-2xl text-sm font-black text-foreground hover:border-primary hover:bg-primary/10 transition-all"
                >
                  +${val}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};