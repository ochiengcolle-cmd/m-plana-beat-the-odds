import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { PlannerCalendar } from './PlannerCalendar';
import { PlanDay } from '@/types';
import { format } from 'date-fns';

interface DependantsPlanningProps {
  onSendPlan: (contact: string, plans: PlanDay[]) => void;
}

export const DependantsSection: React.FC<DependantsPlanningProps> = ({ onSendPlan }) => {
  const [contact, setContact] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [dependantPlans, setDependantPlans] = useState<PlanDay[]>([]);
  const [otp, setOtp] = useState('');

  const handleVerifyNumber = () => {
    if (contact.length < 10) {
      toast.error("Enter a valid mobile number");
      return;
    }
    setIsVerifying(true);
    // Simulate OTP sent
    toast.info("Verification code sent to the recipient");
  };

  const handleConfirmOtp = () => {
    if (otp === '1234') {
      setIsVerified(true);
      setIsVerifying(false);
      toast.success("Number verified successfully");
    } else {
      toast.error("Invalid verification code");
    }
  };

  const handlePlanChange = (newPlans: PlanDay[]) => {
    setDependantPlans(newPlans);
  };

  const handleFinalSend = () => {
    if (dependantPlans.length === 0) {
      toast.error("Please select dates for the dependant plan");
      return;
    }
    onSendPlan(contact, dependantPlans);
    setContact('');
    setDependantPlans([]);
    setIsVerified(false);
    toast.success(`Plan sent to ${contact}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-foreground tracking-tight">Plan for Others</h2>
        <p className="text-sm text-muted-foreground">Empower your loved ones with scheduled funding.</p>
      </header>

      {!isVerified ? (
        <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Recipient Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="+254 7XX XXX XXX" 
                  className="h-14 pl-12 rounded-2xl bg-accent/30 border-none focus:ring-2 focus:ring-primary text-xl font-black"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            {!isVerifying ? (
              <Button 
                onClick={handleVerifyNumber} 
                className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20"
              >
                Verify & Start Planning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Verification Code</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Enter 1234 to verify" 
                      className="h-14 pl-12 rounded-2xl bg-accent/30 border-none focus:ring-2 focus:ring-primary text-xl font-black tracking-[0.5em]"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                   <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsVerifying(false)}>Cancel</Button>
                   <Button className="flex-1 h-14 rounded-2xl font-black" onClick={handleConfirmOtp}>Confirm Code</Button>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="border-none bg-primary/10 rounded-[2rem] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black">Planning for {contact}</p>
                <p className="text-[10px] font-black text-primary uppercase">Verified Recipient</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsVerified(false)} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </Card>

          <PlannerCalendar 
            plans={dependantPlans} 
            onPlanChange={handlePlanChange} 
            title={`Set funds for ${contact}`}
          />

          {dependantPlans.length > 0 && (
            <Button 
              onClick={handleFinalSend} 
              className="w-full h-16 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 sticky bottom-24"
            >
              Send All Plans
              <Send className="ml-2 h-6 w-6" />
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};