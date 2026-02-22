import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useSecurityStore, Severity } from '@/store/security-store';
import SeverityBadge from '@/components/SeverityBadge';
import { useState } from 'react';
import { Bot, Clock, Globe, ChevronRight, X } from 'lucide-react';

export default function Incidents() {
  const { incidents, fetchDashboardData } = useSecurityStore();
  const [filterSev, setFilterSev] = useState<Severity | 'all'>('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Export filtered incidents as CSV
  function exportIncidents() {
    const fields = ['id', 'title', 'severity', 'status', 'timestamp', 'source', 'endpoint', 'aiExplanation'];
    const csvRows = [fields.join(',')];
    const filteredData = filterSev === 'all' ? incidents : incidents.filter(i => i.severity === filterSev);
    filteredData.forEach(incident => {
      const row = fields.map(f => {
        let val = incident[f as keyof typeof incident];
        if (typeof val === 'string') {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      }).join(',');
      csvRows.push(row);
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incidents.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = filterSev === 'all' ? incidents : incidents.filter(i => i.severity === filterSev);
  const selected = incidents.find(i => i.id === selectedId);

  const statusColor: Record<string, string> = {
    open: 'bg-destructive/15 text-destructive border-destructive/30',
    investigating: 'bg-warning/15 text-warning border-warning/30',
    contained: 'bg-success/15 text-success border-success/30',
    resolved: 'bg-success/15 text-success border-success/30',
    closed: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Incident Control Center</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Manage and investigate security incidents</p>
          <button
            className="mt-2 px-4 py-2 rounded bg-primary text-white text-xs font-mono hover:bg-primary/80 transition-colors"
            onClick={exportIncidents}
          >
            Export
          </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSev(sev)}
            className={`text-[10px] font-mono px-3 py-1.5 rounded-full border transition-all uppercase tracking-wider ${
              filterSev === sev
                ? 'border-primary text-primary bg-primary/10'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {sev} {sev !== 'all' && `(${incidents.filter(i => i.severity === sev).length})`}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Incident List */}
        <div className="flex-1 space-y-3">
          {filtered.map((incident, i) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedId(incident.id)}
              className={`glass-panel p-4 cursor-pointer transition-all hover:bg-secondary/50 ${
                selectedId === incident.id ? 'neon-border glow-cyan' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={incident.severity} />
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusColor[incident.status] || ''}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mt-2">{incident.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{incident.timestamp}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{incident.source}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 40, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 400 }}
              exit={{ opacity: 0, x: 40, width: 0 }}
              className="glass-panel-strong neon-border glow-cyan p-6 h-fit sticky top-24 shrink-0 overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-mono text-primary uppercase tracking-wider">{selected.id}</p>
                  <SeverityBadge severity={selected.severity} className="mt-1" />
                </div>
                <button onClick={() => setSelectedId(0)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-semibold text-foreground mb-4">{selected.title}</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusColor[selected.status] || ''}`}>
                    {selected.status}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Source</p>
                  <p className="text-xs font-mono text-foreground">{selected.source}</p>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Endpoint</p>
                  <p className="text-xs font-mono text-foreground">{selected.endpoint}</p>
                </div>

                <div className="glass-panel p-3 neon-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[10px] font-mono text-primary uppercase tracking-wider">AI Analysis</p>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{selected.aiExplanation}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 text-[10px] font-mono px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors uppercase tracking-wider">
                    Investigate
                  </button>
                  <button className="flex-1 text-[10px] font-mono px-3 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors uppercase tracking-wider">
                    Escalate
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
