import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import SeverityBadge from '@/components/SeverityBadge';
import { Severity } from '@/store/security-store';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  severity: Severity;
  details: string;
  category: string;
}

const generateLogs = (): AuditLog[] => {
  const actions = [
    { action: 'IP Blocked', category: 'defense', severity: 'high' as Severity },
    { action: 'Token Revoked', category: 'auth', severity: 'critical' as Severity },
    { action: 'Rate Limit Applied', category: 'defense', severity: 'medium' as Severity },
    { action: 'Endpoint Locked', category: 'defense', severity: 'critical' as Severity },
    { action: 'Policy Updated', category: 'config', severity: 'info' as Severity },
    { action: 'User Login', category: 'auth', severity: 'low' as Severity },
    { action: 'Alert Triggered', category: 'detection', severity: 'high' as Severity },
    { action: 'Incident Created', category: 'incident', severity: 'high' as Severity },
    { action: 'Scan Completed', category: 'detection', severity: 'low' as Severity },
    { action: 'Geo Block Applied', category: 'defense', severity: 'medium' as Severity },
  ];
  const actors = ['system-ai', 'admin@sentinel.io', 'auto-defense', 'soc-analyst-1', 'policy-engine'];

  return Array.from({ length: 100 }, (_, i) => {
    const a = actions[Math.floor(Math.random() * actions.length)];
    return {
      id: `AUD-${String(i + 1).padStart(4, '0')}`,
      timestamp: `2026-02-21 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      action: a.action,
      actor: actors[Math.floor(Math.random() * actors.length)],
      severity: a.severity,
      details: `Automated ${a.action.toLowerCase()} on ${['192.168.45.12', '/api/auth/login', 'TKN-001', 'EP-003'][Math.floor(Math.random() * 4)]}`,
      category: a.category,
    };
  }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
};

const allLogs = generateLogs();
const categories = ['all', ...new Set(allLogs.map(l => l.category))];
const severities: ('all' | Severity)[] = ['all', 'critical', 'high', 'medium', 'low', 'info'];

export default function AuditLogs() {
  const [catFilter, setCatFilter] = useState('all');
  const [sevFilter, setSevFilter] = useState<'all' | Severity>('all');
  const [visibleCount, setVisibleCount] = useState(30);

  const filtered = useMemo(() => {
    return allLogs.filter(l =>
      (catFilter === 'all' || l.category === catFilter) &&
      (sevFilter === 'all' || l.severity === sevFilter)
    );
  }, [catFilter, sevFilter]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Complete security event history</p>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-mono px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors uppercase tracking-wider">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Category</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`text-[10px] font-mono px-3 py-1.5 rounded-full border transition-all uppercase tracking-wider ${
                catFilter === cat ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {severities.map(sev => (
            <button
              key={sev}
              onClick={() => setSevFilter(sev)}
              className={`text-[10px] font-mono px-3 py-1.5 rounded-full border transition-all uppercase tracking-wider ${
                sevFilter === sev ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-mono text-muted-foreground">{filtered.length} events found</p>
      </div>

      {/* Log Entries */}
      <div className="space-y-2">
        {visible.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
            className="glass-panel p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
          >
            <span className="text-[10px] font-mono text-muted-foreground w-36 shrink-0">{log.timestamp}</span>
            <SeverityBadge severity={log.severity} />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground uppercase">{log.category}</span>
            <span className="text-xs font-medium text-foreground">{log.action}</span>
            <span className="text-xs text-muted-foreground flex-1 truncate">{log.details}</span>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">{log.actor}</span>
          </motion.div>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 30)}
            className="text-[10px] font-mono px-6 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors uppercase tracking-wider"
          >
            Load More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
