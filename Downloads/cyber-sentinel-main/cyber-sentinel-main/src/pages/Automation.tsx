import { motion } from 'framer-motion';
import { useSecurityStore } from '@/store/security-store';
import { Shield, Zap, AlertTriangle, Power } from 'lucide-react';

export default function Automation() {
  const { automationRules, toggleAutomation } = useSecurityStore();

  const typeIcon: Record<string, typeof Shield> = {
    'rate-limit': Shield,
    'token-revoke': Zap,
    'endpoint-lock': AlertTriangle,
    'ip-block': Power,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Autonomous Response</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Automated defense rule management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automationRules.map((rule, i) => {
          const Icon = typeIcon[rule.type] || Shield;
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-5 transition-all ${rule.enabled ? 'neon-border glow-cyan' : 'opacity-60'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.enabled ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{rule.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleAutomation(rule.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${rule.enabled ? 'bg-primary/30' : 'bg-secondary'}`}
                >
                  <motion.div
                    animate={{ x: rule.enabled ? 22 : 2 }}
                    className={`absolute top-1 w-4 h-4 rounded-full ${rule.enabled ? 'bg-primary' : 'bg-muted-foreground'}`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Triggered</p>
                  <p className="text-sm font-bold font-mono text-foreground">{rule.triggerCount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Last Active</p>
                  <p className="text-sm font-mono text-foreground">{rule.lastTriggered || 'Never'}</p>
                </div>
                <div className="ml-auto">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${rule.enabled ? 'border-primary/30 text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>
                    {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
