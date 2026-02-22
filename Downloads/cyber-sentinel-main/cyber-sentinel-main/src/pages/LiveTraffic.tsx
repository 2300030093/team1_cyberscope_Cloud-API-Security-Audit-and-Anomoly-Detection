import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSecurityStore } from '@/store/security-store';
import { Activity, Filter, AlertTriangle } from 'lucide-react';
import SeverityBadge from '@/components/SeverityBadge';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { useState } from 'react';

const endpointData = [
  { time: '00:00', users: 120, auth: 340, data: 89, payments: 45 },
  { time: '04:00', users: 80, auth: 120, data: 45, payments: 12 },
  { time: '08:00', users: 450, auth: 890, data: 234, payments: 156 },
  { time: '12:00', users: 780, auth: 1200, data: 567, payments: 289 },
  { time: '16:00', users: 920, auth: 1450, data: 678, payments: 345 },
  { time: '20:00', users: 650, auth: 980, data: 456, payments: 234 },
  { time: '23:59', users: 340, auth: 560, data: 234, payments: 123 },
];

export default function LiveTraffic() {
  const { trafficLogs, fetchDashboardData } = useSecurityStore();
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filtered = filter === 'flagged' ? trafficLogs.filter(l => l.flagged) : trafficLogs;

  const methodColor: Record<string, string> = {
    GET: 'text-primary', POST: 'text-success', PUT: 'text-warning',
    DELETE: 'text-destructive', PATCH: 'text-medium',
  };

  const statusColor = (code: number) => {
    if (code < 300) return 'text-success';
    if (code < 400) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Live API Traffic</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Real-time request monitoring</p>
      </div>

      {/* Endpoint Usage Chart */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-foreground">Endpoint Usage</p>
          <Activity className="w-4 h-4 text-muted-foreground" />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={endpointData}>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(220 40% 8% / 0.95)', border: '1px solid hsl(220 25% 16%)', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
            <Line type="monotone" dataKey="users" stroke="hsl(186 100% 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="auth" stroke="hsl(0 85% 55%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="data" stroke="hsl(45 95% 55%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="payments" stroke="hsl(145 70% 45%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          {[{ label: '/api/users', color: 'bg-primary' }, { label: '/api/auth', color: 'bg-destructive' }, { label: '/api/data', color: 'bg-medium' }, { label: '/api/payments', color: 'bg-success' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${l.color}`} />
              <span className="text-[10px] font-mono text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Logs */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-foreground">Request Logs</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`text-[10px] font-mono px-3 py-1 rounded-full border transition-all ${filter === 'all' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >ALL</button>
            <button
              onClick={() => setFilter('flagged')}
              className={`text-[10px] font-mono px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${filter === 'flagged' ? 'border-destructive text-destructive bg-destructive/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              <AlertTriangle className="w-3 h-3" /> FLAGGED
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Method', 'Endpoint', 'Status', 'Time', 'IP', 'Severity'].map(h => (
                  <th key={h} className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${log.flagged ? 'bg-destructive/5' : ''}`}
                >
                  <td className={`py-2 px-3 text-xs font-mono font-semibold ${methodColor[log.method]}`}>{log.method}</td>
                  <td className="py-2 px-3 text-xs font-mono text-foreground">{log.endpoint}</td>
                  <td className={`py-2 px-3 text-xs font-mono font-semibold ${statusColor(log.statusCode)}`}>{log.statusCode}</td>
                  <td className="py-2 px-3 text-xs font-mono text-muted-foreground">{log.responseTime}ms</td>
                  <td className="py-2 px-3 text-xs font-mono text-muted-foreground">{log.ip}</td>
                  <td className="py-2 px-3"><SeverityBadge severity={log.severity} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
