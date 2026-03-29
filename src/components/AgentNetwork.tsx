import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Signal, SignalHigh, CheckCircle, Smartphone, ArrowUpRight } from 'lucide-react';
import { Agent } from '@/types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'Downtown Hub',
    rating: 4.9,
    status: 'online',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4c1c7fe6-6af0-4066-8fb6-9083007a6e4b/agent-1-d1e52be8-1774763921936.webp'
  },
  {
    id: '2',
    name: 'Michael Chen',
    location: 'Westside Plaza',
    rating: 4.7,
    status: 'online',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4c1c7fe6-6af0-4066-8fb6-9083007a6e4b/agent-2-c301a60b-1774763922606.webp'
  },
  {
    id: '3',
    name: 'Amara Okafor',
    location: 'East Park Avenue',
    rating: 4.8,
    status: 'offline',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200&fit=crop'
  }
];

export const AgentNetwork: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Agent Network</h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">12 Agents nearby</p>
        </div>
        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center border border-border shadow-sm">
           <MapPin className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="grid gap-4">
        {AGENTS.map((agent, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={agent.id}
          >
            <Card className="overflow-hidden border border-border shadow-sm bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300 rounded-[2rem]">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-background shadow-lg group-hover:scale-105 transition-transform">
                    <img 
                      src={agent.imageUrl} 
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-card shadow-sm flex items-center justify-center",
                    agent.status === 'online' ? "bg-emerald-500" : "bg-muted-foreground/30"
                  )} >
                    {agent.status === 'online' && <div className="w-1 h-1 bg-white rounded-full animate-ping" />}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-foreground truncate">{agent.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="truncate">{agent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-lg">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-foreground">{agent.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <Smartphone className="h-3 w-3 text-primary/40" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" className="rounded-xl font-black text-[10px] uppercase h-9 px-4 shadow-lg shadow-primary/10">
                    Contact
                  </Button>
                  <div className="flex items-center justify-center gap-1.5">
                    {agent.status === 'online' ? (
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Online</span>
                    ) : (
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Offline</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="bg-primary text-primary-foreground border-none p-6 rounded-[2.5rem] shadow-2xl shadow-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-white/20 rounded-[1.5rem] backdrop-blur-md">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h4 className="font-black text-xl tracking-tight leading-none mb-1">Be an Agent</h4>
              <p className="text-xs text-white/70 font-medium">Join the network and earn commissions.</p>
            </div>
            <Button variant="secondary" size="icon" className="ml-auto h-12 w-12 rounded-2xl bg-white text-primary hover:bg-white shadow-lg">
              <ArrowUpRight className="h-6 w-6" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};