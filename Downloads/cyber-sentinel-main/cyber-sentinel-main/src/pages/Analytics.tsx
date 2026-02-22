import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

const attackTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  attacks: Math.floor(Math.random() * 300) + 50,
  blocked: Math.floor(Math.random() * 250) + 40,
}));

const riskDistribution = [
  { name: 'Critical', value: 15, color: 'hsl(0 85% 55%)' },
  { name: 'High', value: 28, color: 'hsl(25 95% 55%)' },
  { name: 'Medium', value: 35, color: 'hsl(45 95% 55%)' },
  { name: 'Low', value: 22, color: 'hsl(186 100% 50%)' },
];

const vulnerabilityRanking = [
  { endpoint: '/api/auth/login', score: 92 },
  { endpoint: '/api/users', score: 78 },
  { endpoint: '/api/data/export', score: 71 },
  { endpoint: '/api/payments', score: 65 },
  { endpoint: '/api/admin/config', score: 58 },
  { endpoint: '/api/tokens', score: 42 },
];

const radarData = [
  { metric: 'SQL Injection', value: 85 },
  { metric: 'XSS', value: 45 },
  { metric: 'DDoS', value: 72 },
  { metric: 'Brute Force', value: 90 },
  { metric: 'Data Leak', value: 60 },
  { metric: 'Token Abuse', value: 78 },
];

const tooltipStyle = {
  backgroundColor: 'hsl(220 40% 8% / 0.95)',
  border: '1px solid hsl(220 25% 16%)',
  borderRadius: '8px',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono',
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Threat Analytics</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Data-driven security intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attack Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Attack Trend (30 Days)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attackTrend}>
              <defs>
                <linearGradient id="gAttacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0 85% 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0 85% 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(186 100% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(186 100% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="attacks" stroke="hsl(0 85% 55%)" fill="url(#gAttacks)" strokeWidth={2} />
              <Area type="monotone" dataKey="blocked" stroke="hsl(186 100% 50%)" fill="url(#gBlocked)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Risk Distribution</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {riskDistribution.map(r => (
                <div key={r.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-xs text-foreground">{r.name}</span>
                  <span className="text-xs font-mono text-muted-foreground ml-auto">{r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Vulnerability Ranking */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Endpoint Vulnerability</p>
          <div className="space-y-3">
            {vulnerabilityRanking.map((ep, i) => (
              <div key={ep.endpoint} className="flex items-center gap-3">
                <span className="text-xs font-mono text-foreground w-36 truncate">{ep.endpoint}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: ep.score > 75 ? 'hsl(0 85% 55%)' : ep.score > 50 ? 'hsl(45 95% 55%)' : 'hsl(186 100% 50%)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${ep.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-8 text-right">{ep.score}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Threat Radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Threat Radar</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220 25% 16%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(215 15% 50%)' }} />
              <Radar dataKey="value" stroke="hsl(186 100% 50%)" fill="hsl(186 100% 50%)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
