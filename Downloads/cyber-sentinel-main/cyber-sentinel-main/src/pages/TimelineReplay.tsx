import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, FastForward } from 'lucide-react';
import SeverityBadge from '@/components/SeverityBadge';
import { Severity } from '@/store/security-store';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TimelineEvent {
  id: string;
  time: string;
  seconds: number;
  title: string;
  description: string;
  severity: Severity;
  type: 'attack' | 'detection' | 'response' | 'escalation';
}

const events: TimelineEvent[] = [
  { id: 'E-01', time: '14:32:01', seconds: 0, title: 'Initial Probe', description: 'Reconnaissance scan from 192.168.45.12', severity: 'low', type: 'attack' },
  { id: 'E-02', time: '14:32:15', seconds: 14, title: 'Port Scan Detected', description: 'Sequential port scanning pattern identified', severity: 'medium', type: 'detection' },
  { id: 'E-03', time: '14:32:28', seconds: 27, title: 'SQLi Attempt #1', description: 'SQL injection on /api/users?id=1 OR 1=1', severity: 'high', type: 'attack' },
  { id: 'E-04', time: '14:32:30', seconds: 29, title: 'WAF Alert', description: 'Web Application Firewall triggered', severity: 'medium', type: 'detection' },
  { id: 'E-05', time: '14:32:45', seconds: 44, title: 'Rate Limit Applied', description: 'Auto rate-limit: 50 req/min → 5 req/min for source IP', severity: 'info', type: 'response' },
  { id: 'E-06', time: '14:33:01', seconds: 60, title: 'SQLi Attempt #2-#15', description: 'Rapid-fire injection attempts across 7 endpoints', severity: 'critical', type: 'attack' },
  { id: 'E-07', time: '14:33:05', seconds: 64, title: 'Threat Escalated', description: 'Risk score: 45 → 88. AI flagged coordinated attack', severity: 'critical', type: 'escalation' },
  { id: 'E-08', time: '14:33:08', seconds: 67, title: 'IP Blocked', description: 'Source IP auto-blocked. Token revoked.', severity: 'info', type: 'response' },
  { id: 'E-09', time: '14:33:20', seconds: 79, title: 'Secondary Attack Vector', description: 'New IP 10.0.14.88 from same subnet begins probing', severity: 'high', type: 'attack' },
  { id: 'E-10', time: '14:33:35', seconds: 94, title: 'Subnet Blocked', description: 'Entire /24 subnet blocked. Endpoint locked.', severity: 'info', type: 'response' },
  { id: 'E-11', time: '14:34:00', seconds: 119, title: 'Attack Mitigated', description: 'All attack vectors neutralized. Monitoring continues.', severity: 'low', type: 'response' },
];

const riskOverTime = events.map(e => ({
  time: e.time,
  risk: e.severity === 'critical' ? 90 : e.severity === 'high' ? 70 : e.severity === 'medium' ? 45 : 20,
}));

const typeColor: Record<string, string> = {
  attack: 'bg-destructive/15 text-destructive border-destructive/30',
  detection: 'bg-warning/15 text-warning border-warning/30',
  response: 'bg-primary/15 text-primary border-primary/30',
  escalation: 'bg-high/15 text-high border-high/30',
};

export default function TimelineReplay() {
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxSeconds = events[events.length - 1].seconds;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentIdx(prev => {
          if (prev >= events.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const progress = (events[currentIdx].seconds / maxSeconds) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Incident Timeline Replay</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">INC-001 · SQL Injection Attack Sequence</p>
      </div>

      {/* Risk Graph */}
      <div className="glass-panel p-5">
        <p className="text-sm font-semibold text-foreground mb-3">Risk Escalation</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={riskOverTime}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0 85% 55%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(0 85% 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'hsl(215 15% 50%)' }} axisLine={false} tickLine={false} />
            <Area type="monotone" dataKey="risk" stroke="hsl(0 85% 55%)" fill="url(#riskGrad)" strokeWidth={2} />
            <ReferenceLine x={events[currentIdx].time} stroke="hsl(186 100% 50%)" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Player Controls */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setPlaying(!playing)} className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={() => setCurrentIdx(Math.min(events.length - 1, currentIdx + 1))} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const targetSec = pct * maxSeconds;
              const closest = events.reduce((prev, curr) => Math.abs(curr.seconds - targetSec) < Math.abs(prev.seconds - targetSec) ? curr : prev);
              setCurrentIdx(events.indexOf(closest));
            }}>
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          {/* Speed */}
          <div className="flex items-center gap-2">
            <FastForward className="w-3.5 h-3.5 text-muted-foreground" />
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`text-[10px] font-mono px-2 py-1 rounded ${speed === s ? 'bg-primary/10 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-muted-foreground">{events[currentIdx].time}</span>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="space-y-1">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: i <= currentIdx ? 1 : 0.3, scale: i === currentIdx ? 1.01 : 1 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-4 p-4 rounded-lg transition-all ${i === currentIdx ? 'glass-panel neon-border glow-cyan' : i <= currentIdx ? 'glass-panel' : ''}`}
          >
            <div className="flex flex-col items-center gap-1 shrink-0 w-16">
              <span className="text-[10px] font-mono text-muted-foreground">{event.time}</span>
              <div className={`w-2.5 h-2.5 rounded-full ${i <= currentIdx ? 'bg-primary' : 'bg-secondary'} ${i === currentIdx ? 'animate-pulse' : ''}`} />
              {i < events.length - 1 && <div className={`w-px flex-1 ${i < currentIdx ? 'bg-primary/30' : 'bg-border'}`} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${typeColor[event.type]}`}>{event.type}</span>
                <SeverityBadge severity={event.severity} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
