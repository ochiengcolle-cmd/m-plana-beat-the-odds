import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Minus, CheckCircle2, LayoutGrid, ListTodo, Wallet, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlanDay } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PlannerCalendarProps {
  plans: PlanDay[];
  onPlanChange: (plans: PlanDay[]) => void;
  onWithdrawPlan?: (planId: string, agentNumber: string, pin: string) => void;
  title?: string;
}

export const PlannerCalendar: React.FC<PlannerCalendarProps> = ({ 
  plans, 
  onPlanChange, 
  onWithdrawPlan,
  title = "Select dates to plan"
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [planningAmount, setPlanningAmount] = useState<number>(10);
  const [isBulkUpdate, setIsBulkUpdate] = useState(true);
  const [individualAmounts, setIndividualAmounts] = useState<Record<string, number>>({});
  
  // Withdrawal states
  const [withdrawingPlanId, setWithdrawingPlanId] = useState<string | null>(null);
  const [agentNumber, setAgentNumber] = useState('');
  const [pin, setPin] = useState('');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const toggleDaySelection = (day: Date) => {
    const isSelected = selectedDays.some(d => isSameDay(d, day));
    if (isSelected) {
      setSelectedDays(selectedDays.filter(d => !isSameDay(d, day)));
      const dateKey = format(day, 'yyyy-MM-dd');
      const newIndiv = { ...individualAmounts };
      delete newIndiv[dateKey];
      setIndividualAmounts(newIndiv);
    } else {
      setSelectedDays([...selectedDays, day]);
      const dateKey = format(day, 'yyyy-MM-dd');
      setIndividualAmounts({ ...individualAmounts, [dateKey]: planningAmount });
    }
  };

  const handleUpdate = () => {
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    const newPlans = [...plans];
    selectedDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const amount = isBulkUpdate ? planningAmount : (individualAmounts[dateKey] || planningAmount);
      
      const existingPlanIndex = newPlans.findIndex(p => isSameDay(p.date, day));
      if (existingPlanIndex > -1) {
        newPlans[existingPlanIndex].amount = amount;
      } else {
        newPlans.push({ 
          id: Math.random().toString(36).substr(2, 9),
          date: day, 
          amount,
          status: 'active'
        });
      }
    });

    onPlanChange(newPlans);
    setSelectedDays([]);
    setIndividualAmounts({});
    toast.success(isBulkUpdate 
      ? `Planned ${selectedDays.length} days at $${planningAmount} each` 
      : `Planned ${selectedDays.length} days with individual amounts`);
  };

  const handleWithdrawClick = (e: React.MouseEvent, plan: PlanDay) => {
    e.stopPropagation();
    if (plan.status !== 'active') {
      toast.error("Plan already withdrawn or reverted");
      return;
    }
    setWithdrawingPlanId(plan.id);
  };

  const handleConfirmWithdraw = () => {
    if (!agentNumber || pin.length < 4) {
      toast.error("Valid Agent ID and 4-digit PIN required");
      return;
    }
    if (onWithdrawPlan && withdrawingPlanId) {
      onWithdrawPlan(withdrawingPlanId, agentNumber, pin);
      setWithdrawingPlanId(null);
      setAgentNumber('');
      setPin('');
      toast.success("Withdrawal successful");
    }
  };

  const getDayPlan = (day: Date) => plans.find(p => isSameDay(p.date, day));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center mb-2 px-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-[10px] font-bold text-muted-foreground uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isSelected = selectedDays.some(d => isSameDay(d, day));
          const plan = getDayPlan(day);
          const active = isSameMonth(day, monthStart);

          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleDaySelection(day)}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer border transition-all",
                !active && "opacity-20 pointer-events-none",
                // User requested selected highlight to be YELLOW
                isSelected ? "border-yellow-400 bg-yellow-400 shadow-lg scale-105 z-10" : "border-border bg-card",
                plan && !isSelected && (plan.status === 'active' ? "bg-primary/5 border-primary/20" : "bg-muted border-muted-foreground/10 opacity-60"),
                isToday(day) && !isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <span className={cn(
                "text-sm font-bold",
                isSelected ? "text-yellow-950" : "text-foreground",
                plan && !isSelected && "text-primary"
              )}>
                {format(day, 'd')}
              </span>
              {plan && (
                <div className="flex flex-col items-center">
                  <span className={cn(
                    "text-[8px] font-black mt-1",
                    isSelected ? "text-yellow-900" : "text-primary"
                  )}>
                    ${plan.amount}
                  </span>
                  {plan.status === 'active' && !isSelected && (
                    <button 
                      onClick={(e) => handleWithdrawClick(e, plan)}
                      className="absolute bottom-1 bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md text-[6px] font-black uppercase tracking-tighter hover:scale-110 transition-transform shadow-sm"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              )}
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="h-3 w-3 text-yellow-900" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {/* Planning Controls */}
        {selectedDays.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="space-y-4"
          >
            <Card className="p-5 bg-card border-none shadow-2xl space-y-4 rounded-[2rem]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {isBulkUpdate ? <LayoutGrid className="h-5 w-5" /> : <ListTodo className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold">Plan Settings</h3>
                    <p className="text-xs text-muted-foreground">{selectedDays.length} days selected</p>
                  </div>
                </div>
                <div className="flex bg-accent rounded-lg p-1">
                  <Button 
                    variant={isBulkUpdate ? "default" : "ghost"} 
                    size="sm" 
                    className="h-8 text-[10px] font-bold uppercase"
                    onClick={() => setIsBulkUpdate(true)}
                  >
                    Bulk
                  </Button>
                  <Button 
                    variant={!isBulkUpdate ? "default" : "ghost"} 
                    size="sm" 
                    className="h-8 text-[10px] font-bold uppercase"
                    onClick={() => setIsBulkUpdate(false)}
                  >
                    Indiv
                  </Button>
                </div>
              </div>

              {isBulkUpdate ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-sm font-bold text-muted-foreground uppercase">Amount per day</p>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl bg-background border-border"
                        onClick={() => setPlanningAmount(Math.max(0, planningAmount - 1))}
                      >
                        <Minus className="h-4 w-4 text-primary" />
                      </Button>
                      <Input 
                        type="number" 
                        value={planningAmount}
                        onChange={(e) => setPlanningAmount(Number(e.target.value))}
                        className="w-20 h-9 text-center text-lg font-black border-none focus-visible:ring-0"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-9 w-9 rounded-xl bg-background border-border"
                        onClick={() => setPlanningAmount(planningAmount + 1)}
                      >
                        <Plus className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                  {selectedDays.sort((a,b) => a.getTime() - b.getTime()).map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    return (
                      <div key={dateKey} className="flex items-center justify-between bg-accent/30 p-3 rounded-xl border border-accent">
                        <span className="text-sm font-bold">{format(day, 'MMM d, EEE')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground">$</span>
                          <Input 
                            type="number" 
                            value={individualAmounts[dateKey] || ''}
                            placeholder="0"
                            onChange={(e) => updateIndividualAmount(day, Number(e.target.value))}
                            className="w-20 h-8 text-right font-black bg-background border-none focus-visible:ring-0"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <Button className="w-full h-12 text-lg font-black shadow-lg shadow-primary/20 rounded-2xl" onClick={handleUpdate}>
                Confirm Selected Plans
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Specific Plan Withdrawal Modal Overlay */}
        {withdrawingPlanId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => setWithdrawingPlanId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-card rounded-[2.5rem] border border-border p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-2 text-primary">
                  <Wallet className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black">Withdraw Plan</h3>
                <p className="text-sm text-muted-foreground">Withdraw ${plans.find(p => p.id === withdrawingPlanId)?.amount} for {format(plans.find(p => p.id === withdrawingPlanId)?.date || new Date(), 'MMM dd')}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Agent Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter Agent ID"
                      className="h-12 pl-10 rounded-2xl bg-accent/30 border-transparent"
                      value={agentNumber}
                      onChange={(e) => setAgentNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">PIN Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password"
                      maxLength={4}
                      placeholder="****"
                      className="h-12 pl-10 rounded-2xl bg-accent/30 border-transparent tracking-[1em]"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-12 rounded-2xl font-bold"
                  onClick={() => setWithdrawingPlanId(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-2xl font-black shadow-lg shadow-primary/20"
                  onClick={handleConfirmWithdraw}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function updateIndividualAmount(day: Date, amount: number) {
    const dateKey = format(day, 'yyyy-MM-dd');
    setIndividualAmounts({ ...individualAmounts, [dateKey]: amount });
  }
};