import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SharedPlan } from '@/types';
import { format } from 'date-fns';
import { User, Phone, DollarSign, Calendar, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SentPlansProps {
  plans: SharedPlan[];
}

export const SentPlans: React.FC<SentPlansProps> = ({ plans }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-foreground tracking-tight">Sent Plans</h2>
        <p className="text-sm text-muted-foreground">Track funds you've planned for others.</p>
      </div>

      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-20 bg-accent/30 border-2 border-dashed border-border rounded-[2.5rem]">
            <div className="w-16 h-16 bg-card rounded-3xl flex items-center justify-center mx-auto mb-4 border border-border">
              <ArrowUpRight className="h-8 w-8 text-primary/30" />
            </div>
            <p className="font-black text-xs text-muted-foreground uppercase tracking-widest">No sent plans found</p>
          </div>
        ) : (
          plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{plan.receiverName}</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{plan.receiverContact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        plan.status === 'pending' ? "bg-amber-400" : 
                        plan.status === 'accepted' ? "bg-green-400" : "bg-red-400"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{plan.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount</p>
                        <p className="text-xl font-black text-foreground">${plan.amount}</p>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Target Date</p>
                        <p className="text-xl font-black text-foreground">{format(new Date(plan.date), 'MMM dd')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};