import React, { useState } from 'react';
import { Home, Calendar, Users, Wallet, Menu, X, User, Shield, HelpCircle, LogOut, Download, UserPlus, Moon, Sun, ArrowRightLeft, SendHorizontal, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'brown' | 'dark';
  toggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'planner', icon: Calendar, label: 'Planner' },
    { id: 'dependants', icon: UserPlus, label: 'Others' },
    { id: 'withdrawal', icon: Download, label: 'Funds' },
  ];

  const menuItems = [
    { id: 'received-plans', icon: Mail, label: 'Received Plans' },
    { id: 'sent-plans', icon: SendHorizontal, label: 'Sent Plans' },
    { id: 'deposit', icon: Wallet, label: 'Deposit Section' },
    { id: 'agents', icon: Users, label: 'Agent Network' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'logout', icon: LogOut, label: 'Logout', className: 'text-red-500' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-2xl border-t border-border px-4 pb-8 pt-4 z-50 transition-colors duration-300">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMenuOpen(false);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all outline-none",
                activeTab === tab.id && !isMenuOpen ? "text-primary" : "text-muted-foreground/60 hover:text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-3 rounded-[1.25rem] transition-all",
                activeTab === tab.id && !isMenuOpen ? "bg-primary/10 shadow-sm scale-110" : "bg-transparent hover:bg-accent/50"
              )}>
                <tab.icon className={cn("h-5 w-5", activeTab === tab.id && !isMenuOpen ? "stroke-[2.5px]" : "stroke-[2px]")} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
            </button>
          ))}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all outline-none",
              isMenuOpen ? "text-primary" : "text-muted-foreground/60"
            )}
          >
            <div className={cn(
              "p-3 rounded-[1.25rem] transition-all",
              isMenuOpen ? "bg-primary/10 shadow-sm scale-110" : "bg-transparent hover:bg-accent/50"
            )}>
              {isMenuOpen ? <X className="h-5 w-5 stroke-[2.5px]" /> : <Menu className="h-5 w-5" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 bg-background/40 z-40 flex items-end justify-center p-4 pb-32"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              initial={{ y: 200, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 200, scale: 0.95 }}
              className="w-full max-w-md bg-card rounded-[3rem] p-8 space-y-6 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground tracking-tight leading-none">John Doe</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">ID: 8829-4401</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme} 
                  className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-border shadow-sm"
                >
                  {theme === 'brown' ? <Moon className="h-6 w-6 text-primary" /> : <Sun className="h-6 w-6 text-primary" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (['deposit', 'agents', 'sent-plans', 'received-plans'].includes(item.id)) {
                        setActiveTab(item.id);
                        setIsMenuOpen(false);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-3 w-full p-5 rounded-[2rem] bg-accent/30 hover:bg-accent/60 transition-all border border-transparent hover:border-primary/20 group",
                      item.className
                    )}
                  >
                    <div className="p-3 bg-card rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};