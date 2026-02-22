import { motion } from 'framer-motion';
import { useState } from 'react';
import { Lock, Unlock, Shield, Clock, AlertTriangle } from 'lucide-react';
import { Severity } from '@/store/security-store';

interface Endpoint {
  id: string;
  path: string;
  method: string;
  locked: boolean;
  threatLevel: Severity;
  lockDuration: string;
  requestsBlocked: number;
  lastAttack: string;
}

const initialEndpoints: Endpoint[] = [
  { id: 'EP-001', path: '/api/auth/login', method: 'POST', locked: true, threatLevel: 'critical', lockDuration: '30 min', requestsBlocked: 4892, lastAttack: '2 min ago' },
  { id: 'EP-002', path: '/api/users', method: 'GET', locked: false, threatLevel: 'high', lockDuration: '', requestsBlocked: 1245, lastAttack: '10 min ago' },
  { id: 'EP-003', path: '/api/data/export', method: 'POST', locked: true, threatLevel: 'critical', lockDuration: '1 hr', requestsBlocked: 3421, lastAttack: '5 min ago' },
  { id: 'EP-004', path: '/api/payments', method: 'POST', locked: false, threatLevel: 'high', lockDuration: '', requestsBlocked: 892, lastAttack: '18 min ago' },
  { id: 'EP-005', path: '/api/admin/config', method: 'PUT', locked: true, threatLevel: 'medium', lockDuration: '2 hr', requestsBlocked: 567, lastAttack: '45 min ago' },
  { id: 'EP-006', path: '/api/tokens', method: 'DELETE', locked: false, threatLevel: 'low', lockDuration: '', requestsBlocked: 23, lastAttack: '3 hr ago' },
  { id: 'EP-007', path: '/api/search', method: 'GET', locked: false, threatLevel: 'low', lockDuration: '', requestsBlocked: 156, lastAttack: '2 hr ago' },
  { id: 'EP-008', path: '/api/data/bulk', method: 'POST', locked: true, threatLevel: 'critical', lockDuration: '15 min', requestsBlocked: 7823, lastAttack: '1 min ago' },
];

const durations = ['15 min', '30 min', '1 hr', '2 hr', '4 hr', '24 hr'];

const threatGlow: Record<Severity, string> = {
  critical: 'glow-red',
  high: 'glow-orange',
  medium: '',
  low: '',
  info: '',
};

const threatBorder: Record<Severity, string> = {
  critical: 'border-destructive/40',
  high: 'border-high/30',
  medium: 'border-medium/20',
  low: 'border-border',
  info: 'border-border',
};

export default function EndpointLockdown() {
  const [endpoints, setEndpoints] = useState(initialEndpoints);

  const toggleLock = (id: string, duration?: string) => {
    setEndpoints(prev => prev.map(ep =>
      ep.id === id ? { ...ep, locked: !ep.locked, lockDuration: !ep.locked ? (duration || '30 min') : '' } : ep
    ));
  };

  const methodColor: Record<string, string> = {
    GET: 'text-primary', POST: 'text-success', PUT: 'text-warning', DELETE: 'text-destructive', PATCH: 'text-medium',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Endpoint Lockdown</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Emergency defense controls</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center"><Lock className="w-4 h-4" /></div>
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">Locked</p>
            <p className="text-xl font-bold font-mono text-foreground">{endpoints.filter(e => e.locked).length}</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center"><Unlock className="w-4 h-4" /></div>
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">Open</p>
            <p className="text-xl font-bold font-mono text-foreground">{endpoints.filter(e => !e.locked).length}</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center"><Shield className="w-4 h-4" /></div>
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">Total Blocked</p>
            <p className="text-xl font-bold font-mono text-foreground">{endpoints.reduce((s, e) => s + e.requestsBlocked, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Endpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {endpoints.map((ep, i) => (
          <motion.div
            key={ep.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-panel p-5 border ${threatBorder[ep.threatLevel]} ${ep.locked ? threatGlow[ep.threatLevel] : ''} transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold ${methodColor[ep.method]}`}>{ep.method}</span>
                  <span className="text-sm font-mono text-foreground">{ep.path}</span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">{ep.id} · Last attack: {ep.lastAttack}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLock(ep.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  ep.locked
                    ? 'bg-destructive/15 text-destructive border border-destructive/30'
                    : 'bg-success/15 text-success border border-success/30'
                }`}
              >
                <motion.div
                  animate={{ rotate: ep.locked ? 0 : 15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {ep.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </motion.div>
              </motion.button>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Threat</p>
                <span className={`text-xs font-mono font-bold severity-${ep.threatLevel}`}>{ep.threatLevel.toUpperCase()}</span>
              </div>
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Blocked</p>
                <p className="text-xs font-mono font-bold text-foreground">{ep.requestsBlocked.toLocaleString()}</p>
              </div>
              {ep.locked && (
                <div className="ml-auto flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <select
                    value={ep.lockDuration}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEndpoints(prev => prev.map(x => x.id === ep.id ? { ...x, lockDuration: val } : x));
                    }}
                    className="text-[10px] font-mono bg-secondary border border-border rounded px-2 py-1 text-foreground"
                  >
                    {durations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
