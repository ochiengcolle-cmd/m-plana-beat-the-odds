import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Phone, 
  DollarSign, 
  Calendar, 
  Send,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const DependantsPlanning: React.FC = () => {
  const [formData, setFormData] = useState({
    contact: '',
    amount: '',
    frequency: 'once'
  });

  const handlePlanForDependant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contact || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(`Plan created! $${formData.amount} will be sent to ${formData.contact}`);
    setFormData({ contact: '', amount: '', frequency: 'once' });
  };

  const recentDependants = [
    { name: 'Sarah (Sister)', contact: '+1 234 567 890', lastAmount: 50 },
    { name: 'Tom (Son)', contact: '+1 987 654 321', lastAmount: 20 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Dependants</h2>
        <p className="text-stone-500 text-sm">Plan and fund accounts for your loved ones</p>
      </header>

      <Card className="p-6 border-stone-100 dark:bg-stone-900 dark:border-stone-800">
        <form onSubmit={handlePlanForDependant} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact">Dependant Contact / Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <Input 
                id="contact" 
                placeholder="Registration contact number" 
                className="pl-10"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Planning Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <Input 
                id="amount" 
                type="number"
                placeholder="Amount to send" 
                className="pl-10"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>
            <div className="grid grid-cols-3 gap-2">
              {['once', 'weekly', 'monthly'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFormData({...formData, frequency: freq})}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    formData.frequency === freq 
                      ? 'bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' 
                      : 'bg-white border-stone-100 text-stone-500 dark:bg-stone-800 dark:border-stone-700'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#8D6E63] hover:bg-[#795548] text-white flex items-center justify-center gap-2">
            <Send className="h-4 w-4" />
            Schedule & Send
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-700 dark:text-stone-200">Recent Dependants</h3>
          <Button variant="ghost" size="sm" className="text-amber-600 font-bold p-0">
            <UserPlus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </div>
        <div className="space-y-2">
          {recentDependants.map((dep, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ x: 5 }}
              className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-stone-400" />
                </div>
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-100">{dep.name}</p>
                  <p className="text-xs text-stone-400">{dep.contact}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">${dep.lastAmount}</p>
                <ArrowRight className="h-4 w-4 ml-auto text-stone-300 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};