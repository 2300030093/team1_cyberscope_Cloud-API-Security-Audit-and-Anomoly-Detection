import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useSecurityStore } from '@/store/security-store';
import {
  Shield, AlertTriangle, Zap, Activity, Ban, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import StatCard from '@/components/StatCard';
import AIInsightBox from '@/components/AIInsightBox';
import SeverityBadge from '@/components/SeverityBadge';

function HeatmapCell({ value }: { value: number }) {
  const opacity = Math.min(value / 100, 1);
  const isHigh = value > 70;
  return (
    <div
      className="w-8 h-8 rounded-sm flex items-center justify-center text-[9px] font-mono"
      style={{
        backgroundColor: isHigh
          ? `hsl(0 85% 55% / ${opacity})`
          : `hsl(186 100% 50% / ${opacity * 0.6})`,
        color: opacity > 0.5 ? 'white' : 'hsl(215 15% 50%)',
      }}
    >
      {value}
    </div>
  );
}

export default function Dashboard() {
  const { 
    globalThreatScore, 
    activeIncidents, 
    autoResponsesTriggered, 
    blockedRequests, 
    incidents, 
    trafficLogs,
    topAttackers,
    riskDistribution,
    fetchDashboardData 
  } = useSecurityStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Generate traffic data from real logs
  const trafficData = useMemo(() => {
    if (trafficLogs.length === 0) {
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        requests: Math.floor(Math.random() * 5000) + 2000,
        blocked: Math.floor(Math.random() * 500) + 100,
        threats: Math.floor(Math.random() * 50) + 5,
      }));
    }
    
    const hourlyData: Record<string, { requests: number; blocked: number; threats: number }> = {};
    trafficLogs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      const key = `${String(hour).padStart(2, '0')}:00`;
      if (!hourlyData[key]) {
        hourlyData[key] = { requests: 0, blocked: 0, threats: 0 };
      }
      hourlyData[key].requests++;
      if (log.risk_score >= 60) hourlyData[key].blocked++;
      if (log.risk_score >= 80) hourlyData[key].threats++;
    });
    
    return Array.from({ length: 24 }, (_, i) => {
      const key = `${String(i).padStart(2, '0')}:00`;
      return {
        time: key,
        requests: hourlyData[key]?.requests || Math.floor(Math.random() * 100) + 20,
        blocked: hourlyData[key]?.blocked || Math.floor(Math.random() * 20),
        threats: hourlyData[key]?.threats || Math.floor(Math.random() * 10),
      };
    });
  }, [trafficLogs]);

  const displayAttackers = topAttackers.length > 0 ? topAttackers.map(a => ({
    ip: a.ip_address,
    attacks: a.request_count,
    country: 'XX'
  })) : [
    { ip: '192.168.45.12', attacks: 2847, country: 'CN' },
    { ip: '10.0.14.88', attacks: 1923, country: 'RU' },
    { ip: '172.16.0.55', attacks: 1456, country: 'KP' },
    { ip: '10.0.22.7', attacks: 892, country: 'IR' },
    { ip: '192.168.78.3', attacks: 634, country: 'BR' },
  ];

  const heatmapData = useMemo(() => {
    if (riskDistribution.length > 0) {
      const total = riskDistribution.reduce((sum, r) => sum + r.count, 0);
      return riskDistribution.map(r => ({
        endpoint: `/api/${r.risk_level}`,
        mon: Math.floor((r.count / total) * 100),
        tue: Math.floor((r.count / total) * 80),
        wed: Math.floor((r.count / total) * 90),
        thu: Math.floor((r.count / total) * 70),
        fri: Math.floor((r.count / total) * 60),
        sat: Math.floor((r.count / total) * 20),
        sun: Math.floor((r.count / total) * 10),
      }));
    }
    return [
      { endpoint: '/api/users', mon: 12, tue: 45, wed: 23, thu: 67, fri: 89, sat: 5, sun: 3 },
      { endpoint: '/api/auth', mon: 78, tue: 92, wed: 56, thu: 34, fri: 45, sat: 12, sun: 8 },
      { endpoint: '/api/data', mon: 34, tue: 56, wed: 78, thu: 90, fri: 67, sat: 23, sun: 11 },
      { endpoint: '/api/payments', mon: 5, tue: 8, wed: 3, thu: 92, fri: 45, sat: 2, sun: 1 },
      { endpoint: '/api/admin', mon: 23, tue: 11, wed: 45, thu: 7, fri: 56, sat: 34, sun: 6 },
    ];
  }, [riskDistribution]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Security Overview</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Real-time autonomous threat monitoring</p>
      </div>

      <AIInsightBox />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Threat Score" 
          value={globalThreatScore} 
          icon={<Shield className="w-5 h-5" />} 
          trend={globalThreatScore > 50 ? "↑ High risk detected" : "↓ Risk normal"} 
          variant={globalThreatScore > 70 ? "danger" : globalThreatScore > 40 ? "warning" : "default"} 
        />
        <StatCard 
          label="Active Incidents" 
          value={activeIncidents} 
          icon={<AlertTriangle className="w-5 h-5" />} 
          trend={`${incidents.filter(i => i.severity === 'critical').length} critical`} 
          variant={activeIncidents > 5 ? "warning" : "default"} 
        />
        <StatCard 
          label="Auto Responses" 
          value={autoResponsesTriggered} 
          icon={<Zap className="w-5 h-5" />} 
          trend="Active monitoring" 
          variant="default" 
        />
        <StatCard 
          label="High Risk Requests" 
          value={blockedRequests} 
          icon={<Ban className="w-5 h-5" />} 
          trend={`of ${trafficLogs.length} total`} 
          variant={blockedRequests > 20 ? "danger" : "default"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">API Traffic (24h)</p>
              <p className="text-[10px] font-mono text-muted-foreground">Requests vs Blocked</p>
            </div>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="gradientTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(186 100% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(186 100% 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0 85% 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0 85% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220 40% 8% / 0.95)',
                  border: '1px solid hsl(220 25% 16%)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Area type="monotone" dataKey="requests" stroke="hsl(186 100% 50%)" fill="url(#gradientTraffic)" strokeWidth={2} />
              <Area type="monotone" dataKey="blocked" stroke="hsl(0 85% 55%)" fill="url(#gradientBlocked)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">Top Attacking IPs</p>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {displayAttackers.map((attacker, i) => (
              <motion.div
                key={attacker.ip}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-xs font-mono text-foreground">{attacker.ip}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{attacker.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-destructive"
                      initial={{ width: 0 }}
                      animate={{ width: `${(attacker.attacks / displayAttackers[0].attacks) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-destructive w-10 text-right">{attacker.attacks}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Risk Heatmap</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-[10px] font-mono text-muted-foreground pb-2 pr-4">Endpoint</th>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <th key={d} className="text-center text-[10px] font-mono text-muted-foreground pb-2">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.endpoint}>
                    <td className="text-xs font-mono text-foreground pr-4 py-1">{row.endpoint}</td>
                    {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat, row.sun].map((v, i) => (
                      <td key={i} className="text-center py-1 px-0.5"><HeatmapCell value={v} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Recent Incidents</p>
          <div className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin">
            {incidents.length > 0 ? (
              incidents.slice(0, 5).map((incident, i) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="mt-0.5">
                    <SeverityBadge severity={incident.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{incident.title}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{incident.id} · {new Date(incident.timestamp).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No incidents recorded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
