import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Activity, AlertTriangle, Zap, BarChart3,
  Key, Lock, FileText, Settings, Menu, X, Radio
} from 'lucide-react';
import { useState } from 'react';
import { useSecurityStore } from '@/store/security-store';

const navItems = [
  { path: '/', label: 'Overview', icon: Shield },
  { path: '/traffic', label: 'Live Traffic', icon: Activity },
  { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { path: '/automation', label: 'Automation', icon: Zap },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/tokens', label: 'Tokens', icon: Key },
  { path: '/endpoints', label: 'Lockdown', icon: Lock },
  { path: '/timeline', label: 'Timeline', icon: FileText },
  { path: '/policies', label: 'Policies', icon: Settings },
  { path: '/audit', label: 'Audit Logs', icon: FileText },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { globalThreatScore, activeIncidents } = useSecurityStore();

  return (
    <div className="flex min-h-screen bg-background grid-bg">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen z-50 glass-panel-strong border-r border-border flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-cyan">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground tracking-tight">SENTINEL</p>
              <p className="text-[10px] text-muted-foreground font-mono">AI SECURITY</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 text-primary neon-border glow-cyan'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.path === '/incidents' && activeIncidents > 0 && (
                  <span className="ml-auto text-[10px] font-mono bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full">
                    {activeIncidents}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Threat Score */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="glass-panel p-3 glow-cyan">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1">Global Threat</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-primary font-mono text-glow-cyan">{globalThreatScore}</span>
                <span className="text-xs text-muted-foreground mb-1">/100</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${globalThreatScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <Menu className="w-4 h-4 mx-auto" /> : <X className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main */}
      <main
        className="flex-1 transition-all duration-200"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        {/* Header */}
        <header className="h-16 border-b border-border glass-panel-strong sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Radio className="w-3 h-3 text-success animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-muted-foreground">THREAT LEVEL:</span>
              <span className={`font-bold ${globalThreatScore > 70 ? 'text-destructive' : globalThreatScore > 40 ? 'text-warning' : 'text-success'}`}>
                {globalThreatScore > 70 ? 'ELEVATED' : globalThreatScore > 40 ? 'MODERATE' : 'NORMAL'}
              </span>
            </div>
            <div className="w-px h-6 bg-border" />
            <span className="text-xs font-mono text-muted-foreground">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
