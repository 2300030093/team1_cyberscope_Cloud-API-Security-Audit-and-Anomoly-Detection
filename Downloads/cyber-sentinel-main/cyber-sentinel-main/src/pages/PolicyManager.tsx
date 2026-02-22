import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, Globe, Shield, Gauge, Network } from 'lucide-react';

interface PolicyRule {
  id: string;
  category: string;
  name: string;
  value: number | string | boolean;
  type: 'slider' | 'toggle' | 'select';
  min?: number;
  max?: number;
  options?: string[];
  description: string;
}

const initialPolicies: PolicyRule[] = [
  { id: 'P-001', category: 'Risk Thresholds', name: 'Auto-block threshold', value: 80, type: 'slider', min: 0, max: 100, description: 'Block IPs with risk score above this value' },
  { id: 'P-002', category: 'Risk Thresholds', name: 'Alert threshold', value: 50, type: 'slider', min: 0, max: 100, description: 'Trigger alerts for risk scores above this value' },
  { id: 'P-003', category: 'Risk Thresholds', name: 'Token revoke threshold', value: 90, type: 'slider', min: 0, max: 100, description: 'Auto-revoke tokens exceeding this risk score' },
  { id: 'P-004', category: 'IP Reputation', name: 'Block known bad IPs', value: true, type: 'toggle', description: 'Block IPs from threat intelligence feeds' },
  { id: 'P-005', category: 'IP Reputation', name: 'Require IP allowlist', value: false, type: 'toggle', description: 'Only allow requests from pre-approved IPs' },
  { id: 'P-006', category: 'Geo Blocking', name: 'Blocked regions', value: 'CN, RU, KP', type: 'select', options: ['None', 'CN, RU, KP', 'CN, RU, KP, IR', 'All non-US', 'Custom'], description: 'Block traffic from specific regions' },
  { id: 'P-007', category: 'Geo Blocking', name: 'Geo-anomaly detection', value: true, type: 'toggle', description: 'Flag tokens used from multiple countries' },
  { id: 'P-008', category: 'Rate Limiting', name: 'Global rate limit (req/min)', value: 100, type: 'slider', min: 10, max: 1000, description: 'Maximum requests per IP per minute' },
  { id: 'P-009', category: 'Rate Limiting', name: 'Auth endpoint limit (req/min)', value: 20, type: 'slider', min: 5, max: 200, description: 'Rate limit for authentication endpoints' },
  { id: 'P-010', category: 'Rate Limiting', name: 'Adaptive rate limiting', value: true, type: 'toggle', description: 'Dynamically adjust limits based on threat level' },
];

const categoryIcons: Record<string, typeof Shield> = {
  'Risk Thresholds': Gauge,
  'IP Reputation': Shield,
  'Geo Blocking': Globe,
  'Rate Limiting': Network,
};

export default function PolicyManager() {
  const [policies, setPolicies] = useState(initialPolicies);

  const updatePolicy = (id: string, value: number | string | boolean) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, value } : p));
  };

  const categories = [...new Set(policies.map(p => p.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Security Policies</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Zero-trust configuration center</p>
      </div>

      {categories.map((cat, ci) => {
        const Icon = categoryIcons[cat] || Settings;
        const catPolicies = policies.filter(p => p.category === cat);
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.1 }}
            className="glass-panel p-5"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">{cat}</h2>
            </div>

            <div className="space-y-5">
              {catPolicies.map(policy => (
                <div key={policy.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{policy.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{policy.description}</p>
                  </div>

                  <div className="shrink-0">
                    {policy.type === 'slider' && (
                      <div className="flex items-center gap-3 w-56">
                        <input
                          type="range"
                          min={policy.min}
                          max={policy.max}
                          value={policy.value as number}
                          onChange={e => updatePolicy(policy.id, Number(e.target.value))}
                          className="flex-1 accent-primary h-1 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                        />
                        <span className="text-xs font-mono text-primary w-10 text-right">{policy.value}</span>
                      </div>
                    )}

                    {policy.type === 'toggle' && (
                      <button
                        onClick={() => updatePolicy(policy.id, !(policy.value as boolean))}
                        className={`relative w-11 h-6 rounded-full transition-colors ${(policy.value as boolean) ? 'bg-primary/30' : 'bg-secondary'}`}
                      >
                        <motion.div
                          animate={{ x: (policy.value as boolean) ? 22 : 2 }}
                          className={`absolute top-1 w-4 h-4 rounded-full ${(policy.value as boolean) ? 'bg-primary' : 'bg-muted-foreground'}`}
                        />
                      </button>
                    )}

                    {policy.type === 'select' && (
                      <select
                        value={policy.value as string}
                        onChange={e => updatePolicy(policy.id, e.target.value)}
                        className="text-xs font-mono bg-secondary border border-border rounded-md px-3 py-1.5 text-foreground w-44"
                      >
                        {policy.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
