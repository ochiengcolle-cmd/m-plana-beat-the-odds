import { formatCurrency } from './lib/utils';

export type PlanStatus = 'active' | 'withdrawn' | 'reverted';

export interface PlanDay {
  id: string;
  date: Date;
  amount: number;
  status: PlanStatus;
}

export interface Agent {
  id: string;
  name: string;
  location: string;
  rating: number;
  status: 'online' | 'offline';
  imageUrl: string;
}

export interface ScheduledWithdrawal {
  id: string;
  amount: number;
  date: Date;
  agentNumber: string;
  status: 'pending' | 'completed' | 'cancelled';
  planId?: string; // If it's a specific plan withdrawal
}

export interface Dependant {
  id: string;
  name: string;
  contact: string;
  imageUrl?: string;
}

export interface SharedPlan {
  id: string;
  senderName: string;
  senderContact: string;
  receiverName: string;
  receiverContact: string;
  amount: number;
  date: Date;
  status: 'pending' | 'accepted' | 'declined';
  type: 'sent' | 'received';
}

export interface UserState {
  balance: number;
  plans: PlanDay[];
  withdrawals: ScheduledWithdrawal[];
  dependants: Dependant[];
  sentPlans: SharedPlan[];
  receivedPlans: SharedPlan[];
  theme: 'brown' | 'dark';
  linkedMobileNumber: string;
  linkedBankAccount: string;
}