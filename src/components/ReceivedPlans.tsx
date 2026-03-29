import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SharedPlan } from '@/types';
import { format } from 'date-fns';
import { User, Phone, DollarSign, Calendar, CheckCircle, Clock, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReceivedPlansProps {
  plans: SharedPlan[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export const ReceivedPlans: React.FC<ReceivedPlansProps> = ({ plans, onAccept, onDecline }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-foreground tracking-tight">Received Plans</h2>
        <p className="text-sm text-muted-foreground">Review and accept plans sent to you by others.</p>
      </div>

      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-20 bg-accent/30 border-2 border-dashed border-border rounded-[2.5rem]">
            <div className="w-16 h-16 bg-card rounded-3xl flex items-center justify-center mx-auto mb-4 border border-border">
              <ArrowDownLeft className="h-8 w-8 text-primary/30" />
            </div>
            <p className="font-black text-xs text-muted-foreground uppercase tracking-widest">No incoming plans yet</p>
          </div>
        ) : (
          plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{plan.senderName}</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Sender</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-foreground">${plan.amount}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Planned Fund</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-border">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-bold">{plan.senderContact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-bold">{format(new Date(plan.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 rounded-2xl font-bold border-red-500/20 text-red-500 hover:bg-red-500/10"
                      onClick={() => onDecline(plan.id)}
                    >
                      Decline
                    </Button>
                    <Button 
                      className="flex-1 h-12 rounded-2xl font-black shadow-lg shadow-primary/20"
                      onClick={() => onAccept(plan.id)}
                    >
                      Accept
                    </Button>
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